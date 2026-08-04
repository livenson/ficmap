import type { Marker } from '../types'
import type { PlaceReference } from '../engine/references'
import { useT, useKind } from '../i18n'

interface Props {
  marker: Marker
  references: PlaceReference[]
  /** Jump to (and play) a chapter that mentions this place. */
  onJumpToChapter: (index: number) => void
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
  onClose,
}: Props) {
  const t = useT()
  const kind = useKind()
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
