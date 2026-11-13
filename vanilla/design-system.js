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

  scope.querySelectorAll('.ds-checkbox input[type="checkbox"][data-indeterminate="true"], .ds-checkbox[data-indeterminate="true"] input[type="checkbox"]').forEach((input) => {
    input.indeterminate = true;
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
    const labelSpan = root.querySelector('[data-date-label], .ds-date-picker__label');

    trigger?.addEventListener('click', () => {
      closeAll(scope, root);
      const open = root.dataset.dsOpen !== 'true';
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      if (dialog) dialog.hidden = !open;
    });

    const dayBtns = Array.from(root.querySelectorAll('.ds-date-picker__day[data-date]'));

    const clearRangeUI = () => {
      dayBtns.forEach((btn) => {
        btn.classList.remove('ds-date-picker__day--start', 'ds-date-picker__day--end');
        btn.parentElement?.classList.remove('ds-date-picker__cell--range-start', 'ds-date-picker__cell--range-mid', 'ds-date-picker__cell--range-end');
      });
    };

    const applyRangeUI = (startStr, endStr) => {
      clearRangeUI();
      if (!startStr) return;
      if (!endStr) {
        const startBtn = root.querySelector(`.ds-date-picker__day[data-date="${startStr}"]`);
        if (startBtn) {
          startBtn.classList.add('ds-date-picker__day--start');
          startBtn.parentElement?.classList.add('ds-date-picker__cell--range-start');
        }
        return;
      }

      let s = startStr;
      let e = endStr;
      if (s > e) {
        const temp = s;
        s = e;
        e = temp;
      }

      dayBtns.forEach((btn) => {
        const d = btn.dataset.date;
        if (!d) return;
        const cell = btn.parentElement;
        if (d === s && d === e) {
          btn.classList.add('ds-date-picker__day--start', 'ds-date-picker__day--end');
          cell?.classList.add('ds-date-picker__cell--range-start', 'ds-date-picker__cell--range-end');
        } else if (d === s) {
          btn.classList.add('ds-date-picker__day--start');
          cell?.classList.add('ds-date-picker__cell--range-start');
        } else if (d === e) {
          btn.classList.add('ds-date-picker__day--end');
          cell?.classList.add('ds-date-picker__cell--range-end');
        } else if (d > s && d < e) {
          cell?.classList.add('ds-date-picker__cell--range-mid');
        }
      });
    };

    const setPresetActive = (presetName) => {
      root.querySelectorAll('.ds-date-picker__preset').forEach((p) => {
        const isMatch = p.dataset.preset === presetName || p.textContent.trim().startsWith(presetName);
        p.setAttribute('aria-selected', String(isMatch));
        const check = p.querySelector('.ds-date-picker__check');
        if (check) check.remove();
        if (isMatch) {
          const checkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          checkIcon.setAttribute('class', 'ds-date-picker__check');
          checkIcon.setAttribute('viewBox', '0 0 16 16');
          checkIcon.innerHTML = '<path d="M13.5 4.5 6.5 11.5 3 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
          p.appendChild(checkIcon);
        }
      });
    };

    // Date range click handler
    let pickingStart = null;

    dayBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dateStr = btn.dataset.date;
        if (!dateStr) return;

        // Single Month Picker Mode (Single Date Selection)
        if (root.querySelector('.ds-date-picker__single-calendar')) {
          clearRangeUI();
          btn.classList.add('ds-date-picker__day--start');
          const formatDate = (iso) => {
            const parts = iso.split('-');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`;
          };
          if (labelSpan) {
            labelSpan.textContent = `${formatDate(dateStr)}, 2026`;
          }
          root.dispatchEvent(new CustomEvent('ds-change', {
            bubbles: true,
            detail: { date: dateStr },
          }));
          return;
        }

        if (!pickingStart) {
          // First click: select start date
          pickingStart = dateStr;
          root.dataset.picking = 'true';
          applyRangeUI(pickingStart, null);
        } else {
          // Second click: select end date
          let start = pickingStart;
          let end = dateStr;
          if (start > end) {
            const temp = start;
            start = end;
            end = temp;
          }
          pickingStart = null;
          delete root.dataset.picking;
          applyRangeUI(start, end);

          // Update trigger label
          const formatDate = (iso) => {
            const parts = iso.split('-');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`;
          };
          if (labelSpan) {
            labelSpan.textContent = `${formatDate(start)} – ${formatDate(end)}, 2026`;
          }

          // Clear preset checkmark if custom range
          root.querySelectorAll('.ds-date-picker__preset').forEach((p) => {
            p.setAttribute('aria-selected', 'false');
            p.querySelector('.ds-date-picker__check')?.remove();
          });

          root.dispatchEvent(new CustomEvent('ds-change', {
            bubbles: true,
            detail: { start, end },
          }));
        }
      });

      // Hover preview while picking
      btn.addEventListener('mouseenter', () => {
        if (root.dataset.picking === 'true' && pickingStart) {
          applyRangeUI(pickingStart, btn.dataset.date);
        }
      });
    });

    // Preset selection
    root.querySelectorAll('.ds-date-picker__preset').forEach((preset) => {
      preset.addEventListener('click', (e) => {
        e.stopPropagation();
        const presetKey = preset.dataset.preset;
        pickingStart = null;
        delete root.dataset.picking;

        let start = '2026-11-07';
        let end = '2026-11-13';
        let label = 'Last 7 days';

        if (presetKey === 'last-7-days') {
          start = '2026-11-07';
          end = '2026-11-13';
          label = 'Last 7 days';
        } else if (presetKey === 'last-14-days') {
          start = '2026-10-31';
          end = '2026-11-13';
          label = 'Last 14 days';
        } else if (presetKey === 'last-30-days') {
          start = '2026-10-15';
          end = '2026-11-13';
          label = 'Last 30 days';
        } else if (presetKey === 'week-to-date') {
          start = '2026-11-08';
          end = '2026-11-13';
          label = 'Week to date';
        } else if (presetKey === 'month-to-date') {
          start = '2026-11-01';
          end = '2026-11-13';
          label = 'Month to date';
        }

        setPresetActive(presetKey);
        applyRangeUI(start, end);
        if (labelSpan) labelSpan.textContent = label;

        root.dispatchEvent(new CustomEvent('ds-change', {
          bubbles: true,
          detail: { preset: label, start, end },
        }));
      });
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

  // ── Charts: Stacked Bar (Usage Daily Costs) ──
  scope.querySelectorAll('[data-ds-chart="stacked-bar"]').forEach((root) => {
    const columns = Array.from(root.querySelectorAll('.ds-chart-col'));
    let tooltip = root.querySelector('.ds-chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'ds-chart-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('aria-hidden', 'true');
      root.appendChild(tooltip);
    }

    const showCol = (col) => {
      if (!col) return;
      columns.forEach((c) => {
        const isCurrent = c === col;
        c.dataset.active = String(isCurrent);
        c.dataset.dimmed = String(!isCurrent);
      });

      const date = col.dataset.date || '';
      const total = col.dataset.total || '';
      let breakdown = [];
      try {
        breakdown = JSON.parse(col.dataset.breakdown || '[]');
      } catch (e) {
        breakdown = [];
      }

      let rowsHtml = '';
      breakdown.forEach((item) => {
        rowsHtml += `<div class="ds-chart-tooltip__row">
          <span class="ds-chart-tooltip__item">
            <span class="ds-chart-tooltip__dot ds-chart-tooltip__dot--${item.color}"></span>
            <span>${item.label}</span>
          </span>
          <span class="ds-chart-tooltip__val">${item.val}</span>
        </div>`;
      });

      tooltip.innerHTML = `<div class="ds-chart-tooltip__header">
        <span>${date}</span>
        <span class="ds-chart-tooltip__val">${total}</span>
      </div>
      <div class="ds-chart-tooltip__total">${total} <span class="ds-muted">total</span></div>
      <div class="ds-chart-tooltip__rows">${rowsHtml}</div>`;

      const colRect = col.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const x = colRect.left + colRect.width / 2 - rootRect.left;
      const y = colRect.top - rootRect.top;

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      tooltip.dataset.visible = 'true';
      tooltip.setAttribute('aria-hidden', 'false');
    };

    const hideCol = () => {
      columns.forEach((c) => {
        delete c.dataset.active;
        delete c.dataset.dimmed;
      });
      tooltip.dataset.visible = 'false';
      tooltip.setAttribute('aria-hidden', 'true');
    };

    columns.forEach((col, idx) => {
      col.setAttribute('tabindex', '0');
      col.setAttribute('role', 'button');
      col.addEventListener('mouseenter', () => showCol(col));
      col.addEventListener('focus', () => showCol(col));
      col.addEventListener('mouseleave', hideCol);
      col.addEventListener('blur', hideCol);
      col.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = columns[(idx + 1) % columns.length];
          next.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = columns[(idx - 1 + columns.length) % columns.length];
          prev.focus();
        }
      });
    });

    // Legend filter interaction
    root.querySelectorAll('[data-legend-series]').forEach((legend) => {
      const series = legend.dataset.legendSeries;
      legend.addEventListener('mouseenter', () => {
        legend.dataset.active = 'true';
        root.querySelectorAll('.ds-chart-seg').forEach((seg) => {
          if (seg.dataset.series === series) {
            seg.dataset.highlight = 'true';
            delete seg.dataset.dimmed;
          } else {
            seg.dataset.dimmed = 'true';
            delete seg.dataset.highlight;
          }
        });
      });
      legend.addEventListener('mouseleave', () => {
        delete legend.dataset.active;
        root.querySelectorAll('.ds-chart-seg').forEach((seg) => {
          delete seg.dataset.highlight;
          delete seg.dataset.dimmed;
        });
      });
    });
  });

  // ── Charts: Area & Time-Series (Home Activity) ──
  scope.querySelectorAll('[data-ds-chart="area"]').forEach((root) => {
    const stage = root.querySelector('.ds-chart-area__stage');
    const svg = root.querySelector('.ds-chart-area__svg');
    const cursorLine = root.querySelector('.ds-chart-area__cursor-line');
    const cursorDot = root.querySelector('.ds-chart-area__cursor-dot');
    let tooltip = root.querySelector('.ds-chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'ds-chart-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('aria-hidden', 'true');
      root.appendChild(tooltip);
    }

    let points = [];
    try {
      points = JSON.parse(root.dataset.points || '[]');
    } catch (e) {
      points = [];
    }
    if (!stage || !svg || !points.length) return;

    let activeIndex = -1;

    const renderPoint = (index) => {
      if (index < 0 || index >= points.length) return;
      activeIndex = index;
      const pt = points[index];

      if (cursorLine) {
        cursorLine.setAttribute('x1', pt.x);
        cursorLine.setAttribute('x2', pt.x);
      }
      if (cursorDot) {
        cursorDot.setAttribute('cx', pt.x);
        cursorDot.setAttribute('cy', pt.y);
      }

      tooltip.innerHTML = `<div class="ds-chart-tooltip__header">
        <span>${pt.date}</span>
      </div>
      <div class="ds-chart-tooltip__total">${pt.val}</div>
      <div class="ds-chart-tooltip__row">
        <span class="ds-muted">${pt.detail || ''}</span>
      </div>`;

      const stageRect = stage.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const viewBoxWidth = 600;
      const viewBoxHeight = 200;
      const scaleX = stageRect.width / viewBoxWidth;
      const scaleY = stageRect.height / viewBoxHeight;

      const pxX = stageRect.left - rootRect.left + pt.x * scaleX;
      const pxY = stageRect.top - rootRect.top + pt.y * scaleY;

      tooltip.style.left = `${pxX}px`;
      tooltip.style.top = `${pxY}px`;
      root.dataset.active = 'true';
      tooltip.dataset.visible = 'true';
      tooltip.setAttribute('aria-hidden', 'false');
    };

    const clearPoint = () => {
      delete root.dataset.active;
      tooltip.dataset.visible = 'false';
      tooltip.setAttribute('aria-hidden', 'true');
      activeIndex = -1;
    };

    stage.setAttribute('tabindex', '0');
    stage.setAttribute('role', 'region');
    stage.setAttribute('aria-label', 'Interactive time series chart');

    stage.addEventListener('mousemove', (e) => {
      const stageRect = stage.getBoundingClientRect();
      const relX = (e.clientX - stageRect.left) / stageRect.width * 600;

      let closestIdx = 0;
      let minDiff = Infinity;
      points.forEach((pt, idx) => {
        const diff = Math.abs(pt.x - relX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      renderPoint(closestIdx);
    });

    stage.addEventListener('mouseleave', clearPoint);
    stage.addEventListener('blur', clearPoint);

    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = activeIndex === -1 ? 0 : Math.min(points.length - 1, activeIndex + 1);
        renderPoint(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = activeIndex === -1 ? points.length - 1 : Math.max(0, activeIndex - 1);
        renderPoint(prev);
      }
    });
  });

  // ── Charts: Donut (Usage Distribution) ──
  scope.querySelectorAll('[data-ds-chart="donut"]').forEach((root) => {
    const segments = Array.from(root.querySelectorAll('.ds-chart-donut__segment'));
    const legendRows = Array.from(root.querySelectorAll('.ds-chart-donut__legend-row'));
    const centerVal = root.querySelector('.ds-chart-donut__center-value');
    const centerLabel = root.querySelector('.ds-chart-donut__center-label');

    const defaultVal = centerVal ? centerVal.textContent.trim() : '';
    const defaultLabel = centerLabel ? centerLabel.textContent.trim() : '';

    const activateSeries = (series) => {
      if (!series) return;
      segments.forEach((seg) => {
        const match = seg.dataset.series === series;
        seg.dataset.active = String(match);
        seg.dataset.dimmed = String(!match);
        if (match && centerVal && centerLabel) {
          centerVal.textContent = seg.dataset.val || defaultVal;
          centerLabel.textContent = seg.dataset.label || defaultLabel;
        }
      });
      legendRows.forEach((row) => {
        const match = row.dataset.series === series;
        row.dataset.active = String(match);
        row.dataset.dimmed = String(!match);
      });
    };

    const resetSeries = () => {
      segments.forEach((seg) => {
        delete seg.dataset.active;
        delete seg.dataset.dimmed;
      });
      legendRows.forEach((row) => {
        delete row.dataset.active;
        delete row.dataset.dimmed;
      });
      if (centerVal) centerVal.textContent = defaultVal;
      if (centerLabel) centerLabel.textContent = defaultLabel;
    };

    segments.forEach((seg) => {
      const series = seg.dataset.series;
      seg.setAttribute('tabindex', '0');
      seg.setAttribute('role', 'button');
      seg.setAttribute('aria-label', `${seg.dataset.label}: ${seg.dataset.val}`);
      seg.addEventListener('mouseenter', () => activateSeries(series));
      seg.addEventListener('focus', () => activateSeries(series));
      seg.addEventListener('mouseleave', resetSeries);
      seg.addEventListener('blur', resetSeries);
    });

    legendRows.forEach((row) => {
      const series = row.dataset.series;
      row.setAttribute('tabindex', '0');
      row.addEventListener('mouseenter', () => activateSeries(series));
      row.addEventListener('focus', () => activateSeries(series));
      row.addEventListener('mouseleave', resetSeries);
      row.addEventListener('blur', resetSeries);
    });
  });

  // ── Range Switcher Buttons in Chart Headers ──
  scope.querySelectorAll('[data-chart-range]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.ds-chart__toolbar, .ds-row, .ds-chart__header');
      if (group) {
        group.querySelectorAll('[data-chart-range]').forEach((b) => {
          b.setAttribute('aria-pressed', String(b === btn));
          if (b === btn) {
            b.classList.remove('ds-button--ghost');
            b.classList.add('ds-button--outline');
          } else {
            b.classList.add('ds-button--ghost');
            b.classList.remove('ds-button--outline');
          }
        });
      }
    });
  });

  // ── Data Table Interactive Selection & Sorting ──
  scope.querySelectorAll('.ds-table').forEach((table) => {
    const headerCheck = table.querySelector('thead input[type="checkbox"]');
    const rowChecks = Array.from(table.querySelectorAll('tbody input[type="checkbox"]'));
    if (headerCheck) {
      headerCheck.addEventListener('change', () => {
        const isChecked = headerCheck.checked;
        rowChecks.forEach((chk) => {
          chk.checked = isChecked;
          const tr = chk.closest('tr');
          if (tr) tr.dataset.selected = String(isChecked);
        });
      });
    }
    rowChecks.forEach((chk) => {
      chk.addEventListener('change', () => {
        const tr = chk.closest('tr');
        if (tr) tr.dataset.selected = String(chk.checked);
        if (headerCheck) {
          const allChecked = rowChecks.length > 0 && rowChecks.every((c) => c.checked);
          headerCheck.checked = allChecked;
        }
      });
    });
    table.querySelectorAll('th.ds-table__sortable').forEach((th) => {
      th.addEventListener('click', () => {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        const currentSort = th.dataset.sort;
        const newSort = currentSort === 'desc' ? 'asc' : 'desc';

        th.parentNode.querySelectorAll('th.ds-table__sortable').forEach((sibling) => {
          if (sibling !== th) {
            delete sibling.dataset.sort;
            sibling.removeAttribute('aria-sort');
          }
        });

        th.dataset.sort = newSort;
        th.setAttribute('aria-sort', newSort === 'asc' ? 'ascending' : 'descending');

        const colIndex = Array.from(th.parentNode.children).indexOf(th);
        const rows = Array.from(tbody.querySelectorAll('tr:not(.ds-table__empty-row)'));
        if (rows.length < 2) return;

        rows.sort((a, b) => {
          const cellA = (a.children[colIndex]?.textContent || '').trim();
          const cellB = (b.children[colIndex]?.textContent || '').trim();

          const timeA = Date.parse(cellA);
          const timeB = Date.parse(cellB);
          let cmp = 0;
          if (!isNaN(timeA) && !isNaN(timeB)) {
            cmp = timeA - timeB;
          } else if (!isNaN(timeA) && isNaN(timeB)) {
            cmp = 1;
          } else if (isNaN(timeA) && !isNaN(timeB)) {
            cmp = -1;
          } else {
            const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
            const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(numA) && !isNaN(numB) && cellA.includes('$')) {
              cmp = numA - numB;
            } else {
              cmp = cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' });
            }
          }
          return newSort === 'asc' ? cmp : -cmp;
        });

        rows.forEach((r) => tbody.appendChild(r));
      });
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
