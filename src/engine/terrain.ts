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
 * A rectangle of base-grid cells, in grid indices rather than map units, so the
 * base mesh and a detail patch can talk about exactly the same edge.
 */
export interface GridRect {
  i0: number
  i1: number
  j0: number
  j1: number
}

/** The base grid's dimensions for a world, at a given segment count. */
export function baseGrid(cfg: TerrainConfig, resolution = cfg.meshResolution ?? 320) {
  const aspect = aspectOf(cfg)
  // A wide world stretches its width, so give it proportionally more columns —
  // otherwise each triangle spans a huge distance and the map turns to vague
  // low-poly facets when you zoom in. Capped so the vertex count stays sane.
  return {
    resX: Math.round(resolution * Math.min(Math.max(1, aspect), 3)),
    resZ: resolution,
  }
}

interface BuildOpts {
  /**
   * Base-grid cells to leave empty, for a detail patch to fill. Without this
   * the patch would z-fight the coarse triangles underneath it.
   */
  hole?: GridRect
  /**
   * Build only this rectangle of base-grid cells, subdivided `refine` times
   * further in each direction — the detail patch that fills a `hole`.
   *
   * Its boundary vertices are pinned to the base mesh's own edge (see
   * `edgePin` below) so the two meet without a crack.
   */
  patch?: GridRect & { refine: number }
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
  opts: BuildOpts = {},
): BufferGeometry {
  const heightScale = cfg.heightScale ?? 22
  const seaLevel = cfg.seaLevel ?? 0.42
  const aspect = aspectOf(cfg)
  const colorer = makeBiomeColorer(cfg)
  // Procedural "texture": mid-frequency patches + high-frequency grain that
  // mottle the flat biome colors so land reads as fields/woods, not paint.
  const mottle = createNoise2D(alea(`${cfg.seed ?? 'x'}:mottle`))

  const { resX, resZ } = baseGrid(cfg, resolution)

  /**
   * The mottle that keeps flat biome colour reading as fields and woods rather
   * than paint. Evaluated per vertex, so how grainy it looks depends entirely
   * on how dense the mesh is: a coarse mesh smooths the high-frequency terms
   * away, a fine one resolves them. Two meshes of different densities over the
   * same ground therefore came out visibly different in texture, and the join
   * between a detail patch and the base showed as a hard rectangle even though
   * the geometry matched exactly.
   *
   * So it is sampled on the base grid and interpolated in between. A patch
   * vertex halfway between two base vertices takes the value halfway between
   * theirs, and the mottle looks the same at every mesh density.
   */
  const mottleAt = (gi: number, gj: number) => {
    const mx = (gi / resX) * 2 - 1
    const mz = (gj / resZ) * 2 - 1
    const patch = mottle(mx * 7, mz * 7)
    const grain = mottle(mx * 38 + 11, mz * 38 - 7)
    const speckle = mottle(mx * 120 + 3, mz * 120 - 5)
    return patch * 0.12 + grain * 0.06 + speckle * 0.035
  }
  const gridMottle = (gi: number, gj: number) => {
    const i = Math.floor(gi)
    const j = Math.floor(gj)
    const ti = gi - i
    const tj = gj - j
    if (ti === 0 && tj === 0) return mottleAt(i, j)
    const a = mottleAt(i, j)
    const b = mottleAt(i + 1, j)
    const c = mottleAt(i, j + 1)
    const d = mottleAt(i + 1, j + 1)
    return (a * (1 - ti) + b * ti) * (1 - tj) + (c * (1 - ti) + d * ti) * tj
  }

  const sample = (mx: number, mz: number, gi: number, gj: number) => {
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
    const c = colorer(h)
    const land = h > seaLevel ? 1 : 0.3
    const shade = 1 + gridMottle(gi, gj) * land
    return {
      y,
      r: clamp01(c.r * shade),
      g: clamp01(c.g * shade),
      b: clamp01(c.b * shade),
    }
  }

  const p = opts.patch
  // A patch covers `refine` sub-cells per base cell; the base mesh is 1:1.
  const K = p ? Math.max(1, Math.round(p.refine)) : 1
  const i0 = p ? p.i0 : 0
  const j0 = p ? p.j0 : 0
  const cols = p ? (p.i1 - p.i0) * K : resX
  const rows = p ? (p.j1 - p.j0) * K : resZ
  const nx = cols + 1
  const nz = rows + 1

  const positions = new Float32Array(nx * nz * 3)
  const colors = new Float32Array(nx * nz * 3)
  // World-space UVs so an optional tiled detail (bump/normal) texture repeats
  // uniformly regardless of world size — one tile every DETAIL_TILE world units.
  const uvs = new Float32Array(nx * nz * 2)
  const indices: number[] = []

  /**
   * On a patch boundary, take the height and colour from the coarse edge the
   * base mesh actually draws rather than from the field.
   *
   * The base mesh's edge along a seam is a straight segment between two base
   * vertices, while the patch subdivides that span K times. Sampling the field
   * at those in-between points puts them off the straight line — by up to the
   * local relief — and the mesh tears open along the seam. Interpolating along
   * the base edge instead makes the two edges the same polyline, so they meet
   * exactly. Only the outermost ring is pinned; one base cell in, the patch is
   * at full detail.
   */
  const edgePin = (gi: number, gj: number, along: 'x' | 'z') => {
    const g = along === 'x' ? gi : gj
    const lo = Math.floor(g)
    const t = g - lo
    const at = (c: number) => {
      const ii = along === 'x' ? c : gi
      const jj = along === 'x' ? gj : c
      return sample((ii / resX) * 2 - 1, (jj / resZ) * 2 - 1, ii, jj)
    }
    const a = at(lo)
    if (t === 0) return a
    const b = at(lo + 1)
    return {
      y: a.y + (b.y - a.y) * t,
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t,
    }
  }

  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      // Position on the base grid, fractional inside a patch.
      const gi = i0 + i / K
      const gj = j0 + j / K
      const mx = (gi / resX) * 2 - 1 // -1..1 map space
      const mz = (gj / resZ) * 2 - 1

      const onLeftRight = p && (i === 0 || i === cols)
      const onTopBottom = p && (j === 0 || j === rows)
      const s = onLeftRight
        ? edgePin(gi, gj, 'z') // the vertical seams vary along z
        : onTopBottom
          ? edgePin(gi, gj, 'x')
          : sample(mx, mz, gi, gj)

      const idx = (j * nx + i) * 3
      const wx = mx * WORLD_HALF * aspect
      const wz = mz * WORLD_HALF
      positions[idx] = wx
      positions[idx + 1] = s.y
      positions[idx + 2] = wz
      const uvIdx = (j * nx + i) * 2
      uvs[uvIdx] = wx / DETAIL_TILE
      uvs[uvIdx + 1] = wz / DETAIL_TILE

      colors[idx] = s.r
      colors[idx + 1] = s.g
      colors[idx + 2] = s.b
    }
  }

  const hole = opts.hole
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // Leave the patch's footprint empty so the two meshes never overlap.
      if (hole && i >= hole.i0 && i < hole.i1 && j >= hole.j0 && j < hole.j1) continue
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
