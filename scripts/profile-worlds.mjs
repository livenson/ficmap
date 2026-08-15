#!/usr/bin/env node
/**
 * Per-world GPU/CPU profile of the 3D map, measured on the production build.
 *
 * No app changes and no hooks in the source: the WebGL context's own methods
 * are patched in the page before anything loads, so every draw call, buffer
 * upload and texture upload is counted as it happens. Frame time comes from
 * requestAnimationFrame, and heap from Chromium's performance.memory.
 *
 * Usage:
 *   npm run build && npx vite preview --port 5210 &
 *   node scripts/profile-worlds.mjs [world ...]
 */
import { chromium } from 'playwright'
import esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT ?? 5210

/**
 * Every world in the atlas, read from the registry rather than listed here.
 *
 * This used to be a hand-written array and it silently went stale: five worlds
 * were added after it and none of them was ever profiled. A profiler that
 * quietly skips the newest thing you built is worse than no profiler, because
 * it reports a clean bill of health for code it never ran.
 */
async function allWorlds() {
  const bundle = await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/stories/index.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    plugins: [
      {
        name: 'stub-assets',
        setup(build) {
          build.onResolve({ filter: /\.(png|jpe?g|webp)$/ }, (a) => ({
            path: a.path,
            namespace: 'stub',
          }))
          build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
            contents: 'export default ""',
            loader: 'js',
          }))
        },
      },
    ],
  })
  const mod = await import(
    'data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64')
  )
  return mod.stories.map((s) => s.id)
}

const WORLDS = process.argv.slice(2).length ? process.argv.slice(2) : await allWorlds()

const INSTRUMENT = () => {
  const S = {
    draws: 0, tris: 0, frames: 0, bufBytes: 0, texBytes: 0,
    programs: 0, ftimes: [],
  }
  window.__prof = S
  const G = WebGL2RenderingContext.prototype
  const de = G.drawElements, di = G.drawElementsInstanced, da = G.drawArrays
  G.drawElements = function (mode, count, ...r) {
    S.draws++; S.tris += count / 3; return de.call(this, mode, count, ...r)
  }
  G.drawElementsInstanced = function (mode, count, type, off, inst) {
    S.draws++; S.tris += (count / 3) * inst
    return di.call(this, mode, count, type, off, inst)
  }
  G.drawArrays = function (mode, first, count) {
    S.draws++; S.tris += count / 3; return da.call(this, mode, first, count)
  }
  const bd = G.bufferData
  G.bufferData = function (t, src, ...r) {
    if (src && src.byteLength) S.bufBytes += src.byteLength
    else if (typeof src === 'number') S.bufBytes += src
    return bd.call(this, t, src, ...r)
  }
  const t2 = G.texImage2D
  G.texImage2D = function (...a) {
    const src = a[a.length - 1]
    if (src && src.width && src.height) S.texBytes += src.width * src.height * 4
    else if (typeof a[3] === 'number' && typeof a[4] === 'number') S.texBytes += a[3] * a[4] * 4
    return t2.apply(this, a)
  }
  const lp = G.linkProgram
  G.linkProgram = function (p) { S.programs++; return lp.call(this, p) }
  let last = performance.now()
  const tick = () => {
    const now = performance.now()
    S.frames++
    S.ftimes.push(now - last)
    last = now
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--js-flags=--expose-gc'],
})
const rows = []
for (const world of WORLDS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.addInitScript(INSTRUMENT)
  await page.goto(`http://localhost:${PORT}/?world=${world}`, { waitUntil: 'load' })
  await page.waitForTimeout(6000) // load, build terrain, settle
  // Reset counters so the steady state is measured, not the build.
  await page.evaluate(() => {
    const S = window.__prof
    S.draws = 0; S.tris = 0; S.frames = 0; S.ftimes.length = 0
  })
  await page.waitForTimeout(5000)
  const r = await page.evaluate(() => {
    const S = window.__prof
    const f = S.ftimes.slice().sort((a, b) => a - b)
    const pct = (p) => f[Math.min(f.length - 1, Math.floor(f.length * p))] ?? 0
    return {
      fps: S.frames / 5,
      medianFrame: pct(0.5),
      p95Frame: pct(0.95),
      drawsPerFrame: S.draws / Math.max(1, S.frames),
      trisPerFrame: S.tris / Math.max(1, S.frames),
      bufMB: S.bufBytes / 1048576,
      texMB: S.texBytes / 1048576,
      programs: S.programs,
      heapMB: (performance.memory?.usedJSHeapSize ?? 0) / 1048576,
    }
  })
  rows.push({ world, ...r })
  await page.close()
  console.error(`  profiled ${world}`)
}

rows.sort((a, b) => b.p95Frame - a.p95Frame)
const n = (v, d = 1) => v.toFixed(d).padStart(7)
console.log(
  '\nworld              fps   med ms   p95 ms   draws/f    tris/f    geom MB   tex MB   heap MB',
)
for (const r of rows) {
  console.log(
    `${r.world.padEnd(17)}${n(r.fps)} ${n(r.medianFrame)} ${n(r.p95Frame)} ` +
      `${n(r.drawsPerFrame, 0)} ${String(Math.round(r.trisPerFrame)).padStart(9)} ` +
      `${n(r.bufMB)} ${n(r.texMB)} ${n(r.heapMB)}`,
  )
}
const avg = (k) => rows.reduce((a, r) => a + r[k], 0) / rows.length
console.log(
  `\nmean: ${avg('fps').toFixed(1)} fps · ${avg('drawsPerFrame').toFixed(0)} draws/frame · ` +
    `${(avg('trisPerFrame') / 1000).toFixed(0)}k tris/frame · ${avg('heapMB').toFixed(0)} MB heap`,
)
await browser.close()
