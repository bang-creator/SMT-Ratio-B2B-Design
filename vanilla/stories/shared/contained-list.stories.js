import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Contained List',
  parameters: { layout: 'padded' },
};

/* Source: Organization Limits & Models in Use (https://platform.openai.com/settings/organization/limits)
 * Ground truth:
 * - Contained surface card with 12px border radius and subtle border
 * - Header row with card title ("Models in use") and tier selector dropdown ("Build (your tier)")
 * - Clean table structure with 4 columns: Model, Token limits, Request and other limits, Batch queue limits
 * - Strict 400 font-weight rule across column headers and metric numbers
 * - Monospace typography for model identifiers
 * - Multi-metric stacked layout for RPM/IPM limits
 * - No row hover effects; no collapse footer */

const CHEVRONS_UP_DOWN_SVG = `<svg viewBox="0 0 16 16" class="ds-icon" aria-hidden="true"><path d="M5 6.5l3-3 3 3M5 9.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const Default = story(
  'Default / Shared / Contained List / Default',
  stage(
    'Models in use (Limits Contained List)',
    `<div class="ds-contained-list">
      <div class="ds-contained-list__top">
        <h2 class="ds-contained-list__title">Models in use</h2>
        <div class="ds-select ds-contained-list__tier-select" data-ds-select>
          <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
            <span data-ds-value>Build (your tier)</span>
            <span class="ds-select__chevron" aria-hidden="true">${CHEVRONS_UP_DOWN_SVG}</span>
          </button>
          <div class="ds-select__menu" role="listbox" hidden>
            <button type="button" class="ds-select__option" role="option" data-value="Usage tier 1">Usage tier 1</button>
            <button type="button" class="ds-select__option" role="option" data-value="Usage tier 2">Usage tier 2</button>
            <button type="button" class="ds-select__option" role="option" data-value="Usage tier 3">Usage tier 3</button>
            <button type="button" class="ds-select__option" role="option" data-value="Usage tier 4">Usage tier 4</button>
            <button type="button" class="ds-select__option" role="option" data-value="Usage tier 5">Usage tier 5</button>
            <button type="button" class="ds-select__option" role="option" data-value="Build (your tier)" aria-selected="true">Build (your tier)</button>
          </div>
        </div>
      </div>

      <div class="ds-contained-list__table-wrap">
        <table class="ds-contained-list__table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Token limits</th>
              <th>Request and other limits</th>
              <th>Batch queue limits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="ds-contained-list__model">gpt-5.5</span></td>
              <td>4,000,000 TPM</td>
              <td>
                <div class="ds-contained-list__metrics">
                  <span>10,000 RPM</span>
                  <span>50,000 IPM</span>
                </div>
              </td>
              <td>200,000,000 TPD</td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">gpt-5.5-pro</span></td>
              <td>1,000,000 TPM</td>
              <td>
                <div class="ds-contained-list__metrics">
                  <span>1,000 RPM</span>
                  <span>50,000 IPM</span>
                </div>
              </td>
              <td>20,000,000 TPD</td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">gpt-5.4-mini</span></td>
              <td>10,000,000 TPM</td>
              <td>
                <div class="ds-contained-list__metrics">
                  <span>10,000 RPM</span>
                  <span>50,000 IPM</span>
                </div>
              </td>
              <td>1,000,000,000 TPD</td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">tts-1</span></td>
              <td>400,000 TPM</td>
              <td><span>7,500 RPM</span></td>
              <td><span class="ds-contained-list__empty-dash">—</span></td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">tts-1-hd</span></td>
              <td>700,000 TPM</td>
              <td><span>7,500 RPM</span></td>
              <td><span class="ds-contained-list__empty-dash">—</span></td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">whisper-1</span></td>
              <td>25,000,000 TPM</td>
              <td><span>7,500 RPM</span></td>
              <td><span class="ds-contained-list__empty-dash">—</span></td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">omni-moderation-latest</span></td>
              <td>250,000 TPM</td>
              <td><span>2,000 RPM</span></td>
              <td>8,000,000 TPD</td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">text-embedding-3-large</span></td>
              <td>5,000,000 TPM</td>
              <td><span>10,000 RPM</span></td>
              <td>500,000,000 TPD</td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">text-embedding-3-small</span></td>
              <td>5,000,000 TPM</td>
              <td><span>10,000 RPM</span></td>
              <td>500,000,000 TPD</td>
            </tr>
            <tr>
              <td><span class="ds-contained-list__model">text-embedding-ada-002</span></td>
              <td>5,000,000 TPM</td>
              <td><span>10,000 RPM</span></td>
              <td>500,000,000 TPD</td>
            </tr>
            <tr>
              <td><div class="ds-contained-list__model-desc">Default limits for all other models</div></td>
              <td>250,000 TPM</td>
              <td>
                <div class="ds-contained-list__metrics">
                  <span>3,000 RPM</span>
                  <span>10 IPM</span>
                </div>
              </td>
              <td><span class="ds-contained-list__empty-dash">—</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`
  )
);
