import { chromium } from 'playwright';
import fs from 'node:fs';

async function extract() {
  console.log('Extracting live ground truth for Schedule Card and Trace Waterfall...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'dark',
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  const dumpElementWithCanvasColors = async (locator) => {
    return await locator.evaluate((root) => {
      function toRgbBytes(colorStr) {
        if (!colorStr || colorStr === 'none' || colorStr === 'transparent') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = colorStr;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return { r, g, b, a, hex: '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''), rgba: `rgba(${r}, ${g}, ${b}, ${a/255})` };
      }

      function serializeNode(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
        const s = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          slot: el.getAttribute('data-slot') || null,
          role: el.getAttribute('role') || null,
          text: el.innerText || null,
          rect: { width: rect.width, height: rect.height, x: rect.x, y: rect.y },
          styles: {
            display: s.display,
            flexDirection: s.flexDirection,
            alignItems: s.alignItems,
            justifyContent: s.justifyContent,
            gap: s.gap,
            padding: s.padding,
            margin: s.margin,
            width: s.width,
            maxWidth: s.maxWidth,
            height: s.height,
            border: s.border,
            borderColor: s.borderColor,
            borderWidth: s.borderWidth,
            borderRadius: s.borderRadius,
            boxShadow: s.boxShadow,
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            lineHeight: s.lineHeight,
            letterSpacing: s.letterSpacing,
            textAlign: s.textAlign,
            opacity: s.opacity,
            cursor: s.cursor,
            transition: s.transition,
            animation: s.animation,
            transform: s.transform,
          },
          colors: {
            bg: toRgbBytes(s.backgroundColor),
            color: toRgbBytes(s.color),
            border: toRgbBytes(s.borderColor),
          },
          children: Array.from(el.children).map(serializeNode).filter(Boolean),
        };
      }

      return {
        outerHTML: root.outerHTML,
        tree: serializeNode(root),
      };
    });
  };

  // 1. SCHEDULE CARD
  console.log('Navigating to schedule-card...');
  await page.goto('https://www.assistant-ui.com/elements/schedule-card', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(1000);

  const scheduleStates = ['Default', 'Paused', 'Never run', 'Failing', 'Long name'];
  const scheduleData = {};

  for (const st of scheduleStates) {
    const btn = page.locator('button').filter({ hasText: new RegExp(`^${st}$`, 'i') }).first();
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(400);
      const slot = page.locator('[data-slot="schedule-card"]').first();
      if (await slot.count() > 0) {
        const slug = st.toLowerCase().replace(/\s+/g, '-');
        await slot.screenshot({ path: `scratch/live_schedule_card_${slug}_2x.png` });
        scheduleData[st] = await dumpElementWithCanvasColors(slot);
      }
    }
  }
  fs.writeFileSync('scratch/live_schedule_card_ground_truth.json', JSON.stringify(scheduleData, null, 2));

  // 2. TRACE WATERFALL
  console.log('Navigating to trace-waterfall...');
  await page.goto('https://www.assistant-ui.com/elements/trace-waterfall', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(1000);

  const traceStates = ['Default', 'Streaming', 'Completed', 'Failed span', 'No spans', 'Deep trace'];
  const traceData = {};

  for (const st of traceStates) {
    const btn = page.locator('button').filter({ hasText: new RegExp(`^${st}$`, 'i') }).first();
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(400);
      const slot = page.locator('[data-slot="trace-waterfall"]').first();
      if (await slot.count() > 0) {
        const slug = st.toLowerCase().replace(/\s+/g, '-');
        await slot.screenshot({ path: `scratch/live_trace_waterfall_${slug}_2x.png` });
        traceData[st] = await dumpElementWithCanvasColors(slot);
      }
    }
  }
  fs.writeFileSync('scratch/live_trace_waterfall_ground_truth.json', JSON.stringify(traceData, null, 2));

  console.log('Ground truth extraction for Schedule Card and Trace Waterfall complete!');
  await browser.close();
}

extract().catch(console.error);
