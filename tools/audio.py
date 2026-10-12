from pathlib import Path
import subprocess
for p in sorted((Path(__file__).resolve().parents[1]/'dist/assets').glob('*.wav')):
 out=p.with_suffix('.ogg')
 r=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-i',str(p),'-c:a','libvorbis','-q:a','3','-y',str(out)],capture_output=True)
 if r.returncode:raise RuntimeError(r.stderr.decode())
 p.unlink()
print('Audio encoded to Ogg')
