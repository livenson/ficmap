import { Html } from '@react-three/drei'
import type { HeightField } from '../engine/noise'
import { elevationAt, mapToWorld } from '../engine/terrain'
import type { RegionLabel, TerrainConfig } from '../types'

interface Props {
  regions: RegionLabel[]
  field: HeightField
  terrain: TerrainConfig
}

/** Ambient area names (e.g. "The Ashen Reach") floated over the map. */
export function Regions({ regions, field, terrain }: Props) {
  return (
    <>
      {regions.map((r) => {
        const wx = mapToWorld(r.at.x)
        const wz = mapToWorld(r.at.z)
        const wy = elevationAt(field, terrain, r.at.x, r.at.z) + 2
        return (
          <Html
            key={r.id}
            position={[wx, wy, wz]}
            center
            distanceFactor={90}
            zIndexRange={[5, 0]}
            pointerEvents="none"
          >
            <div className="region" style={{ fontSize: `${(r.scale ?? 1) * 20}px` }}>
              {r.name}
            </div>
          </Html>
        )
      })}
    </>
  )
}
