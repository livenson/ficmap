/**
 * Ficmap data model.
 *
 * A "story" is a self-contained fictional world plus the points of interest,
 * routes and regions that its narrative cares about. Everything a story needs
 * is described declaratively here — no rendering code required to add one.
 *
 * Coordinates use a simple map space: `x` runs west→east, `z` runs north→south,
 * both in the range [-1, 1] where the world spans the square from (-1,-1) to
 * (1,1). Elevation is derived by the engine from the terrain config, so authors
 * place markers in 2D and they snap onto the 3D landscape automatically.
 */

/** A 2D position in normalized map space, range [-1, 1] on each axis. */
export interface MapPoint {
  x: number
  z: number
}

/** A colored elevation band. Bands are matched from lowest to highest. */
export interface BiomeBand {
  /** Upper elevation bound in [0, 1]; the band applies at or below this. */
  maxHeight: number
  /** CSS/hex color for this band. */
  color: string
  /** Optional label shown in the legend (e.g. "Snowcaps"). */
  name?: string
}

/** Procedural terrain description. Deterministic given `seed`. */
export interface TerrainConfig {
  /** Seed string — same seed always yields the same world. */
  seed: string
  /** Fractal noise octaves; more = more fine detail. Default 5. */
  octaves?: number
  /** Base feature size; smaller = larger continents. Default 2.2. */
  frequency?: number
  /** Amplitude falloff per octave, 0..1. Default 0.5. */
  persistence?: number
  /** Frequency growth per octave. Default 2. */
  lacunarity?: number
  /** Vertical exaggeration of the mesh, in world units. Default 22. */
  heightScale?: number
  /**
   * Water level as a fraction of full height, 0..1. Land below this is sea.
   * Default 0.42.
   */
  seaLevel?: number
  /**
   * Island falloff, 0..1. 0 = open continents to the edges, 1 = strong island
   * shape (land pushed to the center, water at the rim). Default 0.35.
   */
  islandFalloff?: number
  /** Elevation → color bands, low to high. */
  biomes: BiomeBand[]
  /** Number of rivers traced downhill from the highlands to the sea. Default 0. */
  rivers?: number
  /** River line color (default a river blue; e.g. lava-orange for ash worlds). */
  riverColor?: string
}

export type MarkerKind =
  | 'capital'
  | 'city'
  | 'town'
  | 'ruin'
  | 'landmark'
  | 'battle'
  | 'peak'
  | 'port'
  | 'forest'
  | 'danger'

/** A labeled point of interest on the map. */
export interface Marker {
  id: string
  name: string
  kind: MarkerKind
  at: MapPoint
  /** Longer description shown in the info panel. Supports plain text. */
  description?: string
  /** Optional chapter/act tag used for story filtering later. */
  chapter?: string
}

/** A path across the world (a journey, road, border of travel, etc.). */
export interface Route {
  id: string
  name: string
  /** Ordered waypoints in map space. Drawn draped over the terrain. */
  points: MapPoint[]
  /** Line color. Default a warm gold. */
  color?: string
  /** Dashed for planned/legendary routes, solid for travelled ones. */
  style?: 'solid' | 'dashed'
  description?: string
}

/** One leg of an element's journey: where it is, and from when. */
export interface ElementStop {
  /** Where the element rests for this leg — a marker id or an explicit point. */
  marker?: string
  at?: MapPoint
  /**
   * Global tour index (across all books) from which the element is here.
   * Legs are matched by the latest `sinceChapter` at or before the current
   * chapter; omit on the first leg. Default 0.
   */
  sinceChapter?: number
  /** Short note shown in the element's journey list. */
  note?: string
}

/**
 * A tracked story element — an artifact or object whose whereabouts matter
 * (a crown, a cursed sword). It carries a journey of stops; on the map it is
 * shown at wherever it is for the current chapter, so you can watch it move.
 */
export interface StoryElement {
  id: string
  name: string
  /** Glyph shown on the map pin (emoji or symbol). Default ◆. */
  glyph?: string
  description?: string
  /** Ordered legs of the element's journey across the map. */
  journey: ElementStop[]
}

/** A named area label floated over a region (e.g. "The Northern Wastes"). */
export interface RegionLabel {
  id: string
  name: string
  at: MapPoint
  /** Relative text size, 1 = default. */
  scale?: number
}

/**
 * Where the camera should look during a chapter. Give either a `marker` id or
 * an explicit `at` point; the engine resolves the surface elevation itself.
 */
export interface CameraFocus {
  /** Focus on this marker's location (takes precedence over `at`). */
  marker?: string
  /** Or an explicit map point. */
  at?: MapPoint
  /** Camera distance from the focus, in world units. Default ~44. */
  distance?: number
  /** Pitch above the ground in degrees (3D only). 90 = straight down. Default 42. */
  pitch?: number
  /** Compass heading of the camera in degrees (3D only). Default 0. */
  heading?: number
}

/** Which places are unveiled. Ids are cumulative across chapters. */
export interface ChapterReveal {
  markers?: string[]
  routes?: string[]
  regions?: string[]
}

/**
 * A beat in a guided tour of the world. Chapters play in order: the camera
 * flies to `focus`, the narration shows in the panel, and any `reveal` ids are
 * added to what's visible (so the map can unfold as the tale is told).
 */
export interface Chapter {
  id: string
  title: string
  /** Narration shown in the panel for this beat. */
  narration: string
  focus?: CameraFocus
  /** Places revealed by (and kept visible from) this chapter onward. */
  reveal?: ChapterReveal
  /** Marker/route ids to emphasize while this chapter is active. */
  highlight?: { markers?: string[]; routes?: string[] }
}

/**
 * Ambient "life" layered onto the 3D view — scattered vegetation and animated
 * creatures. Purely decorative, deterministic, and only shown in 3D. Omit for
 * sensible defaults; set counts to 0 to switch a layer off.
 */
export interface Ambient {
  /** Tree density, 0..1 (default 0.6). Trees populate wooded elevations. */
  trees?: number
  /** Foliage color; defaults to a green tuned to the world. */
  treeColor?: string
  /** Trunk/canopy shape hint. 'broadleaf' (default) or 'conifer'. */
  treeKind?: 'broadleaf' | 'conifer'
  /** Number of circling birds (default 6). */
  birds?: number
  /** Number of circling dragons (default 0). */
  dragons?: number
}

/**
 * A book: one work set in the world, with its own run of chapters. A world can
 * hold several (a saga spanning multiple books over one shared map), and place
 * references then span books ("Book II · Ch. 3").
 */
export interface Book {
  id: string
  title: string
  /** Short tagline for the book. */
  subtitle?: string
  chapters: Chapter[]
}

/**
 * A complete world definition. Its guided tour can be supplied either as a
 * single `chapters` run (one book) or as several `books`; the engine flattens
 * them into one ordered sequence for playback and references.
 */
export interface Story {
  id: string
  title: string
  /** Short tagline shown in the story picker. */
  subtitle?: string
  /** Longer blurb shown in the info panel when nothing is selected. */
  intro?: string
  terrain: TerrainConfig
  /** Ambient 3D life (trees, birds, dragons). */
  ambient?: Ambient
  markers?: Marker[]
  routes?: Route[]
  regions?: RegionLabel[]
  /** Tracked artifacts whose location moves across the story. */
  elements?: StoryElement[]
  /** Single-book tour. Mutually exclusive with `books`. */
  chapters?: Chapter[]
  /** Multi-book tour over the shared map. Takes precedence over `chapters`. */
  books?: Book[]
}
