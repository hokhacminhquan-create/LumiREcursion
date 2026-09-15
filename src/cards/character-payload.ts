/**
 * Lumi:REcursion — Option B: Character Extension Payload Source Mode
 * Reads, syncs, and writes scene reasoning cards inside character.extensions.lumi_recursion.
 */

import { CARD_SCOPE_CATALOG } from './catalog';
import type {
  CardDefinition,
  CardSelectionState,
  CharacterExtensionData,
  CharacterPayloadCard,
  CharacterPayloadStatus
} from '../types';

export const CHARACTER_EXT_KEY = 'lumi_recursion';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Generate default character payload cards from canonical catalog
 */
export function createDefaultCharacterCards(): CharacterPayloadCard[] {
  return CARD_SCOPE_CATALOG.map((entry) => ({
    id: entry.role,
    family: entry.family,
    name: entry.family,
    role: entry.role,
    priority: entry.priority,
    selectionState:
      entry.family === 'Scene Frame' || entry.family === 'Scene Constraints'
        ? ('priority' as CardSelectionState)
        : ('active' as CardSelectionState),
    description: entry.description,
    promptText: entry.description,
    subItems: entry.subItems.map((s) => `${s.key}: ${s.description}`)
  }));
}

/**
 * Check active character card payload status
 */
export async function getCharacterPayloadStatus(
  spindle: any,
  characterId: string
): Promise<CharacterPayloadStatus | null> {
  if (!spindle?.characters?.get || !characterId) return null;

  try {
    const char = await spindle.characters.get(characterId);
    if (!char) return null;

    const ext = char.extensions || {};
    const payload = ext[CHARACTER_EXT_KEY] || ext['lumirecursion'] || ext['card_defs'];
    const cards = Array.isArray(payload?.cards) ? payload.cards : Array.isArray(payload) ? payload : [];

    return {
      id: char.id,
      name: char.name,
      hasPayload: cards.length > 0,
      cardCount: cards.length,
      cards
    };
  } catch (err) {
    console.warn('[Lumi:REcursion] Failed to get character payload status:', err);
    return null;
  }
}

/**
 * Initialize or write the default 11 scene reasoning cards to character.extensions
 */
export async function initCharacterCardPayload(
  spindle: any,
  characterId: string
): Promise<{ success: boolean; cardCount: number }> {
  if (!spindle?.characters?.get || !spindle?.characters?.update || !characterId) {
    throw new Error('Spindle characters API is not available or no active character.');
  }

  const char = await spindle.characters.get(characterId);
  if (!char) {
    throw new Error(`Character ${characterId} not found.`);
  }

  const defaultCards = createDefaultCharacterCards();
  const currentExtensions = { ...(char.extensions || {}) };

  const payload: CharacterExtensionData = {
    version: 1,
    enabled: true,
    pipeline: 'segmented',
    cards: defaultCards
  };

  currentExtensions[CHARACTER_EXT_KEY] = payload;
  // Also provide alias for ease of external AI inspection
  currentExtensions['lumirecursion_card_defs'] = defaultCards;

  await spindle.characters.update(characterId, {
    extensions: currentExtensions
  });

  console.log(`[Lumi:REcursion] Initialized character extension payload on "${char.name}" with ${defaultCards.length} cards.`);
  return { success: true, cardCount: defaultCards.length };
}

/**
 * Read and parse scene reasoning cards from character.extensions
 */
export async function readCardsFromCharacter(
  spindle: any,
  characterId: string
): Promise<CardDefinition[]> {
  if (!spindle?.characters?.get || !characterId) return [];

  try {
    const char = await spindle.characters.get(characterId);
    if (!char || !char.extensions) return [];

    const ext = char.extensions;
    const payload = ext[CHARACTER_EXT_KEY] || ext['lumirecursion'] || ext['card_defs'];
    const rawCards: any[] = Array.isArray(payload?.cards) ? payload.cards : Array.isArray(payload) ? payload : [];

    return rawCards.map((c: any) => {
      const familyName = c.family || c.name || 'Character Scene Card';
      const roleName = c.role || slugify(familyName) + 'Card';
      const selectionState: CardSelectionState =
        c.selectionState === 'priority' || c.selectionState === 'off'
          ? c.selectionState
          : 'active';

      return {
        id: `char:${c.id || roleName}`,
        categoryId: slugify(familyName),
        name: c.name || familyName,
        description: c.description || '',
        promptText: c.promptText || c.description || '',
        selectionState,
        builtinFamily: familyName,
        builtinRoleId: roleName,
        priority: typeof c.priority === 'number' ? c.priority : 80,
        selectedSubItems: Array.isArray(c.subItems) ? c.subItems : []
      };
    });
  } catch (err) {
    console.warn(`[Lumi:REcursion] Failed to read cards from character ${characterId}:`, err);
    return [];
  }
}

/**
 * Update a single card's selection state in character.extensions
 */
export async function updateCharacterCardState(
  spindle: any,
  characterId: string,
  cardId: string,
  state: CardSelectionState
): Promise<boolean> {
  if (!spindle?.characters?.get || !spindle?.characters?.update || !characterId) return false;

  try {
    const char = await spindle.characters.get(characterId);
    if (!char || !char.extensions) return false;

    const currentExt = { ...char.extensions };
    const payload = currentExt[CHARACTER_EXT_KEY];
    if (!payload || !Array.isArray(payload.cards)) return false;

    const normalizedId = cardId.replace(/^char:/, '');
    const found = payload.cards.find((c: any) => c.id === normalizedId || c.role === normalizedId);
    if (found) {
      found.selectionState = state;
      await spindle.characters.update(characterId, { extensions: currentExt });
      return true;
    }
    return false;
  } catch (err) {
    console.warn('[Lumi:REcursion] Failed to update character card state:', err);
    return false;
  }
}
