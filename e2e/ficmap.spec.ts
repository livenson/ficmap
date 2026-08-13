import { test, expect, type Page } from '@playwright/test'

/** Every demo world, with the title its info panel shows. */
const WORLDS = [
  { id: 'valdurn', title: 'The Realm of Valdurn' },
  { id: 'kalevipoeg', title: 'Kalevipoeg' },
  { id: 'fotr', title: 'The Fellowship of the Ring' },
  { id: 'center-earth', title: 'Journey to the Center of the Earth' },
  { id: 'verne-voyages', title: 'The Extraordinary Voyages' },
  { id: 'musketeers', title: "The d'Artagnan Romances" },
  { id: 'harry-potter', title: 'Harry Potter' },
  { id: 'indiana-jones', title: 'The Adventures of Indiana Jones' },
  { id: 'mistborn', title: 'Mistborn' },
  { id: 'forest-song', title: 'The Forest Song' },
  { id: 'eneida', title: 'Eneida' },
  { id: 'game-of-thrones', title: 'A Song of Ice and Fire' },
  { id: 'lacplesis', title: 'Lāčplēsis' },
  { id: 'tell', title: 'Wilhelm Tell' },
]

function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  return errors
}

async function selectWorld(page: Page, id: string) {
  await page.locator('.worldpicker__button').click()
  await page.locator(`.worldpicker__item[data-id="${id}"]`).click()
  await page.waitForTimeout(1200) // scene remounts + settles
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
})

test.describe('demo worlds', () => {
  for (const w of WORLDS) {
    test(`${w.id} loads and renders without errors`, async ({ page }) => {
      const errors = trackErrors(page)
      await selectWorld(page, w.id)
      await expect(page.getByRole('heading', { name: w.title })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Places', exact: true })).toBeVisible()
      await expect(page.locator('canvas')).toBeVisible()
      expect(errors, errors.join('\n')).toHaveLength(0)
    })
  }
})

test('toggles between 2D and 3D', async ({ page }) => {
  const errors = trackErrors(page)
  await page.getByRole('tab', { name: '2D' }).click()
  await page.waitForTimeout(600)
  await expect(page.getByRole('tab', { name: '2D' })).toHaveAttribute('aria-selected', 'true')
  await page.getByRole('tab', { name: '3D' }).click()
  await page.waitForTimeout(600)
  await expect(page.getByRole('tab', { name: '3D' })).toHaveAttribute('aria-selected', 'true')
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('plays a chapter tour and exits', async ({ page }) => {
  const errors = trackErrors(page)
  await selectWorld(page, 'valdurn')
  await page.getByRole('button', { name: 'Play story' }).click()
  await expect(page.getByText(/Chapter 1/)).toBeVisible()
  await page.getByRole('button', { name: /Next/ }).click()
  await page.waitForTimeout(1400)
  await expect(page.getByText(/Chapter 2/)).toBeVisible()
  // Exit via the story panel's own button (the toolbar also has one).
  await page.locator('.panel--story').getByRole('button', { name: /Exit story/ }).click()
  await expect(page.getByRole('heading', { name: 'Places', exact: true })).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('shows cross-chapter place references', async ({ page }) => {
  await selectWorld(page, 'valdurn')
  // Duskwater recurs across chapters.
  await page.getByRole('button', { name: /Duskwater/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Mentioned in' })).toBeVisible()
})

test('shows a tracked artifact journey', async ({ page }) => {
  await selectWorld(page, 'valdurn')
  await page.getByRole('button', { name: /The Crown of Valdurn/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Its journey' })).toBeVisible()
})

test('descends into the Põrgu underworld level', async ({ page }) => {
  await selectWorld(page, 'kalevipoeg')
  await page.getByRole('button', { name: 'Põrgu', exact: true }).click()
  await page.waitForTimeout(1200)
  // The underworld level's places replace the surface ones.
  await expect(page.getByRole('button', { name: /Sarvik's Hall/ }).first()).toBeVisible()
})

test('layers menu strips the map back', async ({ page }) => {
  const badge = page.locator('.layers__badge')
  await expect(badge).toHaveText('4')
  await page.getByRole('button', { name: 'Map layers' }).click()
  await page.getByText('Trees & wildlife').click()
  await expect(badge).toHaveText('3')
})

test('descends the Center of the Earth subfloors', async ({ page }) => {
  await selectWorld(page, 'center-earth')
  await page.getByRole('button', { name: 'The Lidenbrock Sea', exact: true }).click()
  await page.waitForTimeout(1400)
  await expect(page.getByRole('button', { name: /Port Gräuben/ }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Toward the Centre', exact: true }).click()
  await page.waitForTimeout(1400)
  await expect(page.getByRole('button', { name: /Eruption Shaft/ }).first()).toBeVisible()
})

test('climbs Valdurn into the sky realms and down to the deeps', async ({ page }) => {
  const errors = trackErrors(page)
  await selectWorld(page, 'valdurn')
  // A sky realm above the surface.
  await page.getByRole('button', { name: 'The Cloudward Reach', exact: true }).click()
  await page.waitForTimeout(1400)
  await expect(page.getByRole('button', { name: /Hall of Ancestor-Kings/ }).first()).toBeVisible()
  // An underworld below it.
  await page.getByRole('button', { name: 'The Sunless Deep', exact: true }).click()
  await page.waitForTimeout(1400)
  await expect(page.getByRole('button', { name: /The Deep Forge/ }).first()).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('crosses Mistborn between its two eras', async ({ page }) => {
  await selectWorld(page, 'mistborn')
  // Era 1 (the Final Empire) is the surface.
  await expect(page.getByRole('button', { name: /Luthadel/ }).first()).toBeVisible()
  // The level switcher crosses to Era 2 (the Elendel Basin).
  await page.getByRole('button', { name: 'The Elendel Basin', exact: true }).click()
  await page.waitForTimeout(1400)
  await expect(page.getByRole('button', { name: /Elendel/ }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /New Seran/ }).first()).toBeVisible()
})

test('filters the atlas to a single book/film', async ({ page }) => {
  await selectWorld(page, 'indiana-jones')
  // Everything shows by default.
  await expect(page.getByRole('button', { name: /Shanghai/ }).first()).toBeVisible()
  // The filter is collapsed; open it and pick one film to pare the map down.
  await page.locator('.bookfilter__toggle').click()
  await page.getByRole('button', { name: 'The Last Crusade', exact: true }).click()
  await page.waitForTimeout(600)
  await expect(page.getByRole('button', { name: /Venice/ }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /Shanghai/ })).toHaveCount(0)
  // "All" restores the full atlas.
  await page.locator('.bookfilter__toggle').click()
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await page.waitForTimeout(400)
  await expect(page.getByRole('button', { name: /Shanghai/ }).first()).toBeVisible()
})

test('deep-links a world via the ?world= query param', async ({ page }) => {
  await page.goto('/?world=kalevipoeg')
  await expect(page.getByRole('heading', { name: 'Kalevipoeg' })).toBeVisible()
  await expect(page.locator('.worldpicker__current')).toHaveText('Kalevipoeg')
  // Switching worlds keeps the URL in sync for sharing.
  await selectWorld(page, 'fotr')
  await expect(page).toHaveURL(/world=fotr/)
})

test('deep-links the view mode via the ?view= query param', async ({ page }) => {
  await page.goto('/?view=2d')
  await expect(page.getByRole('tab', { name: '2D' })).toHaveAttribute('aria-selected', 'true')
  // Switching to 3D updates the URL; 3D is the default so the param clears.
  await page.getByRole('tab', { name: '3D' }).click()
  await expect(page).not.toHaveURL(/view=/)
})

test('switches UI language to Estonian', async ({ page }) => {
  await page.goto('/?lang=et')
  // The world-picker caption and layers button are translated…
  await expect(page.locator('.worldpicker .toolbar__caption')).toHaveText('Maailm')
  await expect(page.locator('.layers__text')).toHaveText('Kihid')
  // …but a world's own content is not.
  await expect(page.getByRole('heading', { name: 'The Realm of Valdurn' })).toBeVisible()
  // Toggling back to English updates the labels and drops the param.
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('.layers__text')).toHaveText('Layers')
  await expect(page).not.toHaveURL(/lang=/)
})

test('deep-links a subfloor via the ?floor= query param', async ({ page }) => {
  await page.goto('/?world=center-earth&floor=lidenbrock-sea')
  // The named floor is active on load and its markers are shown.
  await expect(page.getByRole('button', { name: /Port Gräuben/ }).first()).toBeVisible()
  // Switching floors keeps the URL in sync; the surface clears the param.
  await page.getByRole('button', { name: 'Toward the Centre', exact: true }).click()
  await expect(page).toHaveURL(/floor=deep-caverns/)
  await page.getByRole('button', { name: 'Iceland', exact: true }).click()
  await expect(page).not.toHaveURL(/floor=/)
})

test('the score follows the world you switch to', async ({ page }) => {
  // Web Audio is not audible under test, so listen at the source: record every
  // pitch the sequencer schedules, then look for a note only the expected
  // world's melody contains. A regression here is silent otherwise — the old
  // sequencer kept playing the first world's tune under every later one.
  await page.addInitScript(() => {
    ;(window as any).__pitches = []
    const mk = AudioContext.prototype.createOscillator
    AudioContext.prototype.createOscillator = function (this: AudioContext) {
      const osc = mk.call(this)
      ;(osc.frequency as any).__pitch = true
      return osc
    }
    const d = Object.getOwnPropertyDescriptor(AudioParam.prototype, 'value')!
    Object.defineProperty(AudioParam.prototype, 'value', {
      get: d.get,
      set(v: number) {
        // > 60 Hz skips the vibrato LFOs, which are oscillators too.
        if ((this as any).__pitch && v > 60) (window as any).__pitches.push(Math.round(v))
        d.set!.call(this, v)
      },
    })
  })
  await page.goto('/?world=center-earth')
  await expect(page.locator('canvas')).toBeVisible()
  await page.locator('.toolbar__music').click()

  // Listen for a note unique to each world's melody among the twelve:
  //   F#4 370 Hz — Middle-earth only    Ab3 208 Hz — Westeros only
  const heard = async (hz: number, hold = 9000) => {
    await page.evaluate(() => ((window as any).__pitches = []))
    await page.waitForTimeout(hold)
    const p: number[] = await page.evaluate(() => (window as any).__pitches)
    expect(p.length, 'the score is silent').toBeGreaterThan(0)
    // Each note is voiced as a stack of partials, so accept any multiple.
    return p.some((v) => {
      const r = v % hz
      return r <= 2 || hz - r <= 2
    })
  }
  expect(await heard(370), 'Middle-earth theme not playing').toBe(true)

  // Lāčplēsis plays Pūt, vējiņi — the only tune in the atlas with a C#5 in it.
  await selectWorld(page, 'lacplesis')
  await expect(page.locator('.nowplaying__title')).toHaveText('Pūt, vējiņi')
  expect(await heard(554), 'Pūt, vējiņi not playing').toBe(true)

  await selectWorld(page, 'game-of-thrones')
  await expect(page.locator('.nowplaying__title')).toHaveText('Theme for the Seven Kingdoms')
  expect(await heard(208), 'still playing the previous world’s tune').toBe(true)
  expect(await heard(370), 'Middle-earth theme leaked into Westeros').toBe(false)
})

test('crosses between the two Baltic epics at the shared duel', async ({ page }) => {
  // Lāčplēsis and Kalevipoeg both carry the duel between the Bear-Slayer and
  // Kalev's son, so each map offers a door to the other at that place.
  const errors = trackErrors(page)
  await page.goto('/?world=lacplesis')
  await expect(page.locator('canvas')).toBeVisible()

  await page.getByRole('button', { name: /The Estonian March/ }).first().click()
  await expect(page.locator('.place__cross-world')).toHaveText('Kalevipoeg')
  await page.locator('.place__cross').click()

  // Landed in the other world, on the named place, with its card open.
  await expect(page.locator('.worldpicker__current')).toHaveText('Kalevipoeg')
  await expect(page.getByRole('heading', { name: 'The Southern March' })).toBeVisible()
  await expect(page).toHaveURL(/world=kalevipoeg/)

  // And back again, so the link is a door and not a one-way trip.
  await expect(page.locator('.place__cross-world')).toHaveText('Lāčplēsis')
  await page.locator('.place__cross').click()
  await expect(page.locator('.worldpicker__current')).toHaveText('Lāčplēsis')
  await expect(page.getByRole('heading', { name: 'The Estonian March' })).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('climbs Lāčplēsis to the sky palace and down to the crystal castle', async ({ page }) => {
  await page.goto('/?world=lacplesis')
  await expect(page.locator('canvas')).toBeVisible()

  await page.getByRole('button', { name: 'Pērkons’s Hall', exact: true }).click()
  await expect(page).toHaveURL(/floor=perkona-pils/)
  await expect(page.getByRole('button', { name: 'The Council Table' }).first()).toBeVisible()

  await page.getByRole('button', { name: 'The Crystal Castle', exact: true }).click()
  await expect(page).toHaveURL(/floor=kristala-pils/)
  await expect(page.getByRole('button', { name: 'The Crystal Hall' }).first()).toBeVisible()

  await page.getByRole('button', { name: 'The Daugava Lands', exact: true }).click()
  await expect(page).not.toHaveURL(/floor=/)
})

test('groups the world picker into sections and filters it', async ({ page }) => {
  // A flat list of fifteen worlds reads as arbitrary, so the menu is sectioned
  // and searchable. Both need to keep working as the atlas grows.
  await page.locator('.worldpicker__button').click({ noWaitAfter: true })
  const titles = page.locator('.worldpicker__group-title')
  await expect(titles.first()).toHaveText('National epics & folk tales')
  expect(await titles.count()).toBeGreaterThanOrEqual(4)

  // Typing narrows to matches on title, author or setting.
  await page.locator('.worldpicker__search').fill('schiller')
  await expect(page.locator('.worldpicker__item')).toHaveCount(1)
  await expect(page.locator('.worldpicker__item-title')).toHaveText('Wilhelm Tell')

  // Enter takes the only remaining match.
  await page.locator('.worldpicker__search').press('Enter')
  await expect(page.locator('.worldpicker__current')).toHaveText('Wilhelm Tell')
  await expect(page).toHaveURL(/world=tell/)
})

test('runs Wilhelm Tell from the lake to the sunken lane', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/?world=tell')
  await expect(page.locator('canvas')).toBeVisible()
  // The play's two ends: Tell's house, and where he waits for Gessler.
  await expect(page.getByRole('button', { name: /Bürglen/ }).first()).toBeVisible()
  await page.getByRole('button', { name: /The Hohle Gasse/ }).first().click()
  await expect(page.getByRole('heading', { name: 'The Hohle Gasse' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Mentioned in' })).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})
