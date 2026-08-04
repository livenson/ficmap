import { createContext, useContext, type ReactNode } from 'react'

/**
 * Tiny UI-label translation layer. Only the app chrome is translated (buttons,
 * section headings, hints) — the worlds' own text (titles, descriptions,
 * narration) stays in its source language. Add a language by extending `Lang`
 * and giving each key another entry.
 */
export type Lang = 'en' | 'et'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'et', label: 'ET' },
]

type Dict = Record<string, Record<Lang, string>>

const DICT: Dict = {
  world: { en: 'World', et: 'Maailm' },
  playStory: { en: 'Play story', et: 'Esita lugu' },
  exitStory: { en: 'Exit story', et: 'Välju loost' },
  viewMode: { en: 'View mode', et: 'Vaade' },
  mapLayers: { en: 'Map layers', et: 'Kaardikihid' },
  layers: { en: 'Layers', et: 'Kihid' },
  language: { en: 'Language', et: 'Keel' },
  labels: { en: 'Labels', et: 'Sildid' },
  treesWildlife: { en: 'Trees & wildlife', et: 'Puud ja loomad' },
  rivers: { en: 'Rivers', et: 'Jõed' },
  artifacts: { en: 'Artifacts', et: 'Esemed' },
  places: { en: 'Places', et: 'Kohad' },
  track: { en: 'track', et: 'jälgi' },
  mentionedIn: { en: 'Mentioned in', et: 'Mainitud' },
  notReferenced: { en: 'Not referenced in the story yet.', et: 'Loos veel mainimata.' },
  itsJourney: { en: 'Its journey', et: 'Selle teekond' },
  leg: { en: 'Leg', et: 'Etapp' },
  hereNow: { en: 'here now', et: 'praegu siin' },
  hiddenPlace: { en: 'a hidden place', et: 'varjatud paik' },
  artifactWord: { en: 'artifact', et: 'ese' },
  close: { en: 'Close', et: 'Sulge' },
  backTo: { en: 'Back to', et: 'Tagasi:' },
  elevation: { en: 'Elevation', et: 'Kõrgus' },
  mapLevel: { en: 'Map level', et: 'Kaardi tasand' },
  prev: { en: '‹ Prev', et: '‹ Eelmine' },
  next: { en: 'Next ›', et: 'Järgmine ›' },
  finish: { en: 'Finish', et: 'Lõpeta' },
  chapter: { en: 'Chapter', et: 'Peatükk' },
  book: { en: 'Book', et: 'Raamat' },
  hintPan: { en: 'drag to pan', et: 'lohista liigutamiseks' },
  hintZoom: { en: 'scroll to zoom', et: 'keri suumimiseks' },
  hintOrbit: { en: 'right-drag to orbit', et: 'parem-lohista pööramiseks' },
  hintChapters: { en: '← → chapters', et: '← → peatükid' },
}

export function translate(key: string, lang: Lang): string {
  const e = DICT[key]
  return (e && (e[lang] ?? e.en)) ?? key
}

const LangCtx = createContext<Lang>('en')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>
}

/** Returns a `t(key)` translator bound to the current language. */
export function useT(): (key: string) => string {
  const lang = useContext(LangCtx)
  return (key: string) => translate(key, lang)
}
