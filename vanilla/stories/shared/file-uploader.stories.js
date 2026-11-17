import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / File Uploader',
  parameters: { layout: 'padded' },
};

/* Source: Platform storage & document file uploader on platform.openai.com/storage
 * Ground truth from platform evidence:
 * - Solid subtle border, 12px container radius (var(--radius-xl))
 * - Dark surface background (var(--color-semantic-background-surface-secondary))
 * - Authentic platform upload SVG icon with folded corner & plus badge (22px)
 * - Understated typography (400 normal weight, secondary text)
 * - Attached file row with document icon (16px) and filename (e.g. index.html)
 * - Dynamic interactive single variant (Default) */

const UPLOAD_ICON = `<svg class="ds-dropzone__icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18.032 5.024C17.75 5 17.377 5 16.8 5h-5.3c-.2 1-.401 1.911-.61 2.854-.131.596-.247 1.119-.523 1.56a2.998 2.998 0 0 1-.953.954c-.441.275-.964.39-1.56.522l-.125.028-2.512.558A1.003 1.003 0 0 1 5 11.5v5.3c0 .577 0 .949.024 1.232.022.272.06.372.085.422a1 1 0 0 0 .437.437c.05.025.15.063.422.085C6.25 19 6.623 19 7.2 19H10a1 1 0 1 1 0 2H7.161c-.527 0-.981 0-1.356-.03-.395-.033-.789-.104-1.167-.297a3 3 0 0 1-1.311-1.311c-.193-.378-.264-.772-.296-1.167A17.9 17.9 0 0 1 3 16.838V11c0-2.075 1.028-4.067 2.48-5.52C6.933 4.028 8.925 3 11 3h5.838c.528 0 .982 0 1.357.03.395.033.789.104 1.167.297a3 3 0 0 1 1.311 1.311c.193.378.264.772.296 1.167.031.375.031.83.031 1.356V10a1 1 0 1 1-2 0V7.2c0-.577 0-.949-.024-1.232-.022-.272-.06-.373-.085-.422a1 1 0 0 0-.437-.437c-.05-.025-.15-.063-.422-.085ZM5.28 9.414l2.015-.448c.794-.177.948-.225 1.059-.294a1 1 0 0 0 .318-.318c.069-.11.117-.265.294-1.059l.447-2.015c-.903.313-1.778.874-2.518 1.615-.741.74-1.302 1.615-1.615 2.518ZM17 15a1 1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2Z" clip-rule="evenodd"></path></svg>`;
const FILE_ICON = `<svg class="ds-dropzone__file-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`;

/* ── Interactive File Uploader Dropzone ── */

export const Default = story(
  'Default / Shared / File Uploader / Default',
  stage(
    'Interactive File Uploader Dropzone',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Dropzone (Click or Drag File to Attach) -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label class="ds-dropzone" data-ds-dropzone>
            ${UPLOAD_ICON}
            <span class="ds-dropzone__text">Upload a file or drag your file here</span>
            <input type="file" class="ds-dropzone__input">
          </label>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label class="ds-dropzone" data-ds-dropzone data-disabled="true">
            ${UPLOAD_ICON}
            <span class="ds-dropzone__text">Upload a file or drag your file here</span>
            <input type="file" class="ds-dropzone__input" disabled>
          </label>
        </div>
      </section>
    </div>`
  )
);
