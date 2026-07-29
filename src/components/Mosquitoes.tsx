import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { elevationAt, mapToWorld } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  swarms: number
  field: HeightField
  terrain: TerrainConfig
}

const PER_SWARM = 44

/**
 * Buzzing mosquito swarms hovering low over the land — Estonia's summer plague.
 * All midges live in one Points buffer; each darts erratically around its
 * swarm's centre via layered sine motion, updated on the render clock.
 */
export function Mosquitoes({ swarms, field, terrain }: Props) {
  const geoRef = useRef<THREE.BufferGeometry>(null)
  const seaLevel = terrain.seaLevel ?? 0.42

  const { centers, midges, positions } = useMemo(() => {
    // Place swarm centres on land, a few metres above the surface.
    const centers: { x: number; y: number; z: number }[] = []
    let tries = 0
    while (centers.length < swarms && tries < swarms * 40) {
      tries++
      const mx = (Math.random() * 2 - 1) * 0.8
      const mz = (Math.random() * 2 - 1) * 0.8
      if (field.at(mx, mz) <= seaLevel + 0.05) continue
      centers.push({
        x: mapToWorld(mx),
        y: elevationAt(field, terrain, mx, mz) + 4 + Math.random() * 5,
        z: mapToWorld(mz),
      })
    }
    const midges: { s: number; phase: number; r: number }[] = []
    for (let s = 0; s < centers.length; s++) {
      for (let k = 0; k < PER_SWARM; k++) {
        midges.push({ s, phase: Math.random() * 100, r: 1.6 + Math.random() * 2.4 })
      }
    }
    return { centers, midges, positions: new Float32Array(midges.length * 3) }
  }, [swarms, field, terrain, seaLevel])

  useFrame((state) => {
    const geo = geoRef.current
    if (!geo || centers.length === 0) return
    const t = state.clock.getElapsedTime()
    const p = geo.attributes.position.array as Float32Array
    for (let i = 0; i < midges.length; i++) {
      const m = midges[i]
      const c = centers[m.s]
      const ph = m.phase
      p[i * 3] = c.x + Math.sin(t * 3.1 + ph) * m.r + Math.sin(t * 7.3 + ph * 1.7) * 0.7
      p[i * 3 + 1] =
        c.y + Math.sin(t * 4.7 + ph * 2.1) * m.r * 0.5 + Math.sin(t * 9 + ph) * 0.4
      p[i * 3 + 2] = c.z + Math.cos(t * 2.6 + ph * 1.3) * m.r + Math.cos(t * 6.1 + ph) * 0.7
    }
    geo.attributes.position.needsUpdate = true
  })

  if (centers.length === 0) return null
  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={midges.length}
        />
      </bufferGeometry>
      <pointsMaterial color="#17140e" size={0.55} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}
