import type { Story } from '../types'
import { valdurn } from './valdurn'
import { kalevipoeg } from './kalevipoeg'
import { fotr } from './fotr'
import { centerEarth } from './center-earth'
import { verne } from './verne'
import { musketeers } from './musketeers'
import { harryPotter } from './harry-potter'
import { indianaJones } from './indiana-jones'
import { mistborn } from './mistborn'
import { forestSong } from './forest-song'
import { eneida } from './eneida'
import { gameOfThrones } from './game-of-thrones'
import { lacplesis } from './lacplesis'

/**
 * The atlas registry. To add a world:
 *   1. Copy `valdurn.ts` to `src/stories/<your-world>.ts` and edit it.
 *   2. Import it here and add it to the array below.
 * That's the whole extension surface — no engine changes required.
 */
export const stories: Story[] = [
  valdurn,
  kalevipoeg,
  fotr,
  centerEarth,
  verne,
  musketeers,
  harryPotter,
  indianaJones,
  mistborn,
  forestSong,
  eneida,
  gameOfThrones,
  lacplesis,
]

export function getStory(id: string | null | undefined): Story {
  return stories.find((s) => s.id === id) ?? stories[0]
}
