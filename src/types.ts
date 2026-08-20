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

/**
 * Where on Earth a world is, for the picker's map.
 *
 * Hand-set rather than derived from the world's DEM bounding box, because the
 * centre of a box is often nowhere: Os Lusíadas spans Portugal and the Atlantic
 * sea road to India and its box centre is open ocean, and the Snow Queen runs
 * from Copenhagen to Svalbard and centres in the Norwegian Sea. The pin should
 * say what country this is, which is an editorial call.
 *
 * `check-atlas-map.mjs` then holds each pin INSIDE its world's own DEM box, so
 * an editorial call cannot drift into a wrong one, and holds every world to
 * being reachable from the picker one way or another.
 *
 * Omitted by the worlds that have no point on Earth — Middle-earth, Westeros,
 * Scadrial, Valdurn — and by the two whole-Earth worlds, which are everywhere
 * rather than somewhere. Those are listed beside the map instead.
 */
export interface EarthPin {
  lon: number
  lat: number
  /** What the pin is standing on, shown on hover — e.g. "Estonia". */
  place: string
}

/** A 2D position in normalized map space, range [-1, 1] on each axis. */
export interface MapPoint {
  x: number
  z: number
}

/** A real river, named, with its course in map space from source to mouth. */
export interface NamedRiver {
  /** For the story to refer to, and to keep the data readable. */
  name: string
  /**
   * The marker that stands for this river, if there is one. `check-rivers` holds
   * that marker to being ON the course — which is the whole point of drawing it.
   *
   * Named explicitly rather than matched by text: Te Ika-a-Māui calls its marker
   * "The River", which contains nothing of "Whanganui", so a name match found
   * no marker and cheerfully checked nothing at all.
   */
  marker?: string
  points: MapPoint[]
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
  /**
   * Optional grayscale heightmap image URL. When set, terrain is sampled from
   * the image (0=black=lowest, 1=white=highest) instead of procedural noise —
   * used for real-world elevation (DEM) maps. The seed is then unused.
   */
  heightmap?: string
  /**
   * Optional name of a finer elevation tile set under `public/dem/`, fetched a
   * few tiles at a time for whatever part of the map the camera is over.
   *
   * The whole-Earth heightmap holds about 13 km per pixel — a hundredth of what
   * a country-sized one holds — so it softens as you zoom in no matter how fine
   * the mesh gets. The tiles carry four times its resolution and are cut over
   * the same pinned metre range, so they refine the same ground rather than
   * replacing it. Absent on worlds whose heightmap already out-resolves their
   * mesh, which is all of them but these two.
   */
  detailTiles?: string
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
  /**
   * Real, named rivers, drawn from their actual course rather than traced from
   * the heightmap.
   *
   * A country-sized DEM cannot hold a river: the Faust map is about 0.9 km per
   * pixel and the Elbe is some 200 m wide, so it is a fraction of a pixel and
   * never appears. `rivers` above traces plausible courses downhill from that
   * same heightmap — they look right, and none of them IS any river you could
   * name. So a world that names one has to be given its course.
   *
   * Points are map space, source to mouth. `scripts/build-river.mjs` produces
   * them from published geodata; say in the story where they came from.
   */
  namedRivers?: NamedRiver[]
  /** River line color (default a river blue; e.g. lava-orange for ash worlds). */
  riverColor?: string
  /**
   * Sky mood. 'day' (default) draws a sky + daylight; 'dark' is a warm
   * hellfire underworld (Põrgu, magma caverns); 'cavern' is a cool,
   * phosphorescent underground (an underground sea, ice caves); 'heaven' is a
   * radiant sky realm — a luminous cloud-sea with floating isles.
   */
  sky?: 'day' | 'dark' | 'cavern' | 'heaven'
  /** Color of the water/sea plane (default a sea blue). */
  waterColor?: string
  /**
   * Add fine surface relief with a tiled procedural bump map, so light reveals
   * micro-detail (rockiness, grain) up close without extra geometry. Off by
   * default; the flat-shaded stylized look is the norm.
   */
  detail?: boolean
  /**
   * This level's written theme — a short looping melody, played live. Omit on
   * a floor and it inherits the world's surface tune, with the instrument
   * following `sky` so underworlds sound dark and sky realms airy.
   */
  music?: LevelMusic
  /**
   * World aspect ratio, X width / Z depth. Default 1 (square). Use >1 for a
   * map that is wider than it is tall — e.g. an equirectangular world map,
   * where 360° of longitude over ~140° of latitude wants ~2.57 — so the
   * terrain keeps real proportions instead of stretching into the square.
   */
  aspect?: number
  /**
   * Terrain mesh segments per side (default 320). A wide world multiplies this
   * by its aspect so cells stay square, so the whole-Earth maps already get
   * ~2.6x the columns. Raise it where coastline shape is the point: at the
   * default a world map spends one vertex per ~48 km, which turns Italy into a
   * smooth wedge. Costs (res x res x aspect x 2) triangles, so check
   * `scripts/profile-worlds.mjs` after changing it.
   */
  meshResolution?: number
  /**
   * Start the 3D view well overhead instead of at the usual low, relief-
   * revealing angle. Wide world maps already do this because they are
   * unreadable edge-on; a world with extreme relief has the same problem for
   * the opposite reason — Lake Lucerne's mountains stand as a wall in front of
   * the lake everything in the play happens on. You can still orbit down.
   */
  overhead?: boolean
}

/** Tonal colour of a world's score, used to pick a default instrument. */
export type MusicMood = 'calm' | 'epic' | 'dark' | 'mystic' | 'heaven' | 'wonder'

/** The instrument a melody is played on. */
export type MusicVoice = 'flute' | 'harp' | 'strings' | 'bell' | 'horn'

/**
 * A level's written theme. The melody is a short, looping tune given as
 * space-separated `note:beats` tokens — `A3:2 C4:1 r:1` is A below middle C for
 * two beats, C for one, then a one-beat rest. It is synthesised live (there are
 * no audio files), but the tune itself is composed, not generated.
 */
export interface LevelMusic {
  /** The melody. Omit on a floor to inherit the world's surface tune. */
  melody?: string
  /**
   * What is playing, shown in the on-screen credit while the music runs — e.g.
   * 'Greensleeves'. Always name the source honestly: a traditional tune, a
   * public-domain composer, or an original written for this atlas.
   */
  title?: string
  /**
   * Who it is by, shown beside the title — e.g. 'English traditional',
   * 'Edvard Grieg (1875)', 'Original'. Public-domain and traditional music
   * only; copyrighted themes are not reproduced here.
   */
  credit?: string
  /** An optional slower bass line underneath, same notation. */
  bass?: string
  /** Beats per minute. Default 58. */
  tempo?: number
  /** Instrument; defaults to one chosen from `mood`. */
  voice?: MusicVoice
  /** Tonal colour; defaults from the level's `sky`. */
  mood?: MusicMood
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
/**
 * A crossing from this place to another world's map — for an event two books
 * tell from opposite sides. The Latvian and Estonian national epics both carry
 * the duel between Lāčplēsis and Kalapuisis/Kalevipoeg, so each atlas map can
 * hand the reader over to the other at that point.
 */
export interface MarkerLink {
  /** Story id of the world to open. */
  world: string
  /** Marker to select once there (default: none). */
  marker?: string
  /** Level to open once there (default: the surface). */
  level?: string
  /** One line on what waits at the other end, shown on the jump button. */
  note?: string
}

export interface Marker {
  id: string
  name: string
  kind: MarkerKind
  at: MapPoint
  /** Longer description shown in the info panel. Supports plain text. */
  description?: string
  /** Optional chapter/act tag used for story filtering later. */
  chapter?: string
  /** The same event on another world's map, offered as a jump. */
  link?: MarkerLink
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
/**
 * A line from the source text itself, shown under a chapter's narration.
 *
 * The narration in this atlas paraphrases — it has to, to keep a whole book to
 * a paragraph a beat. But a paraphrase of "Through this ravine he needs must
 * come" is a waste of the line. Where a text has words worth hearing, and they
 * are out of copyright, they go here and are quoted properly.
 *
 * `source` is not optional, and is the point: it names the edition or the
 * translator. A line without one has no business on the map.
 */
export interface Quote {
  /** The line, in the language the reader is being shown it in. */
  text: string
  /** The original, where it is famous in its own right and worth seeing. */
  original?: string
  /** Who wrote or translated this, and from where. Always say. */
  source: string
}

export interface Chapter {
  id: string
  title: string
  /** Narration shown in the panel for this beat. */
  narration: string
  /** A line from the text itself, if there is one worth hearing here. */
  quote?: Quote
  focus?: CameraFocus
  /** Places revealed by (and kept visible from) this chapter onward. */
  reveal?: ChapterReveal
  /** Marker/route ids to emphasize while this chapter is active. */
  highlight?: { markers?: string[]; routes?: string[] }
  /**
   * Which map level this chapter plays on (a level id; default the surface).
   * Entering the chapter switches the floor, so the tour can descend into an
   * underworld and back.
   */
  level?: string
}

/**
 * An additional map level beneath the surface — its own terrain and places,
 * reached via the floor switcher. Used for underworlds, dungeons, sky realms.
 */
export interface Level {
  id: string
  /** Name shown in the floor switcher (e.g. "Põrgu"). */
  title: string
  subtitle?: string
  terrain: TerrainConfig
  ambient?: Ambient
  markers?: Marker[]
  routes?: Route[]
  regions?: RegionLabel[]
  /**
   * Vertical order in the floor switcher, like an elevator button: the surface
   * is 0, floors above it (sky realms) are positive, floors below (underworlds)
   * are negative — higher numbers sit higher in the list. Omit for an
   * underworld and floors are stacked beneath the surface in declaration order.
   */
  tier?: number
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
  /**
   * What the "birds" are: plain birds (default), post owls (Harry Potter) or
   * the maesters' ravens (Westeros).
   */
  birdKind?: 'bird' | 'owl' | 'raven'
  /** Number of circling dragons (default 0). */
  dragons?: number
  /**
   * Map point the dragons circle over, on a tight orbit, instead of ranging
   * across the whole world. Use it when a dragon belongs to one place — the
   * Nibelungenlied's Dragon's Rock is a marker, and the dragon should be
   * visibly on it rather than somewhere over Bavaria.
   */
  dragonAt?: MapPoint
  /** Number of mosquito swarms buzzing near the ground (default 0). */
  mosquitoes?: number
  /**
   * Number of drifting will-o'-the-wisp / fire-spirit lights that hover low
   * over the wet ground — marsh and water (default 0). Used for the Forest
   * Song's Perelesnyk and poterchata.
   */
  wisps?: number
  /**
   * Number of undead figures shambling over the ground (default 0) — the
   * wights of the army of the dead. Confine them with `wightArea`.
   */
  wights?: number
  /** Map-space box the wights are scattered through (default the whole map). */
  wightArea?: { x0: number; x1: number; z0: number; z1: number }
  /** Overcast clouds with animated rain (default false). */
  rain?: boolean
  /**
   * Confine the rain to one box of the map instead of the whole world, so a
   * storm can sit over one quarter of it and the weather visibly worsens as
   * you travel that way. Omit for weather everywhere. The lightning goes local
   * with it — a light over the storm rather than a flash across the scene.
   */
  rainArea?: { x0: number; x1: number; z0: number; z1: number }
  /** Number of fish schools swimming under the sea (default 0). */
  fish?: number
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
  /** Source author / creator, shown in the world picker (e.g. "Jules Verne"). */
  author?: string
  /** Where the world is set, shown in the world picker (e.g. "Wizarding Britain"). */
  region?: string
  /**
   * Where on Earth this world is, for the picker's map tab. Omit for a world
   * that is not on Earth, or is all of it; those are listed beside the map.
   */
  earth?: EarthPin
  /** When it is from — publication or era (e.g. "Published 1997–2007"). */
  epoch?: string
  /**
   * Which section of the world picker this belongs under. With a dozen-plus
   * worlds a flat list reads as arbitrary; the picker groups by this and shows
   * the sections in a fixed order. Anything unset falls under "Other worlds".
   */
  group?: 'epic' | 'adventure' | 'fantasy' | 'original'
  terrain: TerrainConfig
  /** Ambient 3D life (trees, birds, dragons). */
  ambient?: Ambient
  markers?: Marker[]
  routes?: Route[]
  regions?: RegionLabel[]
  /** Name for the implicit surface level in the floor switcher. Default "Surface". */
  surfaceName?: string
  /** Additional map levels below the surface (e.g. an underworld). */
  levels?: Level[]
  /** Tracked artifacts whose location moves across the story. */
  elements?: StoryElement[]
  /** Single-book tour. Mutually exclusive with `books`. */
  chapters?: Chapter[]
  /** Multi-book tour over the shared map. Takes precedence over `chapters`. */
  books?: Book[]
}
