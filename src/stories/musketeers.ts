import type { Story } from '../types'
import franceHeight from '../assets/france-height.png'

/**
 * The d'Artagnan Romances — Alexandre Dumas (1844–1850; public domain): The
 * Three Musketeers, Twenty Years After, and The Vicomte de Bragelonne (which
 * closes with The Man in the Iron Mask). The whole cycle plays out over the
 * same ground — France, and England across the Channel — so it is a COMMON
 * world with one book per novel.
 *
 * The surface is a REAL heightmap: a Terrarium DEM of France + southern England
 * + the Channel (bbox lon −6..6, lat 42..53). Markers sit at their true
 * coordinates — with the symmetric longitude box, map-x is simply lon/6, and
 * map-z is 2·(53−lat)/11 − 1. Rebuild with `node scripts/build-heightmap.mjs
 * france`.
 */
export const musketeers: Story = {
  id: 'musketeers',
  title: "The d'Artagnan Romances",
  subtitle: 'Dumas — the Three Musketeers cycle, over the real France',
  author: 'Alexandre Dumas',
  region: 'France & England',
  epoch: 'The d’Artagnan Romances · 1844–1850',
  intro:
    'One for all: the cycle of the King’s Musketeers, from a Gascon boy’s ride ' +
    'to Paris to the secret of the Iron Mask — three novels over one real ' +
    'country. Press ▶ Play story to follow a book, or open any place to see ' +
    'where it belongs across the cycle.',
  surfaceName: 'France',
  ambient: { trees: 0.5, birds: 6, fish: 3 },
  terrain: {
    seed: 'france-dem',
    heightmap: franceHeight,
    seaLevel: 0.0385, // 0 m in the capped (−60..1500 m) DEM
    // Gentle relief so the Alps/Pyrenees don't wall off the routes.
    heightScale: 9,
    rivers: 5,
    biomes: [
      { maxHeight: 0.0385, color: '#2f6b86', name: 'The Sea' },
      { maxHeight: 0.07, color: '#d8cca0', name: 'Coast' },
      { maxHeight: 0.2, color: '#4a7a45', name: 'Farmland' },
      { maxHeight: 0.42, color: '#6a7a3e', name: 'Hills' },
      { maxHeight: 0.7, color: '#8a8272', name: 'Highlands' },
      { maxHeight: 1.0, color: '#e9e9e6', name: 'Alps' },
    ],
  },
  markers: [
    {
      id: 'paris',
      name: 'Paris',
      kind: 'capital',
      at: { x: 0.392, z: -0.247 }, // 48.86 N, 2.35 E
      description:
        'The King’s city. The Louvre, the Palais-Cardinal, and the house on the ' +
        'Rue des Fossoyeurs where d’Artagnan lodges among the Musketeers.',
    },
    {
      id: 'gascony',
      name: 'Gascony',
      kind: 'town',
      at: { x: 0.034, z: 0.7 }, // ~43.65 N, 0.2 E (d'Artagnan's country)
      description:
        'The poor southern province from which young d’Artagnan rides north on ' +
        'a yellow pony, with a letter and a hot temper, to seek his fortune.',
    },
    {
      id: 'la-rochelle',
      name: 'La Rochelle',
      kind: 'battle',
      at: { x: -0.192, z: 0.244 }, // 46.16 N, −1.15 E
      description:
        'The Huguenot port besieged by the Cardinal. At the bastion Saint-' +
        'Gervais the four friends breakfast under enemy fire on a famous wager.',
    },
    {
      id: 'calais',
      name: 'Calais',
      kind: 'port',
      at: { x: 0.31, z: -0.627 }, // 50.95 N, 1.86 E
      description:
        'The Channel port. Through it the Musketeers race — and are waylaid — ' +
        'carrying the Queen’s honour to England and back.',
    },
    {
      id: 'london',
      name: 'London',
      kind: 'city',
      at: { x: -0.021, z: -0.729 }, // 51.51 N, −0.13 E
      description:
        'Across the water: the Duke of Buckingham’s city, where the diamond ' +
        'studs are recovered — and, twenty years on, a king goes to the block.',
    },
    {
      id: 'armentieres',
      name: 'Armentières',
      kind: 'danger',
      at: { x: 0.48, z: -0.579 }, // 50.69 N, 2.88 E
      description:
        'A lonely house by the Lys where the friends bring the woman called ' +
        'Milady to a final, midnight reckoning.',
    },
    {
      id: 'vaux',
      name: 'Vaux-le-Vicomte',
      kind: 'landmark',
      at: { x: 0.452, z: -0.194 }, // 48.57 N, 2.71 E
      description:
        'Fouquet’s dazzling château, where a fête for the King masks a plot to ' +
        'exchange him for his hidden twin.',
    },
    {
      id: 'belle-ile',
      name: 'Belle-Île',
      kind: 'ruin',
      at: { x: -0.526, z: 0.028 }, // 47.35 N, −3.16 E
      description:
        'The fortified isle off the coast where Porthos and Aramis make their ' +
        'last stand — and Porthos his last, giant stand in the grotto of Locmaria.',
    },
    {
      id: 'bastille',
      name: 'The Bastille',
      kind: 'danger',
      at: { x: 0.405, z: -0.222 }, // Paris — nudged off the Louvre pin
      description:
        'The King’s prison, where a prisoner whose face no one may see is kept ' +
        'behind a mask of iron.',
    },
  ],
  routes: [
    {
      id: 'ride-to-paris',
      name: "D'Artagnan's Ride",
      color: '#e8b24a',
      style: 'solid',
      points: [
        { x: 0.034, z: 0.7 },
        { x: 0.2, z: 0.24 },
        { x: 0.32, z: -0.08 },
        { x: 0.392, z: -0.247 },
      ],
    },
    {
      id: 'the-studs',
      name: 'The Affair of the Diamond Studs',
      color: '#7ec8ff',
      style: 'dashed',
      points: [
        { x: 0.392, z: -0.247 },
        { x: 0.31, z: -0.627 },
        { x: -0.021, z: -0.729 },
      ],
    },
    {
      id: 'to-la-rochelle',
      name: 'The Siege & the Pursuit',
      color: '#d0693c',
      style: 'solid',
      points: [
        { x: 0.392, z: -0.247 },
        { x: 0.06, z: 0.02 },
        { x: -0.192, z: 0.244 },
        { x: 0.2, z: -0.2 },
        { x: 0.48, z: -0.579 },
      ],
    },
    {
      id: 'iron-mask',
      name: 'The Man in the Iron Mask',
      color: '#b39ddb',
      style: 'dashed',
      points: [
        { x: -0.526, z: 0.028 },
        { x: 0.0, z: -0.12 },
        { x: 0.452, z: -0.194 },
        { x: 0.405, z: -0.222 },
      ],
    },
  ],
  regions: [
    { id: 'france', name: 'France', at: { x: 0.16, z: 0.08 }, scale: 1.3 },
    { id: 'england', name: 'England', at: { x: -0.16, z: -0.82 }, scale: 0.8 },
    { id: 'the-channel', name: 'The Channel', at: { x: 0.13, z: -0.52 }, scale: 0.7 },
  ],
  elements: [
    {
      id: 'studs',
      name: "The Queen's Diamond Studs",
      glyph: '💎',
      description:
        'Twelve diamond tags the Queen has given to Buckingham — which the King ' +
        'is about to demand she wear. The Musketeers must fetch them back from ' +
        'London before the ball. Track them across the Channel and home.',
      journey: [
        { marker: 'paris', sinceChapter: 0, note: 'Demanded for the King’s ball.' },
        { marker: 'london', sinceChapter: 1, note: 'Recovered from Buckingham — two cut away.' },
        { marker: 'paris', sinceChapter: 1, note: 'Home in time; the Cardinal foiled.' },
      ],
    },
  ],
  books: [
    {
      id: 'three-musketeers',
      title: 'The Three Musketeers',
      subtitle: 'The diamonds & the siege',
      chapters: [
        {
          id: 'to-paris',
          title: 'A Gascon in Paris',
          narration:
            'D’Artagnan rides north to Paris, picks three duels with Athos, ' +
            'Porthos and Aramis in one afternoon — and instead of fighting them, ' +
            'stands with them against the Cardinal’s guards. One for all.',
          focus: { marker: 'paris', distance: 26, pitch: 40 },
          reveal: { markers: ['gascony', 'paris'], routes: ['ride-to-paris'], regions: ['france'] },
          highlight: { markers: ['gascony', 'paris'] },
        },
        {
          id: 'diamonds',
          title: 'The Queen’s Diamonds',
          narration:
            'To save the Queen’s honour, the four race to London and back for ' +
            'the diamond studs the Cardinal means to expose — arriving at the ' +
            'ball with minutes, and two replaced diamonds, to spare.',
          focus: { marker: 'london', distance: 30, pitch: 34 },
          reveal: {
            markers: ['calais', 'london'],
            routes: ['the-studs'],
            regions: ['england', 'the-channel'],
          },
          highlight: { markers: ['calais', 'london'] },
        },
        {
          id: 'la-rochelle',
          title: 'The Siege & Milady',
          narration:
            'At the siege of La Rochelle the friends breakfast under fire on a ' +
            'wager, and unmask the Cardinal’s agent Milady — pursuing her at ' +
            'last to a house on the Lys.',
          focus: { marker: 'la-rochelle', distance: 30, pitch: 34 },
          reveal: {
            markers: ['la-rochelle', 'armentieres'],
            routes: ['to-la-rochelle'],
          },
          highlight: { markers: ['la-rochelle', 'armentieres'] },
        },
      ],
    },
    {
      id: 'twenty-years',
      title: 'Twenty Years After',
      subtitle: 'Kings & the Fronde',
      chapters: [
        {
          id: 'the-fronde',
          title: 'Paris & London Again',
          narration:
            'Twenty years on, the four reunite amid the Fronde’s barricades, ' +
            'then cross to England in a doomed bid to save King Charles I from ' +
            'the scaffold at Whitehall.',
          focus: { marker: 'london', distance: 32, pitch: 34 },
          reveal: { markers: ['london', 'paris'], regions: ['england'] },
          highlight: { markers: ['london', 'paris'] },
        },
      ],
    },
    {
      id: 'bragelonne',
      title: 'The Vicomte de Bragelonne',
      subtitle: 'The Man in the Iron Mask',
      chapters: [
        {
          id: 'the-mask',
          title: 'The Mask of Iron',
          narration:
            'Aramis would swap the King for his secret twin, kept masked in the ' +
            'Bastille; the plot breaks at Fouquet’s Vaux. Pursued to Belle-Île, ' +
            'Porthos dies holding up a collapsing grotto, and the friends’ long ' +
            'tale draws to its close.',
          focus: { marker: 'vaux', distance: 28, pitch: 36 },
          reveal: {
            markers: ['vaux', 'bastille', 'belle-ile'],
            routes: ['iron-mask'],
          },
          highlight: { markers: ['bastille', 'belle-ile', 'vaux'] },
        },
      ],
    },
  ],
}
