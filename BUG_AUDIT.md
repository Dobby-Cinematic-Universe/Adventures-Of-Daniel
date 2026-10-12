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

`npm run check` passes. `npm test` passes **59 tests**: 20 gameplay, 10 input, 14 world-save, and 15 runtime-audit checks. Suites run sequentially with a 128 MB managed heap cap. The room audit executes 150 frames and drawing events in each room. Browser checks cover cheat controls, saving across reloads, Continue, export/import, statistics separation, menu navigation, and responsive layouts.

The same seeded Node benchmark, after 40 warm-up frames and over 180 measured frames per scene, gave:

| Scene | Before median / p95 | After median / p95 |
| --- | --- | --- |
| Home, 1,261 instances | 8.573 / 9.844 ms | 2.308 / 3.618 ms |
| First level, about 600 instances | 3.193 / 4.402 ms | 1.345 / 2.151 ms |

The final run used about 16 MB of managed heap with zero runtime errors. Object and collision indexes reduce static geometry scans; rendering avoids repeated work while paused. Timings cover simulation, not browser graphics or audio, and are local observations rather than device-wide FPS guarantees.

Compatibility decisions were checked against official GameMaker documentation for [event order](https://manual.gamemaker.io/monthly/en/The_Asset_Editors/Object_Properties/Event_Order.htm), [collision masks](https://manual.gamemaker.io/beta/en/GameMaker_Language/GML_Reference/Movement_And_Collisions/Collisions/Collisions.htm), and [friction](https://manual.gamemaker.io/lts/en/GameMaker_Language/GML_Reference/Asset_Management/Instances/Instance_Variables/friction.htm).

Exact frame-by-frame comparison with the Windows runner remains unavailable. These checks verify exercised behavior and recovered assets; they cannot prove every input sequence is free of bugs.
