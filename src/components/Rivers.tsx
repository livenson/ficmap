import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line } from '@react-three/drei'
import type { HeightField } from '../engine/noise'
import { generateRivers } from '../engine/rivers'
import { elevationAt, mapToWorld } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
}

/**
 * Rivers traced downhill from the highlands to the sea, drawn as smooth curves
 * draped just over the terrain surface. Count and color come from the world's
 * terrain config (blue by default; e.g. lava-orange for a volcanic world).
 */
export function Rivers({ field, terrain }: Props) {
  const rivers = useMemo(
    () => generateRivers(field, terrain, terrain.rivers ?? 0),
    [field, terrain],
  )
  const color = terrain.riverColor ?? '#3f86b0'

  if (rivers.length === 0) return null
  return (
    <>
      {rivers.map((path, i) => (
        <RiverLine key={i} path={path} field={field} terrain={terrain} color={color} />
      ))}
    </>
  )
}

function RiverLine({
  path,
  field,
  terrain,
  color,
}: {
  path: { x: number; z: number }[]
  field: HeightField
  terrain: TerrainConfig
  color: string
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
          mapToWorld(p.x),
          elevationAt(field, terrain, p.x, p.z) + 0.25,
          mapToWorld(p.z),
        ),
      )
    }
    return out
  }, [path, field, terrain])

  return <Line points={points} color={color} lineWidth={2} transparent opacity={0.85} />
}
