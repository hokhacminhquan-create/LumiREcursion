/**
 * Lumi:REcursion — Recast Settings & Preset Management Panel
 * Renders the full Recast post-processing pipeline UI in Lumiverse Spindle
 */

import type { RecastSettings, RecastProgress, RecastPass, RecastPreset } from './types';

// Track which passes are expanded
const expandedPasses = new Set<string>();

export function renderRecastPanel(
  container: HTMLElement,
  state: {
    recastSettings: RecastSettings;
    recastProgress: RecastProgress | null;
    availableConnections: Array<{ id: string; name: string; is_default?: boolean }>;
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

  // 2. Recast Progress Bar (if running)
  if (recastProgress && recastProgress.active) {
    const progBox = document.createElement('div');
    progBox.className = 'recast-progress-bar recast-pulse';
    progBox.style.borderColor = '#a78bfa';
    progBox.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="color:#a78bfa;font-weight:700;">⚙️ [Pass ${recastProgress.currentPassIndex}/${recastProgress.totalPasses}]</span>
        <span style="font-size:12px;color:#eee;">${recastProgress.currentPassName}</span>
      </div>
      <span style="font-size:11px;color:#aaa;font-style:italic;">${recastProgress.statusText}</span>
    `;
    container.appendChild(progBox);
  }

  // 3. Global Pipeline Settings Card
  const settingsPanel = document.createElement('div');
  settingsPanel.className = 'lr-panel';

  const sHeader = document.createElement('div');
  sHeader.className = 'lr-panel-header';
  sHeader.innerHTML = `<span>⚙️ Pipeline Mode & Presets</span>`;
  settingsPanel.appendChild(sHeader);

  const sBody = document.createElement('div');
  sBody.className = 'lr-panel-body';

  // Auto-run checkbox & Apply Mode row
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
  minCharCol.innerHTML = `<label style="display:block;font-size:11px;color:#aaa;margin-bottom:4px;">Min Characters:</label>`;
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

  // Auto-run toggle
  const autoRunLabel = document.createElement('label');
  autoRunLabel.style.display = 'flex';
  autoRunLabel.style.alignItems = 'center';
  autoRunLabel.style.gap = '6px';
  autoRunLabel.style.fontSize = '11.5px';
  autoRunLabel.style.color = '#ccc';
  autoRunLabel.style.cursor = 'pointer';
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

  // Preset Selector Bar
  const presetBar = document.createElement('div');
  presetBar.className = 'lr-deck-bar';
  presetBar.style.marginTop = '4px';

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

      // Row: Context Length & Connection Profile
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
      const connCol = document.createElement('div');
      connCol.innerHTML = `<label style="display:block;font-size:10.5px;color:#aaa;margin-bottom:3px;">Connection Profile:</label>`;
      const connSelect = document.createElement('select');
      connSelect.className = 'lr-select';
      const defOpt = document.createElement('option');
      defOpt.value = '';
      defOpt.textContent = 'Active / Default Profile';
      connSelect.appendChild(defOpt);
      availableConnections.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name}${c.is_default ? ' (Default)' : ''}`;
        opt.selected = c.id === pass.connection;
        connSelect.appendChild(opt);
      });
      connSelect.onchange = () => {
        pass.connection = connSelect.value;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      connCol.appendChild(connSelect);
      paramRow.appendChild(connCol);

      details.appendChild(paramRow);

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
      wiChk.checked = Boolean(pass.injectWorldInfo);
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

      // Prompt Textarea
      const promptLabel = document.createElement('label');
      promptLabel.style.display = 'block';
      promptLabel.style.fontSize = '10.5px';
      promptLabel.style.color = '#aaa';
      promptLabel.innerHTML = `Pass Prompt <span style="font-size:10px;color:#a78bfa;">(&lt;text_to_transform&gt; will be injected)</span>:`;
      details.appendChild(promptLabel);

      const promptTextarea = document.createElement('textarea');
      promptTextarea.className = 'recast-textarea';
      promptTextarea.value = pass.prompt;
      promptTextarea.rows = 5;
      promptTextarea.onchange = () => {
        pass.prompt = promptTextarea.value;
        hostCtx?.sendToBackend({
          type: 'RECAST_UPDATE_PRESET',
          preset: activePreset
        });
      };
      details.appendChild(promptTextarea);

      item.appendChild(details);
    }

    passesBody.appendChild(item);
  });

  passesPanel.appendChild(passesBody);
  container.appendChild(passesPanel);
}
