import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 41 Map Answer',
  parameters: { layout: 'padded' },
};

const SAMPLE_PINS = [
  {
    id: 'pin-1',
    label: 'OpenAI Headquarters',
    detail: '3180 18th St · 0.4 mi',
    posClass: 'ds-map-pin-1',
    x: 24,
    y: 40,
  },
  {
    id: 'pin-2',
    label: 'Mission Dolores Park',
    detail: 'Dolores St & 19th St · 0.8 mi',
    posClass: 'ds-map-pin-2',
    x: 54,
    y: 62,
  },
  {
    id: 'pin-3',
    label: 'Ferry Building Terminal',
    detail: '1 Ferry Building · 2.1 mi',
    posClass: 'ds-map-pin-3',
    x: 78,
    y: 32,
  },
];

function renderMapAnswer({
  pins = SAMPLE_PINS,
  activeId = 'pin-1',
  route = true,
} = {}) {
  const routePoints = pins.map((p) => `${p.x},${p.y}`).join(' ');

  const pinsHtml = pins
    .map(
      (p) => `
    <button
      type="button"
      class="ds-map-pin ${p.posClass}"
      data-pin-id="${p.id}"
      aria-label="${p.label}"
      aria-current="${p.id === activeId ? 'true' : 'false'}"
    >
      <span class="ds-map-pin__dot"></span>
    </button>
  `
    )
    .join('');

  const listHtml = pins
    .map(
      (p) => `
    <button
      type="button"
      class="ds-map-answer__item"
      data-item-id="${p.id}"
      aria-current="${p.id === activeId ? 'true' : 'false'}"
    >
      <span class="ds-map-answer__label">${p.label}</span>
      <span class="ds-map-answer__detail">${p.detail}</span>
    </button>
  `
    )
    .join('');

  return `
    <div data-slot="map-answer" class="ds-map-answer">
      <div class="ds-map-viewport">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" class="ds-map-grid-svg">
          <line x1="0" x2="100" y1="18" y2="18" class="ds-map-grid-line"></line>
          <line x1="0" x2="100" y1="42" y2="42" class="ds-map-grid-line"></line>
          <line x1="0" x2="100" y1="66" y2="66" class="ds-map-grid-line"></line>
          <line x1="0" x2="100" y1="88" y2="88" class="ds-map-grid-line"></line>
          <line x1="22" x2="22" y1="0" y2="100" class="ds-map-grid-line"></line>
          <line x1="50" x2="50" y1="0" y2="100" class="ds-map-grid-line"></line>
          <line x1="74" x2="74" y1="0" y2="100" class="ds-map-grid-line"></line>
          ${
            route && pins.length > 1
              ? `<polyline points="${routePoints}" class="ds-map-route-line"></polyline>`
              : ''
          }
        </svg>
        ${pinsHtml}
      </div>
      <div class="ds-map-answer__list">
        ${listHtml}
      </div>
    </div>
  `;
}

function bindInteractiveMap(root, pins, route = true) {
  function select(id) {
    const target = root.querySelector('.ds-map-target');
    if (target) {
      target.innerHTML = renderMapAnswer({ pins, activeId: id, route });
      bind();
    }
  }

  function bind() {
    root.querySelectorAll('.ds-map-pin').forEach((pin) => {
      pin.addEventListener('click', () => {
        select(pin.getAttribute('data-pin-id'));
      });
    });
    root.querySelectorAll('.ds-map-answer__item').forEach((item) => {
      item.addEventListener('click', () => {
        select(item.getAttribute('data-item-id'));
      });
    });
  }

  bind();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-map-target">
          ${renderMapAnswer({ activeId: 'pin-1', route: true })}
        </div>
      </section>
    `;
    bindInteractiveMap(root, SAMPLE_PINS, true);
    return root;
  },
};
