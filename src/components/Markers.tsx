import { Html } from '@react-three/drei'
import type { HeightField } from '../engine/noise'
import { elevationAt, mapToWorld } from '../engine/terrain'
import type { Marker, MarkerKind, TerrainConfig } from '../types'

interface Props {
  markers: Marker[]
  field: HeightField
  terrain: TerrainConfig
  selectedId: string | null
  onSelect: (id: string) => void
  showLabels: boolean
}

/** Icon + accent color per marker kind. */
const STYLE: Record<MarkerKind, { icon: string; color: string }> = {
  capital: { icon: '★', color: '#ffd76b' },
  city: { icon: '●', color: '#f4e9c1' },
  town: { icon: '•', color: '#cdbf94' },
  ruin: { icon: '⌂', color: '#b89b8c' },
  landmark: { icon: '◆', color: '#a8d5e5' },
  battle: { icon: '⚔', color: '#e0736b' },
  peak: { icon: '▲', color: '#e8eef2' },
  port: { icon: '⚓', color: '#8fc6e0' },
  forest: { icon: '❦', color: '#8fbf7a' },
  danger: { icon: '☠', color: '#e05b5b' },
}

export function Markers({
  markers,
  field,
  terrain,
  selectedId,
  onSelect,
  showLabels,
}: Props) {
  return (
    <>
      {markers.map((m) => {
        const wx = mapToWorld(m.at.x)
        const wz = mapToWorld(m.at.z)
        const wy = elevationAt(field, terrain, m.at.x, m.at.z)
        const s = STYLE[m.kind]
        const selected = m.id === selectedId

        return (
          <group key={m.id} position={[wx, wy, wz]}>
            {/* A stem so the pin floats above the surface and is clickable. */}
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 2.8, 6]} />
              <meshStandardMaterial color="#00000055" transparent opacity={0.4} />
            </mesh>
            <Html position={[0, 3, 0]} center distanceFactor={38} zIndexRange={[10, 0]}>
              <button
                className={`marker ${selected ? 'marker--selected' : ''}`}
                style={{ ['--accent' as string]: s.color }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(m.id)
                }}
                title={m.name}
              >
                <span className="marker__icon">{s.icon}</span>
                {showLabels && <span className="marker__label">{m.name}</span>}
              </button>
            </Html>
          </group>
        )
      })}
    </>
  )
}
