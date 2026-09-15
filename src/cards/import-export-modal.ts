/**
 * Lumi:REcursion — Import / Export JSON Modal
 * Provides interactive JSON payload editing, importing, and exporting for World Books and Character Payloads.
 */

let activeModalBackdrop: HTMLElement | null = null;

export function closeJsonModal() {
  if (activeModalBackdrop && activeModalBackdrop.parentElement) {
    activeModalBackdrop.remove();
  }
  activeModalBackdrop = null;

  const host = document.getElementById('recursion-modal-host');
  if (host) {
    host.classList.remove('active');
  }
}

export function showJsonModal(options: {
  title: string;
  mode: 'import' | 'export';
  initialData?: any;
  defaultTemplate?: any;
  onImport?: (parsed: any) => void;
  hostCtx: any;
}) {
  const { title, mode, initialData, defaultTemplate, onImport, hostCtx } = options;

  closeJsonModal();

  let host = document.getElementById('recursion-modal-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'recursion-modal-host';
    document.body.appendChild(host);
  }
  host.classList.add('active');

  const backdrop = document.createElement('div');
  backdrop.id = 'recast_diff_backdrop';
  activeModalBackdrop = backdrop;

  const modal = document.createElement('div');
  modal.id = 'recast_diff_modal';
  modal.style.maxWidth = '850px';
  modal.style.height = '78vh';
  modal.onclick = (e) => e.stopPropagation();

  // Header
  const header = document.createElement('div');
  header.className = 'rc-diff-header';
  header.innerHTML = `
    <div class="rc-diff-title">
      <span>${title}</span>
    </div>
  `;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'rc-diff-close-btn';
  closeBtn.innerHTML = '✕';
  closeBtn.onclick = closeJsonModal;
  header.appendChild(closeBtn);
  modal.appendChild(header);

  // Body
  const body = document.createElement('div');
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.style.flex = '1';
  body.style.padding = '14px 18px';
  body.style.gap = '10px';
  body.style.overflow = 'hidden';

  const helpTip = document.createElement('div');
  helpTip.style.fontSize = '11.5px';
  helpTip.style.color = '#aaa';
  if (mode === 'import') {
    helpTip.innerHTML = `
      Paste an array of card objects or a full payload JSON. You can click <strong>"Load Template"</strong> below to view the canonical schema.
    `;
  } else {
    helpTip.innerHTML = `
      Here is the raw JSON representation of your card definitions. Click <strong>"Copy to Clipboard"</strong> to share or back up.
    `;
  }
  body.appendChild(helpTip);

  const textarea = document.createElement('textarea');
  textarea.className = 'recast-textarea';
  textarea.style.flex = '1';
  textarea.style.fontFamily = 'monospace';
  textarea.style.fontSize = '11px';
  textarea.style.lineHeight = '1.4';
  textarea.style.whiteSpace = 'pre';
  textarea.style.overflowWrap = 'normal';
  textarea.style.overflow = 'auto';

  if (initialData) {
    textarea.value = JSON.stringify(initialData, null, 2);
  }
  body.appendChild(textarea);

  const errorDiv = document.createElement('div');
  errorDiv.style.color = '#ff8a8a';
  errorDiv.style.fontSize = '11.5px';
  errorDiv.style.display = 'none';
  body.appendChild(errorDiv);

  modal.appendChild(body);

  // Footer
  const footer = document.createElement('div');
  footer.className = 'rc-diff-footer';

  if (mode === 'import' && defaultTemplate) {
    const templateBtn = document.createElement('button');
    templateBtn.className = 'rc-diff-btn rc-diff-reject-btn';
    templateBtn.textContent = '📋 Load Template';
    templateBtn.title = 'Fill with canonical schema template';
    templateBtn.onclick = () => {
      textarea.value = JSON.stringify(defaultTemplate, null, 2);
      errorDiv.style.display = 'none';
    };
    footer.appendChild(templateBtn);
  }

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'rc-diff-btn rc-diff-reject-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = closeJsonModal;
  footer.appendChild(cancelBtn);

  if (mode === 'export') {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'rc-diff-btn rc-diff-accept-btn';
    copyBtn.textContent = '📋 Copy to Clipboard';
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(textarea.value);
        hostCtx?.toast?.success?.('Copied card JSON to clipboard!');
        closeJsonModal();
      } catch {
        textarea.select();
        document.execCommand('copy');
        hostCtx?.toast?.success?.('Copied to clipboard!');
        closeJsonModal();
      }
    };
    footer.appendChild(copyBtn);
  } else {
    const importBtn = document.createElement('button');
    importBtn.className = 'rc-diff-btn rc-diff-accept-btn';
    importBtn.textContent = '📥 Validate & Import';
    importBtn.onclick = () => {
      errorDiv.style.display = 'none';
      try {
        const text = textarea.value.trim();
        if (!text) {
          throw new Error('Please enter JSON text to import.');
        }
        const parsed = JSON.parse(text);
        onImport?.(parsed);
        closeJsonModal();
      } catch (err: any) {
        errorDiv.textContent = `JSON Error: ${err?.message || err}`;
        errorDiv.style.display = 'block';
      }
    };
    footer.appendChild(importBtn);
  }

  modal.appendChild(footer);
  backdrop.appendChild(modal);
  backdrop.onclick = closeJsonModal;
  host.appendChild(backdrop);
}
