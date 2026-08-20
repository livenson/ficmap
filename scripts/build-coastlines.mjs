#!/usr/bin/env node
/**
 * Cut the world-map picker's coastlines from Natural Earth, as SVG paths.
 *
 * The picker needs a map to put pins on. The obvious candidate was already in
 * the repo — `src/assets/world-height.png`, the whole-Earth DEM — and it is the
 * wrong tool: 2.5 MB for a popup, a photographic grey that fights the flat
 * house palette, and no way to recolour it for a dark or light panel. Coastline
 * geometry is about 3% of that, scales to any size without blurring, and takes
 * whatever colour the theme gives it.
 *
 * Two projections come out of one source, because one map cannot do this job.
 * At popup size the atlas's twenty-odd European worlds collide — Švejk and
 * Ottokar land 2.3 px apart on a 640-wide world map, and central Europe reads
 * as a single blob — so the picker draws a world map plus a blown-up Europe
 * inset, which is what a printed atlas does for the same reason.
 *
 * Both are plain equirectangular: x = (lon - lonMin) / span, y = (latMax - lat)
 * / span, in a 0..1 box that the component scales. No projection library, and
 * none needed — at this size the distortion is a design choice rather than an
 * error, and it keeps the pin maths in the component a single line.
 *
 * SIZE. The full 110m land layer is 138 KB of JSON. What ships is the path data
 * only, coordinates rounded (see PRECISION) and rings under MIN_RING dropped,
 * which is what takes it under 40 KB. The dropped rings are small islands —
 * this is a picker, not a chart, and no world in the atlas is pinned to one.
 *
 * Usage:
 *   node scripts/build-coastlines.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, '.cache', 'ne_110m_land.geojson')
const OUT = path.join(ROOT, 'src', 'assets', 'coastlines.ts')

/**
 * Decimal places kept per coordinate, in projected 0..1 units.
 *
 * 4 places is one part in 10,000 of the panel — a tenth of a pixel on a
 * 1,000-pixel-wide map, so no rounding here is visible at any size the picker
 * is drawn at, while 5 places costs 20% more bytes to say nothing.
 */
const PRECISION = 4
/**
 * Smallest ring kept, as a fraction of the panel's area.
 *
 * Below this a landmass is under half a pixel and draws as a speck of noise.
 * Measured: dropping at 2e-5 takes the world layer from 127 rings to 47 and the
 * file from 96 KB to 34 KB, and the removed rings are all small islands.
 */
const MIN_RING = 2e-5

const VIEWS = {
  // The whole Earth, minus the polar margins nothing is pinned to: Antarctica
  // is a quarter of the height of a full -90..90 map and holds no world, and
  // cropping it lets everything else be drawn half again as large.
  world: { lonMin: -180, lonMax: 180, latMin: -60, latMax: 84 },
  // Europe, sized to hold every European world in the atlas with room to
  // separate: Lisbon to Karelia, Sicily to the North Cape.
  europe: { lonMin: -11, lonMax: 34, latMin: 35, latMax: 71 },
}

const geo = JSON.parse(fs.readFileSync(SRC, 'utf8'))

/** Every outer/inner ring in the layer, flattened. */
const rings = []
for (const f of geo.features) {
  const polys =
    f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates]
  for (const poly of polys) for (const ring of poly) rings.push(ring)
}

/** Shoelace area of a projected ring, in panel units. */
const area = (pts) => {
  let a = 0
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1])
  }
  return Math.abs(a / 2)
}

const build = (view) => {
  const { lonMin, lonMax, latMin, latMax } = view
  const project = ([lon, lat]) => [
    (lon - lonMin) / (lonMax - lonMin),
    (latMax - lat) / (latMax - latMin),
  ]
  const round = (v) => Number(v.toFixed(PRECISION))

  const out = []
  let dropped = 0
  for (const ring of rings) {
    // Clip crudely: keep a ring if any vertex is inside the view, then let the
    // SVG viewBox cut the rest. Good enough because these are coastlines, not
    // data — a ring hanging past the frame is invisible, and true polygon
    // clipping would need to close the cut edges to keep the fill sane.
    if (!ring.some(([lon, lat]) => lon >= lonMin && lon <= lonMax && lat >= latMin && lat <= latMax))
      continue
    const pts = ring.map(project)
    if (area(pts) < MIN_RING) {
      dropped++
      continue
    }
    // Drop consecutive duplicates left by rounding, or the path gains hundreds
    // of zero-length segments that render as nothing and cost bytes.
    const d = []
    let prev = null
    for (const p of pts) {
      const s = `${round(p[0])},${round(p[1])}`
      if (s !== prev) d.push(s)
      prev = s
    }
    if (d.length < 3) continue
    out.push('M' + d.join('L') + 'Z')
  }
  return { path: out.join(''), kept: out.length, dropped }
}

const built = Object.fromEntries(Object.entries(VIEWS).map(([k, v]) => [k, build(v)]))

const lines = [
  '// GENERATED by scripts/build-coastlines.mjs — do not edit by hand.',
  '//',
  '// Coastlines for the world-map world picker, cut from Natural Earth 110m land',
  '// polygons (public domain). Two equirectangular views: the whole Earth, and a',
  '// Europe inset, because at picker size the atlas’s European worlds overlap.',
  '//',
  '// Paths are in a 0..1 box. To place a point: x = (lon - lonMin) / (lonMax -',
  '// lonMin), y = (latMax - lat) / (latMax - latMin), using the same view.',
  '',
  'export interface CoastView {',
  '  lonMin: number',
  '  lonMax: number',
  '  latMin: number',
  '  latMax: number',
  '  /** SVG path data in a 0..1 box. */',
  '  path: string',
  '}',
  '',
]
for (const [name, view] of Object.entries(VIEWS)) {
  const { path: d } = built[name]
  lines.push(`export const ${name}Coast: CoastView = {`)
  lines.push(`  lonMin: ${view.lonMin},`)
  lines.push(`  lonMax: ${view.lonMax},`)
  lines.push(`  latMin: ${view.latMin},`)
  lines.push(`  latMax: ${view.latMax},`)
  lines.push(`  path: '${d}',`)
  lines.push('}')
  lines.push('')
}
fs.writeFileSync(OUT, lines.join('\n'))

for (const [name, b] of Object.entries(built)) {
  console.log(
    `${name}: ${b.kept} rings kept, ${b.dropped} below ${MIN_RING} dropped, ` +
      `${(b.path.length / 1024).toFixed(1)} KB of path data`,
  )
}
console.log(`wrote ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`)
