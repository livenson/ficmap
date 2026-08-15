#!/usr/bin/env node
/**
 * Check the terrain's zoom-dependent detail: does it fire when it should, does
 * the pair cost less than the single mesh it replaces, and do the two meshes
 * meet without a crack?
 *
 * This drives the real `visibleMapRect` / `planLod` / `buildTerrainGeometry`
 * with a real THREE camera placed exactly where `Cameras` places it, rather
 * than scrolling a browser. Zoom in a headless browser is damped over frames
 * and the scene renders at about one frame a second under software WebGL, so a
 * test that turns the wheel and waits cannot tell "the camera never got there"
 * from "the detail never fired" — both look like an unchanged triangle count.
 * Here the camera is simply put where it would be.
 *
 * Usage:
 *   node scripts/check-lod.mjs
 */
import esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import * as THREE from 'three'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'node_modules', '.lod-check-bundle.mjs')

await esbuild.build({
  stdin: {
    contents: `
      export * from './src/engine/lod.ts'
      export * from './src/engine/terrain.ts'
    `,
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: OUT,
  logLevel: 'error',
})
const m = await import(pathToFileURL(OUT).href)

// The Verne / Indiana Jones world map, as its story declares it.
const cfg = {
  aspect: 360 / 140,
  heightScale: 22,
  seaLevel: 0.0017,
  meshResolution: 440,
  seed: 'world-dem',
  biomes: [
    { maxHeight: 0.0017, color: '#20364e' },
    { maxHeight: 0.05, color: '#5d7f4e' },
    { maxHeight: 0.25, color: '#7b8a52' },
    { maxHeight: 0.6, color: '#8d7d5e' },
    { maxHeight: 1.0, color: '#e9edf2' },
  ],
}
const RES = 440
// The whole-Earth DEM's own pixel grid, which caps how fine the mesh may go.
const SAMPLES = { w: 3072, h: 1536 }

// A bumpy synthetic field: this checks geometry and cost, not the real DEM.
const field = {
  at: (x, z) => 0.5 + 0.35 * Math.sin(x * 9.1) * Math.cos(z * 7.3) + 0.1 * Math.sin(x * 41),
  samples: SAMPLES,
}

/** A camera set up exactly as `Cameras` sets it up, at a given orbit distance. */
function cameraAt(distance) {
  const cam = new THREE.PerspectiveCamera(50, 1280 / 800, 0.1, 5000)
  // `Cameras` frames a wide world from [0, 96w, 58w]; keep that direction and
  // slide along it, which is what dollying with the wheel does.
  const dir = new THREE.Vector3(0, 96, 58).normalize()
  cam.position.copy(dir.multiplyScalar(distance))
  cam.lookAt(0, 0, 0)
  cam.updateMatrixWorld(true)
  cam.updateProjectionMatrix()
  return cam
}

const tris = (geo) => geo.index.count / 3
let bad = 0
const check = (ok, label, detail = '') => {
  console.log(`${ok ? '  ' : '!!'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) bad++
}

// The distance `Cameras` starts a wide world at, and OrbitControls' minDistance.
const FAR = new THREE.Vector3(0, 96, 58).length() * m.frameScale(cfg.aspect)
const NEAR = 12

console.log(`world map: aspect ${cfg.aspect.toFixed(3)}, mesh ${RES}, DEM ${SAMPLES.w}x${SAMPLES.h}`)
console.log(`camera runs from ${FAR.toFixed(0)} (framed) in to ${NEAR} (closest)\n`)

// --- Zoomed out, the whole map is in view and one uniform mesh is right.
const farPlan = m.planLod(m.visibleMapRect(cameraAt(FAR), cfg), cfg, RES, SAMPLES)
check(farPlan === null, 'framed on the whole world: one uniform mesh, no patch')

// --- Zoomed in, the detail patch takes over and costs less.
const nearRect = m.visibleMapRect(cameraAt(NEAR), cfg)
const nearPlan = m.planLod(nearRect, cfg, RES, SAMPLES)
check(nearPlan !== null, 'zoomed to the closest the controls allow: a patch is planned')
if (!nearPlan) process.exit(1)

const uniform = m.buildTerrainGeometry(field, cfg, RES)
const base = m.buildTerrainGeometry(field, cfg, nearPlan.baseResolution, { hole: nearPlan.rect })
const patch = m.buildTerrainGeometry(field, cfg, nearPlan.baseResolution, {
  patch: { ...nearPlan.rect, refine: nearPlan.refine },
})
const split = tris(base) + tris(patch)
check(
  split < tris(uniform),
  'the pair costs less than the mesh it replaces',
  `${split.toLocaleString()} vs ${tris(uniform).toLocaleString()} triangles`,
)

// --- and resolves the ground more finely than the uniform mesh did.
const { resX } = m.baseGrid(cfg, nearPlan.baseResolution)
const patchCols = (nearPlan.rect.i1 - nearPlan.rect.i0) * nearPlan.refine
const patchSpan = (nearPlan.rect.i1 - nearPlan.rect.i0) / resX
const effective = patchCols / patchSpan
check(
  effective > m.baseGrid(cfg, RES).resX,
  'the patch samples the ground more finely than the uniform mesh',
  `${Math.round(effective)} columns across the map vs ${m.baseGrid(cfg, RES).resX}`,
)

// --- but never finer than the DEM, or it starts resolving the creases between
// its pixels and the patch comes out visibly crinkled against the base.
check(
  effective <= SAMPLES.w * 1.05,
  'and no finer than the heightmap itself',
  `${Math.round(effective)} columns vs ${SAMPLES.w} DEM pixels`,
)

// At the shipping field of view the triangle budget happens to land just under
// the DEM's own resolution, so the cap is not what holds the patch back and the
// check above would pass with the cap removed. Narrow the view and the budget
// asks for far more than the data can answer — that is where the cap earns its
// place, so it is checked where it actually bites.
{
  const tight = cameraAt(NEAR)
  tight.fov = 20
  tight.updateProjectionMatrix()
  tight.updateMatrixWorld(true)
  const rect = m.visibleMapRect(tight, cfg)
  const capped = m.planLod(rect, cfg, RES, SAMPLES)
  const uncapped = m.planLod(rect, cfg, RES)
  check(
    capped !== null && uncapped !== null && capped.refine < uncapped.refine,
    'a narrow view asks for more detail than the DEM holds, and is refused',
    `budget wanted ${uncapped?.refine}x, the heightmap allows ${capped?.refine}x`,
  )
}

// --- Rebuilds must not happen while the camera is moving.
//
// Adopting a plan rebuilds a mesh — 150-300ms of blocked main thread — and
// doing it mid-zoom is what made zooming feel broken on a phone and a laptop
// alike. This simulates a damped zoom the way OrbitControls runs one: each
// frame the camera covers a fraction of the distance still to go, then stops.
{
  const simulate = (fps, seconds) => {
    const dt = 1 / fps
    const state = { still: 0, drifting: 0 }
    let pos = 288 // framed on the whole world
    const target = 12 // as close as the controls allow
    let replans = 0
    let movingReplans = 0
    for (let t = 0; t < seconds; t += dt) {
      const before = pos
      // OrbitControls' damping: a fixed fraction of the remaining gap per frame.
      pos += (target - pos) * 0.08
      const moved = Math.abs(pos - before)
      if (m.shouldReplan(state, moved, pos, dt)) {
        replans++
        if (moved / Math.max(1, pos) > 0.001) movingReplans++
      }
    }
    return { replans, movingReplans }
  }

  // At a real frame rate the zoom converges in well under a second, and the
  // rebuild lands after it: one plan, none of them mid-gesture.
  const real = simulate(60, 6)
  check(
    real.movingReplans === 0,
    'at 60fps the plan is never reconsidered while the camera is moving',
    `${real.movingReplans} of ${real.replans} passes fell mid-zoom`,
  )
  // The rest are once-a-quarter-second passes taken while parked, which cost a
  // `planLod` call each and rebuild nothing: `planChanged` sees the same plan.
  check(
    real.replans >= 1,
    'but it does reconsider once the camera settles',
    `${real.replans} passes while stationary, all naming the same plan`,
  )

  // The drift safety net: a camera that never stops must still refine. At one
  // frame a second — which is what this project's headless environment renders
  // at, and the reason an earlier version wrongly concluded that waiting for
  // stillness would never fire — the fallback is what keeps it working.
  const slow = simulate(1, 30)
  check(
    slow.replans >= 1,
    'and a camera that never settles still refines, via the drift limit',
    `${slow.replans} replans at one frame a second`,
  )
}

// --- The two meshes must meet exactly, or the world tears along the join.
console.log('')
const seam = seamGap(base, patch, nearPlan.rect, cfg, nearPlan.baseResolution)
// A gap of zero because nothing was compared is not a passing check, it is a
// broken one — so the count is asserted before the gap.
check(seam.compared > 800, 'the join was actually sampled', `${seam.compared} points on the seam`)
check(
  seam.worst < 1e-3,
  'base and patch meet with no crack',
  `worst gap ${seam.worst.toExponential(2)} world units`,
)

console.log(bad === 0 ? '\nzoom-dependent detail is behaving' : `\n${bad} check(s) failed`)
process.exit(bad === 0 ? 0 : 1)

/**
 * The largest height difference between the two meshes anywhere along the
 * rectangle where they meet. A patch subdivides the base's edge, so its
 * in-between vertices have to be pinned to that edge; without the pin this
 * reports the local relief instead of zero.
 */
function seamGap(base, patch, rect, cfg, resolution) {
  const { resX, resZ } = m.baseGrid(cfg, resolution)
  const aspect = cfg.aspect
  let worst = 0
  let compared = 0
  for (let s = 0; s <= 300; s++) {
    const f = s / 300
    const along = [
      [rect.i0 + f * (rect.i1 - rect.i0), rect.j0],
      [rect.i0 + f * (rect.i1 - rect.i0), rect.j1],
      [rect.i0, rect.j0 + f * (rect.j1 - rect.j0)],
      [rect.i1, rect.j0 + f * (rect.j1 - rect.j0)],
    ]
    for (const [gi, gj] of along) {
      const wx = ((gi / resX) * 2 - 1) * 50 * aspect
      const wz = ((gj / resZ) * 2 - 1) * 50
      const a = surfaceAt(base, wx, wz)
      const b = surfaceAt(patch, wx, wz)
      if (a === null || b === null) continue
      compared++
      worst = Math.max(worst, Math.abs(a - b))
    }
  }
  return { worst, compared }
}

/** Height of a mesh's surface directly above a ground point, or null if off it. */
function surfaceAt(geo, wx, wz) {
  const idx = geo.index.array
  const pos = geo.attributes.position.array
  // Track the nearest triangle as well as an exact hit: a point on the seam
  // lies on a shared edge, where floating-point rounding can put it a hair
  // outside every triangle and a strict containment test then finds nothing.
  let best = null
  let bestOut = Infinity
  for (let t = 0; t < idx.length; t += 3) {
    const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]]
    const ax = pos[a * 3]
    const az = pos[a * 3 + 2]
    const bx = pos[b * 3]
    const bz = pos[b * 3 + 2]
    const cx = pos[c * 3]
    const cz = pos[c * 3 + 2]
    const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz)
    if (Math.abs(d) < 1e-12) continue
    const l1 = ((bz - cz) * (wx - cx) + (cx - bx) * (wz - cz)) / d
    const l2 = ((cz - az) * (wx - cx) + (ax - cx) * (wz - cz)) / d
    const l3 = 1 - l1 - l2
    const out = Math.max(-l1, -l2, -l3, 0)
    if (out < bestOut) {
      bestOut = out
      best = l1 * pos[a * 3 + 1] + l2 * pos[b * 3 + 1] + l3 * pos[c * 3 + 1]
      if (out === 0) return best
    }
  }
  return bestOut < 1e-6 ? best : null
}
