import { useMemo } from 'react'
import type { HeightField } from '../engine/noise'
import { buildTerrainGeometry } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  wireframe?: boolean
}

/**
 * The landmass. Geometry is rebuilt only when the field or config identity
 * changes, so panning/zooming/selecting stay cheap.
 */
export function Terrain({ field, terrain, wireframe }: Props) {
  const geometry = useMemo(
    () => buildTerrainGeometry(field, terrain),
    [field, terrain],
  )

  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        vertexColors
        wireframe={wireframe}
        roughness={0.95}
        metalness={0.0}
        flatShading={false}
      />
    </mesh>
  )
}
