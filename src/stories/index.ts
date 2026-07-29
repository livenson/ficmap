import type { Story } from '../types'
import { valdurn } from './valdurn'
import { emberfall } from './emberfall'
import { kalevipoeg } from './kalevipoeg'
import { fotr } from './fotr'

/**
 * The atlas registry. To add a world:
 *   1. Copy `valdurn.ts` to `src/stories/<your-world>.ts` and edit it.
 *   2. Import it here and add it to the array below.
 * That's the whole extension surface — no engine changes required.
 */
export const stories: Story[] = [valdurn, emberfall, kalevipoeg, fotr]

export function getStory(id: string | null | undefined): Story {
  return stories.find((s) => s.id === id) ?? stories[0]
}
