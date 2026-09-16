/**
 * Lumi:REcursion — Recast Post-Processing Types
 * Ported and adapted from SillyTavern Recast for Lumiverse Spindle
 */

export type RecastReasoningEffort = 'inherit' | 'off' | 'low' | 'medium' | 'high';

export interface RecastPass {
  id: string;
  name: string;
  enabled: boolean;
  contextLength: number; // Number of recent chat messages to supply as <scene_context>
  prompt: string;        // System prompt with instructions and <text_to_transform>
  prefill?: string;
  prefillRole?: 'assistant' | 'system' | 'user';
  connection?: string;   // Optional Connection Profile ID override
  modelOverride?: string; // Optional Model name override (e.g. "google/gemini-2.0-flash", "deepseek/deepseek-chat")
  reasoningEffort?: RecastReasoningEffort; // 'off' disables thinking for 5x-10x speedup
  maxTokens?: number;    // Cap output tokens (default: 1000)
  temperature?: number;  // Temperature (default: 0.3)
  ttftTimeoutSec?: number; // Time-to-first-token timeout in seconds (default: 20)
  passTimeoutSec?: number; // Total pass timeout in seconds (default: 60)
  injectWorldInfo?: boolean;
  includeCharCard?: boolean;
  includeSceneContext?: boolean;
}

export interface RecastPreset {
  id: string;
  name: string;
  passes: RecastPass[];
}

export type RecastApplyMode = 'diff' | 'replace' | 'swipe';

export interface RecastSettings {
  enabled: boolean;
  autoRun: boolean;
  applyMode: RecastApplyMode;
  minChars: number;
  activePresetId: string;
  presets: RecastPreset[];
  // Global defaults & fallbacks
  defaultConnectionId?: string;
  defaultModelOverride?: string;
  defaultReasoningEffort?: RecastReasoningEffort;
  defaultTtftTimeoutSec?: number; // default: 20
  defaultPassTimeoutSec?: number; // default: 60
  maxTokens?: number;             // default: 1000
  protectTagsAndHtml?: boolean;   // default: true (isolates GABI, CYOA, HTML cards, JSON blocks)
}

export interface RecastDiffStep {
  oldText: string;
  newText: string;
  oldLabel: string;
  newLabel: string;
  caption: string;
  passName?: string;
}

export interface RecastDiffData {
  chatId: string;
  messageId: string;
  originalText: string;
  transformedText: string;
  snapshots: string[]; // [originalText, afterPass1, afterPass2, ..., finalResult]
  passNames: string[]; // Names of the executed passes
  totalLatencyMs: number;
}

export interface RecastProgress {
  active: boolean;
  currentPassIndex: number;
  totalPasses: number;
  currentPassName: string;
  statusText: string;
  phase?: 'connecting' | 'thinking' | 'generating' | 'done' | 'error';
  elapsedSec?: number;
  thoughtTokens?: number;
  wordCount?: number;
  streamPreview?: string; // Live snippet of streaming generation
}
