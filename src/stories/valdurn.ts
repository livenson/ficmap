import type { Story } from '../types'

/**
 * Valdurn — the flagship sample world: a single cohesive continent ringed by
 * sea, with a mountainous heart. Every marker/route coordinate below sits on
 * verified land for this seed (see the terrain preview in the README).
 *
 * Copy this file to add your own world — change the seed and the points.
 */
export const valdurn: Story = {
  id: 'valdurn',
  title: 'The Realm of Valdurn',
  subtitle: 'A divided kingdom on the edge of the Drowned Coast',
  intro:
    'Once a single crown united the Vale, the Ashen Reach and the fenlands of ' +
    'the west. Now three powers watch the roads between them. Pan and zoom to ' +
    'explore — click any marker to read its tale, and toggle 2D/3D from the ' +
    'top bar.',
  terrain: {
    seed: 'valdurn-5',
    frequency: 1.4,
    islandFalloff: 0.25,
    seaLevel: 0.36,
    heightScale: 24,
    octaves: 5,
    biomes: [
      { maxHeight: 0.36, color: '#2e5f7d', name: 'Seas' },
      { maxHeight: 0.40, color: '#d8c79c', name: 'Shore' },
      { maxHeight: 0.5, color: '#7ba85f', name: 'Meadows' },
      { maxHeight: 0.62, color: '#4f8a4a', name: 'Woodlands' },
      { maxHeight: 0.74, color: '#77785a', name: 'Highlands' },
      { maxHeight: 0.86, color: '#8a8079', name: 'Crags' },
      { maxHeight: 1.0, color: '#f2f6fb', name: 'Snowcaps' },
    ],
  },
  markers: [
    {
      id: 'caer-valdurn',
      name: 'Caer Valdurn',
      kind: 'capital',
      at: { x: -0.3, z: 0.5 },
      description:
        'The old seat of the united crown, carved into the southern peaks. Its ' +
        'bells have not rung for a coronation in three generations.',
      chapter: 'I',
    },
    {
      id: 'thornhold',
      name: 'Thornhold',
      kind: 'city',
      at: { x: 0.46, z: 0.52 },
      description:
        'A fortress-city of the eastern lords, grown rich on the ore of the ' +
        'Ashen Reach and jealous of the western roads.',
      chapter: 'I',
    },
    {
      id: 'greywatch',
      name: 'Greywatch',
      kind: 'town',
      at: { x: -0.45, z: -0.05 },
      description:
        'A garrison town guarding the pass into the fens. Half its watchtowers ' +
        'stand empty; the other half watch each other.',
      chapter: 'II',
    },
    {
      id: 'ashford',
      name: 'Ashford',
      kind: 'town',
      at: { x: 0.2, z: -0.05 },
      description:
        'Where the trade roads still cross. Neutral ground, for now — the last ' +
        'market that answers to no lord.',
      chapter: 'II',
    },
    {
      id: 'emberpeak',
      name: 'Emberpeak',
      kind: 'peak',
      at: { x: -0.15, z: 0.4 },
      description:
        'The tallest of the central crags. Beacon-fires lit here can be seen ' +
        'from every corner of the Vale.',
      chapter: 'III',
    },
    {
      id: 'north-spur',
      name: 'The North Spur',
      kind: 'landmark',
      at: { x: -0.5, z: -0.25 },
      description: 'A knife of grey stone that splits the northern winds.',
    },
    {
      id: 'hollowfen',
      name: 'Hollowfen',
      kind: 'forest',
      at: { x: -0.3, z: -0.3 },
      description:
        'A drowned forest of black alder. Locals swear the paths move at night.',
      chapter: 'III',
    },
    {
      id: 'saltmere',
      name: 'Saltmere',
      kind: 'port',
      at: { x: 0.6, z: 0.2 },
      description: 'The eastern deep-water port. Whoever holds it, holds the trade.',
      chapter: 'II',
    },
    {
      id: 'duskwater',
      name: 'Duskwater',
      kind: 'port',
      at: { x: -0.55, z: 0.4 },
      description: 'A fog-bound harbor of smugglers and exiled cartographers.',
      chapter: 'I',
    },
    {
      id: 'ravenfell',
      name: 'Ravenfell Ruin',
      kind: 'ruin',
      at: { x: 0.35, z: -0.3 },
      description:
        'The shattered keep of the first pretender. Nothing has nested here ' +
        'since, save the ravens it is named for.',
    },
    {
      id: 'sunken-crown',
      name: 'The Sunken Crown',
      kind: 'danger',
      at: { x: -0.05, z: 0.62 },
      description:
        'Where the old capital slid into the sea. At low tide the tops of its ' +
        'towers still break the water off the Drowned Coast.',
      chapter: 'IV',
    },
    {
      id: 'ashen-field',
      name: 'The Ashen Field',
      kind: 'battle',
      at: { x: 0.28, z: -0.12 },
      description:
        'Where the crown was lost. Ten thousand fell between Ashford and the ' +
        'eastern ore-roads, and no side calls it a victory.',
      chapter: 'IV',
    },
  ],
  routes: [
    {
      id: 'kings-road',
      name: "The King's Road",
      color: '#ffd27a',
      style: 'solid',
      description: 'The old royal road, from the western harbor to the eastern seat.',
      points: [
        { x: -0.55, z: 0.4 },
        { x: -0.3, z: 0.5 },
        { x: -0.15, z: 0.4 },
        { x: 0.2, z: -0.05 },
        { x: 0.46, z: 0.52 },
      ],
    },
    {
      id: 'the-long-march',
      name: 'The Long March',
      color: '#e07a6b',
      style: 'dashed',
      description: 'The doomed march of the last royal army, from Duskwater to the field.',
      points: [
        { x: -0.55, z: 0.4 },
        { x: -0.45, z: -0.05 },
        { x: -0.3, z: -0.3 },
        { x: 0.28, z: -0.12 },
      ],
    },
  ],
  regions: [
    { id: 'vale', name: 'The Vale of Valdurn', at: { x: -0.28, z: 0.28 }, scale: 1.2 },
    { id: 'reach', name: 'The Ashen Reach', at: { x: 0.42, z: 0.05 }, scale: 1.15 },
    { id: 'fens', name: 'The Greywater Fens', at: { x: -0.4, z: -0.28 } },
    { id: 'coast', name: 'The Drowned Coast', at: { x: 0.05, z: 0.66 }, scale: 0.95 },
  ],
  chapters: [
    {
      id: 'divided',
      title: 'A Realm Divided',
      narration:
        'One crown once bound the whole of this land. Its heartlands still ' +
        'carry the old names — the Vale, the Reach, the Fens, and the ' +
        'drowned southern shore — but no single hand rules them now.',
      focus: { at: { x: 0, z: 0.15 }, distance: 135, pitch: 52 },
      reveal: {
        markers: ['caer-valdurn'],
        regions: ['vale', 'reach', 'fens', 'coast'],
      },
    },
    {
      id: 'old-seat',
      title: 'The Old Seat',
      narration:
        'In the southern peaks stands Caer Valdurn, the seat of the united ' +
        'crown. Its bells have not rung for a coronation in three generations, ' +
        'and its halls keep only ghosts and cartographers.',
      focus: { marker: 'caer-valdurn', distance: 34, pitch: 30, heading: 15 },
      reveal: { markers: ['duskwater'] },
      highlight: { markers: ['caer-valdurn'] },
    },
    {
      id: 'rival',
      title: 'The Eastern Rival',
      narration:
        'Across the Ashen Reach rises Thornhold, grown rich on eastern ore and ' +
        'the deep-water trade of Saltmere. Its lords have not knelt in living ' +
        'memory, and they watch the western roads with open envy.',
      focus: { marker: 'thornhold', distance: 40, pitch: 34, heading: -25 },
      reveal: { markers: ['thornhold', 'saltmere'] },
      highlight: { markers: ['thornhold', 'saltmere'] },
    },
    {
      id: 'kings-road',
      title: "The King's Road",
      narration:
        'Between them runs the old royal road, from the fog-bound harbor of ' +
        'Duskwater through Ashford’s neutral markets to the eastern seat. ' +
        'Whoever holds the road holds the realm — and no one holds it.',
      focus: { at: { x: 0.0, z: 0.25 }, distance: 100, pitch: 46 },
      reveal: {
        markers: ['greywatch', 'ashford', 'emberpeak'],
        routes: ['kings-road'],
      },
      highlight: { routes: ['kings-road'] },
    },
    {
      id: 'long-march',
      title: 'The Long March',
      narration:
        'When the crown was last contested, the royal army marched from ' +
        'Duskwater through the whispering dark of Hollowfen — and met its end ' +
        'on the Ashen Field, where ten thousand fell and no side claimed a win.',
      focus: { at: { x: -0.1, z: -0.15 }, distance: 90, pitch: 44 },
      reveal: {
        markers: ['hollowfen', 'north-spur', 'ashen-field'],
        routes: ['the-long-march'],
      },
      highlight: { routes: ['the-long-march'], markers: ['ashen-field'] },
    },
    {
      id: 'drowned-coast',
      title: 'The Drowned Coast',
      narration:
        'And in the south, beneath the tide, lies the Sunken Crown — the first ' +
        'capital, lost to the sea. At low water its towers still break the ' +
        'surface, a reminder of how far a crown can fall.',
      focus: { marker: 'sunken-crown', distance: 30, pitch: 26, heading: 5 },
      reveal: { markers: ['sunken-crown', 'ravenfell'] },
      highlight: { markers: ['sunken-crown'] },
    },
  ],
}
