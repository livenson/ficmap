import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Line } from '@react-three/drei'
import type { HeightField } from '../engine/noise'
import { elevationAt, mapToWorld } from '../engine/terrain'
import type { Route, TerrainConfig } from '../types'

interface Props {
  routes: Route[]
  field: HeightField
  terrain: TerrainConfig
  /** Story-mode emphasis: ids in the set draw bold, others dim. null = normal. */
  highlight: Set<string> | null
}

const SAMPLES_PER_SEGMENT = 24

/**
 * Draws each route as a smooth curve draped over the terrain: waypoints are
 * splined, then every sampled point is lifted to the surface elevation so the
 * line hugs hills and valleys instead of cutting through them.
 */
export function Routes({ routes, field, terrain, highlight }: Props) {
  return (
    <>
      {routes.map((r) => {
        const hot = highlight?.has(r.id) ?? false
        const dim = highlight != null && !hot
        return (
          <RouteLine
            key={r.id}
            route={r}
            field={field}
            terrain={terrain}
            emphasis={hot ? 'hot' : dim ? 'dim' : 'normal'}
          />
        )
      })}
    </>
  )
}

function RouteLine({
  route,
  field,
  terrain,
  emphasis,
}: {
  route: Route
  field: HeightField
  terrain: TerrainConfig
  emphasis: 'hot' | 'dim' | 'normal'
}) {
  const points = useMemo(() => {
    if (route.points.length < 2) {
      return route.points.map(
        (p) =>
          new Vector3(
            mapToWorld(p.x),
            elevationAt(field, terrain, p.x, p.z) + 0.5,
            mapToWorld(p.z),
          ),
      )
    }
    // Spline through the flat map-space waypoints, then drape onto terrain.
    const flat = route.points.map((p) => new Vector3(p.x, 0, p.z))
    const curve = new CatmullRomCurve3(flat, false, 'catmullrom', 0.5)
    const n = (route.points.length - 1) * SAMPLES_PER_SEGMENT
    const out: Vector3[] = []
    for (let i = 0; i <= n; i++) {
      const p = curve.getPoint(i / n)
      out.push(
        new Vector3(
          mapToWorld(p.x),
          elevationAt(field, terrain, p.x, p.z) + 0.5,
          mapToWorld(p.z),
        ),
      )
    }
    return out
  }, [route, field, terrain])

  return (
    <Line
      points={points}
      color={route.color ?? '#ffcf6b'}
      lineWidth={emphasis === 'hot' ? 4 : 2.5}
      transparent
      opacity={emphasis === 'dim' ? 0.25 : 1}
      dashed={route.style === 'dashed'}
      dashSize={1.2}
      gapSize={0.8}
    />
  )
}
