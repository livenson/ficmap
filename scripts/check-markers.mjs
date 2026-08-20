#!/usr/bin/env node
/**
 * Sanity-check a DEM world's markers against its own heightmap and routes.
 *
 * For each marker it samples the heightmap at the marker's map coordinate and
 * reports the normalized height and whether that is land or water, so a town
 * that has drifted into the sea (or a port stranded inland) shows up before a
 * reader finds it. Also prints the lon/lat each marker resolves to, so the
 * coordinates can be checked against a real map.
 *
 * It then checks ROUTE COVERAGE: every place should have some line of travel
 * running to it, or it sits on the map as a dot nobody ever goes to. Markers
 * further than `reach` (in map units) from every route are reported, except
 * those listed as `scenic` — summits and the like, which are on the map to be
 * looked at rather than travelled to.
 *
 * Usage:
 *   node scripts/check-markers.mjs latvia
 */
import { PNG } from 'pngjs'
import fs from 'fs'

// bbox + seaLevel must match the story's terrain and the build-heightmap preset.
const WORLDS = {
  latvia: {
    png: '../src/assets/latvia-height.png',
    story: '../src/stories/lacplesis.ts',
    bbox: { lonMin: 19.2, lonMax: 28.8, latMin: 55.2, latMax: 58.6 },
    seaLevel: 0.0547,
    // How close a route must pass for a place to count as connected.
    reach: 0.09,
    // Markers that are meant to be at sea (voyages, islands, off-map roads).
    wet: new Set([
      'enchanted-isle',
      'north-wind',
      'german-road',
      'kolka',
      'saaremaa',
      'daugavgriva',
      'kurzeme-shore',
      // The point of this one is that it is under a lake.
      'sunken-castle',
    ]),
  },
  dante: {
    png: '../src/assets/dante-height.png',
    story: '../src/stories/dante.ts',
    bbox: { lonMin: 9.4, lonMax: 14.6, latMin: 41.2, latMax: 45.4 },
    seaLevel: 0.0025,
    reach: 0.09,
    wet: new Set([]),
    // Named from the valley floor, never climbed in the poem.
    scenic: new Set(['falterona']),
  },
  svejk: {
    png: '../src/assets/svejk-height.png',
    story: '../src/stories/svejk.ts',
    bbox: { lonMin: 13.55, lonMax: 14.80, latMin: 48.90, latMax: 49.55 },
    // No water anywhere on this map; South Bohemia here is a plateau.
    seaLevel: 0,
    reach: 0.09,
    wet: new Set([]),
  },
  snowqueen: {
    png: '../src/assets/snowqueen-height.png',
    story: '../src/stories/snowqueen.ts',
    bbox: { lonMin: 4.0, lonMax: 34.0, latMin: 54.5, latMax: 80.0 },
    seaLevel: 0.0043,
    reach: 0.09,
    wet: new Set([]),
  },
  lusiads: {
    png: '../src/assets/lusiads-height.png',
    story: '../src/stories/lusiads.ts',
    bbox: { lonMin: -30.0, lonMax: 80.0, latMin: -40.0, latMax: 45.0 },
    seaLevel: 0.0027,
    reach: 0.09,
    // The Isle of Love is raised out of the ocean by Venus and is on no chart;
    // it is meant to be at sea, because it is.
    wet: new Set(['isle-of-love']),
  },
  lucerne: {
    png: '../src/assets/lucerne-height.png',
    story: '../src/stories/tell.ts',
    bbox: { lonMin: 8.15, lonMax: 8.95, latMin: 46.75, latMax: 47.15 },
    // No sea here: the waterline is Lake Lucerne's own surface.
    seaLevel: 0.0025,
    reach: 0.09,
    wet: new Set([]),
    // Summits, not destinations. Nobody in the play climbs them — they are on
    // the map because you can see them from everywhere on it.
    scenic: new Set(['pilatus', 'uri-rotstock', 'rigi']),
  },
  nibelungen: {
    png: '../src/assets/nibelungen-height.png',
    story: '../src/stories/nibelungen.ts',
    bbox: { lonMin: 5.8, lonMax: 19.5, latMin: 47.0, latMax: 52.2 },
    seaLevel: 0.0037,
    reach: 0.09,
    // Isenstein is over the sea and the Rhine mouth is the sea.
    wet: new Set(['isenstein', 'rhine-mouth']),
    scenic: new Set(['alps', 'bohemia']),
  },
  harz: {
    png: '../src/assets/harz-height.png',
    story: '../src/stories/faust.ts',
    bbox: { lonMin: 7.5, lonMax: 14.5, latMin: 49.0, latMax: 53.0 },
    seaLevel: 0.005,
    reach: 0.09,
    wet: new Set(['reclaimed-coast']),
    scenic: new Set(['brocken', 'harz', 'elbe', 'greece', 'knittlingen']),
  },
  flanders: {
    png: '../src/assets/flanders-height.png',
    story: '../src/stories/uilenspiegel.ts',
    bbox: { lonMin: 1.8, lonMax: 6.8, latMin: 49.6, latMax: 52.4 },
    seaLevel: 0.0085,
    reach: 0.09,
    // The Beggars' half is fought in tidal water; these are meant to be wet.
    wet: new Set(['brielle', 'flushing', 'middelburg', 'ostend']),
    scenic: new Set(['ardennes', 'spanish-road']),
  },
  tain: {
    png: '../src/assets/ireland-height.png',
    story: '../src/stories/tain.ts',
    bbox: { lonMin: -10.8, lonMax: -5.3, latMin: 51.3, latMax: 55.5 },
    seaLevel: 0.0062,
    reach: 0.09,
    wet: new Set([]),
    scenic: new Set(['tara', 'sliab-cuilinn', 'dun-sobairce']),
  },
  cid: {
    png: '../src/assets/spain-height.png',
    story: '../src/stories/cid.ts',
    bbox: { lonMin: -6.0, lonMax: 3.0, latMin: 38.5, latMax: 43.5 },
    seaLevel: 0.0023,
    reach: 0.09,
    wet: new Set([]),
    scenic: new Set(['navarre-aragon']),
  },
  aotearoa: {
    png: '../src/assets/aotearoa-height.png',
    story: '../src/stories/aotearoa.ts',
    bbox: { lonMin: 166.0, lonMax: 179.0, latMin: -47.5, latMax: -34.0 },
    seaLevel: 0.0025,
    reach: 0.09,
    // Hawaiki is off every map; the lake, the strait and the pit the sun
    // climbs out of in the eastern sea are water on purpose.
    wet: new Set(['hawaiki', 'taupo', 'cook-strait', 'sun-pit']),
    scenic: new Set(['aoraki', 'hikurangi', 'ruapehu', 'ngauruhoe', 'the-fish', 'the-canoe']),
  },
  tasmania: {
    png: '../src/assets/tasmania-height.png',
    story: '../src/stories/natural-life.ts',
    bbox: { lonMin: 144.4, lonMax: 148.6, latMin: -43.8, latMax: -40.4 },
    seaLevel: 0.0037,
    reach: 0.09,
    // The voyages, the wreck, and the two settings a thousand miles off the map.
    wet: new Set([
      'malabar', 'norfolk', 'sydney', 'the-wreck', 'hells-gates', 'bruny',
      // Built on the harbour and launched into it.
      'the-escape',
    ]),
    scenic: new Set(['cape-raoul', 'frenchmans']),
  },
  khunphaen: {
    png: '../src/assets/siam-height.png',
    story: '../src/stories/khunphaen.ts',
    bbox: { lonMin: 97.8, lonMax: 103.4, latMin: 12.8, latMax: 19.6 },
    seaLevel: 0.0033,
    reach: 0.09,
    // Nothing in this world is meant to be in the sea.
    wet: new Set([]),
    // Two places the poem reaches through a person rather than a journey:
    // Simala is the governor of Phichit's daughter, Kaeo Kiriya the governor
    // of Sukhothai's, and no march in either of these two books goes to
    // either town.
    scenic: new Set(['phichit', 'sukhothai']),
  },
  meghaduta: {
    png: '../src/assets/meghaduta-height.png',
    story: '../src/stories/meghaduta.ts',
    bbox: { lonMin: 73.5, lonMax: 83.0, latMin: 20.0, latMax: 32.5 },
    // Wholly inland: the waterline is the floor of the range, not a coast.
    seaLevel: 0,
    reach: 0.09,
    wet: new Set([]),
    // The three rivers the cloud is told to drink from. A river marker stands
    // ON its drawn course, which on a map this coarse is often a pixel the DEM
    // reads as water — that is the course being correct, not the pin being
    // wrong, and `check-rivers` is what holds those.
    scenic: new Set(['reva', 'vetravati', 'charmanvati', 'nichaih', 'brahmavarta']),
  },
  ramayana: {
    png: '../src/assets/ramayana-height.png',
    story: '../src/stories/ramayana.ts',
    bbox: { lonMin: 71.5, lonMax: 87.0, latMin: 5.5, latMax: 28.0 },
    seaLevel: 0.0033,
    reach: 0.10,
    wet: new Set([]),
    // River markers, held instead by `check-rivers` to standing on their own
    // drawn course.
    scenic: new Set(['ganga', 'panchavati-river', 'kishkindha-river']),
  },
  ottokar: {
    png: '../src/assets/ottokar-height.png',
    story: '../src/stories/ottokar.ts',
    bbox: { lonMin: 11.8, lonMax: 18.4, latMin: 45.6, latMax: 51.0 },
    seaLevel: 0.0017,
    reach: 0.09,
    // Nothing here is meant to be under water: the box is entirely inland.
    wet: new Set([]),
    // Named but never gone to: the two off-map edges, the crown as an idea,
    // the mountains that are only ever the southern horizon, and Salzburg,
    // which belongs to its archbishop and to neither side in the quarrel.
    scenic: new Set([
      'the-empire',
      'hungary',
      'bohemia-crown',
      'tauern',
      'neusiedl',
      'salzburg',
    ]),
  },
  verne: {
    png: '../src/assets/world-height.png',
    story: '../src/stories/verne.ts',
    bbox: { lonMin: -180, lonMax: 180, latMin: -62, latMax: 78 },
    seaLevel: 0.0017,
    reach: 0.09,
    // Half of Verne happens at sea, and one marker sits below the DEM's
    // southern edge on purpose.
    wet: new Set(['pacific-deeps', 'atlantis', 'maelstrom', 'lincoln-island', 'south-pole']),
    scenic: new Set([]),
  },
  indiana: {
    png: '../src/assets/world-height.png',
    story: '../src/stories/indiana-jones.ts',
    bbox: { lonMin: -180, lonMax: 180, latMin: -62, latMax: 78 },
    seaLevel: 0.0017,
    reach: 0.09,
    wet: new Set([]),
    scenic: new Set([]),
  },
  kalevala: {
    png: '../src/assets/karelia-height.png',
    story: '../src/stories/kalevala.ts',
    bbox: { lonMin: 15.0, lonMax: 44.0, latMin: 59.5, latMax: 70.5 },
    seaLevel: 0.0066,
    reach: 0.09,
    // Water on purpose: the poem opens on the open sea, Aino drowns, the
    // Sampo sinks, and the lakes are lakes.
    wet: new Set([
      'saimaa',
      'saari',
      'bothnia',
      'inari',
      'sampo-wreck',
      'aino',
      'departure',
      'alue',
      'pike-shoal',
    ]),
    scenic: new Set(['kullervo', 'kaleva-oak']),
  },
  peergynt: {
    png: '../src/assets/norway-height.png',
    story: '../src/stories/peergynt.ts',
    bbox: { lonMin: 3.0, lonMax: 15.0, latMin: 58.0, latMax: 63.5 },
    seaLevel: 0.003,
    reach: 0.09,
    // Act IV is off the bottom of the map, out over the water.
    wet: new Set(['africa']),
    // Named from a ship's deck, not climbed.
    scenic: new Set(['ronde', 'gendin', 'oslo', 'jokel']),
  },
  nils: {
    png: '../src/assets/sweden-height.png',
    story: '../src/stories/nils.ts',
    bbox: { lonMin: 10.0, lonMax: 25.0, latMin: 55.0, latMax: 69.5 },
    seaLevel: 0.0033,
    reach: 0.09,
    // Lakes, a sunken city, a seal skerry and a bare island in the West Sea.
    wet: new Set([
      'malaren',
      'vanern',
      'takern',
      'vineta',
      'karls-island',
      'treasure-isle',
    ]),
    scenic: new Set(['omberg', 'smaland']),
  },
}

const name = process.argv[2] ?? 'latvia'
const w = WORLDS[name]
if (!w) {
  console.error(`unknown world "${name}"; try: ${Object.keys(WORLDS).join(', ')}`)
  process.exit(1)
}

const png = PNG.sync.read(fs.readFileSync(new URL(w.png, import.meta.url)))
const src = fs.readFileSync(new URL(w.story, import.meta.url), 'utf8')

/** Height 0..1 at a map coordinate, sampled from the DEM's red channel. */
function heightAt(x, z) {
  const px = Math.round(((x + 1) / 2) * (png.width - 1))
  const py = Math.round(((z + 1) / 2) * (png.height - 1))
  return png.data[(py * png.width + px) * 4] / 255
}

const { lonMin, lonMax, latMin, latMax } = w.bbox
const toLon = (x) => lonMin + ((x + 1) / 2) * (lonMax - lonMin)
const toLat = (z) => latMax - ((z + 1) / 2) * (latMax - latMin)

// Pull `id` / `at: { x, z }` pairs straight out of the story source. Only the
// surface level is checked — the mythic floors are procedural, not geographic.
const surface = src.slice(0, src.indexOf('levels:'))
// `GAP` lets a `//` comment sit between any two fields. Without it a single
// explanatory line above `at:` drops the whole marker from this check, silently
// — which is the opposite of what a checker is for.
const GAP = String.raw`(?:\s*\n\s*//[^\n]*)*\s*\n\s*`
const re = new RegExp(
  String.raw`id: '([^']+)',${GAP}name: '([^']*)',${GAP}kind: '([^']+)',${GAP}at: \{ x: (-?[\d.]+), z: (-?[\d.]+) \}`,
  'g',
)

// Every route's waypoints, so a marker can be measured against the lines.
const routes = []
for (const block of surface.matchAll(/id: '([^']+)',\s*\n\s*name: '[^']*',\s*\n(?:.|\n)*?points: \[((?:.|\n)*?)\]/g)) {
  const pts = [...block[2].matchAll(/x: (-?[\d.]+), z: (-?[\d.]+)/g)].map((p) => [
    Number(p[1]),
    Number(p[2]),
  ])
  if (pts.length > 1) routes.push({ id: block[1], pts })
}

/** Shortest distance from a point to a polyline, in map units. */
function distToRoutes(x, z) {
  let best = Infinity
  for (const r of routes) {
    for (let i = 1; i < r.pts.length; i++) {
      const [ax, az] = r.pts[i - 1]
      const [bx, bz] = r.pts[i]
      const dx = bx - ax
      const dz = bz - az
      const len = dx * dx + dz * dz
      const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / len))
      const d = Math.hypot(x - (ax + t * dx), z - (az + t * dz))
      if (d < best) best = d
    }
  }
  return best
}

let bad = 0
let stranded = 0
for (const m of surface.matchAll(re)) {
  const [, id, , kind, xs, zs] = m
  const x = Number(xs)
  const z = Number(zs)
  const h = heightAt(x, z)
  const land = h > w.seaLevel
  const wantWet = w.wet.has(id)
  const wet = wantWet ? true : land
  if (!wet) bad++
  const d = distToRoutes(x, z)
  const linked = d <= w.reach || (w.scenic?.has(id) ?? false)
  if (!linked) stranded++
  console.log(
    `${wet && linked ? '  ' : '!!'} ${id.padEnd(16)} ${kind.padEnd(9)} ` +
      `lon ${toLon(x).toFixed(2).padStart(6)} lat ${toLat(z).toFixed(2)} ` +
      `h=${h.toFixed(3)} ${land ? 'land ' : 'WATER'}${wantWet && !land ? '*' : ' '} ` +
      `route ${d.toFixed(3)}${linked ? '' : ' ← NO ROUTE'}`,
  )
}
console.log(`\n${routes.length} routes checked`)
console.log(bad === 0 ? 'all land markers are on land' : `${bad} marker(s) in the water`)
console.log(stranded === 0 ? 'every place has a route to it' : `${stranded} place(s) with no route`)
process.exit(bad === 0 && stranded === 0 ? 0 : 1)
