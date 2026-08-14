#!/usr/bin/env node
/**
 * Build a grayscale heightmap PNG from public Terrarium DEM tiles.
 *
 * Fetches the elevation tiles covering a lon/lat bounding box, stitches them,
 * samples the box (equirectangular) into a W×H grid, normalizes to 0..255 and
 * writes a PNG the app can load as `terrain.heightmap`. Also prints the
 * sea-level fraction to set as `terrain.seaLevel`.
 *
 * Requires network access and `pngjs` (npm i -D pngjs).
 *
 * Usage:
 *   node scripts/build-heightmap.mjs                 # Estonia (Kalevipoeg)
 *   node scripts/build-heightmap.mjs france          # France + England (Musketeers)
 *   node scripts/build-heightmap.mjs world           # whole Earth (Verne)
 *
 * Terrarium tiles are DEM data © Mapzen/AWS Terrain Tiles (public).
 */
import { PNG } from 'pngjs'
import fs from 'fs'

// Named presets. `w`/`h` default to 256 (square) when omitted.
const PRESETS = {
  estonia: {
    z: 7,
    bbox: { lonMin: 21.5, lonMax: 28.9, latMin: 57.3, latMax: 60.75 },
    lakes: true,
    out: '../src/assets/estonia-height.png',
  },
  latvia: {
    // Lāčplēsis country: Latvia entire, the Gulf of Riga, the eastern Baltic
    // out past Kurzeme (for the sea voyage), southern Estonia and Saaremaa
    // (where Lāčplēsis duels the giant Kalapuisis), and the Daugava as far
    // upriver as Krāslava. Latvia's high point is 312 m, so no cap is needed.
    z: 8,
    bbox: { lonMin: 19.2, lonMax: 28.8, latMin: 55.2, latMax: 58.6 },
    // Sized so a pixel is the same distance on the ground both ways: the box
    // is 9.6° of longitude at ~57°N (≈584 km) by 3.4° of latitude (≈376 km).
    w: 1024,
    h: 659,
    // Clip the deepest Baltic so the sea does not eat a fifth of the range,
    // and lift the land off the shoreline — see `landGamma` below. Without it
    // Rīga and Zemgale, which really are a dozen metres above the sea, render
    // underneath the water plane.
    floorM: -25,
    landGamma: 0.6,
    lakes: true,
    out: '../src/assets/latvia-height.png',
  },
  lucerne: {
    // Wilhelm Tell country: Lake Lucerne and the three founding cantons. Uri
    // in the south-east (Bürglen, Altdorf, Flüelen), Lake Uri with the Rütli
    // and the Tellsplatte, Schwyz over the Axen, Unterwalden west of the lake,
    // and Küssnacht with the Hohle Gasse in the north. Small — about 61 km by
    // 44 km — so this needs a much deeper zoom than the country-sized presets.
    z: 11,
    bbox: { lonMin: 8.15, lonMax: 8.95, latMin: 46.75, latMax: 47.15 },
    w: 1024,
    h: 748,
    // The lake sits at 434 m and the peaks run past 3,000. Cap the very top so
    // the valleys and the lake shore keep some dynamic range; this is the first
    // world in the atlas with real mountains rather than capped or flat ones.
    capM: 2800,
    // Natural Earth's lake polygons have nothing at this scale, so the water
    // is set by elevation instead: Vierwaldstättersee sits at 434 m and the
    // DEM records it as a flat plateau, so everything at or below 437 m is
    // lake. Without this the water Tell is rowed across renders as ground.
    seaM: 437,
    // A lake at 434 m in a range that runs to 2,800 occupies almost none of the
    // vertical, so the shore would be crushed against the waterline. The gamma
    // spreads the low ground back out — see `landGamma` below.
    landGamma: 0.5,
    out: '../src/assets/lucerne-height.png',
  },
  nibelungen: {
    // The Nibelungenlied's road: Xanten on the Lower Rhine in the north-west,
    // Worms and the Odenwald in the middle, then the whole Danube run east
    // through Passau, Pöchlarn and Vienna to Etzel's hall in Hungary. The poem
    // is a journey, so the box has to hold both rivers at once.
    z: 8,
    bbox: { lonMin: 5.8, lonMax: 19.5, latMin: 47.0, latMax: 52.2 },
    w: 1024,
    h: 599,
    // Clip the Alps along the southern edge. They are not in the story and at
    // full height they would take the whole range from two river valleys that
    // never rise above 300 m.
    capM: 1600,
    flatOceanM: -6,
    // Worms stands about 90 m up. That is comfortable, but the gamma still
    // helps the flood plains read as separate from the uplands around them.
    landGamma: 0.8,
    lakes: true,
    out: '../src/assets/nibelungen-height.png',
  },
  harz: {
    // Faust country: central Germany. Leipzig and Auerbachs Keller in the
    // east, the Harz and the Brocken in the middle (where Walpurgis Night is
    // held), Wittenberg north of them, and Knittlingen in the south-west,
    // where the historical Faust was born.
    z: 8,
    // Reaches the German Bight in the north, because Part II ends on a coast
    // Faust takes out of the sea — that has to be real water on the map.
    bbox: { lonMin: 6.5, lonMax: 15.0, latMin: 49.0, latMax: 54.0 },
    w: 1024,
    h: 966,
    // The Brocken is 1,141 m and is the roof of this story. Cap just above it
    // so the Bavarian Forest along the southern edge cannot out-rank it.
    capM: 1200,
    flatOceanM: -6,
    landGamma: 0.7,
    lakes: true,
    out: '../src/assets/harz-height.png',
  },
  flanders: {
    // Uilenspiegel country: Flanders, Brabant and the Zeeland estuaries, from
    // Dunkirk and Ypres in the south-west up to Brielle in the north, with the
    // Ardennes on the eastern edge. The book starts on land and ends at sea,
    // so the box has to hold the whole coast and the river mouths behind it.
    z: 9,
    bbox: { lonMin: 1.8, lonMax: 6.8, latMin: 49.6, latMax: 52.4 },
    w: 1024,
    h: 910,
    flatOceanM: -6,
    // Flanders is flatter than Latvia. Bruges stands about 8 m up and Damme
    // less; without the gamma the whole country renders as beach.
    landGamma: 0.5,
    lakes: true,
    out: '../src/assets/flanders-height.png',
  },
  karelia: {
    // Kalevala country. The poem's own geography is two places and a road:
    // Wainola/Kalevala in the south and Pohyola — Northland, Sariola — in the
    // far north, "the dark and dismal country". The box holds Finland, Karelia
    // and the White Sea, plus the Gulf of Bothnia and enough of Lapland and
    // Kola for the north to be genuinely far away.
    z: 7,
    bbox: { lonMin: 15.0, lonMax: 44.0, latMin: 59.5, latMax: 70.5 },
    w: 1024,
    h: 918,
    // The Scandes along the western edge are not in the poem; cap them so
    // Finland's lakes and coasts keep the dynamic range.
    capM: 900,
    flatOceanM: -6,
    landGamma: 0.6,
    lakes: true,
    out: '../src/assets/karelia-height.png',
  },
  norway: {
    // Peer Gynt country: southern Norway. Gudbrandsdalen and the Rondane in
    // the middle, Jotunheimen west of them, and the western fjord coast where
    // Act V comes home past Hallingskarvet and the Folgefonna.
    z: 8,
    bbox: { lonMin: 3.0, lonMax: 15.0, latMin: 58.0, latMax: 63.5 },
    w: 1024,
    h: 966,
    capM: 2000,
    flatOceanM: -6,
    landGamma: 0.75,
    lakes: true,
    out: '../src/assets/norway-height.png',
  },
  sweden: {
    // Nils Holgersson country: the whole of Sweden, because the book is a
    // school geography and the journey runs its entire length — Skåne in the
    // south to Kebnekaise in Lapland and back. Sweden is far taller than it is
    // wide, so this is the atlas's first world with an aspect BELOW 1.
    z: 7,
    bbox: { lonMin: 10.0, lonMax: 25.0, latMin: 55.0, latMax: 69.5 },
    w: 624,
    h: 1280,
    // Kebnekaise is 2,097 m and is where the goose leader comes from; cap just
    // below it so the mountain is the roof of the map.
    capM: 1800,
    flatOceanM: -6,
    landGamma: 0.6,
    lakes: true,
    out: '../src/assets/sweden-height.png',
  },
  france: {
    z: 6,
    bbox: { lonMin: -6, lonMax: 6, latMin: 42, latMax: 53 },
    // Cap the Alps so lowland France keeps dynamic range (nicer relief).
    capM: 1500,
    lakes: true,
    out: '../src/assets/france-height.png',
  },
  britain: {
    z: 6,
    bbox: { lonMin: -8, lonMax: 2, latMin: 50, latMax: 59 },
    capM: 1300,
    flatOceanM: -10,
    lakes: true,
    out: '../src/assets/britain-height.png',
  },
  mediterranean: {
    // The classical Mediterranean for the Eneida: Iberia and the Atlas in the
    // west, the Maghreb coast (Carthage) to the south, Italy + Sicily in the
    // centre, Greece and the Aegean/Asia Minor (Troy) to the east.
    z: 6,
    bbox: { lonMin: -6, lonMax: 30, latMin: 30, latMax: 46 },
    w: 1152,
    h: 512,
    // Cap the Alps/Atlas so the lowlands and coasts keep dynamic range.
    capM: 2400,
    // Flatten the sea to one even depth (like the world map) so the broad
    // Mediterranean reads as a single calm blue from straight down.
    flatOceanM: -6,
    out: '../src/assets/mediterranean-height.png',
  },
  world: {
    // The z5 source is 8192 px around the world (~4.9 km/px). Sampling that
    // into 1536 threw away four fifths of it and left ~26 km per pixel, which
    // is why coastlines and small seas came out as blobs. 3072x1536 keeps
    // ~13 km/px — Italy, Denmark, the Black Sea and the Gulf all read as
    // themselves — for a PNG that is still a couple of megabytes.
    z: 5,
    bbox: { lonMin: -180, lonMax: 180, latMin: -62, latMax: 78 },
    w: 3072,
    h: 1536,
    capM: 3500,
    // Flatten ALL ocean to one shallow depth so the sea reads as a single
    // even colour (the biome shader darkens by depth, and the low-res DEM's
    // real bathymetry would otherwise blotch the sea seen from straight down).
    flatOceanM: -6,
    out: '../src/assets/world-height.png',
  },
}

const preset = PRESETS[process.argv[2] ?? 'estonia']
if (!preset) {
  console.error(`unknown preset "${process.argv[2]}"; try: ${Object.keys(PRESETS).join(', ')}`)
  process.exit(1)
}
const Z = preset.z
const BBOX = preset.bbox
const W = preset.w ?? 256
const H = preset.h ?? 256
const OUT = new URL(preset.out, import.meta.url)

// Depth (metres) to carve real lake bodies to, so they render as inland water.
const LAKE_M = -4
const LAKES_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson'

/**
 * Fetch Natural Earth lake polygons that overlap the bbox and pre-compute each
 * ring's bounding box for a fast reject. Returns polygons as {rings, bb}, where
 * rings[0] is the outer ring and the rest are holes (islands).
 */
async function loadLakes(bbox) {
  const gj = await (await fetch(LAKES_URL)).json()
  const polys = []
  const overlaps = (bb) =>
    bb[0] <= bbox.lonMax && bb[2] >= bbox.lonMin && bb[1] <= bbox.latMax && bb[3] >= bbox.latMin
  const ringBB = (ring) => {
    let a = [Infinity, Infinity, -Infinity, -Infinity]
    for (const [x, y] of ring) {
      if (x < a[0]) a[0] = x
      if (y < a[1]) a[1] = y
      if (x > a[2]) a[2] = x
      if (y > a[3]) a[3] = y
    }
    return a
  }
  for (const f of gj.features) {
    const g = f.geometry
    if (!g) continue
    const parts = g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : []
    for (const rings of parts) {
      const bb = ringBB(rings[0])
      if (overlaps(bb)) polys.push({ rings, bb })
    }
  }
  return polys
}

function pointInRing(lon, lat, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1],
      xj = ring[j][0],
      yj = ring[j][1]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function inLake(lon, lat, polys) {
  for (const p of polys) {
    const bb = p.bb
    if (lon < bb[0] || lon > bb[2] || lat < bb[1] || lat > bb[3]) continue
    if (!pointInRing(lon, lat, p.rings[0])) continue
    let hole = false
    for (let h = 1; h < p.rings.length; h++)
      if (pointInRing(lon, lat, p.rings[h])) {
        hole = true
        break
      }
    if (!hole) return true
  }
  return false
}

const lakePolys = preset.lakes ? await loadLakes(BBOX) : null
if (lakePolys) console.log(`carving ${lakePolys.length} lake polygons`)

const TS = 256
const lon2tx = (lon) => Math.floor(((lon + 180) / 360) * 2 ** Z)
const lat2ty = (lat) => {
  const r = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * 2 ** Z)
}
const clampTile = (t) => Math.max(0, Math.min(2 ** Z - 1, t))
const TX0 = clampTile(lon2tx(BBOX.lonMin)),
  TX1 = clampTile(lon2tx(BBOX.lonMax))
const TY0 = clampTile(lat2ty(BBOX.latMax)),
  TY1 = clampTile(lat2ty(BBOX.latMin))
const NX = TX1 - TX0 + 1,
  NY = TY1 - TY0 + 1
const SW = NX * TS,
  SH = NY * TS
const elev = new Float32Array(SW * SH)

console.log(`fetching ${NX}x${NY} tiles at z${Z}…`)
for (let ty = 0; ty < NY; ty++) {
  for (let tx = 0; tx < NX; tx++) {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${TX0 + tx}/${TY0 + ty}.png`
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
    const png = PNG.sync.read(buf)
    for (let py = 0; py < TS; py++)
      for (let px = 0; px < TS; px++) {
        const i = (py * TS + px) * 4
        const m = png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256 - 32768
        elev[(ty * TS + py) * SW + (tx * TS + px)] = m
      }
  }
}

const worldPx = TS * 2 ** Z
const sample = (sx, sy) => {
  sx = Math.max(0, Math.min(SW - 1.001, sx))
  sy = Math.max(0, Math.min(SH - 1.001, sy))
  const x0 = Math.floor(sx),
    y0 = Math.floor(sy),
    fx = sx - x0,
    fy = sy - y0
  const a = elev[y0 * SW + x0],
    b = elev[y0 * SW + x0 + 1],
    c = elev[(y0 + 1) * SW + x0],
    d = elev[(y0 + 1) * SW + x0 + 1]
  return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy
}

const out = new Float32Array(W * H)
let mn = Infinity,
  mx = -Infinity
for (let j = 0; j < H; j++)
  for (let i = 0; i < W; i++) {
    const lon = BBOX.lonMin + (i / (W - 1)) * (BBOX.lonMax - BBOX.lonMin)
    const lat = BBOX.latMax - (j / (H - 1)) * (BBOX.latMax - BBOX.latMin)
    const gpx = ((lon + 180) / 360) * worldPx
    const gpy = ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * worldPx
    let m = Math.max(sample(gpx - TX0 * TS, gpy - TY0 * TS), preset.floorM ?? -60)
    if (preset.capM) m = Math.min(m, preset.capM)
    // Optionally flatten the whole sea to one depth for an even ocean colour.
    if (preset.flatOceanM != null && m < 0) m = preset.flatOceanM
    // Inland worlds have no sea: `seaM` names the elevation of the water — a
    // lake surface, which a DEM records as a flat plateau — and everything at
    // or below it is carved just under, so it renders as water.
    if (preset.seaM != null && m <= preset.seaM) m = preset.seaM - 6
    // Carve real inland lakes below sea level so they render as water.
    if (lakePolys && m > LAKE_M && inLake(lon, lat, lakePolys)) m = LAKE_M
    out[j * W + i] = m
    if (m < mn) mn = m
    if (m > mx) mx = m
  }

// Where the waterline sits once the range is normalized: 0 m for a coastal
// world, or the named lake surface for an inland one.
const SEA_M = preset.seaM ?? 0
const SEA = (SEA_M - mn) / (mx - mn)

/**
 * Optional hypsometric exaggeration of the LAND only.
 *
 * A country as flat as Latvia has a problem the Alps do not: Rīga stands about
 * 13 m above the sea in a DEM whose range is several hundred metres, so the
 * coastal plain lands a hair above the shoreline and the rendered water plane
 * swallows it. A gamma below 1 lifts low ground far more than high ground,
 * pulling the lowlands clear of the sea while leaving the coastline itself
 * exactly where the DEM puts it (the sea fraction is untouched).
 */
const shape = (g) => {
  if (!preset.landGamma || g <= SEA) return g
  return SEA + Math.pow((g - SEA) / (1 - SEA), preset.landGamma) * (1 - SEA)
}

const png = new PNG({ width: W, height: H })
for (let k = 0; k < W * H; k++) {
  const g = Math.round(shape((out[k] - mn) / (mx - mn)) * 255)
  png.data[k * 4] = g
  png.data[k * 4 + 1] = g
  png.data[k * 4 + 2] = g
  png.data[k * 4 + 3] = 255
}
fs.writeFileSync(OUT, PNG.sync.write(png))
console.log(`wrote ${OUT.pathname} (${W}x${H})`)
console.log(`minM=${mn.toFixed(1)} maxM=${mx.toFixed(1)} → set terrain.seaLevel = ${SEA.toFixed(4)}`)
if (preset.landGamma) {
  const at = (m) => shape((m - mn) / (mx - mn)).toFixed(3)
  console.log(`landGamma=${preset.landGamma}: 5m→${at(5)} 20m→${at(20)} 60m→${at(60)} 150m→${at(150)} 300m→${at(300)}`)
}
