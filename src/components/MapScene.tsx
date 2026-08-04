import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MapControls, PerspectiveCamera, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { makeHeightField, type HeightField } from '../engine/noise'
import { FLAT_FIELD, loadImageHeightField } from '../engine/heightmap'
import type { TerrainConfig } from '../types'
import { WORLD_SIZE, aspectOf, elevationAt, mapToWorld, mapToWorldX } from '../engine/terrain'
import type { CameraFocus, Marker, Story } from '../types'
import {
  resolveHighlight,
  resolveVisibility,
  isVisible,
  flattenChapters,
} from '../engine/story'
import type { ResolvedLevel } from '../engine/levels'
import { Terrain } from './Terrain'
import { Water } from './Water'
import { Markers } from './Markers'
import { Routes } from './Routes'
import { Regions } from './Regions'
import { Flora } from './Flora'
import { Wildlife } from './Wildlife'
import { Rivers } from './Rivers'
import { Elements } from './Elements'
import { Weather } from './Weather'
import { Mosquitoes } from './Mosquitoes'
import { Ripples } from './Ripples'
import { SeaLife } from './SeaLife'
import { Postprocess } from './Postprocess'

export type ViewMode = '2d' | '3d'

interface Props {
  story: Story
  /** The map level currently displayed (surface or a deeper floor). */
  level: ResolvedLevel
  mode: ViewMode
  selectedId: string | null
  onSelect: (id: string | null) => void
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  layers: { labels: boolean; nature: boolean; rivers: boolean; artifacts: boolean }
  /** Active chapter index when in story mode, else null. */
  chapterIndex: number | null
}

export function MapScene({
  story,
  level,
  mode,
  selectedId,
  onSelect,
  selectedElementId,
  onSelectElement,
  layers,
  chapterIndex,
}: Props) {
  const terrain = level.terrain
  // Height field is the single source of truth for terrain, markers & routes.
  // Procedural terrains resolve synchronously; heightmap (DEM) terrains load
  // their image and swap in once ready (flat sea until then).
  const field = useHeightField(terrain)
  const controls = useRef<any>(null)
  // Underworld lighting: 'dark' is warm hellfire (Põrgu, magma caverns), while
  // 'cavern' is a cool, phosphorescent glow (an underground sea, ice caves).
  const dark = terrain.sky === 'dark'
  const cavern = terrain.sky === 'cavern'
  const underground = dark || cavern
  // World aspect: >1 widens the world in X (e.g. an equirectangular map).
  const aspect = aspectOf(terrain)

  // Story-mode state: what's visible, what's emphasized, where to fly.
  const visibility = useMemo(
    () => resolveVisibility(story, chapterIndex),
    [story, chapterIndex],
  )
  const highlight = useMemo(
    () => resolveHighlight(story, chapterIndex),
    [story, chapterIndex],
  )
  const storyMode = chapterIndex != null

  const markers = level.markers.filter((m) => isVisible(visibility.markers, m.id))
  const routes = level.routes.filter((r) => isVisible(visibility.routes, r.id))
  const regions = level.regions.filter((r) => isVisible(visibility.regions, r.id))

  // Resolve the current chapter's camera focus into a world-space goal.
  const focus = storyMode
    ? flattenChapters(story)[chapterIndex!]?.chapter.focus
    : undefined
  const goal = useMemo(
    () => resolveGoal(focus, level, field, mode),
    [focus, level, field, mode, chapterIndex],
  )

  const rainy = !underground && !!level.ambient.rain
  const bg = underground
    ? cavern
      ? '#07161d'
      : '#160608'
    : mode === '2d'
      ? '#0d1b26'
      : rainy
        ? '#7c8892'
        : '#9fc2d6'
  const fogColor = cavern
    ? '#0c2029'
    : dark
      ? '#2a0c0a'
      : rainy
        ? '#7c8892'
        : '#9fc2d6'

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() => {
        onSelect(null)
        onSelectElement(null)
      }}
    >
      <color attach="background" args={[bg]} />
      {mode === '3d' && (
        <fog attach="fog" args={[fogColor, WORLD_SIZE * 0.8 * aspect, WORLD_SIZE * 2.2 * aspect]} />
      )}

      <Cameras mode={mode} controlsRef={controls} aspect={aspect} />
      <CameraDirector goal={goal} controlsRef={controls} />

      {/* Lighting */}
      <ambientLight
        intensity={underground ? 0.6 : rainy ? 0.7 : mode === '2d' ? 0.9 : 0.55}
        color={cavern ? '#9ec2d4' : dark ? '#ff8a66' : rainy ? '#c2ccd4' : '#ffffff'}
      />
      <directionalLight
        // A wide world map wants a near-overhead sun so continents don't throw
        // long, blocky shadows across the ocean; a square world keeps the low,
        // relief-revealing angle.
        position={aspect > 1.5 ? [20, 220, 30] : [40, 80, 20]}
        intensity={underground ? 0.5 : rainy ? 0.5 : mode === '2d' ? 0.7 : 1.15}
        color={cavern ? '#cfe6f0' : dark ? '#ff5a3c' : rainy ? '#c8d0d6' : '#ffffff'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-WORLD_SIZE * aspect}
        shadow-camera-right={WORLD_SIZE * aspect}
        shadow-camera-top={WORLD_SIZE}
        shadow-camera-bottom={-WORLD_SIZE}
        shadow-camera-far={300}
        // The wider the world, the coarser each shadow texel — bias along the
        // normal so flat water/plains don't self-shadow into dark blotches.
        shadow-normalBias={1.2 * aspect}
        shadow-bias={-0.0004}
      />
      {mode === '3d' && !underground && !rainy && (
        <Sky sunPosition={[40, 30, 20]} turbidity={6} rayleigh={1.4} />
      )}

      <Terrain field={field} terrain={terrain} />
      <Water terrain={terrain} />
      {layers.rivers && <Rivers field={field} terrain={terrain} />}

      {/* Ambient life enriches the 3D view; omitted in the flat 2D map and
          when the "Trees & wildlife" layer is switched off for a clean view. */}
      {mode === '3d' && layers.nature && (
        <>
          <Flora field={field} terrain={terrain} ambient={level.ambient} />
          <Wildlife ambient={level.ambient} aspect={aspect} />
          {level.ambient.mosquitoes ? (
            <Mosquitoes swarms={level.ambient.mosquitoes} field={field} terrain={terrain} />
          ) : null}
          {level.ambient.rain ? <Weather /> : null}
          {level.ambient.rain ? <Ripples field={field} terrain={terrain} /> : null}
          {level.ambient.fish ? (
            <SeaLife field={field} terrain={terrain} fish={level.ambient.fish} />
          ) : null}
        </>
      )}

      {routes.length > 0 && (
        <Routes
          routes={routes}
          field={field}
          terrain={terrain}
          highlight={storyMode ? highlight.routes : null}
        />
      )}
      {layers.labels && regions.length > 0 && (
        <Regions regions={regions} field={field} terrain={terrain} />
      )}
      {markers.length > 0 && (
        <Markers
          markers={markers}
          field={field}
          terrain={terrain}
          selectedId={selectedId}
          onSelect={onSelect}
          showLabels={layers.labels}
          highlight={storyMode ? highlight.markers : null}
          controlsRef={controls}
        />
      )}
      {layers.artifacts && (
        <Elements
          story={story}
          field={field}
          terrain={terrain}
          activeLevelId={level.id}
          chapterIndex={chapterIndex}
          selectedElementId={selectedElementId}
          onSelect={onSelectElement}
        />
      )}

      <Postprocess />
    </Canvas>
  )
}

/**
 * Resolve a terrain's height field. Procedural terrains build synchronously;
 * heightmap terrains load the image asynchronously and swap in when ready.
 */
function useHeightField(terrain: TerrainConfig): HeightField {
  const [imgField, setImgField] = useState<HeightField | null>(null)
  const url = terrain.heightmap

  useEffect(() => {
    if (!url) {
      setImgField(null)
      return
    }
    let alive = true
    setImgField(null)
    loadImageHeightField(url).then((f) => {
      if (alive) setImgField(f)
    })
    return () => {
      alive = false
    }
  }, [url])

  return useMemo(() => {
    if (url) return imgField ?? FLAT_FIELD
    return makeHeightField(terrain)
  }, [terrain, url, imgField])
}

/** A resolved camera destination: where to sit and what to look at. */
interface CameraGoal {
  key: string
  pos: THREE.Vector3
  target: THREE.Vector3
}

function resolveGoal(
  focus: CameraFocus | undefined,
  level: ResolvedLevel,
  field: ReturnType<typeof makeHeightField>,
  mode: ViewMode,
): CameraGoal | null {
  if (!focus) return null

  // Resolve the focus point in map space (from a marker or an explicit point).
  let mx: number | undefined
  let mz: number | undefined
  if (focus.marker) {
    const m = level.markers.find((mk: Marker) => mk.id === focus.marker)
    if (m) {
      mx = m.at.x
      mz = m.at.z
    }
  }
  if (mx == null && focus.at) {
    mx = focus.at.x
    mz = focus.at.z
  }
  if (mx == null || mz == null) return null

  const tx = mapToWorldX(mx, level.terrain)
  const tz = mapToWorld(mz)
  const ty = elevationAt(field, level.terrain, mx, mz)
  const target = new THREE.Vector3(tx, ty, tz)
  const distance = focus.distance ?? 44

  let pos: THREE.Vector3
  if (mode === '3d') {
    const pitch = THREE.MathUtils.degToRad(focus.pitch ?? 42)
    const heading = THREE.MathUtils.degToRad(focus.heading ?? 0)
    const horiz = distance * Math.cos(pitch)
    const vert = distance * Math.sin(pitch)
    pos = new THREE.Vector3(
      tx + horiz * Math.sin(heading),
      ty + vert,
      tz + horiz * Math.cos(heading),
    )
  } else {
    // Top-down: sit above the target, a touch of Z to stay off the singularity.
    pos = new THREE.Vector3(tx, ty + distance * 2.4, tz + 0.01)
  }

  const key = `${level.id}:${focus.marker ?? ''}:${mx},${mz}:${mode}`
  return { key, pos, target }
}

/**
 * Eases the camera toward `goal` whenever it changes (i.e. on chapter turns),
 * then hands control back to the user. Setting position/target directly and
 * calling controls.update() keeps OrbitControls' internal state consistent.
 */
function CameraDirector({
  goal,
  controlsRef,
}: {
  goal: CameraGoal | null
  controlsRef: React.MutableRefObject<any>
}) {
  const { camera } = useThree()
  const anim = useRef<{
    sp: THREE.Vector3
    st: THREE.Vector3
    gp: THREE.Vector3
    gt: THREE.Vector3
    t: number
    dur: number
  } | null>(null)
  const lastKey = useRef<string | null>(null)

  useFrame((_, dt) => {
    const controls = controlsRef.current
    if (!controls) return

    if (goal && goal.key !== lastKey.current) {
      lastKey.current = goal.key
      anim.current = {
        sp: camera.position.clone(),
        st: controls.target.clone(),
        gp: goal.pos,
        gt: goal.target,
        t: 0,
        dur: 1.25,
      }
    }

    const a = anim.current
    if (!a) return
    controls.enabled = false
    a.t = Math.min(1, a.t + dt / a.dur)
    const e = easeInOut(a.t)
    camera.position.lerpVectors(a.sp, a.gp, e)
    controls.target.lerpVectors(a.st, a.gt, e)
    controls.update()
    if (a.t >= 1) {
      controls.enabled = true
      anim.current = null
    }
  })

  return null
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * A single perspective camera drives both views; `key={mode}` remounts the
 * camera + controls so each mode starts from a clean framing:
 *  - 3D: tilted view, free orbit within a comfortable pitch range.
 *  - 2D: locked near-top-down with a narrow FOV, so it reads as a flat map
 *        while the terrain relief still gives subtle, legible shading.
 * Both support Google-Maps-style scroll-to-zoom and drag-to-pan. Using one
 * perspective camera avoids the orientation singularity a straight-down
 * orthographic camera hits when its view axis is parallel to its up vector.
 */
function Cameras({
  mode,
  controlsRef,
  aspect = 1,
}: {
  mode: ViewMode
  controlsRef: React.MutableRefObject<any>
  aspect?: number
}) {
  const is3d = mode === '3d'
  // A wider-than-square world needs the camera pulled back to frame its width,
  // and the zoom-out limit raised to match.
  const w = Math.max(1, aspect)

  return (
    <>
      <PerspectiveCamera
        key={mode}
        makeDefault
        fov={is3d ? 50 : 28}
        // A hair of Z offset keeps the top-down view off the exact singularity.
        position={is3d ? [0, 55 * w, 78 * w] : [0, 235 * w, 0.1]}
        // A larger near plane in the far top-down view restores depth precision,
        // so the water plane doesn't z-fight the near-flat ocean floor into a
        // shimmering band. Kept below the 2D min-zoom distance (40).
        near={is3d ? 0.1 : 8}
        far={2000 * w}
      />
      <MapControls
        key={mode}
        ref={controlsRef}
        makeDefault
        target={[0, 0, 0]}
        enableRotate={is3d}
        enableDamping
        dampingFactor={0.08}
        screenSpacePanning={false}
        minDistance={is3d ? 12 : 40}
        maxDistance={(is3d ? 220 : 420) * w}
        // Tilt range in 3D; pinned just off straight-down in 2D.
        minPolarAngle={is3d ? 0.15 : 0.001}
        maxPolarAngle={is3d ? THREE.MathUtils.degToRad(78) : 0.001}
      />
    </>
  )
}
