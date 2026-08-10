#!/usr/bin/env node
/**
 * Generate a synthetic heightmap for THE FOREST SONG (Lesya Ukrainka's
 * "Lisova pisnia") — an enchanted glade in the Volhynian POLISSIA: flat,
 * hoary primeval woodland around a dark forest lake, with a boggy fen to the
 * south-west, a low old-forest ridge to the north, and a lone stony knoll —
 * "the Rock" where He Who Sits in the Rock dwells — to the south-east.
 *
 * Polissia is wetland forest, so the relief is deliberately gentle: the lake
 * and the fen are the shaping features, not mountains. Invented layout, shaped
 * to read as the play's world rather than as random noise.
 *
 * Usage: node scripts/build-polissia.mjs  → src/assets/polissia-height.png
 */
import { PNG } from 'pngjs'
import { createNoise2D } from 'simplex-noise'
import alea from 'alea'
import fs from 'fs'

const N = 320
const OUT = new URL('../src/assets/polissia-height.png', import.meta.url)

const n1 = createNoise2D(alea('polissia-fbm'))
const n2 = createNoise2D(alea('polissia-warp'))
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
const cone = (x, z, cx, cz, r, amp) =>
  amp * Math.exp(-(((x - cx) ** 2 + (z - cz) ** 2) / (r * r)))
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
    const wx = nx + 0.05 * n2(nx * 1.4, nz * 1.4)
    const wz = nz + 0.05 * n2(nx * 1.4 + 5, nz * 1.4 + 5)

    // --- Base: the flat forest floor, with a low old-forest ridge rising along
    // the north and gentle rolling elsewhere. ---
    let h = 0.52
    h += smooth(-0.3, -0.95, wz) * 0.17 * (0.8 + 0.3 * fbm(wx * 2.6 + 3, wz * 2.6))
    h += fbm(wx * 2.2, wz * 2.2) * 0.06

    // --- The Rock: a lone stony knoll to the south-east. ---
    h += cone(wx, wz, 0.62, 0.42, 0.15, 0.34)

    // --- The forest lake (Lake Nechimne) — a broad, soft depression a little
    // west of centre, with reedy shallows at its rim. ---
    const dLake = Math.hypot((wx - 0.02) / 0.34, (wz - 0.02) / 0.3)
    const lake = 1 - smooth(0.68, 1.12, dLake + 0.08 * fbm(wx * 2.2, wz * 2.2))
    h -= lake * 0.45

    // --- The fen: a boggy, water-logged flat in the south-west, sunk just to
    // the waterline so it reads as marsh rather than open lake. ---
    const dMarsh = Math.hypot((wx + 0.55) / 0.42, (wz - 0.52) / 0.32)
    const marsh = 1 - smooth(0.55, 1.1, dMarsh + 0.07 * fbm(wx * 2.4 + 9, wz * 2.4))
    h -= marsh * 0.2

    // Texture.
    h += fbm(wx * 3.1 + 4, wz * 3.1) * 0.03

    // --- Cheap erosion (gated to higher ground, so it only lightly textures
    // the ridge and the Rock; the flat wetland stays calm). ---
    const pingpong = (x) => {
      const t = ((x % 2) + 2) % 2
      return t < 1 ? t : 2 - t
    }
    const gully = smooth(0.15, 0.85, pingpong(1 + fbm(wx * 5.5, wz * 5.5) * 2.4))
    h -= gully * 0.04 * smooth(0.62, 0.85, h)

    h = clamp01(h)
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
console.log(`lake/water guide: seaLevel ≈ ${(((0.2 - mn) / (mx - mn))).toFixed(3)}`)
