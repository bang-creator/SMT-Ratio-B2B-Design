#!/usr/bin/env python3
import collections,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; CSS=ROOT/'raw'/'css'
colors=collections.Counter(); font_sizes=collections.Counter(); spacing=collections.Counter(); radii=collections.Counter(); shadows=collections.Counter(); specificity=collections.Counter()
for path in CSS.glob('*.css'):
 t=re.sub(r'/\*.*?\*/','',path.read_text(errors='replace'),flags=re.S)
 for c in re.findall(r'(?<![\w-])(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\))',t): colors[c]+=1
 for v in re.findall(r'font-size\s*:\s*([^;}{]+)',t): font_sizes[' '.join(v.split())]+=1
 for prop in ('margin','padding','gap','inset','top','right','bottom','left','width','height'):
  for v in re.findall(rf'{prop}\s*:\s*([^;\{{\}}]+)',t):
   for token in re.findall(r'(?<![\w#])(?:-?\d*\.?\d+)(?:px|rem|em|vh|vw|%)',v): spacing[token]+=1
 for v in re.findall(r'border-radius\s*:\s*([^;}{]+)',t): radii[' '.join(v.split())]+=1
 for v in re.findall(r'(?:box-shadow|text-shadow|drop-shadow)\s*:\s*([^;}{]+)',t): shadows[' '.join(v.split())]+=1
 for sel,body in re.findall(r'([^{}]+)\{([^{}]*)\}',t,re.S):
  sel=' '.join(sel.split())
  for part in sel.split(','):
   ids=len(re.findall(r'#[\w-]+',part)); attrs=len(re.findall(r'\[[^]]+\]|\.[\w-]+|:[^:\s][\w-]*',part)); els=len(re.findall(r'(?<![-\w])(?:[a-zA-Z][\w-]*|\*)',part))
   specificity[f'{ids},{attrs},{els}']+=1
out={'colors':colors.most_common(),'font_sizes':font_sizes.most_common(),'spacing':spacing.most_common(),'radii':radii.most_common(),'shadows':shadows.most_common(),'specificity':specificity.most_common(),'files':len(list(CSS.glob('*.css')))}
(ROOT/'analysis'/'css-stats.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({k:len(v) if isinstance(v,list) else v for k,v in out.items()},indent=2))
