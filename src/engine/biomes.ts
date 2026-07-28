import { Color } from 'three'
import type { TerrainConfig } from '../types'

/**
 * Resolve an elevation (0..1) to a vertex color using the story's biome bands.
 * Bands are matched low→high; a little blending across band edges keeps the
 * terrain from looking like flat contour steps.
 */
export function makeBiomeColorer(cfg: TerrainConfig) {
  const bands = [...cfg.biomes].sort((a, b) => a.maxHeight - b.maxHeight)
  const colors = bands.map((b) => new Color(b.color))
  const seaLevel = cfg.seaLevel ?? 0.42

  const scratch = new Color()

  return function colorAt(height: number, out: Color = scratch): Color {
    // Below sea level everything is underwater; darken with depth so shallows
    // read lighter than the deep. The water plane sits on top of this.
    if (height <= seaLevel) {
      const depth = seaLevel === 0 ? 0 : height / seaLevel // 0 deep → 1 shore
      out.copy(colors[0])
      out.multiplyScalar(0.35 + 0.4 * depth)
      return out
    }

    for (let i = 0; i < bands.length; i++) {
      if (height <= bands[i].maxHeight) {
        if (i === 0) {
          out.copy(colors[0])
          return out
        }
        const lo = bands[i - 1].maxHeight
        const hi = bands[i].maxHeight
        const t = hi === lo ? 1 : (height - lo) / (hi - lo)
        // Blend only near the seam for a soft transition.
        const blend = Math.min(1, t / 0.15)
        out.copy(colors[i - 1]).lerp(colors[i], blend)
        return out
      }
    }
    out.copy(colors[colors.length - 1])
    return out
  }
}
