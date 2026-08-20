import { useState } from 'react'
import { europeCoast, worldCoast } from '../assets/coastlines'
import type { CoastView } from '../assets/coastlines'
import type { Story } from '../types'
import { useT } from '../i18n'
import { PANEL, layoutAtlas } from './atlasLayout'
import type { PlacedWorld } from './atlasLayout'

interface Props {
  stories: Story[]
  currentId: string
  onPick: (id: string) => void
}

/**
 * Pick a world by where it happens.
 *
 * The list tab answers "where is the one I already know the name of". This
 * answers "what has this atlas got for Denmark", which nothing did: the list
 * groups by genre, which is orthogonal to geography, and past thirty worlds you
 * cannot see the shape of the collection at all. On the map you can — Europe
 * crowded, one pin in Thailand, one in New Zealand, one in Tasmania.
 *
 * TWO PANELS, because one does not work. Projected onto a single 640-wide world
 * map, twenty-four pairs of worlds land closer than 14 px and Švejk and Ottokar
 * come within 2.3 px; central Europe reads as one blob, which is exactly the
 * region holding most of the atlas. A blown-up Europe inset beside the world map
 * is what a printed atlas does about this, and it takes the closest pair to
 * 12.5 px — clear of the 9 px at which two 4.5 px dots touch.
 * `check-atlas-map.mjs` measures both and holds them.
 *
 * NO LABELS ON THE PINS. Twenty labels will not fit in the inset at any size
 * this popup can be, and leader lines for that many are worse than the problem.
 * Instead the map and the name list beside it are wired together both ways:
 * point at a pin and its name lights up, point at a name and its pin does. So
 * identification never depends on reading text off the map.
 */
export function AtlasMap({ stories, currentId, onPick }: Props) {
  const [hover, setHover] = useState<string | null>(null)
  const t = useT()
  const { europe, world, shelf } = layoutAtlas(stories)

  const panel = (
    key: 'world' | 'europe',
    view: CoastView,
    placed: PlacedWorld[],
    title: string,
  ) => {
    const { w, h } = PANEL[key]
    return (
      <div className="atlasmap__panel">
        <h4 className="atlasmap__panel-title">{title}</h4>
        <svg
          className="atlasmap__svg"
          viewBox={`0 0 ${w} ${h}`}
          width={w}
          height={h}
          role="group"
          aria-label={title}
        >
          {/* The coastline paths are in a 0..1 box; one transform scales them
              to the panel rather than regenerating the geometry per size. */}
          <g transform={`scale(${w} ${h})`}>
            <path className="atlasmap__land" d={view.path} vectorEffect="non-scaling-stroke" />
          </g>
          {placed.map(({ story, x, y }) => {
            const active = story.id === currentId
            const lit = hover === story.id
            return (
              <g
                key={story.id}
                className={`atlasmap__pin ${active ? 'is-active' : ''} ${lit ? 'is-lit' : ''}`}
                transform={`translate(${x * w} ${y * h})`}
                onMouseEnter={() => setHover(story.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onPick(story.id)}
                role="button"
                tabIndex={0}
                aria-label={`${story.title} — ${story.earth?.place ?? ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onPick(story.id)
                  }
                }}
                onFocus={() => setHover(story.id)}
                onBlur={() => setHover(null)}
              >
                {/* A generous invisible disc so a 4.5 px dot is still an easy
                    target, especially on a touch screen. Same bargain the map
                    markers make: no pixels drawn, still hit by the pointer. */}
                <circle className="atlasmap__hit" r={11} />
                {/* Radius from state, not CSS: `r` as a CSS property is SVG2
                    and not something to depend on across browsers. */}
                <circle className="atlasmap__dot" r={lit || active ? 6.5 : 4.5} />
              </g>
            )
          })}
        </svg>
      </div>
    )
  }

  const row = (s: Story) => (
    <button
      key={s.id}
      className={`atlasmap__name ${s.id === currentId ? 'is-active' : ''} ${
        hover === s.id ? 'is-lit' : ''
      }`}
      onMouseEnter={() => setHover(s.id)}
      onMouseLeave={() => setHover(null)}
      onFocus={() => setHover(s.id)}
      onBlur={() => setHover(null)}
      onClick={() => onPick(s.id)}
    >
      <span className="atlasmap__name-title">{s.title}</span>
      {s.earth && <span className="atlasmap__name-place">{s.earth.place}</span>}
    </button>
  )

  // Names down the side, in the order they read on the map: Europe first
  // (north to south, so the list runs the way the eye scans the inset), then
  // everything else, then the worlds with nowhere to stand.
  const byNorth = (a: PlacedWorld, b: PlacedWorld) => a.y - b.y

  return (
    <div className="atlasmap">
      <div className="atlasmap__maps">
        {panel('europe', europeCoast, europe, t('atlasEurope'))}
        {panel('world', worldCoast, world, t('atlasWorld'))}
      </div>

      <div className="atlasmap__side">
        <div className="atlasmap__names">
          <h4 className="atlasmap__panel-title">{t('atlasOnEarth')}</h4>
          {[...europe].sort(byNorth).map((p) => row(p.story))}
          {[...world].sort(byNorth).map((p) => row(p.story))}
        </div>
        <div className="atlasmap__names">
          {/* Not a leftovers bin: two of these are the whole Earth rather than
              a point on it, and four are not on Earth at all. Saying so is
              more honest than pinning Middle-earth somewhere near Wales. */}
          <h4 className="atlasmap__panel-title">{t('atlasElsewhere')}</h4>
          {shelf.map(row)}
        </div>
      </div>
    </div>
  )
}
