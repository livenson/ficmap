import { useEffect, useMemo, useState } from 'react'
import { MapScene, type ViewMode } from './components/MapScene'
import { Toolbar } from './ui/Toolbar'
import { InfoPanel } from './ui/InfoPanel'
import { StoryPlayer } from './ui/StoryPlayer'
import { PlaceDetail } from './ui/PlaceDetail'
import { ElementDetail } from './ui/ElementDetail'
import { FloorSwitcher } from './ui/FloorSwitcher'
import { Legend } from './ui/Legend'
import { buildPlaceReferences } from './engine/references'
import { flattenChapters } from './engine/story'
import { getLevels, getLevel, allMarkers, SURFACE_ID } from './engine/levels'
import { stories, getStory } from './stories'
import type { Layers } from './ui/LayersMenu'

export default function App() {
  const [storyId, setStoryId] = useState(stories[0].id)
  const [mode, setMode] = useState<ViewMode>('3d')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
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
  const [levelId, setLevelId] = useState<string>(SURFACE_ID)

  const story = getStory(storyId)
  const flat = useMemo(() => flattenChapters(story), [story])
  const levels = useMemo(() => getLevels(story), [story])
  const activeLevel = getLevel(story, levelId)
  const inStory = chapterIndex != null

  const selected = useMemo(
    () => allMarkers(story).find((m) => m.id === selectedId) ?? null,
    [story, selectedId],
  )

  // A chapter can play on a deeper level; entering it switches the floor.
  useEffect(() => {
    if (chapterIndex == null) return
    const chapterLevel = flat[chapterIndex]?.chapter.level ?? SURFACE_ID
    setLevelId(chapterLevel)
  }, [chapterIndex, flat])
  const selectedElement = useMemo(
    () => story.elements?.find((e) => e.id === selectedElementId) ?? null,
    [story, selectedElementId],
  )
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
  }

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
      onClose={() => selectMarker(null)}
    />
  ) : null

  return (
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
      />

      <div className="stage">
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
          <FloorSwitcher
            levels={levels}
            activeId={levelId}
            onSelect={(id) => {
              setLevelId(id)
              selectMarker(null)
              selectElement(null)
            }}
          />

          {/* In story mode the detail shows as an overlay so the tour panel
              stays put. In free mode the InfoPanel handles it. */}
          {inStory && detailOverlay && (
            <div className="place-overlay">{detailOverlay}</div>
          )}

          <div className="hint">
            drag to pan · scroll to zoom{mode === '3d' ? ' · right-drag to orbit' : ''}
            {inStory ? ' · ← → chapters' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
