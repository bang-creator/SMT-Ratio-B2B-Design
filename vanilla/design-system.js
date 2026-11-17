const closeAll = (scope, except) => scope.querySelectorAll('[data-ds-open="true"]').forEach((root) => {
  if (root !== except) {
    root.dataset.dsOpen = 'false';
    const menu = root.querySelector('.ds-menu__content, .ds-popover__content, .ds-select__menu, .ds-date-picker__dialog, .ds-dropdown__menu');
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

    const getItems = () => Array.from(menu.querySelectorAll('.ds-menu__item:not([disabled]):not([data-disabled]), [role="menuitem"]:not([disabled]):not([data-disabled])'));

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

    menu.querySelectorAll('.ds-menu__item, [role="menuitem"], [data-ds-popover-close]').forEach((item) => {
      item.addEventListener('click', () => {
        if (item.disabled || item.hasAttribute('data-disabled')) return;
        item.blur();
        trigger?.blur();
        setOpen(false);
        root.dispatchEvent(new CustomEvent('ds-select', {
          bubbles: true,
          detail: {
            value: item.dataset.value ?? item.textContent.trim(),
          },
        }));
      });
    });

    // Clicks inside popover content should not close it unless clicking close button
    menu.addEventListener('click', (e) => {
      if (!e.target.closest('.ds-menu__item, [role="menuitem"], [data-ds-popover-close]')) {
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
      '.ds-menu__trigger, .ds-menu__item, [role="menuitem"], ' +
      '.ds-dropdown__trigger, .ds-dropdown__item, .ds-select__trigger, .ds-select__option, [role="option"], ' +
      '.ds-date-picker__trigger, .ds-date-picker__nav-arrow, .ds-date-picker__nav-trigger, .ds-date-picker__day, .ds-date-picker__preset, .ds-date-picker__nav-btn, ' +
      '.ds-search-trigger, .ds-search-input__clear, .ds-filter-pill, .ds-cmd-palette-item, [data-slot="command-palette-item"], .ds-pagination__menu-item, .ds-popover__trigger, .ds-progress-step'
    );
    if (popoutEl && typeof popoutEl.blur === 'function') {
      popoutEl.blur();
    }
  });

  scope.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('[data-ds-select], [data-ds-menu], [data-ds-date-picker], [data-ds-dropdown], [data-ds-popover]')) closeAll(scope);
    if (event.target.matches('.ds-dialog__backdrop')) event.target.closest('[role="dialog"]')?.setAttribute('hidden', '');
  });
  scope.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeAll(scope); scope.querySelectorAll('[role="dialog"]:not([hidden])').forEach((dialog) => { dialog.hidden = true; }); }
  });
}
