import { useT } from '../i18n'
import type { LevelMusic } from '../types'

interface Props {
  music: LevelMusic
  onStop: () => void
}

/**
 * The on-screen credit for whatever is playing.
 *
 * Shown whenever the music is on, so the piece and its composer are always
 * visible rather than buried in a file — traditional and public-domain music is
 * still someone's work, and an atlas that plays it should say whose.
 */
export function NowPlaying({ music, onStop }: Props) {
  const t = useT()
  const title = music.title ?? t('untitledTheme')
  return (
    <div className="nowplaying" role="status" aria-live="polite">
      <span className="nowplaying__icon" aria-hidden="true">
        ♪
      </span>
      <span className="nowplaying__text">
        <span className="nowplaying__title">{title}</span>
        {music.credit && <span className="nowplaying__credit">{music.credit}</span>}
      </span>
      <button className="nowplaying__stop" onClick={onStop} aria-label={t('musicOff')}>
        ✕
      </button>
    </div>
  )
}
