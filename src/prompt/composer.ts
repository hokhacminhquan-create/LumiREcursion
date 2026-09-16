/**
 * Lumi:REcursion — Prompt Composer & Packet Assembler
 * Builds card evaluation prompts and compiles the final turn guidance packet.
 */

import type { CardDefinition, EvaluatedCard, RecursionSettings, StoryFormSettings } from '../types';

export const STATIC_GUARDRAILS = Object.freeze([
  'Write only the next assistant message; keep Recursion cards, labels, and guidance invisible.',
  'Honor player intent, visible facts, reveal boundaries, and hard card constraints.',
  'Use raw Recursion card evidence as source of truth when guidance and evidence conflict.'
]);

export interface ChatMessageLike {
  role: string;
  content: string;
  name?: string;
}

/**
 * Format recent messages into a clean, numbered context band for card reasoning.
 */
export function formatRecentContext(messages: ChatMessageLike[], windowSize = 6): string {
  const slice = messages.slice(-windowSize);
  return slice
    .map((msg, index) => {
      const speaker = msg.name ? `${msg.name} (${msg.role})` : msg.role;
      const content = typeof msg.content === 'string' ? msg.content.trim() : '';
      return `[message:${index + 1}] ${speaker}: ${content}`;
    })
    .join('\n\n');
}

/**
 * Build Story Form instruction line
 */
export function buildStoryFormInstruction(storyForm: StoryFormSettings): string {
  const parts: string[] = [];
  if (storyForm.pov !== 'auto') {
    if (storyForm.pov === 'first') parts.push('first-person POV ("I", "me")');
    else if (storyForm.pov === 'second') parts.push('second-person POV ("you")');
    else if (storyForm.pov === 'third') parts.push('third-person POV ("he", "she", "they")');
  }
  if (storyForm.tense !== 'auto') {
    if (storyForm.tense === 'past') parts.push('past tense');
    else if (storyForm.tense === 'present') parts.push('present tense');
  }
  if (!parts.length) return '';
  return `Story Form: Maintain narration strictly in ${parts.join(' and ')}.`;
}

/**
 * Build single-card prompt for Segmented parallel execution
 */
export function buildSingleCardPrompt(
  card: CardDefinition,
  formattedContext: string,
  storyForm: StoryFormSettings
): string {
  const storyInstruction = buildStoryFormInstruction(storyForm);

  return [
    `You are the Scene Reasoner. Create ONE compact "${card.builtinFamily || card.name}" card for the current roleplay scene.`,
    `Card Focus: ${card.name} — ${card.description}`,
    storyInstruction ? `Guidance: ${storyInstruction}` : '',
    'Task:',
    'Analyze the recent dialogue/events below and output a specific, factual, scene-grounded directive for the assistant writing the next response.',
    'Use direct imperative instructions (e.g. "Track...", "Maintain...", "Do not reveal...", "Acknowledge...", "Note that...").',
    'Keep it concise (1 to 2 sentences). Include at least one relevant "[message:N]" citation in evidenceRefs if applicable.',
    '',
    'Return ONLY a valid JSON object matching this exact schema (no markdown fences, no extra text):',
    JSON.stringify({
      promptText: 'Specific instruction or scene state for the assistant...',
      evidenceRefs: ['message:2']
    }),
    '',
    'Recent Scene Context:',
    formattedContext
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Build multi-card bundle prompt for Fused execution
 */
export function buildFusedBundlePrompt(
  cards: CardDefinition[],
  formattedContext: string,
  storyForm: StoryFormSettings
): string {
  const storyInstruction = buildStoryFormInstruction(storyForm);
  const cardList = cards.map(
    (c, i) => `${i + 1}. [${c.builtinFamily || c.name}] ${c.name}: ${c.description}`
  ).join('\n');

  return [
    'You are the Scene Reasoner. Create a structured scene reasoning card bundle for the current roleplay turn.',
    storyInstruction ? `Guidance: ${storyInstruction}` : '',
    'Requested Cards to evaluate:',
    cardList,
    '',
    'Task:',
    'Analyze the recent dialogue/events below. For EACH requested card, output a specific, factual, scene-grounded directive for the assistant writing the next response.',
    'Keep each promptText concise (1 to 2 sentences) using direct imperative instructions.',
    '',
    'Return ONLY a valid JSON object matching this schema (no markdown fences, no extra text):',
    JSON.stringify({
      cards: [
        {
          cardId: cards[0]?.id || 'card-id',
          family: cards[0]?.builtinFamily || 'Scene Frame',
          promptText: 'Specific instruction or scene state for the assistant...',
          evidenceRefs: ['message:1']
        }
      ]
    }),
    '',
    'Recent Scene Context:',
    formattedContext
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Safe JSON extraction from LLM response
 */
export function extractJsonFromResponse(raw: unknown): any {
  if (!raw) return null;
  let text = typeof raw === 'string' ? raw.trim() : '';
  if (typeof raw === 'object' && raw !== null && 'content' in (raw as any)) {
    text = String((raw as any).content || '').trim();
  }

  // Strip <think>...</think> and <thought>...</thought> reasoning blocks from thinking models
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  text = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();

  // Remove markdown code fences if present
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Try direct parse
  try {
    return JSON.parse(text);
  } catch {}

  // Look for first '{' and matching '}'
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }

  return null;
}

/**
 * Format a single card into the Prompt Packet line
 */
export function formatCardEvidenceLine(card: EvaluatedCard): string {
  const cleanPrompt = card.promptText.replace(/\n+/g, ' ').trim();
  return `- [${card.family}] ${cleanPrompt}`;
}

/**
 * Assemble the complete injected Prompt Packet
 */
export function assemblePromptPacket(
  cards: EvaluatedCard[],
  storyForm: StoryFormSettings,
  footprint: 'compact' | 'normal' | 'rich' = 'normal'
): string {
  if (!cards.length) return '';

  const lines: string[] = [
    'Private Recursion card evidence for the next assistant message.',
    'Use these cards silently as evidence. Preserve their hard constraints, subtext, and open threads while keeping card labels out of final prose.',
    'Card evidence:'
  ];

  for (const card of cards) {
    lines.push(formatCardEvidenceLine(card));
  }

  const storyInstruction = buildStoryFormInstruction(storyForm);
  if (storyInstruction) {
    lines.push(`Story Form: ${storyInstruction}`);
  }

  lines.push('Guardrails:');
  for (const g of STATIC_GUARDRAILS) {
    lines.push(`- ${g}`);
  }

  return lines.join('\n');
}
