/**
 * Lumi:REcursion — Frontend
 * Technical Graphite Dark UI for Scene Reasoning in Lumiverse Spindle
 */

import type {
  RecursionSettings,
  DeckDefinition,
  TurnBrief,
  RunProgressState,
  CardSelectionState,
  BackendToFrontendMessage
} from './types';
import { DEFAULT_DECK_ID } from './cards/defaults';

// SVG Icons adhering to Recursion's technical graphite design
const RECURSION_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12"/><path d="M12 6a6 6 0 0 1 6 6c0 3.314-2.686 6-6 6s-6-2.686-6-6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`;

const DUPLICATE_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const TRASH_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

const COPY_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const REFRESH_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;

// ─── Stylesheet ──────────────────────────────────────────────────────────────

const STYLES = `
/* Lumi:REcursion Technical Graphite Dark Theme */
.lr-root {
  background: #1c1c1c;
  color: #d8d8d8;
  font-family: var(--mainFontFamily, "Noto Sans", -apple-system, sans-serif);
  font-size: 12.5px;
  line-height: 1.4;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lr-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #242424;
  border: 1px solid #383838;
  border-radius: 6px;
  padding: 6px 10px;
  gap: 8px;
}

.lr-bar-left, .lr-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lr-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 4px;
  background: #2d2d2d;
  color: #a8a8a8;
  border: 1px solid #444;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.lr-badge:hover {
  background: #363636;
  color: #fff;
}

.lr-badge.active {
  background: rgba(101, 214, 232, 0.15);
  border-color: #65d6e8;
  color: #65d6e8;
}

.lr-badge.mode-manual {
  background: rgba(255, 212, 121, 0.15);
  border-color: #ffd479;
  color: #ffd479;
}

/* Switch Toggle */
.lr-toggle {
  position: relative;
  width: 38px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
  margin: 0;
}

.lr-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.lr-toggle-slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #383838;
  border-radius: 20px;
  transition: .2s;
  border: 1px solid #484848;
}

.lr-toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #888;
  border-radius: 50%;
  transition: .2s;
}

.lr-toggle input:checked + .lr-toggle-slider {
  background-color: rgba(101, 214, 232, 0.25);
  border-color: #65d6e8;
}

.lr-toggle input:checked + .lr-toggle-slider:before {
  transform: translateX(18px);
  background-color: #65d6e8;
}

/* Hero Pixel Array */
.lr-hero-panel {
  background: #222;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lr-hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #a8a8a8;
}

.lr-hero-pixels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 14px;
  align-items: center;
}

.lr-pixel {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #333;
  border: 1px solid #444;
  transition: all 0.2s ease;
  position: relative;
}

.lr-pixel.state-running {
  background: #65d6e8;
  border-color: #65d6e8;
  box-shadow: 0 0 6px rgba(101, 214, 232, 0.6);
  animation: lr-pulse 1s infinite alternate;
}

.lr-pixel.state-success {
  background: #7fcf8a;
  border-color: #7fcf8a;
}

.lr-pixel.state-cached {
  background: #a78bfa;
  border-color: #a78bfa;
}

.lr-pixel.state-warning {
  background: #ffd479;
  border-color: #ffd479;
}

.lr-pixel.state-error {
  background: #ff8a8a;
  border-color: #ff8a8a;
}

@keyframes lr-pulse {
  0% { opacity: 0.4; }
  100% { opacity: 1; }
}

.lr-step-text {
  font-size: 11px;
  color: #bbb;
  font-style: italic;
}

/* Panels and sections */
.lr-panel {
  background: #242424;
  border: 1px solid #383838;
  border-radius: 6px;
  overflow: hidden;
}

.lr-panel-header {
  padding: 8px 12px;
  background: #282828;
  border-bottom: 1px solid #333;
  font-size: 12px;
  font-weight: 600;
  color: #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.lr-panel-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Deck Controls */
.lr-deck-bar {
  display: flex;
  gap: 8px;
  align-items: center;
}

.lr-select {
  flex: 1;
  background: #1c1c1c;
  border: 1px solid #444;
  color: #eee;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 12px;
  outline: none;
  cursor: pointer;
}

.lr-btn {
  background: #2e2e2e;
  border: 1px solid #444;
  color: #ddd;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s;
}

.lr-btn:hover {
  background: #3a3a3a;
  color: #fff;
  border-color: #555;
}

.lr-btn-primary {
  background: rgba(101, 214, 232, 0.2);
  border-color: #65d6e8;
  color: #65d6e8;
}

.lr-btn-primary:hover {
  background: rgba(101, 214, 232, 0.35);
  color: #fff;
}

/* Category Accordion */
.lr-category {
  border: 1px solid #333;
  border-radius: 5px;
  overflow: hidden;
  background: #1f1f1f;
}

.lr-category-header {
  padding: 7px 10px;
  background: #262626;
  font-size: 11.5px;
  font-weight: 600;
  color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.lr-category-header:hover {
  background: #2b2b2b;
  color: #fff;
}

.lr-category-cards {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid #303030;
}

.lr-card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 8px;
  background: #242424;
  border: 1px solid #353535;
  border-radius: 4px;
  gap: 8px;
}

.lr-card-info {
  flex: 1;
}

.lr-card-name {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
}

.lr-card-desc {
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 2px;
  line-height: 1.3;
}

.lr-card-pill {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  white-space: nowrap;
}

.lr-card-pill.state-off {
  background: #2a2a2a;
  color: #666;
  border-color: #383838;
}

.lr-card-pill.state-active {
  background: rgba(101, 214, 232, 0.15);
  color: #65d6e8;
  border-color: rgba(101, 214, 232, 0.4);
}

.lr-card-pill.state-priority {
  background: rgba(255, 212, 121, 0.2);
  color: #ffd479;
  border-color: #ffd479;
}

/* Last Brief */
.lr-brief-meta {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #999;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}

.lr-brief-card {
  padding: 8px 10px;
  background: #1f1f1f;
  border-left: 3px solid #65d6e8;
  border-radius: 0 4px 4px 0;
  font-size: 11.5px;
  margin-bottom: 6px;
}

.lr-brief-card-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #65d6e8;
  margin-bottom: 4px;
}

.lr-brief-card-text {
  color: #d0d0d0;
  line-height: 1.4;
}

.lr-packet-preview {
  background: #151515;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px;
  font-family: Consolas, monospace;
  font-size: 11px;
  color: #aaa;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
}

/* Modal Host */
#recursion-modal-host {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 999999;
  pointer-events: none;
}

#recursion-modal-host.active {
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

// ─── Module State ────────────────────────────────────────────────────────────

let hostCtx: any = null;
let currentSettings: RecursionSettings | null = null;
let currentDecks: Record<string, DeckDefinition> = {};
let currentActiveDeckId = DEFAULT_DECK_ID;
let lastBrief: TurnBrief | null = null;
let currentProgress: RunProgressState = {
  runId: '',
  active: false,
  pipeline: 'segmented',
  phase: 'idle',
  pixels: []
};
let availableConnections: Array<{ id: string; name: string; is_default?: boolean }> = [];

const panelRoots = new Set<HTMLElement>();
let inputBarActionHandle: any = null;

// Track open/closed state of accordion categories
const openCategories = new Set<string>();

// ─── DOM Helpers ─────────────────────────────────────────────────────────────

function ensureModalHost(): HTMLElement {
  let host = document.getElementById('recursion-modal-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'recursion-modal-host';
    document.body.appendChild(host);
  }
  return host;
}

function updateInputBarLabel() {
  if (inputBarActionHandle && typeof inputBarActionHandle.setLabel === 'function') {
    const isEnabled = currentSettings?.enabled ?? false;
    inputBarActionHandle.setLabel(isEnabled ? '🧠 RE: ON' : '🧠 RE: OFF');
  }
}

function cycleCardState(cardId: string, currentState: CardSelectionState, mode: 'auto' | 'manual'): CardSelectionState {
  if (mode === 'manual') {
    return currentState === 'off' ? 'active' : 'off';
  }
  if (currentState === 'off') return 'active';
  if (currentState === 'active') return 'priority';
  return 'off';
}

// ─── Render Pipeline ─────────────────────────────────────────────────────────

function renderAllPanels() {
  for (const root of panelRoots) {
    renderMainPanel(root);
  }
}

function renderMainPanel(root: HTMLElement) {
  if (!currentSettings) {
    root.innerHTML = `<div class="lr-root"><div style="color:#888;text-align:center;padding:20px;">Connecting to Lumi:REcursion engine...</div></div>`;
    return;
  }

  const activeDeck = currentDecks[currentActiveDeckId] || currentDecks[DEFAULT_DECK_ID];

  // 1. Root container
  root.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'lr-root';

  // 2. Bar (Power toggle, Mode badge, Pipeline badge, Run button)
  const bar = document.createElement('div');
  bar.className = 'lr-bar';

  const barLeft = document.createElement('div');
  barLeft.className = 'lr-bar-left';

  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'lr-toggle';
  toggleLabel.title = 'Toggle Lumi:REcursion scene reasoning';
  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.checked = currentSettings.enabled;
  toggleInput.onchange = () => {
    const next = toggleInput.checked;
    currentSettings!.enabled = next;
    updateInputBarLabel();
    hostCtx?.sendToBackend({ type: 'UPDATE_SETTINGS', settings: { enabled: next } });
    renderAllPanels();
  };
  const toggleSlider = document.createElement('span');
  toggleSlider.className = 'lr-toggle-slider';
  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(toggleSlider);
  barLeft.appendChild(toggleLabel);

  const titleSpan = document.createElement('span');
  titleSpan.style.fontWeight = '700';
  titleSpan.style.fontSize = '12px';
  titleSpan.style.color = currentSettings.enabled ? '#65d6e8' : '#777';
  titleSpan.textContent = 'Lumi:REcursion';
  barLeft.appendChild(titleSpan);

  const barRight = document.createElement('div');
  barRight.className = 'lr-bar-right';

  // Mode badge
  const modeBadge = document.createElement('span');
  modeBadge.className = `lr-badge ${currentSettings.mode === 'manual' ? 'mode-manual' : 'active'}`;
  modeBadge.textContent = currentSettings.mode.toUpperCase();
  modeBadge.title = 'Click to toggle Auto / Manual mode';
  modeBadge.onclick = () => {
    const nextMode = currentSettings!.mode === 'auto' ? 'manual' : 'auto';
    currentSettings!.mode = nextMode;
    hostCtx?.sendToBackend({ type: 'UPDATE_SETTINGS', settings: { mode: nextMode } });
    renderAllPanels();
  };
  barRight.appendChild(modeBadge);

  // Pipeline badge
  const pipelineBadge = document.createElement('span');
  pipelineBadge.className = `lr-badge ${currentSettings.pipeline === 'segmented' ? 'active' : ''}`;
  pipelineBadge.textContent = currentSettings.pipeline === 'segmented' ? 'PARALLEL' : 'FUSED';
  pipelineBadge.title = 'Click to switch Pipeline (Segmented Parallel vs Fused)';
  pipelineBadge.onclick = () => {
    const nextPipe = currentSettings!.pipeline === 'segmented' ? 'fused' : 'segmented';
    currentSettings!.pipeline = nextPipe;
    hostCtx?.sendToBackend({ type: 'UPDATE_SETTINGS', settings: { pipeline: nextPipe } });
    renderAllPanels();
  };
  barRight.appendChild(pipelineBadge);

  // Manual Run Now button if in manual mode
  if (currentSettings.mode === 'manual') {
    const runBtn = document.createElement('button');
    runBtn.className = 'lr-btn lr-btn-primary';
    runBtn.style.padding = '2px 6px';
    runBtn.style.fontSize = '11px';
    runBtn.textContent = '🎯 Arm';
    runBtn.title = 'Arm scene reasoning for the next turn';
    runBtn.onclick = () => {
      hostCtx?.sendToBackend({ type: 'MANUAL_RUN_NOW' });
    };
    barRight.appendChild(runBtn);
  }

  bar.appendChild(barLeft);
  bar.appendChild(barRight);
  container.appendChild(bar);

  // 3. Hero Pixel Array & Progress Status
  const heroPanel = document.createElement('div');
  heroPanel.className = 'lr-hero-panel';

  const heroHeader = document.createElement('div');
  heroHeader.className = 'lr-hero-header';
  heroHeader.innerHTML = `
    <span><strong>Turn Reasoner</strong></span>
    <span>${currentProgress.phase.toUpperCase()}</span>
  `;
  heroPanel.appendChild(heroHeader);

  const heroPixels = document.createElement('div');
  heroPixels.className = 'lr-hero-pixels';

  if (currentProgress.pixels && currentProgress.pixels.length > 0) {
    for (const p of currentProgress.pixels) {
      const pix = document.createElement('div');
      pix.className = `lr-pixel state-${p.state}`;
      pix.title = `${p.name} (${p.state})${p.latencyMs ? ` — ${p.latencyMs}ms` : ''}`;
      heroPixels.appendChild(pix);
    }
  } else {
    // Render quiet standby blocks
    for (let i = 0; i < 6; i++) {
      const pix = document.createElement('div');
      pix.className = 'lr-pixel';
      heroPixels.appendChild(pix);
    }
  }
  heroPanel.appendChild(heroPixels);

  if (currentProgress.currentStepText) {
    const stepText = document.createElement('div');
    stepText.className = 'lr-step-text';
    stepText.textContent = currentProgress.currentStepText;
    heroPanel.appendChild(stepText);
  }
  container.appendChild(heroPanel);

  // 4. Last Brief Accordion
  if (lastBrief) {
    const briefPanel = document.createElement('div');
    briefPanel.className = 'lr-panel';

    const briefHeader = document.createElement('div');
    briefHeader.className = 'lr-panel-header';
    briefHeader.innerHTML = `
      <span>📋 Last Brief (${lastBrief.cards.length} cards, ${lastBrief.totalLatencyMs}ms)</span>
      <div style="display:flex;gap:6px;">
        <button class="lr-btn" id="lr-copy-packet-btn" style="padding:2px 6px;font-size:10px;">${COPY_ICON_SVG} Packet</button>
      </div>
    `;

    const copyBtn = briefHeader.querySelector('#lr-copy-packet-btn') as HTMLElement;
    if (copyBtn) {
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(lastBrief!.injectedPacket);
        hostCtx?.toast?.success?.('📋 Injected packet copied to clipboard!');
      };
    }

    const briefBody = document.createElement('div');
    briefBody.className = 'lr-panel-body';

    const briefMeta = document.createElement('div');
    briefMeta.className = 'lr-brief-meta';
    briefMeta.innerHTML = `
      <span>Pipeline: <strong>${lastBrief.pipeline.toUpperCase()}</strong></span>
      <span>Footprint: <strong>${lastBrief.promptFootprint}</strong></span>
      <span>Tokens: ~<strong>${lastBrief.estimatedTokens}</strong></span>
    `;
    briefBody.appendChild(briefMeta);

    // Cards list
    for (const c of lastBrief.cards) {
      const cDiv = document.createElement('div');
      cDiv.className = 'lr-brief-card';
      cDiv.innerHTML = `
        <div class="lr-brief-card-header">
          <span>${c.family} · ${c.name}</span>
          <span style="color:#aaa;font-size:10px;">${c.latencyMs}ms</span>
        </div>
        <div class="lr-brief-card-text">${c.promptText}</div>
        ${c.evidenceRefs && c.evidenceRefs.length ? `<div style="font-size:10px;color:#65d6e8;margin-top:2px;">Evidence: ${c.evidenceRefs.join(', ')}</div>` : ''}
      `;
      briefBody.appendChild(cDiv);
    }

    briefPanel.appendChild(briefHeader);
    briefPanel.appendChild(briefBody);
    container.appendChild(briefPanel);
  }

  // 5. Pre-Process Decks & Category Accordion
  const deckPanel = document.createElement('div');
  deckPanel.className = 'lr-panel';

  const deckHeader = document.createElement('div');
  deckHeader.className = 'lr-panel-header';
  deckHeader.innerHTML = `<span>🃏 Pre-Process Card Decks</span>`;
  deckPanel.appendChild(deckHeader);

  const deckBody = document.createElement('div');
  deckBody.className = 'lr-panel-body';

  // Deck selector bar
  const deckBar = document.createElement('div');
  deckBar.className = 'lr-deck-bar';

  const deckSelect = document.createElement('select');
  deckSelect.className = 'lr-select';
  for (const [id, d] of Object.entries(currentDecks)) {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${d.name}${d.bundled ? ' (Bundled)' : ''}`;
    opt.selected = id === currentActiveDeckId;
    deckSelect.appendChild(opt);
  }
  deckSelect.onchange = () => {
    hostCtx?.sendToBackend({ type: 'SWITCH_DECK', deckId: deckSelect.value });
  };
  deckBar.appendChild(deckSelect);

  // Duplicate Deck button
  const dupBtn = document.createElement('button');
  dupBtn.className = 'lr-btn';
  dupBtn.innerHTML = `${DUPLICATE_ICON_SVG} Copy`;
  dupBtn.title = 'Duplicate current deck to make an editable copy';
  dupBtn.onclick = () => {
    const cur = currentDecks[currentActiveDeckId];
    const newName = prompt('Enter name for the duplicated deck:', `${cur?.name || 'Deck'} (Copy)`);
    if (newName) {
      hostCtx?.sendToBackend({
        type: 'DUPLICATE_DECK',
        sourceDeckId: currentActiveDeckId,
        newName
      });
    }
  };
  deckBar.appendChild(dupBtn);

  // Delete Deck button if custom
  if (activeDeck && !activeDeck.bundled) {
    const delBtn = document.createElement('button');
    delBtn.className = 'lr-btn';
    delBtn.style.color = '#ff8a8a';
    delBtn.innerHTML = `${TRASH_ICON_SVG}`;
    delBtn.title = 'Delete custom deck';
    delBtn.onclick = () => {
      const confirmText = prompt(`Type "delete" to confirm deleting deck "${activeDeck.name}":`);
      if (confirmText && confirmText.toLowerCase() === 'delete') {
        hostCtx?.sendToBackend({ type: 'DELETE_DECK', deckId: activeDeck.id });
      }
    };
    deckBar.appendChild(delBtn);
  }

  deckBody.appendChild(deckBar);

  // Render Categories & Cards
  if (activeDeck) {
    for (const catId of activeDeck.categoryOrder || []) {
      const cat = activeDeck.categories[catId];
      if (!cat) continue;

      const cardIds = activeDeck.cardOrderByCategory[catId] || [];
      const isOpen = openCategories.has(catId);

      const catDiv = document.createElement('div');
      catDiv.className = 'lr-category';

      const catHeader = document.createElement('div');
      catHeader.className = 'lr-category-header';

      const activeCount = cardIds.filter((cid) => {
        const c = activeDeck.cards[cid];
        return c && (c.selectionState === 'active' || c.selectionState === 'priority');
      }).length;

      catHeader.innerHTML = `
        <span>${isOpen ? '▼' : '▶'} ${cat.name} <span style="font-weight:400;color:#888;font-size:11px;">(${activeCount}/${cardIds.length})</span></span>
        <div style="display:flex;gap:4px;" onclick="event.stopPropagation()">
          <button class="lr-btn" style="padding:1px 5px;font-size:10px;" id="cat-all-active-${catId}">All</button>
          <button class="lr-btn" style="padding:1px 5px;font-size:10px;" id="cat-all-off-${catId}">Off</button>
        </div>
      `;

      catHeader.onclick = () => {
        if (openCategories.has(catId)) openCategories.delete(catId);
        else openCategories.add(catId);
        renderAllPanels();
      };

      const allActiveBtn = catHeader.querySelector(`#cat-all-active-${catId}`) as HTMLElement;
      if (allActiveBtn) {
        allActiveBtn.onclick = () => {
          hostCtx?.sendToBackend({
            type: 'BULK_SET_CARDS',
            deckId: activeDeck.id,
            categoryId: catId,
            state: 'active'
          });
        };
      }

      const allOffBtn = catHeader.querySelector(`#cat-all-off-${catId}`) as HTMLElement;
      if (allOffBtn) {
        allOffBtn.onclick = () => {
          hostCtx?.sendToBackend({
            type: 'BULK_SET_CARDS',
            deckId: activeDeck.id,
            categoryId: catId,
            state: 'off'
          });
        };
      }

      catDiv.appendChild(catHeader);

      if (isOpen) {
        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'lr-category-cards';

        for (const cid of cardIds) {
          const card = activeDeck.cards[cid];
          if (!card) continue;

          const row = document.createElement('div');
          row.className = 'lr-card-row';

          const info = document.createElement('div');
          info.className = 'lr-card-info';
          info.innerHTML = `
            <div class="lr-card-name">${card.name}</div>
            <div class="lr-card-desc">${card.description}</div>
          `;
          row.appendChild(info);

          const pill = document.createElement('div');
          pill.className = `lr-card-pill state-${card.selectionState}`;
          pill.textContent = card.selectionState.toUpperCase();
          pill.title = 'Click to cycle state: Off -> Active -> Priority';
          pill.onclick = () => {
            const next = cycleCardState(card.id, card.selectionState, currentSettings!.mode);
            card.selectionState = next;
            pill.className = `lr-card-pill state-${next}`;
            pill.textContent = next.toUpperCase();
            hostCtx?.sendToBackend({
              type: 'SET_CARD_STATE',
              deckId: activeDeck.id,
              cardId: card.id,
              state: next
            });
          };
          row.appendChild(pill);

          cardsDiv.appendChild(row);
        }
        catDiv.appendChild(cardsDiv);
      }

      deckBody.appendChild(catDiv);
    }
  }

  deckPanel.appendChild(deckBody);
  container.appendChild(deckPanel);

  // 6. Settings Quick Link / Advanced Disclosure
  const settingsPanel = document.createElement('div');
  settingsPanel.className = 'lr-panel';

  const settingsHeader = document.createElement('div');
  settingsHeader.className = 'lr-panel-header';
  settingsHeader.innerHTML = `<span>⚙️ Behavior & Model Lane</span>`;
  settingsPanel.appendChild(settingsHeader);

  const settingsBody = document.createElement('div');
  settingsBody.className = 'lr-panel-body';

  // Connection selector
  const connRow = document.createElement('div');
  connRow.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Generation Connection Profile:</label>`;
  const connSelect = document.createElement('select');
  connSelect.className = 'lr-select';
  const defOpt = document.createElement('option');
  defOpt.value = '';
  defOpt.textContent = 'Active / Default Connection Profile';
  connSelect.appendChild(defOpt);

  for (const c of availableConnections) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name}${c.is_default ? ' (Default)' : ''}`;
    opt.selected = c.id === currentSettings.connectionProfileId;
    connSelect.appendChild(opt);
  }
  connSelect.onchange = () => {
    currentSettings!.connectionProfileId = connSelect.value;
    hostCtx?.sendToBackend({ type: 'UPDATE_SETTINGS', settings: { connectionProfileId: connSelect.value } });
  };
  connRow.appendChild(connSelect);
  settingsBody.appendChild(connRow);

  // Footprint and Story Form
  const gridRow = document.createElement('div');
  gridRow.style.display = 'grid';
  gridRow.style.gridTemplateColumns = '1fr 1fr';
  gridRow.style.gap = '8px';

  // Footprint
  const footCol = document.createElement('div');
  footCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Prompt Footprint:</label>`;
  const footSelect = document.createElement('select');
  footSelect.className = 'lr-select';
  for (const f of ['compact', 'normal', 'rich']) {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f.toUpperCase();
    opt.selected = f === currentSettings.promptFootprint;
    footSelect.appendChild(opt);
  }
  footSelect.onchange = () => {
    currentSettings!.promptFootprint = footSelect.value as any;
    hostCtx?.sendToBackend({ type: 'UPDATE_SETTINGS', settings: { promptFootprint: footSelect.value as any } });
  };
  footCol.appendChild(footSelect);
  gridRow.appendChild(footCol);

  // Story Form Tense
  const tenseCol = document.createElement('div');
  tenseCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Story Tense:</label>`;
  const tenseSelect = document.createElement('select');
  tenseSelect.className = 'lr-select';
  for (const t of ['auto', 'past', 'present']) {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t.toUpperCase();
    opt.selected = t === currentSettings.storyForm.tense;
    tenseSelect.appendChild(opt);
  }
  tenseSelect.onchange = () => {
    currentSettings!.storyForm.tense = tenseSelect.value as any;
    hostCtx?.sendToBackend({ type: 'UPDATE_SETTINGS', settings: { storyForm: currentSettings!.storyForm } });
  };
  tenseCol.appendChild(tenseSelect);
  gridRow.appendChild(tenseCol);

  settingsBody.appendChild(gridRow);

  // Clear cache button
  const clearCacheBtn = document.createElement('button');
  clearCacheBtn.className = 'lr-btn';
  clearCacheBtn.innerHTML = `${REFRESH_ICON_SVG} Clear Cache`;
  clearCacheBtn.onclick = () => {
    hostCtx?.sendToBackend({ type: 'CLEAR_CACHE' });
  };
  settingsBody.appendChild(clearCacheBtn);

  settingsPanel.appendChild(settingsBody);
  container.appendChild(settingsPanel);

  root.appendChild(container);
}

// ─── Entrypoint ──────────────────────────────────────────────────────────────

export async function setup(ctx: any): Promise<() => void> {
  hostCtx = ctx;

  // 1. Inject global extension styles
  const removeStyle = ctx.dom.addStyle(STYLES);

  // 2. Ensure modal overlay host
  ensureModalHost();

  // 3. Register Drawer Tab
  const drawerHandle = ctx.ui.registerDrawerTab({
    id: 'lumi-recursion',
    title: 'Lumi:REcursion',
    shortName: 'Recursion',
    description: 'Scene reasoning and turn-bound card system with parallel card evaluation',
    keywords: ['recursion', 'reasoning', 'scene', 'cards', 'context', 'continuity', 'subtext'],
    iconSvg: RECURSION_ICON_SVG
  });

  if (drawerHandle?.root) {
    panelRoots.add(drawerHandle.root);
    renderMainPanel(drawerHandle.root);
  }

  let unsubDrawerActivate: (() => void) | undefined;
  if (typeof drawerHandle?.onActivate === 'function') {
    unsubDrawerActivate = drawerHandle.onActivate(() => {
      if (drawerHandle.root) {
        panelRoots.add(drawerHandle.root);
      }
      renderAllPanels();
    });
  }

  // 4. Register Settings Tab
  let settingsHandle: any = null;
  let unsubSettingsActivate: (() => void) | undefined;
  if (typeof ctx.ui?.registerSettingsTab === 'function') {
    settingsHandle = ctx.ui.registerSettingsTab({
      id: 'lumi-recursion-settings',
      title: 'Lumi:REcursion',
      description: 'Configure scene reasoning pipeline and model lanes',
      iconSvg: RECURSION_ICON_SVG
    });

    if (settingsHandle?.root) {
      panelRoots.add(settingsHandle.root);
      renderMainPanel(settingsHandle.root);
    }

    if (typeof settingsHandle?.onActivate === 'function') {
      unsubSettingsActivate = settingsHandle.onActivate(() => {
        if (settingsHandle.root) {
          panelRoots.add(settingsHandle.root);
        }
        renderAllPanels();
      });
    }
  }

  // 5. Register Chat Input Bar Action Toggle
  if (typeof ctx.ui?.registerInputBarAction === 'function') {
    inputBarActionHandle = ctx.ui.registerInputBarAction({
      id: 'lumi-recursion-input-toggle',
      label: '🧠 RE: ON',
      iconSvg: RECURSION_ICON_SVG,
      onClick: () => {
        if (currentSettings) {
          const next = !currentSettings.enabled;
          currentSettings.enabled = next;
          updateInputBarLabel();
          ctx.sendToBackend({ type: 'UPDATE_SETTINGS', settings: { enabled: next } });
          ctx.toast?.info?.(next ? '🧠 Lumi:REcursion scene reasoning enabled' : '🧠 Lumi:REcursion disabled');
          renderAllPanels();
        }
      }
    });
  }

  // 6. Listen for backend messages
  const unsubBackend = ctx.onBackendMessage((msg: BackendToFrontendMessage) => {
    switch (msg.type) {
      case 'STATE': {
        currentSettings = msg.settings;
        currentDecks = msg.decks;
        currentActiveDeckId = msg.activeDeckId;
        lastBrief = msg.lastBrief;
        currentProgress = msg.progress;
        availableConnections = msg.connections || [];
        updateInputBarLabel();
        renderAllPanels();
        break;
      }

      case 'SETTINGS_UPDATED': {
        currentSettings = msg.settings;
        updateInputBarLabel();
        renderAllPanels();
        break;
      }

      case 'DECKS_UPDATED': {
        currentDecks = msg.decks;
        currentActiveDeckId = msg.activeDeckId;
        renderAllPanels();
        break;
      }

      case 'BRIEF_UPDATED': {
        lastBrief = msg.brief;
        renderAllPanels();
        break;
      }

      case 'PROGRESS': {
        currentProgress = msg.progress;
        renderAllPanels();
        break;
      }

      case 'CONNECTIONS': {
        availableConnections = msg.connections || [];
        renderAllPanels();
        break;
      }
    }
  });

  // Request initial state from backend
  ctx.sendToBackend({ type: 'GET_STATE' });

  // Cleanup handler
  return () => {
    removeStyle?.();
    unsubDrawerActivate?.();
    unsubSettingsActivate?.();
    unsubBackend?.();
    panelRoots.clear();
  };
}

export default setup;
