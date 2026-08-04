import { test, expect, type Page } from '@playwright/test'

/** Every demo world, with the title its info panel shows. */
const WORLDS = [
  { id: 'valdurn', title: 'The Realm of Valdurn' },
  { id: 'emberfall', title: 'Emberfall' },
  { id: 'kalevipoeg', title: 'Kalevipoeg' },
  { id: 'fotr', title: 'The Fellowship of the Ring' },
]

function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  return errors
}

async function selectWorld(page: Page, id: string) {
  await page.selectOption('select', id)
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

test('deep-links a world via the ?world= query param', async ({ page }) => {
  await page.goto('/?world=kalevipoeg')
  await expect(page.getByRole('heading', { name: 'Kalevipoeg' })).toBeVisible()
  await expect(page.locator('select')).toHaveValue('kalevipoeg')
  // Switching worlds keeps the URL in sync for sharing.
  await page.selectOption('select', 'fotr')
  await expect(page).toHaveURL(/world=fotr/)
})
