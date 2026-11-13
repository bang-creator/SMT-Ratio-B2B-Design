import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Data Table',
  parameters: { layout: 'padded' },
};

/* ── SVG Icons ── */

const COPY_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const SORT_ICON = `<svg class="ds-table__sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const INFO_ICON = `<svg class="ds-table__info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
const EDIT_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`;
const TRASH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
const KEY_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path><path d="m15.5 7.5 3 3L22 7l-3-3"></path></svg>`;

const CHECKBOX = (checked = false) => `
  <label class="ds-checkbox">
    <input type="checkbox"${checked ? ' checked' : ''}>
    <span class="ds-checkbox__control">
      <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
    </span>
  </label>`;

/* ── Story: Default (No Checkbox, Sortable, Tooltip, Reused Buttons) ── */

export const Default = story(
  'Default / Shared / Data Table / Default',
  stage(
    'Data Table (OpenAI Platform: No Checkbox, Sortable Header, Info Tooltip, Reused Button Components)',
    `<div class="ds-table-wrap">
      <table class="ds-table">
        <thead>
          <tr>
            <th class="ds-table__sortable" data-sort="none">
              <span class="ds-table__th-content">Name${SORT_ICON}</span>
            </th>
            <th>Status</th>
            <th>Tracking ID</th>
            <th>Secret Key</th>
            <th class="ds-table__sortable" data-sort="desc" aria-sort="descending">
              <span class="ds-table__th-content">Created${SORT_ICON}</span>
            </th>
            <th>Expires</th>
            <th>
              <span class="ds-table__th-content">
                Last used
                <span class="ds-tooltip ds-tooltip--bottom-right">
                  ${INFO_ICON}
                  <span class="ds-tooltip__content" role="tooltip">The last time this API key was used in a request.</span>
                </span>
              </span>
            </th>
            <th>Created by</th>
            <th>Permissions</th>
            <th>
              <span class="ds-table__th-content">
                Monthly spend
                <span class="ds-tooltip ds-tooltip--bottom-right">
                  ${INFO_ICON}
                  <span class="ds-tooltip__content" role="tooltip">Estimated cost incurred by this API key in the current billing cycle.</span>
                </span>
              </span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>test</td>
            <td>Active</td>
            <td>
              <div class="ds-table__cell-inline">
                <code>key_A3bt1qqiFcHW6EzT</code>
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Copy tracking ID">${COPY_ICON}</button>
              </div>
            </td>
            <td><code>sk-...H6kA</code></td>
            <td>Nov 12, 2026</td>
            <td>Dec 12, 2026</td>
            <td>Never</td>
            <td>Bang Thai</td>
            <td>Restricted</td>
            <td>$0.00</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Edit key">${EDIT_ICON}</button>
                <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete key">${TRASH_ICON}</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Obsidiant Bot</td>
            <td>Active</td>
            <td>
              <div class="ds-table__cell-inline">
                <code>key_wCZtOumFAOHbRRbM</code>
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Copy tracking ID">${COPY_ICON}</button>
              </div>
            </td>
            <td><code>sk-...L9pQ</code></td>
            <td>Nov 10, 2026</td>
            <td>Dec 10, 2026</td>
            <td>Nov 11, 2026</td>
            <td>Bang Thai</td>
            <td>All</td>
            <td>$0.00</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Edit key">${EDIT_ICON}</button>
                <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete key">${TRASH_ICON}</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Obsidian Bot</td>
            <td>Revoked</td>
            <td>
              <div class="ds-table__cell-inline">
                <code>key_S8WkEu4l6JLDNPV1</code>
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Copy tracking ID">${COPY_ICON}</button>
              </div>
            </td>
            <td><code>sk-...DvwA</code></td>
            <td>Jan 1, 2025</td>
            <td>Never</td>
            <td>Never</td>
            <td>Bang Thai</td>
            <td>All</td>
            <td>$0.00</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Edit key">${EDIT_ICON}</button>
                <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete key">${TRASH_ICON}</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>My Test Key</td>
            <td>Revoked</td>
            <td>
              <div class="ds-table__cell-inline">
                <code>key_xvPnqidpuECs5v0v</code>
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Copy tracking ID">${COPY_ICON}</button>
              </div>
            </td>
            <td><code>sk-...sscA</code></td>
            <td>Jan 1, 2025</td>
            <td>Never</td>
            <td>Never</td>
            <td>Bang Thai</td>
            <td>All</td>
            <td>$0.00</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Edit key">${EDIT_ICON}</button>
                <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete key">${TRASH_ICON}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`
  )
);

/* ── Story: Selectable (With Checkbox Column) ── */

export const Selectable = story(
  'Default / Shared / Data Table / Selectable',
  stage(
    'Interactive Row Selection (Click checkboxes to select rows or header to select all)',
    `<div class="ds-table-wrap">
      <table class="ds-table">
        <thead>
          <tr>
            <th class="ds-table__col-check">${CHECKBOX(false)}</th>
            <th class="ds-table__sortable" data-sort="none">
              <span class="ds-table__th-content">Name${SORT_ICON}</span>
            </th>
            <th>Status</th>
            <th>Tracking ID</th>
            <th class="ds-table__sortable" data-sort="desc" aria-sort="descending">
              <span class="ds-table__th-content">Created${SORT_ICON}</span>
            </th>
            <th>Permissions</th>
            <th>
              <span class="ds-table__th-content">
                Monthly spend
                <span class="ds-tooltip ds-tooltip--bottom-right">
                  ${INFO_ICON}
                  <span class="ds-tooltip__content" role="tooltip">Estimated cost incurred in the current billing cycle.</span>
                </span>
              </span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr data-selected="true">
            <td class="ds-table__col-check">${CHECKBOX(true)}</td>
            <td>Production Primary</td>
            <td>Active</td>
            <td>
              <div class="ds-table__cell-inline">
                <code>key_A3bt1qqiFcHW6EzT</code>
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Copy tracking ID">${COPY_ICON}</button>
              </div>
            </td>
            <td>Nov 12, 2026</td>
            <td>Restricted</td>
            <td>$14.20</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Edit key">${EDIT_ICON}</button>
                <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete key">${TRASH_ICON}</button>
              </div>
            </td>
          </tr>
          <tr>
            <td class="ds-table__col-check">${CHECKBOX(false)}</td>
            <td>Staging Pipeline</td>
            <td>Active</td>
            <td>
              <div class="ds-table__cell-inline">
                <code>key_wCZtOumFAOHbRRbM</code>
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Copy tracking ID">${COPY_ICON}</button>
              </div>
            </td>
            <td>Nov 10, 2026</td>
            <td>All</td>
            <td>$2.80</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Edit key">${EDIT_ICON}</button>
                <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete key">${TRASH_ICON}</button>
              </div>
            </td>
          </tr>
          <tr>
            <td class="ds-table__col-check">${CHECKBOX(false)}</td>
            <td>Evaluation Shard</td>
            <td>Revoked</td>
            <td>
              <div class="ds-table__cell-inline">
                <code>key_S8WkEu4l6JLDNPV1</code>
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Copy tracking ID">${COPY_ICON}</button>
              </div>
            </td>
            <td>Oct 28, 2026</td>
            <td>Read-only</td>
            <td>$0.00</td>
            <td>
              <div class="ds-table__actions">
                <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Edit key">${EDIT_ICON}</button>
                <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete key">${TRASH_ICON}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`
  )
);

/* ── Story: Empty State (Preserves Header, Empty View in Data Row) ── */

export const EmptyState = story(
  'Default / Shared / Data Table / Empty State',
  stage(
    'Empty Data Table (Header Visible, Empty State in Data Row)',
    `<div class="ds-table-wrap">
      <table class="ds-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Tracking ID</th>
            <th>Secret Key</th>
            <th>Created</th>
            <th>Expires</th>
            <th>
              <span class="ds-table__th-content">
                Last used
                <span class="ds-tooltip ds-tooltip--bottom-right">
                  ${INFO_ICON}
                  <span class="ds-tooltip__content" role="tooltip">The last time this API key was used in a request.</span>
                </span>
              </span>
            </th>
            <th>Created by</th>
            <th>Permissions</th>
            <th>
              <span class="ds-table__th-content">
                Monthly spend
                <span class="ds-tooltip ds-tooltip--bottom-right">
                  ${INFO_ICON}
                  <span class="ds-tooltip__content" role="tooltip">Estimated cost incurred in the current billing cycle.</span>
                </span>
              </span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr class="ds-table__empty-row">
            <td colspan="11" class="ds-table__empty-cell">
              <div class="ds-platform-empty">
                <div class="ds-platform-empty__icon">${KEY_ICON}</div>
                <strong>No API keys</strong>
                <p>You haven't created any API keys yet. Create a secret key to begin sending requests to OpenAI models.</p>
                <button type="button" class="ds-button ds-button--primary ds-button--sm">Create new secret key</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`
  )
);
