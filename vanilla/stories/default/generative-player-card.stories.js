import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 145 Player card AUI',
  parameters: { layout: 'padded' },
};

function renderPlayerCard({
  name = 'Marcus Chen',
  meta = 'Point Guard · No. 23',
  initials = 'MC',
  team = 'Golden State',
  badge = null,
  stats = [
    { val: '24.6', lbl: 'PPG' },
    { val: '8.1', lbl: 'AST' },
    { val: '5.3', lbl: 'REB' },
    { val: '27.9', lbl: 'EFF' },
  ],
  mode = 'Season',
} = {}) {
  const statsHtml = stats
    .map(
      (s) => `
    <div class="ds-gen-player-card__stat-col">
      <span class="ds-gen-player-card__stat-val" data-stat-lbl="${s.lbl}">${s.val}</span>
      <span class="ds-gen-player-card__stat-lbl">${s.lbl}</span>
    </div>
  `
    )
    .join('');

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-player-card__header">
        <div class="ds-gen-player-card__info">
          <div class="ds-flex ds-items-center ds-gap-2">
            <h3 class="ds-gen-player-card__name">${name}</h3>
            ${
              badge
                ? `<span class="ds-badge ds-badge--primary ds-badge--sm">${badge}</span>`
                : ''
            }
          </div>
          <span class="ds-gen-player-card__meta">${meta} · ${team}</span>
        </div>
        <div class="ds-gen-player-card__avatar">
          <span>${initials}</span>
        </div>
      </div>

      <div class="ds-flex ds-items-center ds-justify-between ds-mt-2">
        <span class="ds-text-xs ds-text-secondary" data-slot="mode-label">${mode} averages</span>
        <div class="ds-flex ds-items-center ds-gap-1">
          <button type="button" class="ds-button ${mode === 'Season' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="toggle-mode" data-mode="Season">Season</button>
          <button type="button" class="ds-button ${mode === 'Career' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="toggle-mode" data-mode="Career">Career</button>
        </div>
      </div>

      <div class="ds-gen-player-card__divider"></div>

      <div class="ds-gen-player-card__stats" data-slot="stats-container">
        ${statsHtml}
      </div>
    </div>
  `;
}

function attachPlayerHandler(root) {
  root.querySelectorAll('[data-action="toggle-mode"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      root.querySelectorAll('[data-action="toggle-mode"]').forEach((b) => {
        b.className = 'ds-button ds-button--ghost ds-button--xs';
      });
      btn.className = 'ds-button ds-button--secondary ds-button--xs';

      const modeLabel = root.querySelector('[data-slot="mode-label"]');
      if (modeLabel) modeLabel.textContent = `${mode} averages`;

      const ppg = root.querySelector('[data-stat-lbl="PPG"]');
      const ast = root.querySelector('[data-stat-lbl="AST"]');
      const reb = root.querySelector('[data-stat-lbl="REB"]');
      const eff = root.querySelector('[data-stat-lbl="EFF"]');

      if (mode === 'Career') {
        if (ppg) ppg.textContent = '21.2';
        if (ast) ast.textContent = '7.4';
        if (reb) reb.textContent = '4.8';
        if (eff) eff.textContent = '24.1';
      } else {
        if (ppg) ppg.textContent = '24.6';
        if (ast) ast.textContent = '8.1';
        if (reb) reb.textContent = '5.3';
        if (eff) eff.textContent = '27.9';
      }
    });
  });
}

export const Default = story(
  () => stage(renderPlayerCard()),
  { postRender: attachPlayerHandler }
);

export const AllStar = story(() =>
  stage(
    renderPlayerCard({
      name: 'Elena Rostova',
      meta: 'Center · No. 15',
      initials: 'ER',
      team: 'Seattle Storm',
      badge: 'All-Star',
      stats: [
        { val: '28.4', lbl: 'PPG' },
        { val: '4.2', lbl: 'AST' },
        { val: '12.8', lbl: 'REB' },
        { val: '34.2', lbl: 'EFF' },
      ],
    })
  )
);

export const BenchPlayer = story(() =>
  stage(
    renderPlayerCard({
      name: 'Kenji Sato',
      meta: 'Shooting Guard · No. 7',
      initials: 'KS',
      team: 'Memphis',
      badge: '6th Man',
      stats: [
        { val: '11.8', lbl: 'PPG' },
        { val: '2.5', lbl: 'AST' },
        { val: '2.1', lbl: 'REB' },
        { val: '13.4', lbl: 'EFF' },
      ],
    })
  )
);

export const LongName = story(() =>
  stage(
    renderPlayerCard({
      name: 'Giannis Antetokounmpo-Hernangomez',
      meta: 'Power Forward · No. 34',
      initials: 'GA',
      team: 'Milwaukee Bucks',
      badge: 'MVP',
      stats: [
        { val: '31.1', lbl: 'PPG' },
        { val: '5.7', lbl: 'AST' },
        { val: '11.8', lbl: 'REB' },
        { val: '36.5', lbl: 'EFF' },
      ],
    })
  )
);
