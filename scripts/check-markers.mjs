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
 * further than `reach` (in map units) from every route are reported.
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
const re = /id: '([^']+)',\s*\n\s*name: '([^']*)',\s*\n\s*kind: '([^']+)',\s*\n\s*at: \{ x: (-?[\d.]+), z: (-?[\d.]+) \}/g

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
  const linked = d <= w.reach
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
