import { defineConfig } from '@playwright/test'

/**
 * E2E config. Uses the environment's preinstalled Chromium (browsers are not
 * downloaded here) via `executablePath`, and runs the specs against a Vite dev
 * server it starts itself. Override the binary with PW_CHROMIUM if needed.
 */
const CHROMIUM = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
const PORT = 5173

export default defineConfig({
  testDir: './e2e',
  // The 3D scenes render under software WebGL here, so per-test budgets are
  // generous — a chapter tour includes a camera fly-through plus the full
  // post-processing pass.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1280, height: 800 },
    launchOptions: { executablePath: CHROMIUM },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
