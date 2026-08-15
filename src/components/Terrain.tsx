import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { FLAT_FIELD } from '../engine/heightmap'
import { buildTerrainGeometry } from '../engine/terrain'
import {
  planChanged,
  planLod,
  shouldReplan,
  visibleMapRect,
  type LodPlan,
  type MapRect,
  type ReplanState,
} from '../engine/lod'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  wireframe?: boolean
  /**
   * Whether the landmass casts shadows on itself.
   *
   * This is the single most expensive switch in the scene: the terrain is the
   * biggest mesh by far — 205k triangles on a square world, 526k on a wide one
   * — and casting means drawing all of it a second time into the shadow map
   * every frame. It is worth paying only when the sun is low enough for a ridge
   * to throw a shadow into the next valley. Wide and overhead worlds light from
   * about 81° above the horizon, where that shadow is a few pixels at best, so
   * they skip the pass and halve their triangle count.
   */
  selfShadow?: boolean
  /**
   * Told the map rectangle the camera is over, whenever that changes. A world
   * with finer elevation tiles uses it to fetch the few covering that ground.
   */
  onView?: (rect: MapRect) => void
  /**
   * Bumped when finer elevation has arrived under the current view. Only the
   * terrain watches this: the field itself keeps its identity, so the forests,
   * rivers and everything else memoized on it stay exactly where they are.
   */
  detailVersion?: number
}

/**
 * The landmass. Geometry is rebuilt only when the field or config identity
 * changes, so panning/zooming/selecting stay cheap. Worlds with `detail` set
 * get a tiled procedural bump map so light picks out fine surface relief up
 * close — no extra geometry, and the flat biome colours are untouched.
 */
export function Terrain({
  field,
  terrain,
  wireframe,
  selfShadow = true,
  onView,
  detailVersion = 0,
}: Props) {
  // A DEM world shows a flat placeholder sea until its heightmap image has
  // decoded. Tessellating THAT at full resolution built the biggest mesh in the
  // app twice on every load — a million triangles of dead flat plane, thrown
  // away a moment later. The placeholder is flat, so 32 segments draw it just
  // as well.
  const placeholder = field === FLAT_FIELD
  const fullResolution = placeholder ? 32 : (terrain.meshResolution ?? 320)
  const plan = useLodPlan(terrain, fullResolution, placeholder, field, onView)

  const geometry = useMemo(
    () =>
      buildTerrainGeometry(field, terrain, plan ? plan.baseResolution : fullResolution, {
        hole: plan?.rect,
      }),
    // Deliberately NOT `detailVersion`. The base draws only the ground OUTSIDE
    // the patch's hole, at a resolution far coarser than the tiles hold, so
    // finer data there changes nothing it could show — and rebuilding it costs
    // 135ms of blocked main thread it has no way to spend usefully.
    [field, terrain, fullResolution, plan],
  )
  const detail = useMemo(
    () =>
      plan
        ? buildTerrainGeometry(field, terrain, plan.baseResolution, {
            patch: { ...plan.rect, refine: plan.refine },
          })
        : null,
    // `detailVersion` belongs here even though `field` is unchanged: the field
    // is refined IN PLACE, so its identity deliberately stays put and this
    // counter is the only signal that the ground under the patch has improved.
    [field, terrain, plan, detailVersion],
  )
  const bump = useMemo(() => (terrain.detail ? makeBumpTexture() : null), [terrain.detail])

  // Both meshes must look identical — they are two halves of one surface.
  const material = (
    <meshStandardMaterial
      vertexColors
      wireframe={wireframe}
      roughness={0.95}
      metalness={0.0}
      flatShading={false}
      bumpMap={bump ?? undefined}
      bumpScale={bump ? 0.5 : 0}
    />
  )

  return (
    <>
      <mesh geometry={geometry} receiveShadow castShadow={selfShadow}>
        {material}
      </mesh>
      {detail && (
        <mesh geometry={detail} receiveShadow castShadow={selfShadow}>
          {material}
        </mesh>
      )}
    </>
  )
}

function useLodPlan(
  terrain: TerrainConfig,
  fullResolution: number,
  disabled: boolean,
  field: HeightField,
  onView?: (rect: MapRect) => void,
) {
  const { camera } = useThree()
  const [plan, setPlan] = useState<LodPlan | null>(null)
  const gate = useRef<ReplanState>({ still: 0, drifting: 0 })
  const last = useRef(new THREE.Vector3())
  const current = useRef<LodPlan | null>(null)
  current.current = plan
  const view = useRef<((rect: MapRect) => void) | undefined>(onView)
  view.current = onView

  // A new world starts over: its old rectangle means nothing on a new map.
  useEffect(() => {
    setPlan(null)
    gate.current = { still: 0, drifting: 0 }
  }, [terrain, fullResolution, field])

  useFrame((_, dt) => {
    if (disabled) return

    const moved = last.current.distanceTo(camera.position)
    last.current.copy(camera.position)
    // Nothing is rebuilt while the camera is moving; one rebuild lands shortly
    // after it stops. See `shouldReplan` for why, and for what an earlier
    // version got wrong about it.
    if (!shouldReplan(gate.current, moved, camera.position.length(), dt)) return

    const rect = visibleMapRect(camera, terrain)
    if (!rect) return
    // How much data actually covers THIS rectangle, which is not the same as
    // how much covers the map: detail tiles arrive a few at a time.
    const samples = field.samplesOver?.(rect) ?? field.samples
    const next = planLod(rect, terrain, fullResolution, samples)
    // Ask for finer elevation only once a patch is worth planning at all.
    // Framed on the whole world every tile is "in view", and requesting them
    // pulled the entire 24 MB set down on load — 92 requests before the reader
    // had touched anything. A plan exists only when the view is a small part of
    // the map, which is exactly when the tiles are worth having.
    if (next) view.current?.(rect)
    if (planChanged(current.current, next)) setPlan(next)
  })

  return disabled ? null : plan
}

/**
 * A seamless, tileable greyscale bump texture (periodic value-noise fBm). Used
 * as a fine detail bump so the terrain reads as textured stone/turf up close
 * rather than smooth plastic. Tileable so the world-space UVs never seam.
 */
function makeBumpTexture(size = 128): THREE.DataTexture {
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263) | 0
    h = (h ^ (h >>> 13)) * 1274126177
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295
  }
  const smoothstep = (t: number) => t * t * (3 - 2 * t)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  // Periodic value noise with an integer lattice period `per` (so it tiles).
  const vnoise = (x: number, y: number, per: number) => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = smoothstep(x - x0)
    const fy = smoothstep(y - y0)
    const X0 = ((x0 % per) + per) % per
    const Y0 = ((y0 % per) + per) % per
    const X1 = (X0 + 1) % per
    const Y1 = (Y0 + 1) % per
    const v00 = hash(X0, Y0)
    const v10 = hash(X1, Y0)
    const v01 = hash(X0, Y1)
    const v11 = hash(X1, Y1)
    return lerp(lerp(v00, v10, fx), lerp(v01, v11, fx), fy)
  }
  const data = new Uint8Array(size * size)
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const u = i / size
      const v = j / size
      let amp = 0.5
      let freq = 4
      let sum = 0
      let norm = 0
      for (let o = 0; o < 4; o++) {
        sum += amp * vnoise(u * freq, v * freq, freq)
        norm += amp
        amp *= 0.5
        freq *= 2
      }
      data[j * size + i] = Math.round((sum / norm) * 255)
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RedFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = true
  tex.needsUpdate = true
  return tex
}
