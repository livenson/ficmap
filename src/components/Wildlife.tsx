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
  const inners = useRef<THREE.Group[]>([])
  const wings = useRef<{ l: THREE.Object3D; r: THREE.Object3D }[]>([])
  const tails = useMemo(() => ({ bird: makeTail(false), dragon: makeTail(true) }), [])

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

      // Bank into the turn and pitch gently with the bob.
      const inner = inners.current[i]
      if (inner) {
        inner.rotation.z = -c.dir * 0.32
        inner.rotation.x = Math.sin(t * 0.8 + c.phase) * 0.06
      }

      const w = wings.current[i]
      if (w) {
        // Flap-then-glide: amplitude waxes and wanes so birds soar between beats.
        const glide = 0.3 + 0.7 * Math.max(0, Math.sin(t * 0.5 + c.phase * 1.3))
        const amp = c.kind === 'dragon' ? 0.5 : 0.85
        const a = Math.sin(t * c.flap + c.phase) * amp * glide
        w.l.rotation.z = a
        w.r.rotation.z = -a
      }
    })
  })

  return (
    <>
      {creatures.map((c, i) => {
        const dragon = c.kind === 'dragon'
        return (
          <group
            key={i}
            ref={(el) => {
              if (el) groups.current[i] = el
            }}
            scale={c.size}
          >
            {/* Banked body frame */}
            <group
              ref={(el) => {
                if (el) inners.current[i] = el
              }}
            >
              {/* slim body */}
              <mesh rotation-x={Math.PI / 2}>
                <capsuleGeometry args={[0.1, dragon ? 1.6 : 0.7, 4, 8]} />
                <meshBasicMaterial color={c.color} />
              </mesh>
              {/* tail fan */}
              <mesh
                geometry={dragon ? tails.dragon : tails.bird}
                position={[0, 0, -(dragon ? 1.1 : 0.6)]}
              >
                <meshBasicMaterial color={c.color} side={THREE.DoubleSide} />
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
                <Wing color={c.color} dragon={dragon} side={1} />
              </group>
              <group
                ref={(el) => {
                  if (el) {
                    wings.current[i] = wings.current[i] ?? ({} as any)
                    wings.current[i].r = el
                  }
                }}
              >
                <Wing color={c.color} dragon={dragon} side={-1} />
              </group>
            </group>
          </group>
        )
      })}
    </>
  )
}

/** A swept, tapered wing extending along ±X and hinged at the body. */
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
    const sx = dragon ? 1.55 : 1
    const cF = (dragon ? 0.5 : 0.32) // chord at root, front
    const cB = (dragon ? 0.9 : 0.55) // chord at root, back
    const rf = [0, 0, cF]
    const rb = [0, 0, -cB]
    const mid = [side * 0.9 * sx, 0.04, -0.06]
    const tip = [side * 1.75 * sx, 0.08, -0.5]
    const g = new THREE.BufferGeometry()
    // Two triangles: a swept-back, tapered wing.
    g.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [...rf, ...mid, ...rb, ...rf, ...tip, ...mid],
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

/** A small fan tail (a triangle) pointing back along -Z. */
function makeTail(dragon: boolean): THREE.BufferGeometry {
  const w = dragon ? 0.55 : 0.32
  const l = dragon ? 0.9 : 0.5
  const g = new THREE.BufferGeometry()
  g.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([0, 0, 0, w, 0, -l, -w, 0, -l], 3),
  )
  g.computeVertexNormals()
  return g
}
