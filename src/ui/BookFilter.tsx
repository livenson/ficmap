import type { BookScope } from '../engine/story'
import { useT } from '../i18n'

interface Props {
  scopes: BookScope[]
  /** Active book index, or null for "all books". */
  value: number | null
  onChange: (index: number | null) => void
}

/**
 * A filter for a many-book world (e.g. a film series): pick one book/film to
 * pare the map down to just its route and stops, or "All" to see the whole
 * atlas at once. Only shown when a world has more than one book.
 */
export function BookFilter({ scopes, value, onChange }: Props) {
  const t = useT()
  if (scopes.length < 2) return null
  return (
    <div className="bookfilter">
      <span className="bookfilter__label">{t('filterByBook')}</span>
      <div className="bookfilter__chips" role="group" aria-label={t('filterByBook')}>
        <button
          className={`bookfilter__chip ${value == null ? 'is-active' : ''}`}
          aria-pressed={value == null}
          onClick={() => onChange(null)}
        >
          {t('allBooks')}
        </button>
        {scopes.map((s) => (
          <button
            key={s.id}
            className={`bookfilter__chip ${value === s.index ? 'is-active' : ''}`}
            aria-pressed={value === s.index}
            onClick={() => onChange(value === s.index ? null : s.index)}
            title={s.title}
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  )
}
