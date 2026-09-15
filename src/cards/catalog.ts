/**
 * Lumi:REcursion — Canonical Scene Reasoning Catalog
 * Ported from SillyTavern Recursion's CARD_SCOPE_CATALOG and CARD_CATALOG
 */

export interface ScopeSubItem {
  key: string;
  label: string;
  description: string;
}

export interface CatalogEntry {
  family: string;
  role: string;
  priority: number;
  description: string;
  subItems: ScopeSubItem[];
}

export const CARD_SCOPE_CATALOG: readonly CatalogEntry[] = Object.freeze([
  {
    family: 'Scene Frame',
    role: 'sceneFrameCard',
    priority: 100,
    description: 'Current location, situation, immediate direction, and hard beat boundary.',
    subItems: [
      {
        key: 'locationSituation',
        label: 'Location & Situation',
        description: 'Current place and setup expanded into nearby routes, sightlines, social exposure, local pressure, and what is relevant now.'
      },
      {
        key: 'immediateDirection',
        label: 'Immediate Direction',
        description: 'The next-beat vector the scene is pointing toward, without deciding future plot or skipping player agency.'
      },
      {
        key: 'beatConstraint',
        label: 'Beat Constraint',
        description: 'Hard response boundary for this beat, such as answer now, hold before a reveal, avoid time skip, or do not skip a pending payoff.'
      }
    ]
  },
  {
    family: 'Active Cast',
    role: 'activeCastCard',
    priority: 95,
    description: 'Who is present, visible state, and current conversational or physical role.',
    subItems: [
      {
        key: 'presentCharacters',
        label: 'Present Characters',
        description: 'Who can act, observe, interrupt, be addressed, or be accidentally dropped from the next response.'
      },
      {
        key: 'visibleState',
        label: 'Visible State',
        description: 'Observable condition, posture, injury, mood, constraint, or capability that affects what a character can do now.'
      },
      {
        key: 'speakerRoles',
        label: 'Speaker Roles',
        description: 'Who is speaking, addressed, listening, controlling the exchange, or unable to speak.'
      }
    ]
  },
  {
    family: 'Character Motivation',
    role: 'characterMotivationCard',
    priority: 88,
    description: 'Observable or safely inferred motives, pressures, hesitations, and goals.',
    subItems: [
      {
        key: 'visibleGoals',
        label: 'Visible Goals',
        description: 'Established visible goals phrased as behavior-facing pressure for the next response.'
      },
      {
        key: 'pressures',
        label: 'Pressures',
        description: 'External, social, tactical, or emotional pressures that plausibly shape behavior in this beat.'
      },
      {
        key: 'hesitationPosture',
        label: 'Hesitation & Posture',
        description: 'Visible reluctance, guardedness, confidence, uncertainty, or restraint without private mind-reading.'
      }
    ]
  },
  {
    family: 'Relationship',
    role: 'dialogueRelationshipCard',
    priority: 84,
    description: 'Current social tension, leverage, promises, conflicts, and speech constraints.',
    subItems: [
      {
        key: 'tension',
        label: 'Social Tension',
        description: 'Current friction, trust, leverage, intimacy, threat, or subtext that creates usable social affordances.'
      },
      {
        key: 'promisesConflicts',
        label: 'Promises & Conflicts',
        description: 'Active promises, refusals, debts, threats, disagreements, or obligations that shape what can be said or done next.'
      },
      {
        key: 'voiceConstraints',
        label: 'Speech Constraints',
        description: 'Scene-local address, formality, taboo wording, secrecy, or who can safely say what without replacing the preset.'
      }
    ]
  },
  {
    family: 'Social Subtext',
    role: 'socialSubtextCard',
    priority: 82,
    description: 'Scene-observable implied social meaning such as humor, veiled pressure, invitation, boundaries, status, and face.',
    subItems: [
      {
        key: 'humorIrony',
        label: 'Humor & Irony',
        description: 'Dry humor, sarcasm, teasing, understatement, or gallows humor when it signals deflection, intimacy, contempt, nervousness, or pressure relief.'
      },
      {
        key: 'veiledPressure',
        label: 'Veiled Pressure',
        description: 'Polite threats, friendly warnings, coercion, intimidation, or consequences carried through implication instead of open hostility.'
      },
      {
        key: 'invitationBoundary',
        label: 'Invitation & Boundary',
        description: 'Flirtation, charged compliments, testing interest, permission seeking, discomfort, soft refusal, or a cue not to push further.'
      },
      {
        key: 'statusFace',
        label: 'Status & Face',
        description: 'Dominance, deference, rank assertion, saving face, public embarrassment, or who is being made to yield in the exchange.'
      }
    ]
  },
  {
    family: 'Scene Constraints',
    role: 'sceneConstraintsCard',
    priority: 98,
    description: 'Hard limits, contradiction traps, timing, access, visibility, and plausibility constraints.',
    subItems: [
      {
        key: 'hardLimits',
        label: 'Hard Limits',
        description: 'Injuries, locked routes, missing objects, stated choices, visible limits, or other constraints that would make the next response implausible if missed.'
      },
      {
        key: 'spatialConstraints',
        label: 'Spatial Constraints',
        description: 'Movement, reach, visibility, blocked route, distance, and access limits that affect the next beat.'
      },
      {
        key: 'timelineOrder',
        label: 'Timeline & Order',
        description: 'Immediate cause and effect, sequence, reveal order, and what has or has not happened yet.'
      }
    ]
  },
  {
    family: 'Knowledge & Secrets',
    role: 'knowledgeSecretsCard',
    priority: 92,
    description: 'Concealed facts, who knows or suspects them, mistaken beliefs, and reveal boundaries.',
    subItems: [
      {
        key: 'concealedFacts',
        label: 'Concealed Facts',
        description: 'Hidden truths that may guide guardrails but should not be revealed as dialogue or narration unless earned.'
      },
      {
        key: 'knowsSuspects',
        label: 'Who Knows / Suspects',
        description: 'Who knows, suspects, misunderstands, or should not know a fact.'
      },
      {
        key: 'revealBoundaries',
        label: 'Reveal Boundaries',
        description: 'What the next response must not reveal, confirm, or imply too early.'
      }
    ]
  },
  {
    family: 'Consequences',
    role: 'clocksConsequencesCard',
    priority: 90,
    description: 'Deadlines, countdowns, delayed consequences, and escalation triggers.',
    subItems: [
      {
        key: 'deadlinesCountdowns',
        label: 'Deadlines & Countdowns',
        description: 'Time pressure, countdowns, scheduled events, or windows of opportunity still active.'
      },
      {
        key: 'delayedConsequences',
        label: 'Delayed Consequences',
        description: 'Effects from earlier choices that should arrive later or remain pending.'
      },
      {
        key: 'escalationTriggers',
        label: 'Escalation Triggers',
        description: 'Conditions that would make the scene worsen, shift phase, or demand action.'
      }
    ]
  },
  {
    family: 'Environment',
    role: 'environmentAffordancesCard',
    priority: 76,
    description: 'Spatial layout, sensory texture, hazards, obstacles, exits, and usable environmental affordances.',
    subItems: [
      {
        key: 'spatialLayout',
        label: 'Spatial Layout',
        description: 'Where important places, barriers, exits, cover, and actors are in relation to each other.'
      },
      {
        key: 'sensoryTexture',
        label: 'Sensory Texture',
        description: 'Sensory signals (sounds, smells, temperature, lighting) that affect grounding, attention, danger, social context, or available action.'
      },
      {
        key: 'hazardsAffordances',
        label: 'Hazards & Affordances',
        description: 'Usable objects, obstacles, threats, exits, cover, tools, and environmental opportunities.'
      }
    ]
  },
  {
    family: 'Items',
    role: 'possessionsItemsCard',
    priority: 78,
    description: 'Important held, carried, worn, hidden, lost, stolen, or controlled objects and who has them.',
    subItems: [
      {
        key: 'heldCarriedItems',
        label: 'Held & Carried Items',
        description: 'Important objects currently held, worn, carried, hidden, missing, stolen, or controlled.'
      },
      {
        key: 'itemLocationControl',
        label: 'Location & Control',
        description: 'Where an item is and who can realistically access, use, move, or withhold it.'
      },
      {
        key: 'itemAffordancesRisks',
        label: 'Affordances & Risks',
        description: 'What an item can do now, what it enables, and what risk or limit it carries.'
      }
    ]
  },
  {
    family: 'Open Threads',
    role: 'openThreadsCard',
    priority: 72,
    description: 'Unresolved questions, immediate promises, pending actions, and near-term pressures.',
    subItems: [
      {
        key: 'unresolvedQuestions',
        label: 'Unresolved Questions',
        description: 'Questions raised by the scene that remain visible and may affect the next response.'
      },
      {
        key: 'pendingActions',
        label: 'Pending Actions',
        description: 'Promised, attempted, interrupted, or requested actions that should not be forgotten.'
      },
      {
        key: 'nearTermPressures',
        label: 'Near-term Pressures',
        description: 'Immediate obligations, looming problems, or choices that should shape the next beat.'
      }
    ]
  }
]);

export const CATALOG_BY_FAMILY = new Map(CARD_SCOPE_CATALOG.map((c) => [c.family, c]));
export const CATALOG_BY_ROLE = new Map(CARD_SCOPE_CATALOG.map((c) => [c.role, c]));
