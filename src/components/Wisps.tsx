import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import {
  WORLD_HALF,
  aspectOf,
  elevationAt,
  mapToWorld,
  mapToWorldX,
} from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  /** How many wisps to scatter over the wet ground. */
  count: number
}

interface Wisp {
  /** Home point (world X/Z) the wisp wanders around. */
  hx: number
  hz: number
  roam: number
  s1: number
  s2: number
  phase: number
  flick: number
  hover: number
  color: THREE.Color
}

/**
 * Perelesnyk / poterchata — the fire-spirit and will-o'-the-wisp lights of the
 * Forest Song. Small glowing orbs that drift low over the fen and the lake,
 * bobbing and flickering like marsh-lights that lead the unwary astray. Each is
 * a bright core inside a soft additive halo; they wander on slow Lissajous
 * paths and re-settle onto the wet ground every frame so they skim the water
 * and reeds. 3D-only, purely decorative and deterministic.
 */
export function Wisps({ field, terrain, count }: Props) {
  const seaLevel = terrain.seaLevel ?? 0.42
  const aspect = aspectOf(terrain)

  const wisps = useMemo<Wisp[]>(() => {
    // A tiny seeded PRNG so the scatter is stable across renders.
    let seed = 0x9e3779b9
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0x100000000
    }
    // Prefer wet ground: water (the lake) and the low fen just above it, so the
    // lights gather over marsh and water rather than the dry forest.
    const wetPoint = (): readonly [number, number] => {
      for (let i = 0; i < 40; i++) {
        const mx = (rnd() * 2 - 1) * 0.85
        const mz = (rnd() * 2 - 1) * 0.85
        if (field.at(mx, mz) <= seaLevel + 0.07)
          return [mapToWorldX(mx, terrain), mapToWorld(mz)] as const
      }
      // Fallback: the fen (south-west) if the sampler never found wet ground.
      return [mapToWorldX(-0.55, terrain), mapToWorld(0.5)] as const
    }
    const ember = new THREE.Color('#ffbf5a') // Perelesnyk — warm fire-spirit
    const ghost = new THREE.Color('#bdf0c4') // poterchata — pale marsh-light
    return Array.from({ length: count }, (_, i) => {
      const [hx, hz] = wetPoint()
      return {
        hx,
        hz,
        roam: 4 + rnd() * 7,
        s1: 0.1 + rnd() * 0.18,
        s2: 0.1 + rnd() * 0.18,
        phase: rnd() * Math.PI * 2,
        flick: 1.5 + rnd() * 2.5,
        hover: 1.4 + rnd() * 1.8,
        // Mostly warm fire-spirits, with a scattering of ghostly marsh-lights.
        color: i % 3 === 0 ? ghost : ember,
      }
    })
  }, [field, terrain, seaLevel, aspect, count])

  const groups = useRef<THREE.Group[]>([])
  const cores = useRef<THREE.Mesh[]>([])
  const halos = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    for (let i = 0; i < wisps.length; i++) {
      const g = groups.current[i]
      const w = wisps[i]
      if (!g) continue
      const wx = w.hx + Math.cos(t * w.s1 + w.phase) * w.roam
      const wz = w.hz + Math.sin(t * w.s2 + w.phase * 1.7) * w.roam
      // Re-settle onto the ground/water under the wisp so it skims the surface.
      const mx = wx / (WORLD_HALF * aspect)
      const mz = wz / WORLD_HALF
      const ground = elevationAt(field, terrain, mx, mz)
      const bob = Math.sin(t * 1.3 + w.phase) * 0.5
      g.position.set(wx, ground + w.hover + bob, wz)

      // Flicker: a gentle pulse with the odd deeper guttering, like a flame.
      const flick = 0.6 + 0.4 * Math.sin(t * w.flick + w.phase)
      const gutter = 0.85 + 0.15 * Math.sin(t * (w.flick * 2.3) + w.phase * 2)
      const b = flick * gutter
      const core = cores.current[i]
      const halo = halos.current[i]
      if (core) (core.material as THREE.MeshBasicMaterial).opacity = 0.55 + 0.4 * b
      if (halo) {
        ;(halo.material as THREE.MeshBasicMaterial).opacity = 0.12 + 0.16 * b
        const s = 0.9 + 0.25 * b
        halo.scale.set(s, s, s)
      }
    }
  })

  return (
    <group>
      {wisps.map((w, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) groups.current[i] = el
          }}
        >
          {/* Soft additive halo */}
          <mesh
            ref={(el) => {
              if (el) halos.current[i] = el
            }}
          >
            <sphereGeometry args={[1.7, 12, 12]} />
            <meshBasicMaterial
              color={w.color}
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Bright core */}
          <mesh
            ref={(el) => {
              if (el) cores.current[i] = el
            }}
          >
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshBasicMaterial
              color={w.color}
              transparent
              opacity={0.9}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
