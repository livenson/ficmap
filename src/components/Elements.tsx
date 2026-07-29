import { useMemo } from 'react'
import { Vector3 } from 'three'
import { Html, Line } from '@react-three/drei'
import type { HeightField } from '../engine/noise'
import { elevationAt, mapToWorld } from '../engine/terrain'
import { activeStopIndex, elementPoint, stopPoint } from '../engine/elements'
import type { Story, StoryElement, TerrainConfig } from '../types'

interface Props {
  story: Story
  field: HeightField
  terrain: TerrainConfig
  /** Active tour index (across books), or null in free exploration. */
  chapterIndex: number | null
  selectedElementId: string | null
  onSelect: (id: string) => void
}

/**
 * Tracked artifacts on the map. Each element is drawn at wherever it is for the
 * current chapter — so as the tour advances, a crown or a cursed sword visibly
 * travels. Selecting one traces its whole journey across the map.
 */
export function Elements({
  story,
  field,
  terrain,
  chapterIndex,
  selectedElementId,
  onSelect,
}: Props) {
  const elements = story.elements ?? []
  if (elements.length === 0) return null

  return (
    <>
      {elements.map((el) => (
        <ElementPin
          key={el.id}
          element={el}
          story={story}
          field={field}
          terrain={terrain}
          chapterIndex={chapterIndex}
          selected={el.id === selectedElementId}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

function ElementPin({
  element,
  story,
  field,
  terrain,
  chapterIndex,
  selected,
  onSelect,
}: {
  element: StoryElement
  story: Story
  field: HeightField
  terrain: TerrainConfig
  chapterIndex: number | null
  selected: boolean
  onSelect: (id: string) => void
}) {
  const pt = elementPoint(element, story, chapterIndex)
  const activeIdx = activeStopIndex(element, chapterIndex)

  // The full journey, draped over terrain, shown when the element is selected.
  const trail = useMemo(() => {
    if (!selected) return null
    const pts = element.journey
      .map((leg) => stopPoint(leg, story))
      .filter((p): p is NonNullable<typeof p> => p != null)
      .map(
        (p) =>
          new Vector3(
            mapToWorld(p.x),
            elevationAt(field, terrain, p.x, p.z) + 0.6,
            mapToWorld(p.z),
          ),
      )
    return pts.length >= 2 ? pts : null
  }, [selected, element, story, field, terrain])

  if (!pt) return null
  const wx = mapToWorld(pt.x)
  const wz = mapToWorld(pt.z)
  const wy = elevationAt(field, terrain, pt.x, pt.z)
  const glyph = element.glyph ?? '◆'
  const note = element.journey[activeIdx]?.note

  return (
    <>
      {trail && (
        <Line
          points={trail}
          color="#ffd27a"
          lineWidth={2}
          dashed
          dashSize={1.4}
          gapSize={1}
          transparent
          opacity={0.8}
        />
      )}
      <group position={[wx, wy, wz]}>
        <Html position={[0, 5, 0]} center distanceFactor={34} zIndexRange={[20, 0]}>
          <button
            className={`element ${selected ? 'element--selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(element.id)
            }}
            title={note ? `${element.name} — ${note}` : element.name}
          >
            <span className="element__glyph">{glyph}</span>
            <span className="element__name">{element.name}</span>
          </button>
        </Html>
      </group>
    </>
  )
}
