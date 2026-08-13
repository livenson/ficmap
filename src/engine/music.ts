import type { LevelMusic, MusicMood, MusicVoice } from '../types'

/**
 * The score.
 *
 * Ficmap generates its worlds rather than shipping assets, and the music works
 * the same way — there are no audio files. But the tunes are not random: each
 * world (and each floor) carries a WRITTEN MELODY in its story data, as a short
 * string of `note:beats` tokens, and this module sequences and synthesises it.
 *
 * Every tune is either public domain (credited on screen while it plays) or
 * written for this atlas. The real film and television themes are copyrighted
 * and are deliberately not reproduced or imitated.
 */

// --- note parsing ----------------------------------------------------------

const NOTE_BASE: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }

/** `A4` → 440 Hz, `F#3`, `Bb4`, … Returns null for a rest. */
export function noteToHz(name: string): number | null {
  if (!name || name === 'r' || name === 'R') return null
  const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(name.trim())
  if (!m) return null
  const [, letter, accidental, octave] = m
  let semis = NOTE_BASE[letter.toUpperCase()]
  if (accidental === '#') semis += 1
  else if (accidental === 'b') semis -= 1
  semis += (Number(octave) - 4) * 12
  return 440 * Math.pow(2, semis / 12)
}

interface Step {
  hz: number | null
  beats: number
}

/** Parse `"A3:2 C4:1 r:1"` into steps. Bare tokens default to one beat. */
export function parseMelody(src: string | undefined): Step[] {
  if (!src) return []
  return src
    .trim()
    .split(/\s+/)
    .map((tok) => {
      const [n, b] = tok.split(':')
      return { hz: noteToHz(n), beats: Math.max(0.25, Number(b) || 1) }
    })
}

// --- tone colours ----------------------------------------------------------

interface VoiceSpec {
  /** Partial multipliers and their relative levels. */
  partials: [number, number][]
  type: OscillatorType
  attack: number
  decay: number
  /** Held fraction of the note's length before release. */
  sustain: number
  vibrato: number
}

const VOICES: Record<MusicVoice, VoiceSpec> = {
  // Breathy and pure — a wooden flute.
  flute: { partials: [[1, 1], [2, 0.12], [3, 0.05]], type: 'sine', attack: 0.16, decay: 0.5, sustain: 0.7, vibrato: 3.5 },
  // Plucked: instant attack, long ring, no sustain.
  harp: { partials: [[1, 1], [2, 0.3], [3, 0.14], [5, 0.05]], type: 'triangle', attack: 0.006, decay: 2.4, sustain: 0, vibrato: 0 },
  // Bowed: slow swell, rich and slightly reedy.
  strings: { partials: [[1, 1], [2, 0.35], [3, 0.18], [4, 0.08]], type: 'sawtooth', attack: 0.45, decay: 0.9, sustain: 0.65, vibrato: 4.5 },
  // Struck metal with inharmonic partials.
  bell: { partials: [[1, 1], [2.76, 0.28], [5.4, 0.1]], type: 'sine', attack: 0.004, decay: 3.2, sustain: 0, vibrato: 0 },
  // Brassy and round.
  horn: { partials: [[1, 1], [2, 0.5], [3, 0.22], [4, 0.1]], type: 'triangle', attack: 0.12, decay: 0.7, sustain: 0.7, vibrato: 2.5 },
}

/** Fallback voice when a world names only a mood. */
const MOOD_VOICE: Record<MusicMood, MusicVoice> = {
  calm: 'flute',
  epic: 'horn',
  dark: 'strings',
  mystic: 'flute',
  heaven: 'bell',
  wonder: 'harp',
}

export class AmbientMusic {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private bus: GainNode | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private cfg: LevelMusic = {}
  private melody: Step[] = []
  private bass: Step[] = []
  private mi = 0
  private bi = 0
  private bNext = 0 // beats until the bass line's next note
  private volume = 0.6
  running = false

  /** Begin playing. Must be called from a user gesture (browser policy). */
  async start(cfg: LevelMusic) {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return
      this.ctx = new Ctx()
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    // Already playing: this is a world/floor change, not a fresh start. Hand it
    // to setMusic — which needs `this.cfg` still holding the OLD tune to notice
    // the difference, so the assignment below must not run first.
    if (this.running) {
      this.setMusic(cfg)
      return
    }
    this.cfg = cfg
    this.running = true

    const ctx = this.ctx
    this.master = ctx.createGain()
    this.master.gain.setValueAtTime(0, ctx.currentTime)
    this.master.gain.linearRampToValueAtTime(this.volume * 0.42, ctx.currentTime + 2)

    // A shared bus → gentle low-pass, with a long delay in parallel for air.
    this.bus = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2600
    filter.Q.value = 0.3
    const delay = ctx.createDelay(4)
    delay.delayTime.value = 0.44
    const fb = ctx.createGain()
    fb.gain.value = 0.34
    const wet = ctx.createGain()
    wet.gain.value = 0.3

    this.bus.connect(filter)
    filter.connect(this.master)
    filter.connect(delay)
    delay.connect(fb)
    fb.connect(delay)
    delay.connect(wet)
    wet.connect(this.master)
    this.master.connect(ctx.destination)

    this.loadMelody(cfg)
    this.tick()
  }

  /** Swap to another level's tune without stopping playback. */
  setMusic(cfg: LevelMusic) {
    const same =
      cfg.melody === this.cfg.melody &&
      cfg.bass === this.cfg.bass &&
      cfg.voice === this.cfg.voice &&
      cfg.tempo === this.cfg.tempo
    this.cfg = cfg
    if (same) return
    this.loadMelody(cfg)
    if (!this.running) return
    // Take the new tune from the top straight away rather than waiting out the
    // old note — otherwise a slow world holds the transition for seconds. The
    // ringing tail of the previous note crosses over, which reads as a segue.
    // This also revives the sequencer if it stopped on a level with no melody.
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    this.tick()
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.master && this.ctx) {
      this.master.gain.linearRampToValueAtTime(this.volume * 0.42, this.ctx.currentTime + 0.3)
    }
  }

  stop() {
    this.running = false
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    const ctx = this.ctx
    if (ctx && this.master) {
      this.master.gain.cancelScheduledValues(ctx.currentTime)
      this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime)
      this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
    }
  }

  dispose() {
    this.stop()
    const ctx = this.ctx
    this.ctx = null
    setTimeout(() => ctx?.close().catch(() => {}), 1400)
  }

  private loadMelody(cfg: LevelMusic) {
    this.melody = parseMelody(cfg.melody)
    this.bass = parseMelody(cfg.bass)
    this.mi = 0
    this.bi = 0
    this.bNext = 0
  }

  /** Play the next melody step (and any bass note falling due), then queue up. */
  private tick() {
    // Cleared on entry so a silent level leaves no phantom timer behind: a
    // later swap checks this to know whether the loop is still alive.
    this.timer = null
    if (!this.running || !this.ctx || !this.bus || this.melody.length === 0) return
    const cfg = this.cfg
    const bpm = cfg.tempo ?? 58
    const beat = 60 / bpm
    const voice = cfg.voice ?? MOOD_VOICE[cfg.mood ?? 'calm']

    // True when this step is the first of the tune, so the bass can come round
    // to the top with it. Read before `mi` advances.
    const atTop = this.mi % this.melody.length === 0

    const step = this.melody[this.mi % this.melody.length]
    this.mi++
    if (step.hz) this.play(step.hz, step.beats * beat, voice, 1)

    // The bass keeps its own note lengths underneath, but it is LOCKED to the
    // melody rather than running free. Two things used to pull it away:
    //
    //  - Most tunes are not a whole number of bass notes long (a 38-beat
    //    melody over a 32-beat bass), so every repeat started the bass six
    //    beats further into the harmony. Within a couple of loops the low part
    //    was playing a chord that had nothing to do with the tune above it —
    //    which is what made the bass sound unrelated in almost every world.
    //  - When a melody step overran the end of a bass note, the leftover was
    //    thrown away by assigning `bNext` instead of adding to it, so the bass
    //    also drifted a little later every time that happened.
    if (this.bass.length) {
      if (atTop) {
        this.bi = 0
        this.bNext = 0
      }
      // Start every bass note whose beat falls inside this melody step, at its
      // exact offset within it. The bass could previously only change when a
      // melody note happened to begin, so over a long melody note a chord
      // change could land up to four beats late. The guard is a belt-and-braces
      // stop; `parseMelody` floors a step at 0.25 beats, so this always ends.
      let guard = 0
      while (this.bNext < step.beats && guard++ < 32) {
        const b = this.bass[this.bi % this.bass.length]
        this.bi++
        if (b.hz) this.play(b.hz, b.beats * beat, 'strings', 0.5, Math.max(0, this.bNext) * beat)
        this.bNext += b.beats
      }
      this.bNext -= step.beats
    }

    // A breath of rest between phrases keeps it from feeling mechanical.
    const gap = this.mi % this.melody.length === 0 ? beat * 2 : 0
    this.timer = setTimeout(() => this.tick(), (step.beats * beat + gap) * 1000)
  }

  /**
   * Synthesise one note: stacked partials under a shaped envelope.
   *
   * `delay` (seconds) starts the note that far into the future on the audio
   * clock rather than immediately — the bass uses it to land on its own beat
   * instead of on whichever melody note happens to be starting.
   */
  private play(hz: number, dur: number, voice: MusicVoice, level: number, delay = 0) {
    const ctx = this.ctx
    if (!ctx || !this.bus) return
    const v = VOICES[voice]
    const t = ctx.currentTime + Math.max(0, delay)
    const hold = Math.max(0.25, dur * 0.92)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.linearRampToValueAtTime(0.22 * level, t + v.attack)
    if (v.sustain > 0) {
      env.gain.linearRampToValueAtTime(0.22 * level * v.sustain, t + v.attack + v.decay)
      env.gain.setValueAtTime(0.22 * level * v.sustain, t + hold)
    }
    env.gain.exponentialRampToValueAtTime(0.0001, t + hold + (v.sustain > 0 ? 0.5 : v.decay))
    env.connect(this.bus)

    // A slow vibrato shared by every partial of the note.
    let lfo: OscillatorNode | null = null
    let lfoGain: GainNode | null = null
    if (v.vibrato > 0) {
      lfo = ctx.createOscillator()
      lfo.frequency.value = v.vibrato
      lfoGain = ctx.createGain()
      lfoGain.gain.setValueAtTime(0, t)
      lfoGain.gain.linearRampToValueAtTime(hz * 0.004, t + v.attack + 0.3)
      lfo.connect(lfoGain)
      lfo.start(t)
      lfo.stop(t + hold + 1.2)
    }

    const tail = hold + (v.sustain > 0 ? 0.6 : v.decay) + 0.1
    for (const [mult, lvl] of v.partials) {
      const osc = ctx.createOscillator()
      osc.type = v.type
      osc.frequency.value = hz * mult
      const g = ctx.createGain()
      g.gain.value = lvl
      if (lfoGain) lfoGain.connect(osc.frequency)
      osc.connect(g)
      g.connect(env)
      osc.start(t)
      osc.stop(t + tail)
    }
  }
}

/**
 * Resolve the music for the level being shown: its own settings if it has
 * them, otherwise the world's, so a floor without its own tune inherits the
 * surface's rather than falling silent.
 */
export function musicFor(
  level: LevelMusic | undefined,
  surface: LevelMusic | undefined,
  sky: 'day' | 'dark' | 'cavern' | 'heaven' | undefined,
): LevelMusic {
  const base = level?.melody ? level : (surface ?? {})
  const mood: MusicMood =
    level?.mood ?? (sky === 'dark' ? 'dark' : sky === 'cavern' ? 'mystic' : sky === 'heaven' ? 'heaven' : base.mood ?? 'calm')
  return { ...base, mood, voice: level?.voice ?? base.voice }
}
