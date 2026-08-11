import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { WORLD_HALF, aspectOf, elevationAt, mapToWorld, mapToWorldX } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  /** How many undead to raise. */
  count: number
  /**
   * Where they walk, in map space — the box they are scattered through.
   * Defaults to the whole map; Westeros confines them to beyond the Wall.
   */
  area?: { x0: number; x1: number; z0: number; z1: number }
}

interface Wight {
  hx: number
  hz: number
  roam: number
  s1: number
  s2: number
  phase: number
  size: number
}

/**
 * The army of the dead — wights shambling across the snow beyond the Wall.
 * Small, stiff-limbed figures with ice-blue eyes that drift slowly over the
 * ground, re-settling onto the surface each frame so they follow the terrain.
 * Deliberately sparse and small: they should read as a creeping menace at the
 * top of the map, not a crowd. 3D-only, deterministic, purely decorative.
 */
export function Wights({ field, terrain, count, area }: Props) {
  const aspect = aspectOf(terrain)
  const box = area ?? { x0: -1, x1: 1, z0: -1, z1: 1 }

  const wights = useMemo<Wight[]>(() => {
    let seed = 0x2545f491
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0x100000000
    }
    return Array.from({ length: count }, () => {
      const mx = box.x0 + rnd() * (box.x1 - box.x0)
      const mz = box.z0 + rnd() * (box.z1 - box.z0)
      return {
        hx: mapToWorldX(mx, terrain),
        hz: mapToWorld(mz),
        roam: 2 + rnd() * 5,
        s1: 0.05 + rnd() * 0.09,
        s2: 0.05 + rnd() * 0.09,
        phase: rnd() * Math.PI * 2,
        size: 0.85 + rnd() * 0.5,
      }
    })
  }, [count, terrain, box.x0, box.x1, box.z0, box.z1])

  const groups = useRef<THREE.Group[]>([])
  const arms = useRef<THREE.Object3D[]>([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    for (let i = 0; i < wights.length; i++) {
      const g = groups.current[i]
      const w = wights[i]
      if (!g) continue
      const wx = w.hx + Math.cos(t * w.s1 + w.phase) * w.roam
      const wz = w.hz + Math.sin(t * w.s2 + w.phase * 1.6) * w.roam
      const mx = wx / (WORLD_HALF * aspect)
      const mz = wz / WORLD_HALF
      const ground = elevationAt(field, terrain, mx, mz)
      // A stiff, lurching gait — a small vertical hitch as they walk.
      const lurch = Math.abs(Math.sin(t * 1.6 + w.phase)) * 0.25
      g.position.set(wx, ground + 0.55 + lurch, wz)
      g.rotation.y = Math.atan2(
        -Math.sin(t * w.s1 + w.phase),
        Math.cos(t * w.s2 + w.phase * 1.6),
      )
      const a = arms.current[i]
      if (a) a.rotation.x = -1.1 + Math.sin(t * 1.6 + w.phase) * 0.18
    }
  })

  return (
    <group>
      {wights.map((w, i) => (
        <group
          key={i}
          scale={w.size}
          ref={(el) => {
            if (el) groups.current[i] = el
          }}
        >
          {/* ragged body */}
          <mesh>
            <capsuleGeometry args={[0.16, 0.5, 4, 7]} />
            <meshBasicMaterial color="#3b4550" />
          </mesh>
          {/* head */}
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#59626b" />
          </mesh>
          {/* ice-blue eyes — the one bright thing about them */}
          <mesh position={[0.06, 0.5, 0.12]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color="#7fe3ff" />
          </mesh>
          <mesh position={[-0.06, 0.5, 0.12]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color="#7fe3ff" />
          </mesh>
          {/* outstretched arms */}
          <group
            position={[0, 0.2, 0]}
            ref={(el) => {
              if (el) arms.current[i] = el
            }}
          >
            <mesh position={[0.2, 0, 0.16]} rotation={[0, 0, -0.3]}>
              <capsuleGeometry args={[0.05, 0.42, 3, 5]} />
              <meshBasicMaterial color="#4a545e" />
            </mesh>
            <mesh position={[-0.2, 0, 0.16]} rotation={[0, 0, 0.3]}>
              <capsuleGeometry args={[0.05, 0.42, 3, 5]} />
              <meshBasicMaterial color="#4a545e" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
