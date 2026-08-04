import type { ResolvedLevel } from '../engine/levels'
import { useT } from '../i18n'

interface Props {
  levels: ResolvedLevel[]
  activeId: string
  onSelect: (id: string) => void
}

/**
 * A vertical floor selector, surface on top and deeper levels below — like the
 * floor picker on an indoor map. Only shown when a world has more than one
 * level (e.g. a surface and an underworld).
 */
export function FloorSwitcher({ levels, activeId, onSelect }: Props) {
  if (levels.length < 2) return null
  // Display like an elevator: highest tier (sky realms) on top, the surface in
  // the middle, underworlds at the bottom. Ties keep declaration order.
  const ordered = [...levels].sort((a, b) => b.tier - a.tier)
  return (
    <div className="floors" role="group" aria-label={useT()('mapLevel')}>
      {ordered.map((l) => (
        <button
          key={l.id}
          className={`floors__btn ${l.id === activeId ? 'is-active' : ''}`}
          onClick={() => onSelect(l.id)}
          title={l.title}
        >
          {l.title}
        </button>
      ))}
    </div>
  )
}
