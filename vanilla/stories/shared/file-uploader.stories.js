import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / File Uploader',
  parameters: { layout: 'padded' },
};

/* Source: Storage and Fine-tuning file upload on platform.openai.com/storage
 * Ground truth:
 * - Dashed border: 1px dashed var(--color-semantic-border-default)
 * - Radius: 12px (var(--radius-xl))
 * - Interactive hover & drag highlight */

export const Default = story(
  'Default / Shared / File Uploader / Default',
  stage(
    'Standard Drag and Drop Area',
    `<div class="ds-stack">
      <label class="ds-dropzone">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        <strong>Drop training files here or click to browse</strong>
        <span class="ds-muted">Supports .jsonl, .json, and .csv files up to 512 MB</span>
        <input type="file" accept=".jsonl,.csv,.json">
      </label>
    </div>`
  )
);

export const WithFiles = story(
  'Default / Shared / File Uploader / With Files',
  stage(
    'Uploaded Files Attached',
    `<div class="ds-stack">
      <label class="ds-dropzone">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        <strong>Add additional shards</strong>
        <span class="ds-muted">Click or drag more files</span>
        <input type="file" accept=".jsonl,.csv,.json">
      </label>
      <div class="ds-stack">
        <div class="ds-file-item">
          <div class="ds-row">
            <svg viewBox="0 0 24 24" class="ds-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>training_data_batch_01.jsonl</span>
            <span class="ds-muted">(14.2 MB)</span>
          </div>
          <button class="ds-icon-button" type="button" aria-label="Remove training_data_batch_01.jsonl">
            <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="ds-file-item">
          <div class="ds-row">
            <svg viewBox="0 0 24 24" class="ds-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>validation_set.jsonl</span>
            <span class="ds-muted">(2.8 MB)</span>
          </div>
          <button class="ds-icon-button" type="button" aria-label="Remove validation_set.jsonl">
            <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / File Uploader / Disabled',
  stage(
    'Disabled Uploader',
    `<div class="ds-stack">
      <label class="ds-dropzone" data-disabled="true">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        <strong>Upload disabled</strong>
        <span class="ds-muted">You do not have write permissions for this storage bucket</span>
        <input type="file" disabled>
      </label>
    </div>`
  )
);

export const UploadModal = story(
  'Default / Shared / File Uploader / Upload Modal',
  stage(
    'Live Platform Storage Upload Modal Dialog',
    `<div class="ds-dialog" role="dialog" aria-modal="true">
      <div class="ds-dialog__header">
        <h2>Upload file</h2>
        <button type="button" class="ds-icon-button" aria-label="Close dialog">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div class="ds-dialog__body ds-stack">
        <label class="ds-dropzone">
          <svg viewBox="0 0 24 24" class="ds-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <strong>Drop file here or click to browse</strong>
          <span class="ds-muted">Up to 512 MB · jsonl, csv, json</span>
          <input type="file">
        </label>
        <label>
          <span class="ds-label">Purpose</span>
          <div class="ds-select">
            <button class="ds-select__trigger" type="button">
              <span>Fine-tune</span>
              <span class="ds-select__chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
          </div>
        </label>
      </div>
      <div class="ds-dialog__footer">
        <button type="button" class="ds-button ds-button--ghost">Cancel</button>
        <button type="button" class="ds-button ds-button--primary">Upload</button>
      </div>
    </div>`
  )
);
