using System;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
EnsureDataLoaded();
var masks=Data.Sprites.Where(s=>(uint)s.SepMasks==1).Select(s=>new{name=s.Name.Content,width=s.Width,height=s.Height,masks=s.CollisionMasks.Select(m=>Convert.ToBase64String(m.Data))});
File.WriteAllText(Path.Combine(Path.GetDirectoryName(FilePath),"masks.json"),JsonConvert.SerializeObject(masks));
Console.WriteLine("Precise collision masks recovered");
