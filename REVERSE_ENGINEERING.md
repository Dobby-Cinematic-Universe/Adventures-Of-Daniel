# Recovery record

The supplied `version1.6.exe` is a Nullsoft self-extracting installer containing `HIMRgame.exe` and `data.win`. The game identifies itself as **HIMR The Adventures of Daniel**, built with GameMaker 2.3.6, bytecode version 17, at 60 FPS with a 1366 × 768 game viewport.

The installer and game executable were not executed. 7-Zip extracted the installer. UndertaleModTool CLI 0.9.2.0 parsed `data.win`; a sequential exporter decompiled the scripts and exported their resources. The .NET recovery process used a 512 MB managed heap limit. Binary pointer reads were validated before allocating tables.

Recovered resources:

| Resource | Count |
| --- | ---: |
| Top-level code entries, successfully decompiled | 696 |
| Total code entries, including nested functions | 707 |
| Sprites | 184 |
| Texture atlases | 7 |
| Texture page items | 368 |
| Embedded sounds | 33 |
| Fonts | 4 |
| Game objects | 169 |
| Rooms | 8 |

Original room order: `room26`, `rMenu`, `introroom2`, `introroom`, `room1`, `room3`, `rEnding`, `petrolstationroom`. The release starts in `room26`, Daniel's home. The browser port preserves that starting room and retains the original menu.

## Reproducible outputs

- `recovered/code/*.gml`: all successfully recovered top-level scripts and object/room events.
- `recovered/manifest.json`: detailed exported resources and room layouts.
- `tools/recover.csx`: sequential decompilation and asset exporter.
- `tools/metadata.csx`: metadata exporter, including decorative sprites, layers, instances, and room order.
- `tools/transpile.py`: parser and translator for the GML subset used by this game; it fails on unsupported syntax rather than silently dropping scripts.
- `tools/package-data.py`: browser data packaging.
- `tools/masks.csx`: exports the two precise collision masks.
- `tools/audio.py`: sequential WAV-to-Ogg conversion.
- `dist/`: complete dependency-free browser application.

The original installer, Windows executable, `data.win`, and decompiler binaries are not included in this repository. The exported GML, manifest, masks, and browser assets are included. Regenerating `dist/code.js` and `dist/data.json` needs only Python 3; see the README.

To repeat the original extraction with your own game data and external tooling, the C# export scripts run with the official UndertaleModTool CLI's `load recovered/data.win -s tools/recover.csx` / `tools/metadata.csx` commands. The decompiler itself is an external recovery dependency, not part of the browser runtime.

## Runtime behavior and adaptations

The port implements every GameMaker function called by the recovered scripts. It preserves object inheritance, creation and destruction events, alarms, Begin/Normal/End Step ordering, keyboard and mouse events, collisions, animation-end events, world and GUI drawing, sprite origins, room layers, parallax, and the original INI/text save calls.

Browser additions include audio unlock, pause, mute, fullscreen, touch controls, three independent full-world save slots with import/export, a cheat menu, persistent key rebinding, and contextual guidance. GameMaker-style `min`/`max` avoid NaN propagation in the original camera's zero-length shake calculation. A pending room change suppresses later step events, preventing the original menu from queuing another transition during the same frame. The recovered misspelled `instnce_destroy` call is treated as `instance_destroy`. The original death script attempted to create a new restart-prompt instance every frame; the runtime retains one such prompt to avoid unbounded memory growth.

The original recovered GML remains unchanged. Browser corrections live in `patches/`; the transpiler gives these files precedence over matching recovered events. Corrections make F toggle acquired weapons once and left click fire the selected weapon, retain ownership across controller changes, restore case-variant gun-layer names, respect GUI layer visibility, place the stock balance inside its screen, and format display numbers with at most two decimals while retaining internal precision.

The petrol-station manager originally created a completion message every frame after the last customer left. The port keeps one message, adds the $300 payment once rather than replacing existing money, preserves completion on exit, restores one selected weapon, and reconstructs the original customer queue when another shift is accepted. Old checkpoints with repeated completion messages are compacted. Sleep fades originally relied on exact floating-point equality at 0.5, 0.3, and zero; threshold checks now return control and remove the fades and sleep text. Guiding the companion onto the bed retains the recovered health bonus, with temporary heart effects removed after fading. Revival waits for landing, restores the camera directly, and equips only one owned weapon. Firing eligibility is recomputed as the mouse leaves interactive objects.

Memory is bounded through sequential extraction, a 128 MB heap cap for gameplay tests, viewport-only rendering, a 24-item tint cache, three audio voices per sound, and lazy audio loading. The tested browser home scene used approximately 35 MB of JavaScript heap; decoded textures, browser processes, and audio memory are additional.

## Verification and limits

Seventy-three checks passed: 20 gameplay, 10 input, 16 world-save, and 27 runtime-audit tests. Coverage includes all eight rooms and their drawing events, movement, computers, quests, weapons, grenade use, revival, repeated shifts and sleep, companion/bed behavior, menus and transitions, arena waves, shop prices, doors, physics, long sessions, key rebinding, exact world restoration, deterministic continuation, failed writes, invalid imports, and easter egg music transitions. The final static scan adds numeric boolean conversion, enemy clear-sight firing, saved physics/statistics validation, synchronous storage rollback, and indexed firing guards. Browser checks cover world save/reload/Continue, export/import, cheat controls, independence from the original statistics file, menu music transitions, startup input after an asset failure, and sound remaining disabled before Play.

The world save captures visited-room instances and local state, globals, camera, layers, alarms, random state, timing, and cheat toggles in three atomic IndexedDB slots. Original S/L saves retain their original statistics-only scope. Menu re-entry starts a usable menu instead of restoring an off-screen completed selection. The menu also disables a misplaced character sprite stretched across the background, retaining its recovered star, rain, grass, and runner scenery. Room-layer corrections live in `patches/rooms.json`. Additional corrections cover shop charges, repeat ticket purchases, breakable doors, corpse motion, friction, rotated masks, tinting, malformed statistics, and bounded projectiles and income indicators.

A seeded simulation benchmark reduced median Home step time from 8.573 to 2.308 ms and first-level time from 3.193 to 1.345 ms, using about 16 MB of managed heap in the final run. Browser rendering and audio are outside these timings. See [BUG_AUDIT.md](BUG_AUDIT.md) for verification scope and measurements.

The browser runtime uses the original collision bounding boxes with rotation, and includes the recovered per-pixel masks for the car and fatguy106 sprites. Shader flashes are reproduced with Canvas compositing. Audio files retain the original content with browser-compatible encoding. Exact frame-by-frame parity with the Windows runner remains unverified because that runner was not available in the Linux environment. Recovered GML preserves the compiled behavior but cannot restore original comments, project editor metadata, or all original source-level naming.

## Input checksums

Installer SHA-256: `e6b2293b0a129d53bffb70670aabe3f93e1de8a442c78103e0a5e11470e4bb4f`

Game data SHA-256: `9e509b74fa0f5195e662f3de34fe137be41d9a7b33043afd9977b15686dfde23`

Recovery tooling: [UndertaleModTool official repository](https://github.com/UnderminersTeam/UndertaleModTool).

## Realistic-face easter egg

A realistic face moon occasionally crosses the original menu. Clicking it toggles the photographic head on Daniel and the four miniature runners. The moon stays available while active for one-click deactivation, then departs and returns on a later pass. The head includes a neck connected to the collar and anchors for idle, running, jumping, and death frames. Smooth sampling preserves the photographic look. The preference persists separately from world saves. Six appearance checks and three menu music checks cover this feature. Assets were made with the built-in image generator; prompts are in `art/secret-face-prompt.md` and `art/moon-and-neck-prompts.md`.

The supplied `ScreenRecording_09-04-2026 09-14-41_1.mp3` is included as `dist/assets/easter-egg-menu.mp3` without re-encoding. It loops only while the face easter egg is active on the menu. A single reusable HTML audio element loads on demand, follows mute and pause, and stops and rewinds on deactivation or menu exit. Audio remains outside world snapshots.

The final static scan is documented in `BUG_AUDIT.md`. The translator applies GameMaker numeric boolean semantics instead of JavaScript truthiness; this restores enemy gunfire through a clear line of sight. The scan also hardened world validation and transaction rollback, guarded startup input, and replaced complete-scene firing checks and first-item array allocations with existing indexes. Tests and benchmarks continue to run sequentially within a 128 MB managed heap cap.
