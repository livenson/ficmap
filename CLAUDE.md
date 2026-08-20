# Working on ficmap

Notes for anyone — human or model — picking this codebase up. The README says
what the project is and how to run it. This says what has bitten, and what the
codebase expects of a change.

## The rules that are not negotiable

**No copyrighted melodies.** Every world has a score. Public-domain and
traditional tunes may be transcribed; film and television themes may not — not
the Game of Thrones main title, not Hedwig's Theme, not the Raiders March, and
not something "in the style of" them either. Worlds covering those stories get
an original, credited as one.

**Never transcribe a tune from memory and credit it to a real source.** A named
piece ships only when its notation has actually been read. This rule exists
because it was broken: an eye-read of Grieg's *Morgenstemning* put bar 1 as
`G#5 F#5 E5 C#5 B4 C#5` and it is `B5 G#5 F#5 E5 F#5 G#5`, symmetric about its
lowest note. Memory was independently wrong too. What settled it was two
machine-readable sources agreeing — glyph coordinates pulled from an engraved
PDF, and a separate orchestral MIDI — cross-checked against the printed score.
Do that, or ship an original.

**Say where a text came from, and what it is.** The worlds are traced from
source texts, and the header of each story file names the edition it was read
from. When a source is a period retelling rather than a tradition's own account,
the world says so in its own words: Te Ika-a-Māui closes by stating that Dittmer
is a 1907 Pākehā retelling, that iwi hold their own differing accounts, and that
nothing here is presented as any particular iwi's version. Grey's *Polynesian
Mythology* is not on Gutenberg and Westervelt's Māui book turns out to be
Hawaii-centred — using it would have presented Hawaiian-collected material as
Māori tradition.

## What the codebase expects

**The height field's identity is load-bearing.** Fourteen components memoize on
it — `Flora`, `Rivers`, `SeaLife`, `Ripples`, `Wisps`, `Mosquitoes`, `Routes`,
`Elements` and the rest all keep `[field, ...]` in a dependency array. Handing
out a new field object re-scatters every forest and re-traces every river. This
is why detail tiles refine the field **in place** (`src/engine/refine.ts`) and
announce themselves through a version counter that only the terrain watches. If
you find yourself about to swap the field, don't.

**Placement and draping are separate on purpose.** `scatterTrees` decides where
a tree stands; `drapeTrees` decides how high. Re-running the placement on
changed ground moves every tree, because the rejection sampling reads the field.
Same for rivers: the course is traced once, only the drape follows the ground.

**A country-sized DEM cannot show a river.** The Faust map holds ~0.9 km per
pixel and the Elbe is some 200 m wide, so it is a fraction of a pixel and simply
is not in the heightmap. The courses `engine/rivers.ts` traces downhill from that
heightmap look like rivers and are not any river you could name — so a place
marked "The Elbe" stood in a conifer forest with no water in sight. A world that
names a river has to be given its course: `terrain.namedRivers`, built by
`scripts/build-river.mjs` from Natural Earth's public-domain centrelines, and
held by `check-rivers` to running downhill, reaching water, and having its
marker standing on it. The Jalón, the Tagus and the Whanganui are still marked
this way and still have no river under them.

**When a check refuses something, look upstream of the thing it refused.**
`check-rivers` accepts exactly three endings — water within 10 km, the edge of
the map, or a confluence with another drawn course — and it once refused four
rivers at the same time, which looked like four rivers that could not be drawn.
Three of the four were something else:

- **The Ganges was a bug in the builder.** Natural Earth carries the whole
  delta, and `build-river`'s greedy stitcher took a Sundarbans channel that
  dead-ends 88 km from any water while four other leaves of the same feature
  reach the Bay of Bengal. Where several channels leave one node the greedy pass
  takes the longest and never reconsiders, which is fine on a river with one
  mouth and a coin toss on a delta. It now walks the unused channels when its
  own tail reaches nothing. All 27 courses already committed reproduce
  byte-identically, because the repair cannot fire on a river that already ends
  properly — which is the negative control built into the change.
- **The Tiền Đường was a bug in the map.** Both public-domain hydrographic
  sources end the Qiantang at Hangzhou within 3 m of each other, and GSHHG's
  high-resolution shoreline puts the coast 0.4 km from that point, because
  Hangzhou Bay reaches the city. The heightmap disagreed, so the river ended in
  a field the reader could see. See the next note.
- **The Pasig is not in any public-domain source.** Natural Earth has no
  Philippine centrelines at all; WDBII, searched at all eleven of its levels
  over the whole of Luzon, has the Cagayan, the Agno, the Abra and the Pampanga
  and no Pasig. OpenStreetMap has it and is ODbL rather than public domain,
  which is a licence decision rather than a technical one. So it stays a route.
- **Only the Tarim is a river that genuinely cannot be drawn.** It has no mouth:
  it runs into the Taklamakan and stops, no branch of it arrives anywhere, and
  the desert marker says so instead.

The rule the refusals were defending is still the rule — a line stopping in a
field with a river's name beside it is the Elbe fault again. The lesson is that
"the check says no" is the start of the diagnosis and not the end of it.

**The elevation data does not know where an estuary is.** Terrarium reads +8 to
+11 m the whole way across and along the Qiantang below Hangzhou — sampled
directly at z10, so it is the source rather than the resampling — and the Kiều
map shipped with fifty-five kilometres of Hangzhou Bay drawn as farmland. No
zoom level fixes that; only vector shoreline data knows. `coastM`
(`build-heightmap.mjs`) lets GSHHG's shoreline overrule the DEM *below a given
elevation*, and the elevation guard is the whole design: replacing the coast
wholesale would trade real ground for a generalised outline, while the limit
confines it to the low, flat, wet places the DEM has miscalled land. Measured on
the Kiều map: 3,874 pixels, 0.28% of it. Opt-in, so no other preset moves.

**Nothing on the map is above suspicion, including the ground.** Two independent
public-domain river datasets agreeing to within 3 m, against one elevation
dataset, is not a tie — and the instinct on the first pass was to believe the
heightmap and leave the river off, because the heightmap is what the reader
sees. Measure the disagreement before deciding which source is wrong.

**One water plane means a high lake is a hole.** The renderer draws water at a
single `seaLevel`, so the only way to make a lake read as water is to sink it to
the waterline — fine for Laguna de Bay at −1 m, and a shaft straight through the
map for Nam Co at 4,724. The Journey to the West box came out with six black
pits punched in Tibet before `lakeMaxM` (`build-heightmap.mjs`) bounded which
lakes get carved; above the limit the DEM's own flat pan is kept, which is less
true than a lake and much less wrong than a shaft. Measured: 4,551 pixels saved
there, 117 on the Kiều map. The option is opt-in, so every preset that predates
it is unchanged by construction rather than by a rebuild.

**A heightmap byte means nothing without its metre range.** Presets normalise to
whatever their own data contained, which is fine for a map built once and fatal
for one that will be subdivided — a tile sees a different corner of the world
and would scale its bytes to different extremes. Pin `minM`/`maxM` before
cutting anything from a preset; `scripts/check-dem-scale.mjs` says which are
pinned and cross-checks each against its story's declared `seaLevel`.

**Runtime URLs do not get Vite's `base`.** Only imported assets are rewritten.
Anything composed at runtime — the DEM tiles — must go through
`import.meta.env.BASE_URL`, or it works in dev and 404s under the Pages subpath.

**A `new THREE.Anything()` in a render body is a dependency that never settles.**
`Flora` built its base colour inline and listed it in the layout effect that
places every tree, so the effect ran on every render — re-placing 2,340 trees and
re-sending three instance matrices and two colour buffers, 505 KB, every time
anything in the scene changed, down to selecting a place on the map.
`check-rerender` exists to catch this shape wherever it reappears.

**A transparent material still costs a draw call.** Each marker carried a fully
transparent sphere as its click target — 38 draw calls and 6,840 triangles a
frame on the Nils map, producing no pixels. `visible={false}` is the right tool:
three's `intersect` (`Raycaster.js`) tests `object.layers` and never reads
`visible`, so an invisible mesh is skipped by the renderer and still found by the
raycaster. Across the atlas that alone took the mean from 112 to 92 draws a
frame. `check-hit-targets` pins the raycasting half of that bargain, because it
is an assumption about a dependency's internals.

**Don't ask for MSAA twice.** `Postprocess` mounts an EffectComposer
unconditionally, so the scene renders into the composer's own multisampled target
and `gl={{ antialias: true }}` only bought a second multisampled backbuffer that
nothing ever drew into — tens of megabytes on a phone at dpr 2. Removing it is
invisible: 0.138% of pixels differ, against a 0.129% floor from photographing the
same build twice while the water moves.

**Match the surrounding style.** No semicolons, single quotes, no Prettier
config in the repo — running `npx prettier` on a file reformats it against house
style and has to be reverted.

## Verification is scripts, not just tests

`scripts/check-*.mjs` are the real safety net; the Playwright suite covers that
the app loads and behaves. Each checker bundles the actual source with esbuild
and runs it, so it sees what the app sees:

| script | what it holds |
|---|---|
| `check-routes` | every place in the atlas has a line of travel to it |
| `check-markers` | a DEM world's markers are on land, and connected |
| `check-music` | the written bass lands where the score says |
| `check-lod` | the terrain splits when it should, and its two meshes meet |
| `check-refine` | detail tiles overlay the base without seams |
| `check-dem-scale` | pinned presets agree with their stories |
| `check-dem-tiles` | tiles sit on the base map, not above or below it |
| `check-rivers` | a named river runs downhill to water, with its place on it |
| `check-atlas-map` | every world is pickable off the picker's map, and no two pins collide |
| `profile-worlds` | draws, triangles, heap, per world |

`npm run check` is those — data and geometry, no browser, about twenty seconds,
and it runs on every push. `npm run check:gpu` is the other kind: it builds the
site, starts a preview server and drives Chromium, and measures the app through
the graphics API rather than the clock. Run it when touching rendering.

| script | what it holds |
|---|---|
| `check-rerender` | selecting a place rebuilds no geometry |
| `check-hit-targets` | clicking near a place in the scene still selects it |
| `check-picker-map` | every pin on the world picker's map names itself, on mouse and on touch |

**Every check must be able to fail.** This is the single most repeated lesson
here. Things that have passed green while broken:

- A nav-stability test walked six chapters of one world and reported success
  while two separate layout bugs were live — one title in the atlas wraps to
  three lines, and one world's book label wraps to two. It now walks whole
  stories and asserts the titles really did vary in height, because a stability
  test over constant content proves nothing.
- A seam check reported a gap of exactly zero because every sample was being
  skipped. It now asserts it compared 901 points before it asserts they match.
- A check that the mesh never out-resolves its heightmap passed trivially,
  because at the shipping field of view the triangle budget lands just under the
  cap anyway. It now also runs at a narrow view where the budget asks for 9× and
  the data allows 4×.
- A tile-scale check read the manifest rather than the tile bytes, so falsifying
  the manifest changed nothing. Testing it meant actually cutting a row wrongly.
- A check for "does clicking rebuild anything" counted `bufferData` and reported
  a clean zero over a forest that was in fact being re-sent on every click.
  three.js allocates an attribute's buffer once with `bufferData`; every later
  `needsUpdate` goes out as **`bufferSubData`** into that same buffer. Patch both.
- The same check, once it could see the uploads, then got the *arithmetic* wrong
  twice. Comparing an idle window against a clicking window of equal wall-clock
  accused three innocent worlds, because clicking makes r3f render more frames
  and the rain redraws once a frame. Normalising per frame hid the real fault
  instead: six clicks' rebuilding averaged over forty frames reads 0.70 uploads a
  frame, which slips under any sane budget, for something that is really 5
  uploads and 493 KB per click. What works is subtracting the idle rate scaled to
  the number of frames the busy window actually rendered.
- A click-through check disabled `pointer-events` on every ancestor of the label
  and so switched off the canvas as well, then reported that clicking was broken
  — against unmodified code. **Run a new check against known-good code before
  believing what it says about your change.** That positive control is as
  necessary as the negative one, and it is the step most easily skipped, because
  a failing check on code you just edited looks like your bug.

So: after writing a check, break the thing it checks and watch it fail. Several
of these scripts have the measured negative control written into their comments
— the seam pin gives 1.6e-6 with it and 4.0e-3 without; per-tile clamping gives
0 versus 18.7 of 255.

- The first `check-rivers` allowed a marker 0.02 map units from its river, and
  so passed the Elbe marker at the 0.0106 offset it had been written to catch. A
  threshold picked before measuring the fault is a threshold picked to pass.

- A tool that is only correct because a checker exists is the wrong way round.
  `build-river` had no orientation step at all: it emitted whatever direction
  the greedy stitching left, and every river in the atlas came out
  source-to-mouth by luck. `check-rivers` was carrying the whole load, and it
  worked — it caught the White River coming out mouth-first — but the builder
  now points the course downhill by construction, using the same end-to-end
  test the check applies. Verified by rebuilding all 23 committed courses: 23
  of 23 reproduce byte-identically, because all of them were already right.

- A hit target wider than the gap between two targets silently eats its
  neighbour. The picker's map gave each pin a 13 px invisible disc so a
  fingertip could find a 4.5 px dot — but the closest pair of pins is 12.5 px
  apart, so one disc covered the other's centre entirely and whichever drew
  second won every time: hovering Ottokar named Švejk. Shrinking the discs to
  fit would have traded the bug for targets too small to hit. Resolving the
  pointer to the NEAREST pin on the panel has neither problem, and it cannot
  regress when a world is added. The general shape: per-item hit areas need
  item spacing > 2x their radius, and if you cannot guarantee that, do not use
  per-item hit areas.

- Browser automation moves the page. Playwright's `hover()` scrolls its target
  into view, so `check-picker-map` hovering twenty-seven pins before measuring
  the layout had quietly scrolled the popup — and the check then reported all
  six off-Earth worlds visible when zero of them were on screen at 1280x800.
  The same shape as `page.addInitScript` needing a reload: measure the state a
  reader actually sees, before anything has touched the page, and assert
  `scrollTop` is where you think it is. (The related trap: checking layout at a
  generous viewport guarantees nothing about a laptop. Check where it is tight.)

- A world can go missing from a UI without anything looking broken. The picker's
  map draws a perfectly tidy Europe whether it holds twenty pins or nineteen —
  one pin two pixels behind another is invisible, and so is one nudged off the
  panel. `check-atlas-map` counts them instead of trusting the picture, and it
  imports the component's own layout module rather than reimplementing the
  projection, because a check that reimplements the thing it checks is testing
  its own copy.

**Measure before believing.** A seam check first reported 1.86 bytes and called
it a crack; it was the terrain's own gradient over the fraction of a pixel being
sampled. An ocean check first demanded exact agreement and found 25
"disagreements" that were all coastline, where the finer tile correctly sees
land the coarse base cannot resolve. Distinguishing a defect from the feature
working takes looking at the specific failures, not at the count.

## Things that don't work in this environment

**Browser tests cannot drive zoom.** The scene renders at about one frame a
second under software WebGL and `OrbitControls` damps the dolly over frames, so
a test that turns the wheel and waits cannot tell "the camera never got there"
from "the feature never fired" — both look like an unchanged triangle count. An
early version of the LOD shipped with exactly that test passing on a camera that
had not moved. Camera-dependent logic gets a script that places a real camera
where the app places it.

**`page.addInitScript` only applies to the next navigation.** `beforeEach`
already navigated, so an instrumentation script added inside a test needs a
`page.reload()` or every measurement comes back `NaN`.

**Piping a long-running command through `tail` hides everything** until it
exits, including the tracebacks of a patch that failed to apply. More than one
"negative control passed" turned out to be a control that never ran.

**Don't run the e2e suite while editing source.** It uses a hot-reloading dev
server; four tests failed in a 55-minute run purely because the app changed
underneath them, and all four passed on a stable tree.

## Where the detail comes from

The whole-Earth heightmap holds ~13 km per pixel; a country-sized one holds
~1 km. That gap is data, not geometry, and it is why the world map softens when
you zoom in while Peer Gynt does not. Two layers address it:

- **Mesh LOD** (`src/engine/lod.ts`) — a coarse base with a rectangular hole
  plus a fine patch filling it, so the ground under the camera is sampled
  several times more closely for fewer triangles overall. It refuses to
  tessellate finer than the data holds, because past that point it resolves the
  creases in the heightmap's interpolation and the patch comes out crinkled.
- **Detail tiles** (`scripts/build-dem-tiles.mjs`, `src/engine/tiles.ts`) — a
  four-times-finer elevation layer in `public/dem/`, fetched a few 512px tiles
  at a time for whatever rectangle the camera is over. Requested only once a
  detail patch is worth planning: framed on the whole world every tile is
  technically in view, and asking for them pulled the entire 24 MB set down on
  load.
