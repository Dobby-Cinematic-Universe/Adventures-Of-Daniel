using System;
using System.IO;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;
EnsureDataLoaded();
object Flat(object o) {
 if(o==null)return null;
 var result = new Dictionary<string,object>();
 foreach(var p in o.GetType().GetProperties(BindingFlags.Public|BindingFlags.Instance)) {
  if(p.GetIndexParameters().Length!=0 || !p.CanRead)continue;
  object v;try {v=p.GetValue(o);}catch{continue;}
  if(v==null){result[p.Name]=null;continue;}
  var t=v.GetType();
  if(t.IsPrimitive || t.IsEnum || v is string || v is decimal)result[p.Name]=v;
  else if(v is UndertaleString str)result[p.Name]=str.Content;
  else {var np=t.GetProperty("Name");if(np!=null && np.GetValue(v) is UndertaleString name)result[p.Name]=name.Content;}
 }
 return result;
}
object ListFlat(IEnumerable list) {var l=new List<object>();foreach(var o in list)l.Add(Flat(o));return l;}
var manifest=new Dictionary<string,object>();
manifest["general"]=Flat(Data.GeneralInfo);
manifest["roomOrder"]=Data.GeneralInfo.RoomOrder.Select(r=>r.Resource.Name.Content).ToArray();
manifest["sounds"]=ListFlat(Data.Sounds);
manifest["scripts"]=ListFlat(Data.Scripts);
manifest["sprites"]=Data.Sprites.Select(s=>new {info=Flat(s),textures=s.Textures.Select(t=>Flat(t.Texture))}).ToArray();
manifest["objects"]=Data.GameObjects.Select(o=>new {info=Flat(o),events=o.Events.Select((es,i)=>new {type=i,events=es.Select(e=>new{subtype=e.EventSubtype,code=e.Actions.Select(a=>a.CodeId==null?null:a.CodeId.Name.Content)})})}).ToArray();
manifest["fonts"]=Data.Fonts.Select(f=>new{info=Flat(f),texture=Flat(f.Texture),glyphs=ListFlat(f.Glyphs)}).ToArray();
manifest["rooms"]=Data.Rooms.Select(r=>new{info=Flat(r),views=ListFlat(r.Views),instances=ListFlat(r.GameObjects),layers=r.Layers.Select(l=>new{info=Flat(l),data=Flat(l.Data),dataType=l.Data.GetType().Name,instances=l.InstancesData==null?null:l.InstancesData.Instances.Select(i=>i.InstanceID).ToArray(),sprites=l.AssetsData==null?null:ListFlat(l.AssetsData.Sprites),tiles=l.AssetsData==null?null:ListFlat(l.AssetsData.LegacyTiles)})}).ToArray();
File.WriteAllText(Path.Combine(Path.GetDirectoryName(FilePath),"manifest.json"),JsonConvert.SerializeObject(manifest,Formatting.Indented));
Console.WriteLine("Metadata exported");
