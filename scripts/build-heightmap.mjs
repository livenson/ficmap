#!/usr/bin/env node
/**
 * Build a grayscale heightmap PNG from public Terrarium DEM tiles.
 *
 * Fetches the elevation tiles covering a lon/lat bounding box, stitches them,
 * samples the box (Web-Mercator-correct) into an N×N grid, normalizes to
 * 0..255 and writes a PNG the app can load as `terrain.heightmap`.
 *
 * Requires network access and `pngjs` (npm i -D pngjs).
 *
 * Usage: node scripts/build-heightmap.mjs
 * Prints the sea-level fraction to set as `terrain.seaLevel` in the story.
 *
 * The bundled src/assets/estonia-height.png was produced with the defaults
 * below (Estonia + Gulf of Finland + Lake Peipus + Pskov). Terrarium tiles are
 * public domain-ish DEM data © Mapzen/AWS Terrain Tiles.
 */
import { PNG } from 'pngjs'
import fs from 'fs'

const Z = 7
const BBOX = { lonMin: 21.5, lonMax: 28.9, latMin: 57.3, latMax: 60.75 }
const N = 256
const OUT = new URL('../src/assets/estonia-height.png', import.meta.url)

const TS = 256
const lon2tx = (lon) => Math.floor(((lon + 180) / 360) * 2 ** Z)
const lat2ty = (lat) => {
  const r = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * 2 ** Z)
}
const TX0 = lon2tx(BBOX.lonMin),
  TX1 = lon2tx(BBOX.lonMax)
const TY0 = lat2ty(BBOX.latMax),
  TY1 = lat2ty(BBOX.latMin)
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

const out = new Float32Array(N * N)
let mn = Infinity,
  mx = -Infinity
for (let j = 0; j < N; j++)
  for (let i = 0; i < N; i++) {
    const lon = BBOX.lonMin + (i / (N - 1)) * (BBOX.lonMax - BBOX.lonMin)
    const lat = BBOX.latMax - (j / (N - 1)) * (BBOX.latMax - BBOX.latMin)
    const gpx = ((lon + 180) / 360) * worldPx
    const gpy = ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * worldPx
    let m = Math.max(sample(gpx - TX0 * TS, gpy - TY0 * TS), -60)
    out[j * N + i] = m
    if (m < mn) mn = m
    if (m > mx) mx = m
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
console.log(`wrote ${OUT.pathname}`)
console.log(`minM=${mn.toFixed(1)} maxM=${mx.toFixed(1)} → set terrain.seaLevel = ${((0 - mn) / (mx - mn)).toFixed(4)}`)
