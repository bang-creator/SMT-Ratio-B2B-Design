const closeAll = (scope, except) => scope.querySelectorAll('[data-ds-open="true"]').forEach((root) => {
  if (root !== except) {
    root.dataset.dsOpen = 'false';
    const menu = root.querySelector('.ds-menu__content, .ds-popover__content, .ds-select__menu, .ds-date-picker__dialog, .ds-dropdown__menu, .ds-filter__menu');
    if (menu) menu.hidden = true;
    const trigger = root.querySelector('[aria-expanded]');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.blur();
    }
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

  scope.querySelectorAll('.ds-checkbox input[type="checkbox"]').forEach((input) => {
    if (input.dataset.indeterminate === 'true' || input.closest('.ds-checkbox')?.dataset?.indeterminate === 'true') {
      input.indeterminate = true;
    }
    input.addEventListener('change', () => {
      input.indeterminate = false;
      input.removeAttribute('data-indeterminate');
      delete input.dataset.indeterminate;
      const label = input.closest('.ds-checkbox');
      if (label) {
        label.removeAttribute('data-indeterminate');
        delete label.dataset.indeterminate;
      }
    });
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
      if (!open) {
        trigger.blur();
      }
    });
    root.querySelectorAll('[role="option"]').forEach((option) => option.addEventListener('click', () => {
      option.blur();
      root.dataset.value = option.dataset.value ?? option.textContent.trim();
      if (value) value.textContent = option.textContent.trim();
      root.querySelectorAll('[role="option"]').forEach((item) => item.setAttribute('aria-selected', String(item === option)));
      root.dataset.dsOpen = 'false';
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.blur();
      if (menu) menu.hidden = true;
      root.dispatchEvent(new CustomEvent('ds-change', { bubbles: true, detail: { value: root.dataset.value } }));
    }));
  });
  scope.querySelectorAll('[data-ds-dropdown]').forEach((root) => {
    const trigger = root.querySelector('.ds-select__trigger, .ds-dropdown__trigger, .ds-breadcrumb__trigger');
    const menu = root.querySelector('.ds-select__menu, .ds-dropdown__menu');
    const searchInput = root.querySelector('.ds-search-input__field, .ds-dropdown__search-input');
    const labelSpan = root.querySelector('[data-ds-dropdown-value], [data-ds-value], .ds-dropdown__value');
    const isMulti = root.hasAttribute('data-multi') || root.dataset.multi === 'true';

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (trigger.disabled) return;
      closeAll(scope, root);
      const open = root.dataset.dsOpen !== 'true';
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      if (menu) menu.hidden = !open;
      if (!open) {
        trigger.blur();
      }
      if (open && searchInput) {
        setTimeout(() => searchInput.focus(), 50);
      }
    });

    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      root.querySelectorAll('.ds-select__option, .ds-dropdown__item').forEach((item) => {
        const text = item.textContent.trim().toLowerCase();
        item.hidden = q.length > 0 && !text.includes(q);
      });
    });

    searchInput?.addEventListener('click', (e) => e.stopPropagation());
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        root.dataset.dsOpen = 'false';
        trigger?.setAttribute('aria-expanded', 'false');
        if (menu) menu.hidden = true;
      }
    });

    const updateMultiLabel = () => {
      const checkedItems = Array.from(root.querySelectorAll('.ds-select__option[data-checked="true"], .ds-select__option[aria-checked="true"], .ds-dropdown__item[data-checked="true"], .ds-dropdown__item[aria-checked="true"]'));
      const placeholder = root.dataset.placeholder || 'Select...';
      if (labelSpan) {
        if (checkedItems.length === 0) {
          labelSpan.textContent = placeholder;
        } else if (checkedItems.length === 1 && !root.dataset.forceCount) {
          const itemText = checkedItems[0].querySelector('span:last-child')?.textContent || checkedItems[0].textContent.trim();
          labelSpan.textContent = itemText;
        } else {
          labelSpan.textContent = `${checkedItems.length} selected`;
        }
      }
      root.dispatchEvent(new CustomEvent('ds-change', {
        bubbles: true,
        detail: { values: checkedItems.map((i) => i.dataset.value || i.textContent.trim()) }
      }));
    };

    root.querySelectorAll('.ds-select__option, .ds-dropdown__item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.disabled) return;

        if (isMulti) {
          const isChecked = item.dataset.checked === 'true' || item.getAttribute('aria-checked') === 'true';
          const next = !isChecked;
          item.dataset.checked = String(next);
          item.setAttribute('aria-checked', String(next));

          const checkEl = item.querySelector('.ds-dropdown__check');
          if (checkEl) {
            if (next) {
              checkEl.classList.remove('ds-dropdown__check--empty');
              checkEl.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>';
            } else {
              checkEl.classList.add('ds-dropdown__check--empty');
              checkEl.innerHTML = '';
            }
          }
          item.blur();
          updateMultiLabel();
        } else {
          item.blur();
          root.querySelectorAll('.ds-select__option, .ds-dropdown__item').forEach((i) => {
            i.removeAttribute('data-checked');
            i.setAttribute('aria-selected', 'false');
            const c = i.querySelector('.ds-dropdown__check');
            if (c) {
              c.classList.add('ds-dropdown__check--empty');
              c.innerHTML = '';
            }
          });
          item.dataset.checked = 'true';
          item.setAttribute('aria-selected', 'true');
          const checkEl = item.querySelector('.ds-dropdown__check');
          if (checkEl) {
            checkEl.classList.remove('ds-dropdown__check--empty');
            checkEl.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>';
          }

          const itemText = item.querySelector('span:last-child')?.textContent || item.textContent.trim();
          if (labelSpan) labelSpan.textContent = itemText;

          root.dataset.dsOpen = 'false';
          trigger?.setAttribute('aria-expanded', 'false');
          trigger?.blur();
          if (menu) menu.hidden = true;

          root.dispatchEvent(new CustomEvent('ds-change', {
            bubbles: true,
            detail: { value: item.dataset.value || itemText }
          }));
        }
      });
    });
  });

  const syncFilterBarReset = (barScope) => {
    const bar = barScope?.closest?.('.ds-filter-bar') || barScope;
    if (!bar) return;
    const filters = Array.from(bar.querySelectorAll('[data-ds-filter]'));
    const hasActiveFilter = filters.some((f) => f.dataset.active === 'true');
    const searchField = bar.querySelector('[data-ds-search-input] .ds-search-input__field');
    const hasSearchQuery = Boolean(searchField && searchField.value.trim().length > 0);
    bar.querySelectorAll('[data-ds-filter-reset]').forEach((btn) => {
      btn.hidden = !(hasActiveFilter || hasSearchQuery);
    });
  };

  scope.querySelectorAll('[data-ds-filter]').forEach((root) => {
    const trigger = root.querySelector('.ds-filter__trigger, .ds-filter-pill');
    const menu = root.querySelector('.ds-filter__menu');
    const searchInput = root.querySelector('.ds-filter__menu .ds-search-input__field');
    const labelSpan = root.querySelector('[data-ds-filter-value]');
    const clearBtn = root.querySelector('.ds-filter__clear, .ds-filter-pill__close');
    const isMulti = root.hasAttribute('data-multi') || root.dataset.multi === 'true';
    const defaultLabel = root.dataset.label || root.dataset.placeholder || labelSpan?.textContent?.trim() || 'Filter';
    const checkSvg = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>';

    const setFilterActiveState = (active) => {
      root.dataset.active = String(active);
      if (trigger) trigger.dataset.active = String(active);
      if (clearBtn) clearBtn.hidden = !active;
      syncFilterBarReset(root);
    };

    const resetFilter = (emit = true) => {
      root.querySelectorAll('.ds-filter__item').forEach((item) => {
        const isAll = item.dataset.value === 'all';
        item.dataset.checked = isAll ? 'true' : 'false';
        item.setAttribute(isMulti ? 'aria-checked' : 'aria-selected', isAll ? 'true' : 'false');
        const checkEl = item.querySelector('.ds-filter__check');
        if (checkEl) {
          checkEl.classList.toggle('ds-filter__check--empty', !isAll);
          checkEl.innerHTML = isAll ? checkSvg : '';
        }
      });
      if (labelSpan) labelSpan.textContent = defaultLabel;
      setFilterActiveState(false);
      root.dataset.dsOpen = 'false';
      trigger?.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
      if (emit) {
        root.dispatchEvent(new CustomEvent('ds-change', {
          bubbles: true,
          detail: { value: 'all', values: [], active: false }
        }));
      }
    };

    root._dsResetFilter = resetFilter;

    trigger?.addEventListener('click', (e) => {
      if (e.target.closest('.ds-filter__clear, .ds-filter-pill__close')) return;
      e.stopPropagation();
      if (trigger.disabled) return;
      closeAll(scope, root);
      const open = root.dataset.dsOpen !== 'true';
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      if (menu) menu.hidden = !open;
      if (!open) trigger.blur();
      if (open && searchInput) {
        setTimeout(() => searchInput.focus(), 50);
      }
    });

    const handleClear = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (trigger?.disabled) return;
      resetFilter(true);
      clearBtn?.blur();
      trigger?.blur();
    };

    clearBtn?.addEventListener('click', handleClear);
    clearBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleClear(e);
    });

    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      root.querySelectorAll('.ds-filter__item').forEach((item) => {
        const text = item.textContent.trim().toLowerCase();
        item.hidden = q.length > 0 && !text.includes(q);
      });
    });

    searchInput?.addEventListener('click', (e) => e.stopPropagation());
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        root.dataset.dsOpen = 'false';
        trigger?.setAttribute('aria-expanded', 'false');
        if (menu) menu.hidden = true;
      }
    });

    root.querySelectorAll('.ds-filter__item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.disabled) return;

        if (isMulti) {
          const isChecked = item.dataset.checked === 'true' || item.getAttribute('aria-checked') === 'true';
          const next = !isChecked;
          item.dataset.checked = String(next);
          item.setAttribute('aria-checked', String(next));
          const checkEl = item.querySelector('.ds-filter__check');
          if (checkEl) {
            checkEl.classList.toggle('ds-filter__check--empty', !next);
            checkEl.innerHTML = next ? checkSvg : '';
          }
          const checkedItems = Array.from(root.querySelectorAll('.ds-filter__item[data-checked="true"], .ds-filter__item[aria-checked="true"]'));
          const isActive = checkedItems.length > 0;
          if (labelSpan) {
            if (!isActive) labelSpan.textContent = defaultLabel;
            else if (checkedItems.length === 1) {
              labelSpan.textContent = checkedItems[0].querySelector('span:last-child')?.textContent?.trim() || checkedItems[0].textContent.trim();
            } else {
              labelSpan.textContent = `${defaultLabel} (${checkedItems.length})`;
            }
          }
          setFilterActiveState(isActive);
          item.blur();
          const values = checkedItems.map((i) => i.dataset.value || i.textContent.trim());
          root.dispatchEvent(new CustomEvent('ds-change', {
            bubbles: true,
            detail: { value: values[0] || 'all', values, active: isActive }
          }));
        } else {
          root.querySelectorAll('.ds-filter__item').forEach((option) => {
            option.dataset.checked = 'false';
            option.setAttribute('aria-selected', 'false');
            const c = option.querySelector('.ds-filter__check');
            if (c) {
              c.classList.add('ds-filter__check--empty');
              c.innerHTML = '';
            }
          });
          item.dataset.checked = 'true';
          item.setAttribute('aria-selected', 'true');
          const checkEl = item.querySelector('.ds-filter__check');
          if (checkEl) {
            checkEl.classList.remove('ds-filter__check--empty');
            checkEl.innerHTML = checkSvg;
          }
          const val = item.dataset.value || item.textContent.trim();
          const itemText = item.querySelector('span:last-child')?.textContent?.trim() || item.textContent.trim();
          const isActive = val !== 'all';
          if (labelSpan) labelSpan.textContent = isActive ? itemText : defaultLabel;
          setFilterActiveState(isActive);
          root.dataset.dsOpen = 'false';
          trigger?.setAttribute('aria-expanded', 'false');
          trigger?.blur();
          item.blur();
          if (menu) menu.hidden = true;
          root.dispatchEvent(new CustomEvent('ds-change', {
            bubbles: true,
            detail: { value: val, values: isActive ? [val] : [], active: isActive }
          }));
        }
      });
    });

    syncFilterBarReset(root);
  });

  scope.querySelectorAll('[data-ds-filter-reset]').forEach((resetBtn) => {
    const bar = resetBtn.closest('.ds-filter-bar') || scope;
    bar.querySelector('[data-ds-search-input] .ds-search-input__field')?.addEventListener('input', () => {
      syncFilterBarReset(resetBtn);
    });
    bar.querySelector('[data-ds-search-input] .ds-search-input__clear')?.addEventListener('click', () => {
      queueMicrotask(() => syncFilterBarReset(resetBtn));
    });
    resetBtn.addEventListener('click', () => {
      bar.querySelectorAll('[data-ds-filter]').forEach((filterRoot) => {
        filterRoot._dsResetFilter?.(true);
      });
      const searchInput = bar.querySelector('[data-ds-search-input] .ds-search-input__field');
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      resetBtn.blur();
      syncFilterBarReset(resetBtn);
    });
  });
  scope.querySelectorAll('[data-ds-date-picker]').forEach((root) => {
    const trigger = root.querySelector('.ds-date-picker__trigger, .ds-date-picker__nav-trigger');
    const dialog = root.querySelector('.ds-date-picker__dialog');
    const labelSpan = root.querySelector('[data-date-label], .ds-date-picker__label');
    const prevArrow = root.querySelector('.ds-date-picker__nav-arrow--prev');
    const nextArrow = root.querySelector('.ds-date-picker__nav-arrow--next');
    const isNavigation = root.classList.contains('ds-date-picker--navigation');
    const isSingleMonth = Boolean(root.querySelector('.ds-date-picker__single-calendar') || root.classList.contains('ds-date-picker--single-month'));

    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const MONTH_SHORTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const parseISODate = (str) => {
      if (!str) return null;
      const parts = str.split('-').map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    const toISODate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const addDays = (date, days) => {
      const res = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
      return res;
    };

    const formatRangeLabel = (startStr, endStr) => {
      const s = parseISODate(startStr);
      const e = parseISODate(endStr);
      if (!s) return '';
      if (!e || startStr === endStr) {
        return `${MONTH_SHORTS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()}`;
      }
      if (s.getFullYear() === e.getFullYear()) {
        return `${MONTH_SHORTS[s.getMonth()]} ${s.getDate()} – ${MONTH_SHORTS[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
      }
      return `${MONTH_SHORTS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} – ${MONTH_SHORTS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
    };

    // State
    let activeStart = root.dataset.start || (isNavigation ? '2026-11-01' : '2026-11-07');
    let activeEnd = root.dataset.end || (isNavigation ? '2026-11-07' : '2026-11-13');
    if (isSingleMonth) {
      activeStart = root.dataset.date || '2026-11-13';
      activeEnd = activeStart;
    }

    // View month state (left month for dual, or single month)
    // 0-indexed month: October = 9, November = 10
    let viewYear = 2026;
    let viewMonth = isSingleMonth ? 10 : 9; // Left month is October 2026 for dual, single is November 2026

    // Toggle popover
    trigger?.addEventListener('click', () => {
      closeAll(scope, root);
      const open = root.dataset.dsOpen !== 'true';
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      if (dialog) dialog.hidden = !open;
      if (!open) {
        trigger.blur();
      }
    });

    const renderDaysGridHTML = (year, month) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      let html = '';
      for (let i = 0; i < firstDay; i++) {
        html += '<span class="ds-date-picker__day ds-date-picker__day--empty"></span>';
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = (iso === '2026-11-13');
        html += `<div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="${iso}"><span>${d}</span>${isToday ? '<span class="ds-date-picker__today-dot"></span>' : ''}</button></div>`;
      }
      return html;
    };

    const clearRangeUI = () => {
      root.querySelectorAll('.ds-date-picker__day[data-date]').forEach((btn) => {
        btn.classList.remove('ds-date-picker__day--start', 'ds-date-picker__day--end');
        btn.parentElement?.classList.remove('ds-date-picker__cell--range-start', 'ds-date-picker__cell--range-mid', 'ds-date-picker__cell--range-end');
      });
    };

    const applyRangeUI = (startStr, endStr) => {
      clearRangeUI();
      if (!startStr) return;
      const dayBtns = root.querySelectorAll('.ds-date-picker__day[data-date]');
      if (!endStr) {
        dayBtns.forEach((btn) => {
          if (btn.dataset.date === startStr) {
            btn.classList.add('ds-date-picker__day--start');
            btn.parentElement?.classList.add('ds-date-picker__cell--range-start');
          }
        });
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

    const updateCalendarView = () => {
      if (!dialog) return;

      if (isSingleMonth) {
        const titleEl = dialog.querySelector('.ds-date-picker__month-title');
        const gridEl = dialog.querySelector('.ds-date-picker__days-grid');
        if (titleEl) titleEl.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
        if (gridEl) gridEl.innerHTML = renderDaysGridHTML(viewYear, viewMonth);
      } else {
        // Dual calendar: left is (viewYear, viewMonth), right is left + 1 month
        const rDate = new Date(viewYear, viewMonth + 1, 1);
        const rightYear = rDate.getFullYear();
        const rightMonth = rDate.getMonth();

        const titleEls = dialog.querySelectorAll('.ds-date-picker__month-title');
        const gridEls = dialog.querySelectorAll('.ds-date-picker__months .ds-date-picker__days-grid');

        if (titleEls[0]) titleEls[0].textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
        if (titleEls[1]) titleEls[1].textContent = `${MONTH_NAMES[rightMonth]} ${rightYear}`;

        if (gridEls[0]) gridEls[0].innerHTML = renderDaysGridHTML(viewYear, viewMonth);
        if (gridEls[1]) gridEls[1].innerHTML = renderDaysGridHTML(rightYear, rightMonth);
      }

      applyRangeUI(activeStart, activeEnd);
    };

    // Month Navigation Chevrons inside the calendar dialog
    const monthPrevBtn = root.querySelector('.ds-date-picker__nav-btn--prev');
    const monthNextBtn = root.querySelector('.ds-date-picker__nav-btn--next');

    monthPrevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevDate = new Date(viewYear, viewMonth - 1, 1);
      viewYear = prevDate.getFullYear();
      viewMonth = prevDate.getMonth();
      updateCalendarView();
    });

    monthNextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextDate = new Date(viewYear, viewMonth + 1, 1);
      viewYear = nextDate.getFullYear();
      viewMonth = nextDate.getMonth();
      updateCalendarView();
    });

    // Navigation Step Shifting (Navigation Arrows on trigger bar)
    const shiftRange = (direction) => {
      if (!activeStart || !activeEnd) return;
      const s = parseISODate(activeStart);
      const e = parseISODate(activeEnd);
      const durationDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);

      const step = direction === 'next' ? durationDays : -durationDays;
      const nextS = addDays(s, step);
      const nextE = addDays(e, step);

      activeStart = toISODate(nextS);
      activeEnd = toISODate(nextE);
      root.dataset.start = activeStart;
      root.dataset.end = activeEnd;

      // Update trigger label
      if (labelSpan) {
        labelSpan.textContent = formatRangeLabel(activeStart, activeEnd);
      }

      // Automatically align view month so shifted dates are in view
      if (!isSingleMonth) {
        const sMonth = nextS.getMonth();
        const sYear = nextS.getFullYear();
        const rDate = new Date(viewYear, viewMonth + 1, 1);
        const rMonth = rDate.getMonth();
        const rYear = rDate.getFullYear();
        const isStartVisible = (sYear === viewYear && sMonth === viewMonth) || (sYear === rYear && sMonth === rMonth);
        if (!isStartVisible) {
          viewYear = sYear;
          viewMonth = sMonth;
        }
      } else {
        const sMonth = nextS.getMonth();
        const sYear = nextS.getFullYear();
        if (sYear !== viewYear || sMonth !== viewMonth) {
          viewYear = sYear;
          viewMonth = sMonth;
        }
      }

      updateCalendarView();

      root.dispatchEvent(new CustomEvent('ds-change', {
        bubbles: true,
        detail: { action: direction, start: activeStart, end: activeEnd },
      }));
    };

    prevArrow?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (prevArrow.disabled || prevArrow.closest(':disabled') || root.hasAttribute('disabled')) return;
      prevArrow.blur();
      trigger?.blur();
      shiftRange('prev');
    });

    nextArrow?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (nextArrow.disabled || nextArrow.closest(':disabled') || root.hasAttribute('disabled')) return;
      nextArrow.blur();
      trigger?.blur();
      shiftRange('next');
    });

    // Date range click handler via delegation on dialog
    let pickingStart = null;

    if (dialog) {
      dialog.addEventListener('click', (e) => {
        const btn = e.target.closest('.ds-date-picker__day[data-date]');
        if (!btn || btn.disabled || btn.hasAttribute('data-disabled')) return;
        e.stopPropagation();
        btn.blur();
        trigger?.blur();
        const dateStr = btn.dataset.date;
        if (!dateStr) return;

        if (isSingleMonth) {
          activeStart = dateStr;
          activeEnd = dateStr;
          root.dataset.date = dateStr;
          applyRangeUI(activeStart, activeEnd);
          if (labelSpan) {
            const d = parseISODate(dateStr);
            labelSpan.textContent = `${MONTH_SHORTS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
          }
          root.dispatchEvent(new CustomEvent('ds-change', {
            bubbles: true,
            detail: { date: dateStr },
          }));
          return;
        }

        if (!pickingStart) {
          pickingStart = dateStr;
          root.dataset.picking = 'true';
          applyRangeUI(pickingStart, null);
        } else {
          let s = pickingStart;
          let end = dateStr;
          if (s > end) {
            const temp = s;
            s = end;
            end = temp;
          }
          pickingStart = null;
          delete root.dataset.picking;
          activeStart = s;
          activeEnd = end;
          root.dataset.start = s;
          root.dataset.end = end;
          applyRangeUI(s, end);

          if (labelSpan) {
            labelSpan.textContent = formatRangeLabel(s, end);
          }

          // Clear preset checkmark if custom range
          root.querySelectorAll('.ds-date-picker__preset').forEach((p) => {
            p.setAttribute('aria-selected', 'false');
            p.querySelector('.ds-date-picker__check')?.remove();
          });

          root.dispatchEvent(new CustomEvent('ds-change', {
            bubbles: true,
            detail: { start: s, end },
          }));
        }
      });

      dialog.addEventListener('mouseover', (e) => {
        if (root.dataset.picking !== 'true' || !pickingStart) return;
        const btn = e.target.closest('.ds-date-picker__day[data-date]');
        if (btn && btn.dataset.date) {
          applyRangeUI(pickingStart, btn.dataset.date);
        }
      });
    }

    // Preset selection
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

    root.querySelectorAll('.ds-date-picker__preset').forEach((preset) => {
      preset.addEventListener('click', (e) => {
        e.stopPropagation();
        preset.blur();
        trigger?.blur();
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

        activeStart = start;
        activeEnd = end;
        root.dataset.start = start;
        root.dataset.end = end;

        setPresetActive(presetKey);

        // For navigation variant, show formatted date range; for default pill, show preset label
        if (labelSpan) {
          labelSpan.textContent = isNavigation ? formatRangeLabel(start, end) : label;
        }

        updateCalendarView();

        root.dispatchEvent(new CustomEvent('ds-change', {
          bubbles: true,
          detail: { preset: label, start, end },
        }));
      });
    });

    // Initial render / styling pass
    applyRangeUI(activeStart, activeEnd);
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
  scope.querySelectorAll('[data-ds-menu], [data-ds-popover]').forEach((root) => {
    const trigger = root.querySelector('.ds-menu__trigger, .ds-popover__trigger, button');
    const menu = root.querySelector('.ds-menu__content, .ds-popover__content, [role="menu"], [role="dialog"]');
    if (!trigger || !menu) return;

    const getItems = () => Array.from(menu.querySelectorAll('.ds-menu__item:not([disabled]):not([data-disabled]), [role="menuitem"]:not([disabled]):not([data-disabled]), [role="menuitemradio"]:not([disabled]):not([data-disabled])'));

    const setOpen = (open, shouldFocusFirstItem = false) => {
      if (open) closeAll(scope, root);
      root.dataset.dsOpen = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      if (!open) {
        trigger.blur();
      }
      if (open && shouldFocusFirstItem) {
        const items = getItems();
        if (items.length) {
          requestAnimationFrame(() => items[0].focus());
        }
      }
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (trigger.disabled || root.dataset.disabled === 'true' || root.hasAttribute('data-disabled')) return;
      const open = root.dataset.dsOpen !== 'true';
      setOpen(open, false);
      if (!open) {
        trigger.blur();
      }
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
          setOpen(true, true);
        } else if (items.length) {
          const next = index === -1 ? 0 : (index + 1) % items.length;
          items[next].focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (root.dataset.dsOpen !== 'true') {
          setOpen(true, true);
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

    menu.querySelectorAll('.ds-menu__item, [role="menuitem"], [role="menuitemradio"], [data-ds-popover-close]').forEach((item) => {
      item.addEventListener('click', () => {
        if (item.disabled || item.hasAttribute('data-disabled')) return;
        if (item.getAttribute('role') === 'menuitemradio') {
          menu.querySelectorAll('[role="menuitemradio"]').forEach((option) => {
            option.setAttribute('aria-checked', String(option === item));
          });
        }
        item.blur();
        trigger?.blur();
        setOpen(false);
        const detail = {
          value: item.dataset.value ?? item.textContent.trim(),
        };
        root.dispatchEvent(new CustomEvent('ds-select', {
          bubbles: true,
          detail,
        }));
        root.dispatchEvent(new CustomEvent('ds-change', {
          bubbles: true,
          detail,
        }));
      });
    });

    // Clicks inside popover content should not close it unless clicking close button
    menu.addEventListener('click', (e) => {
      if (!e.target.closest('.ds-menu__item, [role="menuitem"], [role="menuitemradio"], [data-ds-popover-close]')) {
        e.stopPropagation();
      }
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
  scope.querySelectorAll('[data-ds-toast-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.dsToastTrigger;
      const toast = scope.querySelector(targetId);
      if (toast) {
        toast.hidden = false;
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
          toast.hidden = true;
        }, 3500);
      }
    });
  });
  scope.querySelectorAll('.ds-toast__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const toast = btn.closest('.ds-toast');
      if (toast) toast.hidden = true;
    });
  });
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
      if (input.disabled || toggleBtn.disabled || root.dataset.disabled === 'true' || root.hasAttribute('data-disabled')) return;
      const isPassword = input.type === 'password';
      const nextType = isPassword ? 'text' : 'password';
      input.type = nextType;
      input.setAttribute('type', nextType);
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      toggleBtn.setAttribute('data-visible', isPassword ? 'true' : 'false');
      input.focus();
    });
  });

  scope.querySelectorAll('.ds-input-group').forEach((root) => {
    const input = root.querySelector('.ds-input, input');
    if (!input) return;

    input.addEventListener('focus', () => { root.dataset.focused = 'true'; });
    input.addEventListener('blur', () => { root.dataset.focused = 'false'; });

    root.addEventListener('click', (event) => {
      if (event.target.closest('button, a, input, select, textarea')) return;
      if (!input.disabled && !root.hasAttribute('data-disabled') && root.dataset.disabled !== 'true') {
        input.focus();
      }
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
        if (btn.disabled || input.disabled || root.hasAttribute('data-disabled') || root.dataset.disabled === 'true') return;
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

  scope.querySelectorAll('.ds-slider, [data-ds-slider], .ds-form-slider').forEach((root) => {
    const input = root.matches('input[type="range"]') ? root : root.querySelector('input[type="range"]');
    if (!input) return;
    const readout = root.querySelector?.('[data-ds-readout], .ds-slider__readout, .ds-row > .ds-muted, .ds-form-slider__readout');

    const updateSlider = () => {
      const min = parseFloat(input.min) || 0;
      const max = parseFloat(input.max) || 100;
      const val = parseFloat(input.value) || 0;
      const pct = max > min ? Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100)) : 0;
      input.style.setProperty('--range-progress', `${pct}%`);

      if (readout) {
        const unit = input.dataset.unit || '';
        let formatted = input.value;
        if (input.step === '0.01' || input.dataset.decimals === '2') {
          formatted = Number(formatted).toFixed(2);
        }
        readout.textContent = unit ? `${formatted} ${unit}` : formatted;
      }
    };

    input.addEventListener('input', updateSlider);
    updateSlider();
  });

  // ── Pagination (.ds-pagination) ──
  scope.querySelectorAll('.ds-pagination, [data-ds-pagination]').forEach((root) => {
    let currentPage = parseInt(root.dataset.currentPage || '1', 10);
    const totalPages = parseInt(root.dataset.totalPages || '10', 10);

    const statusCurrent = root.querySelector('[data-ds-page-current]');
    const statusTotal = root.querySelector('[data-ds-page-total]');
    const pagesContainer = root.querySelector('.ds-pagination__pages');
    const btnFirst = root.querySelector('[data-ds-page-action="first"]');
    const btnPrev = root.querySelector('[data-ds-page-action="prev"]');
    const btnNext = root.querySelector('[data-ds-page-action="next"]');
    const btnLast = root.querySelector('[data-ds-page-action="last"]');

    const renderPages = () => {
      if (statusCurrent) statusCurrent.textContent = String(currentPage);
      if (statusTotal) statusTotal.textContent = String(totalPages);
      root.dataset.currentPage = String(currentPage);

      if (btnFirst) btnFirst.disabled = currentPage === 1;
      if (btnPrev) btnPrev.disabled = currentPage === 1;
      if (btnNext) btnNext.disabled = currentPage === totalPages;
      if (btnLast) btnLast.disabled = currentPage === totalPages;

      if (!pagesContainer) return;
      pagesContainer.innerHTML = '';

      const createPageBtn = (num) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ds-pagination__page' + (num === currentPage ? ' is-active' : '');
        btn.dataset.page = String(num);
        if (num === currentPage) btn.setAttribute('aria-current', 'page');
        btn.textContent = String(num);
        btn.addEventListener('click', () => {
          if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled')) return;
          currentPage = num;
          renderPages();
          root.dispatchEvent(new CustomEvent('pagechange', { detail: { page: currentPage } }));
        });
        return btn;
      };

      const createEllipsis = () => {
        const span = document.createElement('span');
        span.className = 'ds-pagination__ellipsis';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = '···';
        return span;
      };

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pagesContainer.appendChild(createPageBtn(i));
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 3; i++) pagesContainer.appendChild(createPageBtn(i));
          pagesContainer.appendChild(createEllipsis());
          for (let i = totalPages - 2; i <= totalPages; i++) pagesContainer.appendChild(createPageBtn(i));
        } else if (currentPage >= totalPages - 2) {
          for (let i = 1; i <= 3; i++) pagesContainer.appendChild(createPageBtn(i));
          pagesContainer.appendChild(createEllipsis());
          for (let i = totalPages - 2; i <= totalPages; i++) pagesContainer.appendChild(createPageBtn(i));
        } else {
          pagesContainer.appendChild(createPageBtn(1));
          pagesContainer.appendChild(createEllipsis());
          pagesContainer.appendChild(createPageBtn(currentPage - 1));
          pagesContainer.appendChild(createPageBtn(currentPage));
          pagesContainer.appendChild(createPageBtn(currentPage + 1));
          pagesContainer.appendChild(createEllipsis());
          pagesContainer.appendChild(createPageBtn(totalPages));
        }
      }
    };

    if (btnFirst) {
      btnFirst.addEventListener('click', () => {
        if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || currentPage === 1) return;
        currentPage = 1;
        renderPages();
        root.dispatchEvent(new CustomEvent('pagechange', { detail: { page: currentPage } }));
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || currentPage === 1) return;
        currentPage = Math.max(1, currentPage - 1);
        renderPages();
        root.dispatchEvent(new CustomEvent('pagechange', { detail: { page: currentPage } }));
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || currentPage === totalPages) return;
        currentPage = Math.min(totalPages, currentPage + 1);
        renderPages();
        root.dispatchEvent(new CustomEvent('pagechange', { detail: { page: currentPage } }));
      });
    }
    if (btnLast) {
      btnLast.addEventListener('click', () => {
        if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || currentPage === totalPages) return;
        currentPage = totalPages;
        renderPages();
        root.dispatchEvent(new CustomEvent('pagechange', { detail: { page: currentPage } }));
      });
    }

    const rowsDropdown = root.querySelector('[data-ds-rows-dropdown], .ds-pagination__dropdown');
    if (rowsDropdown) {
      rowsDropdown.addEventListener('ds-change', (e) => {
        const val = e.detail?.value;
        if (val) {
          root.dispatchEvent(new CustomEvent('rowschange', { detail: { rows: val } }));
        }
      });
    }

    const rowsTrigger = root.querySelector('[data-ds-rows-trigger]');
    const rowsMenu = root.querySelector('[data-ds-rows-menu]');
    const rowsVal = root.querySelector('[data-ds-rows-value]');

    if (rowsTrigger && rowsMenu) {
      const toggleMenu = (open) => {
        rowsTrigger.setAttribute('aria-expanded', String(open));
        rowsMenu.hidden = !open;
        if (!open) {
          rowsTrigger.blur();
        }
      };

      rowsTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || rowsTrigger.disabled) return;
        const isOpen = rowsTrigger.getAttribute('aria-expanded') === 'true';
        toggleMenu(!isOpen);
      });

      rowsMenu.querySelectorAll('.ds-pagination__menu-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          item.blur();
          rowsTrigger?.blur();
          const val = item.dataset.value || item.textContent.trim();
          if (rowsVal) rowsVal.textContent = val;
          rowsMenu.querySelectorAll('.ds-pagination__menu-item').forEach((i) => {
            i.setAttribute('aria-selected', String(i === item));
            i.classList.toggle('is-active', i === item);
          });
          toggleMenu(false);
          root.dispatchEvent(new CustomEvent('rowschange', { detail: { rows: val } }));
        });
      });

      document.addEventListener('click', (e) => {
        if (!root.contains(e.target)) {
          toggleMenu(false);
        }
      });
    }

    renderPages();
  });

  // ── Inline Pagination (.ds-pagination--inline) ──
  scope.querySelectorAll('.ds-pagination--inline[data-ds-pagination-inline]').forEach((root) => {
    let page = parseInt(root.dataset.page || '1', 10);
    const pageSize = parseInt(root.dataset.pageSize || '10', 10);
    const totalItems = parseInt(root.dataset.totalItems || '42', 10);
    const entityName = root.dataset.entity || 'invoices';
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    const summary = root.querySelector('.ds-pagination__summary');
    const btnPrev = root.querySelector('[data-ds-page-action="prev"]');
    const btnNext = root.querySelector('[data-ds-page-action="next"]');

    const updateInline = () => {
      const start = Math.min((page - 1) * pageSize + 1, totalItems);
      const end = Math.min(page * pageSize, totalItems);
      if (summary) {
        if (totalItems <= 1) {
          summary.textContent = `${start}-${end} ${entityName}`;
        } else {
          summary.textContent = `${start}-${end} of ${totalItems} ${entityName}`;
        }
      }
      if (btnPrev) btnPrev.disabled = page <= 1;
      if (btnNext) btnNext.disabled = page >= totalPages;
      root.dataset.page = String(page);
    };

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (page > 1) {
          page--;
          updateInline();
          root.dispatchEvent(new CustomEvent('pagechange', { detail: { page } }));
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (page < totalPages) {
          page++;
          updateInline();
          root.dispatchEvent(new CustomEvent('pagechange', { detail: { page } }));
        }
      });
    }

    updateInline();
  });

  // ── Progress Indicator (Multi-step interactive navigation) ──
  scope.querySelectorAll('.ds-progress-indicator, [data-ds-progress-indicator]').forEach((root) => {
    const steps = Array.from(root.querySelectorAll('.ds-progress-step'));
    if (!steps.length) return;

    const setStep = (targetIndex) => {
      if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || root.hasAttribute('disabled')) return;
      if (targetIndex < 0 || targetIndex >= steps.length) return;

      steps.forEach((step, idx) => {
        const marker = step.querySelector('.ds-progress-step__marker');
        const defaultNum = step.dataset.step || String(idx + 1);

        if (idx < targetIndex) {
          step.dataset.state = 'completed';
          step.removeAttribute('aria-current');
          if (marker) {
            marker.innerHTML = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>';
            marker.setAttribute('aria-hidden', 'true');
          }
        } else if (idx === targetIndex) {
          step.dataset.state = 'current';
          step.setAttribute('aria-current', 'step');
          if (marker) {
            marker.textContent = defaultNum;
            marker.removeAttribute('aria-hidden');
          }
        } else {
          step.dataset.state = 'upcoming';
          step.removeAttribute('aria-current');
          if (marker) {
            marker.textContent = defaultNum;
            marker.removeAttribute('aria-hidden');
          }
        }
      });

      const activeStep = steps[targetIndex];
      const stepLabel = activeStep.querySelector('.ds-progress-step__title, .ds-progress-step__label, span:not(.ds-progress-step__marker):not(.ds-progress-step__line)')?.textContent?.trim() || '';

      root.dispatchEvent(new CustomEvent('stepchange', {
        bubbles: true,
        detail: {
          step: targetIndex + 1,
          label: stepLabel,
          total: steps.length
        }
      }));
    };

    steps.forEach((step, idx) => {
      step.setAttribute('tabindex', '0');
      step.setAttribute('role', 'button');
      step.setAttribute('aria-label', `Step ${idx + 1}`);

      step.addEventListener('click', () => {
        if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || step.hasAttribute('disabled')) return;
        step.blur();
        setStep(idx);
      });

      step.addEventListener('keydown', (e) => {
        if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || step.hasAttribute('disabled')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setStep(idx);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = Math.min(steps.length - 1, idx + 1);
          steps[next].focus();
          setStep(next);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = Math.max(0, idx - 1);
          steps[prev].focus();
          setStep(prev);
        }
      });
    });
  });

  // ── File Uploader / Dropzone (.ds-dropzone) ──
  scope.querySelectorAll('.ds-dropzone, [data-ds-dropzone]').forEach((root) => {
    const fileInput = root.querySelector('input[type="file"]');
    if (!fileInput) return;

    const setFile = (fileName) => {
      let fileEl = root.querySelector('.ds-dropzone__file');
      if (!fileEl) {
        fileEl = document.createElement('div');
        fileEl.className = 'ds-dropzone__file';
        fileEl.innerHTML = `<svg class="ds-dropzone__file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg><span class="ds-dropzone__filename"></span>`;
        root.appendChild(fileEl);
      }
      const nameEl = fileEl.querySelector('.ds-dropzone__filename');
      if (nameEl) nameEl.textContent = fileName;
      root.dataset.hasFile = 'true';
    };

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length) {
        setFile(fileInput.files[0].name);
      }
    });

    root.addEventListener('dragover', (e) => {
      if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || fileInput.disabled) return;
      e.preventDefault();
      root.classList.add('is-dragover');
    });

    root.addEventListener('dragleave', () => {
      root.classList.remove('is-dragover');
    });

    root.addEventListener('drop', (e) => {
      if (root.dataset.disabled === 'true' || root.hasAttribute('data-disabled') || fileInput.disabled) return;
      e.preventDefault();
      root.classList.remove('is-dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        setFile(e.dataTransfer.files[0].name);
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
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

  scope.querySelectorAll('.ds-code-snippet__copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const snippet = btn.closest('.ds-code-snippet');
      if (!snippet) return;
      const codeEl = snippet.querySelector('.ds-code-snippet__code, .ds-code-snippet__pre code');
      const text = codeEl ? codeEl.textContent : '';
      if (text && navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      btn.dataset.copied = 'true';
      const label = btn.querySelector('.ds-code-snippet__copy-label');
      const originalText = label ? label.textContent : '';
      if (label) label.textContent = 'Copied!';
      setTimeout(() => {
        delete btn.dataset.copied;
        if (label) label.textContent = originalText;
      }, 2000);
    });
  });

  scope.querySelectorAll('[data-ds-sidebar]').forEach((root) => {
    const collapseBtn = root.querySelector('[data-ds-sidebar-collapse]');
    const navLinks = Array.from(root.querySelectorAll('.ds-nav a'));
    const searchTrigger = root.querySelector('[data-ds-search-trigger]');
    const shell = root.closest('.ds-shell') || root.parentElement || scope;
    const searchDialog = shell.querySelector('[data-ds-search-dialog]');
    const searchInput = searchDialog?.querySelector('[data-slot="command-palette-input"]');
    const emptyState = searchDialog?.querySelector('[data-slot="command-palette-empty"]');
    const paletteItems = searchDialog ? Array.from(searchDialog.querySelectorAll('[data-slot="command-palette-item"]')) : [];

    const setActiveNav = (targetLink) => {
      if (!targetLink) return;
      navLinks.forEach((link) => {
        const isCurrent = link === targetLink;
        link.classList.toggle('is-active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };

    collapseBtn?.addEventListener('click', () => {
      const nextCollapsed = root.dataset.collapsed !== 'true';
      root.dataset.collapsed = String(nextCollapsed);
      collapseBtn.setAttribute('aria-expanded', String(!nextCollapsed));
      collapseBtn.setAttribute('aria-label', nextCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        setActiveNav(link);
      });
    });

    const getVisiblePaletteItems = () => paletteItems.filter((item) => !item.hidden);

    const setActivePaletteItem = (targetItem) => {
      paletteItems.forEach((item) => {
        const isSelected = item === targetItem;
        item.classList.toggle('ds-cmd-palette-item--active', isSelected);
        item.setAttribute('aria-selected', String(isSelected));
      });
    };

    const filterPalette = (rawQuery) => {
      const query = rawQuery.trim().toLowerCase();
      let firstVisible = null;
      let activeStillVisible = false;
      paletteItems.forEach((item) => {
        const labelText = (item.querySelector('.ds-cmd-palette-label')?.textContent || item.textContent).toLowerCase();
        const matches = query.length === 0 || labelText.includes(query);
        item.hidden = !matches;
        if (matches) {
          if (!firstVisible) firstVisible = item;
          if (item.getAttribute('aria-selected') === 'true') activeStillVisible = true;
        }
      });
      if (!activeStillVisible) {
        setActivePaletteItem(firstVisible);
      }
      if (emptyState) emptyState.hidden = firstVisible !== null;
      if (searchInput) searchInput.setAttribute('aria-expanded', String(firstVisible !== null));
    };

    const closeSearch = (restoreFocus = false) => {
      if (!searchDialog) return;
      searchDialog.hidden = true;
      searchTrigger?.setAttribute('aria-expanded', 'false');
      if (restoreFocus) searchTrigger?.focus();
    };

    const openSearch = () => {
      if (!searchDialog) return;
      closeAll(scope);
      searchDialog.hidden = false;
      searchTrigger?.setAttribute('aria-expanded', 'true');
      if (searchInput) {
        searchInput.value = '';
        filterPalette('');
        requestAnimationFrame(() => searchInput.focus());
      }
    };

    const activatePaletteItem = (item) => {
      if (!item) return;
      const targetId = item.dataset.id;
      if (targetId) {
        const matchingNav = navLinks.find((link) => link.dataset.navId === targetId);
        if (matchingNav) setActiveNav(matchingNav);
      }
      closeSearch(false);
    };

    searchTrigger?.addEventListener('click', openSearch);

    searchDialog?.addEventListener('pointerdown', (event) => {
      if (event.target === searchDialog) closeSearch(false);
    });

    searchDialog?.addEventListener('click', (event) => {
      if (event.target === searchDialog || event.target.closest('[data-ds-search-close]')) {
        closeSearch(false);
        return;
      }
      const item = event.target.closest('[data-slot="command-palette-item"]');
      if (item) activatePaletteItem(item);
    });

    searchInput?.addEventListener('input', () => {
      filterPalette(searchInput.value);
    });

    searchInput?.addEventListener('keydown', (event) => {
      const visible = getVisiblePaletteItems();
      if (!visible.length) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeSearch(true);
        }
        return;
      }
      const currentIdx = visible.findIndex((item) => item.getAttribute('aria-selected') === 'true');
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % visible.length;
        setActivePaletteItem(visible[nextIdx]);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIdx = currentIdx <= 0 ? visible.length - 1 : currentIdx - 1;
        setActivePaletteItem(visible[prevIdx]);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        activatePaletteItem(visible[currentIdx >= 0 ? currentIdx : 0]);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch(true);
      }
    });

    const onDocumentKeyDown = (event) => {
      if (!root.isConnected) {
        document.removeEventListener('keydown', onDocumentKeyDown);
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (searchDialog?.hidden) openSearch();
        else closeSearch(true);
      } else if (event.key === 'Escape' && searchDialog && !searchDialog.hidden) {
        event.preventDefault();
        closeSearch(true);
      }
    };
    document.addEventListener('keydown', onDocumentKeyDown);
  });

// ── SMT Ratio / Application / Analysing ──
  const ANALYSING_HASH = String.fromCharCode(35);
  const ANALYSING_SPRING_EASING = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timing-function', 'linear(0, 1)')
    ? 'linear(0,.0213,.0739,.1443,.2235,.305,.3849,.4606,.5305,.594,.6508,.7011,.7452,.7836,.8168,.8454,.8699,.8907,.9084,.9234,.9361,.9467,.9557,.9632,.9694,.9747,.979,.9826,.9857,.9882,.9902,.992,.9934,.9946,.9955,.9963,1)'
    : 'cubic-bezier(0.22, 1, 0.36, 1)';
  const ANALYSING_EASE_STANDARD = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const ANALYSING_EASE_ENTER = 'cubic-bezier(0.16, 1, 0.3, 1)';

  const escapeAnalysingHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const isAnalysingReducedMotion = (root) => (
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    || Boolean(root?.closest?.('[data-reduced-motion="true"]'))
  );

  const ANALYSING_BRAND_SVGS = {
    github: {
      name: 'GitHub',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    },
    linear: {
      name: 'Linear',
      svg: '<svg class="ds-tool-run__brand-linear" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"/></svg>',
    },
    postgres: {
      name: 'PostgreSQL',
      svg: '<svg class="ds-tool-run__brand-postgres" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z"/></svg>',
    },
    slack: {
      name: 'Slack',
      svg: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="ds-tool-run__slack-red" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/><path class="ds-tool-run__slack-blue" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/><path class="ds-tool-run__slack-green" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/><path class="ds-tool-run__slack-yellow" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>',
    },
  };

  const ANALYSING_UI_SVGS = {
    chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    chevronSmall: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-run__more-icon" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    rotateSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
    rotateMd: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
    spinner: '<svg class="ds-tool-run__spinner" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity=".2" stroke-width="1.75"/><path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
    check: (draw) => `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="ds-tool-run__check-path${draw ? ' is-drawing' : ''}" pathLength="1" d="M3.25 8.5 6.5 11.75 12.75 4.75"/></svg>`,
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
    approval: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    denied: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M4.929 4.929 19.07 19.071"/></svg>',
    copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2"/></svg>',
    copied: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="ds-tool-run__check-path is-drawing" pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };

  const buildAnalysingCalls = () => ({
    issues: {
      id: 'github-issues',
      tool: 'github',
      title: 'Searched issues in arc-ui/web',
      titles: {
        running: 'Searching issues in arc-ui/web',
        error: 'Could not search issues in arc-ui/web',
      },
      status: 'success',
      input: {
        repo: 'arc-ui/web',
        query: 'is:open label:release-blocker milestone:2.8',
        sort: 'updated',
      },
      output: {
        type: 'list',
        items: [
          { lead: `${ANALYSING_HASH}1284`, title: 'Checkout button stays disabled after a coupon is removed', tag: 'checkout' },
          { lead: `${ANALYSING_HASH}1291`, title: 'Webhook retry posts a second charge after a 504', tag: 'billing' },
          { lead: `${ANALYSING_HASH}1302`, title: 'Session is lost after SSO sign in on iPad', tag: 'auth' },
          { lead: `${ANALYSING_HASH}1306`, title: 'Release notes page returns 404 on docs preview', tag: 'docs' },
        ],
      },
      thinkingSteps: [
        'Scanning open issues tagged release-blocker in arc-ui/web for the 2.8 milestone, filtering out already triaged duplicates and sorting remaining release blockers by latest activity across checkout, billing, authentication, and docs preview routes.',
        `Four critical release blockers remain open: ${ANALYSING_HASH}1284 keeps the checkout submit button disabled after removing a coupon code, ${ANALYSING_HASH}1291 posts a duplicate charge after 504 webhook retries, ${ANALYSING_HASH}1302 drops iPad SSO sessions, and ${ANALYSING_HASH}1306 returns 404 on docs.`,
      ],
      durationMs: 3400,
    },
    project: {
      id: 'linear-project',
      tool: 'linear',
      title: 'Read the Web 2.8 release project',
      titles: {
        running: 'Reading the Web 2.8 release project',
        error: 'Could not read the Web 2.8 release project',
      },
      status: 'success',
      input: {
        project: 'Web 2.8 release',
        team: 'WEB',
        include: ['issues', 'milestones'],
      },
      output: {
        type: 'json',
        value: {
          project: 'Web 2.8 release',
          lead: 'Maya Chen',
          target: '2026-10-23',
          progress: 0.86,
          health: 'at risk',
          milestones: [
            { name: 'Code freeze', date: '2026-10-20', done: true },
            { name: 'Release candidate', date: '2026-10-22', done: false },
          ],
          blocked: [
            { id: 'WEB-412', title: 'Ship the coupon fix to checkout', assignee: 'Daniel Okafor', blockedBy: `arc-ui/web${ANALYSING_HASH}1284` },
            { id: 'WEB-418', title: 'Run migration 0047 on production', assignee: 'Priya Raman', blockedBy: null },
          ],
          openIssues: 7,
          doneIssues: 43,
        },
      },
      thinkingSteps: [
        'Loading the Web 2.8 release project owned by Maya Chen targeting 2026-10-23, inspecting milestone completion on Code freeze and Release candidate as well as open vs resolved issue counts across the WEB engineering team.',
        `Overall progress sits at 86% with project health marked at risk and 7 open issues left. Two WEB tasks are explicitly blocked: WEB-412 waiting on checkout fix ${ANALYSING_HASH}1284, and WEB-418 waiting for migration 0047 on production.`,
      ],
      summary: '2 blocked',
      durationMs: 3200,
    },
    migrations: {
      id: 'postgres-migrations',
      tool: 'postgres',
      title: 'Queried pending migrations',
      titles: {
        running: 'Querying pending migrations',
        error: 'Could not query pending migrations',
      },
      status: 'success',
      input: {
        database: 'app_production',
        sql: 'select version, name, applied_at from schema_migrations where applied_at is null order by version',
      },
      output: {
        type: 'table',
        columns: ['version', 'name', 'applied_at'],
        rows: [
          ['0047', 'add_coupon_redemptions_index', null],
          ['0048', 'backfill_invoice_currency', null],
        ],
      },
      thinkingSteps: [
        'Opening read-only connection pool to app_production and preparing SQL query against schema_migrations rows where applied_at is null, ordered sequentially by version to catch any unapplied DDL changes before cutover.',
        'Primary replica handshake on port 5432 is stalling under read-pool saturation; waiting on socket read response before timing out the database query and surfacing connection error on app_production.',
      ],
      retryThinkingSteps: [
        'Reconnecting through app_production standby replica pool with a fresh TLS session, verifying read-only transaction isolation level, and re-running the pending schema_migrations lookup ordered by version.',
        'Standby replica responded cleanly: two unapplied production migrations returned with null applied_at timestamps — 0047 add_coupon_redemptions_index and 0048 backfill_invoice_currency.',
      ],
      message: 'Connection to app_production timed out after 5s',
      durationMs: 2800,
    },
    post: {
      id: 'slack-post',
      tool: 'slack',
      title: 'Posted to #release',
      titles: {
        approval: 'Post a summary to #release',
        denied: 'Post a summary to #release',
        running: 'Posting to #release',
        error: 'Could not post to #release',
      },
      status: 'success',
      input: {
        channel: '#release',
        text: `2.8 is blocked by ${ANALYSING_HASH}1284 (coupon checkout) and migration 0047, still pending on production. The Oct 23 target holds if both land by Wednesday.`,
      },
      output: {
        type: 'text',
        text: 'Sent to #release at 10:42 as Arc agent.',
      },
      thinkingSteps: [
        `Composing concise release blocker summary for #release referencing coupon checkout bug ${ANALYSING_HASH}1284, unapplied migration 0047 on app_production, and the Wednesday deadline required to hold the Oct 23 launch window.`,
        'Delivering formatted summary message as Arc agent to all 48 channel members in #release and awaiting Slack webhook delivery receipt timestamp.',
      ],
      summary: '1 message',
      message: 'Sends as Arc agent to 48 people in #release',
      durationMs: 2600,
    },
  });

  const ANALYSING_COPY = {
    user: 'Is anything blocking the 2.8 release?',
    intro: 'Let me check what is blocking the release.',
    allow: `Two things block 2.8: the coupon checkout bug ${ANALYSING_HASH}1284 and migration 0047, which is still pending on production. I posted a summary in #release.`,
    deny: `Two things block 2.8: the coupon checkout bug ${ANALYSING_HASH}1284 and migration 0047, which is still pending on production. I did not post to #release.`,
  };

  const ANALYSING_CHUNK_SIZES = [4, 6, 3, 7, 5];

  const pluralizeAnalysing = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

  const formatAnalysingDuration = (ms) => {
    if (ms === undefined || ms === null || !Number.isFinite(ms)) return '';
    return ms < 1000 ? `${Math.max(1, Math.round(ms))}ms` : `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)}s`;
  };

  const summarizeAnalysingOutput = (output) => {
    if (!output) return '';
    if (output.type === 'list') return pluralizeAnalysing(output.items.length, 'result');
    if (output.type === 'table') return pluralizeAnalysing(output.rows.length, 'row');
    if (output.type === 'json') {
      if (Array.isArray(output.value)) return pluralizeAnalysing(output.value.length, 'item');
      if (output.value && typeof output.value === 'object') return pluralizeAnalysing(Object.keys(output.value).length, 'field');
    }
    return '';
  };

  const getAnalysingTitle = (call) => call.titles?.[call.status] ?? call.title;

  const copyTextToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.setProperty('position', 'fixed');
    ta.style.setProperty('left', '-9999px');
    ta.style.setProperty('opacity', '0');
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  };

  const animateAnalysingHeight = (el, { open, fade = true, reduced = false, duration = 380, opacityDelay = 0, onComplete } = {}) => {
    if (!el) return;
    if (el._hAnim) {
      el._hAnim.cancel();
      el._hAnim = null;
    }
    if (el._oAnim) {
      el._oAnim.cancel();
      el._oAnim = null;
    }

    if (reduced) {
      el.hidden = !open;
      el.style.removeProperty('height');
      el.style.removeProperty('opacity');
      el.style.removeProperty('overflow');
      onComplete?.();
      return;
    }

    if (open) {
      const wasHidden = el.hidden;
      const startHeight = wasHidden ? 0 : el.getBoundingClientRect().height;
      const startOpacity = wasHidden ? 0 : parseFloat(getComputedStyle(el).opacity) || 1;
      el.hidden = false;
      el.style.removeProperty('height');
      const targetHeight = el.scrollHeight;
      el.style.setProperty('overflow', 'hidden');
      el.style.setProperty('height', `${startHeight}px`);
      if (fade) el.style.setProperty('opacity', String(startOpacity));
      void el.offsetHeight;

      const anim = el.animate(
        [{ height: `${startHeight}px` }, { height: `${targetHeight}px` }],
        { duration, easing: ANALYSING_SPRING_EASING, fill: 'forwards' }
      );
      el._hAnim = anim;
      if (fade) {
        el._oAnim = el.animate(
          [{ opacity: startOpacity }, { opacity: 1 }],
          { duration: 150, delay: opacityDelay, easing: ANALYSING_EASE_STANDARD, fill: 'both' }
        );
      }
      anim.onfinish = () => {
        if (el._hAnim === anim) el._hAnim = null;
        anim.cancel();
        el._oAnim?.cancel();
        el._oAnim = null;
        el.style.removeProperty('height');
        el.style.removeProperty('opacity');
        el.style.removeProperty('overflow');
        onComplete?.();
      };
    } else {
      if (el.hidden) {
        onComplete?.();
        return;
      }
      const startHeight = el.getBoundingClientRect().height;
      const startOpacity = parseFloat(getComputedStyle(el).opacity) || 1;
      el.style.setProperty('overflow', 'hidden');
      el.style.setProperty('height', `${startHeight}px`);
      void el.offsetHeight;

      const anim = el.animate(
        [{ height: `${startHeight}px` }, { height: '0px' }],
        { duration, easing: ANALYSING_SPRING_EASING, fill: 'forwards' }
      );
      el._hAnim = anim;
      if (fade) {
        el._oAnim = el.animate(
          [{ opacity: startOpacity }, { opacity: 0 }],
          { duration: 150, easing: ANALYSING_EASE_STANDARD, fill: 'forwards' }
        );
      }
      anim.onfinish = () => {
        if (el._hAnim === anim) el._hAnim = null;
        anim.cancel();
        el._oAnim?.cancel();
        el._oAnim = null;
        el.hidden = true;
        el.style.removeProperty('height');
        el.style.removeProperty('opacity');
        el.style.removeProperty('overflow');
        onComplete?.();
      };
    }
  };

  const animateAnalysingHeightBetween = (el, fromHeight, toHeight, { reduced = false, duration = 380 } = {}) => {
    if (!el) return;
    if (el._hAnim) {
      el._hAnim.cancel();
      el._hAnim = null;
    }
    if (reduced || Math.abs(fromHeight - toHeight) < 0.5) {
      el.style.removeProperty('height');
      el.style.removeProperty('overflow');
      return;
    }
    el.style.setProperty('overflow', 'hidden');
    el.style.setProperty('height', `${fromHeight}px`);
    void el.offsetHeight;
    const anim = el.animate(
      [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
      { duration, easing: ANALYSING_SPRING_EASING, fill: 'forwards' }
    );
    el._hAnim = anim;
    anim.onfinish = () => {
      if (el._hAnim === anim) el._hAnim = null;
      anim.cancel();
      el.style.removeProperty('height');
      el.style.removeProperty('overflow');
    };
  };

  const createShimmerElement = (text, active, className, root) => {
    const wrapper = document.createElement('span');
    wrapper.className = `ds-tool-run-shimmer ${className || ''}`.trim();
    wrapper.dataset.state = active ? 'active' : 'idle';
    if (active) wrapper.setAttribute('aria-busy', 'true');

    const stage = document.createElement('span');
    stage.className = 'ds-tool-run-shimmer__stage';

    const label = document.createElement('span');
    label.className = 'ds-tool-run-shimmer__label';
    label.textContent = text;
    stage.appendChild(label);
    wrapper.appendChild(stage);

    const state = {
      text,
      active: Boolean(active),
      pos: 0,
      fade: active ? 0 : 1,
      rafId: 0,
      sweepStart: 0,
      sweepFrom: 0,
      sweepDuration: 1800,
      sweepMode: active ? 'delay' : 'idle', // 'delay' | 'sweep' | 'pause' | 'finish' | 'idle'
      delayUntil: 0,
      fadeStart: 0,
      fadeFrom: active ? 0 : 1,
      fadeTo: active ? 0 : 1,
      fadeDuration: 0,
      inView: true,
      widthAnim: null,
    };

    const applyVars = () => {
      wrapper.style.setProperty('--ts-pos', state.pos.toFixed(4));
      wrapper.style.setProperty('--ts-fade', `${(state.fade * 100).toFixed(1)}%`);
    };

    const cubicProgress = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

    const tick = (now) => {
      state.rafId = 0;
      if (!wrapper.isConnected) return;
      const reduced = isAnalysingReducedMotion(root);
      if (reduced) {
        state.pos = 0;
        state.fade = 1;
        state.sweepMode = 'idle';
        applyVars();
        return;
      }

      let needsMore = false;

      if (state.fade !== state.fadeTo) {
        const elapsed = now - state.fadeStart;
        const p = state.fadeDuration > 0 ? Math.min(1, elapsed / state.fadeDuration) : 1;
        state.fade = state.fadeFrom + (state.fadeTo - state.fadeFrom) * cubicProgress(p);
        if (p < 1) {
          needsMore = true;
        } else {
          state.fade = state.fadeTo;
        }
      }

      if (state.active && state.inView && !document.hidden) {
        if (state.sweepMode === 'delay' || state.sweepMode === 'pause') {
          if (now >= state.delayUntil) {
            state.sweepMode = 'sweep';
            state.sweepStart = now;
            state.sweepFrom = 0;
            state.sweepDuration = 1800;
            state.pos = 0;
          }
          needsMore = true;
        } else if (state.sweepMode === 'sweep') {
          const p = Math.min(1, (now - state.sweepStart) / state.sweepDuration);
          state.pos = state.sweepFrom + (1 - state.sweepFrom) * p;
          if (p >= 1) {
            state.pos = 0;
            state.sweepMode = 'pause';
            state.delayUntil = now + 576;
          }
          needsMore = true;
        } else if (state.sweepMode === 'idle' || state.sweepMode === 'finish') {
          state.sweepMode = 'delay';
          state.delayUntil = now + (state.pos > 0 ? 0 : 120);
          needsMore = true;
        }
      } else if (state.sweepMode === 'finish') {
        const p = state.sweepDuration > 0 ? Math.min(1, (now - state.sweepStart) / state.sweepDuration) : 1;
        state.pos = state.sweepFrom + (1 - state.sweepFrom) * cubicProgress(p);
        if (p >= 1) {
          state.pos = 0;
          state.sweepMode = 'idle';
        } else {
          needsMore = true;
        }
      } else {
        state.sweepMode = 'idle';
      }

      applyVars();
      if (needsMore) {
        state.rafId = requestAnimationFrame(tick);
      }
    };

    const ensureLoop = () => {
      if (!state.rafId && wrapper.isConnected && !isAnalysingReducedMotion(root)) {
        state.rafId = requestAnimationFrame(tick);
      }
    };

    const setActive = (nextActive) => {
      const flag = Boolean(nextActive);
      if (state.active === flag) return;
      state.active = flag;
      wrapper.dataset.state = flag ? 'active' : 'idle';
      if (flag) wrapper.setAttribute('aria-busy', 'true');
      else wrapper.removeAttribute('aria-busy');

      const reduced = isAnalysingReducedMotion(root);
      const now = performance.now();
      state.fadeStart = now;
      state.fadeFrom = state.fade;
      state.fadeTo = flag ? 0 : 1;
      state.fadeDuration = reduced ? 0 : (flag ? 200 : 360);

      if (flag) {
        state.sweepMode = 'delay';
        state.delayUntil = now + (state.pos > 0 ? 0 : 120);
      } else if (!reduced && state.pos > 0 && state.pos < 1) {
        state.sweepMode = 'finish';
        state.sweepStart = now;
        state.sweepFrom = state.pos;
        state.sweepDuration = Math.min(420, 1800 * (1 - state.pos) * 0.5);
      } else {
        state.sweepMode = 'idle';
        state.pos = 0;
      }

      if (reduced) {
        state.fade = 1;
        state.pos = 0;
        applyVars();
      } else {
        ensureLoop();
      }
    };

    const setText = (nextText, nextActive) => {
      if (nextActive !== undefined) setActive(nextActive);
      if (nextText === state.text) return;
      const reduced = isAnalysingReducedMotion(root);
      const prevWidth = stage.getBoundingClientRect().width;
      const prevLabel = stage.querySelector('.ds-tool-run-shimmer__label:not(.ds-tool-run-shimmer__label--exiting)');

      state.text = nextText;

      if (prevLabel) {
        if (reduced) {
          prevLabel.remove();
        } else {
          prevLabel.classList.add('ds-tool-run-shimmer__label--exiting');
          prevLabel.setAttribute('aria-hidden', 'true');
          const exitAnim = prevLabel.animate(
            [
              { opacity: 1, transform: 'translateY(0em)', filter: 'blur(0px)' },
              { opacity: 0, transform: 'translateY(-0.24em)', filter: 'blur(2px)' },
            ],
            { duration: 150, easing: ANALYSING_EASE_STANDARD, fill: 'forwards' }
          );
          exitAnim.onfinish = () => prevLabel.remove();
        }
      }

      const nextLabel = document.createElement('span');
      nextLabel.className = 'ds-tool-run-shimmer__label';
      nextLabel.textContent = nextText;
      stage.appendChild(nextLabel);

      if (!reduced) {
        nextLabel.animate(
          [
            { opacity: 0, transform: 'translateY(0.3em)', filter: 'blur(4px)' },
            { opacity: 1, transform: 'translateY(0em)', filter: 'blur(0px)' },
          ],
          { duration: 200, easing: ANALYSING_EASE_ENTER }
        );

        if (state.widthAnim) {
          state.widthAnim.cancel();
          state.widthAnim = null;
        }
        stage.dataset.sizing = 'true';
        const nextWidth = nextLabel.getBoundingClientRect().width;
        if (prevWidth > 0 && Math.abs(prevWidth - nextWidth) > 0.5) {
          const wAnim = stage.animate(
            [{ width: `${prevWidth}px` }, { width: `${nextWidth}px` }],
            { duration: 380, easing: ANALYSING_SPRING_EASING, fill: 'forwards' }
          );
          state.widthAnim = wAnim;
          wAnim.onfinish = () => {
            if (state.widthAnim === wAnim) state.widthAnim = null;
            wAnim.cancel();
            delete stage.dataset.sizing;
          };
        } else {
          delete stage.dataset.sizing;
        }
      }
    };

    const onVisibilityChange = () => {
      if (!wrapper.isConnected) {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        return;
      }
      if (!document.hidden && state.active) ensureLoop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const start = () => {
      applyVars();
      if (state.active && !isAnalysingReducedMotion(root)) {
        state.delayUntil = performance.now() + 120;
        ensureLoop();
      }
    };

    const destroy = () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (state.rafId) cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    };

    wrapper._shimmer = { setText, setActive, start, destroy };
    return wrapper;
  };

  const renderAnalysingKv = (input) => {
    const rows = Object.entries(input).map(([k, v]) => {
      const isNull = v === null;
      const formatted = typeof v === 'string'
        ? v
        : Array.isArray(v) && v.every((x) => typeof x !== 'object' || x === null)
          ? v.map((x) => String(x)).join(', ')
          : JSON.stringify(v);
      return `<div class="ds-tool-run__kv-row"><dt class="ds-tool-run__kv-key">${escapeAnalysingHtml(k)}</dt><dd class="ds-tool-run__kv-value${isNull ? ' ds-tool-run__literal' : ''}">${escapeAnalysingHtml(formatted)}</dd></div>`;
    }).join('');
    return `<dl class="ds-tool-run__kv">${rows}</dl>`;
  };

  const highlightJsonLine = (line) => {
    const tokenRe = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|\b(true|false|null)\b/g;
    let out = '';
    let idx = 0;
    for (const m of line.matchAll(tokenRe)) {
      const start = m.index ?? 0;
      if (start > idx) out += escapeAnalysingHtml(line.slice(idx, start));
      const [full, str, colon, num, lit] = m;
      if (str && colon) {
        out += `<span class="ds-tool-run__json-key">${escapeAnalysingHtml(str)}</span>${escapeAnalysingHtml(colon)}`;
      } else if (str) {
        out += `<span class="ds-code-token--string">${escapeAnalysingHtml(str)}</span>`;
      } else if (num) {
        out += `<span class="ds-code-token--number">${escapeAnalysingHtml(num)}</span>`;
      } else if (lit) {
        out += `<span class="ds-tool-run__literal">${escapeAnalysingHtml(lit)}</span>`;
      } else {
        out += escapeAnalysingHtml(full);
      }
      idx = start + full.length;
    }
    if (idx < line.length) out += escapeAnalysingHtml(line.slice(idx));
    return out;
  };

  const formatOutputCopyText = (output) => {
    if (!output) return '';
    if (output.type === 'text') return output.text;
    if (output.type === 'json') return JSON.stringify(output.value, null, 2) ?? '';
    if (output.type === 'list') {
      return output.items.map((item) => [item.lead, item.title, item.tag && `(${item.tag})`].filter(Boolean).join(' ')).join('\n');
    }
    if (output.type === 'table') {
      return [output.columns, ...output.rows.map((r) => r.map((c) => (c === null ? 'null' : String(c))))].map((r) => r.join('\t')).join('\n');
    }
    return '';
  };

  const createAnalysingFold = ({ total, visible, rowHeight, headHeight = 0, unit, contentHtml, root }) => {
    const foldable = total > visible + 1;
    const container = document.createElement('div');
    if (!foldable) {
      const body = document.createElement('div');
      body.className = 'ds-tool-run__fold-body';
      body.innerHTML = contentHtml(false);
      container.appendChild(body);
      return container;
    }

    let expanded = false;
    const foldId = `ds-tool-run-fold-${Math.random().toString(36).slice(2, 8)}`;
    const collapsedHeight = visible * rowHeight + headHeight;

    const body = document.createElement('div');
    body.id = foldId;
    body.className = 'ds-tool-run__fold-body';
    body.style.setProperty('overflow', 'hidden');
    body.style.setProperty('height', `${collapsedHeight}px`);
    body.innerHTML = contentHtml(true);

    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'ds-button ds-button--ghost ds-button--sm ds-tool-run__more';
    moreBtn.setAttribute('aria-expanded', 'false');
    moreBtn.setAttribute('aria-controls', foldId);
    const labelText = `Show ${pluralizeAnalysing(total - visible, unit)}`;
    moreBtn.innerHTML = `${ANALYSING_UI_SVGS.chevronSmall}<span>${escapeAnalysingHtml(labelText)}</span>`;

    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      expanded = !expanded;
      moreBtn.setAttribute('aria-expanded', String(expanded));
      const labelSpan = moreBtn.querySelector('span');
      if (labelSpan) labelSpan.textContent = expanded ? 'Show less' : labelText;

      body.querySelectorAll('[data-fold-extra]').forEach((node) => {
        if (expanded) node.removeAttribute('aria-hidden');
        else node.setAttribute('aria-hidden', 'true');
      });

      const reduced = isAnalysingReducedMotion(root);
      const fromH = body.getBoundingClientRect().height;
      if (body._hAnim) {
        body._hAnim.cancel();
        body._hAnim = null;
      }
      if (reduced) {
        if (expanded) body.style.removeProperty('height');
        else body.style.setProperty('height', `${collapsedHeight}px`);
        return;
      }

      if (expanded) {
        body.style.removeProperty('height');
        const targetH = body.scrollHeight;
        body.style.setProperty('height', `${fromH}px`);
        void body.offsetHeight;
        const anim = body.animate(
          [{ height: `${fromH}px` }, { height: `${targetH}px` }],
          { duration: 380, easing: ANALYSING_SPRING_EASING, fill: 'forwards' }
        );
        body._hAnim = anim;
        anim.onfinish = () => {
          if (body._hAnim === anim) body._hAnim = null;
          anim.cancel();
          body.style.removeProperty('height');
        };
      } else {
        const anim = body.animate(
          [{ height: `${fromH}px` }, { height: `${collapsedHeight}px` }],
          { duration: 380, easing: ANALYSING_SPRING_EASING, fill: 'forwards' }
        );
        body._hAnim = anim;
        anim.onfinish = () => {
          if (body._hAnim === anim) body._hAnim = null;
          anim.cancel();
          body.style.setProperty('height', `${collapsedHeight}px`);
        };
      }
    });

    container.appendChild(body);
    container.appendChild(moreBtn);
    return container;
  };

  const renderAnalysingOutputNode = (output, root) => {
    if (output.type === 'text') {
      const p = document.createElement('p');
      p.className = 'ds-tool-run__text';
      p.textContent = output.text;
      return p;
    }
    if (output.type === 'json') {
      const lines = (JSON.stringify(output.value, null, 2) ?? '').split('\n');
      return createAnalysingFold({
        total: lines.length,
        visible: 10,
        rowHeight: 20,
        headHeight: 0,
        unit: 'more line',
        root,
        contentHtml: (folded) => `<pre class="ds-tool-run__json">${lines.map((line, i) => (
          `<span class="ds-tool-run__json-line"${folded && i >= 10 ? ' data-fold-extra="true" aria-hidden="true"' : ''}>${highlightJsonLine(line)}</span>`
        )).join('')}</pre>`,
      });
    }
    if (output.type === 'list') {
      const items = output.items;
      return createAnalysingFold({
        total: items.length,
        visible: 5,
        rowHeight: 32,
        headHeight: 0,
        unit: 'more result',
        root,
        contentHtml: (folded) => `<ul class="ds-tool-run__list">${items.map((item, i) => (
          `<li class="ds-tool-run__list-row"${folded && i >= 5 ? ' data-fold-extra="true" aria-hidden="true"' : ''}>` +
          `<span class="ds-tool-run__list-lead">${escapeAnalysingHtml(item.lead || '')}</span>` +
          `<span class="ds-tool-run__list-title">${escapeAnalysingHtml(item.title)}</span>` +
          `<span class="ds-badge ds-badge--sm ds-badge--default ds-tool-run__list-tag"${item.tag ? '' : ' hidden'}>${escapeAnalysingHtml(item.tag || '')}</span>` +
          `</li>`
        )).join('')}</ul>`,
      });
    }
    const rows = output.rows || [];
    return createAnalysingFold({
      total: rows.length,
      visible: 5,
      rowHeight: 30,
      headHeight: 30,
      unit: 'more row',
      root,
      contentHtml: (folded) => (
        `<div class="ds-tool-run__table-scroll"><table class="ds-tool-run__table">` +
        `<thead><tr>${output.columns.map((c) => `<th scope="col">${escapeAnalysingHtml(c)}</th>`).join('')}</tr></thead>` +
        `<tbody>${rows.map((r, i) => (
          `<tr${folded && i >= 5 ? ' data-fold-extra="true" aria-hidden="true"' : ''}>${r.map((cell) => (
            `<td${cell === null ? ' class="ds-tool-run__literal"' : ''}>${escapeAnalysingHtml(cell === null ? 'null' : String(cell))}</td>`
          )).join('')}</tr>`
        )).join('')}</tbody></table></div>`
      ),
    });
  };

  const createCopyButton = (getCopyValue, label, root) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ds-button ds-button--ghost ds-button--icon ds-button--sm ds-tool-run__copy';
    btn.setAttribute('aria-label', label);
    btn.dataset.copyState = 'idle';

    const glyph = document.createElement('span');
    glyph.className = 'ds-tool-run__copy-glyph';
    glyph.dataset.state = 'idle';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.innerHTML = ANALYSING_UI_SVGS.copy;
    btn.appendChild(glyph);

    let resetTimer = 0;
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const value = typeof getCopyValue === 'function' ? getCopyValue() : getCopyValue;
      const ok = await copyTextToClipboard(String(value ?? ''));
      const nextState = ok ? 'copied' : 'error';
      btn.dataset.copyState = nextState;
      glyph.dataset.state = nextState;
      glyph.innerHTML = ok ? ANALYSING_UI_SVGS.copied : ANALYSING_UI_SVGS.error;

      if (!isAnalysingReducedMotion(root)) {
        glyph.animate(
          [{ opacity: 0, transform: 'scale(0.7)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 220, easing: ANALYSING_SPRING_EASING }
        );
      }

      clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        if (!btn.isConnected) return;
        btn.dataset.copyState = 'idle';
        glyph.dataset.state = 'idle';
        glyph.innerHTML = ANALYSING_UI_SVGS.copy;
        if (!isAnalysingReducedMotion(root)) {
          glyph.animate(
            [{ opacity: 0, transform: 'scale(0.7)' }, { opacity: 1, transform: 'scale(1)' }],
            { duration: 150, easing: ANALYSING_EASE_STANDARD }
          );
        }
      }, 1800);
    });

    return btn;
  };

  const createAnalysingSection = (label, copyValue, contentNode, root) => {
    const section = document.createElement('div');
    section.className = 'ds-tool-run__section';
    section.setAttribute('role', 'group');
    section.setAttribute('aria-label', label);

    const head = document.createElement('div');
    head.className = 'ds-tool-run__section-head';

    const labelEl = document.createElement('span');
    labelEl.className = 'ds-tool-run__section-label';
    labelEl.setAttribute('aria-hidden', 'true');
    labelEl.textContent = label;
    head.appendChild(labelEl);

    if (copyValue) {
      head.appendChild(createCopyButton(copyValue, `Copy ${label.toLowerCase()}`, root));
    }

    const well = document.createElement('div');
    well.className = 'ds-tool-run__well';
    well.appendChild(contentNode);

    section.appendChild(head);
    section.appendChild(well);
    return section;
  };

  scope.querySelectorAll('[data-ds-tool-run]').forEach((root) => {
    if (root.dataset.analysingMounted === 'true') return;
    root.dataset.analysingMounted = 'true';

    const uidBase = `analysing-${Math.random().toString(36).slice(2, 8)}`;
    let runId = 0;
    let timeouts = [];
    let rafIds = [];
    let calls = [];
    let demoActive = true;
    let groupOpen = true;
    let userTouched = false;
    let sawActive = false;
    let autoCollapseTimer = 0;
    let retryResolver = null;
    let decideResolver = null;
    const rowMap = new Map();
    const stackToolKeys = [];

    const clearAllTimers = () => {
      timeouts.forEach((id) => clearTimeout(id));
      timeouts = [];
      rafIds.forEach((id) => cancelAnimationFrame(id));
      rafIds = [];
      clearTimeout(autoCollapseTimer);
      autoCollapseTimer = 0;
      rowMap.forEach((entry) => {
        entry.thinkToken++;
        clearInterval(entry.counterTimer);
        entry.counterTimer = 0;
      });
      retryResolver = null;
      decideResolver = null;
    };

    const waitMs = (ms, expectedRunId) => new Promise((resolve) => {
      const id = window.setTimeout(() => {
        if (runId === expectedRunId && root.isConnected) resolve(true);
        else resolve(false);
      }, ms);
      timeouts.push(id);
    });

    // Build root structure
    root.innerHTML = '';

    const userEl = document.createElement('p');
    userEl.className = 'ds-tool-run__user';
    userEl.textContent = ANALYSING_COPY.user;

    const turnEl = document.createElement('div');
    turnEl.className = 'ds-tool-run__turn';

    const introEl = document.createElement('p');
    introEl.className = 'ds-tool-run__prose';

    const slotEl = document.createElement('div');
    slotEl.className = 'ds-tool-run__slot';
    slotEl.hidden = true;

    const rootContainer = document.createElement('div');
    rootContainer.className = 'ds-tool-run__root';

    const groupEl = document.createElement('div');
    groupEl.className = 'ds-tool-run__group';
    groupEl.dataset.open = 'true';

    const groupHead = document.createElement('div');
    groupHead.className = 'ds-tool-run__group-head';

    const listId = `${uidBase}-list`;
    const groupToggle = document.createElement('button');
    groupToggle.type = 'button';
    groupToggle.className = 'ds-tool-run__group-toggle';
    groupToggle.setAttribute('aria-expanded', 'true');
    groupToggle.setAttribute('aria-controls', listId);

    const stackEl = document.createElement('span');
    stackEl.className = 'ds-tool-run__stack';
    stackEl.setAttribute('aria-hidden', 'true');

    const groupShimmer = createShimmerElement('Using 1 tool', true, 'ds-tool-run__group-label', root);

    const groupMetaEl = document.createElement('span');
    groupMetaEl.className = 'ds-tool-run__group-meta';

    const groupChevronWrap = document.createElement('span');
    groupChevronWrap.innerHTML = ANALYSING_UI_SVGS.chevronDown;
    const groupChevron = groupChevronWrap.firstElementChild;
    groupChevron.classList.add('ds-tool-run__chevron');

    groupToggle.appendChild(stackEl);
    groupToggle.appendChild(groupShimmer);
    groupToggle.appendChild(groupMetaEl);
    groupToggle.appendChild(groupChevron);
    groupHead.appendChild(groupToggle);

    const listClip = document.createElement('div');
    listClip.id = listId;
    listClip.className = 'ds-tool-run__list-clip';

    const callsEl = document.createElement('div');
    callsEl.className = 'ds-tool-run__calls';
    callsEl.setAttribute('role', 'list');
    listClip.appendChild(callsEl);

    groupEl.appendChild(groupHead);
    groupEl.appendChild(listClip);
    rootContainer.appendChild(groupEl);
    slotEl.appendChild(rootContainer);

    const answerEl = document.createElement('p');
    answerEl.className = 'ds-tool-run__prose';
    answerEl.hidden = true;

    const againWrap = document.createElement('div');
    againWrap.className = 'ds-tool-run__again-wrap';
    againWrap.hidden = true;
    const againBtn = document.createElement('button');
    againBtn.type = 'button';
    againBtn.className = 'ds-button ds-button--ghost ds-button--sm';
    againBtn.innerHTML = `${ANALYSING_UI_SVGS.rotateMd}<span>Run again</span>`;
    againWrap.appendChild(againBtn);

    const liveRegion = document.createElement('span');
    liveRegion.className = 'ds-tool-run__sr-only';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');

    turnEl.appendChild(introEl);
    turnEl.appendChild(slotEl);
    turnEl.appendChild(answerEl);
    turnEl.appendChild(againWrap);

    root.appendChild(userEl);
    root.appendChild(turnEl);
    root.appendChild(liveRegion);

    const streamProse = (targetEl, text, expectedRunId) => {
      targetEl.hidden = false;
      targetEl.innerHTML = '';
      const words = text.match(/\S+\s*/g) ?? [];
      const chunks = [];
      for (let i = 0, c = 0; i < words.length; c++) {
        const size = ANALYSING_CHUNK_SIZES[c % ANALYSING_CHUNK_SIZES.length];
        chunks.push(words.slice(i, i + size).join(''));
        i += size;
      }
      if (isAnalysingReducedMotion(root)) {
        const span = document.createElement('span');
        span.textContent = text;
        targetEl.appendChild(span);
        return;
      }
      let startTime = 0;
      let renderedCount = 0;
      const step = (ts) => {
        if (runId !== expectedRunId || !root.isConnected) return;
        if (!startTime) startTime = ts;
        const count = Math.min(chunks.length, Math.floor((ts - startTime) / 34) + 1);
        while (renderedCount < count) {
          const span = document.createElement('span');
          span.className = 'ds-tool-run__chunk';
          span.textContent = chunks[renderedCount];
          targetEl.appendChild(span);
          renderedCount++;
        }
        if (renderedCount < chunks.length) {
          const id = requestAnimationFrame(step);
          rafIds.push(id);
        }
      };
      const id = requestAnimationFrame(step);
      rafIds.push(id);
    };

    const setGroupOpen = (nextOpen, { stagger = false, animate = true } = {}) => {
      groupOpen = nextOpen;
      if (nextOpen) groupEl.dataset.open = 'true';
      else delete groupEl.dataset.open;
      groupToggle.setAttribute('aria-expanded', String(nextOpen));

      const reduced = isAnalysingReducedMotion(root);
      if (nextOpen && stagger && !reduced) {
        const items = Array.from(callsEl.children);
        items.forEach((item, idx) => {
          item.animate(
            [
              { opacity: 0, transform: 'translateY(-6px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 260,
              delay: idx * 35,
              easing: ANALYSING_SPRING_EASING,
              fill: 'backwards',
            }
          );
        });
      }

      if (!animate) {
        listClip.hidden = !nextOpen;
        return;
      }
      animateAnalysingHeight(listClip, { open: nextOpen, fade: true, reduced });
    };

    groupToggle.addEventListener('click', () => {
      userTouched = true;
      clearTimeout(autoCollapseTimer);
      setGroupOpen(!groupOpen, { stagger: !groupOpen, animate: true });
    });

    const syncGroupHeader = () => {
      const hasRunning = calls.some((c) => c.status === 'running');
      const hasApproval = calls.some((c) => c.status === 'approval');
      const errorCount = calls.filter((c) => c.status === 'error').length;
      const isActive = hasRunning || hasApproval || errorCount > 0 || demoActive;
      const totalDuration = calls.reduce((sum, c) => sum + (c.status === 'success' || c.status === 'error' ? (c.durationMs ?? 0) : 0), 0);

      const label = hasApproval && !hasRunning
        ? 'Waiting for approval'
        : (hasRunning || demoActive) && !errorCount
          ? `Using ${pluralizeAnalysing(calls.length, 'tool')}`
          : `Used ${pluralizeAnalysing(calls.length, 'tool')}`;

      const shimmerActive = (hasRunning || demoActive) && !hasApproval && !errorCount;
      groupShimmer._shimmer.setText(label, shimmerActive);

      const metaText = errorCount && !hasRunning
        ? `${errorCount} failed`
        : (hasApproval || hasRunning || demoActive)
          ? ''
          : formatAnalysingDuration(totalDuration);

      const prevMeta = groupMetaEl.dataset.meta || '';
      if (prevMeta !== metaText) {
        groupMetaEl.dataset.meta = metaText;
        const reduced = isAnalysingReducedMotion(root);
        const existingSpan = groupMetaEl.querySelector('span');
        if (existingSpan && !reduced) {
          const outSpan = existingSpan;
          outSpan.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: ANALYSING_EASE_STANDARD, fill: 'forwards' }).onfinish = () => outSpan.remove();
        } else {
          groupMetaEl.innerHTML = '';
        }

        if (metaText) {
          const span = document.createElement('span');
          if (errorCount) span.className = 'ds-badge ds-badge--sm ds-badge--red';
          span.textContent = metaText;
          groupMetaEl.appendChild(span);
          if (!reduced) {
            span.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: ANALYSING_EASE_STANDARD });
          }
        }
      }

      // Sync stacked brand marks
      calls.forEach((c) => {
        if (stackToolKeys.includes(c.tool)) return;
        stackToolKeys.push(c.tool);
        if (stackToolKeys.length <= 4) {
          const brand = ANALYSING_BRAND_SVGS[c.tool];
          const itemEl = document.createElement('span');
          itemEl.className = 'ds-tool-run__stack-item';
          const markEl = document.createElement('span');
          markEl.className = 'ds-tool-run__stack-mark';
          markEl.setAttribute('aria-hidden', 'true');
          markEl.innerHTML = brand ? brand.svg : '';
          itemEl.appendChild(markEl);
          const idx = stackToolKeys.length - 1;
          stackEl.appendChild(itemEl);

          if (stackToolKeys.length > 1 && !isAnalysingReducedMotion(root)) {
            itemEl.animate(
              [
                { opacity: 0, transform: 'scale(0.6)', width: '0px', marginLeft: '0px' },
                { opacity: 1, transform: 'scale(1)', width: '20px', marginLeft: idx ? '-4px' : '0px' },
              ],
              { duration: 380, easing: ANALYSING_SPRING_EASING }
            );
          }
        }
      });

      if ((hasApproval || errorCount > 0) && !groupOpen) {
        setGroupOpen(true, { stagger: true, animate: true });
      }

      if (isActive) {
        sawActive = true;
        clearTimeout(autoCollapseTimer);
      } else if (sawActive && groupOpen && !userTouched && calls.length > 0) {
        clearTimeout(autoCollapseTimer);
        autoCollapseTimer = window.setTimeout(() => {
          if (!root.isConnected) return;
          sawActive = false;
          setGroupOpen(false, { animate: true });
        }, 450);
      }
    };

    const createOrUpdateRow = (call) => {
      let entry = rowMap.get(call.id);
      const isNew = !entry;

      if (isNew) {
        const rowId = `${uidBase}-${call.id}`;
        const itemEl = document.createElement('div');
        itemEl.className = 'ds-tool-run__item';
        itemEl.setAttribute('role', 'listitem');

        const callEl = document.createElement('div');
        callEl.className = 'ds-tool-run__call';
        callEl.dataset.status = call.status;

        const headClip = document.createElement('div');
        headClip.className = 'ds-tool-run__head-clip';

        const headEl = document.createElement('div');
        headEl.className = 'ds-tool-run__head';

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'ds-tool-run__toggle';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', `${rowId}-body`);
        toggleBtn.setAttribute('aria-labelledby', `${rowId}-name ${rowId}-title ${rowId}-state`);

        const markEl = document.createElement('span');
        markEl.className = 'ds-tool-run__mark';
        markEl.setAttribute('aria-hidden', 'true');
        markEl.innerHTML = ANALYSING_BRAND_SVGS[call.tool]?.svg || '';

        const titleWrap = document.createElement('span');
        titleWrap.className = 'ds-tool-run__title';
        titleWrap.setAttribute('aria-hidden', 'true');

        const srName = document.createElement('span');
        srName.id = `${rowId}-name`;
        srName.className = 'ds-tool-run__sr-only';
        srName.textContent = `${ANALYSING_BRAND_SVGS[call.tool]?.name || call.tool}:`;

        const titleInner = document.createElement('span');
        titleInner.id = `${rowId}-title`;
        titleInner.className = 'ds-tool-run__title-inner';

        const titleShimmer = createShimmerElement(getAnalysingTitle(call), call.status === 'running', 'ds-tool-run__title-text', root);
        titleInner.appendChild(titleShimmer);
        titleWrap.appendChild(srName);
        titleWrap.appendChild(titleInner);

        const asideEl = document.createElement('span');
        asideEl.className = 'ds-tool-run__aside';

        const statusEl = document.createElement('span');
        statusEl.className = 'ds-tool-run__status';
        statusEl.setAttribute('aria-hidden', 'true');

        const srState = document.createElement('span');
        srState.id = `${rowId}-state`;
        srState.className = 'ds-tool-run__sr-only';

        const chevronWrap = document.createElement('span');
        chevronWrap.innerHTML = ANALYSING_UI_SVGS.chevronDown;
        const chevronEl = chevronWrap.firstElementChild;
        chevronEl.classList.add('ds-tool-run__chevron');

        headEl.appendChild(toggleBtn);
        headEl.appendChild(markEl);
        headEl.appendChild(titleWrap);
        headEl.appendChild(asideEl);
        headEl.appendChild(statusEl);
        headEl.appendChild(srState);
        headEl.appendChild(chevronEl);
        headClip.appendChild(headEl);

        const liveClip = document.createElement('div');
        liveClip.className = 'ds-tool-run__live-clip';
        liveClip.setAttribute('aria-hidden', 'true');
        liveClip.hidden = true;

        const liveBox = document.createElement('div');
        liveBox.className = 'ds-tool-run__live';
        liveClip.appendChild(liveBox);

        const bodyClip = document.createElement('div');
        bodyClip.id = `${rowId}-body`;
        bodyClip.className = 'ds-tool-run__body-clip';
        bodyClip.hidden = true;

        const bodyEl = document.createElement('div');
        bodyEl.className = 'ds-tool-run__body';
        bodyClip.appendChild(bodyEl);

        const rowLive = document.createElement('span');
        rowLive.className = 'ds-tool-run__sr-only';
        rowLive.setAttribute('role', 'status');
        rowLive.setAttribute('aria-live', 'polite');

        callEl.appendChild(headClip);
        callEl.appendChild(liveClip);
        callEl.appendChild(bodyClip);
        callEl.appendChild(rowLive);
        itemEl.appendChild(callEl);
        callsEl.appendChild(itemEl);

        entry = {
          call,
          open: false,
          lastStatus: null,
          lastAsideKey: null,
          thinkToken: 0,
          hasLiveContent: false,
          runStartTime: 0,
          lastSeconds: -1,
          counterTimer: 0,
          itemEl,
          callEl,
          headClip,
          headEl,
          toggleBtn,
          titleShimmer,
          noteEl: null,
          asideEl,
          statusEl,
          srState,
          liveClip,
          liveBox,
          bodyClip,
          bodyEl,
          outputSectionEl: null,
          rowLive,
        };
        rowMap.set(call.id, entry);

        liveClip.addEventListener('click', () => {
          toggleBtn.click();
        });

        toggleBtn.addEventListener('click', () => {
          userTouched = true;
          clearTimeout(autoCollapseTimer);
          entry.open = !entry.open;
          toggleBtn.setAttribute('aria-expanded', String(entry.open));
          const reducedNow = isAnalysingReducedMotion(root);
          if (entry.open) {
            callEl.dataset.open = 'true';
            renderRowBody(entry);
            if (!liveClip.hidden) {
              animateAnalysingHeight(liveClip, { open: false, fade: true, reduced: reducedNow, duration: 240 });
            }
          } else {
            delete callEl.dataset.open;
            if (entry.call.status === 'running' && entry.hasLiveContent) {
              animateAnalysingHeight(liveClip, { open: true, fade: true, reduced: reducedNow, duration: 260 });
            }
          }
          animateAnalysingHeight(bodyClip, { open: entry.open, fade: true, reduced: reducedNow });
        });

        titleShimmer._shimmer.start();

        if (!isAnalysingReducedMotion(root) && calls.length > 1) {
          itemEl.hidden = true;
          animateAnalysingHeight(itemEl, { open: true, fade: true, reduced: false, duration: 380, opacityDelay: 60 });
        }
      }

      entry.call = call;
      const reduced = isAnalysingReducedMotion(root);
      const prevHeadHeight = isNew ? 0 : entry.headClip.getBoundingClientRect().height;
      const statusChanged = entry.lastStatus !== call.status;

      entry.callEl.dataset.status = call.status;

      // Update title with shimmer + blur-slide morph
      const nextTitle = getAnalysingTitle(call);
      entry.titleShimmer._shimmer.setText(nextTitle, call.status === 'running');

      // Update note row (only for error / approval)
      const nextNote = (call.status === 'error' || call.status === 'approval') && call.message ? call.message : '';
      if (nextNote) {
        if (!entry.noteEl) {
          entry.noteEl = document.createElement('span');
          entry.noteEl.className = 'ds-tool-run__note';
          entry.noteEl.setAttribute('aria-hidden', 'true');
          entry.headEl.insertBefore(entry.noteEl, entry.asideEl);
        }
        entry.noteEl.textContent = nextNote;
      } else if (entry.noteEl) {
        entry.noteEl.remove();
        entry.noteEl = null;
      }

      if (!isNew) {
        const nextHeadHeight = entry.headEl.offsetHeight;
        animateAnalysingHeightBetween(entry.headClip, prevHeadHeight, nextHeadHeight, { reduced, duration: 380 });
      }

      // Update aside (running counter / meta / actions / denied)
      const summary = call.summary ?? summarizeAnalysingOutput(call.output);
      const durationText = formatAnalysingDuration(call.durationMs);
      const asideKey = call.status === 'running'
        ? 'running'
        : call.status === 'approval'
          ? 'approval'
          : call.status === 'error'
            ? 'error'
            : call.status === 'denied'
              ? 'denied'
              : call.status === 'success' && (summary || durationText)
                ? `meta:${summary}:${durationText}`
                : 'empty';

      if (call.status !== 'running') {
        clearInterval(entry.counterTimer);
        entry.counterTimer = 0;
        if (entry.hasLiveContent) {
          stopRowThinkingStream(entry, { immediate: isNew });
        }
      }

      if (entry.lastAsideKey !== asideKey) {
        entry.lastAsideKey = asideKey;
        clearInterval(entry.counterTimer);
        entry.counterTimer = 0;

        const oldAside = entry.asideEl.querySelector('.ds-tool-run__aside-inner');
        if (oldAside && !reduced && !isNew) {
          oldAside.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: ANALYSING_EASE_STANDARD, fill: 'forwards' }).onfinish = () => oldAside.remove();
        } else {
          entry.asideEl.innerHTML = '';
        }

        if (asideKey !== 'empty') {
          const inner = document.createElement('span');
          inner.className = 'ds-tool-run__aside-inner';

          if (asideKey === 'running') {
            entry.runStartTime = performance.now();
            entry.lastSeconds = 0;
            const counter = document.createElement('span');
            counter.className = 'ds-tool-run__counter';
            counter.setAttribute('aria-hidden', 'true');
            const initialVal = document.createElement('span');
            initialVal.className = 'ds-tool-run__counter-value';
            initialVal.textContent = '0s';
            counter.appendChild(initialVal);
            inner.appendChild(counter);

            entry.counterTimer = window.setInterval(() => {
              if (!counter.isConnected || entry.call.status !== 'running') {
                clearInterval(entry.counterTimer);
                entry.counterTimer = 0;
                return;
              }
              const secs = Math.max(0, Math.floor((performance.now() - entry.runStartTime) / 1000));
              if (secs === entry.lastSeconds) return;
              entry.lastSeconds = secs;
              const prevVal = counter.querySelector('.ds-tool-run__counter-value:not([data-exiting])');
              const nextVal = document.createElement('span');
              nextVal.className = 'ds-tool-run__counter-value';
              nextVal.textContent = `${secs}s`;
              counter.appendChild(nextVal);

              if (isAnalysingReducedMotion(root)) {
                prevVal?.remove();
                return;
              }
              if (prevVal) {
                prevVal.dataset.exiting = 'true';
                prevVal.animate(
                  [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-4px)' }],
                  { duration: 100, easing: ANALYSING_EASE_STANDARD, fill: 'forwards' }
                ).onfinish = () => prevVal.remove();
              }
              nextVal.animate(
                [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 150, easing: ANALYSING_EASE_ENTER }
              );
            }, 250);
          } else if (asideKey === 'approval') {
            const actions = document.createElement('span');
            actions.className = 'ds-tool-run__actions';

            const denyBtn = document.createElement('button');
            denyBtn.type = 'button';
            denyBtn.className = 'ds-button ds-button--secondary ds-button--sm';
            denyBtn.setAttribute('aria-label', `Deny: ${nextTitle}`);
            denyBtn.textContent = 'Deny';
            denyBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const res = decideResolver;
              decideResolver = null;
              res?.('deny');
            });

            const allowBtn = document.createElement('button');
            allowBtn.type = 'button';
            allowBtn.className = 'ds-button ds-button--primary ds-button--sm';
            allowBtn.setAttribute('aria-label', `Allow: ${nextTitle}`);
            allowBtn.textContent = 'Allow';
            allowBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const res = decideResolver;
              decideResolver = null;
              res?.('allow');
            });

            actions.appendChild(denyBtn);
            actions.appendChild(allowBtn);
            inner.appendChild(actions);
          } else if (asideKey === 'error') {
            const actions = document.createElement('span');
            actions.className = 'ds-tool-run__actions';
            const retryBtn = document.createElement('button');
            retryBtn.type = 'button';
            retryBtn.className = 'ds-button ds-button--secondary ds-button--sm';
            retryBtn.setAttribute('aria-label', `Retry: ${nextTitle}`);
            retryBtn.innerHTML = `${ANALYSING_UI_SVGS.rotateSm}<span>Retry</span>`;
            retryBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const res = retryResolver;
              retryResolver = null;
              res?.();
            });
            actions.appendChild(retryBtn);
            inner.appendChild(actions);
          } else if (asideKey === 'denied') {
            const meta = document.createElement('span');
            meta.className = 'ds-tool-run__meta';
            meta.setAttribute('aria-hidden', 'true');
            const badge = document.createElement('span');
            badge.className = 'ds-badge ds-badge--sm ds-badge--default';
            badge.textContent = 'Denied';
            meta.appendChild(badge);
            inner.appendChild(meta);
          } else {
            const meta = document.createElement('span');
            meta.className = 'ds-tool-run__meta';
            meta.setAttribute('aria-hidden', 'true');
            if (summary) {
              const sumSpan = document.createElement('span');
              sumSpan.className = 'ds-tool-run__meta-summary';
              sumSpan.appendChild(document.createTextNode(summary));
              if (durationText) {
                const dot = document.createElement('span');
                dot.className = 'ds-tool-run__meta-dot';
                dot.textContent = '\u00b7';
                sumSpan.appendChild(dot);
              }
              meta.appendChild(sumSpan);
            }
            if (durationText) {
              const durSpan = document.createElement('span');
              durSpan.textContent = durationText;
              meta.appendChild(durSpan);
            }
            inner.appendChild(meta);
          }

          entry.asideEl.appendChild(inner);
          if (!reduced && !isNew) {
            inner.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: ANALYSING_EASE_STANDARD });
          }
        }
      }

      // Update status icon with popLayout scale + pathLength checkmark draw
      if (statusChanged) {
        const oldIcon = entry.statusEl.querySelector('.ds-tool-run__status-icon');
        if (oldIcon && !reduced && !isNew) {
          oldIcon.animate(
            [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.6)' }],
            { duration: 100, easing: ANALYSING_EASE_STANDARD, fill: 'forwards' }
          ).onfinish = () => oldIcon.remove();
        } else {
          entry.statusEl.innerHTML = '';
        }

        const iconWrap = document.createElement('span');
        iconWrap.className = 'ds-tool-run__status-icon';
        iconWrap.dataset.status = call.status;

        if (call.status === 'running') iconWrap.innerHTML = ANALYSING_UI_SVGS.spinner;
        else if (call.status === 'success') iconWrap.innerHTML = ANALYSING_UI_SVGS.check(!isNew && !reduced);
        else if (call.status === 'error') iconWrap.innerHTML = ANALYSING_UI_SVGS.error;
        else if (call.status === 'approval') iconWrap.innerHTML = ANALYSING_UI_SVGS.approval;
        else iconWrap.innerHTML = ANALYSING_UI_SVGS.denied;

        entry.statusEl.appendChild(iconWrap);
        if (!reduced && !isNew) {
          iconWrap.animate(
            [{ opacity: 0, transform: 'scale(0.6)' }, { opacity: 1, transform: 'scale(1)' }],
            { duration: 240, easing: ANALYSING_SPRING_EASING }
          );
        }

        if (!isNew) {
          const toolName = ANALYSING_BRAND_SVGS[call.tool]?.name || call.tool;
          entry.rowLive.textContent = call.status === 'running'
            ? `${toolName}: ${nextTitle}`
            : call.status === 'success'
              ? `${toolName}: ${[nextTitle, summary].filter(Boolean).join(', ')}`
              : call.status === 'error'
                ? `${toolName}: ${nextTitle}. ${call.message || ''}`.trim()
                : call.status === 'approval'
                  ? `${toolName}: ${nextTitle} needs your approval`
                  : `${toolName}: ${nextTitle}, denied`;
        }
        entry.lastStatus = call.status;
      }

      // Screen-reader state
      const stateLabels = { running: 'Running', success: 'Done', error: 'Failed', approval: 'Needs approval', denied: 'Denied' };
      entry.srState.textContent = call.status === 'success'
        ? [stateLabels.success, summary, durationText].filter(Boolean).join(', ')
        : call.status === 'error'
          ? [stateLabels.error, call.message].filter(Boolean).join(': ')
          : stateLabels[call.status];

      // Refresh expanded body if already open
      if (entry.open) {
        renderRowBody(entry);
      }
    };

    const renderRowBody = (entry) => {
      const call = entry.call;
      if (!entry.bodyEl.children.length && call.input && Object.keys(call.input).length) {
        const kvWrap = document.createElement('div');
        kvWrap.innerHTML = renderAnalysingKv(call.input);
        entry.bodyEl.appendChild(createAnalysingSection('Input', JSON.stringify(call.input, null, 2), kvWrap.firstElementChild, root));
      }

      if (entry.outputSectionEl) {
        entry.outputSectionEl.querySelectorAll('.ds-tool-run-shimmer').forEach((s) => s._shimmer?.destroy());
        entry.outputSectionEl.remove();
        entry.outputSectionEl = null;
      }

      let secLabel = 'Output';
      let copyVal = null;
      let contentNode = null;

      if (call.status === 'running') {
        const shimmer = createShimmerElement('Waiting for the result', true, 'ds-tool-run__pending', root);
        shimmer._shimmer.start();
        contentNode = shimmer;
      } else if (call.status === 'approval') {
        const p = document.createElement('p');
        p.className = 'ds-tool-run__pending';
        p.textContent = 'Runs after you allow it.';
        contentNode = p;
      } else if (call.status === 'denied') {
        const p = document.createElement('p');
        p.className = 'ds-tool-run__pending';
        p.textContent = 'Not run. You denied this call.';
        contentNode = p;
      } else if (call.status === 'error') {
        secLabel = 'Error';
        copyVal = call.message || 'The call failed without a reason.';
        const p = document.createElement('p');
        p.className = 'ds-tool-run__error-text';
        p.textContent = copyVal;
        contentNode = p;
      } else if (call.output) {
        copyVal = formatOutputCopyText(call.output);
        contentNode = renderAnalysingOutputNode(call.output, root);
      } else {
        const p = document.createElement('p');
        p.className = 'ds-tool-run__pending';
        p.textContent = 'No output.';
        contentNode = p;
      }

      entry.outputSectionEl = createAnalysingSection(secLabel, copyVal, contentNode, root);
      entry.bodyEl.appendChild(entry.outputSectionEl);
    };

    const stopRowThinkingStream = (entry, { immediate = false } = {}) => {
      if (!entry) return;
      entry.thinkToken++;
      entry.hasLiveContent = false;
      clearInterval(entry.counterTimer);
      entry.counterTimer = 0;

      if (immediate || isAnalysingReducedMotion(root)) {
        if (entry.liveClip._hAnim) {
          entry.liveClip._hAnim.cancel();
          entry.liveClip._hAnim = null;
        }
        if (entry.liveClip._oAnim) {
          entry.liveClip._oAnim.cancel();
          entry.liveClip._oAnim = null;
        }
        entry.liveClip.hidden = true;
        entry.liveClip.style.removeProperty('height');
        entry.liveClip.style.removeProperty('opacity');
        entry.liveClip.style.removeProperty('overflow');
        entry.liveBox.innerHTML = '';
        return;
      }

      if (!entry.liveClip.hidden) {
        animateAnalysingHeight(entry.liveClip, {
          open: false,
          fade: true,
          reduced: false,
          duration: 260,
          onComplete: () => {
            if (!entry.hasLiveContent) entry.liveBox.innerHTML = '';
          },
        });
      }
    };

    const runRowThinkingStream = async (entry, stepsArray, expectedRunId) => {
      if (!entry || !stepsArray || !stepsArray.length) return true;
      const token = ++entry.thinkToken;
      entry.hasLiveContent = true;
      entry.liveBox.innerHTML = '';

      const reduced = isAnalysingReducedMotion(root);
      if (!entry.open) {
        animateAnalysingHeight(entry.liveClip, { open: true, fade: true, reduced, duration: 260 });
      }

      for (let sIdx = 0; sIdx < stepsArray.length; sIdx++) {
        if (runId !== expectedRunId || entry.thinkToken !== token || !root.isConnected) return false;

        if (sIdx > 0) {
          if (!(await waitMs(480, expectedRunId))) return false;
          if (entry.thinkToken !== token) return false;
          const prevLayer = entry.liveBox.querySelector('.ds-tool-run__live-layer:not([data-exiting])');
          if (prevLayer) {
            if (reduced) {
              prevLayer.remove();
            } else {
              prevLayer.dataset.exiting = 'true';
              prevLayer.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: 100, easing: ANALYSING_EASE_STANDARD, fill: 'forwards' }
              ).onfinish = () => prevLayer.remove();
            }
          }
        }

        const layer = document.createElement('div');
        layer.className = 'ds-tool-run__live-layer';
        const slot = document.createElement('div');
        slot.className = 'ds-tool-run__live-slot';
        const tail = document.createElement('div');
        tail.className = 'ds-tool-run__live-tail';
        slot.appendChild(tail);
        layer.appendChild(slot);
        entry.liveBox.appendChild(layer);

        if (sIdx > 0 && !reduced) {
          layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: ANALYSING_EASE_ENTER });
        }

        const words = stepsArray[sIdx].split(' ');
        if (reduced) {
          words.forEach((w) => {
            const tokenEl = document.createElement('span');
            tokenEl.className = 'ds-streaming-token';
            const wordEl = document.createElement('span');
            wordEl.className = 'ds-streaming-word';
            wordEl.textContent = w;
            tokenEl.appendChild(wordEl);
            tokenEl.appendChild(document.createTextNode(' '));
            tail.appendChild(tokenEl);
          });
          if (Math.max(0, tail.offsetHeight - slot.clientHeight) > 0) {
            slot.dataset.overflow = 'true';
          }
          if (!(await waitMs(700, expectedRunId))) return false;
          if (entry.thinkToken !== token) return false;
          continue;
        }

        const caret = document.createElement('span');
        caret.className = 'ds-streaming-caret';
        caret.setAttribute('aria-hidden', 'true');
        tail.appendChild(caret);

        const wordSpans = [];
        let prevOverflow = 0;
        const WORD_INTERVAL_MS = 42;

        for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
          if (runId !== expectedRunId || entry.thinkToken !== token || !root.isConnected) return false;

          const tokenEl = document.createElement('span');
          tokenEl.className = 'ds-streaming-token';
          const wordEl = document.createElement('span');
          wordEl.className = 'ds-streaming-word ds-streaming-word--fresh';
          wordEl.textContent = words[wordIdx];
          tokenEl.appendChild(wordEl);
          tokenEl.appendChild(document.createTextNode(' '));
          tail.insertBefore(tokenEl, caret);
          wordSpans.push(wordEl);

          if (wordSpans.length > 3) {
            wordSpans[wordSpans.length - 4].classList.remove('ds-streaming-word--fresh');
          }

          const newOverflow = Math.max(0, tail.offsetHeight - slot.clientHeight);
          if (newOverflow > 0) slot.dataset.overflow = 'true';
          else delete slot.dataset.overflow;

          const delta = newOverflow - prevOverflow;
          prevOverflow = newOverflow;
          if (delta > 0) {
            let currentY = 0;
            if (tail._yAnim) {
              const tf = getComputedStyle(tail).transform;
              if (tf && tf !== 'none') {
                currentY = new DOMMatrixReadOnly(tf).m42 || 0;
              }
              tail._yAnim.cancel();
            }
            tail._yAnim = tail.animate(
              [{ transform: `translateY(${currentY + delta}px)` }, { transform: 'translateY(0px)' }],
              { duration: 300, easing: ANALYSING_EASE_STANDARD }
            );
          }

          if (wordIdx + 1 < words.length) {
            if (!(await waitMs(WORD_INTERVAL_MS, expectedRunId))) return false;
            if (entry.thinkToken !== token) return false;
          }
        }

        const tailFresh = wordSpans.slice(Math.max(0, wordSpans.length - 3));
        tailFresh.forEach((span, idx) => {
          window.setTimeout(() => {
            if (span.isConnected && entry.thinkToken === token) {
              span.classList.remove('ds-streaming-word--fresh');
            }
          }, (idx + 1) * 65);
        });
        window.setTimeout(() => {
          if (!caret.isConnected || entry.thinkToken !== token) return;
          caret.classList.add('ds-streaming-caret--done');
          window.setTimeout(() => {
            if (caret.isConnected) caret.remove();
          }, 260);
        }, tailFresh.length * 65);
      }

      if (!(await waitMs(380, expectedRunId))) return false;
      return entry.thinkToken === token;
    };

    const addCall = (callObj) => {
      calls.push(callObj);
      createOrUpdateRow(callObj);
      syncGroupHeader();
    };

    const updateCall = (id, patch) => {
      const target = calls.find((c) => c.id === id);
      if (!target) return;
      Object.assign(target, patch);
      createOrUpdateRow(target);
      syncGroupHeader();
    };

    const startDemo = async () => {
      const myRun = ++runId;
      clearAllTimers();
      rowMap.forEach((entry) => entry.titleShimmer._shimmer?.destroy());
      rowMap.clear();
      stackToolKeys.length = 0;
      calls = [];
      demoActive = true;
      userTouched = false;
      sawActive = false;

      introEl.innerHTML = '';
      slotEl.hidden = true;
      slotEl.style.removeProperty('height');
      slotEl.style.removeProperty('opacity');
      stackEl.innerHTML = '';
      callsEl.innerHTML = '';
      groupMetaEl.innerHTML = '';
      delete groupMetaEl.dataset.meta;
      groupShimmer._shimmer.setText('Using 1 tool', true);
      groupShimmer._shimmer.start();
      setGroupOpen(true, { animate: false });

      answerEl.hidden = true;
      answerEl.innerHTML = '';
      againWrap.hidden = true;
      liveRegion.textContent = '';

      const dataset = buildAnalysingCalls();
      const { issues, project, migrations, post } = dataset;
      const reduced = isAnalysingReducedMotion(root);

      if (!(await waitMs(120, myRun))) return;
      streamProse(introEl, ANALYSING_COPY.intro, myRun);

      // Step 1: GitHub running with live thinking preview -> collapse on done
      if (!(await waitMs(480, myRun))) return;
      addCall({ ...issues, status: 'running' });
      animateAnalysingHeight(slotEl, { open: true, fade: true, reduced });
      if (!(await waitMs(reduced ? 50 : 390, myRun))) return;
      if (!(await runRowThinkingStream(rowMap.get(issues.id), issues.thinkingSteps, myRun))) return;
      updateCall(issues.id, { status: 'success' });

      // Wait for Row 1 live preview to collapse smoothly before starting Row 2
      if (!(await waitMs(reduced ? 60 : 320, myRun))) return;

      // Step 2: Linear running with live thinking preview -> collapse on done
      addCall({ ...project, status: 'running' });
      if (!(await waitMs(reduced ? 50 : 390, myRun))) return;
      if (!(await runRowThinkingStream(rowMap.get(project.id), project.thinkingSteps, myRun))) return;
      updateCall(project.id, { status: 'success' });

      // Wait for Row 2 live preview to collapse smoothly before starting Row 3
      if (!(await waitMs(reduced ? 60 : 320, myRun))) return;

      // Step 3: PostgreSQL running with live thinking preview -> timeout error
      addCall({ ...migrations, status: 'running', durationMs: 5000 });
      if (!(await waitMs(reduced ? 50 : 390, myRun))) return;
      if (!(await runRowThinkingStream(rowMap.get(migrations.id), migrations.thinkingSteps, myRun))) return;
      updateCall(migrations.id, { status: 'error' });
      liveRegion.textContent = 'PostgreSQL timed out. Retry it to continue.';

      await new Promise((resolve) => { retryResolver = resolve; });
      if (runId !== myRun || !root.isConnected) return;

      // Step 3 Retry: PostgreSQL re-opens live thinking preview -> collapse on done
      updateCall(migrations.id, { status: 'running', durationMs: migrations.durationMs });
      if (!(await runRowThinkingStream(rowMap.get(migrations.id), migrations.retryThinkingSteps, myRun))) return;
      updateCall(migrations.id, { status: 'success' });

      // Wait for Row 3 live preview to collapse before Slack approval
      if (!(await waitMs(reduced ? 60 : 320, myRun))) return;
      addCall({ ...post, status: 'approval' });

      const decision = await new Promise((resolve) => { decideResolver = resolve; });
      if (runId !== myRun || !root.isConnected) return;

      if (decision === 'allow') {
        updateCall(post.id, { status: 'running' });
        if (!(await runRowThinkingStream(rowMap.get(post.id), post.thinkingSteps, myRun))) return;
        updateCall(post.id, { status: 'success' });
        liveRegion.textContent = 'Allowed. This preview simulates the post, so nothing was sent to Slack.';
      } else {
        updateCall(post.id, { status: 'denied' });
        liveRegion.textContent = 'Denied. Nothing was posted.';
      }

      demoActive = false;
      syncGroupHeader();

      if (!(await waitMs(reduced ? 150 : 950, myRun))) return;
      streamProse(answerEl, ANALYSING_COPY[decision], myRun);

      if (!(await waitMs(700, myRun))) return;
      againWrap.hidden = false;
      if (!reduced) {
        againWrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: ANALYSING_EASE_STANDARD });
      }
      liveRegion.textContent = ANALYSING_COPY[decision];
    };

    againBtn.addEventListener('click', () => {
      startDemo();
    });

    requestAnimationFrame(() => {
      if (root.isConnected) {
        startDemo();
      } else {
        requestAnimationFrame(() => {
          if (root.isConnected) startDemo();
        });
      }
    });
  });


  // ── Action Button State (idle -> pending -> success -> idle) ──
  const ACTION_SPRING_EASING = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timing-function', 'linear(0, 1)')
    ? 'linear(0,.0213,.0739,.1443,.2235,.305,.3849,.4606,.5305,.594,.6508,.7011,.7452,.7836,.8168,.8454,.8699,.8907,.9084,.9234,.9361,.9467,.9557,.9632,.9694,.9747,.979,.9826,.9857,.9882,.9902,.992,.9934,.9946,.9955,.9963,1)'
    : 'cubic-bezier(0.22, 1, 0.36, 1)';
  const ACTION_ARROW_SVG = '<svg class="ds-button__action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  const ACTION_CHECK_SVG = '<svg class="ds-button__action-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="ds-button__action-check-path" d="M4 12l5 5L20 6" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"></path></svg>';

  const isActionReducedMotion = (el) => (
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    || Boolean(el?.closest?.('[data-reduced-motion="true"]'))
  );

  scope.querySelectorAll('[data-ds-action-button], .ds-button--action').forEach((btn) => {
    if (btn.dataset.actionMounted === 'true') return;
    btn.dataset.actionMounted = 'true';

    const idleLabel = btn.dataset.label || btn.querySelector('.ds-button__action-sizer')?.textContent?.trim() || 'Save changes';
    const pendingLabel = btn.dataset.pendingLabel || 'Saving';
    const successLabel = btn.dataset.successLabel || 'Saved';
    const actionDuration = Math.max(0, Number(btn.dataset.actionDuration) || 440);
    const resetAfterMs = btn.dataset.resetAfter !== undefined ? Number(btn.dataset.resetAfter) : 2400;

    if (!btn.querySelector('.ds-button__action-content')) {
      const sparklesEl = btn.querySelector('.ds-button__sparkles');
      const rawText = btn.textContent?.trim() || idleLabel;
      btn.textContent = '';

      const srLabel = document.createElement('span');
      srLabel.className = 'ds-button__sr-only';
      srLabel.dataset.actionSrLabel = 'true';
      srLabel.textContent = rawText;

      const srStatus = document.createElement('span');
      srStatus.className = 'ds-button__sr-only';
      srStatus.setAttribute('role', 'status');
      srStatus.dataset.actionSrStatus = 'true';

      const content = document.createElement('span');
      content.className = 'ds-button__action-content';
      content.setAttribute('aria-hidden', 'true');

      const morph = document.createElement('span');
      morph.className = 'ds-button__action-morph';
      const sizer = document.createElement('span');
      sizer.className = 'ds-button__action-sizer';
      sizer.textContent = rawText;
      const label = document.createElement('span');
      label.className = 'ds-button__action-label';
      label.textContent = rawText;
      morph.appendChild(sizer);
      morph.appendChild(label);

      const iconSlot = document.createElement('span');
      iconSlot.className = 'ds-button__action-icon-slot';
      const phase = document.createElement('span');
      phase.className = 'ds-button__action-phase';
      phase.dataset.phase = 'idle';
      phase.innerHTML = ACTION_ARROW_SVG;
      iconSlot.appendChild(phase);

      content.appendChild(morph);
      content.appendChild(iconSlot);
      btn.appendChild(srLabel);
      btn.appendChild(srStatus);
      btn.appendChild(content);
      if (sparklesEl) btn.appendChild(sparklesEl);
    }

    const srStatusEl = btn.querySelector('[data-action-sr-status]');
    const morphEl = btn.querySelector('.ds-button__action-morph');
    const sizerEl = btn.querySelector('.ds-button__action-sizer');
    const iconSlotEl = btn.querySelector('.ds-button__action-icon-slot');

    let currentState = btn.dataset.state || 'idle';
    let actionTimer = 0;
    let resetTimer = 0;
    let widthAnim = null;

    btn.dataset.state = currentState;
    if (!btn.hasAttribute('aria-busy')) btn.setAttribute('aria-busy', String(currentState === 'pending'));

    const buildPhaseElement = (phaseName, reduced) => {
      const wrap = document.createElement('span');
      wrap.className = 'ds-button__action-phase';
      wrap.dataset.phase = phaseName;

      if (phaseName === 'pending') {
        const spinner = document.createElement('span');
        spinner.className = 'ds-button__action-spinner';
        spinner.setAttribute('aria-hidden', 'true');
        wrap.appendChild(spinner);
        if (!reduced) {
          wrap.animate(
            [
              { opacity: 0, transform: 'scale(0.6)', filter: 'blur(2px)' },
              { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
            ],
            { duration: 200, easing: ACTION_SPRING_EASING }
          );
        }
        return wrap;
      }

      if (phaseName === 'success') {
        wrap.innerHTML = ACTION_CHECK_SVG;
        if (!reduced) {
          wrap.animate(
            [
              { opacity: 0, transform: 'scale(0.6)', filter: 'blur(2px)' },
              { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
            ],
            { duration: 200, easing: ACTION_SPRING_EASING }
          );
          const pathEl = wrap.querySelector('.ds-button__action-check-path');
          if (pathEl) {
            pathEl.animate(
              [{ strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }],
              { duration: 200, delay: 50, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
            );
          }
        }
        return wrap;
      }

      wrap.innerHTML = ACTION_ARROW_SVG;
      if (!reduced) {
        wrap.animate(
          [
            { opacity: 0, transform: 'translateX(-6px)', filter: 'blur(2px)' },
            { opacity: 1, transform: 'translateX(0px)', filter: 'blur(0px)' },
          ],
          { duration: 200, easing: ACTION_SPRING_EASING }
        );
      }
      return wrap;
    };

    const setActionState = (nextState) => {
      if (nextState === currentState) return;
      const prevState = currentState;
      currentState = nextState;

      const reduced = isActionReducedMotion(btn);
      const nextText = nextState === 'pending'
        ? pendingLabel
        : nextState === 'success'
          ? successLabel
          : idleLabel;

      btn.dataset.state = nextState;
      btn.setAttribute('aria-busy', String(nextState === 'pending'));
      if (nextState === 'pending') btn.setAttribute('aria-disabled', 'true');
      else btn.removeAttribute('aria-disabled');

      if (srStatusEl) {
        srStatusEl.textContent = nextState === 'pending'
          ? pendingLabel
          : nextState === 'success'
            ? successLabel
            : '';
      }

      if (morphEl && sizerEl) {
        const prevWidth = morphEl.getBoundingClientRect().width;
        const activeLabels = Array.from(morphEl.querySelectorAll('.ds-button__action-label:not([data-exiting])'));
        activeLabels.forEach((oldLabel) => {
          if (reduced) {
            oldLabel.remove();
            return;
          }
          oldLabel.dataset.exiting = 'true';
          oldLabel.classList.add('ds-button__action-label--exiting');
          oldLabel.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
          ).onfinish = () => oldLabel.remove();
        });

        sizerEl.textContent = nextText;
        const nextLabel = document.createElement('span');
        nextLabel.className = 'ds-button__action-label';
        nextLabel.textContent = nextText;
        morphEl.appendChild(nextLabel);

        if (widthAnim) {
          widthAnim.cancel();
          widthAnim = null;
        }
        morphEl.style.removeProperty('width');
        const nextWidth = morphEl.getBoundingClientRect().width;

        if (!reduced) {
          nextLabel.animate(
            [{ opacity: 0, transform: 'translateY(2px)' }, { opacity: 1, transform: 'translateY(0px)' }],
            { duration: 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );

          if (prevWidth > 0 && Math.abs(prevWidth - nextWidth) > 0.5) {
            morphEl.dataset.morphing = 'true';
            morphEl.style.setProperty('width', `${prevWidth}px`);
            void morphEl.offsetWidth;
            const anim = morphEl.animate(
              [{ width: `${prevWidth}px` }, { width: `${nextWidth}px` }],
              { duration: 300, easing: ACTION_SPRING_EASING, fill: 'forwards' }
            );
            widthAnim = anim;
            anim.onfinish = () => {
              if (widthAnim === anim) widthAnim = null;
              anim.cancel();
              morphEl.style.removeProperty('width');
              delete morphEl.dataset.morphing;
            };
          } else {
            delete morphEl.dataset.morphing;
          }
        } else {
          delete morphEl.dataset.morphing;
        }
      }

      if (iconSlotEl) {
        const activePhases = Array.from(iconSlotEl.querySelectorAll('.ds-button__action-phase:not([data-exiting])'));
        activePhases.forEach((oldPhase) => {
          if (reduced) {
            oldPhase.remove();
            return;
          }
          oldPhase.dataset.exiting = 'true';
          const outKeyframes = prevState === 'idle'
            ? [
                { opacity: 1, transform: 'translateX(0px)', filter: 'blur(0px)' },
                { opacity: 0, transform: 'translateX(8px)', filter: 'blur(2px)' },
              ]
            : [
                { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
                { opacity: 0, transform: 'scale(0.6)', filter: 'blur(2px)' },
              ];
          oldPhase.animate(outKeyframes, { duration: 150, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }).onfinish = () => oldPhase.remove();
        });

        iconSlotEl.appendChild(buildPhaseElement(nextState, reduced));
      }
    };

    btn.addEventListener('click', () => {
      if (currentState === 'pending' || btn.disabled || btn.hasAttribute('data-disabled')) return;
      clearTimeout(actionTimer);
      clearTimeout(resetTimer);
      actionTimer = 0;
      resetTimer = 0;

      setActionState('pending');
      actionTimer = window.setTimeout(() => {
        actionTimer = 0;
        if (!btn.isConnected) return;
        setActionState('success');
        if (resetAfterMs > 0) {
          resetTimer = window.setTimeout(() => {
            resetTimer = 0;
            if (!btn.isConnected) return;
            setActionState('idle');
          }, resetAfterMs);
        }
      }, actionDuration);
    });
  });

  // Prevent navigation on disabled links
  scope.querySelectorAll('.ds-link[aria-disabled="true"], .ds-link:disabled, .ds-link.is-disabled').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // Suppress lingering focus on pop-out triggers and items when activated via pointer/mouse click
  scope.addEventListener('click', (event) => {
    const popoutEl = event.target.closest(
      '.ds-menu__trigger, .ds-menu__item, [role="menuitem"], [role="menuitemradio"], ' +
      '.ds-dropdown__trigger, .ds-dropdown__item, .ds-select__trigger, .ds-select__option, [role="option"], ' +
      '.ds-date-picker__trigger, .ds-date-picker__nav-arrow, .ds-date-picker__nav-trigger, .ds-date-picker__day, .ds-date-picker__preset, .ds-date-picker__nav-btn, ' +
      '.ds-search-trigger, .ds-search-input__clear, .ds-filter__trigger, .ds-filter__item, .ds-filter__clear, .ds-filter-reset, .ds-filter-pill, .ds-cmd-palette-item, [data-slot="command-palette-item"], .ds-pagination__menu-item, .ds-popover__trigger, .ds-progress-step'
    );
    if (popoutEl && typeof popoutEl.blur === 'function') {
      popoutEl.blur();
    }
  });

  scope.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('[data-ds-select], [data-ds-menu], [data-ds-date-picker], [data-ds-dropdown], [data-ds-filter], [data-ds-popover]')) closeAll(scope);
    if (event.target.matches('.ds-dialog__backdrop')) event.target.closest('[role="dialog"]')?.setAttribute('hidden', '');
  });
  scope.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeAll(scope); scope.querySelectorAll('[role="dialog"]:not([hidden])').forEach((dialog) => { dialog.hidden = true; }); }
  });
}
