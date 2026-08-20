import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { elevationAt, mapToWorld, mapToWorldX } from '../engine/terrain'
import type { Marker, MarkerKind, TerrainConfig } from '../types'

/**
 * One stem and one hit sphere, shared by every place on every map.
 *
 * Written inline, each marker built its own pair — 69 of each on the Nils map,
 * identical in every respect. They live for the life of the page and are never
 * disposed, which is exactly why they are module-level singletons rather than a
 * `useMemo`: a per-marker `geometry={}` prop is not disposed by r3f either, so
 * making them per-marker only means making more of them and keeping them all.
 */
const STEM = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 6)
const STEM_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#00000055',
  transparent: true,
  opacity: 0.4,
})
/**
 * The click target around each pin, so a tap near a marker in the scene selects
 * it — which is what makes the flat 2D map usable, where the HTML label is a
 * fiddly thing to hit.
 *
 * It is `visible={false}`, and that is not the same as the fully transparent
 * material it used to carry. A transparent material is still drawn: on the Nils
 * map these were 38 draw calls and 6,840 triangles every frame, producing not
 * one pixel. An invisible object is skipped by the renderer and still hit by the
 * raycaster — three's `intersect` tests `layers` and never reads `visible`
 * (`Raycaster.js`) — so the click target is unchanged and the cost is gone.
 */
const HIT = new THREE.SphereGeometry(2.6, 10, 10)

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
  /** 3D vs the flat 2D map (labels shrink with distance only in 3D). */
  is3d: boolean
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
  is3d,
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
            <mesh position={[0, 1.4, 0]} geometry={STEM} material={STEM_MATERIAL} />
            {/* The click target — invisible, but still raycast. See HIT above. */}
            <mesh
              position={[0, 3, 0]}
              geometry={HIT}
              visible={false}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(m.id)
              }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'auto')}
            />
            {/* Labels shrink with distance only in 3D; in the flat 2D map they
                stay a constant, readable, clickable size at any zoom. */}
            <Html
              position={[0, 3, 0]}
              center
              distanceFactor={is3d ? 38 : undefined}
              zIndexRange={[10, 0]}
            >
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
