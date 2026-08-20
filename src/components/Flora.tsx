import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { drapeTrees, scatterTrees } from '../engine/scatter'
import type { Ambient, TerrainConfig } from '../types'

/**
 * Vertex-shader wind: sway canopy vertices by a time uniform, phased per
 * instance (from its world position) so trees don't move in lockstep, and
 * scaled by local height so tops sway while trunks stay planted. GPU-side, so
 * it's free across the whole instanced forest.
 */
function useWindMaterial(uniforms: { uTime: { value: number } }) {
  return useMemo(() => {
    const onBeforeCompile = (shader: any) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.vertexShader =
        'uniform float uTime;\n' +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           float wPhase = instanceMatrix[3].x * 0.6 + instanceMatrix[3].z * 0.4;
           float wUp = max(position.y, 0.0);
           transformed.x += sin(uTime * 1.6 + wPhase) * 0.12 * wUp;
           transformed.z += cos(uTime * 1.3 + wPhase * 1.4) * 0.10 * wUp;`,
        )
    }
    return onBeforeCompile
  }, [uniforms])
}

interface Props {
  field: HeightField
  terrain: TerrainConfig
  ambient: Ambient
  /** Bumped when finer ground arrives, so the wood can settle onto it. */
  detailVersion?: number
}

/** Deterministic per-tree pseudo-random in [0,1) from its index. */
function rand(i: number, salt: number): number {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Instanced trees over the wooded terrain. Each tree is built from three
 * InstancedMeshes (trunk + two canopy tiers), so a fuller, less "blobby" tree
 * still costs only a handful of draw calls for the whole forest. Trees are
 * small, and vary per-instance in size, tint, and lean so the wood reads
 * organic rather than stamped.
 */
export function Flora({ field, terrain, ambient, detailVersion = 0 }: Props) {
  // Where the trees stand, decided once. The field is refined in place, so its
  // identity never changes and this never re-runs — which is the point: a
  // re-scatter would move every tree in the wood.
  const placed = useMemo(
    () => scatterTrees(field, terrain, ambient.trees ?? 0.6),
    [field, terrain, ambient.trees],
  )
  // How high they stand, redone when finer ground arrives beneath them.
  const trees = useMemo(
    () => drapeTrees(placed, field, terrain),
    [placed, field, terrain, detailVersion],
  )
  const conifer = ambient.treeKind === 'conifer'
  // Memoized, and it matters far more than it looks. This colour is a dependency
  // of the layout effect below, so a fresh `THREE.Color` on every render made
  // that effect re-run on every render — re-placing every tree in the wood and
  // re-sending three instance matrices and two colour buffers to the GPU. On the
  // Forest Song world that is 505 KB, and it was paid every time anything in the
  // scene changed, down to selecting a place on the map.
  const base = useMemo(
    () => new THREE.Color(ambient.treeColor ?? (conifer ? '#3f6f4a' : '#5a9455')),
    [ambient.treeColor, conifer],
  )

  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const lowRef = useRef<THREE.InstancedMesh>(null)
  const topRef = useRef<THREE.InstancedMesh>(null)

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  const wind = useWindMaterial(uniforms)
  useFrame((s) => {
    uniforms.uTime.value = s.clock.getElapsedTime()
  })

  useLayoutEffect(() => {
    const trunk = trunkRef.current
    const low = lowRef.current
    const top = topRef.current
    if (!trunk || !low || !top) return

    const dummy = new THREE.Object3D()
    const col = new THREE.Color()
    const hsl = { h: 0, s: 0, l: 0 }
    base.getHSL(hsl)

    const place = (
      mesh: THREE.InstancedMesh,
      i: number,
      t: (typeof trees)[number],
      s: number,
      localY: number,
      lightMul: number,
      colored: boolean,
    ) => {
      const lean = 0.14
      dummy.position.set(t.x, t.y + localY * s, t.z)
      dummy.rotation.set(
        (rand(i, 3) - 0.5) * lean,
        t.rot,
        (rand(i, 4) - 0.5) * lean,
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      if (colored) {
        // Per-tree hue/lightness jitter, darker low, lighter up, drier high.
        const l = THREE.MathUtils.clamp(
          hsl.l * lightMul + (rand(i, 1) - 0.5) * 0.1 - t.shade * 0.12,
          0.12,
          0.7,
        )
        const h = hsl.h + (rand(i, 2) - 0.5) * 0.04
        col.setHSL(h, hsl.s * (1 - t.shade * 0.25), l)
        mesh.setColorAt(i, col)
      }
    }

    trees.forEach((t, i) => {
      const s = t.scale * 0.6 // overall smaller than before
      place(trunk, i, t, s, 0.45, 1, false)
      if (conifer) {
        place(low, i, t, s, 1.6, 0.85, true)
        place(top, i, t, s, 2.35, 1.15, true)
      } else {
        place(low, i, t, s, 1.35, 0.9, true)
        place(top, i, t, s, 1.95, 1.18, true)
      }
    })

    for (const m of [trunk, low, top]) {
      m.instanceMatrix.needsUpdate = true
      if (m.instanceColor) m.instanceColor.needsUpdate = true
    }
  }, [trees, conifer, base])

  if (trees.length === 0) return null

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.9, 5]} />
        <meshStandardMaterial color="#5b4634" roughness={1} />
      </instancedMesh>

      {/* Lower / larger canopy tier */}
      <instancedMesh ref={lowRef} args={[undefined, undefined, trees.length]} castShadow>
        {conifer ? (
          <coneGeometry args={[0.72, 1.7, 8]} />
        ) : (
          <icosahedronGeometry args={[0.82, 2]} />
        )}
        <meshStandardMaterial roughness={0.9} onBeforeCompile={wind} />
      </instancedMesh>

      {/* Upper / smaller canopy tier */}
      <instancedMesh ref={topRef} args={[undefined, undefined, trees.length]} castShadow>
        {conifer ? (
          <coneGeometry args={[0.5, 1.3, 8]} />
        ) : (
          <icosahedronGeometry args={[0.58, 2]} />
        )}
        <meshStandardMaterial roughness={0.9} onBeforeCompile={wind} />
      </instancedMesh>
    </group>
  )
}
