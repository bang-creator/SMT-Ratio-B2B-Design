import json,collections,datetime,os,re
css=json.load(open('ds-extraction/raw/css-index.json')); run=json.load(open('ds-extraction/raw/motion/runtime.json'))
keys=css.get('keyframes',[]); decl=css.get('declarations',[])
trans=[d for d in decl if d.get('property') in ('transition','transition-duration','transition-property','animation','animation-duration','animation-timing-function')]
obs=[]
for x in run.get('items',[]):
 for a in x.get('anims',[]): obs.append(a)
dur=collections.Counter(str(a.get('duration')) for a in obs if a.get('duration') is not None)
eas=collections.Counter(str(a.get('easing')) for a in obs if a.get('easing'))
summary={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sources':{'css_keyframes':len(keys),'css_motion_declarations':len(trans),'runtime_animation_observations':len(obs)},'runtime_duration_ms':{k:v for k,v in dur.most_common()},'runtime_easing':{k:v for k,v in eas.most_common()},'keyframes':keys,'patterns':trans,'reduced_motion':'Not separately replayed; E1 captures were no-preference. Add reduce replay before CP3 if motion fidelity is required.','observed_patterns':[{'trigger':'page hydration/content reveal','durations_ms':[150,800,1200],'easing':['ease','linear']},{'trigger':'button interaction','duration_ms':150,'easing':'ease','properties':['opacity','color']},{'trigger':'layout/transform reveal','duration_ms':300,'easing':'var(--cubic-move)','delay_ms':[0,100]}]}
os.makedirs('ds-extraction/analysis',exist_ok=True);json.dump(summary,open('ds-extraction/analysis/motion.json','w'),indent=2)
print(json.dumps({'keyframes':len(keys),'decl':len(trans),'runtime':len(obs),'durations':dur}))
