import { WORLD_SIZE } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  terrain: TerrainConfig
}

/**
 * A translucent sea plane at the world's sea level. The terrain beneath is
 * darkened by depth (see biomes.ts), so shallows and deeps read differently
 * through the water.
 */
export function Water({ terrain }: Props) {
  const seaLevel = terrain.seaLevel ?? 0.42
  const heightScale = terrain.heightScale ?? 22
  // Sit just below the shoreline so beaches poke through the surface.
  const y = seaLevel * heightScale - 0.15

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y}>
      <planeGeometry args={[WORLD_SIZE * 1.5, WORLD_SIZE * 1.5]} />
      <meshStandardMaterial
        color={terrain.waterColor ?? '#2b6c8f'}
        transparent
        opacity={0.72}
        roughness={0.25}
        metalness={0.15}
      />
    </mesh>
  )
}
