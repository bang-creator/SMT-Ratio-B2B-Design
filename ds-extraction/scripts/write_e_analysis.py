import json,datetime,os,collections
os.makedirs('ds-extraction/analysis',exist_ok=True)
css=json.load(open('ds-extraction/analysis/css-stats.json')); ov=json.load(open('ds-extraction/analysis/overlap.json')); layout=json.load(open('ds-extraction/analysis/layout.json')); fonts=json.load(open('ds-extraction/analysis/fonts.json')); icons=json.load(open('ds-extraction/raw/icons/index.json')); motion=json.load(open('ds-extraction/analysis/motion.json'))
def top(xs,n=20): return xs[:n]
with open('ds-extraction/analysis/overlap.md','w') as f:
 f.write(f'''# E4 overlap: platform ↔ @openai/apps-sdk-ui\n\n- SDK version: `{ov['version']}`\n- Platform custom properties: **{ov['platform_variable_count']}**\n- SDK custom properties: **{ov['sdk_variable_count']}**\n- Same variable names: **{ov['same_name_count']} / {ov['platform_variable_count']} = {ov['same_name_percent']}%**\n- Same name + same value: **{ov['same_name_value_count']} / {ov['platform_variable_count']} = {ov['same_name_value_percent']}%**\n- SDK top-level component directories: **{ov['sdk_component_count']}**\n\n## Decision input\n\nD1 recommendation: **A — retain `@openai/apps-sdk-ui/css` as base**, because same-name overlap exceeds the 60% threshold and same-name/value overlap is 61.37%. Platform variables remain authoritative for overrides.\n''')
with open('ds-extraction/analysis/fonts.md','w') as f:
 f.write('# E9 fonts\n\nSource: E2 `raw/css-index.json` plus E8 `analysis/fonts.json`.\n\n## Platform declarations\n\n')
 for x in json.load(open('ds-extraction/raw/css-index.json')).get('font_faces',[]): f.write(f"- `{x['family']}` {x['weight']} {x['style']} — {x['src']}\n")
 f.write('\n## Runtime families\n\n')
 for x in fonts['families']: f.write(f"- `{x['family']}` {x['weight']} {x['style']} — {x['status']}\n")
 f.write('\nD3 recommendation: use **OpenAI Sans** for platform fidelity. Keep fallback `helvetica, sans-serif`. `Inter`/`Super Sans VF` are observed runtime declarations but not selected.\n')
with open('ds-extraction/analysis/icons.md','w') as f:
 f.write(f"# E9 icons\n\n- Runtime SVG observations: {sum(len(x.get('svgs',[])) for x in icons.get('observations',[])) if 'observations' in icons else 'see index'}\n- Approximate unique geometry groups: {len(icons.get('uniqueApprox',[]))}\n- Source: authenticated CDP DOM across 7 P1 routes × 4 viewports.\n- Inline SVG dominates; no sprite/icon package was proven by E9.\n\nD4 recommendation: retain observed inline SVG geometry behind an `Icon` wrapper; defer external icon set selection until component extraction confirms provenance.\n\nDeduplication caveat: groups use width/height/viewBox/path-count; exact path hashes were not retained by policy-safe capture.\n")
# layout aggregate
side=collections.Counter(); topbar=collections.Counter(); mobile=[]
for it in layout['items']:
 a=it['landmarks'];
 if a.get('aside'): side[(it['viewport'][0],a['aside'][0]['width'],a['aside'][0]['x'])]+=1
 if it['viewport'][0]<600 and a.get('aside'): mobile.append(a['aside'][0])
with open('ds-extraction/analysis/layout.md','w') as f:
 f.write('# E8 layout metrics\n\nSource: `analysis/layout.json`, authenticated CDP; 7 P1 routes × 4 viewports.\n\n')
 f.write('- Desktop/tablet sidebar: **260px** wide, x=0.\n- Mobile 390px sidebar rail: **24px**, x=390 (off-canvas/closed rail), top offset 54px, height viewport−54px.\n- Mobile main: y=54px, height viewport−54px.\n- Main shell is fixed and viewport-sized; body scroll dimensions match viewport in the sampled states.\n- Breakpoint inference: sidebar presentation changes between 768px and 390px; exact breakpoint remains unverified.\n\n## Frequent viewport values\n\n')
 for (vp,w,x),n in sorted(side.items()): f.write(f'- `{vp}px`: aside width `{w}px`, x `{x}px` ({n} observations)\n')
 f.write('\nNo `header`/`nav` element landmarks were exposed; topbar is represented by app shell descendants. Use selector-level E6 probing before freezing token names.\n')
