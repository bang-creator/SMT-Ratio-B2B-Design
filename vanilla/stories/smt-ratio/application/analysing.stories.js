import { story } from '../../story-helpers.js';

export default {
  title: 'SMT Ratio / Application / Analysing',
  parameters: { layout: 'fullscreen' },
};

export const Default = story(
  'SMT Ratio / Application / Analysing / Default',
  `
    <div class="ds-tool-run-canvas">
      <div class="ds-tool-run" data-ds-tool-run></div>
    </div>
  `,
  { layout: 'fullscreen' }
);
