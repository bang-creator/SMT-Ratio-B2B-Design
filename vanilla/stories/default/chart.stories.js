import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 45 Chart',
  parameters: { layout: 'padded' },
};

const W = 300;
const H = 88;
const PAD = 6;

function computeScale(points) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = max - min || 1;
  return (value) => H - PAD - ((value - min) / span) * (H - PAD * 2);
}

function renderChartSvg({
  points = [10, 25, 20, 45, 35, 60, 50, 75, 70, 95],
  variant = 'area',
  label = 'Requests per second',
  value = '1,420 rps',
} = {}) {
  const y = computeScale(points);
  const step = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : 0;
  const x = (i) => PAD + i * step;

  const coords = points.map((p, i) => ({ x: x(i), y: y(p) }));
  const linePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const last = coords[coords.length - 1];
  const areaPath = last
    ? `M ${PAD},${H - PAD} ${coords.map((c) => `L ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')} L ${last.x.toFixed(1)},${H - PAD} Z`
    : '';
  const lastIndex = points.length - 1;

  let body = '';
  if (variant === 'bars') {
    const barWidth = Math.max(2, step * 0.55);
    body = points
      .map((p, i) => {
        const top = y(p);
        const height = Math.max(1, H - PAD - top);
        const isActive = i === lastIndex;
        return `
          <rect
            x="${(x(i) - barWidth / 2).toFixed(1)}"
            y="${top.toFixed(1)}"
            width="${barWidth.toFixed(1)}"
            height="${height.toFixed(1)}"
            rx="1.5"
            class="ds-chart__bar ${isActive ? 'ds-chart__bar--active' : ''}"
          />
        `;
      })
      .join('');
  } else {
    const areaEl =
      variant === 'area' && points.length > 1
        ? `<path d="${areaPath}" class="ds-chart__area" />`
        : '';
    const dotEl = last
      ? `<circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="3" class="ds-chart__dot" />`
      : '';
    body = `
      ${areaEl}
      <polyline points="${linePoints}" class="ds-chart__line" />
      ${dotEl}
    `;
  }

  return `
    <svg
      viewBox="0 0 ${W} ${H}"
      role="img"
      aria-label="${label}: ${value}"
      class="ds-chart__svg ds-chart-svg"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        x2="${W}"
        y1="${H - PAD}"
        y2="${H - PAD}"
        class="ds-chart__baseline"
      />
      ${body}
    </svg>
  `;
}

function renderChart({
  label = 'Requests per second',
  value = '1,420 rps',
  delta = '+18.4%',
  trend = 'up',
  upIsGood = true,
  variant = 'area',
  points = [10, 25, 20, 45, 35, 60, 50, 75, 70, 95],
} = {}) {
  const direction =
    trend ??
    (delta === undefined
      ? undefined
      : /\d/.test(delta) && !/[1-9]/.test(delta)
        ? 'flat'
        : /^\s*[-−–]/.test(delta)
          ? 'down'
          : 'up');
  const good =
    direction === 'up' || direction === 'down'
      ? (direction === 'up') === upIsGood
      : undefined;

  const goodAttr = good === undefined ? 'flat' : good ? 'true' : 'false';

  return `
    <div data-slot="chart" class="ds-chart ds-chart-card">
      <div class="ds-chart__header">
        <span class="ds-chart__label">${label}</span>
        ${
          delta !== undefined
            ? `<span class="ds-chart__delta" data-trend="${direction}" data-good="${goodAttr}">${delta}</span>`
            : ''
        }
      </div>
      <span class="ds-chart__value">${value}</span>
      ${renderChartSvg({ points, variant, label, value })}
    </div>
  `;
}

function bindChartInteractive(root) {
  let currentVariant = 'area';
  const variants = ['area', 'line', 'bars'];

  function update() {
    const target = root.querySelector('.ds-chart-target');
    if (target) {
      target.innerHTML = renderChart({
        variant: currentVariant,
        label: 'Requests per second',
        value: '1,420 rps',
        delta: '+18.4%',
        trend: 'up',
        points: [10, 25, 20, 45, 35, 60, 50, 75, 70, 95],
      });
      attach();
    }
  }

  function attach() {
    const card = root.querySelector('.ds-chart-card');
    if (card) {
      card.addEventListener('click', () => {
        const nextIdx = (variants.indexOf(currentVariant) + 1) % variants.length;
        currentVariant = variants[nextIdx];
        update();
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-chart-target">
          ${renderChart({
            variant: 'area',
            label: 'Requests per second',
            value: '1,420 rps',
            delta: '+18.4%',
            trend: 'up',
            points: [10, 25, 20, 45, 35, 60, 50, 75, 70, 95],
          })}
        </div>
      </section>
    `;
    bindChartInteractive(root);
    return root;
  },
};

export const Line = story(
  'Default / Application / 45 Chart / Line',
  stage(
    'Line Variant',
    renderChart({
      variant: 'line',
      label: 'Median response latency',
      value: '240 ms',
      delta: '-12.0%',
      trend: 'down',
      upIsGood: true,
      points: [450, 420, 380, 390, 350, 310, 290, 260, 250, 240],
    })
  )
);

export const Bars = story(
  'Default / Application / 45 Chart / Bars',
  stage(
    'Bars Variant',
    renderChart({
      variant: 'bars',
      label: 'Batch inference tokens',
      value: '8.4M tokens',
      delta: '+24.5%',
      trend: 'up',
      points: [12, 18, 15, 28, 22, 35, 30, 48, 42, 60],
    })
  )
);
