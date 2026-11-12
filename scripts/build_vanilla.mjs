import fs from 'node:fs';

const stripImports = source => source.replace(/^@import[^;]+;\s*$/gm, '').replace(/^@source[^;]+;?\s*$/gm, '').trim();
const tokens = [fs.readFileSync('tokens/tokens.css', 'utf8'), fs.readFileSync('tokens/tokens.dark.css', 'utf8')].join('\n');
const app = stripImports(fs.readFileSync('vanilla/base.css', 'utf8'));
fs.mkdirSync('vanilla', { recursive: true });
fs.writeFileSync('vanilla/design-system.css', `${tokens}\n\n${app}\n\n.ds-vanilla-demo{padding-top:var(--space-8)}\n[hidden]{display:none !important}\n[data-ds-open="true"] > .ds-popover__content{display:grid}\n[data-ds-open="true"] > .ds-select__menu{display:grid}\n`);
console.log('vanilla:css ok');
