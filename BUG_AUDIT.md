# Browser runtime audit — 12 October 2026

The audit covers the recovered version 1.6 scripts, all eight rooms, the browser runtime, input, storage, and player menus. Original recovered GML is preserved; changes are recorded in `patches/` or the JavaScript runtime. All recovered entries parse, every referenced function is implemented, and generated output passes JavaScript syntax checks.

## Fixed behavior

| Area | Correction and verification |
| --- | --- |
| Menu | Returning to the menu creates usable options instead of restoring an off-screen completed selection. Browser Quit pauses and Resume leaves menu navigation usable. The misplaced stretched character background is disabled; recovered star, rain, grass, and runner scenery remains. |
| Weapons | Ownership and one controller persist; grenade clicks no longer switch weapons. Guns return after computer use, shifts, and revival. |
| Sleep and companion | Fades finish, control returns, effects expire, repeat sleeping works, and the recovered companion/bed health bonus fires. |
| Petrol shifts | Three customers per shift, $300 paid once, one completion message, selected weapon restored, and another shift available after sleep. |
| Transactions | Grenades cost the displayed $50; ammo costs $100; a $3,000 ticket is charged once. Successful purchases do not incorrectly report insufficient funds. |
| Doors and combat | E opens a breakable door once without removing unrelated doors. Enemy waves advance and release doors. |
| Physics and drawing | Corpse creation and velocities target the correct instance; direction and friction work; masks rotate and wrap frames; RGB tints render; stocks stay inside the computer. |
| Long sessions | Off-map projectiles expire, income indicators are reused, and a 1,500-frame firing trace stays below 100 simultaneous bullets. |
| Statistics | Malformed files and invalid inventories use safe defaults; number formatting preserves simulation precision. |
| Input | Rebinding preserves held-input ownership, avoids repeat edges, clears input across dialogs, and maps fullscreen letterboxing correctly. |

## World saves and cheats

Three named IndexedDB slots store all visited room instances and local state, global progress, camera, layers, alarms, simulation timing, random state, and cheat toggles. S/L statistics saves and Menu do not overwrite these slots. World loading does not write the original statistics file.

Worlds round-trip exactly in all eight rooms and resume a deterministic 90-frame simulation. Checks cover death, an open computer, sleep, a running petrol shift, destroyed enemies, collected pickups, and new adventures. Repository checks cover independent slots, import/export, failed writes preserving the previous slot, and rejection of invalid imports before changing a running world. Files are limited to 8 MB with bounded object counts and nesting.

Cheats supply invulnerability, unlimited ammunition, unlimited slow motion, resource gifts, healing/revival, and weapon unlocks. Toggles restore with a world and reset on a new adventure.

## Measurements and checks

`npm run check` passes. `npm test` passes **73 tests**: 20 gameplay, 10 input, 16 world-save, and 27 runtime-audit checks. Suites run sequentially with a 128 MB managed heap cap. The room audit executes 150 frames and drawing events in each room. Browser checks cover cheat controls, saving across reloads, Continue, export/import, statistics separation, menu navigation, and responsive layouts.

The same seeded Node benchmark, after 40 warm-up frames and over 180 measured frames per scene, gave:

| Scene | Before median / p95 | After median / p95 |
| --- | --- | --- |
| Home, 1,261 instances | 8.573 / 9.844 ms | 2.308 / 3.618 ms |
| First level, about 600 instances | 3.193 / 4.402 ms | 1.345 / 2.151 ms |

The final run used about 16 MB of managed heap with zero runtime errors. Object and collision indexes reduce static geometry scans; rendering avoids repeated work while paused. Timings cover simulation, not browser graphics or audio, and are local observations rather than device-wide FPS guarantees.

Compatibility decisions were checked against official GameMaker documentation for [event order](https://manual.gamemaker.io/monthly/en/The_Asset_Editors/Object_Properties/Event_Order.htm), [collision masks](https://manual.gamemaker.io/beta/en/GameMaker_Language/GML_Reference/Movement_And_Collisions/Collisions/Collisions.htm), and [friction](https://manual.gamemaker.io/lts/en/GameMaker_Language/GML_Reference/Asset_Management/Instances/Instance_Variables/friction.htm).

Exact frame-by-frame comparison with the Windows runner remains unavailable. These checks verify exercised behavior and recovered assets; they cannot prove every input sequence is free of bugs.

## Realistic-face easter egg follow-up

A realistic face moon drifts across the original menu occasionally. One click switches Daniel and all four menu runners to a transparent photographic head with a neck that reaches into the collar. While active, the moon remains on-screen for one-click deactivation; it leaves after deactivation and returns on a later pass. The preference survives new games and reloads without changing world snapshots or collision masks. Head anchors follow each idle, running, jumping, and death frame. Six additional checks cover moon hit testing and room guards, periodic flight and persistent deactivation, appearance persistence, unchanged simulation state, player/menu-only rendering, neck alignment, and smooth photographic sampling. Artwork loads once on demand; the optional white-flash mask is bounded to 210 × 280 pixels.

The supplied MP3 loops only on the active easter egg menu, using one lazy, reusable HTML audio element. Mute and pause preserve position; deactivation and room changes stop and rewind the clip. Blocked playback does not retry every frame, and obsolete playback rejections cannot block a newer resume request. Three additional tests cover these transitions and interruption handling. Browser verification confirmed the decoded 54.775-second clip plays, pauses on mute/pause, stops at time zero on deactivation and menu exit, and restarts on re-entry with no runtime errors.

## Final static scan — October 12, 2026

Reviewed the hand-written browser modules, the GML translator and generated conditions, save validation and storage, rendering/collision bounds, input ownership, room transitions, audio lifecycle, local server paths, and asset packaging. The scan found and fixed four classes of bug:

| Finding | Previous behavior | Correction and evidence |
| --- | --- | --- |
| GameMaker numeric booleans | JavaScript treated `noone` (`-4`) as true. Negated collision queries therefore prevented enemy guns from firing even with clear sight. | The translator now applies GameMaker numeric boolean conversion to conditions, logical operators, and negation, while preserving short-circuit evaluation. A regression exercises clear, obstructed, and cleared sight lines, plus the numeric threshold. |
| Incomplete or incorrectly typed world saves | A save could omit gravity direction, supply text as money/physics, or override validated health through room-local variables. Loading could yield non-finite velocity without recording a runtime error. | Required physics/rendering fields and known statistics are validated before mutation. Room-local names share the same allowlist used by capture. A regression verifies malformed saves leave the current world unchanged. |
| Synchronous IndexedDB failure | If an action threw after queuing the world write, the transaction could still commit that write without matching metadata. | Aborting the transaction on a synchronous exception preserves both records together. The regression simulates a metadata cloning failure after the first write. |
| Input or sound before startup completes | Enter/Space could start an Engine with no loaded room, and unmuting before Play could enable initial ambience. | Startup and keyboard routing require a loaded room; sound stays disabled until Play. Browser verification blocked the first atlas, pressed Enter, and observed no uncaught startup exception. The block was removed and a normal reload verified pre-play mute/unmute, movement, jumping, and menu entry. |

GameMaker's documented rule treats real numbers at or below 0.5 as false. See the official [data types](https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Overview/Data_Types.htm) and [instance keywords](https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Overview/Instance_Keywords.htm) references. Enemy gunfire is now enabled when the original scripts allow it, which can change combat difficulty from the previous broken behavior.

Firing eligibility now visits the existing indexes for the five interactive object types instead of sweeping every instance each frame. Contextual hints use indexed first-object lookups instead of allocating arrays just to read their first item. A regression checks that visible interactions still suppress firing, while hidden and removed targets release it.

One sequential seeded benchmark before and after this scan measured:

| Scene | Before median / p95 (ms) | After median / p95 (ms) |
| --- | --- | --- |
| Home, 1,261 instances | 2.240 / 3.443 | 2.157 / 2.647 |
| First level, 600 instances | 1.263 / 1.976 | 1.250 / 1.974 |

The after-run reported zero runtime errors and 14.32 MB of managed heap. These are individual local simulation measurements, not a general FPS or memory guarantee. The five added regressions bring the suite to 73 passing tests. An asset/reference scan resolved all event and room-creation references for the eight rooms, 169 objects, 685 compiled events, 33 original sounds, textures, fonts, and easter egg assets. No unverified rendering rewrites were introduced; further batching or draw-command caching should follow browser profiling. Exact Windows-runner parity and exhaustive testing of every possible input sequence remain outside the verified scope.
