import type { Marker, MarkerLink } from '../types'
import type { PlaceReference } from '../engine/references'
import { getStory } from '../stories'
import { useT, useKind } from '../i18n'

interface Props {
  marker: Marker
  references: PlaceReference[]
  /** Jump to (and play) a chapter that mentions this place. */
  onJumpToChapter: (index: number) => void
  /** Cross to the same event on another world's map. */
  onCrossWorld?: (link: MarkerLink) => void
  /** Optional close affordance (used by the story-mode overlay). */
  onClose?: () => void
}

/**
 * Detail for a single place: its paragraph, plus every chapter that mentions
 * it — so a location that recurs across the story reads as one thing seen from
 * several parts. Shared by the free-exploration panel and the story overlay.
 */
export function PlaceDetail({
  marker,
  references,
  onJumpToChapter,
  onCrossWorld,
  onClose,
}: Props) {
  const t = useT()
  const kind = useKind()
  const link = marker.link
  const other = link ? getStory(link.world) : null
  return (
    <div className="place">
      {onClose && (
        <button className="place__close" onClick={onClose} aria-label={t('close')}>
          ✕
        </button>
      )}
      <span className="panel__kind">{kind(marker.kind)}</span>
      <h2 className="panel__title">{marker.name}</h2>

      {marker.description && <p className="panel__body">{marker.description}</p>}

      {link && other && other.id === link.world && onCrossWorld && (
        <button className="place__cross" onClick={() => onCrossWorld(link)}>
          <span className="place__cross-label">{t('alsoTold')}</span>
          <span className="place__cross-world">{other.title}</span>
          {link.note && <span className="place__cross-note">{link.note}</span>}
        </button>
      )}

      <div className="place__refs">
        <h3 className="panel__section">{t('mentionedIn')}</h3>
        {references.length === 0 ? (
          <p className="place__none">{t('notReferenced')}</p>
        ) : (
          <ul>
            {references.map((r) => (
              <li key={`${r.chapterId}:${r.via}`}>
                <button onClick={() => onJumpToChapter(r.index)}>
                  <span className="place__ref-head">
                    <span className="place__ref-num">
                      {r.multiBook ? `Bk ${r.bookIndex + 1}·` : ''}Ch. {r.chapterInBook}
                    </span>
                    <span className="place__ref-title">{r.title}</span>
                    <span className={`place__ref-via place__ref-via--${r.via}`}>
                      {r.via}
                    </span>
                  </span>
                  {r.multiBook && (
                    <span className="place__ref-book">{r.bookTitle}</span>
                  )}
                  {r.snippet && <span className="place__ref-quote">“{r.snippet}”</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
