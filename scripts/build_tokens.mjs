import fs from 'node:fs';
import path from 'node:path';
const tokens=JSON.parse(fs.readFileSync('docs/design-system/tokens.json','utf8'));
const out='src/tokens'; fs.mkdirSync(out,{recursive:true});
const entries=[];
function walk(node,p=[]){ if(!node||typeof node!=='object') return; if('$value' in node){entries.push({path:p,name:p.join('-'),value:node.$value,ext:node.$extensions||{}});return;} for(const [k,v] of Object.entries(node)){if(!k.startsWith('$')&&k!=='meta')walk(v,[...p,k]);}}
walk(tokens);
const byPath=new Map(entries.map(e=>[e.path.join('.'),e]));
function resolve(v,dark=false){ if(typeof v!=='string') return String(v); const m=v.match(/^\{(.+)\}$/); if(!m)return v; const ref=byPath.get(m[1]); if(!ref)return v; const override=dark?ref.ext?.mode?.dark:undefined; return resolve(override??ref.value,dark); }
function cssVar(e){return `--${e.name.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())}`;}
const light=[],dark=[];
for(const e of entries){let v=resolve(e.value); if(e.path[0]==='motion'&&e.path[1]==='easing'&&Array.isArray(e.value)) v=`cubic-bezier(${e.value.join(', ')})`; light.push(`  ${cssVar(e)}: ${v};`); const mode=e.ext?.mode?.dark; if(mode!==undefined) dark.push(`  ${cssVar(e)}: ${resolve(mode,true)};`);}
fs.writeFileSync(`${out}/tokens.css`,`:root {\n${light.join('\n')}\n}\n`);
fs.writeFileSync(`${out}/tokens.dark.css`,`:root[data-theme="dark"] {\n${dark.join('\n')}\n}\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${dark.join('\n')}\n  }\n}\n`);
const theme=['@theme {','  --color-*: initial;','  --spacing-*: initial;','  --radius-*: initial;','  --shadow-*: initial;','  --font-*: initial;','  --text-*: initial;',...entries.filter(e=>/^color-semantic|^font|^space|^radius|^shadow/.test(e.name)).map(e=>`  --${e.name.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())}: var(${cssVar(e)});`),'}'].join('\n')+'\n';
fs.writeFileSync(`${out}/theme.css`,theme);
const duration=entries.filter(e=>e.path[0]==='motion'&&e.path[1]==='duration').map(e=>`  ${e.path[2]}: '${e.value}',`).join('\n');
const easing=entries.filter(e=>e.path[0]==='motion'&&e.path[1]==='easing').map(e=>`  ${e.path[2]}: [${e.value.join(', ')}],`).join('\n');
fs.writeFileSync(`${out}/motion.ts`,`export const duration = {\n${duration}\n} as const;\n\nexport const easing = {\n${easing}\n} as const;\n\nexport const reducedMotion = { duration: 0, easing: [0, 0, 1, 1] as const };\n`);
console.log(JSON.stringify({tokens:entries.length,light:light.length,dark:dark.length}));
