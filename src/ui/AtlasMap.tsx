import { useEffect, useRef, useState } from 'react'
import { europeCoast, worldCoast } from '../assets/coastlines'
import type { CoastView } from '../assets/coastlines'
import type { Story } from '../types'
import { useT } from '../i18n'
import { PANEL, layoutAtlas, project } from './atlasLayout'
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
 * region holding most of the atlas. A blown-up Europe inset above the world map
 * is what a printed atlas does about this, and it takes the closest pair to
 * 12.5 px — clear of the 9 px at which two 4.5 px dots touch.
 * `check-atlas-map.mjs` measures both and holds them.
 *
 * ON LABELS, which the first version of this got wrong. Twenty labels will not
 * fit in the inset at any size this popup can be — that part was right — and the
 * conclusion drawn from it was that the name list beside the map could do the
 * identifying instead. Measured, it could not: for 8 of the 24 pins the matching
 * row was scrolled out of the column, so hovering Spain, Portugal, Italy,
 * Greece, Iceland, Thailand, New Zealand or Tasmania named nothing at all. ONE
 * label at a time is a different thing from twenty, and it is the one that was
 * needed. The list stays, as the scannable, keyboard-reachable index.
 *
 * TOUCH has no hover, so the label would never appear and one tap would change
 * the world under the reader's finger. First tap names, second opens.
 *
 * All of the above is held by `check-picker-map.mjs`, in the browser, because
 * every one of these is a property of the rendered layout rather than of the
 * data. It is what found the pointer bug described on `nearest` below.
 */
/**
 * How near the pointer must come to a pin to grab it, in panel pixels.
 *
 * Comfortably bigger than the 6.5 px dot so the target is not the drawing, and
 * bigger than the 12.5 px closest pair is allowed to be, because nearest-wins
 * splits the difference between two pins instead of letting their targets
 * overlap.
 */
const GRAB = 16

export function AtlasMap({ stories, currentId, onPick }: Props) {
  // The pin under the pointer — or, on a touch screen where there is no
  // pointer, the one tapped once and not yet confirmed.
  const [hover, setHover] = useState<string | null>(null)
  const sideRef = useRef<HTMLDivElement>(null)
  const t = useT()
  const { europe, world, shelf } = layoutAtlas(stories)

  // Open onto the world you are already in, rather than onto the top of a list
  // the reader did not ask about. Scrolled by hand rather than with
  // `scrollIntoView`, which walks up and scrolls every scrollable ancestor —
  // here that includes the popup itself, and moving the whole menu to reveal
  // one row is not what this is for.
  useEffect(() => {
    const side = sideRef.current
    const el = side?.querySelector<HTMLElement>('.atlasmap__name.is-active')
    if (!side || !el) return
    side.scrollTop = el.offsetTop - side.clientHeight / 2 + el.offsetHeight / 2
  }, [currentId])

  /**
   * Touch has no hover, so one tap would change the world under the reader's
   * finger with no chance to see what the pin was. First tap names it, second
   * opens it. A mouse is never affected: it hovers on the way in, so by the
   * time the click lands the pin is already the hovered one.
   */
  const activate = (id: string) => {
    if (hover === id) onPick(id)
    else setHover(id)
  }

  const panel = (key: 'world' | 'europe', view: CoastView, placed: PlacedWorld[], title: string) => {
    const { w, h } = PANEL[key]
    const lit = placed.find((p) => p.story.id === hover)

    /**
     * Which pin is the pointer nearest, if any — resolved on the panel rather
     * than by giving each pin its own hit area.
     *
     * Per-pin discs were the first attempt and they cannot work at this
     * density. The closest pair on the inset is 12.5 px apart, so a disc
     * generous enough to catch a fingertip (13 px) completely covered its
     * neighbour's centre, and whichever pin was drawn second silently ate the
     * other: hovering Ottokar reported Švejk. Sizing the discs down to fit
     * (under 6.25 px each) would trade the bug for targets too small to hit.
     *
     * Nearest-wins has neither problem. Every point on the panel belongs to
     * exactly one pin, GRAB can stay generous, and adding a world can never
     * steal another's target.
     */
    const nearest = (e: { clientX: number; clientY: number; currentTarget: SVGSVGElement }) => {
      const r = e.currentTarget.getBoundingClientRect()
      const mx = ((e.clientX - r.left) / r.width) * w
      const my = ((e.clientY - r.top) / r.height) * h
      let best = null
      let bestD = GRAB
      for (const p of placed) {
        const d = Math.hypot(p.x * w - mx, p.y * h - my)
        if (d < bestD) {
          bestD = d
          best = p.story.id
        }
      }
      return best
    }

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
          onMouseMove={(e) => setHover(nearest(e))}
          onMouseLeave={() => setHover(null)}
          onClick={(e) => {
            const id = nearest(e)
            if (id) activate(id)
          }}
        >
          {/* The coastline paths are in a 0..1 box; one transform scales them
              to the panel rather than regenerating the geometry per size. */}
          <g transform={`scale(${w} ${h})`}>
            <path className="atlasmap__land" d={view.path} vectorEffect="non-scaling-stroke" />
          </g>

          {/* On the world map, show where the inset above is cut from, so the
              two panels read as one map rather than two unrelated ones. */}
          {key === 'world' &&
            (() => {
              const a = project(view, europeCoast.lonMin, europeCoast.latMax)
              const b = project(view, europeCoast.lonMax, europeCoast.latMin)
              return (
                <rect
                  className="atlasmap__locator"
                  x={a.x * w}
                  y={a.y * h}
                  width={(b.x - a.x) * w}
                  height={(b.y - a.y) * h}
                />
              )
            })()}

          {placed.map(({ story, x, y }) => {
            const active = story.id === currentId
            const on = hover === story.id
            return (
              <g
                key={story.id}
                data-id={story.id}
                className={`atlasmap__pin ${active ? 'is-active' : ''} ${on ? 'is-lit' : ''}`}
                transform={`translate(${x * w} ${y * h})`}
                /* Deliberately NOT in the tab order, and hidden from the
                   accessibility tree. Every world is already reachable from the
                   name list beside the map, and putting 24 pins in front of it
                   meant 26 tab stops before a keyboard reader reached the first
                   name. The map is a pointing device's view of the same data.
                   The panel above resolves the pointer, so these draw only. */
                aria-hidden
              >
                {/* Radius from state, not CSS: `r` as a CSS property is SVG2
                    and not something to depend on across browsers. */}
                <circle className="atlasmap__dot" r={on || active ? 6.5 : 4.5} />
              </g>
            )
          })}

          {/* Drawn last, so it sits over every pin. Flipped to the left of its
              dot in the right third of the panel, where a label running
              rightwards would leave the frame. */}
          {lit &&
            (() => {
              const flip = lit.x > 0.66
              return (
                <text
                  className="atlasmap__label"
                  x={lit.x * w + (flip ? -12 : 12)}
                  y={lit.y * h + 4}
                  textAnchor={flip ? 'end' : 'start'}
                >
                  {lit.story.title}
                </text>
              )
            })()}
        </svg>
      </div>
    )
  }

  const row = (s: Story) => (
    <button
      key={s.id}
      data-id={s.id}
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

  // Names down the side, in the order they read on the map: north to south, so
  // the list runs the way the eye scans the inset.
  const byNorth = (a: PlacedWorld, b: PlacedWorld) => a.y - b.y

  return (
    <div className="atlasmap">
      <div className="atlasmap__maps">
        {panel('europe', europeCoast, europe, t('atlasEurope'))}
        {panel('world', worldCoast, world, t('atlasWorld'))}

        {/* Chips under the maps, not a section at the foot of the scrolling
            name column — which is where these started, 941 px down a 650 px
            column, so six worlds were invisible unless you thought to scroll.
            They are not leftovers: two are the whole Earth rather than a point
            on it, and four are not on Earth at all, which is worth saying
            rather than pinning Middle-earth somewhere near Wales. */}
        <div className="atlasmap__shelf">
          <h4 className="atlasmap__panel-title">{t('atlasElsewhere')}</h4>
          <div className="atlasmap__chips">
            {shelf.map((s) => (
              <button
                key={s.id}
                className={`atlasmap__chip ${s.id === currentId ? 'is-active' : ''}`}
                onClick={() => onPick(s.id)}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="atlasmap__side" ref={sideRef}>
        <h4 className="atlasmap__panel-title">{t('atlasOnEarth')}</h4>
        <div className="atlasmap__names">
          {[...europe].sort(byNorth).map((p) => row(p.story))}
          {[...world].sort(byNorth).map((p) => row(p.story))}
        </div>
      </div>
    </div>
  )
}
