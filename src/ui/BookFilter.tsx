import { useState } from 'react'
import type { BookScope } from '../engine/story'
import { useT } from '../i18n'

interface Props {
  scopes: BookScope[]
  /** Active book index, or null for "all books". */
  value: number | null
  onChange: (index: number | null) => void
}

/**
 * A filter for a many-book world (e.g. a film series). Collapsed by default to
 * a compact chip so it doesn't crowd the map (important on mobile); tapping it
 * opens the list of books/films to pare the map down to just one — or "All" to
 * see the whole atlas. Only shown when a world has more than one book.
 */
export function BookFilter({ scopes, value, onChange }: Props) {
  const t = useT()
  const [open, setOpen] = useState(false)
  if (scopes.length < 2) return null

  const activeLabel =
    value == null ? t('allBooks') : scopes.find((s) => s.index === value)?.title ?? t('allBooks')
  const filtered = value != null

  const pick = (index: number | null) => {
    onChange(index)
    setOpen(false)
  }

  return (
    <div className={`bookfilter ${open ? 'is-open' : ''}`}>
      <button
        className={`bookfilter__toggle ${filtered ? 'is-filtered' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        title={t('filterByBook')}
      >
        <span className="bookfilter__funnel" aria-hidden>
          ⧩
        </span>
        <span className="bookfilter__toggle-label">{activeLabel}</span>
        <span className="bookfilter__caret" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <>
          <div className="bookfilter__backdrop" onClick={() => setOpen(false)} />
          <div className="bookfilter__menu" role="group" aria-label={t('filterByBook')}>
            <button
              className={`bookfilter__item ${value == null ? 'is-active' : ''}`}
              aria-pressed={value == null}
              onClick={() => pick(null)}
            >
              {t('allBooks')}
            </button>
            {scopes.map((s) => (
              <button
                key={s.id}
                className={`bookfilter__item ${value === s.index ? 'is-active' : ''}`}
                aria-pressed={value === s.index}
                onClick={() => pick(s.index)}
              >
                {s.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
