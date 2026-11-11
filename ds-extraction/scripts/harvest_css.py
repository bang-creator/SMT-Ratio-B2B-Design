#!/usr/bin/env python3
import json, re, glob, urllib.request, urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'raw'/'css'; OUT.mkdir(parents=True, exist_ok=True)
urls=set()
for path in [ROOT/'raw'/'rea'/'home-inspect.json', *map(Path,glob.glob(str(ROOT/'captures'/'pages'/'e1'/'*.json')))]:
    try: data=json.loads(path.read_text())
    except Exception: continue
    def walk(v):
        if isinstance(v,dict):
            if v.get('type')=='Stylesheet' and v.get('url'): urls.add(v['url'])
            for x in v.values(): walk(x)
        elif isinstance(v,list):
            for x in v: walk(x)
    walk(data)
    text=json.dumps(data)
    urls.update(re.findall(r'https://platform\\.openai\\.com[^" ]+?\\.css', text))
    urls.update('https://platform.openai.com'+x for x in re.findall(r'(?<![A-Za-z0-9])(/static/[^" ]+?\\.css)', text))
manifest=[]
for url in sorted(urls):
    name=url.rsplit('/',1)[-1]
    dst=OUT/name
    row={'url':url,'file':str(dst.relative_to(ROOT))}
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 DS extraction'})
        with urllib.request.urlopen(req,timeout=30) as resp:
            body=resp.read()
            dst.write_bytes(body)
            row.update(status=resp.status,bytes=len(body),content_type=resp.headers.get('content-type'))
    except Exception as exc:
        row.update(status='error',error=str(exc))
    manifest.append(row)
(ROOT/'raw'/'css-index.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'urls':len(urls),'downloaded':sum(1 for x in manifest if x.get('status')==200),'errors':sum(1 for x in manifest if x.get('status')=='error')},indent=2))
