import type { Story, StoryElement } from '../types'
import { activeStopIndex } from '../engine/elements'
import { useT } from '../i18n'

interface Props {
  element: StoryElement
  story: Story
  /** Active tour index (across books), or null in free exploration. */
  chapterIndex: number | null
  onJumpToChapter: (index: number) => void
  onClose?: () => void
}

/**
 * Detail for a tracked artifact: its paragraph and its full journey across the
 * map. The leg where it currently sits is marked; each leg links to the chapter
 * it moves in, so you can follow the object through the story.
 */
export function ElementDetail({
  element,
  story,
  chapterIndex,
  onJumpToChapter,
  onClose,
}: Props) {
  const t = useT()
  const active = activeStopIndex(element, chapterIndex)
  const markerName = (id?: string) =>
    (id && story.markers?.find((m) => m.id === id)?.name) || undefined

  return (
    <div className="place">
      {onClose && (
        <button className="place__close" onClick={onClose} aria-label={t('close')}>
          ✕
        </button>
      )}
      <span className="panel__kind">
        <span className="element__glyph">{element.glyph ?? '◆'}</span> {t('artifactWord')}
      </span>
      <h2 className="panel__title">{element.name}</h2>
      {element.description && <p className="panel__body">{element.description}</p>}

      <div className="place__refs">
        <h3 className="panel__section">{t('itsJourney')}</h3>
        <ul>
          {element.journey.map((leg, i) => {
            const where = markerName(leg.marker) ?? t('hiddenPlace')
            const since = leg.sinceChapter ?? 0
            return (
              <li key={i}>
                <button onClick={() => onJumpToChapter(since)}>
                  <span className="place__ref-head">
                    <span className="place__ref-num">{t('leg')} {i + 1}</span>
                    <span className="place__ref-title">{where}</span>
                    {i === active && (
                      <span className="element__here">{t('hereNow')}</span>
                    )}
                  </span>
                  {leg.note && <span className="place__ref-quote">{leg.note}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
