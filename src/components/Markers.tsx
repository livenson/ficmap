import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { HeightField } from '../engine/noise'
import { elevationAt, mapToWorld, mapToWorldX } from '../engine/terrain'
import type { Marker, MarkerKind, TerrainConfig } from '../types'

interface Props {
  markers: Marker[]
  field: HeightField
  terrain: TerrainConfig
  selectedId: string | null
  onSelect: (id: string) => void
  showLabels: boolean
  /** Story-mode emphasis: ids in the set glow, others dim. null = no emphasis. */
  highlight: Set<string> | null
  /** Map controls, read for the current zoom level (label decluttering). */
  controlsRef: React.MutableRefObject<any>
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

/** Label priority: 0 = always, 1 = towns/ports/landmarks, 2 = minor detail. */
const RANK: Record<MarkerKind, number> = {
  capital: 0,
  city: 0,
  port: 1,
  town: 1,
  landmark: 1,
  ruin: 2,
  forest: 2,
  peak: 2,
  battle: 2,
  danger: 2,
}

/**
 * Camera-distance bucket, updated only when it crosses a threshold (so labels
 * declutter as you zoom without re-rendering every frame).
 */
function useZoomRank(controlsRef: React.MutableRefObject<any>): number {
  const [allow, setAllow] = useState(0)
  useFrame(() => {
    const d = controlsRef.current?.getDistance?.() ?? 100
    const next = d < 78 ? 2 : d < 150 ? 1 : 0
    setAllow((prev) => (prev === next ? prev : next))
  })
  return allow
}

export function Markers({
  markers,
  field,
  terrain,
  selectedId,
  onSelect,
  showLabels,
  highlight,
  controlsRef,
}: Props) {
  const allowRank = useZoomRank(controlsRef)
  return (
    <>
      {markers.map((m) => {
        const wx = mapToWorldX(m.at.x, terrain)
        const wz = mapToWorld(m.at.z)
        const wy = elevationAt(field, terrain, m.at.x, m.at.z)
        const s = STYLE[m.kind]
        const selected = m.id === selectedId
        const hot = highlight?.has(m.id) ?? false
        const dim = highlight != null && !hot
        // Show the label if zoom allows this rank, or it's selected/highlighted.
        const labelVisible =
          showLabels && (RANK[m.kind] <= allowRank || selected || hot)

        return (
          <group key={m.id} position={[wx, wy, wz]}>
            {/* A stem so the pin floats above the surface and is clickable. */}
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 2.8, 6]} />
              <meshStandardMaterial color="#00000055" transparent opacity={0.4} />
            </mesh>
            <Html position={[0, 3, 0]} center distanceFactor={38} zIndexRange={[10, 0]}>
              <button
                className={`marker ${selected ? 'marker--selected' : ''} ${
                  hot ? 'marker--hot' : ''
                } ${dim ? 'marker--dim' : ''}`}
                style={{ ['--accent' as string]: s.color }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(m.id)
                }}
                title={m.name}
              >
                <span className="marker__icon">{s.icon}</span>
                {labelVisible && <span className="marker__label">{m.name}</span>}
              </button>
            </Html>
          </group>
        )
      })}
    </>
  )
}
