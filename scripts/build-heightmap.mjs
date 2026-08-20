#!/usr/bin/env node
/**
 * Build a grayscale heightmap PNG from public Terrarium DEM tiles.
 *
 * Fetches the elevation tiles covering a lon/lat bounding box, stitches them,
 * samples the box (equirectangular) into a W×H grid, normalizes to 0..255 and
 * writes a PNG the app can load as `terrain.heightmap`. Also prints the
 * sea-level fraction to set as `terrain.seaLevel`.
 *
 * Requires network access and `pngjs` (npm i -D pngjs).
 *
 * Usage:
 *   node scripts/build-heightmap.mjs                 # Estonia (Kalevipoeg)
 *   node scripts/build-heightmap.mjs france          # France + England (Musketeers)
 *   node scripts/build-heightmap.mjs world           # whole Earth (Verne)
 *
 * Terrarium tiles are DEM data © Mapzen/AWS Terrain Tiles (public).
 */
import { PNG } from 'pngjs'
import fs from 'fs'
import { PRESETS } from './dem-presets.mjs'

const preset = PRESETS[process.argv[2] ?? 'estonia']
if (!preset) {
  console.error(`unknown preset "${process.argv[2]}"; try: ${Object.keys(PRESETS).join(', ')}`)
  process.exit(1)
}
const Z = preset.z
const BBOX = preset.bbox
const W = preset.w ?? 256
const H = preset.h ?? 256
const OUT = new URL(preset.out, import.meta.url)

// Depth (metres) to carve real lake bodies to, so they render as inland water.
const LAKE_M = -4
const LAKES_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson'

/**
 * Fetch Natural Earth lake polygons that overlap the bbox and pre-compute each
 * ring's bounding box for a fast reject. Returns polygons as {rings, bb}, where
 * rings[0] is the outer ring and the rest are holes (islands).
 */
async function loadLakes(bbox) {
  const gj = await (await fetch(LAKES_URL)).json()
  const polys = []
  const overlaps = (bb) =>
    bb[0] <= bbox.lonMax && bb[2] >= bbox.lonMin && bb[1] <= bbox.latMax && bb[3] >= bbox.latMin
  const ringBB = (ring) => {
    let a = [Infinity, Infinity, -Infinity, -Infinity]
    for (const [x, y] of ring) {
      if (x < a[0]) a[0] = x
      if (y < a[1]) a[1] = y
      if (x > a[2]) a[2] = x
      if (y > a[3]) a[3] = y
    }
    return a
  }
  for (const f of gj.features) {
    const g = f.geometry
    if (!g) continue
    const parts = g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : []
    for (const rings of parts) {
      const bb = ringBB(rings[0])
      if (overlaps(bb)) polys.push({ rings, bb })
    }
  }
  return polys
}

function pointInRing(lon, lat, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1],
      xj = ring[j][0],
      yj = ring[j][1]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function inLake(lon, lat, polys) {
  for (const p of polys) {
    const bb = p.bb
    if (lon < bb[0] || lon > bb[2] || lat < bb[1] || lat > bb[3]) continue
    if (!pointInRing(lon, lat, p.rings[0])) continue
    let hole = false
    for (let h = 1; h < p.rings.length; h++)
      if (pointInRing(lon, lat, p.rings[h])) {
        hole = true
        break
      }
    if (!hole) return true
  }
  return false
}

const lakePolys = preset.lakes ? await loadLakes(BBOX) : null
if (lakePolys) console.log(`carving ${lakePolys.length} lake polygons`)

const TS = 256
const lon2tx = (lon) => Math.floor(((lon + 180) / 360) * 2 ** Z)
const lat2ty = (lat) => {
  const r = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * 2 ** Z)
}
const clampTile = (t) => Math.max(0, Math.min(2 ** Z - 1, t))
const TX0 = clampTile(lon2tx(BBOX.lonMin)),
  TX1 = clampTile(lon2tx(BBOX.lonMax))
const TY0 = clampTile(lat2ty(BBOX.latMax)),
  TY1 = clampTile(lat2ty(BBOX.latMin))
const NX = TX1 - TX0 + 1,
  NY = TY1 - TY0 + 1
const SW = NX * TS,
  SH = NY * TS
const elev = new Float32Array(SW * SH)

console.log(`fetching ${NX}x${NY} tiles at z${Z}…`)
for (let ty = 0; ty < NY; ty++) {
  for (let tx = 0; tx < NX; tx++) {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${TX0 + tx}/${TY0 + ty}.png`
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
    const png = PNG.sync.read(buf)
    for (let py = 0; py < TS; py++)
      for (let px = 0; px < TS; px++) {
        const i = (py * TS + px) * 4
        const m = png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256 - 32768
        elev[(ty * TS + py) * SW + (tx * TS + px)] = m
      }
  }
}

const worldPx = TS * 2 ** Z
const sample = (sx, sy) => {
  sx = Math.max(0, Math.min(SW - 1.001, sx))
  sy = Math.max(0, Math.min(SH - 1.001, sy))
  const x0 = Math.floor(sx),
    y0 = Math.floor(sy),
    fx = sx - x0,
    fy = sy - y0
  const a = elev[y0 * SW + x0],
    b = elev[y0 * SW + x0 + 1],
    c = elev[(y0 + 1) * SW + x0],
    d = elev[(y0 + 1) * SW + x0 + 1]
  return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy
}

const out = new Float32Array(W * H)
let mn = Infinity,
  mx = -Infinity
for (let j = 0; j < H; j++)
  for (let i = 0; i < W; i++) {
    const lon = BBOX.lonMin + (i / (W - 1)) * (BBOX.lonMax - BBOX.lonMin)
    const lat = BBOX.latMax - (j / (H - 1)) * (BBOX.latMax - BBOX.latMin)
    const gpx = ((lon + 180) / 360) * worldPx
    const gpy = ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * worldPx
    let m = Math.max(sample(gpx - TX0 * TS, gpy - TY0 * TS), preset.floorM ?? -60)
    if (preset.capM) m = Math.min(m, preset.capM)
    // Optionally flatten the whole sea to one depth for an even ocean colour.
    if (preset.flatOceanM != null && m < 0) m = preset.flatOceanM
    // Inland worlds have no sea: `seaM` names the elevation of the water — a
    // lake surface, which a DEM records as a flat plateau — and everything at
    // or below it is carved just under, so it renders as water.
    if (preset.seaM != null && m <= preset.seaM) m = preset.seaM - 6
    // Carve real inland lakes below sea level so they render as water.
    //
    // `lakeMaxM` bounds which ones. The engine draws ONE water plane, at
    // `seaLevel`, so the only way to make a lake read as water is to sink it to
    // the waterline — which is fine for a lake that is already near it, and
    // punches a hole straight through the map for one that is not. The Journey
    // to the West box holds Nam Co, Siling Co and Yamzho Yumco at about 4,600 m
    // on the Tibetan plateau; carved to -4 m they came out as six black pits in
    // the plateau rather than as lakes. Above the limit the DEM's own reading is
    // kept, which is a flat pan at the lake's real surface — less true than a
    // lake and much less wrong than a shaft.
    if (
      lakePolys &&
      m > LAKE_M &&
      (preset.lakeMaxM == null || m <= preset.lakeMaxM) &&
      inLake(lon, lat, lakePolys)
    )
      m = LAKE_M
    out[j * W + i] = m
    if (m < mn) mn = m
    if (m > mx) mx = m
  }

/**
 * The metre range that maps onto 0..255.
 *
 * By default it is whatever the sampled grid happened to contain, which is fine
 * for a map built once and never subdivided. A preset that will later be cut
 * into detail tiles must pin it instead: a tile sees only its own corner of the
 * world and would observe quite different extremes, so the same elevation would
 * come out as a different byte in the tile than in the base map, and the two
 * would disagree wherever they meet.
 */
const MIN_M = preset.minM ?? mn
const MAX_M = preset.maxM ?? mx
if (preset.minM != null && (mn < MIN_M || mx > MAX_M)) {
  console.warn(
    `!! data runs ${mn.toFixed(1)}..${mx.toFixed(1)} m but the range is pinned to ` +
      `${MIN_M}..${MAX_M}; values outside are clamped`,
  )
}

// Where the waterline sits once the range is normalized: 0 m for a coastal
// world, or the named lake surface for an inland one.
const SEA_M = preset.seaM ?? 0
const SEA = (SEA_M - MIN_M) / (MAX_M - MIN_M)

/**
 * Optional hypsometric exaggeration of the LAND only.
 *
 * A country as flat as Latvia has a problem the Alps do not: Rīga stands about
 * 13 m above the sea in a DEM whose range is several hundred metres, so the
 * coastal plain lands a hair above the shoreline and the rendered water plane
 * swallows it. A gamma below 1 lifts low ground far more than high ground,
 * pulling the lowlands clear of the sea while leaving the coastline itself
 * exactly where the DEM puts it (the sea fraction is untouched).
 */
const shape = (g) => {
  if (!preset.landGamma || g <= SEA) return g
  return SEA + Math.pow((g - SEA) / (1 - SEA), preset.landGamma) * (1 - SEA)
}

const png = new PNG({ width: W, height: H })
const norm = (m) => Math.max(0, Math.min(1, (m - MIN_M) / (MAX_M - MIN_M)))
for (let k = 0; k < W * H; k++) {
  const g = Math.round(shape(norm(out[k])) * 255)
  png.data[k * 4] = g
  png.data[k * 4 + 1] = g
  png.data[k * 4 + 2] = g
  png.data[k * 4 + 3] = 255
}
fs.writeFileSync(OUT, PNG.sync.write(png))
console.log(`wrote ${OUT.pathname} (${W}x${H})`)
console.log(
  `data ${mn.toFixed(1)}..${mx.toFixed(1)} m, scaled over ${MIN_M}..${MAX_M}` +
    `${preset.minM != null ? ' (pinned)' : ''} → set terrain.seaLevel = ${SEA.toFixed(4)}`,
)
if (preset.landGamma) {
  const at = (m) => shape(norm(m)).toFixed(3)
  console.log(`landGamma=${preset.landGamma}: 5m→${at(5)} 20m→${at(20)} 60m→${at(60)} 150m→${at(150)} 300m→${at(300)}`)
}
