/**
 * Lumi:REcursion — Recast Post-Processing & Diff Modal Styles
 * Technical Graphite Dark Theme designed for Lumiverse Spindle
 */

export const RECAST_STYLES = `
/* ── Tab Navigation ── */
.lr-tab-nav {
  display: flex;
  background: #202020;
  border: 1px solid #383838;
  border-radius: 6px;
  padding: 3px;
  gap: 4px;
  margin-bottom: 4px;
}

.lr-tab-btn {
  flex: 1;
  text-align: center;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  color: #999;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
  user-select: none;
}

.lr-tab-btn:hover {
  background: #282828;
  color: #eee;
}

.lr-tab-btn.active {
  background: rgba(101, 214, 232, 0.15);
  color: #65d6e8;
  border-color: #65d6e8;
}

.lr-tab-btn.active-recast {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  border-color: #a78bfa;
}

/* ── Recast Pass List ── */
.recast-pass-item {
  background: #222222;
  border: 1px solid #353535;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.15s ease;
}

.recast-pass-item:hover {
  border-color: #484848;
}

.recast-pass-item.disabled {
  opacity: 0.6;
}

.recast-pass-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.recast-pass-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.recast-pass-name {
  font-size: 12px;
  font-weight: 600;
  color: #e2e2e2;
  flex: 1;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 4px;
}

.recast-pass-name:focus {
  background: #181818;
  border-color: #555;
  outline: none;
  color: #fff;
}

.recast-pass-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.recast-btn-icon {
  background: #2a2a2a;
  border: 1px solid #3c3c3c;
  color: #aaa;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.recast-btn-icon:hover {
  background: #363636;
  color: #fff;
  border-color: #555;
}

.recast-pass-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid #2e2e2e;
  margin-top: 2px;
}

.recast-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.recast-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 4px 0;
}

.recast-checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #bbb;
  cursor: pointer;
}

.recast-textarea {
  width: 100%;
  box-sizing: border-box;
  background: #181818;
  border: 1px solid #383838;
  color: #ddd;
  border-radius: 5px;
  padding: 7px 9px;
  font-size: 11.5px;
  font-family: inherit;
  line-height: 1.4;
  resize: vertical;
  min-height: 80px;
  outline: none;
}

.recast-textarea:focus {
  border-color: #a78bfa;
}

/* ── Recast Hero / Progress Bar ── */
.recast-progress-bar {
  background: #242424;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.recast-pulse {
  animation: rc-pulse 1.2s infinite alternate;
}

@keyframes rc-pulse {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* ── Interactive Diff Review Modal ── */
#recast_diff_backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  animation: rc-fade-in 0.2s ease;
}

#recast_diff_modal {
  position: relative;
  width: 90vw;
  height: 88vh;
  max-width: 1400px;
  background: #1a1a1f;
  border: 1px solid #3e3e48;
  border-radius: 10px;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: rc-slide-up 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  color: #dcdcdc;
  font-family: var(--mainFontFamily, "Noto Sans", -apple-system, sans-serif);
}

@keyframes rc-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes rc-slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.rc-diff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 1px solid #33333d;
  background: #202026;
  flex-shrink: 0;
}

.rc-diff-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #eee;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rc-diff-close-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 5px;
  line-height: 1;
  transition: all 0.15s;
}

.rc-diff-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Steps Bar */
.rc-diff-steps-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  background: #1c1c22;
  border-bottom: 1px solid #2d2d36;
  flex-shrink: 0;
  overflow-x: auto;
}

.rc-diff-step-btn {
  background: #25252d;
  border: 1px solid #383842;
  color: #aaa;
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.rc-diff-step-btn:hover {
  background: #30303a;
  color: #eee;
}

.rc-diff-step-btn.active {
  background: rgba(167, 139, 250, 0.2);
  border-color: #a78bfa;
  color: #c4b5fd;
}

/* Modal Body */
.rc-diff-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 12px 16px;
  gap: 12px;
}

.rc-diff-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.rc-diff-panel-header {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 12px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.rc-diff-original-header {
  background: rgba(220, 60, 60, 0.16);
  color: #f28b82;
  border-bottom: 2px solid rgba(220, 60, 60, 0.4);
}

.rc-diff-transformed-header {
  background: rgba(50, 200, 100, 0.14);
  color: #81c995;
  border-bottom: 2px solid rgba(50, 200, 100, 0.4);
}

.rc-diff-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  background: #141418;
  border: 1px solid #33333e;
  border-top: none;
  border-radius: 0 0 6px 6px;
  font-size: 12.5px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: #d8d8d8;
}

.rc-diff-textarea {
  flex: 1;
  resize: none;
  font-family: inherit;
  font-size: 12.5px;
  line-height: 1.7;
  padding: 12px 14px;
  background: #141418 !important;
  color: #eee !important;
  border: 1px solid #33333e !important;
  border-top: none !important;
  border-radius: 0 0 6px 6px !important;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.rc-diff-textarea:focus {
  border-color: #a78bfa !important;
}

/* Diff highlights */
del.rc-del {
  background: rgba(220, 50, 50, 0.3);
  color: #ff9999;
  text-decoration: line-through;
  padding: 1px 3px;
  border-radius: 2px;
}

ins.rc-ins {
  background: rgba(50, 190, 100, 0.3);
  color: #90f0a8;
  text-decoration: none;
  font-weight: 600;
  padding: 1px 3px;
  border-radius: 2px;
}

/* Modal Footer */
.rc-diff-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-top: 1px solid #33333d;
  background: #202026;
  flex-shrink: 0;
}

.rc-diff-btn {
  padding: 7px 18px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.rc-diff-accept-btn {
  background: rgba(50, 190, 100, 0.2);
  border: 1px solid rgba(50, 190, 100, 0.5);
  color: #81c995;
}

.rc-diff-accept-btn:hover {
  background: rgba(50, 190, 100, 0.35);
  color: #fff;
}

.rc-diff-swipe-btn {
  background: rgba(167, 139, 250, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.5);
  color: #c4b5fd;
}

.rc-diff-swipe-btn:hover {
  background: rgba(167, 139, 250, 0.35);
  color: #fff;
}

.rc-diff-reject-btn {
  background: #28282e;
  border: 1px solid #3e3e48;
  color: #aaa;
}

.rc-diff-reject-btn:hover {
  background: #34343c;
  color: #eee;
}

/* ── Model Picker Modal Styles ── */
.rc-model-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.rc-model-modal {
  background: #18181c;
  border: 1px solid #383844;
  border-radius: 8px;
  width: 95%;
  max-width: 620px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
  overflow: hidden;
  font-family: inherit;
}

.rc-model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #282832;
  background: #1f1f26;
}

.rc-model-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rc-model-title {
  font-size: 14px;
  font-weight: 700;
  color: #e2e2e8;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rc-model-subtitle {
  font-size: 11px;
  color: #999;
}

.rc-model-search-bar {
  padding: 10px 18px 6px;
  background: #18181c;
}

.rc-model-search-input {
  width: 100%;
  padding: 8px 12px;
  background: #22222a;
  border: 1px solid #3c3c4a;
  border-radius: 5px;
  font-size: 12.5px;
  color: #eee;
  outline: none;
  transition: border-color 0.15s ease;
}

.rc-model-search-input:focus {
  border-color: #a78bfa;
}

.rc-model-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 4px 18px 10px;
  border-bottom: 1px solid #282832;
  background: #18181c;
}

.rc-model-tag-btn {
  background: #23232b;
  border: 1px solid #363644;
  color: #aaa;
  border-radius: 4px;
  font-size: 10.5px;
  padding: 3px 8px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.rc-model-tag-btn:hover {
  background: #2c2c36;
  color: #eee;
}

.rc-model-tag-btn.active {
  background: rgba(167, 139, 250, 0.2);
  border-color: #a78bfa;
  color: #c4b5fd;
  font-weight: 600;
}

.rc-model-clear-btn {
  margin-left: auto;
  border-color: #553333;
  color: #ff9999;
}

.rc-model-clear-btn:hover {
  background: rgba(255, 100, 100, 0.15);
  border-color: #ff6666;
  color: #ffaaaa;
}

.rc-model-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 14px;
  min-height: 200px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rc-model-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  background: #1f1f26;
  border: 1px solid #2e2e3a;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.12s ease;
}

.rc-model-item:hover {
  background: #282834;
  border-color: #4c4c60;
  transform: translateX(2px);
}

.rc-model-item.selected {
  background: rgba(167, 139, 250, 0.15);
  border-color: #a78bfa;
}

.rc-model-item-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.rc-model-item-id {
  font-family: 'Consolas', 'Menlo', 'Monaco', monospace;
  font-size: 11.5px;
  color: #d6d6e2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rc-model-item-label {
  font-size: 10px;
  color: #8a8a9a;
}

.rc-model-item-badge {
  font-size: 9.5px;
  font-weight: 600;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.4);
  padding: 1px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.rc-model-empty {
  text-align: center;
  color: #777;
  font-size: 12px;
  padding: 30px 10px;
}

.rc-model-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  border-top: 1px solid #282832;
  background: #1f1f26;
}

.rc-model-count-text {
  font-size: 11px;
  color: #888;
}

/* Row with Fetch Button */
.recast-model-input-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.recast-btn-fetch {
  background: rgba(167, 139, 250, 0.12);
  border: 1px solid rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}

.recast-btn-fetch:hover {
  background: rgba(167, 139, 250, 0.25);
  border-color: #a78bfa;
  color: #fff;
}

.recast-btn-fetch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;
