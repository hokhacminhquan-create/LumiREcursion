/**
 * Lumi:REcursion — Interactive Recast Diff Review Modal
 * Allows word-level comparison across passes, live editing, and replace / swipe settlement.
 */

import type { RecastDiffData } from './types';
import { computeWordDiff, buildSteps, escapeHtml } from './diff';

let activeBackdropEl: HTMLElement | null = null;

export function closeRecastDiffModal() {
  if (activeBackdropEl && activeBackdropEl.parentElement) {
    activeBackdropEl.remove();
  }
  activeBackdropEl = null;

  const host = document.getElementById('recursion-modal-host');
  if (host) {
    host.classList.remove('active');
  }
}

export function showRecastDiffModal(diff: RecastDiffData, hostCtx: any) {
  closeRecastDiffModal();

  let host = document.getElementById('recursion-modal-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'recursion-modal-host';
    document.body.appendChild(host);
  }
  host.classList.add('active');

  const backdrop = document.createElement('div');
  backdrop.id = 'recast_diff_backdrop';
  activeBackdropEl = backdrop;

  const modal = document.createElement('div');
  modal.id = 'recast_diff_modal';
  modal.onclick = (e) => e.stopPropagation();

  // 1. Header
  const header = document.createElement('div');
  header.className = 'rc-diff-header';
  header.innerHTML = `
    <div class="rc-diff-title">
      <span>✨ Recast Post-Processing Review</span>
      <span style="font-size:11px;font-weight:400;color:#999;background:#282832;padding:2px 6px;border-radius:4px;">
        ${diff.totalLatencyMs}ms · ${diff.passNames.length} pass${diff.passNames.length === 1 ? '' : 'es'}
      </span>
    </div>
  `;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'rc-diff-close-btn';
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Close modal';
  closeBtn.onclick = closeRecastDiffModal;
  header.appendChild(closeBtn);
  modal.appendChild(header);

  // 2. Steps Navigation Bar
  const steps = buildSteps(diff.snapshots, diff.passNames);
  let currentStepIdx = 0;
  let userEditedText = diff.transformedText;

  const stepsBar = document.createElement('div');
  stepsBar.className = 'rc-diff-steps-bar';

  // 3. Body (Side-by-Side Diff Panels)
  const body = document.createElement('div');
  body.className = 'rc-diff-body';

  // Left Panel: Original
  const leftPanel = document.createElement('div');
  leftPanel.className = 'rc-diff-panel';
  const leftHeader = document.createElement('div');
  leftHeader.className = 'rc-diff-panel-header rc-diff-original-header';
  leftHeader.innerHTML = `<span>Original Text</span>`;
  const leftContent = document.createElement('div');
  leftContent.className = 'rc-diff-content';
  leftPanel.appendChild(leftHeader);
  leftPanel.appendChild(leftContent);

  // Right Panel: Transformed + Live Editor
  const rightPanel = document.createElement('div');
  rightPanel.className = 'rc-diff-panel';
  const rightHeader = document.createElement('div');
  rightHeader.className = 'rc-diff-panel-header rc-diff-transformed-header';
  rightHeader.innerHTML = `
    <span>Recast Transformed</span>
    <span style="font-size:10px;text-transform:none;opacity:0.75;">(Editable below)</span>
  `;
  const rightContent = document.createElement('div');
  rightContent.className = 'rc-diff-content';
  rightContent.style.flex = '1';

  const editTextarea = document.createElement('textarea');
  editTextarea.className = 'rc-diff-textarea';
  editTextarea.value = userEditedText;
  editTextarea.placeholder = 'Fine-tune the recast prose here before accepting...';
  editTextarea.style.height = '140px';
  editTextarea.style.flex = '0 0 auto';

  editTextarea.oninput = () => {
    userEditedText = editTextarea.value;
    if (currentStepIdx === 0 && steps.length > 0) {
      steps[0].newText = userEditedText;
      const { oldHtml, newHtml } = computeWordDiff(steps[0].oldText, userEditedText);
      leftContent.innerHTML = oldHtml;
      rightContent.innerHTML = newHtml;
    }
  };

  rightPanel.appendChild(rightHeader);
  rightPanel.appendChild(rightContent);
  rightPanel.appendChild(editTextarea);

  body.appendChild(leftPanel);
  body.appendChild(rightPanel);

  function renderStep(idx: number) {
    currentStepIdx = idx;
    const step = steps[idx];
    if (!step) return;

    // Update active button
    const buttons = stepsBar.querySelectorAll('.rc-diff-step-btn');
    buttons.forEach((btn, bIdx) => {
      btn.classList.toggle('active', bIdx === idx);
    });

    leftHeader.innerHTML = `<span>${step.oldLabel}</span>`;
    rightHeader.innerHTML = `
      <span>${step.newLabel}${step.passName ? ` (${step.passName})` : ''}</span>
      ${idx === 0 ? '<span style="font-size:10px;text-transform:none;opacity:0.75;">(Editable below)</span>' : ''}
    `;

    const targetNew = idx === 0 ? userEditedText : step.newText;
    const { oldHtml, newHtml } = computeWordDiff(step.oldText, targetNew);

    leftContent.innerHTML = oldHtml;
    rightContent.innerHTML = newHtml;

    // Only allow editing final outcome on step 0
    if (idx === 0) {
      editTextarea.style.display = '';
      rightContent.style.flex = '1';
    } else {
      editTextarea.style.display = 'none';
      rightContent.style.flex = '1 1 auto';
    }
  }

  // Populate steps
  steps.forEach((step, sIdx) => {
    const stepBtn = document.createElement('button');
    stepBtn.className = `rc-diff-step-btn ${sIdx === 0 ? 'active' : ''}`;
    stepBtn.textContent = step.caption;
    stepBtn.onclick = () => renderStep(sIdx);
    stepsBar.appendChild(stepBtn);
  });

  if (steps.length > 1) {
    modal.appendChild(stepsBar);
  }
  modal.appendChild(body);

  // Initial render of Step 0
  renderStep(0);

  // 4. Footer Actions
  const footer = document.createElement('div');
  footer.className = 'rc-diff-footer';

  const rejectBtn = document.createElement('button');
  rejectBtn.className = 'rc-diff-btn rc-diff-reject-btn';
  rejectBtn.innerHTML = `Keep Original`;
  rejectBtn.onclick = () => {
    closeRecastDiffModal();
    hostCtx?.toast?.info?.('Recast changes discarded.');
  };

  const swipeBtn = document.createElement('button');
  swipeBtn.className = 'rc-diff-btn rc-diff-swipe-btn';
  swipeBtn.innerHTML = `🔀 Accept as Swipe`;
  swipeBtn.onclick = () => {
    const textToApply = userEditedText;
    hostCtx?.sendToBackend({
      type: 'RECAST_APPLY_RESULT',
      chatId: diff.chatId,
      messageId: diff.messageId,
      text: textToApply,
      mode: 'swipe'
    });
    closeRecastDiffModal();
  };

  const acceptBtn = document.createElement('button');
  acceptBtn.className = 'rc-diff-btn rc-diff-accept-btn';
  acceptBtn.innerHTML = `✅ Accept & Replace`;
  acceptBtn.onclick = () => {
    const textToApply = userEditedText;
    hostCtx?.sendToBackend({
      type: 'RECAST_APPLY_RESULT',
      chatId: diff.chatId,
      messageId: diff.messageId,
      text: textToApply,
      mode: 'replace'
    });
    closeRecastDiffModal();
  };

  footer.appendChild(rejectBtn);
  footer.appendChild(swipeBtn);
  footer.appendChild(acceptBtn);
  modal.appendChild(footer);

  backdrop.appendChild(modal);
  backdrop.onclick = closeRecastDiffModal;
  host.appendChild(backdrop);
}
