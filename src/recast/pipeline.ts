/**
 * Lumi:REcursion — Recast Post-Processing Pipeline Runner
 * Executes sequential post-processing passes using Lumiverse Spindle APIs
 */

import type { RecastPass, RecastPreset, RecastSettings, RecastDiffData, RecastProgress } from './types';

function cleanModelOutput(text: string): string {
  if (!text) return '';

  let cleaned = text.trim();

  // Strip <think>...</think> reasoning blocks from DeepSeek-R1 / QwQ or similar models
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();

  // Strip echoing <text_to_transform> tags if the model repeated them
  const matchWrapped = cleaned.match(/<text_to_transform>([\s\S]*?)<\/text_to_transform>/i);
  if (matchWrapped && matchWrapped[1]) {
    cleaned = matchWrapped[1].trim();
  } else {
    cleaned = cleaned.replace(/<\/?text_to_transform>/gi, '').trim();
  }

  // Strip wrapping markdown code blocks if the model enclosed the entire reply
  if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\n?/, '').replace(/\n?```$/, '').trim();
  }

  return cleaned;
}

export async function runSinglePass(
  sp: any,
  pass: RecastPass,
  textToTransform: string,
  chatId: string,
  targetMessageId?: string,
  userId?: string,
  defaultConnectionId?: string
): Promise<string> {
  if (!pass.enabled) return textToTransform;

  let systemPrompt = pass.prompt.trim();

  // 1. Retrieve Character Details if requested
  let charCardXml = '';
  if (pass.includeCharCard && sp?.characters?.get) {
    try {
      let charId: string | null = null;
      if (chatId && sp?.chats?.get) {
        const chat = await sp.chats.get(chatId, userId);
        charId = chat?.character_id || chat?.characterId || null;
      }
      if (!charId && sp?.chats?.getActive) {
        const activeChat = await sp.chats.getActive(userId);
        charId = activeChat?.character_id || activeChat?.characterId || null;
      }

      if (charId) {
        const char = await sp.characters.get(charId, userId);
        if (char) {
          const lines = [
            char.name ? `<name>${char.name}</name>` : '',
            char.description ? `<description>${char.description}</description>` : '',
            char.personality ? `<personality>${char.personality}</personality>` : '',
            char.scenario ? `<scenario>${char.scenario}</scenario>` : '',
            char.mes_example ? `<example_dialogue>\n${char.mes_example}\n</example_dialogue>` : ''
          ].filter(Boolean);

          if (lines.length > 0) {
            charCardXml = `<characters>\n${lines.join('\n')}\n</characters>`;
          }
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion:Recast] Failed to retrieve character info for pass:', err);
    }
  }

  // 2. Retrieve Scene Context from Chat History if requested
  let sceneContextXml = '';
  if (pass.includeSceneContext && pass.contextLength > 0 && sp?.chat?.getMessages && chatId) {
    try {
      const allMessages = await sp.chat.getMessages(chatId);
      if (Array.isArray(allMessages) && allMessages.length > 0) {
        let cutoffIndex = allMessages.length;
        if (targetMessageId) {
          const foundIdx = allMessages.findIndex((m: any) => m.id === targetMessageId);
          if (foundIdx !== -1) {
            cutoffIndex = foundIdx;
          }
        }

        const historySlice = allMessages.slice(0, cutoffIndex).slice(-pass.contextLength);
        if (historySlice.length > 0) {
          const lines = historySlice.map((m: any) => {
            const roleName = m.name || (m.role === 'user' || m.is_user ? 'User' : 'Assistant');
            const content = m.content || '';
            return `${roleName}: ${content}`;
          });
          sceneContextXml = `<scene_context>\n${lines.join('\n')}\n</scene_context>`;
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion:Recast] Failed to retrieve chat history for pass:', err);
    }
  }

  // 3. World Info Injection if requested
  if (pass.injectWorldInfo && sp?.world_books) {
    try {
      let wbText = '';
      if (sp.world_books.list) {
        const books = await sp.world_books.list(userId ? { userId } : undefined);
        const bookList = Array.isArray(books) ? books : books?.data || [];
        if (bookList.length > 0) {
          const firstBook = await sp.world_books.get(bookList[0].id, userId);
          if (firstBook && Array.isArray(firstBook.entries)) {
            const snippet = firstBook.entries
              .filter((e: any) => e.enabled !== false)
              .slice(0, 5)
              .map((e: any) => `[${e.keys?.join(', ') || 'Entry'}]: ${e.content}`)
              .join('\n');
            if (snippet) wbText = snippet;
          }
        }
      }
      if (wbText) {
        systemPrompt += `\n\n<world_info>\n${wbText}\n</world_info>`;
      }
    } catch (err) {
      console.warn('[Lumi:REcursion:Recast] World info injection skipped:', err);
    }
  }

  // 4. Build User Prompt
  const userSections: string[] = [];
  if (charCardXml) userSections.push(charCardXml);
  if (sceneContextXml) userSections.push(sceneContextXml);
  userSections.push(`<text_to_transform>\n${textToTransform}\n</text_to_transform>`);

  const userPrompt = userSections.join('\n\n');

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  if (pass.prefill && pass.prefill.trim()) {
    messages.push({
      role: pass.prefillRole || 'assistant',
      content: pass.prefill.trim()
    });
  }

  // 5. Resolve Connection Profile & Model
  let selectedConn: any = null;
  if (sp?.connections?.list) {
    try {
      const conns = await sp.connections.list(userId);
      const connList = Array.isArray(conns) ? conns : conns?.data || [];
      if (connList.length > 0) {
        if (pass.connection) {
          selectedConn = connList.find((c: any) => c.id === pass.connection);
        }
        if (!selectedConn && defaultConnectionId) {
          selectedConn = connList.find((c: any) => c.id === defaultConnectionId);
        }
        if (!selectedConn) {
          selectedConn = connList.find((c: any) => c.is_default);
        }
        if (!selectedConn) {
          selectedConn = connList[0];
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion:Recast] Failed to query connection profiles:', err);
    }
  }

  const genPayload: any = {
    type: 'raw',
    messages,
    parameters: {
      temperature: 0.3
    },
    ...(userId ? { userId } : {})
  };

  if (selectedConn) {
    genPayload.connection_id = selectedConn.id;
    if (selectedConn.model) {
      genPayload.model = selectedConn.model;
    }
    if (selectedConn.provider) {
      genPayload.provider = selectedConn.provider;
    }
  } else if (pass.connection) {
    genPayload.connection_id = pass.connection;
  } else if (defaultConnectionId) {
    genPayload.connection_id = defaultConnectionId;
  } else {
    throw new Error('No AI connection found. Please configure a connection profile in Lumiverse.');
  }

  console.log(
    `[Lumi:REcursion:Recast] Pass "${pass.name}" dispatching to connection:`,
    genPayload.connection_id,
    'model:',
    genPayload.model || '(default)'
  );

  const rawRes = await sp.generate.raw(genPayload);

  let outputText = '';
  if (typeof rawRes === 'string') {
    outputText = rawRes;
  } else if (rawRes && typeof rawRes === 'object') {
    outputText = rawRes.content || rawRes.text || rawRes.message?.content || '';
  }

  const cleaned = cleanModelOutput(outputText);
  return cleaned && cleaned.length > 0 ? cleaned : textToTransform;
}

export async function runRecastPipeline(
  sp: any,
  options: {
    chatId: string;
    messageId: string;
    rawText: string;
    settings: RecastSettings;
    defaultConnectionId?: string;
    userId?: string;
    onProgress?: (progress: RecastProgress) => void;
  }
): Promise<RecastDiffData | null> {
  const { chatId, messageId, rawText, settings, defaultConnectionId, userId, onProgress } = options;

  if (!rawText || rawText.trim().length === 0) return null;

  const activePreset =
    settings.presets.find((p) => p.id === settings.activePresetId) || settings.presets[0];
  if (!activePreset) {
    throw new Error('No active Recast preset found.');
  }

  const enabledPasses = activePreset.passes.filter((p) => p.enabled);
  if (enabledPasses.length === 0) {
    throw new Error('All passes in the active Recast preset are disabled. Please enable at least one pass.');
  }

  const tStart = Date.now();
  let currentText = rawText;
  const snapshots: string[] = [rawText];
  const passNames: string[] = [];
  const errors: Array<{ passName: string; error: string }> = [];

  for (let i = 0; i < enabledPasses.length; i++) {
    const pass = enabledPasses[i];
    passNames.push(pass.name);

    onProgress?.({
      active: true,
      currentPassIndex: i + 1,
      totalPasses: enabledPasses.length,
      currentPassName: pass.name,
      statusText: `Running pass ${i + 1}/${enabledPasses.length}: ${pass.name}...`
    });

    try {
      const passOutput = await runSinglePass(
        sp,
        pass,
        currentText,
        chatId,
        messageId,
        userId,
        defaultConnectionId
      );
      currentText = passOutput;
      snapshots.push(currentText);
    } catch (err: any) {
      console.error(`[Lumi:REcursion:Recast] Error executing pass "${pass.name}":`, err);
      const errMsg = err?.message || String(err);
      errors.push({ passName: pass.name, error: errMsg });
      sp?.toast?.error?.(`Pass "${pass.name}" failed: ${errMsg}`);
      snapshots.push(currentText);
    }
  }

  if (errors.length > 0 && errors.length === enabledPasses.length) {
    throw new Error(
      `All passes failed. ${errors.map((e) => `[${e.passName}]: ${e.error}`).join('; ')}`
    );
  }

  const totalLatencyMs = Date.now() - tStart;

  onProgress?.({
    active: false,
    currentPassIndex: enabledPasses.length,
    totalPasses: enabledPasses.length,
    currentPassName: '',
    statusText: `Complete in ${totalLatencyMs}ms`
  });

  return {
    chatId,
    messageId,
    originalText: rawText,
    transformedText: currentText,
    snapshots,
    passNames,
    totalLatencyMs
  };
}
