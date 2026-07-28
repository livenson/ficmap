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
}

const SAMPLES_PER_SEGMENT = 24

/**
 * Draws each route as a smooth curve draped over the terrain: waypoints are
 * splined, then every sampled point is lifted to the surface elevation so the
 * line hugs hills and valleys instead of cutting through them.
 */
export function Routes({ routes, field, terrain }: Props) {
  return (
    <>
      {routes.map((r) => (
        <RouteLine key={r.id} route={r} field={field} terrain={terrain} />
      ))}
    </>
  )
}

function RouteLine({
  route,
  field,
  terrain,
}: {
  route: Route
  field: HeightField
  terrain: TerrainConfig
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
      lineWidth={2.5}
      dashed={route.style === 'dashed'}
      dashSize={1.2}
      gapSize={0.8}
    />
  )
}
