import type { HeightField } from './noise'

/**
 * A height field backed by a grayscale image (a DEM). Map coords x,z ∈ [-1,1]
 * map to the image: x → column (west→east), z → row (north→south, so z=-1 is
 * the top row). Values are the red channel / 255, bilinearly sampled.
 */
export function makeImageHeightField(
  data: Uint8ClampedArray,
  w: number,
  h: number,
): HeightField {
  const at = (x: number, z: number): number => {
    const u = clamp01(x * 0.5 + 0.5) * (w - 1)
    const v = clamp01(z * 0.5 + 0.5) * (h - 1)
    const x0 = Math.floor(u)
    const y0 = Math.floor(v)
    const x1 = Math.min(w - 1, x0 + 1)
    const y1 = Math.min(h - 1, y0 + 1)
    const fx = u - x0
    const fy = v - y0
    const px = (yy: number, xx: number) => data[(yy * w + xx) * 4] / 255
    const a = px(y0, x0)
    const b = px(y0, x1)
    const c = px(y1, x0)
    const d = px(y1, x1)
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy
  }
  return { at }
}

/** A flat placeholder field (all sea) used until the image finishes loading. */
export const FLAT_FIELD: HeightField = { at: () => 0 }

/** Load an image URL and build a HeightField from its pixels. */
export function loadImageHeightField(url: string): Promise<HeightField> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('no 2d context'))
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      resolve(makeImageHeightField(data, canvas.width, canvas.height))
    }
    img.onerror = () => reject(new Error(`failed to load heightmap: ${url}`))
    img.src = url
  })
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
