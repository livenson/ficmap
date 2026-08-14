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
import { tell } from './tell'
import { nibelungen } from './nibelungen'
import { faust } from './faust'
import { uilenspiegel } from './uilenspiegel'
import { kalevala } from './kalevala'
import { peergynt } from './peergynt'
import { nils } from './nils'
import { tain } from './tain'
import { cid } from './cid'
import { aotearoa } from './aotearoa'
import { naturalLife } from './natural-life'
import { ottokar } from './ottokar'

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
  tell,
  nibelungen,
  faust,
  uilenspiegel,
  kalevala,
  peergynt,
  nils,
  tain,
  cid,
  aotearoa,
  naturalLife,
  ottokar,
]

export function getStory(id: string | null | undefined): Story {
  return stories.find((s) => s.id === id) ?? stories[0]
}
