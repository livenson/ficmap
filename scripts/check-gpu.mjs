#!/usr/bin/env node
/**
 * The checks that need a real browser and a real WebGL context.
 *
 * Deliberately NOT part of `npm run check`. That one reads data and geometry,
 * finishes in twenty seconds and runs on every push; these build the site, start
 * a preview server and drive Chromium, which takes minutes. They are the pass to
 * run when touching rendering — components, materials, the scene graph — rather
 * than when editing a story.
 *
 * What they have in common is that they measure the app through the GRAPHICS API
 * rather than through the clock. Frame times are meaningless in this environment
 * (software WebGL, over a second a frame), so a 300 KB buffer upload or a wasted
 * draw call is invisible in any timing. Counting the calls themselves is exact
 * and renderer-independent.
 *
 * Usage:
 *   npm run check:gpu
 */
import { spawn, spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT ?? 5210

const jobs = [
  ['selecting a place rebuilds nothing', 'check-rerender.mjs', ['forest-song']],
  ['                          (Tell)', 'check-rerender.mjs', ['tell']],
  ['invisible hit targets are raycast', 'check-hit-targets.mjs', ['peergynt']],
  ['the world picker map is usable', 'check-picker-map.mjs', []],
]

console.log('building...')
const built = spawnSync('npm', ['run', 'build'], { cwd: ROOT, encoding: 'utf8' })
if (built.status !== 0) {
  console.error(built.stdout, built.stderr)
  process.exit(1)
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
  cwd: ROOT,
  stdio: 'ignore',
  detached: true,
})
const stop = () => {
  try {
    process.kill(-server.pid)
  } catch {
    // already gone
  }
}
process.on('exit', stop)
process.on('SIGINT', () => {
  stop()
  process.exit(130)
})

// Wait for the server rather than sleeping a guessed interval.
const started = Date.now()
for (;;) {
  try {
    const res = await fetch(`http://localhost:${PORT}/`)
    if (res.ok) break
  } catch {
    // not up yet
  }
  if (Date.now() - started > 30000) {
    console.error('preview server never came up')
    process.exit(1)
  }
  await new Promise((r) => setTimeout(r, 300))
}

let failed = 0
for (const [label, script, args] of jobs) {
  const r = spawnSync('node', [path.join(ROOT, 'scripts', script), ...args], {
    encoding: 'utf8',
    env: { ...process.env, PORT: String(PORT) },
  })
  const ok = r.status === 0
  if (!ok) failed++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${label}`)
  // A failing check has earned its output; a passing one has not.
  if (!ok) console.log((r.stdout || '') + (r.stderr || ''))
}

stop()
console.log(
  failed === 0
    ? `\n${jobs.length} browser checks passed`
    : `\n${failed} of ${jobs.length} browser checks FAILED`,
)
process.exit(failed === 0 ? 0 : 1)
