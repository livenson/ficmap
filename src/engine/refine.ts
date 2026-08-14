import type { HeightField } from './noise'

/**
 * What `scripts/build-dem-tiles.mjs` writes alongside its tiles.
 *
 * The grid is `width` x `height` pixels over the base map's own bounding box,
 * cut into `cols` x `rows` tiles of `tile` pixels. `tiles` lists only the ones
 * that exist: a tile whose elevations were all one value is not written, because
 * that is open ocean and the base map already draws it correctly.
 */
export interface TileManifest {
  scale: number
  tile: number
  cols: number
  rows: number
  width: number
  height: number
  tiles: string[]
}

/** A rectangle of the map, -1..1 on both axes. */
interface Rect {
  x0: number
  x1: number
  z0: number
  z1: number
}

export interface RefinableField extends HeightField {
  /**
   * Bumped whenever new data arrives.
   *
   * The point of this counter is that the FIELD ITSELF never changes identity.
   * Fourteen components memoize on it — the forests, the rivers, the fish, the
   * ripples, the wisps, the routes — so handing out a new object when a tile
   * landed would re-scatter every tree and re-trace every river, and the world
   * would visibly reshuffle around the reader. Only the terrain mesh watches
   * this number.
   */
  readonly version: number
  /** Whether a tile has been loaded, or is known not to exist. */
  settled(tx: number, ty: number): boolean
  /** Tiles overlapping a map rectangle that exist and are not yet loaded. */
  wanted(rect: Rect): { tx: number; ty: number }[]
  /** Take a decoded tile: one byte per pixel, `tile` x `tile` of them. */
  accept(tx: number, ty: number, bytes: Uint8Array): void
  /**
   * How many samples actually cover a map rectangle — the base map's own grid,
   * or the finer one where tiles have arrived to fill the rectangle completely.
   * The terrain uses this to decide how far it may subdivide: past the data's
   * own resolution a finer mesh resolves the creases in the interpolation
   * rather than any ground.
   */
  samplesOver(rect: Rect): { w: number; h: number }
}

/**
 * Wrap a base height field so finer data can be laid over it as it arrives,
 * without ever handing out a different object.
 *
 * `at()` reads from the finest data available at each point and falls back to
 * the base, so the field is correct from the first frame and only gets better.
 */
export function makeRefinable(base: HeightField, man: TileManifest): RefinableField {
  const { tile, cols, rows, width, height } = man
  // Which tiles exist at all. A position absent from the manifest is flat
  // ocean: there is nothing finer to fetch, and the base map is already right.
  const exists = new Set(man.tiles)
  const loaded = new Map<string, Uint8Array>()
  const key = (tx: number, ty: number) => `${tx}_${ty}`

  let version = 0

  /**
   * One pixel of the fine grid, or null where no tile covers it.
   *
   * Deliberately a whole-grid lookup rather than a per-tile one: a bilinear tap
   * near a tile's edge needs pixels from the tile next door, and clamping at the
   * edge instead would make neighbouring tiles disagree by half a pixel — a
   * grid of hairline seams ruled across the map.
   */
  const finePixel = (gx: number, gy: number): number | null => {
    const cx = Math.max(0, Math.min(width - 1, gx))
    const cy = Math.max(0, Math.min(height - 1, gy))
    const t = loaded.get(key(Math.floor(cx / tile), Math.floor(cy / tile)))
    return t ? t[(cy % tile) * tile + (cx % tile)] / 255 : null
  }

  const at = (x: number, z: number): number => {
    const fx = ((Math.max(-1, Math.min(1, x)) + 1) / 2) * (width - 1)
    const fy = ((Math.max(-1, Math.min(1, z)) + 1) / 2) * (height - 1)
    const x0 = Math.floor(fx)
    const y0 = Math.floor(fy)
    const a = finePixel(x0, y0)
    // No fine data here at all: the base map is the answer.
    if (a === null) return base.at(x, z)
    const b = finePixel(x0 + 1, y0)
    const c = finePixel(x0, y0 + 1)
    const d = finePixel(x0 + 1, y0 + 1)
    // At the edge of the loaded region some taps fall outside it. Falling back
    // to the base for just those blends the two rather than stepping between
    // them — the tiles were cut over the base's own metre range, so the values
    // are directly comparable and the blend is meaningful.
    const bb = b ?? base.at(x, z)
    const cc = c ?? base.at(x, z)
    const dd = d ?? base.at(x, z)
    const tx = fx - x0
    const ty = fy - y0
    return (a * (1 - tx) + bb * tx) * (1 - ty) + (cc * (1 - tx) + dd * tx) * ty
  }

  /** The tile positions a map rectangle touches. */
  const spanning = (rect: Rect) => {
    const toCol = (x: number) =>
      Math.max(0, Math.min(cols - 1, Math.floor((((x + 1) / 2) * (width - 1)) / tile)))
    const toRow = (z: number) =>
      Math.max(0, Math.min(rows - 1, Math.floor((((z + 1) / 2) * (height - 1)) / tile)))
    const out: { tx: number; ty: number }[] = []
    for (let ty = toRow(Math.min(rect.z0, rect.z1)); ty <= toRow(Math.max(rect.z0, rect.z1)); ty++)
      for (let tx = toCol(Math.min(rect.x0, rect.x1)); tx <= toCol(Math.max(rect.x0, rect.x1)); tx++)
        out.push({ tx, ty })
    return out
  }

  const settled = (tx: number, ty: number) =>
    loaded.has(key(tx, ty)) || !exists.has(key(tx, ty))

  return {
    at,
    // What the base holds, for anything that asks the field directly.
    samples: base.samples,
    get version() {
      return version
    },
    settled,
    wanted(rect) {
      return spanning(rect).filter((t) => exists.has(key(t.tx, t.ty)) && !loaded.has(key(t.tx, t.ty)))
    },
    accept(tx, ty, bytes) {
      if (bytes.length !== tile * tile) {
        throw new Error(`tile ${tx}_${ty} is ${bytes.length} bytes, expected ${tile * tile}`)
      }
      loaded.set(key(tx, ty), bytes)
      version++
    },
    samplesOver(rect) {
      // Only claim the finer resolution when the WHOLE rectangle is settled.
      // Anywhere partly covered still has coarse ground in view, and letting
      // the mesh subdivide for the fine part would tessellate the coarse part
      // past its data too.
      const covered = spanning(rect).every((t) => settled(t.tx, t.ty))
      return covered ? { w: width, h: height } : (base.samples ?? { w: width, h: height })
    },
  }
}
