/**
 * Lumi:REcursion — Recast Post-Processing Pipeline Runner
 * Executes sequential post-processing passes with real-time token streaming,
 * live progress reporting, TTFT timeouts, and model/reasoning controls.
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
  settings?: RecastSettings,
  defaultConnectionId?: string,
  onStreamUpdate?: (info: {
    phase: 'connecting' | 'thinking' | 'generating';
    thoughtTokens: number;
    wordCount: number;
    elapsedSec: number;
    streamPreview: string;
  }) => void
): Promise<string> {
  if (!pass.enabled) return textToTransform;

  const tStart = Date.now();
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

  // 5. Connection, Model & Reasoning Resolution
  let selectedConn: any = null;
  const targetConnId = pass.connection || settings?.defaultConnectionId || defaultConnectionId;

  if (sp?.connections?.list) {
    try {
      const conns = await sp.connections.list(userId);
      const connList = Array.isArray(conns) ? conns : conns?.data || [];
      if (connList.length > 0) {
        if (targetConnId) {
          selectedConn = connList.find((c: any) => c.id === targetConnId);
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

  const effectiveConnId = selectedConn?.id || targetConnId;
  if (!effectiveConnId) {
    throw new Error('No AI connection profile configured. Please add a connection in Lumiverse.');
  }

  // Model override
  const effectiveModel =
    (pass.modelOverride && pass.modelOverride.trim()) ||
    (settings?.defaultModelOverride && settings.defaultModelOverride.trim()) ||
    selectedConn?.model ||
    '';

  // Reasoning override (turn off reasoning for 5x-10x faster prose generation)
  const effectiveReasoning = pass.reasoningEffort || settings?.defaultReasoningEffort || 'off';
  let reasoningParam: any = undefined;
  if (effectiveReasoning === 'off') {
    reasoningParam = { source: 'off', apiReasoning: false };
  } else if (effectiveReasoning !== 'inherit') {
    reasoningParam = { source: 'custom', apiReasoning: true, effort: effectiveReasoning };
  }

  // Max tokens & temperature
  const maxTokens = pass.maxTokens ?? settings?.maxTokens ?? 1000;
  const temperature = pass.temperature ?? 0.3;

  // Timeouts
  const ttftTimeoutSec = pass.ttftTimeoutSec ?? settings?.defaultTtftTimeoutSec ?? 20;
  const passTimeoutSec = pass.passTimeoutSec ?? settings?.defaultPassTimeoutSec ?? 60;

  const abortController = new AbortController();
  let hasReceivedFirstToken = false;
  let ttftTimer: any = null;
  let passTimer: any = null;

  if (ttftTimeoutSec > 0) {
    ttftTimer = setTimeout(() => {
      if (!hasReceivedFirstToken) {
        abortController.abort(
          new Error(`First token timeout: model took more than ${ttftTimeoutSec}s to respond. Check your provider latency or switch model.`)
        );
      }
    }, ttftTimeoutSec * 1000);
  }

  if (passTimeoutSec > 0) {
    passTimer = setTimeout(() => {
      abortController.abort(new Error(`Pass timeout: exceeded ${passTimeoutSec}s total duration.`));
    }, passTimeoutSec * 1000);
  }

  const genPayload: any = {
    type: 'raw',
    messages,
    connection_id: effectiveConnId,
    parameters: {
      temperature,
      max_tokens: maxTokens
    },
    ...(effectiveModel ? { model: effectiveModel } : {}),
    ...(selectedConn?.provider ? { provider: selectedConn.provider } : {}),
    ...(reasoningParam ? { reasoning: reasoningParam } : {}),
    ...(userId ? { userId } : {}),
    signal: abortController.signal
  };

  console.log(
    `[Lumi:REcursion:Recast] Starting pass "${pass.name}" [conn: ${effectiveConnId}, model: ${effectiveModel || '(conn default)'}, reasoning: ${effectiveReasoning}, max_tokens: ${maxTokens}, ttft_limit: ${ttftTimeoutSec}s]`
  );

  let outputText = '';
  let thoughtTokens = 0;
  let wordCount = 0;
  let currentPhase: 'connecting' | 'thinking' | 'generating' = 'connecting';
  let lastProgressReport = 0;

  const reportStream = (force = false) => {
    const now = Date.now();
    if (!force && now - lastProgressReport < 120) return;
    lastProgressReport = now;
    const elapsedSec = (now - tStart) / 1000;
    const preview = outputText.slice(-80).replace(/\s+/g, ' ').trim();
    onStreamUpdate?.({
      phase: currentPhase,
      thoughtTokens,
      wordCount,
      elapsedSec,
      streamPreview: preview
    });
  };

  reportStream(true);

  try {
    if (typeof sp?.generate?.rawStream === 'function') {
      const stream = sp.generate.rawStream(genPayload);
      for await (const chunk of stream) {
        if (!hasReceivedFirstToken) {
          hasReceivedFirstToken = true;
          if (ttftTimer) {
            clearTimeout(ttftTimer);
            ttftTimer = null;
          }
        }

        if (chunk.type === 'reasoning' || chunk.reasoning) {
          thoughtTokens++;
          currentPhase = 'thinking';
          reportStream();
        } else if (chunk.type === 'token' || chunk.token) {
          const t = chunk.token || '';
          outputText += t;
          currentPhase = 'generating';
          wordCount = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;
          reportStream();
        } else if (chunk.type === 'done') {
          if (chunk.content && !outputText) {
            outputText = chunk.content;
          }
        }
      }
    } else {
      // Fallback if rawStream is not available
      const rawRes = await sp.generate.raw(genPayload);
      if (typeof rawRes === 'string') {
        outputText = rawRes;
      } else if (rawRes && typeof rawRes === 'object') {
        outputText = rawRes.content || rawRes.text || rawRes.message?.content || '';
      }
    }
  } catch (err: any) {
    const isAborted = abortController.signal.aborted || err?.name === 'AbortError';
    const abortReason = (abortController.signal.reason as any)?.message || err?.message || String(err);
    throw new Error(isAborted ? abortReason : err?.message || String(err));
  } finally {
    if (ttftTimer) clearTimeout(ttftTimer);
    if (passTimer) clearTimeout(passTimer);
  }

  reportStream(true);

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
      statusText: `Connecting pass ${i + 1}/${enabledPasses.length}: ${pass.name}...`,
      phase: 'connecting',
      elapsedSec: (Date.now() - tStart) / 1000,
      thoughtTokens: 0,
      wordCount: 0,
      streamPreview: ''
    });

    try {
      const passOutput = await runSinglePass(
        sp,
        pass,
        currentText,
        chatId,
        messageId,
        userId,
        settings,
        defaultConnectionId,
        (streamInfo) => {
          const totalElapsed = (Date.now() - tStart) / 1000;
          let statusDesc = `[${streamInfo.elapsedSec.toFixed(1)}s] `;
          if (streamInfo.phase === 'thinking') {
            statusDesc += `Thinking (💭 ${streamInfo.thoughtTokens} tokens)...`;
          } else if (streamInfo.phase === 'generating') {
            statusDesc += `Generating prose (📝 ${streamInfo.wordCount} words)...`;
          } else {
            statusDesc += `Connecting to provider...`;
          }

          onProgress?.({
            active: true,
            currentPassIndex: i + 1,
            totalPasses: enabledPasses.length,
            currentPassName: pass.name,
            statusText: statusDesc,
            phase: streamInfo.phase,
            elapsedSec: totalElapsed,
            thoughtTokens: streamInfo.thoughtTokens,
            wordCount: streamInfo.wordCount,
            streamPreview: streamInfo.streamPreview
          });
        }
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
    statusText: `Complete in ${(totalLatencyMs / 1000).toFixed(1)}s`,
    phase: 'done',
    elapsedSec: totalLatencyMs / 1000
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
