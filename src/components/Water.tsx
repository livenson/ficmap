import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_SIZE } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  terrain: TerrainConfig
}

/**
 * A translucent sea plane at the world's sea level. The terrain beneath is
 * darkened by depth (see biomes.ts), so shallows and deeps read differently
 * through the water. A gentle GPU wave gives it life, and a slightly lower
 * opacity lets the sandy shallows show through near the coast so the shoreline
 * reads crisply.
 */
export function Water({ terrain }: Props) {
  const seaLevel = terrain.seaLevel ?? 0.42
  const heightScale = terrain.heightScale ?? 22
  // Sit just below the shoreline so beaches poke through the surface.
  const y = seaLevel * heightScale - 0.15

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const onBeforeCompile = useMemo(
    () => (shader: any) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.vertexShader =
        'uniform float uTime;\n' +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           transformed.z += sin(position.x * 0.12 + uTime) * 0.35
                          + sin(position.y * 0.17 - uTime * 1.3) * 0.25;`,
        )
    },
    [uniforms],
  )
  useFrame((s) => {
    uniforms.uTime.value = s.clock.getElapsedTime()
  })

  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y}>
      <planeGeometry args={[WORLD_SIZE * 1.5, WORLD_SIZE * 1.5, 80, 80]} />
      <meshStandardMaterial
        ref={matRef}
        color={terrain.waterColor ?? '#2b6c8f'}
        transparent
        opacity={0.6}
        roughness={0.18}
        metalness={0.2}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  )
}
