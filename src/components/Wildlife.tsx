import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { bake, type Part } from '../engine/bake'
import { WORLD_SIZE, WORLD_HALF } from '../engine/terrain'
import type { Ambient } from '../types'

interface Props {
  ambient: Ambient
  /** World aspect: spreads the flocks across a wider-than-square world. */
  aspect?: number
  /** In a sky realm, the "birds" are rendered as glowing angels instead. */
  heaven?: boolean
}

type CreatureType = 'bird' | 'dragon' | 'angel' | 'owl' | 'raven'

interface Creature {
  type: CreatureType
  radius: number
  /** X center the creature circles around (spread across the world width). */
  cx: number
  /** Z center. 0 for the ranging flocks; a marker's position for a tied one. */
  cz: number
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
  const ravens = !heaven && ambient.birdKind === 'raven'
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
        type: heaven ? 'angel' : owls ? 'owl' : ravens ? 'raven' : 'bird',
        radius: WORLD_SIZE * (0.18 + (i % 4) * 0.09),
        cx: spread(i),
        cz: 0,
        // Owls beat lower and slower over the land, like post owls on a round.
        height: owls ? 20 + (i % 5) * 4 : 26 + (i % 5) * 5,
        speed: heaven ? 0.14 + (i % 3) * 0.04 : owls ? 0.16 + (i % 3) * 0.04 : 0.22 + (i % 3) * 0.06,
        phase: i * GOLDEN,
        dir: i % 2 === 0 ? 1 : -1,
        size: heaven ? 1.5 + (i % 3) * 0.3 : owls ? 1.15 + (i % 3) * 0.2 : 0.9 + (i % 3) * 0.25,
        flap: heaven ? 3 + (i % 2) : owls ? 4 + (i % 2) : 5 + (i % 3),
        color: heaven ? '#fff6e2' : owls ? owlColor(i) : ravens ? '#12151a' : '#1c242c',
      })
    }
    // A dragon tied to one place circles it tightly instead of ranging.
    const at = ambient.dragonAt
    for (let i = 0; i < dragons; i++) {
      list.push({
        type: 'dragon',
        radius: at ? WORLD_SIZE * (0.045 + (i % 2) * 0.02) : WORLD_SIZE * (0.14 + (i % 2) * 0.12),
        cx: at ? at.x * WORLD_HALF * aspect : spread(i + 3),
        cz: at ? at.z * WORLD_HALF : 0,
        // Fly lower than the birds so they sweep in view over the crags, and
        // lower still over a named lair so the marker and the dragon read as
        // the same thing.
        height: at ? 12 + i * 4 : 22 + i * 6,
        speed: 0.12 + (i % 2) * 0.04,
        phase: i * GOLDEN + 1.2,
        dir: i % 2 === 0 ? -1 : 1,
        size: 3.4 + (i % 2) * 0.9,
        flap: 1.6 + i * 0.25,
        color: '#c2431c',
      })
    }
    return list
  }, [birds, dragons, aspect, heaven, owls, ravens, ambient.dragonAt])

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
      const pz = c.cz + Math.sin(theta) * c.radius
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

interface BuiltBody {
  flat: THREE.BufferGeometry | null
  textured: THREE.BufferGeometry | null
  dbl: THREE.BufferGeometry | null
}

/**
 * Welded bodies, keyed by creature type and colour and kept for the life of the
 * page: twenty ravens draw from one set of buffers instead of building twenty
 * identical ones.
 *
 * The cache is deliberately never evicted. A geometry handed to r3f as a
 * `geometry={…}` prop is not disposed when its mesh unmounts, so caching per
 * component instance would strand buffers on the GPU every time a reader
 * switched world. There are only a dozen creature kinds in the whole atlas, so
 * holding all of them costs less than one DEM and nothing accumulates.
 */
const BODIES = new Map<string, BuiltBody>()

function bodyFor(type: CreatureType, color: string): BuiltBody {
  const key = `${type}|${color}`
  let built = BODIES.get(key)
  if (!built) {
    built = weldBody(type, color)
    BODIES.set(key, built)
  }
  return built
}

/**
 * Assemble one creature's parts and merge them. `flat` is everything drawn with
 * a plain colour; `textured` is the scaled hide a dragon needs, which cannot
 * share a material with the rest; `dbl` is the two-sided pieces.
 */
function weldBody(type: CreatureType, color: string): BuiltBody {
  const flat: Part[] = []
  const textured: Part[] = []
  const dbl: Part[] = []
  const HALF = Math.PI / 2

  if (type === 'owl') {
    // A plump post owl: round body, big head with ear-tufts and pale eyes, a
    // broad short tail — and a letter clutched in its talons.
    flat.push(
      { geo: new THREE.CapsuleGeometry(0.17, 0.32, 6, 10), color, rot: [HALF, 0, 0], scale: [1, 1, 0.85] },
      { geo: new THREE.SphereGeometry(0.2, 12, 12), color, pos: [0, 0.09, 0.33] },
      { geo: new THREE.ConeGeometry(0.05, 0.16, 5), color, pos: [0.11, 0.25, 0.32], rot: [0, 0, -0.35] },
      { geo: new THREE.ConeGeometry(0.05, 0.16, 5), color, pos: [-0.11, 0.25, 0.32], rot: [0, 0, 0.35] },
      { geo: new THREE.SphereGeometry(0.07, 8, 8), color: '#f4efe4', pos: [0.08, 0.09, 0.49] },
      { geo: new THREE.SphereGeometry(0.07, 8, 8), color: '#f4efe4', pos: [-0.08, 0.09, 0.49] },
      { geo: new THREE.SphereGeometry(0.032, 6, 6), color: '#161210', pos: [0.08, 0.09, 0.54] },
      { geo: new THREE.SphereGeometry(0.032, 6, 6), color: '#161210', pos: [-0.08, 0.09, 0.54] },
      { geo: new THREE.ConeGeometry(0.03, 0.11, 5), color: '#d7a24a', pos: [0, 0.03, 0.55], rot: [HALF, 0, 0] },
      { geo: new THREE.BoxGeometry(0.24, 0.02, 0.17), color: '#efe7d2', pos: [0, -0.17, 0.16], rot: [0.35, 0, 0] },
    )
    dbl.push({ geo: makeTail(0.34, 0.36), color, pos: [0, 0, -0.42] })
  } else if (type === 'raven') {
    // A maester's raven: slim glossy-black body, wedge tail, heavy beak.
    flat.push(
      { geo: new THREE.CapsuleGeometry(0.1, 0.62, 5, 9), color, rot: [HALF, 0, 0], scale: [1, 1, 1.15] },
      { geo: new THREE.SphereGeometry(0.12, 10, 10), color, pos: [0, 0.04, 0.46] },
      { geo: new THREE.ConeGeometry(0.045, 0.2, 5), color: '#2a2a2e', pos: [0, 0.02, 0.6], rot: [HALF, 0, 0] },
      { geo: new THREE.SphereGeometry(0.022, 6, 6), color: '#b9b2a4', pos: [0.055, 0.07, 0.52] },
      { geo: new THREE.SphereGeometry(0.022, 6, 6), color: '#b9b2a4', pos: [-0.055, 0.07, 0.52] },
    )
    dbl.push({ geo: makeTail(0.3, 0.62), color, pos: [0, 0, -0.56] })
  } else if (type === 'angel') {
    flat.push(
      { geo: new THREE.SphereGeometry(0.16, 12, 12), color: '#fffaf0', pos: [0, 0.16, 0.34] },
      { geo: new THREE.TorusGeometry(0.22, 0.03, 8, 20), color: '#ffe9a8', pos: [0, 0.42, 0.34], rot: [HALF, 0, 0] },
    )
    dbl.push({
      geo: new THREE.ConeGeometry(0.34, 1.5, 12, 1, true),
      color,
      pos: [0, -0.1, -0.1],
      rot: [HALF, 0, 0],
    })
  } else if (type === 'dragon') {
    // The scaled hide keeps its texture, so it merges separately.
    textured.push(
      { geo: new THREE.CapsuleGeometry(0.16, 1.5, 6, 12), color, rot: [HALF, 0, 0] },
      { geo: new THREE.ConeGeometry(0.16, 0.9, 10), color, pos: [0, 0.04, 1.15], rot: [HALF, 0, 0] },
      { geo: new THREE.ConeGeometry(0.13, 1.6, 8), color, pos: [0, 0, -1.35], rot: [-HALF, 0, 0] },
    )
    flat.push(
      { geo: new THREE.ConeGeometry(0.14, 0.42, 8), color: '#ff8a3a', pos: [0, 0.06, 1.62] },
      { geo: new THREE.ConeGeometry(0.03, 0.28, 6), color: '#ffd27a', pos: [0.07, 0.16, 1.66], rot: [0.5, 0, 0.3] },
      { geo: new THREE.ConeGeometry(0.03, 0.28, 6), color: '#ffd27a', pos: [-0.07, 0.16, 1.66], rot: [0.5, 0, -0.3] },
      { geo: new THREE.SphereGeometry(0.035, 6, 6), color: '#fff2c8', pos: [0.07, 0.08, 1.78] },
      { geo: new THREE.SphereGeometry(0.035, 6, 6), color: '#fff2c8', pos: [-0.07, 0.08, 1.78] },
      { geo: new THREE.ConeGeometry(0.11, 0.34, 4), color: '#ff8a3a', pos: [0, 0, -2.2], rot: [Math.PI, 0, 0] },
    )
    for (const z of [-0.8, -0.4, 0, 0.4, 0.8]) {
      flat.push({ geo: new THREE.ConeGeometry(0.05, 0.26, 4), color: '#ffb24a', pos: [0, 0.16, z], rot: [-0.2, 0, 0] })
    }
  } else {
    // ordinary bird
    flat.push({ geo: new THREE.CapsuleGeometry(0.1, 0.7, 4, 8), color, rot: [HALF, 0, 0] })
    dbl.push({ geo: makeTail(0.32, 0.5), color, pos: [0, 0, -0.6] })
  }

  return {
    flat: flat.length ? bake(flat) : null,
    textured: textured.length ? bake(textured) : null,
    dbl: dbl.length ? bake(dbl) : null,
  }
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
  const built = bodyFor(type, color)

  return (
    <group>
      {built.flat && (
        <mesh geometry={built.flat}>
          <meshBasicMaterial vertexColors />
        </mesh>
      )}
      {built.textured && (
        <mesh geometry={built.textured}>
          <meshBasicMaterial vertexColors map={scales} />
        </mesh>
      )}
      {built.dbl && (
        <mesh geometry={built.dbl}>
          <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

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
  const raven = type === 'raven'

  const geo = useMemo(() => {
    const sx = dragon ? 1.75 : angel ? 1.5 : 1
    // Owls have broad, rounded wings: wider chord, shorter, blunter span.
    const cF = dragon ? 0.5 : owl ? 0.5 : raven ? 0.36 : 0.32 // chord at root, front
    const cB = dragon ? 1.0 : owl ? 0.72 : raven ? 0.62 : 0.55 // chord at root, back
    const rf = [0, 0, cF]
    const rb = [0, 0, -cB]
    const mid = [side * (owl ? 0.85 : raven ? 1.0 : 0.9) * sx, 0.04, owl ? -0.02 : -0.06]
    // Ravens: long, fingered wings that sweep well back.
    const tip = [side * (owl ? 1.35 : raven ? 2.05 : 1.85) * sx, 0.06, owl ? -0.32 : raven ? -0.62 : -0.5]
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
  }, [dragon, angel, owl, raven, side])

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
