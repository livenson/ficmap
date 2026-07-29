import type { Story } from '../types'
import { flattenChapters } from './story'

/** One place's appearance in a chapter (identified by its global tour index). */
export interface PlaceReference {
  /** Global position in the world's flattened tour. */
  index: number
  chapterId: string
  title: string
  bookIndex: number
  bookTitle: string
  /** Chapter number within its book (1-based), for display. */
  chapterInBook: number
  /** Whether the world has more than one book (drives the label style). */
  multiBook: boolean
  /** The sentence from the narration that mentions the place, if any. */
  snippet?: string
  /** How the link was found — for a small badge in the UI. */
  via: 'focus' | 'highlight' | 'narration'
}

/**
 * Build, for every marker, the list of chapters that mention it — so a place
 * that recurs across the tale (even across several books) can show all the
 * parts it appears in.
 *
 * A chapter is considered to mention a place when any of these hold:
 *   - the chapter's camera focuses on it,
 *   - the chapter highlights it, or
 *   - the place's name appears in the chapter's narration text.
 * The narration case also captures the exact sentence, so the UI can quote it.
 */
export function buildPlaceReferences(
  story: Story,
): Record<string, PlaceReference[]> {
  const out: Record<string, PlaceReference[]> = {}
  const markers = story.markers ?? []
  const flat = flattenChapters(story)
  if (markers.length === 0 || flat.length === 0) return out

  for (const m of markers) out[m.id] = []
  const multiBook = flat.length > 0 && flat[0].bookCount > 1

  // Match the place name (minus a leading "The ") as a whole phrase.
  const needles = markers.map((m) => ({
    id: m.id,
    re: new RegExp(`\\b${escapeRegExp(m.name.replace(/^the\s+/i, ''))}\\b`, 'i'),
  }))

  flat.forEach((f) => {
    const ch = f.chapter
    const sentences = splitSentences(ch.narration)
    const added = new Set<string>()
    const add = (id: string, via: PlaceReference['via'], snippet?: string) => {
      if (!(id in out) || added.has(id)) return
      added.add(id)
      out[id].push({
        index: f.globalIndex,
        chapterId: ch.id,
        title: ch.title,
        bookIndex: f.bookIndex,
        bookTitle: f.bookTitle,
        chapterInBook: f.indexInBook + 1,
        multiBook,
        via,
        snippet,
      })
    }

    // Strongest signals first: focus, then highlight.
    if (ch.focus?.marker) add(ch.focus.marker, 'focus')
    ch.highlight?.markers?.forEach((id) => add(id, 'highlight'))

    // Then anything named in the prose (captures recurring mentions).
    for (const { id, re } of needles) {
      if (added.has(id)) continue
      const hit = sentences.find((s) => re.test(s))
      if (hit) add(id, 'narration', hit.trim())
    }
  })

  return out
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function splitSentences(text: string): string[] {
  // Good enough for narration prose: split on sentence-ending punctuation.
  return text.split(/(?<=[.!?])\s+/).filter(Boolean)
}
