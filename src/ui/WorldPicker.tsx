import { useEffect, useRef, useState } from 'react'
import type { Story } from '../types'

interface Props {
  stories: Story[]
  currentId: string
  onPick: (id: string) => void
}

/**
 * A custom world dropdown that shows more than a name: each world lists its
 * source author, setting and epoch, so the picker reads like an index of the
 * atlas rather than a bare `<select>`.
 */
export function WorldPicker({ stories, currentId, onPick }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
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

  const sub = (s: Story) => [s.region, s.epoch].filter(Boolean).join(' · ')

  return (
    <div className="worldpicker" ref={ref}>
      <span className="toolbar__caption">World</span>
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
          {stories.map((s) => (
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
      )}
    </div>
  )
}
