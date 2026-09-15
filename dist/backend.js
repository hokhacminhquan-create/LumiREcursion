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

// src/storage.ts
var DEFAULT_SETTINGS = {
  enabled: true,
  mode: "auto",
  pipeline: "segmented",
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
var cachedTurn = null;
var storage;
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
async function listConnections() {
  try {
    if (sp?.connections?.list) {
      const list = await sp.connections.list();
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
async function resolveConnectionId(profileId) {
  if (profileId)
    return profileId;
  const conns = await listConnections();
  const def = conns.find((c) => c.is_default) || conns[0];
  return def ? def.id : undefined;
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
  console.log("[Lumi:REcursion] Initialized with active deck:", activeDeckId, "Enabled:", settings.enabled);
  sp.registerInterceptor(async (messages, context) => {
    if (!settings.enabled) {
      return messages;
    }
    if (settings.mode === "manual" && !settings.manualTurnArmed) {
      return messages;
    }
    settings.manualTurnArmed = false;
    const currentDeck = decks[activeDeckId] || decks[DEFAULT_DECK_ID];
    if (!currentDeck || !currentDeck.cards) {
      return messages;
    }
    const allCards = Object.values(currentDeck.cards);
    const priorityCards = allCards.filter((c) => c.selectionState === "priority");
    const normalActiveCards = allCards.filter((c) => c.selectionState === "active");
    const selectedCards = [...priorityCards, ...normalActiveCards].slice(0, settings.maxCards);
    const omittedCards = [...priorityCards, ...normalActiveCards].slice(settings.maxCards).map((c) => ({
      cardId: c.id,
      family: c.builtinFamily || c.name,
      reason: "max-cards"
    }));
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
    const connId = await resolveConnectionId(settings.connectionProfileId);
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
      currentStepText: `Evaluating ${selectedCards.length} scene cards in parallel...`
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
      currentStepText: `Ready. ${evaluatedCards.length} cards prepared in ${totalLatency}ms.`
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
  sp.onFrontendMessage(async (msg) => {
    switch (msg.type) {
      case "GET_STATE": {
        const conns = await listConnections();
        sp.sendToFrontend({
          type: "STATE",
          settings,
          decks,
          activeDeckId,
          lastBrief,
          progress: currentProgress,
          connections: conns
        });
        break;
      }
      case "UPDATE_SETTINGS": {
        settings = { ...settings, ...msg.settings };
        await storage.saveSettings(settings);
        sp.sendToFrontend({ type: "SETTINGS_UPDATED", settings });
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
        const conns = await listConnections();
        sp.sendToFrontend({ type: "CONNECTIONS", connections: conns });
        break;
      }
    }
  });
})();
