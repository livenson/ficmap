import alea from 'alea'
import type { HeightField } from './noise'
import { WORLD_HALF, aspectOf, elevationAt } from './terrain'
import type { TerrainConfig } from '../types'

export interface TreeInstance {
  x: number
  y: number
  z: number
  /** Map coordinates, kept so the tree can be re-draped without being moved. */
  mx: number
  mz: number
  scale: number
  rot: number
  /** 0..1 elevation tint factor (lower = lusher). */
  shade: number
}

/**
 * Deterministically scatter trees across the wooded band of a world: above the
 * shoreline, below the tree line, denser in the mid-elevations. Same seed →
 * same forest. Uses rejection sampling so trees avoid sea and bare peaks.
 *
 * WHERE a tree stands is decided here, once. HOW HIGH it stands is decided by
 * `drapeTrees`, separately, because on a world with detail tiles the ground
 * beneath it improves after the forest is placed — by 0.22 world units on
 * average over the Alps and up to 1.4, which is more than a tree is tall, so
 * one left at its original height would hang clear of the hillside. Re-running
 * the scatter instead would move every tree at once, because the rejection
 * sampling reads the field and finer ground accepts a different set of
 * candidates. Placement must therefore be frozen and only the heights redone.
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
  const aspect = aspectOf(terrain)
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
      x: mx * WORLD_HALF * aspect,
      y: elevationAt(field, terrain, mx, mz),
      z: mz * WORLD_HALF,
      mx,
      mz,
      scale: 0.55 + rng() * 0.9,
      rot: rng() * Math.PI * 2,
      shade: (h - treeLineLow) / span,
    })
  }
  return out
}

/**
 * Settle an already-placed forest onto the current ground, keeping every tree
 * exactly where it stands.
 *
 * Returns the same array when nothing moved, so a world without detail tiles
 * pays nothing and re-renders nothing.
 */
export function drapeTrees(
  trees: TreeInstance[],
  field: HeightField,
  terrain: TerrainConfig,
): TreeInstance[] {
  let moved = false
  const out = trees.map((t) => {
    const y = elevationAt(field, terrain, t.mx, t.mz)
    if (y === t.y) return t
    moved = true
    return { ...t, y }
  })
  return moved ? out : trees
}
