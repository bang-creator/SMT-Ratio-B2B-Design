import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Data Table',
  parameters: { layout: 'padded' },
};

/* Source: Storage and API usage tables on platform.openai.com/storage
 * Ground truth:
 * - Table header: 36px height, 12px font, text-secondary
 * - Table rows: 44px height, hover highlight, 1px subtle divider
 * - 12px radius table wrapper */

export const Default = story(
  'Default / Shared / Data Table / Default',
  stage(
    'Standard Data Table',
    `<div class="ds-table-wrap">
      <table class="ds-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Purpose</th>
            <th>Size</th>
            <th>Uploaded</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>training_shard_01.jsonl</strong></td>
            <td>fine-tune</td>
            <td class="ds-muted">14.2 MB</td>
            <td class="ds-muted">Nov 12, 2026</td>
            <td><span class="ds-badge">Processed</span></td>
          </tr>
          <tr>
            <td><strong>evaluation_set.jsonl</strong></td>
            <td>eval</td>
            <td class="ds-muted">2.8 MB</td>
            <td class="ds-muted">Nov 11, 2026</td>
            <td><span class="ds-badge">Processed</span></td>
          </tr>
          <tr>
            <td><strong>raw_transcripts.csv</strong></td>
            <td>batch</td>
            <td class="ds-muted">48.0 MB</td>
            <td class="ds-muted">Nov 10, 2026</td>
            <td><span class="ds-badge">Pending</span></td>
          </tr>
        </tbody>
      </table>
    </div>`
  )
);

export const Selectable = story(
  'Default / Shared / Data Table / Selectable',
  stage(
    'Interactive Row Selection',
    `<div class="ds-table-wrap">
      <table class="ds-table">
        <thead>
          <tr>
            <th class="ds-table__col-check">
              <label class="ds-checkbox">
                <input type="checkbox">
                <span class="ds-checkbox__control">
                  <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                </span>
              </label>
            </th>
            <th>API Key</th>
            <th>Alias</th>
            <th>Created</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr data-selected="true">
            <td class="ds-table__col-check">
              <label class="ds-checkbox">
                <input type="checkbox" checked>
                <span class="ds-checkbox__control">
                  <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                </span>
              </label>
            </td>
            <td><code>sk-proj-9xK2048...</code></td>
            <td>Production Primary</td>
            <td class="ds-muted">Oct 14, 2026</td>
            <td><span class="ds-badge">Admin</span></td>
          </tr>
          <tr>
            <td class="ds-table__col-check">
              <label class="ds-checkbox">
                <input type="checkbox">
                <span class="ds-checkbox__control">
                  <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                </span>
              </label>
            </td>
            <td><code>sk-proj-4mR7129...</code></td>
            <td>Staging Pipeline</td>
            <td class="ds-muted">Nov 02, 2026</td>
            <td><span class="ds-badge">Read-only</span></td>
          </tr>
        </tbody>
      </table>
    </div>`
  )
);

export const ApiKeysTable = story(
  'Default / Shared / Data Table / API Keys Table',
  stage(
    'Live Platform API Keys Table Model (30px Header, 45px Rows)',
    `<div class="ds-table-wrap">
      <table class="ds-table">
        <thead>
          <tr>
            <th class="ds-table__col-check">
              <label class="ds-checkbox">
                <input type="checkbox">
                <span class="ds-checkbox__control">
                  <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                </span>
              </label>
            </th>
            <th>Name</th>
            <th>Status</th>
            <th>Tracking ID</th>
            <th>Secret Key</th>
            <th>Created</th>
            <th>Expires</th>
            <th>Last used</th>
            <th>Owner</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ds-table__col-check">
              <label class="ds-checkbox">
                <input type="checkbox">
                <span class="ds-checkbox__control">
                  <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                </span>
              </label>
            </td>
            <td><strong>Youtube translate</strong></td>
            <td><span class="ds-tag ds-tag--sm ds-tag--active">Active</span></td>
            <td><code>key_gTmBmSZbmfcTAuEa</code></td>
            <td class="ds-muted"><code>sk-...HOsA</code></td>
            <td class="ds-muted">Apr 2, 2026</td>
            <td class="ds-muted">Never</td>
            <td class="ds-muted">Apr 2, 2026</td>
            <td class="ds-muted">Bang Thai</td>
            <td>$0.00</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-icon-button" aria-label="Edit key">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button type="button" class="ds-icon-button" aria-label="Revoke key">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td class="ds-table__col-check">
              <label class="ds-checkbox">
                <input type="checkbox" disabled>
                <span class="ds-checkbox__control">
                  <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                </span>
              </label>
            </td>
            <td class="ds-muted">Obsidian Bot</td>
            <td><span class="ds-tag ds-tag--sm">Revoked</span></td>
            <td class="ds-muted"><code>key_S8WkEu4l6JLDNPVl</code></td>
            <td class="ds-muted"><code>sk-...DvwA</code></td>
            <td class="ds-muted">Jan 1, 2025</td>
            <td class="ds-muted">Never</td>
            <td class="ds-muted">Never</td>
            <td class="ds-muted">Bang Thai</td>
            <td class="ds-muted">$0.00</td>
            <td>
              <span class="ds-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`
  )
);

export const EmptyState = story(
  'Default / Shared / Data Table / Empty State',
  stage(
    'Empty Data Table with Call to Action',
    `<div class="ds-table-wrap">
      <div class="ds-empty">
        <svg viewBox="0 0 24 24" class="ds-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        <strong>No files in storage bucket</strong>
        <p class="ds-muted">Upload your training dataset or batch request files to begin inference processing.</p>
        <button class="ds-button ds-button--primary ds-button--sm" type="button">Upload file</button>
      </div>
    </div>`
  )
);
