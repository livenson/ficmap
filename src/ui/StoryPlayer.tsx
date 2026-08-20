import type { FlatChapter } from '../engine/story'
import { useT } from '../i18n'

interface Props {
  flat: FlatChapter[]
  index: number
  onPrev: () => void
  onNext: () => void
  onJump: (globalIndex: number) => void
  onExit: () => void
}

/**
 * The guided-tour panel. Plays a world's flattened chapter list; when the
 * world has several books, the current book is shown and the chapter rail is
 * grouped under book headings.
 */
export function StoryPlayer({ flat, index, onPrev, onNext, onJump, onExit }: Props) {
  const t = useT()
  const current = flat[index]
  if (!current) return null

  const multiBook = current.bookCount > 1
  const inBook = flat.filter((f) => f.bookIndex === current.bookIndex)
  const atStart = index === 0
  const atEnd = index === flat.length - 1

  return (
    <aside className="panel panel--story">
      <button className="panel__back" onClick={onExit}>
        ✕ {t('exitStory')}
      </button>

      {/* First, above everything that changes with the chapter. Narrations
          differ by several lines and titles and book lines wrap to one, two or
          three, so anywhere below them the Next button slides down the panel as
          you advance and you have to chase it. Held here by structure rather
          than by a min-height guessed from the longest title in the atlas —
          Kalevala's `XLV–XLIX · Nine diseases, a bear, and the dark` took three
          lines and moved it 30px, and Verne's two-line book names moved it 15px
          at a book boundary. Nothing above this line varies. */}
      <div className="story__nav">
        <button onClick={onPrev} disabled={atStart} className="story__btn">
          {t('prev')}
        </button>
        <button
          onClick={atEnd ? onExit : onNext}
          className="story__btn story__btn--primary"
        >
          {atEnd ? t('finish') : t('next')}
        </button>
      </div>

      <div className="story__meta">
        {multiBook && (
          <span className="story__book">
            {t('book')} {current.bookIndex + 1} · {current.bookTitle}
          </span>
        )}
        <span className="story__count">
          {t('chapter')} {current.indexInBook + 1} / {inBook.length}
        </span>
      </div>
      <h2 className="panel__title">{current.chapter.title}</h2>

      <p className="panel__body story__narration">{current.chapter.narration}</p>

      {current.chapter.quote && (
        // The line itself, where the text has one worth hearing. Deliberately
        // never translated by this app: it is quoted from a named edition, and
        // the credit is part of the quote rather than a footnote.
        <blockquote className="story__quote">
          <p className="story__quote-line">{current.chapter.quote.text}</p>
          {current.chapter.quote.original && (
            <p className="story__quote-original">{current.chapter.quote.original}</p>
          )}
          <cite className="story__quote-source">{current.chapter.quote.source}</cite>
        </blockquote>
      )}

      <div className="story__rail">
        {flat.map((f, i) => {
          const bookHeader =
            multiBook && (i === 0 || flat[i - 1].bookIndex !== f.bookIndex)
          return (
            <div key={f.chapter.id}>
              {bookHeader && (
                <div className="story__rail-book">{f.bookTitle}</div>
              )}
              <button
                className={`story__dot ${i === index ? 'is-active' : ''} ${
                  i < index ? 'is-done' : ''
                }`}
                onClick={() => onJump(i)}
                title={f.chapter.title}
              >
                <span className="story__dot-mark" />
                <span className="story__dot-label">{f.chapter.title}</span>
              </button>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
