import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 42 Geo Map',
  parameters: { layout: 'padded' },
};

const SAMPLE_PLACES = [
  {
    id: 'place-1',
    label: 'OpenAI Mission District HQ',
    description: '3180 18th St, San Francisco',
    lat: 37.7618,
    lng: -122.4178,
    posClass: 'ds-geo-marker--pos-1',
    x: 28,
    y: 38,
  },
  {
    id: 'place-2',
    label: 'Mission Dolores Basilica',
    description: '3321 16th St, San Francisco',
    lat: 37.7645,
    lng: -122.4267,
    posClass: 'ds-geo-marker--pos-2',
    x: 58,
    y: 64,
  },
  {
    id: 'place-3',
    label: 'Oracle Park Waterfront',
    description: '24 Willie Mays Plaza, San Francisco',
    lat: 37.7786,
    lng: -122.3893,
    posClass: 'ds-geo-marker--pos-3',
    x: 76,
    y: 32,
  },
];

function renderGeoMap({
  places = SAMPLE_PLACES,
  activeId = 'place-1',
  route = true,
  attribution = '© OpenStreetMap contributors',
} = {}) {
  const routePoints = places.map((p) => `${p.x},${p.y}`).join(' ');

  const markersHtml = places
    .map(
      (p) => `
    <button
      type="button"
      class="ds-geo-marker ${p.posClass}"
      data-place-id="${p.id}"
      aria-label="${p.label}"
      aria-current="${p.id === activeId ? 'true' : 'false'}"
    >
      <span class="ds-geo-marker__dot"></span>
    </button>
  `
    )
    .join('');

  const placesHtml = places
    .map(
      (p) => `
    <li>
      <button
        type="button"
        class="ds-geo-place"
        data-place-item-id="${p.id}"
        aria-current="${p.id === activeId ? 'true' : 'false'}"
      >
        <span class="ds-geo-place__meta">
          <span class="ds-geo-place__label">${p.label}</span>
          ${p.description ? `<span class="ds-geo-place__desc">${p.description}</span>` : ''}
        </span>
        <span class="ds-geo-place__coords" data-slot="geo-map-coordinates">
          ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}
        </span>
      </button>
    </li>
  `
    )
    .join('');

  return `
    <div data-slot="geo-map" class="ds-geo-map">
      <div class="ds-geo-map__viewport" role="region" aria-label="Map of ${places.length} places">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" class="ds-geo-map__canvas">
          <path d="M 0,45 Q 30,35 50,60 T 100,50 L 100,70 Q 70,80 50,75 T 0,60 Z" class="ds-geo-map__river"></path>
          <line x1="0" x2="100" y1="20" y2="20" class="ds-geo-map__road-sub"></line>
          <line x1="0" x2="100" y1="52" y2="52" class="ds-geo-map__road-main"></line>
          <line x1="0" x2="100" y1="84" y2="84" class="ds-geo-map__road-sub"></line>
          <line x1="30" x2="30" y1="0" y2="100" class="ds-geo-map__road-main"></line>
          <line x1="68" x2="68" y1="0" y2="100" class="ds-geo-map__road-sub"></line>
          ${
            route && places.length > 1
              ? `<polyline points="${routePoints}" class="ds-geo-map__route"></polyline>`
              : ''
          }
        </svg>

        <div class="ds-geo-map__zoom-bar" aria-label="Map zoom controls">
          <button type="button" class="ds-geo-map__zoom-btn" aria-label="Zoom in">+</button>
          <button type="button" class="ds-geo-map__zoom-btn" aria-label="Zoom out">−</button>
        </div>

        <div class="ds-geo-map__attribution">
          ${attribution}
        </div>

        ${markersHtml}
      </div>

      <ol class="ds-geo-map__list">
        ${placesHtml}
      </ol>
    </div>
  `;
}

function bindInteractiveGeoMap(root, places, route = true) {
  function select(id) {
    const target = root.querySelector('.ds-geo-target');
    if (target) {
      target.innerHTML = renderGeoMap({ places, activeId: id, route });
      bind();
    }
  }

  function bind() {
    root.querySelectorAll('.ds-geo-marker').forEach((marker) => {
      marker.addEventListener('click', () => {
        select(marker.getAttribute('data-place-id'));
      });
    });
    root.querySelectorAll('.ds-geo-place').forEach((btn) => {
      btn.addEventListener('click', () => {
        select(btn.getAttribute('data-place-item-id'));
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
<div class="ds-geo-target">
          ${renderGeoMap({ activeId: 'place-1', route: true })}
        </div>
      </section>
    `;
    bindInteractiveGeoMap(root, SAMPLE_PLACES, true);
    return root;
  },
};
