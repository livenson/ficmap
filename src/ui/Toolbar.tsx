import type { ViewMode } from '../components/MapScene'
import type { Story } from '../types'

interface Props {
  stories: Story[]
  currentId: string
  onPick: (id: string) => void
  mode: ViewMode
  onMode: (m: ViewMode) => void
  showLabels: boolean
  onToggleLabels: (v: boolean) => void
  hasChapters: boolean
  inStory: boolean
  onPlayStory: () => void
  onExitStory: () => void
}

export function Toolbar({
  stories,
  currentId,
  onPick,
  mode,
  onMode,
  showLabels,
  onToggleLabels,
  hasChapters,
  inStory,
  onPlayStory,
  onExitStory,
}: Props) {
  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__mark">✦</span>
        <span className="toolbar__name">Ficmap</span>
      </div>

      <label className="toolbar__group">
        <span className="toolbar__caption">World</span>
        <select
          className="toolbar__select"
          value={currentId}
          onChange={(e) => onPick(e.target.value)}
        >
          {stories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>

      {hasChapters && (
        <button
          className={`toolbar__story ${inStory ? 'is-active' : ''}`}
          onClick={inStory ? onExitStory : onPlayStory}
          aria-label={inStory ? 'Exit story' : 'Play story'}
        >
          <span className="toolbar__story-icon">{inStory ? '✕' : '▶'}</span>
          <span className="toolbar__story-text">
            {inStory ? 'Exit story' : 'Play story'}
          </span>
        </button>
      )}

      <div className="toolbar__spacer" />

      <div className="toolbar__toggle" role="tablist" aria-label="View mode">
        <button
          className={mode === '2d' ? 'is-active' : ''}
          onClick={() => onMode('2d')}
          role="tab"
          aria-selected={mode === '2d'}
        >
          2D
        </button>
        <button
          className={mode === '3d' ? 'is-active' : ''}
          onClick={() => onMode('3d')}
          role="tab"
          aria-selected={mode === '3d'}
        >
          3D
        </button>
      </div>

      <label className="toolbar__check">
        <input
          type="checkbox"
          checked={showLabels}
          onChange={(e) => onToggleLabels(e.target.checked)}
        />
        <span className="toolbar__check-text">Labels</span>
      </label>
    </header>
  )
}
