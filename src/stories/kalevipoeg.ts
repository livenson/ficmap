import type { Story } from '../types'

/**
 * Kalevipoeg — a public-domain sample world drawn from the Estonian national
 * epic (F. R. Kreutzwald, 1857; author d. 1882 → public domain). It exercises
 * the multi-book model: one shared map, three "books", and places that recur
 * across them (the Kääpa brook and Finland each surface in more than one book).
 *
 * Narration is a brief paraphrase of the epic's events, not a quotation of any
 * particular translation. Place coordinates were verified on land for this seed
 * (see scripts/preview.mjs).
 */
export const kalevipoeg: Story = {
  id: 'kalevipoeg',
  title: 'Kalevipoeg',
  subtitle: 'The Estonian epic, as a map across three books',
  intro:
    'The song of Kalev’s son — giant, king, and wanderer. One land, told in ' +
    'three books: his birth and the winning of the sword, his wars and ' +
    'voyages, and his end at the gates of Põrgu. Press ▶ Play story to follow ' +
    'the whole saga, or click a place to see every book it appears in.',
  ambient: { trees: 0.6, treeKind: 'conifer', birds: 6 },
  terrain: {
    seed: 'kalev-9',
    frequency: 1.5,
    islandFalloff: 0.22,
    seaLevel: 0.4,
    heightScale: 24,
    octaves: 5,
    rivers: 6,
    biomes: [
      { maxHeight: 0.4, color: '#2c5a74', name: 'Cold Seas' },
      { maxHeight: 0.44, color: '#d7cba1', name: 'Sands' },
      { maxHeight: 0.54, color: '#6f9b57', name: 'Meadows' },
      { maxHeight: 0.66, color: '#3f7a44', name: 'Deep Forest' },
      { maxHeight: 0.78, color: '#6f7a55', name: 'Uplands' },
      { maxHeight: 0.9, color: '#8a8079', name: 'Bare Rock' },
      { maxHeight: 1.0, color: '#eef4f8', name: 'Snows' },
    ],
  },
  markers: [
    {
      id: 'lindanisa',
      name: 'Lindanisa',
      kind: 'capital',
      at: { x: -0.3, z: 0.3 },
      description:
        'The hill-seat Kalevipoeg raises as his royal burg — the stronghold ' +
        'later remembered as Tallinn.',
    },
    {
      id: 'kalev-barrow',
      name: "Kalev's Barrow",
      kind: 'landmark',
      at: { x: -0.2, z: -0.2 },
      description:
        'Where the old king Kalev is laid to rest. His widow Linda’s weeping ' +
        'is said to have raised the mound and welled up a lake of tears.',
    },
    {
      id: 'peipus',
      name: 'Lake Peipus',
      kind: 'port',
      at: { x: 0.3, z: 0.1 },
      description:
        'The great eastern water. Along its shores the hero hauls timber and ' +
        'rests — and here his fortunes turn.',
    },
    {
      id: 'finland',
      name: 'Finland',
      kind: 'peak',
      at: { x: 0.62, z: 0.02 },
      description:
        'Across the gulf lies the hall of the Finnish smith, who forges a ' +
        'sword worthy of a giant — and later curses it.',
    },
    {
      id: 'assamalla',
      name: 'Assamälla',
      kind: 'battle',
      at: { x: -0.2, z: 0.4 },
      description: 'A field of one of the hero’s great battles against invaders.',
    },
    {
      id: 'pihkva',
      name: 'Pihkva',
      kind: 'city',
      at: { x: 0.4, z: 0.6 },
      description: 'The southern city (Pskov) against which the hero campaigns.',
    },
    {
      id: 'kaapa',
      name: 'Kääpa',
      kind: 'danger',
      at: { x: -0.05, z: 0.1 },
      description:
        'The brook where the stolen sword comes to rest — and waits, under a ' +
        'curse, for the day its master wades across.',
    },
    {
      id: 'endla',
      name: 'Lake Endla',
      kind: 'forest',
      at: { x: -0.3, z: 0.05 },
      description: 'A misted lake of the inland forests, haunt of spirits and song.',
    },
    {
      id: 'porgu',
      name: 'Põrgu',
      kind: 'danger',
      at: { x: -0.55, z: 0.55 },
      description:
        'The gates of the underworld, realm of Sarvik the Horned, whom the ' +
        'hero descends to fight.',
    },
    {
      id: 'world-end',
      name: "The World's End",
      kind: 'landmark',
      at: { x: -0.3, z: -0.45 },
      description:
        'The rim of the world, which the hero sails to seek — and finds no man ' +
        'may pass.',
    },
  ],
  routes: [
    {
      id: 'sword-quest',
      name: 'The Sword-Quest',
      color: '#ffd27a',
      style: 'solid',
      points: [
        { x: -0.3, z: 0.3 },
        { x: 0.12, z: 0.16 },
        { x: 0.62, z: 0.02 },
      ],
    },
    {
      id: 'wars',
      name: 'The Wars',
      color: '#e0a25a',
      style: 'solid',
      points: [
        { x: -0.3, z: 0.3 },
        { x: -0.2, z: 0.4 },
        { x: 0.4, z: 0.6 },
      ],
    },
    {
      id: 'last-road',
      name: 'The Last Road',
      color: '#c56b7a',
      style: 'dashed',
      points: [
        { x: -0.3, z: 0.3 },
        { x: -0.55, z: 0.55 },
        { x: -0.05, z: 0.1 },
      ],
    },
  ],
  regions: [
    { id: 'homeland', name: 'The Homeland', at: { x: -0.28, z: 0.18 }, scale: 1.15 },
    { id: 'eastern-waters', name: 'The Eastern Waters', at: { x: 0.3, z: 0.22 } },
    { id: 'suomi', name: 'Finland', at: { x: 0.62, z: -0.12 }, scale: 0.9 },
    { id: 'underworld', name: 'The Marches of Põrgu', at: { x: -0.55, z: 0.42 }, scale: 0.9 },
  ],
  books: [
    {
      id: 'birth',
      title: 'Birth & the Sword',
      chapters: [
        {
          id: 'barrow',
          title: "Kalev's Barrow",
          narration:
            'Old King Kalev dies and is laid in his barrow; his widow Linda ' +
            'mourns until her tears well into a lake. Of Kalev’s sons the ' +
            'youngest grows the mightiest — Kalevipoeg, the giant heir.',
          focus: { marker: 'kalev-barrow', distance: 34, pitch: 34 },
          reveal: {
            markers: ['kalev-barrow', 'lindanisa'],
            regions: ['homeland'],
          },
          highlight: { markers: ['kalev-barrow'] },
        },
        {
          id: 'seat',
          title: 'The Seat at Lindanisa',
          narration:
            'Chosen king, Kalevipoeg raises his burg at Lindanisa, the hill ' +
            'above the northern shore that later ages will call Tallinn.',
          focus: { marker: 'lindanisa', distance: 30, pitch: 30, heading: 20 },
          reveal: { markers: [] },
          highlight: { markers: ['lindanisa'] },
        },
        {
          id: 'swim',
          title: 'The Swim to Finland',
          narration:
            'Needing a blade to match his strength, the hero swims the gulf to ' +
            'Finland, to the hall of the great smith who alone can forge it.',
          focus: { marker: 'finland', distance: 40, pitch: 32, heading: -20 },
          reveal: { markers: ['finland', 'peipus'], routes: ['sword-quest'] },
          highlight: { markers: ['finland'], routes: ['sword-quest'] },
        },
        {
          id: 'curse',
          title: 'The Cursed Blade',
          narration:
            'The sword is forged, but a drunken quarrel ends with the smith’s ' +
            'son slain. The smith of Finland lays a curse: one day the blade ' +
            'will cut down the very man who bears it.',
          focus: { marker: 'finland', distance: 34, pitch: 40, heading: 10 },
          highlight: { markers: ['finland'] },
        },
      ],
    },
    {
      id: 'wars',
      title: 'Wars & Wanderings',
      chapters: [
        {
          id: 'assamalla',
          title: 'The Field of Assamälla',
          narration:
            'War comes to the homeland. At Assamälla the hero breaks the ' +
            'invading host in one of the epic’s great battles.',
          focus: { marker: 'assamalla', distance: 34, pitch: 36 },
          reveal: { markers: ['assamalla'], routes: ['wars'] },
          highlight: { markers: ['assamalla'], routes: ['wars'] },
        },
        {
          id: 'pihkva',
          title: 'The March on Pihkva',
          narration:
            'The hero carries his wars south, marching upon Pihkva and the ' +
            'lands beyond the great lake.',
          focus: { marker: 'pihkva', distance: 36, pitch: 34, heading: -15 },
          reveal: { markers: ['pihkva'] },
          highlight: { markers: ['pihkva'] },
        },
        {
          id: 'peipus',
          title: 'The Waters of Peipus',
          narration:
            'Hauling planks along Lake Peipus, the weary hero sleeps — and ' +
            'thieves make off with his sword. It is lost in the Kääpa brook, ' +
            'where it sinks and waits.',
          focus: { marker: 'peipus', distance: 40, pitch: 30 },
          reveal: { markers: ['kaapa', 'endla'], regions: ['eastern-waters'] },
          highlight: { markers: ['peipus', 'kaapa'] },
        },
        {
          id: 'world-end',
          title: "To the World's End",
          narration:
            'Restless, Kalevipoeg voyages north to seek the world’s end, ' +
            'sailing until the sea itself forbids him to pass.',
          focus: { marker: 'world-end', distance: 40, pitch: 34 },
          reveal: { markers: ['world-end'] },
          highlight: { markers: ['world-end'] },
        },
      ],
    },
    {
      id: 'end',
      title: 'Põrgu & the End',
      chapters: [
        {
          id: 'porgu',
          title: 'The Gates of Põrgu',
          narration:
            'The hero descends into Põrgu, the underworld, to wrestle Sarvik ' +
            'the Horned, binding the demon and carrying off his treasure.',
          focus: { marker: 'porgu', distance: 34, pitch: 38 },
          reveal: {
            markers: ['porgu'],
            routes: ['last-road'],
            regions: ['underworld'],
          },
          highlight: { markers: ['porgu'], routes: ['last-road'] },
        },
        {
          id: 'kaapa-death',
          title: 'The Kääpa',
          narration:
            'Homeward at last, Kalevipoeg wades the Kääpa brook. The lost sword ' +
            'wakes to its old curse and shears the legs from its master.',
          focus: { marker: 'kaapa', distance: 30, pitch: 28 },
          highlight: { markers: ['kaapa'] },
        },
        {
          id: 'guardian',
          title: 'Guardian at the Gates',
          narration:
            'The gods set the fallen hero to guard the gates of Põrgu, his ' +
            'hand fast to the rock, until the day his people are free again.',
          focus: { marker: 'porgu', distance: 38, pitch: 42, heading: 15 },
          highlight: { markers: ['porgu'] },
        },
      ],
    },
  ],
}
