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
export async function listAvailableWorldBooks(spindle: any, userId?: string): Promise<WorldBookOption[]> {
  try {
    if (spindle?.world_books?.list) {
      const result = await spindle.world_books.list(userId ? { userId } : undefined);
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
  activeCharacterId?: string | null,
  userId?: string
): Promise<{ worldBookId: string; createdCount: number }> {
  if (!spindle?.world_books) {
    throw new Error('Spindle world_books API is not available (check permissions in spindle.json)');
  }

  // 1. Check if the book already exists
  const existingBooks = await listAvailableWorldBooks(spindle, userId);
  let book = existingBooks.find(
    (b) => b.name === DEFAULT_WORLDBOOK_NAME || b.name === 'Recursion Cards'
  );

  let worldBookId: string;

  if (!book) {
    const created = await spindle.world_books.create({
      name: DEFAULT_WORLDBOOK_NAME,
      description: 'Scene reasoning card definitions for Lumi:REcursion extension'
    }, userId);
    worldBookId = created.id;
    console.log(`[Lumi:REcursion] Created new World Book: "${DEFAULT_WORLDBOOK_NAME}" (${worldBookId})`);
  } else {
    worldBookId = book.id;
  }

  // 2. Fetch existing entries
  let existingEntries: any[] = [];
  try {
    const entriesRes = await spindle.world_books.entries.list(worldBookId, userId ? { userId } : undefined);
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
      await spindle.world_books.entries.create(worldBookId, entryData, userId);
      createdCount++;
    } catch (err) {
      console.error(`[Lumi:REcursion] Failed to create entry for ${entry.family}:`, err);
    }
  }

  // 4. Attach to active character if provided
  if (activeCharacterId && spindle.characters?.get && spindle.characters?.update) {
    try {
      const char = await spindle.characters.get(activeCharacterId, userId);
      if (char) {
        const wbIds = Array.isArray(char.world_book_ids) ? [...char.world_book_ids] : [];
        if (!wbIds.includes(worldBookId)) {
          wbIds.push(worldBookId);
          await spindle.characters.update(activeCharacterId, { world_book_ids: wbIds }, userId);
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
  worldBookId: string,
  userId?: string
): Promise<CardDefinition[]> {
  if (!spindle?.world_books?.entries?.list || !worldBookId) {
    return [];
  }

  try {
    const res = await spindle.world_books.entries.list(worldBookId, userId ? { userId } : undefined);
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

export interface WorldBookCardEntryView {
  id: string;
  family: string;
  role: string;
  priority: number;
  selectionState: CardSelectionState;
  description: string;
  subItems: string[];
  keys: string[];
  disabled: boolean;
}

export async function listWorldBookCardEntries(
  spindle: any,
  worldBookId: string,
  userId?: string
): Promise<WorldBookCardEntryView[]> {
  if (!spindle?.world_books?.entries?.list || !worldBookId) return [];
  try {
    const res = await spindle.world_books.entries.list(worldBookId, userId ? { userId } : undefined);
    const entries = Array.isArray(res) ? res : res?.data || [];
    return entries.map((entry: any) => {
      let parsed: any = null;
      try {
        parsed = JSON.parse(String(entry.content || ''));
      } catch {
        parsed = parsePlainTextCardEntry(entry);
      }
      const familyName = parsed?.family || entry.comment || 'Scene Card';
      const roleName = parsed?.role || slugify(familyName) + 'Card';
      const selectionState: CardSelectionState =
        parsed?.selectionState === 'priority' || parsed?.selectionState === 'off'
          ? parsed.selectionState
          : 'active';

      return {
        id: entry.id,
        family: familyName,
        role: roleName,
        priority: typeof parsed?.priority === 'number' ? parsed.priority : (entry.priority || 80),
        selectionState,
        description: parsed?.description || String(entry.content || ''),
        subItems: Array.isArray(parsed?.subItems) ? parsed.subItems : [],
        keys: Array.isArray(entry.key) ? entry.key : [String(entry.key || '')],
        disabled: Boolean(entry.disabled)
      };
    });
  } catch (err) {
    console.warn(`[Lumi:REcursion] Failed to list card entries from World Book ${worldBookId}:`, err);
    return [];
  }
}

export async function saveWorldBookEntry(
  spindle: any,
  worldBookId: string,
  entryData: {
    id?: string;
    family: string;
    role?: string;
    priority?: number;
    selectionState?: CardSelectionState;
    description: string;
    subItems?: string[];
    keys?: string[];
    disabled?: boolean;
  },
  userId?: string
): Promise<void> {
  if (!spindle?.world_books?.entries) throw new Error('World books entries API unavailable');

  const familyName = entryData.family.trim();
  const roleName = entryData.role?.trim() || slugify(familyName) + 'Card';
  const priority = typeof entryData.priority === 'number' ? entryData.priority : 80;
  const selectionState = entryData.selectionState || 'active';
  const subItems = Array.isArray(entryData.subItems) ? entryData.subItems : [];

  const payload = {
    family: familyName,
    role: roleName,
    priority,
    selectionState,
    description: entryData.description,
    subItems
  };

  const keys = Array.isArray(entryData.keys) && entryData.keys.length > 0
    ? entryData.keys
    : [roleName, slugify(familyName), 'recursion_card'];

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
    await spindle.world_books.entries.update(entryData.id, entryPayload, userId);
  } else {
    await spindle.world_books.entries.create(worldBookId, entryPayload, userId);
  }
}

export async function deleteWorldBookEntry(spindle: any, entryId: string, userId?: string): Promise<void> {
  if (!spindle?.world_books?.entries?.delete) throw new Error('World books delete API unavailable');
  await spindle.world_books.entries.delete(entryId, userId);
}

export async function importWorldBookCards(
  spindle: any,
  worldBookId: string,
  cards: any[],
  userId?: string
): Promise<number> {
  if (!Array.isArray(cards) || cards.length === 0) return 0;
  let count = 0;
  for (const c of cards) {
    const family = c.family || c.name || c.comment || 'Custom Scene Card';
    await saveWorldBookEntry(spindle, worldBookId, {
      family,
      role: c.role || c.id || slugify(family) + 'Card',
      priority: typeof c.priority === 'number' ? c.priority : 80,
      selectionState: c.selectionState || 'active',
      description: c.description || c.promptText || '',
      subItems: Array.isArray(c.subItems) ? c.subItems : [],
      keys: Array.isArray(c.key || c.keys) ? (c.key || c.keys) : undefined,
      disabled: Boolean(c.disabled)
    }, userId);
    count++;
  }
  return count;
}
