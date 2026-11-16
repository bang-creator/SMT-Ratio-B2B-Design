import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 15 Day Separator',
  parameters: { layout: 'padded' },
};

const SAME_DAY = [
  {
    id: '1',
    day: 'Today',
    time: '09:12',
    role: 'user',
    text: 'Why does the draft survive a reload?',
  },
  {
    id: '2',
    day: 'Today',
    time: '09:12',
    role: 'assistant',
    text: "It's persisted per thread, so the slot is read back on mount.",
  },
];

const MANY_DAYS = [
  {
    id: '1',
    day: 'Mon, Oct 27',
    time: '11:40',
    role: 'user',
    text: 'Start a migration plan for moving the docs to the new MDX pipeline.',
  },
  {
    id: '2',
    day: 'Mon, Oct 27',
    time: '11:41',
    role: 'assistant',
    text: 'Drafted a four-step plan: inventory pages, port components, switch the build, then redirect old URLs.',
  },
  {
    id: '3',
    day: 'Thu, Oct 30',
    time: '17:05',
    role: 'user',
    text: 'Step two is done. Pull request 2481 is ready for review.',
  },
  {
    id: '4',
    day: 'Yesterday',
    time: '08:58',
    role: 'assistant',
    text: 'The build switch landed. Two pages still import the old callout component.',
  },
  {
    id: '5',
    day: 'Today',
    time: '09:12',
    role: 'user',
    text: 'Fix those two and we can redirect.',
  },
];

function renderDaySeparator({ messages = MANY_DAYS } = {}) {
  let lastDay = '';

  const html = messages
    .map((message) => {
      const newDay = message.day !== lastDay;
      lastDay = message.day;

      return `
        <div class="ds-day-separator__group">
          ${newDay ? `
            <div class="ds-day-separator__divider" title="Click day to toggle thread history">
              <span class="ds-day-separator__line"></span>
              <span class="ds-day-separator__label font-mono">${message.day}</span>
              <span class="ds-day-separator__line"></span>
            </div>
          ` : ''}
          <div class="ds-day-separator__turn ${message.role === 'user' ? 'ds-day-separator__turn--user' : ''}">
            <span class="ds-day-separator__bubble ${message.role === 'user' ? 'ds-day-separator__bubble--user' : 'ds-day-separator__bubble--assistant'}">
              ${message.text}
            </span>
            <span class="ds-day-separator__time font-mono tabular-nums">
              ${message.time}
            </span>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="day-separator" class="ds-day-separator">
      ${html}
    </div>
  `.trim();
}

/**
 * Default: Interactive Day Separator
 * Displays clean dividers with monospace date labels and subtle dividing rules.
 * Hovering over any message smoothly reveals its exact timestamp.
 * Clicking a date divider toggles between multi-day conversation and single-day thread.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isMany = true;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>15 Day Separator (Interactive Thread Scope Toggle)</code></header>
        <div class="ds-day-target">
          ${renderDaySeparator({ messages: MANY_DAYS })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-day-target');

    const update = () => {
      target.innerHTML = renderDaySeparator({ messages: isMany ? MANY_DAYS : SAME_DAY });
      bindEvents();
    };

    const bindEvents = () => {
      target.querySelectorAll('.ds-day-separator__divider').forEach((d) => {
        d.addEventListener('click', () => {
          isMany = !isMany;
          update();
        });
      });
    };

    bindEvents();
    return root;
  },
};

/**
 * SameDay: Single day conversation
 */
export const SameDay = story(
  'Default / Application / 15 Day Separator / Same Day',
  stage('Same Day Messages', renderDaySeparator({ messages: SAME_DAY }))
);
