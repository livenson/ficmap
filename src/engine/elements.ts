import type { MapPoint, Story, StoryElement, ElementStop } from '../types'

/**
 * Which leg of an element's journey is active at a point in the tour.
 * In free exploration (`index == null`) the element sits at its final known
 * stop; during the tour it sits at the latest stop whose `sinceChapter` has
 * been reached.
 */
export function activeStopIndex(
  element: StoryElement,
  index: number | null,
): number {
  const legs = element.journey
  if (legs.length === 0) return -1
  if (index == null) return legs.length - 1

  let active = 0
  for (let i = 0; i < legs.length; i++) {
    if ((legs[i].sinceChapter ?? 0) <= index) active = i
  }
  return active
}

/** Resolve a stop to a map-space point, from a marker id or an explicit point. */
export function stopPoint(
  stop: ElementStop,
  story: Story,
): MapPoint | null {
  if (stop.marker) {
    const m = story.markers?.find((mk) => mk.id === stop.marker)
    if (m) return m.at
  }
  return stop.at ?? null
}

/** The element's map-space position for the given tour index. */
export function elementPoint(
  element: StoryElement,
  story: Story,
  index: number | null,
): MapPoint | null {
  const i = activeStopIndex(element, index)
  if (i < 0) return null
  return stopPoint(element.journey[i], story)
}
