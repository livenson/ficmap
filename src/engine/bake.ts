import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * A piece of a creature: a geometry, a colour, and where it sits on the body.
 * Bodies are assembled from these and merged, rather than mounted as one mesh
 * per part.
 */
export interface Part {
  geo: THREE.BufferGeometry
  color: string
  pos?: [number, number, number]
  rot?: [number, number, number]
  scale?: [number, number, number]
  /** Two-sided pieces (fanned tails, open robes) merge into their own mesh. */
  double?: boolean
}

/**
 * Bake a list of parts into ONE geometry, carrying each part's colour in a
 * vertex attribute so a single unlit material draws all of them.
 *
 * A dragon was thirteen meshes and thirteen draw calls, a post owl twelve. With
 * twenty-odd creatures in the sky that was most of the frame's draw calls —
 * Westeros spent 233 of its 321 on wildlife alone. Nothing inside a body moves
 * relative to the rest of it (only the wings hinge, and they are separate), so
 * the parts can be welded once per creature type and colour and reused.
 */
export function bake(parts: Part[]): THREE.BufferGeometry {
  const out: THREE.BufferGeometry[] = []
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const c = new THREE.Color()
  for (const p of parts) {
    const g = p.geo.clone()
    e.set(...(p.rot ?? [0, 0, 0]))
    m.compose(
      new THREE.Vector3(...(p.pos ?? [0, 0, 0])),
      q.setFromEuler(e),
      new THREE.Vector3(...(p.scale ?? [1, 1, 1])),
    )
    g.applyMatrix4(m)
    // Drop anything that would stop the merge: the parts differ in whether
    // their source geometry carries uv/normal sets.
    for (const name of Object.keys(g.attributes)) {
      if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name)
    }
    if (!g.getAttribute('uv')) {
      const n = g.getAttribute('position').count
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2))
    }
    if (!g.getAttribute('normal')) g.computeVertexNormals()
    c.set(p.color)
    const n = g.getAttribute('position').count
    const col = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    out.push(g.index ? g.toNonIndexed() : g)
  }
  return mergeGeometries(out, false)!
}

