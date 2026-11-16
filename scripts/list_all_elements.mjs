import { chromium } from 'playwright';
import fs from 'node:fs';

async function run() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.assistant-ui.com/elements', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="/elements"]'));
    const items = anchors.map(a => {
      const href = a.getAttribute('href');
      const text = a.innerText.trim().replace(/\n+/g, ' ');
      return { href, text };
    });

    // Also look for sidebar groups
    const sidebar = document.querySelector('aside, nav, [data-sidebar], .sidebar');
    const sidebarLinks = sidebar
      ? Array.from(sidebar.querySelectorAll('a[href^="/elements"]')).map(a => ({
          href: a.getAttribute('href'),
          text: a.innerText.trim().replace(/\n+/g, ' '),
        }))
      : [];

    return {
      allElementsLinks: items,
      sidebarLinks: sidebarLinks,
      pageTitle: document.title,
    };
  });

  console.log(JSON.stringify(links, null, 2));
  fs.writeFileSync('scripts/elements_list.json', JSON.stringify(links, null, 2));

  await browser.close();
}

run().catch(console.error);
