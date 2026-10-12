using System;
using System.IO;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;
using UndertaleModLib.Util;

EnsureDataLoaded();
string root = Path.GetDirectoryName(FilePath);
string codeDir = Path.Combine(root, "code");
string assetDir = Path.Combine(root, "../dist/assets");
Directory.CreateDirectory(codeDir);
Directory.CreateDirectory(assetDir);
var context = new GlobalDecompileContext(Data);
int failed=0, count=0;
foreach (var code in Data.Code.Where(c=>c.ParentEntry==null)) {
 try { File.WriteAllText(Path.Combine(codeDir,code.Name.Content+".gml"),new Underanalyzer.Decompiler.DecompileContext(context,code,Data.ToolInfo.DecompilerSettings).DecompileToString()); }
 catch(Exception e) { File.WriteAllText(Path.Combine(codeDir,code.Name.Content+".error"),e.Message); failed++; }
 count++;
 if(count%50==0) {Console.WriteLine("Recovered "+count+" code entries"); GC.Collect();}
}
Console.WriteLine("Code entries: "+count+", failed: "+failed);
for (int i=0; i<Data.EmbeddedTextures.Count; i++) {
 using(var fs=File.Create(Path.Combine(assetDir,"texture"+i+".png"))) Data.EmbeddedTextures[i].TextureData.Image.SavePng(fs);
}
foreach(var sound in Data.Sounds) {
 if(sound.AudioFile!=null) File.WriteAllBytes(Path.Combine(assetDir,sound.Name.Content+(sound.AudioFile.Data[0]==79?".ogg":".wav")),sound.AudioFile.Data);
}
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
  else {
   var np=t.GetProperty("Name");
   if(np!=null && np.GetValue(v) is UndertaleString name)result[p.Name]=name.Content;
  }
 }
 return result;
}
object ListFlat(IEnumerable list) {var l=new List<object>();foreach(var o in list)l.Add(Flat(o));return l;}
var manifest=new Dictionary<string,object>();
manifest["general"]=Flat(Data.GeneralInfo);
manifest["sounds"]=ListFlat(Data.Sounds);
manifest["scripts"]=ListFlat(Data.Scripts);
manifest["sprites"]=Data.Sprites.Select(s=>new {info=Flat(s),textures=s.Textures.Select(t=>Flat(t.Texture))}).ToArray();
manifest["objects"]=Data.GameObjects.Select(o=>new {info=Flat(o),events=o.Events.Select((es,i)=>new {type=i,events=es.Select(e=>new{subtype=e.EventSubtype,code=e.Actions.Select(a=>a.CodeId==null?null:a.CodeId.Name.Content)})})}).ToArray();
manifest["fonts"]=Data.Fonts.Select(f=>new{info=Flat(f),texture=Flat(f.Texture),glyphs=ListFlat(f.Glyphs)}).ToArray();
manifest["rooms"]=Data.Rooms.Select(r=>new{info=Flat(r),views=ListFlat(r.Views),instances=ListFlat(r.GameObjects),layers=r.Layers.Select(l=>new{info=Flat(l),data=Flat(l.Data),dataType=l.Data.GetType().Name})}).ToArray();
File.WriteAllText(Path.Combine(root,"manifest.json"),JsonConvert.SerializeObject(manifest,Formatting.Indented));
Console.WriteLine("Assets and metadata exported");
