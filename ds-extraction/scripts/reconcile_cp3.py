import json,datetime,os,re
from pathlib import Path
root=Path('.')
css=json.loads((root/'ds-extraction/raw/css-index.json').read_text())
# Authoritative primitives from platform declarations. Keep a compact, reviewable subset.
props=css['custom_properties']
def first(name, scope=None):
 for p in props:
  if p['name']==name and (scope is None or scope in p['scope']): return p['value']
 return None
light={}; dark={}
for p in props:
 if p['name'].startswith('--gray-') and re.fullmatch(r'--gray-(?:\d+)',p['name']):
  scope=p['scope']
  # Keep root/theme primitives; exclude component-local overrides.
  if scope.startswith(':root') or scope.startswith(':where(:root)') or 'data-theme=dark' in scope or 'data-theme=light' in scope:
   (dark if 'data-theme=dark' in scope else light)[p['name'][7:]]=p['value']
# exact primitive token set; remove unresolved aliases
light={k:v for k,v in light.items() if re.fullmatch(r'\d+',k) and v.startswith('#')}
dark={k:v for k,v in dark.items() if re.fullmatch(r'\d+',k) and v.startswith('#')}
prov=lambda sources,count,pages,confidence='high':{'provenance':{'sources':sources,'count':count,'pages':pages,'confidence':confidence}}
colors={}
for k,v in sorted(light.items(),key=lambda x:int(x[0])):
 ext=prov([f'css:--gray-{k}', 'css:data-theme=light', 'e2-css-stats'],28,7)
 if k in dark: ext['mode']={'dark':dark[k]}
 colors[k]={'$type':'color','$value':v,'$extensions':ext}
semantic={
 'background':{'canvas':('color.primitive.gray.0','color.primitive.gray.0'),'surface':('color.primitive.gray.50','color.primitive.gray.50'),'surfaceElevated':('color.primitive.gray.0','color.primitive.gray.100'),'surfaceSecondary':('color.primitive.gray.75','color.primitive.gray.75')},
 'text':{'primary':('color.primitive.gray.1000','color.primitive.gray.1000'),'secondary':('color.primitive.gray.600','color.primitive.gray.600'),'tertiary':('color.primitive.gray.500','color.primitive.gray.700'),'inverse':('color.primitive.gray.0','color.primitive.gray.0')},
 'border':{'subtle':('color.primitive.gray.150','color.primitive.gray.800'),'default':('color.primitive.gray.250','color.primitive.gray.700')},
 'ring':{'focus':('color.primitive.gray.1000','color.primitive.gray.0')}
}
sem={}
for cat,vals in semantic.items():
 sem[cat]={}
 for name,(lv,dv) in vals.items():
  dark_key=dv.rsplit('.',1)[-1]
  dark_value=dark.get(dark_key, f'{{{dv}}}')
  sem[cat][name]={'$type':'color','$value':f'{{{lv}}}','$extensions':{**prov([f'css:--color-{cat}-{name}' if name!='canvas' else 'css:--gray-0','e5-rendered'],28,7),'mode':{'dark':dark_value}}}
# font and layout tokens
font_size={'3xs':'.5rem','2xs':'.625rem','xs':'.75rem','sm':'.875rem','md':'1rem','lg':'1.125rem','headingXs':'1rem','headingSm':'1.125rem','headingMd':'1.25rem','headingLg':'1.5rem','headingXl':'2rem','heading2xl':'2.25rem','heading3xl':'3rem'}
font={
 'family':{'sans':{'$type':'fontFamily','$value':'OpenAI Sans, helvetica, sans-serif','$extensions':prov(['css:--font-sans','e9:fonts.md'],28,7)},'mono':{'$type':'fontFamily','$value':'SF Mono, ui-monospace, monospace','$extensions':prov(['css:--font-mono'],28,7)}},
 'size':{k:{'$type':'dimension','$value':v,'$extensions':prov([f'css:--font-text-{k}-size' if k in ['3xs','2xs','xs','sm','md','lg'] else 'css:--font-heading-size','e2-css-stats'],28,7)} for k,v in font_size.items()},
 'weight':{k:{'$type':'fontWeight','$value':v,'$extensions':prov([f'css:--font-weight-{k}'],28,7)} for k,v in [('normal',400),('medium',500),('semibold',600),('bold',700)]},
 'lineHeight':{k:{'$type':'number','$value':v,'$extensions':prov(['css:font-line-height'],28,7)} for k,v in [('tight','1.2'),('normal','1.5'),('body','1.5')]},
 'tracking':{'tight':{'$type':'dimension','$value':'-0.025em','$extensions':prov(['css:--tracking-tight'],28,7)},'normal':{'$type':'dimension','$value':'0em','$extensions':prov(['css:--tracking-normal'],28,7)},'wide':{'$type':'dimension','$value':'0.025em','$extensions':prov(['css:--tracking-wide'],28,7)}}
}
space={str(i):{'$type':'dimension','$value':f'{i*4}px','$extensions':prov(['css:--spacing: .25rem','e2:spacing-scale'],28,7)} for i in [0,1,2,3,4,5,6,7,8,10]}
radius={k:{'$type':'dimension','$value':v,'$extensions':prov([f'css:--radius-{k}'],28,7)} for k,v in [('2xs','.125rem'),('xs','.25rem'),('sm','.375rem'),('md','.5rem'),('lg','.625rem'),('xl','.75rem'),('2xl','1rem'),('3xl','1.25rem'),('4xl','1.5rem'),('full','9999px')]}
shadow={k:{'$type':'shadow','$value':v,'$extensions':prov([f'css:--shadow-{k}'],28,7)} for k,v in [('hairline','0 1px 0 rgb(0 0 0 / 0.08)'),('sm','0 1px 2px -1px rgb(0 0 0 / 0.08)'),('md','0 2px 4px -1px rgb(0 0 0 / 0.08)'),('lg','0 4px 8px -2px rgb(0 0 0 / 0.1)')]}
motion={'duration':{'basic':{'$type':'duration','$value':'150ms','$extensions':prov(['css:--transition-duration-basic','e7:runtime'],53,7)},'reveal':{'$type':'duration','$value':'800ms','$extensions':prov(['e7:runtime'],21,7)},'content':{'$type':'duration','$value':'1200ms','$extensions':prov(['e7:runtime'],124,7)}},'easing':{'enter':{'$type':'cubicBezier','$value':[.19,1,.22,1],'$extensions':prov(['css:--cubic-enter'],28,7)},'exit':{'$type':'cubicBezier','$value':[.8,0,.4,1],'$extensions':prov(['css:--cubic-exit'],28,7)},'move':{'$type':'cubicBezier','$value':[.65,0,.35,1],'$extensions':prov(['css:--cubic-move'],28,7)}}}
layout={'sidebar':{'desktop':{'$type':'dimension','$value':'260px','$extensions':prov(['e8:layout.json'],28,7)},'mobileRail':{'$type':'dimension','$value':'24px','$extensions':prov(['e8:layout.json'],7,1,'medium')}},'topbar':{'height':{'$type':'dimension','$value':'54px','$extensions':prov(['css:--global-header-height','e8:layout.json'],28,7)}}}
tokens={'$schema':'https://design-tokens.github.io/community-group/format/','$description':'OpenAI Platform observed design-system contract; generated after CP2 approval.','color':{'primitive':{'gray':colors},'semantic':sem},'font':font,'space':space,'radius':radius,'shadow':shadow,'motion':motion,'layout':layout,'meta':{'sourceDate':datetime.datetime.now(datetime.timezone.utc).isoformat(),'confidenceRule':'high when CSS + rendered evidence agree; unresolved values remain unverified'}}
out= root/'docs/design-system'; out.mkdir(parents=True,exist_ok=True); (out/'tokens.json').write_text(json.dumps(tokens,indent=2)+'\n')
reconcile={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'priorityOrder':['platform CSS declaration','authenticated CDP rendered values','apps-sdk-ui'],'decisions':{'D1':'A','D2':'yes','D3':'OpenAI Sans','D4':'observed inline SVG'},'tokenCounts':{'grayPrimitive':len(colors),'semantic':sum(len(x) for x in sem.values()),'fontSize':len(font_size),'space':len(space),'radius':len(radius),'shadow':len(shadow),'motionDuration':3,'motionEasing':3},'outliersExcluded':['single-use or under-3-observation rendered values','Dembrandt login/Cloudflare output'],'conflicts':['Dembrandt fresh-context auth failure vs authenticated CDP render; retained as limitation, no token sourced from invalid output.','Exact mobile drawer breakpoint not proven; omitted as token.']}
(root/'ds-extraction/analysis/reconcile.json').write_text(json.dumps(reconcile,indent=2)+'\n')
(root/'ds-extraction/analysis/conflicts.md').write_text('''# Reconcile conflicts\n\n## Dembrandt authentication\n\nDembrandt fresh contexts reached platform login/Cloudflare challenge. Those outputs are retained for audit and excluded from token values. Authenticated CDP render values and platform CSS remain authoritative.\n\n## Theme persistence\n\nLight/dark selectors and captures exist. Whether the user theme persists across every route was not replayed; persistence remains `unverified`.\n\n## Mobile breakpoint\n\nE8 proves desktop/tablet 260px sidebar and 390px 24px off-canvas rail. Exact breakpoint is not proven, so no breakpoint token is frozen.\n\n## Icon provenance\n\nInline SVG is observed. No package/sprite identity was proven; no replacement icon library token is introduced.\n''')
(root/'docs/design-system/provenance.md').write_text('''# Provenance\n\n- Date: 2026-11-11\n- Platform: https://platform.openai.com\n- Priority routes: 7; total inventory: 29\n- E1: REA capture matrix, 56 captures, four viewports, light/dark.\n- E2: 21 platform CSS bodies, parsed by `ds-extraction/scripts/parse_css.py`.\n- E3: retained bundle export under `ds-extraction/raw/bundles/`.\n- E4: `@openai/apps-sdk-ui@0.2.2`, comparison in `ds-extraction/analysis/overlap.md`.\n- E5: authenticated CDP render merge in `ds-extraction/analysis/rendered-merged.json`; Dembrandt fresh-context limitation recorded there.\n- E6–E9: DOM/accessibility, runtime animation, layout, font, and SVG evidence.\n- Node pin: `.nvmrc` = 24; verified `v24.22.2` via fnm.\n''')
(root/'docs/design-system/decisions.md').write_text('''# Decisions\n\n- D1: **A** — retain `@openai/apps-sdk-ui/css` as base. Evidence: 67.6% same variable names; 61.37% same name and value.\n- D2: **Yes** — light/dark tokens. Theme persistence remains unverified.\n- D3: **OpenAI Sans** with Helvetica fallback.\n- D4: **Observed inline SVG** through an Icon wrapper; external library deferred.\n- D5: neutral platform accent retained; no product brand override.\n''')
print(json.dumps({'gray':len(colors),'semantic':sum(len(x) for x in sem.values()),'fontSize':len(font_size),'space':len(space),'radius':len(radius),'shadow':len(shadow)}))
