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
/**
 * Only the parts anywhere near this world.
 *
 * Merging every feature of a name was the fix for the Tagus, which Natural
 * Earth splits in two — and it over-corrected. River names are not unique:
 * asking for the White River that joins the Yukon also collected the White
 * Rivers of Indiana, Arkansas, Vermont and South Dakota, the stitcher chained
 * whichever was longest, and the result was a course three thousand kilometres
 * from the map, reported as "does not cross this world's bounding box".
 *
 * A degree of margin lets a segment that only clips the corner still be
 * chained; anything further away is a different river with the same name.
 */
const MARGIN = 1
const nearBox = (p) =>
  p[0] >= B.lonMin - MARGIN &&
  p[0] <= B.lonMax + MARGIN &&
  p[1] >= B.latMin - MARGIN &&
  p[1] <= B.latMax + MARGIN

const allParts = features
  .flatMap((f) =>
    f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [f.geometry.coordinates],
  )
  .filter((s) => s.length >= 2)
const parts = allParts.filter((s) => s.some(nearBox))
if (!parts.length) {
  console.error(`no part of "${riverName}" comes near this world's bounding box`)
  process.exit(1)
}
if (parts.length < allParts.length) {
  console.error(
    `  (${allParts.length - parts.length} of ${allParts.length} "${riverName}" segments are ` +
      `elsewhere in the world and were dropped)`,
  )
}
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
 *
 * SKIP THE JOINT. The few chain points nearest the join are excluded — the tail
 * when appending, the HEAD when prepending, which the first version of this got
 * wrong and so left the Yukon exactly as broken as before. This is because
 * Natural Earth stitches long rivers with tiny connector stubs — the Yukon has
 * four of two to four points each, spanning about 0.03 degrees, sitting exactly
 * where its upper and lower halves meet. A stub is shorter than the tolerance,
 * so its far end lands within 0.05 of the joint that was just made and the
 * guard rejected it as a doubling-back. That cost the Yukon its entire upper
 * course: Bennett to Fort Selkirk, which is the first half of the journey every
 * story on that map makes. An alternate channel worth rejecting is kilometres
 * long and lands far back down the chain, so a five-point window loses nothing.
 */
const JOINT = 5
const revisits = (chain, tip, at) =>
  (at === 'head' ? chain.slice(JOINT) : chain.slice(0, Math.max(0, chain.length - JOINT))).some(
    (p) => near(p, tip, 0.05),
  )
const rest = parts.slice().sort((a, b) => b.length - a.length)
let chain = rest.shift()
for (let changed = true; changed && rest.length; ) {
  changed = false
  for (let i = 0; i < rest.length && !changed; i++) {
    for (const cand of [rest[i], rest[i].slice().reverse()]) {
      if (near(chain[chain.length - 1], cand[0])) {
        if (revisits(chain, cand[cand.length - 1], 'tail')) continue
        chain = chain.concat(cand.slice(1))
      } else if (near(chain[0], cand[cand.length - 1])) {
        if (revisits(chain, cand[0], 'head')) continue
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
const clipToBox = (line) => {
  const out = []
  for (let i = 0; i < line.length; i++) {
    const p = line[i]
    if (!inside(p)) continue
    if (!out.length && i > 0) {
      const q = line[i - 1]
      const edge = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
      const t =
        p[0] !== q[0]
          ? (edge(q[0], B.lonMin, B.lonMax) - q[0]) / (p[0] - q[0])
          : (edge(q[1], B.latMin, B.latMax) - q[1]) / (p[1] - q[1] || 1)
      if (t > 0 && t < 1) out.push([q[0] + t * (p[0] - q[0]), q[1] + t * (p[1] - q[1])])
    }
    out.push(p)
  }
  return out
}
let clipped = clipToBox(chain)
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

/**
 * Point the course downhill.
 *
 * There was no orientation step here at all until the White River: the finished
 * chain ran whichever way the greedy stitching happened to leave it, and every
 * river in the atlas came out source-to-mouth by luck, because Natural Earth
 * mostly stores its longest segment that way. `check-rivers` was carrying the
 * whole load — it reports "CLIMBS ... points reversed?" and it is what caught
 * the White, which came out mouth-first and so appeared to run uphill into the
 * hills and stop.
 *
 * A builder that can only be trusted because a checker exists is the wrong way
 * round. This makes the course satisfy that check by construction, using the
 * same end-to-end test the check applies: if the last point stands higher than
 * the first, turn it round. Verified against every course already committed —
 * all of them come out byte-identical, because all of them were already right.
 */
{
  const a = toMap(clipped[0][0], clipped[0][1])
  const b = toMap(clipped[clipped.length - 1][0], clipped[clipped.length - 1][1])
  if (heightAt(b.x, b.z) > heightAt(a.x, a.z)) {
    clipped.reverse()
    // The unclipped chain goes with it: the delta repair below walks downstream
    // from the chain's tail, and needs the two to agree on which end that is.
    chain.reverse()
    console.error(`  (course was mouth-first in the source; turned downhill)`)
  }
}

/**
 * At a delta, take a channel that reaches the sea.
 *
 * The stitcher above is greedy: where several channels leave one node it takes
 * whichever segment is longest and never reconsiders. On a river with a mouth
 * that is fine, because there is only ever one way on. On a river with a DELTA
 * it is a coin toss, and the Ganges lost it — the chain went down a Sundarbans
 * channel that dead-ends at 90.01E 22.49N, 88 km from any water on the Journey
 * to the West map, while four other leaves of the same feature reach it. The
 * course was left off that world entirely rather than drawn stopping in a field.
 *
 * This is the third thing `check-rivers` was carrying that the builder should
 * do by construction, after orientation and after the braid guard. The rule is
 * the check's own: a course may end at water, or at the edge of the map. If the
 * chain's tail does neither and some UNUSED segment can be walked from the chain
 * to a point that does, take that route — truncating the chain at the branch and
 * appending the path, choosing the option that changes the course least
 * (truncated length + appended length).
 *
 * It cannot fire on a river that already ends properly, which is every other
 * course in this atlas: 26 of the 27 committed courses come out byte-identical.
 * It also cannot invent geometry — everything it appends is a segment of the
 * same named feature that the greedy pass simply did not use.
 *
 * It does NOT rescue a river whose data stops short of the sea altogether. The
 * Qiantang has no lower course in this source under any name, so there is
 * nothing to walk to and nothing changes.
 */
const MOUTH_KM = 10
{
  const midLat = ((B.latMin + B.latMax) / 2) * (Math.PI / 180)
  const KM_X = ((B.lonMax - B.lonMin) * 111.32 * Math.cos(midLat)) / 2
  const KM_Z = ((B.latMax - B.latMin) * 110.9) / 2
  /**
   * The waterline, as a fraction of the byte range.
   *
   * Pinned presets state it exactly, which is where the story's own `seaLevel`
   * comes from. For the rest the darkest byte in the map is the sea, because
   * `flatOceanM` flattens the whole ocean to one depth; on a preset with no sea
   * at all that is simply the lowest ground, and the +0.02 below then makes this
   * test generous rather than wrong — a course that ends inland on such a map
   * ends at the box edge anyway, and the repair never runs.
   */
  let minByte = 255
  for (let i = 0; i < png.width * png.height; i++)
    if (png.data[i * 4] < minByte) minByte = png.data[i * 4]
  const seaFrac =
    preset.minM != null ? (0 - preset.minM) / (preset.maxM - preset.minM) : minByte / 255

  // Both tests mirror `check-rivers` exactly; see the comments there.
  const waterNear = (x, z) => {
    let lo = heightAt(x, z)
    const stepX = MOUTH_KM / KM_X / 8
    const stepZ = MOUTH_KM / KM_Z / 8
    for (let i = -8; i <= 8; i++)
      for (let j = -8; j <= 8; j++) {
        if (Math.hypot(i / 8, j / 8) > 1) continue
        lo = Math.min(lo, heightAt(x + i * stepX, z + j * stepZ))
      }
    return lo
  }
  const endsWell = (ll) => {
    const m = toMap(ll[0], ll[1])
    if (Math.abs(m.x) > 0.985 || Math.abs(m.z) > 0.985) return true
    return waterNear(m.x, m.z) <= seaFrac + 0.02
  }

  const tail = clipped[clipped.length - 1]
  if (rest.length && !endsWell(tail)) {
    /** Ground length of a polyline, in km. */
    const lengthOf = (line) => {
      let t = 0
      for (let i = 1; i < line.length; i++) t += km(line[i - 1], line[i])
      return t
    }
    // Cluster every unused segment's ends into nodes, so a channel that meets
    // another at a vertex a few metres off still counts as meeting it.
    const nodes = []
    const nodeOf = (pt) => {
      for (let i = 0; i < nodes.length; i++) if (near(nodes[i], pt)) return i
      nodes.push(pt)
      return nodes.length - 1
    }
    const edges = rest.map((seg) => ({
      a: nodeOf(seg[0]),
      b: nodeOf(seg[seg.length - 1]),
      pts: seg,
      len: lengthOf(seg),
    }))

    // Dijkstra from every point of the chain at once, paying for the length of
    // chain that branching there would throw away.
    const best = new Map() // node -> { cost, path (lon/lat points), cutAt (chain index) }
    const queue = []
    let tailward = 0
    for (let i = chain.length - 1; i >= 0; i--) {
      if (i < chain.length - 1) tailward += km(chain[i], chain[i + 1])
      const n = nodes.findIndex((p) => near(p, chain[i]))
      if (n < 0) continue
      const prev = best.get(n)
      if (!prev || tailward < prev.cost) {
        best.set(n, { cost: tailward, path: [], cutAt: i })
        queue.push(n)
      }
    }
    while (queue.length) {
      queue.sort((x, y) => best.get(x).cost - best.get(y).cost)
      const n = queue.shift()
      const here = best.get(n)
      for (const e of edges) {
        const to = e.a === n ? e.b : e.b === n ? e.a : -1
        if (to < 0) continue
        const step = e.a === n ? e.pts : e.pts.slice().reverse()
        const cost = here.cost + e.len
        const prev = best.get(to)
        if (prev && prev.cost <= cost) continue
        best.set(to, { cost, path: here.path.concat(step.slice(1)), cutAt: here.cutAt })
        queue.push(to)
      }
    }

    /**
     * Prefer an END of a channel over a junction in the middle of one.
     *
     * Minimising the change alone stops at the first node that happens to be
     * within ten kilometres of water, which in a delta is a fork with two more
     * channels leaving it — a river drawn to a junction and then stopping. A
     * node with one unused edge is the end of the water, so that is a mouth;
     * cost only breaks ties among those. A junction is still accepted if no leaf
     * reaches water at all.
     */
    const degree = (n) => edges.filter((e) => e.a === n || e.b === n).length
    let pick = null
    let pickLeaf = false
    for (const [n, cand] of best) {
      if (!cand.path.length) continue
      if (!endsWell(nodes[n])) continue
      const leaf = degree(n) === 1
      if (!pick || (leaf && !pickLeaf) || (leaf === pickLeaf && cand.cost < pick.cost)) {
        pick = cand
        pickLeaf = leaf
      }
    }
    if (pick) {
      const dropped = chain.length - 1 - pick.cutAt
      chain = chain.slice(0, pick.cutAt + 1).concat(pick.path)
      clipped = clipToBox(chain)
      console.error(
        `  (the greedy chain ended ${dropped} point(s) down a channel that reaches nothing; ` +
          `took a branch to water instead, ${pick.path.length} point(s) long)`,
      )
    }
  }
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
