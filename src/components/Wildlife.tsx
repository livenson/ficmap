import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WORLD_SIZE, WORLD_HALF } from '../engine/terrain'
import type { Ambient } from '../types'

interface Props {
  ambient: Ambient
  /** World aspect: spreads the flocks across a wider-than-square world. */
  aspect?: number
  /** In a sky realm, the "birds" are rendered as glowing angels instead. */
  heaven?: boolean
}

type CreatureType = 'bird' | 'dragon' | 'angel' | 'owl'

interface Creature {
  type: CreatureType
  radius: number
  /** X center the creature circles around (spread across the world width). */
  cx: number
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
 * Ambient flying creatures that circle slowly over the world:
 *  - small dark birds over ordinary lands,
 *  - glowing angels over a sky realm (the heaven floors),
 *  - and fiery, membrane-winged dragons over the fierier worlds (Põrgu, the
 *    Sunless Deep).
 * Each is a lightweight model with flapping wings, animated from the render
 * clock so it stays deterministic. 3D-only; they read as life over the terrain,
 * most visible as you tilt and zoom.
 */
export function Wildlife({ ambient, aspect = 1, heaven = false }: Props) {
  const birds = ambient.birds ?? 6
  const dragons = ambient.dragons ?? 0
  const owls = !heaven && ambient.birdKind === 'owl'
  // Tawny by default, with the odd snowy owl (a Hedwig) among the flock.
  const owlColor = (i: number) => (i % 3 === 0 ? '#e7e2d6' : i % 3 === 1 ? '#6f5c46' : '#4f4436')

  const creatures = useMemo<Creature[]>(() => {
    const list: Creature[] = []
    // Spread flock centers across the world width so a wide (non-square) world
    // has creatures everywhere, not only over its middle.
    const spread = (i: number) =>
      aspect <= 1 ? 0 : (((i * 0.61803) % 1) * 2 - 1) * WORLD_HALF * (aspect - 0.3)
    for (let i = 0; i < birds; i++) {
      list.push({
        type: heaven ? 'angel' : owls ? 'owl' : 'bird',
        radius: WORLD_SIZE * (0.18 + (i % 4) * 0.09),
        cx: spread(i),
        // Owls beat lower and slower over the land, like post owls on a round.
        height: owls ? 20 + (i % 5) * 4 : 26 + (i % 5) * 5,
        speed: heaven ? 0.14 + (i % 3) * 0.04 : owls ? 0.16 + (i % 3) * 0.04 : 0.22 + (i % 3) * 0.06,
        phase: i * GOLDEN,
        dir: i % 2 === 0 ? 1 : -1,
        size: heaven ? 1.5 + (i % 3) * 0.3 : owls ? 1.15 + (i % 3) * 0.2 : 0.9 + (i % 3) * 0.25,
        flap: heaven ? 3 + (i % 2) : owls ? 4 + (i % 2) : 5 + (i % 3),
        color: heaven ? '#fff6e2' : owls ? owlColor(i) : '#1c242c',
      })
    }
    for (let i = 0; i < dragons; i++) {
      list.push({
        type: 'dragon',
        radius: WORLD_SIZE * (0.14 + (i % 2) * 0.12),
        cx: spread(i + 3),
        // Fly lower than the birds so they sweep in view over the crags.
        height: 22 + i * 6,
        speed: 0.12 + (i % 2) * 0.04,
        phase: i * GOLDEN + 1.2,
        dir: i % 2 === 0 ? -1 : 1,
        size: 3.4 + (i % 2) * 0.9,
        flap: 1.6 + i * 0.25,
        color: '#c2431c',
      })
    }
    return list
  }, [birds, dragons, aspect, heaven, owls])

  const groups = useRef<THREE.Group[]>([])
  const inners = useRef<THREE.Group[]>([])
  const wings = useRef<{ l: THREE.Object3D; r: THREE.Object3D }[]>([])
  const membrane = useMemo(makeMembraneTexture, [])
  const scales = useMemo(makeScaleTexture, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    creatures.forEach((c, i) => {
      const g = groups.current[i]
      if (!g) return
      const theta = t * c.speed * c.dir + c.phase
      const px = c.cx + Math.cos(theta) * c.radius
      const pz = Math.sin(theta) * c.radius
      // Gentle bob so flight feels alive.
      const py = c.height + Math.sin(t * 0.8 + c.phase) * 2
      g.position.set(px, py, pz)
      // Face along the direction of travel (model forward = +Z).
      const vx = -Math.sin(theta) * c.dir
      const vz = Math.cos(theta) * c.dir
      g.rotation.y = Math.atan2(vx, vz)

      // Bank into the turn and pitch gently with the bob. Angels stay upright.
      const inner = inners.current[i]
      if (inner) {
        inner.rotation.z = c.type === 'angel' ? 0 : -c.dir * 0.32
        inner.rotation.x = Math.sin(t * 0.8 + c.phase) * 0.06
      }

      const w = wings.current[i]
      if (w) {
        // Flap-then-glide: amplitude waxes and wanes so fliers soar between beats.
        const glide = 0.3 + 0.7 * Math.max(0, Math.sin(t * 0.5 + c.phase * 1.3))
        const amp =
          c.type === 'dragon' ? 0.5 : c.type === 'angel' ? 0.4 : c.type === 'owl' ? 0.6 : 0.85
        const a = Math.sin(t * c.flap + c.phase) * amp * glide
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
          {/* Banked body frame */}
          <group
            ref={(el) => {
              if (el) inners.current[i] = el
            }}
          >
            <Body type={c.type} color={c.color} scales={scales} />
            {/* left + right wings, hinged at the body */}
            <group
              ref={(el) => {
                if (el) {
                  wings.current[i] = wings.current[i] ?? ({} as any)
                  wings.current[i].l = el
                }
              }}
            >
              <Wing type={c.type} color={c.color} side={1} membrane={membrane} />
            </group>
            <group
              ref={(el) => {
                if (el) {
                  wings.current[i] = wings.current[i] ?? ({} as any)
                  wings.current[i].r = el
                }
              }}
            >
              <Wing type={c.type} color={c.color} side={-1} membrane={membrane} />
            </group>
            {c.type === 'dragon' && <DragonFire phase={c.phase} />}
          </group>
        </group>
      ))}
    </>
  )
}

/**
 * A jet of fire from a dragon's maw. A stream of additive, colour-shifting
 * puffs that spawn at the snout (local +Z), widen and cool (white → orange →
 * red) as they travel forward, and fade out — gated by a slow "breath" so the
 * dragon puffs in rhythmic bursts rather than a constant flame. Rendered inside
 * the dragon's banked body frame, so the fire follows the head as it flies.
 */
function DragonFire({ phase }: { phase: number }) {
  const COUNT = 16
  const parts = useRef<THREE.Mesh[]>([])
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        off: i / COUNT,
        spread: 0.4 + (i % 5) * 0.12,
        ang: i * GOLDEN,
        sp: 0.85 + (i % 3) * 0.16,
      })),
    [],
  )
  const cHot = useMemo(() => new THREE.Color('#fff3c8'), [])
  const cMid = useMemo(() => new THREE.Color('#ff8a2a'), [])
  const cEnd = useMemo(() => new THREE.Color('#c0301a'), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Breath: always a little flame at the maw, waxing to a strong gout.
    const breath = 0.35 + 0.65 * Math.max(0, Math.sin(t * 0.8 + phase))
    for (let i = 0; i < COUNT; i++) {
      const m = parts.current[i]
      if (!m) continue
      const s = seeds[i]
      const life = (t * s.sp + s.off + phase * 0.3) % 1 // 0 at maw → 1 downstream
      const r = life * s.spread
      m.position.set(
        Math.cos(s.ang) * r,
        0.06 + Math.sin(s.ang) * r * 0.6 + life * 0.12,
        1.9 + life * 1.9,
      )
      const bulge = Math.sin(life * Math.PI)
      const gust = 0.7 + 0.3 * Math.sin(t * 9 + i)
      m.scale.setScalar(Math.max(0.001, (0.13 + bulge * 0.42) * gust))
      if (life < 0.5) tmp.copy(cHot).lerp(cMid, life / 0.5)
      else tmp.copy(cMid).lerp(cEnd, (life - 0.5) / 0.5)
      const mat = m.material as THREE.MeshBasicMaterial
      mat.color.copy(tmp)
      mat.opacity = (1 - life) * breath * gust * 0.9
    }
  })

  return (
    <group>
      {seeds.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) parts.current[i] = el
          }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color="#ffcf6b"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

/** The body, head, tail (and, for angels, a halo) — varies by creature type. */
function Body({
  type,
  color,
  scales,
}: {
  type: CreatureType
  color: string
  scales: THREE.Texture
}) {
  const tails = useMemo(
    () => ({ bird: makeTail(0.32, 0.5), dragon: makeTail(0.55, 0.9), owl: makeTail(0.34, 0.36) }),
    [],
  )

  if (type === 'owl') {
    // A plump post owl: round body, big head with ear-tufts and pale eyes, a
    // broad short tail — and a letter clutched in its talons.
    return (
      <group>
        <mesh rotation-x={Math.PI / 2} scale={[1, 1, 0.85]}>
          <capsuleGeometry args={[0.17, 0.32, 6, 10]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* big round head */}
        <mesh position={[0, 0.09, 0.33]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* ear tufts */}
        <mesh position={[0.11, 0.25, 0.32]} rotation={[0, 0, -0.35]}>
          <coneGeometry args={[0.05, 0.16, 5]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[-0.11, 0.25, 0.32]} rotation={[0, 0, 0.35]}>
          <coneGeometry args={[0.05, 0.16, 5]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* pale facial discs + dark eyes */}
        <mesh position={[0.08, 0.09, 0.49]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#f4efe4" />
        </mesh>
        <mesh position={[-0.08, 0.09, 0.49]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#f4efe4" />
        </mesh>
        <mesh position={[0.08, 0.09, 0.54]}>
          <sphereGeometry args={[0.032, 6, 6]} />
          <meshBasicMaterial color="#161210" />
        </mesh>
        <mesh position={[-0.08, 0.09, 0.54]}>
          <sphereGeometry args={[0.032, 6, 6]} />
          <meshBasicMaterial color="#161210" />
        </mesh>
        {/* beak */}
        <mesh position={[0, 0.03, 0.55]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.03, 0.11, 5]} />
          <meshBasicMaterial color="#d7a24a" />
        </mesh>
        {/* short fanned tail */}
        <mesh geometry={tails.owl} position={[0, 0, -0.42]}>
          <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
        {/* a letter in its talons */}
        <mesh position={[0, -0.17, 0.16]} rotation-x={0.35}>
          <boxGeometry args={[0.24, 0.02, 0.17]} />
          <meshBasicMaterial color="#efe7d2" />
        </mesh>
      </group>
    )
  }

  if (type === 'angel') {
    return (
      <group>
        {/* flowing robe */}
        <mesh position={[0, -0.1, -0.1]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.34, 1.5, 12, 1, true]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
        {/* head */}
        <mesh position={[0, 0.16, 0.34]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#fffaf0" />
        </mesh>
        {/* halo */}
        <mesh position={[0, 0.42, 0.34]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.22, 0.03, 8, 20]} />
          <meshBasicMaterial color="#ffe9a8" />
        </mesh>
      </group>
    )
  }

  if (type === 'dragon') {
    return (
      <group>
        {/* long sinuous body */}
        <mesh rotation-x={Math.PI / 2}>
          <capsuleGeometry args={[0.16, 1.5, 6, 12]} />
          <meshBasicMaterial color={color} map={scales} />
        </mesh>
        {/* neck + head reaching forward */}
        <mesh position={[0, 0.04, 1.15]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.16, 0.9, 10]} />
          <meshBasicMaterial color={color} map={scales} />
        </mesh>
        <mesh position={[0, 0.06, 1.62]}>
          <coneGeometry args={[0.14, 0.42, 8]} />
          <meshBasicMaterial color="#ff8a3a" />
        </mesh>
        {/* two swept-back horns */}
        <mesh position={[0.07, 0.16, 1.66]} rotation={[0.5, 0, 0.3]}>
          <coneGeometry args={[0.03, 0.28, 6]} />
          <meshBasicMaterial color="#ffd27a" />
        </mesh>
        <mesh position={[-0.07, 0.16, 1.66]} rotation={[0.5, 0, -0.3]}>
          <coneGeometry args={[0.03, 0.28, 6]} />
          <meshBasicMaterial color="#ffd27a" />
        </mesh>
        {/* glowing eyes */}
        <mesh position={[0.07, 0.08, 1.78]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#fff2c8" />
        </mesh>
        <mesh position={[-0.07, 0.08, 1.78]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#fff2c8" />
        </mesh>
        {/* long tail tapering back to a barb */}
        <mesh position={[0, 0, -1.35]} rotation-x={-Math.PI / 2}>
          <coneGeometry args={[0.13, 1.6, 8]} />
          <meshBasicMaterial color={color} map={scales} />
        </mesh>
        <mesh position={[0, 0, -2.2]} rotation-x={Math.PI}>
          <coneGeometry args={[0.11, 0.34, 4]} />
          <meshBasicMaterial color="#ff8a3a" />
        </mesh>
        {/* a ridge of bright back-spines */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((z, k) => (
          <mesh key={k} position={[0, 0.16, z]} rotation-x={-0.2}>
            <coneGeometry args={[0.05, 0.26, 4]} />
            <meshBasicMaterial color="#ffb24a" />
          </mesh>
        ))}
      </group>
    )
  }

  // ordinary bird
  return (
    <group>
      <mesh rotation-x={Math.PI / 2}>
        <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh geometry={tails.bird} position={[0, 0, -0.6]}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** A wing, hinged at the body — feathered for birds/angels, membrane for dragons. */
function Wing({
  type,
  color,
  side,
  membrane,
}: {
  type: CreatureType
  color: string
  side: 1 | -1
  membrane: THREE.Texture
}) {
  const dragon = type === 'dragon'
  const angel = type === 'angel'
  const owl = type === 'owl'

  const geo = useMemo(() => {
    const sx = dragon ? 1.75 : angel ? 1.5 : 1
    // Owls have broad, rounded wings: wider chord, shorter, blunter span.
    const cF = dragon ? 0.5 : owl ? 0.5 : 0.32 // chord at root, front
    const cB = dragon ? 1.0 : owl ? 0.72 : 0.55 // chord at root, back
    const rf = [0, 0, cF]
    const rb = [0, 0, -cB]
    const mid = [side * (owl ? 0.85 : 0.9) * sx, 0.04, owl ? -0.02 : -0.06]
    const tip = [side * (owl ? 1.35 : 1.85) * sx, 0.06, owl ? -0.32 : -0.5]
    const g = new THREE.BufferGeometry()
    // Two triangles: a swept-back, tapered wing.
    g.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([...rf, ...mid, ...rb, ...rf, ...tip, ...mid], 3),
    )
    // UVs so the membrane texture (veins) maps root→tip.
    g.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute([0, 0, 0.6, 1, 0, 1, 0, 0, 1, 1, 0.6, 1], 2),
    )
    g.computeVertexNormals()
    return g
  }, [dragon, angel, owl, side])

  if (dragon) {
    return (
      <group>
        {/* translucent membrane */}
        <mesh geometry={geo}>
          <meshBasicMaterial
            color="#ff8a3a"
            map={membrane}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* two finger-ribs along the arm */}
        <mesh position={[side * 0.95, 0.04, -0.04]} rotation={[0, 0, side * 0.15]}>
          <boxGeometry args={[1.9, 0.03, 0.03]} />
          <meshBasicMaterial color="#a8331a" />
        </mesh>
        <mesh position={[side * 0.8, 0.04, -0.32]} rotation={[0, 0.3 * side, side * 0.1]}>
          <boxGeometry args={[1.5, 0.03, 0.03]} />
          <meshBasicMaterial color="#a8331a" />
        </mesh>
      </group>
    )
  }

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

/** A small fan tail (a triangle) pointing back along -Z, `w` wide and `l` long. */
function makeTail(w: number, l: number): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry()
  g.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([0, 0, 0, w, 0, -l, -w, 0, -l], 3),
  )
  g.computeVertexNormals()
  return g
}

/** A fiery membrane texture: warm base with darker radial veins. */
function makeMembraneTexture(): THREE.Texture {
  const s = 128
  const cv = document.createElement('canvas')
  cv.width = cv.height = s
  const ctx = cv.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, s, 0)
  grad.addColorStop(0, '#c2431c')
  grad.addColorStop(1, '#ff9a4a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, s, s)
  // Veins radiating from the wing root (left edge).
  ctx.strokeStyle = 'rgba(90,20,10,0.75)'
  ctx.lineWidth = 2
  for (let k = 0; k < 6; k++) {
    ctx.beginPath()
    ctx.moveTo(0, s * 0.5)
    ctx.lineTo(s, (s * k) / 5)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(cv)
  tex.needsUpdate = true
  return tex
}

/** A scaly body texture: ember base speckled with darker scales. */
function makeScaleTexture(): THREE.Texture {
  const s = 64
  const cv = document.createElement('canvas')
  cv.width = cv.height = s
  const ctx = cv.getContext('2d')!
  ctx.fillStyle = '#b23c18'
  ctx.fillRect(0, 0, s, s)
  ctx.fillStyle = 'rgba(70,16,8,0.55)'
  for (let y = 0; y < s; y += 6) {
    for (let x = 0; x < s; x += 6) {
      ctx.beginPath()
      ctx.arc(x + (y % 12 === 0 ? 0 : 3), y, 2.2, 0, Math.PI)
      ctx.fill()
    }
  }
  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 3)
  tex.needsUpdate = true
  return tex
}
