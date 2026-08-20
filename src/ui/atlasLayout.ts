import type { CoastView } from '../assets/coastlines'
import { europeCoast, worldCoast } from '../assets/coastlines'
import type { Story } from '../types'

/**
 * Where every world sits on the picker's map.
 *
 * This lives apart from the component because `check-atlas-map.mjs` imports it
 * and asserts on the result. A checker that reimplemented the projection would
 * be testing its own copy of the arithmetic, which is the failure this codebase
 * keeps rediscovering; this way the check sees exactly what the picker draws.
 */

/** A world placed on one of the two panels, in 0..1 panel units. */
export interface PlacedWorld {
  story: Story
  x: number
  y: number
}

/** Project a lon/lat into a view's 0..1 box. */
export function project(view: CoastView, lon: number, lat: number): { x: number; y: number } {
  return {
    x: (lon - view.lonMin) / (view.lonMax - view.lonMin),
    y: (view.latMax - lat) / (view.latMax - view.latMin),
  }
}

/** Is this point inside the view at all? */
export function within(view: CoastView, lon: number, lat: number): boolean {
  return (
    lon >= view.lonMin && lon <= view.lonMax && lat >= view.latMin && lat <= view.latMax
  )
}

/**
 * Split the atlas three ways: the Europe inset, the world map, and the shelf.
 *
 * Europe takes anything inside the inset's box, and the world map takes the
 * rest — so a world appears on exactly one panel and no pin is drawn twice.
 * That matters more than it sounds: showing European worlds on both maps was
 * the first thing tried and it made the world map's dense corner unreadable
 * while adding nothing, since the inset is right beside it.
 *
 * The shelf is everything with no `earth` pin — the four worlds that are not on
 * Earth, and the two that are all of it.
 */
export function layoutAtlas(stories: Story[]): {
  europe: PlacedWorld[]
  world: PlacedWorld[]
  shelf: Story[]
} {
  const europe: PlacedWorld[] = []
  const world: PlacedWorld[] = []
  const shelf: Story[] = []

  for (const story of stories) {
    const pin = story.earth
    if (!pin) {
      shelf.push(story)
      continue
    }
    const inEurope = within(europeCoast, pin.lon, pin.lat)
    const view = inEurope ? europeCoast : worldCoast
    const { x, y } = project(view, pin.lon, pin.lat)
    ;(inEurope ? europe : world).push({ story, x, y })
  }

  return { europe, world, shelf }
}

/**
 * Panel sizes, in CSS pixels, shared with the stylesheet.
 *
 * Here rather than only in CSS because the separation between two pins is a
 * property of the panel's pixel size, not of its 0..1 coordinates, and
 * `check-atlas-map.mjs` has to measure it in pixels to say anything useful. If
 * these change, the check's numbers change with them.
 */
export const PANEL = {
  // Both panels the same width so they stack into one column with the name
  // list beside them. Laid out side by side they need 1,174 px before the names
  // even start, which wrapped on anything narrower than a desktop and pushed
  // the world map out of the popup entirely.
  //
  // Europe is the taller of the two and that is not a mistake: twenty of the
  // atlas's twenty-four Earth worlds are in it, and the world map below carries
  // four. The inset is the main map here; the globe is the context.
  // 290 rather than 200: the world view now covers 210 degrees of longitude by
  // 122 of latitude, and 500x290 is that shape undistorted. The old 500x200
  // was the full globe, where India's two worlds merged into one dot.
  world: { w: 500, h: 290 },
  europe: { w: 500, h: 400 },
}

/** Drawn radius of a pin, in CSS pixels. Two pins closer than 2r overlap. */
export const PIN_RADIUS = 4.5
