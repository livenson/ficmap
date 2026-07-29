import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_HALF } from '../engine/terrain'

/**
 * Overcast weather: a drifting layer of dark clouds and animated rain streaks.
 * Rain is one LineSegments buffer (each drop a short vertical line) whose
 * y-values fall and wrap each frame — cheap for a whole downpour. Clouds are a
 * few flattened dark blobs that slowly drift and wrap across the sky.
 */
export function Weather() {
  const RAIN = 1400
  const LEN = 1.8
  const Y_TOP = 74
  const Y_BOT = 3
  const SPAN = WORLD_HALF * 1.05

  const rainRef = useRef<THREE.BufferGeometry>(null)
  const drops = useMemo(() => {
    const arr: { x: number; z: number; y: number; spd: number }[] = []
    for (let i = 0; i < RAIN; i++) {
      arr.push({
        x: (Math.random() * 2 - 1) * SPAN,
        z: (Math.random() * 2 - 1) * SPAN,
        y: Math.random() * (Y_TOP - Y_BOT) + Y_BOT,
        spd: 42 + Math.random() * 26,
      })
    }
    return arr
  }, [])

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
  }, [drops])

  const cloudRef = useRef<THREE.Group>(null)
  const clouds = useMemo(() => {
    const arr: { x: number; y: number; z: number; s: number; drift: number }[] = []
    for (let i = 0; i < 16; i++) {
      arr.push({
        x: (Math.random() * 2 - 1) * SPAN,
        y: 52 + Math.random() * 14,
        z: (Math.random() * 2 - 1) * SPAN,
        s: 12 + Math.random() * 12,
        drift: 1.2 + Math.random() * 1.6,
      })
    }
    return arr
  }, [])

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
    // Clouds drift.
    const g = cloudRef.current
    if (g) {
      g.children.forEach((c, i) => {
        c.position.x += clouds[i].drift * dt
        if (c.position.x > SPAN) c.position.x = -SPAN
      })
    }
  })

  return (
    <group>
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
