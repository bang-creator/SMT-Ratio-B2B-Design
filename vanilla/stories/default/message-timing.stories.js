import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 107 Message timing AUI',
  parameters: { layout: 'padded' },
};

function renderMessageTiming({
  stats = [
    { label: 'first token', value: '284ms' },
    { label: 'total', value: '1.47s' },
    { label: 'tokens', value: '118' },
    { label: 'tok/s', value: '80.3' },
  ],
  streaming = false,
  showDot = false,
} = {}) {
  return `
    <div data-slot="message-timing" class="ds-msg-timing">
      ${showDot ? '<span class="ds-msg-timing__dot" aria-hidden="true"></span>' : ''}
      ${stats
        .map(
          (s) => `
        <span class="ds-msg-timing__stat">
          <span class="ds-msg-timing__label">${s.label}</span>
          <span class="ds-msg-timing__val ${streaming ? 'ds-msg-timing__val--streaming' : ''}">${s.value}</span>
        </span>
      `,
        )
        .join('')}
    </div>
  `;
}

function renderTimingFixture({
  userText = 'Which regions does the edge cache cover?',
  assistantText = 'The edge cache serves from 14 regions. Requests from anywhere else fall back to us-east-1.',
  stats,
  streaming = false,
  showDot = false,
} = {}) {
  return `
    <div class="ds-msg-timing-fixture" data-slot="timing-fixture">
      <div class="ds-msg-timing-fixture__bubble--user">
        ${userText}
      </div>
      <div class="ds-msg-timing-fixture__assistant">
        <div class="ds-msg-timing-fixture__text" data-slot="demo-text">
          ${assistantText}
        </div>
        <div class="ds-msg-timing-fixture__footer" data-slot="demo-timing-container">
          ${renderMessageTiming({ stats, streaming, showDot })}
        </div>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-flex ds-flex-col ds-gap-4">
        ${renderTimingFixture({
          assistantText: 'Click simulate to test live telemetry streaming transitions.',
          stats: [
            { label: 'status', value: 'ready' },
            { label: 'last run', value: '1.47s' },
          ],
        })}
        <div class="ds-flex ds-items-center ds-gap-2">
          <button type="button" class="ds-button ds-button--primary ds-button--sm" data-action="simulate-run">
            Simulate Run
          </button>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-action="reset-run">
            Reset
          </button>
        </div>
      </div>
    `;

    const simBtn = root.querySelector('[data-action="simulate-run"]');
    const resetBtn = root.querySelector('[data-action="reset-run"]');
    const timingContainer = root.querySelector('[data-slot="demo-timing-container"]');
    const textEl = root.querySelector('[data-slot="demo-text"]');

    let timer = null;

    if (simBtn && resetBtn && timingContainer && textEl) {
      simBtn.addEventListener('click', () => {
        if (timer) clearInterval(timer);
        textEl.textContent = 'Streaming live response chunks across edge worker nodes...';
        let elapsed = 0;
        let tokens = 0;
        simBtn.disabled = true;

        timer = setInterval(() => {
          elapsed += 0.1;
          tokens += Math.floor(Math.random() * 8) + 4;
          timingContainer.innerHTML = renderMessageTiming({
            stats: [
              { label: 'first token', value: '194ms' },
              { label: 'elapsed', value: elapsed.toFixed(1) + 's' },
              { label: 'tokens', value: String(tokens) },
              { label: 'tok/s', value: (tokens / elapsed).toFixed(1) },
            ],
            streaming: true,
            showDot: true,
          });

          if (elapsed >= 1.2) {
            clearInterval(timer);
            timer = null;
            simBtn.disabled = false;
            textEl.textContent = 'Completed: Cached response delivered from SFO and IAD regions.';
            timingContainer.innerHTML = renderMessageTiming({
              stats: [
                { label: 'ttft', value: '194ms' },
                { label: 'total', value: '1.24s' },
                { label: 'tokens', value: String(tokens) },
                { label: 'tok/s', value: (tokens / 1.24).toFixed(1) },
              ],
              streaming: false,
              showDot: false,
            });
          }
        }, 100);
      });

      resetBtn.addEventListener('click', () => {
        if (timer) clearInterval(timer);
        timer = null;
        simBtn.disabled = false;
        textEl.textContent = 'Click simulate to test live telemetry streaming transitions.';
        timingContainer.innerHTML = renderMessageTiming({
          stats: [
            { label: 'status', value: 'ready' },
            { label: 'last run', value: '1.47s' },
          ],
        });
      });
    }

    return root;
  },
};

export const Complete = story(renderTimingFixture({
  stats: [
    { label: 'first token', value: '284ms' },
    { label: 'total', value: '1.47s' },
    { label: 'tokens', value: '118' },
    { label: 'tok/s', value: '80.3' },
  ],
  streaming: false,
}));

export const Streaming = story(renderTimingFixture({
  assistantText: 'The edge cache serves from 14 regions. Requests from',
  stats: [
    { label: 'first token', value: '284ms' },
    { label: 'chunks', value: '21' },
    { label: 'status', value: 'streaming' },
  ],
  streaming: true,
  showDot: true,
}));

export const SubSecond = story(renderTimingFixture({
  assistantText: '14 regions.',
  stats: [
    { label: 'first token', value: '190ms' },
    { label: 'total', value: '412ms' },
    { label: 'tokens', value: '4' },
    { label: 'tok/s', value: '9.7' },
  ],
  streaming: false,
}));

export const LongRun = story(renderTimingFixture({
  stats: [
    { label: 'first token', value: '6.82s' },
    { label: 'total', value: '48.6s' },
    { label: 'tokens', value: '2,904' },
    { label: 'tok/s', value: '59.7' },
    { label: 'tools', value: '4' },
  ],
  streaming: false,
}));
