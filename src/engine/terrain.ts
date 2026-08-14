import { BufferGeometry, Float32BufferAttribute } from 'three'
import { createNoise2D } from 'simplex-noise'
import alea from 'alea'
import { clamp01, type HeightField } from './noise'
import { makeBiomeColorer } from './biomes'
import type { TerrainConfig } from '../types'

/**
 * World layout. Map space [-1, 1]^2 maps onto a WORLD_SIZE square centered on
 * the origin, on the X/Z ground plane. Height rises along +Y.
 */
export const WORLD_SIZE = 100
export const WORLD_HALF = WORLD_SIZE / 2

/**
 * How far (in world units) to sink the deep sea floor beneath the water plane,
 * eased to zero at the shore. Keeps the translucent sea from z-fighting the
 * near-coincident flat ocean floor on low-relief real-DEM worlds.
 */
const SEA_FLOOR_DROP = 1.0

/** World units per tile of the optional detail (bump/normal) texture. */
const DETAIL_TILE = 4

/** Convert a normalized map coordinate to a world ground Z (or a square X). */
export function mapToWorld(coord: number): number {
  return coord * WORLD_HALF
}

/**
 * How far back the camera has to sit to frame a world of this aspect, as a
 * multiple of the square-world distance — and, with it, how far the haze, the
 * water plane and the shadow frustum have to reach.
 *
 * A wider-than-square world needs pulling back to frame its width. A world that
 * is TALLER than it is wide has the same problem on the other axis: the viewport
 * is landscape, so it is the world's depth that runs off the screen — Sweden is
 * 777 km across and 1,611 km down, and at the square world's distance its
 * southern end (where Nils Holgersson starts) sits below the bottom edge. The
 * 1.4 divisor is roughly the viewport's own aspect, so the depth term only
 * starts pulling back once the world is narrower than the screen.
 */
export function frameScale(aspect: number): number {
  return Math.max(1, aspect, 1 / Math.max(aspect, 0.05) / 1.4)
}

/**
 * World aspect: X width / Z depth. 1 = square (default); >1 = wider than deep,
 * e.g. an equirectangular world map, so continents keep real proportions
 * instead of being stretched vertically into the square.
 */
export function aspectOf(cfg?: { aspect?: number }): number {
  const a = cfg?.aspect ?? 1
  return a > 0 ? a : 1
}

/** Convert a normalized map X to world X, widened by the world's aspect. */
export function mapToWorldX(coord: number, cfg?: { aspect?: number }): number {
  return coord * WORLD_HALF * aspectOf(cfg)
}

/** World-space Y (elevation) at a given map point. */
export function elevationAt(
  field: HeightField,
  cfg: TerrainConfig,
  x: number,
  z: number,
): number {
  const heightScale = cfg.heightScale ?? 22
  const seaLevel = cfg.seaLevel ?? 0.42
  const h = field.at(x, z)
  // Clamp underwater terrain up to the shoreline so markers/routes that sit in
  // water still rest at the visible surface rather than sinking below it.
  const eff = Math.max(h, seaLevel)
  return eff * heightScale
}

/**
 * Build a vertex-colored terrain mesh from a height field.
 *
 * `resolution` is the number of segments per side; vertex count is
 * (resolution + 1)^2. 220 gives a detailed world while staying comfortably
 * interactive on a laptop.
 */
export function buildTerrainGeometry(
  field: HeightField,
  cfg: TerrainConfig,
  resolution = cfg.meshResolution ?? 320,
): BufferGeometry {
  const heightScale = cfg.heightScale ?? 22
  const seaLevel = cfg.seaLevel ?? 0.42
  const aspect = aspectOf(cfg)
  const colorer = makeBiomeColorer(cfg)
  // Procedural "texture": mid-frequency patches + high-frequency grain that
  // mottle the flat biome colors so land reads as fields/woods, not paint.
  const mottle = createNoise2D(alea(`${cfg.seed ?? 'x'}:mottle`))

  // A wide world stretches its width, so give it proportionally more columns —
  // otherwise each triangle spans a huge distance and the map turns to vague
  // low-poly facets when you zoom in. Capped so the vertex count stays sane.
  const resX = Math.round(resolution * Math.min(Math.max(1, aspect), 3))
  const resZ = resolution
  const nx = resX + 1
  const nz = resZ + 1
  const positions = new Float32Array(nx * nz * 3)
  const colors = new Float32Array(nx * nz * 3)
  // World-space UVs so an optional tiled detail (bump/normal) texture repeats
  // uniformly regardless of world size — one tile every DETAIL_TILE world units.
  const uvs = new Float32Array(nx * nz * 2)
  const indices: number[] = []

  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const u = i / resX // 0..1
      const v = j / resZ
      const mx = u * 2 - 1 // -1..1 map space
      const mz = v * 2 - 1

      const h = field.at(mx, mz)
      let y = h * heightScale
      // Sink the sea floor below the translucent water plane so the two never
      // z-fight into a shimmering band over the ocean at a distant zoom (on a
      // low-relief world sea level and the flat floor are otherwise almost the
      // same height). The drop eases to nothing at the shore, so the coastline
      // and shallows are untouched — it's just a hidden offshore basin.
      if (h < seaLevel && seaLevel > 0) {
        const belowFrac = Math.min(1, (seaLevel - h) / seaLevel) // 0 at shore → 1 deep
        y -= SEA_FLOOR_DROP * belowFrac
      }

      const idx = (j * nx + i) * 3
      const wx = mx * WORLD_HALF * aspect
      const wz = mz * WORLD_HALF
      positions[idx] = wx
      positions[idx + 1] = y
      positions[idx + 2] = wz
      const uvIdx = (j * nx + i) * 2
      uvs[uvIdx] = wx / DETAIL_TILE
      uvs[uvIdx + 1] = wz / DETAIL_TILE

      const c = colorer(h)
      // Mottle brightness by noise — patches, grain, and a finer speckle that
      // keeps the surface reading as texture (not flat paint) at close zoom.
      const land = h > seaLevel ? 1 : 0.3
      const patch = mottle(mx * 7, mz * 7)
      const grain = mottle(mx * 38 + 11, mz * 38 - 7)
      const speckle = mottle(mx * 120 + 3, mz * 120 - 5)
      const shade = 1 + (patch * 0.12 + grain * 0.06 + speckle * 0.035) * land
      colors[idx] = clamp01(c.r * shade)
      colors[idx + 1] = clamp01(c.g * shade)
      colors[idx + 2] = clamp01(c.b * shade)
    }
  }

  for (let j = 0; j < resZ; j++) {
    for (let i = 0; i < resX; i++) {
      const a = j * nx + i
      const b = j * nx + i + 1
      const c = (j + 1) * nx + i
      const d = (j + 1) * nx + i + 1
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}
