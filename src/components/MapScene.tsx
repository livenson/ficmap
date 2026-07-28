import { useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { MapControls, PerspectiveCamera, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { makeHeightField } from '../engine/noise'
import { WORLD_SIZE } from '../engine/terrain'
import type { Story } from '../types'
import { Terrain } from './Terrain'
import { Water } from './Water'
import { Markers } from './Markers'
import { Routes } from './Routes'
import { Regions } from './Regions'

export type ViewMode = '2d' | '3d'

interface Props {
  story: Story
  mode: ViewMode
  selectedId: string | null
  onSelect: (id: string | null) => void
  showLabels: boolean
}

export function MapScene({
  story,
  mode,
  selectedId,
  onSelect,
  showLabels,
}: Props) {
  // Height field is the single source of truth for terrain, markers & routes.
  const field = useMemo(() => makeHeightField(story.terrain), [story.terrain])

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={[mode === '2d' ? '#0d1b26' : '#9fc2d6']} />
      {mode === '3d' && <fog attach="fog" args={['#9fc2d6', WORLD_SIZE * 0.8, WORLD_SIZE * 2.2]} />}

      <Cameras mode={mode} />

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

      {story.routes && story.routes.length > 0 && (
        <Routes routes={story.routes} field={field} terrain={story.terrain} />
      )}
      {story.regions && story.regions.length > 0 && (
        <Regions regions={story.regions} field={field} terrain={story.terrain} />
      )}
      {story.markers && story.markers.length > 0 && (
        <Markers
          markers={story.markers}
          field={field}
          terrain={story.terrain}
          selectedId={selectedId}
          onSelect={onSelect}
          showLabels={showLabels}
        />
      )}
    </Canvas>
  )
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
function Cameras({ mode }: { mode: ViewMode }) {
  const controls = useRef<any>(null)
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
        ref={controls}
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
