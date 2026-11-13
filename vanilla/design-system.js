const closeAll = (scope, except) => scope.querySelectorAll('[data-ds-open="true"]').forEach((root) => {
  if (root !== except) {
    root.dataset.dsOpen = 'false';
    const menu = root.querySelector('.ds-menu__content, .ds-popover__content, .ds-select__menu, .ds-date-picker__dialog');
    if (menu) menu.hidden = true;
    const trigger = root.querySelector('[aria-expanded]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
});

export function mount(scope = document) {
  scope.querySelectorAll('[data-ds-segmented]').forEach((root) => {
    const thumb = root.querySelector('.ds-segmented__thumb');
    const allButtons = Array.from(root.querySelectorAll('button'));
    const getItems = () => allButtons.filter((b) => !b.disabled && !b.hasAttribute('data-disabled'));

    const updateThumb = (targetBtn, immediate = false) => {
      if (!thumb || !targetBtn) return;
      if (immediate) {
        thumb.style.setProperty('transition', 'none');
      }
      root.style.setProperty('--thumb-left', `${targetBtn.offsetLeft}px`);
      root.style.setProperty('--thumb-width', `${targetBtn.offsetWidth}px`);
      root.dataset.dsReady = 'true';
      if (immediate) {
        void thumb.offsetHeight;
        thumb.style.removeProperty('transition');
      }
    };

    const activate = (btn) => {
      if (!btn || btn.disabled || btn.hasAttribute('data-disabled')) return;
      allButtons.forEach((b) => {
        const isCurrent = b === btn;
        b.setAttribute('aria-pressed', String(isCurrent));
        b.setAttribute('aria-checked', String(isCurrent));
        b.dataset.state = isCurrent ? 'on' : 'off';
      });
      updateThumb(btn, false);
      root.dispatchEvent(new CustomEvent('ds-change', {
        bubbles: true,
        detail: {
          value: btn.dataset.value ?? btn.textContent.trim(),
          index: allButtons.indexOf(btn),
        },
      }));
    };

    allButtons.forEach((btn) => {
      btn.addEventListener('click', () => activate(btn));
      btn.addEventListener('keydown', (event) => {
        const validItems = getItems();
        const currentIndex = validItems.indexOf(btn);
        if (currentIndex === -1) return;
        let nextIndex = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % validItems.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + validItems.length) % validItems.length;
        }
        if (nextIndex !== -1) {
          event.preventDefault();
          validItems[nextIndex].focus();
          activate(validItems[nextIndex]);
        }
      });
    });

    const initial = allButtons.find((b) => b.getAttribute('aria-pressed') === 'true' || b.getAttribute('aria-checked') === 'true') || allButtons[0];
    if (initial) {
      requestAnimationFrame(() => updateThumb(initial, true));
    }

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        const current = allButtons.find((b) => b.getAttribute('aria-pressed') === 'true' || b.getAttribute('aria-checked') === 'true') || allButtons[0];
        if (current) updateThumb(current, true);
      });
      ro.observe(root);
    }
  });

  scope.querySelectorAll('[data-ds-switch]').forEach((control) => {
    control.addEventListener('click', () => {
      if (control.disabled || control.hasAttribute('data-disabled')) return;
      const next = control.getAttribute('aria-checked') !== 'true';
      control.setAttribute('aria-checked', String(next));
      control.dispatchEvent(new CustomEvent('ds-switch-change', { bubbles: true, detail: { checked: next } }));
    });
    control.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        control.click();
      }
    });
  });
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
  scope.querySelectorAll('[data-ds-tabs]').forEach((root) => {
    const indicator = root.querySelector('.ds-tabs__indicator');
    const allTabs = Array.from(root.querySelectorAll('[role="tab"], .ds-tab'));
    const getTabs = () => allTabs.filter((t) => !t.disabled && !t.hasAttribute('data-disabled'));

    const updateIndicator = (targetTab, immediate = false) => {
      if (!indicator || !targetTab) return;
      if (immediate) {
        indicator.style.setProperty('transition', 'none');
      }
      root.style.setProperty('--tab-left', `${targetTab.offsetLeft}px`);
      root.style.setProperty('--tab-width', `${targetTab.offsetWidth}px`);
      root.dataset.dsReady = 'true';
      if (immediate) {
        void indicator.offsetHeight;
        indicator.style.removeProperty('transition');
      }
    };

    const activate = (tab) => {
      if (!tab || tab.disabled || tab.hasAttribute('data-disabled')) return;
      allTabs.forEach((t) => {
        const isCurrent = t === tab;
        t.setAttribute('aria-selected', String(isCurrent));
        t.dataset.state = isCurrent ? 'on' : 'off';
      });
      updateIndicator(tab, false);

      const panelId = tab.dataset.panel ?? tab.getAttribute('aria-controls');
      if (panelId) {
        const parentScope = root.closest('.ds-stack') || root.parentElement || scope;
        parentScope.querySelectorAll('[role="tabpanel"], .ds-tabpanel').forEach((panel) => {
          panel.hidden = panel.id !== panelId;
        });
      }

      root.dispatchEvent(new CustomEvent('ds-tab-change', {
        bubbles: true,
        detail: {
          value: tab.dataset.value ?? tab.textContent.trim(),
          index: allTabs.indexOf(tab),
        },
      }));
    };

    allTabs.forEach((tab) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        const validTabs = getTabs();
        const currentIndex = validTabs.indexOf(tab);
        if (currentIndex === -1) return;
        let nextIndex = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % validTabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + validTabs.length) % validTabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = validTabs.length - 1;
        }
        if (nextIndex !== -1) {
          event.preventDefault();
          validTabs[nextIndex].focus();
          activate(validTabs[nextIndex]);
        }
      });
    });

    const initial = allTabs.find((t) => t.getAttribute('aria-selected') === 'true') || allTabs[0];
    if (initial) {
      requestAnimationFrame(() => updateIndicator(initial, true));
    }

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        const current = allTabs.find((t) => t.getAttribute('aria-selected') === 'true') || allTabs[0];
        if (current) updateIndicator(current, true);
      });
      ro.observe(root);
    }
  });
  scope.querySelectorAll('[data-ds-menu]').forEach((root) => {
    const trigger = root.querySelector('.ds-menu__trigger, button');
    const menu = root.querySelector('.ds-menu__content, .ds-popover__content, [role="menu"]');
    if (!trigger || !menu) return;

    const getItems = () => Array.from(menu.querySelectorAll('.ds-menu__item:not([disabled]):not([data-disabled]), [role="menuitem"]:not([disabled]):not([data-disabled])'));

    const setOpen = (open) => {
      if (open) closeAll(scope, root);
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      if (open) {
        const items = getItems();
        if (items.length) {
          requestAnimationFrame(() => items[0].focus());
        }
      }
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = root.dataset.dsOpen !== 'true';
      setOpen(open);
    });

    root.addEventListener('keydown', (event) => {
      const items = getItems();
      const current = document.activeElement;
      const index = items.indexOf(current);

      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        trigger.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (root.dataset.dsOpen !== 'true') {
          setOpen(true);
        } else if (items.length) {
          const next = index === -1 ? 0 : (index + 1) % items.length;
          items[next].focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (root.dataset.dsOpen !== 'true') {
          setOpen(true);
        } else if (items.length) {
          const prev = index === -1 ? items.length - 1 : (index - 1 + items.length) % items.length;
          items[prev].focus();
        }
      } else if (event.key === 'Home') {
        if (items.length) { event.preventDefault(); items[0].focus(); }
      } else if (event.key === 'End') {
        if (items.length) { event.preventDefault(); items[items.length - 1].focus(); }
      }
    });

    menu.querySelectorAll('.ds-menu__item, [role="menuitem"]').forEach((item) => {
      item.addEventListener('click', () => {
        if (item.disabled || item.hasAttribute('data-disabled')) return;
        setOpen(false);
        trigger.focus();
        root.dispatchEvent(new CustomEvent('ds-select', {
          bubbles: true,
          detail: {
            value: item.dataset.value ?? item.textContent.trim(),
          },
        }));
      });
    });
  });
  scope.querySelectorAll('[data-ds-dialog-open]').forEach((button) => button.addEventListener('click', () => {
    const dialog = scope.querySelector(button.dataset.dsDialogOpen);
    if (dialog) { dialog.hidden = false; dialog.querySelector('button')?.focus(); }
  }));
  scope.querySelectorAll('[data-ds-dialog-close]').forEach((button) => button.addEventListener('click', () => {
    const dialog = button.closest('[role="dialog"]');
    if (dialog) dialog.hidden = true;
  }));
  scope.querySelectorAll('[data-ds-search-input], [data-ds-clearable]').forEach((root) => {
    const input = root.querySelector('input');
    const clearBtn = root.querySelector('.ds-search-input__clear, .ds-clear-btn');
    if (!input) return;

    const syncClear = () => {
      if (clearBtn) {
        clearBtn.hidden = input.value.length === 0;
      }
    };

    input.addEventListener('input', syncClear);
    input.addEventListener('focus', () => { root.dataset.focused = 'true'; });
    input.addEventListener('blur', () => { root.dataset.focused = 'false'; });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && input.value) {
        event.stopPropagation();
        input.value = '';
        syncClear();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        syncClear();
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }

    syncClear();
  });

  scope.querySelectorAll('[data-ds-password-wrap]').forEach((root) => {
    const input = root.querySelector('input');
    const toggleBtn = root.querySelector('[data-ds-password-toggle]');
    if (!input || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      toggleBtn.setAttribute('data-visible', isPassword ? 'true' : 'false');
      input.focus();
    });
  });

  scope.querySelectorAll('[data-ds-number-stepper]').forEach((root) => {
    const input = root.querySelector('input');
    if (!input) return;
    const step = parseFloat(input.step) || 1;
    const min = input.min !== '' ? parseFloat(input.min) : -Infinity;
    const max = input.max !== '' ? parseFloat(input.max) : Infinity;

    root.querySelectorAll('[data-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        let val = parseFloat(input.value) || 0;
        if (btn.dataset.step === 'up') {
          val = Math.min(max, val + step);
        } else {
          val = Math.max(min, val - step);
        }
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  scope.querySelectorAll('.ds-slider, [data-ds-slider]').forEach((root) => {
    const input = root.querySelector('input[type="range"]');
    const readout = root.querySelector('[data-ds-readout], .ds-slider__readout, .ds-row > .ds-muted');
    if (!input || !readout) return;
    input.addEventListener('input', () => {
      readout.textContent = input.value;
    });
  });
  scope.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('[data-ds-select], [data-ds-menu], [data-ds-date-picker]')) closeAll(scope);
    if (event.target.matches('.ds-dialog__backdrop')) event.target.closest('[role="dialog"]')?.setAttribute('hidden', '');
  });
  scope.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeAll(scope); scope.querySelectorAll('[role="dialog"]:not([hidden])').forEach((dialog) => { dialog.hidden = true; }); }
  });
}
