/**
 * Lumi:REcursion — Recast Settings & Preset Management Panel
 * Renders the full Recast post-processing pipeline UI in Lumiverse Spindle
 * Features live streaming progress, TTFT timeouts, model selection & thinking controls.
 */

import type { RecastSettings, RecastProgress, RecastPass, RecastPreset, RecastReasoningEffort } from './types';
import { showModelPickerModal } from './model-picker-modal';

// In-memory cache for models fetched per connection
const connectionModelsCache = new Map<string, { models: string[]; labels: Record<string, string> }>();

async function fetchConnectionModels(
  connectionId: string
): Promise<{ models: string[]; labels: Record<string, string> }> {
  if (connectionModelsCache.has(connectionId)) {
    return connectionModelsCache.get(connectionId)!;
  }

  const res = await fetch(`/api/v1/connections/${encodeURIComponent(connectionId)}/models`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }

  const models: string[] = Array.isArray(data.models) ? data.models : [];
  const labels: Record<string, string> = (data.model_labels && typeof data.model_labels === 'object') ? data.model_labels : {};

  const result = { models, labels };
  connectionModelsCache.set(connectionId, result);
  return result;
}

export function createModelOverrideInputGroup(opts: {
  value: string;
  placeholder: string;
  datalistId: string;
  getConnectionId: () => string;
  getConnectionName: () => string;
  onSave: (val: string) => void;
  hostCtx: any;
}): HTMLElement {
  const container = document.createElement('div');
  container.className = 'recast-model-input-group';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'lr-select';
  input.style.flex = '1';
  input.placeholder = opts.placeholder;
  input.value = opts.value || '';
  input.setAttribute('list', opts.datalistId);

  // Setup datalist for native autocomplete
  let datalist = document.getElementById(opts.datalistId) as HTMLDataListElement;
  if (!datalist) {
    datalist = document.createElement('datalist');
    datalist.id = opts.datalistId;
    document.body.appendChild(datalist);
  }

  const populateDatalist = (models: string[], labels: Record<string, string>) => {
    datalist.innerHTML = '';
    models.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m;
      if (labels[m]) {
        opt.label = labels[m];
      }
      datalist.appendChild(opt);
    });
  };

  const initialConnId = opts.getConnectionId();
  if (initialConnId && connectionModelsCache.has(initialConnId)) {
    const cached = connectionModelsCache.get(initialConnId)!;
    populateDatalist(cached.models, cached.labels);
  }

  input.onchange = () => {
    opts.onSave(input.value.trim());
  };

  const fetchBtn = document.createElement('button');
  fetchBtn.type = 'button';
  fetchBtn.className = 'recast-btn-fetch';
  fetchBtn.innerHTML = `<span>🔍 Fetch Models</span>`;
  fetchBtn.title = 'Fetch available models from the provider connection link and browse/search';

  fetchBtn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const connId = opts.getConnectionId();
    if (!connId) {
      opts.hostCtx?.toast?.error?.('Please select or configure a Connection Profile first.');
      return;
    }

    const connName = opts.getConnectionName() || 'Connection';

    const originalHtml = fetchBtn.innerHTML;
    fetchBtn.disabled = true;
    fetchBtn.innerHTML = `<span>⏳ Fetching...</span>`;

    try {
      const { models, labels } = await fetchConnectionModels(connId);
      populateDatalist(models, labels);

      showModelPickerModal({
        title: 'Select Model Override',
        connectionName: connName,
        models,
        labels,
        currentValue: input.value.trim(),
        onSelect: (selectedModelId) => {
          input.value = selectedModelId;
          opts.onSave(selectedModelId);
          opts.hostCtx?.toast?.info?.(selectedModelId ? `✨ Model override set to: ${selectedModelId}` : '✨ Model override cleared (inheriting connection default)');
        }
      });
    } catch (err: any) {
      console.error('[Lumi:REcursion:Recast] Failed to fetch models:', err);
      opts.hostCtx?.toast?.error?.(`Failed to fetch models from provider: ${err?.message || err}`);
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.innerHTML = originalHtml;
    }
  };

  container.appendChild(input);
  container.appendChild(fetchBtn);
  return container;
}

// Track which passes are expanded
const expandedPasses = new Set<string>();

export function renderRecastPanel(
  container: HTMLElement,
  state: {
    recastSettings: RecastSettings;
    recastProgress: RecastProgress | null;
    availableConnections: Array<{ id: string; name: string; provider?: string; model?: string; is_default?: boolean }>;
    hostCtx: any;
    onRefresh: () => void;
  }
) {
  const { recastSettings, recastProgress, availableConnections, hostCtx, onRefresh } = state;

  const activePreset =
    recastSettings.presets.find((p) => p.id === recastSettings.activePresetId) ||
    recastSettings.presets[0];

  // 1. Recast Bar (Toggle & Quick Run Action)
  const bar = document.createElement('div');
  bar.className = 'lr-bar';

  const barLeft = document.createElement('div');
  barLeft.className = 'lr-bar-left';

  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'lr-toggle';
  toggleLabel.title = 'Toggle Recast post-processing pipeline';
  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.checked = recastSettings.enabled;
  toggleInput.onchange = () => {
    const next = toggleInput.checked;
    recastSettings.enabled = next;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { enabled: next }
    });
    hostCtx?.toast?.info?.(next ? '✨ Recast post-processing enabled' : '✨ Recast disabled');
    onRefresh();
  };
  const toggleSlider = document.createElement('span');
  toggleSlider.className = 'lr-toggle-slider';
  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(toggleSlider);
  barLeft.appendChild(toggleLabel);

  const titleSpan = document.createElement('span');
  titleSpan.style.fontWeight = '700';
  titleSpan.style.fontSize = '12px';
  titleSpan.style.color = recastSettings.enabled ? '#a78bfa' : '#777';
  titleSpan.textContent = 'Recast Pipeline';
  barLeft.appendChild(titleSpan);

  const modeBadge = document.createElement('span');
  modeBadge.className = 'lr-badge';
  modeBadge.style.color = '#c4b5fd';
  modeBadge.style.borderColor = 'rgba(167, 139, 250, 0.4)';
  modeBadge.style.background = 'rgba(167, 139, 250, 0.15)';
  modeBadge.textContent = recastSettings.applyMode.toUpperCase();
  modeBadge.title = `Apply Mode: ${recastSettings.applyMode}`;
  barLeft.appendChild(modeBadge);

  bar.appendChild(barLeft);

  const barRight = document.createElement('div');
  barRight.className = 'lr-bar-right';

  const runNowBtn = document.createElement('button');
  runNowBtn.className = 'lr-btn lr-btn-primary';
  runNowBtn.style.background = 'rgba(167, 139, 250, 0.2)';
  runNowBtn.style.borderColor = '#a78bfa';
  runNowBtn.style.color = '#c4b5fd';
  runNowBtn.innerHTML = `<span>✨ Recast Latest Message</span>`;
  runNowBtn.title = 'Run the full Recast pipeline on the latest assistant message now';
  runNowBtn.onclick = () => {
    const activeChat = hostCtx?.getActiveChat?.();
    const chatId = activeChat?.chatId || activeChat?.id || undefined;
    hostCtx?.sendToBackend({
      type: 'RECAST_RUN_MESSAGE',
      chatId
    });
  };
  barRight.appendChild(runNowBtn);
  bar.appendChild(barRight);
  container.appendChild(bar);

  // 2. Real-Time Streaming Recast Progress Bar (if running)
  if (recastProgress && recastProgress.active) {
    const progBox = document.createElement('div');
    progBox.className = 'recast-progress-bar recast-pulse';
    progBox.style.borderColor = '#a78bfa';
    progBox.style.background = 'rgba(167, 139, 250, 0.08)';

    const phaseColor =
      recastProgress.phase === 'thinking' ? '#fbbf24' :
      recastProgress.phase === 'generating' ? '#34d399' : '#a78bfa';

    const phaseLabel =
      recastProgress.phase === 'thinking' ? '💭 Thinking' :
      recastProgress.phase === 'generating' ? '📝 Generating' : '⏳ Connecting';

    progBox.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:#a78bfa;font-weight:700;">⚙️ [Pass ${recastProgress.currentPassIndex}/${recastProgress.totalPasses}]</span>
          <span style="font-size:12px;color:#eee;font-weight:600;">${recastProgress.currentPassName}</span>
          <span class="lr-badge" style="background:rgba(0,0,0,0.3);color:${phaseColor};border-color:${phaseColor};">
            ${phaseLabel}
          </span>
        </div>
        <span style="font-size:11px;font-family:monospace;color:#a78bfa;font-weight:600;">
          ${recastProgress.elapsedSec !== undefined ? `${recastProgress.elapsedSec.toFixed(1)}s` : ''}
        </span>
      </div>

      <div style="display:flex;align-items:center;gap:12px;font-size:11px;color:#bbb;margin-bottom:4px;">
        ${recastProgress.thoughtTokens ? `<span style="color:#fbbf24;">💭 Thought tokens: <b>${recastProgress.thoughtTokens}</b></span>` : ''}
        ${recastProgress.wordCount ? `<span style="color:#34d399;">📝 Output words: <b>${recastProgress.wordCount}</b></span>` : ''}
      </div>

      <div style="font-size:11.5px;color:#ddd;margin-bottom:6px;">${recastProgress.statusText}</div>

      ${recastProgress.streamPreview ? `
        <div style="font-family:monospace;font-size:10.5px;color:#a5f3fc;background:#141416;border-radius:4px;padding:5px 8px;max-height:42px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid #333;margin-bottom:6px;">
          ${recastProgress.streamPreview}
        </div>
      ` : ''}

      <div style="background:#262626;height:4px;border-radius:2px;overflow:hidden;">
        <div style="background:#a78bfa;height:100%;width:${(recastProgress.currentPassIndex / recastProgress.totalPasses) * 100}%;transition:width 0.3s ease;"></div>
      </div>
    `;
    container.appendChild(progBox);
  }

  // 3. Global Pipeline Settings Card
  const settingsPanel = document.createElement('div');
  settingsPanel.className = 'lr-panel';

  const sHeader = document.createElement('div');
  sHeader.className = 'lr-panel-header';
  sHeader.innerHTML = `<span>⚙️ Pipeline Settings & Model Speed Controls</span>`;
  settingsPanel.appendChild(sHeader);

  const sBody = document.createElement('div');
  sBody.className = 'lr-panel-body';

  // Row 1: Apply Mode & Min Characters
  const row1 = document.createElement('div');
  row1.className = 'recast-row-2col';

  // Apply Mode
  const modeCol = document.createElement('div');
  modeCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Apply Mode:</label>`;
  const modeSelect = document.createElement('select');
  modeSelect.className = 'lr-select';
  const modes: Array<{ id: RecastSettings['applyMode']; label: string }> = [
    { id: 'diff', label: 'Review in Diff Modal' },
    { id: 'replace', label: 'Auto-Replace In-Place' },
    { id: 'swipe', label: 'Auto-Add as Swipe' }
  ];
  modes.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.label;
    opt.selected = m.id === recastSettings.applyMode;
    modeSelect.appendChild(opt);
  });
  modeSelect.onchange = () => {
    recastSettings.applyMode = modeSelect.value as any;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { applyMode: modeSelect.value as any }
    });
    onRefresh();
  };
  modeCol.appendChild(modeSelect);
  row1.appendChild(modeCol);

  // Min characters
  const minCharCol = document.createElement('div');
  minCharCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Min Characters to Trigger:</label>`;
  const minCharInput = document.createElement('input');
  minCharInput.type = 'number';
  minCharInput.className = 'lr-select';
  minCharInput.value = String(recastSettings.minChars ?? 30);
  minCharInput.min = '0';
  minCharInput.max = '5000';
  minCharInput.onchange = () => {
    const val = parseInt(minCharInput.value, 10) || 0;
    recastSettings.minChars = val;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { minChars: val }
    });
  };
  minCharCol.appendChild(minCharInput);
  row1.appendChild(minCharCol);

  sBody.appendChild(row1);

  // Row 2: Default Connection Profile & Model Override
  const row2 = document.createElement('div');
  row2.className = 'recast-row-2col';

  // Default Connection Profile
  const connCol = document.createElement('div');
  connCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Default Connection Profile:</label>`;
  const connSelect = document.createElement('select');
  connSelect.className = 'lr-select';
  const defConnOpt = document.createElement('option');
  defConnOpt.value = '';
  defConnOpt.textContent = 'Use System Default Connection';
  connSelect.appendChild(defConnOpt);
  availableConnections.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.provider || 'custom'})${c.is_default ? ' [Default]' : ''}`;
    opt.selected = c.id === (recastSettings.defaultConnectionId || '');
    connSelect.appendChild(opt);
  });
  connSelect.onchange = () => {
    recastSettings.defaultConnectionId = connSelect.value;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { defaultConnectionId: connSelect.value }
    });
  };
  connCol.appendChild(connSelect);
  row2.appendChild(connCol);

  // Default Model Override
  const modelCol = document.createElement('div');
  modelCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Default Model Override:</label>`;
  const modelGroup = createModelOverrideInputGroup({
    value: recastSettings.defaultModelOverride || '',
    placeholder: '(Inherit from Connection Profile)',
    datalistId: 'lr-datalist-global-models',
    getConnectionId: () =>
      recastSettings.defaultConnectionId ||
      availableConnections.find((c) => c.is_default)?.id ||
      availableConnections[0]?.id ||
      '',
    getConnectionName: () => {
      const id = recastSettings.defaultConnectionId;
      const found =
        availableConnections.find((c) => c.id === id) ||
        availableConnections.find((c) => c.is_default) ||
        availableConnections[0];
      return found?.name || 'Default Connection';
    },
    onSave: (val) => {
      recastSettings.defaultModelOverride = val;
      hostCtx?.sendToBackend({
        type: 'RECAST_UPDATE_SETTINGS',
        settings: { defaultModelOverride: val }
      });
    },
    hostCtx
  });
  modelCol.appendChild(modelGroup);
  row2.appendChild(modelCol);

  sBody.appendChild(row2);

  // Row 3: Reasoning Effort & First-Word Timeout (TTFT)
  const row3 = document.createElement('div');
  row3.className = 'recast-row-2col';

  // Default Reasoning Effort
  const reasonCol = document.createElement('div');
  reasonCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Reasoning / Thinking Effort:</label>`;
  const reasonSelect = document.createElement('select');
  reasonSelect.className = 'lr-select';
  const reasonEfforts: Array<{ id: RecastReasoningEffort; label: string }> = [
    { id: 'off', label: '🚀 Off (Fastest — No Thinking Phase)' },
    { id: 'inherit', label: 'Inherit Connection Default' },
    { id: 'low', label: '⚡ Low Thinking Budget' },
    { id: 'medium', label: 'Medium Thinking Budget' },
    { id: 'high', label: 'High Thinking Budget' }
  ];
  reasonEfforts.forEach((r) => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.label;
    opt.selected = r.id === (recastSettings.defaultReasoningEffort || 'off');
    reasonSelect.appendChild(opt);
  });
  reasonSelect.onchange = () => {
    recastSettings.defaultReasoningEffort = reasonSelect.value as any;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { defaultReasoningEffort: reasonSelect.value as any }
    });
  };
  reasonCol.appendChild(reasonSelect);
  row3.appendChild(reasonCol);

  // TTFT Timeout
  const ttftCol = document.createElement('div');
  ttftCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">First Word Timeout (TTFT Seconds):</label>`;
  const ttftInput = document.createElement('input');
  ttftInput.type = 'number';
  ttftInput.className = 'lr-select';
  ttftInput.min = '5';
  ttftInput.max = '120';
  ttftInput.value = String(recastSettings.defaultTtftTimeoutSec ?? 20);
  ttftInput.title = 'Abort pass if no response begins within this many seconds';
  ttftInput.onchange = () => {
    const val = parseInt(ttftInput.value, 10) || 20;
    recastSettings.defaultTtftTimeoutSec = val;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { defaultTtftTimeoutSec: val }
    });
  };
  ttftCol.appendChild(ttftInput);
  row3.appendChild(ttftCol);

  sBody.appendChild(row3);

  // Auto-run toggle
  const autoRunLabel = document.createElement('label');
  autoRunLabel.style.display = 'flex';
  autoRunLabel.style.alignItems = 'center';
  autoRunLabel.style.gap = '6px';
  autoRunLabel.style.fontSize = '11.5px';
  autoRunLabel.style.color = '#ccc';
  autoRunLabel.style.cursor = 'pointer';
  autoRunLabel.style.marginTop = '4px';
  const autoRunCheckbox = document.createElement('input');
  autoRunCheckbox.type = 'checkbox';
  autoRunCheckbox.checked = recastSettings.autoRun;
  autoRunCheckbox.onchange = () => {
    recastSettings.autoRun = autoRunCheckbox.checked;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { autoRun: autoRunCheckbox.checked }
    });
  };
  autoRunLabel.appendChild(autoRunCheckbox);
  autoRunLabel.appendChild(
    document.createTextNode('Auto-run Recast pipeline when generation ends')
  );
  sBody.appendChild(autoRunLabel);

  // 🛡️ Block Protection Toggle
  const protectLabel = document.createElement('label');
  protectLabel.style.display = 'flex';
  protectLabel.style.alignItems = 'center';
  protectLabel.style.gap = '6px';
  protectLabel.style.fontSize = '11.5px';
  protectLabel.style.color = '#ccc';
  protectLabel.style.cursor = 'pointer';
  protectLabel.style.marginTop = '6px';
  const protectCheckbox = document.createElement('input');
  protectCheckbox.type = 'checkbox';
  protectCheckbox.checked = recastSettings.protectTagsAndHtml !== false;
  protectCheckbox.onchange = () => {
    recastSettings.protectTagsAndHtml = protectCheckbox.checked;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { protectTagsAndHtml: protectCheckbox.checked }
    });
    hostCtx?.toast?.info?.(
      protectCheckbox.checked
        ? '🛡️ Protected tags, CYOA, GABI metadata & JSON blocks enabled'
        : '⚠️ Block protection disabled (raw message will be sent to LLM)'
    );
  };
  protectLabel.appendChild(protectCheckbox);
  protectLabel.appendChild(
    document.createTextNode('🛡️ Protect HTML tags, CYOA widgets, GABI metadata & JSON state blocks')
  );
  sBody.appendChild(protectLabel);

  // Preset Selector Bar
  const presetBar = document.createElement('div');
  presetBar.className = 'lr-deck-bar';
  presetBar.style.marginTop = '8px';

  const presetSelect = document.createElement('select');
  presetSelect.className = 'lr-select';
  recastSettings.presets.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.passes.filter((x) => x.enabled).length}/${p.passes.length} passes)`;
    opt.selected = p.id === activePreset.id;
    presetSelect.appendChild(opt);
  });
  presetSelect.onchange = () => {
    recastSettings.activePresetId = presetSelect.value;
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_SETTINGS',
      settings: { activePresetId: presetSelect.value }
    });
    onRefresh();
  };
  presetBar.appendChild(presetSelect);

  // New Preset Button
  const newPresetBtn = document.createElement('button');
  newPresetBtn.className = 'lr-btn';
  newPresetBtn.textContent = '+ New';
  newPresetBtn.title = 'Create a new preset';
  newPresetBtn.onclick = () => {
    const name = prompt('Enter name for the new Recast preset:', 'Custom Recast Preset');
    if (name) {
      hostCtx?.sendToBackend({ type: 'RECAST_CREATE_PRESET', name });
    }
  };
  presetBar.appendChild(newPresetBtn);

  // Reset to Defaults Button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'lr-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.title = 'Reset presets to canonical default';
  resetBtn.onclick = () => {
    if (confirm('Reset all Recast presets to canonical defaults?')) {
      hostCtx?.sendToBackend({ type: 'RECAST_RESET_PRESET' });
    }
  };
  presetBar.appendChild(resetBtn);

  // Delete Preset Button
  if (recastSettings.presets.length > 1) {
    const delBtn = document.createElement('button');
    delBtn.className = 'lr-btn';
    delBtn.style.color = '#ff8a8a';
    delBtn.textContent = '✕';
    delBtn.title = 'Delete active preset';
    delBtn.onclick = () => {
      if (confirm(`Delete preset "${activePreset.name}"?`)) {
        hostCtx?.sendToBackend({
          type: 'RECAST_DELETE_PRESET',
          presetId: activePreset.id
        });
      }
    };
    presetBar.appendChild(delBtn);
  }

  sBody.appendChild(presetBar);
  settingsPanel.appendChild(sBody);
  container.appendChild(settingsPanel);

  // 4. Passes List Panel
  const passesPanel = document.createElement('div');
  passesPanel.className = 'lr-panel';

  const passesHeader = document.createElement('div');
  passesHeader.className = 'lr-panel-header';
  const enabledCount = activePreset.passes.filter((p) => p.enabled).length;
  passesHeader.innerHTML = `
    <span>Passes in Preset (${enabledCount}/${activePreset.passes.length} Active)</span>
  `;

  const addPassBtn = document.createElement('button');
  addPassBtn.className = 'lr-btn lr-btn-primary';
  addPassBtn.style.padding = '2px 8px';
  addPassBtn.style.fontSize = '11px';
  addPassBtn.textContent = '+ Add Pass';
  addPassBtn.onclick = (e) => {
    e.stopPropagation();
    const newPass: RecastPass = {
      id: `pass_${Date.now()}`,
      name: 'New Custom Pass',
      enabled: true,
      contextLength: 5,
      prompt: 'You are an editor. Edit <text_to_transform> to improve dialogue and character voice.\nReturn only the rewritten text.',
      connection: '',
      modelOverride: '',
      reasoningEffort: 'off',
      maxTokens: 1000,
      temperature: 0.3,
      ttftTimeoutSec: 20,
      passTimeoutSec: 60,
      injectWorldInfo: false,
      includeCharCard: true,
      includeSceneContext: true
    };
    activePreset.passes.push(newPass);
    expandedPasses.add(newPass.id);
    hostCtx?.sendToBackend({
      type: 'RECAST_UPDATE_PRESET',
      preset: activePreset
    });
    onRefresh();
  };
  passesHeader.appendChild(addPassBtn);
  passesPanel.appendChild(passesHeader);

  const passesBody = document.createElement('div');
  passesBody.className = 'lr-panel-body';

  activePreset.passes.forEach((pass, pIdx) => {
    const isExpanded = expandedPasses.has(pass.id);

    const item = document.createElement('div');
    item.className = `recast-pass-item ${pass.enabled ? '' : 'disabled'}`;

    // Header row
    const headerRow = document.createElement('div');
    headerRow.className = 'recast-pass-header';

    const titleRow = document.createElement('div');
    titleRow.className = 'recast-pass-title-row';

    // Enabled checkbox
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = pass.enabled;
    chk.title = 'Enable / Disable this pass';
    chk.onchange = () => {
      pass.enabled = chk.checked;
      hostCtx?.sendToBackend({
        type: 'RECAST_UPDATE_PRESET',
        preset: activePreset
      });
      onRefresh();
    };
    titleRow.appendChild(chk);

    // Pass name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'recast-pass-name';
    nameInput.value = pass.name;
    nameInput.title = 'Click to rename pass';
    nameInput.onchange = () => {
      pass.name = nameInput.value.trim() || 'Untitled Pass';
      hostCtx?.sendToBackend({
        type: 'RECAST_UPDATE_PRESET',
        preset: activePreset
      });
    };
    titleRow.appendChild(nameInput);
    headerRow.appendChild(titleRow);

    // Controls: Up, Down, Delete, Expand
    const ctrlRow = document.createElement('div');
    ctrlRow.className = 'recast-pass-controls';

    // Move Up
    if (pIdx > 0) {
      const upBtn = document.createElement('button');
      upBtn.className = 'recast-btn-icon';
      upBtn.innerHTML = '▲';
      upBtn.title = 'Move pass up';
      upBtn.onclick = () => {
        const temp = activePreset.passes[pIdx - 1];
        activePreset.passes[pIdx - 1] = activePreset.passes[pIdx];
        activePreset.passes[pIdx] = temp;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
        onRefresh();
      };
      ctrlRow.appendChild(upBtn);
    }

    // Move Down
    if (pIdx < activePreset.passes.length - 1) {
      const downBtn = document.createElement('button');
      downBtn.className = 'recast-btn-icon';
      downBtn.innerHTML = '▼';
      downBtn.title = 'Move pass down';
      downBtn.onclick = () => {
        const temp = activePreset.passes[pIdx + 1];
        activePreset.passes[pIdx + 1] = activePreset.passes[pIdx];
        activePreset.passes[pIdx] = temp;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
        onRefresh();
      };
      ctrlRow.appendChild(downBtn);
    }

    // Expand/Collapse Details button
    const expandBtn = document.createElement('button');
    expandBtn.className = 'recast-btn-icon';
    expandBtn.innerHTML = isExpanded ? 'Hide' : 'Edit';
    expandBtn.title = 'Show / hide pass configuration & prompt';
    expandBtn.onclick = () => {
      if (expandedPasses.has(pass.id)) {
        expandedPasses.delete(pass.id);
      } else {
        expandedPasses.add(pass.id);
      }
      onRefresh();
    };
    ctrlRow.appendChild(expandBtn);

    // Delete pass
    const delBtn = document.createElement('button');
    delBtn.className = 'recast-btn-icon';
    delBtn.style.color = '#ff8a8a';
    delBtn.innerHTML = '✕';
    delBtn.title = 'Delete pass';
    delBtn.onclick = () => {
      if (confirm(`Remove pass "${pass.name}"?`)) {
        activePreset.passes.splice(pIdx, 1);
        expandedPasses.delete(pass.id);
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
        onRefresh();
      }
    };
    ctrlRow.appendChild(delBtn);

    headerRow.appendChild(ctrlRow);
    item.appendChild(headerRow);

    // Expanded Details Section
    if (isExpanded) {
      const details = document.createElement('div');
      details.className = 'recast-pass-details';

      // Row A: Context Length & Connection Profile
      const paramRow = document.createElement('div');
      paramRow.className = 'recast-row-2col';

      // Context Length
      const ctxCol = document.createElement('div');
      ctxCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Context Length (Messages):</label>`;
      const ctxInput = document.createElement('input');
      ctxInput.type = 'number';
      ctxInput.className = 'lr-select';
      ctxInput.value = String(pass.contextLength ?? 3);
      ctxInput.min = '0';
      ctxInput.max = '100';
      ctxInput.onchange = () => {
        pass.contextLength = parseInt(ctxInput.value, 10) || 0;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      ctxCol.appendChild(ctxInput);
      paramRow.appendChild(ctxCol);

      // Connection Profile
      const pConnCol = document.createElement('div');
      pConnCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Connection Profile:</label>`;
      const pConnSelect = document.createElement('select');
      pConnSelect.className = 'lr-select';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = 'Inherit Global / Default';
      pConnSelect.appendChild(defOpt);
      availableConnections.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name}${c.is_default ? ' [Default]' : ''}`;
        opt.selected = c.id === pass.connection;
        pConnSelect.appendChild(opt);
      });
      pConnSelect.onchange = () => {
        pass.connection = pConnSelect.value;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      pConnCol.appendChild(pConnSelect);
      paramRow.appendChild(pConnCol);

      details.appendChild(paramRow);

      // Row B: Model Override & Reasoning Effort
      const modelReasonRow = document.createElement('div');
      modelReasonRow.className = 'recast-row-2col';

      // Model Override
      const pModelCol = document.createElement('div');
      pModelCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Model Override:</label>`;
      const pModelGroup = createModelOverrideInputGroup({
        value: pass.modelOverride || '',
        placeholder: '(Inherit from Connection)',
        datalistId: `lr-datalist-pass-${pass.id}`,
        getConnectionId: () =>
          pass.connection ||
          recastSettings.defaultConnectionId ||
          availableConnections.find((c) => c.is_default)?.id ||
          availableConnections[0]?.id ||
          '',
        getConnectionName: () => {
          const id = pass.connection || recastSettings.defaultConnectionId;
          const found =
            availableConnections.find((c) => c.id === id) ||
            availableConnections.find((c) => c.is_default) ||
            availableConnections[0];
          return found?.name || 'Inherited Connection';
        },
        onSave: (val) => {
          pass.modelOverride = val;
          hostCtx?.sendToBackend({
            type: 'RECAST_UPDATE_PRESET',
            preset: activePreset
          });
        },
        hostCtx
      });
      pModelCol.appendChild(pModelGroup);
      modelReasonRow.appendChild(pModelCol);

      // Reasoning Effort
      const pReasonCol = document.createElement('div');
      pReasonCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Reasoning Effort:</label>`;
      const pReasonSelect = document.createElement('select');
      pReasonSelect.className = 'lr-select';
      const passReasonEfforts: Array<{ id: RecastReasoningEffort; label: string }> = [
        { id: 'off', label: '🚀 Off (No Thinking)' },
        { id: 'inherit', label: 'Inherit Global Setting' },
        { id: 'low', label: '⚡ Low Effort' },
        { id: 'medium', label: 'Medium Effort' },
        { id: 'high', label: 'High Effort' }
      ];
      passReasonEfforts.forEach((r) => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.label;
        opt.selected = r.id === (pass.reasoningEffort || 'off');
        pReasonSelect.appendChild(opt);
      });
      pReasonSelect.onchange = () => {
        pass.reasoningEffort = pReasonSelect.value as any;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      pReasonCol.appendChild(pReasonSelect);
      modelReasonRow.appendChild(pReasonCol);

      details.appendChild(modelReasonRow);

      // Row C: Timeouts (TTFT & Pass Duration)
      const timeoutRow = document.createElement('div');
      timeoutRow.className = 'recast-row-2col';

      const pTtftCol = document.createElement('div');
      pTtftCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">First-Token Timeout (s):</label>`;
      const pTtftInput = document.createElement('input');
      pTtftInput.type = 'number';
      pTtftInput.className = 'lr-select';
      pTtftInput.min = '5';
      pTtftInput.max = '120';
      pTtftInput.value = String(pass.ttftTimeoutSec ?? 20);
      pTtftInput.onchange = () => {
        pass.ttftTimeoutSec = parseInt(pTtftInput.value, 10) || 20;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      pTtftCol.appendChild(pTtftInput);
      timeoutRow.appendChild(pTtftCol);

      const pPassTimeCol = document.createElement('div');
      pPassTimeCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Max Pass Duration (s):</label>`;
      const pPassTimeInput = document.createElement('input');
      pPassTimeInput.type = 'number';
      pPassTimeInput.className = 'lr-select';
      pPassTimeInput.min = '10';
      pPassTimeInput.max = '300';
      pPassTimeInput.value = String(pass.passTimeoutSec ?? 60);
      pPassTimeInput.onchange = () => {
        pass.passTimeoutSec = parseInt(pPassTimeInput.value, 10) || 60;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      pPassTimeCol.appendChild(pPassTimeInput);
      timeoutRow.appendChild(pPassTimeCol);

      details.appendChild(timeoutRow);

      // Injections Checkboxes
      const injGroup = document.createElement('div');
      injGroup.className = 'recast-checkbox-group';

      // Character Card
      const charLabel = document.createElement('label');
      charLabel.className = 'recast-checkbox-label';
      const charChk = document.createElement('input');
      charChk.type = 'checkbox';
      charChk.checked = pass.includeCharCard !== false;
      charChk.onchange = () => {
        pass.includeCharCard = charChk.checked;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      charLabel.appendChild(charChk);
      charLabel.appendChild(document.createTextNode('Include Character Card'));
      injGroup.appendChild(charLabel);

      // Scene Context
      const scnLabel = document.createElement('label');
      scnLabel.className = 'recast-checkbox-label';
      const scnChk = document.createElement('input');
      scnChk.type = 'checkbox';
      scnChk.checked = pass.includeSceneContext !== false;
      scnChk.onchange = () => {
        pass.includeSceneContext = scnChk.checked;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      scnLabel.appendChild(scnChk);
      scnLabel.appendChild(document.createTextNode('Include Scene Context'));
      injGroup.appendChild(scnLabel);

      // World Info
      const wiLabel = document.createElement('label');
      wiLabel.className = 'recast-checkbox-label';
      const wiChk = document.createElement('input');
      wiChk.type = 'checkbox';
      wiChk.checked = pass.injectWorldInfo === true;
      wiChk.onchange = () => {
        pass.injectWorldInfo = wiChk.checked;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      wiLabel.appendChild(wiChk);
      wiLabel.appendChild(document.createTextNode('Inject World Info'));
      injGroup.appendChild(wiLabel);

      details.appendChild(injGroup);

      // System Prompt Editor
      const promptLabel = document.createElement('label');
      promptLabel.style.display = 'block';
      promptLabel.style.fontSize = '10.5px';
      promptLabel.style.color = '#aaa';
      promptLabel.style.marginBottom = '3px';
      promptLabel.textContent = 'Pass System Prompt:';
      details.appendChild(promptLabel);

      const promptArea = document.createElement('textarea');
      promptArea.className = 'recast-prompt-editor';
      promptArea.rows = 7;
      promptArea.value = pass.prompt;
      promptArea.placeholder = 'Enter instructions for this pass. Must instruct returning the modified text.';
      promptArea.onchange = () => {
        pass.prompt = promptArea.value;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      details.appendChild(promptArea);

      // Prefill Section
      const prefillRow = document.createElement('div');
      prefillRow.style.display = 'flex';
      prefillRow.style.gap = '8px';
      prefillRow.style.marginTop = '6px';
      prefillRow.style.alignItems = 'center';

      const prefillInput = document.createElement('input');
      prefillInput.type = 'text';
      prefillInput.className = 'lr-select';
      prefillInput.style.flex = '1';
      prefillInput.placeholder = 'Optional Assistant Prefill (e.g. ```text or Sure, here is the text:)';
      prefillInput.value = pass.prefill || '';
      prefillInput.onchange = () => {
        pass.prefill = prefillInput.value;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      prefillRow.appendChild(prefillInput);

      details.appendChild(prefillRow);
      item.appendChild(details);
    }

    passesBody.appendChild(item);
  });

  passesPanel.appendChild(passesBody);
  container.appendChild(passesPanel);
}
