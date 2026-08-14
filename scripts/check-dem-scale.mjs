#!/usr/bin/env node
/**
 * Check that every DEM preset agrees with the story that renders it about where
 * the waterline sits, and report which presets are safe to cut detail tiles
 * from.
 *
 * A heightmap PNG stores elevations as bytes, and what a byte MEANS depends on
 * the metre range that was mapped onto 0..255 when it was written. By default
 * `build-heightmap.mjs` takes that range from whatever the sampled grid
 * happened to contain — fine for a map built once, fatal for a map that will
 * later be subdivided, because a detail tile sees only its own corner of the
 * world, observes different extremes, and so encodes the same elevation as a
 * different byte. Where the two met, the ground would step.
 *
 * A preset that pins `minM`/`maxM` is immune to that, and its waterline can be
 * computed here rather than read off a build log and copied by hand into a
 * story. This catches the copy going stale in either direction.
 *
 * Usage:
 *   node scripts/check-dem-scale.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRESETS } from './dem-presets.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Every story's declared `seaLevel`, keyed by the heightmap asset it imports. */
function declaredSeaLevels() {
  const byAsset = new Map()
  const dir = path.join(ROOT, 'src/stories')
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.ts')) continue
    const src = fs.readFileSync(path.join(dir, name), 'utf8')
    // `import xHeight from '../assets/x-height.png'` … `heightmap: xHeight,`
    const imports = new Map()
    for (const m of src.matchAll(/import (\w+) from '\.\.\/assets\/([\w-]+\.png)'/g))
      imports.set(m[1], m[2])
    // Each terrain block names a heightmap and, further down, its seaLevel.
    // The window has to clear the commentary in between — Verne's runs to a bit
    // over 400 characters, which an earlier version of this silently skipped
    // past, so it reported only one of the two worlds sharing that heightmap.
    for (const m of src.matchAll(/heightmap: (\w+),([\s\S]{0,900}?)seaLevel: ([\d.]+)/g)) {
      const asset = imports.get(m[1])
      if (!asset) continue
      if (!byAsset.has(asset)) byAsset.set(asset, [])
      byAsset.get(asset).push({ story: name.replace(/\.ts$/, ''), seaLevel: Number(m[3]) })
    }
  }
  return byAsset
}

const declared = declaredSeaLevels()
let bad = 0
const pinned = []
const loose = []

for (const [name, p] of Object.entries(PRESETS)) {
  if (!p.out) continue
  const asset = path.basename(p.out)
  const uses = declared.get(asset) ?? []
  if (p.minM == null || p.maxM == null) {
    loose.push({ name, asset, uses })
    continue
  }
  const seaM = p.seaM ?? 0
  const sea = (seaM - p.minM) / (p.maxM - p.minM)
  pinned.push({ name, asset, sea, uses })
  for (const u of uses) {
    // Stories round the fraction for readability, so compare at that precision.
    const ok = Math.abs(u.seaLevel - sea) <= 5e-5
    if (!ok) bad++
    console.log(
      `${ok ? '  ' : '!!'} ${name.padEnd(10)} ${String(p.minM).padStart(6)}..${String(p.maxM).padEnd(6)} m ` +
        `→ waterline ${sea.toFixed(6)}   ${u.story} declares ${u.seaLevel}` +
        `${ok ? '' : '  ← DISAGREES'}`,
    )
  }
  if (!uses.length) console.log(`   ${name.padEnd(10)} pinned but no story uses ${asset}`)
}

console.log(`\n${pinned.length} preset(s) with a pinned elevation range — safe to cut detail tiles from:`)
for (const p of pinned) console.log(`   ${p.name} (${p.asset})`)

console.log(
  `\n${loose.length} preset(s) scaled to whatever their own data contained. These are ` +
    `correct as maps,\nbut a detail tile cut from one would not agree with it — pin ` +
    `minM/maxM first:`,
)
for (const p of loose) console.log(`   ${p.name} (${p.asset})`)

console.log(
  bad === 0
    ? '\nevery pinned preset agrees with its story about the waterline'
    : `\n${bad} preset(s) disagree with their story`,
)
process.exit(bad === 0 ? 0 : 1)
