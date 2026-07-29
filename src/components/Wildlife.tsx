import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_SIZE } from '../engine/terrain'
import type { Ambient } from '../types'

interface Props {
  ambient: Ambient
}

interface Creature {
  kind: 'bird' | 'dragon'
  radius: number
  height: number
  speed: number
  phase: number
  dir: 1 | -1
  size: number
  flap: number
  color: string
}

const GOLDEN = 2.399963 // spread creatures around the sky evenly

/**
 * Ambient flying creatures that circle slowly over the world — small dark
 * birds, and (for fierier worlds) larger dragons. Each is a lightweight
 * silhouette with flapping wings, animated from the render clock so it stays
 * deterministic. 3D-only; they read as life over the terrain, most visible as
 * you tilt and zoom.
 */
export function Wildlife({ ambient }: Props) {
  const birds = ambient.birds ?? 6
  const dragons = ambient.dragons ?? 0

  const creatures = useMemo<Creature[]>(() => {
    const list: Creature[] = []
    for (let i = 0; i < birds; i++) {
      list.push({
        kind: 'bird',
        radius: WORLD_SIZE * (0.18 + (i % 4) * 0.09),
        height: 26 + (i % 5) * 5,
        speed: 0.22 + (i % 3) * 0.06,
        phase: i * GOLDEN,
        dir: i % 2 === 0 ? 1 : -1,
        size: 0.9 + (i % 3) * 0.25,
        flap: 5 + (i % 3),
        color: '#1c242c',
      })
    }
    for (let i = 0; i < dragons; i++) {
      list.push({
        kind: 'dragon',
        radius: WORLD_SIZE * (0.14 + (i % 2) * 0.12),
        height: 34 + i * 6,
        speed: 0.12 + (i % 2) * 0.04,
        phase: i * GOLDEN + 1.2,
        dir: i % 2 === 0 ? -1 : 1,
        size: 3.2 + (i % 2) * 0.8,
        flap: 1.8 + i * 0.3,
        color: '#7a2016',
      })
    }
    return list
  }, [birds, dragons])

  const groups = useRef<THREE.Group[]>([])
  const wings = useRef<{ l: THREE.Object3D; r: THREE.Object3D }[]>([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    creatures.forEach((c, i) => {
      const g = groups.current[i]
      if (!g) return
      const theta = t * c.speed * c.dir + c.phase
      const px = Math.cos(theta) * c.radius
      const pz = Math.sin(theta) * c.radius
      // Gentle bob so flight feels alive.
      const py = c.height + Math.sin(t * 0.8 + c.phase) * 2
      g.position.set(px, py, pz)
      // Face along the direction of travel (model forward = +Z).
      const vx = -Math.sin(theta) * c.dir
      const vz = Math.cos(theta) * c.dir
      g.rotation.y = Math.atan2(vx, vz)

      const w = wings.current[i]
      if (w) {
        const a = Math.sin(t * c.flap + c.phase) * 0.6
        w.l.rotation.z = a
        w.r.rotation.z = -a
      }
    })
  })

  return (
    <>
      {creatures.map((c, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) groups.current[i] = el
          }}
          scale={c.size}
        >
          {/* body */}
          <mesh>
            <capsuleGeometry args={[0.12, c.kind === 'dragon' ? 1.4 : 0.5, 3, 6]} />
            <meshBasicMaterial color={c.color} />
          </mesh>
          {/* wings */}
          <group
            ref={(el) => {
              if (el) {
                wings.current[i] = wings.current[i] ?? ({} as any)
                wings.current[i].l = el
              }
            }}
          >
            <Wing color={c.color} dragon={c.kind === 'dragon'} side={1} />
          </group>
          <group
            ref={(el) => {
              if (el) {
                wings.current[i] = wings.current[i] ?? ({} as any)
                wings.current[i].r = el
              }
            }}
          >
            <Wing color={c.color} dragon={c.kind === 'dragon'} side={-1} />
          </group>
        </group>
      ))}
    </>
  )
}

/** A single triangular wing extending along ±X, hinged at the body. */
function Wing({
  color,
  dragon,
  side,
}: {
  color: string
  dragon: boolean
  side: 1 | -1
}) {
  const geo = useMemo(() => {
    const span = dragon ? 2.6 : 1.7
    const chord = dragon ? 1.1 : 0.7
    const g = new THREE.BufferGeometry()
    // Triangle: front-of-body, back-of-body, wingtip.
    g.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [0, 0, chord, 0, 0, -chord, side * span, 0, dragon ? -0.4 : 0],
        3,
      ),
    )
    g.computeVertexNormals()
    return g
  }, [dragon, side])

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}
