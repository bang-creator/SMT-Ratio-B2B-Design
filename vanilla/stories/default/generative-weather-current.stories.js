import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 137 Current weather AUI',
  parameters: { layout: 'padded' },
};

const SUN_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Sunny"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
const CLOUD_RAIN_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Rainy"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>`;
const MOON_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Clear night"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
const CLOUD_SNOW_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Snow"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M8 15h.01"></path><path d="M8 19h.01"></path><path d="M12 17h.01"></path><path d="M12 21h.01"></path><path d="M16 15h.01"></path><path d="M16 19h.01"></path></svg>`;

function renderWeatherCard({
  location = 'Austin, TX',
  tempF = 94,
  tempC = 34,
  condition = 'Sunny, feels like 98°F',
  conditionC = 'Sunny, feels like 37°C',
  humidity = '42%',
  wind = '8 mph',
  icon = SUN_ICON,
  unit = 'F',
} = {}) {
  const displayTemp = unit === 'F' ? `${tempF}°F` : `${tempC}°C`;
  const displayCondition = unit === 'F' ? condition : conditionC;

  return `
    <div class="ds-generative-card" data-slot="generative-card" data-unit="${unit}">
      <div class="ds-gen-weather-card__header">
        <span class="ds-gen-weather-card__location">${location}</span>
        <div class="ds-flex ds-items-center ds-gap-2">
          <button type="button" class="ds-button ds-button--ghost ds-button--xs ds-text-xs" data-action="toggle-unit" aria-label="Toggle temperature unit">
            ${unit === 'F' ? '°C' : '°F'}
          </button>
          <div class="ds-gen-weather-card__icon">${icon}</div>
        </div>
      </div>
      <div class="ds-gen-weather-card__temp" data-slot="temperature">${displayTemp}</div>
      <span class="ds-gen-weather-card__condition" data-slot="condition">${displayCondition}</span>

      <div class="ds-gen-weather-card__details">
        <div class="ds-gen-weather-card__detail-item">
          <span class="ds-gen-weather-card__detail-label">Humidity</span>
          <span class="ds-gen-weather-card__detail-value">${humidity}</span>
        </div>
        <div class="ds-gen-weather-card__detail-item">
          <span class="ds-gen-weather-card__detail-label">Wind</span>
          <span class="ds-gen-weather-card__detail-value">${wind}</span>
        </div>
      </div>
    </div>
  `;
}

function attachWeatherHandler(root) {
  const toggleBtn = root.querySelector('[data-action="toggle-unit"]');
  if (!toggleBtn) return;

  let currentUnit = 'F';
  toggleBtn.addEventListener('click', () => {
    currentUnit = currentUnit === 'F' ? 'C' : 'F';
    const card = root.querySelector('[data-slot="generative-card"]');
    const tempEl = root.querySelector('[data-slot="temperature"]');
    const condEl = root.querySelector('[data-slot="condition"]');

    if (currentUnit === 'C') {
      tempEl.textContent = '34°C';
      condEl.textContent = 'Sunny, feels like 37°C';
      toggleBtn.textContent = '°F';
      card.setAttribute('data-unit', 'C');
    } else {
      tempEl.textContent = '94°F';
      condEl.textContent = 'Sunny, feels like 98°F';
      toggleBtn.textContent = '°C';
      card.setAttribute('data-unit', 'F');
    }
  });
}

export const Default = story(
  () => stage(renderWeatherCard()),
  { postRender: attachWeatherHandler }
);

export const Rainy = story(() =>
  stage(
    renderWeatherCard({
      location: 'Seattle, WA',
      tempF: 58,
      tempC: 14,
      condition: 'Light rain, drizzle',
      conditionC: 'Light rain, drizzle',
      humidity: '88%',
      wind: '14 mph',
      icon: CLOUD_RAIN_ICON,
    })
  )
);

export const ColdNight = story(() =>
  stage(
    renderWeatherCard({
      location: 'Oslo, Norway',
      tempF: 25,
      tempC: -4,
      condition: 'Clear night, freezing',
      conditionC: 'Clear night, freezing',
      humidity: '65%',
      wind: '5 mph',
      icon: MOON_ICON,
      unit: 'C',
    })
  )
);

export const LongLocation = story(() =>
  stage(
    renderWeatherCard({
      location: 'Reykjavik Metropolitan Area, Capital Region, Iceland',
      tempF: 36,
      tempC: 2,
      condition: 'Scattered flurries, gusty winds up to 28 mph',
      conditionC: 'Scattered flurries, gusty winds up to 28 mph',
      humidity: '79%',
      wind: '24 mph',
      icon: CLOUD_SNOW_ICON,
    })
  )
);
