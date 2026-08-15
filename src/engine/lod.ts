import * as THREE from 'three'
import { WORLD_HALF, aspectOf, baseGrid, type GridRect } from './terrain'
import type { TerrainConfig } from '../types'

/**
 * Zoom-dependent terrain detail, the way a map does it: coarse over the whole
 * world, sharp over the part you are actually looking at.
 *
 * The DEM behind the two whole-Earth worlds is 3072×1536, but the mesh drawn
 * over it is 1131×440 — undersampled 2.7× across and 3.5× down, so coastlines
 * and mountain ranges arrive as facets no matter how far you zoom in. Raising
 * the mesh everywhere is not the answer: nearly all of it is off-screen once
 * you are close, and it is one mesh, so nothing culls.
 *
 * Instead the terrain becomes two meshes that tile exactly:
 *
 *  - a BASE covering the whole map, with a rectangular hole cut in it, built at
 *    a resolution that drops as you zoom in (what is left is mostly horizon);
 *  - a PATCH filling that hole, covering only what the camera can see, built at
 *    many times the base's sampling rate.
 *
 * Measured on the Verne world, over the Mediterranean, against the DEM itself:
 *
 *     uniform 440 (what shipped)   995,280 tris   RMS height error 0.831
 *     base 220 + 8x patch          512,128 tris   RMS height error 0.186
 *
 * Half the triangles and four and a half times closer to the real ground.
 *
 * Zoomed out, the visible rectangle is the whole map and there is nothing to
 * gain, so `planLod` returns null and the terrain stays the single uniform mesh
 * it has always been.
 */

/** A rectangle of the map in map space, -1..1 on both axes. */
export interface MapRect {
  x0: number
  x1: number
  z0: number
  z1: number
}

export interface LodPlan {
  /** Segment count for the whole-map base mesh. */
  baseResolution: number
  /** Base-grid cells the patch covers — the hole, and the patch's own extent. */
  rect: GridRect
  /** How many times the patch subdivides each base cell. */
  refine: number
}

/**
 * How much further than the point the camera is looking at to still count as
 * "near enough to be worth resolving". Ground beyond this is background — it
 * covers few pixels, and the coarse base mesh draws it perfectly well.
 */
const NEAR_GROUND = 2.5

/**
 * The ground worth resolving, in map space.
 *
 * Not the whole frustum footprint. The map is tilted, so the top corners of the
 * view point at or above the horizon and their footprint runs off to infinity —
 * taking that literally makes the rectangle the entire world at every zoom, and
 * the detail patch never fires. What matters is the ground near what the camera
 * is actually looking at, so each corner ray is cut off at a few times the
 * distance to the centre of the view, and anything past that is left to the
 * base mesh.
 */
export function visibleMapRect(camera: THREE.Camera, cfg: TerrainConfig): MapRect | null {
  const aspect = aspectOf(cfg)
  const ray = new THREE.Ray()
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const hit = new THREE.Vector3()
  const dir = new THREE.Vector3()

  // Where the middle of the view meets the ground, and how far away that is.
  dir.set(0, 0, 0.5).unproject(camera).sub(camera.position).normalize()
  ray.set(camera.position, dir)
  if (!ray.intersectPlane(plane, hit)) return null // looking at the sky
  const reach = camera.position.distanceTo(hit) * NEAR_GROUND

  let x0 = Infinity
  let x1 = -Infinity
  let z0 = Infinity
  let z1 = -Infinity
  const eat = (wx: number, wz: number) => {
    const mx = wx / (WORLD_HALF * aspect)
    const mz = wz / WORLD_HALF
    x0 = Math.min(x0, mx)
    x1 = Math.max(x1, mx)
    z0 = Math.min(z0, mz)
    z1 = Math.max(z1, mz)
  }

  for (const [nx, ny] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    dir.set(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize()
    ray.set(camera.position, dir)
    // Hits within reach are the real corner; anything further (or over the
    // horizon) is clamped to the cutoff along that same direction.
    const t =
      ray.intersectPlane(plane, hit) && camera.position.distanceTo(hit) <= reach
        ? camera.position.distanceTo(hit)
        : reach
    eat(camera.position.x + dir.x * t, camera.position.z + dir.z * t)
  }
  // The ground directly beneath the camera, so a steep view still includes it.
  eat(camera.position.x, camera.position.z)

  return { x0, x1, z0, z1 }
}

/**
 * How much of the map is in view, as a fraction of its width and height. 1
 * means the whole map; 0.25 means a quarter of it across and down.
 */
function coverage(rect: MapRect) {
  return {
    x: Math.min(1, (rect.x1 - rect.x0) / 2),
    z: Math.min(1, (rect.z1 - rect.z0) / 2),
  }
}

/**
 * Only worlds whose mesh actually undersamples their data are worth splitting.
 * A procedural world has detail at every scale and would just get noisier, and
 * a small DEM has nothing more to give.
 */
export const LOD_MIN_RESOLUTION = 260

/**
 * Decide what to build for the current view, or null to keep one uniform mesh.
 *
 * The rectangle is snapped outwards to whole base-grid cells, because the patch
 * and the hole have to name the same edge for the two meshes to meet without a
 * crack. It is also padded, so small camera moves do not each trigger a rebuild.
 */
export function planLod(
  rect: MapRect,
  cfg: TerrainConfig,
  fullResolution: number,
  samples?: { w: number; h: number },
): LodPlan | null {
  if (fullResolution < LOD_MIN_RESOLUTION) return null
  const cov = coverage(rect)
  // More than about half the map in view: the patch would cover nearly
  // everything, so it would cost a second big mesh and buy almost nothing.
  if (cov.x > 0.5 || cov.z > 0.5) return null

  // Drop the base as the view narrows — what it still draws is periphery and
  // horizon — but not far. It is the safety net: if a fast pan outruns the
  // patch, the base is what shows through for a moment, and a base at 0.4x
  // renders visibly faceted up close.
  const wide = Math.max(cov.x, cov.z)
  const baseResolution = Math.max(220, Math.round(fullResolution * Math.max(0.6, wide * 1.4)))
  const { resX, resZ } = baseGrid(cfg, baseResolution)

  // Pad generously: the patch has to keep covering the view through a pan or a
  // zoom-out until the next plan lands, half a second later, and the coarse
  // base showing through at the edge would be obvious.
  const padX = (rect.x1 - rect.x0) * 0.45
  const padZ = (rect.z1 - rect.z0) * 0.45
  const toI = (x: number) => ((Math.max(-1, Math.min(1, x)) + 1) / 2) * resX
  const toJ = (z: number) => ((Math.max(-1, Math.min(1, z)) + 1) / 2) * resZ
  const i0 = Math.max(0, Math.floor(toI(rect.x0 - padX)))
  const i1 = Math.min(resX, Math.ceil(toI(rect.x1 + padX)))
  const j0 = Math.max(0, Math.floor(toJ(rect.z0 - padZ)))
  const j1 = Math.min(resZ, Math.ceil(toJ(rect.z1 + padZ)))
  if (i1 - i0 < 2 || j1 - j0 < 2) return null

  // Spend the patch on matching the base's own triangle count, so the pair
  // costs about what one uniform mesh did — but concentrated where you look.
  const cells = (i1 - i0) * (j1 - j0)
  const budget = resX * resZ
  let refine = Math.max(2, Math.min(16, Math.floor(Math.sqrt(budget / cells))))

  // Never tessellate finer than the heightmap itself. Past that point the mesh
  // stops resolving ground and starts resolving the creases where the DEM's
  // bilinear interpolation joins one pixel to the next: the patch comes out
  // visibly crinkled against the smooth base, and the join reads as a hard
  // rectangle even though the two meshes meet exactly. Going beyond this needs
  // more DATA, not more triangles.
  if (samples) {
    const cap = Math.min(samples.w / resX, samples.h / resZ)
    refine = Math.max(1, Math.min(refine, Math.floor(cap)))
    if (refine < 2) return null // the base already samples the DEM 1:1
  }

  return { baseResolution, rect: { i0, i1, j0, j1 }, refine }
}

/** Whether a new plan differs enough from the current one to be worth rebuilding. */
export function planChanged(a: LodPlan | null, b: LodPlan | null): boolean {
  if (!a || !b) return a !== b
  return (
    a.baseResolution !== b.baseResolution ||
    a.refine !== b.refine ||
    a.rect.i0 !== b.rect.i0 ||
    a.rect.i1 !== b.rect.i1 ||
    a.rect.j0 !== b.rect.j0 ||
    a.rect.j1 !== b.rect.j1
  )
}

/**
 * How long the camera must hold still before the terrain is rebuilt, and how
 * long it may drift before it is rebuilt anyway. Seconds.
 */
export const STILL_FOR = 0.25
export const DRIFT_LIMIT = 3.0

/** Mutable state for `shouldReplan`, owned by the caller. */
export interface ReplanState {
  still: number
  drifting: number
}

/**
 * Whether now is a good moment to rebuild the terrain.
 *
 * Adopting a plan rebuilds a mesh, which is 150-300ms of blocked main thread.
 * Doing that DURING a zoom is the worst possible moment: the gesture is exactly
 * when the frame budget matters, and the plan is about to be wrong again
 * anyway. So this says no while the camera is moving, and yes a quarter-second
 * after it stops.
 *
 * `moved` and `distance` are both in world units, and it is their RATIO that
 * matters: a camera 300 units out and one 12 units out cover very different
 * absolute distances for the same apparent motion.
 *
 * An earlier version of the terrain deliberately did not wait for stillness, on
 * the grounds that damping keeps the camera gliding and "still" might never
 * arrive. That is true only where the scene renders at about one frame a
 * second, as it does headless here — damping then takes a minute of wall-clock
 * to converge. At a real frame rate it settles in well under a second.
 * `DRIFT_LIMIT` is the safety net for the case that reasoning worried about: a
 * camera that never quite stops still refines, just not mid-gesture.
 *
 * Returns true and resets the state; the caller then re-plans.
 */
export function shouldReplan(
  state: ReplanState,
  moved: number,
  distance: number,
  dt: number,
): boolean {
  if (moved / Math.max(1, distance) > 0.001) {
    state.still = 0
    state.drifting += dt
  } else {
    state.still += dt
  }
  if (state.still < STILL_FOR && state.drifting < DRIFT_LIMIT) return false
  state.still = 0
  state.drifting = 0
  return true
}
