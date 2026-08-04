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
  author: 'Ficmap original',
  region: 'A high-fantasy realm',
  epoch: 'Demo world',
  intro:
    'Once a single crown united the Vale, the Ashen Reach and the fenlands of ' +
    'the west. Now three powers watch the roads between them. Pan and zoom to ' +
    'explore — click any marker to read its tale, and toggle 2D/3D from the ' +
    'top bar.',
  surfaceName: 'Valdurn',
  ambient: { trees: 0.75, treeKind: 'broadleaf', birds: 7, fish: 4 },
  terrain: {
    seed: 'valdurn-5',
    frequency: 1.4,
    islandFalloff: 0.25,
    seaLevel: 0.36,
    heightScale: 18,
    octaves: 5,
    rivers: 6,
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
  // Valdurn is stacked vertically, like an elevator: two sky realms rise above
  // the mortal land, and two underworlds sink below it. The floor switcher
  // orders them top-to-bottom by `tier`. A single thread runs the whole shaft —
  // the crown is forged in the Deep Forge at the bottom, worn by the kings whose
  // barrows fill the Vault, and those kings ascend to the Cloudward Reach above.
  levels: [
    {
      id: 'empyrean',
      title: 'The Empyrean',
      subtitle: 'The highest heaven — a lone radiant isle in an endless cloud-sea',
      tier: 2,
      terrain: {
        // A tight, strong island so a single luminous pinnacle floats alone in a
        // sea of cloud, gentle relief so it reads as serene rather than craggy.
        seed: 'valdurn-empyrean',
        frequency: 1.0,
        islandFalloff: 0.5,
        seaLevel: 0.4,
        heightScale: 9,
        octaves: 4,
        rivers: 0,
        sky: 'heaven',
        waterColor: '#eae6fb',
        biomes: [
          { maxHeight: 0.4, color: '#e7ecfb', name: 'The Endless Cloud' },
          { maxHeight: 0.5, color: '#f3e9d0', name: 'Gilt Shore' },
          { maxHeight: 0.66, color: '#f7edd8', name: 'Pale Gold' },
          { maxHeight: 0.82, color: '#faf3e6', name: 'Dawn-lit Stone' },
          { maxHeight: 1.0, color: '#ffffff', name: 'The Light' },
        ],
      },
      ambient: { trees: 0, birds: 5, fish: 0 },
      markers: [
        {
          id: 'throne-of-dawn',
          name: 'The Throne of Dawn',
          kind: 'capital',
          at: { x: 0.0, z: 0.0 },
          description:
            'The seat of the first light, from which (the oldest songs say) the ' +
            'whole realm of Valdurn was dreamed. It has no occupant that mortal ' +
            'eyes have seen.',
        },
        {
          id: 'well-of-stars',
          name: 'The Well of Stars',
          kind: 'landmark',
          at: { x: -0.22, z: -0.12 },
          description:
            'A still pool that holds the night sky at noon. Kings were said to ' +
            'read their endings in it.',
        },
        {
          id: 'the-choir',
          name: 'The Choir',
          kind: 'landmark',
          at: { x: 0.02, z: -0.3 },
          description: 'A ring of singing stones whose sound never quite stops.',
        },
        {
          id: 'the-last-gate',
          name: 'The Last Gate',
          kind: 'landmark',
          at: { x: 0.0, z: 0.3 },
          description:
            'The threshold beyond the highest heaven. What lies past it the epic ' +
            'does not tell — and no road returns from it.',
        },
      ],
      routes: [
        {
          id: 'path-of-light',
          name: 'The Path of Light',
          color: '#ffe9a8',
          style: 'solid',
          points: [
            { x: 0.02, z: -0.3 },
            { x: -0.22, z: -0.12 },
            { x: 0.0, z: 0.0 },
            { x: 0.0, z: 0.3 },
          ],
        },
      ],
      regions: [
        { id: 'empyrean-heart', name: 'The Empyrean', at: { x: 0.0, z: 0.02 }, scale: 1.0 },
        { id: 'beyond-cloud', name: 'Beyond the Cloud', at: { x: 0.42, z: 0.42 }, scale: 0.8 },
      ],
    },
    {
      id: 'cloudward',
      title: 'The Cloudward Reach',
      subtitle: 'The lower heaven — floating isles where the kings of Valdurn ascend',
      tier: 1,
      terrain: {
        seed: 'valdurn-cloudward',
        frequency: 1.3,
        islandFalloff: 0.4,
        seaLevel: 0.4,
        heightScale: 10,
        octaves: 4,
        rivers: 0,
        sky: 'heaven',
        waterColor: '#dfe9f7',
        biomes: [
          { maxHeight: 0.4, color: '#cfe0f2', name: 'Cloud Sea' },
          { maxHeight: 0.46, color: '#eadfae', name: 'Golden Strand' },
          { maxHeight: 0.58, color: '#d3bd72', name: 'Amber Fields' },
          { maxHeight: 0.72, color: '#e8e0c4', name: 'Alabaster Slopes' },
          { maxHeight: 0.86, color: '#f2ead2', name: 'Marble Terraces' },
          { maxHeight: 1.0, color: '#ffffff', name: 'Radiant Peaks' },
        ],
      },
      ambient: { trees: 0.18, treeColor: '#e6d59a', birds: 9, fish: 0 },
      markers: [
        {
          id: 'gate-of-clouds',
          name: 'The Gate of Clouds',
          kind: 'landmark',
          at: { x: 0.0, z: -0.36 },
          description:
            'THE WAY UP. Where the honoured dead of Valdurn step off the mortal ' +
            'air and into the lower heaven. The Bright Road begins here.',
        },
        {
          id: 'hall-of-ancestors',
          name: 'The Hall of Ancestor-Kings',
          kind: 'capital',
          at: { x: -0.05, z: 0.0 },
          description:
            'The celestial court where every crowned king of Valdurn sits again ' +
            'at one long table — the united realm they never quite held in life.',
        },
        {
          id: 'fountain-of-souls',
          name: 'The Fountain of Souls',
          kind: 'landmark',
          at: { x: 0.22, z: -0.18 },
          description: 'A rill of light in which the newly-risen are made clean.',
        },
        {
          id: 'gardens-of-dawn',
          name: 'The Gardens of Dawn',
          kind: 'forest',
          at: { x: -0.3, z: 0.22 },
          description: 'Golden groves that flower only toward the morning side of the isle.',
        },
        {
          id: 'the-watchtower',
          name: 'The Watchtower',
          kind: 'peak',
          at: { x: 0.3, z: 0.2 },
          description:
            'The high turret from which the ancestor-kings look down on the ' +
            'divided realm below, and grieve that it is still divided.',
        },
        {
          id: 'the-ascent-stair',
          name: 'The Ascent',
          kind: 'landmark',
          at: { x: -0.02, z: 0.38 },
          description:
            'The stair of cloud that climbs to the Empyrean above. Few are ' +
            'called to it.',
        },
      ],
      routes: [
        {
          id: 'bright-road',
          name: 'The Bright Road',
          color: '#ffe08a',
          style: 'solid',
          points: [
            { x: 0.0, z: -0.36 },
            { x: 0.22, z: -0.18 },
            { x: -0.05, z: 0.0 },
            { x: 0.3, z: 0.2 },
            { x: -0.3, z: 0.22 },
            { x: -0.02, z: 0.38 },
          ],
        },
      ],
      regions: [
        { id: 'lower-heaven', name: 'The Lower Heaven', at: { x: -0.02, z: 0.02 }, scale: 1.1 },
        { id: 'cloud-sea', name: 'The Cloud-Sea', at: { x: 0.5, z: -0.4 }, scale: 0.85 },
      ],
    },
    {
      id: 'vault-of-kings',
      title: 'The Vault of Kings',
      subtitle: 'The royal catacombs beneath Caer Valdurn',
      tier: -1,
      terrain: {
        // A broad, low cavern floor (low falloff, few octaves) so the funeral
        // road reads clearly across it, with a still black mere at the bottom.
        seed: 'valdurn-vault',
        frequency: 1.5,
        islandFalloff: 0.18,
        seaLevel: 0.28,
        heightScale: 12,
        octaves: 4,
        rivers: 0,
        sky: 'cavern',
        waterColor: '#16303a',
        biomes: [
          { maxHeight: 0.28, color: '#0f232b', name: 'The Still Mere' },
          { maxHeight: 0.36, color: '#243642', name: 'Wet Flags' },
          { maxHeight: 0.52, color: '#33414b', name: 'Crypt Floor' },
          { maxHeight: 0.7, color: '#46505a', name: 'Tomb Galleries' },
          { maxHeight: 0.86, color: '#5c6570', name: 'Vault Ribs' },
          { maxHeight: 1.0, color: '#93a7b3', name: 'Glimmerstone' },
        ],
      },
      ambient: { trees: 0, birds: 0, fish: 2 },
      markers: [
        {
          id: 'the-stair-down',
          name: 'The Stair Down',
          kind: 'landmark',
          at: { x: 0.0, z: -0.8 },
          description:
            'THE WAY DOWN. The long stair that drops from under the throne-room ' +
            'of Caer Valdurn into the royal dark.',
        },
        {
          id: 'hall-of-crowns',
          name: 'The Hall of Crowns',
          kind: 'capital',
          at: { x: -0.1, z: -0.3 },
          description:
            'Where the crowns of the dead kings are set on stone brows. One ' +
            'plinth stands empty — the Crown of Valdurn never came home to it.',
        },
        {
          id: 'tomb-of-the-first-king',
          name: 'The Tomb of the First King',
          kind: 'landmark',
          at: { x: -0.34, z: 0.06 },
          description: 'The oldest barrow, from whose line every later claimant descends.',
        },
        {
          id: 'the-ossuary',
          name: 'The Ossuary',
          kind: 'ruin',
          at: { x: 0.34, z: -0.06 },
          description: 'Galleries of the lesser dead, stacked where the vaults run out of kings.',
        },
        {
          id: 'the-mere-of-reflection',
          name: 'The Mere of Reflection',
          kind: 'danger',
          at: { x: 0.16, z: 0.34 },
          description:
            'A black, still water at the vault’s bottom. They say it shows a ' +
            'king not his face but his reign.',
        },
        {
          id: 'the-deeper-stair',
          name: 'The Deeper Stair',
          kind: 'landmark',
          at: { x: 0.0, z: 0.74 },
          description:
            'A cleft in the vault floor, and a stair going down past it — into ' +
            'the Sunless Deep, where crowns are forged and things are buried ' +
            'that no king wished remembered.',
        },
      ],
      routes: [
        {
          id: 'the-procession',
          name: 'The Funeral Procession',
          color: '#9fc3d6',
          style: 'solid',
          points: [
            { x: 0.0, z: -0.8 },
            { x: -0.1, z: -0.3 },
            { x: -0.34, z: 0.06 },
            { x: 0.34, z: -0.06 },
            { x: 0.16, z: 0.34 },
            { x: 0.0, z: 0.74 },
          ],
        },
      ],
      regions: [
        { id: 'royal-vaults', name: 'The Royal Vaults', at: { x: 0.0, z: -0.2 }, scale: 1.05 },
        { id: 'the-deep-stair', name: 'The Deep Stair', at: { x: 0.32, z: 0.74 }, scale: 0.7 },
      ],
    },
    {
      id: 'sunless-deep',
      title: 'The Sunless Deep',
      subtitle: 'The molten roots of the world, beneath the Vault of Kings',
      tier: -2,
      terrain: {
        seed: 'valdurn-deep',
        frequency: 1.6,
        islandFalloff: 0.16,
        seaLevel: 0.3,
        heightScale: 15,
        octaves: 4,
        rivers: 0,
        sky: 'dark',
        waterColor: '#3a0d0a',
        biomes: [
          { maxHeight: 0.3, color: '#1c0707', name: 'Molten Root' },
          { maxHeight: 0.4, color: '#331210', name: 'Cinder Bank' },
          { maxHeight: 0.55, color: '#521c16', name: 'Scorched Floor' },
          { maxHeight: 0.7, color: '#7a2a1a', name: 'Ember Rock' },
          { maxHeight: 0.85, color: '#b0461f', name: 'Glowing Crags' },
          { maxHeight: 1.0, color: '#ffb24a', name: 'The Deep Fires' },
        ],
      },
      ambient: { trees: 0, birds: 0, dragons: 2 },
      markers: [
        {
          id: 'the-molten-root',
          name: 'The Molten Root',
          kind: 'landmark',
          at: { x: 0.0, z: -0.8 },
          description:
            'THE WAY UP. The foot of the Deeper Stair, where the vault’s cold ' +
            'stone gives way to living fire.',
        },
        {
          id: 'the-deep-forge',
          name: 'The Deep Forge',
          kind: 'landmark',
          at: { x: -0.3, z: -0.3 },
          description:
            'The first fire, at which the Crown of Valdurn itself was beaten out ' +
            'of a single star-fallen ingot — before it was ever a thing worth ' +
            'killing for.',
        },
        {
          id: 'the-river-of-flame',
          name: 'The River of Flame',
          kind: 'danger',
          at: { x: 0.26, z: -0.12 },
          description: 'A slow molten stream that rings the deepest hollow.',
        },
        {
          id: 'the-chained-thing',
          name: 'The Chained Thing',
          kind: 'danger',
          at: { x: 0.0, z: 0.08 },
          description:
            'Something older than the crown, bound in the deepest heat. The kings ' +
            'kept its name out of the histories on purpose.',
        },
        {
          id: 'the-last-door',
          name: 'The Last Door',
          kind: 'ruin',
          at: { x: 0.0, z: 0.72 },
          description:
            'A sealed door at the very bottom of the world, its lock long since ' +
            'melted shut. No song records what is behind it.',
        },
      ],
      routes: [
        {
          id: 'the-descent',
          name: 'The Descent',
          color: '#ffb24a',
          style: 'solid',
          points: [
            { x: 0.0, z: -0.8 },
            { x: -0.3, z: -0.3 },
            { x: 0.26, z: -0.12 },
            { x: 0.0, z: 0.08 },
            { x: 0.0, z: 0.72 },
          ],
        },
      ],
      regions: [
        { id: 'the-deep', name: 'The Sunless Deep', at: { x: 0.0, z: -0.08 }, scale: 1.05 },
        { id: 'molten-roots', name: 'The Molten Roots', at: { x: 0.38, z: 0.4 }, scale: 0.8 },
      ],
    },
  ],
  elements: [
    {
      id: 'crown',
      name: 'The Crown of Valdurn',
      glyph: '♔',
      description:
        'The crown that once bound the whole realm. Follow where it goes — ' +
        'from the old seat, to the field where it was lost, to the sea.',
      journey: [
        {
          marker: 'caer-valdurn',
          sinceChapter: 0,
          note: 'Worn at Caer Valdurn, seat of the united crown.',
        },
        {
          marker: 'ashen-field',
          sinceChapter: 4,
          note: 'Lost on the Ashen Field, where the crown fell.',
        },
        {
          marker: 'sunken-crown',
          sinceChapter: 5,
          note: 'Gone into the sea off the Drowned Coast.',
        },
      ],
    },
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
