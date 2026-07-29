import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { mapToWorld } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  /** Number of fish schools. */
  fish: number
  /** Number of minor sea monsters (serpents). */
  monsters: number
}

const FISH_PER_SCHOOL = 18
const SEGMENTS = 7

/**
 * Life in the sea: schools of fish darting just under the surface, and a few
 * minor serpents whose humps break the water. Both swim circular routes over
 * open water (sampled from the height field) and undulate as they go.
 */
export function SeaLife({ field, terrain, fish, monsters }: Props) {
  const seaLevel = terrain.seaLevel ?? 0.42
  const heightScale = terrain.heightScale ?? 22
  const waterY = seaLevel * heightScale

  // Pick well-spread open-water centres for schools / serpents.
  const waterCenters = useMemo(() => {
    const make = (count: number) => {
      const out: { x: number; z: number }[] = []
      let tries = 0
      while (out.length < count && tries < count * 60) {
        tries++
        const mx = (Math.random() * 2 - 1) * 0.85
        const mz = (Math.random() * 2 - 1) * 0.85
        if (field.at(mx, mz) > seaLevel - 0.02) continue
        out.push({ x: mapToWorld(mx), z: mapToWorld(mz) })
      }
      return out
    }
    return { schools: make(fish), serpents: make(monsters) }
  }, [field, seaLevel, fish, monsters])

  const serpents = useRef<THREE.Mesh[][]>([])

  // ---- Fish (one instanced mesh) ----
  const fishRef = useRef<THREE.InstancedMesh>(null)
  const fishData = useMemo(() => {
    const arr: { s: number; ox: number; oz: number; ph: number; r: number; spd: number }[] = []
    waterCenters.schools.forEach((_, s) => {
      for (let k = 0; k < FISH_PER_SCHOOL; k++) {
        arr.push({
          s,
          ox: (Math.random() * 2 - 1) * 3.5,
          oz: (Math.random() * 2 - 1) * 3.5,
          ph: Math.random() * 100,
          r: 3 + Math.random() * 4,
          spd: 0.3 + Math.random() * 0.2,
        })
      }
    })
    return arr
  }, [waterCenters])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  useLayoutEffect(() => {
    // Silver-ish per-instance tint set once.
    const m = fishRef.current
    if (!m) return
    const c = new THREE.Color()
    fishData.forEach((_, i) => {
      c.setHSL(0.55, 0.1, 0.6 + Math.random() * 0.2)
      m.setColorAt(i, c)
    })
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [fishData])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const m = fishRef.current
    if (m && fishData.length) {
      for (let i = 0; i < fishData.length; i++) {
        const f = fishData[i]
        const c = waterCenters.schools[f.s]
        const theta = t * f.spd + f.ph
        const cx = c.x + Math.cos(theta) * f.r
        const cz = c.z + Math.sin(theta) * f.r
        const x = cx + f.ox
        const z = cz + f.oz
        dummy.position.set(x, waterY - 0.25 + Math.sin(t * 2 + f.ph) * 0.15, z)
        dummy.rotation.set(0, theta + Math.PI / 2 + Math.sin(t * 6 + f.ph) * 0.25, 0)
        dummy.scale.set(0.7, 0.4, 1.5)
        dummy.updateMatrix()
        m.setMatrixAt(i, dummy.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }

    // ---- Serpents ----
    serpents.current.forEach((segs, si) => {
      const c = waterCenters.serpents[si]
      if (!c || !segs) return
      const theta = t * 0.2 + si * 2.1
      for (let s = 0; s < SEGMENTS; s++) {
        const seg = segs[s]
        if (!seg) continue
        const back = theta - s * 0.5
        const rr = 6
        const lat = Math.sin(t * 1.4 - s * 0.7 + si) * 1.4
        const nx = Math.cos(back) * rr - Math.sin(back) * lat
        const nz = Math.sin(back) * rr + Math.cos(back) * lat
        // Humps rise above the surface, dipping between segments.
        seg.position.set(
          c.x + nx,
          waterY + Math.sin(t * 2.4 - s * 0.9 + si) * 1.4 + 0.2,
          c.z + nz,
        )
        seg.scale.setScalar(1.15 - s * 0.1)
      }
    })
  })

  return (
    <group>
      {fishData.length > 0 && (
        <instancedMesh ref={fishRef} args={[undefined, undefined, fishData.length]}>
          <coneGeometry args={[0.32, 1.3, 5]} />
          <meshStandardMaterial roughness={0.5} metalness={0.3} />
        </instancedMesh>
      )}

      {waterCenters.serpents.map((_, si) => (
        <group key={si}>
          {Array.from({ length: SEGMENTS }, (_, s) => (
            <mesh
              key={s}
              ref={(el) => {
                if (el) {
                  serpents.current[si] = serpents.current[si] ?? []
                  serpents.current[si][s] = el
                }
              }}
            >
              <sphereGeometry args={[0.9, 10, 8]} />
              <meshStandardMaterial color="#2f4a38" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
