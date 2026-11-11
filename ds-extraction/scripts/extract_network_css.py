#!/usr/bin/env python3
import base64, json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'raw'/'rea'/'home-network-capture.json'
out=ROOT/'raw'/'css'; out.mkdir(parents=True,exist_ok=True)
data=json.loads(source.read_text())
events=data['normalized_result']['events']['items']
urls={e['transaction_id']:e['url']['url'] for e in events if e.get('kind')=='response' and e.get('url') and e['url'].get('url')}
rows=[]
for e in events:
    if e.get('kind')!='network-content' or e.get('body',{}).get('state')!='captured': continue
    url=urls.get(e.get('transaction_id'),'')
    if not url.endswith('.css'): continue
    body=e['body']; raw=base64.b64decode(body['content'])
    name=url.split('/')[-1].split('?')[0]
    path=out/name; path.write_bytes(raw)
    rows.append({'url':url,'file':str(path.relative_to(ROOT)),'bytes':len(raw),'sha256':__import__('hashlib').sha256(raw).hexdigest(),'source':'network-response-body'})
(ROOT/'raw'/'css-network-index.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'css_bodies':len(rows),'bytes':sum(r['bytes'] for r in rows)},indent=2))
