#!/usr/bin/env node
/**
 * The world picker's map tab can actually be used.
 *
 * `check-atlas-map.mjs` holds the DATA — that every world is placed once, that
 * pins sit inside their own DEM boxes, that no two collide. All of that can be
 * true of a map nobody can operate, and the first version of this tab was
 * exactly that. So this one drives the rendered thing in a browser and checks
 * what a reader would actually do with it:
 *
 *   - HOVERING A PIN NAMES IT. The first version had no label on the map and
 *     lit the matching row in the list beside it instead, on the reasoning that
 *     twenty labels would not fit. Twenty would not; one does, and one was
 *     needed — measured, 8 of the 24 rows were scrolled out of the column, so
 *     hovering Spain, Portugal, Italy, Greece, Iceland, Thailand, New Zealand or
 *     Tasmania named nothing at all.
 *   - THE LABEL STAYS ON THE PANEL. Long titles near the right edge otherwise
 *     run off it.
 *   - THE LABEL NAMES THE RIGHT WORLD. This is the one that earned the check.
 *     Pins used to carry their own invisible hit discs, and the closest pair on
 *     the inset is 12.5 px apart, so a disc big enough for a fingertip (13 px)
 *     covered its neighbour's centre entirely: hovering Ottokar reported Švejk,
 *     and whichever pin happened to draw second silently ate the other. The
 *     panel now resolves the pointer to the NEAREST pin, which cannot do that.
 *   - THE OFF-EARTH WORLDS ARE VISIBLE. Middle-earth, Westeros, Scadrial,
 *     Valdurn and the two whole-Earth worlds have no pin. They began at the foot
 *     of the scrolling name column — 941 px down a 650 px column — so six of the
 *     thirty worlds could not be seen at all without thinking to scroll.
 *   - THE MAP IS NOT IN THE KEYBOARD'S WAY. The 24 pins used to be tab stops,
 *     so reaching the first name took 26 of them. The list is the keyboard path;
 *     the map is for pointing.
 *
 * NEGATIVE CONTROLS, all measured with the build confirmed to have succeeded
 * first (a control that never ran looks exactly like a control that passed):
 *
 *   never compute the hovered pin      24 of 24 pins show no label
 *   drop the right-edge label flip     4 labels run outside their panel —
 *                                      Kalevala, Aotearoa, Tasmania, Thailand
 *   give pins their own 13 px discs    hovering ottokar names Švejk
 *
 * Usage:
 *   npm run build && npx vite preview --port 5210 &
 *   node scripts/check-picker-map.mjs
 */
import { chromium, devices } from 'playwright'

const PORT = process.env.PORT ?? 5210
const EXEC = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium'

const b = await chromium.launch({ executablePath: EXEC })
const p = await b.newPage({ viewport: { width: 1500, height: 950 } })
await p.goto(`http://localhost:${PORT}/?world=snow-queen`, { waitUntil: 'load' })
// The 3D scene renders about a frame a second here; the picker is HTML and is
// ready long before that, but the page has to settle before it can be clicked.
await p.waitForTimeout(9000)
await p.locator('.worldpicker__button').click({ force: true })
await p.waitForTimeout(300)
await p.getByRole('tab', { name: 'Map' }).click({ force: true })
await p.waitForTimeout(600)

let problems = 0
const fail = (msg) => {
  console.log(`  !! ${msg}`)
  problems++
}

const ids = await p.$$eval('.atlasmap__pin', (els) => els.map((e) => e.dataset.id))
if (ids.length < 20) fail(`only ${ids.length} pins rendered — the map is not drawing`)

const noLabel = []
const offPanel = []
const wrongText = []
for (const id of ids) {
  // The pins are `pointer-events: none`, so this hover lands on the panel and
  // goes through the same nearest-pin resolution a reader's pointer does.
  await p.locator(`.atlasmap__pin[data-id="${id}"]`).hover({ force: true })
  await p.waitForTimeout(60)
  const res = await p.evaluate((wid) => {
    const g = document.querySelector(`.atlasmap__pin[data-id="${wid}"]`)
    const svg = g.closest('svg')
    const label = svg.querySelector('.atlasmap__label')
    if (!label) return { label: null }
    const lb = label.getBoundingClientRect()
    const sb = svg.getBoundingClientRect()
    const row = document.querySelector(`.atlasmap__name[data-id="${wid}"]`)
    return {
      label: label.textContent,
      inside:
        lb.left >= sb.left - 1 &&
        lb.right <= sb.right + 1 &&
        lb.top >= sb.top - 1 &&
        lb.bottom <= sb.bottom + 1,
      expect: row ? row.querySelector('.atlasmap__name-title').textContent : null,
    }
  }, id)
  if (!res.label) noLabel.push(id)
  else {
    if (!res.inside) offPanel.push(`${id} ("${res.label}")`)
    if (res.expect && res.label !== res.expect) {
      wrongText.push(`${id} shows "${res.label}"`)
    }
  }
}
console.log(`${ids.length} pins hovered`)
if (noLabel.length) fail(`${noLabel.length} pins name nothing on hover: ${noLabel.join(', ')}`)
if (offPanel.length) fail(`${offPanel.length} labels run off their panel: ${offPanel.join(', ')}`)
if (wrongText.length) fail(`${wrongText.length} pins name the wrong world: ${wrongText.join(', ')}`)

const rest = await p.evaluate(() => {
  const menu = document.querySelector('.worldpicker__menu')
  const shelf = document.querySelector('.atlasmap__shelf')
  const mb = menu.getBoundingClientRect()
  const sb = shelf?.getBoundingClientRect()
  const f = [...menu.querySelectorAll('[tabindex="0"], button, input, a[href]')]
  return {
    shelfInView: sb ? sb.top >= mb.top && sb.bottom <= mb.bottom : false,
    chips: document.querySelectorAll('.atlasmap__chip').length,
    pinsFocusable: f.filter((e) => e.classList.contains('atlasmap__pin')).length,
    toFirstName: f.findIndex((e) => e.classList.contains('atlasmap__name')),
  }
})
if (!rest.chips) fail('no off-Earth worlds are offered at all')
if (!rest.shelfInView) {
  fail(`the ${rest.chips} off-Earth worlds are out of view — they need scrolling to find`)
}
if (rest.pinsFocusable) fail(`${rest.pinsFocusable} map pins are in the tab order`)
if (rest.toFirstName > 12) {
  fail(`${rest.toFirstName} tab stops before the first world name — the map is in the way`)
}
console.log(
  `${rest.chips} off-Earth worlds shown as chips, in view: ${rest.shelfInView}; ` +
    `${rest.toFirstName} tab stops to the first name`,
)

// Touch has no hover, so the label would never appear and one tap would change
// the world under the reader's finger. First tap names it, second opens it.
//
// The desktop page is closed first. Under software WebGL two live scenes share
// one CPU and the second page took longer to paint its toolbar than any sane
// timeout allowed — which looked exactly like the picker being broken on touch.
await p.close()
const ctx = await b.newContext({ ...devices['iPad Mini'], hasTouch: true, isMobile: true })
const t = await ctx.newPage()
await t.goto(`http://localhost:${PORT}/?world=snow-queen`, { waitUntil: 'load' })
await t.waitForTimeout(9000)
await t.locator('.worldpicker__button').tap({ force: true })
await t.waitForTimeout(300)
await t.getByRole('tab', { name: 'Map' }).tap({ force: true })
await t.waitForTimeout(600)
const before = await t.locator('.worldpicker__current').textContent()
const pin = t.locator('.atlasmap__pin[data-id="cid"]')
await pin.tap({ force: true })
await t.waitForTimeout(300)
const oneTapWorld = await t.locator('.worldpicker__current').textContent()
const oneTapLabel = await t
  .locator('.atlasmap__label')
  .first()
  .textContent()
  .catch(() => null)
await pin.tap({ force: true })
await t.waitForTimeout(600)
const twoTapWorld = await t.locator('.worldpicker__current').textContent()

if (oneTapWorld !== before) fail(`one tap already changed the world to "${oneTapWorld}"`)
if (!oneTapLabel) fail('one tap named nothing — on touch there is no hover to fall back on')
if (twoTapWorld === before) fail('two taps did not open the world')
console.log(`touch: tap names "${oneTapLabel}", tap again opens it ("${twoTapWorld}")`)

await b.close()
console.log(
  problems === 0
    ? '\nevery pin names itself, the off-Earth worlds are visible, and touch works'
    : `\n${problems} problem(s)`,
)
process.exit(problems === 0 ? 0 : 1)
