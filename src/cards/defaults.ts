/**
 * Lumi:REcursion — Default Deck Generator
 * Builds the canonical Default Deck containing all 11 scene families and sub-cards.
 */

import { CARD_SCOPE_CATALOG } from './catalog';
import type { DeckDefinition, DeckCategory, CardDefinition, CardSelectionState } from '../types';

export const DEFAULT_DECK_ID = 'default';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function createDefaultDeck(): DeckDefinition {
  const now = new Date().toISOString();
  const categoryOrder: string[] = [];
  const categories: Record<string, DeckCategory> = {};
  const cardOrderByCategory: Record<string, string[]> = {};
  const cards: Record<string, CardDefinition> = {};

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

    const cardIdsForCat: string[] = [];

    for (const subItem of entry.subItems) {
      const cardId = `${entry.role}:${subItem.key}`;
      cardIdsForCat.push(cardId);

      // Give high-priority scene anchors 'priority' or 'active' out of the box
      let selectionState: CardSelectionState = 'active';
      if (
        cardId === 'sceneFrameCard:locationSituation' ||
        cardId === 'sceneConstraintsCard:hardLimits'
      ) {
        selectionState = 'priority';
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
    name: 'Default Deck',
    description: 'Canonical bundled scene reasoning card deck with 11 families.',
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
