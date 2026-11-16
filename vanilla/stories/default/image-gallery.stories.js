import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 36 Image Gallery',
  parameters: { layout: 'padded' },
};

const SAMPLE_IMAGES = [
  {
    id: 'img-1',
    alt: 'Neural rendering latent walk, iteration 4200',
    caption: 'Neural rendering latent walk, iteration 4200',
    artClass: 'ds-image-art--1',
    source: { label: 'arxiv.org', url: 'https://arxiv.org' },
  },
  {
    id: 'img-2',
    alt: 'Diffusion trajectory visualization across 50 timesteps',
    caption: 'Diffusion trajectory visualization across 50 timesteps',
    artClass: 'ds-image-art--2',
    source: { label: 'openai.com', url: 'https://openai.com' },
  },
  {
    id: 'img-3',
    alt: 'High-resolution synthetic sample with volumetric lighting',
    caption: 'High-resolution synthetic sample with volumetric lighting',
    artClass: 'ds-image-art--3',
    source: { label: 'github.com', url: 'https://github.com' },
  },
  {
    id: 'img-4',
    alt: 'Feature map activation patterns in early transformer layers',
    caption: 'Feature map activation patterns in early transformer layers',
    artClass: 'ds-image-art--4',
    source: { label: 'nature.com', url: 'https://nature.com' },
  },
  {
    id: 'img-5',
    alt: 'Cross-attention heatmaps for prompt conditioning',
    caption: 'Cross-attention heatmaps for prompt conditioning',
    artClass: 'ds-image-art--5',
    source: { label: 'research.google', url: 'https://research.google' },
  },
  {
    id: 'img-6',
    alt: 'Latent manifold projection showing class clustering',
    caption: 'Latent manifold projection showing class clustering',
    artClass: 'ds-image-art--6',
    source: { label: 'huggingface.co', url: 'https://huggingface.co' },
  },
  {
    id: 'img-7',
    alt: 'Semantic segmentation boundaries',
    caption: 'Semantic segmentation boundaries',
    artClass: 'ds-image-art--1',
    source: { label: 'paperswithcode.com', url: 'https://paperswithcode.com' },
  },
  {
    id: 'img-8',
    alt: 'Depth estimation point cloud',
    caption: 'Depth estimation point cloud',
    artClass: 'ds-image-art--2',
    source: { label: 'cvpr.thecvf.com', url: 'https://cvpr.thecvf.com' },
  },
  {
    id: 'img-9',
    alt: 'Multimodal embedding space alignment',
    caption: 'Multimodal embedding space alignment',
    artClass: 'ds-image-art--3',
    source: { label: 'neurips.cc', url: 'https://neurips.cc' },
  },
];

function renderLightboxHtml(image, index, total) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return `
    <div class="ds-gallery-dialog" role="dialog" aria-modal="true" aria-label="Image ${index + 1} of ${total}">
      <div class="ds-gallery-backdrop" data-action="close"></div>
      <div class="ds-gallery-modal">
        <div class="ds-gallery-modal__stage">
          <div class="ds-image-art ${image.artClass || 'ds-image-art--1'}"></div>
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-gallery-modal__close" data-action="close" aria-label="Close dialog">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="ds-gallery-modal__footer">
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-gallery-nav-btn" data-action="prev" aria-label="Previous image" ${isFirst ? 'disabled' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="ds-gallery-modal__meta">
            ${image.caption ? `<p class="ds-gallery-modal__caption">${image.caption}</p>` : ''}
            ${image.source ? `
              <a href="${image.source.url}" target="_blank" rel="noopener noreferrer" class="ds-gallery-modal__source">
                <span>${image.source.label}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ` : ''}
          </div>
          <span class="ds-gallery-counter">${index + 1} / ${total}</span>
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-gallery-nav-btn" data-action="next" aria-label="Next image" ${isLast ? 'disabled' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderImageGallery({ images = SAMPLE_IMAGES.slice(0, 6), maxVisible = 6 } = {}) {
  const visibleCount = Math.min(maxVisible, images.length);
  const visibleImages = images.slice(0, visibleCount);
  const overflowCount = images.length - visibleCount;

  const itemsHtml = visibleImages
    .map((img, i) => {
      const isOverflowTile = i === visibleCount - 1 && overflowCount > 0;
      return `
        <button type="button" class="ds-gallery-item" data-index="${i}" aria-label="Open image: ${img.alt}">
          <div class="ds-image-art ${img.artClass || 'ds-image-art--1'}"></div>
          ${isOverflowTile ? `<span class="ds-gallery-overflow">+${overflowCount}</span>` : ''}
        </button>
      `;
    })
    .join('');

  return `
    <div data-slot="image-gallery" class="ds-image-gallery">
      ${itemsHtml}
    </div>
    <div class="ds-gallery-dialog-container"></div>
  `;
}

function bindGalleryInteractive(container, images) {
  const dialogContainer = container.querySelector('.ds-gallery-dialog-container');
  let activeIndex = null;

  function updateLightbox(index) {
    if (index === null || index < 0 || index >= images.length) {
      activeIndex = null;
      dialogContainer.innerHTML = '';
      return;
    }
    activeIndex = index;
    dialogContainer.innerHTML = renderLightboxHtml(images[activeIndex], activeIndex, images.length);

    const dialog = dialogContainer.querySelector('.ds-gallery-dialog');
    if (!dialog) return;

    dialog.querySelectorAll('[data-action="close"]').forEach((btn) => {
      btn.addEventListener('click', () => updateLightbox(null));
    });

    const prevBtn = dialog.querySelector('[data-action="prev"]');
    if (prevBtn && activeIndex > 0) {
      prevBtn.addEventListener('click', () => updateLightbox(activeIndex - 1));
    }

    const nextBtn = dialog.querySelector('[data-action="next"]');
    if (nextBtn && activeIndex < images.length - 1) {
      nextBtn.addEventListener('click', () => updateLightbox(activeIndex + 1));
    }
  }

  container.querySelectorAll('.ds-gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      updateLightbox(idx);
    });
  });

  const handleKeyDown = (e) => {
    if (activeIndex === null) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      updateLightbox(null);
    } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
      e.preventDefault();
      updateLightbox(activeIndex - 1);
    } else if (e.key === 'ArrowRight' && activeIndex < images.length - 1) {
      e.preventDefault();
      updateLightbox(activeIndex + 1);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    const images = SAMPLE_IMAGES.slice(0, 6);
    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>36 Image Gallery (Interactive Grid &amp; Lightbox)</code></header>
        <div class="ds-gallery-target">
          ${renderImageGallery({ images, maxVisible: 6 })}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-gallery-target');
    bindGalleryInteractive(target, images);
    return root;
  },
};
