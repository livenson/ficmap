#!/usr/bin/env node
/**
 * Trace a REAL, NAMED river across a world's map, from published geodata.
 *
 * Why this exists: a whole-country DEM cannot show a river. The Faust map holds
 * about 0.9 km per pixel and the Elbe at Magdeburg is some 200 m wide, so the
 * river is a fraction of one pixel and simply is not in the heightmap. The
 * procedural courses in `engine/rivers.ts` are traced downhill from that same
 * heightmap; they look like rivers, and none of them IS any particular river.
 * So a marker reading "The Elbe" stood on wooded ground with no water in sight.
 *
 * The course therefore has to come from outside the DEM. This reads it from
 * Natural Earth's 10m river centrelines — public domain, and generalised for
 * exactly this scale — stitches the segments into one line from source to mouth,
 * clips it to the world's bounding box, thins it, and prints map-space points
 * ready to paste into a story file.
 *
 * It also samples the world's own heightmap along the finished course and prints
 * the elevation profile, because a drawn river that climbs a hill or stops in
 * mid-air is worse than no river at all.
 *
 * The 8 MB source file is downloaded on demand into `.cache/` (gitignored) and
 * never committed; nothing in `npm run check` depends on the network.
 *
 * Usage:
 *   node scripts/build-river.mjs harz Elbe
 */
import { PNG } from 'pngjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = path.join(ROOT, '.cache')
/**
 * Two Natural Earth files, searched in order.
 *
 * The global 10m centrelines carry the rivers a world map would name — the
 * Elbe, the Tagus, the Tiber. They do not carry the Arno, which is only 240 km
 * long and is nonetheless the river the Commedia is about ("a streamlet that is
 * born in Falterona"). The European supplement is denser and has it. Anything
 * smaller than that is not in either, and should not be invented.
 */
const SOURCES = [
  ['ne_10m_rivers_lake_centerlines.geojson', 'global 10m centrelines'],
  ['ne_10m_rivers_europe.geojson', 'European supplement'],
]
const remote = (f) =>
  `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/${f}`

/**
 * How far apart to keep points, in kilometres ON THE GROUND.
 *
 * Not in map units, which was the first attempt and does not travel: the map is
 * always -1..1 whatever it covers, so 0.03 units is 9 km across central Germany
 * and 17 km across New Zealand. Thinning the Whanganui — a 290 km river — at 17
 * km left ten points and lost every bend it is famous for.
 */
const SPACING_KM = Number(process.env.SPACING_KM ?? 8)

const [presetName, riverName] = process.argv.slice(2)
if (!presetName || !riverName) {
  console.error('usage: node scripts/build-river.mjs <preset> <river name>')
  console.error(`presets: ${Object.keys(PRESETS).join(', ')}`)
  process.exit(2)
}
const preset = PRESETS[presetName]
if (!preset) {
  console.error(`unknown preset "${presetName}"`)
  process.exit(2)
}
const B = preset.bbox

async function load(file) {
  const local = path.join(CACHE, file)
  if (!fs.existsSync(local)) {
    fs.mkdirSync(CACHE, { recursive: true })
    process.stderr.write(`fetching ${file}...\n`)
    const res = await fetch(remote(file))
    if (!res.ok) {
      console.error(`download failed: ${res.status}`)
      process.exit(1)
    }
    fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()))
  }
  return JSON.parse(fs.readFileSync(local, 'utf8'))
}

let data = null
let fromWhich = ''
for (const [file, label] of SOURCES) {
  const d = await load(file)
  if (d.features.some((f) => f.properties?.name === riverName)) {
    data = d
    fromWhich = label
    break
  }
}
if (!data) {
  console.error(`no river named "${riverName}" in either Natural Earth file`)
  process.exit(1)
}
/**
 * EVERY feature with this name, not the first one.
 *
 * Natural Earth splits a long river across several features — the Tagus is two,
 * one of 38 points and one of 179 — and `find` took whichever came first. That
 * gave a 60 km fragment of the middle Tagus, which then read as a river that
 * climbs, because a fragment has no particular relation to the slope.
 */
const features = data.features.filter((f) => f.properties?.name === riverName)
if (!features.length) {
  console.error(`no river named "${riverName}" in the dataset`)
  process.exit(1)
}
const parts = features
  .flatMap((f) =>
    f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [f.geometry.coordinates],
  )
  .filter((s) => s.length >= 2)
if (features.length > 1) {
  console.error(`  ("${riverName}" is ${features.length} features in the source, merged)`)
}

/**
 * Stitch the parts into one line.
 *
 * Natural Earth stores a river as several segments in no particular order, some
 * of them reversed, and near a delta or a braided reach there are alternate
 * channels that belong to no single thread. Chaining greedily from the longest
 * segment picks up the main stem and leaves the side channels behind, which is
 * what a map at this scale wants.
 */
const near = (a, b, tol = 0.02) => Math.abs(a[0] - b[0]) < tol && Math.abs(a[1] - b[1]) < tol
/**
 * A candidate is an alternate channel, not a continuation, if the end it would
 * add is already somewhere on the chain.
 *
 * Both of the Elbe's channels around Hamburg start at the same node, so a plain
 * end-to-start match accepts one, then accepts the other REVERSED and walks 25
 * km back upstream — which draws as a hook in the river. Rejecting a candidate
 * that lands on ground the chain already covers keeps the single main stem.
 *
 * (Cutting the course at its lowest sampled point instead does not work, and
 * was tried: over a coarse DEM the lowest pixel along the Elbe is in the
 * floodplain at Wittenberge, 150 km short of the sea.)
 */
const revisits = (chain, tip) => chain.some((p) => near(p, tip, 0.05))
const rest = parts.slice().sort((a, b) => b.length - a.length)
let chain = rest.shift()
for (let changed = true; changed && rest.length; ) {
  changed = false
  for (let i = 0; i < rest.length && !changed; i++) {
    for (const cand of [rest[i], rest[i].slice().reverse()]) {
      if (near(chain[chain.length - 1], cand[0])) {
        if (revisits(chain, cand[cand.length - 1])) continue
        chain = chain.concat(cand.slice(1))
      } else if (near(chain[0], cand[cand.length - 1])) {
        if (revisits(chain, cand[0])) continue
        chain = cand.slice(0, -1).concat(chain)
      } else {
        continue
      }
      rest.splice(i, 1)
      changed = true
      break
    }
  }
}

const inside = (p) =>
  p[0] >= B.lonMin && p[0] <= B.lonMax && p[1] >= B.latMin && p[1] <= B.latMax
const toMap = (lon, lat) => ({
  x: ((lon - B.lonMin) / (B.lonMax - B.lonMin)) * 2 - 1,
  z: ((B.latMax - lat) / (B.latMax - B.latMin)) * 2 - 1,
})

// Clip to the world, interpolating the point where the course crosses the edge
// so the line starts exactly at the border rather than a segment short of it.
const clipped = []
for (let i = 0; i < chain.length; i++) {
  const p = chain[i]
  if (!inside(p)) continue
  if (!clipped.length && i > 0) {
    const q = chain[i - 1]
    const edge = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
    const t =
      p[0] !== q[0]
        ? (edge(q[0], B.lonMin, B.lonMax) - q[0]) / (p[0] - q[0])
        : (edge(q[1], B.latMin, B.latMax) - q[1]) / (p[1] - q[1] || 1)
    if (t > 0 && t < 1) clipped.push([q[0] + t * (p[0] - q[0]), q[1] + t * (p[1] - q[1])])
  }
  clipped.push(p)
}
if (clipped.length < 2) {
  console.error(`"${riverName}" does not cross this world's bounding box`)
  process.exit(1)
}

// The heightmap this world actually renders, to check the course against.
const png = PNG.sync.read(fs.readFileSync(path.join(ROOT, 'scripts', preset.out)))
const heightAt = (x, z) => {
  const px = Math.round(((x + 1) / 2) * (png.width - 1))
  const py = Math.round(((z + 1) / 2) * (png.height - 1))
  return png.data[(py * png.width + px) * 4] / 255
}

/** Ground distance between two lon/lat points, in km. */
const km = (a, b) => {
  const mid = ((a[1] + b[1]) / 2) * (Math.PI / 180)
  const dx = (a[0] - b[0]) * Math.cos(mid) * 111.32
  const dy = (a[1] - b[1]) * 110.57
  return Math.hypot(dx, dy)
}

// Thin on the ground, then convert; the map's own units mean different distances
// in different worlds and cannot be compared to a spacing.
const keptLL = [clipped[0]]
for (const p of clipped.slice(1)) {
  if (km(p, keptLL[keptLL.length - 1]) > SPACING_KM) keptLL.push(p)
}
// The last kept point may fall short of the mouth; end exactly at it, without
// duplicating it when the thinning already landed there.
const last = clipped[clipped.length - 1]
if (km(last, keptLL[keptLL.length - 1]) > 0.001) keptLL.push(last)
const points = keptLL.map((p) => toMap(p[0], p[1]))

const hs = points.map((p) => heightAt(p.x, p.z))
const rises = hs.reduce((n, h, i) => n + (i > 0 && h > hs[i - 1] + 0.02 ? 1 : 0), 0)
console.error(
  `\n${riverName} across "${presetName}" (${fromWhich}): ` +
    `${clipped.length} source points -> ${points.length} kept`,
)
// Report the ENDS OF THE KEPT COURSE, not of the raw clip: an earlier version
// printed the raw ends and so cheerfully reported a mouth that the thinning had
// already cut off 150 km short.
const back = (p) => ({
  lon: B.lonMin + ((p.x + 1) / 2) * (B.lonMax - B.lonMin),
  lat: B.latMax - ((p.z + 1) / 2) * (B.latMax - B.latMin),
})
const a0 = back(points[0])
const a1 = back(points[points.length - 1])
console.error(
  `  runs from ${a0.lon.toFixed(3)}E ${a0.lat.toFixed(3)}N` +
    ` to ${a1.lon.toFixed(3)}E ${a1.lat.toFixed(3)}N`,
)
console.error(
  `  height along it: starts ${hs[0].toFixed(3)}, ends ${hs[hs.length - 1].toFixed(3)}, ` +
    `max ${Math.max(...hs).toFixed(3)}; ${rises} steps climb by more than 0.02`,
)

const fmt = (p) => `{ x: ${p.x.toFixed(4)}, z: ${p.z.toFixed(4)} }`
const lines = []
for (let i = 0; i < points.length; i += 3) {
  lines.push('          ' + points.slice(i, i + 3).map(fmt).join(', ') + ',')
}
console.log(lines.join('\n'))
