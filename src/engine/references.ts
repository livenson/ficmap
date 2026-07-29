import type { Story } from '../types'

/** One place's appearance in a chapter. */
export interface PlaceReference {
  /** Chapter index in story.chapters. */
  index: number
  chapterId: string
  title: string
  /** The sentence from the narration that mentions the place, if any. */
  snippet?: string
  /** How the link was found — for a small badge in the UI. */
  via: 'focus' | 'highlight' | 'narration'
}

/**
 * Build, for every marker, the list of chapters that mention it — so a place
 * that recurs across the tale can show all the parts it appears in.
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
  const chapters = story.chapters ?? []
  if (markers.length === 0 || chapters.length === 0) return out

  for (const m of markers) out[m.id] = []

  // Match the place name (minus a leading "The ") as a whole phrase.
  const needles = markers.map((m) => ({
    id: m.id,
    re: new RegExp(`\\b${escapeRegExp(m.name.replace(/^the\s+/i, ''))}\\b`, 'i'),
  }))

  chapters.forEach((ch, index) => {
    const sentences = splitSentences(ch.narration)
    const added = new Set<string>()
    const add = (id: string, via: PlaceReference['via'], snippet?: string) => {
      if (!(id in out) || added.has(id)) return
      added.add(id)
      out[id].push({ index, chapterId: ch.id, title: ch.title, via, snippet })
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
