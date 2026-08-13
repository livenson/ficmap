import { useEffect, useMemo, useRef, useState } from 'react'
import { MapScene, type ViewMode } from './components/MapScene'
import { Toolbar } from './ui/Toolbar'
import { InfoPanel } from './ui/InfoPanel'
import { StoryPlayer } from './ui/StoryPlayer'
import { PlaceDetail } from './ui/PlaceDetail'
import { ElementDetail } from './ui/ElementDetail'
import { FloorSwitcher } from './ui/FloorSwitcher'
import { Legend } from './ui/Legend'
import { buildPlaceReferences } from './engine/references'
import { flattenChapters, bookScopes } from './engine/story'
import { BookFilter } from './ui/BookFilter'
import { NowPlaying } from './ui/NowPlaying'
import { getLevels, getLevel, allMarkers, SURFACE_ID } from './engine/levels'
import { stories, getStory } from './stories'
import type { Layers } from './ui/LayersMenu'
import type { MarkerLink, Story } from './types'
import { LangProvider, translate, type Lang } from './i18n'
import { AmbientMusic, musicFor } from './engine/music'

/** URL query key for the view mode, e.g. `?view=2d`. */
const VIEW_PARAM = 'view'
function viewFromUrl(): ViewMode {
  if (typeof window === 'undefined') return '3d'
  return new URLSearchParams(window.location.search).get(VIEW_PARAM) === '2d' ? '2d' : '3d'
}
function writeViewToUrl(mode: ViewMode) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (mode === '3d') url.searchParams.delete(VIEW_PARAM)
  else url.searchParams.set(VIEW_PARAM, mode)
  window.history.replaceState(null, '', url)
}

/** URL query key for the UI language, e.g. `?lang=et`. */
const LANG_PARAM = 'lang'
function langFromUrl(): Lang {
  if (typeof window === 'undefined') return 'en'
  return new URLSearchParams(window.location.search).get(LANG_PARAM) === 'et' ? 'et' : 'en'
}
function writeLangToUrl(lang: Lang) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (lang === 'en') url.searchParams.delete(LANG_PARAM)
  else url.searchParams.set(LANG_PARAM, lang)
  window.history.replaceState(null, '', url)
}

/** URL query key for deep-linking a world, e.g. `?world=kalevipoeg`. */
const WORLD_PARAM = 'world'

/** A valid world id from the current URL, or null if absent/unknown. */
function worldFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const id = new URLSearchParams(window.location.search).get(WORLD_PARAM)
  return id && stories.some((s) => s.id === id) ? id : null
}

/** URL query key for deep-linking a floor of a multi-level world. */
const FLOOR_PARAM = 'floor'

/** A valid floor id for this story from the URL, or null if absent/unknown. */
function floorFromUrl(story: Story): string | null {
  if (typeof window === 'undefined') return null
  const id = new URLSearchParams(window.location.search).get(FLOOR_PARAM)
  if (!id) return null
  return getLevels(story).some((l) => l.id === id) ? id : null
}

/**
 * Reflect the selected world in the URL (?world=id), dropping any stale floor
 * from the previous world.
 */
function writeWorldToUrl(id: string) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set(WORLD_PARAM, id)
  url.searchParams.delete(FLOOR_PARAM)
  window.history.replaceState(null, '', url)
}

/** Reflect the active floor in the URL (?floor=id); the surface clears it. */
function writeFloorToUrl(id: string) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (id === SURFACE_ID) url.searchParams.delete(FLOOR_PARAM)
  else url.searchParams.set(FLOOR_PARAM, id)
  window.history.replaceState(null, '', url)
}

export default function App() {
  // Initial world and floor come from the URL (?world=…&floor=…) when present.
  const initial = useMemo(() => {
    const s = getStory(worldFromUrl() ?? stories[0].id)
    return { storyId: s.id, levelId: floorFromUrl(s) ?? SURFACE_ID }
  }, [])
  const [storyId, setStoryId] = useState(initial.storyId)
  const [lang, setLang] = useState<Lang>(() => langFromUrl())
  const pickLang = (l: Lang) => {
    setLang(l)
    writeLangToUrl(l)
  }
  const [mode, setModeState] = useState<ViewMode>(() => viewFromUrl())
  const setMode = (m: ViewMode) => {
    setModeState(m)
    writeViewToUrl(m)
  }
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  // Collapse the side/bottom panel to give the map the full stage. Works on
  // desktop (left sidebar) and mobile (bottom sheet) via the same toggle.
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // Procedural ambient score. Off until asked for — browsers require a user
  // gesture to start audio, and unrequested sound is unwelcome anyway.
  const [musicOn, setMusicOn] = useState(false)
  const musicRef = useRef<AmbientMusic | null>(null)
  // Toggleable map detail layers (strip back to a clean map).
  const [layers, setLayers] = useState<Layers>({
    labels: true,
    nature: true,
    rivers: true,
    artifacts: true,
  })
  const toggleLayer = (key: keyof Layers) =>
    setLayers((l) => ({ ...l, [key]: !l[key] }))
  // null = free exploration; a number = playing that chapter.
  const [chapterIndex, setChapterIndex] = useState<number | null>(null)
  // Which map level (floor) is displayed.
  const [levelId, setLevelId] = useState<string>(initial.levelId)

  // Filter the atlas to a single book/film (null = all). Reset when the world
  // changes or the tour starts (the tour drives its own book).
  const [bookFilter, setBookFilter] = useState<number | null>(null)

  const story = getStory(storyId)
  const flat = useMemo(() => flattenChapters(story), [story])
  const scopes = useMemo(() => bookScopes(story), [story])
  const levels = useMemo(() => getLevels(story), [story])
  const activeLevelRaw = getLevel(story, levelId)
  const inStory = chapterIndex != null

  // In free exploration, a book filter pares the level down to that book's own
  // places, routes and regions. The tour ignores it (it reveals its own).
  const activeLevel = useMemo(() => {
    if (inStory || bookFilter == null) return activeLevelRaw
    const sc = scopes.find((s) => s.index === bookFilter)
    if (!sc) return activeLevelRaw
    return {
      ...activeLevelRaw,
      markers: activeLevelRaw.markers.filter((m) => sc.markerIds.has(m.id)),
      routes: activeLevelRaw.routes.filter((r) => sc.routeIds.has(r.id)),
      regions: activeLevelRaw.regions.filter((r) => sc.regionIds.has(r.id)),
    }
  }, [activeLevelRaw, inStory, bookFilter, scopes])

  const selected = useMemo(
    () => allMarkers(story).find((m) => m.id === selectedId) ?? null,
    [story, selectedId],
  )

  // A chapter can play on a deeper level; entering it switches the floor.
  useEffect(() => {
    if (chapterIndex == null) return
    const ch = flat[chapterIndex]?.chapter
    setLevelId(ch?.level ?? SURFACE_ID)
    // If a place popup is open during the tour, keep it in sync with the beat —
    // follow the chapter's focused place as you step from one point to the next,
    // and close it on a beat that focuses no particular place (rather than
    // leaving a stale card stuck on the last place you clicked).
    setSelectedId((cur) => (cur == null ? cur : ch?.focus?.marker ?? null))
  }, [chapterIndex, flat])
  const selectedElement = useMemo(
    () => story.elements?.find((e) => e.id === selectedElementId) ?? null,
    [story, selectedElementId],
  )
  // --- Ambient score -------------------------------------------------------
  // The mood follows the level, so descending into an underworld or climbing to
  // a sky realm changes the music with the light.
  // A floor without its own tune inherits the world's surface melody, with the
  // instrument following the floor's sky.
  const levelMusic = useMemo(
    () => musicFor(activeLevel.terrain.music, story.terrain.music, activeLevel.terrain.sky),
    [activeLevel.terrain.music, activeLevel.terrain.sky, story.terrain.music],
  )
  useEffect(() => {
    const m = musicRef.current
    if (!m) return
    if (musicOn) m.start(levelMusic)
    else m.stop()
  }, [musicOn, levelMusic])
  // Release the audio device when the app goes away.
  useEffect(() => {
    musicRef.current = new AmbientMusic()
    return () => {
      musicRef.current?.dispose()
      musicRef.current = null
    }
  }, [])

  // Which chapters mention each place — computed once per story.
  const references = useMemo(() => buildPlaceReferences(story), [story])

  // Marker and artifact selection are mutually exclusive.
  const selectMarker = (id: string | null) => {
    setSelectedId(id)
    if (id) setSelectedElementId(null)
  }
  const selectElement = (id: string | null) => {
    setSelectedElementId(id)
    if (id) setSelectedId(null)
  }

  function pickStory(id: string) {
    setStoryId(id)
    setSelectedId(null)
    setSelectedElementId(null)
    setChapterIndex(null)
    setLevelId(SURFACE_ID)
    setBookFilter(null)
    writeWorldToUrl(id)
  }

  // Cross to the same event on another world's map — the two national epics
  // that share the duel hand the reader back and forth here. Land on the named
  // place with its card already open, so the crossing lands somewhere, not just
  // on the other world's default view.
  function crossWorld(link: MarkerLink) {
    const target = getStory(link.world)
    if (target.id !== link.world) return
    pickStory(link.world)
    if (link.level) {
      setLevelId(link.level)
      writeFloorToUrl(link.level)
    }
    if (link.marker) setSelectedId(link.marker)
  }

  // Filter to a book/film; a place no longer on the map loses its open card.
  const pickBook = (index: number | null) => {
    setBookFilter(index)
    setSelectedId(null)
    setSelectedElementId(null)
  }

  const selectFloor = (id: string) => {
    setLevelId(id)
    selectMarker(null)
    selectElement(null)
    writeFloorToUrl(id)
  }

  // Keep world + floor in sync with the URL on back/forward or manual edits, so
  // a shared `?world=…&floor=…` link deep-links straight there.
  useEffect(() => {
    const onPop = () => {
      const w = worldFromUrl()
      if (w && w !== storyId) {
        pickStory(w)
        return
      }
      const f = floorFromUrl(story)
      if (f && f !== levelId) {
        setLevelId(f)
        selectMarker(null)
        selectElement(null)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // pickStory/story/levelId are stable enough here; re-bind on change.
  }, [storyId, story, levelId])

  function startStory() {
    setSelectedId(null)
    setSelectedElementId(null)
    setChapterIndex(0)
  }
  const exitStory = () => setChapterIndex(null)
  // Jump to a chapter (from a place reference or an artifact's journey leg).
  const jumpToChapter = (index: number) => setChapterIndex(index)
  const step = (delta: number) =>
    setChapterIndex((i) =>
      i == null ? i : Math.max(0, Math.min(flat.length - 1, i + delta)),
    )

  // Arrow keys drive the tour while it's playing.
  useEffect(() => {
    if (!inStory) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Escape') exitStory()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inStory, flat.length])

  const detailOverlay = selectedElement ? (
    <ElementDetail
      element={selectedElement}
      story={story}
      chapterIndex={chapterIndex}
      onJumpToChapter={jumpToChapter}
      onClose={() => selectElement(null)}
    />
  ) : selected ? (
    <PlaceDetail
      marker={selected}
      references={references[selected.id] ?? []}
      onJumpToChapter={jumpToChapter}
      onCrossWorld={crossWorld}
      onClose={() => selectMarker(null)}
    />
  ) : null

  return (
    <LangProvider lang={lang}>
    <div className="app">
      <Toolbar
        stories={stories}
        currentId={storyId}
        onPick={pickStory}
        mode={mode}
        onMode={setMode}
        layers={layers}
        onToggleLayer={toggleLayer}
        hasChapters={flat.length > 0}
        inStory={inStory}
        onPlayStory={startStory}
        onExitStory={exitStory}
        lang={lang}
        onLang={pickLang}
        musicOn={musicOn}
        onMusic={() => setMusicOn((v) => !v)}
      />

      <div className={`stage${sidebarOpen ? '' : ' stage--collapsed'}`}>
        {/* Collapse is only offered in free exploration — during a guided tour
            the narration IS the point, so the story panel always stays open. */}
        {!inStory && (
          <button
            className="panel-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={translate(sidebarOpen ? 'hidePanel' : 'showPanel', lang)}
            title={translate(sidebarOpen ? 'hidePanel' : 'showPanel', lang)}
          >
            <span className="panel-toggle__chev">{sidebarOpen ? '‹' : '›'}</span>
          </button>
        )}
        {inStory ? (
          <StoryPlayer
            flat={flat}
            index={chapterIndex!}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onJump={(i) => setChapterIndex(i)}
            onExit={exitStory}
          />
        ) : (
          <InfoPanel
            story={story}
            markers={activeLevel.markers}
            selected={selected}
            selectedElement={selectedElement}
            references={references}
            chapterIndex={chapterIndex}
            onClose={() => {
              selectMarker(null)
              selectElement(null)
            }}
            onJumpTo={selectMarker}
            onSelectElement={selectElement}
            onJumpToChapter={jumpToChapter}
            onCrossWorld={crossWorld}
          />
        )}

        <div className="canvas-wrap">
          {/* key forces a clean scene remount when switching worlds. */}
          <MapScene
            key={story.id}
            story={story}
            level={activeLevel}
            mode={mode}
            selectedId={selectedId}
            onSelect={selectMarker}
            selectedElementId={selectedElementId}
            onSelectElement={selectElement}
            layers={layers}
            chapterIndex={chapterIndex}
          />
          <Legend terrain={activeLevel.terrain} />
          <FloorSwitcher levels={levels} activeId={levelId} onSelect={selectFloor} />
          {!inStory && (
            <BookFilter scopes={scopes} value={bookFilter} onChange={pickBook} />
          )}

          {/* Credit whatever is playing, for as long as it plays. */}
          {musicOn && <NowPlaying music={levelMusic} onStop={() => setMusicOn(false)} />}

          {/* In story mode the detail shows as an overlay so the tour panel
              stays put. In free mode the InfoPanel handles it. */}
          {inStory && detailOverlay && (
            <div className="place-overlay">{detailOverlay}</div>
          )}

          <div className="hint">
            {translate('hintPan', lang)} · {translate('hintZoom', lang)}
            {mode === '3d' ? ` · ${translate('hintOrbit', lang)}` : ''}
            {inStory ? ` · ${translate('hintChapters', lang)}` : ''}
          </div>
        </div>
      </div>
    </div>
    </LangProvider>
  )
}
