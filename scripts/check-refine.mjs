#!/usr/bin/env node
/**
 * Check the field that lays detail tiles over a base heightmap.
 *
 * Four things have to hold, and each has its own way of going wrong:
 *
 *   IDENTITY — the field object must never be replaced. Fourteen components
 *   memoize on it, so a new object means every forest re-scatters and every
 *   river re-traces; the reader would watch the world reshuffle whenever a tile
 *   landed. New data arrives as a version bump instead.
 *
 *   AGREEMENT — with no tiles loaded the field must return exactly what the
 *   base map returns, so a world reads correctly from the first frame.
 *
 *   REFINEMENT — with tiles loaded it must return the tiles' finer values, and
 *   sit closer to the real elevation than the base did.
 *
 *   SEAMS — sampling across the join between two tiles must not step. A tap
 *   near a tile's edge needs pixels from the tile next door; reading only
 *   within one tile and clamping at its edge rules a grid of hairlines across
 *   the whole map.
 *
 * Runs against the real tiles in public/dem, so it also proves they decode.
 *
 * Usage:
 *   node scripts/check-refine.mjs world
 */
import esbuild from 'esbuild'
import { PNG } from 'pngjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'node_modules', '.refine-check-bundle.mjs')
const NAME = process.argv[2] ?? 'world'
const preset = PRESETS[NAME]

await esbuild.build({
  stdin: {
    contents: `
      export * from './src/engine/refine.ts'
      export * from './src/engine/heightmap.ts'
    `,
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: OUT,
  logLevel: 'error',
  // heightmap.ts reaches for the DOM to decode an image; only the pure sampler
  // is wanted here.
  define: { 'globalThis.document': 'undefined' },
})
const m = await import(pathToFileURL(OUT).href)

const DIR = path.join(ROOT, 'public', 'dem', NAME)
const man = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'))
const basePng = PNG.sync.read(fs.readFileSync(path.join(ROOT, 'scripts', preset.out)))
const base = m.makeImageHeightField(basePng.data, basePng.width, basePng.height)

const greyOf = (png) => {
  const g = new Uint8Array(png.width * png.height)
  for (let i = 0; i < g.length; i++) g[i] = png.data[i * 4]
  return g
}

let bad = 0
const check = (ok, label, detail = '') => {
  console.log(`${ok ? '  ' : '!!'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) bad++
}

console.log(`${NAME}: base ${basePng.width}x${basePng.height}, tiles ${man.width}x${man.height}\n`)

const field = m.makeRefinable(base, man)
const identity = field

// --- Before any tile arrives it must be exactly the base map.
let worstBare = 0
for (let i = 0; i < 4000; i++) {
  const x = ((i * 0.6180339887) % 1) * 2 - 1
  const z = ((i * 0.7548776662) % 1) * 2 - 1
  worstBare = Math.max(worstBare, Math.abs(field.at(x, z) - base.at(x, z)))
}
check(worstBare === 0, 'with no tiles loaded it is the base map exactly', `worst difference ${worstBare}`)
check(field.version === 0, 'and its version starts at zero')

// --- Load the tiles covering a rectangle and check it sharpens.
// The western Mediterranean: Iberia, the Alps, the Atlas, plenty of relief.
const lonToX = (lon) => ((lon + 180) / 360) * 2 - 1
const latToZ = (lat) => ((78 - lat) / 140) * 2 - 1
const rect = { x0: lonToX(-10), x1: lonToX(20), z0: latToZ(48), z1: latToZ(30) }

const want = field.wanted(rect)
check(want.length > 0, 'it asks for the tiles covering a rectangle', `${want.length} tiles`)
check(
  field.samplesOver(rect).w === basePng.width,
  'and reports only the base map’s resolution until they arrive',
  `${field.samplesOver(rect).w} samples across`,
)

for (const { tx, ty } of want) {
  const png = PNG.sync.read(fs.readFileSync(path.join(DIR, `${tx}_${ty}.png`)))
  field.accept(tx, ty, greyOf(png))
}
check(field === identity, 'the field object is the same one it always was')
check(field.version === want.length, 'and the version counted every tile', `version ${field.version}`)
check(
  field.samplesOver(rect).w === man.width,
  'now it reports the tiles’ resolution over that rectangle',
  `${field.samplesOver(rect).w} samples across, up from ${basePng.width}`,
)
check(
  field.samplesOver({ x0: -1, x1: 1, z0: -1, z1: 1 }).w === basePng.width,
  'but still the base map’s over the whole world, most of which is unloaded',
)

// --- Over the loaded rectangle it must now differ from the base, and the
// difference must be the tiles' own values rather than anything invented.
let changed = 0
let worstVsTile = 0
let n = 0
const tileCache = new Map()
const tilePixel = (gx, gy) => {
  const tx = Math.floor(gx / man.tile)
  const ty = Math.floor(gy / man.tile)
  const k = `${tx}_${ty}`
  if (!tileCache.has(k)) {
    const f = path.join(DIR, `${k}.png`)
    tileCache.set(k, fs.existsSync(f) ? greyOf(PNG.sync.read(fs.readFileSync(f))) : null)
  }
  const t = tileCache.get(k)
  return t ? t[(gy % man.tile) * man.tile + (gx % man.tile)] / 255 : null
}
for (let i = 0; i < 4000; i++) {
  // Land squarely on a fine-grid pixel, where the field must return that
  // pixel's own value rather than a blend of its neighbours.
  const gx = Math.round(((rect.x0 + 1) / 2) * (man.width - 1) + ((i * 0.6180339887) % 1) * 900)
  const gy = Math.round(((rect.z0 + 1) / 2) * (man.height - 1) + ((i * 0.7548776662) % 1) * 500)
  const want = tilePixel(gx, gy)
  if (want === null) continue
  const x = (gx / (man.width - 1)) * 2 - 1
  const z = (gy / (man.height - 1)) * 2 - 1
  const got = field.at(x, z)
  worstVsTile = Math.max(worstVsTile, Math.abs(got - want))
  if (Math.abs(got - base.at(x, z)) > 1e-9) changed++
  n++
}
check(n > 500, 'the refined rectangle was actually sampled', `${n} points`)
check(
  worstVsTile < 1e-6,
  'it returns the tiles’ own values, not an approximation of them',
  `worst difference ${worstVsTile.toExponential(2)}`,
)
check(changed > n * 0.5, 'and most of them differ from the base map', `${changed} of ${n}`)

// --- The join between two tiles must not step.
//
// Measuring the jump either side of a join does not test this: over a cliff the
// ground genuinely changes by a byte or two within a fraction of a pixel, and an
// earlier version of this check reported that gradient and called it a seam.
// What a per-tile sampler that clamps at its own edge actually produces is a
// value that DISAGREES with bilinear interpolation over the whole grid. So the
// field is compared against exactly that, computed here from the tile files.
const refAt = (x, z) => {
  const fx = ((x + 1) / 2) * (man.width - 1)
  const fy = ((z + 1) / 2) * (man.height - 1)
  const x0 = Math.floor(fx)
  const y0 = Math.floor(fy)
  const tx = fx - x0
  const ty = fy - y0
  const p = (gx, gy) =>
    tilePixel(Math.min(man.width - 1, gx), Math.min(man.height - 1, gy))
  const a = p(x0, y0)
  const b = p(x0 + 1, y0)
  const c = p(x0, y0 + 1)
  const d = p(x0 + 1, y0 + 1)
  if (a === null || b === null || c === null || d === null) return null
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty
}

let worstSeam = 0
let seamPoints = 0
for (const { tx, ty } of want) {
  if (!field.settled(tx + 1, ty)) continue
  // Walk a band straddling the vertical join, at sub-pixel steps, so the tap
  // lands with one pixel in each tile.
  for (let k = 0; k < 240; k++) {
    const gx = (tx + 1) * man.tile - 1 + (k % 12) / 12
    const gy = ty * man.tile + Math.floor((k / 240) * (man.tile - 1))
    const x = (gx / (man.width - 1)) * 2 - 1
    const z = (gy / (man.height - 1)) * 2 - 1
    const ref = refAt(x, z)
    if (ref === null) continue
    worstSeam = Math.max(worstSeam, Math.abs(field.at(x, z) - ref))
    seamPoints++
  }
}
check(seamPoints > 100, 'taps straddling a tile join were sampled', `${seamPoints} points`)
check(
  worstSeam < 1e-6,
  'and each reads the same as interpolating across the whole grid',
  `worst difference ${(worstSeam * 255).toExponential(2)} bytes`,
)

console.log(bad === 0 ? '\nthe refinable field is behaving' : `\n${bad} check(s) failed`)
process.exit(bad === 0 ? 0 : 1)
