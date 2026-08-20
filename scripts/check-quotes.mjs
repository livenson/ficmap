#!/usr/bin/env node
/**
 * Every quotation names where it came from.
 *
 * This atlas paraphrases its sources almost everywhere, on purpose. A chapter
 * that instead QUOTES is making a much stronger claim — that these are the
 * author's actual words — and the rule of this codebase is that such a claim is
 * only made when the text has really been read, and always with the edition or
 * translator named.
 *
 * So: a `quote` must carry a `source`, and that source must be specific enough
 * to look up. "Schiller" is not a source; "Act IV, sc. 3 · trans. Theodore
 * Martin" is. The test for specific is crude but effective — a source has to
 * name either a translator, an edition, or a place in the text.
 *
 * It also refuses a quote that is merely the narration again with quote marks
 * round it, because that is the failure this is really guarding against: not a
 * missing credit, but words attributed to an author who never wrote them.
 *
 * NEGATIVE CONTROLS, measured on the Wilhelm Tell world:
 *
 *   drop `source` from the Rütli quote     "has no source"
 *   set it to "Schiller"                   "source is too vague to look up"
 *   copy the narration into `text`         "quote is a copy of the narration"
 *
 * Usage:
 *   node scripts/check-quotes.mjs
 */
import esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * A source has to point somewhere. One of: a named translator or editor, a
 * numbered place in the text, a year, or an explicit statement that the English
 * was rendered from the original for this atlas.
 */
const SPECIFIC = [
  /translat|trans\.|tr\./i,
  /\bact\b|\bsc\.|\bscene\b|\bcanto\b|\bbook\b|\bchapter\b|\brune\b|\bline\b/i,
  /\b1[5-9]\d{2}\b|\b20\d{2}\b/,
  /rendered from the/i,
]

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

/** Loose comparison, so "same words, different punctuation" still counts. */
const bare = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9äöüßàâçéèêëîïôùûœ ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

let quotes = 0
let problems = 0
for (const story of mod.stories) {
  const chapters = (story.books ?? []).flatMap((b) => b.chapters ?? [])
  for (const ch of chapters) {
    if (!ch.quote) continue
    quotes++
    const where = `${story.id} · ${ch.id}`
    const q = ch.quote

    if (!q.text || !q.text.trim()) {
      console.log(`  !! ${where}: quote has no text`)
      problems++
    }
    if (!q.source || !q.source.trim()) {
      console.log(`  !! ${where}: quote has no source — who wrote this, and where?`)
      problems++
    } else if (!SPECIFIC.some((re) => re.test(q.source))) {
      console.log(`  !! ${where}: source "${q.source}" is too vague to look up`)
      problems++
    }
    if (q.text && ch.narration && bare(q.text) === bare(ch.narration)) {
      console.log(`  !! ${where}: quote is a copy of the narration, not a quotation`)
      problems++
    }
  }
}

console.log(`\n${quotes} quotation(s) across the atlas`)
console.log(
  problems === 0
    ? 'every quotation names an edition, a translator or a place in the text'
    : `${problems} problem(s)`,
)
process.exit(problems === 0 ? 0 : 1)
