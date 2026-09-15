/**
 * Lumi:REcursion — Source Panels for Option A (World Book) & Option B (Character Payload)
 * Provides interactive Card Editing, JSON Import/Export, and Schema References for Lumiverse Spindle.
 */

import { CARD_SCOPE_CATALOG } from './catalog';
import { showJsonModal } from './import-export-modal';
import type {
  WorldBookOption,
  WorldBookCardEntryView,
  CharacterPayloadStatus,
  CharacterPayloadCard,
  CardSelectionState
} from '../types';

const SPARKLE_ICON_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`;
const TRASH_ICON_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

// Editing state tracking
export const editingWbCards = new Set<string>();
export const editingCharCards = new Set<string>();
export let isAddingWbCard = false;
export let isAddingCharCard = false;
let showWbSchemaGuide = false;
let showCharSchemaGuide = false;

function cycleState(cur: CardSelectionState): CardSelectionState {
  if (cur === 'off') return 'active';
  if (cur === 'active') return 'priority';
  return 'off';
}

// ─── Option A: World Book Source Panel ────────────────────────────────────────

export function renderWorldBookPanel(
  container: HTMLElement,
  options: {
    worldBooks: WorldBookOption[];
    selectedWorldBookId: string;
    cards: WorldBookCardEntryView[];
    hostCtx: any;
    onRefresh: () => void;
  }
) {
  const { worldBooks, selectedWorldBookId, cards, hostCtx, onRefresh } = options;

  const panel = document.createElement('div');
  panel.className = 'lr-panel';

  // Panel Header
  const header = document.createElement('div');
  header.className = 'lr-panel-header';
  header.innerHTML = `<span>📖 Option A: World Book Card Definitions</span>`;
  panel.appendChild(header);

  const body = document.createElement('div');
  body.className = 'lr-panel-body';

  // Info Box
  const infoBox = document.createElement('div');
  infoBox.className = 'lr-info-box';
  infoBox.innerHTML = `
    🐭 <strong>World Book Mode:</strong> Cards are stored as independent entries inside a Lumiverse World Book.
    Both you and assistant personas (like Mousepad 🐭) can view, edit, enable/disable, or import/export cards natively.
  `;
  body.appendChild(infoBox);

  // Selector Bar
  const selectBar = document.createElement('div');
  selectBar.className = 'lr-deck-bar';

  const wbSelect = document.createElement('select');
  wbSelect.className = 'lr-select';
  const defOpt = document.createElement('option');
  defOpt.value = '';
  defOpt.textContent = 'Auto-detect "Lumi:REcursion Cards" or attached book';
  wbSelect.appendChild(defOpt);

  for (const b of worldBooks) {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = `${b.name}${b.entryCount !== undefined ? ` (${b.entryCount} entries)` : ''}`;
    opt.selected = b.id === selectedWorldBookId;
    wbSelect.appendChild(opt);
  }
  wbSelect.onchange = () => {
    hostCtx?.sendToBackend({
      type: 'UPDATE_SETTINGS',
      settings: { worldBookId: wbSelect.value }
    });
    if (wbSelect.value) {
      hostCtx?.sendToBackend({
        type: 'GET_WORLDBOOK_CARDS',
        worldBookId: wbSelect.value
      });
    }
    onRefresh();
  };
  selectBar.appendChild(wbSelect);

  const syncBtn = document.createElement('button');
  syncBtn.className = 'lr-btn lr-btn-primary';
  syncBtn.innerHTML = `${SPARKLE_ICON_SVG} Sync / Create Book`;
  syncBtn.title = 'Creates or updates "Lumi:REcursion Cards" World Book with 11 canonical card families';
  syncBtn.onclick = () => {
    hostCtx?.sendToBackend({ type: 'CREATE_OR_SYNC_WORLD_BOOK' });
  };
  selectBar.appendChild(syncBtn);
  body.appendChild(selectBar);

  // Action Toolbar (Import / Export / Schema Guide)
  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.flexWrap = 'wrap';
  toolbar.style.gap = '6px';
  toolbar.style.padding = '4px 0';

  const importBtn = document.createElement('button');
  importBtn.className = 'lr-btn';
  importBtn.innerHTML = `<span>📥 Import Cards (JSON)</span>`;
  importBtn.title = 'Import an array of card entries or raw JSON into this World Book';
  importBtn.onclick = () => {
    const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || '');
    if (!effectiveId) {
      hostCtx?.toast?.warn?.('Please select or create a World Book first.');
      return;
    }
    showJsonModal({
      title: '📥 Import Cards into World Book',
      mode: 'import',
      defaultTemplate: CARD_SCOPE_CATALOG.map((c) => ({
        family: c.family,
        role: c.role,
        priority: c.priority,
        selectionState: 'active',
        description: c.description,
        subItems: c.subItems.map((s) => `${s.key}: ${s.description}`)
      })),
      onImport: (parsed) => {
        const arr = Array.isArray(parsed) ? parsed : (parsed.cards || parsed.entries || []);
        hostCtx?.sendToBackend({
          type: 'IMPORT_WORLDBOOK_CARDS',
          worldBookId: effectiveId,
          cards: arr
        });
      },
      hostCtx
    });
  };
  toolbar.appendChild(importBtn);

  const exportBtn = document.createElement('button');
  exportBtn.className = 'lr-btn';
  exportBtn.innerHTML = `<span>📤 Export Cards (JSON)</span>`;
  exportBtn.title = 'Export all cards in this World Book as JSON';
  exportBtn.onclick = () => {
    showJsonModal({
      title: '📤 Export World Book Cards (JSON)',
      mode: 'export',
      initialData: cards.map((c) => ({
        family: c.family,
        role: c.role,
        priority: c.priority,
        selectionState: c.selectionState,
        description: c.description,
        subItems: c.subItems,
        disabled: c.disabled
      })),
      hostCtx
    });
  };
  toolbar.appendChild(exportBtn);

  const guideBtn = document.createElement('button');
  guideBtn.className = 'lr-btn';
  guideBtn.style.marginLeft = 'auto';
  guideBtn.textContent = showWbSchemaGuide ? '▲ Hide Schema' : 'ℹ️ Schema Reference';
  guideBtn.onclick = () => {
    showWbSchemaGuide = !showWbSchemaGuide;
    onRefresh();
  };
  toolbar.appendChild(guideBtn);
  body.appendChild(toolbar);

  // Schema Guide Details Box
  if (showWbSchemaGuide) {
    const guideBox = document.createElement('div');
    guideBox.style.background = '#181818';
    guideBox.style.border = '1px solid #383838';
    guideBox.style.borderRadius = '5px';
    guideBox.style.padding = '8px 10px';
    guideBox.style.fontSize = '11px';
    guideBox.style.color = '#ccc';
    guideBox.innerHTML = `
      <div style="font-weight:700;color:#65d6e8;margin-bottom:4px;">📖 World Book Entry JSON Schema:</div>
      <div>Each card is stored inside a World Book Entry's <code>content</code> field as JSON:</div>
      <pre style="background:#111;padding:6px;border-radius:4px;margin:6px 0;font-size:10.5px;color:#a8d5e5;overflow-x:auto;">{
  "family": "Scene Frame",
  "role": "sceneFrameCard",
  "priority": 100,
  "selectionState": "priority", // "off" | "active" | "priority"
  "description": "Hard boundary constraints, routes, and beat direction.",
  "subItems": ["locationSituation: ...", "immediateDirection: ..."]
}</pre>
      <div>Alternatively, plain text entries are supported where <code>comment</code> is the family name and <code>content</code> is the prompt text.</div>
    `;
    body.appendChild(guideBox);
  }

  // Cards List Header
  const listHeader = document.createElement('div');
  listHeader.style.display = 'flex';
  listHeader.style.justifyContent = 'space-between';
  listHeader.style.alignItems = 'center';
  listHeader.style.marginTop = '6px';
  listHeader.style.paddingBottom = '4px';
  listHeader.style.borderBottom = '1px solid #333';
  listHeader.innerHTML = `
    <span style="font-weight:600;font-size:12px;color:#e0e0e0;">Card Entries (${cards.length})</span>
  `;

  const addCardBtn = document.createElement('button');
  addCardBtn.className = 'lr-btn lr-btn-primary';
  addCardBtn.style.padding = '2px 8px';
  addCardBtn.style.fontSize = '11px';
  addCardBtn.textContent = isAddingWbCard ? 'Cancel Add' : '+ Add Card Entry';
  addCardBtn.onclick = () => {
    isAddingWbCard = !isAddingWbCard;
    onRefresh();
  };
  listHeader.appendChild(addCardBtn);
  body.appendChild(listHeader);

  // New Card Form
  if (isAddingWbCard) {
    const addForm = renderCardEditorForm({
      initial: {
        family: 'New Scene Card',
        role: 'customCard',
        priority: 80,
        selectionState: 'active',
        description: 'Describe the reasoning focus for this card...',
        subItems: []
      },
      onSave: (entryData) => {
        const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || '');
        if (!effectiveId) {
          hostCtx?.toast?.warn?.('Select a World Book first.');
          return;
        }
        hostCtx?.sendToBackend({
          type: 'SAVE_WORLDBOOK_CARD',
          worldBookId: effectiveId,
          entry: entryData
        });
        isAddingWbCard = false;
      },
      onCancel: () => {
        isAddingWbCard = false;
        onRefresh();
      }
    });
    body.appendChild(addForm);
  }

  // Cards List
  if (cards.length > 0) {
    const listDiv = document.createElement('div');
    listDiv.style.display = 'flex';
    listDiv.style.flexDirection = 'column';
    listDiv.style.gap = '6px';

    for (const card of cards) {
      const isEditing = editingWbCards.has(card.id);

      const cardRow = document.createElement('div');
      cardRow.className = 'recast-pass-item';
      if (card.disabled) cardRow.classList.add('disabled');

      const headerRow = document.createElement('div');
      headerRow.className = 'recast-pass-header';

      const titlePart = document.createElement('div');
      titlePart.className = 'recast-pass-title-row';
      titlePart.innerHTML = `
        <span style="font-size:12px;font-weight:600;color:#e0e0e0;">${card.family}</span>
        <span style="font-size:10px;color:#888;background:#282828;padding:1px 5px;border-radius:3px;">p:${card.priority}</span>
        ${card.disabled ? '<span style="font-size:10px;color:#ff8a8a;">(Disabled)</span>' : ''}
      `;
      headerRow.appendChild(titlePart);

      const actionPart = document.createElement('div');
      actionPart.className = 'recast-pass-controls';

      // State Pill Toggle
      const pill = document.createElement('div');
      pill.className = `lr-card-pill state-${card.selectionState}`;
      pill.textContent = card.selectionState.toUpperCase();
      pill.title = 'Click to cycle: Off → Active → Priority';
      pill.onclick = () => {
        const next = cycleState(card.selectionState);
        card.selectionState = next;
        pill.className = `lr-card-pill state-${next}`;
        pill.textContent = next.toUpperCase();
        const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || '');
        if (effectiveId) {
          hostCtx?.sendToBackend({
            type: 'SAVE_WORLDBOOK_CARD',
            worldBookId: effectiveId,
            entry: {
              id: card.id,
              family: card.family,
              role: card.role,
              priority: card.priority,
              selectionState: next,
              description: card.description,
              subItems: card.subItems,
              disabled: card.disabled
            }
          });
        }
      };
      actionPart.appendChild(pill);

      // Edit Button
      const editBtn = document.createElement('button');
      editBtn.className = 'recast-btn-icon';
      editBtn.textContent = isEditing ? 'Close' : 'Edit';
      editBtn.onclick = () => {
        if (editingWbCards.has(card.id)) editingWbCards.delete(card.id);
        else editingWbCards.add(card.id);
        onRefresh();
      };
      actionPart.appendChild(editBtn);

      // Delete Button
      const delBtn = document.createElement('button');
      delBtn.className = 'recast-btn-icon';
      delBtn.style.color = '#ff8a8a';
      delBtn.innerHTML = TRASH_ICON_SVG;
      delBtn.title = 'Delete entry from World Book';
      delBtn.onclick = () => {
        if (confirm(`Delete card entry "${card.family}" from World Book?`)) {
          const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || '');
          hostCtx?.sendToBackend({
            type: 'DELETE_WORLDBOOK_CARD',
            worldBookId: effectiveId,
            entryId: card.id
          });
          editingWbCards.delete(card.id);
        }
      };
      actionPart.appendChild(delBtn);

      headerRow.appendChild(actionPart);
      cardRow.appendChild(headerRow);

      // Description summary
      if (!isEditing && card.description) {
        const descDiv = document.createElement('div');
        descDiv.style.fontSize = '11px';
        descDiv.style.color = '#888';
        descDiv.style.lineHeight = '1.3';
        descDiv.style.marginTop = '2px';
        descDiv.textContent = card.description.slice(0, 120) + (card.description.length > 120 ? '…' : '');
        cardRow.appendChild(descDiv);
      }

      // Inline Editor Form
      if (isEditing) {
        const editForm = renderCardEditorForm({
          initial: {
            id: card.id,
            family: card.family,
            role: card.role,
            priority: card.priority,
            selectionState: card.selectionState,
            description: card.description,
            subItems: card.subItems,
            disabled: card.disabled
          },
          onSave: (entryData) => {
            const effectiveId = selectedWorldBookId || (worldBooks[0]?.id || '');
            hostCtx?.sendToBackend({
              type: 'SAVE_WORLDBOOK_CARD',
              worldBookId: effectiveId,
              entry: entryData
            });
            editingWbCards.delete(card.id);
          },
          onCancel: () => {
            editingWbCards.delete(card.id);
            onRefresh();
          }
        });
        cardRow.appendChild(editForm);
      }

      listDiv.appendChild(cardRow);
    }
    body.appendChild(listDiv);
  } else {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.color = '#888';
    emptyMsg.style.fontStyle = 'italic';
    emptyMsg.style.padding = '8px 0';
    emptyMsg.textContent = 'No card entries found in this World Book yet. Click "Sync / Create Book" above to initialize canonical cards or "Import Cards (JSON)".';
    body.appendChild(emptyMsg);
  }

  panel.appendChild(body);
  container.appendChild(panel);
}

// ─── Option B: Character Extension Payload Source Panel ───────────────────────

export function renderCharacterPayloadPanel(
  container: HTMLElement,
  options: {
    characterStatus: CharacterPayloadStatus | null;
    hostCtx: any;
    onRefresh: () => void;
  }
) {
  const { characterStatus, hostCtx, onRefresh } = options;

  const panel = document.createElement('div');
  panel.className = 'lr-panel';

  const header = document.createElement('div');
  header.className = 'lr-panel-header';
  header.innerHTML = `<span>👤 Option B: Character Card Payload</span>`;
  panel.appendChild(header);

  const body = document.createElement('div');
  body.className = 'lr-panel-body';

  const infoBox = document.createElement('div');
  infoBox.className = 'lr-info-box';
  infoBox.innerHTML = `
    🐭 <strong>Character Payload Mode:</strong> Cards are saved directly into <code>character.extensions.lumi_recursion</code>.
    This permanently binds the card deck to the character card across chats. Assistants can inspect and edit cards via <code>set</code>.
  `;
  body.appendChild(infoBox);

  if (!characterStatus) {
    const emptyDiv = document.createElement('div');
    emptyDiv.style.color = '#888';
    emptyDiv.style.padding = '8px 0';
    emptyDiv.textContent = 'No active character selected in chat. Open a chat with a character to inspect or initialize their payload.';
    body.appendChild(emptyDiv);
    panel.appendChild(body);
    container.appendChild(panel);
    return;
  }

  // Character Bar (Status & Initialize)
  const charBar = document.createElement('div');
  charBar.className = 'lr-deck-bar';

  const statusSpan = document.createElement('div');
  statusSpan.style.flex = '1';
  statusSpan.style.fontSize = '12px';
  statusSpan.innerHTML = `Active: <strong>${characterStatus.name}</strong> · ${
    characterStatus.hasPayload
      ? `<span style="color:#7fcf8a">${characterStatus.cardCount} cards loaded</span>`
      : '<span style="color:#ffd479">No payload yet</span>'
  }`;
  charBar.appendChild(statusSpan);

  const initBtn = document.createElement('button');
  initBtn.className = 'lr-btn lr-btn-primary';
  initBtn.innerHTML = `${SPARKLE_ICON_SVG} Initialize / Reset Cards`;
  initBtn.title = 'Initializes the 11 canonical card families inside character.extensions.lumi_recursion';
  initBtn.onclick = () => {
    hostCtx?.sendToBackend({ type: 'INIT_CHARACTER_PAYLOAD' });
  };
  charBar.appendChild(initBtn);
  body.appendChild(charBar);

  // Action Toolbar (Import / Export / Schema Guide)
  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.flexWrap = 'wrap';
  toolbar.style.gap = '6px';
  toolbar.style.padding = '4px 0';

  const importBtn = document.createElement('button');
  importBtn.className = 'lr-btn';
  importBtn.innerHTML = `<span>📥 Import Payload (JSON)</span>`;
  importBtn.title = 'Import a JSON payload or array of cards directly into this character card';
  importBtn.onclick = () => {
    showJsonModal({
      title: '📥 Import Character Card Payload',
      mode: 'import',
      defaultTemplate: {
        version: 1,
        enabled: true,
        pipeline: 'segmented',
        cards: CARD_SCOPE_CATALOG.map((c) => ({
          id: c.role,
          family: c.family,
          name: c.family,
          role: c.role,
          priority: c.priority,
          selectionState: 'active',
          description: c.description,
          promptText: c.description,
          subItems: c.subItems.map((s) => `${s.key}: ${s.description}`)
        }))
      },
      onImport: (parsed) => {
        hostCtx?.sendToBackend({
          type: 'IMPORT_CHARACTER_PAYLOAD',
          characterId: characterStatus.id,
          payload: parsed
        });
      },
      hostCtx
    });
  };
  toolbar.appendChild(importBtn);

  const exportBtn = document.createElement('button');
  exportBtn.className = 'lr-btn';
  exportBtn.innerHTML = `<span>📤 Export Payload (JSON)</span>`;
  exportBtn.title = 'Export character payload as JSON';
  exportBtn.onclick = () => {
    showJsonModal({
      title: '📤 Export Character Payload (JSON)',
      mode: 'export',
      initialData: {
        version: 1,
        enabled: true,
        cards: characterStatus.cards || []
      },
      hostCtx
    });
  };
  toolbar.appendChild(exportBtn);

  const guideBtn = document.createElement('button');
  guideBtn.className = 'lr-btn';
  guideBtn.style.marginLeft = 'auto';
  guideBtn.textContent = showCharSchemaGuide ? '▲ Hide Schema' : 'ℹ️ Schema Reference';
  guideBtn.onclick = () => {
    showCharSchemaGuide = !showCharSchemaGuide;
    onRefresh();
  };
  toolbar.appendChild(guideBtn);
  body.appendChild(toolbar);

  // Schema Guide Box
  if (showCharSchemaGuide) {
    const guideBox = document.createElement('div');
    guideBox.style.background = '#181818';
    guideBox.style.border = '1px solid #383838';
    guideBox.style.borderRadius = '5px';
    guideBox.style.padding = '8px 10px';
    guideBox.style.fontSize = '11px';
    guideBox.style.color = '#ccc';
    guideBox.innerHTML = `
      <div style="font-weight:700;color:#65d6e8;margin-bottom:4px;">👤 Character Extension Payload Schema:</div>
      <div>Stored under <code>character.extensions.lumi_recursion</code>:</div>
      <pre style="background:#111;padding:6px;border-radius:4px;margin:6px 0;font-size:10.5px;color:#a8d5e5;overflow-x:auto;">{
  "version": 1,
  "enabled": true,
  "cards": [
    {
      "id": "sceneFrameCard",
      "family": "Scene Frame",
      "name": "Scene Frame",
      "priority": 100,
      "selectionState": "priority",
      "description": "Hard boundary constraints, routes, and beat direction.",
      "promptText": "Maintain active scene awareness for Scene Frame.",
      "subItems": ["locationSituation: ...", "immediateDirection: ..."]
    }
  ]
}</pre>
    `;
    body.appendChild(guideBox);
  }

  // Cards List Header
  const cards = characterStatus.cards || [];
  const listHeader = document.createElement('div');
  listHeader.style.display = 'flex';
  listHeader.style.justifyContent = 'space-between';
  listHeader.style.alignItems = 'center';
  listHeader.style.marginTop = '6px';
  listHeader.style.paddingBottom = '4px';
  listHeader.style.borderBottom = '1px solid #333';
  listHeader.innerHTML = `
    <span style="font-weight:600;font-size:12px;color:#e0e0e0;">Character Payload Cards (${cards.length})</span>
  `;

  const addCardBtn = document.createElement('button');
  addCardBtn.className = 'lr-btn lr-btn-primary';
  addCardBtn.style.padding = '2px 8px';
  addCardBtn.style.fontSize = '11px';
  addCardBtn.textContent = isAddingCharCard ? 'Cancel Add' : '+ Add Custom Card';
  addCardBtn.onclick = () => {
    isAddingCharCard = !isAddingCharCard;
    onRefresh();
  };
  listHeader.appendChild(addCardBtn);
  body.appendChild(listHeader);

  // New Character Card Form
  if (isAddingCharCard) {
    const addForm = renderCardEditorForm({
      initial: {
        name: 'New Scene Card',
        family: 'Custom Card',
        role: 'customCard',
        priority: 80,
        selectionState: 'active',
        description: 'Reasoning directive...',
        subItems: []
      },
      onSave: (cardData) => {
        hostCtx?.sendToBackend({
          type: 'SAVE_CHARACTER_CARD',
          characterId: characterStatus.id,
          card: {
            id: cardData.role || `card_${Date.now()}`,
            name: cardData.name || cardData.family,
            family: cardData.family,
            role: cardData.role || `card_${Date.now()}`,
            priority: cardData.priority,
            selectionState: cardData.selectionState,
            description: cardData.description,
            promptText: cardData.description,
            subItems: cardData.subItems
          }
        });
        isAddingCharCard = false;
      },
      onCancel: () => {
        isAddingCharCard = false;
        onRefresh();
      }
    });
    body.appendChild(addForm);
  }

  // Cards List
  if (cards.length > 0) {
    const listDiv = document.createElement('div');
    listDiv.style.display = 'flex';
    listDiv.style.flexDirection = 'column';
    listDiv.style.gap = '6px';

    for (const card of cards) {
      const isEditing = editingCharCards.has(card.id);

      const cardRow = document.createElement('div');
      cardRow.className = 'recast-pass-item';

      const headerRow = document.createElement('div');
      headerRow.className = 'recast-pass-header';

      const titlePart = document.createElement('div');
      titlePart.className = 'recast-pass-title-row';
      titlePart.innerHTML = `
        <span style="font-size:12px;font-weight:600;color:#e0e0e0;">${card.name || card.family}</span>
        <span style="font-size:10px;color:#888;background:#282828;padding:1px 5px;border-radius:3px;">p:${card.priority}</span>
      `;
      headerRow.appendChild(titlePart);

      const actionPart = document.createElement('div');
      actionPart.className = 'recast-pass-controls';

      // State Pill Toggle
      const pill = document.createElement('div');
      pill.className = `lr-card-pill state-${card.selectionState}`;
      pill.textContent = card.selectionState.toUpperCase();
      pill.title = 'Click to cycle: Off → Active → Priority';
      pill.onclick = () => {
        const next = cycleState(card.selectionState);
        card.selectionState = next;
        pill.className = `lr-card-pill state-${next}`;
        pill.textContent = next.toUpperCase();
        hostCtx?.sendToBackend({
          type: 'UPDATE_CHARACTER_CARD_STATE',
          cardId: card.id,
          state: next
        });
      };
      actionPart.appendChild(pill);

      // Edit Button
      const editBtn = document.createElement('button');
      editBtn.className = 'recast-btn-icon';
      editBtn.textContent = isEditing ? 'Close' : 'Edit';
      editBtn.onclick = () => {
        if (editingCharCards.has(card.id)) editingCharCards.delete(card.id);
        else editingCharCards.add(card.id);
        onRefresh();
      };
      actionPart.appendChild(editBtn);

      // Delete Button
      const delBtn = document.createElement('button');
      delBtn.className = 'recast-btn-icon';
      delBtn.style.color = '#ff8a8a';
      delBtn.innerHTML = TRASH_ICON_SVG;
      delBtn.title = 'Delete card from character payload';
      delBtn.onclick = () => {
        if (confirm(`Remove card "${card.name || card.family}" from character payload?`)) {
          hostCtx?.sendToBackend({
            type: 'DELETE_CHARACTER_CARD',
            characterId: characterStatus.id,
            cardId: card.id
          });
          editingCharCards.delete(card.id);
        }
      };
      actionPart.appendChild(delBtn);

      headerRow.appendChild(actionPart);
      cardRow.appendChild(headerRow);

      // Description summary
      if (!isEditing && (card.description || card.promptText)) {
        const descDiv = document.createElement('div');
        descDiv.style.fontSize = '11px';
        descDiv.style.color = '#888';
        descDiv.style.lineHeight = '1.3';
        descDiv.style.marginTop = '2px';
        const txt = card.description || card.promptText || '';
        descDiv.textContent = txt.slice(0, 120) + (txt.length > 120 ? '…' : '');
        cardRow.appendChild(descDiv);
      }

      // Inline Editor Form
      if (isEditing) {
        const editForm = renderCardEditorForm({
          initial: {
            id: card.id,
            name: card.name,
            family: card.family,
            role: card.role,
            priority: card.priority,
            selectionState: card.selectionState,
            description: card.description || card.promptText,
            subItems: card.subItems
          },
          onSave: (updated) => {
            hostCtx?.sendToBackend({
              type: 'SAVE_CHARACTER_CARD',
              characterId: characterStatus.id,
              card: {
                id: card.id,
                name: updated.name || updated.family,
                family: updated.family,
                role: updated.role || card.id,
                priority: updated.priority,
                selectionState: updated.selectionState,
                description: updated.description,
                promptText: updated.description,
                subItems: updated.subItems
              }
            });
            editingCharCards.delete(card.id);
          },
          onCancel: () => {
            editingCharCards.delete(card.id);
            onRefresh();
          }
        });
        cardRow.appendChild(editForm);
      }

      listDiv.appendChild(cardRow);
    }
    body.appendChild(listDiv);
  } else {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.color = '#888';
    emptyMsg.style.fontStyle = 'italic';
    emptyMsg.style.padding = '8px 0';
    emptyMsg.textContent = 'No cards initialized in this character card yet. Click "Initialize / Reset Cards" above to populate all 11 canonical card families.';
    body.appendChild(emptyMsg);
  }

  panel.appendChild(body);
  container.appendChild(panel);
}

// ─── Shared Card Editor Form Component ────────────────────────────────────────

function renderCardEditorForm(options: {
  initial: {
    id?: string;
    name?: string;
    family: string;
    role?: string;
    priority?: number;
    selectionState?: CardSelectionState;
    description?: string;
    subItems?: string[];
    disabled?: boolean;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}): HTMLElement {
  const { initial, onSave, onCancel } = options;

  const form = document.createElement('div');
  form.className = 'recast-pass-details';
  form.style.background = '#1a1a1a';
  form.style.padding = '10px';
  form.style.borderRadius = '5px';
  form.style.border = '1px solid #3c3c3c';
  form.style.marginTop = '6px';

  // Row 1: Family / Name & Role
  const row1 = document.createElement('div');
  row1.className = 'recast-row-2col';

  const nameCol = document.createElement('div');
  nameCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Card / Family Name:</label>`;
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'lr-select';
  nameInput.value = initial.name || initial.family || '';
  nameCol.appendChild(nameInput);
  row1.appendChild(nameCol);

  const roleCol = document.createElement('div');
  roleCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Role Identifier:</label>`;
  const roleInput = document.createElement('input');
  roleInput.type = 'text';
  roleInput.className = 'lr-select';
  roleInput.value = initial.role || initial.id || '';
  roleCol.appendChild(roleInput);
  row1.appendChild(roleCol);
  form.appendChild(row1);

  // Row 2: Priority & Selection State
  const row2 = document.createElement('div');
  row2.className = 'recast-row-2col';

  const prioCol = document.createElement('div');
  prioCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Priority (Higher = Earlier in Prompt):</label>`;
  const prioInput = document.createElement('input');
  prioInput.type = 'number';
  prioInput.className = 'lr-select';
  prioInput.value = String(initial.priority ?? 80);
  prioCol.appendChild(prioInput);
  row2.appendChild(prioCol);

  const stateCol = document.createElement('div');
  stateCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Default Selection State:</label>`;
  const stateSelect = document.createElement('select');
  stateSelect.className = 'lr-select';
  for (const s of ['active', 'priority', 'off']) {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s.toUpperCase();
    opt.selected = s === (initial.selectionState || 'active');
    stateSelect.appendChild(opt);
  }
  stateCol.appendChild(stateSelect);
  row2.appendChild(stateCol);
  form.appendChild(row2);

  // Description / Prompt Text
  const descCol = document.createElement('div');
  descCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Card Prompt / Description Directive:</label>`;
  const descTextarea = document.createElement('textarea');
  descTextarea.className = 'recast-textarea';
  descTextarea.rows = 3;
  descTextarea.value = initial.description || '';
  descCol.appendChild(descTextarea);
  form.appendChild(descCol);

  // Sub-items (one per line)
  const subCol = document.createElement('div');
  subCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:2px;">Sub-Items / Field Schemas (one per line):</label>`;
  const subTextarea = document.createElement('textarea');
  subTextarea.className = 'recast-textarea';
  subTextarea.rows = 2;
  subTextarea.placeholder = 'keyName: Description of the sub-dimension...';
  subTextarea.value = (initial.subItems || []).join('\n');
  subCol.appendChild(subTextarea);
  form.appendChild(subCol);

  // Buttons Row
  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.justifyContent = 'flex-end';
  btnRow.style.gap = '6px';
  btnRow.style.marginTop = '6px';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'lr-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = onCancel;
  btnRow.appendChild(cancelBtn);

  const saveBtn = document.createElement('button');
  saveBtn.className = 'lr-btn lr-btn-primary';
  saveBtn.textContent = '💾 Save Changes';
  saveBtn.onclick = () => {
    const subLines = subTextarea.value
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    onSave({
      id: initial.id,
      family: nameInput.value.trim() || initial.family,
      name: nameInput.value.trim() || initial.family,
      role: roleInput.value.trim() || initial.role,
      priority: parseInt(prioInput.value, 10) || 80,
      selectionState: stateSelect.value as CardSelectionState,
      description: descTextarea.value.trim(),
      subItems: subLines,
      disabled: initial.disabled
    });
  };
  btnRow.appendChild(saveBtn);
  form.appendChild(btnRow);

  return form;
}
