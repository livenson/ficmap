#!/usr/bin/env node
/**
 * Named rivers actually behave like rivers, and the places named after them
 * actually stand on them.
 *
 * A `namedRivers` course is authored data pasted from `build-river.mjs`, so it
 * is exactly the kind of thing that goes stale silently: nudge a world's bbox,
 * or re-cut its heightmap, and the river keeps drawing — over dry hills, or
 * stopping in the middle of a plain, with nothing to say so.
 *
 * Three things are checked against the world's own heightmap:
 *
 *   - it runs DOWNHILL overall, and never climbs far. A coarse DEM cannot
 *     resolve a river valley, so the samples along a real course are noisy and
 *     some rise; what must not happen is a course that ends higher than it
 *     started, which means the points are reversed or the box has moved.
 *   - it ENDS AT WATER. `engine/rivers.ts` drops procedural courses that stall
 *     on a slope, on the grounds that a line stopping in mid-air reads as a bug;
 *     an authored one gets held to the same rule.
 *   - any MARKER NAMED AFTER IT is on it. The Elbe marker was three kilometres
 *     off the channel, which did not matter while the channel was invisible.
 *
 * The story data is bundled with esbuild and imported for real, so this reads
 * exactly what the app draws.
 *
 * NEGATIVE CONTROLS, measured. Reversing the Elbe's points trips two of the
 * three at once: "CLIMBS 0.271 over its length" and "ends on dry land at height
 * 0.271". Putting the Elbe marker back at its old x 0.207 gives "0.0106 from
 * the river it is named after". As shipped the course falls 0.271 to 0.000 and
 * the marker reads 0.0000.
 *
 * Usage:
 *   node scripts/check-rivers.mjs
 */
import esbuild from 'esbuild'
import { PNG } from 'pngjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * How far a marker may sit from the river it is named after, in map units.
 *
 * 0.005 is about 1.5 km on the Faust map, or under two DEM pixels — tight
 * enough that the pin reads as standing ON the drawn line, loose enough to
 * allow for the source data's own generalisation. The first draft of this check
 * used 0.02 and passed the Elbe marker at its original 0.0106, which is the
 * exact fault it was written to catch.
 */
const ON_RIVER = 0.005
/** How much a course may climb from end to end before it is simply wrong. */
const CLIMB = 0.02

// Which PNG backs which world. Only worlds declaring `namedRivers` are checked.
const HEIGHTMAPS = {
  faust: '../src/assets/harz-height.png',
}

const bundle = await esbuild.build({
  entryPoints: [path.join(ROOT, 'src/stories/index.ts')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'neutral',
  plugins: [
    {
      name: 'stub-assets',
      setup(build) {
        build.onResolve({ filter: /\.(png|jpe?g|webp)$/ }, (a) => ({
          path: a.path,
          namespace: 'stub',
        }))
        build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
          contents: 'export default ""',
          loader: 'js',
        }))
      },
    },
  ],
})
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64')
)

let problems = 0
let rivers = 0
for (const story of mod.stories) {
  const named = story.terrain?.namedRivers ?? []
  if (!named.length) continue
  const src = HEIGHTMAPS[story.id]
  if (!src) {
    console.log(`  !! ${story.id} declares namedRivers but this checker has no heightmap for it`)
    problems++
    continue
  }
  const png = PNG.sync.read(fs.readFileSync(path.join(ROOT, 'scripts', src)))
  const heightAt = (x, z) => {
    const px = Math.round(((x + 1) / 2) * (png.width - 1))
    const py = Math.round(((z + 1) / 2) * (png.height - 1))
    return png.data[(py * png.width + px) * 4] / 255
  }
  const seaLevel = story.terrain.seaLevel ?? 0.42
  const aspect = story.terrain.aspect > 0 ? story.terrain.aspect : 1

  for (const river of named) {
    rivers++
    const pts = river.points
    const hs = pts.map((p) => heightAt(p.x, p.z))
    const drop = hs[0] - hs[hs.length - 1]
    const climb = Math.max(0, -drop)
    const endsWet = hs[hs.length - 1] <= seaLevel + 0.02

    console.log(`\n${story.id} · ${river.name}  (${pts.length} points)`)
    console.log(
      `   height ${hs[0].toFixed(3)} -> ${hs[hs.length - 1].toFixed(3)}` +
        `, ${drop >= 0 ? 'falls' : 'CLIMBS'} ${Math.abs(drop).toFixed(3)}`,
    )
    if (climb > CLIMB) {
      console.log(`   !! climbs ${climb.toFixed(3)} over its length — points reversed?`)
      problems++
    }
    if (!endsWet) {
      console.log(
        `   !! ends on dry land at height ${hs[hs.length - 1].toFixed(3)}` +
          ` (sea level ${seaLevel})`,
      )
      problems++
    } else {
      console.log(`   ends at water (${hs[hs.length - 1].toFixed(3)} <= ${seaLevel} + 0.02)`)
    }

    // Any marker whose name matches the river's should be standing on it. X is
    // scaled by aspect so the distance means the same thing on the ground as it
    // does down the map.
    const key = river.name.replace(/^The /, '').toLowerCase()
    for (const m of story.markers ?? []) {
      if (!m.name.toLowerCase().includes(key)) continue
      let best = Infinity
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]
        const b = pts[i]
        const dx = (b.x - a.x) * aspect
        const dz = b.z - a.z
        const px = (m.at.x - a.x) * aspect
        const len = dx * dx + dz * dz
        const t = len === 0 ? 0 : Math.max(0, Math.min(1, (px * dx + (m.at.z - a.z) * dz) / len))
        best = Math.min(best, Math.hypot(px - t * dx, m.at.z - a.z - t * dz))
      }
      const ok = best <= ON_RIVER
      console.log(
        `   ${ok ? '  ' : '!!'} "${m.name}" is ${best.toFixed(4)} from the river it is named after`,
      )
      if (!ok) problems++
    }
  }
}

console.log(`\n${rivers} named river(s) checked`)
console.log(
  problems === 0
    ? 'every named river runs downhill to water, with its place standing on it'
    : `${problems} problem(s)`,
)
process.exit(problems === 0 ? 0 : 1)
