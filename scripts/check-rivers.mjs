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
 *   - it GETS SOMEWHERE. `engine/rivers.ts` drops procedural courses that stall
 *     on a slope, because a line stopping in mid-air reads as a bug; an authored
 *     one is held to the same rule. Two endings count: reaching water, or
 *     running off the edge of the map. The Tagus does the second — it leaves
 *     this world westward, on its way to a Lisbon the map does not reach.
 *   - its MARKER is on it. The Elbe marker was three kilometres off the channel,
 *     which did not matter while the channel was invisible.
 *
 * The story data is bundled with esbuild and imported for real, so this reads
 * exactly what the app draws.
 *
 * NEGATIVE CONTROLS, all measured, all four mechanisms:
 *
 *   reverse the Elbe's points     CLIMBS 0.271, and stops on dry land
 *   Elbe marker back at x 0.207   0.0106 from the river it is named after
 *   Tagus cut 18 points short     stops on dry land, nearest water 0.286
 *   Whanganui's marker misnamed   names marker "nope", which this world lacks
 *
 * As shipped: the three courses fall 0.271, 0.675 and 0.416, and the three
 * markers read 0.0000, 0.0004 and 0.0003.
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
  cid: '../src/assets/spain-height.png',
  aotearoa: '../src/assets/aotearoa-height.png',
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

  /**
   * Is there water at this point, or a step away from it?
   *
   * The exact mouth pixel is often still land: at about a kilometre per pixel a
   * river mouth is narrower than one sample, so the coast blends. The
   * Whanganui's mouth reads 0.024 while the pixel beside it reads 0.000.
   *
   * A note against a wrong conclusion, because it was nearly committed. Sampling
   * the west edge of the Spain map along ONE row gave 0.0000 where the ground is
   * really 0.20, and that looked exactly like a border artefact from cutting the
   * DEM — so this function grew a margin to skip the outermost pixels, and a
   * confident comment explaining it. It is not an artefact. No row of that
   * heightmap has a single leading zero column; the zeros are on that row only,
   * and they are the Tagus itself, dammed into the Alcantara reservoir at the
   * Portuguese border and wide enough there to survive the resampling. One row
   * is not a border. The margin is gone.
   */
  const waterNear = (x, z) => {
    let lo = Infinity
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        lo = Math.min(lo, heightAt(x + dx * 0.01, z + dz * 0.01))
      }
    }
    return lo
  }
  /** A course may also simply leave the world; that is not a stall. */
  const atEdge = (p) => Math.abs(p.x) > 0.985 || Math.abs(p.z) > 0.985

  for (const river of named) {
    rivers++
    const pts = river.points
    const hs = pts.map((p) => heightAt(p.x, p.z))
    const drop = hs[0] - hs[hs.length - 1]
    const climb = Math.max(0, -drop)
    const mouth = pts[pts.length - 1]
    const leaves = atEdge(mouth)
    const nearest = waterNear(mouth.x, mouth.z)
    const endsWet = leaves || nearest <= seaLevel + 0.02

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
        `   !! stops on dry land — nearest water ${nearest.toFixed(3)}` +
          ` (sea level ${seaLevel}), and not at the map's edge`,
      )
      problems++
    } else if (leaves) {
      console.log(`   runs off the edge of the map, which is where it goes`)
    } else {
      console.log(`   reaches water (${nearest.toFixed(3)} <= ${seaLevel} + 0.02 alongside it)`)
    }

    // The marker that stands for this river must be ON it. X is scaled by
    // aspect so the distance means the same thing on the ground as it does down
    // the map.
    //
    // The river names its marker; matching by text does not work and looked like
    // it did. "The River" on the New Zealand map is the Whanganui and shares not
    // one letter with it, so a name match found nothing and reported nothing —
    // a silent pass over the very thing being checked.
    const marked = (story.markers ?? []).filter((m) =>
      river.marker ? m.id === river.marker : false,
    )
    if (river.marker && !marked.length) {
      console.log(`   !! names marker "${river.marker}", which this world does not have`)
      problems++
    }
    if (!river.marker) {
      console.log(`      (no marker stands for this river)`)
    }
    for (const m of marked) {
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
