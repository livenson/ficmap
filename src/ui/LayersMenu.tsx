import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

export interface Layers {
  labels: boolean
  nature: boolean
  rivers: boolean
  artifacts: boolean
}

interface Props {
  layers: Layers
  onToggle: (key: keyof Layers) => void
}

const ITEMS: { key: keyof Layers; tkey: string }[] = [
  { key: 'labels', tkey: 'labels' },
  { key: 'nature', tkey: 'treesWildlife' },
  { key: 'rivers', tkey: 'rivers' },
  { key: 'artifacts', tkey: 'artifacts' },
]

/**
 * A compact "Layers" popover for toggling map detail on and off — so the view
 * can go from richly dressed down to a clean map. Consolidates the toggles into
 * one control that stays tidy on mobile.
 */
export function LayersMenu({ layers, onToggle }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const t = useT()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const activeCount = ITEMS.filter((i) => layers[i.key]).length

  return (
    <div className="layers" ref={ref}>
      <button
        className={`layers__btn ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('mapLayers')}
      >
        <span className="layers__icon">▦</span>
        <span className="layers__text">{t('layers')}</span>
        <span className="layers__badge">{activeCount}</span>
      </button>
      {open && (
        <div className="layers__menu" role="menu">
          {ITEMS.map((it) => (
            <label key={it.key} className="layers__item">
              <input
                type="checkbox"
                checked={layers[it.key]}
                onChange={() => onToggle(it.key)}
              />
              {t(it.tkey)}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
