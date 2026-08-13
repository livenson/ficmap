import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_SIZE, aspectOf, frameScale } from '../engine/terrain'
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
  // Depth of water above the sea floor (sea level minus the floor). On a
  // low-relief world map this gap is tiny, so both the "sit below the shore"
  // offset and the wave height must scale with it — otherwise wave crests poke
  // up through the flat ocean floor as fixed blotches.
  const gap = seaLevel * heightScale
  const y = gap - Math.min(0.15, gap * 0.3)
  // Full-size waves on deep worlds, near-flat on a shallow world map.
  const waveAmp = Math.min(1, gap / 1.5)
  const a1 = (0.35 * waveAmp).toFixed(4)
  const a2 = (0.25 * waveAmp).toFixed(4)

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const onBeforeCompile = useMemo(
    () => (shader: any) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.vertexShader =
        'uniform float uTime;\n' +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           transformed.z += sin(position.x * 0.12 + uTime) * ${a1}
                          + sin(position.y * 0.17 - uTime * 1.3) * ${a2};`,
        )
    },
    [uniforms, a1, a2],
  )
  useFrame((s) => {
    uniforms.uTime.value = s.clock.getElapsedTime()
  })

  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y}>
      <planeGeometry
        // 1.5x the world in each direction, or as far as the camera is pulled
        // back for this aspect — whichever is further, so the sea never ends
        // inside the view and shows its own straight edge.
        args={[
          WORLD_SIZE * 1.5 * Math.max(aspectOf(terrain), frameScale(aspectOf(terrain))),
          WORLD_SIZE * 1.5 * frameScale(aspectOf(terrain)),
          // Keep segment density uniform on a widened world so the wave shader
          // doesn't alias into big, unevenly-lit facets.
          Math.round(80 * aspectOf(terrain)),
          80,
        ]}
      />
      <meshStandardMaterial
        ref={matRef}
        color={terrain.waterColor ?? '#2b6c8f'}
        transparent
        opacity={0.6}
        roughness={0.42}
        metalness={0.1}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  )
}
