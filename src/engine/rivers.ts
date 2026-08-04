import alea from 'alea'
import type { HeightField } from './noise'
import type { MapPoint, TerrainConfig } from '../types'

/**
 * Trace rivers by steepest descent. From a set of high spring points, each
 * river flows downhill on the height field — sampling the local gradient and
 * stepping down it — until it reaches the sea (or stalls in a basin). Same seed
 * → same rivers. Points are returned in map space [-1, 1] for the renderer to
 * drape onto the terrain.
 */
export function generateRivers(
  field: HeightField,
  terrain: TerrainConfig,
  count: number,
): MapPoint[][] {
  if (count <= 0) return []
  const seaLevel = terrain.seaLevel ?? 0.42
  const rng = alea(`${terrain.seed}:rivers`)

  // Oversample springs: many will stall before reaching water and get dropped,
  // so we try more sources than requested and stop once `count` rivers arrive.
  const springs = pickSprings(field, seaLevel, count * 6, rng)
  const rivers: MapPoint[][] = []

  for (const s of springs) {
    if (rivers.length >= count) break
    const path: MapPoint[] = []
    let x = s.x
    let z = s.z
    let vx = 0
    let vz = 0
    const step = 0.011
    const eps = 0.009
    // A river is only worth drawing if it actually arrives at water (the sea or
    // an inland lake). Ones that stall on a slope or run off the map are dropped
    // so we never render a line that floats, disconnected, in the middle of the
    // land.
    let reachedWater = false

    for (let i = 0; i < 800; i++) {
      path.push({ x, z })
      const h = field.at(x, z)
      if (h <= seaLevel + 0.005) {
        reachedWater = true
        break // reached the coast / a lake shore
      }

      // Downhill gradient from central differences.
      const gx = field.at(x + eps, z) - field.at(x - eps, z)
      const gz = field.at(x, z + eps) - field.at(x, z - eps)
      let dx = -gx
      let dz = -gz
      const len = Math.hypot(dx, dz)
      if (len < 1e-5) {
        // Flat/basin: nudge along current momentum so it doesn't stall.
        dx = vx
        dz = vz
        const l2 = Math.hypot(dx, dz)
        if (l2 < 1e-5) break
        dx /= l2
        dz /= l2
      } else {
        dx /= len
        dz /= len
      }
      // Blend a little momentum for smoother, more natural meanders.
      vx = vx * 0.4 + dx * 0.6
      vz = vz * 0.4 + dz * 0.6
      const vl = Math.hypot(vx, vz) || 1
      x += (vx / vl) * step
      z += (vz / vl) * step
      if (x < -1 || x > 1 || z < -1 || z > 1) break
    }

    // Keep only rivers that both arrive at water AND run a meaningful distance;
    // this drops the short mountain-stream stubs that otherwise read as stray,
    // disconnected fragments.
    if (reachedWater && pathLength(path) >= 0.22) rivers.push(simplify(path))
  }
  return rivers
}

interface Spring {
  x: number
  z: number
  h: number
}

/** Choose well-spaced high points as river sources. */
function pickSprings(
  field: HeightField,
  seaLevel: number,
  count: number,
  rng: () => number,
): Spring[] {
  const lo = seaLevel + 0.22
  const candidates: Spring[] = []
  for (let i = 0; i < 900; i++) {
    const x = rng() * 1.7 - 0.85
    const z = rng() * 1.7 - 0.85
    const h = field.at(x, z)
    if (h > lo) candidates.push({ x, z, h })
  }
  candidates.sort((a, b) => b.h - a.h)

  const chosen: Spring[] = []
  const minDist = 0.28
  for (const c of candidates) {
    if (chosen.length >= count) break
    if (chosen.every((s) => Math.hypot(s.x - c.x, s.z - c.z) > minDist)) {
      chosen.push(c)
    }
  }
  return chosen
}

/** Total polyline length in map space. */
function pathLength(path: MapPoint[]): number {
  let d = 0
  for (let i = 1; i < path.length; i++) {
    d += Math.hypot(path[i].x - path[i - 1].x, path[i].z - path[i - 1].z)
  }
  return d
}

/** Drop points that barely move, to keep the drawn line light. */
function simplify(path: MapPoint[]): MapPoint[] {
  const out: MapPoint[] = [path[0]]
  for (let i = 1; i < path.length - 1; i++) {
    const p = out[out.length - 1]
    if (Math.hypot(path[i].x - p.x, path[i].z - p.z) > 0.02) out.push(path[i])
  }
  out.push(path[path.length - 1])
  return out
}
