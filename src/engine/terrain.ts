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

/** Convert a normalized map coordinate to a world ground X (or Z). */
export function mapToWorld(coord: number): number {
  return coord * WORLD_HALF
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
  resolution = 220,
): BufferGeometry {
  const heightScale = cfg.heightScale ?? 22
  const seaLevel = cfg.seaLevel ?? 0.42
  const colorer = makeBiomeColorer(cfg)
  // Procedural "texture": mid-frequency patches + high-frequency grain that
  // mottle the flat biome colors so land reads as fields/woods, not paint.
  const mottle = createNoise2D(alea(`${cfg.seed ?? 'x'}:mottle`))

  const n = resolution + 1
  const positions = new Float32Array(n * n * 3)
  const colors = new Float32Array(n * n * 3)
  const indices: number[] = []

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const u = i / resolution // 0..1
      const v = j / resolution
      const mx = u * 2 - 1 // -1..1 map space
      const mz = v * 2 - 1

      const h = field.at(mx, mz)
      const y = h * heightScale

      const idx = (j * n + i) * 3
      positions[idx] = mx * WORLD_HALF
      positions[idx + 1] = y
      positions[idx + 2] = mz * WORLD_HALF

      const c = colorer(h)
      // Mottle brightness by noise — stronger on land, faint under the sea.
      const patch = mottle(mx * 7, mz * 7)
      const grain = mottle(mx * 38 + 11, mz * 38 - 7)
      const shade = 1 + (patch * 0.12 + grain * 0.06) * (h > seaLevel ? 1 : 0.3)
      colors[idx] = clamp01(c.r * shade)
      colors[idx + 1] = clamp01(c.g * shade)
      colors[idx + 2] = clamp01(c.b * shade)
    }
  }

  for (let j = 0; j < resolution; j++) {
    for (let i = 0; i < resolution; i++) {
      const a = j * n + i
      const b = j * n + i + 1
      const c = (j + 1) * n + i
      const d = (j + 1) * n + i + 1
      indices.push(a, c, b)
      indices.push(b, c, d)
    }
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}
