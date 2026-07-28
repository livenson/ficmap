import { useMemo, useState } from 'react'
import { MapScene, type ViewMode } from './components/MapScene'
import { Toolbar } from './ui/Toolbar'
import { InfoPanel } from './ui/InfoPanel'
import { Legend } from './ui/Legend'
import { stories, getStory } from './stories'

export default function App() {
  const [storyId, setStoryId] = useState(stories[0].id)
  const [mode, setMode] = useState<ViewMode>('3d')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showLabels, setShowLabels] = useState(true)

  const story = getStory(storyId)
  const selected = useMemo(
    () => story.markers?.find((m) => m.id === selectedId) ?? null,
    [story, selectedId],
  )

  function pickStory(id: string) {
    setStoryId(id)
    setSelectedId(null)
  }

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
      />

      <div className="stage">
        <InfoPanel
          story={story}
          selected={selected}
          onClose={() => setSelectedId(null)}
          onJumpTo={setSelectedId}
        />

        <div className="canvas-wrap">
          {/* key forces a clean scene remount when switching worlds. */}
          <MapScene
            key={story.id}
            story={story}
            mode={mode}
            selectedId={selectedId}
            onSelect={setSelectedId}
            showLabels={showLabels}
          />
          <Legend terrain={story.terrain} />
          <div className="hint">
            drag to pan · scroll to zoom{mode === '3d' ? ' · right-drag to orbit' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
