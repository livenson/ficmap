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
}

const FISH_PER_SCHOOL = 18

/**
 * Schools of fish darting just under the sea surface. Each fish orbits its
 * school's centre on a small route, body wiggling, tinted silver. Schools sit
 * over open water sampled from the height field.
 */
export function SeaLife({ field, terrain, fish }: Props) {
  const seaLevel = terrain.seaLevel ?? 0.42
  const heightScale = terrain.heightScale ?? 22
  const waterY = seaLevel * heightScale

  const schools = useMemo(() => {
    const out: { x: number; z: number }[] = []
    let tries = 0
    while (out.length < fish && tries < fish * 60) {
      tries++
      const mx = (Math.random() * 2 - 1) * 0.85
      const mz = (Math.random() * 2 - 1) * 0.85
      if (field.at(mx, mz) > seaLevel - 0.02) continue
      out.push({ x: mapToWorld(mx), z: mapToWorld(mz) })
    }
    return out
  }, [field, seaLevel, fish])

  const fishRef = useRef<THREE.InstancedMesh>(null)
  const fishData = useMemo(() => {
    const arr: { s: number; ox: number; oz: number; ph: number; r: number; spd: number }[] = []
    schools.forEach((_, s) => {
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
  }, [schools])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  useLayoutEffect(() => {
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
    if (!m || !fishData.length) return
    for (let i = 0; i < fishData.length; i++) {
      const f = fishData[i]
      const c = schools[f.s]
      const theta = t * f.spd + f.ph
      const x = c.x + Math.cos(theta) * f.r + f.ox
      const z = c.z + Math.sin(theta) * f.r + f.oz
      dummy.position.set(x, waterY - 0.25 + Math.sin(t * 2 + f.ph) * 0.15, z)
      dummy.rotation.set(0, theta + Math.PI / 2 + Math.sin(t * 6 + f.ph) * 0.25, 0)
      dummy.scale.set(0.7, 0.4, 1.5)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  if (fishData.length === 0) return null
  return (
    <instancedMesh ref={fishRef} args={[undefined, undefined, fishData.length]}>
      <coneGeometry args={[0.32, 1.3, 5]} />
      <meshStandardMaterial roughness={0.5} metalness={0.3} />
    </instancedMesh>
  )
}
