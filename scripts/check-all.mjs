#!/usr/bin/env node
/**
 * Run every sanity check in one go, for CI and for before a commit.
 *
 * These are the fast, deterministic half of this project's verification. The
 * Playwright suite covers that the app loads and behaves, but it drives a real
 * browser over software WebGL and takes the better part of an hour; these read
 * the actual data and geometry and finish in seconds, which is what makes them
 * worth running on every push.
 *
 * Each one is a script rather than a unit test because what they check is the
 * CONTENT — that a town is on land, that a route reaches it, that a bass note
 * lands where the score says, that two meshes meet — and content is what breaks
 * when somebody edits a story file.
 *
 * Usage:
 *   npm run check
 *   node scripts/check-all.mjs --quiet
 */
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const QUIET = process.argv.includes('--quiet')

/** Every DEM world `check-markers` knows about, taken from its own table. */
const markerWorlds = [
  'latvia', 'lucerne', 'nibelungen', 'harz', 'flanders', 'tain', 'cid',
  'aotearoa', 'tasmania', 'ottokar', 'verne', 'indiana', 'kalevala',
  'peergynt', 'nils', 'khunphaen',
]

const jobs = [
  ['route coverage, whole atlas', 'check-routes.mjs', []],
  ['named rivers reach the sea', 'check-rivers.mjs', []],
  ['quotations name their source', 'check-quotes.mjs', []],
  ['music: bass under melody', 'check-music.mjs', []],
  ['terrain detail plan & seams', 'check-lod.mjs', []],
  ['heightmap elevation scales', 'check-dem-scale.mjs', []],
  ['world picker map', 'check-atlas-map.mjs', []],
  ...markerWorlds.map((w) => [`markers: ${w}`, 'check-markers.mjs', [w]]),
]

// Tile checks only apply where tiles have actually been cut.
for (const [name, preset] of Object.entries(PRESETS)) {
  if (preset.minM == null) continue
  const manifest = path.join(ROOT, 'public', 'dem', name, 'manifest.json')
  if (!fs.existsSync(manifest)) continue
  jobs.push([`detail tiles: ${name}`, 'check-dem-tiles.mjs', [name]])
  jobs.push([`refinable field: ${name}`, 'check-refine.mjs', [name]])
}

let failed = 0
const started = Date.now()
for (const [label, script, args] of jobs) {
  const r = spawnSync('node', [path.join(ROOT, 'scripts', script), ...args], {
    encoding: 'utf8',
  })
  const ok = r.status === 0
  if (!ok) failed++
  console.log(`${ok ? '  ok  ' : '  FAIL'}  ${label}`)
  // A passing check has already said what it checked; only a failure needs its
  // output here, and then all of it.
  if (!ok || !QUIET) {
    const out = ((r.stdout ?? '') + (r.stderr ?? '')).trimEnd()
    if (!ok && out) console.log(out.replace(/^/gm, '        '))
  }
}

const secs = ((Date.now() - started) / 1000).toFixed(1)
console.log(
  failed === 0
    ? `\n${jobs.length} checks passed in ${secs}s`
    : `\n${failed} of ${jobs.length} checks FAILED in ${secs}s`,
)
process.exit(failed === 0 ? 0 : 1)
