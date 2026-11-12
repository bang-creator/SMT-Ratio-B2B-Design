const closeAll = (scope, except) => scope.querySelectorAll('[data-ds-open="true"]').forEach((root) => { if (root !== except) root.dataset.dsOpen = 'false'; });

export function mount(scope = document) {
  scope.querySelectorAll('[data-ds-switch]').forEach((control) => control.addEventListener('click', () => {
    const next = control.getAttribute('aria-checked') !== 'true';
    control.setAttribute('aria-checked', String(next));
  }));
  scope.querySelectorAll('[data-ds-select]').forEach((root) => {
    const trigger = root.querySelector('.ds-select__trigger');
    const menu = root.querySelector('.ds-select__menu');
    const value = root.querySelector('[data-ds-value]');
    trigger?.addEventListener('click', () => {
      closeAll(scope, root);
      const open = root.dataset.dsOpen !== 'true';
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      if (menu) menu.hidden = !open;
    });
    root.querySelectorAll('[role="option"]').forEach((option) => option.addEventListener('click', () => {
      root.dataset.value = option.dataset.value ?? option.textContent.trim();
      if (value) value.textContent = option.textContent.trim();
      root.querySelectorAll('[role="option"]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
      root.dataset.dsOpen = 'false';
      trigger?.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
      root.dispatchEvent(new CustomEvent('ds-change', { bubbles: true, detail: { value: root.dataset.value } }));
    }));
  });
  scope.querySelectorAll('[data-ds-date-picker]').forEach((root) => {
    const trigger = root.querySelector('.ds-date-picker__trigger');
    const dialog = root.querySelector('.ds-date-picker__dialog');
    trigger?.addEventListener('click', () => {
      closeAll(scope, root);
      const open = root.dataset.dsOpen !== 'true';
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      if (dialog) dialog.hidden = !open;
    });
  });
  scope.querySelectorAll('[data-ds-tabs]').forEach((root) => root.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;
    root.querySelectorAll('[role="tab"]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    root.querySelectorAll('[role="tabpanel"]').forEach((panel) => { panel.hidden = panel.id !== tab.dataset.panel; });
  }));
  scope.querySelectorAll('[data-ds-menu]').forEach((root) => root.querySelector('button')?.addEventListener('click', () => {
    closeAll(scope, root);
    const open = root.dataset.dsOpen !== 'true';
    root.dataset.dsOpen = String(open);
    root.querySelector('.ds-popover__content').hidden = !open;
  }));
  scope.querySelectorAll('[data-ds-dialog-open]').forEach((button) => button.addEventListener('click', () => {
    const dialog = scope.querySelector(button.dataset.dsDialogOpen);
    if (dialog) { dialog.hidden = false; dialog.querySelector('button')?.focus(); }
  }));
  scope.querySelectorAll('[data-ds-dialog-close]').forEach((button) => button.addEventListener('click', () => {
    const dialog = button.closest('[role="dialog"]');
    if (dialog) dialog.hidden = true;
  }));
  scope.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('[data-ds-select], [data-ds-menu], [data-ds-date-picker]')) closeAll(scope);
    if (event.target.matches('.ds-dialog__backdrop')) event.target.closest('[role="dialog"]')?.setAttribute('hidden', '');
  });
  scope.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeAll(scope); scope.querySelectorAll('[role="dialog"]:not([hidden])').forEach((dialog) => { dialog.hidden = true; }); }
  });
}
