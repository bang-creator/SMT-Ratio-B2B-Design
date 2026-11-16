import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 118 File AUI',
  parameters: { layout: 'padded' },
};

const FILE_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
const FILE_TEXT_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
const MUSIC_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
const BRACES_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"></path><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"></path></svg>`;
const DOWNLOAD_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

function getIconForMime(mimeType) {
  if (mimeType.startsWith('audio/')) return MUSIC_ICON;
  if (mimeType === 'application/json') return BRACES_ICON;
  if (mimeType === 'application/pdf' || mimeType.startsWith('text/')) return FILE_TEXT_ICON;
  return FILE_ICON;
}

function renderFileComponent({
  filename = 'system-metrics.json',
  mimeType = 'application/json',
  bytes = 14500,
  size = 'default',
  sourceType = 'url',
  url = '#',
} = {}) {
  const formattedSize = bytes ? `${(bytes / 1024).toFixed(1)} KB` : '';
  const typeLabel = mimeType.split('/')[1]?.toUpperCase() || 'FILE';
  const metaText = formattedSize ? `${formattedSize} · ${typeLabel}` : typeLabel;
  const displayName = filename || `${typeLabel} file`;
  const icon = getIconForMime(mimeType);

  return `
    <div
      data-slot="file-root"
      class="ds-file-root"
      data-size="${size}"
      data-source-type="${sourceType}"
    >
      <span class="ds-file-icon" data-slot="file-icon" aria-hidden="true">
        ${icon}
      </span>
      <div class="ds-file-info" data-slot="file-info">
        <span class="ds-file-name" data-slot="file-name" title="${displayName}">${displayName}</span>
        <span class="ds-file-meta" data-slot="file-meta">${metaText}</span>
      </div>
      ${
        sourceType !== 'id'
          ? `
        <a
          href="${url}"
          class="ds-file-download"
          data-slot="file-download"
          data-action="download-file"
          aria-label="Download ${displayName}"
          download="${displayName}"
          onclick="return false;"
        >
          ${DOWNLOAD_ICON}
        </a>
      `
          : ''
      }
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderFileComponent();
    return root;
  },
};

export const RemoteUrl = story(
  () => renderFileComponent({
    filename: 'invoice-2026-10.pdf',
    mimeType: 'application/pdf',
    bytes: 0,
    sourceType: 'url',
    url: 'https://example.com/invoice.pdf',
  })
);

export const IdReference = story(
  () => renderFileComponent({
    filename: 'customer-export.csv',
    mimeType: 'text/csv',
    bytes: 42000,
    sourceType: 'id',
  })
);

export const NoFilename = story(
  () => renderFileComponent({
    filename: '',
    mimeType: 'text/csv',
    bytes: 840,
    sourceType: 'data',
  })
);

export const Audio = story(
  () => renderFileComponent({
    filename: 'c-major-arpeggio.mp3',
    mimeType: 'audio/mpeg',
    bytes: 0,
    sourceType: 'url',
  })
);

export const LongContent = story(
  () => renderFileComponent({
    filename: '2026-q3-enterprise-customer-renewals-with-churn-risk-scores-final-v4.csv',
    mimeType: 'text/csv',
    bytes: 524000,
    sourceType: 'url',
  })
);
