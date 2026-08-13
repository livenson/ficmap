import { useEffect, useMemo, useRef, useState } from 'react'
import type { Story } from '../types'
import { useT } from '../i18n'

interface Props {
  stories: Story[]
  currentId: string
  onPick: (id: string) => void
}

/**
 * Sections of the menu, in the order they appear. A world's `group` puts it in
 * one; anything untagged falls through to "Other worlds" at the bottom.
 */
const GROUPS = [
  { id: 'epic', key: 'groupEpic' },
  { id: 'adventure', key: 'groupAdventure' },
  { id: 'fantasy', key: 'groupFantasy' },
  { id: 'original', key: 'groupOriginal' },
  { id: '', key: 'groupOther' },
] as const

/**
 * A custom world dropdown that shows more than a name: each world lists its
 * source author, setting and epoch, so the picker reads like an index of the
 * atlas rather than a bare `<select>`.
 *
 * Past about ten worlds a flat list stops being readable — the order looks
 * arbitrary because it is just the order they were written. So the menu groups
 * them into sections and offers a filter box that matches title, author and
 * setting, which is faster than scanning once the atlas is large.
 */
export function WorldPicker({ stories, currentId, onPick }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useT()
  const current = stories.find((s) => s.id === currentId) ?? stories[0]

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Opening starts a fresh search, with the caret already in the box.
  useEffect(() => {
    if (!open) return
    setQuery('')
    inputRef.current?.focus()
  }, [open])

  const sub = (s: Story) => [s.region, s.epoch].filter(Boolean).join(' · ')

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = (s: Story) =>
      !q ||
      [s.title, s.author, s.region, s.epoch, s.subtitle]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    return GROUPS.map((g) => ({
      ...g,
      items: stories.filter((s) => (s.group ?? '') === g.id && match(s)),
    })).filter((g) => g.items.length > 0)
  }, [stories, query])

  const hits = sections.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="worldpicker" ref={ref}>
      <span className="toolbar__caption">{t('world')}</span>
      <button
        className="worldpicker__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="worldpicker__current">{current.title}</span>
        {current.author && <span className="worldpicker__by">{current.author}</span>}
        <span className="worldpicker__chevron" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="worldpicker__menu" role="listbox" aria-label="World">
          <input
            ref={inputRef}
            className="worldpicker__search"
            type="search"
            value={query}
            placeholder={t('findWorld')}
            aria-label={t('findWorld')}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              // Enter picks the only remaining match — type three letters, done.
              if (e.key !== 'Enter' || hits !== 1) return
              const only = sections[0].items[0]
              onPick(only.id)
              setOpen(false)
            }}
          />
          {sections.length === 0 && <p className="worldpicker__none">{t('noWorlds')}</p>}
          {sections.map((g) => (
            <div key={g.id || 'other'} className="worldpicker__group">
              <h3 className="worldpicker__group-title">{t(g.key)}</h3>
              {g.items.map((s) => (
                <button
                  key={s.id}
                  role="option"
                  aria-selected={s.id === currentId}
                  data-id={s.id}
                  className={`worldpicker__item ${s.id === currentId ? 'is-active' : ''}`}
                  onClick={() => {
                    onPick(s.id)
                    setOpen(false)
                  }}
                >
                  <span className="worldpicker__item-head">
                    <span className="worldpicker__item-title">{s.title}</span>
                    {s.author && <span className="worldpicker__item-by">{s.author}</span>}
                  </span>
                  {sub(s) && <span className="worldpicker__item-sub">{sub(s)}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
