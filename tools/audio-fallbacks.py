"""Create streaming MP3 fallbacks sequentially from the packaged original sounds."""
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
sounds = json.loads((ROOT / 'dist/data.json').read_text())['sounds']
for sound in sounds:
    source = ROOT / 'dist/assets' / sound['path']
    target = ROOT / 'dist/assets' / sound['fallback']
    subprocess.run([
        'ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error',
        '-threads', '1', '-filter_threads', '1', '-i', str(source),
        '-c:a', 'libmp3lame', '-q:a', '4', '-threads', '1', '-y', str(target),
    ], check=True)
print(f'Created {len(sounds)} MP3 fallbacks; original Ogg and supplied menu clip are unchanged.')
