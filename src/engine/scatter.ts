import alea from 'alea'
import type { HeightField } from './noise'
import { WORLD_HALF, elevationAt } from './terrain'
import type { TerrainConfig } from '../types'

export interface TreeInstance {
  x: number
  y: number
  z: number
  scale: number
  rot: number
  /** 0..1 elevation tint factor (lower = lusher). */
  shade: number
}

/**
 * Deterministically scatter trees across the wooded band of a world: above the
 * shoreline, below the tree line, denser in the mid-elevations. Same seed →
 * same forest. Uses rejection sampling so trees avoid sea and bare peaks.
 */
export function scatterTrees(
  field: HeightField,
  terrain: TerrainConfig,
  density: number,
): TreeInstance[] {
  if (density <= 0) return []
  const seaLevel = terrain.seaLevel ?? 0.42
  const treeLineLow = seaLevel + 0.03
  const treeLineHigh = Math.min(0.75, seaLevel + 0.34)
  const span = treeLineHigh - treeLineLow

  const rng = alea(`${terrain.seed}:flora`)
  const target = Math.round(density * 2600)
  const out: TreeInstance[] = []
  let tries = 0
  const maxTries = target * 12

  while (out.length < target && tries < maxTries) {
    tries++
    const mx = rng() * 2 - 1
    const mz = rng() * 2 - 1
    const h = field.at(mx, mz)
    if (h <= treeLineLow || h >= treeLineHigh) continue
    // Denser in the middle of the band, thinning toward shore and tree line.
    const band = 1 - Math.abs((h - treeLineLow) / span - 0.5) * 2
    if (rng() > 0.25 + band * 0.75) continue

    out.push({
      x: mx * WORLD_HALF,
      y: elevationAt(field, terrain, mx, mz),
      z: mz * WORLD_HALF,
      scale: 0.55 + rng() * 0.9,
      rot: rng() * Math.PI * 2,
      shade: (h - treeLineLow) / span,
    })
  }
  return out
}
