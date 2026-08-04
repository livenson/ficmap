import type { TerrainConfig } from '../types'
import { useT } from '../i18n'

/** A compact elevation legend derived from the story's biome bands. */
export function Legend({ terrain }: { terrain: TerrainConfig }) {
  const t = useT()
  const bands = [...terrain.biomes]
    .sort((a, b) => b.maxHeight - a.maxHeight)
    .filter((b) => b.name)
  return (
    <div className="legend">
      <div className="legend__title">{t('elevation')}</div>
      {bands.map((b) => (
        <div className="legend__row" key={b.name}>
          <span className="legend__swatch" style={{ background: b.color }} />
          {b.name}
        </div>
      ))}
    </div>
  )
}
