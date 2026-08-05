#!/usr/bin/env node
/**
 * Generate a synthetic heightmap of north-western Middle-earth — the lands of
 * The Fellowship of the Ring, from the Grey Havens in the west to the eaves of
 * Mirkwood in the east — shaped to follow Tolkien's own map (checked against
 * Tolkien Gateway / canonical distances). It is not a real DEM (Middle-earth is
 * invented); it is a shaped field, so the terrain reads as the book's map
 * rather than as random noise.
 *
 * Layout, west → east (x ∈ [-1,1]) and north → south (z ∈ [-1,1]):
 *   • the western Sea of Belegaer, with the Gulf of Lune biting east to the
 *     Grey Havens (~z -0.28);
 *   • the Blue Mountains (Ered Luin) walling the north-west coast, their
 *     southern arm fading around the Shire's latitude;
 *   • the broad lowland of ERIADOR — Shire, Bree-land, the downs — with the
 *     Weather Hills as a short chain running north from Weathertop;
 *   • the MISTY MOUNTAINS: a long, near-full-height N–S wall down the middle,
 *     tilted so its southern end sits a touch east, notched by the Redhorn pass
 *     over Moria at its midpoint and opening to the Gap of Rohan in the south;
 *   • east of the wall, the low vale of the ANDUIN, then WILDERLAND rising to
 *     the forested highlands of Mirkwood, with Erebor an isolated peak in the
 *     north-east.
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
const gauss = (d) => Math.exp(-(d * d))
// A soft radial bump (mountain cone) centred at (cx,cz).
const cone = (x, z, cx, cz, r, amp) =>
  amp * Math.exp(-(((x - cx) ** 2 + (z - cz) ** 2) / (r * r)))
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
    const wx = nx + 0.05 * n2(nx * 1.3, nz * 1.3)
    const wz = nz + 0.05 * n2(nx * 1.3 + 5, nz * 1.3 + 5)

    // --- Western Sea of Belegaer + the Gulf of Lune. The coast runs roughly
    // N–S in the far west; the Gulf bites east toward the Grey Havens, so the
    // sea reaches inland in a band around z ≈ -0.28. ---
    const coast = -0.74 + 0.05 * Math.sin(wz * 3) + 0.04 * fbm(wz * 2, 3.1)
    const gulf = gauss((wz + 0.28) / 0.11) * 0.2 // Lune inlet
    const land = smooth(coast - 0.03, coast + 0.1 + gulf, wx)

    // --- Base land: the wide plain of Eriador, rising very gently off the
    // coast toward the feet of the mountains. ---
    let h = 0.15 + land * 0.13 + smooth(-0.6, 0.1, wx) * 0.05 * land

    // --- Blue Mountains (Ered Luin): a N–S range on the far NW coast, present
    // in the north and fading out around the Shire's latitude (z ≈ +0.15). ---
    const elRidge = -0.8 + 0.03 * Math.sin(wz * 2.4)
    const elNorth = smooth(0.15, -0.5, wz) // 1 in the north → 0 by mid-map
    const eredLuin = gauss((wx - elRidge) / 0.07) * 0.44 * elNorth
    h += eredLuin * land

    // --- The Weather Hills: a short, low chain running north from Weathertop
    // (a hump centred at x ≈ -0.24, z ≈ -0.32). ---
    const whRidge = -0.24 + 0.02 * Math.sin(wz * 4)
    const weatherHills =
      gauss((wx - whRidge) / 0.045) * gauss((wz + 0.32) / 0.24) * 0.17
    h += weatherHills * land

    // --- The Misty Mountains: a long N–S wall down the middle, tilted so the
    // southern end (Methedras / the Gap) sits a touch east of the northern end
    // (Gundabad). It runs nearly the full height of the map. ---
    const ridgeX = 0.09 + 0.07 * wz + 0.03 * fbm(wz * 1.8 + 9, 2)
    let misty = gauss((wx - ridgeX) / 0.13) * (0.66 + 0.14 * fbm(wz * 4, nx * 4))
    // The Redhorn pass over Moria notches the crest at the range's midpoint…
    misty *= 1 - 0.32 * gauss((wz - 0.16) / 0.06)
    // …and the Gap of Rohan opens it wide near the southern end.
    misty *= 1 - 0.5 * gauss((wz - 0.85) / 0.1)
    h += misty * land

    // --- East of the wall: the low vale of the Anduin, a trough just beyond
    // the eastern foothills, then Wilderland rising to the Mirkwood highlands
    // in the far east. ---
    const vale = gauss((wx - (ridgeX + 0.2)) / 0.1) * 0.1
    h -= vale * land * smooth(ridgeX, ridgeX + 0.12, wx)
    const wilder =
      smooth(ridgeX + 0.24, 0.85, wx) * (0.2 + 0.16 * fbm(wx * 2.6 + 2, wz * 2.6))
    h += wilder * land

    // --- Erebor, the Lonely Mountain: an isolated peak in the north-east. ---
    h += cone(wx, wz, 0.72, -0.52, 0.06, 0.46) * land

    // Texture.
    h += fbm(wx * 2.4, wz * 2.4) * 0.055 * land

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
