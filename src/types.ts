/**
 * Lumi:REcursion — Type Definitions
 * Adapted from SillyTavern Recursion for Lumiverse Spindle
 */

export type CardSelectionState = 'off' | 'active' | 'priority';
export type CardSourceMode = 'world_book' | 'character_ext' | 'local_deck';

export interface CardDefinition {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  promptText: string;
  selectionState: CardSelectionState;
  builtinFamily?: string;
  builtinRoleId?: string;
  selectedSubItems?: string[];
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeckCategory {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeckDefinition {
  id: string;
  name: string;
  description: string;
  bundled: boolean;
  readonly: boolean;
  categoryOrder: string[];
  categories: Record<string, DeckCategory>;
  cardOrderByCategory: Record<string, string[]>;
  cards: Record<string, CardDefinition>;
  createdAt?: string;
  updatedAt?: string;
}

export type StoryTense = 'auto' | 'past' | 'present';
export type StoryPov = 'auto' | 'first' | 'second' | 'third';

export interface StoryFormSettings {
  tense: StoryTense;
  pov: StoryPov;
}

export interface RecursionSettings {
  enabled: boolean;
  mode: 'auto' | 'manual';
  pipeline: 'segmented' | 'fused';
  cardSourceMode: CardSourceMode;
  worldBookId: string;
  promptFootprint: 'compact' | 'normal' | 'rich';
  connectionProfileId: string;
  storyForm: StoryFormSettings;
  maxCards: number;
  contextWindow: number; // Number of recent chat messages to examine (default: 6)
  cardTimeoutSec: number;
  attemptsPerStep: number;
  postProcessEnabled: boolean;
  postProcessFlow: 'unified' | 'progressive';
  postProcessApply: 'swipe' | 'replace';
  activeDeckId: string;
  manualTurnArmed: boolean;
}

export interface EvaluatedCard {
  cardId: string;
  family: string;
  name: string;
  promptText: string;
  evidenceRefs: string[];
  latencyMs: number;
  status: 'success' | 'cached' | 'fallback' | 'error';
  error?: string;
}

export interface CardOmission {
  cardId: string;
  family: string;
  reason: 'max-cards' | 'budget' | 'inactive' | 'error' | 'unspecified';
}

export interface TurnBrief {
  turnId: string;
  timestamp: number;
  chatId?: string;
  pipeline: 'segmented' | 'fused';
  totalLatencyMs: number;
  estimatedTokens: number;
  cards: EvaluatedCard[];
  omitted: CardOmission[];
  injectedPacket: string;
  promptFootprint: 'compact' | 'normal' | 'rich';
}

export type HeroPixelState = 'empty' | 'running' | 'success' | 'cached' | 'warning' | 'error';

export interface HeroPixelItem {
  id: string;
  name: string;
  state: HeroPixelState;
  latencyMs?: number;
}

export interface RunProgressState {
  runId: string;
  active: boolean;
  pipeline: 'segmented' | 'fused';
  phase: 'idle' | 'planning' | 'running' | 'assembling' | 'done' | 'error';
  pixels: HeroPixelItem[];
  currentStepText?: string;
}

export interface CharacterPayloadCard {
  id: string;
  family: string;
  name: string;
  role: string;
  priority: number;
  selectionState: CardSelectionState;
  description: string;
  promptText?: string;
  subItems?: string[];
}

export interface CharacterExtensionData {
  version: number;
  enabled: boolean;
  pipeline?: 'segmented' | 'fused';
  cards: CharacterPayloadCard[];
}

export interface WorldBookOption {
  id: string;
  name: string;
  entryCount?: number;
}

export interface CharacterPayloadStatus {
  id: string;
  name: string;
  hasPayload: boolean;
  cardCount: number;
  cards?: CharacterPayloadCard[];
}

// ─── IPC Payloads ────────────────────────────────────────────────────────────

export type FrontendToBackendMessage =
  | { type: 'GET_STATE' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<RecursionSettings> }
  | { type: 'SET_CARD_STATE'; deckId: string; cardId: string; state: CardSelectionState }
  | { type: 'BULK_SET_CARDS'; deckId: string; categoryId?: string; state: CardSelectionState }
  | { type: 'SWITCH_DECK'; deckId: string }
  | { type: 'DUPLICATE_DECK'; sourceDeckId: string; newName: string }
  | { type: 'DELETE_DECK'; deckId: string }
  | { type: 'CLEAR_CACHE' }
  | { type: 'MANUAL_RUN_NOW' }
  | { type: 'GET_CONNECTIONS' }
  | { type: 'CREATE_OR_SYNC_WORLD_BOOK' }
  | { type: 'INIT_CHARACTER_PAYLOAD' }
  | { type: 'UPDATE_CHARACTER_CARD_STATE'; cardId: string; state: CardSelectionState };

export type BackendToFrontendMessage =
  | {
      type: 'STATE';
      settings: RecursionSettings;
      decks: Record<string, DeckDefinition>;
      activeDeckId: string;
      lastBrief: TurnBrief | null;
      progress: RunProgressState;
      connections: Array<{ id: string; name: string; provider?: string; model?: string; is_default?: boolean }>;
      worldBooks: WorldBookOption[];
      characterStatus: CharacterPayloadStatus | null;
    }
  | { type: 'PROGRESS'; progress: RunProgressState }
  | { type: 'BRIEF_UPDATED'; brief: TurnBrief }
  | { type: 'SETTINGS_UPDATED'; settings: RecursionSettings }
  | { type: 'DECKS_UPDATED'; decks: Record<string, DeckDefinition>; activeDeckId: string }
  | { type: 'CONNECTIONS'; connections: Array<{ id: string; name: string; provider?: string; model?: string; is_default?: boolean }> }
  | { type: 'WORLD_BOOKS_UPDATED'; worldBooks: WorldBookOption[]; selectedId: string }
  | { type: 'CHARACTER_STATUS_UPDATED'; status: CharacterPayloadStatus | null };
