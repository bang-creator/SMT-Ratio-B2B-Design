import { chromium } from 'playwright';
import fs from 'node:fs';

async function extract() {
  console.log('Launching browser to extract 100% exact ground truth...');
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

  // Helper to extract computed node data
  const dumpElementTree = async (locator) => {
    return await locator.evaluate((root) => {
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
            color: s.color,
            backgroundColor: s.backgroundColor,
            backgroundImage: s.backgroundImage,
            border: s.border,
            borderTop: s.borderTop,
            borderBottom: s.borderBottom,
            borderLeft: s.borderLeft,
            borderRight: s.borderRight,
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

  // 1. ERROR STATE
  console.log('Navigating to error-state...');
  await page.goto('https://www.assistant-ui.com/elements/error-state', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(1000);

  // Find all state buttons in assistant-ui gallery
  const errorStateButtons = await page.locator('button:has-text("Default"), button:has-text("Retrying"), button:has-text("Network error"), button:has-text("Long detail")').all();
  console.log(`Found ${errorStateButtons.length} state buttons for error-state`);

  const errorData = {};

  // For each state tab
  const errorStates = ['Default', 'Retrying', 'Network error', 'Long detail'];
  for (const st of errorStates) {
    const btn = page.locator(`button`).filter({ hasText: new RegExp(`^${st}$`, 'i') }).first();
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(400);
      const slot = page.locator('[data-slot="error-state"]').first();
      if (await slot.count() > 0) {
        const slug = st.toLowerCase().replace(/\s+/g, '-');
        await slot.screenshot({ path: `scratch/live_error_state_${slug}_2x.png` });
        errorData[st] = await dumpElementTree(slot);
      }
    }
  }
  fs.writeFileSync('scratch/live_error_state_ground_truth.json', JSON.stringify(errorData, null, 2));

  // 2. EDIT MESSAGE
  console.log('Navigating to edit-message...');
  await page.goto('https://www.assistant-ui.com/elements/edit-message', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(1000);

  const editStates = ['Default', 'Sent', 'No replies', 'One reply', 'Long message'];
  const editData = {};

  for (const st of editStates) {
    const btn = page.locator(`button`).filter({ hasText: new RegExp(`^${st}$`, 'i') }).first();
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(400);
      const slot = page.locator('[data-slot="edit-message"]').first();
      if (await slot.count() > 0) {
        const slug = st.toLowerCase().replace(/\s+/g, '-');
        await slot.screenshot({ path: `scratch/live_edit_message_${slug}_2x.png` });
        editData[st] = await dumpElementTree(slot);
      }
    }
  }
  fs.writeFileSync('scratch/live_edit_message_ground_truth.json', JSON.stringify(editData, null, 2));

  console.log('Ground truth extraction complete!');
  await browser.close();
}

extract().catch(console.error);
