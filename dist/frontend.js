// src/cards/catalog.ts
var CARD_SCOPE_CATALOG = Object.freeze([
  {
    family: "Scene Frame",
    role: "sceneFrameCard",
    priority: 100,
    description: "Current location, situation, immediate direction, and hard beat boundary.",
    subItems: [
      {
        key: "locationSituation",
        label: "Location & Situation",
        description: "Current place and setup expanded into nearby routes, sightlines, social exposure, local pressure, and what is relevant now."
      },
      {
        key: "immediateDirection",
        label: "Immediate Direction",
        description: "The next-beat vector the scene is pointing toward, without deciding future plot or skipping player agency."
      },
      {
        key: "beatConstraint",
        label: "Beat Constraint",
        description: "Hard response boundary for this beat, such as answer now, hold before a reveal, avoid time skip, or do not skip a pending payoff."
      }
    ]
  },
  {
    family: "Active Cast",
    role: "activeCastCard",
    priority: 95,
    description: "Who is present, visible state, and current conversational or physical role.",
    subItems: [
      {
        key: "presentCharacters",
        label: "Present Characters",
        description: "Who can act, observe, interrupt, be addressed, or be accidentally dropped from the next response."
      },
      {
        key: "visibleState",
        label: "Visible State",
        description: "Observable condition, posture, injury, mood, constraint, or capability that affects what a character can do now."
      },
      {
        key: "speakerRoles",
        label: "Speaker Roles",
        description: "Who is speaking, addressed, listening, controlling the exchange, or unable to speak."
      }
    ]
  },
  {
    family: "Character Motivation",
    role: "characterMotivationCard",
    priority: 88,
    description: "Observable or safely inferred motives, pressures, hesitations, and goals.",
    subItems: [
      {
        key: "visibleGoals",
        label: "Visible Goals",
        description: "Established visible goals phrased as behavior-facing pressure for the next response."
      },
      {
        key: "pressures",
        label: "Pressures",
        description: "External, social, tactical, or emotional pressures that plausibly shape behavior in this beat."
      },
      {
        key: "hesitationPosture",
        label: "Hesitation & Posture",
        description: "Visible reluctance, guardedness, confidence, uncertainty, or restraint without private mind-reading."
      }
    ]
  },
  {
    family: "Relationship",
    role: "dialogueRelationshipCard",
    priority: 84,
    description: "Current social tension, leverage, promises, conflicts, and speech constraints.",
    subItems: [
      {
        key: "tension",
        label: "Social Tension",
        description: "Current friction, trust, leverage, intimacy, threat, or subtext that creates usable social affordances."
      },
      {
        key: "promisesConflicts",
        label: "Promises & Conflicts",
        description: "Active promises, refusals, debts, threats, disagreements, or obligations that shape what can be said or done next."
      },
      {
        key: "voiceConstraints",
        label: "Speech Constraints",
        description: "Scene-local address, formality, taboo wording, secrecy, or who can safely say what without replacing the preset."
      }
    ]
  },
  {
    family: "Social Subtext",
    role: "socialSubtextCard",
    priority: 82,
    description: "Scene-observable implied social meaning such as humor, veiled pressure, invitation, boundaries, status, and face.",
    subItems: [
      {
        key: "humorIrony",
        label: "Humor & Irony",
        description: "Dry humor, sarcasm, teasing, understatement, or gallows humor when it signals deflection, intimacy, contempt, nervousness, or pressure relief."
      },
      {
        key: "veiledPressure",
        label: "Veiled Pressure",
        description: "Polite threats, friendly warnings, coercion, intimidation, or consequences carried through implication instead of open hostility."
      },
      {
        key: "invitationBoundary",
        label: "Invitation & Boundary",
        description: "Flirtation, charged compliments, testing interest, permission seeking, discomfort, soft refusal, or a cue not to push further."
      },
      {
        key: "statusFace",
        label: "Status & Face",
        description: "Dominance, deference, rank assertion, saving face, public embarrassment, or who is being made to yield in the exchange."
      }
    ]
  },
  {
    family: "Scene Constraints",
    role: "sceneConstraintsCard",
    priority: 98,
    description: "Hard limits, contradiction traps, timing, access, visibility, and plausibility constraints.",
    subItems: [
      {
        key: "hardLimits",
        label: "Hard Limits",
        description: "Injuries, locked routes, missing objects, stated choices, visible limits, or other constraints that would make the next response implausible if missed."
      },
      {
        key: "spatialConstraints",
        label: "Spatial Constraints",
        description: "Movement, reach, visibility, blocked route, distance, and access limits that affect the next beat."
      },
      {
        key: "timelineOrder",
        label: "Timeline & Order",
        description: "Immediate cause and effect, sequence, reveal order, and what has or has not happened yet."
      }
    ]
  },
  {
    family: "Knowledge & Secrets",
    role: "knowledgeSecretsCard",
    priority: 92,
    description: "Concealed facts, who knows or suspects them, mistaken beliefs, and reveal boundaries.",
    subItems: [
      {
        key: "concealedFacts",
        label: "Concealed Facts",
        description: "Hidden truths that may guide guardrails but should not be revealed as dialogue or narration unless earned."
      },
      {
        key: "knowsSuspects",
        label: "Who Knows / Suspects",
        description: "Who knows, suspects, misunderstands, or should not know a fact."
      },
      {
        key: "revealBoundaries",
        label: "Reveal Boundaries",
        description: "What the next response must not reveal, confirm, or imply too early."
      }
    ]
  },
  {
    family: "Consequences",
    role: "clocksConsequencesCard",
    priority: 90,
    description: "Deadlines, countdowns, delayed consequences, and escalation triggers.",
    subItems: [
      {
        key: "deadlinesCountdowns",
        label: "Deadlines & Countdowns",
        description: "Time pressure, countdowns, scheduled events, or windows of opportunity still active."
      },
      {
        key: "delayedConsequences",
        label: "Delayed Consequences",
        description: "Effects from earlier choices that should arrive later or remain pending."
      },
      {
        key: "escalationTriggers",
        label: "Escalation Triggers",
        description: "Conditions that would make the scene worsen, shift phase, or demand action."
      }
    ]
  },
  {
    family: "Environment",
    role: "environmentAffordancesCard",
    priority: 76,
    description: "Spatial layout, sensory texture, hazards, obstacles, exits, and usable environmental affordances.",
    subItems: [
      {
        key: "spatialLayout",
        label: "Spatial Layout",
        description: "Where important places, barriers, exits, cover, and actors are in relation to each other."
      },
      {
        key: "sensoryTexture",
        label: "Sensory Texture",
        description: "Sensory signals (sounds, smells, temperature, lighting) that affect grounding, attention, danger, social context, or available action."
      },
      {
        key: "hazardsAffordances",
        label: "Hazards & Affordances",
        description: "Usable objects, obstacles, threats, exits, cover, tools, and environmental opportunities."
      }
    ]
  },
  {
    family: "Items",
    role: "possessionsItemsCard",
    priority: 78,
    description: "Important held, carried, worn, hidden, lost, stolen, or controlled objects and who has them.",
    subItems: [
      {
        key: "heldCarriedItems",
        label: "Held & Carried Items",
        description: "Important objects currently held, worn, carried, hidden, missing, stolen, or controlled."
      },
      {
        key: "itemLocationControl",
        label: "Location & Control",
        description: "Where an item is and who can realistically access, use, move, or withhold it."
      },
      {
        key: "itemAffordancesRisks",
        label: "Affordances & Risks",
        description: "What an item can do now, what it enables, and what risk or limit it carries."
      }
    ]
  },
  {
    family: "Open Threads",
    role: "openThreadsCard",
    priority: 72,
    description: "Unresolved questions, immediate promises, pending actions, and near-term pressures.",
    subItems: [
      {
        key: "unresolvedQuestions",
        label: "Unresolved Questions",
        description: "Questions raised by the scene that remain visible and may affect the next response."
      },
      {
        key: "pendingActions",
        label: "Pending Actions",
        description: "Promised, attempted, interrupted, or requested actions that should not be forgotten."
      },
      {
        key: "nearTermPressures",
        label: "Near-term Pressures",
        description: "Immediate obligations, looming problems, or choices that should shape the next beat."
      }
    ]
  }
]);
var CATALOG_BY_FAMILY = new Map(CARD_SCOPE_CATALOG.map((c) => [c.family, c]));
var CATALOG_BY_ROLE = new Map(CARD_SCOPE_CATALOG.map((c) => [c.role, c]));

// src/cards/defaults.ts
var DEFAULT_DECK_ID = "default";

// src/recast/defaults.ts
var PASS_GROUNDING = {
  id: "pass_grounding",
  name: "⛓️ Grounding",
  enabled: false,
  contextLength: 3,
  prompt: `You are a narrative grounding editor. Edit <text_to_transform> so it feels tactile, physically consistent, and rooted in the story's world rules, setting, and tone.

[CRITICAL]: You MUST output the ENTIRE narrative text from start to finish. Retain all scenes, prose paragraphs, thoughts, and dialogue intact. Never summarize, condense, or abridge. Every paragraph and scene must remain present.

- Anchor abstract statements into concrete sensory details and physical reactions.
- When a character announces an action or time passes, ensure the transition feels earned rather than skipped.
- Fix glaring logical inconsistencies without altering character intent or the plot progression.

Return only the complete grounded narrative. No explanations, no notes, no commentary.`,
  connection: "",
  modelOverride: "",
  reasoningEffort: "off",
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 30,
  passTimeoutSec: 60,
  injectWorldInfo: true,
  includeCharCard: true,
  includeSceneContext: true
};
var PASS_VALIDATOR = {
  id: "pass_validator",
  name: "✅ Character Behavior Validator",
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
  connection: "",
  modelOverride: "",
  reasoningEffort: "off",
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 30,
  passTimeoutSec: 60,
  injectWorldInfo: false,
  includeCharCard: true,
  includeSceneContext: true
};
var PASS_PROSE = {
  id: "pass_prose",
  name: "✒️ Prose Rhythm & Anti-Slop",
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
  connection: "",
  modelOverride: "",
  reasoningEffort: "off",
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 30,
  passTimeoutSec: 60,
  injectWorldInfo: false,
  includeCharCard: false,
  includeSceneContext: true
};
var PASS_REPETITION_HAMMER = {
  id: "pass_repetitionhammer",
  name: "\uD83D\uDD28 Repetition Hammer",
  enabled: false,
  contextLength: 35,
  prompt: `You are a repetition editor. Your task is to eliminate awkward, immediate verbatim repetitions of words or phrases within <text_to_transform>.

[CRITICAL]: You MUST preserve the full narrative in its entirety. Retain every paragraph, scene, and action. Do NOT aggressively strip dialogue or prose. Only vary or prune redundant verbatim phrases that occur within close proximity.

Return only the complete narrative with repetitions resolved. No explanations, no notes, no commentary.`,
  connection: "",
  modelOverride: "",
  reasoningEffort: "off",
  maxTokens: 4096,
  temperature: 0.3,
  ttftTimeoutSec: 30,
  passTimeoutSec: 60,
  injectWorldInfo: false,
  includeCharCard: false,
  includeSceneContext: true
};
var DEFAULT_RECAST_PRESET = {
  id: "default_recast_preset",
  name: "Canonical Recast Preset",
  passes: [
    { ...PASS_GROUNDING },
    { ...PASS_VALIDATOR },
    { ...PASS_PROSE },
    { ...PASS_REPETITION_HAMMER }
  ]
};
var DEFAULT_RECAST_SETTINGS = {
  enabled: false,
  autoRun: false,
  applyMode: "diff",
  minChars: 30,
  activePresetId: "default_recast_preset",
  presets: [DEFAULT_RECAST_PRESET],
  defaultConnectionId: "",
  defaultModelOverride: "",
  defaultReasoningEffort: "off",
  defaultTtftTimeoutSec: 30,
  defaultPassTimeoutSec: 60,
  maxTokens: 4096,
  protectTagsAndHtml: true
};

// src/recast/styles.ts
var RECAST_STYLES = `
/* ── Tab Navigation ── */
.lr-tab-nav {
  display: flex;
  background: #202020;
  border: 1px solid #383838;
  border-radius: 6px;
  padding: 3px;
  gap: 4px;
  margin-bottom: 4px;
}

.lr-tab-btn {
  flex: 1;
  text-align: center;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  color: #999;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
  user-select: none;
}

.lr-tab-btn:hover {
  background: #282828;
  color: #eee;
}

.lr-tab-btn.active {
  background: rgba(101, 214, 232, 0.15);
  color: #65d6e8;
  border-color: #65d6e8;
}

.lr-tab-btn.active-recast {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  border-color: #a78bfa;
}

/* ── Recast Pass List ── */
.recast-pass-item {
  background: #222222;
  border: 1px solid #353535;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.15s ease;
}

.recast-pass-item:hover {
  border-color: #484848;
}

.recast-pass-item.disabled {
  opacity: 0.6;
}

.recast-pass-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.recast-pass-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.recast-pass-name {
  font-size: 12px;
  font-weight: 600;
  color: #e2e2e2;
  flex: 1;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 4px;
}

.recast-pass-name:focus {
  background: #181818;
  border-color: #555;
  outline: none;
  color: #fff;
}

.recast-pass-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.recast-btn-icon {
  background: #2a2a2a;
  border: 1px solid #3c3c3c;
  color: #aaa;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.recast-btn-icon:hover {
  background: #363636;
  color: #fff;
  border-color: #555;
}

.recast-pass-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid #2e2e2e;
  margin-top: 2px;
}

.recast-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.recast-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 4px 0;
}

.recast-checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #bbb;
  cursor: pointer;
}

.recast-textarea {
  width: 100%;
  box-sizing: border-box;
  background: #181818;
  border: 1px solid #383838;
  color: #ddd;
  border-radius: 5px;
  padding: 7px 9px;
  font-size: 11.5px;
  font-family: inherit;
  line-height: 1.4;
  resize: vertical;
  min-height: 80px;
  outline: none;
}

.recast-textarea:focus {
  border-color: #a78bfa;
}

/* ── Recast Hero / Progress Bar ── */
.recast-progress-bar {
  background: #242424;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.recast-pulse {
  animation: rc-pulse 1.2s infinite alternate;
}

@keyframes rc-pulse {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* ── Interactive Diff Review Modal ── */
#recast_diff_backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  animation: rc-fade-in 0.2s ease;
}

#recast_diff_modal {
  position: relative;
  width: 90vw;
  height: 88vh;
  max-width: 1400px;
  background: #1a1a1f;
  border: 1px solid #3e3e48;
  border-radius: 10px;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: rc-slide-up 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  color: #dcdcdc;
  font-family: var(--mainFontFamily, "Noto Sans", -apple-system, sans-serif);
}

@keyframes rc-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes rc-slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.rc-diff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 1px solid #33333d;
  background: #202026;
  flex-shrink: 0;
}

.rc-diff-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #eee;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rc-diff-close-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 5px;
  line-height: 1;
  transition: all 0.15s;
}

.rc-diff-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Steps Bar */
.rc-diff-steps-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  background: #1c1c22;
  border-bottom: 1px solid #2d2d36;
  flex-shrink: 0;
  overflow-x: auto;
}

.rc-diff-step-btn {
  background: #25252d;
  border: 1px solid #383842;
  color: #aaa;
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.rc-diff-step-btn:hover {
  background: #30303a;
  color: #eee;
}

.rc-diff-step-btn.active {
  background: rgba(167, 139, 250, 0.2);
  border-color: #a78bfa;
  color: #c4b5fd;
}

/* Modal Body */
.rc-diff-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 12px 16px;
  gap: 12px;
}

.rc-diff-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.rc-diff-panel-header {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 12px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.rc-diff-original-header {
  background: rgba(220, 60, 60, 0.16);
  color: #f28b82;
  border-bottom: 2px solid rgba(220, 60, 60, 0.4);
}

.rc-diff-transformed-header {
  background: rgba(50, 200, 100, 0.14);
  color: #81c995;
  border-bottom: 2px solid rgba(50, 200, 100, 0.4);
}

.rc-diff-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  background: #141418;
  border: 1px solid #33333e;
  border-top: none;
  border-radius: 0 0 6px 6px;
  font-size: 12.5px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: #d8d8d8;
}

.rc-diff-textarea {
  flex: 1;
  resize: none;
  font-family: inherit;
  font-size: 12.5px;
  line-height: 1.7;
  padding: 12px 14px;
  background: #141418 !important;
  color: #eee !important;
  border: 1px solid #33333e !important;
  border-top: none !important;
  border-radius: 0 0 6px 6px !important;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.rc-diff-textarea:focus {
  border-color: #a78bfa !important;
}

/* Diff highlights */
del.rc-del {
  background: rgba(220, 50, 50, 0.3);
  color: #ff9999;
  text-decoration: line-through;
  padding: 1px 3px;
  border-radius: 2px;
}

ins.rc-ins {
  background: rgba(50, 190, 100, 0.3);
  color: #90f0a8;
  text-decoration: none;
  font-weight: 600;
  padding: 1px 3px;
  border-radius: 2px;
}

/* Modal Footer */
.rc-diff-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-top: 1px solid #33333d;
  background: #202026;
  flex-shrink: 0;
}

.rc-diff-btn {
  padding: 7px 18px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.rc-diff-accept-btn {
  background: rgba(50, 190, 100, 0.2);
  border: 1px solid rgba(50, 190, 100, 0.5);
  color: #81c995;
}

.rc-diff-accept-btn:hover {
  background: rgba(50, 190, 100, 0.35);
  color: #fff;
}

.rc-diff-swipe-btn {
  background: rgba(167, 139, 250, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.5);
  color: #c4b5fd;
}

.rc-diff-swipe-btn:hover {
  background: rgba(167, 139, 250, 0.35);
  color: #fff;
}

.rc-diff-reject-btn {
  background: #28282e;
  border: 1px solid #3e3e48;
  color: #aaa;
}

.rc-diff-reject-btn:hover {
  background: #34343c;
  color: #eee;
}

/* ── Model Picker Modal Styles ── */
.rc-model-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.rc-model-modal {
  background: #18181c;
  border: 1px solid #383844;
  border-radius: 8px;
  width: 95%;
  max-width: 620px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
  overflow: hidden;
  font-family: inherit;
}

.rc-model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #282832;
  background: #1f1f26;
}

.rc-model-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rc-model-title {
  font-size: 14px;
  font-weight: 700;
  color: #e2e2e8;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rc-model-subtitle {
  font-size: 11px;
  color: #999;
}

.rc-model-search-bar {
  padding: 10px 18px 6px;
  background: #18181c;
}

.rc-model-search-input {
  width: 100%;
  padding: 8px 12px;
  background: #22222a;
  border: 1px solid #3c3c4a;
  border-radius: 5px;
  font-size: 12.5px;
  color: #eee;
  outline: none;
  transition: border-color 0.15s ease;
}

.rc-model-search-input:focus {
  border-color: #a78bfa;
}

.rc-model-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 4px 18px 10px;
  border-bottom: 1px solid #282832;
  background: #18181c;
}

.rc-model-tag-btn {
  background: #23232b;
  border: 1px solid #363644;
  color: #aaa;
  border-radius: 4px;
  font-size: 10.5px;
  padding: 3px 8px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.rc-model-tag-btn:hover {
  background: #2c2c36;
  color: #eee;
}

.rc-model-tag-btn.active {
  background: rgba(167, 139, 250, 0.2);
  border-color: #a78bfa;
  color: #c4b5fd;
  font-weight: 600;
}

.rc-model-clear-btn {
  margin-left: auto;
  border-color: #553333;
  color: #ff9999;
}

.rc-model-clear-btn:hover {
  background: rgba(255, 100, 100, 0.15);
  border-color: #ff6666;
  color: #ffaaaa;
}

.rc-model-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 14px;
  min-height: 200px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rc-model-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  background: #1f1f26;
  border: 1px solid #2e2e3a;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.rc-model-item:hover {
  background: #282834;
  border-color: #4c4c60;
  transform: translateX(2px);
}

.rc-model-item.selected {
  background: rgba(167, 139, 250, 0.15);
  border-color: #a78bfa;
}

.rc-model-item-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.rc-model-item-id {
  font-family: 'Consolas', 'Menlo', 'Monaco', monospace;
  font-size: 11.5px;
  color: #d6d6e2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rc-model-item-label {
  font-size: 10px;
  color: #8a8a9a;
}

.rc-model-item-badge {
  font-size: 9.5px;
  font-weight: 600;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.4);
  padding: 1px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.rc-model-empty {
  text-align: center;
  color: #777;
  font-size: 12px;
  padding: 30px 10px;
}

.rc-model-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  border-top: 1px solid #282832;
  background: #1f1f26;
}

.rc-model-count-text {
  font-size: 11px;
  color: #888;
}

/* Row with Fetch Button */
.recast-model-input-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.recast-btn-fetch {
  background: rgba(167, 139, 250, 0.12);
  border: 1px solid rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}

.recast-btn-fetch:hover {
  background: rgba(167, 139, 250, 0.25);
  border-color: #a78bfa;
  color: #fff;
}

.recast-btn-fetch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

// src/recast/model-picker-modal.ts
var activeModelBackdropEl = null;
function closeModelPickerModal() {
  if (activeModelBackdropEl && activeModelBackdropEl.parentElement) {
    activeModelBackdropEl.remove();
  }
  activeModelBackdropEl = null;
  const host = document.getElementById("recursion-modal-host");
  if (host) {
    host.classList.remove("active");
  }
}
function showModelPickerModal(options) {
  closeModelPickerModal();
  const { title, connectionName, models, labels = {}, currentValue = "", onSelect } = options;
  let host = document.getElementById("recursion-modal-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "recursion-modal-host";
    document.body.appendChild(host);
  }
  host.classList.add("active");
  const backdrop = document.createElement("div");
  backdrop.id = "recast_model_backdrop";
  backdrop.className = "rc-model-backdrop";
  activeModelBackdropEl = backdrop;
  const modal = document.createElement("div");
  modal.id = "recast_model_modal";
  modal.className = "rc-model-modal";
  modal.onclick = (e) => e.stopPropagation();
  const header = document.createElement("div");
  header.className = "rc-model-header";
  const titleGroup = document.createElement("div");
  titleGroup.className = "rc-model-title-group";
  titleGroup.innerHTML = `
    <div class="rc-model-title">\uD83C\uDF10 ${title || "Select Model Override"}</div>
    <div class="rc-model-subtitle">Connection: <strong>${escapeHtml(connectionName)}</strong> · ${models.length} models fetched</div>
  `;
  header.appendChild(titleGroup);
  const closeBtn = document.createElement("button");
  closeBtn.className = "rc-diff-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.title = "Close";
  closeBtn.onclick = closeModelPickerModal;
  header.appendChild(closeBtn);
  modal.appendChild(header);
  const searchBar = document.createElement("div");
  searchBar.className = "rc-model-search-bar";
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "rc-model-search-input";
  searchInput.placeholder = "\uD83D\uDD0E Filter models (e.g. flash, deepseek, gemini, claude, 4o)...";
  searchBar.appendChild(searchInput);
  modal.appendChild(searchBar);
  const tagsRow = document.createElement("div");
  tagsRow.className = "rc-model-tags-row";
  const families = ["All", "Gemini", "DeepSeek", "Claude", "GPT", "Qwen", "Llama", "Grok", "Mistral"];
  let activeTag = "All";
  const tagButtons = [];
  families.forEach((fam) => {
    const btn = document.createElement("button");
    btn.className = `rc-model-tag-btn ${fam === "All" ? "active" : ""}`;
    btn.textContent = fam;
    btn.onclick = () => {
      activeTag = fam;
      tagButtons.forEach((b) => b.classList.toggle("active", b === btn));
      renderList();
    };
    tagButtons.push(btn);
    tagsRow.appendChild(btn);
  });
  const clearBtn = document.createElement("button");
  clearBtn.className = "rc-model-tag-btn rc-model-clear-btn";
  clearBtn.innerHTML = "∅ Reset (Inherit)";
  clearBtn.title = "Clear model override and inherit connection default";
  clearBtn.onclick = () => {
    onSelect("");
    closeModelPickerModal();
  };
  tagsRow.appendChild(clearBtn);
  modal.appendChild(tagsRow);
  const listContainer = document.createElement("div");
  listContainer.className = "rc-model-list-container";
  modal.appendChild(listContainer);
  const footer = document.createElement("div");
  footer.className = "rc-model-footer";
  const countSpan = document.createElement("span");
  countSpan.className = "rc-model-count-text";
  footer.appendChild(countSpan);
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "rc-diff-btn rc-diff-reject-btn";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = closeModelPickerModal;
  footer.appendChild(cancelBtn);
  modal.appendChild(footer);
  const renderList = () => {
    const query = searchInput.value.trim().toLowerCase();
    listContainer.innerHTML = "";
    const filtered = models.filter((m) => {
      const label = (labels[m] || "").toLowerCase();
      const lowerM = m.toLowerCase();
      if (activeTag !== "All") {
        const tagLower = activeTag.toLowerCase();
        if (!lowerM.includes(tagLower) && !label.includes(tagLower)) {
          return false;
        }
      }
      if (!query)
        return true;
      return lowerM.includes(query) || label.includes(query);
    });
    countSpan.textContent = `Showing ${filtered.length} of ${models.length} models`;
    if (filtered.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "rc-model-empty";
      emptyDiv.textContent = "No matching models found.";
      listContainer.appendChild(emptyDiv);
      return;
    }
    filtered.forEach((modelId) => {
      const item = document.createElement("div");
      item.className = `rc-model-item ${modelId === currentValue ? "selected" : ""}`;
      const label = labels[modelId];
      item.innerHTML = `
        <div class="rc-model-item-main">
          <div class="rc-model-item-id">${escapeHtml(modelId)}</div>
          ${label ? `<div class="rc-model-item-label">${escapeHtml(label)}</div>` : ""}
        </div>
        ${modelId === currentValue ? '<span class="rc-model-item-badge">Active</span>' : ""}
      `;
      item.onclick = () => {
        onSelect(modelId);
        closeModelPickerModal();
      };
      listContainer.appendChild(item);
    });
  };
  searchInput.oninput = () => renderList();
  renderList();
  backdrop.appendChild(modal);
  backdrop.onclick = closeModelPickerModal;
  document.body.appendChild(backdrop);
  setTimeout(() => {
    searchInput.focus();
  }, 50);
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// src/recast/recast-panel.ts
var connectionModelsCache = new Map;
async function fetchConnectionModels(connectionId) {
  if (connectionModelsCache.has(connectionId)) {
    return connectionModelsCache.get(connectionId);
  }
  const res = await fetch(`/api/v1/connections/${encodeURIComponent(connectionId)}/models`, {
    credentials: "include"
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  const models = Array.isArray(data.models) ? data.models : [];
  const labels = data.model_labels && typeof data.model_labels === "object" ? data.model_labels : {};
  const result = { models, labels };
  connectionModelsCache.set(connectionId, result);
  return result;
}
function createModelOverrideInputGroup(opts) {
  const container = document.createElement("div");
  container.className = "recast-model-input-group";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "lr-select";
  input.style.flex = "1";
  input.placeholder = opts.placeholder;
  input.value = opts.value || "";
  input.setAttribute("list", opts.datalistId);
  let datalist = document.getElementById(opts.datalistId);
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = opts.datalistId;
    document.body.appendChild(datalist);
  }
  const populateDatalist = (models, labels) => {
    datalist.innerHTML = "";
    models.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      if (labels[m]) {
        opt.label = labels[m];
      }
      datalist.appendChild(opt);
    });
  };
  const initialConnId = opts.getConnectionId();
  if (initialConnId && connectionModelsCache.has(initialConnId)) {
    const cached = connectionModelsCache.get(initialConnId);
    populateDatalist(cached.models, cached.labels);
  }
  input.onchange = () => {
    opts.onSave(input.value.trim());
  };
  const fetchBtn = document.createElement("button");
  fetchBtn.type = "button";
  fetchBtn.className = "recast-btn-fetch";
  fetchBtn.innerHTML = `<span>\uD83D\uDD0D Fetch Models</span>`;
  fetchBtn.title = "Fetch available models from the provider connection link and browse/search";
  fetchBtn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const connId = opts.getConnectionId();
    if (!connId) {
      opts.hostCtx?.toast?.error?.("Please select or configure a Connection Profile first.");
      return;
    }
    const connName = opts.getConnectionName() || "Connection";
    const originalHtml = fetchBtn.innerHTML;
    fetchBtn.disabled = true;
    fetchBtn.innerHTML = `<span>⏳ Fetching...</span>`;
    try {
      const { models, labels } = await fetchConnectionModels(connId);
      populateDatalist(models, labels);
      showModelPickerModal({
        title: "Select Model Override",
        connectionName: connName,
        models,
        labels,
        currentValue: input.value.trim(),
        onSelect: (selectedModelId) => {
          input.value = selectedModelId;
          opts.onSave(selectedModelId);
          opts.hostCtx?.toast?.info?.(selectedModelId ? `✨ Model override set to: ${selectedModelId}` : "✨ Model override cleared (inheriting connection default)");
        }
      });
    } catch (err) {
      console.error("[Lumi:REcursion:Recast] Failed to fetch models:", err);
      opts.hostCtx?.toast?.error?.(`Failed to fetch models from provider: ${err?.message || err}`);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.innerHTML = originalHtml;
    }
  };
  container.appendChild(input);
  container.appendChild(fetchBtn);
  return container;
}
var expandedPasses = new Set;
function renderRecastPanel(container, state) {
  const { recastSettings, recastProgress, availableConnections, hostCtx, onRefresh } = state;
  const activePreset = recastSettings.presets.find((p) => p.id === recastSettings.activePresetId) || recastSettings.presets[0];
  const bar = document.createElement("div");
  bar.className = "lr-bar";
  const barLeft = document.createElement("div");
  barLeft.className = "lr-bar-left";
  const toggleLabel = document.createElement("label");
  toggleLabel.className = "lr-toggle";
  toggleLabel.title = "Toggle Recast post-processing pipeline";
  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";
  toggleInput.checked = recastSettings.enabled;
  toggleInput.onchange = () => {
    const next = toggleInput.checked;
    recastSettings.enabled = next;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { enabled: next }
    });
    hostCtx?.toast?.info?.(next ? "✨ Recast post-processing enabled" : "✨ Recast disabled");
    onRefresh();
  };
  const toggleSlider = document.createElement("span");
  toggleSlider.className = "lr-toggle-slider";
  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(toggleSlider);
  barLeft.appendChild(toggleLabel);
  const titleSpan = document.createElement("span");
  titleSpan.style.fontWeight = "700";
  titleSpan.style.fontSize = "12px";
  titleSpan.style.color = recastSettings.enabled ? "#a78bfa" : "#777";
  titleSpan.textContent = "Recast Pipeline";
  barLeft.appendChild(titleSpan);
  const modeBadge = document.createElement("span");
  modeBadge.className = "lr-badge";
  modeBadge.style.color = "#c4b5fd";
  modeBadge.style.borderColor = "rgba(167, 139, 250, 0.4)";
  modeBadge.style.background = "rgba(167, 139, 250, 0.15)";
  modeBadge.textContent = recastSettings.applyMode.toUpperCase();
  modeBadge.title = `Apply Mode: ${recastSettings.applyMode}`;
  barLeft.appendChild(modeBadge);
  bar.appendChild(barLeft);
  const barRight = document.createElement("div");
  barRight.className = "lr-bar-right";
  const runNowBtn = document.createElement("button");
  runNowBtn.className = "lr-btn lr-btn-primary";
  runNowBtn.style.background = "rgba(167, 139, 250, 0.2)";
  runNowBtn.style.borderColor = "#a78bfa";
  runNowBtn.style.color = "#c4b5fd";
  runNowBtn.innerHTML = `<span>✨ Recast Latest Message</span>`;
  runNowBtn.title = "Run the full Recast pipeline on the latest assistant message now";
  runNowBtn.onclick = () => {
    const activeChat = hostCtx?.getActiveChat?.();
    const chatId = activeChat?.chatId || activeChat?.id || undefined;
    hostCtx?.sendToBackend({
      type: "RECAST_RUN_MESSAGE",
      chatId
    });
  };
  barRight.appendChild(runNowBtn);
  bar.appendChild(barRight);
  container.appendChild(bar);
  if (recastProgress && recastProgress.active) {
    const progBox = document.createElement("div");
    progBox.className = "recast-progress-bar recast-pulse";
    progBox.style.borderColor = "#a78bfa";
    progBox.style.background = "rgba(167, 139, 250, 0.08)";
    const phaseColor = recastProgress.phase === "thinking" ? "#fbbf24" : recastProgress.phase === "generating" ? "#34d399" : "#a78bfa";
    const phaseLabel = recastProgress.phase === "thinking" ? "\uD83D\uDCAD Thinking" : recastProgress.phase === "generating" ? "\uD83D\uDCDD Generating" : "⏳ Connecting";
    progBox.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:#a78bfa;font-weight:700;">⚙️ [Pass ${recastProgress.currentPassIndex}/${recastProgress.totalPasses}]</span>
          <span style="font-size:12px;color:#eee;font-weight:600;">${recastProgress.currentPassName}</span>
          <span class="lr-badge" style="background:rgba(0,0,0,0.3);color:${phaseColor};border-color:${phaseColor};">
            ${phaseLabel}
          </span>
        </div>
        <span style="font-size:11px;font-family:monospace;color:#a78bfa;font-weight:600;">
          ${recastProgress.elapsedSec !== undefined ? `${recastProgress.elapsedSec.toFixed(1)}s` : ""}
        </span>
      </div>

      <div style="display:flex;align-items:center;gap:12px;font-size:11px;color:#bbb;margin-bottom:4px;">
        ${recastProgress.thoughtTokens ? `<span style="color:#fbbf24;">\uD83D\uDCAD Thought tokens: <b>${recastProgress.thoughtTokens}</b></span>` : ""}
        ${recastProgress.wordCount ? `<span style="color:#34d399;">\uD83D\uDCDD Output words: <b>${recastProgress.wordCount}</b></span>` : ""}
      </div>

      <div style="font-size:11.5px;color:#ddd;margin-bottom:6px;">${recastProgress.statusText}</div>

      ${recastProgress.streamPreview ? `
        <div style="font-family:monospace;font-size:10.5px;color:#a5f3fc;background:#141416;border-radius:4px;padding:5px 8px;max-height:42px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid #333;margin-bottom:6px;">
          ${recastProgress.streamPreview}
        </div>
      ` : ""}

      <div style="background:#262626;height:4px;border-radius:2px;overflow:hidden;">
        <div style="background:#a78bfa;height:100%;width:${recastProgress.currentPassIndex / recastProgress.totalPasses * 100}%;transition:width 0.3s ease;"></div>
      </div>
    `;
    container.appendChild(progBox);
  }
  const settingsPanel = document.createElement("div");
  settingsPanel.className = "lr-panel";
  const sHeader = document.createElement("div");
  sHeader.className = "lr-panel-header";
  sHeader.innerHTML = `<span>⚙️ Pipeline Settings & Model Speed Controls</span>`;
  settingsPanel.appendChild(sHeader);
  const sBody = document.createElement("div");
  sBody.className = "lr-panel-body";
  const row1 = document.createElement("div");
  row1.className = "recast-row-2col";
  const modeCol = document.createElement("div");
  modeCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Apply Mode:</label>`;
  const modeSelect = document.createElement("select");
  modeSelect.className = "lr-select";
  const modes = [
    { id: "diff", label: "Review in Diff Modal" },
    { id: "replace", label: "Auto-Replace In-Place" },
    { id: "swipe", label: "Auto-Add as Swipe" }
  ];
  modes.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label;
    opt.selected = m.id === recastSettings.applyMode;
    modeSelect.appendChild(opt);
  });
  modeSelect.onchange = () => {
    recastSettings.applyMode = modeSelect.value;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { applyMode: modeSelect.value }
    });
    onRefresh();
  };
  modeCol.appendChild(modeSelect);
  row1.appendChild(modeCol);
  const minCharCol = document.createElement("div");
  minCharCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Min Characters to Trigger:</label>`;
  const minCharInput = document.createElement("input");
  minCharInput.type = "number";
  minCharInput.className = "lr-select";
  minCharInput.value = String(recastSettings.minChars ?? 30);
  minCharInput.min = "0";
  minCharInput.max = "5000";
  minCharInput.onchange = () => {
    const val = parseInt(minCharInput.value, 10) || 0;
    recastSettings.minChars = val;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { minChars: val }
    });
  };
  minCharCol.appendChild(minCharInput);
  row1.appendChild(minCharCol);
  sBody.appendChild(row1);
  const row2 = document.createElement("div");
  row2.className = "recast-row-2col";
  const connCol = document.createElement("div");
  connCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Default Connection Profile:</label>`;
  const connSelect = document.createElement("select");
  connSelect.className = "lr-select";
  const defConnOpt = document.createElement("option");
  defConnOpt.value = "";
  defConnOpt.textContent = "Use System Default Connection";
  connSelect.appendChild(defConnOpt);
  availableConnections.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.provider || "custom"})${c.is_default ? " [Default]" : ""}`;
    opt.selected = c.id === (recastSettings.defaultConnectionId || "");
    connSelect.appendChild(opt);
  });
  connSelect.onchange = () => {
    recastSettings.defaultConnectionId = connSelect.value;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { defaultConnectionId: connSelect.value }
    });
  };
  connCol.appendChild(connSelect);
  row2.appendChild(connCol);
  const modelCol = document.createElement("div");
  modelCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Default Model Override:</label>`;
  const modelGroup = createModelOverrideInputGroup({
    value: recastSettings.defaultModelOverride || "",
    placeholder: "(Inherit from Connection Profile)",
    datalistId: "lr-datalist-global-models",
    getConnectionId: () => recastSettings.defaultConnectionId || availableConnections.find((c) => c.is_default)?.id || availableConnections[0]?.id || "",
    getConnectionName: () => {
      const id = recastSettings.defaultConnectionId;
      const found = availableConnections.find((c) => c.id === id) || availableConnections.find((c) => c.is_default) || availableConnections[0];
      return found?.name || "Default Connection";
    },
    onSave: (val) => {
      recastSettings.defaultModelOverride = val;
      hostCtx?.sendToBackend({
        type: "RECAST_UPDATE_SETTINGS",
        settings: { defaultModelOverride: val }
      });
    },
    hostCtx
  });
  modelCol.appendChild(modelGroup);
  row2.appendChild(modelCol);
  sBody.appendChild(row2);
  const row3 = document.createElement("div");
  row3.style.display = "grid";
  row3.style.gridTemplateColumns = "1.3fr 1fr 1fr";
  row3.style.gap = "10px";
  row3.style.marginBottom = "10px";
  const reasonCol = document.createElement("div");
  reasonCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Reasoning / Thinking Effort:</label>`;
  const reasonSelect = document.createElement("select");
  reasonSelect.className = "lr-select";
  const reasonEfforts = [
    { id: "off", label: "\uD83D\uDE80 Off (Fastest — No Thinking Phase)" },
    { id: "inherit", label: "Inherit Connection Default" },
    { id: "low", label: "⚡ Low Thinking Budget" },
    { id: "medium", label: "Medium Thinking Budget" },
    { id: "high", label: "High Thinking Budget" }
  ];
  reasonEfforts.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.id;
    opt.textContent = r.label;
    opt.selected = r.id === (recastSettings.defaultReasoningEffort || "off");
    reasonSelect.appendChild(opt);
  });
  reasonSelect.onchange = () => {
    recastSettings.defaultReasoningEffort = reasonSelect.value;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { defaultReasoningEffort: reasonSelect.value }
    });
  };
  reasonCol.appendChild(reasonSelect);
  row3.appendChild(reasonCol);
  const ttftCol = document.createElement("div");
  ttftCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">First Word Timeout (TTFT s):</label>`;
  const ttftInput = document.createElement("input");
  ttftInput.type = "number";
  ttftInput.className = "lr-select";
  ttftInput.min = "5";
  ttftInput.max = "120";
  ttftInput.value = String(recastSettings.defaultTtftTimeoutSec ?? 30);
  ttftInput.title = "Abort pass if no response begins within this many seconds";
  ttftInput.onchange = () => {
    const val = parseInt(ttftInput.value, 10) || 30;
    recastSettings.defaultTtftTimeoutSec = val;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { defaultTtftTimeoutSec: val }
    });
  };
  ttftCol.appendChild(ttftInput);
  row3.appendChild(ttftCol);
  const inactCol = document.createElement("div");
  inactCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Inactivity Timeout (s):</label>`;
  const inactInput = document.createElement("input");
  inactInput.type = "number";
  inactInput.className = "lr-select";
  inactInput.min = "10";
  inactInput.max = "300";
  inactInput.value = String(recastSettings.defaultPassTimeoutSec ?? 60);
  inactInput.title = "Timeout in seconds if no new tokens or reasoning are received. Resets continuously as tokens stream in.";
  inactInput.onchange = () => {
    const val = parseInt(inactInput.value, 10) || 60;
    recastSettings.defaultPassTimeoutSec = val;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { defaultPassTimeoutSec: val }
    });
  };
  inactCol.appendChild(inactInput);
  row3.appendChild(inactCol);
  sBody.appendChild(row3);
  const autoRunLabel = document.createElement("label");
  autoRunLabel.style.display = "flex";
  autoRunLabel.style.alignItems = "center";
  autoRunLabel.style.gap = "6px";
  autoRunLabel.style.fontSize = "11.5px";
  autoRunLabel.style.color = "#ccc";
  autoRunLabel.style.cursor = "pointer";
  autoRunLabel.style.marginTop = "4px";
  const autoRunCheckbox = document.createElement("input");
  autoRunCheckbox.type = "checkbox";
  autoRunCheckbox.checked = recastSettings.autoRun;
  autoRunCheckbox.onchange = () => {
    recastSettings.autoRun = autoRunCheckbox.checked;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { autoRun: autoRunCheckbox.checked }
    });
  };
  autoRunLabel.appendChild(autoRunCheckbox);
  autoRunLabel.appendChild(document.createTextNode("Auto-run Recast pipeline when generation ends"));
  sBody.appendChild(autoRunLabel);
  const protectLabel = document.createElement("label");
  protectLabel.style.display = "flex";
  protectLabel.style.alignItems = "center";
  protectLabel.style.gap = "6px";
  protectLabel.style.fontSize = "11.5px";
  protectLabel.style.color = "#ccc";
  protectLabel.style.cursor = "pointer";
  protectLabel.style.marginTop = "6px";
  const protectCheckbox = document.createElement("input");
  protectCheckbox.type = "checkbox";
  protectCheckbox.checked = recastSettings.protectTagsAndHtml !== false;
  protectCheckbox.onchange = () => {
    recastSettings.protectTagsAndHtml = protectCheckbox.checked;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { protectTagsAndHtml: protectCheckbox.checked }
    });
    hostCtx?.toast?.info?.(protectCheckbox.checked ? "\uD83D\uDEE1️ Protected tags, CYOA, GABI metadata & JSON blocks enabled" : "⚠️ Block protection disabled (raw message will be sent to LLM)");
  };
  protectLabel.appendChild(protectCheckbox);
  protectLabel.appendChild(document.createTextNode("\uD83D\uDEE1️ Protect HTML tags, CYOA widgets, GABI metadata & JSON state blocks"));
  sBody.appendChild(protectLabel);
  const presetBar = document.createElement("div");
  presetBar.className = "lr-deck-bar";
  presetBar.style.marginTop = "8px";
  const presetSelect = document.createElement("select");
  presetSelect.className = "lr-select";
  recastSettings.presets.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.passes.filter((x) => x.enabled).length}/${p.passes.length} passes)`;
    opt.selected = p.id === activePreset.id;
    presetSelect.appendChild(opt);
  });
  presetSelect.onchange = () => {
    recastSettings.activePresetId = presetSelect.value;
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_SETTINGS",
      settings: { activePresetId: presetSelect.value }
    });
    onRefresh();
  };
  presetBar.appendChild(presetSelect);
  const newPresetBtn = document.createElement("button");
  newPresetBtn.className = "lr-btn";
  newPresetBtn.textContent = "+ New";
  newPresetBtn.title = "Create a new preset";
  newPresetBtn.onclick = () => {
    const name = prompt("Enter name for the new Recast preset:", "Custom Recast Preset");
    if (name) {
      hostCtx?.sendToBackend({ type: "RECAST_CREATE_PRESET", name });
    }
  };
  presetBar.appendChild(newPresetBtn);
  const resetBtn = document.createElement("button");
  resetBtn.className = "lr-btn";
  resetBtn.textContent = "Reset";
  resetBtn.title = "Reset presets to canonical default";
  resetBtn.onclick = () => {
    if (confirm("Reset all Recast presets to canonical defaults?")) {
      hostCtx?.sendToBackend({ type: "RECAST_RESET_PRESET" });
    }
  };
  presetBar.appendChild(resetBtn);
  if (recastSettings.presets.length > 1) {
    const delBtn = document.createElement("button");
    delBtn.className = "lr-btn";
    delBtn.style.color = "#ff8a8a";
    delBtn.textContent = "✕";
    delBtn.title = "Delete active preset";
    delBtn.onclick = () => {
      if (confirm(`Delete preset "${activePreset.name}"?`)) {
        hostCtx?.sendToBackend({
          type: "RECAST_DELETE_PRESET",
          presetId: activePreset.id
        });
      }
    };
    presetBar.appendChild(delBtn);
  }
  sBody.appendChild(presetBar);
  settingsPanel.appendChild(sBody);
  container.appendChild(settingsPanel);
  const passesPanel = document.createElement("div");
  passesPanel.className = "lr-panel";
  const passesHeader = document.createElement("div");
  passesHeader.className = "lr-panel-header";
  const enabledCount = activePreset.passes.filter((p) => p.enabled).length;
  passesHeader.innerHTML = `
    <span>Passes in Preset (${enabledCount}/${activePreset.passes.length} Active)</span>
  `;
  const addPassBtn = document.createElement("button");
  addPassBtn.className = "lr-btn lr-btn-primary";
  addPassBtn.style.padding = "2px 8px";
  addPassBtn.style.fontSize = "11px";
  addPassBtn.textContent = "+ Add Pass";
  addPassBtn.onclick = (e) => {
    e.stopPropagation();
    const newPass = {
      id: `pass_${Date.now()}`,
      name: "New Custom Pass",
      enabled: true,
      contextLength: 5,
      prompt: `You are an editor. Edit <text_to_transform> to improve dialogue and character voice.
Return only the rewritten text.`,
      connection: "",
      modelOverride: "",
      reasoningEffort: "off",
      maxTokens: 1000,
      temperature: 0.3,
      ttftTimeoutSec: 20,
      passTimeoutSec: 60,
      injectWorldInfo: false,
      includeCharCard: true,
      includeSceneContext: true
    };
    activePreset.passes.push(newPass);
    expandedPasses.add(newPass.id);
    hostCtx?.sendToBackend({
      type: "RECAST_UPDATE_PRESET",
      preset: activePreset
    });
    onRefresh();
  };
  passesHeader.appendChild(addPassBtn);
  passesPanel.appendChild(passesHeader);
  const passesBody = document.createElement("div");
  passesBody.className = "lr-panel-body";
  activePreset.passes.forEach((pass, pIdx) => {
    const isExpanded = expandedPasses.has(pass.id);
    const item = document.createElement("div");
    item.className = `recast-pass-item ${pass.enabled ? "" : "disabled"}`;
    const headerRow = document.createElement("div");
    headerRow.className = "recast-pass-header";
    const titleRow = document.createElement("div");
    titleRow.className = "recast-pass-title-row";
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = pass.enabled;
    chk.title = "Enable / Disable this pass";
    chk.onchange = () => {
      pass.enabled = chk.checked;
      hostCtx?.sendToBackend({
        type: "RECAST_UPDATE_PRESET",
        preset: activePreset
      });
      onRefresh();
    };
    titleRow.appendChild(chk);
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "recast-pass-name";
    nameInput.value = pass.name;
    nameInput.title = "Click to rename pass";
    nameInput.onchange = () => {
      pass.name = nameInput.value.trim() || "Untitled Pass";
      hostCtx?.sendToBackend({
        type: "RECAST_UPDATE_PRESET",
        preset: activePreset
      });
    };
    titleRow.appendChild(nameInput);
    headerRow.appendChild(titleRow);
    const ctrlRow = document.createElement("div");
    ctrlRow.className = "recast-pass-controls";
    if (pIdx > 0) {
      const upBtn = document.createElement("button");
      upBtn.className = "recast-btn-icon";
      upBtn.innerHTML = "▲";
      upBtn.title = "Move pass up";
      upBtn.onclick = () => {
        const temp = activePreset.passes[pIdx - 1];
        activePreset.passes[pIdx - 1] = activePreset.passes[pIdx];
        activePreset.passes[pIdx] = temp;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
        onRefresh();
      };
      ctrlRow.appendChild(upBtn);
    }
    if (pIdx < activePreset.passes.length - 1) {
      const downBtn = document.createElement("button");
      downBtn.className = "recast-btn-icon";
      downBtn.innerHTML = "▼";
      downBtn.title = "Move pass down";
      downBtn.onclick = () => {
        const temp = activePreset.passes[pIdx + 1];
        activePreset.passes[pIdx + 1] = activePreset.passes[pIdx];
        activePreset.passes[pIdx] = temp;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
        onRefresh();
      };
      ctrlRow.appendChild(downBtn);
    }
    const expandBtn = document.createElement("button");
    expandBtn.className = "recast-btn-icon";
    expandBtn.innerHTML = isExpanded ? "Hide" : "Edit";
    expandBtn.title = "Show / hide pass configuration & prompt";
    expandBtn.onclick = () => {
      if (expandedPasses.has(pass.id)) {
        expandedPasses.delete(pass.id);
      } else {
        expandedPasses.add(pass.id);
      }
      onRefresh();
    };
    ctrlRow.appendChild(expandBtn);
    const delBtn = document.createElement("button");
    delBtn.className = "recast-btn-icon";
    delBtn.style.color = "#ff8a8a";
    delBtn.innerHTML = "✕";
    delBtn.title = "Delete pass";
    delBtn.onclick = () => {
      if (confirm(`Remove pass "${pass.name}"?`)) {
        activePreset.passes.splice(pIdx, 1);
        expandedPasses.delete(pass.id);
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
        onRefresh();
      }
    };
    ctrlRow.appendChild(delBtn);
    headerRow.appendChild(ctrlRow);
    item.appendChild(headerRow);
    if (isExpanded) {
      const details = document.createElement("div");
      details.className = "recast-pass-details";
      const paramRow = document.createElement("div");
      paramRow.className = "recast-row-2col";
      const ctxCol = document.createElement("div");
      ctxCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Context Length (Messages):</label>`;
      const ctxInput = document.createElement("input");
      ctxInput.type = "number";
      ctxInput.className = "lr-select";
      ctxInput.value = String(pass.contextLength ?? 3);
      ctxInput.min = "0";
      ctxInput.max = "100";
      ctxInput.onchange = () => {
        pass.contextLength = parseInt(ctxInput.value, 10) || 0;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      ctxCol.appendChild(ctxInput);
      paramRow.appendChild(ctxCol);
      const pConnCol = document.createElement("div");
      pConnCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Connection Profile:</label>`;
      const pConnSelect = document.createElement("select");
      pConnSelect.className = "lr-select";
      const defOpt = document.createElement("option");
      defOpt.value = "";
      defOpt.textContent = "Inherit Global / Default";
      pConnSelect.appendChild(defOpt);
      availableConnections.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.name}${c.is_default ? " [Default]" : ""}`;
        opt.selected = c.id === pass.connection;
        pConnSelect.appendChild(opt);
      });
      pConnSelect.onchange = () => {
        pass.connection = pConnSelect.value;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      pConnCol.appendChild(pConnSelect);
      paramRow.appendChild(pConnCol);
      details.appendChild(paramRow);
      const modelReasonRow = document.createElement("div");
      modelReasonRow.className = "recast-row-2col";
      const pModelCol = document.createElement("div");
      pModelCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Model Override:</label>`;
      const pModelGroup = createModelOverrideInputGroup({
        value: pass.modelOverride || "",
        placeholder: "(Inherit from Connection)",
        datalistId: `lr-datalist-pass-${pass.id}`,
        getConnectionId: () => pass.connection || recastSettings.defaultConnectionId || availableConnections.find((c) => c.is_default)?.id || availableConnections[0]?.id || "",
        getConnectionName: () => {
          const id = pass.connection || recastSettings.defaultConnectionId;
          const found = availableConnections.find((c) => c.id === id) || availableConnections.find((c) => c.is_default) || availableConnections[0];
          return found?.name || "Inherited Connection";
        },
        onSave: (val) => {
          pass.modelOverride = val;
          hostCtx?.sendToBackend({
            type: "RECAST_UPDATE_PRESET",
            preset: activePreset
          });
        },
        hostCtx
      });
      pModelCol.appendChild(pModelGroup);
      modelReasonRow.appendChild(pModelCol);
      const pReasonCol = document.createElement("div");
      pReasonCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Reasoning Effort:</label>`;
      const pReasonSelect = document.createElement("select");
      pReasonSelect.className = "lr-select";
      const passReasonEfforts = [
        { id: "off", label: "\uD83D\uDE80 Off (No Thinking)" },
        { id: "inherit", label: "Inherit Global Setting" },
        { id: "low", label: "⚡ Low Effort" },
        { id: "medium", label: "Medium Effort" },
        { id: "high", label: "High Effort" }
      ];
      passReasonEfforts.forEach((r) => {
        const opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = r.label;
        opt.selected = r.id === (pass.reasoningEffort || "off");
        pReasonSelect.appendChild(opt);
      });
      pReasonSelect.onchange = () => {
        pass.reasoningEffort = pReasonSelect.value;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      pReasonCol.appendChild(pReasonSelect);
      modelReasonRow.appendChild(pReasonCol);
      details.appendChild(modelReasonRow);
      const timeoutRow = document.createElement("div");
      timeoutRow.className = "recast-row-2col";
      const pTtftCol = document.createElement("div");
      pTtftCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">First-Token Timeout (s):</label>`;
      const pTtftInput = document.createElement("input");
      pTtftInput.type = "number";
      pTtftInput.className = "lr-select";
      pTtftInput.min = "5";
      pTtftInput.max = "120";
      pTtftInput.value = String(pass.ttftTimeoutSec ?? 20);
      pTtftInput.onchange = () => {
        pass.ttftTimeoutSec = parseInt(pTtftInput.value, 10) || 20;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      pTtftCol.appendChild(pTtftInput);
      timeoutRow.appendChild(pTtftCol);
      const pPassTimeCol = document.createElement("div");
      pPassTimeCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Inactivity Timeout (s):</label>`;
      const pPassTimeInput = document.createElement("input");
      pPassTimeInput.type = "number";
      pPassTimeInput.className = "lr-select";
      pPassTimeInput.min = "10";
      pPassTimeInput.max = "300";
      pPassTimeInput.value = String(pass.passTimeoutSec ?? 60);
      pPassTimeInput.title = "Timeout in seconds if no new tokens or reasoning are received. Resets continuously as tokens stream in.";
      pPassTimeInput.onchange = () => {
        pass.passTimeoutSec = parseInt(pPassTimeInput.value, 10) || 60;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      pPassTimeCol.appendChild(pPassTimeInput);
      timeoutRow.appendChild(pPassTimeCol);
      details.appendChild(timeoutRow);
      const injGroup = document.createElement("div");
      injGroup.className = "recast-checkbox-group";
      const charLabel = document.createElement("label");
      charLabel.className = "recast-checkbox-label";
      const charChk = document.createElement("input");
      charChk.type = "checkbox";
      charChk.checked = pass.includeCharCard !== false;
      charChk.onchange = () => {
        pass.includeCharCard = charChk.checked;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      charLabel.appendChild(charChk);
      charLabel.appendChild(document.createTextNode("Include Character Card"));
      injGroup.appendChild(charLabel);
      const scnLabel = document.createElement("label");
      scnLabel.className = "recast-checkbox-label";
      const scnChk = document.createElement("input");
      scnChk.type = "checkbox";
      scnChk.checked = pass.includeSceneContext !== false;
      scnChk.onchange = () => {
        pass.includeSceneContext = scnChk.checked;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      scnLabel.appendChild(scnChk);
      scnLabel.appendChild(document.createTextNode("Include Scene Context"));
      injGroup.appendChild(scnLabel);
      const wiLabel = document.createElement("label");
      wiLabel.className = "recast-checkbox-label";
      const wiChk = document.createElement("input");
      wiChk.type = "checkbox";
      wiChk.checked = pass.injectWorldInfo === true;
      wiChk.onchange = () => {
        pass.injectWorldInfo = wiChk.checked;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      wiLabel.appendChild(wiChk);
      wiLabel.appendChild(document.createTextNode("Inject World Info"));
      injGroup.appendChild(wiLabel);
      details.appendChild(injGroup);
      const promptLabel = document.createElement("label");
      promptLabel.style.display = "block";
      promptLabel.style.fontSize = "10.5px";
      promptLabel.style.color = "#aaa";
      promptLabel.style.marginBottom = "3px";
      promptLabel.textContent = "Pass System Prompt:";
      details.appendChild(promptLabel);
      const promptArea = document.createElement("textarea");
      promptArea.className = "recast-prompt-editor";
      promptArea.rows = 7;
      promptArea.value = pass.prompt;
      promptArea.placeholder = "Enter instructions for this pass. Must instruct returning the modified text.";
      promptArea.onchange = () => {
        pass.prompt = promptArea.value;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      details.appendChild(promptArea);
      const prefillRow = document.createElement("div");
      prefillRow.style.display = "flex";
      prefillRow.style.gap = "8px";
      prefillRow.style.marginTop = "6px";
      prefillRow.style.alignItems = "center";
      const prefillInput = document.createElement("input");
      prefillInput.type = "text";
      prefillInput.className = "lr-select";
      prefillInput.style.flex = "1";
      prefillInput.placeholder = "Optional Assistant Prefill (e.g. ```text or Sure, here is the text:)";
      prefillInput.value = pass.prefill || "";
      prefillInput.onchange = () => {
        pass.prefill = prefillInput.value;
        hostCtx?.sendToBackend({
          type: "RECAST_UPDATE_PRESET",
          preset: activePreset
        });
      };
      prefillRow.appendChild(prefillInput);
      details.appendChild(prefillRow);
      item.appendChild(details);
    }
    passesBody.appendChild(item);
  });
  passesPanel.appendChild(passesBody);
  container.appendChild(passesPanel);
}

// src/recast/diff.ts
function escapeHtml2(str) {
  if (str === null || str === undefined)
    return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function tokenize(text) {
  return text.split(/(\s+)/);
}
var MAX_DIFF_TOKENS = 50000;
function myersDiff(oldTokens, newTokens) {
  const oldLength = oldTokens.length;
  const newLength = newTokens.length;
  const maxTotalLength = oldLength + newLength;
  const furthestPaths = new Int32Array(2 * maxTotalLength + 1);
  const pathHistory = [];
  furthestPaths[maxTotalLength + 1] = 0;
  for (let editDepth = 0;editDepth <= maxTotalLength; editDepth++) {
    if (editDepth > 1e4)
      return null;
    pathHistory.push(furthestPaths.slice(maxTotalLength - editDepth, maxTotalLength + editDepth + 1));
    for (let diagonal = -editDepth;diagonal <= editDepth; diagonal += 2) {
      let oldPos;
      const goDown = diagonal === -editDepth || diagonal !== editDepth && furthestPaths[maxTotalLength + diagonal - 1] < furthestPaths[maxTotalLength + diagonal + 1];
      if (goDown) {
        oldPos = furthestPaths[maxTotalLength + diagonal + 1];
      } else {
        oldPos = furthestPaths[maxTotalLength + diagonal - 1] + 1;
      }
      let newPos = oldPos - diagonal;
      while (oldPos < oldLength && newPos < newLength && oldTokens[oldPos] === newTokens[newPos]) {
        oldPos++;
        newPos++;
      }
      furthestPaths[maxTotalLength + diagonal] = oldPos;
      if (oldPos >= oldLength && newPos >= newLength) {
        const ops = [];
        let currOldPos = oldLength;
        let currNewPos = newLength;
        for (let step = editDepth;step > 0; step--) {
          const historyArray = pathHistory[step];
          const currDiagonal = currOldPos - currNewPos;
          const histIndex = step + currDiagonal;
          const wentDown = currDiagonal === -step || currDiagonal !== step && historyArray[histIndex - 1] < historyArray[histIndex + 1];
          let startX;
          if (wentDown) {
            startX = historyArray[histIndex + 1];
          } else {
            startX = historyArray[histIndex - 1] + 1;
          }
          const startY = startX - currDiagonal;
          while (currOldPos > startX && currNewPos > startY && currOldPos > 0 && currNewPos > 0) {
            ops.unshift({ type: "equal", v: oldTokens[currOldPos - 1] });
            currOldPos--;
            currNewPos--;
          }
          if (wentDown) {
            if (currNewPos > 0) {
              ops.unshift({ type: "insert", v: newTokens[currNewPos - 1] });
              currNewPos--;
            }
          } else {
            if (currOldPos > 0) {
              ops.unshift({ type: "delete", v: oldTokens[currOldPos - 1] });
              currOldPos--;
            }
          }
        }
        while (currOldPos > 0 && currNewPos > 0) {
          ops.unshift({ type: "equal", v: oldTokens[currOldPos - 1] });
          currOldPos--;
          currNewPos--;
        }
        while (currOldPos > 0) {
          ops.unshift({ type: "delete", v: oldTokens[currOldPos - 1] });
          currOldPos--;
        }
        while (currNewPos > 0) {
          ops.unshift({ type: "insert", v: newTokens[currNewPos - 1] });
          currNewPos--;
        }
        return ops;
      }
    }
  }
  return [];
}
function computeWordDiff(oldText, newText) {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  if (a.length > MAX_DIFF_TOKENS || b.length > MAX_DIFF_TOKENS) {
    return { oldHtml: escapeHtml2(oldText), newHtml: escapeHtml2(newText) };
  }
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    start++;
  }
  let endA = a.length - 1;
  let endB = b.length - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA--;
    endB--;
  }
  const subA = a.slice(start, endA + 1);
  const subB = b.slice(start, endB + 1);
  let ops = myersDiff(subA, subB);
  if (!ops) {
    ops = [
      ...subA.map((v) => ({ type: "delete", v })),
      ...subB.map((v) => ({ type: "insert", v }))
    ];
  }
  const fullOps = [
    ...a.slice(0, start).map((v) => ({ type: "equal", v })),
    ...ops,
    ...a.slice(endA + 1).map((v) => ({ type: "equal", v }))
  ];
  let oldHtml = "";
  let newHtml = "";
  for (const op of fullOps) {
    if (op.v === undefined || op.v === null)
      continue;
    const v = escapeHtml2(op.v);
    if (op.type === "equal") {
      oldHtml += v;
      newHtml += v;
    } else if (op.type === "delete") {
      oldHtml += `<del class="rc-del">${v}</del>`;
    } else {
      newHtml += `<ins class="rc-ins">${v}</ins>`;
    }
  }
  return { oldHtml, newHtml };
}
function buildSteps(snapshots, passNames) {
  if (!snapshots || snapshots.length === 0)
    return [];
  const safeSnapshots = snapshots.length === 1 ? [snapshots[0], snapshots[0]] : snapshots;
  const getPassName = (i) => passNames && passNames[i - 1] ? passNames[i - 1] : undefined;
  const steps = [];
  steps.push({
    oldText: safeSnapshots[0],
    newText: safeSnapshots[safeSnapshots.length - 1],
    oldLabel: "Original",
    newLabel: "Final Recast",
    caption: "Full Pipeline Diff"
  });
  for (let i = 0;i < safeSnapshots.length - 1; i++) {
    steps.push({
      oldText: safeSnapshots[i],
      newText: safeSnapshots[i + 1],
      oldLabel: i === 0 ? "Original" : `Pass ${i}`,
      newLabel: `Pass ${i + 1}`,
      caption: i === 0 ? "Original → Pass 1" : `Pass ${i} → Pass ${i + 1}`,
      passName: getPassName(i + 1)
    });
  }
  return steps;
}

// src/recast/diff-modal.ts
var activeBackdropEl = null;
function closeRecastDiffModal() {
  if (activeBackdropEl && activeBackdropEl.parentElement) {
    activeBackdropEl.remove();
  }
  activeBackdropEl = null;
  const host = document.getElementById("recursion-modal-host");
  if (host) {
    host.classList.remove("active");
    host.style.display = "none";
    host.style.pointerEvents = "none";
  }
}
function showRecastDiffModal(diff, hostCtx) {
  closeRecastDiffModal();
  let host = document.getElementById("recursion-modal-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "recursion-modal-host";
    if (document.body) {
      document.body.appendChild(host);
    } else if (document.documentElement) {
      document.documentElement.appendChild(host);
    }
  }
  host.classList.add("active");
  host.style.display = "flex";
  host.style.pointerEvents = "auto";
  host.style.zIndex = "999999";
  console.log("[Lumi:REcursion:Recast] Opening Recast Diff Review Modal for message:", diff.messageId);
  const backdrop = document.createElement("div");
  backdrop.id = "recast_diff_backdrop";
  activeBackdropEl = backdrop;
  const modal = document.createElement("div");
  modal.id = "recast_diff_modal";
  modal.onclick = (e) => e.stopPropagation();
  const header = document.createElement("div");
  header.className = "rc-diff-header";
  header.innerHTML = `
    <div class="rc-diff-title">
      <span>✨ Recast Post-Processing Review</span>
      <span style="font-size:11px;font-weight:400;color:#999;background:#282832;padding:2px 6px;border-radius:4px;">
        ${diff.totalLatencyMs}ms · ${diff.passNames.length} pass${diff.passNames.length === 1 ? "" : "es"}
      </span>
    </div>
  `;
  const closeBtn = document.createElement("button");
  closeBtn.className = "rc-diff-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.title = "Close modal";
  closeBtn.onclick = closeRecastDiffModal;
  header.appendChild(closeBtn);
  modal.appendChild(header);
  const steps = buildSteps(diff.snapshots, diff.passNames);
  let currentStepIdx = 0;
  let userEditedText = diff.transformedText;
  const stepsBar = document.createElement("div");
  stepsBar.className = "rc-diff-steps-bar";
  const body = document.createElement("div");
  body.className = "rc-diff-body";
  const leftPanel = document.createElement("div");
  leftPanel.className = "rc-diff-panel";
  const leftHeader = document.createElement("div");
  leftHeader.className = "rc-diff-panel-header rc-diff-original-header";
  leftHeader.innerHTML = `<span>Original Text</span>`;
  const leftContent = document.createElement("div");
  leftContent.className = "rc-diff-content";
  leftPanel.appendChild(leftHeader);
  leftPanel.appendChild(leftContent);
  const rightPanel = document.createElement("div");
  rightPanel.className = "rc-diff-panel";
  const rightHeader = document.createElement("div");
  rightHeader.className = "rc-diff-panel-header rc-diff-transformed-header";
  rightHeader.innerHTML = `
    <span>Recast Transformed</span>
    <span style="font-size:10px;text-transform:none;opacity:0.75;">(Editable below)</span>
  `;
  const rightContent = document.createElement("div");
  rightContent.className = "rc-diff-content";
  rightContent.style.flex = "1";
  const editTextarea = document.createElement("textarea");
  editTextarea.className = "rc-diff-textarea";
  editTextarea.value = userEditedText;
  editTextarea.placeholder = "Fine-tune the recast prose here before accepting...";
  editTextarea.style.height = "140px";
  editTextarea.style.flex = "0 0 auto";
  editTextarea.oninput = () => {
    userEditedText = editTextarea.value;
    if (currentStepIdx === 0 && steps.length > 0) {
      steps[0].newText = userEditedText;
      const { oldHtml, newHtml } = computeWordDiff(steps[0].oldText, userEditedText);
      leftContent.innerHTML = oldHtml;
      rightContent.innerHTML = newHtml;
    }
  };
  rightPanel.appendChild(rightHeader);
  rightPanel.appendChild(rightContent);
  rightPanel.appendChild(editTextarea);
  body.appendChild(leftPanel);
  body.appendChild(rightPanel);
  function renderStep(idx) {
    currentStepIdx = idx;
    const step = steps[idx];
    if (!step)
      return;
    const buttons = stepsBar.querySelectorAll(".rc-diff-step-btn");
    buttons.forEach((btn, bIdx) => {
      btn.classList.toggle("active", bIdx === idx);
    });
    leftHeader.innerHTML = `<span>${step.oldLabel}</span>`;
    rightHeader.innerHTML = `
      <span>${step.newLabel}${step.passName ? ` (${step.passName})` : ""}</span>
      ${idx === 0 ? '<span style="font-size:10px;text-transform:none;opacity:0.75;">(Editable below)</span>' : ""}
    `;
    const targetNew = idx === 0 ? userEditedText : step.newText;
    const { oldHtml, newHtml } = computeWordDiff(step.oldText, targetNew);
    leftContent.innerHTML = oldHtml;
    rightContent.innerHTML = newHtml;
    if (idx === 0) {
      editTextarea.style.display = "";
      rightContent.style.flex = "1";
    } else {
      editTextarea.style.display = "none";
      rightContent.style.flex = "1 1 auto";
    }
  }
  steps.forEach((step, sIdx) => {
    const stepBtn = document.createElement("button");
    stepBtn.className = `rc-diff-step-btn ${sIdx === 0 ? "active" : ""}`;
    stepBtn.textContent = step.caption;
    stepBtn.onclick = () => renderStep(sIdx);
    stepsBar.appendChild(stepBtn);
  });
  if (steps.length > 1) {
    modal.appendChild(stepsBar);
  }
  modal.appendChild(body);
  renderStep(0);
  const footer = document.createElement("div");
  footer.className = "rc-diff-footer";
  const rejectBtn = document.createElement("button");
  rejectBtn.className = "rc-diff-btn rc-diff-reject-btn";
  rejectBtn.innerHTML = `Keep Original`;
  rejectBtn.onclick = () => {
    closeRecastDiffModal();
    hostCtx?.toast?.info?.("Recast changes discarded.");
  };
  const swipeBtn = document.createElement("button");
  swipeBtn.className = "rc-diff-btn rc-diff-swipe-btn";
  swipeBtn.innerHTML = `\uD83D\uDD00 Accept as Swipe`;
  swipeBtn.onclick = () => {
    const textToApply = userEditedText;
    hostCtx?.sendToBackend({
      type: "RECAST_APPLY_RESULT",
      chatId: diff.chatId,
      messageId: diff.messageId,
      text: textToApply,
      mode: "swipe"
    });
    closeRecastDiffModal();
  };
  const acceptBtn = document.createElement("button");
  acceptBtn.className = "rc-diff-btn rc-diff-accept-btn";
  acceptBtn.innerHTML = `✅ Accept & Replace`;
  acceptBtn.onclick = () => {
    const textToApply = userEditedText;
    hostCtx?.sendToBackend({
      type: "RECAST_APPLY_RESULT",
      chatId: diff.chatId,
      messageId: diff.messageId,
      text: textToApply,
      mode: "replace"
    });
    closeRecastDiffModal();
  };
  footer.appendChild(rejectBtn);
  footer.appendChild(swipeBtn);
  footer.appendChild(acceptBtn);
  modal.appendChild(footer);
  backdrop.appendChild(modal);
  backdrop.onclick = closeRecastDiffModal;
  host.appendChild(backdrop);
}

// src/cards/import-export-modal.ts
var activeModalBackdrop = null;
function closeJsonModal() {
  if (activeModalBackdrop && activeModalBackdrop.parentElement) {
    activeModalBackdrop.remove();
  }
  activeModalBackdrop = null;
  const host = document.getElementById("recursion-modal-host");
  if (host) {
    host.classList.remove("active");
  }
}
function showJsonModal(options) {
  const { title, mode, initialData, defaultTemplate, onImport, hostCtx } = options;
  closeJsonModal();
  let host = document.getElementById("recursion-modal-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "recursion-modal-host";
    document.body.appendChild(host);
  }
  host.classList.add("active");
  const backdrop = document.createElement("div");
  backdrop.id = "recast_diff_backdrop";
  activeModalBackdrop = backdrop;
  const modal = document.createElement("div");
  modal.id = "recast_diff_modal";
  modal.style.maxWidth = "850px";
  modal.style.height = "78vh";
  modal.onclick = (e) => e.stopPropagation();
  const header = document.createElement("div");
  header.className = "rc-diff-header";
  header.innerHTML = `
    <div class="rc-diff-title">
      <span>${title}</span>
    </div>
  `;
  const closeBtn = document.createElement("button");
  closeBtn.className = "rc-diff-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.onclick = closeJsonModal;
  header.appendChild(closeBtn);
  modal.appendChild(header);
  const body = document.createElement("div");
  body.style.display = "flex";
  body.style.flexDirection = "column";
  body.style.flex = "1";
  body.style.padding = "14px 18px";
  body.style.gap = "10px";
  body.style.overflow = "hidden";
  const helpTip = document.createElement("div");
  helpTip.style.fontSize = "11.5px";
  helpTip.style.color = "#aaa";
  if (mode === "import") {
    helpTip.innerHTML = `
      Paste an array of card objects or a full payload JSON. You can click <strong>"Load Template"</strong> below to view the canonical schema.
    `;
  } else {
    helpTip.innerHTML = `
      Here is the raw JSON representation of your card definitions. Click <strong>"Copy to Clipboard"</strong> to share or back up.
    `;
  }
  body.appendChild(helpTip);
  const textarea = document.createElement("textarea");
  textarea.className = "recast-textarea";
  textarea.style.flex = "1";
  textarea.style.fontFamily = "monospace";
  textarea.style.fontSize = "11px";
  textarea.style.lineHeight = "1.4";
  textarea.style.whiteSpace = "pre";
  textarea.style.overflowWrap = "normal";
  textarea.style.overflow = "auto";
  if (initialData) {
    textarea.value = JSON.stringify(initialData, null, 2);
  }
  body.appendChild(textarea);
  const errorDiv = document.createElement("div");
  errorDiv.style.color = "#ff8a8a";
  errorDiv.style.fontSize = "11.5px";
  errorDiv.style.display = "none";
  body.appendChild(errorDiv);
  modal.appendChild(body);
  const footer = document.createElement("div");
  footer.className = "rc-diff-footer";
  if (mode === "import" && defaultTemplate) {
    const templateBtn = document.createElement("button");
    templateBtn.className = "rc-diff-btn rc-diff-reject-btn";
    templateBtn.textContent = "\uD83D\uDCCB Load Template";
    templateBtn.title = "Fill with canonical schema template";
    templateBtn.onclick = () => {
      textarea.value = JSON.stringify(defaultTemplate, null, 2);
      errorDiv.style.display = "none";
    };
    footer.appendChild(templateBtn);
  }
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "rc-diff-btn rc-diff-reject-btn";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = closeJsonModal;
  footer.appendChild(cancelBtn);
  if (mode === "export") {
    const copyBtn = document.createElement("button");
    copyBtn.className = "rc-diff-btn rc-diff-accept-btn";
    copyBtn.textContent = "\uD83D\uDCCB Copy to Clipboard";
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(textarea.value);
        hostCtx?.toast?.success?.("Copied card JSON to clipboard!");
        closeJsonModal();
      } catch {
        textarea.select();
        document.execCommand("copy");
        hostCtx?.toast?.success?.("Copied to clipboard!");
        closeJsonModal();
      }
    };
    footer.appendChild(copyBtn);
  } else {
    const importBtn = document.createElement("button");
    importBtn.className = "rc-diff-btn rc-diff-accept-btn";
    importBtn.textContent = "\uD83D\uDCE5 Validate & Import";
    importBtn.onclick = () => {
      errorDiv.style.display = "none";
      try {
        const text = textarea.value.trim();
        if (!text) {
          throw new Error("Please enter JSON text to import.");
        }
        const parsed = JSON.parse(text);
        onImport?.(parsed);
        closeJsonModal();
      } catch (err) {
        errorDiv.textContent = `JSON Error: ${err?.message || err}`;
        errorDiv.style.display = "block";
      }
    };
    footer.appendChild(importBtn);
  }
  modal.appendChild(footer);
  backdrop.appendChild(modal);
  backdrop.onclick = closeJsonModal;
  host.appendChild(backdrop);
}

// src/cards/source-panels.ts
var SPARKLE_ICON_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`;
var TRASH_ICON_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
var editingWbCards = new Set;
var editingCharCards = new Set;
var isAddingWbCard = false;
var isAddingCharCard = false;
var showWbSchemaGuide = false;
var showCharSchemaGuide = false;
function cycleState(cur) {
  if (cur === "off")
    return "active";
  if (cur === "active")
    return "priority";
  return "off";
}
function renderWorldBookPanel(container, options) {
  const { worldBooks, selectedWorldBookId, cards, hostCtx, onRefresh } = options;
  const panel = document.createElement("div");
  panel.className = "lr-panel";
  const header = document.createElement("div");
  header.className = "lr-panel-header";
  header.innerHTML = `<span>\uD83D\uDCD6 Option A: World Book Card Definitions</span>`;
  panel.appendChild(header);
  const body = document.createElement("div");
  body.className = "lr-panel-body";
  const infoBox = document.createElement("div");
  infoBox.className = "lr-info-box";
  infoBox.innerHTML = `
    \uD83D\uDC2D <strong>World Book Mode:</strong> Cards are stored as independent entries inside a Lumiverse World Book.
    Both you and assistant personas (like Mousepad \uD83D\uDC2D) can view, edit, enable/disable, or import/export cards natively.
  `;
  body.appendChild(infoBox);
  const selectBar = document.createElement("div");
  selectBar.className = "lr-deck-bar";
  const wbSelect = document.createElement("select");
  wbSelect.className = "lr-select";
  const defOpt = document.createElement("option");
  defOpt.value = "";
  defOpt.textContent = 'Auto-detect "Lumi:REcursion Cards" or attached book';
  wbSelect.appendChild(defOpt);
  for (const b of worldBooks) {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = `${b.name}${b.entryCount !== undefined ? ` (${b.entryCount} entries)` : ""}`;
    opt.selected = b.id === selectedWorldBookId;
    wbSelect.appendChild(opt);
  }
  wbSelect.onchange = () => {
    hostCtx?.sendToBackend({
      type: "UPDATE_SETTINGS",
      settings: { worldBookId: wbSelect.value }
    });
    if (wbSelect.value) {
      hostCtx?.sendToBackend({
        type: "GET_WORLDBOOK_CARDS",
        worldBookId: wbSelect.value
      });
    }
    onRefresh();
  };
  selectBar.appendChild(wbSelect);
  const syncBtn = document.createElement("button");
  syncBtn.className = "lr-btn lr-btn-primary";
  syncBtn.innerHTML = `${SPARKLE_ICON_SVG} Sync / Create Book`;
  syncBtn.title = 'Creates or updates "Lumi:REcursion Cards" World Book with 11 canonical card families';
  syncBtn.onclick = () => {
    hostCtx?.sendToBackend({ type: "CREATE_OR_SYNC_WORLD_BOOK" });
  };
  selectBar.appendChild(syncBtn);
  body.appendChild(selectBar);
  const toolbar = document.createElement("div");
  toolbar.style.display = "flex";
  toolbar.style.flexWrap = "wrap";
  toolbar.style.gap = "6px";
  toolbar.style.padding = "4px 0";
  const importBtn = document.createElement("button");
  importBtn.className = "lr-btn";
  importBtn.innerHTML = `<span>\uD83D\uDCE5 Import Cards (JSON)</span>`;
  importBtn.title = "Import an array of card entries or raw JSON into this World Book";
  importBtn.onclick = () => {
    const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || "");
    if (!effectiveId) {
      hostCtx?.toast?.warn?.("Please select or create a World Book first.");
      return;
    }
    showJsonModal({
      title: "\uD83D\uDCE5 Import Cards into World Book",
      mode: "import",
      defaultTemplate: CARD_SCOPE_CATALOG.map((c) => ({
        family: c.family,
        role: c.role,
        priority: c.priority,
        selectionState: "active",
        description: c.description,
        subItems: c.subItems.map((s) => `${s.key}: ${s.description}`)
      })),
      onImport: (parsed) => {
        const arr = Array.isArray(parsed) ? parsed : parsed.cards || parsed.entries || [];
        hostCtx?.sendToBackend({
          type: "IMPORT_WORLDBOOK_CARDS",
          worldBookId: effectiveId,
          cards: arr
        });
      },
      hostCtx
    });
  };
  toolbar.appendChild(importBtn);
  const exportBtn = document.createElement("button");
  exportBtn.className = "lr-btn";
  exportBtn.innerHTML = `<span>\uD83D\uDCE4 Export Cards (JSON)</span>`;
  exportBtn.title = "Export all cards in this World Book as JSON";
  exportBtn.onclick = () => {
    showJsonModal({
      title: "\uD83D\uDCE4 Export World Book Cards (JSON)",
      mode: "export",
      initialData: cards.map((c) => ({
        family: c.family,
        role: c.role,
        priority: c.priority,
        selectionState: c.selectionState,
        description: c.description,
        subItems: c.subItems,
        disabled: c.disabled
      })),
      hostCtx
    });
  };
  toolbar.appendChild(exportBtn);
  const guideBtn = document.createElement("button");
  guideBtn.className = "lr-btn";
  guideBtn.style.marginLeft = "auto";
  guideBtn.textContent = showWbSchemaGuide ? "▲ Hide Schema" : "ℹ️ Schema Reference";
  guideBtn.onclick = () => {
    showWbSchemaGuide = !showWbSchemaGuide;
    onRefresh();
  };
  toolbar.appendChild(guideBtn);
  body.appendChild(toolbar);
  if (showWbSchemaGuide) {
    const guideBox = document.createElement("div");
    guideBox.style.background = "#181818";
    guideBox.style.border = "1px solid #383838";
    guideBox.style.borderRadius = "5px";
    guideBox.style.padding = "8px 10px";
    guideBox.style.fontSize = "11px";
    guideBox.style.color = "#ccc";
    guideBox.innerHTML = `
      <div style="font-weight:700;color:#65d6e8;margin-bottom:4px;">\uD83D\uDCD6 World Book Entry JSON Schema:</div>
      <div>Each card is stored inside a World Book Entry's <code>content</code> field as JSON:</div>
      <pre style="background:#111;padding:6px;border-radius:4px;margin:6px 0;font-size:10.5px;color:#a8d5e5;overflow-x:auto;">{
  "family": "Scene Frame",
  "role": "sceneFrameCard",
  "priority": 100,
  "selectionState": "priority", // "off" | "active" | "priority"
  "description": "Hard boundary constraints, routes, and beat direction.",
  "subItems": ["locationSituation: ...", "immediateDirection: ..."]
}</pre>
      <div>Alternatively, plain text entries are supported where <code>comment</code> is the family name and <code>content</code> is the prompt text.</div>
    `;
    body.appendChild(guideBox);
  }
  const listHeader = document.createElement("div");
  listHeader.style.display = "flex";
  listHeader.style.justifyContent = "space-between";
  listHeader.style.alignItems = "center";
  listHeader.style.marginTop = "6px";
  listHeader.style.paddingBottom = "4px";
  listHeader.style.borderBottom = "1px solid #333";
  listHeader.innerHTML = `
    <span style="font-weight:600;font-size:12px;color:#e0e0e0;">Card Entries (${cards.length})</span>
  `;
  const addCardBtn = document.createElement("button");
  addCardBtn.className = "lr-btn lr-btn-primary";
  addCardBtn.style.padding = "2px 8px";
  addCardBtn.style.fontSize = "11px";
  addCardBtn.textContent = isAddingWbCard ? "Cancel Add" : "+ Add Card Entry";
  addCardBtn.onclick = () => {
    isAddingWbCard = !isAddingWbCard;
    onRefresh();
  };
  listHeader.appendChild(addCardBtn);
  body.appendChild(listHeader);
  if (isAddingWbCard) {
    const addForm = renderCardEditorForm({
      initial: {
        family: "New Scene Card",
        role: "customCard",
        priority: 80,
        selectionState: "active",
        description: "Describe the reasoning focus for this card...",
        subItems: []
      },
      onSave: (entryData) => {
        const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || "");
        if (!effectiveId) {
          hostCtx?.toast?.warn?.("Select a World Book first.");
          return;
        }
        hostCtx?.sendToBackend({
          type: "SAVE_WORLDBOOK_CARD",
          worldBookId: effectiveId,
          entry: entryData
        });
        isAddingWbCard = false;
      },
      onCancel: () => {
        isAddingWbCard = false;
        onRefresh();
      }
    });
    body.appendChild(addForm);
  }
  if (cards.length > 0) {
    const listDiv = document.createElement("div");
    listDiv.style.display = "flex";
    listDiv.style.flexDirection = "column";
    listDiv.style.gap = "6px";
    for (const card of cards) {
      const isEditing = editingWbCards.has(card.id);
      const cardRow = document.createElement("div");
      cardRow.className = "recast-pass-item";
      if (card.disabled)
        cardRow.classList.add("disabled");
      const headerRow = document.createElement("div");
      headerRow.className = "recast-pass-header";
      const titlePart = document.createElement("div");
      titlePart.className = "recast-pass-title-row";
      titlePart.innerHTML = `
        <span style="font-size:12px;font-weight:600;color:#e0e0e0;">${card.family}</span>
        <span style="font-size:10px;color:#888;background:#282828;padding:1px 5px;border-radius:3px;">p:${card.priority}</span>
        ${card.disabled ? '<span style="font-size:10px;color:#ff8a8a;">(Disabled)</span>' : ""}
      `;
      headerRow.appendChild(titlePart);
      const actionPart = document.createElement("div");
      actionPart.className = "recast-pass-controls";
      const pill = document.createElement("div");
      pill.className = `lr-card-pill state-${card.selectionState}`;
      pill.textContent = card.selectionState.toUpperCase();
      pill.title = "Click to cycle: Off → Active → Priority";
      pill.onclick = () => {
        const next = cycleState(card.selectionState);
        card.selectionState = next;
        pill.className = `lr-card-pill state-${next}`;
        pill.textContent = next.toUpperCase();
        const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || "");
        if (effectiveId) {
          hostCtx?.sendToBackend({
            type: "SAVE_WORLDBOOK_CARD",
            worldBookId: effectiveId,
            entry: {
              id: card.id,
              family: card.family,
              role: card.role,
              priority: card.priority,
              selectionState: next,
              description: card.description,
              subItems: card.subItems,
              disabled: card.disabled
            }
          });
        }
      };
      actionPart.appendChild(pill);
      const editBtn = document.createElement("button");
      editBtn.className = "recast-btn-icon";
      editBtn.textContent = isEditing ? "Close" : "Edit";
      editBtn.onclick = () => {
        if (editingWbCards.has(card.id))
          editingWbCards.delete(card.id);
        else
          editingWbCards.add(card.id);
        onRefresh();
      };
      actionPart.appendChild(editBtn);
      const delBtn = document.createElement("button");
      delBtn.className = "recast-btn-icon";
      delBtn.style.color = "#ff8a8a";
      delBtn.innerHTML = TRASH_ICON_SVG;
      delBtn.title = "Delete entry from World Book";
      delBtn.onclick = () => {
        if (confirm(`Delete card entry "${card.family}" from World Book?`)) {
          const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || "");
          hostCtx?.sendToBackend({
            type: "DELETE_WORLDBOOK_CARD",
            worldBookId: effectiveId,
            entryId: card.id
          });
          editingWbCards.delete(card.id);
        }
      };
      actionPart.appendChild(delBtn);
      headerRow.appendChild(actionPart);
      cardRow.appendChild(headerRow);
      if (!isEditing && card.description) {
        const descDiv = document.createElement("div");
        descDiv.style.fontSize = "11px";
        descDiv.style.color = "#888";
        descDiv.style.lineHeight = "1.3";
        descDiv.style.marginTop = "2px";
        descDiv.textContent = card.description.slice(0, 120) + (card.description.length > 120 ? "…" : "");
        cardRow.appendChild(descDiv);
      }
      if (isEditing) {
        const editForm = renderCardEditorForm({
          initial: {
            id: card.id,
            family: card.family,
            role: card.role,
            priority: card.priority,
            selectionState: card.selectionState,
            description: card.description,
            subItems: card.subItems,
            disabled: card.disabled
          },
          onSave: (entryData) => {
            const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || "");
            hostCtx?.sendToBackend({
              type: "SAVE_WORLDBOOK_CARD",
              worldBookId: effectiveId,
              entry: entryData
            });
            editingWbCards.delete(card.id);
          },
          onCancel: () => {
            editingWbCards.delete(card.id);
            onRefresh();
          }
        });
        cardRow.appendChild(editForm);
      }
      listDiv.appendChild(cardRow);
    }
    body.appendChild(listDiv);
  } else {
    const emptyMsg = document.createElement("div");
    emptyMsg.style.color = "#888";
    emptyMsg.style.fontStyle = "italic";
    emptyMsg.style.padding = "8px 0";
    emptyMsg.textContent = 'No card entries found in this World Book yet. Click "Sync / Create Book" above to initialize canonical cards or "Import Cards (JSON)".';
    body.appendChild(emptyMsg);
  }
  panel.appendChild(body);
  container.appendChild(panel);
}
function renderCharacterPayloadPanel(container, options) {
  const { characterStatus, hostCtx, onRefresh } = options;
  const panel = document.createElement("div");
  panel.className = "lr-panel";
  const header = document.createElement("div");
  header.className = "lr-panel-header";
  header.innerHTML = `<span>\uD83D\uDC64 Option B: Character Card Payload</span>`;
  panel.appendChild(header);
  const body = document.createElement("div");
  body.className = "lr-panel-body";
  const infoBox = document.createElement("div");
  infoBox.className = "lr-info-box";
  infoBox.innerHTML = `
    \uD83D\uDC2D <strong>Character Payload Mode:</strong> Cards are saved directly into <code>character.extensions.lumi_recursion</code>.
    This permanently binds the card deck to the character card across chats. Assistants can inspect and edit cards via <code>set</code>.
  `;
  body.appendChild(infoBox);
  if (!characterStatus) {
    const emptyDiv = document.createElement("div");
    emptyDiv.style.color = "#888";
    emptyDiv.style.padding = "8px 0";
    emptyDiv.textContent = "No active character selected in chat. Open a chat with a character to inspect or initialize their payload.";
    body.appendChild(emptyDiv);
    panel.appendChild(body);
    container.appendChild(panel);
    return;
  }
  const charBar = document.createElement("div");
  charBar.className = "lr-deck-bar";
  const statusSpan = document.createElement("div");
  statusSpan.style.flex = "1";
  statusSpan.style.fontSize = "12px";
  statusSpan.innerHTML = `Active: <strong>${characterStatus.name}</strong> · ${characterStatus.hasPayload ? `<span style="color:#7fcf8a">${characterStatus.cardCount} cards loaded</span>` : '<span style="color:#ffd479">No payload yet</span>'}`;
  charBar.appendChild(statusSpan);
  const initBtn = document.createElement("button");
  initBtn.className = "lr-btn lr-btn-primary";
  initBtn.innerHTML = `${SPARKLE_ICON_SVG} Initialize / Reset Cards`;
  initBtn.title = "Initializes the 11 canonical card families inside character.extensions.lumi_recursion";
  initBtn.onclick = () => {
    hostCtx?.sendToBackend({ type: "INIT_CHARACTER_PAYLOAD" });
  };
  charBar.appendChild(initBtn);
  body.appendChild(charBar);
  const toolbar = document.createElement("div");
  toolbar.style.display = "flex";
  toolbar.style.flexWrap = "wrap";
  toolbar.style.gap = "6px";
  toolbar.style.padding = "4px 0";
  const importBtn = document.createElement("button");
  importBtn.className = "lr-btn";
  importBtn.innerHTML = `<span>\uD83D\uDCE5 Import Payload (JSON)</span>`;
  importBtn.title = "Import a JSON payload or array of cards directly into this character card";
  importBtn.onclick = () => {
    showJsonModal({
      title: "\uD83D\uDCE5 Import Character Card Payload",
      mode: "import",
      defaultTemplate: {
        version: 1,
        enabled: true,
        pipeline: "segmented",
        cards: CARD_SCOPE_CATALOG.map((c) => ({
          id: c.role,
          family: c.family,
          name: c.family,
          role: c.role,
          priority: c.priority,
          selectionState: "active",
          description: c.description,
          promptText: c.description,
          subItems: c.subItems.map((s) => `${s.key}: ${s.description}`)
        }))
      },
      onImport: (parsed) => {
        hostCtx?.sendToBackend({
          type: "IMPORT_CHARACTER_PAYLOAD",
          characterId: characterStatus.id,
          payload: parsed
        });
      },
      hostCtx
    });
  };
  toolbar.appendChild(importBtn);
  const exportBtn = document.createElement("button");
  exportBtn.className = "lr-btn";
  exportBtn.innerHTML = `<span>\uD83D\uDCE4 Export Payload (JSON)</span>`;
  exportBtn.title = "Export character payload as JSON";
  exportBtn.onclick = () => {
    showJsonModal({
      title: "\uD83D\uDCE4 Export Character Payload (JSON)",
      mode: "export",
      initialData: {
        version: 1,
        enabled: true,
        cards: characterStatus.cards || []
      },
      hostCtx
    });
  };
  toolbar.appendChild(exportBtn);
  const guideBtn = document.createElement("button");
  guideBtn.className = "lr-btn";
  guideBtn.style.marginLeft = "auto";
  guideBtn.textContent = showCharSchemaGuide ? "▲ Hide Schema" : "ℹ️ Schema Reference";
  guideBtn.onclick = () => {
    showCharSchemaGuide = !showCharSchemaGuide;
    onRefresh();
  };
  toolbar.appendChild(guideBtn);
  body.appendChild(toolbar);
  if (showCharSchemaGuide) {
    const guideBox = document.createElement("div");
    guideBox.style.background = "#181818";
    guideBox.style.border = "1px solid #383838";
    guideBox.style.borderRadius = "5px";
    guideBox.style.padding = "8px 10px";
    guideBox.style.fontSize = "11px";
    guideBox.style.color = "#ccc";
    guideBox.innerHTML = `
      <div style="font-weight:700;color:#65d6e8;margin-bottom:4px;">\uD83D\uDC64 Character Extension Payload Schema:</div>
      <div>Stored under <code>character.extensions.lumi_recursion</code>:</div>
      <pre style="background:#111;padding:6px;border-radius:4px;margin:6px 0;font-size:10.5px;color:#a8d5e5;overflow-x:auto;">{
  "version": 1,
  "enabled": true,
  "cards": [
    {
      "id": "sceneFrameCard",
      "family": "Scene Frame",
      "name": "Scene Frame",
      "priority": 100,
      "selectionState": "priority",
      "description": "Hard boundary constraints, routes, and beat direction.",
      "promptText": "Maintain active scene awareness for Scene Frame.",
      "subItems": ["locationSituation: ...", "immediateDirection: ..."]
    }
  ]
}</pre>
    `;
    body.appendChild(guideBox);
  }
  const cards = characterStatus.cards || [];
  const listHeader = document.createElement("div");
  listHeader.style.display = "flex";
  listHeader.style.justifyContent = "space-between";
  listHeader.style.alignItems = "center";
  listHeader.style.marginTop = "6px";
  listHeader.style.paddingBottom = "4px";
  listHeader.style.borderBottom = "1px solid #333";
  listHeader.innerHTML = `
    <span style="font-weight:600;font-size:12px;color:#e0e0e0;">Character Payload Cards (${cards.length})</span>
  `;
  const addCardBtn = document.createElement("button");
  addCardBtn.className = "lr-btn lr-btn-primary";
  addCardBtn.style.padding = "2px 8px";
  addCardBtn.style.fontSize = "11px";
  addCardBtn.textContent = isAddingCharCard ? "Cancel Add" : "+ Add Custom Card";
  addCardBtn.onclick = () => {
    isAddingCharCard = !isAddingCharCard;
    onRefresh();
  };
  listHeader.appendChild(addCardBtn);
  body.appendChild(listHeader);
  if (isAddingCharCard) {
    const addForm = renderCardEditorForm({
      initial: {
        name: "New Scene Card",
        family: "Custom Card",
        role: "customCard",
        priority: 80,
        selectionState: "active",
        description: "Reasoning directive...",
        subItems: []
      },
      onSave: (cardData) => {
        hostCtx?.sendToBackend({
          type: "SAVE_CHARACTER_CARD",
          characterId: characterStatus.id,
          card: {
            id: cardData.role || `card_${Date.now()}`,
            name: cardData.name || cardData.family,
            family: cardData.family,
            role: cardData.role || `card_${Date.now()}`,
            priority: cardData.priority,
            selectionState: cardData.selectionState,
            description: cardData.description,
            promptText: cardData.description,
            subItems: cardData.subItems
          }
        });
        isAddingCharCard = false;
      },
      onCancel: () => {
        isAddingCharCard = false;
        onRefresh();
      }
    });
    body.appendChild(addForm);
  }
  if (cards.length > 0) {
    const listDiv = document.createElement("div");
    listDiv.style.display = "flex";
    listDiv.style.flexDirection = "column";
    listDiv.style.gap = "6px";
    for (const card of cards) {
      const isEditing = editingCharCards.has(card.id);
      const cardRow = document.createElement("div");
      cardRow.className = "recast-pass-item";
      const headerRow = document.createElement("div");
      headerRow.className = "recast-pass-header";
      const titlePart = document.createElement("div");
      titlePart.className = "recast-pass-title-row";
      titlePart.innerHTML = `
        <span style="font-size:12px;font-weight:600;color:#e0e0e0;">${card.name || card.family}</span>
        <span style="font-size:10px;color:#888;background:#282828;padding:1px 5px;border-radius:3px;">p:${card.priority}</span>
      `;
      headerRow.appendChild(titlePart);
      const actionPart = document.createElement("div");
      actionPart.className = "recast-pass-controls";
      const pill = document.createElement("div");
      pill.className = `lr-card-pill state-${card.selectionState}`;
      pill.textContent = card.selectionState.toUpperCase();
      pill.title = "Click to cycle: Off → Active → Priority";
      pill.onclick = () => {
        const next = cycleState(card.selectionState);
        card.selectionState = next;
        pill.className = `lr-card-pill state-${next}`;
        pill.textContent = next.toUpperCase();
        hostCtx?.sendToBackend({
          type: "UPDATE_CHARACTER_CARD_STATE",
          cardId: card.id,
          state: next
        });
      };
      actionPart.appendChild(pill);
      const editBtn = document.createElement("button");
      editBtn.className = "recast-btn-icon";
      editBtn.textContent = isEditing ? "Close" : "Edit";
      editBtn.onclick = () => {
        if (editingCharCards.has(card.id))
          editingCharCards.delete(card.id);
        else
          editingCharCards.add(card.id);
        onRefresh();
      };
      actionPart.appendChild(editBtn);
      const delBtn = document.createElement("button");
      delBtn.className = "recast-btn-icon";
      delBtn.style.color = "#ff8a8a";
      delBtn.innerHTML = TRASH_ICON_SVG;
      delBtn.title = "Delete card from character payload";
      delBtn.onclick = () => {
        if (confirm(`Remove card "${card.name || card.family}" from character payload?`)) {
          hostCtx?.sendToBackend({
            type: "DELETE_CHARACTER_CARD",
            characterId: characterStatus.id,
            cardId: card.id
          });
          editingCharCards.delete(card.id);
        }
      };
      actionPart.appendChild(delBtn);
      headerRow.appendChild(actionPart);
      cardRow.appendChild(headerRow);
      if (!isEditing && (card.description || card.promptText)) {
        const descDiv = document.createElement("div");
        descDiv.style.fontSize = "11px";
        descDiv.style.color = "#888";
        descDiv.style.lineHeight = "1.3";
        descDiv.style.marginTop = "2px";
        const txt = card.description || card.promptText || "";
        descDiv.textContent = txt.slice(0, 120) + (txt.length > 120 ? "…" : "");
        cardRow.appendChild(descDiv);
      }
      if (isEditing) {
        const editForm = renderCardEditorForm({
          initial: {
            id: card.id,
            name: card.name,
            family: card.family,
            role: card.role,
            priority: card.priority,
            selectionState: card.selectionState,
            description: card.description || card.promptText,
            subItems: card.subItems
          },
          onSave: (updated) => {
            hostCtx?.sendToBackend({
              type: "SAVE_CHARACTER_CARD",
              characterId: characterStatus.id,
              card: {
                id: card.id,
                name: updated.name || updated.family,
                family: updated.family,
                role: updated.role || card.id,
                priority: updated.priority,
                selectionState: updated.selectionState,
                description: updated.description,
                promptText: updated.description,
                subItems: updated.subItems
              }
            });
            editingCharCards.delete(card.id);
          },
          onCancel: () => {
            editingCharCards.delete(card.id);
            onRefresh();
          }
        });
        cardRow.appendChild(editForm);
      }
      listDiv.appendChild(cardRow);
    }
    body.appendChild(listDiv);
  } else {
    const emptyMsg = document.createElement("div");
    emptyMsg.style.color = "#888";
    emptyMsg.style.fontStyle = "italic";
    emptyMsg.style.padding = "8px 0";
    emptyMsg.textContent = 'No cards initialized in this character card yet. Click "Initialize / Reset Cards" above to populate all 11 canonical card families.';
    body.appendChild(emptyMsg);
  }
  panel.appendChild(body);
  container.appendChild(panel);
}
function renderCardEditorForm(options) {
  const { initial, onSave, onCancel } = options;
  const form = document.createElement("div");
  form.className = "recast-pass-details";
  form.style.background = "#1a1a1a";
  form.style.padding = "10px";
  form.style.borderRadius = "5px";
  form.style.border = "1px solid #3c3c3c";
  form.style.marginTop = "6px";
  const row1 = document.createElement("div");
  row1.className = "recast-row-2col";
  const nameCol = document.createElement("div");
  nameCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Card / Family Name:</label>`;
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "lr-select";
  nameInput.value = initial.name || initial.family || "";
  nameCol.appendChild(nameInput);
  row1.appendChild(nameCol);
  const roleCol = document.createElement("div");
  roleCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Role Identifier:</label>`;
  const roleInput = document.createElement("input");
  roleInput.type = "text";
  roleInput.className = "lr-select";
  roleInput.value = initial.role || initial.id || "";
  roleCol.appendChild(roleInput);
  row1.appendChild(roleCol);
  form.appendChild(row1);
  const row2 = document.createElement("div");
  row2.className = "recast-row-2col";
  const prioCol = document.createElement("div");
  prioCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Priority (Higher = Earlier in Prompt):</label>`;
  const prioInput = document.createElement("input");
  prioInput.type = "number";
  prioInput.className = "lr-select";
  prioInput.value = String(initial.priority ?? 80);
  prioCol.appendChild(prioInput);
  row2.appendChild(prioCol);
  const stateCol = document.createElement("div");
  stateCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Default Selection State:</label>`;
  const stateSelect = document.createElement("select");
  stateSelect.className = "lr-select";
  for (const s of ["active", "priority", "off"]) {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s.toUpperCase();
    opt.selected = s === (initial.selectionState || "active");
    stateSelect.appendChild(opt);
  }
  stateCol.appendChild(stateSelect);
  row2.appendChild(stateCol);
  form.appendChild(row2);
  const descCol = document.createElement("div");
  descCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Card Prompt / Description Directive:</label>`;
  const descTextarea = document.createElement("textarea");
  descTextarea.className = "recast-textarea";
  descTextarea.rows = 3;
  descTextarea.value = initial.description || "";
  descCol.appendChild(descTextarea);
  form.appendChild(descCol);
  const subCol = document.createElement("div");
  subCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Sub-Items / Field Schemas (one per line):</label>`;
  const subTextarea = document.createElement("textarea");
  subTextarea.className = "recast-textarea";
  subTextarea.rows = 2;
  subTextarea.placeholder = "keyName: Description of the sub-dimension...";
  subTextarea.value = (initial.subItems || []).join(`
`);
  subCol.appendChild(subTextarea);
  form.appendChild(subCol);
  const btnRow = document.createElement("div");
  btnRow.style.display = "flex";
  btnRow.style.justifyContent = "flex-end";
  btnRow.style.gap = "6px";
  btnRow.style.marginTop = "6px";
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "lr-btn";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = onCancel;
  btnRow.appendChild(cancelBtn);
  const saveBtn = document.createElement("button");
  saveBtn.className = "lr-btn lr-btn-primary";
  saveBtn.textContent = "\uD83D\uDCBE Save Changes";
  saveBtn.onclick = () => {
    const subLines = subTextarea.value.split(`
`).map((l) => l.trim()).filter(Boolean);
    onSave({
      id: initial.id,
      family: nameInput.value.trim() || initial.family,
      name: nameInput.value.trim() || initial.family,
      role: roleInput.value.trim() || initial.role,
      priority: parseInt(prioInput.value, 10) || 80,
      selectionState: stateSelect.value,
      description: descTextarea.value.trim(),
      subItems: subLines,
      disabled: initial.disabled
    });
  };
  btnRow.appendChild(saveBtn);
  form.appendChild(btnRow);
  return form;
}

// src/frontend.ts
var RECURSION_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12"/><path d="M12 6a6 6 0 0 1 6 6c0 3.314-2.686 6-6 6s-6-2.686-6-6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`;
var BOOK_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
var USER_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
var DUPLICATE_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
var TRASH_ICON_SVG2 = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
var COPY_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
var REFRESH_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
var STYLES = `
/* Lumi:REcursion Technical Graphite Dark Theme */
.lr-root {
  background: #1c1c1c;
  color: #d8d8d8;
  font-family: var(--mainFontFamily, "Noto Sans", -apple-system, sans-serif);
  font-size: 12.5px;
  line-height: 1.4;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lr-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #242424;
  border: 1px solid #383838;
  border-radius: 6px;
  padding: 6px 10px;
  gap: 8px;
}

.lr-bar-left, .lr-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lr-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 4px;
  background: #2d2d2d;
  color: #a8a8a8;
  border: 1px solid #444;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.lr-badge:hover {
  background: #363636;
  color: #fff;
}

.lr-badge.active {
  background: rgba(101, 214, 232, 0.15);
  border-color: #65d6e8;
  color: #65d6e8;
}

.lr-badge.mode-manual {
  background: rgba(255, 212, 121, 0.15);
  border-color: #ffd479;
  color: #ffd479;
}

/* Source Mode Segment Bar */
.lr-source-segments {
  display: flex;
  background: #202020;
  border: 1px solid #383838;
  border-radius: 6px;
  padding: 3px;
  gap: 4px;
}

.lr-source-btn {
  flex: 1;
  text-align: center;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  color: #999;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.15s ease;
}

.lr-source-btn:hover {
  background: #2a2a2a;
  color: #ddd;
}

.lr-source-btn.active {
  background: rgba(101, 214, 232, 0.15);
  color: #65d6e8;
  border-color: #65d6e8;
}

/* Switch Toggle */
.lr-toggle {
  position: relative;
  width: 38px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
  margin: 0;
}

.lr-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.lr-toggle-slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #383838;
  border-radius: 20px;
  transition: .2s;
  border: 1px solid #484848;
}

.lr-toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #888;
  border-radius: 50%;
  transition: .2s;
}

.lr-toggle input:checked + .lr-toggle-slider {
  background-color: rgba(101, 214, 232, 0.25);
  border-color: #65d6e8;
}

.lr-toggle input:checked + .lr-toggle-slider:before {
  transform: translateX(18px);
  background-color: #65d6e8;
}

/* Hero Pixel Array */
.lr-hero-panel {
  background: #222;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lr-hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #a8a8a8;
}

.lr-hero-pixels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 14px;
  align-items: center;
}

.lr-pixel {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #333;
  border: 1px solid #444;
  transition: all 0.2s ease;
  position: relative;
}

.lr-pixel.state-running {
  background: #65d6e8;
  border-color: #65d6e8;
  box-shadow: 0 0 6px rgba(101, 214, 232, 0.6);
  animation: lr-pulse 1s infinite alternate;
}

.lr-pixel.state-success {
  background: #7fcf8a;
  border-color: #7fcf8a;
}

.lr-pixel.state-cached {
  background: #a78bfa;
  border-color: #a78bfa;
}

.lr-pixel.state-warning {
  background: #ffd479;
  border-color: #ffd479;
}

.lr-pixel.state-error {
  background: #ff8a8a;
  border-color: #ff8a8a;
}

@keyframes lr-pulse {
  0% { opacity: 0.4; }
  100% { opacity: 1; }
}

.lr-step-text {
  font-size: 11px;
  color: #bbb;
  font-style: italic;
}

/* Panels and sections */
.lr-panel {
  background: #242424;
  border: 1px solid #383838;
  border-radius: 6px;
  overflow: hidden;
}

.lr-panel-header {
  padding: 8px 12px;
  background: #282828;
  border-bottom: 1px solid #333;
  font-size: 12px;
  font-weight: 600;
  color: #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.lr-panel-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lr-info-box {
  background: #1b1b1b;
  border: 1px solid #333;
  border-left: 3px solid #65d6e8;
  border-radius: 0 5px 5px 0;
  padding: 8px 10px;
  font-size: 11px;
  color: #a8a8a8;
  line-height: 1.4;
}

/* Deck Controls */
.lr-deck-bar {
  display: flex;
  gap: 8px;
  align-items: center;
}

.lr-select {
  flex: 1;
  background: #1c1c1c;
  border: 1px solid #444;
  color: #eee;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 12px;
  outline: none;
  cursor: pointer;
}

.lr-btn {
  background: #2e2e2e;
  border: 1px solid #444;
  color: #ddd;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s;
}

.lr-btn:hover {
  background: #3a3a3a;
  color: #fff;
  border-color: #555;
}

.lr-btn-primary {
  background: rgba(101, 214, 232, 0.2);
  border-color: #65d6e8;
  color: #65d6e8;
}

.lr-btn-primary:hover {
  background: rgba(101, 214, 232, 0.35);
  color: #fff;
}

/* Category Accordion */
.lr-category {
  border: 1px solid #333;
  border-radius: 5px;
  overflow: hidden;
  background: #1f1f1f;
}

.lr-category-header {
  padding: 7px 10px;
  background: #262626;
  font-size: 11.5px;
  font-weight: 600;
  color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.lr-category-header:hover {
  background: #2b2b2b;
  color: #fff;
}

.lr-category-cards {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid #303030;
}

.lr-card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 8px;
  background: #242424;
  border: 1px solid #353535;
  border-radius: 4px;
  gap: 8px;
}

.lr-card-info {
  flex: 1;
}

.lr-card-name {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
}

.lr-card-desc {
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 2px;
  line-height: 1.3;
}

.lr-card-pill {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  white-space: nowrap;
}

.lr-card-pill.state-off {
  background: #2a2a2a;
  color: #666;
  border-color: #383838;
}

.lr-card-pill.state-active {
  background: rgba(101, 214, 232, 0.15);
  color: #65d6e8;
  border-color: rgba(101, 214, 232, 0.4);
}

.lr-card-pill.state-priority {
  background: rgba(255, 212, 121, 0.2);
  color: #ffd479;
  border-color: #ffd479;
}

/* Last Brief */
.lr-brief-meta {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #999;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}

.lr-brief-card {
  padding: 8px 10px;
  background: #1f1f1f;
  border-left: 3px solid #65d6e8;
  border-radius: 0 4px 4px 0;
  font-size: 11.5px;
  margin-bottom: 6px;
}

.lr-brief-card-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #65d6e8;
  margin-bottom: 4px;
}

.lr-brief-card-text {
  color: #d0d0d0;
  line-height: 1.4;
}

/* Modal Host */
#recursion-modal-host {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 999999;
  pointer-events: none;
}

#recursion-modal-host.active {
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
`;
var hostCtx = null;
var currentSettings = null;
var currentDecks = {};
var currentActiveDeckId = DEFAULT_DECK_ID;
var lastBrief = null;
var currentProgress = {
  runId: "",
  active: false,
  pipeline: "segmented",
  phase: "idle",
  pixels: []
};
var availableConnections = [];
var availableWorldBooks = [];
var activeCharacterStatus = null;
var activeNavTab = "reasoning";
var currentRecastSettings = { ...DEFAULT_RECAST_SETTINGS };
var currentRecastProgress = null;
var currentWorldBookCards = [];
var panelRoots = new Set;
var inputBarActionHandle = null;
var openCategories = new Set;
function ensureModalHost() {
  let host = document.getElementById("recursion-modal-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "recursion-modal-host";
    document.body.appendChild(host);
  }
  return host;
}
function updateInputBarLabel() {
  if (inputBarActionHandle && typeof inputBarActionHandle.setLabel === "function") {
    const isEnabled = currentSettings?.enabled ?? false;
    inputBarActionHandle.setLabel(isEnabled ? "\uD83E\uDDE0 RE: ON" : "\uD83E\uDDE0 RE: OFF");
  }
}
function cycleCardState(cardId, currentState, mode) {
  if (mode === "manual") {
    return currentState === "off" ? "active" : "off";
  }
  if (currentState === "off")
    return "active";
  if (currentState === "active")
    return "priority";
  return "off";
}
function renderAllPanels() {
  for (const root of panelRoots) {
    renderMainPanel(root);
  }
}
function renderMainPanel(root) {
  if (!currentSettings) {
    root.innerHTML = `<div class="lr-root"><div style="color:#888;text-align:center;padding:20px;">Connecting to Lumi:REcursion engine...</div></div>`;
    return;
  }
  root.innerHTML = "";
  const container = document.createElement("div");
  container.className = "lr-root";
  const navBar = document.createElement("div");
  navBar.className = "lr-tab-nav";
  const reasoningTabBtn = document.createElement("button");
  reasoningTabBtn.className = `lr-tab-btn ${activeNavTab === "reasoning" ? "active" : ""}`;
  reasoningTabBtn.innerHTML = `<span>\uD83E\uDDE0 Scene Reasoning</span>`;
  reasoningTabBtn.onclick = () => {
    activeNavTab = "reasoning";
    renderAllPanels();
  };
  const recastTabBtn = document.createElement("button");
  recastTabBtn.className = `lr-tab-btn ${activeNavTab === "recast" ? "active-recast" : ""}`;
  recastTabBtn.innerHTML = `<span>✨ Recast Post-Processing</span>`;
  recastTabBtn.onclick = () => {
    activeNavTab = "recast";
    renderAllPanels();
  };
  navBar.appendChild(reasoningTabBtn);
  navBar.appendChild(recastTabBtn);
  container.appendChild(navBar);
  if (activeNavTab === "recast") {
    renderRecastPanel(container, {
      recastSettings: currentRecastSettings,
      recastProgress: currentRecastProgress,
      availableConnections,
      hostCtx,
      onRefresh: renderAllPanels
    });
    root.appendChild(container);
    return;
  }
  const bar = document.createElement("div");
  bar.className = "lr-bar";
  const barLeft = document.createElement("div");
  barLeft.className = "lr-bar-left";
  const toggleLabel = document.createElement("label");
  toggleLabel.className = "lr-toggle";
  toggleLabel.title = "Toggle Lumi:REcursion scene reasoning";
  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";
  toggleInput.checked = currentSettings.enabled;
  toggleInput.onchange = () => {
    const next = toggleInput.checked;
    currentSettings.enabled = next;
    updateInputBarLabel();
    hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { enabled: next } });
    renderAllPanels();
  };
  const toggleSlider = document.createElement("span");
  toggleSlider.className = "lr-toggle-slider";
  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(toggleSlider);
  barLeft.appendChild(toggleLabel);
  const titleSpan = document.createElement("span");
  titleSpan.style.fontWeight = "700";
  titleSpan.style.fontSize = "12px";
  titleSpan.style.color = currentSettings.enabled ? "#65d6e8" : "#777";
  titleSpan.textContent = "Lumi:REcursion";
  barLeft.appendChild(titleSpan);
  const barRight = document.createElement("div");
  barRight.className = "lr-bar-right";
  const modeBadge = document.createElement("span");
  modeBadge.className = `lr-badge ${currentSettings.mode === "manual" ? "mode-manual" : "active"}`;
  modeBadge.textContent = currentSettings.mode.toUpperCase();
  modeBadge.title = "Click to toggle Auto / Manual mode";
  modeBadge.onclick = () => {
    const nextMode = currentSettings.mode === "auto" ? "manual" : "auto";
    currentSettings.mode = nextMode;
    hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { mode: nextMode } });
    renderAllPanels();
  };
  barRight.appendChild(modeBadge);
  const pipelineBadge = document.createElement("span");
  pipelineBadge.className = `lr-badge ${currentSettings.pipeline === "segmented" ? "active" : ""}`;
  pipelineBadge.textContent = currentSettings.pipeline === "segmented" ? "PARALLEL" : "FUSED";
  pipelineBadge.title = "Click to switch Pipeline (Segmented Parallel vs Fused)";
  pipelineBadge.onclick = () => {
    const nextPipe = currentSettings.pipeline === "segmented" ? "fused" : "segmented";
    currentSettings.pipeline = nextPipe;
    hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { pipeline: nextPipe } });
    renderAllPanels();
  };
  barRight.appendChild(pipelineBadge);
  if (currentSettings.mode === "manual") {
    const runBtn = document.createElement("button");
    runBtn.className = "lr-btn lr-btn-primary";
    runBtn.style.padding = "2px 6px";
    runBtn.style.fontSize = "11px";
    runBtn.textContent = "\uD83C\uDFAF Arm";
    runBtn.title = "Arm scene reasoning for the next turn";
    runBtn.onclick = () => {
      hostCtx?.sendToBackend({ type: "MANUAL_RUN_NOW" });
    };
    barRight.appendChild(runBtn);
  }
  bar.appendChild(barLeft);
  bar.appendChild(barRight);
  container.appendChild(bar);
  const heroPanel = document.createElement("div");
  heroPanel.className = "lr-hero-panel";
  const heroHeader = document.createElement("div");
  heroHeader.className = "lr-hero-header";
  heroHeader.innerHTML = `
    <span><strong>Turn Reasoner</strong> · <span style="color:#65d6e8">${currentSettings.cardSourceMode.toUpperCase()}</span></span>
    <span>${currentProgress.phase.toUpperCase()}</span>
  `;
  heroPanel.appendChild(heroHeader);
  const heroPixels = document.createElement("div");
  heroPixels.className = "lr-hero-pixels";
  if (currentProgress.pixels && currentProgress.pixels.length > 0) {
    for (const p of currentProgress.pixels) {
      const pix = document.createElement("div");
      pix.className = `lr-pixel state-${p.state}`;
      pix.title = `${p.name} (${p.state})${p.latencyMs ? ` — ${p.latencyMs}ms` : ""}`;
      heroPixels.appendChild(pix);
    }
  } else {
    for (let i = 0;i < 6; i++) {
      const pix = document.createElement("div");
      pix.className = "lr-pixel";
      heroPixels.appendChild(pix);
    }
  }
  heroPanel.appendChild(heroPixels);
  if (currentProgress.currentStepText) {
    const stepText = document.createElement("div");
    stepText.className = "lr-step-text";
    stepText.textContent = currentProgress.currentStepText;
    heroPanel.appendChild(stepText);
  }
  container.appendChild(heroPanel);
  const sourceSegmentPanel = document.createElement("div");
  sourceSegmentPanel.className = "lr-source-segments";
  const modes = [
    { id: "world_book", label: "Option A: World Book", icon: BOOK_ICON_SVG },
    { id: "character_ext", label: "Option B: Character", icon: USER_ICON_SVG },
    { id: "local_deck", label: "Local Decks", icon: DUPLICATE_ICON_SVG }
  ];
  for (const m of modes) {
    const btn = document.createElement("button");
    btn.className = `lr-source-btn ${currentSettings.cardSourceMode === m.id ? "active" : ""}`;
    btn.innerHTML = `${m.icon} ${m.label}`;
    btn.onclick = () => {
      currentSettings.cardSourceMode = m.id;
      hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { cardSourceMode: m.id } });
      if (m.id === "world_book" && currentSettings?.worldBookId) {
        hostCtx?.sendToBackend({ type: "GET_WORLDBOOK_CARDS", worldBookId: currentSettings.worldBookId });
      }
      renderAllPanels();
    };
    sourceSegmentPanel.appendChild(btn);
  }
  container.appendChild(sourceSegmentPanel);
  if (currentSettings.cardSourceMode === "world_book") {
    renderWorldBookPanel(container, {
      worldBooks: availableWorldBooks,
      selectedWorldBookId: currentSettings.worldBookId,
      cards: currentWorldBookCards,
      hostCtx,
      onRefresh: renderAllPanels
    });
  } else if (currentSettings.cardSourceMode === "character_ext") {
    renderCharacterPayloadPanel(container, {
      characterStatus: activeCharacterStatus,
      hostCtx,
      onRefresh: renderAllPanels
    });
  } else {
    const activeDeck = currentDecks[currentActiveDeckId] || currentDecks[DEFAULT_DECK_ID];
    const deckPanel = document.createElement("div");
    deckPanel.className = "lr-panel";
    const deckHeader = document.createElement("div");
    deckHeader.className = "lr-panel-header";
    deckHeader.innerHTML = `<span>\uD83C\uDCCF Local Extension Decks</span>`;
    deckPanel.appendChild(deckHeader);
    const deckBody = document.createElement("div");
    deckBody.className = "lr-panel-body";
    const deckBar = document.createElement("div");
    deckBar.className = "lr-deck-bar";
    const deckSelect = document.createElement("select");
    deckSelect.className = "lr-select";
    for (const [id, d] of Object.entries(currentDecks)) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `${d.name}${d.bundled ? " (Bundled)" : ""}`;
      opt.selected = id === currentActiveDeckId;
      deckSelect.appendChild(opt);
    }
    deckSelect.onchange = () => {
      hostCtx?.sendToBackend({ type: "SWITCH_DECK", deckId: deckSelect.value });
    };
    deckBar.appendChild(deckSelect);
    const dupBtn = document.createElement("button");
    dupBtn.className = "lr-btn";
    dupBtn.innerHTML = `${DUPLICATE_ICON_SVG} Copy`;
    dupBtn.title = "Duplicate current deck to make an editable copy";
    dupBtn.onclick = () => {
      const cur = currentDecks[currentActiveDeckId];
      const newName = prompt("Enter name for the duplicated deck:", `${cur?.name || "Deck"} (Copy)`);
      if (newName) {
        hostCtx?.sendToBackend({
          type: "DUPLICATE_DECK",
          sourceDeckId: currentActiveDeckId,
          newName
        });
      }
    };
    deckBar.appendChild(dupBtn);
    if (activeDeck && !activeDeck.bundled) {
      const delBtn = document.createElement("button");
      delBtn.className = "lr-btn";
      delBtn.style.color = "#ff8a8a";
      delBtn.innerHTML = `${TRASH_ICON_SVG2}`;
      delBtn.title = "Delete custom deck";
      delBtn.onclick = () => {
        const confirmText = prompt(`Type "delete" to confirm deleting deck "${activeDeck.name}":`);
        if (confirmText && confirmText.toLowerCase() === "delete") {
          hostCtx?.sendToBackend({ type: "DELETE_DECK", deckId: activeDeck.id });
        }
      };
      deckBar.appendChild(delBtn);
    }
    deckBody.appendChild(deckBar);
    if (activeDeck) {
      for (const catId of activeDeck.categoryOrder || []) {
        const cat = activeDeck.categories[catId];
        if (!cat)
          continue;
        const cardIds = activeDeck.cardOrderByCategory[catId] || [];
        const isOpen = openCategories.has(catId);
        const catDiv = document.createElement("div");
        catDiv.className = "lr-category";
        const catHeader = document.createElement("div");
        catHeader.className = "lr-category-header";
        const activeCount = cardIds.filter((cid) => {
          const c = activeDeck.cards[cid];
          return c && (c.selectionState === "active" || c.selectionState === "priority");
        }).length;
        catHeader.innerHTML = `
          <span>${isOpen ? "▼" : "▶"} ${cat.name} <span style="font-weight:400;color:#888;font-size:11px;">(${activeCount}/${cardIds.length})</span></span>
          <div style="display:flex;gap:4px;" onclick="event.stopPropagation()">
            <button class="lr-btn" style="padding:1px 5px;font-size:10px;" id="cat-all-active-${catId}">All</button>
            <button class="lr-btn" style="padding:1px 5px;font-size:10px;" id="cat-all-off-${catId}">Off</button>
          </div>
        `;
        catHeader.onclick = () => {
          if (openCategories.has(catId))
            openCategories.delete(catId);
          else
            openCategories.add(catId);
          renderAllPanels();
        };
        const allActiveBtn = catHeader.querySelector(`#cat-all-active-${catId}`);
        if (allActiveBtn) {
          allActiveBtn.onclick = () => {
            hostCtx?.sendToBackend({
              type: "BULK_SET_CARDS",
              deckId: activeDeck.id,
              categoryId: catId,
              state: "active"
            });
          };
        }
        const allOffBtn = catHeader.querySelector(`#cat-all-off-${catId}`);
        if (allOffBtn) {
          allOffBtn.onclick = () => {
            hostCtx?.sendToBackend({
              type: "BULK_SET_CARDS",
              deckId: activeDeck.id,
              categoryId: catId,
              state: "off"
            });
          };
        }
        catDiv.appendChild(catHeader);
        if (isOpen) {
          const cardsDiv = document.createElement("div");
          cardsDiv.className = "lr-category-cards";
          for (const cid of cardIds) {
            const card = activeDeck.cards[cid];
            if (!card)
              continue;
            const row = document.createElement("div");
            row.className = "lr-card-row";
            const info = document.createElement("div");
            info.className = "lr-card-info";
            info.innerHTML = `
              <div class="lr-card-name">${card.name}</div>
              <div class="lr-card-desc">${card.description}</div>
            `;
            row.appendChild(info);
            const pill = document.createElement("div");
            pill.className = `lr-card-pill state-${card.selectionState}`;
            pill.textContent = card.selectionState.toUpperCase();
            pill.onclick = () => {
              const next = cycleCardState(card.id, card.selectionState, currentSettings.mode);
              card.selectionState = next;
              pill.className = `lr-card-pill state-${next}`;
              pill.textContent = next.toUpperCase();
              hostCtx?.sendToBackend({
                type: "SET_CARD_STATE",
                deckId: activeDeck.id,
                cardId: card.id,
                state: next
              });
            };
            row.appendChild(pill);
            cardsDiv.appendChild(row);
          }
          catDiv.appendChild(cardsDiv);
        }
        deckBody.appendChild(catDiv);
      }
    }
    deckPanel.appendChild(deckBody);
    container.appendChild(deckPanel);
  }
  if (lastBrief) {
    const briefPanel = document.createElement("div");
    briefPanel.className = "lr-panel";
    const briefHeader = document.createElement("div");
    briefHeader.className = "lr-panel-header";
    briefHeader.innerHTML = `
      <span>\uD83D\uDCCB Last Brief (${lastBrief.cards.length} cards, ${lastBrief.totalLatencyMs}ms)</span>
      <div style="display:flex;gap:6px;">
        <button class="lr-btn" id="lr-copy-packet-btn" style="padding:2px 6px;font-size:10px;">${COPY_ICON_SVG} Packet</button>
      </div>
    `;
    const copyBtn = briefHeader.querySelector("#lr-copy-packet-btn");
    if (copyBtn) {
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(lastBrief.injectedPacket);
        hostCtx?.toast?.success?.("\uD83D\uDCCB Injected packet copied to clipboard!");
      };
    }
    const briefBody = document.createElement("div");
    briefBody.className = "lr-panel-body";
    const briefMeta = document.createElement("div");
    briefMeta.className = "lr-brief-meta";
    briefMeta.innerHTML = `
      <span>Pipeline: <strong>${lastBrief.pipeline.toUpperCase()}</strong></span>
      <span>Footprint: <strong>${lastBrief.promptFootprint}</strong></span>
      <span>Tokens: ~<strong>${lastBrief.estimatedTokens}</strong></span>
    `;
    briefBody.appendChild(briefMeta);
    for (const c of lastBrief.cards) {
      const cDiv = document.createElement("div");
      cDiv.className = "lr-brief-card";
      cDiv.innerHTML = `
        <div class="lr-brief-card-header">
          <span>${c.family} · ${c.name}</span>
          <span style="color:#aaa;font-size:10px;">${c.latencyMs}ms</span>
        </div>
        <div class="lr-brief-card-text">${c.promptText}</div>
        ${c.evidenceRefs && c.evidenceRefs.length ? `<div style="font-size:10px;color:#65d6e8;margin-top:2px;">Evidence: ${c.evidenceRefs.join(", ")}</div>` : ""}
      `;
      briefBody.appendChild(cDiv);
    }
    briefPanel.appendChild(briefHeader);
    briefPanel.appendChild(briefBody);
    container.appendChild(briefPanel);
  }
  const settingsPanel = document.createElement("div");
  settingsPanel.className = "lr-panel";
  const settingsHeader = document.createElement("div");
  settingsHeader.className = "lr-panel-header";
  settingsHeader.innerHTML = `<span>⚙️ Behavior & Model Lane</span>`;
  settingsPanel.appendChild(settingsHeader);
  const settingsBody = document.createElement("div");
  settingsBody.className = "lr-panel-body";
  const connRow = document.createElement("div");
  connRow.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Generation Connection Profile:</label>`;
  const connSelect = document.createElement("select");
  connSelect.className = "lr-select";
  const defOpt = document.createElement("option");
  defOpt.value = "";
  defOpt.textContent = "Active / Default Connection Profile";
  connSelect.appendChild(defOpt);
  for (const c of availableConnections) {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.name}${c.is_default ? " (Default)" : ""}`;
    opt.selected = c.id === currentSettings.connectionProfileId;
    connSelect.appendChild(opt);
  }
  connSelect.onchange = () => {
    currentSettings.connectionProfileId = connSelect.value;
    hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { connectionProfileId: connSelect.value } });
  };
  connRow.appendChild(connSelect);
  settingsBody.appendChild(connRow);
  const modelRow = document.createElement("div");
  modelRow.style.marginTop = "8px";
  modelRow.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Model Override (Optional):</label>`;
  const modelGroup = createModelOverrideInputGroup({
    value: currentSettings.modelOverride || "",
    placeholder: "Leave blank to use connection profile default...",
    datalistId: "lr-reasoning-models-datalist",
    getConnectionId: () => {
      if (currentSettings?.connectionProfileId)
        return currentSettings.connectionProfileId;
      const def = availableConnections.find((c) => c.is_default) || availableConnections[0];
      return def ? def.id : "";
    },
    getConnectionName: () => {
      const connId = currentSettings?.connectionProfileId;
      const target = connId ? availableConnections.find((c) => c.id === connId) : availableConnections.find((c) => c.is_default) || availableConnections[0];
      return target?.name || "Default Connection";
    },
    onSave: (val) => {
      currentSettings.modelOverride = val;
      hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { modelOverride: val } });
    },
    hostCtx
  });
  modelRow.appendChild(modelGroup);
  settingsBody.appendChild(modelRow);
  const reasoningRow = document.createElement("div");
  reasoningRow.style.marginTop = "8px";
  reasoningRow.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Reasoning / Thinking Effort:</label>`;
  const reasoningSelect = document.createElement("select");
  reasoningSelect.className = "lr-select";
  const reasoningOptions = [
    { value: "off", label: "\uD83D\uDE80 Off (Fastest, Recommended for card evaluation)" },
    { value: "low", label: "⚡ Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "inherit", label: "Inherit Connection Profile Default" }
  ];
  for (const ro of reasoningOptions) {
    const opt = document.createElement("option");
    opt.value = ro.value;
    opt.textContent = ro.label;
    opt.selected = (currentSettings.reasoningEffort || "off") === ro.value;
    reasoningSelect.appendChild(opt);
  }
  reasoningSelect.onchange = () => {
    currentSettings.reasoningEffort = reasoningSelect.value;
    hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { reasoningEffort: reasoningSelect.value } });
  };
  reasoningRow.appendChild(reasoningSelect);
  settingsBody.appendChild(reasoningRow);
  const gridRow = document.createElement("div");
  gridRow.style.display = "grid";
  gridRow.style.gridTemplateColumns = "1fr 1fr";
  gridRow.style.gap = "8px";
  const footCol = document.createElement("div");
  footCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Prompt Footprint:</label>`;
  const footSelect = document.createElement("select");
  footSelect.className = "lr-select";
  for (const f of ["compact", "normal", "rich"]) {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f.toUpperCase();
    opt.selected = f === currentSettings.promptFootprint;
    footSelect.appendChild(opt);
  }
  footSelect.onchange = () => {
    currentSettings.promptFootprint = footSelect.value;
    hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { promptFootprint: footSelect.value } });
  };
  footCol.appendChild(footSelect);
  gridRow.appendChild(footCol);
  const tenseCol = document.createElement("div");
  tenseCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Story Tense:</label>`;
  const tenseSelect = document.createElement("select");
  tenseSelect.className = "lr-select";
  for (const t of ["auto", "past", "present"]) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t.toUpperCase();
    opt.selected = t === currentSettings.storyForm.tense;
    tenseSelect.appendChild(opt);
  }
  tenseSelect.onchange = () => {
    currentSettings.storyForm.tense = tenseSelect.value;
    hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { storyForm: currentSettings.storyForm } });
  };
  tenseCol.appendChild(tenseSelect);
  gridRow.appendChild(tenseCol);
  settingsBody.appendChild(gridRow);
  const clearCacheBtn = document.createElement("button");
  clearCacheBtn.className = "lr-btn";
  clearCacheBtn.innerHTML = `${REFRESH_ICON_SVG} Clear Cache`;
  clearCacheBtn.onclick = () => {
    hostCtx?.sendToBackend({ type: "CLEAR_CACHE" });
  };
  settingsBody.appendChild(clearCacheBtn);
  settingsPanel.appendChild(settingsBody);
  container.appendChild(settingsPanel);
  root.appendChild(container);
}
async function setup(ctx) {
  hostCtx = ctx;
  const removeStyle = ctx.dom.addStyle(STYLES + `
` + RECAST_STYLES);
  ensureModalHost();
  const drawerHandle = ctx.ui.registerDrawerTab({
    id: "lumi-recursion",
    title: "Lumi:REcursion",
    shortName: "Recursion",
    description: "Scene reasoning and turn-bound card system with parallel card evaluation",
    keywords: ["recursion", "reasoning", "scene", "cards", "context", "continuity", "subtext"],
    iconSvg: RECURSION_ICON_SVG
  });
  if (drawerHandle?.root) {
    panelRoots.add(drawerHandle.root);
    renderMainPanel(drawerHandle.root);
  }
  let unsubDrawerActivate;
  if (typeof drawerHandle?.onActivate === "function") {
    unsubDrawerActivate = drawerHandle.onActivate(() => {
      if (drawerHandle.root) {
        panelRoots.add(drawerHandle.root);
      }
      ctx.sendToBackend({ type: "GET_STATE" });
      renderAllPanels();
    });
  }
  let settingsHandle = null;
  let unsubSettingsActivate;
  if (typeof ctx.ui?.registerSettingsTab === "function") {
    settingsHandle = ctx.ui.registerSettingsTab({
      id: "lumi-recursion-settings",
      title: "Lumi:REcursion",
      description: "Configure scene reasoning pipeline and model lanes",
      iconSvg: RECURSION_ICON_SVG
    });
    if (settingsHandle?.root) {
      panelRoots.add(settingsHandle.root);
      renderMainPanel(settingsHandle.root);
    }
    if (typeof settingsHandle?.onActivate === "function") {
      unsubSettingsActivate = settingsHandle.onActivate(() => {
        if (settingsHandle.root) {
          panelRoots.add(settingsHandle.root);
        }
        ctx.sendToBackend({ type: "GET_STATE" });
        renderAllPanels();
      });
    }
  }
  if (typeof ctx.ui?.registerInputBarAction === "function") {
    inputBarActionHandle = ctx.ui.registerInputBarAction({
      id: "lumi-recursion-input-toggle",
      label: "\uD83E\uDDE0 RE: ON",
      iconSvg: RECURSION_ICON_SVG,
      onClick: () => {
        if (currentSettings) {
          const next = !currentSettings.enabled;
          currentSettings.enabled = next;
          updateInputBarLabel();
          ctx.sendToBackend({ type: "UPDATE_SETTINGS", settings: { enabled: next } });
          ctx.toast?.info?.(next ? "\uD83E\uDDE0 Lumi:REcursion scene reasoning enabled" : "\uD83E\uDDE0 Lumi:REcursion disabled");
          renderAllPanels();
        }
      }
    });
  }
  const unsubBackend = ctx.onBackendMessage((msg) => {
    switch (msg.type) {
      case "STATE": {
        currentSettings = msg.settings;
        currentDecks = msg.decks;
        currentActiveDeckId = msg.activeDeckId;
        lastBrief = msg.lastBrief;
        currentProgress = msg.progress;
        availableConnections = msg.connections || [];
        availableWorldBooks = msg.worldBooks || [];
        activeCharacterStatus = msg.characterStatus || null;
        if (msg.worldBookCards) {
          currentWorldBookCards = msg.worldBookCards;
        }
        if (msg.recastSettings) {
          currentRecastSettings = msg.recastSettings;
        }
        currentRecastProgress = msg.recastProgress || null;
        updateInputBarLabel();
        renderAllPanels();
        break;
      }
      case "SETTINGS_UPDATED": {
        currentSettings = msg.settings;
        updateInputBarLabel();
        renderAllPanels();
        break;
      }
      case "DECKS_UPDATED": {
        currentDecks = msg.decks;
        currentActiveDeckId = msg.activeDeckId;
        renderAllPanels();
        break;
      }
      case "BRIEF_UPDATED": {
        lastBrief = msg.brief;
        renderAllPanels();
        break;
      }
      case "PROGRESS": {
        currentProgress = msg.progress;
        renderAllPanels();
        break;
      }
      case "CONNECTIONS": {
        availableConnections = msg.connections || [];
        renderAllPanels();
        break;
      }
      case "WORLD_BOOKS_UPDATED": {
        availableWorldBooks = msg.worldBooks || [];
        if (currentSettings) {
          currentSettings.worldBookId = msg.selectedId;
        }
        renderAllPanels();
        break;
      }
      case "WORLDBOOK_CARDS_UPDATED": {
        currentWorldBookCards = msg.cards || [];
        renderAllPanels();
        break;
      }
      case "CHARACTER_STATUS_UPDATED": {
        activeCharacterStatus = msg.status;
        renderAllPanels();
        break;
      }
      case "RECAST_STATE_UPDATED": {
        currentRecastSettings = msg.settings;
        currentRecastProgress = msg.progress;
        renderAllPanels();
        break;
      }
      case "RECAST_PROGRESS": {
        currentRecastProgress = msg.progress;
        renderAllPanels();
        break;
      }
      case "RECAST_DIFF_READY": {
        showRecastDiffModal(msg.diff, ctx);
        break;
      }
      case "RECAST_APPLIED": {
        renderAllPanels();
        break;
      }
    }
  });
  ctx.sendToBackend({ type: "GET_STATE" });
  return () => {
    removeStyle?.();
    unsubDrawerActivate?.();
    unsubSettingsActivate?.();
    unsubBackend?.();
    panelRoots.clear();
  };
}
var frontend_default = setup;
export {
  frontend_default as default,
  setup
};
