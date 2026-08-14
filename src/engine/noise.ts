import { createNoise2D } from 'simplex-noise'
import alea from 'alea'
import type { TerrainConfig } from '../types'

/**
 * A deterministic height sampler for a world. Given a seed and fractal
 * parameters it returns a function height(x, z) -> [0, 1] over map space
 * [-1, 1]^2, combining fractal Brownian motion with an optional island mask.
 *
 * Keeping this a pure function of (config) means the same story JSON always
 * renders the same landscape, on any machine — the basis of the "just add a
 * file" extensibility model.
 */
export interface HeightField {
  /** Sample normalized height in [0, 1] at map coords x, z ∈ [-1, 1]. */
  at(x: number, z: number): number
  /**
   * How many samples the field actually holds across the map, when it is built
   * from finite data. A DEM has a real pixel grid; tessellating finer than that
   * does not reveal more ground, it reveals the creases in the bilinear
   * interpolation BETWEEN its pixels, and the terrain comes out visibly
   * crinkled. Absent on procedural fields, which have detail at every scale.
   */
  samples?: { w: number; h: number }
}

export function makeHeightField(cfg: TerrainConfig): HeightField {
  const octaves = cfg.octaves ?? 5
  const frequency = cfg.frequency ?? 2.2
  const persistence = cfg.persistence ?? 0.5
  const lacunarity = cfg.lacunarity ?? 2
  const islandFalloff = clamp01(cfg.islandFalloff ?? 0.35)

  // Seeded PRNG → seeded noise. Same seed, same world.
  const prng = alea(cfg.seed)
  const noise2D = createNoise2D(prng)

  // Precompute the max possible fBm amplitude so we can normalize to [0, 1].
  let maxAmp = 0
  {
    let amp = 1
    for (let o = 0; o < octaves; o++) {
      maxAmp += amp
      amp *= persistence
    }
  }

  return {
    at(x: number, z: number): number {
      let amp = 1
      let freq = frequency
      let sum = 0
      for (let o = 0; o < octaves; o++) {
        // noise2D returns [-1, 1]; shift to [0, 1].
        const n = noise2D(x * freq, z * freq) * 0.5 + 0.5
        sum += n * amp
        amp *= persistence
        freq *= lacunarity
      }
      let h = sum / maxAmp // 0..1

      // Island mask: fade height toward the edges so worlds read as landmasses
      // surrounded by sea rather than terrain clipped by the map border.
      if (islandFalloff > 0) {
        const d = Math.max(Math.abs(x), Math.abs(z)) // 0 center → 1 edge
        const mask = 1 - smoothstep(1 - islandFalloff, 1, d)
        h *= mask
      }
      return clamp01(h)
    },
  }
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}
