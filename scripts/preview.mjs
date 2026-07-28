#!/usr/bin/env node
/**
 * Terrain preview / land-finder for authoring worlds.
 *
 * Prints an ASCII heightmap for a set of terrain parameters (so you can eyeball
 * the coastline) plus a list of verified on-land coordinates to drop markers
 * onto. Mirrors the height field in src/engine/noise.ts.
 *
 * Usage:
 *   node scripts/preview.mjs <seed> [seaLevel] [islandFalloff] [frequency]
 *   node scripts/preview.mjs valdurn-5 0.36 0.25 1.4
 */
import { createNoise2D } from 'simplex-noise'
import alea from 'alea'

function makeField({
  seed,
  octaves = 5,
  frequency = 2.2,
  persistence = 0.5,
  lacunarity = 2,
  islandFalloff = 0.35,
}) {
  const prng = alea(seed)
  const noise2D = createNoise2D(prng)
  let maxAmp = 0
  for (let o = 0, amp = 1; o < octaves; o++, amp *= persistence) maxAmp += amp
  const smoothstep = (e0, e1, x) => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)
  }
  return (x, z) => {
    let amp = 1
    let freq = frequency
    let sum = 0
    for (let o = 0; o < octaves; o++) {
      sum += (noise2D(x * freq, z * freq) * 0.5 + 0.5) * amp
      amp *= persistence
      freq *= lacunarity
    }
    let h = sum / maxAmp
    if (islandFalloff > 0) {
      const d = Math.max(Math.abs(x), Math.abs(z))
      h *= 1 - smoothstep(1 - islandFalloff, 1, d)
    }
    return Math.max(0, Math.min(1, h))
  }
}

const seed = process.argv[2] ?? 'demo'
const seaLevel = parseFloat(process.argv[3] ?? '0.4')
const islandFalloff = parseFloat(process.argv[4] ?? '0.3')
const frequency = parseFloat(process.argv[5] ?? '2.0')
const field = makeField({ seed, islandFalloff, frequency })

const W = 64
const H = 32
const ramp = ' .:-=+*#%@'
console.log(`seed=${seed} seaLevel=${seaLevel} islandFalloff=${islandFalloff} frequency=${frequency}\n`)
for (let j = 0; j < H; j++) {
  let line = ''
  for (let i = 0; i < W; i++) {
    const h = field((i / (W - 1)) * 2 - 1, (j / (H - 1)) * 2 - 1)
    line += h <= seaLevel ? '~' : ramp[Math.min(9, Math.floor(((h - seaLevel) / (1 - seaLevel)) * 10))]
  }
  console.log(line)
}

// Suggest land points on a coarse grid (deterministic — no RNG).
const picks = []
for (let gz = -0.7; gz <= 0.7; gz += 0.1) {
  for (let gx = -0.7; gx <= 0.7; gx += 0.1) {
    const x = Math.round(gx * 100) / 100
    const z = Math.round(gz * 100) / 100
    const h = field(x, z)
    if (h > seaLevel + 0.05) picks.push({ x, z, h: Math.round(h * 100) / 100 })
  }
}
picks.sort((a, b) => b.h - a.h)
const fmt = (arr) => arr.map((p) => `{ x: ${p.x}, z: ${p.z} }  // h=${p.h}`).join('\n  ')
console.log('\nHighest land (peaks / capitals):\n  ' + fmt(picks.slice(0, 6)))
console.log('\nMid-elevation land (towns / roads):\n  ' + fmt(picks.filter((p) => p.h < seaLevel + 0.25).slice(0, 8)))
