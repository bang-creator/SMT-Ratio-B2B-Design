import fs from 'node:fs';
import path from 'node:path';

const errors = [];

function walkFiles(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isFile() && filter(full)) out.push(full);
  }
  return out;
}

// 1. Collect all canonical .ds-* class definitions from vanilla/base.css
const baseCss = fs.readFileSync('vanilla/base.css', 'utf8');
const definedDsClasses = new Set(baseCss.match(/\.ds-[a-zA-Z0-9_-]+/g)?.map((s) => s.slice(1)) || []);

// 2. Forbid ad-hoc product prefixes anywhere in vanilla/
const vanillaFiles = walkFiles('vanilla', (f) => /\.(js|html|css)$/.test(f));
for (const file of vanillaFiles) {
  if (file.endsWith('/design-system.css') || file.endsWith('\\design-system.css')) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (/\bds-smt-[a-zA-Z0-9_-]*/.test(source)) {
    errors.push(`${file}: forbidden ad-hoc prefix "ds-smt-*" (use canonical .ds-* design system classes)`);
  }
  if (/\bds-analysing[a-zA-Z0-9_-]*/.test(source)) {
    errors.push(`${file}: forbidden ad-hoc class "ds-analysing*"`);
  }
}

// 3. Validate product stories (vanilla/stories/smt-ratio/**) and shared sidebar story
const guardedStories = [
  ...walkFiles('vanilla/stories/smt-ratio', (f) => f.endsWith('.stories.js')),
  ...(fs.existsSync('vanilla/stories/shared/sidebar.stories.js') ? ['vanilla/stories/shared/sidebar.stories.js'] : []),
];

const FAKE_UNICODE_ICONS = /[⌂↶◇☰🔍⚙]/;
const HARDCODED_SVG_COLORS = /\b(?:fill|stroke)\s*=\s*["']\s*(?:white|black|#[0-9a-fA-F]{3,8})\s*["']/i;
const ALLOWED_NON_DS_CLASSES = new Set(['is-active', 'is-disabled']);

for (const file of guardedStories) {
  const source = fs.readFileSync(file, 'utf8');
  const isProductStory = file.includes('smt-ratio');

  // 3a. No fake Unicode glyph icons or hardcoded SVG colors
  if (FAKE_UNICODE_ICONS.test(source)) {
    errors.push(`${file}: fake Unicode icon glyph detected; use canonical inline <svg> from platform evidence`);
  }
  if (HARDCODED_SVG_COLORS.test(source)) {
    errors.push(`${file}: hardcoded SVG fill/stroke color detected; use fill="currentColor" or stroke="currentColor"`);
  }

  // 3b. Verify every class="..." in template markup uses defined ds-* classes
  const classAttrRegex = /\bclass\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = classAttrRegex.exec(source)) !== null) {
    const tokens = m[1].trim().split(/\s+/).filter(Boolean);
    for (const cls of tokens) {
      if (cls.includes('${')) continue;
      if (cls.startsWith('ds-')) {
        if (!definedDsClasses.has(cls)) {
          errors.push(`${file}: unknown design-system class "${cls}" (not defined in vanilla/base.css)`);
        }
      } else if (isProductStory && !ALLOWED_NON_DS_CLASSES.has(cls)) {
        errors.push(`${file}: invented non-DS class "${cls}" (only canonical .ds-* classes allowed)`);
      }
    }
  }

  // 3c. Every interactive/landmark HTML tag must carry a canonical ds-* class
  if (isProductStory) {
    const tagRegex = /<(button|input|select|textarea|aside|nav|main)\b([^>]*)>/gi;
    while ((m = tagRegex.exec(source)) !== null) {
      const tag = m[1].toLowerCase();
      const attrs = m[2] || '';
      const clsMatch = attrs.match(/\bclass\s*=\s*"([^"]*)"/);
      if (!clsMatch || !/\bds-[a-zA-Z0-9_-]+/.test(clsMatch[1])) {
        errors.push(`${file}: raw <${tag}> without canonical .ds-* class`);
      }
    }
  }

  // 3d. Sidebar Ground-Truth Anatomy Contract
  if (isProductStory && /\bds-sidebar\b/.test(source)) {
    const requiredSidebarTokens = [
      'ds-shell',
      'ds-sidebar',
      'ds-sidebar__header',
      'ds-sidebar__brand',
      'ds-sidebar__collapse',
      'ds-search-trigger',
      'ds-nav',
      'ds-nav__item',
      'ds-sidebar__footer',
      'ds-menu--top',
      'ds-sidebar__account',
      'ds-avatar',
      'ds-main',
    ];
    for (const token of requiredSidebarTokens) {
      if (!new RegExp(`\\b${token}\\b`).test(source)) {
        errors.push(`${file}: sidebar missing required ground-truth class "${token}"`);
      }
    }
    if (/\bds-sidebar__account-more\b/.test(source)) {
      errors.push(`${file}: hallucinated ".ds-sidebar__account-more" element (not present on platform.openai.com)`);
    }
    const exports = Array.from(source.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g)).map((x) => x[1]);
    if (exports.length !== 1 || exports[0] !== 'Default') {
      errors.push(`${file}: sidebar story must export only "Default" (found: ${exports.join(', ') || 'none'})`);
    }
  }
}

// 4. Verify SVG assets in vanilla/assets/ use theme-aware colors (no hardcoded white/black/hex)
for (const svgFile of walkFiles('vanilla/assets', (f) => f.endsWith('.svg'))) {
  const source = fs.readFileSync(svgFile, 'utf8');
  if (HARDCODED_SVG_COLORS.test(source)) {
    errors.push(`${svgFile}: hardcoded SVG fill/stroke color detected; use currentColor`);
  }
}

// 5. Sidebar CSS Ground-Truth Contract in vanilla/base.css
const sidebarRuleCount = (baseCss.match(/^\.ds-sidebar\s*\{/gm) || []).length;
if (sidebarRuleCount !== 1 || /\/\*\s*SMT Ratio application shell\s*\*\//.test(baseCss)) {
  errors.push(`vanilla/base.css: expected exactly 1 canonical .ds-sidebar rule without duplicate override blocks (found ${sidebarRuleCount})`);
}
if (!/^\.ds-sidebar\s*\{[^}]*color\s*:\s*var\(--color-semantic-text-sidebar\)/m.test(baseCss)) {
  errors.push('vanilla/base.css: .ds-sidebar must use color:var(--color-semantic-text-sidebar)');
}
if (!/^\.ds-sidebar__collapse\s*\{[^}]*color\s*:\s*var\(--color-semantic-text-sidebar-secondary\)/m.test(baseCss)) {
  errors.push('vanilla/base.css: .ds-sidebar__collapse must use color:var(--color-semantic-text-sidebar-secondary)');
}
if (/\.ds-nav__item\s+svg\s*\{[^}]*(?:fill\s*:\s*none|stroke\s*:\s*currentColor)/i.test(baseCss)) {
  errors.push('vanilla/base.css: .ds-nav__item svg must not force fill:none or stroke:currentColor');
}
if (!/^\.ds-avatar\s*\{[^}]*width\s*:\s*24px\s*;\s*height\s*:\s*24px/m.test(baseCss)) {
  errors.push('vanilla/base.css: .ds-avatar must enforce 24x24px platform dimensions');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('ui-contract:ok');
