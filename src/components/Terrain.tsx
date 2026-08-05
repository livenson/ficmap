import { useMemo } from 'react'
import * as THREE from 'three'
import type { HeightField } from '../engine/noise'
import { buildTerrainGeometry } from '../engine/terrain'
import type { TerrainConfig } from '../types'

interface Props {
  field: HeightField
  terrain: TerrainConfig
  wireframe?: boolean
}

/**
 * The landmass. Geometry is rebuilt only when the field or config identity
 * changes, so panning/zooming/selecting stay cheap. Worlds with `detail` set
 * get a tiled procedural bump map so light picks out fine surface relief up
 * close — no extra geometry, and the flat biome colours are untouched.
 */
export function Terrain({ field, terrain, wireframe }: Props) {
  const geometry = useMemo(
    () => buildTerrainGeometry(field, terrain),
    [field, terrain],
  )
  const bump = useMemo(() => (terrain.detail ? makeBumpTexture() : null), [terrain.detail])

  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        vertexColors
        wireframe={wireframe}
        roughness={0.95}
        metalness={0.0}
        flatShading={false}
        bumpMap={bump ?? undefined}
        bumpScale={bump ? 0.5 : 0}
      />
    </mesh>
  )
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
