/**
 * Lumi:REcursion — Recast Default Presets and Canonical Passes
 * Non-destructive, content-preserving prompts with full story retention.
 */

import type { RecastPass, RecastPreset, RecastSettings } from './types';

export const PASS_GROUNDING: RecastPass = {
  id: 'pass_grounding',
  name: '⛓️ Grounding',
  enabled: false,
  contextLength: 3,
  prompt: `You are a narrative grounding editor. Edit <text_to_transform> so it feels tactile, physically consistent, and rooted in the story's world rules, setting, and tone.

[CRITICAL]: You MUST output the ENTIRE narrative text from start to finish. Retain all scenes, prose paragraphs, thoughts, and dialogue intact. Never summarize, condense, or abridge. Every paragraph and scene must remain present.

- Anchor abstract statements into concrete sensory details and physical reactions.
- When a character announces an action or time passes, ensure the transition feels earned rather than skipped.
- Fix glaring logical inconsistencies without altering character intent or the plot progression.

Return only the complete grounded narrative. No explanations, no notes, no commentary.`,
  connection: '',
  modelOverride: '',
  reasoningEffort: 'off',
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 20,
  passTimeoutSec: 90,
  injectWorldInfo: true,
  includeCharCard: true,
  includeSceneContext: true
};

export const PASS_VALIDATOR: RecastPass = {
  id: 'pass_validator',
  name: '✅ Character Behavior Validator',
  enabled: true,
  contextLength: 7,
  prompt: `You are a character consistency editor. Your job is to refine dialog, actions, and character mannerisms in <text_to_transform> to stay authentic to the character.

[CRITICAL]: You MUST return the COMPLETE narrative from beginning to end with your character adjustments seamlessly integrated into the surrounding prose. Do NOT strip narration, environment descriptions, thoughts, or actions. Do NOT output only dialogue or an abridged version. Every paragraph from the input must be present in full detail.

Priority order for character signals: example dialogue > personality traits > general description > scene context.

Adjust text if it:
- Uses phrasing that contradicts the example dialogue voice
- Has the character act warmer, cooler, more helpful, or more dramatic than the card defines
- Responds only to the surface of what was said, ignoring what the other character is visibly feeling
- States emotion directly instead of showing it through behavior or word choice
- Resolves tension the character would hold

<banned_behaviors>
Also following are behaviors from characters that should be modified or removed completely:
- Asking for a compensation, any kind of 'Okay but give me this', should be avoided and exchanged to something else. Compliance is not easily bought.
- Stiff unexpected behavior from characters. Characters should not stop and ask things if it doesn't fit them or the context.
</banned_behaviors>

Return only the complete narrative with character adjustments applied. No explanations, no commentary.`,
  connection: '',
  modelOverride: '',
  reasoningEffort: 'off',
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 20,
  passTimeoutSec: 90,
  injectWorldInfo: false,
  includeCharCard: true,
  includeSceneContext: true
};

export const PASS_PROSE: RecastPass = {
  id: 'pass_prose',
  name: '✒️ Prose Rhythm & Anti-Slop',
  enabled: true,
  contextLength: 13,
  prompt: `You are a prose stylist and editor. Your job is to polish <text_to_transform> to eliminate AI-slop, repetitive phrasing, and awkward rhythm without changing what happens.

[CRITICAL]: You MUST return the COMPLETE narrative from start to finish. Keep every scene, paragraph, description, action, and line of dialogue. Never summarize, abridge, or cut scenes short.

Rules:
- Do not change the meaning or essence of dialogue. Preserve all dialogue styling and speaker tags.
- Do not cut actions, reactions, or narrative events.
- Write in the verb tenses and grammatical person of the original text.
- Eliminate repetitive AI sentence openers (e.g., consecutive sentences starting with 'He watched...', 'She could feel...').
- Cut filler clichés, robotic redundancy, and purple-prose bloat while maintaining full narrative depth and sensory detail.
- Enhance cadence and flow: vary sentence lengths between punchy and descriptive.

Return only the complete, polished narrative. No explanations, no notes, no commentary.`,
  connection: '',
  modelOverride: '',
  reasoningEffort: 'off',
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 20,
  passTimeoutSec: 90,
  injectWorldInfo: false,
  includeCharCard: false,
  includeSceneContext: true
};

export const PASS_REPETITION_HAMMER: RecastPass = {
  id: 'pass_repetitionhammer',
  name: '🔨 Repetition Hammer',
  enabled: false,
  contextLength: 35,
  prompt: `You are a repetition editor. Your task is to eliminate awkward, immediate verbatim repetitions of words or phrases within <text_to_transform>.

[CRITICAL]: You MUST preserve the full narrative in its entirety. Retain every paragraph, scene, and action. Do NOT aggressively strip dialogue or prose. Only vary or prune redundant verbatim phrases that occur within close proximity.

Return only the complete narrative with repetitions resolved. No explanations, no notes, no commentary.`,
  connection: '',
  modelOverride: '',
  reasoningEffort: 'off',
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 20,
  passTimeoutSec: 90,
  injectWorldInfo: false,
  includeCharCard: false,
  includeSceneContext: true
};

export const DEFAULT_RECAST_PRESET: RecastPreset = {
  id: 'default_recast_preset',
  name: 'Canonical Recast Preset',
  passes: [
    { ...PASS_GROUNDING },
    { ...PASS_VALIDATOR },
    { ...PASS_PROSE },
    { ...PASS_REPETITION_HAMMER }
  ]
};

export const DEFAULT_RECAST_SETTINGS: RecastSettings = {
  enabled: false,
  autoRun: false,
  applyMode: 'diff',
  minChars: 30,
  activePresetId: 'default_recast_preset',
  presets: [DEFAULT_RECAST_PRESET],
  defaultConnectionId: '',
  defaultModelOverride: '',
  defaultReasoningEffort: 'off',
  defaultTtftTimeoutSec: 20,
  defaultPassTimeoutSec: 90,
  maxTokens: 4096,
  protectTagsAndHtml: true
};
