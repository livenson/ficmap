#!/usr/bin/env node
/**
 * Generate a heightmap for A SONG OF ICE AND FIRE / Game of Thrones — the known
 * world: WESTEROS on the west, the Narrow Sea, and ESSOS running far to the east.
 *
 * Westeros is TRACED, not approximated: its coastline is an explicit polygon of
 * points read off the canonical map of Westeros (in that map's pixel space, so
 * the numbers below can be checked against it directly), rasterised here by a
 * signed distance test. That gives the real silhouette — the Bay of Ice, Sea
 * Dragon Point, Flint's Finger and Blazewater Bay, Ironman's Bay, the Neck, the
 * Bite, the Fingers, Crackclaw Point, Blackwater Bay, Shipbreaker Bay, the Sea
 * of Dorne and the Dornish south coast — rather than a stack of soft boxes.
 * Offshore isles are added separately. Essos, for which no comparable outline
 * was traced, stays a shaped field.
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
const box = (x, z, cx, cz, hx, hz, e = 0.05) =>
  smooth(hx, hx - e, Math.abs(x - cx)) * smooth(hz, hz - e, Math.abs(z - cz))
const ell = (x, z, cx, cz, rx, rz, e = 0.14) =>
  smooth(1, 1 - e, Math.hypot((x - cx) / rx, (z - cz) / rz))

// ---------------------------------------------------------------------------
// The traced coastline of Westeros.
//
// Points are [px, py] in the canonical Westeros map's own pixel space
// (1344 x 1990), listed clockwise from the north-west, so they can be checked
// against that image directly. `img()` maps them into ficmap's [-1,1] space,
// placing Westeros in the western fifth of the world (x -0.96..-0.47) with the
// Narrow Sea to its east.
// ---------------------------------------------------------------------------
const IMG_W = 1344
const IMG_H = 1990
const img = ([px, py]) => [
  -0.96 + (px / IMG_W - 0.045) * 0.71848,
  -0.82 + (py / IMG_H - 0.025) * 1.375,
]

const WESTEROS_PX = [
  // --- the Lands of Always Winter, running off the top of the map ---
  //
  // These pixel rows are NEGATIVE on purpose. The traced reference image stops
  // a little north of the Wall, and tracing it literally left the Lands of
  // Always Winter as open sea with a label floating on it — the far north was
  // water. In the books the land does not end up there; the maps just stop. So
  // the polygon is carried past the top edge of the world, which is how the
  // published maps present it too: the ice runs off the paper.
  [140, -20], [260, -170], [430, -250], [600, -200], [730, -70], [800, 40],
  // --- north-east: Eastwatch, the Bay of Seals, the Grey Cliffs ---
  [790, 138], [782, 182], [800, 250], [862, 220], [900, 262], [948, 330],
  [930, 420], [890, 500], [930, 570], [908, 622],
  // --- east coast of the North: Widow's Watch, Ramsgate, White Harbor ---
  [860, 640], [762, 626], [700, 664], [660, 700],
  // --- the Neck and the Bite ---
  [702, 742], [742, 762], [772, 792], [832, 802], [872, 832], [930, 852],
  // --- the Fingers and the Vale coast ---
  [902, 882], [956, 900], [942, 972], [976, 1020], [950, 1072],
  // --- Bay of Crabs, Crackclaw Point, Blackwater Bay ---
  [900, 1100], [932, 1132], [900, 1166], [870, 1202], [800, 1232], [746, 1256],
  [762, 1300], [832, 1292], [790, 1312],
  // --- Massey's Hook down to the Stormlands ---
  [800, 1352], [832, 1402], [860, 1452], [830, 1502], [856, 1556], [902, 1542],
  [936, 1582], [900, 1622],
  // --- the Sea of Dorne, then Dorne's east coast ---
  [872, 1662], [800, 1652], [742, 1672], [792, 1702], [862, 1742], [900, 1792],
  [936, 1852], [900, 1902],
  // --- the southern shore of Dorne, running west ---
  [800, 1936], [690, 1956], [560, 1962], [450, 1950], [330, 1930], [250, 1902],
  // --- the south-west: Oldtown, the Shield Islands, the Reach coast ---
  [175, 1852], [130, 1792], [150, 1722], [166, 1652], [150, 1562], [170, 1502],
  [176, 1422], [196, 1332], [180, 1232], [216, 1162], [256, 1092],
  // --- Ironman's Bay, Cape Kraken, Blazewater Bay, Flint's Finger ---
  [350, 1012], [390, 942], [330, 872], [250, 822], [166, 782], [172, 702],
  [140, 652], [186, 602], [152, 546],
  // --- the western North: Stony Shore, Sea Dragon Point, the Bay of Ice ---
  [286, 472], [300, 402], [246, 356], [300, 332], [336, 302], [300, 266],
  [332, 216], [300, 176], [250, 122], [190, 40],
]
const WESTEROS = WESTEROS_PX.map(img)

/** True if (x,z) lies inside the traced polygon (even-odd ray cast). */
function inPoly(x, z, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]
    const [xj, zj] = poly[j]
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside
  }
  return inside
}
/** Distance from (x,z) to the polygon's nearest edge. */
function distToPoly(x, z, poly) {
  let best = Infinity
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]
    const [xj, zj] = poly[j]
    const dx = xj - xi
    const dz = zj - zi
    const len2 = dx * dx + dz * dz
    let t = len2 > 0 ? ((x - xi) * dx + (z - zi) * dz) / len2 : 0
    t = t < 0 ? 0 : t > 1 ? 1 : t
    const d = Math.hypot(x - (xi + t * dx), z - (zi + t * dz))
    if (d < best) best = d
  }
  return best
}

const out = new Float32Array(W * H)
let mn = Infinity,
  mx = -Infinity
for (let j = 0; j < H; j++) {
  for (let i = 0; i < W; i++) {
    const nx = (i / (W - 1)) * 2 - 1
    const nz = (j / (H - 1)) * 2 - 1
    // A light warp so the traced coast still reads as natural rock, not vector art.
    const wob = 0.016 * fbm(nx * 3.2 + 3, nz * 3.2) + 0.007 * fbm(nx * 8 + 11, nz * 8)
    const wx = nx + wob + 0.008 * n2(nx * 1.7, nz * 1.7)
    const wz = nz + 0.012 * fbm(nx * 3.4 + 21, nz * 3.4) + 0.008 * n2(nx * 1.7 + 5, nz * 1.7 + 5)

    // ---------------- WESTEROS: the traced outline ----------------
    const inside = inPoly(wx, wz, WESTEROS)
    const dist = distToPoly(wx, wz, WESTEROS)
    // Soft shoreline: 0 outside, ramping to 1 just inside the traced edge.
    let westeros = inside ? smooth(0, 0.014, dist) : 0

    // ---------------- ESSOS (shaped, not traced) ----------------
    const E = 0.07
    const essosNorth = box(wx, wz, 0.02, -0.02, 0.4, 0.22, E)
    const essosMid = box(wx, wz, 0.36, 0.3, 0.66, 0.28, E)
    const essosSE = box(wx, wz, 0.66, 0.64, 0.38, 0.24, E)
    const disputed = ell(wx, wz, -0.3, 0.31, 0.14, 0.16, 0.3)
    const essosF = Math.max(essosNorth, essosMid, essosSE, disputed)
    const wobble = 0.08 * fbm(wx * 2.4 + 31, wz * 2.4) + 0.035 * fbm(wx * 6.5 + 41, wz * 6.5)
    let essos = smooth(0.36 + wobble, 0.52 + wobble, essosF)
    essos *= 1 - 0.9 * gauss(Math.hypot((wx - 0.4) / 0.09, (wz - 0.55) / 0.07)) // Slaver's Bay
    essos *= 1 - 0.75 * gauss(Math.hypot((wx - 0.2) / 0.1, (wz - 0.72) / 0.07)) // Smoking Sea
    // Keep the Narrow Sea open against Essos's western ramp.
    essos *= 1 - smooth(-0.45, -0.425, nx) * smooth(-0.345, -0.37, nx)

    // ---------------- Islands ----------------
    // Off Westeros (positions likewise read off the canonical map):
    const isles = Math.max(
      ell(wx, wz, ...img([222, 1039]).slice(0, 2), 0.03, 0.032), // Pyke / Iron Islands
      ell(wx, wz, ...img([170, 960]).slice(0, 2), 0.018, 0.02), // Great Wyk
      ell(wx, wz, ...img([342, 240]).slice(0, 2), 0.02, 0.016), // Bear Island
      ell(wx, wz, ...img([900, 293]).slice(0, 2), 0.022, 0.02), // Skagos
      ell(wx, wz, ...img([695, 818]).slice(0, 2), 0.016, 0.013), // the Three Sisters
      ell(wx, wz, ...img([905, 1267]).slice(0, 2), 0.016, 0.014), // Dragonstone
      ell(wx, wz, ...img([968, 1480]).slice(0, 2), 0.015, 0.014), // Tarth
      ell(wx, wz, ...img([145, 1181]).slice(0, 2), 0.016, 0.014), // Fair Isle
      ell(wx, wz, ...img([118, 1547]).slice(0, 2), 0.015, 0.012), // the Shield Islands
      ell(wx, wz, ...img([135, 1905]).slice(0, 2), 0.02, 0.015), // the Arbor
    )
    const ibben = ell(wx, wz, 0.08, -0.7, 0.07, 0.05)
    const summerIsles = Math.max(
      ell(wx, wz, -0.78, 0.95, 0.05, 0.035),
      ell(wx, wz, -0.68, 0.92, 0.035, 0.028),
    )
    const sothoryos = smooth(0.36 + wobble, 0.52 + wobble, box(wx, wz, 0.62, 1.04, 0.36, 0.16, E))

    const land = Math.max(westeros, essos, isles, ibben, summerIsles, sothoryos)
    let h = 0.08 + land * 0.3

    // ---------------- Relief ----------------
    // The Wall: a straight ice ridge from the Shadow Tower to Eastwatch.
    const [wallX0] = img([560, 145])
    const [wallX1, wallZ] = img([772, 145])
    h +=
      gauss((nz - wallZ) / 0.012) *
      smooth(wallX0 - 0.02, wallX0 + 0.01, nx) *
      smooth(wallX1 + 0.02, wallX1 - 0.01, nx) *
      0.55 *
      clamp01(westeros * 2)
    // The Lands of Always Winter / Frostfangs above it.
    h += smooth(wallZ - 0.02, wallZ - 0.14, wz) * (0.2 + 0.24 * fbm(wx * 6 + 2, wz * 6)) * westeros
    // And beyond the Frostfangs, the ice itself. This second ramp starts at
    // the Wall and carries the far north over 0.84, which is where the story's
    // biome table turns white — without it the new land came out the same
    // grey-brown as the Mountains of the Moon, which is not what "always
    // winter" means. It also puts the deep north well above the tree line, so
    // nothing scatters up there.
    h += smooth(-0.76, -0.88, wz) * 0.36 * westeros
    // The Mountains of the Moon, walling the Vale.
    h += cone(wx, wz, ...img([790, 1010]).slice(0, 2), 0.055, 0.42) * westeros
    // The Westerlands hills above Casterly Rock.
    h += cone(wx, wz, ...img([300, 1230]).slice(0, 2), 0.06, 0.24) * westeros
    // The Red Mountains, dividing Dorne from the Reach.
    const [, redZ] = img([0, 1700])
    h +=
      gauss((wz - redZ) / 0.022) *
      smooth(-0.9, -0.85, wx) *
      smooth(-0.5, -0.56, wx) *
      0.34 *
      westeros
    h += fbm(wx * 3.4, wz * 3.4) * 0.05 * westeros

    // Essos relief: the Hills of Norvos, the Bone Mountains, the Slaver's Bay
    // ranges, and Valyria smoking in its drowned sea.
    h += cone(wx, wz, -0.1, -0.04, 0.13, 0.26) * essos
    h += gauss((wx - 0.86) / 0.07) * smooth(0.0, 0.2, wz) * smooth(0.9, 0.7, wz) * 0.38 * essos
    h += gauss((wz - 0.46) / 0.05) * smooth(0.3, 0.42, wx) * smooth(0.86, 0.74, wx) * 0.26 * essos
    h += cone(wx, wz, 0.2, 0.7, 0.045, 0.55) * clamp01(essos + 0.5)
    h += fbm(wx * 3 + 9, wz * 3) * 0.04 * essos

    // Cheap erosion on the high ground.
    const pingpong = (x) => {
      const t = ((x % 2) + 2) % 2
      return t < 1 ? t : 2 - t
    }
    const gully = smooth(0.15, 0.85, pingpong(1 + fbm(wx * 6, wz * 6) * 2.4))
    h -= gully * 0.05 * land * smooth(0.42, 0.72, h)

    // The far north is ice, not scree. Adding relief and hoping the noise lands
    // in the white band gave a mottled field — half Ice & Snow, half Mountains
    // — so the ice is held above the biome table's white line (0.84) outright,
    // ramping in from the Wall so the haunted forest and the Frostfangs below
    // it keep their own colours.
    h = Math.max(h, smooth(-0.80, -0.90, wz) * westeros * 0.9)

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
console.log(`traced Westeros outline: ${WESTEROS.length} vertices`)
