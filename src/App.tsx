import { useEffect, useMemo, useState } from 'react'
import { MapScene, type ViewMode } from './components/MapScene'
import { Toolbar } from './ui/Toolbar'
import { InfoPanel } from './ui/InfoPanel'
import { StoryPlayer } from './ui/StoryPlayer'
import { PlaceDetail } from './ui/PlaceDetail'
import { Legend } from './ui/Legend'
import { buildPlaceReferences } from './engine/references'
import { stories, getStory } from './stories'

export default function App() {
  const [storyId, setStoryId] = useState(stories[0].id)
  const [mode, setMode] = useState<ViewMode>('3d')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  // null = free exploration; a number = playing that chapter.
  const [chapterIndex, setChapterIndex] = useState<number | null>(null)

  const story = getStory(storyId)
  const chapters = story.chapters ?? []
  const inStory = chapterIndex != null

  const selected = useMemo(
    () => story.markers?.find((m) => m.id === selectedId) ?? null,
    [story, selectedId],
  )
  // Which chapters mention each place — computed once per story.
  const references = useMemo(() => buildPlaceReferences(story), [story])

  function pickStory(id: string) {
    setStoryId(id)
    setSelectedId(null)
    setChapterIndex(null)
  }

  function startStory() {
    setSelectedId(null)
    setChapterIndex(0)
  }
  const exitStory = () => setChapterIndex(null)
  // Jump to a chapter that mentions the selected place (enters story mode).
  const jumpToChapter = (index: number) => setChapterIndex(index)
  const step = (delta: number) =>
    setChapterIndex((i) =>
      i == null ? i : Math.max(0, Math.min(chapters.length - 1, i + delta)),
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
  }, [inStory, chapters.length])

  return (
    <div className="app">
      <Toolbar
        stories={stories}
        currentId={storyId}
        onPick={pickStory}
        mode={mode}
        onMode={setMode}
        showLabels={showLabels}
        onToggleLabels={setShowLabels}
        hasChapters={chapters.length > 0}
        inStory={inStory}
        onPlayStory={startStory}
        onExitStory={exitStory}
      />

      <div className="stage">
        {inStory ? (
          <StoryPlayer
            story={story}
            index={chapterIndex!}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onJump={(i) => setChapterIndex(i)}
            onExit={exitStory}
          />
        ) : (
          <InfoPanel
            story={story}
            selected={selected}
            references={references}
            onClose={() => setSelectedId(null)}
            onJumpTo={setSelectedId}
            onJumpToChapter={jumpToChapter}
          />
        )}

        <div className="canvas-wrap">
          {/* key forces a clean scene remount when switching worlds. */}
          <MapScene
            key={story.id}
            story={story}
            mode={mode}
            selectedId={selectedId}
            onSelect={setSelectedId}
            showLabels={showLabels}
            chapterIndex={chapterIndex}
          />
          <Legend terrain={story.terrain} />

          {/* In story mode, clicking a place shows its detail as an overlay so
              the tour panel stays put. In free mode the InfoPanel handles it. */}
          {inStory && selected && (
            <div className="place-overlay">
              <PlaceDetail
                marker={selected}
                references={references[selected.id] ?? []}
                onJumpToChapter={jumpToChapter}
                onClose={() => setSelectedId(null)}
              />
            </div>
          )}

          <div className="hint">
            drag to pan · scroll to zoom{mode === '3d' ? ' · right-drag to orbit' : ''}
            {inStory ? ' · ← → chapters · click a place for its references' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
