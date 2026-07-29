import type { Chapter, Story } from '../types'

/**
 * A chapter placed in the world's flat playback order, tagged with which book
 * it belongs to. Story mode and references both operate on this flattened
 * sequence, so single-book (`chapters`) and multi-book (`books`) worlds share
 * one code path.
 */
export interface FlatChapter {
  chapter: Chapter
  /** Position in the whole world's tour (across all books). */
  globalIndex: number
  bookIndex: number
  bookId: string
  bookTitle: string
  /** Chapter position within its own book. */
  indexInBook: number
  /** How many books the world has (1 for a single-book story). */
  bookCount: number
}

/**
 * Flatten a world's tour into one ordered list. `books` takes precedence; a
 * plain `chapters` run is treated as a single implicit book named for the
 * world. Returns [] when there's no tour.
 */
export function flattenChapters(story: Story): FlatChapter[] {
  const books =
    story.books && story.books.length > 0
      ? story.books
      : story.chapters && story.chapters.length > 0
        ? [{ id: story.id, title: story.title, chapters: story.chapters }]
        : []

  const bookCount = books.length
  const out: FlatChapter[] = []
  books.forEach((book, bookIndex) => {
    book.chapters.forEach((chapter, indexInBook) => {
      out.push({
        chapter,
        globalIndex: out.length,
        bookIndex,
        bookId: book.id,
        bookTitle: book.title,
        indexInBook,
        bookCount,
      })
    })
  })
  return out
}

/**
 * A visibility set: `null` means "show everything in this category"; otherwise
 * only ids in the set are shown. Computed per category so a story that only
 * reveals markers still shows all its regions.
 */
export type VisibleSet = Set<string> | null

export interface Visibility {
  markers: VisibleSet
  routes: VisibleSet
  regions: VisibleSet
}

const ALL: Visibility = { markers: null, routes: null, regions: null }

/**
 * Resolve which places are visible at a given point in the tour. When not in
 * story mode (`index == null`) everything shows. Reveal ids are cumulative from
 * the first chapter up to and including the active one, across books.
 */
export function resolveVisibility(
  story: Story,
  index: number | null,
): Visibility {
  if (index == null) return ALL
  const flat = flattenChapters(story)
  if (flat.length === 0) return ALL

  const anyReveal = (key: 'markers' | 'routes' | 'regions') =>
    flat.some((f) => f.chapter.reveal?.[key] && f.chapter.reveal[key]!.length > 0)

  const collect = (key: 'markers' | 'routes' | 'regions'): VisibleSet => {
    if (!anyReveal(key)) return null // this category isn't gated → show all
    const set = new Set<string>()
    for (let i = 0; i <= index && i < flat.length; i++) {
      for (const id of flat[i].chapter.reveal?.[key] ?? []) set.add(id)
    }
    return set
  }

  return {
    markers: collect('markers'),
    routes: collect('routes'),
    regions: collect('regions'),
  }
}

export interface Highlight {
  markers: Set<string>
  routes: Set<string>
}

/** Ids emphasized during the active chapter (its highlights + focused marker). */
export function resolveHighlight(
  story: Story,
  index: number | null,
): Highlight {
  const markers = new Set<string>()
  const routes = new Set<string>()
  const flat = flattenChapters(story)
  const ch = index != null ? flat[index]?.chapter : undefined
  if (ch) {
    ch.highlight?.markers?.forEach((id) => markers.add(id))
    ch.highlight?.routes?.forEach((id) => routes.add(id))
    if (ch.focus?.marker) markers.add(ch.focus.marker)
  }
  return { markers, routes }
}

export function isVisible(set: VisibleSet, id: string): boolean {
  return set === null || set.has(id)
}
