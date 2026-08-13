#!/usr/bin/env node
/**
 * Route coverage for EVERY world and EVERY level in the atlas.
 *
 * `check-markers.mjs` checks a DEM world's markers against its own heightmap,
 * so it only covers the worlds that have one, and only their surface. This
 * checks the thing that applies everywhere and needs no terrain at all: does
 * each place have a line of travel running to it, or is it a dot on the map
 * that nobody in the story ever goes to?
 *
 * The story data is bundled with esbuild and imported for real, so this sees
 * exactly what the app sees — every level, every marker, no regex guesswork.
 *
 * A place counts as connected when a route passes within `REACH` map units, or
 * when it is listed in a story's own `scenic` set (summits and off-map places
 * that are meant to be looked at rather than travelled to — declare those in
 * SCENIC below with a one-line reason).
 *
 * Usage:
 *   node scripts/check-routes.mjs            # every world
 *   node scripts/check-routes.mjs kalevala   # one world
 */
import esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/** How close a route must pass, in map units (the map spans -1..1). */
const REACH = 0.09

/**
 * Places that are deliberately unreachable — a peak you only ever look at, a
 * land the story names but never visits. Keyed `world/level/marker`.
 */
const SCENIC = new Set([
  // Wilhelm Tell: named from the lake, never climbed.
  'tell/surface/pilatus',
  'tell/surface/uri-rotstock',
  'tell/surface/rigi',
  // The Nibelungenlied names these as edges of the world.
  'nibelungen/surface/alps',
  'nibelungen/surface/bohemia',
  // Faust: the Brocken is seen from below; the rest are named, not visited.
  'faust/surface/brocken',
  'faust/surface/harz',
  'faust/surface/elbe',
  'faust/surface/greece',
  'faust/surface/knittlingen',
  // Uilenspiegel.
  'uilenspiegel/surface/ardennes',
  'uilenspiegel/surface/spanish-road',
  // The Kalevala: Kullervo's country is its own story; the oak is felled once.
  'kalevala/surface/kullervo',
  'kalevala/surface/kaleva-oak',
  // Peer Gynt: greeted from a ship's deck, not climbed.
  'peergynt/surface/ronde',
  'peergynt/surface/gendin',
  'peergynt/surface/oslo',
  'peergynt/surface/jokel',
  // Nils: landmarks the geese steer by.
  'nils/surface/omberg',
  'nils/surface/smaland',
])

const bundle = await esbuild.build({
  entryPoints: [path.join(ROOT, 'src/stories/index.ts')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'neutral',
  // The stories import their heightmap PNGs; the geometry does not need them.
  plugins: [
    {
      name: 'stub-assets',
      setup(build) {
        build.onResolve({ filter: /\.(png|jpe?g|webp)$/ }, (a) => ({
          path: a.path,
          namespace: 'stub',
        }))
        build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
          contents: 'export default ""',
          loader: 'js',
        }))
      },
    },
  ],
})
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64')
)

/** Shortest distance from a point to a polyline, in map units. */
function distToRoutes(routes, x, z) {
  let best = Infinity
  for (const r of routes) {
    const pts = r.points ?? []
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]
      const b = pts[i]
      const dx = b.x - a.x
      const dz = b.z - a.z
      const len = dx * dx + dz * dz
      const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / len))
      best = Math.min(best, Math.hypot(x - (a.x + t * dx), z - (a.z + t * dz)))
    }
  }
  return best
}

const only = process.argv[2]
let stranded = 0
let checked = 0
for (const story of mod.stories) {
  if (only && story.id !== only) continue
  // The surface, then each extra floor. A floor inherits nothing: its markers
  // and routes are its own.
  const levels = [
    { id: 'surface', markers: story.markers ?? [], routes: story.routes ?? [] },
    ...(story.levels ?? []).map((l) => ({
      id: l.id,
      markers: l.markers ?? [],
      routes: l.routes ?? [],
    })),
  ]
  for (const lv of levels) {
    const out = []
    for (const m of lv.markers) {
      checked++
      const key = `${story.id}/${lv.id}/${m.id}`
      if (SCENIC.has(key)) continue
      const d = distToRoutes(lv.routes, m.at.x, m.at.z)
      if (d > REACH) out.push({ m, d })
    }
    if (out.length) {
      stranded += out.length
      console.log(`\n${story.id} · ${lv.id}  (${lv.markers.length} places, ${lv.routes.length} routes)`)
      for (const { m, d } of out.sort((a, b) => b.d - a.d)) {
        console.log(`  !! ${m.id.padEnd(20)} ${String(m.kind).padEnd(9)} ${m.name}` +
          `  — nearest route ${d.toFixed(3)}`)
      }
    }
  }
}
console.log(`\n${checked} places checked across the atlas`)
console.log(
  stranded === 0
    ? 'every place has a route running to it'
    : `${stranded} place(s) with no route to them`,
)
process.exit(stranded === 0 ? 0 : 1)
