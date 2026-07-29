import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { scatterTrees } from '../engine/scatter'
import type { Ambient, TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  ambient: Ambient
}

/**
 * Instanced trees over the wooded terrain. Two InstancedMeshes (trunks +
 * canopies) share the same transforms, so thousands of trees cost only a
 * couple of draw calls. Canopies are tinted per-instance by elevation so
 * lowland woods read lusher than the tree line.
 */
export function Flora({ field, terrain, ambient }: Props) {
  const trees = useMemo(
    () => scatterTrees(field, terrain, ambient.trees ?? 0.6),
    [field, terrain, ambient.trees],
  )
  const conifer = ambient.treeKind === 'conifer'
  const base = new THREE.Color(ambient.treeColor ?? (conifer ? '#3f6b4a' : '#4f8a4a'))

  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const canopyRef = useRef<THREE.InstancedMesh>(null)

  useLayoutEffect(() => {
    const trunk = trunkRef.current
    const canopy = canopyRef.current
    if (!trunk || !canopy) return

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const dark = base.clone().multiplyScalar(0.7)
    const light = base.clone().lerp(new THREE.Color('#c7d98a'), 0.25)

    trees.forEach((t, i) => {
      // Trunk: a short tapered post rooted at the surface.
      const trunkH = 1.1 * t.scale
      dummy.position.set(t.x, t.y + trunkH / 2, t.z)
      dummy.rotation.set(0, t.rot, 0)
      dummy.scale.set(t.scale, t.scale, t.scale)
      dummy.updateMatrix()
      trunk.setMatrixAt(i, dummy.matrix)

      // Canopy: a cone (conifer) / rounded blob (broadleaf) above the trunk.
      const canopyH = (conifer ? 3.4 : 2.6) * t.scale
      dummy.position.set(t.x, t.y + trunkH + canopyH * 0.42, t.z)
      dummy.rotation.set(0, t.rot, 0)
      dummy.scale.set(t.scale, t.scale * (conifer ? 1.15 : 1), t.scale)
      dummy.updateMatrix()
      canopy.setMatrixAt(i, dummy.matrix)

      color.copy(light).lerp(dark, t.shade)
      canopy.setColorAt(i, color)
    })
    trunk.instanceMatrix.needsUpdate = true
    canopy.instanceMatrix.needsUpdate = true
    if (canopy.instanceColor) canopy.instanceColor.needsUpdate = true
  }, [trees, conifer, base])

  if (trees.length === 0) return null

  return (
    <group>
      <instancedMesh
        ref={trunkRef}
        args={[undefined, undefined, trees.length]}
        castShadow
      >
        <cylinderGeometry args={[0.12, 0.18, 1.1, 5]} />
        <meshStandardMaterial color="#5b4634" roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={canopyRef}
        args={[undefined, undefined, trees.length]}
        castShadow
      >
        {conifer ? (
          <coneGeometry args={[1.0, 3.4, 7]} />
        ) : (
          <icosahedronGeometry args={[1.4, 0]} />
        )}
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>
    </group>
  )
}
