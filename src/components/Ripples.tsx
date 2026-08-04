import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { WORLD_HALF, aspectOf, mapToWorld, mapToWorldX } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
}

const COUNT = 60

/**
 * Expanding rain rings on the water surface. Each ring grows and fades where a
 * drop lands, then respawns at another spot over the sea — so the whole surface
 * stipples with ripples during rain. Rings only spawn over water (sampled from
 * the height field), and sit just above the sea plane.
 */
export function Ripples({ field, terrain }: Props) {
  const seaLevel = terrain.seaLevel ?? 0.42
  const heightScale = terrain.heightScale ?? 22
  const waterY = seaLevel * heightScale + 0.05

  const meshes = useRef<THREE.Mesh[]>([])

  const waterPoint = useMemo(() => {
    return () => {
      for (let i = 0; i < 30; i++) {
        const mx = (Math.random() * 2 - 1) * 0.95
        const mz = (Math.random() * 2 - 1) * 0.95
        if (field.at(mx, mz) <= seaLevel)
          return [mapToWorldX(mx, terrain), mapToWorld(mz)] as const
      }
      return [
        (Math.random() * 2 - 1) * WORLD_HALF * aspectOf(terrain),
        (Math.random() * 2 - 1) * WORLD_HALF,
      ] as const
    }
  }, [field, terrain, seaLevel])

  const drops = useMemo(
    () =>
      Array.from({ length: COUNT }, () => {
        const [x, z] = waterPoint()
        return { x, z, life: Math.random(), dur: 1.1 + Math.random() * 1.2, max: 3 + Math.random() * 3 }
      }),
    [waterPoint],
  )

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    for (let i = 0; i < COUNT; i++) {
      const m = meshes.current[i]
      const d = drops[i]
      if (!m) continue
      d.life += dt / d.dur
      if (d.life >= 1) {
        d.life = 0
        const [x, z] = waterPoint()
        d.x = x
        d.z = z
        d.max = 3 + Math.random() * 3
      }
      const s = 0.2 + d.life * d.max
      m.position.set(d.x, waterY, d.z)
      m.scale.set(s, s, s)
      ;(m.material as THREE.MeshBasicMaterial).opacity = Math.sin(d.life * Math.PI) * 0.35
    }
  })

  return (
    <group>
      {drops.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshes.current[i] = el
          }}
          rotation-x={-Math.PI / 2}
        >
          <ringGeometry args={[0.62, 0.82, 20]} />
          <meshBasicMaterial color="#cfe0ea" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
