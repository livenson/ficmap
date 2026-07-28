import type { Story, Marker } from '../types'

interface Props {
  story: Story
  selected: Marker | null
  onClose: () => void
  onJumpTo: (id: string) => void
}

/**
 * Left-hand panel. Shows the world intro when nothing is selected, and the
 * selected marker's detail otherwise, plus a clickable gazetteer of places.
 */
export function InfoPanel({ story, selected, onClose, onJumpTo }: Props) {
  return (
    <aside className="panel">
      {selected ? (
        <div className="panel__detail">
          <button className="panel__back" onClick={onClose}>
            ‹ Back to {story.title}
          </button>
          <span className="panel__kind">{selected.kind}</span>
          <h2 className="panel__title">{selected.name}</h2>
          {selected.chapter && (
            <div className="panel__chapter">Chapter {selected.chapter}</div>
          )}
          {selected.description && (
            <p className="panel__body">{selected.description}</p>
          )}
        </div>
      ) : (
        <div className="panel__intro">
          <h1 className="panel__title">{story.title}</h1>
          {story.subtitle && <p className="panel__subtitle">{story.subtitle}</p>}
          {story.intro && <p className="panel__body">{story.intro}</p>}
        </div>
      )}

      {story.markers && story.markers.length > 0 && (
        <div className="panel__gazetteer">
          <h3 className="panel__section">Places</h3>
          <ul>
            {story.markers.map((m) => (
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
