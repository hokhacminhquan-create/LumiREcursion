/**
 * Lumi:REcursion — Recast Post-Processing Types
 * Ported and adapted from SillyTavern Recast for Lumiverse Spindle
 */

export interface RecastPass {
  id: string;
  name: string;
  enabled: boolean;
  contextLength: number; // Number of recent chat messages to supply as <scene_context>
  prompt: string;        // System prompt with instructions and <text_to_transform>
  prefill?: string;
  prefillRole?: 'assistant' | 'system' | 'user';
  connection?: string;   // Optional Connection Profile ID override
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
}
