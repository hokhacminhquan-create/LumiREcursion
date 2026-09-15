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
  characterId: string,
  userId?: string
): Promise<CharacterPayloadStatus | null> {
  if (!spindle?.characters?.get || !characterId) return null;

  try {
    const char = await spindle.characters.get(characterId, userId);
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
  characterId: string,
  userId?: string
): Promise<{ success: boolean; cardCount: number }> {
  if (!spindle?.characters?.get || !spindle?.characters?.update || !characterId) {
    throw new Error('Spindle characters API is not available or no active character.');
  }

  const char = await spindle.characters.get(characterId, userId);
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
  }, userId);

  console.log(`[Lumi:REcursion] Initialized character extension payload on "${char.name}" with ${defaultCards.length} cards.`);
  return { success: true, cardCount: defaultCards.length };
}

/**
 * Read and parse scene reasoning cards from character.extensions
 */
export async function readCardsFromCharacter(
  spindle: any,
  characterId: string,
  userId?: string
): Promise<CardDefinition[]> {
  if (!spindle?.characters?.get || !characterId) return [];

  try {
    const char = await spindle.characters.get(characterId, userId);
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
  state: CardSelectionState,
  userId?: string
): Promise<boolean> {
  if (!spindle?.characters?.get || !spindle?.characters?.update || !characterId) return false;

  try {
    const char = await spindle.characters.get(characterId, userId);
    if (!char || !char.extensions) return false;

    const currentExt = { ...char.extensions };
    const payload = currentExt[CHARACTER_EXT_KEY];
    if (!payload || !Array.isArray(payload.cards)) return false;

    const normalizedId = cardId.replace(/^char:/, '');
    const found = payload.cards.find((c: any) => c.id === normalizedId || c.role === normalizedId);
    if (found) {
      found.selectionState = state;
      await spindle.characters.update(characterId, { extensions: currentExt }, userId);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('[Lumi:REcursion] Failed to update character card state:', err);
    return false;
  }
}

export async function saveCharacterCard(
  spindle: any,
  characterId: string,
  card: CharacterPayloadCard,
  userId?: string
): Promise<boolean> {
  if (!spindle?.characters?.get || !spindle?.characters?.update || !characterId) return false;
  try {
    const char = await spindle.characters.get(characterId, userId);
    if (!char) return false;

    const currentExt = { ...(char.extensions || {}) };
    let payload = currentExt[CHARACTER_EXT_KEY];
    if (!payload || !Array.isArray(payload.cards)) {
      payload = {
        version: 1,
        enabled: true,
        pipeline: 'segmented',
        cards: []
      };
    }

    const cardId = card.id || card.role || slugify(card.name || 'card') + 'Card';
    const cleanCard: CharacterPayloadCard = {
      id: cardId,
      family: card.family || card.name || 'Custom Scene Card',
      name: card.name || card.family || 'Custom Scene Card',
      role: card.role || cardId,
      priority: typeof card.priority === 'number' ? card.priority : 80,
      selectionState: card.selectionState || 'active',
      description: card.description || '',
      promptText: card.promptText || card.description || '',
      subItems: Array.isArray(card.subItems) ? card.subItems : []
    };

    const idx = payload.cards.findIndex((c: any) => c.id === cardId || c.role === cardId);
    if (idx !== -1) {
      payload.cards[idx] = cleanCard;
    } else {
      payload.cards.push(cleanCard);
    }

    currentExt[CHARACTER_EXT_KEY] = payload;
    currentExt['lumirecursion_card_defs'] = payload.cards;

    await spindle.characters.update(characterId, { extensions: currentExt }, userId);
    return true;
  } catch (err) {
    console.error('[Lumi:REcursion] Failed to save character card:', err);
    return false;
  }
}

export async function deleteCharacterCard(
  spindle: any,
  characterId: string,
  cardId: string,
  userId?: string
): Promise<boolean> {
  if (!spindle?.characters?.get || !spindle?.characters?.update || !characterId) return false;
  try {
    const char = await spindle.characters.get(characterId, userId);
    if (!char || !char.extensions) return false;

    const currentExt = { ...char.extensions };
    const payload = currentExt[CHARACTER_EXT_KEY];
    if (!payload || !Array.isArray(payload.cards)) return false;

    const normalizedId = cardId.replace(/^char:/, '');
    payload.cards = payload.cards.filter((c: any) => c.id !== normalizedId && c.role !== normalizedId);
    currentExt[CHARACTER_EXT_KEY] = payload;
    currentExt['lumirecursion_card_defs'] = payload.cards;

    await spindle.characters.update(characterId, { extensions: currentExt }, userId);
    return true;
  } catch (err) {
    console.error('[Lumi:REcursion] Failed to delete character card:', err);
    return false;
  }
}

export async function importCharacterPayload(
  spindle: any,
  characterId: string,
  importedData: any,
  userId?: string
): Promise<{ success: boolean; cardCount: number }> {
  if (!spindle?.characters?.get || !spindle?.characters?.update || !characterId) {
    throw new Error('Characters API unavailable');
  }

  const char = await spindle.characters.get(characterId, userId);
  if (!char) throw new Error(`Character ${characterId} not found`);

  let rawCards: any[] = [];
  if (Array.isArray(importedData)) {
    rawCards = importedData;
  } else if (importedData && Array.isArray(importedData.cards)) {
    rawCards = importedData.cards;
  } else if (importedData && typeof importedData === 'object') {
    rawCards = importedData.card_defs || importedData.lumi_recursion?.cards || [];
  }

  if (rawCards.length === 0) {
    throw new Error('No valid cards found in imported JSON data.');
  }

  const cleanCards: CharacterPayloadCard[] = rawCards.map((c: any, i: number) => {
    const family = c.family || c.name || `Card ${i + 1}`;
    const role = c.role || c.id || slugify(family) + 'Card';
    return {
      id: role,
      family,
      name: c.name || family,
      role,
      priority: typeof c.priority === 'number' ? c.priority : 80,
      selectionState: c.selectionState || 'active',
      description: c.description || c.promptText || '',
      promptText: c.promptText || c.description || '',
      subItems: Array.isArray(c.subItems) ? c.subItems : []
    };
  });

  const currentExt = { ...(char.extensions || {}) };
  const payload: CharacterExtensionData = {
    version: 1,
    enabled: true,
    pipeline: 'segmented',
    cards: cleanCards
  };

  currentExt[CHARACTER_EXT_KEY] = payload;
  currentExt['lumirecursion_card_defs'] = cleanCards;

  await spindle.characters.update(characterId, { extensions: currentExt }, userId);
  return { success: true, cardCount: cleanCards.length };
}
