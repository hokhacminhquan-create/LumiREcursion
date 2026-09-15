/**
 * Lumi:REcursion — Option A: World Book Source Mode
 * Reads, syncs, and parses scene reasoning cards from Lumiverse World Books.
 */

import { CARD_SCOPE_CATALOG } from './catalog';
import type { CardDefinition, CardSelectionState, WorldBookOption } from '../types';

export const DEFAULT_WORLDBOOK_NAME = 'Lumi:REcursion Cards';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * List all available world books from Lumiverse Spindle
 */
export async function listAvailableWorldBooks(spindle: any): Promise<WorldBookOption[]> {
  try {
    if (spindle?.world_books?.list) {
      const result = await spindle.world_books.list();
      const list = Array.isArray(result) ? result : result?.data || [];
      return list.map((wb: any) => ({
        id: wb.id,
        name: wb.name || 'Untitled World Book',
        entryCount: wb.entry_count
      }));
    }
  } catch (err) {
    console.warn('[Lumi:REcursion] Failed to list world books:', err);
  }
  return [];
}

/**
 * Create or sync the standard "Lumi:REcursion Cards" World Book
 * Populates all 11 canonical card families with structured JSON content.
 */
export async function createOrSyncRecursionWorldBook(
  spindle: any,
  activeCharacterId?: string | null
): Promise<{ worldBookId: string; createdCount: number }> {
  if (!spindle?.world_books) {
    throw new Error('Spindle world_books API is not available (check permissions in spindle.json)');
  }

  // 1. Check if the book already exists
  const existingBooks = await listAvailableWorldBooks(spindle);
  let book = existingBooks.find(
    (b) => b.name === DEFAULT_WORLDBOOK_NAME || b.name === 'Recursion Cards'
  );

  let worldBookId: string;

  if (!book) {
    const created = await spindle.world_books.create({
      name: DEFAULT_WORLDBOOK_NAME,
      description: 'Scene reasoning card definitions for Lumi:REcursion extension'
    });
    worldBookId = created.id;
    console.log(`[Lumi:REcursion] Created new World Book: "${DEFAULT_WORLDBOOK_NAME}" (${worldBookId})`);
  } else {
    worldBookId = book.id;
  }

  // 2. Fetch existing entries
  let existingEntries: any[] = [];
  try {
    const entriesRes = await spindle.world_books.entries.list(worldBookId);
    existingEntries = Array.isArray(entriesRes) ? entriesRes : entriesRes?.data || [];
  } catch (err) {
    console.warn('[Lumi:REcursion] Could not list entries:', err);
  }

  const existingComments = new Set(existingEntries.map((e: any) => String(e.comment || '').trim()));
  let createdCount = 0;

  // 3. Create missing canonical entries
  for (const entry of CARD_SCOPE_CATALOG) {
    if (existingComments.has(entry.family)) {
      continue;
    }

    const payload = {
      family: entry.family,
      role: entry.role,
      priority: entry.priority,
      selectionState: (entry.family === 'Scene Frame' || entry.family === 'Scene Constraints')
        ? 'priority'
        : 'active',
      description: entry.description,
      subItems: entry.subItems.map((s) => `${s.key}: ${s.description}`)
    };

    const entryData = {
      comment: entry.family,
      key: [entry.role, slugify(entry.family), 'recursion_card'],
      content: JSON.stringify(payload, null, 2),
      constant: true,
      disabled: false,
      position: 0,
      priority: entry.priority
    };

    try {
      await spindle.world_books.entries.create(worldBookId, entryData);
      createdCount++;
    } catch (err) {
      console.error(`[Lumi:REcursion] Failed to create entry for ${entry.family}:`, err);
    }
  }

  // 4. Attach to active character if provided
  if (activeCharacterId && spindle.characters?.get && spindle.characters?.update) {
    try {
      const char = await spindle.characters.get(activeCharacterId);
      if (char) {
        const wbIds = Array.isArray(char.world_book_ids) ? [...char.world_book_ids] : [];
        if (!wbIds.includes(worldBookId)) {
          wbIds.push(worldBookId);
          await spindle.characters.update(activeCharacterId, { world_book_ids: wbIds });
          console.log(`[Lumi:REcursion] Attached World Book ${worldBookId} to character ${char.name}`);
        }
      }
    } catch (err) {
      console.warn('[Lumi:REcursion] Failed to attach world book to character:', err);
    }
  }

  return { worldBookId, createdCount };
}

/**
 * Read and parse card definitions from a World Book
 */
export async function readCardsFromWorldBook(
  spindle: any,
  worldBookId: string
): Promise<CardDefinition[]> {
  if (!spindle?.world_books?.entries?.list || !worldBookId) {
    return [];
  }

  try {
    const res = await spindle.world_books.entries.list(worldBookId);
    const entries = Array.isArray(res) ? res : res?.data || [];
    const cards: CardDefinition[] = [];

    for (const entry of entries) {
      // Skip disabled entries in World Book
      if (entry.disabled === true) {
        continue;
      }

      const contentStr = String(entry.content || '').trim();
      if (!contentStr) continue;

      let parsed: any = null;
      try {
        parsed = JSON.parse(contentStr);
      } catch {
        // Fallback parse structured text if not JSON
        parsed = parsePlainTextCardEntry(entry);
      }

      if (parsed && typeof parsed === 'object') {
        const familyName = parsed.family || entry.comment || 'Scene Card';
        const roleName = parsed.role || slugify(familyName) + 'Card';
        const selectionState: CardSelectionState =
          parsed.selectionState === 'priority' || parsed.selectionState === 'off'
            ? parsed.selectionState
            : 'active';

        cards.push({
          id: `wb:${entry.id}`,
          categoryId: slugify(familyName),
          name: familyName,
          description: parsed.description || contentStr.slice(0, 160),
          promptText: parsed.description || contentStr,
          selectionState,
          builtinFamily: familyName,
          builtinRoleId: roleName,
          priority: typeof parsed.priority === 'number' ? parsed.priority : (entry.priority || 80),
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

/**
 * Fallback parser for human-written world book entries
 */
function parsePlainTextCardEntry(entry: any): any {
  const comment = String(entry.comment || '').trim();
  const content = String(entry.content || '').trim();
  return {
    family: comment || 'Custom Card',
    role: slugify(comment || 'card') + 'Card',
    description: content,
    selectionState: 'active',
    priority: entry.priority || 80
  };
}
