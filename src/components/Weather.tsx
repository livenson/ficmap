import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_HALF, aspectOf } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  /** Needed only to widen map X by the world's aspect when `area` is given. */
  terrain?: TerrainConfig
  /** Map-space box to confine the storm to. Omit for weather everywhere. */
  area?: { x0: number; x1: number; z0: number; z1: number }
}

/**
 * Overcast weather: a drifting layer of dark clouds and animated rain streaks.
 * Rain is one LineSegments buffer (each drop a short vertical line) whose
 * y-values fall and wrap each frame — cheap for a whole downpour. Clouds are a
 * few flattened dark blobs that slowly drift and wrap across the sky.
 *
 * With an `area`, the storm sits over one box of the map rather than the whole
 * world, so weather can be a thing you travel INTO — the Lāčplēsis map keeps
 * its rain over the northern, Estonian end. The lightning localises with it:
 * a point light above the storm instead of a flash across the entire scene.
 */
export function Weather({ terrain, area }: Props = {}) {
  const LEN = 1.8
  const Y_TOP = 74
  const Y_BOT = 3
  const SPAN = WORLD_HALF * 1.05

  // The storm's world-space footprint, and how much of the map it covers — a
  // local squall needs proportionally fewer drops to read as just as heavy.
  const box = useMemo(() => {
    const a = aspectOf(terrain)
    if (!area) return { x0: -SPAN, x1: SPAN, z0: -SPAN, z1: SPAN, frac: 1 }
    const x0 = area.x0 * WORLD_HALF * a
    const x1 = area.x1 * WORLD_HALF * a
    const z0 = area.z0 * WORLD_HALF
    const z1 = area.z1 * WORLD_HALF
    const frac = (Math.abs(x1 - x0) * Math.abs(z1 - z0)) / (2 * SPAN * a * (2 * SPAN))
    return { x0, x1, z0, z1, frac: Math.max(0.12, Math.min(1, frac)) }
  }, [area, terrain, SPAN])

  const RAIN = Math.round(1400 * (area ? Math.min(1, box.frac * 2.2) : 1))
  const CLOUDS = Math.round(16 * (area ? Math.min(1, box.frac * 2.6) : 1))
  const lerp = (a: number, b: number) => a + Math.random() * (b - a)

  const rainRef = useRef<THREE.BufferGeometry>(null)
  const drops = useMemo(() => {
    const arr: { x: number; z: number; y: number; spd: number }[] = []
    for (let i = 0; i < RAIN; i++) {
      arr.push({
        x: lerp(box.x0, box.x1),
        z: lerp(box.z0, box.z1),
        y: Math.random() * (Y_TOP - Y_BOT) + Y_BOT,
        spd: 42 + Math.random() * 26,
      })
    }
    return arr
  }, [RAIN, box])

  const positions = useMemo(() => {
    const p = new Float32Array(RAIN * 2 * 3)
    drops.forEach((d, i) => {
      p[i * 6] = d.x
      p[i * 6 + 1] = d.y + LEN
      p[i * 6 + 2] = d.z
      p[i * 6 + 3] = d.x
      p[i * 6 + 4] = d.y
      p[i * 6 + 5] = d.z
    })
    return p
  }, [drops, RAIN])

  // Either an ambient flash (world storm) or a point light over a local one,
  // so the ref is set by callback rather than typed to one of them.
  const flashRef = useRef<THREE.Light | null>(null)
  const setFlash = (o: THREE.Light | null) => {
    flashRef.current = o
  }
  const flash = useRef({ active: false, start: 0, next: 3 + Math.random() * 5 })

  const cloudRef = useRef<THREE.Group>(null)
  const clouds = useMemo(() => {
    const arr: { x: number; y: number; z: number; s: number; drift: number }[] = []
    for (let i = 0; i < CLOUDS; i++) {
      arr.push({
        x: lerp(box.x0, box.x1),
        y: 52 + Math.random() * 14,
        z: lerp(box.z0, box.z1),
        s: 12 + Math.random() * 12,
        drift: 1.2 + Math.random() * 1.6,
      })
    }
    return arr
  }, [CLOUDS, box])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    // Rain falls and wraps.
    const geo = rainRef.current
    if (geo) {
      const p = geo.attributes.position.array as Float32Array
      for (let i = 0; i < RAIN; i++) {
        const d = drops[i]
        d.y -= d.spd * dt
        if (d.y < Y_BOT) d.y = Y_TOP + Math.random() * 8
        p[i * 6 + 1] = d.y + LEN
        p[i * 6 + 4] = d.y
      }
      geo.attributes.position.needsUpdate = true
    }
    // Clouds drift east and wrap within the storm's own footprint.
    const g = cloudRef.current
    if (g) {
      g.children.forEach((c, i) => {
        c.position.x += clouds[i].drift * dt
        if (c.position.x > box.x1) c.position.x = box.x0
      })
    }
    // Lightning: an occasional flickering flash that lights the whole scene.
    const fl = flashRef.current
    if (fl) {
      const now = _.clock.getElapsedTime()
      if (!flash.current.active && now > flash.current.next) {
        flash.current.active = true
        flash.current.start = now
      }
      if (flash.current.active) {
        const tt = now - flash.current.start
        const peak = area ? 900 : 3.4
        fl.intensity = Math.max(0, Math.sin(tt * 45) * 0.5 + 0.5) * Math.exp(-tt * 6.5) * peak
        if (tt > 0.75) {
          flash.current.active = false
          fl.intensity = 0
          flash.current.next = now + 5 + Math.random() * 9
        }
      } else {
        fl.intensity = 0
      }
    }
  })

  return (
    <group>
      {/* Lightning flash (intensity driven each frame). A world-wide storm
          flashes the whole scene; a local one lights only its own patch. */}
      {area ? (
        <pointLight
          ref={setFlash}
          position={[(box.x0 + box.x1) / 2, 58, (box.z0 + box.z1) / 2]}
          intensity={0}
          distance={SPAN * 1.5}
          decay={1.1}
          color="#e8eeff"
        />
      ) : (
        <ambientLight ref={setFlash} intensity={0} color="#e8eeff" />
      )}

      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={rainRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={RAIN * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#9fb6c6" transparent opacity={0.34} />
      </lineSegments>

      <group ref={cloudRef}>
        {clouds.map((c, i) => (
          <mesh key={i} position={[c.x, c.y, c.z]} scale={[c.s, c.s * 0.35, c.s]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#3a4048"
              transparent
              opacity={0.82}
              roughness={1}
              flatShading
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
