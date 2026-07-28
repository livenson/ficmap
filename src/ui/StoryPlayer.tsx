import type { Story } from '../types'

interface Props {
  story: Story
  index: number
  onPrev: () => void
  onNext: () => void
  onJump: (i: number) => void
  onExit: () => void
}

/**
 * The guided-tour panel. Replaces the info panel while story mode is active:
 * shows the current chapter's narration, step controls, and a chapter rail.
 */
export function StoryPlayer({
  story,
  index,
  onPrev,
  onNext,
  onJump,
  onExit,
}: Props) {
  const chapters = story.chapters ?? []
  const chapter = chapters[index]
  if (!chapter) return null

  const atStart = index === 0
  const atEnd = index === chapters.length - 1

  return (
    <aside className="panel panel--story">
      <button className="panel__back" onClick={onExit}>
        ✕ Exit story
      </button>

      <div className="story__meta">
        <span className="story__count">
          Chapter {index + 1} / {chapters.length}
        </span>
      </div>
      <h2 className="panel__title">{chapter.title}</h2>
      <p className="panel__body story__narration">{chapter.narration}</p>

      <div className="story__nav">
        <button onClick={onPrev} disabled={atStart} className="story__btn">
          ‹ Prev
        </button>
        <button
          onClick={atEnd ? onExit : onNext}
          className="story__btn story__btn--primary"
        >
          {atEnd ? 'Finish' : 'Next ›'}
        </button>
      </div>

      <div className="story__rail">
        {chapters.map((c, i) => (
          <button
            key={c.id}
            className={`story__dot ${i === index ? 'is-active' : ''} ${
              i < index ? 'is-done' : ''
            }`}
            onClick={() => onJump(i)}
            title={c.title}
          >
            <span className="story__dot-mark" />
            <span className="story__dot-label">{c.title}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
