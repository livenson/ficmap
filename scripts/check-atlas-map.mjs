#!/usr/bin/env node
/**
 * The world picker's map can actually be used to pick every world.
 *
 * The map tab is the only part of the UI where a world can go missing without
 * anything looking broken: a pin two pixels behind another pin, or one nudged
 * off the edge of its panel, still draws a perfectly tidy map — of twenty-nine
 * worlds. So four things are checked, against the SAME layout module the
 * component renders from (`src/ui/atlasLayout.ts`), not a copy of its
 * arithmetic:
 *
 *   - EVERY WORLD IS REACHABLE. Each story lands in exactly one of the three
 *     groups — Europe inset, world map, or the shelf beside them. None twice,
 *     none nowhere.
 *   - EVERY PIN IS ON ITS OWN GROUND. A world with a DEM preset must have its
 *     pin inside that preset's bounding box. The pins are hand-set, because the
 *     centre of a bounding box is often open ocean; this stops a hand-set
 *     coordinate from being a hand-mistyped one.
 *   - NO TWO PINS OVERLAP. Measured in the panel's real pixel size, since that
 *     is what decides whether a reader can hit one. This is the check that
 *     forced the Europe inset to exist at all.
 *   - NOTHING IS DRAWN OFF THE EDGE. Every placed pin is inside its panel's
 *     0..1 box with room for its own radius.
 *
 * NEGATIVE CONTROLS, all measured:
 *
 *   Švejk's pin moved to Prague (Ottokar's)    caught twice — outside the svejk
 *                                              DEM box, AND 0.0 px from Ottokar
 *   Kalevipoeg's lon 25.6 -> 35.0              pin outside the estonia box
 *   Kalevipoeg's lat 58.75 -> 88.0             both of the above, and off-panel
 *   layoutAtlas dropping a story               1 world reachable from neither
 *
 * As shipped: 30 worlds placed — 20 in the inset, 4 on the world map, 6 on the
 * shelf — closest pair 12.5 px in the inset and 38.4 px on the world map, and
 * 22 pins checked against a DEM box.
 *
 * Usage:
 *   node scripts/check-atlas-map.mjs
 */
import esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Bundle the real story data and the real layout module together, so this sees
 * what the picker sees. The stub plugin drops the PNG imports, which esbuild
 * cannot load and this check does not need — it reads the presets for the
 * bounding boxes and only needs each story's heightmap FILENAME, which comes
 * from the import path rather than the file.
 */
const bundle = await esbuild.build({
  entryPoints: [path.join(ROOT, 'scripts/_atlas-entry.js')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'neutral',
  plugins: [
    {
      name: 'stub-assets',
      setup(build) {
        build.onResolve({ filter: /\.(png|jpe?g|webp)$/ }, (a) => ({
          path: a.path,
          namespace: 'stub',
        }))
        build.onLoad({ filter: /.*/, namespace: 'stub' }, (a) => ({
          // Keep the filename: it is how a story is matched to its DEM preset.
          contents: `export default ${JSON.stringify(a.path.split('/').pop())}`,
          loader: 'js',
        }))
      },
    },
  ],
})
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64')
)

const { stories, layoutAtlas, PANEL, PIN_RADIUS, europeCoast, worldCoast } = mod

/** preset name, keyed by the heightmap file it writes. */
const presetByFile = {}
for (const [name, p] of Object.entries(PRESETS)) {
  if (p.out) presetByFile[p.out.split('/').pop()] = { name, ...p }
}

let problems = 0
const fail = (msg) => {
  console.log(`  !! ${msg}`)
  problems++
}

const { europe, world, shelf } = layoutAtlas(stories)

// ---- 1. every world reachable, exactly once -------------------------------
const seen = new Map()
for (const [group, list] of [
  ['europe inset', europe.map((p) => p.story)],
  ['world map', world.map((p) => p.story)],
  ['shelf', shelf],
]) {
  for (const s of list) seen.set(s.id, [...(seen.get(s.id) ?? []), group])
}
for (const s of stories) {
  const where = seen.get(s.id)
  if (!where) fail(`${s.id} is on neither map nor the shelf — it cannot be picked here`)
  else if (where.length > 1) fail(`${s.id} appears in ${where.join(' and ')}`)
}
console.log(
  `${stories.length} worlds: ${europe.length} in the Europe inset, ${world.length} on the ` +
    `world map, ${shelf.length} on the shelf`,
)

// ---- 2. every pin inside its own DEM box ----------------------------------
let boxed = 0
for (const s of stories) {
  if (!s.earth) continue
  // `terrain.heightmap` is the stubbed filename; procedural worlds have none.
  const file = s.terrain?.heightmap
  const preset = file ? presetByFile[file] : null
  if (!preset?.bbox) continue
  boxed++
  const b = preset.bbox
  const { lon, lat } = s.earth
  if (lon < b.lonMin || lon > b.lonMax || lat < b.latMin || lat > b.latMax) {
    fail(
      `${s.id}: pin ${lon},${lat} is outside its own "${preset.name}" DEM box ` +
        `(lon ${b.lonMin}..${b.lonMax}, lat ${b.latMin}..${b.latMax})`,
    )
  }
}
console.log(`${boxed} pins checked against the DEM box of the map they open`)

// ---- 3 & 4. separation, and staying on the panel --------------------------
const MIN_GAP = PIN_RADIUS * 2
for (const [key, placed, view] of [
  ['europe', europe, europeCoast],
  ['world', world, worldCoast],
]) {
  const { w, h } = PANEL[key]
  const px = placed.map((p) => ({ id: p.story.id, x: p.x * w, y: p.y * h }))

  for (const p of placed) {
    // Room for the whole dot, not just its centre.
    const mx = PIN_RADIUS / w
    const my = PIN_RADIUS / h
    if (p.x < mx || p.x > 1 - mx || p.y < my || p.y > 1 - my) {
      fail(
        `${p.story.id}: pin at ${p.x.toFixed(3)},${p.y.toFixed(3)} of the ${key} panel ` +
          `is off its edge (view lon ${view.lonMin}..${view.lonMax}, lat ${view.latMin}..${view.latMax})`,
      )
    }
  }

  let closest = [Infinity, '', '']
  for (let i = 0; i < px.length; i++) {
    for (let j = i + 1; j < px.length; j++) {
      const d = Math.hypot(px[i].x - px[j].x, px[i].y - px[j].y)
      if (d < closest[0]) closest = [d, px[i].id, px[j].id]
      if (d < MIN_GAP) {
        fail(
          `${px[i].id} and ${px[j].id} overlap on the ${key} panel: ` +
            `${d.toFixed(1)} px apart, and two ${PIN_RADIUS} px dots need ${MIN_GAP}`,
        )
      }
    }
  }
  if (px.length > 1) {
    console.log(
      `${key} panel (${w}x${h}): ${px.length} pins, closest pair ` +
        `${closest[0].toFixed(1)} px — ${closest[1]} and ${closest[2]}`,
    )
  }
}

console.log(
  problems === 0
    ? '\nevery world can be picked off the map, and no two pins collide'
    : `\n${problems} problem(s)`,
)
process.exit(problems === 0 ? 0 : 1)
