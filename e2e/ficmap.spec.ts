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
  { id: 'nibelungen', title: 'The Nibelungenlied' },
  { id: 'faust', title: 'Faust' },
  { id: 'uilenspiegel', title: 'Tijl Uilenspiegel' },
  { id: 'kalevala', title: 'The Kalevala' },
  { id: 'peergynt', title: 'Peer Gynt' },
  { id: 'nils', title: 'Nils Holgersson' },
  { id: 'tain', title: 'Táin Bó Cúailnge' },
  { id: 'cid', title: 'The Poem of the Cid' },
  { id: 'aotearoa', title: 'Te Ika-a-Māui' },
  { id: 'natural-life', title: 'For the Term of His Natural Life' },
  { id: 'ottokar', title: 'King Ottokar’s Fortune and End' },
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

/**
 * Walk a whole story and record where Next sits, how long each narration is,
 * and how tall the chapter title and book line render. Everything above the nav
 * used to be variable, so a partial walk could pass while a chapter further in
 * moved the button.
 */
async function walkStory(page: Page, world: string) {
  await selectWorld(page, world)
  await page.getByRole('button', { name: 'Play story' }).click()
  await expect(page.locator('.story__nav')).toBeVisible()

  const seen = []
  for (let i = 0; i < 60; i++) {
    const row = await page.evaluate(() => {
      const nav = document.querySelector('.story__nav')!
      const title = document.querySelector('.panel--story .panel__title')
      const book = document.querySelector('.story__book')
      const last = [...document.querySelectorAll('.story__btn')].pop() as HTMLButtonElement
      return {
        y: Math.round(nav.getBoundingClientRect().top),
        titleH: Math.round(title?.getBoundingClientRect().height ?? 0),
        bookH: Math.round(book?.getBoundingClientRect().height ?? 0),
        narration: document.querySelector('.story__narration')?.textContent?.length ?? 0,
        atEnd: last.disabled || !/Next/.test(last.textContent ?? ''),
      }
    })
    seen.push(row)
    if (row.atEnd) break
    await page.evaluate(() =>
      (([...document.querySelectorAll('.story__btn')].pop() as HTMLButtonElement).click()),
    )
    await page.waitForTimeout(160)
  }
  return seen
}

test('keeps the Next button still across every chapter of a story', async ({ page }) => {
  // Narrations differ by several lines and the nav used to sit under them, so
  // Next slid down the panel on every advance and you had to chase it. Walking
  // all 22 chapters matters: an earlier six-chapter version of this test passed
  // while `XLV–XLIX · Nine diseases, a bear, and the dark` — the one title in
  // the atlas that wraps to three lines — still moved the button 30px.
  const seen = await walkStory(page, 'kalevala')
  expect(seen.length, 'walked the whole story').toBeGreaterThan(20)

  const lengths = seen.map((s) => s.narration)
  expect(
    Math.max(...lengths) - Math.min(...lengths),
    'narration lengths are all alike, so this proves nothing',
  ).toBeGreaterThan(40)
  const titles = seen.map((s) => s.titleH)
  expect(
    new Set(titles).size,
    'every title renders the same height, so this proves nothing',
  ).toBeGreaterThan(1)

  const ys = [...new Set(seen.map((s) => s.y))]
  expect(ys.length, `Next moved between y = ${ys.join(', ')}`).toBe(1)
})

test('keeps the Next button still across a book boundary', async ({ page }) => {
  // A multi-book world prints `Book 3 · The Mysterious Island` above the
  // chapter, and the longer book names wrap to a second line. That moved Next
  // 15px whenever the story crossed from one book into the next.
  const seen = await walkStory(page, 'verne-voyages')
  const books = [...new Set(seen.map((s) => s.bookH))]
  expect(books.length, 'the book line never changes height, so this proves nothing').toBeGreaterThan(1)

  const ys = [...new Set(seen.map((s) => s.y))]
  expect(ys.length, `Next moved between y = ${ys.join(', ')}`).toBe(1)
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

test('rides the Nibelungenlied east twice', async ({ page }) => {
  // The poem's shape is one road travelled to a wedding and then, thirteen
  // years later, to a slaughter — so both routes have to be on the map.
  const errors = trackErrors(page)
  await page.goto('/?world=nibelungen')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('button', { name: /^Worms/ }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /Etzelburg/ }).first()).toBeVisible()
  // The hoard's journey ends in the river and stays there.
  await page.getByRole('button', { name: /The Nibelung Hoard/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Its journey' })).toBeVisible()
  await expect(page.getByText(/nobody says where/)).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('takes Faust down to the Mothers and up to the gorges', async ({ page }) => {
  // The only world here whose extra floors come out of the text itself.
  const errors = trackErrors(page)
  await page.goto('/?world=faust')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('button', { name: /Auerbach/ }).first()).toBeVisible()

  await page.getByRole('button', { name: 'The Mothers', exact: true }).click()
  await expect(page).toHaveURL(/floor=mothers/)
  await expect(page.getByRole('button', { name: /Nothing to Stand On/ }).first()).toBeVisible()

  await page.getByRole('button', { name: 'The Mountain Gorges', exact: true }).click()
  await expect(page).toHaveURL(/floor=gorges/)
  await expect(page.getByRole('button', { name: /Chorus Mysticus/ }).first()).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('turns Uilenspiegel from the land to the sea', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/?world=uilenspiegel')
  await expect(page.locator('canvas')).toBeVisible()
  // The ashes are the spine of the book and the spine of the map.
  await page.getByRole('button', { name: /The Ashes of Claes/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Its journey' })).toBeVisible()
  await expect(page.getByText(/still not buried/)).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('crosses the Kalevala into Tuonela and back', async ({ page }) => {
  // The one world here whose underworld is reached from a marker as well as
  // from the floor switcher — the river of Tuoni has a bank on each floor.
  const errors = trackErrors(page)
  await page.goto('/?world=kalevala')
  await expect(page.locator('canvas')).toBeVisible()

  await page.getByRole('button', { name: /The River of Tuoni/ }).first().click()
  await page.getByRole('button', { name: /The far bank/ }).click()
  await expect(page).toHaveURL(/floor=tuonela/)
  await expect(page.getByRole('heading', { name: 'The Far Bank' })).toBeVisible()

  // And the return trip, which in the poem takes an otter and a snake.
  await page.getByRole('button', { name: /Back to the living bank/ }).click()
  await expect(page).not.toHaveURL(/floor=tuonela/)
  await expect(page.getByRole('heading', { name: 'The River of Tuoni' })).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('takes Peer Gynt down into the Dovre-King’s hall', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/?world=peergynt')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('button', { name: /The Gendin-Edge/ }).first()).toBeVisible()

  await page.getByRole('button', { name: 'The Dovre-King’s Hall', exact: true }).click()
  await expect(page).toHaveURL(/floor=trollhall/)
  // The line the whole play turns on is a place on this floor.
  await page.getByRole('button', { name: /The Difference/ }).first().click()
  await expect(page.getByText(/to thyself be — enough/)).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('flies Nils the length of Sweden', async ({ page }) => {
  // The atlas's first world that is taller than it is wide (aspect 0.482), so
  // this also guards the framing: the far south has to be reachable.
  const errors = trackErrors(page)
  await page.goto('/?world=nils')
  await expect(page.locator('canvas')).toBeVisible()

  await page.getByRole('button', { name: /West Vemminghög/ }).first().click()
  await expect(page.getByRole('heading', { name: 'West Vemminghög' })).toBeVisible()
  await page.getByRole('button', { name: /^Kebnekaise/ }).first().click()
  await expect(page.getByText(/highest mountain in Sweden/)).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('holds the ford in the Táin and takes Valencia in the Cid', async ({ page }) => {
  // Both worlds are itineraries, so the thing worth asserting is that the
  // places the road exists for are actually there.
  const errors = trackErrors(page)
  await selectWorld(page, 'tain')
  await page.getByRole('button', { name: /Ath Fhirdiad/ }).first().click()
  await expect(page.getByText(/foster-brother/)).toBeVisible()

  await selectWorld(page, 'cid')
  await page.getByRole('button', { name: /^Valencia/ }).first().click()
  await expect(page.getByText(/named 109 times/)).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('reads the fish and the dog line', async ({ page }) => {
  const errors = trackErrors(page)
  await selectWorld(page, 'aotearoa')
  await page.getByRole('button', { name: /The Anchor Stone/ }).first().click()
  await expect(page.getByText(/held the canoe steady/)).toBeVisible()

  await selectWorld(page, 'natural-life')
  await page.getByRole('button', { name: /Eaglehawk Neck/ }).first().click()
  await expect(page.getByText(/line of dogs chained/)).toBeVisible()
  expect(errors, errors.join('\n')).toHaveLength(0)
})

test('finds the queen in her coffin at Götzendorf', async ({ page }) => {
  await selectWorld(page, 'ottokar')
  await page.getByRole('button', { name: /Götzendorf/ }).first().click()
  await expect(page.getByText(/arms of Austria at her feet/)).toBeVisible()
})
