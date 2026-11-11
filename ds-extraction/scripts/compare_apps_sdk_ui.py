#!/usr/bin/env python3
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
platform=json.loads((ROOT/'raw'/'css-index.json').read_text())
platform_vars={x['name']:x['value'] for x in platform['custom_properties']}
base=ROOT/'raw'/'apps-sdk-ui'/'package'/'dist'/'es'/'styles'
sdk={}
for p in base.glob('variables-*.css'):
    layer=p.stem.replace('variables-','')
    text=p.read_text(errors='replace')
    for name,val in re.findall(r'(--[\w-]+)\s*:\s*([^;}{]+)',text): sdk[name]={'value':' '.join(val.split()),'layer':layer,'file':str(p.relative_to(ROOT))}
intersect=set(platform_vars)&set(sdk)
same={n for n in intersect if platform_vars[n]==sdk[n]['value']}
components=[]
for p in (ROOT/'raw'/'apps-sdk-ui'/'package'/'dist'/'types'/'components').rglob('*.d.ts'):
    components.append(p.stem)
out={'package':'@openai/apps-sdk-ui','version':'0.2.2','platform_variable_count':len(platform_vars),'sdk_variable_count':len(sdk),'same_name_count':len(intersect),'same_name_percent':round(100*len(intersect)/len(platform_vars),2) if platform_vars else 0,'same_name_value_count':len(same),'same_name_value_percent':round(100*len(same)/len(platform_vars),2) if platform_vars else 0,'platform_only':sorted(set(platform_vars)-set(sdk)),'sdk_only':sorted(set(sdk)-set(platform_vars)),'sdk_components':sorted(set(components)),'sdk_component_count':len(set(components))}
(ROOT/'analysis'/'overlap.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({k:out[k] for k in ['platform_variable_count','sdk_variable_count','same_name_count','same_name_value_count','sdk_component_count']},indent=2))
