import type { ViewMode } from '../components/MapScene'
import type { Story } from '../types'
import { LayersMenu, type Layers } from './LayersMenu'
import { WorldPicker } from './WorldPicker'
import { LANGS, useT, type Lang } from '../i18n'

interface Props {
  stories: Story[]
  currentId: string
  onPick: (id: string) => void
  mode: ViewMode
  onMode: (m: ViewMode) => void
  layers: Layers
  onToggleLayer: (key: keyof Layers) => void
  hasChapters: boolean
  inStory: boolean
  onPlayStory: () => void
  onExitStory: () => void
  lang: Lang
  onLang: (l: Lang) => void
}

export function Toolbar({
  stories,
  currentId,
  onPick,
  mode,
  onMode,
  layers,
  onToggleLayer,
  hasChapters,
  inStory,
  onPlayStory,
  onExitStory,
  lang,
  onLang,
}: Props) {
  const t = useT()
  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__mark">✦</span>
        <span className="toolbar__name">Ficmap</span>
      </div>

      <WorldPicker stories={stories} currentId={currentId} onPick={onPick} />

      {hasChapters && (
        <button
          className={`toolbar__story ${inStory ? 'is-active' : ''}`}
          onClick={inStory ? onExitStory : onPlayStory}
          aria-label={inStory ? t('exitStory') : t('playStory')}
        >
          <span className="toolbar__story-icon">{inStory ? '✕' : '▶'}</span>
          <span className="toolbar__story-text">
            {inStory ? t('exitStory') : t('playStory')}
          </span>
        </button>
      )}

      <div className="toolbar__spacer" />

      <div className="toolbar__toggle" role="group" aria-label={t('language')}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={lang === l.code ? 'is-active' : ''}
            onClick={() => onLang(l.code)}
            aria-pressed={lang === l.code}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="toolbar__toggle" role="tablist" aria-label={t('viewMode')}>
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

      <LayersMenu layers={layers} onToggle={onToggleLayer} />
    </header>
  )
}
