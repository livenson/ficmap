#!/usr/bin/env node
/**
 * Generate a synthetic heightmap of Eriador — the north-west of Middle-earth,
 * where The Fellowship of the Ring is set — laid out to match Tolkien's map:
 * the western sea and the Grey Havens, the Shire lowlands, the Misty Mountains
 * as a long north-south wall down the middle, the vale of the Anduin to its
 * east, and forest country beyond. It is not a real DEM (Middle-earth is
 * invented) — it is a shaped field, so the terrain reads as the book's map
 * rather than as random noise.
 *
 * Usage: node scripts/build-middle-earth.mjs  → src/assets/middle-earth-height.png
 */
import { PNG } from 'pngjs'
import { createNoise2D } from 'simplex-noise'
import alea from 'alea'
import fs from 'fs'

const N = 320
const OUT = new URL('../src/assets/middle-earth-height.png', import.meta.url)

const n1 = createNoise2D(alea('eriador-fbm'))
const n2 = createNoise2D(alea('eriador-warp'))
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
// Fractal noise in [-1,1].
function fbm(x, y, oct = 5) {
  let a = 0.5,
    f = 1,
    sum = 0,
    norm = 0
  for (let i = 0; i < oct; i++) {
    sum += a * n1(x * f, y * f)
    norm += a
    a *= 0.5
    f *= 2
  }
  return sum / norm
}

const out = new Float32Array(N * N)
let mn = Infinity,
  mx = -Infinity
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    const nx = (i / (N - 1)) * 2 - 1 // west→east
    const nz = (j / (N - 1)) * 2 - 1 // north→south

    // Domain warp so nothing is ruler-straight.
    const wx = nx + 0.06 * n2(nx * 1.3, nz * 1.3)
    const wz = nz + 0.06 * n2(nx * 1.3 + 5, nz * 1.3 + 5)

    // --- Western sea + a wiggly coastline (the Gulf of Lune bites in). ---
    const coast = -0.72 + 0.1 * Math.sin(wz * 2.4) + 0.05 * fbm(wz * 2, 3.1)
    const gulf = Math.exp(-(((wz + 0.15) / 0.14) ** 2)) * 0.12 // Lune inlet
    const land = smooth(coast - 0.04, coast + 0.12 + gulf, wx)

    // --- Base land: gently rising off the coast, dipping again in the east. ---
    let h = 0.16 + land * 0.16

    // --- The Misty Mountains: a long N–S wall down the middle. ---
    const ridgeX = 0.08 + 0.12 * Math.sin(wz * 1.5) + 0.04 * fbm(wz * 1.7 + 9, 2)
    const dRidge = (wx - ridgeX) / 0.16
    const misty = Math.exp(-(dRidge * dRidge)) * (0.62 + 0.12 * fbm(wz * 4, nx * 4))
    h += misty * land

    // --- Ered Luin: a lesser range on the far north-west coast. ---
    const eredLuin = Math.exp(-(((wx + 0.82) / 0.1) ** 2)) * Math.exp(-(((wz + 0.55) / 0.5) ** 2)) * 0.28
    h += eredLuin * land

    // --- East of the mountains: the Anduin vale, then rising wilderland. ---
    const eastOfMisty = smooth(ridgeX + 0.05, ridgeX + 0.4, wx)
    h -= eastOfMisty * 0.06 // the river vale sits a touch lower

    // Texture.
    h += fbm(wx * 2.4, wz * 2.4) * 0.06 * land

    // --- Cheap erosion (the three.js infinite-terrain trick): a smoothstepped,
    // ping-ponged noise carves parallel gullies down the slopes, sharper and
    // deeper on higher ground so ridgelines read as eroded stone rather than a
    // smooth mound. Kept gentle so the map stays calm and legible. ---
    const pingpong = (x) => {
      const t = ((x % 2) + 2) % 2
      return t < 1 ? t : 2 - t
    }
    const gully = smooth(0.15, 0.85, pingpong(1 + fbm(wx * 5.5, wz * 5.5) * 2.4))
    h -= gully * 0.055 * land * smooth(0.22, 0.6, h)

    h = clamp01(h)
    // Force the deep sea flat and low so the coast reads cleanly.
    if (land < 0.02) h = Math.min(h, 0.12)

    out[j * N + i] = h
    if (h < mn) mn = h
    if (h > mx) mx = h
  }
}

const png = new PNG({ width: N, height: N })
for (let k = 0; k < N * N; k++) {
  const g = Math.round(((out[k] - mn) / (mx - mn)) * 255)
  png.data[k * 4] = g
  png.data[k * 4 + 1] = g
  png.data[k * 4 + 2] = g
  png.data[k * 4 + 3] = 255
}
fs.writeFileSync(OUT, PNG.sync.write(png))
console.log(`wrote ${OUT.pathname} (${N}x${N})  min=${mn.toFixed(3)} max=${mx.toFixed(3)}`)
