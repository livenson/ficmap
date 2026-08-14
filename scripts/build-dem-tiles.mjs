#!/usr/bin/env node
/**
 * Cut a finer elevation layer for a DEM preset and write it as tiles the app
 * fetches only for the part of the map the camera is over.
 *
 * The whole-Earth map is 3072x1536 for 360° by 140° — about 13 km per pixel.
 * Peer Gynt's Norway is 1.3 km per pixel, which is why it reads crisply and the
 * world map does not, and no amount of extra geometry closes that gap: past the
 * heightmap's own resolution a finer mesh stops resolving ground and starts
 * resolving the creases in its interpolation. The fix is more data.
 *
 * Matching Peer Gynt globally would be ~160 MB. This cuts one step: `scale`
 * times the base grid, which for the world map is 12288x6144 (~3.3 km/px, five
 * times sharper), split into tiles so a reader downloads only the few covering
 * what they zoomed into.
 *
 * The tiles are cut with EXACTLY the parameters their base map was cut with —
 * same cap, same floor, same flattened ocean, same pinned metre range — so a
 * tile's bytes mean the same elevations the base map's do. `scale` is an
 * integer, so a tile pixel nests inside a base pixel rather than straddling two.
 *
 * A tile whose elevations are all one value is not written: flat ocean is
 * exactly what the base map already draws, and most of the globe is that. The
 * manifest lists only what exists, so the app knows not to ask for the rest.
 *
 * The run is resumable — tiles already on disk are left alone unless --force —
 * because fetching the source for a whole globe takes a while.
 *
 * Requires network access. Terrarium tiles are DEM data © Mapzen/AWS Terrain
 * Tiles (public).
 *
 * Usage:
 *   node scripts/build-dem-tiles.mjs world
 *   node scripts/build-dem-tiles.mjs world --scale 4 --tile 512
 *   node scripts/build-dem-tiles.mjs world --rows 5-8      # just those tile rows
 */
import { PNG } from 'pngjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------- arguments
const FLAGS = new Map()
const POSITIONAL = []
for (let i = 0; i < process.argv.length - 2; i++) {
  const a = process.argv[i + 2]
  if (a.startsWith('--')) FLAGS.set(a.slice(2), process.argv[i + 3]), i++
  else POSITIONAL.push(a)
}
const flag = (name, fallback) => (FLAGS.has(name) ? FLAGS.get(name) : fallback)

const NAME = POSITIONAL[0] ?? 'world'
const preset = PRESETS[NAME]
if (!preset) {
  console.error(`unknown preset "${NAME}"; try: ${Object.keys(PRESETS).join(', ')}`)
  process.exit(1)
}
if (preset.minM == null || preset.maxM == null) {
  console.error(
    `preset "${NAME}" has no pinned minM/maxM. Its bytes mean whatever its own\n` +
      `data happened to contain, so tiles cut from it would not agree with it.\n` +
      `Pin the range in scripts/dem-presets.mjs first (see check-dem-scale.mjs).`,
  )
  process.exit(1)
}

const SCALE = Number(flag('scale', 4))
const TILE = Number(flag('tile', 512))
const FORCE = FLAGS.has('force')
const CONCURRENCY = Number(flag('jobs', 12))
const onlyRows = (() => {
  const spec = flag('rows', null)
  if (!spec) return null
  const set = new Set()
  for (const part of spec.split(',')) {
    const [a, b] = part.split('-').map(Number)
    for (let r = a; r <= (b ?? a); r++) set.add(r)
  }
  return set
})()

const BBOX = preset.bbox
const W = (preset.w ?? 256) * SCALE
const H = (preset.h ?? 256) * SCALE
if (W % TILE || H % TILE) {
  console.error(`${W}x${H} does not divide into ${TILE}px tiles; pick another --tile`)
  process.exit(1)
}
const COLS = W / TILE
const ROWS = H / TILE

/**
 * The Terrarium zoom that actually holds this much detail.
 *
 * Not the preset's own zoom shifted by `scale`: what matters is that the source
 * has at least as many pixels per degree as the grid being written, or the
 * tiles would be an interpolation of data no sharper than the base map's and
 * all this would buy nothing. z6 is 16,384 px around the globe, which covers a
 * 12,288 px world grid with room to spare.
 */
const TS = 256
const needPerDeg = W / (BBOX.lonMax - BBOX.lonMin)
const Z = Number(flag('z', Math.ceil(Math.log2((needPerDeg * 360) / TS))))
const worldPx = TS * 2 ** Z

const OUT_DIR = path.join(ROOT, 'public', 'dem', NAME)
fs.mkdirSync(OUT_DIR, { recursive: true })

const kmPerPx = ((BBOX.lonMax - BBOX.lonMin) / W) * 111
console.log(
  `${NAME}: ${W}x${H} (${SCALE}x the base, ~${kmPerPx.toFixed(2)} km/px) ` +
    `→ up to ${COLS}x${ROWS} tiles of ${TILE}px`,
)
console.log(
  `source Terrarium z${Z} (${worldPx} px around the globe, ` +
    `${(worldPx / 360 / needPerDeg).toFixed(2)}x what this grid needs)`,
)
console.log(`elevations scaled over the base map's pinned ${preset.minM}..${preset.maxM} m\n`)

// ------------------------------------------------------------ source tiles
const clampTile = (t) => Math.max(0, Math.min(2 ** Z - 1, t))
/** One band of source rows, held only while the output row that needs it is cut. */
let band = new Map()

async function fetchTile(tx, ty) {
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`
  let last
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const png = PNG.sync.read(Buffer.from(await res.arrayBuffer()))
      const m = new Float32Array(TS * TS)
      for (let i = 0; i < TS * TS; i++)
        m[i] = png.data[i * 4] * 256 + png.data[i * 4 + 1] + png.data[i * 4 + 2] / 256 - 32768
      return m
    } catch (e) {
      last = e
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt))
    }
  }
  throw new Error(`failed to fetch ${url}: ${last?.message}`)
}

/** Fetch every source tile in a row range, a few at a time. */
async function loadBand(ty0, ty1) {
  band = new Map()
  const want = []
  for (let ty = ty0; ty <= ty1; ty++)
    for (let tx = 0; tx < 2 ** Z; tx++) want.push([tx, ty])
  for (let i = 0; i < want.length; i += CONCURRENCY) {
    const slice = want.slice(i, i + CONCURRENCY)
    const got = await Promise.all(slice.map(([tx, ty]) => fetchTile(tx, ty)))
    slice.forEach(([tx, ty], k) => band.set(`${tx}/${ty}`, got[k]))
  }
}

/** Elevation at a global source pixel, bilinear, wrapping around the globe. */
function elevAt(gx, gy) {
  const x0 = Math.floor(gx)
  const y0 = Math.floor(gy)
  const fx = gx - x0
  const fy = gy - y0
  const at = (x, y) => {
    const cx = ((x % worldPx) + worldPx) % worldPx
    const cy = Math.max(0, Math.min(worldPx - 1, y))
    const t = band.get(`${clampTile(Math.floor(cx / TS))}/${clampTile(Math.floor(cy / TS))}`)
    if (!t) throw new Error(`source pixel ${cx},${cy} outside the loaded band`)
    return t[(cy % TS) * TS + (cx % TS)]
  }
  const a = at(x0, y0)
  const b = at(x0 + 1, y0)
  const c = at(x0, y0 + 1)
  const d = at(x0 + 1, y0 + 1)
  return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy
}

// ------------------------------------------------------------- the shaping
// The same steps the base map applies, in the same order, over the same pinned
// range. Any divergence shows up as a step where a tile meets the base, which
// is what `check-dem-tiles.mjs` measures.
const SEA_M = preset.seaM ?? 0
const SEA = (SEA_M - preset.minM) / (preset.maxM - preset.minM)
const shape = (g) => {
  if (!preset.landGamma || g <= SEA) return g
  return SEA + Math.pow((g - SEA) / (1 - SEA), preset.landGamma) * (1 - SEA)
}
function shapeMetres(m) {
  m = Math.max(m, preset.floorM ?? -60)
  if (preset.capM) m = Math.min(m, preset.capM)
  if (preset.flatOceanM != null && m < 0) m = preset.flatOceanM
  if (preset.seaM != null && m <= preset.seaM) m = preset.seaM - 6
  return m
}
const toByte = (m) => {
  const g = Math.max(0, Math.min(1, (m - preset.minM) / (preset.maxM - preset.minM)))
  return Math.round(shape(g) * 255)
}

// Lakes are deliberately NOT carved here: the base map takes them from Natural
// Earth polygons, which have no more detail to give at this scale, and a tile
// that carved them differently would disagree with the base at its edge.
if (preset.lakes) {
  console.warn(`!! ${NAME} carves lake polygons into its base map; tiles do not.`)
  console.warn(`   Expect tiles to disagree with the base over inland water.\n`)
}

// ------------------------------------------------------------------- cut it
const srcY = (lat) => ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * worldPx
const latAt = (gy) => BBOX.latMax - (gy / (H - 1)) * (BBOX.latMax - BBOX.latMin)
const lonAt = (gx) => BBOX.lonMin + (gx / (W - 1)) * (BBOX.lonMax - BBOX.lonMin)

const manifest = {
  bbox: BBOX,
  scale: SCALE,
  tile: TILE,
  cols: COLS,
  rows: ROWS,
  width: W,
  height: H,
  minM: preset.minM,
  maxM: preset.maxM,
  tiles: [],
}

let written = 0
let flat = 0
let kept = 0
let bytes = 0
const started = Date.now()

for (let ty = 0; ty < ROWS; ty++) {
  if (onlyRows && !onlyRows.has(ty)) continue

  // The source rows this band of output needs, with a row of slack each side
  // for the bilinear tap.
  const top = srcY(latAt(ty * TILE))
  const bottom = srcY(latAt(Math.min(H - 1, (ty + 1) * TILE)))
  const ty0 = clampTile(Math.floor(top / TS) - 1)
  const ty1 = clampTile(Math.floor(bottom / TS) + 1)
  await loadBand(ty0, ty1)

  for (let tx = 0; tx < COLS; tx++) {
    const file = `${tx}_${ty}.png`
    const dest = path.join(OUT_DIR, file)
    if (!FORCE && fs.existsSync(dest)) {
      manifest.tiles.push(`${tx}_${ty}`)
      kept++
      continue
    }
    const png = new PNG({ width: TILE, height: TILE })
    let lo = 255
    let hi = 0
    for (let py = 0; py < TILE; py++) {
      const sy = srcY(latAt(ty * TILE + py))
      for (let px = 0; px < TILE; px++) {
        const sx = ((lonAt(tx * TILE + px) + 180) / 360) * worldPx
        const g = toByte(shapeMetres(elevAt(sx, sy)))
        const k = (py * TILE + px) * 4
        png.data[k] = png.data[k + 1] = png.data[k + 2] = g
        png.data[k + 3] = 255
        if (g < lo) lo = g
        if (g > hi) hi = g
      }
    }
    if (lo === hi) {
      flat++
      continue
    }
    const buf = PNG.sync.write(png)
    fs.writeFileSync(dest, buf)
    manifest.tiles.push(`${tx}_${ty}`)
    written++
    bytes += buf.length
  }
  band = new Map()
  const mins = (Date.now() - started) / 60000
  console.log(
    `row ${String(ty + 1).padStart(2)}/${ROWS}  ` +
      `${written} written, ${kept} kept, ${flat} flat  ` +
      `${(bytes / 1e6).toFixed(1)} MB  ${mins.toFixed(1)} min`,
  )
}

manifest.tiles.sort()
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest))
console.log(
  `\n${written} tiles written, ${kept} already present, ${flat} skipped as flat` +
    `\n${(bytes / 1e6).toFixed(1)} MB new in public/dem/${NAME}/`,
)
