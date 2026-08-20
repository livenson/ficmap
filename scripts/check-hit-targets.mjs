#!/usr/bin/env node
/**
 * Clicking near a place in the 3D scene still selects it.
 *
 * Each marker carries an invisible sphere around its pin so a tap anywhere near
 * it lands, rather than only on the small HTML label — which is what makes the
 * flat 2D map usable. That sphere is `visible={false}`, and the whole reason
 * that is allowed is a detail of three.js: `intersect()` in `Raycaster.js` tests
 * `object.layers` and never reads `object.visible`, so an invisible mesh is
 * skipped by the renderer and still found by the raycaster.
 *
 * That is a load-bearing assumption about a dependency, so it gets a test rather
 * than a comment. If a future three.js starts skipping invisible objects when
 * raycasting, every place on every map silently stops being clickable in the
 * scene and only the label still works — a regression nobody would notice until
 * a reader did.
 *
 * The trick is to make the click reach the canvas at all. The HTML label sits
 * directly over the pin and would swallow it, so the labels are given
 * `pointer-events: none` first; the click then goes to the canvas, r3f raycasts,
 * and the sphere is the only thing there to hit.
 *
 * NEGATIVE CONTROL, measured: deleting the hit mesh from `Markers.tsx` entirely
 * takes this from 3 of 3 selections to 0 of 3. Setting the mesh back to a
 * transparent-but-visible material also passes, which is the point — the check
 * is testing that clicking works, not how the mesh is hidden.
 *
 * Usage:
 *   npm run build && npx vite preview --port 5210 &
 *   node scripts/check-hit-targets.mjs [world]
 */
import { chromium } from 'playwright'

const PORT = process.env.PORT ?? 5210
const WORLD = process.argv[2] ?? 'peergynt'
const TRIES = 8
/**
 * Not all of them, deliberately. A pin whose stem stands behind a ridge is
 * legitimately unreachable: the label still draws on top, because `Html` does
 * not depth-test, but the ray meets the hillside before it meets the sphere and
 * nothing is selected. That is the app working. The margin below is wide enough
 * to sit clear of a couple of those and still be nowhere near the 0 that losing
 * the hit target altogether produces.
 */
const NEEDED = 6

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`http://localhost:${PORT}/?world=${WORLD}`, { waitUntil: 'load' })
await page.waitForTimeout(8000)

// Let clicks through to the canvas, so the scene's own hit target is what
// answers them rather than the label sitting on top of it.
//
// Disabling pointer events on `.marker` alone is NOT enough: drei's `Html` wraps
// each label in nested positioned divs, and the outermost of them is what
// `document.elementFromPoint` returns once the button is out of the way. But the
// obvious fix — walking up from the button disabling every ancestor — is worse
// than the problem, because one of those ancestors is r3f's own wrapper, the
// canvas's parent. Disabling it switches off the canvas too, and the check then
// reports that clicking is broken no matter what the code does.
//
// So: disable the whole overlay, then put the canvas back. Whatever the nesting,
// the canvas ends up the only thing under the pointer.
await page.addStyleTag({
  content: `.marker, .canvas-wrap div { pointer-events: none !important; }
            canvas { pointer-events: auto !important; }`,
})

const labels = page.locator('button.marker')
const count = await labels.count()
if (count < TRIES) {
  console.error(`only ${count} places visible in ${WORLD} — cannot measure`)
  process.exit(2)
}

let hit = 0
for (let i = 0; i < TRIES; i++) {
  const box = await labels.nth(i).boundingBox()
  if (!box) continue
  // Clear any previous selection, so a stale one cannot be counted as a hit.
  await page.mouse.click(20, 880)
  await page.waitForTimeout(400)
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(600)
  const selected = await page.locator('button.marker--selected').count()
  if (selected > 0) hit++
  console.log(`   place ${i + 1}: click at the pin ${selected > 0 ? 'selected it' : 'SELECTED NOTHING'}`)
}
await browser.close()

console.log(`\n${WORLD}: ${hit} of ${TRIES} clicks on the scene selected a place`)
const ok = hit >= NEEDED
console.log(
  ok
    ? `invisible hit targets are still raycast (needed ${NEEDED})`
    : `!! clicking a place in the scene selects it only ${hit}/${TRIES} times, needed ${NEEDED}`,
)
process.exit(ok ? 0 : 1)
