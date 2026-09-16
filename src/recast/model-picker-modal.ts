/**
 * Lumi:REcursion — Interactive Searchable Model Picker Modal
 * Renders a high-performance, searchable model selection dialog for Lumiverse connection profiles.
 */

let activeModelBackdropEl: HTMLElement | null = null;

export function closeModelPickerModal() {
  if (activeModelBackdropEl && activeModelBackdropEl.parentElement) {
    activeModelBackdropEl.remove();
  }
  activeModelBackdropEl = null;

  const host = document.getElementById('recursion-modal-host');
  if (host) {
    host.classList.remove('active');
  }
}

export interface ModelPickerOptions {
  title?: string;
  connectionName: string;
  models: string[];
  labels?: Record<string, string>;
  currentValue?: string;
  onSelect: (selectedModelId: string) => void;
}

export function showModelPickerModal(options: ModelPickerOptions) {
  closeModelPickerModal();

  const { title, connectionName, models, labels = {}, currentValue = '', onSelect } = options;

  let host = document.getElementById('recursion-modal-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'recursion-modal-host';
    document.body.appendChild(host);
  }
  host.classList.add('active');

  const backdrop = document.createElement('div');
  backdrop.id = 'recast_model_backdrop';
  backdrop.className = 'rc-model-backdrop';
  activeModelBackdropEl = backdrop;

  const modal = document.createElement('div');
  modal.id = 'recast_model_modal';
  modal.className = 'rc-model-modal';
  modal.onclick = (e) => e.stopPropagation();

  // 1. Header
  const header = document.createElement('div');
  header.className = 'rc-model-header';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'rc-model-title-group';
  titleGroup.innerHTML = `
    <div class="rc-model-title">🌐 ${title || 'Select Model Override'}</div>
    <div class="rc-model-subtitle">Connection: <strong>${escapeHtml(connectionName)}</strong> · ${models.length} models fetched</div>
  `;
  header.appendChild(titleGroup);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'rc-diff-close-btn';
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Close';
  closeBtn.onclick = closeModelPickerModal;
  header.appendChild(closeBtn);

  modal.appendChild(header);

  // 2. Search & Controls Bar
  const searchBar = document.createElement('div');
  searchBar.className = 'rc-model-search-bar';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'rc-model-search-input';
  searchInput.placeholder = '🔎 Filter models (e.g. flash, deepseek, gemini, claude, 4o)...';
  searchBar.appendChild(searchInput);

  modal.appendChild(searchBar);

  // Quick category tags
  const tagsRow = document.createElement('div');
  tagsRow.className = 'rc-model-tags-row';

  const families = ['All', 'Gemini', 'DeepSeek', 'Claude', 'GPT', 'Qwen', 'Llama', 'Grok', 'Mistral'];
  let activeTag = 'All';

  const tagButtons: HTMLButtonElement[] = [];

  families.forEach((fam) => {
    const btn = document.createElement('button');
    btn.className = `rc-model-tag-btn ${fam === 'All' ? 'active' : ''}`;
    btn.textContent = fam;
    btn.onclick = () => {
      activeTag = fam;
      tagButtons.forEach((b) => b.classList.toggle('active', b === btn));
      renderList();
    };
    tagButtons.push(btn);
    tagsRow.appendChild(btn);
  });

  const clearBtn = document.createElement('button');
  clearBtn.className = 'rc-model-tag-btn rc-model-clear-btn';
  clearBtn.innerHTML = '∅ Reset (Inherit)';
  clearBtn.title = 'Clear model override and inherit connection default';
  clearBtn.onclick = () => {
    onSelect('');
    closeModelPickerModal();
  };
  tagsRow.appendChild(clearBtn);

  modal.appendChild(tagsRow);

  // 3. Models Scrollable List
  const listContainer = document.createElement('div');
  listContainer.className = 'rc-model-list-container';
  modal.appendChild(listContainer);

  // 4. Footer
  const footer = document.createElement('div');
  footer.className = 'rc-model-footer';
  const countSpan = document.createElement('span');
  countSpan.className = 'rc-model-count-text';
  footer.appendChild(countSpan);

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'rc-diff-btn rc-diff-reject-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = closeModelPickerModal;
  footer.appendChild(cancelBtn);

  modal.appendChild(footer);

  // Rendering function
  const renderList = () => {
    const query = searchInput.value.trim().toLowerCase();
    listContainer.innerHTML = '';

    const filtered = models.filter((m) => {
      const label = (labels[m] || '').toLowerCase();
      const lowerM = m.toLowerCase();

      // Check tag family filter
      if (activeTag !== 'All') {
        const tagLower = activeTag.toLowerCase();
        if (!lowerM.includes(tagLower) && !label.includes(tagLower)) {
          return false;
        }
      }

      // Check search query
      if (!query) return true;
      return lowerM.includes(query) || label.includes(query);
    });

    countSpan.textContent = `Showing ${filtered.length} of ${models.length} models`;

    if (filtered.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'rc-model-empty';
      emptyDiv.textContent = 'No matching models found.';
      listContainer.appendChild(emptyDiv);
      return;
    }

    filtered.forEach((modelId) => {
      const item = document.createElement('div');
      item.className = `rc-model-item ${modelId === currentValue ? 'selected' : ''}`;

      const label = labels[modelId];

      item.innerHTML = `
        <div class="rc-model-item-main">
          <div class="rc-model-item-id">${escapeHtml(modelId)}</div>
          ${label ? `<div class="rc-model-item-label">${escapeHtml(label)}</div>` : ''}
        </div>
        ${modelId === currentValue ? '<span class="rc-model-item-badge">Active</span>' : ''}
      `;

      item.onclick = () => {
        onSelect(modelId);
        closeModelPickerModal();
      };

      listContainer.appendChild(item);
    });
  };

  searchInput.oninput = () => renderList();

  // Initial render
  renderList();

  backdrop.appendChild(modal);
  backdrop.onclick = closeModelPickerModal;
  document.body.appendChild(backdrop);

  // Auto focus search
  setTimeout(() => {
    searchInput.focus();
  }, 50);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
