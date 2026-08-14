import { makeRefinable, type RefinableField, type TileManifest } from './refine'
import type { HeightField } from './noise'

/**
 * Fetching the finer elevation tiles for whatever part of the map the camera is
 * over.
 *
 * The tiles live in `public/dem/<set>/`, which Vite copies verbatim into the
 * build. Their URLs are therefore built at RUNTIME, and runtime URLs do not get
 * Vite's `base` applied — only imported assets do. The site is served from a
 * project subpath on GitHub Pages, so composing these by hand without
 * `import.meta.env.BASE_URL` would give paths that work in dev and 404 in
 * production.
 */
const BASE = import.meta.env.BASE_URL ?? '/'
const url = (set: string, file: string) =>
  `${BASE.endsWith('/') ? BASE : `${BASE}/`}dem/${set}/${file}`

/** How many tiles to have in flight at once. */
const IN_FLIGHT = 4

/**
 * How many decoded tiles to keep. Each is `tile²` bytes — 256 KB at 512px — so
 * this is a few tens of megabytes at most, and panning the length of a
 * continent does not grow without bound.
 */
const KEEP = 64

export interface TileLoader {
  /** The field the app reads. One object, for the life of the world. */
  field: RefinableField
  /**
   * Ask for the tiles covering a map rectangle. Returns immediately; the field
   * sharpens as they arrive and bumps its version each time.
   */
  request(rect: { x0: number; x1: number; z0: number; z1: number }): void
  /** Stop caring — the world changed under us. */
  dispose(): void
}

export async function loadManifest(set: string): Promise<TileManifest | null> {
  try {
    const res = await fetch(url(set, 'manifest.json'))
    if (!res.ok) return null
    return (await res.json()) as TileManifest
  } catch {
    return null
  }
}

/** Decode a tile PNG to one byte per pixel. */
async function decode(src: string, size: number): Promise<Uint8Array> {
  const blob = await (await fetch(src)).blob()
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('no 2d context')
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const { data } = ctx.getImageData(0, 0, size, size)
  const grey = new Uint8Array(size * size)
  for (let i = 0; i < grey.length; i++) grey[i] = data[i * 4]
  return grey
}

export function makeTileLoader(
  base: HeightField,
  man: TileManifest,
  set: string,
  onChange: () => void,
): TileLoader {
  const field = makeRefinable(base, man)
  const queue: { tx: number; ty: number }[] = []
  const inFlight = new Set<string>()
  // Insertion-ordered, so the oldest key is the first the iterator yields.
  const seen: string[] = []
  let alive = true
  let running = 0

  const pump = () => {
    while (alive && running < IN_FLIGHT && queue.length) {
      const next = queue.shift()!
      const key = `${next.tx}_${next.ty}`
      if (inFlight.has(key) || field.settled(next.tx, next.ty)) continue
      inFlight.add(key)
      running++
      decode(url(set, `${key}.png`), man.tile)
        .then((bytes) => {
          if (!alive) return
          field.accept(next.tx, next.ty, bytes)
          seen.push(key)
          // Nothing is evicted yet: dropping a tile would make the ground under
          // the reader jump back to the coarse map, which is worse than holding
          // a few more megabytes. The cap is a backstop against a very long
          // session panning the whole globe.
          if (seen.length > KEEP) seen.shift()
          onChange()
        })
        .catch(() => {
          // A tile that will not load is not fatal: the base map still covers
          // that ground, so the world stays correct, just softer there.
        })
        .finally(() => {
          if (!alive) return
          inFlight.delete(key)
          running--
          pump()
        })
    }
  }

  return {
    field,
    request(rect) {
      if (!alive) return
      const want = field.wanted(rect)
      // Newest request first: the reader is looking here now, and whatever was
      // queued for a rectangle they have already left can wait.
      queue.unshift(...want.filter((t) => !inFlight.has(`${t.tx}_${t.ty}`)))
      pump()
    },
    dispose() {
      alive = false
      queue.length = 0
    },
  }
}
