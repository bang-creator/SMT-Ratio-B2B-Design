import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 117 Image AUI',
  parameters: { layout: 'padded' },
};

const IMAGE_SVG_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='338' viewBox='0 0 600 338'%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Ccircle cx='300' cy='169' r='80' fill='%230285ff' opacity='0.8'/%3E%3Ccircle cx='350' cy='169' r='60' fill='%2310a37f' opacity='0.8'/%3E%3Ctext x='300' y='300' fill='%23ffffff' font-family='sans-serif' font-size='14' text-anchor='middle'%3EOpenAI Design System Asset%3C/text%3E%3C/svg%3E";

const IMAGE_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`;
const IMAGE_OFF_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" x2="22" y1="2" y2="22"></line><path d="M10.41 10.41a2 2 0 1 0-2.82-2.82"></path><line x1="13.5" x2="6" y1="13.5" y2="21"></line><line x1="18" x2="21" y1="12" y2="15"></line><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.05-.22 1.41-.59"></path><path d="M21 15V5a2 2 0 0 0-2-2H9"></path></svg>`;
const SHIELD_ALERT_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const DOWNLOAD_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
const CLOSE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function renderImageComponent({
  title = 'generated-diagram.png',
  dimensions = '1200 × 675 · SVG',
  src = IMAGE_SVG_SRC,
  ratio = '16:9',
  fit = 'contain',
  size = 'default',
  isLoading = false,
  isBlocked = false,
  hasError = false,
  enableZoom = true,
  interactive = false,
} = {}) {
  return `
    <div
      data-slot="image-root"
      class="ds-image-root"
      data-size="${size}"
      data-ratio="${ratio}"
    >
      ${
        enableZoom && !isLoading && !hasError && !isBlocked
          ? `
        <div class="ds-image-zoom-trigger" data-action="zoom-image" role="button" tabindex="0" aria-label="Click to zoom image">
      `
          : ''
      }
        <div
          data-slot="image-preview"
          class="ds-image-preview"
          data-ratio="${ratio}"
          data-fit="${fit}"
        >
          ${
            isLoading
              ? `
            <div data-slot="image-loading" class="ds-image-preview__loading">
              <span class="ds-flex ds-items-center ds-gap-2">
                ${IMAGE_ICON}
                <span class="ds-text-xs">Generating image...</span>
              </span>
            </div>
          `
              : isBlocked
                ? `
            <div data-slot="image-blocked" class="ds-image-preview__blocked">
              ${SHIELD_ALERT_ICON}
              <span class="ds-image-preview__error-text">Generation stopped by safety system</span>
            </div>
          `
                : hasError
                  ? `
            <div data-slot="image-error" class="ds-image-preview__error">
              ${IMAGE_OFF_ICON}
              <span class="ds-image-preview__error-text">Failed to load image</span>
            </div>
          `
                  : `
            <img
              src="${src}"
              alt="${title}"
              class="ds-image-preview__img"
              data-slot="image-element"
            />
          `
          }
        </div>
      ${
        enableZoom && !isLoading && !hasError && !isBlocked
          ? `
        </div>
      `
          : ''
      }

      <div class="ds-image-toolbar" data-slot="image-toolbar">
        <div class="ds-image-toolbar__info">
          <span class="ds-image-toolbar__title" data-slot="image-title">${title}</span>
          <span class="ds-image-toolbar__meta" data-slot="image-meta">${dimensions}</span>
        </div>
        ${
          !isLoading && !hasError && !isBlocked
            ? `
          <div class="ds-image-toolbar__actions">
            <button
              type="button"
              class="ds-image-btn"
              data-action="copy-image"
              aria-label="Copy image"
            >
              ${COPY_ICON}
            </button>
            <button
              type="button"
              class="ds-image-btn"
              data-action="download-image"
              aria-label="Download image"
            >
              ${DOWNLOAD_ICON}
            </button>
          </div>
        `
            : ''
        }
      </div>

      <div class="ds-image-lightbox is-hidden" data-slot="image-lightbox" role="dialog" aria-modal="true" aria-label="Zoomed image">
        <div class="ds-image-lightbox__content">
          <button
            type="button"
            class="ds-image-lightbox__close"
            data-action="close-lightbox"
            aria-label="Close zoomed image"
          >
            ${CLOSE_ICON}
          </button>
          <img
            src="${src}"
            alt="${title}"
            class="ds-image-lightbox__img"
            data-slot="lightbox-img"
          />
        </div>
      </div>
    </div>
  `;
}

function attachImageInteractivity(root) {
  const zoomTrigger = root.querySelector('[data-action="zoom-image"]');
  const lightbox = root.querySelector('[data-slot="image-lightbox"]');
  const closeBtn = root.querySelector('[data-action="close-lightbox"]');
  const copyBtn = root.querySelector('[data-action="copy-image"]');

  if (zoomTrigger && lightbox) {
    zoomTrigger.addEventListener('click', () => {
      lightbox.classList.remove('is-hidden');
    });

    zoomTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lightbox.classList.remove('is-hidden');
      }
    });
  }

  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      lightbox.classList.add('is-hidden');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('is-hidden');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('is-hidden')) {
        lightbox.classList.add('is-hidden');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyBtn.innerHTML = CHECK_ICON;
      setTimeout(() => {
        copyBtn.innerHTML = COPY_ICON;
      }, 1500);
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderImageComponent({ interactive: true });
    attachImageInteractivity(root);
    return root;
  },
};

export const Generating = story(
  () => renderImageComponent({
    title: 'alpine-lake.png',
    dimensions: 'Generating...',
    isLoading: true,
  })
);

export const ContentFilter = story(
  () => renderImageComponent({
    title: 'filtered-prompt.png',
    dimensions: 'Content filter',
    isBlocked: true,
  })
);

export const Error = story(
  () => renderImageComponent({
    title: 'whiteboard-photo.png',
    dimensions: 'Expired · 404',
    hasError: true,
  })
);

export const WithActions = story(
  () => renderImageComponent({
    title: 'mountain-sunrise.jpg',
    dimensions: '1920 × 1080 · JPG · Unsplash',
    fit: 'cover',
  })
);

export const LongContent = story(
  () => renderImageComponent({
    title: 'lake-louise-panorama-banff-national-park-alberta-2026-08-14.jpg',
    dimensions: '3840 × 1080 · Ultra-wide',
    size: 'lg',
    ratio: '16:9',
    fit: 'cover',
  })
);
