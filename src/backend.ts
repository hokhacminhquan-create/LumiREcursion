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
  FrontendToBackendMessage
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
  DEFAULT_WORLDBOOK_NAME
} from './cards/worldbook';
import {
  getCharacterPayloadStatus,
  initCharacterCardPayload,
  readCardsFromCharacter,
  updateCharacterCardState
} from './cards/character-payload';

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

async function listConnections(): Promise<Array<{ id: string; name: string; provider?: string; model?: string; is_default?: boolean }>> {
  try {
    if (sp?.connections?.list) {
      const list = await sp.connections.list();
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

async function resolveConnectionId(profileId: string): Promise<string | undefined> {
  if (profileId) return profileId;
  const conns = await listConnections();
  const def = conns.find((c) => c.is_default) || conns[0];
  return def ? def.id : undefined;
}

async function getActiveCharacterId(): Promise<string | null> {
  try {
    if (sp?.chats?.getActive) {
      const chat = await sp.chats.getActive();
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
  let candidateCards: CardDefinition[] = [];

  // ── Option A: World Book Mode ──
  if (settings.cardSourceMode === 'world_book') {
    let wbId = settings.worldBookId;
    if (!wbId && context?.characterId && sp?.characters?.get) {
      try {
        const char = await sp.characters.get(context.characterId);
        if (char && Array.isArray(char.world_book_ids)) {
          const wbs = await listAvailableWorldBooks(sp);
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
      const wbs = await listAvailableWorldBooks(sp);
      const matched = wbs.find(
        (w) => w.name === DEFAULT_WORLDBOOK_NAME || w.name.includes('Recursion Cards')
      );
      if (matched) wbId = matched.id;
    }

    if (wbId) {
      candidateCards = await readCardsFromWorldBook(sp, wbId);
      console.log(`[Lumi:REcursion] Loaded ${candidateCards.length} cards from World Book (${wbId})`);
    }
  }
  // ── Option B: Character Extension Payload Mode ──
  else if (settings.cardSourceMode === 'character_ext') {
    let charId = context?.characterId;
    if (!charId) {
      charId = await getActiveCharacterId();
    }

    if (charId) {
      candidateCards = await readCardsFromCharacter(sp, charId);
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

  console.log(
    '[Lumi:REcursion] Initialized with source mode:',
    settings.cardSourceMode,
    'Active deck:',
    activeDeckId,
    'Enabled:',
    settings.enabled
  );

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
      const connId = await resolveConnectionId(settings.connectionProfileId);

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
  sp.onFrontendMessage(async (msg: FrontendToBackendMessage) => {
    switch (msg.type) {
      case 'GET_STATE': {
        const conns = await listConnections();
        const wbs = await listAvailableWorldBooks(sp);
        const activeCharId = await getActiveCharacterId();
        const charStatus = activeCharId ? await getCharacterPayloadStatus(sp, activeCharId) : null;

        sp.sendToFrontend({
          type: 'STATE',
          settings,
          decks,
          activeDeckId,
          lastBrief,
          progress: currentProgress,
          connections: conns,
          worldBooks: wbs,
          characterStatus: charStatus
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
          const activeCharId = await getActiveCharacterId();
          const result = await createOrSyncRecursionWorldBook(sp, activeCharId);
          settings.worldBookId = result.worldBookId;
          settings.cardSourceMode = 'world_book';
          await storage.saveSettings(settings);

          const wbs = await listAvailableWorldBooks(sp);
          sp.sendToFrontend({ type: 'WORLD_BOOKS_UPDATED', worldBooks: wbs, selectedId: result.worldBookId });
          sp.sendToFrontend({ type: 'SETTINGS_UPDATED', settings });
          sp.toast?.success?.(`📖 World Book "${DEFAULT_WORLDBOOK_NAME}" synced with ${result.createdCount} card entries!`);
        } catch (err: any) {
          sp.toast?.error?.(`Failed to sync world book: ${err?.message || err}`);
        }
        break;
      }

      case 'INIT_CHARACTER_PAYLOAD': {
        try {
          const activeCharId = await getActiveCharacterId();
          if (!activeCharId) {
            sp.toast?.warn?.('No active character selected in chat.');
            break;
          }
          const res = await initCharacterCardPayload(sp, activeCharId);
          settings.cardSourceMode = 'character_ext';
          await storage.saveSettings(settings);

          const charStatus = await getCharacterPayloadStatus(sp, activeCharId);
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
          const activeCharId = await getActiveCharacterId();
          if (activeCharId) {
            await updateCharacterCardState(sp, activeCharId, msg.cardId, msg.state);
            const charStatus = await getCharacterPayloadStatus(sp, activeCharId);
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
        const conns = await listConnections();
        sp.sendToFrontend({ type: 'CONNECTIONS', connections: conns });
        break;
      }
    }
  });
})();
