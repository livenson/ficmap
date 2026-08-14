import { chromium } from 'playwright'
const S='/tmp/claude-0/-home-user-ficmap/0d881751-53b8-5197-85fb-62863d090321/scratchpad/'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:5211/?world=verne-voyages&view=2d', { waitUntil: 'load' })
await p.waitForTimeout(9000)
await p.screenshot({ path: S + 'world-new-2d.png' })
await b.close()
