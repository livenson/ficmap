import type { Story } from '../types'

/**
 * The Fellowship of the Ring — supplied by the user. Note: the title, the "One
 * Ring", and the Middle-earth place names are the intellectual property of the
 * Tolkien Estate / Middle-earth Enterprises (in copyright to ~2044, plus
 * trademarks). This is user-authored, paraphrased data over a procedural (not
 * Tolkien's) map — a fan-project use. The seed was chosen so every marker sits
 * on land for the given sea level.
 */
export const fotr: Story = {
  id: 'fotr',
  title: 'The Fellowship of the Ring',
  subtitle: 'The Journey Begins',
  intro:
    'A dark lord seeks an ancient ring of power. A small group of heroes must ' +
    'carry it across dangerous lands to prevent a global catastrophe.',
  terrain: {
    seed: 'middle-earth-2',
    seaLevel: 0.3,
    islandFalloff: 0.2,
    rivers: 6,
    biomes: [
      { maxHeight: 0.35, color: '#2c6e49', name: 'Plains' },
      { maxHeight: 0.55, color: '#4a5d23', name: 'Hills' },
      { maxHeight: 0.75, color: '#8c8c8c', name: 'Mountains' },
      { maxHeight: 1.0, color: '#ffffff', name: 'Peaks' },
    ],
  },
  ambient: {
    trees: 0.7,
    birds: 8,
    fish: 3,
  },
  markers: [
    {
      id: 'hobbiton',
      name: 'Hobbiton',
      kind: 'town',
      at: { x: -0.6, z: -0.2 },
      description: 'A peaceful, pastoral village in the Shire.',
    },
    {
      id: 'bree',
      name: 'Bree',
      kind: 'town',
      at: { x: -0.4, z: -0.2 },
      description: 'A bustling crossroads town where men and hobbits mingle.',
    },
    {
      id: 'weathertop',
      name: 'Weathertop',
      kind: 'ruin',
      at: { x: -0.3, z: -0.25 },
      description: 'An ancient ruined watchtower atop a great hill.',
    },
    {
      id: 'rivendell',
      name: 'Rivendell',
      kind: 'city',
      at: { x: -0.1, z: -0.3 },
      description: 'A hidden refuge of the Elves nestled in a deep valley.',
    },
    {
      id: 'moria',
      name: 'Mines of Moria',
      kind: 'danger',
      at: { x: -0.05, z: 0.1 },
      description: 'An abandoned and dark underground dwarven realm.',
    },
    {
      id: 'lothlorien',
      name: 'Lothlórien',
      kind: 'forest',
      at: { x: 0.1, z: 0.1 },
      description: 'A magical, secluded elven woodland.',
    },
    {
      id: 'amon_hen',
      name: 'Amon Hen',
      kind: 'landmark',
      at: { x: 0.2, z: 0.4 },
      description: 'The Hill of Sight near the great falls of Rauros.',
    },
  ],
  routes: [
    {
      id: 'fellowship-path',
      name: 'Path of the Ringbearer',
      points: [
        { x: -0.6, z: -0.2 },
        { x: -0.4, z: -0.2 },
        { x: -0.3, z: -0.25 },
        { x: -0.1, z: -0.3 },
        { x: -0.05, z: 0.1 },
        { x: 0.1, z: 0.1 },
        { x: 0.2, z: 0.4 },
      ],
      color: '#ffaa00',
      style: 'solid',
      description:
        'The arduous trail taken by the companions from the Shire to the ' +
        'breaking point at the great river.',
    },
  ],
  regions: [
    { id: 'shire', name: 'The Shire', at: { x: -0.6, z: -0.2 }, scale: 1.2 },
    { id: 'eriador', name: 'Eriador', at: { x: -0.3, z: -0.4 }, scale: 1.5 },
    { id: 'misty-mountains', name: 'Misty Mountains', at: { x: -0.1, z: 0.0 }, scale: 1.2 },
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
          reveal: { markers: ['hobbiton', 'bree'], regions: ['shire'] },
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
          reveal: { markers: ['moria', 'lothlorien'], regions: ['misty-mountains'] },
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
          reveal: { markers: ['amon_hen'] },
          highlight: { markers: ['amon_hen'] },
        },
      ],
    },
  ],
}
