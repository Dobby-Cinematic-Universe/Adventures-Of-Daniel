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
| Jump / double jump / revive after landing | Space, W, or up arrow |
| Aim / fire the equipped gun or grenade launcher / click an object | Mouse / left click |
| Open a nearby door / collect a customer's crate | E |
| Guide the companion while moving | Hold E nearby |
| Close a door / kiss the companion from her left | Q |
| Toggle acquired weapons | F |
| Continue the original story screens | F |
| Slow motion | Hold right mouse button |
| Restore hearts, up to eight | Shift |
| Clear money, ammo, grenades, tapes, stocks, and allowance flag | R |
| Save / load original statistics | S / L |
| Pause / resume | Escape |
| Original menu navigation / confirm | Up and down arrows / Enter |
| Advance an ending line | Any key |

Open **Controls** to assign keys, add alternatives, clear individual bindings, or restore defaults. Conflicting assignments are explained before they are applied. Preferences persist in this browser independently of game saves. Fire, slow motion, and the original menu can also have keyboard shortcuts; mouse aiming and clicking remain available. Single keys are supported; browser shortcuts and Tab remain available for navigation.

The hint below the game explains the current weapon, sleeping, customer service, companion interactions, and revival using your chosen keys. When defeated, wait for Daniel to land, then use your jump key or the **Revive** button. Walk close to the bed and click it to sleep; the fade finishes automatically. Guide the companion onto the bed to restore hearts. At the petrol station, accept a shift, enter, collect all three customers' crates with E, and click the exit door after completion. A completed shift adds $300 to existing money. Sleeping makes a new shift available.

The player bar adds pause, mute, fullscreen, the original menu, and a full checkpoint save. Saves stay in this browser's local storage. Continue restores room, position, inventory, quests, objects, and layer visibility. The original menu and cutscenes remain available through Menu. Press F to continue a story screen.

On touch devices, the movement, jump, weapon, and fire buttons appear below the canvas; tap objects to interact. Keyboard and mouse provide the full original control scheme.

## Files

- `dist/index.html`, `style.css`, `app.js`, `bindings.js`: browser player, contextual hints, and persistent control settings.
- `dist/engine.js`: GameMaker-compatible event, object, collision, animation, drawing, audio, and persistence services used by this game.
- `dist/code.js`: generated translation of the recovered GML into JavaScript functions. No runtime `eval` or Windows executable is required.
- `dist/data.json`: all eight original rooms, their instances and decorative layers, object/event definitions, sprites, font glyphs, and sound metadata.
- `dist/assets/`: seven original texture atlases and 33 audio assets, converted to Ogg where needed.
- `patches/*.gml`: browser corrections applied over the recovered scripts, preserving the original decompilation.
- `test/game.test.mjs`, `test/bindings.test.mjs`: gameplay and input regression checks.

The adjacent `../recovered/code/` directory contains the recovered GML. `../tools/transpile.py` regenerates `dist/code.js`, using matching files in `patches/` in preference to recovered events. `../tools/package-data.py` regenerates `dist/data.json` from `../recovered/manifest.json`. Run these tools from the parent `Game` directory.

## Verification

```sh
npm run check
npm test
```

Twenty-nine checks cover all rooms and drawing scripts, movement and double jump, computer/email interactions, quest acceptance and doors, weapon damage and switching, full checkpoint restoration, original menu/story/ending transitions, precise collision masks, grenades/slow motion/death/revival, repeated petrol shifts, payment and message bounds, sleep and mid-sleep saves, the companion's bed interaction, number formatting, and key rebinding, conflicts, persistence, and held-input release. Every referenced GameMaker function is implemented. Tests run sequentially with a 128 MB managed heap cap.

Browser checks verified the rendered home scene, movement, computer interface, saving, and Continue. Audio is loaded on demand; rendering uses the fixed-size viewport rather than allocating room-sized canvases. Font and flash caches and sound pools are bounded. The original executable was inspected and extracted rather than executed.

The corrections preserve weapon ownership when switching, entering or leaving work, and reviving; use one equipped weapon; restore the gun layer after computer use; keep stocks inside their screen; and round displayed numbers to at most two decimals without changing inventory precision. Station completion creates one message and pays once; older checkpoints with duplicated messages are compacted on load. Sleep fades use thresholds and remove temporary objects. Companion heart effects expire after fading.

This is a reconstruction of the game's runtime behavior, not an exported GameMaker project. Editor-only organization and the original authors' comments are not recoverable from the executable. Collision uses recovered bounding boxes, rotation, and the original precise masks for both sprites that require them. The standalone Windows runner was unavailable for frame-by-frame comparison.
