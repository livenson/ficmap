import type { Story } from '../types'

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
 * Resolve which places are visible at a given chapter. When not in story mode
 * (`chapterIndex == null`) everything shows. Reveal ids are cumulative from
 * chapter 0 up to and including the active one.
 */
export function resolveVisibility(
  story: Story,
  chapterIndex: number | null,
): Visibility {
  const chapters = story.chapters
  if (chapterIndex == null || !chapters || chapters.length === 0) return ALL

  const anyReveal = (key: 'markers' | 'routes' | 'regions') =>
    chapters.some((c) => c.reveal?.[key] && c.reveal[key]!.length > 0)

  const collect = (key: 'markers' | 'routes' | 'regions'): VisibleSet => {
    if (!anyReveal(key)) return null // this category isn't gated → show all
    const set = new Set<string>()
    for (let i = 0; i <= chapterIndex && i < chapters.length; i++) {
      for (const id of chapters[i].reveal?.[key] ?? []) set.add(id)
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
  chapterIndex: number | null,
): Highlight {
  const markers = new Set<string>()
  const routes = new Set<string>()
  const ch =
    chapterIndex != null ? story.chapters?.[chapterIndex] : undefined
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
