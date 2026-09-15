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

// src/frontend.ts
var RECURSION_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12"/><path d="M12 6a6 6 0 0 1 6 6c0 3.314-2.686 6-6 6s-6-2.686-6-6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`;
var BOOK_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
var USER_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
var DUPLICATE_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
var TRASH_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
var COPY_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
var REFRESH_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
var SPARKLE_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`;
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
      renderAllPanels();
    };
    sourceSegmentPanel.appendChild(btn);
  }
  container.appendChild(sourceSegmentPanel);
  if (currentSettings.cardSourceMode === "world_book") {
    const wbPanel = document.createElement("div");
    wbPanel.className = "lr-panel";
    const wbHeader = document.createElement("div");
    wbHeader.className = "lr-panel-header";
    wbHeader.innerHTML = `<span>\uD83D\uDCD6 Option A: World Book Card Definitions</span>`;
    wbPanel.appendChild(wbHeader);
    const wbBody = document.createElement("div");
    wbBody.className = "lr-panel-body";
    const infoBox = document.createElement("div");
    infoBox.className = "lr-info-box";
    infoBox.innerHTML = `
      \uD83D\uDC2D <strong>World Book Mode:</strong> Cards are stored as native entries inside a Lumiverse World Book.
      Both you and assistant personas (like Mousepad) can view, edit, enable/disable, or create new cards natively in the World Books manager.
    `;
    wbBody.appendChild(infoBox);
    const selectRow = document.createElement("div");
    selectRow.className = "lr-deck-bar";
    const wbSelect = document.createElement("select");
    wbSelect.className = "lr-select";
    const defWbOpt = document.createElement("option");
    defWbOpt.value = "";
    defWbOpt.textContent = 'Auto-detect "Lumi:REcursion Cards" or attached book';
    wbSelect.appendChild(defWbOpt);
    for (const b of availableWorldBooks) {
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = `${b.name}${b.entryCount !== undefined ? ` (${b.entryCount} entries)` : ""}`;
      opt.selected = b.id === currentSettings.worldBookId;
      wbSelect.appendChild(opt);
    }
    wbSelect.onchange = () => {
      currentSettings.worldBookId = wbSelect.value;
      hostCtx?.sendToBackend({ type: "UPDATE_SETTINGS", settings: { worldBookId: wbSelect.value } });
    };
    selectRow.appendChild(wbSelect);
    const syncBtn = document.createElement("button");
    syncBtn.className = "lr-btn lr-btn-primary";
    syncBtn.innerHTML = `${SPARKLE_ICON_SVG} Sync / Create Book`;
    syncBtn.title = 'Creates or updates the "Lumi:REcursion Cards" World Book with all 11 canonical card families and attaches to active character';
    syncBtn.onclick = () => {
      hostCtx?.sendToBackend({ type: "CREATE_OR_SYNC_WORLD_BOOK" });
    };
    selectRow.appendChild(syncBtn);
    wbBody.appendChild(selectRow);
    wbPanel.appendChild(wbBody);
    container.appendChild(wbPanel);
  } else if (currentSettings.cardSourceMode === "character_ext") {
    const charPanel = document.createElement("div");
    charPanel.className = "lr-panel";
    const charHeader = document.createElement("div");
    charHeader.className = "lr-panel-header";
    charHeader.innerHTML = `<span>\uD83D\uDC64 Option B: Character Card Payload</span>`;
    charPanel.appendChild(charHeader);
    const charBody = document.createElement("div");
    charBody.className = "lr-panel-body";
    const infoBox = document.createElement("div");
    infoBox.className = "lr-info-box";
    infoBox.innerHTML = `
      \uD83D\uDC2D <strong>Character Payload Mode:</strong> Cards are saved directly into <code>character.extensions.lumi_recursion</code>.
      This binds the card set to the specific character card. Assistants in chat can inspect and edit cards via <code>set</code>.
    `;
    charBody.appendChild(infoBox);
    if (activeCharacterStatus) {
      const charBar = document.createElement("div");
      charBar.className = "lr-deck-bar";
      const statusSpan = document.createElement("div");
      statusSpan.style.flex = "1";
      statusSpan.style.fontSize = "12px";
      statusSpan.innerHTML = `Active: <strong>${activeCharacterStatus.name}</strong> · ${activeCharacterStatus.hasPayload ? `<span style="color:#7fcf8a">${activeCharacterStatus.cardCount} cards loaded</span>` : '<span style="color:#ffd479">No payload yet</span>'}`;
      charBar.appendChild(statusSpan);
      const initBtn = document.createElement("button");
      initBtn.className = "lr-btn lr-btn-primary";
      initBtn.innerHTML = `${SPARKLE_ICON_SVG} Initialize / Reset Cards`;
      initBtn.onclick = () => {
        hostCtx?.sendToBackend({ type: "INIT_CHARACTER_PAYLOAD" });
      };
      charBar.appendChild(initBtn);
      charBody.appendChild(charBar);
      if (activeCharacterStatus.cards && activeCharacterStatus.cards.length > 0) {
        const cardsDiv = document.createElement("div");
        cardsDiv.className = "lr-category-cards";
        cardsDiv.style.border = "1px solid #333";
        cardsDiv.style.borderRadius = "5px";
        for (const card of activeCharacterStatus.cards) {
          const row = document.createElement("div");
          row.className = "lr-card-row";
          const info = document.createElement("div");
          info.className = "lr-card-info";
          info.innerHTML = `
            <div class="lr-card-name">${card.name || card.family}</div>
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
              type: "UPDATE_CHARACTER_CARD_STATE",
              cardId: card.id,
              state: next
            });
          };
          row.appendChild(pill);
          cardsDiv.appendChild(row);
        }
        charBody.appendChild(cardsDiv);
      }
    } else {
      const emptyDiv = document.createElement("div");
      emptyDiv.style.color = "#888";
      emptyDiv.style.padding = "8px 0";
      emptyDiv.textContent = "No active character selected in chat. Open a chat with a character to inspect or initialize their payload.";
      charBody.appendChild(emptyDiv);
    }
    charPanel.appendChild(charBody);
    container.appendChild(charPanel);
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
      delBtn.innerHTML = `${TRASH_ICON_SVG}`;
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
  const removeStyle = ctx.dom.addStyle(STYLES);
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
      case "CHARACTER_STATUS_UPDATED": {
        activeCharacterStatus = msg.status;
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
