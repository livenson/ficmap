#!/usr/bin/env node
/**
 * Generate a synthetic heightmap of the Lord Ruler's FINAL EMPIRE (Mistborn
 * Era 1), shaped to match the published map: a broad continent with the great
 * inland SOUTHERN SEA in the south-centre, the TERRIS MOUNTAINS walling the
 * north, the Lord Ruler's ashmounts as tall cones (Tyrian, Torinost, Morag,
 * Kalling, Zerinah, Faleast, Doriel), mountain country in the Western and
 * Crescent dominances, and the lakes of the Central Dominance (Lakes Luthadel,
 * Tyrian, Black Lake). Scadrial is invented, so this is a shaped field, not a
 * DEM — it reads as the book's map rather than as random noise.
 *
 * Output is 4:3 (the map's proportion); set terrain.aspect = 4/3.
 *
 * Usage: node scripts/build-scadrial.mjs  → src/assets/scadrial-height.png
 */
import { PNG } from 'pngjs'
import { createNoise2D } from 'simplex-noise'
import alea from 'alea'
import fs from 'fs'

const W = 400
const H = 300
const OUT = new URL('../src/assets/scadrial-height.png', import.meta.url)

const n1 = createNoise2D(alea('scadrial-fbm'))
const n2 = createNoise2D(alea('scadrial-warp'))
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
function fbm(x, y, oct = 5) {
  let a = 0.5, f = 1, sum = 0, norm = 0
  for (let i = 0; i < oct; i++) {
    sum += a * n1(x * f, y * f)
    norm += a
    a *= 0.5
    f *= 2
  }
  return sum / norm
}
// A soft radial bump (mountain / ashmount cone) centred at (cx,cz).
const cone = (x, z, cx, cz, r, amp) => amp * Math.exp(-(((x - cx) ** 2 + (z - cz) ** 2) / (r * r)))

// Ashmount cones — (x east+, z south+, radius, height). From the map. They are
// deliberately taller than the Terris/range masses so only their tips glow.
const ASHMOUNTS = [
  [0.0, -0.16, 0.075, 0.95], // Tyrian (in Lake Tyrian)
  [0.0, -0.43, 0.065, 0.9], // Torinost
  [-0.22, -0.31, 0.065, 0.88], // Morag
  [0.33, -0.33, 0.075, 0.95], // Kalling
  [-0.2, 0.06, 0.062, 0.86], // Zerinah
  [0.18, 0.11, 0.07, 0.9], // Faleast
  [0.06, 0.25, 0.062, 0.86], // Doriel
]

// Inland lakes to carve (x, z, radius).
const LAKES = [
  [0.24, -0.11, 0.06], // Lake Luthadel
  [0.35, -0.01, 0.08], // Black Lake
]

const out = new Float32Array(W * H)
let mn = Infinity, mx = -Infinity
for (let j = 0; j < H; j++) {
  for (let i = 0; i < W; i++) {
    const nx = (i / (W - 1)) * 2 - 1 // west→east
    const nz = (j / (H - 1)) * 2 - 1 // north→south
    const wx = nx + 0.05 * n2(nx * 1.4, nz * 1.4)
    const wz = nz + 0.05 * n2(nx * 1.4 + 7, nz * 1.4 + 7)

    // --- Base continent: land across the middle, seas at the far rim. ---
    // Distance into the map from each edge, so the outermost frame is ocean.
    const edge =
      smooth(-0.98, -0.72, wx) * // west sea (Southern Islands side)
      smooth(0.98, 0.74, wx) * // east sea (beyond Crescent)
      smooth(-0.99, -0.86, wz) * // a little north sea in the corners
      smooth(0.99, 0.82, wz) // south sea beyond Remote
    let h = 0.2 + edge * 0.26

    // --- The great inland Southern Sea (south-centre). ---
    const ssx = (wx + 0.28) / 0.36
    const ssz = (wz - 0.4) / 0.34
    const southernSea = 1 - smooth(0.7, 1.15, Math.hypot(ssx, ssz) + 0.12 * fbm(wx * 2.2, wz * 2.2))
    h -= southernSea * 0.5 * edge

    // --- Mountain masses: tall enough to read as ranges, but kept below the
    // ashmount cones so only the volcanoes' tips glow. Combined with max() (not
    // summed) so overlapping ranges in the corners don't stack up into the red. ---
    const terris = smooth(-0.5, -0.85, wz) * (0.34 + 0.14 * fbm(wx * 3.2, wz * 3.2 + 3))
    const west = smooth(-0.2, -0.62, wx) * smooth(0.0, -0.5, wz) * 0.3 * (0.7 + fbm(wx * 3 + 4, wz * 3))
    const cres = smooth(0.45, 0.8, wx) * 0.32 * (0.7 + fbm(wx * 3 - 4, wz * 3 + 2))
    const remote = smooth(0.6, 0.9, wz) * smooth(0.4, -0.2, wx) * 0.28 * (0.7 + fbm(wx * 3, wz * 3 - 5))
    h += Math.max(terris, west, cres, remote) * edge

    // --- Ashmount cones (added on top, so they are the tallest points). ---
    for (const [cx, cz, r, amp] of ASHMOUNTS) h += cone(wx, wz, cx, cz, r, amp) * edge

    // --- Texture, then carve lakes and clamp seas flat. ---
    h += fbm(wx * 2.6, wz * 2.6) * 0.05 * edge
    for (const [cx, cz, r] of LAKES) {
      const d = Math.hypot((wx - cx) / r, (wz - cz) / r)
      if (d < 1) h = Math.min(h, 0.14 - 0.02 * (1 - d))
    }
    h = clamp01(h)
    if (edge < 0.04) h = Math.min(h, 0.12) // deep rim ocean, flat

    out[j * W + i] = h
    if (h < mn) mn = h
    if (h > mx) mx = h
  }
}

const png = new PNG({ width: W, height: H })
for (let k = 0; k < W * H; k++) {
  const g = Math.round(((out[k] - mn) / (mx - mn)) * 255)
  png.data[k * 4] = g
  png.data[k * 4 + 1] = g
  png.data[k * 4 + 2] = g
  png.data[k * 4 + 3] = 255
}
fs.writeFileSync(OUT, PNG.sync.write(png))
console.log(`wrote ${OUT.pathname} (${W}x${H})  min=${mn.toFixed(3)} max=${mx.toFixed(3)}`)
console.log(`sea fraction guide: set seaLevel ≈ ${(((0.14 - mn) / (mx - mn))).toFixed(3)} (lake/sea top)`)
