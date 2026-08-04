import type { Ambient, Marker, RegionLabel, Route, Story, TerrainConfig } from '../types'

export const SURFACE_ID = 'surface'

/** A fully-resolved map level (the surface, or one of the deeper levels). */
export interface ResolvedLevel {
  id: string
  title: string
  subtitle?: string
  terrain: TerrainConfig
  ambient: Ambient
  markers: Marker[]
  routes: Route[]
  regions: RegionLabel[]
  /** Vertical order (surface = 0, sky realms > 0, underworlds < 0). */
  tier: number
}

/**
 * All levels of a world, surface first, deeper levels below. A story's own
 * top-level fields are the implicit surface; `levels` adds floors beneath it.
 * Most worlds have just the one surface level.
 */
export function getLevels(story: Story): ResolvedLevel[] {
  const surface: ResolvedLevel = {
    id: SURFACE_ID,
    title: story.surfaceName ?? 'Surface',
    terrain: story.terrain,
    ambient: story.ambient ?? {},
    markers: story.markers ?? [],
    routes: story.routes ?? [],
    regions: story.regions ?? [],
    tier: 0,
  }
  const deeper = (story.levels ?? []).map((l, i) => ({
    id: l.id,
    title: l.title,
    subtitle: l.subtitle,
    terrain: l.terrain,
    ambient: l.ambient ?? {},
    markers: l.markers ?? [],
    routes: l.routes ?? [],
    regions: l.regions ?? [],
    // Default: stack undeclared floors beneath the surface in order.
    tier: l.tier ?? -(i + 1),
  }))
  // Surface stays first (it's the load/default level), but callers that want an
  // elevator-style top-to-bottom view can sort by `tier` descending.
  return [surface, ...deeper]
}

export function getLevel(story: Story, id: string | null | undefined): ResolvedLevel {
  const levels = getLevels(story)
  return levels.find((l) => l.id === id) ?? levels[0]
}

/** Every marker across all levels — for references and artifact lookups. */
export function allMarkers(story: Story): Marker[] {
  return getLevels(story).flatMap((l) => l.markers)
}

/** The level id a marker lives on, or null if not found. */
export function markerLevelId(story: Story, markerId: string): string | null {
  for (const l of getLevels(story)) {
    if (l.markers.some((m) => m.id === markerId)) return l.id
  }
  return null
}

export function findMarker(story: Story, markerId: string): Marker | undefined {
  return allMarkers(story).find((m) => m.id === markerId)
}
