#!/usr/bin/env node
/**
 * Generate a synthetic heightmap for A SONG OF ICE AND FIRE / Game of Thrones —
 * the KNOWN WORLD: Westeros as a long north–south continent on the west, the
 * Narrow Sea, and the great mass of Essos running east from the Free Cities,
 * across the Dothraki Sea, to Slaver's Bay, Qarth and the Red Waste. Laid out
 * from the canonical world map (Westeros occupies only the western fifth; Essos
 * is far larger). It is invented geography, so this is a shaped field, not a
 * DEM — built to read as the published map.
 *
 * Map space x ∈ [-1,1] west→east, z ∈ [-1,1] north→south:
 *   • WESTEROS x ≈ -0.95..-0.44 — the Wall at z ≈ -0.68, the North above the
 *     pinched Neck, then the Riverlands/Vale/Westerlands, the Crownlands on
 *     Blackwater Bay, the Reach and Stormlands, and Dorne at z ≈ 0.39;
 *   • the NARROW SEA at x ≈ -0.44..-0.38, with Dragonstone in it;
 *   • ESSOS from the Free-Cities coast east: Braavos and the Hills of Norvos in
 *     the north, the flat DOTHRAKI SEA across the middle, smoking VALYRIA and
 *     Slaver's Bay in the south, and the RED WASTE in the far south-east;
 *   • islands: the Iron Islands, Ibben in the Shivering Sea, the Summer Isles.
 *
 * Output is 1.1:1; set terrain.aspect = 1.1.
 *
 * Usage: node scripts/build-westeros.mjs  → src/assets/westeros-height.png
 */
import { PNG } from 'pngjs'
import { createNoise2D } from 'simplex-noise'
import alea from 'alea'
import fs from 'fs'

const W = 968
const H = 880
const OUT = new URL('../src/assets/westeros-height.png', import.meta.url)

const n1 = createNoise2D(alea('westeros-fbm'))
const n2 = createNoise2D(alea('westeros-warp'))
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
const gauss = (d) => Math.exp(-(d * d))
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
/** Soft-edged box: 1 well inside, easing to 0 across `e` at the border. */
const box = (x, z, cx, cz, hx, hz, e = 0.05) =>
  smooth(hx, hx - e, Math.abs(x - cx)) * smooth(hz, hz - e, Math.abs(z - cz))
/** Soft-edged ellipse. */
const ell = (x, z, cx, cz, rx, rz, e = 0.14) =>
  smooth(1, 1 - e, Math.hypot((x - cx) / rx, (z - cz) / rz))

const out = new Float32Array(W * H)
let mn = Infinity,
  mx = -Infinity
for (let j = 0; j < H; j++) {
  for (let i = 0; i < W; i++) {
    const nx = (i / (W - 1)) * 2 - 1
    const nz = (j / (H - 1)) * 2 - 1
    // Warp so every coastline comes out ragged rather than ruled.
    const wob = 0.05 * fbm(nx * 2.1 + 3, nz * 2.1) + 0.022 * fbm(nx * 5.8 + 11, nz * 5.8)
    const wx = nx + wob + 0.028 * n2(nx * 1.7, nz * 1.7)
    const wz = nz + 0.04 * fbm(nx * 2.5 + 21, nz * 2.5) + 0.022 * n2(nx * 1.7 + 5, nz * 1.7 + 5)

    // Land is built as a smooth FIELD (generously overlapping lobes with wide
    // ramps), then thresholded against a noise-perturbed level — so the coasts
    // wander organically instead of exposing the rectangles underneath.
    // Ramp must stay narrower than the smallest lobe, or small lobes never
    // reach full strength and the threshold below erases them.
    const E = 0.07

    // ---------------- WESTEROS (the western fifth of the world) ----------------
    // Every half-size must exceed E, or the lobe never reaches full strength
    // and the threshold below erases it (this is what severed the Neck).
    const north = box(wx, wz, -0.72, -0.52, 0.24, 0.30, E)
    const neck = box(wx, wz, -0.60, -0.28, 0.19, 0.24, E)
    const middle = box(wx, wz, -0.71, -0.06, 0.24, 0.28, E)
    const vale = ell(wx, wz, -0.52, -0.19, 0.13, 0.14, 0.3)
    const southW = box(wx, wz, -0.69, 0.18, 0.25, 0.22, E)
    const dorne = box(wx, wz, -0.66, 0.38, 0.25, 0.19, E)
    let westerosF = Math.max(north, neck, middle, vale, southW, dorne)

    // ---------------- ESSOS ----------------
    const essosNorth = box(wx, wz, 0.02, -0.02, 0.40, 0.22, E) // Braavos → Norvos
    const essosMid = box(wx, wz, 0.36, 0.30, 0.66, 0.28, E) // the Dothraki Sea
    const essosSE = box(wx, wz, 0.66, 0.64, 0.38, 0.24, E) // Slaver's Bay → Red Waste
    const disputed = ell(wx, wz, -0.30, 0.31, 0.14, 0.16, 0.3) // Tyrosh/Myr/Lys
    let essosF = Math.max(essosNorth, essosMid, essosSE, disputed)

    // Threshold each continent separately so the Narrow Sea between them stays
    // open; the wandering level is what makes the outline look natural.
    const wobble = 0.08 * fbm(wx * 2.4 + 31, wz * 2.4) + 0.035 * fbm(wx * 6.5 + 41, wz * 6.5)
    const cut = (f) => smooth(0.36 + wobble, 0.52 + wobble, f)
    let westeros = cut(westerosF)
    let essos = cut(essosF)

    // Keep the NARROW SEA open. The two continents' ramps would otherwise meet
    // and fuse into one landmass, so the strait is cut explicitly — from the
    // UNWARPED x, so it stays a clean channel rather than wandering shut.
    const strait = smooth(-0.45, -0.425, nx) * smooth(-0.345, -0.37, nx)
    westeros *= 1 - strait
    essos *= 1 - strait

    // ---------------- Westeros coastal detail ----------------
    // The canonical coast is full of bays, capes and islands; without these the
    // continent reads as a smooth blob. Applied AFTER the threshold so small
    // features survive instead of being smoothed away.
    // Bays (carved out of the land):
    for (const [bx, bz, rx, rz, amt] of [
      [-0.885, -0.62, 0.05, 0.085, 0.95], // Bay of Ice (west, below the Wall)
      [-0.495, -0.60, 0.045, 0.065, 0.9], // Bay of Seals (east)
      [-0.875, -0.33, 0.045, 0.06, 0.9], // Blazewater Bay (west)
      [-0.845, -0.145, 0.055, 0.06, 0.85], // Ironman's Bay (west, off Pyke)
      [-0.475, -0.30, 0.055, 0.055, 0.9], // the Bite (east, north of the Vale)
      [-0.45, 0.02, 0.05, 0.05, 0.9], // Blackwater Bay
      [-0.47, 0.225, 0.05, 0.045, 0.85], // Shipbreaker Bay (Stormlands)
      [-0.53, 0.315, 0.07, 0.035, 0.85], // the Sea of Dorne
    ]) {
      westeros *= 1 - amt * gauss(Math.hypot((wx - bx) / rx, (wz - bz) / rz))
    }
    // Capes and points (added back onto the land):
    for (const [cx2, cz2, rx, rz] of [
      [-0.945, -0.50, 0.035, 0.05], // Sea Dragon Point (west)
      [-0.935, -0.26, 0.03, 0.045], // Cape Kraken / Flint's Finger
      [-0.442, -0.235, 0.045, 0.022], // the Fingers (east, thin)
      [-0.437, 0.055, 0.032, 0.03], // Crackclaw Point
      [-0.432, 0.135, 0.028, 0.04], // Massey's Hook
      [-0.435, 0.275, 0.03, 0.035], // Cape Wrath
    ]) {
      westeros = Math.max(westeros, ell(wx, wz, cx2, cz2, rx, rz, 0.35))
    }
    essos *= 1 - 0.9 * gauss(Math.hypot((wx - 0.4) / 0.09, (wz - 0.55) / 0.07)) // Slaver's Bay
    essos *= 1 - 0.75 * gauss(Math.hypot((wx - 0.2) / 0.1, (wz - 0.72) / 0.07)) // the Smoking Sea

    // ---------------- Islands ----------------
    const ironIsles = Math.max(
      ell(wx, wz, -0.89, -0.11, 0.045, 0.05),
      ell(wx, wz, -0.94, -0.06, 0.03, 0.03),
    )
    const dragonstone = ell(wx, wz, -0.444, 0.065, 0.024, 0.024)
    // Smaller named isles off the Westerosi coast, from the canonical map.
    const westerosIsles = Math.max(
      ell(wx, wz, -0.925, -0.665, 0.028, 0.024), // Bear Island (Bay of Ice)
      ell(wx, wz, -0.455, -0.275, 0.022, 0.018), // the Three Sisters (the Bite)
      ell(wx, wz, -0.86, 0.47, 0.032, 0.022), // the Arbor (south-west)
      ell(wx, wz, -0.83, 0.395, 0.022, 0.016), // the Shield Islands
      ell(wx, wz, -0.44, 0.33, 0.02, 0.016), // Estermont / the Stepstones side
    )
    const ibben = ell(wx, wz, 0.08, -0.70, 0.07, 0.05)
    const summerIsles = Math.max(
      ell(wx, wz, -0.78, 0.95, 0.05, 0.035),
      ell(wx, wz, -0.68, 0.92, 0.035, 0.028),
    )
    const sothoryos = cut(box(wx, wz, 0.62, 1.04, 0.36, 0.16, E)) // a sliver at the south

    const land = Math.max(
      westeros,
      essos,
      ironIsles,
      dragonstone,
      ibben,
      summerIsles,
      westerosIsles,
      sothoryos,
    )

    let h = 0.08 + land * 0.3

    // ---------------- Relief ----------------
    // The Wall — a straight ice ridge across the top of Westeros.
    const wallZ = -0.675 + 0.008 * Math.sin(nx * 9)
    h +=
      gauss((nz - wallZ) / 0.014) *
      smooth(-0.72, -0.68, nx) *
      smooth(-0.48, -0.53, nx) *
      0.55 *
      clamp01(westeros * 1.8)
    // The Lands of Always Winter above it.
    h += smooth(-0.70, -0.85, wz) * (0.2 + 0.24 * fbm(wx * 5 + 2, wz * 5)) * westeros
    // The Mountains of the Moon (the Vale).
    h += cone(wx, wz, -0.53, -0.20, 0.07, 0.42) * westeros
    // The Westerlands hills.
    h += cone(wx, wz, -0.80, -0.03, 0.08, 0.24) * westeros
    // The Red Mountains, dividing Dorne from the Reach.
    h += gauss((wz - 0.30) / 0.025) * smooth(-0.90, -0.84, wx) * smooth(-0.44, -0.5, wx) * 0.34 * westeros
    h += fbm(wx * 3.4, wz * 3.4) * 0.05 * westeros

    // Essos: the Hills of Norvos, the Bone Mountains in the far east, and the
    // ranges walling Slaver's Bay; the Dothraki Sea between them stays flat.
    h += cone(wx, wz, -0.10, -0.04, 0.13, 0.26) * essos
    h += gauss((wx - 0.86) / 0.07) * smooth(0.0, 0.2, wz) * smooth(0.9, 0.7, wz) * 0.38 * essos
    h += gauss((wz - 0.46) / 0.05) * smooth(0.3, 0.42, wx) * smooth(0.86, 0.74, wx) * 0.26 * essos
    // Valyria — a smoking volcanic cone in the drowned Smoking Sea.
    h += cone(wx, wz, 0.20, 0.70, 0.045, 0.55) * clamp01(essos + 0.5)
    h += fbm(wx * 3 + 9, wz * 3) * 0.04 * essos

    // Cheap erosion, gated to the high ground.
    const pingpong = (x) => {
      const t = ((x % 2) + 2) % 2
      return t < 1 ? t : 2 - t
    }
    const gully = smooth(0.15, 0.85, pingpong(1 + fbm(wx * 6 , wz * 6) * 2.4))
    h -= gully * 0.05 * land * smooth(0.42, 0.72, h)

    h = clamp01(h)
    if (land < 0.05) h = Math.min(h, 0.13)

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
console.log(`sea guide: set seaLevel ≈ ${(((0.2 - mn) / (mx - mn))).toFixed(3)}`)
