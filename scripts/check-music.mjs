#!/usr/bin/env node
/**
 * Check every world's written score against the sequencer that plays it.
 *
 * The tunes live in the story files as `note:beats` strings and are synthesised
 * live, so nothing here is audible to a test — but the one thing that is worth
 * checking mechanically is whether the BASS LINE lands where the score says it
 * should, underneath the melody. It used not to:
 *
 *  - Most melodies are not a whole number of bass notes long (a 38-beat tune
 *    over a 32-beat bass), and the bass ran free, so every repeat started the
 *    harmony six beats further along. Within a couple of loops the low part was
 *    playing a chord unrelated to the tune above it.
 *  - A bass note could only start when a melody note happened to start, so a
 *    chord change could land several beats late under a long melody note.
 *
 * This mirrors `AmbientMusic.tick()` exactly and reports, for each tune, the
 * worst gap between where a bass note is written and where it actually sounds.
 *
 * Usage:
 *   node scripts/check-music.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'stories')

/** Same clamp as `parseMelody` in the engine. */
const parse = (s) =>
  !s
    ? []
    : s
        .trim()
        .split(/\s+/)
        .map((t) => {
          const [n, b] = t.split(':')
          return { n, beats: Math.max(0.25, Number(b) || 1) }
        })

/** Pull every `melody:` / `bass:` string (including `'a' + 'b'` joins). */
const grab = (src, key) =>
  [...src.matchAll(new RegExp(key + ":\\s*((?:\\s*'[^']*'\\s*\\+?)+)", 'g'))].map((m) =>
    m[1].replace(/[+'\n]/g, ' ').replace(/\s+/g, ' ').trim(),
  )

const rows = []
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8')
  const mels = grab(src, 'melody')
  const basses = grab(src, 'bass')
  for (let k = 0; k < Math.min(mels.length, basses.length); k++) {
    const mel = parse(mels[k])
    const bass = parse(basses[k])
    if (!mel.length || !bass.length) continue

    // Replay the sequencer over several loops, recording how late each bass
    // note is against its written position within the loop.
    let mi = 0
    let bi = 0
    let bNext = 0
    let t = 0
    let loopStart = 0
    let want = 0
    let drift = 0
    for (let n = 0; n < 600; n++) {
      const atTop = mi % mel.length === 0
      const step = mel[mi % mel.length]
      mi++
      if (atTop) {
        bi = 0
        bNext = 0
        loopStart = t
        want = 0
      }
      let guard = 0
      while (bNext < step.beats && guard++ < 32) {
        drift = Math.max(drift, Math.abs(t - loopStart + Math.max(0, bNext) - want))
        const b = bass[bi % bass.length]
        bi++
        bNext += b.beats
        want += b.beats
      }
      bNext -= step.beats
      t += step.beats
    }

    const melLoop = mel.reduce((a, s) => a + s.beats, 0)
    const bassLoop = bass.reduce((a, s) => a + s.beats, 0)
    rows.push({ id: f.replace('.ts', '') + (k ? ` (floor ${k})` : ''), melLoop, bassLoop, drift })
  }
}

rows.sort((a, b) => b.drift - a.drift || a.id.localeCompare(b.id))
let bad = 0
for (const r of rows) {
  const off = r.drift > 0.001
  if (off) bad++
  console.log(
    `${off ? '!!' : '  '} ${r.id.padEnd(24)} melody ${String(r.melLoop).padStart(5)} beats  ` +
      `bass ${String(r.bassLoop).padStart(5)}  worst bass onset ${r.drift.toFixed(2)} beats late`,
  )
}
console.log(`\n${rows.length} tunes checked`)
console.log(bad === 0 ? 'every bass note lands on its written beat' : `${bad} tune(s) with a drifting bass`)
process.exit(bad === 0 ? 0 : 1)
