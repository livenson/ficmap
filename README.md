# Ficmap — an atlas of fictional worlds

Interactive **2D / 3D maps for made-up worlds**, in the browser. Each "story"
is a small data file describing a world; the engine builds the terrain from a
seed (or a real-elevation / hand-shaped heightmap) and drapes your cities, roads
and regions onto it. Pan and zoom like a web map, tilt into 3D, click a place to
read its lore.

Built with **React + react-three-fiber (Three.js)** and **Vite**. No backend —
it's a static site.

![Two sample worlds render from the same engine](docs/preview.png)

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # serve the production build
npm test           # Playwright e2e tests (see below)
```

### Tests

End-to-end tests (`e2e/`, Playwright) cover **all demo scenarios** — every
world loads without errors, plus the 2D/3D toggle, chapter playback,
cross-chapter references, artifact journeys, floor switching (Põrgu, the
Center-of-the-Earth subfloors, Valdurn's sky realms, Mistborn's two eras), the
per-book/film filter, the layers menu, the Estonian language toggle, and URL
deep-links. `npm test` starts a dev server and runs them.
It uses the environment's preinstalled Chromium via `executablePath`; point
`PW_CHROMIUM` at a different binary if needed.

## Deploy (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` builds the site and publishes it to
GitHub Pages on every push to the default branch (and can be run manually from
the Actions tab).

**One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment** and set **Source: "GitHub Actions"**. After the next push the site
goes live at:

```
https://livenson.github.io/ficmap/
```

The Vite `base` is already set to `./` so assets resolve correctly under the
`/ficmap/` project-page path.

## The idea

- **Worlds are data, not code.** A world is one `Story` object (see
  `src/types.ts`). Change a seed and you get an entirely different landmass;
  change the biome palette and the same terrain becomes tropical, arctic or
  volcanic.
- **Deterministic terrain.** Height is fractal noise seeded by a string, so the
  same story always renders the same land on every machine — no giant heightmap
  images to ship. (`src/engine/noise.ts`)
- **Place in 2D, render in 3D.** You give every marker/route a flat `(x, z)`
  coordinate in the range `[-1, 1]`; the engine looks up the terrain height and
  snaps it onto the surface. (`src/engine/terrain.ts`)

## The worlds

Eleven worlds ship in the atlas, mixing procedural, real-DEM and hand-shaped
terrain:

- **The Realm of Valdurn** — an original demo kingdom that climbs to the
  **Empyrean** sky realm and drops to the **Sunless Deep** (procedural).
- **Kalevipoeg** — the Estonian national epic over a real Estonia, three books,
  with the **Põrgu** underworld.
- **The Fellowship of the Ring** — Eriador, a shaped heightmap echoing Tolkien's
  map (the Misty Mountains, the Shire, Mirkwood, Erebor).
- **Journey to the Center of the Earth** — an Iceland surface over three
  descending subfloors (Verne).
- **The Extraordinary Voyages** — four Jules Verne novels on the real whole
  Earth.
- **The d'Artagnan Romances** — Dumas's three Musketeers novels over real France
  and England.
- **Harry Potter** — wizarding Britain over a real Britain DEM, with post owls.
- **The Adventures of Indiana Jones** — real-Earth DEM, with a per-film filter.
- **Mistborn** — Scadrial's Final Empire, a shaped heightmap, across two eras.
- **The Forest Song** — Lesya Ukrainka's Volhynian Polissia forest, with
  drifting will-o'-the-wisp spirits.
- **Eneida** — Kotliarevsky's Cossack *Aeneid*: a Mediterranean voyage with
  **Olympus** above and **Peklo** below.

## Add your own world

1. Copy `src/stories/valdurn.ts` to `src/stories/my-world.ts`.
2. Edit it — pick a `seed`, tune the terrain, place your markers/routes/regions.
3. Register it in `src/stories/index.ts`:

   ```ts
   import { myWorld } from './my-world'
   export const stories: Story[] = [valdurn, myWorld]
   ```

That's the whole extension surface. No engine changes required.

### Placing things on land

Coordinates run `x: -1 (west) → 1 (east)`, `z: -1 (north) → 1 (south)`, with the
world centered at `(0, 0)`. A marker dropped in the sea just floats at the
shoreline, so to place cities on solid ground, preview the terrain first:

```bash
node scripts/preview.mjs <seed> <seaLevel> <islandFalloff> <frequency>
# e.g. node scripts/preview.mjs valdurn-5 0.36 0.25 1.4
```

It prints an ASCII map (`~` = sea) plus a list of verified land coordinates you
can paste straight into your story.

## The data model (`src/types.ts`)

| Field | What it does |
|-------|--------------|
| `terrain.seed` | Any string. Same seed → same world. |
| `terrain.frequency` | Feature size. Lower = larger continents. |
| `terrain.seaLevel` | Fraction of height that is underwater (0–1). |
| `terrain.islandFalloff` | 0 = land runs to the edges, 1 = strong island shape. |
| `terrain.heightScale` | Vertical exaggeration of the 3D mesh. |
| `terrain.biomes[]` | Elevation → color bands (low to high). |
| `terrain.rivers` | Number of rivers traced downhill from highlands to sea (`riverColor` to tint — e.g. lava-orange). |
| `terrain.heightmap` | Optional grayscale image URL — sampled elevation instead of noise. Some worlds use a **real DEM**: **Kalevipoeg** (Estonia), **The d'Artagnan Romances** (France + England), **Harry Potter** (Britain), **The Extraordinary Voyages** and **The Adventures of Indiana Jones** (the whole Earth), **Eneida** (the Mediterranean). Build these with `node scripts/build-heightmap.mjs [estonia\|france\|britain\|world\|mediterranean]` (some presets also carve real lakes from Natural Earth data). Others use a **shaped** heightmap — hand-built to echo a canonical map — via their own script: **The Fellowship of the Ring** (`build-middle-earth.mjs`), **Mistborn** (`build-scadrial.mjs`), **The Forest Song** (`build-polissia.mjs`). Place markers at real `lon/lat` mapped into the DEM's box. |
| `terrain.aspect` | World width ÷ depth (default 1 = square). Use >1 for a map wider than it is tall — **The Extraordinary Voyages** sets `360/140` so the equirectangular Earth keeps real proportions instead of stretching into the square. |
| `terrain.detail` | Adds fine surface relief (a tiled procedural bump map) so light picks out rockiness up close. On for the shaped-terrain worlds (FOTR, Mistborn, The Forest Song). |
| `terrain.sky` | Sky mood: `'day'` (default), `'dark'` (warm hellfire underworld), `'cavern'` (cool phosphorescence), `'heaven'` (a luminous cloud-sea sky realm). |
| `markers[]` | Labeled points of interest (`capital`, `city`, `port`, `ruin`, …). |
| `routes[]` | Journeys/roads drawn draped over the terrain. |
| `regions[]` | Ambient area names floated over the map. |
| `elements[]` | Tracked artifacts (a crown, a sword) with a `journey` of stops; shown on the map wherever they are for the current chapter, so they visibly move. |
| `chapters[]` | Optional guided tour — see below. |
| `books[]` | Multi-book tour: one shared map, several books each with their own `chapters`. References then span books ("Bk 2 · Ch 3"). |
| `ambient` | 3D-only life: `{ trees, treeKind, treeColor, birds, birdKind, dragons, mosquitoes, rain, fish, wisps }`. Trees scatter across wooded elevations; **birds** circle (or **post owls** with `birdKind: 'owl'`, or glowing **angels** over a `'heaven'` sky); **dragons** wheel and **breathe fire**; **fish** school under the sea; **wisps** drift as will-o'-the-wisp lights over marsh and water (see **The Forest Song**); `mosquitoes` swarm; `rain: true` brings clouds + animated rain (see **Kalevipoeg**). Shown only in 3D, under the "Trees & wildlife" layer. |

## Story mode (chapters)

Give a story a `chapters` array and a **▶ Play story** button appears. Each
chapter is one beat of a guided tour:

```ts
chapters: [
  {
    id: 'old-seat',
    title: 'The Old Seat',
    narration: 'In the southern peaks stands Caer Valdurn…',
    focus: { marker: 'caer-valdurn', distance: 34, pitch: 30, heading: 15 },
    reveal: { markers: ['duskwater'] },       // added to what's visible, cumulative
    highlight: { markers: ['caer-valdurn'] }, // glows; everything else dims
  },
  // …
]
```

- **`focus`** flies the camera to a `marker` (or an explicit `at` point), from
  `distance` world units away, at a `pitch`/`heading` (3D only). Both 2D and 3D
  are supported; the camera eases in, then hands control back to the viewer.
- **`reveal`** unveils markers/routes/regions as the tale progresses — ids are
  cumulative from chapter 0 onward, so the map unfolds. Categories nobody
  reveals stay fully visible. Omit `chapters` entirely and nothing changes.
- **`highlight`** emphasizes the current beat's markers/routes.

Navigate with the panel's Prev/Next, the chapter rail, or the **← / →** keys;
**Esc** exits.

### Multi-book worlds

For a saga that spans several books over one shared map, use `books` instead of
`chapters`:

```ts
books: [
  { id: 'birth', title: 'Birth & the Sword', chapters: [ /* … */ ] },
  { id: 'wars',  title: 'Wars & Wanderings', chapters: [ /* … */ ] },
]
```

Playback flows across books in order, the chapter rail groups under book
headings, and a place's **references span books** — click the Kääpa brook in
the **Kalevipoeg** sample and you'll see it surface in both *Wars & Wanderings*
and *Põrgu & the End*. `chapters` and `books` are interchangeable; a plain
`chapters` run is just a single implicit book.

This shines when several works share one geography. **The Extraordinary
Voyages** puts four Jules Verne novels (*Around the World in Eighty Days*,
*Twenty Thousand Leagues*, *The Mysterious Island*, *From the Earth to the
Moon*) on the real **whole Earth** as four books; **The d'Artagnan Romances**
does the same for Dumas's three Musketeers novels over the real **France and
England**. (Because a global map is wider than tall, the world stretches
vertically in the square view, and the round-the-world route wraps off the east
edge and back in the west.)

### Map levels (floors)

A world can have levels above or below the surface — an underworld, a dungeon,
a sky realm. Add `levels` (each with its own `terrain`, `markers`, etc.) and a
**floor switcher** appears, ordered like an elevator by each level's `tier`
(surface `0`, sky realms positive, underworlds negative). A chapter's `level` id
makes the guided tour **change floors** automatically, and each level sets its
own `sky` mood — `'dark'` (hellfire), `'cavern'` (phosphorescence) or
`'heaven'` (a luminous cloud-sea). Try **Kalevipoeg** → descend into **Põrgu**;
**Journey to the Center of the Earth** → three subfloors (a volcanic chimney,
the Lidenbrock Sea, the deep caverns); **Valdurn**, which climbs to the
**Empyrean** and drops to the **Sunless Deep**; or **Eneida**, whose tour rises
to **Olympus** and descends into **Peklo**.

```ts
levels: [{ id: 'porgu', title: 'Põrgu', terrain: { /* dark, sky: 'dark' */ }, markers: [...] }],
// and on a chapter:
{ id: 'porgu', title: 'The Gates of Põrgu', level: 'porgu', focus: { marker: 'sarvik-hall' }, ... }
```

### Tracked artifacts

Give a world `elements` to track objects whose location matters — a crown, a
cursed sword. Each element has a `journey` of stops, each tied to a chapter it
moves in:

```ts
elements: [{
  id: 'sword', name: 'The Cursed Sword', glyph: '⚔',
  journey: [
    { marker: 'finland',   sinceChapter: 2, note: 'Forged, then cursed.' },
    { marker: 'lindanisa', sinceChapter: 4, note: 'Carried into the wars.' },
    { marker: 'kaapa',     sinceChapter: 6, note: 'Lost in the brook.' },
  ],
}]
```

On the map the artifact is drawn wherever it is for the current chapter, so it
**visibly travels** as the tour advances; click it to trace its whole journey.
Toggle the **Artifacts** layer to hide them. (Try the sword in **Kalevipoeg**
or the crown in **Valdurn**.)

## Around the map

A few more conveniences in the viewer:

- **Language toggle.** UI chrome and marker-kind labels switch between English
  and Estonian (`EN` / `ET`).
- **Per-source filter.** Worlds built from several books or films get a
  **Filter** dropdown that pares the map down to one source's own places and
  routes — see **The Adventures of Indiana Jones**.
- **Collapsible panel.** A tab on the seam hides the side panel (a bottom sheet
  on mobile) to give the map the whole stage.
- **Deep-links.** State lives in the URL: `?world=`, `?floor=`, `?view=2d`,
  `?lang=et` — so any world, floor, view or language is directly shareable.

## Project layout

```
src/
  types.ts              # the Story data contract (start here)
  engine/               # pure, framework-free world generation
    noise.ts            #   seeded fractal height field
    terrain.ts          #   mesh builder + map↔world coordinates
    biomes.ts           #   elevation → color
  components/           # react-three-fiber scene
    MapScene.tsx        #   canvas, cameras (2D/3D), lighting, floor state
    Terrain / Water / Markers / Routes / Regions
    Flora / Wildlife / Wisps / SeaLife / Weather   # 3D ambient life
  ui/                   # DOM overlay: toolbar, info panel, legend,
                        #   floor switcher, per-source filter, story player
  stories/              # the worlds — add yours here
```

## Roadmap ideas

The architecture leaves room to grow without rework:

- Load worlds from external JSON / a CMS instead of bundled TS.
- Fog-of-war / exploration state, day–night lighting, animated routes.
- An in-browser editor that exports the same `Story` format.
