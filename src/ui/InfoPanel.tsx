import type { Story, Marker, StoryElement } from '../types'
import type { PlaceReference } from '../engine/references'
import { PlaceDetail } from './PlaceDetail'
import { ElementDetail } from './ElementDetail'

interface Props {
  story: Story
  /** Places listed in the gazetteer — the markers on the current level. */
  markers: Marker[]
  selected: Marker | null
  selectedElement: StoryElement | null
  references: Record<string, PlaceReference[]>
  chapterIndex: number | null
  onClose: () => void
  onJumpTo: (id: string) => void
  onSelectElement: (id: string) => void
  onJumpToChapter: (index: number) => void
}

/**
 * Left-hand panel. Shows the world intro when nothing is selected; a place's
 * detail (paragraph + chapter references) or a tracked artifact's detail
 * (paragraph + journey) when one is selected; plus clickable lists of places
 * and artifacts.
 */
export function InfoPanel({
  story,
  markers,
  selected,
  selectedElement,
  references,
  chapterIndex,
  onClose,
  onJumpTo,
  onSelectElement,
  onJumpToChapter,
}: Props) {
  const elements = story.elements ?? []

  return (
    <aside className="panel">
      {selectedElement ? (
        <div className="panel__detail">
          <button className="panel__back" onClick={onClose}>
            ‹ Back to {story.title}
          </button>
          <ElementDetail
            element={selectedElement}
            story={story}
            chapterIndex={chapterIndex}
            onJumpToChapter={onJumpToChapter}
          />
        </div>
      ) : selected ? (
        <div className="panel__detail">
          <button className="panel__back" onClick={onClose}>
            ‹ Back to {story.title}
          </button>
          <PlaceDetail
            marker={selected}
            references={references[selected.id] ?? []}
            onJumpToChapter={onJumpToChapter}
          />
        </div>
      ) : (
        <div className="panel__intro">
          <h1 className="panel__title">{story.title}</h1>
          {story.subtitle && <p className="panel__subtitle">{story.subtitle}</p>}
          {story.intro && <p className="panel__body">{story.intro}</p>}
        </div>
      )}

      {elements.length > 0 && (
        <div className="panel__gazetteer">
          <h3 className="panel__section">Artifacts</h3>
          <ul>
            {elements.map((e) => (
              <li key={e.id}>
                <button
                  className={selectedElement?.id === e.id ? 'is-active' : ''}
                  onClick={() => onSelectElement(e.id)}
                >
                  <span>
                    <span className="element__glyph">{e.glyph ?? '◆'}</span> {e.name}
                  </span>
                  <span className="panel__gazetteer-kind">track</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {markers.length > 0 && (
        <div className="panel__gazetteer">
          <h3 className="panel__section">Places</h3>
          <ul>
            {markers.map((m) => (
              <li key={m.id}>
                <button
                  className={selected?.id === m.id ? 'is-active' : ''}
                  onClick={() => onJumpTo(m.id)}
                >
                  {m.name}
                  <span className="panel__gazetteer-kind">{m.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
