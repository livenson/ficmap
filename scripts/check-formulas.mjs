#!/usr/bin/env node
/**
 * The coordinate formula a story states is the one its map actually uses.
 *
 * Twenty-two of the DEM worlds carry a line like this in their header comment,
 * and it is not decoration — it is the instruction anyone follows to place the
 * next marker:
 *
 *   map x = (lon − 64) / 24 − 1      map z = (46 − lat) / 12.25 − 1
 *
 * The numbers in it are the preset's bounding box: `lonMin`, half the longitude
 * span, `latMax`, half the latitude span. Nothing keeps the two in step. Widen a
 * preset's box by two degrees — which happened twice while the Journey to the
 * West and Tale of Kiều maps were being fitted — and every marker already placed
 * stays correct, because the marker holds map units and the map moved with it;
 * but the STATED formula silently starts lying, and the next marker placed from
 * it lands somewhere else entirely.
 *
 * Nothing else catches that. `check-markers` reads each marker's lon/lat back
 * through the preset, so it agrees with whatever the preset says and cannot
 * notice that the comment disagrees. The failure would only appear as one town
 * quietly in the wrong field, months later.
 *
 * NEGATIVE CONTROLS, both measured:
 *
 *   xiyou's stated lonMin 64 -> 66        lonMin 66 vs 64
 *   the `kieu` preset's latMax 42.6->41.5 latMax 42.6 vs 41.5, lat half-span
 *                                         12.4 vs 11.85
 *
 * A world with no stated formula is reported, not failed: eight of the older
 * ones never had one, and this is a check on agreement rather than a demand for
 * a comment.
 *
 * Usage:
 *   node scripts/check-formulas.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'src', 'stories')

/** preset, keyed by the heightmap file it writes — the link from story to box. */
const presetByFile = {}
for (const [name, p] of Object.entries(PRESETS)) {
  if (p.out) presetByFile[p.out.split('/').pop()] = { name, ...p }
}

// The comments use a typographic minus, and a west-of-Greenwich box is written
// `(lon + 148)` rather than `(lon − −148)`.
const num = (s) => Number(String(s).replace('−', '-').replace(/[^0-9.eE+-]/g, ''))

let problems = 0
let checked = 0
let silent = 0

for (const f of fs.readdirSync(DIR).filter((n) => n.endsWith('.ts') && n !== 'index.ts')) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8')
  const hm = src.match(/from '\.\.\/assets\/([\w-]+\.png)'/)
  const preset = hm ? presetByFile[hm[1]] : null
  const mx = src.match(/map x = \(lon\s*([+−-])\s*([\d.]+)\)\s*\/\s*([\d.]+)/)
  const mz = src.match(/map z = \(([\d.]+)\s*[−-]\s*lat\)\s*\/\s*([\d.]+)/)

  if (!mx || !mz) {
    if (preset?.bbox) {
      silent++
      console.log(`   -- ${f.replace('.ts', '').padEnd(16)} (${preset.name}) states no formula`)
    }
    continue
  }
  if (!preset?.bbox) {
    console.log(`   !! ${f.replace('.ts', '')} states a formula but has no DEM preset to check it against`)
    problems++
    continue
  }

  checked++
  const b = preset.bbox
  const eq = (a, c) => Math.abs(a - c) < 1e-6
  const bad = []
  const said = {
    lonMin: mx[1] === '+' ? -num(mx[2]) : num(mx[2]),
    halfLon: num(mx[3]),
    latMax: num(mz[1]),
    halfLat: num(mz[2]),
  }
  const want = {
    lonMin: b.lonMin,
    halfLon: (b.lonMax - b.lonMin) / 2,
    latMax: b.latMax,
    halfLat: (b.latMax - b.latMin) / 2,
  }
  for (const [k, label] of [
    ['lonMin', 'lonMin'],
    ['halfLon', 'lon half-span'],
    ['latMax', 'latMax'],
    ['halfLat', 'lat half-span'],
  ]) {
    if (!eq(said[k], want[k])) bad.push(`${label} ${said[k]} vs ${want[k]}`)
  }
  if (bad.length) {
    console.log(`   !! ${f.replace('.ts', '').padEnd(16)} (${preset.name}): ${bad.join('; ')}`)
    problems++
  } else {
    console.log(`      ${f.replace('.ts', '').padEnd(16)} (${preset.name})`)
  }
}

console.log(
  `\n${checked} stated formula(s) checked against their preset` +
    (silent ? `, ${silent} world(s) state none` : ''),
)
console.log(
  problems === 0
    ? 'every stated formula is the one its map uses'
    : `${problems} formula(s) disagree with the map`,
)
process.exit(problems === 0 ? 0 : 1)
