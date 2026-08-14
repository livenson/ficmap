#!/usr/bin/env node
/**
 * Check that detail tiles say the same thing about the ground as the base map
 * they refine.
 *
 * A tile is meant to add detail, not to move the terrain. It sees only its own
 * corner of the world, so if anything about how it was cut differs from how the
 * base map was cut — the cap, the floor, the flattened ocean, above all the
 * metre range mapped onto 0..255 — its bytes mean different elevations, and the
 * ground would step wherever a tile met the base.
 *
 * Two things are measured, and they fail for different reasons:
 *
 *   BIAS — the mean signed difference between tile and base over the same
 *   points. Genuine extra detail is as often above the base as below it, so
 *   this sits near zero. A scale or shaping mismatch pushes it off zero, and
 *   that is the failure this exists to catch.
 *
 *   FLAT WATER — over flattened ocean neither has any detail to add, so they
 *   must agree exactly. This catches a wrong range even where the land happens
 *   to average out.
 *
 * The spread (RMS) is reported but not asserted: that IS the added detail, and
 * a tile that matched its base everywhere would be pointless.
 *
 * Usage:
 *   node scripts/check-dem-tiles.mjs world
 */
import { PNG } from 'pngjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const NAME = process.argv[2] ?? 'world'
const preset = PRESETS[NAME]
if (!preset) {
  console.error(`unknown preset "${NAME}"`)
  process.exit(1)
}

const DIR = path.join(ROOT, 'public', 'dem', NAME)
const manifestPath = path.join(DIR, 'manifest.json')
if (!fs.existsSync(manifestPath)) {
  console.error(`no tiles at public/dem/${NAME}/ — run build-dem-tiles.mjs first`)
  process.exit(1)
}
const man = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

// The base map, sampled the way the app samples it.
const basePng = PNG.sync.read(fs.readFileSync(path.join(ROOT, 'scripts', preset.out)))
const BW = basePng.width
const BH = basePng.height
const baseAt = (u, v) => {
  const fx = Math.max(0, Math.min(1, u)) * (BW - 1)
  const fy = Math.max(0, Math.min(1, v)) * (BH - 1)
  const x0 = Math.floor(fx)
  const y0 = Math.floor(fy)
  const x1 = Math.min(BW - 1, x0 + 1)
  const y1 = Math.min(BH - 1, y0 + 1)
  const tx = fx - x0
  const ty = fy - y0
  const px = (yy, xx) => basePng.data[(yy * BW + xx) * 4]
  const a = px(y0, x0)
  const b = px(y0, x1)
  const c = px(y1, x0)
  const d = px(y1, x1)
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty
}

// The byte flattened ocean encodes to. Both must agree on it exactly.
const OCEAN_BYTE =
  preset.flatOceanM == null
    ? null
    : Math.round(
        Math.max(0, Math.min(1, (preset.flatOceanM - man.minM) / (man.maxM - man.minM))) * 255,
      )

console.log(`${NAME}: ${man.tiles.length} tiles, ${man.width}x${man.height} (${man.scale}x base)`)
console.log(`base map ${BW}x${BH}, both scaled over ${man.minM}..${man.maxM} m`)
if (OCEAN_BYTE != null) console.log(`flattened ocean encodes to byte ${OCEAN_BYTE}\n`)

let n = 0
let sum = 0
let sumSq = 0
let worstTile = null
let oceanChecked = 0
let oceanBelow = 0
let oceanAbove = 0
const oceanExamples = []
const missing = []

/**
 * Whether a point is open sea rather than surf.
 *
 * Testing "the base reads as ocean here" is not enough: at a coastline the
 * base's interpolation can land exactly on the ocean byte while the tile, which
 * has finer data, correctly sees a sliver of land in the same place. That is
 * the detail the tiles exist to add, not a disagreement. So the neighbourhood
 * has to be ocean too — a couple of base pixels in every direction.
 */
function openSea(u, v) {
  if (OCEAN_BYTE == null) return false
  const du = 2 / (BW - 1)
  const dv = 2 / (BH - 1)
  for (const [a, b] of [[0, 0], [du, 0], [-du, 0], [0, dv], [0, -dv]])
    if (Math.abs(baseAt(u + a, v + b) - OCEAN_BYTE) >= 0.5) return false
  return true
}

for (const id of man.tiles) {
  const file = path.join(DIR, `${id}.png`)
  if (!fs.existsSync(file)) {
    missing.push(id)
    continue
  }
  const [tx, ty] = id.split('_').map(Number)
  const tile = PNG.sync.read(fs.readFileSync(file))
  let tn = 0
  let tsum = 0
  // A sparse grid: this is about agreement, not about every pixel.
  const step = Math.max(1, Math.floor(man.tile / 32))
  for (let py = 0; py < man.tile; py += step) {
    const gy = ty * man.tile + py
    for (let px = 0; px < man.tile; px += step) {
      const gx = tx * man.tile + px
      const t = tile.data[(py * man.tile + px) * 4]
      // Compare at the same place on the map, not the same pixel index: the
      // two grids share only their corners, because both run edge to edge.
      const b = baseAt(gx / (man.width - 1), gy / (man.height - 1))
      const d = t - b
      n++
      sum += d
      sumSq += d * d
      tn++
      tsum += d
      if (OCEAN_BYTE != null && openSea(gx / (man.width - 1), gy / (man.height - 1))) {
        oceanChecked++
        if (t < OCEAN_BYTE) oceanBelow++
        else if (t > OCEAN_BYTE) {
          oceanAbove++
          if (oceanExamples.length < 6) oceanExamples.push({ id, px, py, tile: t })
        }
      }
    }
  }
  const tileBias = tsum / tn
  if (!worstTile || Math.abs(tileBias) > Math.abs(worstTile.bias))
    worstTile = { id, bias: tileBias }
}

const bias = sum / n
const rms = Math.sqrt(sumSq / n)
let bad = 0
const check = (ok, label, detail) => {
  console.log(`${ok ? '  ' : '!!'} ${label} — ${detail}`)
  if (!ok) bad++
}

check(missing.length === 0, 'every tile the manifest lists is on disk', missing.length ? `missing ${missing.join(', ')}` : `${man.tiles.length} present`)
check(
  Math.abs(bias) < 0.5,
  'tiles sit on the base map rather than above or below it',
  `mean difference ${bias.toFixed(3)} of 255 over ${n.toLocaleString()} points`,
)
// Per-tile drift is looser than the global bias on purpose. Over high relief a
// finer grid genuinely resolves peaks the coarse base averaged away, so a
// mountainous tile sits a little above its base and should: the worst on the
// world map is the Ethiopian highlands and the East African Rift, at 1.9 of
// 255 (~26 m). A wrong metre range is a different order of thing — cutting the
// same row over -6..3000 instead of -6..3500 put that tile at 9.3.
check(
  worstTile === null || Math.abs(worstTile.bias) < 4,
  'no single tile drifts off the base further than its own relief explains',
  worstTile ? `worst is ${worstTile.id} at ${worstTile.bias.toFixed(3)}` : 'no tiles',
)
if (OCEAN_BYTE != null) {
  // A wrong metre range moves the sea floor, so it would show here as EVERY
  // ocean point disagreeing, not a handful. Reading below the flattened floor
  // is impossible for correctly-cut data at any resolution, so that is fatal;
  // reading above it is a small island the base map is too coarse to hold.
  check(
    oceanBelow === 0,
    'no tile puts the sea below the floor the base map flattened it to',
    `${oceanChecked.toLocaleString()} open-sea points, ${oceanBelow} below`,
  )
  const agree = 1 - oceanAbove / Math.max(1, oceanChecked)
  check(
    agree > 0.999,
    'open sea reads the same in both',
    `${(agree * 100).toFixed(3)}% agree; ${oceanAbove} points where the tiles find land the base map cannot resolve`,
  )
}
for (const e of oceanExamples) {
  const m = (e.tile / 255) * (man.maxM - man.minM) + man.minM
  console.log(`     ${e.id} px ${e.px},${e.py}: byte ${e.tile} (~${Math.round(m)} m) — an islet`)
}
console.log(`   (spread ${rms.toFixed(2)} of 255 — this is the detail the tiles add)`)

console.log(bad === 0 ? '\ntiles agree with the base map' : `\n${bad} check(s) failed`)
process.exit(bad === 0 ? 0 : 1)
