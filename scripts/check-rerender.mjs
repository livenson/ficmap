#!/usr/bin/env node
/**
 * What an ordinary interaction costs, counted in GPU uploads.
 *
 * Selecting a place on the map is a React state change in `MapScene`, so every
 * child re-renders. That is normal and cheap — UNLESS a child rebuilds geometry
 * or re-uploads a buffer, in which case a click costs as much as loading the
 * world. Nothing about that is visible in a frame-rate number here: the software
 * renderer costs over a second a frame, so a 400 KB instance-buffer upload
 * disappears inside it. Counting the uploads themselves is renderer-independent
 * and shows it plainly.
 *
 * Measured the same way as `profile-worlds.mjs`: the WebGL context's own methods
 * are patched before anything loads, so this needs no hooks in the source.
 *
 * NEGATIVE CONTROL, measured on the Forest Song world (0.9 tree density, 2340
 * trees). Put `new THREE.Color()` back in `Flora`'s render body, where it is a
 * dependency of the layout effect that places every tree:
 *
 *     5.0 uploads and 493.6 KB per click
 *
 * With it memoized, the same six clicks cost 0.0 uploads and 0.0 KB. Verified on
 * three worlds; `nils` reads a flat zero either way because it has no rain, so
 * its idle rate is zero too.
 *
 * Usage:
 *   npm run build && npx vite preview --port 5210 &
 *   node scripts/check-rerender.mjs [world]
 */
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? 5210
const WORLD = process.argv[2] ?? 'forest-song'
/** Buffer uploads one selection may cost, over and above the animation rate. */
const BUDGET = 1.5

/**
 * Counting `bufferData` alone is NOT enough, and getting this wrong is how the
 * first version of this check reported a clean zero while the forest was in
 * fact being re-sent on every click. three.js allocates an attribute's buffer
 * with `bufferData` once, and every later `needsUpdate = true` goes out as
 * `bufferSubData` into that same buffer. Re-uploading an existing instance
 * matrix therefore never touches `bufferData` at all.
 */
const INSTRUMENT = () => {
  const S = { bufCalls: 0, bufBytes: 0, texCalls: 0, frames: 0 }
  window.__rr = S
  // Frames matter as much as uploads. Rain, shoals and wisps rewrite their
  // buffers once a frame by design, so a window that renders more frames uploads
  // more — and clicking renders more frames, because r3f re-renders on a state
  // change. Comparing raw totals would charge that animation to the click.
  const tick = () => {
    S.frames++
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  const G = WebGL2RenderingContext.prototype
  // Ignore the handful of tiny uploads three.js makes for its own bookkeeping;
  // this is looking for whole meshes and instance buffers being re-sent.
  const note = (n) => {
    if (n > 4096) {
      S.bufCalls++
      S.bufBytes += n
    }
  }
  const bd = G.bufferData
  G.bufferData = function (t, src, ...r) {
    note(src && src.byteLength ? src.byteLength : typeof src === 'number' ? src : 0)
    return bd.call(this, t, src, ...r)
  }
  const bs = G.bufferSubData
  G.bufferSubData = function (t, off, src, ...r) {
    // WebGL2 takes an optional srcOffset/length in elements; the byte count of
    // the view is the right measure either way.
    note(src && src.byteLength ? src.byteLength : 0)
    return bs.call(this, t, off, src, ...r)
  }
  const t2 = G.texImage2D
  G.texImage2D = function (...a) {
    S.texCalls++
    return t2.apply(this, a)
  }
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.addInitScript(INSTRUMENT)
await page.goto(`http://localhost:${PORT}/?world=${WORLD}`, { waitUntil: 'load' })
await page.waitForTimeout(8000) // load, scatter, build terrain, settle

const markers = page.locator('button.marker')
const count = await markers.count()
if (count < 3) {
  console.error(`only ${count} clickable places in ${WORLD} — cannot measure`)
  process.exit(2)
}

const CLICKS = 6
const DWELL = 500

const reset = () =>
  page.evaluate(() => {
    const S = window.__rr
    S.bufCalls = 0
    S.bufBytes = 0
    S.texCalls = 0
    S.frames = 0
  })
const read = () => page.evaluate(() => ({ ...window.__rr }))

/**
 * An idle window of exactly the same length first.
 *
 * The scene animates: shoals of fish, wisps and rain all rewrite their instance
 * matrices every frame, and those uploads are the feature working. Counting the
 * clicking window alone would charge every one of them to the click. What a
 * click costs is the DIFFERENCE between the two windows.
 */
await reset()
await page.waitForTimeout(CLICKS * DWELL)
const idle = await read()

// Now the same span again, but selecting a place each time. Each selection is
// one React state change in `MapScene`, so every child re-renders.
await reset()
for (let i = 0; i < CLICKS; i++) {
  await markers.nth(i % count).click({ force: true })
  await page.waitForTimeout(DWELL)
}
const busy = await read()
await browser.close()

/**
 * What the clicks cost, with the animation subtracted at its own rate.
 *
 * Not `busy - idle`: the two windows are the same wall-clock length but do NOT
 * render the same number of frames, because clicking makes r3f render more of
 * them. Rain and shoals rewrite a buffer once per frame by design, so the busy
 * window legitimately uploads more, and a flat difference charges that to the
 * click — which is how an earlier version of this check accused three innocent
 * worlds of rebuilding geometry.
 *
 * Nor `perFrame(busy) - perFrame(idle)`: that is the opposite error. Six clicks'
 * worth of rebuilding, averaged over the forty-odd frames the window renders,
 * comes out below one upload a frame and slips under any sane budget. Measured:
 * it reads 0.70 for a fault that is really 5 uploads and 493 KB per click.
 *
 * So: take the idle rate PER FRAME, scale it to the number of frames the busy
 * window actually rendered, and call whatever is left over the cost of the
 * clicks.
 */
const idleRate = idle.bufCalls / Math.max(1, idle.frames)
const idleByteRate = idle.bufBytes / Math.max(1, idle.frames)
const extraCalls = Math.max(0, busy.bufCalls - idleRate * busy.frames)
const extraBytes = Math.max(0, busy.bufBytes - idleByteRate * busy.frames)
const perClick = extraCalls / CLICKS

console.log(`\n${WORLD}: ${count} places on the map, ${CLICKS} selections`)
console.log(`   idle  ${String(idle.frames).padStart(3)} frames, ` +
  `${idleRate.toFixed(2).padStart(6)} uploads/frame  ` +
  `${(idleByteRate / 1024).toFixed(1).padStart(8)} KB/frame   (animation)`)
console.log(`   busy  ${String(busy.frames).padStart(3)} frames, ` +
  `${(busy.bufCalls / Math.max(1, busy.frames)).toFixed(2).padStart(6)} uploads/frame  ` +
  `${(busy.bufBytes / Math.max(1, busy.frames) / 1024).toFixed(1).padStart(8)} KB/frame`)
console.log(`   over the animation rate the selections cost ${extraCalls.toFixed(1)} uploads` +
  ` and ${(extraBytes / 1024).toFixed(1)} KB` +
  ` — ${perClick.toFixed(1)} uploads, ${(extraBytes / CLICKS / 1024).toFixed(1)} KB per click`)

const ok = perClick <= BUDGET
console.log(
  ok
    ? `\nselecting a place rebuilds nothing (budget ${BUDGET} uploads/click)`
    : `\n!! selecting a place re-uploads geometry — ${perClick.toFixed(1)} > ${BUDGET} per click`,
)
process.exit(ok ? 0 : 1)
