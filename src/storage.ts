/**
 * Lumi:REcursion — Storage and Persistence Layer
 * Uses Spindle's safe per-file JSON storage with independent fault tolerance.
 */

import type { RecursionSettings, DeckDefinition, TurnBrief, RecastSettings } from './types';
import { createDefaultDeck, DEFAULT_DECK_ID } from './cards/defaults';
import { DEFAULT_RECAST_SETTINGS } from './recast/defaults';

export const DEFAULT_SETTINGS: RecursionSettings = {
  enabled: true,
  mode: 'auto',
  pipeline: 'segmented',
  cardSourceMode: 'world_book',
  worldBookId: '',
  promptFootprint: 'normal',
  connectionProfileId: '',
  storyForm: {
    tense: 'auto',
    pov: 'auto'
  },
  maxCards: 6,
  contextWindow: 6,
  cardTimeoutSec: 15,
  attemptsPerStep: 2,
  postProcessEnabled: false,
  postProcessFlow: 'unified',
  postProcessApply: 'swipe',
  activeDeckId: DEFAULT_DECK_ID,
  manualTurnArmed: false
};

export class StorageManager {
  private sp: any;

  constructor(spindleInstance: any) {
    this.sp = spindleInstance;
  }

  async loadSettings(): Promise<RecursionSettings> {
    try {
      if (this.sp?.storage?.getJson) {
        const data = await this.sp.storage.getJson('settings.json');
        if (data && typeof data === 'object') {
          return {
            ...DEFAULT_SETTINGS,
            ...data,
            storyForm: {
              ...DEFAULT_SETTINGS.storyForm,
              ...(data.storyForm || {})
            }
          };
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion] Failed to load settings.json, using defaults:', err);
    }
    return { ...DEFAULT_SETTINGS };
  }

  async saveSettings(settings: RecursionSettings): Promise<void> {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson('settings.json', settings);
      }
    } catch (err) {
      console.error('[Lumi:REcursion] Failed to save settings.json:', err);
    }
  }

  async loadDecks(): Promise<{ decks: Record<string, DeckDefinition>; activeDeckId: string }> {
    const defaultDeck = createDefaultDeck();
    const decks: Record<string, DeckDefinition> = {
      [DEFAULT_DECK_ID]: defaultDeck
    };
    let activeDeckId = DEFAULT_DECK_ID;

    try {
      if (this.sp?.storage?.getJson) {
        const stored = await this.sp.storage.getJson('decks.json');
        if (stored && typeof stored === 'object') {
          if (stored.decks && typeof stored.decks === 'object') {
            for (const [id, d] of Object.entries(stored.decks)) {
              if (id === DEFAULT_DECK_ID) {
                // Merge operator card selections onto bundled deck while preserving schema
                const mergedDeck = createDefaultDeck();
                const storedDeck = d as DeckDefinition;
                if (storedDeck.cards) {
                  for (const [cId, c] of Object.entries(storedDeck.cards)) {
                    if (mergedDeck.cards[cId]) {
                      mergedDeck.cards[cId].selectionState = c.selectionState;
                    }
                  }
                }
                decks[DEFAULT_DECK_ID] = mergedDeck;
              } else {
                decks[id] = d as DeckDefinition;
              }
            }
          }
          if (typeof stored.activeDeckId === 'string' && decks[stored.activeDeckId]) {
            activeDeckId = stored.activeDeckId;
          }
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion] Failed to load decks.json, using default deck:', err);
    }

    return { decks, activeDeckId };
  }

  async saveDecks(decks: Record<string, DeckDefinition>, activeDeckId: string): Promise<void> {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson('decks.json', { decks, activeDeckId });
      }
    } catch (err) {
      console.error('[Lumi:REcursion] Failed to save decks.json:', err);
    }
  }

  async loadLastBrief(): Promise<TurnBrief | null> {
    try {
      if (this.sp?.storage?.getJson) {
        const brief = await this.sp.storage.getJson('last_brief.json');
        if (brief && typeof brief === 'object' && Array.isArray(brief.cards)) {
          return brief as TurnBrief;
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion] Failed to load last_brief.json:', err);
    }
    return null;
  }

  async saveLastBrief(brief: TurnBrief): Promise<void> {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson('last_brief.json', brief);
      }
    } catch (err) {
      console.error('[Lumi:REcursion] Failed to save last_brief.json:', err);
    }
  }

  async loadRecastSettings(): Promise<RecastSettings> {
    try {
      if (this.sp?.storage?.getJson) {
        const data = await this.sp.storage.getJson('recast_settings.json');
        if (data && typeof data === 'object') {
          return {
            ...DEFAULT_RECAST_SETTINGS,
            ...data,
            presets: Array.isArray(data.presets) && data.presets.length > 0 ? data.presets : DEFAULT_RECAST_SETTINGS.presets
          };
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion] Failed to load recast_settings.json, using defaults:', err);
    }
    return { ...DEFAULT_RECAST_SETTINGS };
  }

  async saveRecastSettings(settings: RecastSettings): Promise<void> {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson('recast_settings.json', settings);
      }
    } catch (err) {
      console.error('[Lumi:REcursion] Failed to save recast_settings.json:', err);
    }
  }
}
