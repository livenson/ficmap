import type { MusicMood } from '../types'

/**
 * Procedural ambient music.
 *
 * Ficmap generates its worlds from a seed rather than shipping big assets, and
 * the score works the same way: there are no audio files. Everything here is
 * synthesised live with the Web Audio API — a sustained drone, a slow drift of
 * notes drawn from a mode chosen for the world's mood, and a long delay for
 * space. That keeps the bundle unchanged, sidesteps licensing entirely, and
 * lets every world (and every floor) have its own colour.
 *
 * It is deliberately slow and quiet: this is background for reading a map, not
 * a soundtrack. Playback only ever starts from a user gesture, as browsers
 * require.
 */

/** Scale degrees (semitones from the root) that give each mood its colour. */
const SCALES: Record<MusicMood, number[]> = {
  // Open major pentatonic — nothing can clash; gentle and pastoral.
  calm: [0, 2, 4, 7, 9, 12, 14],
  // Natural minor: weighty, heroic, a little sad.
  epic: [0, 2, 3, 5, 7, 8, 10, 12],
  // Phrygian, with the flat second that makes it feel wrong and close.
  dark: [0, 1, 3, 5, 6, 8, 10],
  // Dorian — folk-modal, the sound of old songs.
  mystic: [0, 2, 3, 5, 7, 9, 10, 12],
  // Lydian, with the raised fourth that floats upward.
  heaven: [0, 2, 4, 6, 7, 9, 11, 12],
  // Bright and wide-open, for maps of the whole world.
  wonder: [0, 2, 4, 7, 9, 11, 12, 16],
}

/** Root pitch (Hz) per mood — lower for the heavy moods, higher for the airy. */
const ROOTS: Record<MusicMood, number> = {
  calm: 196.0, // G3
  epic: 146.83, // D3
  dark: 103.83, // G#2
  mystic: 174.61, // F3
  heaven: 261.63, // C4
  wonder: 155.56, // D#3
}

/** Seconds between notes; the slower moods breathe more. */
const PACE: Record<MusicMood, [number, number]> = {
  calm: [2.4, 4.6],
  epic: [2.8, 5.4],
  dark: [3.2, 6.5],
  mystic: [2.2, 4.4],
  heaven: [2.6, 5.2],
  wonder: [2.4, 4.8],
}

const semitone = (root: number, n: number) => root * Math.pow(2, n / 12)

export class AmbientMusic {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private wet: GainNode | null = null
  private drones: { osc: OscillatorNode; gain: GainNode }[] = []
  private timer: ReturnType<typeof setTimeout> | null = null
  private mood: MusicMood = 'calm'
  private volume = 0.5
  running = false

  /** Begin playing. Must be called from a user gesture (browser policy). */
  async start(mood: MusicMood) {
    this.mood = mood
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return // no Web Audio — silently do nothing
      this.ctx = new Ctx()
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    if (this.running) {
      this.setMood(mood)
      return
    }
    this.running = true

    const ctx = this.ctx
    // master → a gentle low-pass → the speakers, with a long delay in parallel
    // for a cave-like sense of space.
    this.master = ctx.createGain()
    this.master.gain.setValueAtTime(0, ctx.currentTime)
    this.master.gain.linearRampToValueAtTime(this.volume * 0.5, ctx.currentTime + 3)

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 1400
    this.filter.Q.value = 0.4

    const delay = ctx.createDelay(4)
    delay.delayTime.value = 0.62
    const feedback = ctx.createGain()
    feedback.gain.value = 0.42
    this.wet = ctx.createGain()
    this.wet.gain.value = 0.38

    this.filter.connect(this.master)
    this.filter.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(this.wet)
    this.wet.connect(this.master)
    this.master.connect(ctx.destination)

    this.buildDrone()
    this.scheduleNote()
  }

  /** Swap the mood (a new world or floor) without stopping playback. */
  setMood(mood: MusicMood) {
    if (mood === this.mood) return
    this.mood = mood
    if (!this.running) return
    this.buildDrone() // re-tune the drone to the new root
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.master && this.ctx) {
      this.master.gain.linearRampToValueAtTime(this.volume * 0.5, this.ctx.currentTime + 0.4)
    }
  }

  stop() {
    this.running = false
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    const ctx = this.ctx
    if (ctx && this.master) {
      // Fade out, then tear the graph down.
      this.master.gain.cancelScheduledValues(ctx.currentTime)
      this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime)
      this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)
      const drones = this.drones
      this.drones = []
      setTimeout(() => {
        drones.forEach((d) => {
          try {
            d.osc.stop()
          } catch {
            /* already stopped */
          }
        })
      }, 1400)
    }
  }

  /** Release the audio device entirely. */
  dispose() {
    this.stop()
    const ctx = this.ctx
    this.ctx = null
    setTimeout(() => ctx?.close().catch(() => {}), 1600)
  }

  /** A pair of detuned oscillators holding the root and fifth. */
  private buildDrone() {
    const ctx = this.ctx
    if (!ctx || !this.filter) return
    this.drones.forEach((d) => {
      d.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
      setTimeout(() => {
        try {
          d.osc.stop()
        } catch {
          /* already stopped */
        }
      }, 1800)
    })
    this.drones = []
    const root = ROOTS[this.mood]
    // root, root an octave down, and the fifth — slightly detuned so the drone
    // beats gently instead of sitting still.
    const voices: [number, number, number][] = [
      [root / 2, 0.16, 0],
      [root, 0.1, 4],
      [semitone(root, 7), 0.07, -5],
    ]
    for (const [freq, amp, detune] of voices) {
      const osc = ctx.createOscillator()
      osc.type = this.mood === 'dark' ? 'sawtooth' : 'triangle'
      osc.frequency.value = freq
      osc.detune.value = detune
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(amp * (this.mood === 'dark' ? 0.5 : 1), ctx.currentTime + 4)
      osc.connect(gain)
      gain.connect(this.filter)
      osc.start()
      this.drones.push({ osc, gain })
    }
  }

  /** Play one soft note, then queue the next after a random rest. */
  private scheduleNote() {
    if (!this.running || !this.ctx || !this.filter) return
    const ctx = this.ctx
    const scale = SCALES[this.mood]
    const root = ROOTS[this.mood]
    const step = scale[Math.floor(Math.random() * scale.length)]
    // Mostly the middle octave, occasionally an octave up for sparkle.
    const oct = Math.random() < 0.25 ? 12 : 0
    const freq = semitone(root * 2, step + oct)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const gain = ctx.createGain()
    const t = ctx.currentTime
    const peak = 0.1 + Math.random() * 0.06
    // A slow bell-like swell: long attack, long tail.
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(peak, t + 0.5 + Math.random() * 0.5)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.4 + Math.random() * 2)
    osc.connect(gain)
    gain.connect(this.filter)
    osc.start(t)
    osc.stop(t + 6.5)

    const [lo, hi] = PACE[this.mood]
    this.timer = setTimeout(() => this.scheduleNote(), (lo + Math.random() * (hi - lo)) * 1000)
  }
}

/**
 * Pick a mood for a level: the explicit `music` setting wins, otherwise it
 * follows the sky, so an underworld sounds dark and a sky realm sounds airy
 * without every world having to say so.
 */
export function moodFor(
  music: MusicMood | undefined,
  sky: 'day' | 'dark' | 'cavern' | 'heaven' | undefined,
): MusicMood {
  if (music) return music
  if (sky === 'dark') return 'dark'
  if (sky === 'cavern') return 'mystic'
  if (sky === 'heaven') return 'heaven'
  return 'calm'
}
