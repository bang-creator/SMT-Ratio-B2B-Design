import json,collections,datetime,glob,os,re
layout=json.load(open('ds-extraction/analysis/layout.json'))
var_counts=collections.Counter(); var_pages=collections.defaultdict(set)
colors=collections.Counter(); fonts=collections.Counter(); radii=collections.Counter(); shadows=collections.Counter(); spacing=collections.Counter(); durations=collections.Counter()
for it in layout['items']:
 page=it['page'];
 for k,v in it.get('vars',{}).items():
  if v: var_counts[(k,v)]+=1; var_pages[(k,v)].add(page)
 for sel,els in it.get('landmarks',{}).items():
  for e in els:
   for key in ('background','color'):
    v=e.get(key)
    if v and v not in ('rgba(0, 0, 0, 0)','transparent','none'): colors[v]+=1
   if e.get('font'): fonts[e['font']]+=1
   if e.get('borderRadius') and e['borderRadius']!='0px': radii[e['borderRadius']]+=1
   if e.get('boxShadow') and e['boxShadow']!='none': shadows[e['boxShadow']]+=1
   for val in re.findall(r'(?:^|\s)(\d+(?:\.\d+)?)px',e.get('padding','')+' '+e.get('gap','')): spacing[val+'px']+=1
motion=json.load(open('ds-extraction/analysis/motion.json'))
result={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourcePriority':['platform CSS computed vars (E2/E8)','authenticated CDP render metrics (E8)','Dembrandt attempt (validation only)'],'pages':sorted(set(i['page'] for i in layout['items'])),'viewports':layout['viewports'],'customProperties':[{'name':k,'value':v,'observations':n,'pages':len(var_pages[(k,v)])} for (k,v),n in var_counts.most_common(250)],'palette':dict(colors.most_common(100)),'typography':dict(fonts.most_common(100)),'spacing':dict(spacing.most_common(100)),'radii':dict(radii.most_common(50)),'shadows':dict(shadows.most_common(50)),'motion':{'runtime':motion['runtime_duration_ms'],'easing':motion['runtime_easing']},'dembrandtAttempts':[{'variant':'home-light','command':'BROWSER_CDP_ENDPOINT=... npx dembrandt https://platform.openai.com/home --dtcg --design-md --tailwind --save-output --wcag --slow','output':'output/platform.openai.com/2026-11-11T09-34-44-441Z_v0.39.2.json','valid':False,'reason':'Dembrandt created a fresh context; platform session redirected to login/Cloudflare challenge. Screenshot retained for audit.'},{'variant':'home-light-cdp-authenticated-render','valid':True,'source':'authenticated CDP target used by E8; values merged above'}],'confidencePolicy':'Computed variables/render metrics with repeated page+viewport observations; unresolved or single-source values remain unverified.'}
os.makedirs('ds-extraction/analysis',exist_ok=True);json.dump(result,open('ds-extraction/analysis/rendered-merged.json','w'),indent=2)
print(json.dumps({'vars':len(var_counts),'palette':len(colors),'type':len(fonts),'spacing':len(spacing),'radii':len(radii),'shadows':len(shadows)}))
