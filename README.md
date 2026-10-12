# HIMR: The Adventures of Daniel — browser port

A playable browser port of the supplied version 1.6 Windows release. It runs the recovered GameMaker scripts on a small JavaScript/Canvas runtime, using the original graphics, fonts, sounds, and eight room layouts.

## Run locally

Node.js 18 or newer is sufficient. No dependencies need to be installed.

```sh
cd browser-port
npm start
```

Open http://localhost:4173. Alternatively, serve `dist/` with any static HTTP server. Opening `index.html` directly with a `file:` URL will not work because the game loads its data with `fetch`.

## Controls

| Action | Control |
| --- | --- |
| Move | A / D, or left / right arrows |
| Jump / double jump | Space or W |
| Aim, fire, interact | Mouse / left click |
| Open a nearby door | E |
| Switch weapon | F |
| Continue the original story screens | F |
| Slow motion | Hold right mouse button |
| Save / load original statistics | S / L |
| Pause / resume | Escape |

The player bar adds pause, mute, fullscreen, the original menu, and a full checkpoint save. Saves stay in this browser's local storage. Continue restores room, position, inventory, quests, objects, and layer visibility. The original menu and cutscenes remain available through Menu. Press F to continue a story screen.

On touch devices, the movement, jump, weapon, and fire buttons appear below the canvas; tap objects to interact. Keyboard and mouse provide the full original control scheme.

## Files

- `dist/index.html`, `style.css`, `app.js`: browser player and controls.
- `dist/engine.js`: GameMaker-compatible event, object, collision, animation, drawing, audio, and persistence services used by this game.
- `dist/code.js`: generated translation of the recovered GML into JavaScript functions. No runtime `eval` or Windows executable is required.
- `dist/data.json`: all eight original rooms, their instances and decorative layers, object/event definitions, sprites, font glyphs, and sound metadata.
- `dist/assets/`: seven original texture atlases and 33 audio assets, converted to Ogg where needed.
- `test/game.test.mjs`: gameplay regression checks.

The adjacent `../recovered/code/` directory contains the recovered GML. `../tools/transpile.py` regenerates `dist/code.js`. `../tools/package-data.py` regenerates `dist/data.json` from `../recovered/manifest.json`. Run these tools from the parent `Game` directory.

## Verification

```sh
npm run check
npm test
```

Ten checks cover all rooms and drawing scripts, movement and double jump, computer/email interactions, quest acceptance and doors, weapon damage, full checkpoint restoration, original menu/story/ending transitions, precise collision masks, grenades/slow motion/death/revival, and implementation coverage for every referenced GameMaker function.

Browser checks verified the rendered home scene, movement, computer interface, saving, and Continue. Audio is loaded on demand; rendering uses the fixed-size viewport rather than allocating room-sized canvases. Font and flash caches and sound pools are bounded. The original executable was inspected and extracted rather than executed.

This is a reconstruction of the game's runtime behavior, not an exported GameMaker project. Editor-only organization and the original authors' comments are not recoverable from the executable. Collision uses recovered bounding boxes, rotation, and the original precise masks for both sprites that require them. The standalone Windows runner was unavailable for frame-by-frame comparison.
