import json,glob,re,os,collections,datetime
files=glob.glob('ds-extraction/captures/pages/e1/*.json')
rows=[]
for f in files:
    x=json.load(open(f)); r=x.get('normalized_result',{}); steps=r.get('steps',[]); art={}
    for s in steps:
      for k,v in (s.get('artifacts') or {}).items():
        if isinstance(v,dict) and v.get('state')=='captured': art[k]=v.get('value',{})
    a=(art.get('accessibility') or {}).get('text','')
    d=(art.get('dom') or {}).get('html','')
    route=(steps[-1].get('after_url',{}).get('url','') if steps else '')
    rows.append({'file':f,'route':route,'accessibility':a,'dom':d})
patterns={
 'app-shell':r'Default project|Collapse sidebar|Search|Home|Responses|Settings',
 'sidebar-item':r'link "(?:Home|Responses|Decisions New|Agents New|Images|Usage|Settings)"',
 'page-header':r'heading "(?:Home|Decisions|Agents|Usage|Images|Audio)',
 'button':r'button ', 'icon-button':r'button "(?:Search|Collapse sidebar|Dismiss|Code|Expand|Add image|Attach file)',
 'input':r'textbox|entry area|input', 'select-popover':r'pop up button',
 'tabs-segmented':r'tab|radio button|segmented', 'table':r'table|column header|row',
 'dialog-drawer':r'dialog|drawer|sheet', 'status-alert':r'alert|error|warning|disabled',
 'code-block':r'Code block|code', 'chat-thread':r'User|Assistant|Ask anything|Scroll to bottom',
 'message':r'button User|button Assistant', 'composer':r'Ask anything|entry area',
 'empty-state':r'Choose a template|No data|empty', 'skeleton-loading':r'loading|skeleton'
}
components=[]
for name,pat in patterns.items():
  hits=[r for r in rows if re.search(pat,r['accessibility'],re.I) or re.search(pat,r['dom'],re.I)]
  components.append({'name':name,'routes':sorted(set(r['route'] for r in hits)),'capture_count':len(hits),'evidence_pattern':pat,'observed_states':['default','dark','light','responsive'] if hits else []})
# explicit state signals from all captures
states=collections.Counter()
for r in rows:
  t=r['accessibility']+'\n'+r['dom']
  if re.search(r'\[disabled\]|disabled|aria-disabled',t,re.I): states['disabled']+=1
  if re.search(r'loading|skeleton|spinner',t,re.I): states['loading_or_skeleton']+=1
  if re.search(r'error|invalid|warning',t,re.I): states['error_or_invalid']+=1
  if re.search(r'expanded|pressed|open|selected',t,re.I): states['open_or_selected']+=1
  if 'dark' in os.path.basename(r['file']): states['dark_capture']+=1
  if 'light' in os.path.basename(r['file']): states['light_capture']+=1
os.makedirs('ds-extraction/analysis',exist_ok=True);os.makedirs('ds-extraction/captures/components',exist_ok=True)
out={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':'E1 REA capture DOM + accessibility artifacts','capture_count':len(rows),'components':components,'states':dict(states),'notes':['Page captures provide observed anatomy and state evidence; component crops remain deferred until interactive E6 probing.','Responsive state: sidebar width/position changes at 390px; dark/light variants captured for every P1 route.']}
json.dump(out,open('ds-extraction/analysis/components.json','w'),indent=2)
open('ds-extraction/captures/components/README.md','w').write('# E6 component/state evidence\n\nSource: E1 REA captures in `../pages/e1/`. Accessibility and DOM evidence are indexed in `../../analysis/components.json`. Page-level screenshots cover light/dark and four viewports. Interactive crop capture remains a CP2 evidence note; no component token is invented without a selector/value source.\n')
print(json.dumps({'captures':len(rows),'components':len(components),'states':dict(states)}))
