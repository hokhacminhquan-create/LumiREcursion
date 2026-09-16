/**
 * Lumi:REcursion — Recast Post-Processing Pipeline Runner
 * Executes sequential post-processing passes with real-time token streaming,
 * live progress reporting, TTFT timeouts, and model/reasoning controls.
 */

import type { RecastPass, RecastPreset, RecastSettings, RecastDiffData, RecastProgress } from './types';
import { extractAndProtectBlocks, restoreProtectedBlocks, normalizeProtectionPlaceholders, type ProtectedContent } from './block-protection';
import { splitIntoChunks, reassembleChunks, type TextChunk } from './chunking';

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

  // Strip conversational preambles (e.g. "Here is the rewritten narrative:")
  cleaned = cleaned.replace(/^(?:Here (?:is|are) (?:the )?(?:rewritten|revised|edited|corrected|improved) (?:text|narrative|scene|prose|version)[^:\n]*:?\s*)+/i, '').trim();
  cleaned = cleaned.replace(/^(?:Certainly!?|Sure!?),?\s*(?:here (?:is|are) (?:the )?(?:rewritten|revised|edited|corrected|improved) (?:text|narrative|scene|prose|version)[^:\n]*:?\s*)+/i, '').trim();

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
  }) => void,
  protectedData?: ProtectedContent
): Promise<string> {
  if (!pass.enabled) return textToTransform;

  const tStart = Date.now();
  let systemPrompt = pass.prompt || 'You are an expert prose editor. Rewrite the text to improve flow, voice, and pacing.\nReturn only the rewritten text.';

  systemPrompt += `\n\n[CRITICAL CONTENT PRESERVATION & ANTI-TRUNCATION DIRECTIVES]
1. COMPLETE NARRATIVE REQUIRED: You MUST output the ENTIRE narrative text from start to finish. Never summarize, condense, truncate, or abridge the text.
2. FULL PROSE RETENTION: Retain all narration, environment descriptions, sensory details, character actions, internal monologue, and dialogue. Never output only dialogue lines, and never output only edited snippets.
3. PRESERVE EVERY PARAGRAPH: Match the length, structure, and depth of the input narrative. Every scene and event must remain intact.
4. TARGET ONLY AI-SLOP & STYLE: Focus your edits strictly on eliminating robotic phrasing, awkward repetition, and unnatural dialogue quirks while keeping 100% of the story substance.`;

  if (protectedData && protectedData.placeholders.size > 0) {
    systemPrompt += `\n\n[CRITICAL PRESERVATION NOTICE: The text contains preserved block tokens formatted as ⟦LR_PROTECT_N⟧ representing intact UI cards and embedded structures. You MUST keep all ⟦LR_PROTECT_N⟧ tokens verbatim in their original positions without deleting, altering, or translating them.]`;
  }
  systemPrompt += `\n\n[DIALOGUE PRESERVATION NOTICE: Preserve all character speech and dialogue styling tags verbatim (such as <font color="...">dialogue</font> or <span style="...">dialogue</span>). Do not strip, modify, or remove font color or dialogue styling tags.]`;

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

  // Max tokens & temperature (dynamically scale to prevent mid-story truncation for long text)
  const estimatedInputTokens = Math.ceil(textToTransform.length / 3.5);
  const baseMaxTokens = pass.maxTokens ?? settings?.maxTokens ?? 4096;
  const effectiveMaxTokens = Math.max(baseMaxTokens, Math.min(16384, Math.ceil(estimatedInputTokens * 1.5)));
  const temperature = pass.temperature ?? 0.3;

  // Timeouts:
  // 1. TTFT (Time-To-First-Token): Timeout waiting for model to start responding (reasoning or text)
  const ttftTimeoutSec = pass.ttftTimeoutSec ?? settings?.defaultTtftTimeoutSec ?? 30;

  // 2. Stream Inactivity Watchdog: Timeout based on seconds since the LAST token generated or thought.
  //    Resets continuously on every incoming token/chunk, so active long thinking or long writing NEVER aborts!
  const inactivityTimeoutSec = pass.passTimeoutSec ?? settings?.defaultPassTimeoutSec ?? 60;

  // 3. Absolute runaway ceiling: 1800s (30 minutes) to prevent infinite loops if an API never terminates
  const absoluteCeilingSec = 1800;

  const abortController = new AbortController();
  let hasReceivedFirstToken = false;
  let ttftTimer: any = null;
  let inactivityTimer: any = null;
  let ceilingTimer: any = null;
  let lastTokenTime = Date.now();

  const resetInactivityTimer = () => {
    lastTokenTime = Date.now();
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
    if (inactivityTimeoutSec > 0) {
      inactivityTimer = setTimeout(() => {
        const silentSec = Math.round((Date.now() - lastTokenTime) / 1000);
        abortController.abort(
          new Error(
            `Stream stall: no tokens or reasoning received for ${silentSec}s (inactivity limit: ${inactivityTimeoutSec}s). Stream stalled.`
          )
        );
      }, inactivityTimeoutSec * 1000);
    }
  };

  if (ttftTimeoutSec > 0) {
    ttftTimer = setTimeout(() => {
      if (!hasReceivedFirstToken) {
        abortController.abort(
          new Error(`First token timeout: model took more than ${ttftTimeoutSec}s to respond. Check your provider connection.`)
        );
      }
    }, ttftTimeoutSec * 1000);
  }

  if (absoluteCeilingSec > 0) {
    ceilingTimer = setTimeout(() => {
      abortController.abort(new Error(`Absolute maximum pass duration (${absoluteCeilingSec}s) reached.`));
    }, absoluteCeilingSec * 1000);
  }

  const genPayload: any = {
    type: 'raw',
    messages,
    connection_id: effectiveConnId,
    parameters: {
      temperature,
      max_tokens: effectiveMaxTokens
    },
    ...(effectiveModel ? { model: effectiveModel } : {}),
    ...(selectedConn?.provider ? { provider: selectedConn.provider } : {}),
    ...(reasoningParam ? { reasoning: reasoningParam } : {}),
    ...(userId ? { userId } : {}),
    signal: abortController.signal
  };

  console.log(
    `[Lumi:REcursion:Recast] Starting pass "${pass.name}" [conn: ${effectiveConnId}, model: ${effectiveModel || '(conn default)'}, reasoning: ${effectiveReasoning}, max_tokens: ${effectiveMaxTokens}, ttft_limit: ${ttftTimeoutSec}s]`
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

        // Reset stream inactivity watchdog on EVERY received token or reasoning chunk
        resetInactivityTimer();

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
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (ceilingTimer) clearTimeout(ceilingTimer);
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

  // Tag, HTML, Comment, and Metadata Block Protection
  const protectEnabled = settings.protectTagsAndHtml !== false;
  const protectedData = protectEnabled
    ? extractAndProtectBlocks(rawText)
    : {
        prefix: '',
        suffix: '',
        maskedBody: rawText,
        originalBody: rawText,
        placeholders: new Map<string, string>(),
        totalProtectedCount: 0
      };

  if (protectEnabled && protectedData.totalProtectedCount > 0) {
    console.log(
      `[Lumi:REcursion:Recast] Protected ${protectedData.totalProtectedCount} non-prose blocks (prefix: ${protectedData.prefix.length}c, suffix: ${protectedData.suffix.length}c, inline: ${protectedData.placeholders.size})`
    );
  }

  let currentText = protectedData.maskedBody;
  const snapshots: string[] = [rawText];
  const passNames: string[] = [];
  const errors: Array<{ passName: string; error: string }> = [];

  let successfulPasses = 0;

  for (let i = 0; i < enabledPasses.length; i++) {
    const pass = enabledPasses[i];
    passNames.push(pass.name);

    // 1. Split current text into scene/paragraph chunks if text is long (> ~7.5k chars)
    const chunks = splitIntoChunks(currentText, 6000);
    const isMultiChunk = chunks.length > 1;

    if (isMultiChunk) {
      console.log(
        `[Lumi:REcursion:Recast] Pass "${pass.name}": text length ${currentText.length} split into ${chunks.length} scene chunks.`
      );
    }

    const processedChunks: TextChunk[] = [];
    let passHasValidChunks = false;

    for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
      const chunk = chunks[cIdx];
      const chunkPassDisplayName = isMultiChunk
        ? `${pass.name} [Scene ${cIdx + 1}/${chunks.length}]`
        : pass.name;

      onProgress?.({
        active: true,
        currentPassIndex: i + 1,
        totalPasses: enabledPasses.length,
        currentPassName: chunkPassDisplayName,
        statusText: isMultiChunk
          ? `Pass ${i + 1}/${enabledPasses.length} • Scene ${cIdx + 1}/${chunks.length}: Connecting...`
          : `Connecting pass ${i + 1}/${enabledPasses.length}: ${pass.name}...`,
        phase: 'connecting',
        elapsedSec: (Date.now() - tStart) / 1000,
        thoughtTokens: 0,
        wordCount: 0,
        streamPreview: ''
      });

      try {
        let chunkOutput = await runSinglePass(
          sp,
          pass,
          chunk.text,
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
              currentPassName: chunkPassDisplayName,
              statusText: isMultiChunk
                ? `Pass ${i + 1}/${enabledPasses.length} • Scene ${cIdx + 1}/${chunks.length}: ${statusDesc}`
                : statusDesc,
              phase: streamInfo.phase,
              elapsedSec: totalElapsed,
              thoughtTokens: streamInfo.thoughtTokens,
              wordCount: streamInfo.wordCount,
              streamPreview: streamInfo.streamPreview
            });
          },
          protectedData
        );

        // TRUNCATION GUARD:
        // If the LLM returned a severely collapsed output (< 45% of original chunk length),
        // reject the truncated output and retain original chunk text so story is NEVER lost.
        const minAcceptableLength = Math.floor(chunk.text.length * 0.45);
        if (chunk.text.length > 300 && chunkOutput.length < minAcceptableLength) {
          console.warn(
            `[Lumi:REcursion:Recast] Truncation Guard triggered in pass "${pass.name}" chunk ${cIdx + 1}/${chunks.length}: ` +
            `Output length (${chunkOutput.length}) was < 45% of input length (${chunk.text.length}). Reverting to original chunk.`
          );
          sp?.toast?.warning?.(
            `[Recast] Pass "${pass.name}" attempted to condense Scene ${cIdx + 1}. Story content was preserved.`
          );
          chunkOutput = chunk.text;
        }

        processedChunks.push({
          text: chunkOutput,
          divider: chunk.divider
        });
        passHasValidChunks = true;
      } catch (err: any) {
        console.error(
          `[Lumi:REcursion:Recast] Error executing chunk ${cIdx + 1}/${chunks.length} of pass "${pass.name}":`,
          err
        );
        const errMsg = err?.message || String(err);
        errors.push({ passName: `${pass.name} (Scene ${cIdx + 1})`, error: errMsg });
        sp?.toast?.error?.(`Pass "${pass.name}" (Scene ${cIdx + 1}) failed: ${errMsg}`);
        // Retain original chunk text on error to guarantee zero story loss
        processedChunks.push(chunk);
      }
    }

    if (passHasValidChunks) {
      successfulPasses++;
    }

    // Reassemble all processed chunks back into coherent full text
    currentText = reassembleChunks(processedChunks);
    currentText = normalizeProtectionPlaceholders(currentText, protectedData.placeholders);
    snapshots.push(restoreProtectedBlocks(currentText, protectedData));
  }

  const totalLatencyMs = Date.now() - tStart;
  const finalTransformedText = restoreProtectedBlocks(currentText, protectedData);
  const hasTextChanges = finalTransformedText !== rawText;

  if (!hasTextChanges && errors.length > 0) {
    throw new Error(
      `All passes failed to transform text: ${errors.map((e) => `[${e.passName}]: ${e.error}`).join('; ')}`
    );
  }

  if (errors.length > 0 && hasTextChanges) {
    sp?.toast?.warning?.(
      `Recast completed with partial edits (${errors.length} scene/pass warning${errors.length === 1 ? '' : 's'}).`
    );
  }

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
    transformedText: finalTransformedText,
    snapshots,
    passNames,
    totalLatencyMs
  };
}
