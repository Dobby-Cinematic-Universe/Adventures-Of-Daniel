import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'recovered/manifest.json').read_text())
keep={
 'general':['DisplayName','DefaultWindowWidth','DefaultWindowHeight','GMS2FPS'],
 'sprite':['Name','Width','Height','MarginLeft','MarginRight','MarginTop','MarginBottom','OriginX','OriginY','GMS2PlaybackSpeed','GMS2PlaybackSpeedType','SepMasks'],
 'object':['Name','Sprite','Visible','Persistent','ParentId','TextureMaskId','Depth'],
 'room':['Name','Width','Height','BackgroundColor','CreationCodeId'],
 'instance':['X','Y','ObjectDefinition','InstanceID','CreationCode','PreCreateCode','ScaleX','ScaleY','Color','Rotation','ImageSpeed','ImageIndex'],
 'layer':['LayerName','LayerId','LayerType','LayerDepth','XOffset','YOffset','HSpeed','VSpeed','IsVisible'],
 'asset':['Sprite','X','Y','ScaleX','ScaleY','Color','AnimationSpeed','AnimationSpeedType','FrameIndex','Rotation'],
}
def clean(o,k):return {a:o[a] for a in keep[k] if a in o}
m['general']=clean(m['general'],'general')
mask_path=ROOT/'recovered/masks.json'
mask_data={s['name']:s['masks'] for s in json.loads(mask_path.read_text())} if mask_path.exists() else {}
for s in m['sprites']:
 s['info']=clean(s['info'],'sprite')
 if s['info']['Name'] in mask_data:s['masks']=mask_data[s['info']['Name']]
for o in m['objects']:o['info']=clean(o['info'],'object');o['events']=[e for e in o['events'] if e['events']]
for r in m['rooms']:
 r['info']=clean(r['info'],'room');r['instances']=[clean(i,'instance') for i in r['instances']]
 for l in r['layers']:
  l['info']=clean(l['info'],'layer');l['sprites']=[clean(s,'asset') for s in l['sprites'] or []]
  l.pop('tiles',None)
  l['data']={k:v for k,v in l['data'].items() if v is not None}
room_patch_path=ROOT/'patches/rooms.json'
if room_patch_path.exists():
 for room_name,layer_patches in json.loads(room_patch_path.read_text()).items():
  room=next(r for r in m['rooms'] if r['info']['Name']==room_name)
  for layer_name,changes in layer_patches.items():
   layer=next(l for l in room['layers'] if l['info']['LayerName']==layer_name)
   for group,values in changes.items():layer[group].update(values)
for s in m['sounds']:s['path']=s['Name']+'.ogg';s['fallback']=s['Name']+'.mp3';skeys=['Name','Volume','path','fallback'];ks=list(s);[s.pop(k) for k in ks if k not in skeys]
(ROOT/'dist/data.json').write_text(json.dumps(m,separators=(',',':')))
print('Game data',(ROOT/'dist/data.json').stat().st_size,'bytes')
