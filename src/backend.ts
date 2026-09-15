/**
 * Lumi:REcursion — Backend
 * Scene reasoning, turn-bound card system & parallel card evaluation for Lumiverse
 * Supports 3 Card Source Modes:
 *   - Option A: World Book Mode (reads entries from a Lumiverse World Book)
 *   - Option B: Character Extension Payload Mode (reads from character.extensions.lumi_recursion)
 *   - Local Decks Mode (reads from extension's deck manager)
 */

import type {
  RecursionSettings,
  DeckDefinition,
  TurnBrief,
  EvaluatedCard,
  CardOmission,
  CardDefinition,
  RunProgressState,
  HeroPixelItem,
  FrontendToBackendMessage,
  RecastSettings,
  RecastPreset,
  RecastProgress,
  RecastDiffData
} from './types';
import { StorageManager, DEFAULT_SETTINGS } from './storage';
import {
  formatRecentContext,
  buildSingleCardPrompt,
  buildFusedBundlePrompt,
  extractJsonFromResponse,
  assemblePromptPacket
} from './prompt/composer';
import { DEFAULT_DECK_ID } from './cards/defaults';
import {
  listAvailableWorldBooks,
  createOrSyncRecursionWorldBook,
  readCardsFromWorldBook,
  listWorldBookCardEntries,
  saveWorldBookEntry,
  deleteWorldBookEntry,
  importWorldBookCards,
  DEFAULT_WORLDBOOK_NAME
} from './cards/worldbook';
import {
  getCharacterPayloadStatus,
  initCharacterCardPayload,
  readCardsFromCharacter,
  updateCharacterCardState,
  saveCharacterCard,
  deleteCharacterCard,
  importCharacterPayload
} from './cards/character-payload';
import {
  DEFAULT_RECAST_SETTINGS,
  DEFAULT_RECAST_PRESET,
  PASS_GROUNDING,
  PASS_VALIDATOR,
  PASS_PROSE
} from './recast/defaults';
import { runRecastPipeline } from './recast/pipeline';

// Declare ambient spindle object provided by Lumiverse Spindle host
declare const spindle: any;
const sp = typeof spindle !== 'undefined' ? spindle : null;

// ─── Module State ────────────────────────────────────────────────────────────

let settings: RecursionSettings = { ...DEFAULT_SETTINGS };
let decks: Record<string, DeckDefinition> = {};
let activeDeckId: string = DEFAULT_DECK_ID;
let lastBrief: TurnBrief | null = null;
let currentProgress: RunProgressState = {
  runId: '',
  active: false,
  pipeline: 'segmented',
  phase: 'idle',
  pixels: []
};

// Recast post-processing state
let recastSettings: RecastSettings = { ...DEFAULT_RECAST_SETTINGS };
let recastProgress: RecastProgress | null = null;
let isRecastRunning = false;

// In-memory cache for turn evaluations keyed by context hash
interface CachedTurn {
  hash: string;
  cards: EvaluatedCard[];
  injectedPacket: string;
  brief: TurnBrief;
  timestamp: number;
}
let cachedTurn: CachedTurn | null = null;

let storage: StorageManager;

// ─── User Session Tracking (Operator-Scoped Spindle Support) ──────────────────
let activeUserId: string | null = null;
const chatUserMap = new Map<string, string>();

export function rememberUser(userId?: string | null, chatId?: string | null) {
  if (userId && typeof userId === 'string' && userId.trim()) {
    activeUserId = userId.trim();
    if (chatId) chatUserMap.set(chatId, activeUserId);
  } else if (chatId && chatUserMap.has(chatId)) {
    activeUserId = chatUserMap.get(chatId)!;
  }
}

export function getEffectiveUserId(chatId?: string | null): string | undefined {
  if (chatId && chatUserMap.has(chatId)) {
    return chatUserMap.get(chatId);
  }
  return activeUserId || undefined;
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function broadcastProgress(progress: RunProgressState) {
  currentProgress = progress;
  if (sp?.sendToFrontend) {
    sp.sendToFrontend({ type: 'PROGRESS', progress });
  }
}

async function listConnections(userId?: string): Promise<Array<{ id: string; name: string; provider?: string; model?: string; is_default?: boolean }>> {
  try {
    if (sp?.connections?.list) {
      const uId = userId || getEffectiveUserId();
      const list = await sp.connections.list(uId);
      if (Array.isArray(list)) {
        return list.map((c: any) => ({
          id: c.id,
          name: c.name || c.id,
          provider: c.provider,
          model: c.model,
          is_default: Boolean(c.is_default)
        }));
      }
    }
  } catch (err) {
    console.warn('[Lumi:REcursion] Failed to list connection profiles:', err);
  }
  return [];
}

async function resolveConnectionId(profileId: string, userId?: string): Promise<string | undefined> {
  if (profileId) return profileId;
  const conns = await listConnections(userId);
  const def = conns.find((c) => c.is_default) || conns[0];
  return def ? def.id : undefined;
}

async function getActiveCharacterId(userId?: string): Promise<string | null> {
  try {
    if (sp?.chats?.getActive) {
      const uId = userId || getEffectiveUserId();
      const chat = await sp.chats.getActive(uId);
      return chat?.characterId || chat?.character_id || null;
    }
  } catch {}
  return null;
}

/**
 * Resolves the candidate cards for this turn based on the selected cardSourceMode:
 * - 'world_book': reads entries from attached or configured World Book
 * - 'character_ext': reads from character.extensions.lumi_recursion
 * - 'local_deck': reads from local deck manager (decks.json)
 */
async function resolveTurnCards(
  context: any
): Promise<{ selectedCards: CardDefinition[]; omittedCards: CardOmission[] }> {
  const uId = context?.userId || getEffectiveUserId(context?.chatId);
  rememberUser(context?.userId, context?.chatId);

  let candidateCards: CardDefinition[] = [];

  // ── Option A: World Book Mode ──
  if (settings.cardSourceMode === 'world_book') {
    let wbId = settings.worldBookId;
    if (!wbId && context?.characterId && sp?.characters?.get) {
      try {
        const char = await sp.characters.get(context.characterId, uId);
        if (char && Array.isArray(char.world_book_ids)) {
          const wbs = await listAvailableWorldBooks(sp, uId);
          const matched = wbs.find(
            (w) =>
              char.world_book_ids.includes(w.id) &&
              (w.name.includes('Recursion') || w.name.includes('Lumi:REcursion'))
          );
          if (matched) wbId = matched.id;
        }
      } catch {}
    }
    if (!wbId) {
      const wbs = await listAvailableWorldBooks(sp, uId);
      const matched = wbs.find(
        (w) => w.name === DEFAULT_WORLDBOOK_NAME || w.name.includes('Recursion Cards')
      );
      if (matched) wbId = matched.id;
    }

    if (wbId) {
      candidateCards = await readCardsFromWorldBook(sp, wbId, uId);
      console.log(`[Lumi:REcursion] Loaded ${candidateCards.length} cards from World Book (${wbId})`);
    }
  }
  // ── Option B: Character Extension Payload Mode ──
  else if (settings.cardSourceMode === 'character_ext') {
    let charId = context?.characterId;
    if (!charId) {
      charId = await getActiveCharacterId(uId);
    }

    if (charId) {
      candidateCards = await readCardsFromCharacter(sp, charId, uId);
      console.log(`[Lumi:REcursion] Loaded ${candidateCards.length} cards from Character Payload (${charId})`);
    }
  }

  // Fallback to local deck if mode didn't return cards (or if local_deck mode is selected)
  if (!candidateCards.length) {
    const currentDeck = decks[activeDeckId] || decks[DEFAULT_DECK_ID];
    if (currentDeck && currentDeck.cards) {
      candidateCards = Object.values(currentDeck.cards);
    }
  }

  // Filter out 'off' cards
  const eligible = candidateCards.filter((c) => c.selectionState !== 'off');
  const priorityCards = eligible.filter((c) => c.selectionState === 'priority');
  const normalCards = eligible.filter((c) => c.selectionState === 'active');

  const selectedCards = [...priorityCards, ...normalCards].slice(0, settings.maxCards);
  const omittedCards: CardOmission[] = [...priorityCards, ...normalCards]
    .slice(settings.maxCards)
    .map((c) => ({
      cardId: c.id,
      family: c.builtinFamily || c.name,
      reason: 'max-cards'
    }));

  return { selectedCards, omittedCards };
}

// ─── Main Backend Initialization ─────────────────────────────────────────────

;(async () => {
  if (!sp) {
    console.error('[Lumi:REcursion] Spindle API not available');
    return;
  }

  storage = new StorageManager(sp);
  settings = await storage.loadSettings();
  const deckData = await storage.loadDecks();
  decks = deckData.decks;
  activeDeckId = deckData.activeDeckId;
  lastBrief = await storage.loadLastBrief();
  recastSettings = await storage.loadRecastSettings();

  console.log(
    '[Lumi:REcursion] Initialized with source mode:',
    settings.cardSourceMode,
    'Active deck:',
    activeDeckId,
    'Enabled:',
    settings.enabled,
    'Recast Enabled:',
    recastSettings.enabled
  );

  // ── Post-Generation Recast Hook ────────────────────────────────────────────
  if (typeof sp.on === 'function') {
    sp.on('GENERATION_ENDED', async (payload: any) => {
      if (!recastSettings.enabled || !recastSettings.autoRun) return;
      if (!payload || payload.error) return;
      if (!payload.content || payload.content.trim().length < (recastSettings.minChars || 20)) return;
      if (!payload.chatId || !payload.messageId) return;
      if (isRecastRunning) return;

      isRecastRunning = true;
      try {
        const uId = getEffectiveUserId(payload.chatId);
        const diff = await runRecastPipeline(sp, {
          chatId: payload.chatId,
          messageId: payload.messageId,
          rawText: payload.content,
          settings: recastSettings,
          userId: uId,
          onProgress: (prog) => {
            recastProgress = prog;
            sp.sendToFrontend?.({ type: 'RECAST_PROGRESS', progress: prog });
          }
        });

        if (diff && diff.transformedText && diff.transformedText !== diff.originalText) {
          if (recastSettings.applyMode === 'replace') {
            await sp.chat.updateMessage(diff.chatId, diff.messageId, { content: diff.transformedText });
            sp.toast?.success?.('✨ Recast post-processing applied in-place');
            sp.sendToFrontend?.({
              type: 'RECAST_APPLIED',
              chatId: diff.chatId,
              messageId: diff.messageId,
              mode: 'replace'
            });
          } else if (recastSettings.applyMode === 'swipe') {
            const allMsgs = await sp.chat.getMessages(diff.chatId);
            const msg = allMsgs.find((m: any) => m.id === diff.messageId);
            const existingSwipes =
              Array.isArray(msg?.swipes) && msg.swipes.length > 0 ? msg.swipes : [diff.originalText];
            const newSwipes = [...existingSwipes, diff.transformedText];
            const newSwipeId = newSwipes.length - 1;
            await sp.chat.updateMessage(diff.chatId, diff.messageId, {
              swipes: newSwipes,
              swipe_id: newSwipeId
            });
            sp.toast?.success?.('✨ Recast post-processing added as new swipe');
            sp.sendToFrontend?.({
              type: 'RECAST_APPLIED',
              chatId: diff.chatId,
              messageId: diff.messageId,
              mode: 'swipe'
            });
          } else {
            // 'diff' mode: send to frontend to show the interactive comparison modal
            sp.sendToFrontend?.({ type: 'RECAST_DIFF_READY', diff });
          }
        }
      } catch (err: any) {
        console.error('[Lumi:REcursion:Recast] Error during auto-recast:', err);
      } finally {
        isRecastRunning = false;
        recastProgress = null;
        sp.sendToFrontend?.({
          type: 'RECAST_PROGRESS',
          progress: {
            active: false,
            currentPassIndex: 0,
            totalPasses: 0,
            currentPassName: '',
            statusText: ''
          }
        });
      }
    });
  }

  // ── 1. Interceptor ─────────────────────────────────────────────────────────
  // Runs before generation, modifies prompt by injecting the compiled scene reasoning packet
  sp.registerInterceptor(
    async (messages: any[], context: any) => {
      if (!settings.enabled) {
        return messages;
      }

      // Check manual mode
      if (settings.mode === 'manual' && !settings.manualTurnArmed) {
        return messages;
      }
      settings.manualTurnArmed = false;

      // Resolve turn cards dynamically from World Book, Character, or Local Deck
      const { selectedCards, omittedCards } = await resolveTurnCards(context);

      if (!selectedCards.length) {
        return messages;
      }

      const formattedContext = formatRecentContext(messages, settings.contextWindow);
      const turnHash = simpleHash(formattedContext + selectedCards.map((c) => c.id).join(','));

      // Check cache reuse
      if (cachedTurn && cachedTurn.hash === turnHash && Date.now() - cachedTurn.timestamp < 120000) {
        console.log('[Lumi:REcursion] Reusing cached turn reasoning for identical context');
        const pixels: HeroPixelItem[] = cachedTurn.cards.map((c) => ({
          id: c.cardId,
          name: c.name,
          state: 'cached',
          latencyMs: c.latencyMs
        }));

        broadcastProgress({
          runId: `run-${Date.now()}`,
          active: false,
          pipeline: settings.pipeline,
          phase: 'done',
          pixels,
          currentStepText: `Reused ${cachedTurn.cards.length} cached scene cards.`
        });

        const injectedMessage = {
          role: 'system',
          content: cachedTurn.injectedPacket
        };
        const updated = [...messages, injectedMessage];
        return {
          messages: updated,
          breakdown: [
            { messageIndex: updated.length - 1, name: 'Lumi:REcursion Guidance (Cached)' }
          ]
        };
      }

      // ── Execute Reasoning Pipeline ──
      const runId = `run-${Date.now()}`;
      const turnUserId = context?.userId || getEffectiveUserId(context?.chatId);
      const connId = await resolveConnectionId(settings.connectionProfileId, turnUserId);

      // Initialize pixel indicators to 'running' (cyan)
      const initialPixels: HeroPixelItem[] = selectedCards.map((c) => ({
        id: c.id,
        name: c.name,
        state: 'running'
      }));

      broadcastProgress({
        runId,
        active: true,
        pipeline: settings.pipeline,
        phase: 'running',
        pixels: initialPixels,
        currentStepText: `Evaluating ${selectedCards.length} scene cards in parallel (${settings.cardSourceMode})...`
      });

      const tStart = Date.now();
      let evaluatedCards: EvaluatedCard[] = [];

      if (settings.pipeline === 'segmented') {
        // ── PARALLEL SEGMENTED CALLING (Lumiverse Superpower!) ──
        // Fires all card prompts concurrently via Promise.all
        const promises = selectedCards.map(async (card, idx) => {
          const t0 = Date.now();
          try {
            const prompt = buildSingleCardPrompt(card, formattedContext, settings.storyForm);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), settings.cardTimeoutSec * 1000);
            const combinedSignal = context?.signal
              ? AbortSignal.any([context.signal, controller.signal])
              : controller.signal;

            const res = (await sp.generate.raw({
              type: 'raw',
              messages: [{ role: 'user', content: prompt }],
              connection_id: connId,
              parameters: { temperature: 0.25, max_tokens: 280 },
              ...(turnUserId ? { userId: turnUserId } : {}),
              signal: combinedSignal
            })) as { content?: string };

            clearTimeout(timeoutId);
            const parsed = extractJsonFromResponse(res?.content);

            const promptText =
              typeof parsed?.promptText === 'string' && parsed.promptText.trim()
                ? parsed.promptText.trim()
                : `Maintain active scene awareness for ${card.name}.`;

            const evidenceRefs = Array.isArray(parsed?.evidenceRefs)
              ? parsed.evidenceRefs.map(String)
              : [];

            const cardResult: EvaluatedCard = {
              cardId: card.id,
              family: card.builtinFamily || card.name,
              name: card.name,
              promptText,
              evidenceRefs,
              latencyMs: Date.now() - t0,
              status: 'success'
            };

            // Update single pixel to success
            initialPixels[idx].state = 'success';
            initialPixels[idx].latencyMs = cardResult.latencyMs;
            broadcastProgress({
              runId,
              active: true,
              pipeline: 'segmented',
              phase: 'running',
              pixels: [...initialPixels],
              currentStepText: `Evaluated ${card.name} in ${cardResult.latencyMs}ms`
            });

            return cardResult;
          } catch (err: any) {
            const cardResult: EvaluatedCard = {
              cardId: card.id,
              family: card.builtinFamily || card.name,
              name: card.name,
              promptText: `Preserve established context and limits for ${card.name}.`,
              evidenceRefs: [],
              latencyMs: Date.now() - t0,
              status: 'fallback',
              error: err?.message || String(err)
            };

            initialPixels[idx].state = 'warning';
            initialPixels[idx].latencyMs = cardResult.latencyMs;
            broadcastProgress({
              runId,
              active: true,
              pipeline: 'segmented',
              phase: 'running',
              pixels: [...initialPixels],
              currentStepText: `Fallback for ${card.name}`
            });

            return cardResult;
          }
        });

        evaluatedCards = await Promise.all(promises);
      } else {
        // ── FUSED BUNDLE CALLING ──
        try {
          const prompt = buildFusedBundlePrompt(selectedCards, formattedContext, settings.storyForm);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), settings.cardTimeoutSec * 1500);
          const combinedSignal = context?.signal
            ? AbortSignal.any([context.signal, controller.signal])
            : controller.signal;

          const res = (await sp.generate.raw({
            type: 'raw',
            messages: [{ role: 'user', content: prompt }],
            connection_id: connId,
            parameters: { temperature: 0.25, max_tokens: 1200 },
            ...(turnUserId ? { userId: turnUserId } : {}),
            signal: combinedSignal
          })) as { content?: string };

          clearTimeout(timeoutId);
          const parsed = extractJsonFromResponse(res?.content);
          const bundleCards = Array.isArray(parsed?.cards) ? parsed.cards : [];

          evaluatedCards = selectedCards.map((card, idx) => {
            const found = bundleCards.find(
              (bc: any) =>
                bc.cardId === card.id ||
                (bc.family && bc.family.toLowerCase() === (card.builtinFamily || '').toLowerCase())
            );
            const promptText =
              typeof found?.promptText === 'string' && found.promptText.trim()
                ? found.promptText.trim()
                : `Maintain scene consistency for ${card.name}.`;
            const evidenceRefs = Array.isArray(found?.evidenceRefs) ? found.evidenceRefs.map(String) : [];

            initialPixels[idx].state = found ? 'success' : 'warning';
            return {
              cardId: card.id,
              family: card.builtinFamily || card.name,
              name: card.name,
              promptText,
              evidenceRefs,
              latencyMs: Date.now() - tStart,
              status: found ? 'success' : ('fallback' as const)
            };
          });
        } catch (err: any) {
          evaluatedCards = selectedCards.map((card, idx) => {
            initialPixels[idx].state = 'warning';
            return {
              cardId: card.id,
              family: card.builtinFamily || card.name,
              name: card.name,
              promptText: `Preserve scene continuity for ${card.name}.`,
              evidenceRefs: [],
              latencyMs: Date.now() - tStart,
              status: 'fallback' as const,
              error: err?.message || String(err)
            };
          });
        }
      }

      const totalLatency = Date.now() - tStart;
      const injectedPacket = assemblePromptPacket(evaluatedCards, settings.storyForm, settings.promptFootprint);

      const brief: TurnBrief = {
        turnId: runId,
        timestamp: Date.now(),
        chatId: context?.chatId,
        pipeline: settings.pipeline,
        totalLatencyMs: totalLatency,
        estimatedTokens: Math.ceil(injectedPacket.length / 4),
        cards: evaluatedCards,
        omitted: omittedCards,
        injectedPacket,
        promptFootprint: settings.promptFootprint
      };

      lastBrief = brief;
      await storage.saveLastBrief(brief);

      // Save cache
      cachedTurn = {
        hash: turnHash,
        cards: evaluatedCards,
        injectedPacket,
        brief,
        timestamp: Date.now()
      };

      // Broadcast completed progress and brief
      broadcastProgress({
        runId,
        active: false,
        pipeline: settings.pipeline,
        phase: 'done',
        pixels: initialPixels,
        currentStepText: `Ready. ${evaluatedCards.length} cards prepared in ${totalLatency}ms (${settings.cardSourceMode}).`
      });

      if (sp.sendToFrontend) {
        sp.sendToFrontend({ type: 'BRIEF_UPDATED', brief });
      }

      const injectedMessage = {
        role: 'system',
        content: injectedPacket
      };
      const updatedMessages = [...messages, injectedMessage];

      return {
        messages: updatedMessages,
        breakdown: [
          { messageIndex: updatedMessages.length - 1, name: 'Lumi:REcursion Guidance' }
        ]
      };
    }
  );

  // ── 2. IPC Message Dispatcher ──────────────────────────────────────────────
  sp.onFrontendMessage(async (msg: FrontendToBackendMessage, userId?: string) => {
    rememberUser(userId, (msg as any).chatId);
    const effectiveUserId = userId || getEffectiveUserId((msg as any).chatId);

    switch (msg.type) {
      case 'GET_STATE': {
        const conns = await listConnections(effectiveUserId);
        const wbs = await listAvailableWorldBooks(sp, effectiveUserId);
        const activeCharId = await getActiveCharacterId(effectiveUserId);
        const charStatus = activeCharId ? await getCharacterPayloadStatus(sp, activeCharId, effectiveUserId) : null;

        let wbCards: any[] = [];
        const effectiveWbId = settings.worldBookId || wbs.find((w) => w.name === DEFAULT_WORLDBOOK_NAME || w.name === 'Recursion Cards')?.id;
        if (effectiveWbId) {
          wbCards = await listWorldBookCardEntries(sp, effectiveWbId, effectiveUserId);
        }

        sp.sendToFrontend({
          type: 'STATE',
          settings,
          decks,
          activeDeckId,
          lastBrief,
          progress: currentProgress,
          connections: conns,
          worldBooks: wbs,
          characterStatus: charStatus,
          worldBookCards: wbCards,
          recastSettings,
          recastProgress
        });
        break;
      }

      case 'UPDATE_SETTINGS': {
        settings = { ...settings, ...msg.settings };
        await storage.saveSettings(settings);
        sp.sendToFrontend({ type: 'SETTINGS_UPDATED', settings });
        break;
      }

      case 'CREATE_OR_SYNC_WORLD_BOOK': {
        try {
          const activeCharId = await getActiveCharacterId(effectiveUserId);
          const result = await createOrSyncRecursionWorldBook(sp, activeCharId, effectiveUserId);
          settings.worldBookId = result.worldBookId;
          settings.cardSourceMode = 'world_book';
          await storage.saveSettings(settings);

          const wbs = await listAvailableWorldBooks(sp, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, result.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: 'WORLD_BOOKS_UPDATED', worldBooks: wbs, selectedId: result.worldBookId });
          sp.sendToFrontend({ type: 'WORLDBOOK_CARDS_UPDATED', worldBookId: result.worldBookId, cards });
          sp.sendToFrontend({ type: 'SETTINGS_UPDATED', settings });
          sp.toast?.success?.(`📖 World Book "${DEFAULT_WORLDBOOK_NAME}" synced with ${result.createdCount} card entries!`);
        } catch (err: any) {
          sp.toast?.error?.(`Failed to sync world book: ${err?.message || err}`);
        }
        break;
      }

      case 'INIT_CHARACTER_PAYLOAD': {
        try {
          const activeCharId = await getActiveCharacterId(effectiveUserId);
          if (!activeCharId) {
            sp.toast?.warn?.('No active character selected in chat.');
            break;
          }
          const res = await initCharacterCardPayload(sp, activeCharId, effectiveUserId);
          settings.cardSourceMode = 'character_ext';
          await storage.saveSettings(settings);

          const charStatus = await getCharacterPayloadStatus(sp, activeCharId, effectiveUserId);
          sp.sendToFrontend({ type: 'CHARACTER_STATUS_UPDATED', status: charStatus });
          sp.sendToFrontend({ type: 'SETTINGS_UPDATED', settings });
          sp.toast?.success?.(`👤 Initialized ${res.cardCount} cards in character extension payload!`);
        } catch (err: any) {
          sp.toast?.error?.(`Failed to init character payload: ${err?.message || err}`);
        }
        break;
      }

      case 'UPDATE_CHARACTER_CARD_STATE': {
        try {
          const activeCharId = await getActiveCharacterId(effectiveUserId);
          if (activeCharId) {
            await updateCharacterCardState(sp, activeCharId, msg.cardId, msg.state, effectiveUserId);
            const charStatus = await getCharacterPayloadStatus(sp, activeCharId, effectiveUserId);
            sp.sendToFrontend({ type: 'CHARACTER_STATUS_UPDATED', status: charStatus });
          }
        } catch (err: any) {
          console.warn('[Lumi:REcursion] Failed to update character card state:', err);
        }
        break;
      }

      case 'SET_CARD_STATE': {
        const targetDeck = decks[msg.deckId];
        if (targetDeck && targetDeck.cards[msg.cardId]) {
          targetDeck.cards[msg.cardId].selectionState = msg.state;
          targetDeck.updatedAt = new Date().toISOString();
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: 'DECKS_UPDATED', decks, activeDeckId });
        }
        break;
      }

      case 'BULK_SET_CARDS': {
        const targetDeck = decks[msg.deckId];
        if (targetDeck) {
          const cardIds =
            msg.categoryId && targetDeck.cardOrderByCategory[msg.categoryId]
              ? targetDeck.cardOrderByCategory[msg.categoryId]
              : Object.keys(targetDeck.cards);

          for (const cId of cardIds) {
            if (targetDeck.cards[cId]) {
              targetDeck.cards[cId].selectionState = msg.state;
            }
          }
          targetDeck.updatedAt = new Date().toISOString();
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: 'DECKS_UPDATED', decks, activeDeckId });
        }
        break;
      }

      case 'SWITCH_DECK': {
        if (decks[msg.deckId]) {
          activeDeckId = msg.deckId;
          settings.activeDeckId = msg.deckId;
          await storage.saveSettings(settings);
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: 'DECKS_UPDATED', decks, activeDeckId });
          sp.toast?.info?.(`🃏 Active Deck: "${decks[msg.deckId].name}"`);
        }
        break;
      }

      case 'DUPLICATE_DECK': {
        const source = decks[msg.sourceDeckId];
        if (source) {
          const newId = `custom-${Date.now()}`;
          const newDeck: DeckDefinition = JSON.parse(JSON.stringify(source));
          newDeck.id = newId;
          newDeck.name = msg.newName || `${source.name} (Copy)`;
          newDeck.bundled = false;
          newDeck.readonly = false;
          newDeck.createdAt = new Date().toISOString();
          newDeck.updatedAt = new Date().toISOString();

          decks[newId] = newDeck;
          activeDeckId = newId;
          settings.activeDeckId = newId;
          await storage.saveSettings(settings);
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: 'DECKS_UPDATED', decks, activeDeckId });
          sp.toast?.success?.(`✨ Created deck: "${newDeck.name}"`);
        }
        break;
      }

      case 'DELETE_DECK': {
        if (decks[msg.deckId] && !decks[msg.deckId].bundled) {
          delete decks[msg.deckId];
          if (activeDeckId === msg.deckId) {
            activeDeckId = DEFAULT_DECK_ID;
            settings.activeDeckId = DEFAULT_DECK_ID;
            await storage.saveSettings(settings);
          }
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: 'DECKS_UPDATED', decks, activeDeckId });
          sp.toast?.info?.('🗑️ Custom deck deleted');
        }
        break;
      }

      case 'CLEAR_CACHE': {
        cachedTurn = null;
        sp.toast?.info?.('🧹 Turn reasoning cache cleared');
        break;
      }

      case 'MANUAL_RUN_NOW': {
        settings.manualTurnArmed = true;
        sp.toast?.info?.('🎯 Armed next turn for scene reasoning');
        break;
      }

      case 'GET_CONNECTIONS': {
        const conns = await listConnections(effectiveUserId);
        sp.sendToFrontend({ type: 'CONNECTIONS', connections: conns });
        break;
      }

      // ── Recast IPC Handlers ────────────────────────────────────────────────
      case 'RECAST_UPDATE_SETTINGS': {
        recastSettings = { ...recastSettings, ...msg.settings };
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: 'RECAST_STATE_UPDATED', settings: recastSettings, progress: recastProgress });
        break;
      }

      case 'RECAST_UPDATE_PRESET': {
        const pIdx = recastSettings.presets.findIndex((p) => p.id === msg.preset.id);
        if (pIdx !== -1) {
          recastSettings.presets[pIdx] = msg.preset;
        } else {
          recastSettings.presets.push(msg.preset);
        }
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: 'RECAST_STATE_UPDATED', settings: recastSettings, progress: recastProgress });
        break;
      }

      case 'RECAST_CREATE_PRESET': {
        const newPreset: RecastPreset = {
          id: `preset_${Date.now()}`,
          name: msg.name || 'Custom Preset',
          passes: [
            { ...PASS_GROUNDING, id: `pass_${Date.now()}_1` },
            { ...PASS_VALIDATOR, id: `pass_${Date.now()}_2` },
            { ...PASS_PROSE, id: `pass_${Date.now()}_3` }
          ]
        };
        recastSettings.presets.push(newPreset);
        recastSettings.activePresetId = newPreset.id;
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: 'RECAST_STATE_UPDATED', settings: recastSettings, progress: recastProgress });
        sp.toast?.success?.(`✨ Created preset: "${newPreset.name}"`);
        break;
      }

      case 'RECAST_DELETE_PRESET': {
        if (recastSettings.presets.length > 1) {
          recastSettings.presets = recastSettings.presets.filter((p) => p.id !== msg.presetId);
          if (recastSettings.activePresetId === msg.presetId) {
            recastSettings.activePresetId = recastSettings.presets[0].id;
          }
          await storage.saveRecastSettings(recastSettings);
          sp.sendToFrontend({ type: 'RECAST_STATE_UPDATED', settings: recastSettings, progress: recastProgress });
          sp.toast?.info?.('🗑️ Preset deleted');
        } else {
          sp.toast?.warn?.('Cannot delete the only remaining preset.');
        }
        break;
      }

      case 'RECAST_RESET_PRESET': {
        recastSettings.presets = [JSON.parse(JSON.stringify(DEFAULT_RECAST_PRESET))];
        recastSettings.activePresetId = DEFAULT_RECAST_PRESET.id;
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: 'RECAST_STATE_UPDATED', settings: recastSettings, progress: recastProgress });
        sp.toast?.info?.('🔄 Reset Recast presets to defaults');
        break;
      }

      case 'RECAST_RUN_MESSAGE': {
        if (isRecastRunning) {
          sp.toast?.warn?.('Recast pipeline is already running.');
          break;
        }
        try {
          let targetChatId = msg.chatId;
          let targetMessageId = msg.messageId;
          let targetText = '';

          if (!targetChatId && sp.chats?.getActive) {
            const activeChat = await sp.chats.getActive(effectiveUserId);
            targetChatId = activeChat?.id;
          }

          if (targetChatId && !targetMessageId && sp.chat?.getMessages) {
            const msgs = await sp.chat.getMessages(targetChatId);
            if (Array.isArray(msgs) && msgs.length > 0) {
              for (let i = msgs.length - 1; i >= 0; i--) {
                if (!msgs[i].is_user && msgs[i].role !== 'user' && msgs[i].role !== 'system') {
                  targetMessageId = msgs[i].id;
                  targetText = msgs[i].content;
                  break;
                }
              }
            }
          } else if (targetChatId && targetMessageId && sp.chat?.getMessages) {
            const msgs = await sp.chat.getMessages(targetChatId);
            const found = msgs.find((m: any) => m.id === targetMessageId);
            if (found) targetText = found.content;
          }

          if (!targetChatId || !targetMessageId || !targetText) {
            sp.toast?.warn?.('No assistant message found in current chat to recast.');
            break;
          }

          isRecastRunning = true;
          sp.toast?.info?.('✨ Running Recast post-processing pipeline...');

          const diff = await runRecastPipeline(sp, {
            chatId: targetChatId,
            messageId: targetMessageId,
            rawText: targetText,
            settings: recastSettings,
            userId: effectiveUserId,
            onProgress: (prog) => {
              recastProgress = prog;
              sp.sendToFrontend?.({ type: 'RECAST_PROGRESS', progress: prog });
            }
          });

          if (diff) {
            sp.sendToFrontend?.({ type: 'RECAST_DIFF_READY', diff });
          }
        } catch (err: any) {
          console.error('[Lumi:REcursion:Recast] Manual recast failed:', err);
          sp.toast?.error?.(`Recast failed: ${err?.message || err}`);
        } finally {
          isRecastRunning = false;
          recastProgress = null;
          sp.sendToFrontend?.({
            type: 'RECAST_PROGRESS',
            progress: {
              active: false,
              currentPassIndex: 0,
              totalPasses: 0,
              currentPassName: '',
              statusText: ''
            }
          });
        }
        break;
      }

      case 'RECAST_APPLY_RESULT': {
        try {
          const { chatId, messageId, text, mode } = msg;
          if (mode === 'replace') {
            await sp.chat.updateMessage(chatId, messageId, { content: text });
            sp.toast?.success?.('✅ Recast applied in-place');
          } else if (mode === 'swipe') {
            const allMsgs = await sp.chat.getMessages(chatId);
            const existing = allMsgs.find((m: any) => m.id === messageId);
            const existingSwipes =
              Array.isArray(existing?.swipes) && existing.swipes.length > 0
                ? existing.swipes
                : [existing?.content || ''];
            const newSwipes = [...existingSwipes, text];
            const newSwipeId = newSwipes.length - 1;
            await sp.chat.updateMessage(chatId, messageId, { swipes: newSwipes, swipe_id: newSwipeId });
            sp.toast?.success?.('🔀 Recast saved as new swipe');
          }
          sp.sendToFrontend?.({ type: 'RECAST_APPLIED', chatId, messageId, mode });
        } catch (err: any) {
          console.error('[Lumi:REcursion:Recast] Failed to apply recast result:', err);
          sp.toast?.error?.(`Failed to apply recast: ${err?.message || err}`);
        }
        break;
      }

      // ── World Book Card Management IPC ────────────────────────────────────
      case 'GET_WORLDBOOK_CARDS': {
        const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
        sp.sendToFrontend({ type: 'WORLDBOOK_CARDS_UPDATED', worldBookId: msg.worldBookId, cards });
        break;
      }

      case 'SAVE_WORLDBOOK_CARD': {
        try {
          await saveWorldBookEntry(sp, msg.worldBookId, msg.entry, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: 'WORLDBOOK_CARDS_UPDATED', worldBookId: msg.worldBookId, cards });
          sp.toast?.success?.(`💾 Card "${msg.entry.family}" saved to World Book`);
        } catch (err: any) {
          sp.toast?.error?.(`Failed to save entry: ${err?.message || err}`);
        }
        break;
      }

      case 'DELETE_WORLDBOOK_CARD': {
        try {
          await deleteWorldBookEntry(sp, msg.entryId, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: 'WORLDBOOK_CARDS_UPDATED', worldBookId: msg.worldBookId, cards });
          sp.toast?.info?.('🗑️ Card entry removed from World Book');
        } catch (err: any) {
          sp.toast?.error?.(`Failed to delete entry: ${err?.message || err}`);
        }
        break;
      }

      case 'IMPORT_WORLDBOOK_CARDS': {
        try {
          const count = await importWorldBookCards(sp, msg.worldBookId, msg.cards, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: 'WORLDBOOK_CARDS_UPDATED', worldBookId: msg.worldBookId, cards });
          sp.toast?.success?.(`📥 Imported ${count} card entries into World Book!`);
        } catch (err: any) {
          sp.toast?.error?.(`Failed to import cards: ${err?.message || err}`);
        }
        break;
      }

      // ── Character Payload Card Management IPC ────────────────────────────
      case 'SAVE_CHARACTER_CARD': {
        try {
          await saveCharacterCard(sp, msg.characterId, msg.card, effectiveUserId);
          const status = await getCharacterPayloadStatus(sp, msg.characterId, effectiveUserId);
          sp.sendToFrontend({ type: 'CHARACTER_STATUS_UPDATED', status });
          sp.toast?.success?.(`💾 Card "${msg.card.name}" saved to character payload`);
        } catch (err: any) {
          sp.toast?.error?.(`Failed to save card: ${err?.message || err}`);
        }
        break;
      }

      case 'DELETE_CHARACTER_CARD': {
        try {
          await deleteCharacterCard(sp, msg.characterId, msg.cardId, effectiveUserId);
          const status = await getCharacterPayloadStatus(sp, msg.characterId, effectiveUserId);
          sp.sendToFrontend({ type: 'CHARACTER_STATUS_UPDATED', status });
          sp.toast?.info?.('🗑️ Card removed from character payload');
        } catch (err: any) {
          sp.toast?.error?.(`Failed to delete card: ${err?.message || err}`);
        }
        break;
      }

      case 'IMPORT_CHARACTER_PAYLOAD': {
        try {
          const res = await importCharacterPayload(sp, msg.characterId, msg.payload, effectiveUserId);
          const status = await getCharacterPayloadStatus(sp, msg.characterId, effectiveUserId);
          sp.sendToFrontend({ type: 'CHARACTER_STATUS_UPDATED', status });
          sp.toast?.success?.(`📥 Imported ${res.cardCount} cards into character payload!`);
        } catch (err: any) {
          sp.toast?.error?.(`Failed to import payload: ${err?.message || err}`);
        }
        break;
      }
    }
  });
})();
