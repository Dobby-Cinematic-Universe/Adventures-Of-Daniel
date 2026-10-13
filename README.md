# HIMR: The Adventures of Daniel — browser port

A playable browser port of the supplied version 1.6 Windows release. It runs the recovered GameMaker scripts on a small JavaScript/Canvas runtime, using the original graphics, fonts, sounds, and eight room layouts.

## Run locally

Use Node.js 22 or newer (Node.js 24 LTS is used in CI). No npm dependencies need to be installed.

```sh
git clone https://github.com/Dobby-Cinematic-Universe/Adventures-Of-Daniel.git
cd Adventures-Of-Daniel
npm start
```

Open http://localhost:4173. Alternatively, serve `dist/` with any static HTTP server. Opening `index.html` directly with a `file:` URL will not work because the game loads its data with `fetch`.

## GitHub Pages

The default deployment URL is [dobby-cinematic-universe.github.io/Adventures-Of-Daniel/](https://dobby-cinematic-universe.github.io/Adventures-Of-Daniel/) once the first Pages deployment succeeds.

For the initial setup, open [Settings → Pages](https://github.com/Dobby-Cinematic-Universe/Adventures-Of-Daniel/settings/pages) and choose **GitHub Actions** as the build and deployment source. Push `main`, or run **Check and deploy GitHub Pages** from the Actions tab. The workflow rebuilds and compares generated files, checks syntax, runs the regression suites sequentially, verifies all deployment assets under the repository URL path, and deploys only `dist/`. Pull requests run the same checks without deploying. The official GitHub actions are pinned to commit hashes, and only the deployment job receives permission to publish Pages.

No custom domain, server, npm install, or repository secret is required. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for Pages configuration.

The intended custom address is **https://himrgame.hidinginmyroom.com/**. Configure it in the repository's **Settings → Pages → Custom domain** field before adding the DNS record. In Cloudflare's DNS settings for `hidinginmyroom.com`, use:

| Type | Name | Target | TTL | Proxy status |
| --- | --- | --- | --- | --- |
| CNAME | `himrgame` | `dobby-cinematic-universe.github.io` | Auto | DNS only (gray cloud) |

The CNAME target is the organization's GitHub Pages hostname, without a scheme or repository path. DNS-only mode sends requests directly to GitHub during setup. When GitHub's domain check and certificate provisioning complete, enable **Enforce HTTPS**. The Actions deployment uses the domain configured in repository settings; no repository `CNAME` file is required. See [GitHub's subdomain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain) and [Cloudflare's proxy settings](https://developers.cloudflare.com/dns/proxy-status/).

To preview the repository path locally:

```sh
BASE_PATH=/Adventures-Of-Daniel/ npm start
```

Open http://localhost:4173/Adventures-Of-Daniel/. Asset URLs are relative, so the same `dist/` works at a domain root or repository path.

World saves and control preferences belong to the browser origin. Before moving from the previous hosted site or localhost to GitHub Pages, export world slots from **World saves**, then import them on the new site. Preferences can be set again in **Controls**. The game does not upload saves to a server.

## Controls

| Action | Control |
| --- | --- |
| Move | A / D, or left / right arrows |
| Jump / double jump / revive after landing | Space, W, or up arrow |
| Aim / fire the acquired gun / click an object | Mouse / left click |
| Open a nearby door / collect a customer's crate | E |
| Guide the companion while moving | Hold E nearby |
| Close a door / kiss the companion from her left | Q |
| Select and fire a grenade; hold to keep firing | F |
| Continue the original story screens | F |
| Slow motion | Hold right mouse button |
| Restore hearts, up to eight | Shift |
| Clear money, ammo, grenades, tapes, stocks, and allowance flag | R |
| Save / load original statistics | S / L |
| Pause / resume | Escape |
| Original menu navigation / confirm | Up and down arrows / Enter |
| Advance an ending line | Any key |

Open **Controls** to assign keys, add alternatives, clear individual bindings, or restore defaults. Conflicting assignments are explained before they are applied. Preferences persist in this browser independently of game saves. Fire, slow motion, and the original menu can also have keyboard shortcuts; mouse aiming and clicking remain available. Single keys are supported; browser shortcuts and Tab remain available for navigation.

The hint below the game prioritizes nearby doors and other usable objects, then explains the current weapon, sleeping, customer service, companion interactions, and revival using your chosen keys. Door hints change between opening and closing as the door changes state, and respect the actual interaction range. When defeated, wait for Daniel to land, then use your jump key or the **Revive** button. Walk close to the bed and click it to sleep; the fade finishes automatically. Guide the companion onto the bed to restore hearts. At the petrol station, accept a shift, enter, collect all three customers' crates with E, and click the exit door after completion. A completed shift adds $300 to existing money. Sleeping makes a new shift available.

The buy-stocks button is visible and interactive only inside the stocks screen. Its original price-update alarms continue after the computer closes.

Open **World saves** for three named slots that preserve the entire adventure: visited rooms, surviving and defeated enemies, collected items, doors, quests, inventory, active effects, camera, layers, timing, and random state. Slots persist in IndexedDB independently of the original **S / L** statistics file. Save explicitly; opening the original menu and saving statistics do not overwrite a world slot. **Continue saved world** resumes the latest slot after a reload. Each slot can be exported or imported as a JSON file, and **Export current world** also works if browser storage is unavailable. Previous browser checkpoints migrate into slot 1 when all slots are empty.

Open **Cheats** for invulnerability, unlimited ammunition, unlimited slow motion, healing/revival, money, ammunition, grenades, a slow-motion refill, and both weapons. Cheat toggles are included in world saves; starting a new adventure resets them. World-save and cheat menus can have keyboard shortcuts assigned in Controls. The original menu and cutscenes remain available through Menu. Continue resumes the current adventure in the room you left, retaining money, inventory, quests, position, and changed room objects. A fresh session can still continue from the original statistics file. Press F to continue a story screen.

**New Game** starts Home with $0, 110 bullets, no grenades, eight hearts, and full slow motion. It resets inventory, quests, weapon ownership, visited rooms, and cheats. Existing statistics and world saves remain available for an explicit load; room entry does not automatically apply old statistics to the new adventure.

A realistic face moon occasionally drifts across the original **Menu**. Click or tap it once to give Daniel, all four menu runners, the companion's spawned miniature characters, and Daniel in the ending scene the photographic face. The moon stays on-screen while this mode is active; click or tap it again to restore the original faces. The selection persists across new adventures and reloads, separately from world saves. Head and neck anchors follow each idle, running, jumping, and death frame at the character's original size and facing, and the photographic artwork uses smooth sampling.

While the face easter egg is active on the original menu, the supplied 55-second MP3 loops as menu music. **Mute** and **Pause** suspend it without losing the playback position. Deactivating the easter egg or leaving the menu stops and rewinds it; returning with the easter egg still active starts it again. One audio element streams the clip on demand and is reused across visits.

Ambient sound also preserves its position on pause/mute, runs once, and returns after cached-room visits, world loads, and revival. Playback errors wait for a later user gesture instead of retrying every frame. Effects use at most 24 media elements in total, with three per sound and priority-aware replacement; the optional menu clip has its own element. Completed effects reuse idle media elements across sound types before creating another channel. Sounds load on demand and use MP3 fallbacks when Ogg is unsupported.

On touch devices, a two-thumb virtual gamepad appears automatically. The **left stick** moves and faces Daniel in the walking direction; the **right stick** independently aims and fires. **Jump** double-jumps or revives after landing, **Grenade** arms one throw without firing and visibly selects the launcher. Tap a target in the game to throw once; Daniel automatically returns to the gun. **Throw** or the right stick can also trigger that single throw, and **Cancel** disarms it, **Use** opens doors, collects crates, and guides the companion while held, **Close** closes doors or kisses from her left, and **Slow** slows time while held. **Fire** uses the last aimed direction; while a grenade is armed it becomes **Throw** for that one shot. The original keyboard F grenade fire and primary-click return to the gun remain available. Short taps still register when released between simulation frames. After a one-shot throw, a held firing finger must lift or center before it can shoot again, so it cannot repeat the grenade or accidentally fire the gun. Tap people and objects directly for their menus, the bed, and the petrol-station exit.

Turn the phone sideways for a screen-filling layout. **Expand game** includes the gamepad and toolbar, with a viewport expansion fallback where native fullscreen is unavailable. Controls, saves, cheats, pause, and mute stay accessible. On the original menu, the left stick chooses up/down and **Select** confirms; story and ending screens use **Next**. **Controls → Virtual gamepad** offers automatic, always-show, and hide modes, saved independently of world saves. Multiple fingers can move, jump, and shoot together. Pausing, rotating, opening dialogs, and cancelled touches release held controls. Keyboard bindings remain available and independent of the virtual controls.

Player collision recovery uses nearby clear positions and moves at most eight pixels per frame, preventing a distant floor edge from teleporting Daniel across the map. Adjacent tiles and small floating-point overlaps are handled locally, and saves can resume mid-recovery. Unusually fast vertical movement sweeps intervening walls so launches cannot skip thin platforms. World dialogs stop the player while their choices are open. Falling below every floor or travelling beyond the outer terrain now causes the normal death penalty, and makes **Revive** available immediately. This also works after a rocket launch and with invulnerability enabled. Revival returns to the original bed or room spawn; quests, inventory, and surviving enemies persist. Original terrain beyond the nominal room size and high upward flights over the map remain playable. Older world saves remain compatible. Collision search loops are limited to the attempted movement, preventing fractional recoil and rotated masks from moving Daniel to a distant obstacle. Each simulation tick uses one consistent world pointer, so camera shake cannot redirect a click to an entrance during the same tick. Damage timing is preserved: the recovered scripts remove a heart each frame of sustained enemy contact, with no invulnerability delay; one enemy bullet removes one heart.

Room exits create their fade controller when needed, including when playing directly from Home without visiting the menu first. Previously stranded saves regain movement on resume if no dialogue, computer menu, sleep, death, or active transition requires the control lock.

## Files

- `dist/index.html`, `style.css`, `app.js`, `bindings.js`, `gamepad.js`, `gameplay-hints.js`, `player-menus.js`: browser player, touch gamepad, contextual hints, control settings, and save/cheat interfaces.
- `dist/easter-egg.js`, `assets/secret-face.png`, `assets/face-moon.png`: moon menu trigger, persistent cosmetic preference, and smoothly rendered photographic head. Artwork was created with the built-in image generator; the prompts are in `art/secret-face-prompt.md` and `art/moon-and-neck-prompts.md`.
- `dist/assets/easter-egg-menu.mp3`: user-supplied menu clip, copied from `ScreenRecording_09-04-2026 09-14-41_1.mp3` without re-encoding.
- `dist/world-state.js`, `world-saves.js`: validated world snapshots, three atomic save slots, import/export, and checkpoint migration.
- `dist/engine.js`: GameMaker-compatible event, object, collision, animation, drawing, audio, and persistence services used by this game.
- `dist/alarms.js`: derived timer activity with original event order, mutation behavior, and ordinary saved arrays.
- `dist/audio.js`: bounded audio allocation, loop suspension, playback ownership, priorities, and codec selection.
- `dist/code.js`: generated translation of the recovered GML into JavaScript functions. No runtime `eval` or Windows executable is required.
- `dist/data.json`: all eight original rooms, their instances and decorative layers, object/event definitions, sprites, font glyphs, and sound metadata.
- `dist/assets/`: seven original texture atlases, 33 original sounds packaged as Ogg, and streaming MP3 fallbacks for those sounds.
- `patches/*.gml`, `patches/rooms.json`: browser script and room-layer corrections, preserving original recovery output.
- `test/*.test.mjs`: gameplay, input, save, and runtime regression checks; `test/performance.mjs` profiles simulation time.
- `recovered/code/`, `recovered/manifest.json`, `recovered/masks.json`: unmodified recovered GML and the resource metadata needed to regenerate the browser files.
- `tools/`: source translation, data packaging, deployment verification, and original recovery/export tools.
- `.github/workflows/pages.yml`: verification and automatic GitHub Pages deployment from `main`.

Python 3 regenerates the checked-in browser scripts and resource data; no original executable or decompiler is needed for this step:

```sh
npm run rebuild:game
```

`tools/transpile.py` translates `recovered/code/`, giving matching `patches/*.gml` precedence, and writes `dist/code.js` and the tested call list. `tools/package-data.py` packages the manifest and masks with `patches/rooms.json` into `dist/data.json`. Both resolve paths relative to the repository. Graphics and audio are already included. To regenerate the MP3 fallbacks, install FFmpeg and run `npm run rebuild:audio`; conversion is sequential with one encoder thread. The provided menu MP3 is never re-encoded. [REVERSE_ENGINEERING.md](REVERSE_ENGINEERING.md) records the original extraction and its limits; the Windows installer, executable, game-data binary, and external decompiler are excluded from this repository.

## Verification

```sh
npm run check
npm test
npm run check:pages
```

`npm run check:pages` checks the static artifact for unsupported files or links, resolves module and asset references, and serves every deployment file at both `/` (custom domain) and `/Adventures-Of-Daniel/` (default Pages URL) to verify its content and MIME type. It uses a temporary loopback server on an automatically assigned port and stops it afterward. `npm run benchmark` is available separately for simulation profiling.

199 checks cover all rooms and drawing scripts, movement and double jump, computer/email interactions, quests and doors, weapons, arena waves, original menu/story/ending transitions, collision masks, grenade use, death/revival, repeated petrol shifts, sleep and the companion's bed interaction, shops and number formatting, controls, fullscreen pointer mapping, complete world round-trips, deterministic continuation, visited-room persistence, mid-shift/mid-sleep saves, original statistics separation, failed writes, invalid imports, cheats, bounded long sessions, and the moon trigger, persistent deactivation target, neck/collar connection, appearance preference, rendering scope, smooth sampling, and menu music lifecycle. Additional checks cover virtual input ownership, aiming while the camera follows, touch menu/story navigation, original damage timing, bounded collision recovery and mid-recovery saves, reachable dialogs, companion-spawned miniature faces, audio suspension, pending playback, cached-room ambience, priorities, media limits, format fallback, idle-channel reuse, restored F/primary-fire controls, rapid touch taps, facing while walking and aiming, stock-button visibility with continuing price updates, void death and reliable revival, deterministic mid-fall saves, nearby open/close prompts, one-shot mobile grenade arming, cancellation, automatic gun return, and same-room save loading, stable pointer coordinates during camera changes, 4,800 frames of movement with changing aim and gunfire, timer mutation/alias parity, and bounded renderer caching with depth/culling and pixel-composition checks. Every referenced GameMaker function is implemented. Tests run sequentially with a 128 MB managed heap cap.

Browser checks verified rendering, movement, computer screens, cheat controls, save/reload/Continue, file export/import, independence from the statistics file, and easter egg music playback, mute, pause, deactivation, and menu exit/re-entry. Audio loads on demand; rendering uses the fixed-size viewport rather than allocating room-sized canvases. The shared font, tint, and white-mask cache uses at most 64 entries and 8 MiB of canvas pixels, and sound pools are bounded. Rendering reuses at most 2,048 draw-command slots and stable depth order, while still executing all original Draw and GUI events. Timer activity skips dormant slots without changing event order or save state. Paused games draw only when state changes. Collision and object indexes avoid scanning thousands of static instances each frame, and off-map projectiles expire.

The same seeded Node benchmark measured median simulation time dropping from 8.573 to 2.308 ms in Home and from 3.193 to 1.345 ms in the first level. The latest follow-up benchmark measured Home median/p95 1.480/2.013 ms, first level 0.845/1.389 ms, and the 25-enemy room 0.732/1.870 ms, with 17.08 MiB of managed heap and zero runtime errors. These measurements cover simulation, not browser graphics or audio. See [BUG_AUDIT.md](BUG_AUDIT.md) for scope and results.

Corrections preserve weapon ownership, restore the gun layer after computer use, keep stock balances inside their screen, and round displayed numbers without changing inventory precision. Station completion creates one message and pays once. Sleep fades finish and remove temporary objects; companion heart effects expire. Other fixes cover menu re-entry, Quit/Resume, a misplaced stretched menu background, grenade clicks, shop charges, repeat ticket purchases, breakable doors, corpse movement, native friction, rotated masks, sprite tinting, malformed statistics, and bounded income indicators. The recovered GML remains unchanged; browser fixes live in `patches/`.

This is a reconstruction of the game's runtime behavior, not an exported GameMaker project. Editor-only organization and the original authors' comments are not recoverable from the executable. Collision uses recovered bounding boxes, rotation, and the original precise masks for both sprites that require them. The standalone Windows runner was unavailable for frame-by-frame comparison.

The final static scan and its measurements are recorded in [BUG_AUDIT.md](BUG_AUDIT.md#final-static-scan--october-12-2026). Enemy guns now honor the original clear-sight condition through GameMaker numeric boolean conversion. Invalid saved physics and statistics are rejected before loading, synchronous database failures abort pending writes, and early keyboard input cannot bypass asset loading. Firing checks and contextual hints use existing object indexes.

## Attribution and licensing

The recovered GML, game graphics, fonts, sounds, characters, and room designs come from **HIMR: The Adventures of Daniel**, version 1.6. This repository adds the browser runtime, translation and recovery tools, browser corrections, and player interface. [UndertaleModTool](https://github.com/UnderminersTeam/UndertaleModTool) was used for extraction; it is an external tool and is not bundled here.

The realistic face artwork was generated from the supplied reference photograph; the image prompts are retained in `art/`. The easter egg menu MP3 was supplied separately and is included without re-encoding.

Licensing is unchanged. No new license has been applied to the runtime, tools, recovered code, or assets, and inclusion in this public repository does not relicense the original material.
