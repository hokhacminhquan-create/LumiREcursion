// @bun
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
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function createDefaultDeck() {
  const now = new Date().toISOString();
  const categoryOrder = [];
  const categories = {};
  const cardOrderByCategory = {};
  const cards = {};
  for (const entry of CARD_SCOPE_CATALOG) {
    const catId = slugify(entry.family);
    categoryOrder.push(catId);
    categories[catId] = {
      id: catId,
      name: entry.family,
      description: entry.description,
      createdAt: now,
      updatedAt: now
    };
    const cardIdsForCat = [];
    for (const subItem of entry.subItems) {
      const cardId = `${entry.role}:${subItem.key}`;
      cardIdsForCat.push(cardId);
      let selectionState = "active";
      if (cardId === "sceneFrameCard:locationSituation" || cardId === "sceneConstraintsCard:hardLimits") {
        selectionState = "priority";
      }
      cards[cardId] = {
        id: cardId,
        categoryId: catId,
        name: subItem.label,
        description: subItem.description,
        promptText: subItem.description,
        selectionState,
        builtinFamily: entry.family,
        builtinRoleId: entry.role,
        selectedSubItems: [subItem.key],
        priority: entry.priority,
        createdAt: now,
        updatedAt: now
      };
    }
    cardOrderByCategory[catId] = cardIdsForCat;
  }
  return {
    id: DEFAULT_DECK_ID,
    name: "Default Deck",
    description: "Canonical bundled scene reasoning card deck with 11 families.",
    bundled: true,
    readonly: true,
    categoryOrder,
    categories,
    cardOrderByCategory,
    cards,
    createdAt: now,
    updatedAt: now
  };
}

// src/recast/defaults.ts
var PASS_GROUNDING = {
  id: "pass_grounding",
  name: "\u26D3\uFE0F Grounding",
  enabled: false,
  contextLength: 3,
  prompt: `You are a prose editor. Edit <text_to_transform> so it feels rooted in the story's world, consistent with its rules, tone, setting, and the way things work there. Making it feels like it belongs to this specific world. Do not make slop or guesswork.
Essentially make the text make sense, apply crude logic and reactions from the world, scene and characters.
You don't have context about the scene, keep that in mind.

When a character announces an action and then immediately executes it or time passes, add one short beat between the two so the reader doesn't feel like they blinked and missed the transition. It can be a reaction, a half-second, anything that confirms time moved.

Return only the rewritten text. No explanations, no notes, no commentary.`,
  connection: "",
  injectWorldInfo: true,
  includeCharCard: true,
  includeSceneContext: true
};
var PASS_VALIDATOR = {
  id: "pass_validator",
  name: "\u2705 Character Behavior Validator",
  enabled: true,
  contextLength: 7,
  prompt: `You are a character consistency editor. Your only job is to fix dialog and actions that are not in character in <text_to_transform>. Do not improve prose. Do not fix grammar. Do not restructure sentences. Keep in mind you may not have received the whole scene context.
Priority order for character signals: example dialogue > personality traits > general description > scene context.

Fix text if it:
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

Return only the corrected text. No explanations, no commentary.`,
  connection: "",
  injectWorldInfo: false,
  includeCharCard: true,
  includeSceneContext: true
};
var PASS_PROSE = {
  id: "pass_prose",
  name: "\u2712\uFE0F Prose Rhythm",
  enabled: true,
  contextLength: 13,
  prompt: `You are a prose editor. Your only job is to improve how <text_to_transform> reads without changing what it says.
Rules:
- Do not change any dialogue. Not a single word.
- Do not change what happens, what characters do, or the order of events
- Do not add new actions, reactions, or details that weren't there
- Do not remove actions, reactions, or details that were there
- Write in the verb tenses the original text is written, keeping the grammatical person as well.
- Prioritize avoiding repetition of descriptive words by changing the phrase or removing it altogether

What you may change:
- Sentence length variation, break up monotonous rhythm, mix short and long
- Eliminate repeated sentence structures, especially consecutive sentences starting the same way
- Convert telling to showing, remove emotion labels and replace with physical behavior or action
- Cut filler phrases that carry no meaning
- Tighten overly wordy constructions without losing meaning
- Favor flowing sentences connected by conjunctions over short stopped ones
- Remove any unnecessary 'waiting' at the end of the dialog, if that wait is already clear by the text or cannot be implemented naturally with something else, then remove it

Use the scene context only to match the established prose tone and style of the exchange. Do not drift from the register already set.

Return only the rewritten text. No explanations, no notes, no commentary.`,
  connection: "",
  injectWorldInfo: false,
  includeCharCard: false,
  includeSceneContext: true
};
var PASS_REPETITION_HAMMER = {
  id: "pass_repetitionhammer",
  name: "\uD83D\uDD28 Repetition Hammer",
  enabled: false,
  contextLength: 35,
  prompt: `Simply edit <text_to_transform> and remove all repeated words or dialogs from it.

Rules:
- Remove only words that are removable
- Change only if allows the text to still make sense
- Prioritize removing things seen in the more recent interactions

Return only the rewritten text. No explanations, no notes, no commentary. Think only once to avoid overthinking.`,
  connection: "",
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
  presets: [DEFAULT_RECAST_PRESET]
};

// src/storage.ts
var DEFAULT_SETTINGS = {
  enabled: true,
  mode: "auto",
  pipeline: "segmented",
  cardSourceMode: "world_book",
  worldBookId: "",
  promptFootprint: "normal",
  connectionProfileId: "",
  storyForm: {
    tense: "auto",
    pov: "auto"
  },
  maxCards: 6,
  contextWindow: 6,
  cardTimeoutSec: 15,
  attemptsPerStep: 2,
  postProcessEnabled: false,
  postProcessFlow: "unified",
  postProcessApply: "swipe",
  activeDeckId: DEFAULT_DECK_ID,
  manualTurnArmed: false
};

class StorageManager {
  sp;
  constructor(spindleInstance) {
    this.sp = spindleInstance;
  }
  async loadSettings() {
    try {
      if (this.sp?.storage?.getJson) {
        const data = await this.sp.storage.getJson("settings.json");
        if (data && typeof data === "object") {
          return {
            ...DEFAULT_SETTINGS,
            ...data,
            storyForm: {
              ...DEFAULT_SETTINGS.storyForm,
              ...data.storyForm || {}
            }
          };
        }
      }
    } catch (err) {
      console.warn("[Lumi:REcursion] Failed to load settings.json, using defaults:", err);
    }
    return { ...DEFAULT_SETTINGS };
  }
  async saveSettings(settings) {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson("settings.json", settings);
      }
    } catch (err) {
      console.error("[Lumi:REcursion] Failed to save settings.json:", err);
    }
  }
  async loadDecks() {
    const defaultDeck = createDefaultDeck();
    const decks = {
      [DEFAULT_DECK_ID]: defaultDeck
    };
    let activeDeckId = DEFAULT_DECK_ID;
    try {
      if (this.sp?.storage?.getJson) {
        const stored = await this.sp.storage.getJson("decks.json");
        if (stored && typeof stored === "object") {
          if (stored.decks && typeof stored.decks === "object") {
            for (const [id, d] of Object.entries(stored.decks)) {
              if (id === DEFAULT_DECK_ID) {
                const mergedDeck = createDefaultDeck();
                const storedDeck = d;
                if (storedDeck.cards) {
                  for (const [cId, c] of Object.entries(storedDeck.cards)) {
                    if (mergedDeck.cards[cId]) {
                      mergedDeck.cards[cId].selectionState = c.selectionState;
                    }
                  }
                }
                decks[DEFAULT_DECK_ID] = mergedDeck;
              } else {
                decks[id] = d;
              }
            }
          }
          if (typeof stored.activeDeckId === "string" && decks[stored.activeDeckId]) {
            activeDeckId = stored.activeDeckId;
          }
        }
      }
    } catch (err) {
      console.warn("[Lumi:REcursion] Failed to load decks.json, using default deck:", err);
    }
    return { decks, activeDeckId };
  }
  async saveDecks(decks, activeDeckId) {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson("decks.json", { decks, activeDeckId });
      }
    } catch (err) {
      console.error("[Lumi:REcursion] Failed to save decks.json:", err);
    }
  }
  async loadLastBrief() {
    try {
      if (this.sp?.storage?.getJson) {
        const brief = await this.sp.storage.getJson("last_brief.json");
        if (brief && typeof brief === "object" && Array.isArray(brief.cards)) {
          return brief;
        }
      }
    } catch (err) {
      console.warn("[Lumi:REcursion] Failed to load last_brief.json:", err);
    }
    return null;
  }
  async saveLastBrief(brief) {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson("last_brief.json", brief);
      }
    } catch (err) {
      console.error("[Lumi:REcursion] Failed to save last_brief.json:", err);
    }
  }
  async loadRecastSettings() {
    try {
      if (this.sp?.storage?.getJson) {
        const data = await this.sp.storage.getJson("recast_settings.json");
        if (data && typeof data === "object") {
          return {
            ...DEFAULT_RECAST_SETTINGS,
            ...data,
            presets: Array.isArray(data.presets) && data.presets.length > 0 ? data.presets : DEFAULT_RECAST_SETTINGS.presets
          };
        }
      }
    } catch (err) {
      console.warn("[Lumi:REcursion] Failed to load recast_settings.json, using defaults:", err);
    }
    return { ...DEFAULT_RECAST_SETTINGS };
  }
  async saveRecastSettings(settings) {
    try {
      if (this.sp?.storage?.setJson) {
        await this.sp.storage.setJson("recast_settings.json", settings);
      }
    } catch (err) {
      console.error("[Lumi:REcursion] Failed to save recast_settings.json:", err);
    }
  }
}

// src/prompt/composer.ts
var STATIC_GUARDRAILS = Object.freeze([
  "Write only the next assistant message; keep Recursion cards, labels, and guidance invisible.",
  "Honor player intent, visible facts, reveal boundaries, and hard card constraints.",
  "Use raw Recursion card evidence as source of truth when guidance and evidence conflict."
]);
function formatRecentContext(messages, windowSize = 6) {
  const slice = messages.slice(-windowSize);
  return slice.map((msg, index) => {
    const speaker = msg.name ? `${msg.name} (${msg.role})` : msg.role;
    const content = typeof msg.content === "string" ? msg.content.trim() : "";
    return `[message:${index + 1}] ${speaker}: ${content}`;
  }).join(`

`);
}
function buildStoryFormInstruction(storyForm) {
  const parts = [];
  if (storyForm.pov !== "auto") {
    if (storyForm.pov === "first")
      parts.push('first-person POV ("I", "me")');
    else if (storyForm.pov === "second")
      parts.push('second-person POV ("you")');
    else if (storyForm.pov === "third")
      parts.push('third-person POV ("he", "she", "they")');
  }
  if (storyForm.tense !== "auto") {
    if (storyForm.tense === "past")
      parts.push("past tense");
    else if (storyForm.tense === "present")
      parts.push("present tense");
  }
  if (!parts.length)
    return "";
  return `Story Form: Maintain narration strictly in ${parts.join(" and ")}.`;
}
function buildSingleCardPrompt(card, formattedContext, storyForm) {
  const storyInstruction = buildStoryFormInstruction(storyForm);
  return [
    `You are the Scene Reasoner. Create ONE compact "${card.builtinFamily || card.name}" card for the current roleplay scene.`,
    `Card Focus: ${card.name} \u2014 ${card.description}`,
    storyInstruction ? `Guidance: ${storyInstruction}` : "",
    "Task:",
    "Analyze the recent dialogue/events below and output a specific, factual, scene-grounded directive for the assistant writing the next response.",
    'Use direct imperative instructions (e.g. "Track...", "Maintain...", "Do not reveal...", "Acknowledge...", "Note that...").',
    'Keep it concise (1 to 2 sentences). Include at least one relevant "[message:N]" citation in evidenceRefs if applicable.',
    "",
    "Return ONLY a valid JSON object matching this exact schema (no markdown fences, no extra text):",
    JSON.stringify({
      promptText: "Specific instruction or scene state for the assistant...",
      evidenceRefs: ["message:2"]
    }),
    "",
    "Recent Scene Context:",
    formattedContext
  ].filter(Boolean).join(`
`);
}
function buildFusedBundlePrompt(cards, formattedContext, storyForm) {
  const storyInstruction = buildStoryFormInstruction(storyForm);
  const cardList = cards.map((c, i) => `${i + 1}. [${c.builtinFamily || c.name}] ${c.name}: ${c.description}`).join(`
`);
  return [
    "You are the Scene Reasoner. Create a structured scene reasoning card bundle for the current roleplay turn.",
    storyInstruction ? `Guidance: ${storyInstruction}` : "",
    "Requested Cards to evaluate:",
    cardList,
    "",
    "Task:",
    "Analyze the recent dialogue/events below. For EACH requested card, output a specific, factual, scene-grounded directive for the assistant writing the next response.",
    "Keep each promptText concise (1 to 2 sentences) using direct imperative instructions.",
    "",
    "Return ONLY a valid JSON object matching this schema (no markdown fences, no extra text):",
    JSON.stringify({
      cards: [
        {
          cardId: cards[0]?.id || "card-id",
          family: cards[0]?.builtinFamily || "Scene Frame",
          promptText: "Specific instruction or scene state for the assistant...",
          evidenceRefs: ["message:1"]
        }
      ]
    }),
    "",
    "Recent Scene Context:",
    formattedContext
  ].filter(Boolean).join(`
`);
}
function extractJsonFromResponse(raw) {
  if (!raw)
    return null;
  let text = typeof raw === "string" ? raw.trim() : "";
  if (typeof raw === "object" && raw !== null && "content" in raw) {
    text = String(raw.content || "").trim();
  }
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(text);
  } catch {}
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }
  return null;
}
function formatCardEvidenceLine(card) {
  const cleanPrompt = card.promptText.replace(/\n+/g, " ").trim();
  return `- [${card.family}] ${cleanPrompt}`;
}
function assemblePromptPacket(cards, storyForm, footprint = "normal") {
  if (!cards.length)
    return "";
  const lines = [
    "Private Recursion card evidence for the next assistant message.",
    "Use these cards silently as evidence. Preserve their hard constraints, subtext, and open threads while keeping card labels out of final prose.",
    "Card evidence:"
  ];
  for (const card of cards) {
    lines.push(formatCardEvidenceLine(card));
  }
  const storyInstruction = buildStoryFormInstruction(storyForm);
  if (storyInstruction) {
    lines.push(`Story Form: ${storyInstruction}`);
  }
  lines.push("Guardrails:");
  for (const g of STATIC_GUARDRAILS) {
    lines.push(`- ${g}`);
  }
  return lines.join(`
`);
}

// src/cards/worldbook.ts
var DEFAULT_WORLDBOOK_NAME = "Lumi:REcursion Cards";
function slugify2(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
async function listAvailableWorldBooks(spindle2, userId) {
  try {
    if (spindle2?.world_books?.list) {
      const result = await spindle2.world_books.list(userId ? { userId } : undefined);
      const list = Array.isArray(result) ? result : result?.data || [];
      return list.map((wb) => ({
        id: wb.id,
        name: wb.name || "Untitled World Book",
        entryCount: wb.entry_count
      }));
    }
  } catch (err) {
    console.warn("[Lumi:REcursion] Failed to list world books:", err);
  }
  return [];
}
async function createOrSyncRecursionWorldBook(spindle2, activeCharacterId, userId) {
  if (!spindle2?.world_books) {
    throw new Error("Spindle world_books API is not available (check permissions in spindle.json)");
  }
  const existingBooks = await listAvailableWorldBooks(spindle2, userId);
  let book = existingBooks.find((b) => b.name === DEFAULT_WORLDBOOK_NAME || b.name === "Recursion Cards");
  let worldBookId;
  if (!book) {
    const created = await spindle2.world_books.create({
      name: DEFAULT_WORLDBOOK_NAME,
      description: "Scene reasoning card definitions for Lumi:REcursion extension"
    }, userId);
    worldBookId = created.id;
    console.log(`[Lumi:REcursion] Created new World Book: "${DEFAULT_WORLDBOOK_NAME}" (${worldBookId})`);
  } else {
    worldBookId = book.id;
  }
  let existingEntries = [];
  try {
    const entriesRes = await spindle2.world_books.entries.list(worldBookId, userId ? { userId } : undefined);
    existingEntries = Array.isArray(entriesRes) ? entriesRes : entriesRes?.data || [];
  } catch (err) {
    console.warn("[Lumi:REcursion] Could not list entries:", err);
  }
  const existingComments = new Set(existingEntries.map((e) => String(e.comment || "").trim()));
  let createdCount = 0;
  for (const entry of CARD_SCOPE_CATALOG) {
    if (existingComments.has(entry.family)) {
      continue;
    }
    const payload = {
      family: entry.family,
      role: entry.role,
      priority: entry.priority,
      selectionState: entry.family === "Scene Frame" || entry.family === "Scene Constraints" ? "priority" : "active",
      description: entry.description,
      subItems: entry.subItems.map((s) => `${s.key}: ${s.description}`)
    };
    const entryData = {
      comment: entry.family,
      key: [entry.role, slugify2(entry.family), "recursion_card"],
      content: JSON.stringify(payload, null, 2),
      constant: true,
      disabled: false,
      position: 0,
      priority: entry.priority
    };
    try {
      await spindle2.world_books.entries.create(worldBookId, entryData, userId);
      createdCount++;
    } catch (err) {
      console.error(`[Lumi:REcursion] Failed to create entry for ${entry.family}:`, err);
    }
  }
  if (activeCharacterId && spindle2.characters?.get && spindle2.characters?.update) {
    try {
      const char = await spindle2.characters.get(activeCharacterId, userId);
      if (char) {
        const wbIds = Array.isArray(char.world_book_ids) ? [...char.world_book_ids] : [];
        if (!wbIds.includes(worldBookId)) {
          wbIds.push(worldBookId);
          await spindle2.characters.update(activeCharacterId, { world_book_ids: wbIds }, userId);
          console.log(`[Lumi:REcursion] Attached World Book ${worldBookId} to character ${char.name}`);
        }
      }
    } catch (err) {
      console.warn("[Lumi:REcursion] Failed to attach world book to character:", err);
    }
  }
  return { worldBookId, createdCount };
}
async function readCardsFromWorldBook(spindle2, worldBookId, userId) {
  if (!spindle2?.world_books?.entries?.list || !worldBookId) {
    return [];
  }
  try {
    const res = await spindle2.world_books.entries.list(worldBookId, userId ? { userId } : undefined);
    const entries = Array.isArray(res) ? res : res?.data || [];
    const cards = [];
    for (const entry of entries) {
      if (entry.disabled === true) {
        continue;
      }
      const contentStr = String(entry.content || "").trim();
      if (!contentStr)
        continue;
      let parsed = null;
      try {
        parsed = JSON.parse(contentStr);
      } catch {
        parsed = parsePlainTextCardEntry(entry);
      }
      if (parsed && typeof parsed === "object") {
        const familyName = parsed.family || entry.comment || "Scene Card";
        const roleName = parsed.role || slugify2(familyName) + "Card";
        const selectionState = parsed.selectionState === "priority" || parsed.selectionState === "off" ? parsed.selectionState : "active";
        cards.push({
          id: `wb:${entry.id}`,
          categoryId: slugify2(familyName),
          name: familyName,
          description: parsed.description || contentStr.slice(0, 160),
          promptText: parsed.description || contentStr,
          selectionState,
          builtinFamily: familyName,
          builtinRoleId: roleName,
          priority: typeof parsed.priority === "number" ? parsed.priority : entry.priority || 80,
          selectedSubItems: Array.isArray(parsed.subItems) ? parsed.subItems : []
        });
      }
    }
    return cards;
  } catch (err) {
    console.warn(`[Lumi:REcursion] Failed to read cards from World Book ${worldBookId}:`, err);
    return [];
  }
}
function parsePlainTextCardEntry(entry) {
  const comment = String(entry.comment || "").trim();
  const content = String(entry.content || "").trim();
  return {
    family: comment || "Custom Card",
    role: slugify2(comment || "card") + "Card",
    description: content,
    selectionState: "active",
    priority: entry.priority || 80
  };
}
async function listWorldBookCardEntries(spindle2, worldBookId, userId) {
  if (!spindle2?.world_books?.entries?.list || !worldBookId)
    return [];
  try {
    const res = await spindle2.world_books.entries.list(worldBookId, userId ? { userId } : undefined);
    const entries = Array.isArray(res) ? res : res?.data || [];
    return entries.map((entry) => {
      let parsed = null;
      try {
        parsed = JSON.parse(String(entry.content || ""));
      } catch {
        parsed = parsePlainTextCardEntry(entry);
      }
      const familyName = parsed?.family || entry.comment || "Scene Card";
      const roleName = parsed?.role || slugify2(familyName) + "Card";
      const selectionState = parsed?.selectionState === "priority" || parsed?.selectionState === "off" ? parsed.selectionState : "active";
      return {
        id: entry.id,
        family: familyName,
        role: roleName,
        priority: typeof parsed?.priority === "number" ? parsed.priority : entry.priority || 80,
        selectionState,
        description: parsed?.description || String(entry.content || ""),
        subItems: Array.isArray(parsed?.subItems) ? parsed.subItems : [],
        keys: Array.isArray(entry.key) ? entry.key : [String(entry.key || "")],
        disabled: Boolean(entry.disabled)
      };
    });
  } catch (err) {
    console.warn(`[Lumi:REcursion] Failed to list card entries from World Book ${worldBookId}:`, err);
    return [];
  }
}
async function saveWorldBookEntry(spindle2, worldBookId, entryData, userId) {
  if (!spindle2?.world_books?.entries)
    throw new Error("World books entries API unavailable");
  const familyName = entryData.family.trim();
  const roleName = entryData.role?.trim() || slugify2(familyName) + "Card";
  const priority = typeof entryData.priority === "number" ? entryData.priority : 80;
  const selectionState = entryData.selectionState || "active";
  const subItems = Array.isArray(entryData.subItems) ? entryData.subItems : [];
  const payload = {
    family: familyName,
    role: roleName,
    priority,
    selectionState,
    description: entryData.description,
    subItems
  };
  const keys = Array.isArray(entryData.keys) && entryData.keys.length > 0 ? entryData.keys : [roleName, slugify2(familyName), "recursion_card"];
  const entryPayload = {
    comment: familyName,
    key: keys,
    content: JSON.stringify(payload, null, 2),
    constant: true,
    disabled: Boolean(entryData.disabled),
    position: 0,
    priority
  };
  if (entryData.id) {
    await spindle2.world_books.entries.update(entryData.id, entryPayload, userId);
  } else {
    await spindle2.world_books.entries.create(worldBookId, entryPayload, userId);
  }
}
async function deleteWorldBookEntry(spindle2, entryId, userId) {
  if (!spindle2?.world_books?.entries?.delete)
    throw new Error("World books delete API unavailable");
  await spindle2.world_books.entries.delete(entryId, userId);
}
async function importWorldBookCards(spindle2, worldBookId, cards, userId) {
  if (!Array.isArray(cards) || cards.length === 0)
    return 0;
  let count = 0;
  for (const c of cards) {
    const family = c.family || c.name || c.comment || "Custom Scene Card";
    await saveWorldBookEntry(spindle2, worldBookId, {
      family,
      role: c.role || c.id || slugify2(family) + "Card",
      priority: typeof c.priority === "number" ? c.priority : 80,
      selectionState: c.selectionState || "active",
      description: c.description || c.promptText || "",
      subItems: Array.isArray(c.subItems) ? c.subItems : [],
      keys: Array.isArray(c.key || c.keys) ? c.key || c.keys : undefined,
      disabled: Boolean(c.disabled)
    }, userId);
    count++;
  }
  return count;
}

// src/cards/character-payload.ts
var CHARACTER_EXT_KEY = "lumi_recursion";
function slugify3(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function createDefaultCharacterCards() {
  return CARD_SCOPE_CATALOG.map((entry) => ({
    id: entry.role,
    family: entry.family,
    name: entry.family,
    role: entry.role,
    priority: entry.priority,
    selectionState: entry.family === "Scene Frame" || entry.family === "Scene Constraints" ? "priority" : "active",
    description: entry.description,
    promptText: entry.description,
    subItems: entry.subItems.map((s) => `${s.key}: ${s.description}`)
  }));
}
async function getCharacterPayloadStatus(spindle2, characterId, userId) {
  if (!spindle2?.characters?.get || !characterId)
    return null;
  try {
    const char = await spindle2.characters.get(characterId, userId);
    if (!char)
      return null;
    const ext = char.extensions || {};
    const payload = ext[CHARACTER_EXT_KEY] || ext["lumirecursion"] || ext["card_defs"];
    const cards = Array.isArray(payload?.cards) ? payload.cards : Array.isArray(payload) ? payload : [];
    return {
      id: char.id,
      name: char.name,
      hasPayload: cards.length > 0,
      cardCount: cards.length,
      cards
    };
  } catch (err) {
    console.warn("[Lumi:REcursion] Failed to get character payload status:", err);
    return null;
  }
}
async function initCharacterCardPayload(spindle2, characterId, userId) {
  if (!spindle2?.characters?.get || !spindle2?.characters?.update || !characterId) {
    throw new Error("Spindle characters API is not available or no active character.");
  }
  const char = await spindle2.characters.get(characterId, userId);
  if (!char) {
    throw new Error(`Character ${characterId} not found.`);
  }
  const defaultCards = createDefaultCharacterCards();
  const currentExtensions = { ...char.extensions || {} };
  const payload = {
    version: 1,
    enabled: true,
    pipeline: "segmented",
    cards: defaultCards
  };
  currentExtensions[CHARACTER_EXT_KEY] = payload;
  currentExtensions["lumirecursion_card_defs"] = defaultCards;
  await spindle2.characters.update(characterId, {
    extensions: currentExtensions
  }, userId);
  console.log(`[Lumi:REcursion] Initialized character extension payload on "${char.name}" with ${defaultCards.length} cards.`);
  return { success: true, cardCount: defaultCards.length };
}
async function readCardsFromCharacter(spindle2, characterId, userId) {
  if (!spindle2?.characters?.get || !characterId)
    return [];
  try {
    const char = await spindle2.characters.get(characterId, userId);
    if (!char || !char.extensions)
      return [];
    const ext = char.extensions;
    const payload = ext[CHARACTER_EXT_KEY] || ext["lumirecursion"] || ext["card_defs"];
    const rawCards = Array.isArray(payload?.cards) ? payload.cards : Array.isArray(payload) ? payload : [];
    return rawCards.map((c) => {
      const familyName = c.family || c.name || "Character Scene Card";
      const roleName = c.role || slugify3(familyName) + "Card";
      const selectionState = c.selectionState === "priority" || c.selectionState === "off" ? c.selectionState : "active";
      return {
        id: `char:${c.id || roleName}`,
        categoryId: slugify3(familyName),
        name: c.name || familyName,
        description: c.description || "",
        promptText: c.promptText || c.description || "",
        selectionState,
        builtinFamily: familyName,
        builtinRoleId: roleName,
        priority: typeof c.priority === "number" ? c.priority : 80,
        selectedSubItems: Array.isArray(c.subItems) ? c.subItems : []
      };
    });
  } catch (err) {
    console.warn(`[Lumi:REcursion] Failed to read cards from character ${characterId}:`, err);
    return [];
  }
}
async function updateCharacterCardState(spindle2, characterId, cardId, state, userId) {
  if (!spindle2?.characters?.get || !spindle2?.characters?.update || !characterId)
    return false;
  try {
    const char = await spindle2.characters.get(characterId, userId);
    if (!char || !char.extensions)
      return false;
    const currentExt = { ...char.extensions };
    const payload = currentExt[CHARACTER_EXT_KEY];
    if (!payload || !Array.isArray(payload.cards))
      return false;
    const normalizedId = cardId.replace(/^char:/, "");
    const found = payload.cards.find((c) => c.id === normalizedId || c.role === normalizedId);
    if (found) {
      found.selectionState = state;
      await spindle2.characters.update(characterId, { extensions: currentExt }, userId);
      return true;
    }
    return false;
  } catch (err) {
    console.warn("[Lumi:REcursion] Failed to update character card state:", err);
    return false;
  }
}
async function saveCharacterCard(spindle2, characterId, card, userId) {
  if (!spindle2?.characters?.get || !spindle2?.characters?.update || !characterId)
    return false;
  try {
    const char = await spindle2.characters.get(characterId, userId);
    if (!char)
      return false;
    const currentExt = { ...char.extensions || {} };
    let payload = currentExt[CHARACTER_EXT_KEY];
    if (!payload || !Array.isArray(payload.cards)) {
      payload = {
        version: 1,
        enabled: true,
        pipeline: "segmented",
        cards: []
      };
    }
    const cardId = card.id || card.role || slugify3(card.name || "card") + "Card";
    const cleanCard = {
      id: cardId,
      family: card.family || card.name || "Custom Scene Card",
      name: card.name || card.family || "Custom Scene Card",
      role: card.role || cardId,
      priority: typeof card.priority === "number" ? card.priority : 80,
      selectionState: card.selectionState || "active",
      description: card.description || "",
      promptText: card.promptText || card.description || "",
      subItems: Array.isArray(card.subItems) ? card.subItems : []
    };
    const idx = payload.cards.findIndex((c) => c.id === cardId || c.role === cardId);
    if (idx !== -1) {
      payload.cards[idx] = cleanCard;
    } else {
      payload.cards.push(cleanCard);
    }
    currentExt[CHARACTER_EXT_KEY] = payload;
    currentExt["lumirecursion_card_defs"] = payload.cards;
    await spindle2.characters.update(characterId, { extensions: currentExt }, userId);
    return true;
  } catch (err) {
    console.error("[Lumi:REcursion] Failed to save character card:", err);
    return false;
  }
}
async function deleteCharacterCard(spindle2, characterId, cardId, userId) {
  if (!spindle2?.characters?.get || !spindle2?.characters?.update || !characterId)
    return false;
  try {
    const char = await spindle2.characters.get(characterId, userId);
    if (!char || !char.extensions)
      return false;
    const currentExt = { ...char.extensions };
    const payload = currentExt[CHARACTER_EXT_KEY];
    if (!payload || !Array.isArray(payload.cards))
      return false;
    const normalizedId = cardId.replace(/^char:/, "");
    payload.cards = payload.cards.filter((c) => c.id !== normalizedId && c.role !== normalizedId);
    currentExt[CHARACTER_EXT_KEY] = payload;
    currentExt["lumirecursion_card_defs"] = payload.cards;
    await spindle2.characters.update(characterId, { extensions: currentExt }, userId);
    return true;
  } catch (err) {
    console.error("[Lumi:REcursion] Failed to delete character card:", err);
    return false;
  }
}
async function importCharacterPayload(spindle2, characterId, importedData, userId) {
  if (!spindle2?.characters?.get || !spindle2?.characters?.update || !characterId) {
    throw new Error("Characters API unavailable");
  }
  const char = await spindle2.characters.get(characterId, userId);
  if (!char)
    throw new Error(`Character ${characterId} not found`);
  let rawCards = [];
  if (Array.isArray(importedData)) {
    rawCards = importedData;
  } else if (importedData && Array.isArray(importedData.cards)) {
    rawCards = importedData.cards;
  } else if (importedData && typeof importedData === "object") {
    rawCards = importedData.card_defs || importedData.lumi_recursion?.cards || [];
  }
  if (rawCards.length === 0) {
    throw new Error("No valid cards found in imported JSON data.");
  }
  const cleanCards = rawCards.map((c, i) => {
    const family = c.family || c.name || `Card ${i + 1}`;
    const role = c.role || c.id || slugify3(family) + "Card";
    return {
      id: role,
      family,
      name: c.name || family,
      role,
      priority: typeof c.priority === "number" ? c.priority : 80,
      selectionState: c.selectionState || "active",
      description: c.description || c.promptText || "",
      promptText: c.promptText || c.description || "",
      subItems: Array.isArray(c.subItems) ? c.subItems : []
    };
  });
  const currentExt = { ...char.extensions || {} };
  const payload = {
    version: 1,
    enabled: true,
    pipeline: "segmented",
    cards: cleanCards
  };
  currentExt[CHARACTER_EXT_KEY] = payload;
  currentExt["lumirecursion_card_defs"] = cleanCards;
  await spindle2.characters.update(characterId, { extensions: currentExt }, userId);
  return { success: true, cardCount: cleanCards.length };
}

// src/recast/pipeline.ts
function cleanModelOutput(text) {
  if (!text)
    return "";
  let cleaned = text.trim();
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
  const matchWrapped = cleaned.match(/<text_to_transform>([\s\S]*?)<\/text_to_transform>/i);
  if (matchWrapped && matchWrapped[1]) {
    cleaned = matchWrapped[1].trim();
  } else {
    cleaned = cleaned.replace(/<\/?text_to_transform>/gi, "").trim();
  }
  return cleaned;
}
async function runSinglePass(sp, pass, textToTransform, chatId, targetMessageId, userId) {
  if (!pass.enabled)
    return textToTransform;
  let systemPrompt = pass.prompt.trim();
  let charCardXml = "";
  if (pass.includeCharCard && sp?.characters?.get) {
    try {
      let charId = null;
      if (chatId && sp?.chats?.get) {
        const chat = await sp.chats.get(chatId, userId);
        charId = chat?.characterId || chat?.character_id || null;
      }
      if (!charId && sp?.chats?.getActive) {
        const activeChat = await sp.chats.getActive(userId);
        charId = activeChat?.characterId || activeChat?.character_id || null;
      }
      if (charId) {
        const char = await sp.characters.get(charId, userId);
        if (char) {
          const lines = [
            char.name ? `<name>${char.name}</name>` : "",
            char.description ? `<description>${char.description}</description>` : "",
            char.personality ? `<personality>${char.personality}</personality>` : "",
            char.scenario ? `<scenario>${char.scenario}</scenario>` : "",
            char.mes_example ? `<example_dialogue>
${char.mes_example}
</example_dialogue>` : ""
          ].filter(Boolean);
          if (lines.length > 0) {
            charCardXml = `<characters>
${lines.join(`
`)}
</characters>`;
          }
        }
      }
    } catch (err) {
      console.warn("[Lumi:REcursion:Recast] Failed to retrieve character info for pass:", err);
    }
  }
  let sceneContextXml = "";
  if (pass.includeSceneContext && pass.contextLength > 0 && sp?.chat?.getMessages && chatId) {
    try {
      const allMessages = await sp.chat.getMessages(chatId);
      if (Array.isArray(allMessages) && allMessages.length > 0) {
        let cutoffIndex = allMessages.length;
        if (targetMessageId) {
          const foundIdx = allMessages.findIndex((m) => m.id === targetMessageId);
          if (foundIdx !== -1) {
            cutoffIndex = foundIdx;
          }
        }
        const historySlice = allMessages.slice(0, cutoffIndex).slice(-pass.contextLength);
        if (historySlice.length > 0) {
          const lines = historySlice.map((m) => {
            const roleName = m.name || (m.role === "user" || m.is_user ? "User" : "Assistant");
            const content = m.content || "";
            return `${roleName}: ${content}`;
          });
          sceneContextXml = `<scene_context>
${lines.join(`
`)}
</scene_context>`;
        }
      }
    } catch (err) {
      console.warn("[Lumi:REcursion:Recast] Failed to retrieve chat history for pass:", err);
    }
  }
  if (pass.injectWorldInfo && sp?.world_books) {
    try {
      let wbText = "";
      if (sp.world_books.list) {
        const books = await sp.world_books.list(userId ? { userId } : undefined);
        const bookList = Array.isArray(books) ? books : books?.data || [];
        if (bookList.length > 0) {
          const firstBook = await sp.world_books.get(bookList[0].id, userId);
          if (firstBook && Array.isArray(firstBook.entries)) {
            const snippet = firstBook.entries.filter((e) => e.enabled !== false).slice(0, 5).map((e) => `[${e.keys?.join(", ") || "Entry"}]: ${e.content}`).join(`
`);
            if (snippet)
              wbText = snippet;
          }
        }
      }
      if (wbText) {
        systemPrompt += `

<world_info>
${wbText}
</world_info>`;
      }
    } catch (err) {
      console.warn("[Lumi:REcursion:Recast] World info injection skipped:", err);
    }
  }
  const userSections = [];
  if (charCardXml)
    userSections.push(charCardXml);
  if (sceneContextXml)
    userSections.push(sceneContextXml);
  userSections.push(`<text_to_transform>
${textToTransform}
</text_to_transform>`);
  const userPrompt = userSections.join(`

`);
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
  if (pass.prefill && pass.prefill.trim()) {
    messages.push({
      role: pass.prefillRole || "assistant",
      content: pass.prefill.trim()
    });
  }
  const genPayload = {
    type: "raw",
    messages,
    parameters: {
      temperature: 0.3
    },
    ...userId ? { userId } : {}
  };
  if (pass.connection) {
    genPayload.connection_id = pass.connection;
  }
  const rawRes = await sp.generate.raw(genPayload);
  let outputText = "";
  if (typeof rawRes === "string") {
    outputText = rawRes;
  } else if (rawRes && typeof rawRes === "object") {
    outputText = rawRes.content || rawRes.text || rawRes.message?.content || "";
  }
  const cleaned = cleanModelOutput(outputText);
  return cleaned && cleaned.length > 0 ? cleaned : textToTransform;
}
async function runRecastPipeline(sp, options) {
  const { chatId, messageId, rawText, settings, userId, onProgress } = options;
  if (!rawText || rawText.trim().length === 0)
    return null;
  const activePreset = settings.presets.find((p) => p.id === settings.activePresetId) || settings.presets[0];
  if (!activePreset)
    return null;
  const enabledPasses = activePreset.passes.filter((p) => p.enabled);
  if (enabledPasses.length === 0)
    return null;
  const tStart = Date.now();
  let currentText = rawText;
  const snapshots = [rawText];
  const passNames = [];
  for (let i = 0;i < enabledPasses.length; i++) {
    const pass = enabledPasses[i];
    passNames.push(pass.name);
    onProgress?.({
      active: true,
      currentPassIndex: i + 1,
      totalPasses: enabledPasses.length,
      currentPassName: pass.name,
      statusText: `Running pass ${i + 1}/${enabledPasses.length}: ${pass.name}...`
    });
    try {
      const passOutput = await runSinglePass(sp, pass, currentText, chatId, messageId, userId);
      currentText = passOutput;
      snapshots.push(currentText);
    } catch (err) {
      console.error(`[Lumi:REcursion:Recast] Error executing pass "${pass.name}":`, err);
      snapshots.push(currentText);
    }
  }
  const totalLatencyMs = Date.now() - tStart;
  onProgress?.({
    active: false,
    currentPassIndex: enabledPasses.length,
    totalPasses: enabledPasses.length,
    currentPassName: "",
    statusText: `Complete in ${totalLatencyMs}ms`
  });
  return {
    chatId,
    messageId,
    originalText: rawText,
    transformedText: currentText,
    snapshots,
    passNames,
    totalLatencyMs
  };
}

// src/backend.ts
var sp = typeof spindle !== "undefined" ? spindle : null;
var settings = { ...DEFAULT_SETTINGS };
var decks = {};
var activeDeckId = DEFAULT_DECK_ID;
var lastBrief = null;
var currentProgress = {
  runId: "",
  active: false,
  pipeline: "segmented",
  phase: "idle",
  pixels: []
};
var recastSettings = { ...DEFAULT_RECAST_SETTINGS };
var recastProgress = null;
var isRecastRunning = false;
var cachedTurn = null;
var storage;
var activeUserId = null;
var chatUserMap = new Map;
function rememberUser(userId, chatId) {
  if (userId && typeof userId === "string" && userId.trim()) {
    activeUserId = userId.trim();
    if (chatId)
      chatUserMap.set(chatId, activeUserId);
  } else if (chatId && chatUserMap.has(chatId)) {
    activeUserId = chatUserMap.get(chatId);
  }
}
function getEffectiveUserId(chatId) {
  if (chatId && chatUserMap.has(chatId)) {
    return chatUserMap.get(chatId);
  }
  return activeUserId || undefined;
}
function simpleHash(str) {
  let hash = 0;
  for (let i = 0;i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
function broadcastProgress(progress) {
  currentProgress = progress;
  if (sp?.sendToFrontend) {
    sp.sendToFrontend({ type: "PROGRESS", progress });
  }
}
async function listConnections(userId) {
  try {
    if (sp?.connections?.list) {
      const uId = userId || getEffectiveUserId();
      const list = await sp.connections.list(uId);
      if (Array.isArray(list)) {
        return list.map((c) => ({
          id: c.id,
          name: c.name || c.id,
          provider: c.provider,
          model: c.model,
          is_default: Boolean(c.is_default)
        }));
      }
    }
  } catch (err) {
    console.warn("[Lumi:REcursion] Failed to list connection profiles:", err);
  }
  return [];
}
async function resolveConnectionId(profileId, userId) {
  if (profileId)
    return profileId;
  const conns = await listConnections(userId);
  const def = conns.find((c) => c.is_default) || conns[0];
  return def ? def.id : undefined;
}
async function getActiveCharacterId(userId) {
  try {
    if (sp?.chats?.getActive) {
      const uId = userId || getEffectiveUserId();
      const chat = await sp.chats.getActive(uId);
      return chat?.characterId || chat?.character_id || null;
    }
  } catch {}
  return null;
}
async function resolveTurnCards(context) {
  const uId = context?.userId || getEffectiveUserId(context?.chatId);
  rememberUser(context?.userId, context?.chatId);
  let candidateCards = [];
  if (settings.cardSourceMode === "world_book") {
    let wbId = settings.worldBookId;
    if (!wbId && context?.characterId && sp?.characters?.get) {
      try {
        const char = await sp.characters.get(context.characterId, uId);
        if (char && Array.isArray(char.world_book_ids)) {
          const wbs = await listAvailableWorldBooks(sp, uId);
          const matched = wbs.find((w) => char.world_book_ids.includes(w.id) && (w.name.includes("Recursion") || w.name.includes("Lumi:REcursion")));
          if (matched)
            wbId = matched.id;
        }
      } catch {}
    }
    if (!wbId) {
      const wbs = await listAvailableWorldBooks(sp, uId);
      const matched = wbs.find((w) => w.name === DEFAULT_WORLDBOOK_NAME || w.name.includes("Recursion Cards"));
      if (matched)
        wbId = matched.id;
    }
    if (wbId) {
      candidateCards = await readCardsFromWorldBook(sp, wbId, uId);
      console.log(`[Lumi:REcursion] Loaded ${candidateCards.length} cards from World Book (${wbId})`);
    }
  } else if (settings.cardSourceMode === "character_ext") {
    let charId = context?.characterId;
    if (!charId) {
      charId = await getActiveCharacterId(uId);
    }
    if (charId) {
      candidateCards = await readCardsFromCharacter(sp, charId, uId);
      console.log(`[Lumi:REcursion] Loaded ${candidateCards.length} cards from Character Payload (${charId})`);
    }
  }
  if (!candidateCards.length) {
    const currentDeck = decks[activeDeckId] || decks[DEFAULT_DECK_ID];
    if (currentDeck && currentDeck.cards) {
      candidateCards = Object.values(currentDeck.cards);
    }
  }
  const eligible = candidateCards.filter((c) => c.selectionState !== "off");
  const priorityCards = eligible.filter((c) => c.selectionState === "priority");
  const normalCards = eligible.filter((c) => c.selectionState === "active");
  const selectedCards = [...priorityCards, ...normalCards].slice(0, settings.maxCards);
  const omittedCards = [...priorityCards, ...normalCards].slice(settings.maxCards).map((c) => ({
    cardId: c.id,
    family: c.builtinFamily || c.name,
    reason: "max-cards"
  }));
  return { selectedCards, omittedCards };
}
(async () => {
  if (!sp) {
    console.error("[Lumi:REcursion] Spindle API not available");
    return;
  }
  storage = new StorageManager(sp);
  settings = await storage.loadSettings();
  const deckData = await storage.loadDecks();
  decks = deckData.decks;
  activeDeckId = deckData.activeDeckId;
  lastBrief = await storage.loadLastBrief();
  recastSettings = await storage.loadRecastSettings();
  console.log("[Lumi:REcursion] Initialized with source mode:", settings.cardSourceMode, "Active deck:", activeDeckId, "Enabled:", settings.enabled, "Recast Enabled:", recastSettings.enabled);
  if (typeof sp.on === "function") {
    sp.on("GENERATION_ENDED", async (payload) => {
      if (!recastSettings.enabled || !recastSettings.autoRun)
        return;
      if (!payload || payload.error)
        return;
      if (!payload.content || payload.content.trim().length < (recastSettings.minChars || 20))
        return;
      if (!payload.chatId || !payload.messageId)
        return;
      if (isRecastRunning)
        return;
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
            sp.sendToFrontend?.({ type: "RECAST_PROGRESS", progress: prog });
          }
        });
        if (diff && diff.transformedText && diff.transformedText !== diff.originalText) {
          if (recastSettings.applyMode === "replace") {
            await sp.chat.updateMessage(diff.chatId, diff.messageId, { content: diff.transformedText });
            sp.toast?.success?.("\u2728 Recast post-processing applied in-place");
            sp.sendToFrontend?.({
              type: "RECAST_APPLIED",
              chatId: diff.chatId,
              messageId: diff.messageId,
              mode: "replace"
            });
          } else if (recastSettings.applyMode === "swipe") {
            const allMsgs = await sp.chat.getMessages(diff.chatId);
            const msg = allMsgs.find((m) => m.id === diff.messageId);
            const existingSwipes = Array.isArray(msg?.swipes) && msg.swipes.length > 0 ? msg.swipes : [diff.originalText];
            const newSwipes = [...existingSwipes, diff.transformedText];
            const newSwipeId = newSwipes.length - 1;
            await sp.chat.updateMessage(diff.chatId, diff.messageId, {
              swipes: newSwipes,
              swipe_id: newSwipeId
            });
            sp.toast?.success?.("\u2728 Recast post-processing added as new swipe");
            sp.sendToFrontend?.({
              type: "RECAST_APPLIED",
              chatId: diff.chatId,
              messageId: diff.messageId,
              mode: "swipe"
            });
          } else {
            sp.sendToFrontend?.({ type: "RECAST_DIFF_READY", diff });
          }
        }
      } catch (err) {
        console.error("[Lumi:REcursion:Recast] Error during auto-recast:", err);
      } finally {
        isRecastRunning = false;
        recastProgress = null;
        sp.sendToFrontend?.({
          type: "RECAST_PROGRESS",
          progress: {
            active: false,
            currentPassIndex: 0,
            totalPasses: 0,
            currentPassName: "",
            statusText: ""
          }
        });
      }
    });
  }
  sp.registerInterceptor(async (messages, context) => {
    if (!settings.enabled) {
      return messages;
    }
    if (settings.mode === "manual" && !settings.manualTurnArmed) {
      return messages;
    }
    settings.manualTurnArmed = false;
    const { selectedCards, omittedCards } = await resolveTurnCards(context);
    if (!selectedCards.length) {
      return messages;
    }
    const formattedContext = formatRecentContext(messages, settings.contextWindow);
    const turnHash = simpleHash(formattedContext + selectedCards.map((c) => c.id).join(","));
    if (cachedTurn && cachedTurn.hash === turnHash && Date.now() - cachedTurn.timestamp < 120000) {
      console.log("[Lumi:REcursion] Reusing cached turn reasoning for identical context");
      const pixels = cachedTurn.cards.map((c) => ({
        id: c.cardId,
        name: c.name,
        state: "cached",
        latencyMs: c.latencyMs
      }));
      broadcastProgress({
        runId: `run-${Date.now()}`,
        active: false,
        pipeline: settings.pipeline,
        phase: "done",
        pixels,
        currentStepText: `Reused ${cachedTurn.cards.length} cached scene cards.`
      });
      const injectedMessage2 = {
        role: "system",
        content: cachedTurn.injectedPacket
      };
      const updated = [...messages, injectedMessage2];
      return {
        messages: updated,
        breakdown: [
          { messageIndex: updated.length - 1, name: "Lumi:REcursion Guidance (Cached)" }
        ]
      };
    }
    const runId = `run-${Date.now()}`;
    const turnUserId = context?.userId || getEffectiveUserId(context?.chatId);
    const connId = await resolveConnectionId(settings.connectionProfileId, turnUserId);
    const initialPixels = selectedCards.map((c) => ({
      id: c.id,
      name: c.name,
      state: "running"
    }));
    broadcastProgress({
      runId,
      active: true,
      pipeline: settings.pipeline,
      phase: "running",
      pixels: initialPixels,
      currentStepText: `Evaluating ${selectedCards.length} scene cards in parallel (${settings.cardSourceMode})...`
    });
    const tStart = Date.now();
    let evaluatedCards = [];
    if (settings.pipeline === "segmented") {
      const promises = selectedCards.map(async (card, idx) => {
        const t0 = Date.now();
        try {
          const prompt = buildSingleCardPrompt(card, formattedContext, settings.storyForm);
          const controller = new AbortController;
          const timeoutId = setTimeout(() => controller.abort(), settings.cardTimeoutSec * 1000);
          const combinedSignal = context?.signal ? AbortSignal.any([context.signal, controller.signal]) : controller.signal;
          const res = await sp.generate.raw({
            type: "raw",
            messages: [{ role: "user", content: prompt }],
            connection_id: connId,
            parameters: { temperature: 0.25, max_tokens: 280 },
            ...turnUserId ? { userId: turnUserId } : {},
            signal: combinedSignal
          });
          clearTimeout(timeoutId);
          const parsed = extractJsonFromResponse(res?.content);
          const promptText = typeof parsed?.promptText === "string" && parsed.promptText.trim() ? parsed.promptText.trim() : `Maintain active scene awareness for ${card.name}.`;
          const evidenceRefs = Array.isArray(parsed?.evidenceRefs) ? parsed.evidenceRefs.map(String) : [];
          const cardResult = {
            cardId: card.id,
            family: card.builtinFamily || card.name,
            name: card.name,
            promptText,
            evidenceRefs,
            latencyMs: Date.now() - t0,
            status: "success"
          };
          initialPixels[idx].state = "success";
          initialPixels[idx].latencyMs = cardResult.latencyMs;
          broadcastProgress({
            runId,
            active: true,
            pipeline: "segmented",
            phase: "running",
            pixels: [...initialPixels],
            currentStepText: `Evaluated ${card.name} in ${cardResult.latencyMs}ms`
          });
          return cardResult;
        } catch (err) {
          const cardResult = {
            cardId: card.id,
            family: card.builtinFamily || card.name,
            name: card.name,
            promptText: `Preserve established context and limits for ${card.name}.`,
            evidenceRefs: [],
            latencyMs: Date.now() - t0,
            status: "fallback",
            error: err?.message || String(err)
          };
          initialPixels[idx].state = "warning";
          initialPixels[idx].latencyMs = cardResult.latencyMs;
          broadcastProgress({
            runId,
            active: true,
            pipeline: "segmented",
            phase: "running",
            pixels: [...initialPixels],
            currentStepText: `Fallback for ${card.name}`
          });
          return cardResult;
        }
      });
      evaluatedCards = await Promise.all(promises);
    } else {
      try {
        const prompt = buildFusedBundlePrompt(selectedCards, formattedContext, settings.storyForm);
        const controller = new AbortController;
        const timeoutId = setTimeout(() => controller.abort(), settings.cardTimeoutSec * 1500);
        const combinedSignal = context?.signal ? AbortSignal.any([context.signal, controller.signal]) : controller.signal;
        const res = await sp.generate.raw({
          type: "raw",
          messages: [{ role: "user", content: prompt }],
          connection_id: connId,
          parameters: { temperature: 0.25, max_tokens: 1200 },
          ...turnUserId ? { userId: turnUserId } : {},
          signal: combinedSignal
        });
        clearTimeout(timeoutId);
        const parsed = extractJsonFromResponse(res?.content);
        const bundleCards = Array.isArray(parsed?.cards) ? parsed.cards : [];
        evaluatedCards = selectedCards.map((card, idx) => {
          const found = bundleCards.find((bc) => bc.cardId === card.id || bc.family && bc.family.toLowerCase() === (card.builtinFamily || "").toLowerCase());
          const promptText = typeof found?.promptText === "string" && found.promptText.trim() ? found.promptText.trim() : `Maintain scene consistency for ${card.name}.`;
          const evidenceRefs = Array.isArray(found?.evidenceRefs) ? found.evidenceRefs.map(String) : [];
          initialPixels[idx].state = found ? "success" : "warning";
          return {
            cardId: card.id,
            family: card.builtinFamily || card.name,
            name: card.name,
            promptText,
            evidenceRefs,
            latencyMs: Date.now() - tStart,
            status: found ? "success" : "fallback"
          };
        });
      } catch (err) {
        evaluatedCards = selectedCards.map((card, idx) => {
          initialPixels[idx].state = "warning";
          return {
            cardId: card.id,
            family: card.builtinFamily || card.name,
            name: card.name,
            promptText: `Preserve scene continuity for ${card.name}.`,
            evidenceRefs: [],
            latencyMs: Date.now() - tStart,
            status: "fallback",
            error: err?.message || String(err)
          };
        });
      }
    }
    const totalLatency = Date.now() - tStart;
    const injectedPacket = assemblePromptPacket(evaluatedCards, settings.storyForm, settings.promptFootprint);
    const brief = {
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
    cachedTurn = {
      hash: turnHash,
      cards: evaluatedCards,
      injectedPacket,
      brief,
      timestamp: Date.now()
    };
    broadcastProgress({
      runId,
      active: false,
      pipeline: settings.pipeline,
      phase: "done",
      pixels: initialPixels,
      currentStepText: `Ready. ${evaluatedCards.length} cards prepared in ${totalLatency}ms (${settings.cardSourceMode}).`
    });
    if (sp.sendToFrontend) {
      sp.sendToFrontend({ type: "BRIEF_UPDATED", brief });
    }
    const injectedMessage = {
      role: "system",
      content: injectedPacket
    };
    const updatedMessages = [...messages, injectedMessage];
    return {
      messages: updatedMessages,
      breakdown: [
        { messageIndex: updatedMessages.length - 1, name: "Lumi:REcursion Guidance" }
      ]
    };
  });
  sp.onFrontendMessage(async (msg, userId) => {
    rememberUser(userId, msg.chatId);
    const effectiveUserId = userId || getEffectiveUserId(msg.chatId);
    switch (msg.type) {
      case "GET_STATE": {
        const conns = await listConnections(effectiveUserId);
        const wbs = await listAvailableWorldBooks(sp, effectiveUserId);
        const activeCharId = await getActiveCharacterId(effectiveUserId);
        const charStatus = activeCharId ? await getCharacterPayloadStatus(sp, activeCharId, effectiveUserId) : null;
        let wbCards = [];
        const effectiveWbId = settings.worldBookId || wbs.find((w) => w.name === DEFAULT_WORLDBOOK_NAME || w.name === "Recursion Cards")?.id;
        if (effectiveWbId) {
          wbCards = await listWorldBookCardEntries(sp, effectiveWbId, effectiveUserId);
        }
        sp.sendToFrontend({
          type: "STATE",
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
      case "UPDATE_SETTINGS": {
        settings = { ...settings, ...msg.settings };
        await storage.saveSettings(settings);
        sp.sendToFrontend({ type: "SETTINGS_UPDATED", settings });
        break;
      }
      case "CREATE_OR_SYNC_WORLD_BOOK": {
        try {
          const activeCharId = await getActiveCharacterId(effectiveUserId);
          const result = await createOrSyncRecursionWorldBook(sp, activeCharId, effectiveUserId);
          settings.worldBookId = result.worldBookId;
          settings.cardSourceMode = "world_book";
          await storage.saveSettings(settings);
          const wbs = await listAvailableWorldBooks(sp, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, result.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: "WORLD_BOOKS_UPDATED", worldBooks: wbs, selectedId: result.worldBookId });
          sp.sendToFrontend({ type: "WORLDBOOK_CARDS_UPDATED", worldBookId: result.worldBookId, cards });
          sp.sendToFrontend({ type: "SETTINGS_UPDATED", settings });
          sp.toast?.success?.(`\uD83D\uDCD6 World Book "${DEFAULT_WORLDBOOK_NAME}" synced with ${result.createdCount} card entries!`);
        } catch (err) {
          sp.toast?.error?.(`Failed to sync world book: ${err?.message || err}`);
        }
        break;
      }
      case "INIT_CHARACTER_PAYLOAD": {
        try {
          const activeCharId = await getActiveCharacterId(effectiveUserId);
          if (!activeCharId) {
            sp.toast?.warn?.("No active character selected in chat.");
            break;
          }
          const res = await initCharacterCardPayload(sp, activeCharId, effectiveUserId);
          settings.cardSourceMode = "character_ext";
          await storage.saveSettings(settings);
          const charStatus = await getCharacterPayloadStatus(sp, activeCharId, effectiveUserId);
          sp.sendToFrontend({ type: "CHARACTER_STATUS_UPDATED", status: charStatus });
          sp.sendToFrontend({ type: "SETTINGS_UPDATED", settings });
          sp.toast?.success?.(`\uD83D\uDC64 Initialized ${res.cardCount} cards in character extension payload!`);
        } catch (err) {
          sp.toast?.error?.(`Failed to init character payload: ${err?.message || err}`);
        }
        break;
      }
      case "UPDATE_CHARACTER_CARD_STATE": {
        try {
          const activeCharId = await getActiveCharacterId(effectiveUserId);
          if (activeCharId) {
            await updateCharacterCardState(sp, activeCharId, msg.cardId, msg.state, effectiveUserId);
            const charStatus = await getCharacterPayloadStatus(sp, activeCharId, effectiveUserId);
            sp.sendToFrontend({ type: "CHARACTER_STATUS_UPDATED", status: charStatus });
          }
        } catch (err) {
          console.warn("[Lumi:REcursion] Failed to update character card state:", err);
        }
        break;
      }
      case "SET_CARD_STATE": {
        const targetDeck = decks[msg.deckId];
        if (targetDeck && targetDeck.cards[msg.cardId]) {
          targetDeck.cards[msg.cardId].selectionState = msg.state;
          targetDeck.updatedAt = new Date().toISOString();
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: "DECKS_UPDATED", decks, activeDeckId });
        }
        break;
      }
      case "BULK_SET_CARDS": {
        const targetDeck = decks[msg.deckId];
        if (targetDeck) {
          const cardIds = msg.categoryId && targetDeck.cardOrderByCategory[msg.categoryId] ? targetDeck.cardOrderByCategory[msg.categoryId] : Object.keys(targetDeck.cards);
          for (const cId of cardIds) {
            if (targetDeck.cards[cId]) {
              targetDeck.cards[cId].selectionState = msg.state;
            }
          }
          targetDeck.updatedAt = new Date().toISOString();
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: "DECKS_UPDATED", decks, activeDeckId });
        }
        break;
      }
      case "SWITCH_DECK": {
        if (decks[msg.deckId]) {
          activeDeckId = msg.deckId;
          settings.activeDeckId = msg.deckId;
          await storage.saveSettings(settings);
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: "DECKS_UPDATED", decks, activeDeckId });
          sp.toast?.info?.(`\uD83C\uDCCF Active Deck: "${decks[msg.deckId].name}"`);
        }
        break;
      }
      case "DUPLICATE_DECK": {
        const source = decks[msg.sourceDeckId];
        if (source) {
          const newId = `custom-${Date.now()}`;
          const newDeck = JSON.parse(JSON.stringify(source));
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
          sp.sendToFrontend({ type: "DECKS_UPDATED", decks, activeDeckId });
          sp.toast?.success?.(`\u2728 Created deck: "${newDeck.name}"`);
        }
        break;
      }
      case "DELETE_DECK": {
        if (decks[msg.deckId] && !decks[msg.deckId].bundled) {
          delete decks[msg.deckId];
          if (activeDeckId === msg.deckId) {
            activeDeckId = DEFAULT_DECK_ID;
            settings.activeDeckId = DEFAULT_DECK_ID;
            await storage.saveSettings(settings);
          }
          await storage.saveDecks(decks, activeDeckId);
          sp.sendToFrontend({ type: "DECKS_UPDATED", decks, activeDeckId });
          sp.toast?.info?.("\uD83D\uDDD1\uFE0F Custom deck deleted");
        }
        break;
      }
      case "CLEAR_CACHE": {
        cachedTurn = null;
        sp.toast?.info?.("\uD83E\uDDF9 Turn reasoning cache cleared");
        break;
      }
      case "MANUAL_RUN_NOW": {
        settings.manualTurnArmed = true;
        sp.toast?.info?.("\uD83C\uDFAF Armed next turn for scene reasoning");
        break;
      }
      case "GET_CONNECTIONS": {
        const conns = await listConnections(effectiveUserId);
        sp.sendToFrontend({ type: "CONNECTIONS", connections: conns });
        break;
      }
      case "RECAST_UPDATE_SETTINGS": {
        recastSettings = { ...recastSettings, ...msg.settings };
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: "RECAST_STATE_UPDATED", settings: recastSettings, progress: recastProgress });
        break;
      }
      case "RECAST_UPDATE_PRESET": {
        const pIdx = recastSettings.presets.findIndex((p) => p.id === msg.preset.id);
        if (pIdx !== -1) {
          recastSettings.presets[pIdx] = msg.preset;
        } else {
          recastSettings.presets.push(msg.preset);
        }
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: "RECAST_STATE_UPDATED", settings: recastSettings, progress: recastProgress });
        break;
      }
      case "RECAST_CREATE_PRESET": {
        const newPreset = {
          id: `preset_${Date.now()}`,
          name: msg.name || "Custom Preset",
          passes: [
            { ...PASS_GROUNDING, id: `pass_${Date.now()}_1` },
            { ...PASS_VALIDATOR, id: `pass_${Date.now()}_2` },
            { ...PASS_PROSE, id: `pass_${Date.now()}_3` }
          ]
        };
        recastSettings.presets.push(newPreset);
        recastSettings.activePresetId = newPreset.id;
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: "RECAST_STATE_UPDATED", settings: recastSettings, progress: recastProgress });
        sp.toast?.success?.(`\u2728 Created preset: "${newPreset.name}"`);
        break;
      }
      case "RECAST_DELETE_PRESET": {
        if (recastSettings.presets.length > 1) {
          recastSettings.presets = recastSettings.presets.filter((p) => p.id !== msg.presetId);
          if (recastSettings.activePresetId === msg.presetId) {
            recastSettings.activePresetId = recastSettings.presets[0].id;
          }
          await storage.saveRecastSettings(recastSettings);
          sp.sendToFrontend({ type: "RECAST_STATE_UPDATED", settings: recastSettings, progress: recastProgress });
          sp.toast?.info?.("\uD83D\uDDD1\uFE0F Preset deleted");
        } else {
          sp.toast?.warn?.("Cannot delete the only remaining preset.");
        }
        break;
      }
      case "RECAST_RESET_PRESET": {
        recastSettings.presets = [JSON.parse(JSON.stringify(DEFAULT_RECAST_PRESET))];
        recastSettings.activePresetId = DEFAULT_RECAST_PRESET.id;
        await storage.saveRecastSettings(recastSettings);
        sp.sendToFrontend({ type: "RECAST_STATE_UPDATED", settings: recastSettings, progress: recastProgress });
        sp.toast?.info?.("\uD83D\uDD04 Reset Recast presets to defaults");
        break;
      }
      case "RECAST_RUN_MESSAGE": {
        if (isRecastRunning) {
          sp.toast?.warn?.("Recast pipeline is already running.");
          break;
        }
        try {
          let targetChatId = msg.chatId;
          let targetMessageId = msg.messageId;
          let targetText = "";
          if (!targetChatId && sp.chats?.getActive) {
            const activeChat = await sp.chats.getActive(effectiveUserId);
            targetChatId = activeChat?.id;
          }
          if (targetChatId && !targetMessageId && sp.chat?.getMessages) {
            const msgs = await sp.chat.getMessages(targetChatId);
            if (Array.isArray(msgs) && msgs.length > 0) {
              for (let i = msgs.length - 1;i >= 0; i--) {
                if (!msgs[i].is_user && msgs[i].role !== "user" && msgs[i].role !== "system") {
                  targetMessageId = msgs[i].id;
                  targetText = msgs[i].content;
                  break;
                }
              }
            }
          } else if (targetChatId && targetMessageId && sp.chat?.getMessages) {
            const msgs = await sp.chat.getMessages(targetChatId);
            const found = msgs.find((m) => m.id === targetMessageId);
            if (found)
              targetText = found.content;
          }
          if (!targetChatId || !targetMessageId || !targetText) {
            sp.toast?.warn?.("No assistant message found in current chat to recast.");
            break;
          }
          isRecastRunning = true;
          sp.toast?.info?.("\u2728 Running Recast post-processing pipeline...");
          const diff = await runRecastPipeline(sp, {
            chatId: targetChatId,
            messageId: targetMessageId,
            rawText: targetText,
            settings: recastSettings,
            userId: effectiveUserId,
            onProgress: (prog) => {
              recastProgress = prog;
              sp.sendToFrontend?.({ type: "RECAST_PROGRESS", progress: prog });
            }
          });
          if (diff) {
            sp.sendToFrontend?.({ type: "RECAST_DIFF_READY", diff });
          }
        } catch (err) {
          console.error("[Lumi:REcursion:Recast] Manual recast failed:", err);
          sp.toast?.error?.(`Recast failed: ${err?.message || err}`);
        } finally {
          isRecastRunning = false;
          recastProgress = null;
          sp.sendToFrontend?.({
            type: "RECAST_PROGRESS",
            progress: {
              active: false,
              currentPassIndex: 0,
              totalPasses: 0,
              currentPassName: "",
              statusText: ""
            }
          });
        }
        break;
      }
      case "RECAST_APPLY_RESULT": {
        try {
          const { chatId, messageId, text, mode } = msg;
          if (mode === "replace") {
            await sp.chat.updateMessage(chatId, messageId, { content: text });
            sp.toast?.success?.("\u2705 Recast applied in-place");
          } else if (mode === "swipe") {
            const allMsgs = await sp.chat.getMessages(chatId);
            const existing = allMsgs.find((m) => m.id === messageId);
            const existingSwipes = Array.isArray(existing?.swipes) && existing.swipes.length > 0 ? existing.swipes : [existing?.content || ""];
            const newSwipes = [...existingSwipes, text];
            const newSwipeId = newSwipes.length - 1;
            await sp.chat.updateMessage(chatId, messageId, { swipes: newSwipes, swipe_id: newSwipeId });
            sp.toast?.success?.("\uD83D\uDD00 Recast saved as new swipe");
          }
          sp.sendToFrontend?.({ type: "RECAST_APPLIED", chatId, messageId, mode });
        } catch (err) {
          console.error("[Lumi:REcursion:Recast] Failed to apply recast result:", err);
          sp.toast?.error?.(`Failed to apply recast: ${err?.message || err}`);
        }
        break;
      }
      case "GET_WORLDBOOK_CARDS": {
        const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
        sp.sendToFrontend({ type: "WORLDBOOK_CARDS_UPDATED", worldBookId: msg.worldBookId, cards });
        break;
      }
      case "SAVE_WORLDBOOK_CARD": {
        try {
          await saveWorldBookEntry(sp, msg.worldBookId, msg.entry, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: "WORLDBOOK_CARDS_UPDATED", worldBookId: msg.worldBookId, cards });
          sp.toast?.success?.(`\uD83D\uDCBE Card "${msg.entry.family}" saved to World Book`);
        } catch (err) {
          sp.toast?.error?.(`Failed to save entry: ${err?.message || err}`);
        }
        break;
      }
      case "DELETE_WORLDBOOK_CARD": {
        try {
          await deleteWorldBookEntry(sp, msg.entryId, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: "WORLDBOOK_CARDS_UPDATED", worldBookId: msg.worldBookId, cards });
          sp.toast?.info?.("\uD83D\uDDD1\uFE0F Card entry removed from World Book");
        } catch (err) {
          sp.toast?.error?.(`Failed to delete entry: ${err?.message || err}`);
        }
        break;
      }
      case "IMPORT_WORLDBOOK_CARDS": {
        try {
          const count = await importWorldBookCards(sp, msg.worldBookId, msg.cards, effectiveUserId);
          const cards = await listWorldBookCardEntries(sp, msg.worldBookId, effectiveUserId);
          sp.sendToFrontend({ type: "WORLDBOOK_CARDS_UPDATED", worldBookId: msg.worldBookId, cards });
          sp.toast?.success?.(`\uD83D\uDCE5 Imported ${count} card entries into World Book!`);
        } catch (err) {
          sp.toast?.error?.(`Failed to import cards: ${err?.message || err}`);
        }
        break;
      }
      case "SAVE_CHARACTER_CARD": {
        try {
          await saveCharacterCard(sp, msg.characterId, msg.card, effectiveUserId);
          const status = await getCharacterPayloadStatus(sp, msg.characterId, effectiveUserId);
          sp.sendToFrontend({ type: "CHARACTER_STATUS_UPDATED", status });
          sp.toast?.success?.(`\uD83D\uDCBE Card "${msg.card.name}" saved to character payload`);
        } catch (err) {
          sp.toast?.error?.(`Failed to save card: ${err?.message || err}`);
        }
        break;
      }
      case "DELETE_CHARACTER_CARD": {
        try {
          await deleteCharacterCard(sp, msg.characterId, msg.cardId, effectiveUserId);
          const status = await getCharacterPayloadStatus(sp, msg.characterId, effectiveUserId);
          sp.sendToFrontend({ type: "CHARACTER_STATUS_UPDATED", status });
          sp.toast?.info?.("\uD83D\uDDD1\uFE0F Card removed from character payload");
        } catch (err) {
          sp.toast?.error?.(`Failed to delete card: ${err?.message || err}`);
        }
        break;
      }
      case "IMPORT_CHARACTER_PAYLOAD": {
        try {
          const res = await importCharacterPayload(sp, msg.characterId, msg.payload, effectiveUserId);
          const status = await getCharacterPayloadStatus(sp, msg.characterId, effectiveUserId);
          sp.sendToFrontend({ type: "CHARACTER_STATUS_UPDATED", status });
          sp.toast?.success?.(`\uD83D\uDCE5 Imported ${res.cardCount} cards into character payload!`);
        } catch (err) {
          sp.toast?.error?.(`Failed to import payload: ${err?.message || err}`);
        }
        break;
      }
    }
  });
})();
export {
  getEffectiveUserId,
  rememberUser
};
