import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MapControls, PerspectiveCamera, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { makeHeightField } from '../engine/noise'
import { WORLD_SIZE, elevationAt, mapToWorld } from '../engine/terrain'
import type { CameraFocus, Story } from '../types'
import { resolveHighlight, resolveVisibility, isVisible } from '../engine/story'
import { Terrain } from './Terrain'
import { Water } from './Water'
import { Markers } from './Markers'
import { Routes } from './Routes'
import { Regions } from './Regions'
import { Flora } from './Flora'
import { Wildlife } from './Wildlife'

export type ViewMode = '2d' | '3d'

interface Props {
  story: Story
  mode: ViewMode
  selectedId: string | null
  onSelect: (id: string | null) => void
  showLabels: boolean
  /** Active chapter index when in story mode, else null. */
  chapterIndex: number | null
}

export function MapScene({
  story,
  mode,
  selectedId,
  onSelect,
  showLabels,
  chapterIndex,
}: Props) {
  // Height field is the single source of truth for terrain, markers & routes.
  const field = useMemo(() => makeHeightField(story.terrain), [story.terrain])
  const controls = useRef<any>(null)

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

  const markers = (story.markers ?? []).filter((m) =>
    isVisible(visibility.markers, m.id),
  )
  const routes = (story.routes ?? []).filter((r) =>
    isVisible(visibility.routes, r.id),
  )
  const regions = (story.regions ?? []).filter((r) =>
    isVisible(visibility.regions, r.id),
  )

  // Resolve the current chapter's camera focus into a world-space goal.
  const focus = storyMode ? story.chapters?.[chapterIndex]?.focus : undefined
  const goal = useMemo(
    () => resolveGoal(focus, story, field, mode),
    [focus, story, field, mode, chapterIndex],
  )

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={[mode === '2d' ? '#0d1b26' : '#9fc2d6']} />
      {mode === '3d' && <fog attach="fog" args={['#9fc2d6', WORLD_SIZE * 0.8, WORLD_SIZE * 2.2]} />}

      <Cameras mode={mode} controlsRef={controls} />
      <CameraDirector goal={goal} controlsRef={controls} />

      {/* Lighting */}
      <ambientLight intensity={mode === '2d' ? 0.9 : 0.55} />
      <directionalLight
        position={[40, 80, 20]}
        intensity={mode === '2d' ? 0.7 : 1.15}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-WORLD_SIZE}
        shadow-camera-right={WORLD_SIZE}
        shadow-camera-top={WORLD_SIZE}
        shadow-camera-bottom={-WORLD_SIZE}
        shadow-camera-far={300}
      />
      {mode === '3d' && (
        <Sky sunPosition={[40, 30, 20]} turbidity={6} rayleigh={1.4} />
      )}

      <Terrain field={field} terrain={story.terrain} />
      <Water terrain={story.terrain} />

      {/* Ambient life enriches the 3D view; omitted in the flat 2D map. */}
      {mode === '3d' && (
        <>
          <Flora field={field} terrain={story.terrain} ambient={story.ambient ?? {}} />
          <Wildlife ambient={story.ambient ?? {}} />
        </>
      )}

      {routes.length > 0 && (
        <Routes
          routes={routes}
          field={field}
          terrain={story.terrain}
          highlight={storyMode ? highlight.routes : null}
        />
      )}
      {regions.length > 0 && (
        <Regions regions={regions} field={field} terrain={story.terrain} />
      )}
      {markers.length > 0 && (
        <Markers
          markers={markers}
          field={field}
          terrain={story.terrain}
          selectedId={selectedId}
          onSelect={onSelect}
          showLabels={showLabels}
          highlight={storyMode ? highlight.markers : null}
        />
      )}
    </Canvas>
  )
}

/** A resolved camera destination: where to sit and what to look at. */
interface CameraGoal {
  key: string
  pos: THREE.Vector3
  target: THREE.Vector3
}

function resolveGoal(
  focus: CameraFocus | undefined,
  story: Story,
  field: ReturnType<typeof makeHeightField>,
  mode: ViewMode,
): CameraGoal | null {
  if (!focus) return null

  // Resolve the focus point in map space (from a marker or an explicit point).
  let mx: number | undefined
  let mz: number | undefined
  if (focus.marker) {
    const m = story.markers?.find((mk) => mk.id === focus.marker)
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

  const tx = mapToWorld(mx)
  const tz = mapToWorld(mz)
  const ty = elevationAt(field, story.terrain, mx, mz)
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

  const key = `${story.id}:${focus.marker ?? ''}:${mx},${mz}:${mode}`
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
}: {
  mode: ViewMode
  controlsRef: React.MutableRefObject<any>
}) {
  const is3d = mode === '3d'

  return (
    <>
      <PerspectiveCamera
        key={mode}
        makeDefault
        fov={is3d ? 50 : 28}
        // A hair of Z offset keeps the top-down view off the exact singularity.
        position={is3d ? [0, 55, 78] : [0, 235, 0.1]}
        near={0.1}
        far={2000}
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
        maxDistance={is3d ? 220 : 420}
        // Tilt range in 3D; pinned just off straight-down in 2D.
        minPolarAngle={is3d ? 0.15 : 0.001}
        maxPolarAngle={is3d ? THREE.MathUtils.degToRad(78) : 0.001}
      />
    </>
  )
}
