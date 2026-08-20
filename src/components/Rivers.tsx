import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line } from '@react-three/drei'
import type { HeightField } from '../engine/noise'
import { generateRivers } from '../engine/rivers'
import { elevationAt, mapToWorld, mapToWorldX } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  /** Bumped when finer ground arrives, so the courses can settle onto it. */
  detailVersion?: number
}

/**
 * Rivers traced downhill from the highlands to the sea, drawn as smooth curves
 * draped just over the terrain surface. Count and color come from the world's
 * terrain config (blue by default; e.g. lava-orange for a volcanic world).
 */
export function Rivers({ field, terrain, detailVersion = 0 }: Props) {
  // The courses themselves are traced once. `detailVersion` is deliberately not
  // a dependency here: re-tracing on finer ground would send every river down a
  // different valley, which is a bigger change than the one being fixed.
  const rivers = useMemo(
    () => generateRivers(field, terrain, terrain.rivers ?? 0),
    [field, terrain],
  )
  // Real rivers come with their course already; only their height is in doubt,
  // and that is settled by the drape like everything else.
  const named = terrain.namedRivers ?? []
  const color = terrain.riverColor ?? '#3f86b0'

  if (rivers.length === 0 && named.length === 0) return null
  return (
    <>
      {named.map((r) => (
        <RiverLine
          key={`named:${r.name}`}
          path={r.points}
          field={field}
          terrain={terrain}
          color={color}
          // A named river is the real one and carries the map: drawn a little
          // stronger than the traced courses around it, which are scenery.
          width={2.8}
          detailVersion={detailVersion}
        />
      ))}
      {rivers.map((path, i) => (
        <RiverLine
          key={i}
          path={path}
          field={field}
          terrain={terrain}
          color={color}
          width={2}
          detailVersion={detailVersion}
        />
      ))}
    </>
  )
}

function RiverLine({
  path,
  field,
  terrain,
  color,
  width,
  detailVersion,
}: {
  path: { x: number; z: number }[]
  field: HeightField
  terrain: TerrainConfig
  color: string
  width: number
  detailVersion: number
}) {
  const points = useMemo(() => {
    const flat = path.map((p) => new Vector3(p.x, 0, p.z))
    const curve = new CatmullRomCurve3(flat, false, 'catmullrom', 0.5)
    const n = Math.max(flat.length * 6, 24)
    const out: Vector3[] = []
    for (let i = 0; i <= n; i++) {
      const p = curve.getPoint(i / n)
      out.push(
        new Vector3(
          mapToWorldX(p.x, terrain),
          elevationAt(field, terrain, p.x, p.z) + 0.25,
          mapToWorld(p.z),
        ),
      )
    }
    return out
    // The course is fixed; only where it lies on the hillside is redone.
  }, [path, field, terrain, detailVersion])

  return <Line points={points} color={color} lineWidth={width} transparent opacity={0.85} />
}
