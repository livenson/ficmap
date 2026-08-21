#!/usr/bin/env node
/**
 * A minimal ESRI shapefile reader, and a zip member reader to feed it.
 *
 * Written for one job: the GSHHG shoreline, which is the only public-domain
 * source this atlas has found that knows where an ESTUARY is. The elevation
 * data does not. Terrarium reads +8 to +11 m the whole way across the Qiantang
 * below Hangzhou — not a sampling artefact, that is what the source says at z10
 * — so no zoom level and no output size will ever draw Hangzhou Bay, and the
 * Kiều map shipped with fifty-five kilometres of sea rendered as farmland.
 *
 * GSHHG is distributed only as shapefiles and binaries, so this exists. It
 * reads exactly what is needed — polygon and polyline records, points and parts
 * — and nothing else: no .dbf attributes, no projections, no indexes, no
 * measures. GSHHG's rings carry no attributes worth having anyway; what they
 * carry is the shape of the coast.
 *
 * GSHHG stores longitude 0..360; `readShapes` normalises to −180..180.
 *
 * Format, for anyone extending this (ESRI Shapefile Technical Description,
 * July 1998): a 100-byte file header, then records of an 8-byte BIG-endian
 * header (record number, content length in 16-bit words) followed by
 * little-endian content. A PolyLine (3) and a Polygon (5) have the same layout
 * — bounding box, part count, point count, part offsets, then the points — so
 * one reader serves both. Z and M variants (13/23, 15/25) put their extra
 * arrays after the points, which this ignores.
 */
import fs from 'fs'
import zlib from 'zlib'

/** Shape types this reads. Polygons and polylines share a layout. */
const POLY = new Set([3, 5, 13, 15, 23, 25])

/**
 * Every ring or line in a .shp buffer, as arrays of [lon, lat].
 *
 * `bbox` skips a record whose own bounding box misses it, which matters: the
 * GSHHG Eurasia polygon alone is millions of points, and a map of eastern China
 * wants none of Portugal.
 */
export function readShapes(buf, bbox) {
  const out = []
  const norm = (x) => (x > 180 ? x - 360 : x)
  let off = 100
  while (off + 8 <= buf.length) {
    const contentLen = buf.readInt32BE(off + 4) * 2
    const p = off + 8
    off += 8 + contentLen
    if (p + 44 > buf.length) break
    const type = buf.readInt32LE(p)
    if (!POLY.has(type)) continue
    if (bbox) {
      const x0 = norm(buf.readDoubleLE(p + 4))
      const y0 = buf.readDoubleLE(p + 12)
      const x1 = norm(buf.readDoubleLE(p + 20))
      const y1 = buf.readDoubleLE(p + 28)
      // A record that crosses the antimeridian comes out with x0 > x1 after
      // normalising; keep it rather than reasoning about it.
      if (x0 <= x1 && (x1 < bbox.lonMin || x0 > bbox.lonMax)) continue
      if (y1 < bbox.latMin || y0 > bbox.latMax) continue
    }
    const numParts = buf.readInt32LE(p + 36)
    const numPoints = buf.readInt32LE(p + 40)
    const partStart = p + 44
    const ptStart = partStart + numParts * 4
    for (let i = 0; i < numParts; i++) {
      const a = buf.readInt32LE(partStart + i * 4)
      const b = i + 1 < numParts ? buf.readInt32LE(partStart + (i + 1) * 4) : numPoints
      const ring = new Array(b - a)
      for (let k = a; k < b; k++)
        ring[k - a] = [
          norm(buf.readDoubleLE(ptStart + k * 16)),
          buf.readDoubleLE(ptStart + k * 16 + 8),
        ]
      if (ring.length >= 2) out.push(ring)
    }
  }
  return out
}

/**
 * One member of a zip file, decompressed, without shelling out to `unzip`.
 *
 * Walks the central directory from the end-of-central-directory record, finds
 * the entry by name, then reads its local header to learn where the compressed
 * bytes actually begin — the local header's own name and extra-field lengths
 * differ from the central directory's, which is the classic way to read the
 * wrong offset. Store (0) and deflate (8) only; GSHHG uses deflate.
 */
export function unzipMember(zipPath, name) {
  const buf = fs.readFileSync(zipPath)
  let eocd = -1
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 66000; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd < 0) throw new Error(`${zipPath}: no end-of-central-directory record`)
  const count = buf.readUInt16LE(eocd + 10)
  let p = buf.readUInt32LE(eocd + 16)
  for (let i = 0; i < count; i++) {
    const nameLen = buf.readUInt16LE(p + 28)
    const extraLen = buf.readUInt16LE(p + 30)
    const commentLen = buf.readUInt16LE(p + 32)
    const entry = buf.toString('utf8', p + 46, p + 46 + nameLen)
    if (entry === name) {
      const method = buf.readUInt16LE(p + 10)
      const compSize = buf.readUInt32LE(p + 20)
      const local = buf.readUInt32LE(p + 42)
      const lNameLen = buf.readUInt16LE(local + 26)
      const lExtraLen = buf.readUInt16LE(local + 28)
      const start = local + 30 + lNameLen + lExtraLen
      const raw = buf.subarray(start, start + compSize)
      if (method === 0) return Buffer.from(raw)
      if (method === 8) return zlib.inflateRawSync(raw)
      throw new Error(`${name}: unsupported compression method ${method}`)
    }
    p += 46 + nameLen + extraLen + commentLen
  }
  throw new Error(`${name}: not in ${zipPath}`)
}
