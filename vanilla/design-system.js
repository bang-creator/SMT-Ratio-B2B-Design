const closeAll = (except) => document.querySelectorAll('[data-ds-open="true"]').forEach((root) => { if (root !== except) root.dataset.dsOpen = 'false'; });

document.querySelectorAll('[data-ds-switch]').forEach((control) => control.addEventListener('click', () => {
  const next = control.getAttribute('aria-checked') !== 'true';
  control.setAttribute('aria-checked', String(next));
}));

document.querySelectorAll('[data-ds-select]').forEach((root) => {
  const trigger = root.querySelector('.ds-select__trigger');
  const menu = root.querySelector('.ds-select__menu');
  const value = root.querySelector('[data-ds-value]');
  trigger?.addEventListener('click', () => {
    closeAll(root);
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

document.querySelectorAll('[data-ds-tabs]').forEach((root) => root.addEventListener('click', (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (!tab) return;
  root.querySelectorAll('[role="tab"]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  root.querySelectorAll('[role="tabpanel"]').forEach((panel) => { panel.hidden = panel.id !== tab.dataset.panel; });
}));

document.querySelectorAll('[data-ds-menu]').forEach((root) => root.querySelector('button')?.addEventListener('click', () => {
  closeAll(root);
  const open = root.dataset.dsOpen !== 'true';
  root.dataset.dsOpen = String(open);
  root.querySelector('.ds-popover__content').hidden = !open;
}));

document.querySelectorAll('[data-ds-dialog-open]').forEach((button) => button.addEventListener('click', () => {
  const dialog = document.querySelector(button.dataset.dsDialogOpen);
  if (dialog) { dialog.hidden = false; dialog.querySelector('button')?.focus(); }
}));
document.querySelectorAll('[data-ds-dialog-close]').forEach((button) => button.addEventListener('click', () => {
  const dialog = button.closest('[role="dialog"]');
  if (dialog) dialog.hidden = true;
}));

document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('[data-ds-select], [data-ds-menu]')) closeAll();
  if (event.target.matches('.ds-dialog__backdrop')) event.target.closest('[role="dialog"]')?.setAttribute('hidden', '');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeAll(); document.querySelectorAll('[role="dialog"]:not([hidden])').forEach((dialog) => { dialog.hidden = true; }); }
});
