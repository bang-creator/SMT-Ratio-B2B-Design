#!/usr/bin/env python3
import hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CSS=ROOT/'raw'/'css'
custom=[]; medias=[]; fonts=[]; keyframes=[]; declarations=[]; file_stats=[]
for path in sorted(CSS.glob('*.css')):
    text=path.read_text(errors='replace')
    clean=re.sub(r'/\*.*?\*/','',text,flags=re.S)
    file_stats.append({'file':str(path.relative_to(ROOT)),'bytes':len(text.encode()),'sha256':hashlib.sha256(text.encode()).hexdigest()})
    for m in re.finditer(r'@media\s*([^\{]+)\{',clean,re.I): medias.append({'file':str(path.relative_to(ROOT)),'query':m.group(1).strip()})
    for m in re.finditer(r'@font-face\s*\{([^}]*)\}',clean,re.I|re.S):
        props=dict((k.strip(),v.strip()) for k,v in re.findall(r'([\w-]+)\s*:\s*([^;]+)',m.group(1)))
        fonts.append({'file':str(path.relative_to(ROOT)),'family':props.get('font-family'),'weight':props.get('font-weight'),'style':props.get('font-style'),'src':props.get('src')})
    for m in re.finditer(r'@(?:-\w+-)?keyframes\s+([^\s\{]+)',clean,re.I): keyframes.append({'file':str(path.relative_to(ROOT)),'name':m.group(1)})
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}',clean,re.S):
        selector=' '.join(m.group(1).split())
        body=m.group(2)
        for name,val in re.findall(r'(--[\w-]+)\s*:\s*([^;}{]+)',body): custom.append({'file':str(path.relative_to(ROOT)),'scope':selector,'name':name,'value':' '.join(val.split())})
        for prop,val in re.findall(r'([\w-]+)\s*:\s*([^;}{]+)',body):
            prop=prop.lower(); val=' '.join(val.split())
            if prop in {'transition','transition-property','transition-duration','transition-timing-function','animation','animation-name','animation-duration','z-index','box-shadow','border-radius'}:
                declarations.append({'file':str(path.relative_to(ROOT)),'scope':selector,'property':prop,'value':val})
result={'files':file_stats,'custom_properties':custom,'media_queries':medias,'font_faces':fonts,'keyframes':keyframes,'declarations':declarations,'summary':{'files':len(file_stats),'custom_properties':len(custom),'media_queries':len(medias),'font_faces':len(fonts),'keyframes':len(keyframes),'declarations':len(declarations)}}
(ROOT/'raw'/'css-index.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(result['summary'],indent=2))
