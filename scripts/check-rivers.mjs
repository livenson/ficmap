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
 *     one is held to the same rule. Three endings count: reaching water, running
 *     off the edge of the map, or joining another river this world draws. The
 *     Tagus does the second — it leaves this world westward, on its way to a
 *     Lisbon the map does not reach. The Ping does the third, at Nakhon Sawan,
 *     where it meets the Nan and the two of them become the Chao Phraya.
 *   - its MARKER is on it. The Elbe marker was three kilometres off the channel,
 *     which did not matter while the channel was invisible.
 *
 * The story data is bundled with esbuild and imported for real, so this reads
 * exactly what the app draws.
 *
 * NEGATIVE CONTROLS, all measured, all four mechanisms:
 *
 *   reverse the Elbe's points     CLIMBS 0.271
 *   Elbe marker back at x 0.207   0.0106 from the river it is named after
 *   Tagus cut 18 points short     stops on dry land, lowest ground 0.282
 *   Whanganui's marker misnamed   names marker "nope", which this world lacks
 *   delete the Chao Phraya        the Ping has nothing left to join and stops
 *                                 on dry land, lowest ground 0.114
 *
 * As shipped, the eight courses all fall, and every marker that names a river
 * reads 0.0004 or less from it.
 *
 * Usage:
 *   node scripts/check-rivers.mjs
 */
import esbuild from 'esbuild'
import { PNG } from 'pngjs'
import { PRESETS } from './dem-presets.mjs'
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
/**
 * How close a river's mouth must come to another drawn river to count as
 * joining it.
 *
 * Looser than ON_RIVER on purpose: that threshold holds an authored marker to a
 * course this file also holds, so it can be tight. This one compares two
 * INDEPENDENTLY generalised source lines, and Natural Earth's Ping and Chao
 * Phraya do not share a vertex at Nakhon Sawan — they end and begin about 2 km
 * apart. 0.01 map units is ~6 km on the Siam map, close enough that no two
 * unrelated rivers on any world here come within it.
 */
const JOINS = 0.01
/** How much a course may climb from end to end before it is simply wrong. */
const CLIMB = 0.02

/**
 * How close a course's last point must come to water to count as having reached
 * it, in KILOMETRES ON THE GROUND.
 *
 * This used to be a 3x3 stencil at +/-0.01 map units, which is a different
 * distance on every world — a few hundred metres on the Lucerne map and 130 km
 * on the whole-Earth one — so what it really tested varied by world with
 * nothing saying so. It also nearly rejected a correct river: Natural Earth's
 * Chao Phraya stops 4.8 km up the delta from the Gulf, and the stencil reached
 * 4.8 km only on its diagonal.
 *
 * 10 km is the source's own resolution rather than a number chosen to make that
 * pass: these are the 10m (1:10,000,000) centrelines, where one millimetre on
 * the sheet is 10 km, so where such a line ends is not meaningful below that.
 *
 * Measured, with the disc in place: the Tagus cut 18 points short reports its
 * lowest ground within 10 km as 0.282 against a sea level of 0.0023, and the
 * Ping with the Chao Phraya deleted reports 0.114 against 0.0033. Neither is
 * anywhere near passing, so widening from a 4.8 km diagonal to a 10 km disc did
 * not blunt the check.
 */
const MOUTH_KM = 10

// Which DEM preset backs which world — the preset carries both the heightmap
// path and the bounding box, so the ground scale is read rather than guessed.
// Only worlds declaring `namedRivers` are checked.
const PRESET_OF = {
  faust: 'harz',
  khunphaen: 'siam',
  cid: 'spain',
  aotearoa: 'aotearoa',
  dante: 'dante',
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
  const preset = PRESETS[PRESET_OF[story.id]]
  if (!preset) {
    console.log(`  !! ${story.id} declares namedRivers but this checker has no DEM preset for it`)
    problems++
    continue
  }
  const png = PNG.sync.read(fs.readFileSync(path.join(ROOT, 'scripts', preset.out)))
  // Kilometres per map unit, from the preset's own bounding box. Map space is
  // always -1..1 whatever it covers, so this is the only way a distance in this
  // file can mean the same thing on two worlds.
  const bb = preset.bbox
  const midLat = ((bb.latMin + bb.latMax) / 2) * (Math.PI / 180)
  const KM_X = ((bb.lonMax - bb.lonMin) * 111.32 * Math.cos(midLat)) / 2
  const KM_Z = ((bb.latMax - bb.latMin) * 110.9) / 2
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
   * The radius is MOUTH_KM on the ground, sampled as a disc; see its comment
   * for why it is measured in kilometres and not in map units.
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
    let lo = heightAt(x, z)
    const stepX = MOUTH_KM / KM_X / 8
    const stepZ = MOUTH_KM / KM_Z / 8
    for (let i = -8; i <= 8; i++) {
      for (let j = -8; j <= 8; j++) {
        const ddx = i * stepX
        const ddz = j * stepZ
        if (Math.hypot(i / 8, j / 8) > 1) continue
        lo = Math.min(lo, heightAt(x + ddx, z + ddz))
      }
    }
    return lo
  }
  /** A course may also simply leave the world; that is not a stall. */
  const atEdge = (p) => Math.abs(p.x) > 0.985 || Math.abs(p.z) > 0.985

  /** Distance from a point to the nearest segment of a polyline, aspect-aware. */
  const distToCourse = (p, pts) => {
    let best = Infinity
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]
      const b = pts[i]
      const dx = (b.x - a.x) * aspect
      const dz = b.z - a.z
      const len = dx * dx + dz * dz
      const t = len === 0 ? 0 : Math.max(0, Math.min(1, (((p.x - a.x) * aspect) * dx + (p.z - a.z) * dz) / len))
      const ex = (p.x - a.x) * aspect - t * dx
      const ez = p.z - a.z - t * dz
      best = Math.min(best, Math.sqrt(ex * ex + ez * ez))
    }
    return best
  }

  /**
   * The third legitimate ending: a tributary stops at a confluence.
   *
   * Rivers reach the sea or leave the map — until one does neither and is still
   * right. The Ping ends at Nakhon Sawan, where it meets the Nan and the two of
   * them become the Chao Phraya; it is 0.12 above sea level there and nowhere
   * near an edge, and demanding otherwise would mean either not drawing it or
   * drawing it as something it is not.
   */
  const joinsAnother = (river, mouth) => {
    for (const other of named) {
      if (other === river) continue
      if (distToCourse(mouth, other.points) <= JOINS) return other.name
    }
    return null
  }

  for (const river of named) {
    rivers++
    const pts = river.points
    const hs = pts.map((p) => heightAt(p.x, p.z))
    const drop = hs[0] - hs[hs.length - 1]
    const climb = Math.max(0, -drop)
    const mouth = pts[pts.length - 1]
    const leaves = atEdge(mouth)
    const nearest = waterNear(mouth.x, mouth.z)
    const joined = leaves ? null : joinsAnother(river, mouth)
    const endsWet = leaves || nearest <= seaLevel + 0.02 || joined != null

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
        `   !! stops on dry land — lowest ground within ${MOUTH_KM} km is ` +
          `${nearest.toFixed(3)} (sea level ${seaLevel}), it joins no other ` +
          `river here, and it is not at the map's edge`,
      )
      problems++
    } else if (leaves) {
      console.log(`   runs off the edge of the map, which is where it goes`)
    } else if (joined) {
      console.log(`   ends where it joins ${joined}, which is what a tributary does`)
    } else {
      console.log(
        `   reaches water (${nearest.toFixed(3)} <= ${seaLevel} + 0.02 within ${MOUTH_KM} km)`,
      )
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
