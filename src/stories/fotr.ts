import type { Story } from '../types'
import middleEarthHeight from '../assets/middle-earth-height.png'

/**
 * The Fellowship of the Ring — supplied by the user. Note: the title, the "One
 * Ring", and the Middle-earth place names are the intellectual property of the
 * Tolkien Estate / Middle-earth Enterprises (in copyright to ~2044, plus
 * trademarks). This is user-authored, paraphrased data — a fan-project use.
 *
 * The map is a SHAPED heightmap of Eriador built to echo Tolkien's own map:
 * the western sea and the Grey Havens, the Shire lowlands, the Misty Mountains
 * as a long north-south wall down the middle (crossed at Moria), the vale of
 * the Anduin to their east, and forest country beyond. Rebuild with
 * `node scripts/build-middle-earth.mjs`.
 */
export const fotr: Story = {
  id: 'fotr',
  title: 'The Fellowship of the Ring',
  subtitle: 'The Journey Begins',
  author: 'J. R. R. Tolkien',
  region: 'Middle-earth (Eriador)',
  epoch: 'Published 1954',
  intro:
    'A dark lord seeks an ancient ring of power. A small group of heroes must ' +
    'carry it across dangerous lands to prevent a global catastrophe.',
  terrain: {
    music: {
      title: 'Greensleeves',
      credit: 'English traditional, 16th c. · public domain',
      melody:
        'A3:2 C4:3 D4:1 E4:3 F4:1 E4:2 D4:3 B3:1 G3:2 A3:1 B3:1 C4:3 A3:1 A3:2 G#3:1 A3:1 B3:3 G#3:1 E3:4 r:2',
      bass: 'A2:8 C3:8 G2:8 E2:8',
      tempo: 76,
      voice: 'harp',
      mood: 'epic',
    },
    seed: 'middle-earth',
    heightmap: middleEarthHeight,
    seaLevel: 0.04,
    heightScale: 13,
    rivers: 4,
    detail: true, // fine surface bump (prototype of the landscape techniques)
    biomes: [
      { maxHeight: 0.04, color: '#2a5f7a', name: 'The Sea' },
      { maxHeight: 0.08, color: '#cdbf94', name: 'Shore' },
      { maxHeight: 0.3, color: '#3f7a45', name: 'Green Country' },
      { maxHeight: 0.52, color: '#4a5d23', name: 'Wolds' },
      // Most of the Misty Mountains read as grey stone; only the peaks catch
      // snow — closer to Tolkien's line-drawn range than a solid white wall.
      { maxHeight: 0.85, color: '#8c8c8c', name: 'Mountains' },
      { maxHeight: 1.0, color: '#f4f4f4', name: 'Snows' },
    ],
  },
  ambient: {
    trees: 0.7,
    birds: 8,
    fish: 3,
  },
  markers: [
    {
      id: 'grey-havens',
      name: 'The Grey Havens',
      kind: 'port',
      at: { x: -0.82, z: -0.27 },
      description:
        'Mithlond, the elven harbour on the Gulf of Lune, from whose quays the ' +
        'last ships sail into the West.',
    },
    {
      id: 'hobbiton',
      name: 'Hobbiton',
      kind: 'town',
      at: { x: -0.6, z: -0.13 },
      description: 'A peaceful, pastoral village in the Shire.',
    },
    {
      id: 'bree',
      name: 'Bree',
      kind: 'town',
      at: { x: -0.4, z: -0.1 },
      description: 'A bustling crossroads town where men and hobbits mingle.',
    },
    {
      id: 'weathertop',
      name: 'Weathertop',
      kind: 'ruin',
      at: { x: -0.24, z: -0.13 },
      description: 'An ancient ruined watchtower atop a great hill.',
    },
    {
      id: 'rivendell',
      name: 'Rivendell',
      kind: 'city',
      at: { x: -0.02, z: -0.18 },
      description:
        'Imladris — a hidden refuge of the Elves in a deep valley at the ' +
        'western feet of the Misty Mountains.',
    },
    {
      id: 'moria',
      name: 'Mines of Moria',
      kind: 'danger',
      at: { x: 0.11, z: 0.16 },
      description:
        'Khazad-dûm — an abandoned, dark dwarven realm delved beneath the ' +
        'Misty Mountains, entered from the west and left, barely, to the east.',
    },
    {
      id: 'lothlorien',
      name: 'Lothlórien',
      kind: 'forest',
      at: { x: 0.34, z: 0.28 },
      description:
        'The golden elven wood beyond the mountains, on the near bank of the ' +
        'Great River.',
    },
    {
      id: 'amon_hen',
      name: 'Amon Hen',
      kind: 'landmark',
      at: { x: 0.3, z: 0.6 },
      description:
        'The Hill of Sight above the falls of Rauros, where the Fellowship ' +
        'breaks.',
    },
  ],
  routes: [
    {
      id: 'fellowship-path',
      name: 'Path of the Ringbearer',
      points: [
        { x: -0.6, z: -0.13 },
        { x: -0.4, z: -0.1 },
        { x: -0.24, z: -0.13 },
        { x: -0.02, z: -0.18 },
        { x: 0.11, z: 0.16 },
        { x: 0.34, z: 0.28 },
        { x: 0.3, z: 0.6 },
      ],
      color: '#ffaa00',
      style: 'solid',
      description:
        'The arduous trail taken by the companions from the Shire, over (and ' +
        'under) the mountains, to the breaking point at the great river.',
    },
  ],
  regions: [
    { id: 'shire', name: 'The Shire', at: { x: -0.58, z: -0.16 }, scale: 1.0 },
    { id: 'ered-luin', name: 'Ered Luin', at: { x: -0.8, z: -0.62 }, scale: 0.85 },
    { id: 'eriador', name: 'Eriador', at: { x: -0.34, z: 0.24 }, scale: 1.3 },
    { id: 'misty-mountains', name: 'The Misty Mountains', at: { x: 0.02, z: -0.62 }, scale: 0.9 },
    { id: 'anduin', name: 'Vale of Anduin', at: { x: 0.34, z: -0.08 }, scale: 0.85 },
    { id: 'mirkwood', name: 'Mirkwood', at: { x: 0.64, z: 0.06 }, scale: 1.0 },
    { id: 'wilderland', name: 'Wilderland', at: { x: 0.5, z: 0.5 }, scale: 1.1 },
  ],
  elements: [
    {
      id: 'one-ring',
      name: 'The One Ring',
      glyph: '💍',
      description: 'An artifact of immense, corrupting power.',
      journey: [
        { marker: 'hobbiton', sinceChapter: 0 },
        { marker: 'rivendell', sinceChapter: 1 },
        { marker: 'moria', sinceChapter: 2 },
        { marker: 'amon_hen', sinceChapter: 3 },
      ],
    },
  ],
  books: [
    {
      id: 'book1',
      title: 'Book I',
      subtitle: 'The Ring Sets Out',
      chapters: [
        {
          id: 'ch1',
          title: 'A Long-expected Party & Departure',
          narration:
            'A quiet life in the village is interrupted when a mysterious ' +
            'inheritance demands a dangerous departure. A small group sets out ' +
            'under the cover of darkness.',
          focus: { marker: 'hobbiton', distance: 15 },
          reveal: { markers: ['hobbiton', 'bree'], regions: ['shire', 'ered-luin'] },
          highlight: { markers: ['hobbiton'] },
        },
        {
          id: 'ch2',
          title: 'Flight to the Ford',
          narration:
            'Hunted by shadowy riders through wild country and ancient ruins, ' +
            'the travelers narrowly escape across a river to a hidden valley ' +
            'of elves.',
          focus: { marker: 'rivendell', distance: 20 },
          reveal: {
            markers: ['weathertop', 'rivendell'],
            routes: ['fellowship-path'],
            regions: ['eriador'],
          },
          highlight: { markers: ['weathertop', 'rivendell'] },
        },
      ],
    },
    {
      id: 'book2',
      title: 'Book II',
      subtitle: 'The Ring Goes South',
      chapters: [
        {
          id: 'ch3',
          title: 'A Journey in the Dark',
          narration:
            'A fellowship forms to carry the burden south. Blocked by snow, ' +
            'they are forced into perilous, dark underground paths where ' +
            'ancient terrors sleep.',
          focus: { marker: 'moria', distance: 20 },
          reveal: {
            markers: ['moria', 'lothlorien'],
            regions: ['misty-mountains', 'anduin'],
          },
          highlight: { markers: ['moria'] },
        },
        {
          id: 'ch4',
          title: 'The Breaking of the Fellowship',
          narration:
            'After resting in a mystical forest, the travelers continue down ' +
            'the river. Tragedy and conflict strike the group, forcing them to ' +
            'scatter.',
          focus: { marker: 'amon_hen', distance: 15 },
          reveal: { markers: ['amon_hen'], regions: ['mirkwood', 'wilderland'] },
          highlight: { markers: ['amon_hen'] },
        },
      ],
    },
  ],
}
