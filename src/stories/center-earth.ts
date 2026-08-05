import type { Story } from '../types'

/**
 * Journey to the Center of the Earth — Jules Verne, 1864 (public domain).
 *
 * This world leans on the map-levels feature: an Iceland surface, then three
 * descending subfloors reached with the floor switcher (or auto-entered while
 * the story plays) — the volcanic chimney, the vast Lidenbrock Sea, and the
 * deep caverns near the centre. The professor's party climbs down the crater
 * of Snæfellsjökull and, far below, is finally flung back to the surface by an
 * eruption of Stromboli.
 *
 * All terrain is procedural (not a real DEM); narration paraphrases the novel.
 */
export const centerEarth: Story = {
  id: 'center-earth',
  title: 'Journey to the Center of the Earth',
  subtitle: 'Down through Snæfellsjökull, floor by floor',
  author: 'Jules Verne',
  region: 'Iceland → the centre',
  epoch: 'Published 1864',
  intro:
    'Descend, bold traveller, and reach the centre of the Earth. From the ' +
    'crater of Snæfellsjökull the party climbs down into the dark — through a ' +
    'volcanic chimney, across a subterranean sea, and on toward the centre. ' +
    'Use the floor switcher to go down a level at a time, or press ▶ Play ' +
    'story to make the whole descent.',
  surfaceName: 'Iceland',
  ambient: { trees: 0.3, treeKind: 'conifer', birds: 5, fish: 3 },
  terrain: {
    seed: 'iceland-7',
    seaLevel: 0.32,
    islandFalloff: 0.14,
    heightScale: 18,
    frequency: 1.8,
    rivers: 3,
    detail: true, // fine surface bump so lava rock / ash slopes read as gritty
    biomes: [
      { maxHeight: 0.32, color: '#2b5a72', name: 'North Sea' },
      { maxHeight: 0.4, color: '#6f7d78', name: 'Black Sand' },
      { maxHeight: 0.55, color: '#5c7a52', name: 'Tundra' },
      { maxHeight: 0.72, color: '#7d7a68', name: 'Lava Rock' },
      { maxHeight: 0.86, color: '#b9b4a6', name: 'Ash Slopes' },
      { maxHeight: 1.0, color: '#f4f4f2', name: 'Glacier' },
    ],
  },
  markers: [
    {
      id: 'reykjavik',
      name: 'Reykjavík',
      kind: 'city',
      at: { x: -0.44, z: 0.08 },
      description:
        'The Icelandic capital, where the travellers gather guides and stores ' +
        'before striking out for the volcano.',
    },
    {
      id: 'stapi',
      name: 'Stapi',
      kind: 'town',
      at: { x: 0.1, z: -0.12 },
      description:
        'The last hamlet at the foot of the mountain, a cluster of turf huts ' +
        'under basalt cliffs — the final rest before the climb.',
    },
    {
      id: 'snaefells',
      name: 'Snæfellsjökull',
      kind: 'peak',
      at: { x: 0.26, z: -0.28 },
      description:
        'The glacier-capped volcano with three peaks. When the shadow of the ' +
        'central spire, Scartaris, falls upon one crater at noon, that is the ' +
        'road down.',
    },
    {
      id: 'scartaris-crater',
      name: 'The Crater of Scartaris',
      kind: 'danger',
      at: { x: 0.32, z: -0.34 },
      description:
        'THE WAY DOWN. The crater the shadow of Scartaris points to. Descend ' +
        'here into the chimney below — use the floor switcher to follow.',
    },
    {
      id: 'snaefells-coast',
      name: 'The Western Fjords',
      kind: 'landmark',
      at: { x: 0.5, z: 0.12 },
      description:
        'The wild indented coast the party skirts on the ride out to Stapi.',
    },
  ],
  routes: [
    {
      id: 'ride-out',
      name: 'The Ride to the Volcano',
      color: '#e0b070',
      style: 'solid',
      points: [
        { x: -0.44, z: 0.08 },
        { x: -0.12, z: 0.02 },
        { x: 0.1, z: -0.12 },
        { x: 0.26, z: -0.28 },
        { x: 0.32, z: -0.34 },
      ],
    },
  ],
  regions: [
    { id: 'iceland', name: 'Iceland', at: { x: -0.15, z: 0.28 }, scale: 1.3 },
    { id: 'snaefells-pen', name: 'Snæfellsnes', at: { x: 0.3, z: -0.12 }, scale: 0.8 },
  ],
  elements: [
    {
      id: 'runes',
      name: "Saknussemm's Runes",
      glyph: 'ᛜ',
      description:
        'The marks left three centuries earlier by the alchemist Arne ' +
        'Saknussemm, the only man to have made this descent before. Track them ' +
        'down through the Earth — each one proves the road still goes on.',
      journey: [
        { marker: 'scartaris-crater', sinceChapter: 0, note: 'His name cut at the crater mouth.' },
        { marker: 'the-crossroads', sinceChapter: 2, note: 'A rune marks the right gallery.' },
        { marker: 'port-grauben', sinceChapter: 3, note: 'Scratched on the shore of the great sea.' },
        { marker: 'blocked-passage', sinceChapter: 5, note: 'His last mark, at the sealed road on.' },
      ],
    },
  ],
  levels: [
    {
      id: 'chimney',
      title: 'The Volcanic Chimney',
      subtitle: 'The long climb down (Level −1)',
      terrain: {
        seed: 'chimney-3',
        frequency: 2.0,
        islandFalloff: 0.12,
        seaLevel: 0.24,
        heightScale: 20,
        octaves: 4,
        sky: 'dark',
        waterColor: '#2a1408',
        biomes: [
          { maxHeight: 0.24, color: '#160c06', name: 'Dark Water' },
          { maxHeight: 0.4, color: '#241a12', name: 'Shaft Floor' },
          { maxHeight: 0.58, color: '#3b2a1c', name: 'Basalt Gallery' },
          { maxHeight: 0.74, color: '#5a4026', name: 'Lava Wall' },
          { maxHeight: 0.88, color: '#8a5a2c', name: 'Quartz Vein' },
          { maxHeight: 1.0, color: '#d0913c', name: 'Glowing Rock' },
        ],
      },
      ambient: { trees: 0, birds: 0 },
      markers: [
        {
          id: 'crater-foot',
          name: 'Foot of the Chimney',
          kind: 'landmark',
          at: { x: 0.0, z: -0.78 },
          description:
            'The bottom of the first great shaft, where the light of day is ' +
            'finally lost and the true descent begins.',
        },
        {
          id: 'the-crossroads',
          name: 'The Three Galleries',
          kind: 'danger',
          at: { x: -0.05, z: -0.3 },
          description:
            'Where the tunnel forks. The wrong gallery ends in a wall; the ' +
            'right one, marked by Saknussemm, leads on and down.',
        },
        {
          id: 'hansbach',
          name: 'The Hansbach',
          kind: 'landmark',
          at: { x: 0.24, z: 0.06 },
          description:
            'A stream of clear water struck from the rock. They follow its ' +
            'course downward — a companion and a guide in the dark.',
        },
        {
          id: 'lava-gallery',
          name: 'The Lava Gallery',
          kind: 'ruin',
          at: { x: -0.2, z: 0.4 },
          description:
            'A long throat of cooled lava, its walls glittering, sloping ever ' +
            'deeper toward the sound of unseen water.',
        },
      ],
      routes: [
        {
          id: 'descent-1',
          name: 'The Descent',
          color: '#e0873c',
          style: 'solid',
          points: [
            { x: 0.0, z: -0.78 },
            { x: -0.05, z: -0.3 },
            { x: 0.24, z: 0.06 },
            { x: -0.2, z: 0.4 },
            { x: -0.05, z: 0.72 },
          ],
        },
      ],
      regions: [
        { id: 'chimney-top', name: 'Into the Dark', at: { x: 0.3, z: -0.78 }, scale: 0.7 },
        { id: 'chimney-deep', name: 'Downward', at: { x: 0.3, z: 0.6 }, scale: 0.7 },
      ],
    },
    {
      id: 'lidenbrock-sea',
      title: 'The Lidenbrock Sea',
      subtitle: 'A sea under the crust (Level −2)',
      terrain: {
        // Mostly open water: a high sea level and weak island shape leave a
        // vast underground sea with only rim-shores and a stray isle.
        seed: 'liden-sea-8',
        frequency: 1.5,
        islandFalloff: 0.08,
        seaLevel: 0.6,
        heightScale: 14,
        octaves: 4,
        rivers: 0,
        sky: 'cavern',
        waterColor: '#2a4750',
        biomes: [
          { maxHeight: 0.6, color: '#20343b', name: 'The Grey Sea' },
          { maxHeight: 0.68, color: '#4a5340', name: 'Fossil Shore' },
          { maxHeight: 0.8, color: '#586045', name: 'Mushroom Wood' },
          { maxHeight: 0.9, color: '#6f6a55', name: 'Bone Beds' },
          { maxHeight: 1.0, color: '#9aa0a2', name: 'Vaulted Rock' },
        ],
      },
      ambient: { trees: 0.5, treeKind: 'broadleaf', treeColor: '#8a8f6a', birds: 0, fish: 4 },
      markers: [
        {
          id: 'port-grauben',
          name: 'Port Gräuben',
          kind: 'port',
          at: { x: -0.6, z: -0.2 },
          description:
            'The rocky beach where the party names a harbour and lashes ' +
            'together a raft of fossil wood to cross the underground ocean.',
        },
        {
          id: 'mushroom-forest',
          name: 'Forest of Giant Mushrooms',
          kind: 'forest',
          at: { x: -0.4, z: 0.28 },
          description:
            'Pale mushrooms forty feet high, and beyond them the bones of ' +
            'creatures gone from the world above.',
        },
        {
          id: 'monster-battle',
          name: 'Battle of the Monsters',
          kind: 'danger',
          at: { x: 0.16, z: -0.05 },
          description:
            'Out on the water, an ichthyosaur and a plesiosaur rise and fight ' +
            'to the death, and the little raft is nearly swamped in their wake.',
        },
        {
          id: 'axel-island',
          name: 'Axel Island',
          kind: 'landmark',
          at: { x: 0.42, z: 0.18 },
          description:
            'A newborn islet crowned by a towering geyser, named for the ' +
            'narrator as they sail past.',
        },
        {
          id: 'stormy-shore',
          name: 'The Farther Shore',
          kind: 'battle',
          at: { x: 0.58, z: 0.52 },
          description:
            'A violent electric storm drives the raft across the sea and hurls ' +
            'it at last onto the far coast, near a sealed way on.',
        },
      ],
      routes: [
        {
          id: 'raft-crossing',
          name: 'The Raft Crossing',
          color: '#5fb0c0',
          style: 'dashed',
          points: [
            { x: -0.6, z: -0.2 },
            { x: 0.16, z: -0.05 },
            { x: 0.42, z: 0.18 },
            { x: 0.58, z: 0.52 },
          ],
        },
      ],
      regions: [
        { id: 'liden', name: 'The Lidenbrock Sea', at: { x: 0.0, z: -0.1 }, scale: 1.2 },
      ],
    },
    {
      id: 'deep-caverns',
      title: 'Toward the Centre',
      subtitle: 'The deep caverns (Level −3)',
      terrain: {
        seed: 'deep-4',
        frequency: 1.7,
        islandFalloff: 0.12,
        seaLevel: 0.28,
        heightScale: 18,
        octaves: 4,
        rivers: 0,
        sky: 'dark',
        waterColor: '#301006',
        biomes: [
          { maxHeight: 0.28, color: '#1a0b06', name: 'Tar Pools' },
          { maxHeight: 0.44, color: '#2e1a10', name: 'Cavern Floor' },
          { maxHeight: 0.6, color: '#4a2c18', name: 'Fossil Rock' },
          { maxHeight: 0.76, color: '#7a4420', name: 'Hot Stone' },
          { maxHeight: 0.9, color: '#b76a2a', name: 'Magma Glow' },
          { maxHeight: 1.0, color: '#ffb44a', name: 'The Deep Fire' },
        ],
      },
      ambient: { trees: 0, birds: 0, dragons: 1 },
      markers: [
        {
          id: 'forest-of-bones',
          name: 'The Forest of Bones',
          kind: 'forest',
          at: { x: -0.5, z: -0.5 },
          description:
            'A grey plain of petrified trees littered with the skeletons of ' +
            'mastodons and creatures older still.',
        },
        {
          id: 'the-giant',
          name: 'The Giant Shepherd',
          kind: 'danger',
          at: { x: -0.15, z: -0.1 },
          description:
            'A vast human form, taller than a house, herding a troop of ' +
            'mastodons beneath the trees. The travellers flee before it sees ' +
            'them.',
        },
        {
          id: 'blocked-passage',
          name: 'The Sealed Road',
          kind: 'ruin',
          at: { x: 0.2, z: 0.22 },
          description:
            'Saknussemm’s last mark — and a fall of rock across the only way ' +
            'on. They set a charge to blast it open.',
        },
        {
          id: 'eruption-shaft',
          name: 'The Eruption Shaft',
          kind: 'landmark',
          at: { x: 0.5, z: 0.56 },
          description:
            'THE WAY OUT. The blast opens an abyss; water floods in, and a ' +
            'column of magma bears the raft upward — to be flung at last from ' +
            'the mouth of Stromboli into the sun.',
        },
      ],
      routes: [
        {
          id: 'to-the-centre',
          name: 'The Last Road',
          color: '#ff9a3c',
          style: 'solid',
          points: [
            { x: -0.5, z: -0.5 },
            { x: -0.15, z: -0.1 },
            { x: 0.2, z: 0.22 },
            { x: 0.5, z: 0.56 },
          ],
        },
      ],
      regions: [
        { id: 'the-deep', name: 'The Deep Caverns', at: { x: 0.0, z: 0.0 }, scale: 1.1 },
      ],
    },
  ],
  books: [
    {
      id: 'descent',
      title: 'The Descent',
      subtitle: 'Down the crater',
      chapters: [
        {
          id: 'cipher',
          title: 'The Runic Cipher',
          narration:
            'A scrap of runes in an old book, once decoded, is an invitation: ' +
            'descend the crater of Snæfellsjökull that the shadow of Scartaris ' +
            'caresses, and reach the centre of the Earth. The party rides out ' +
            'to the volcano.',
          focus: { marker: 'snaefells', distance: 30, pitch: 34 },
          reveal: {
            markers: ['reykjavik', 'stapi', 'snaefells', 'scartaris-crater'],
            routes: ['ride-out'],
            regions: ['iceland', 'snaefells-pen'],
          },
          highlight: { markers: ['snaefells', 'scartaris-crater'] },
        },
        {
          id: 'into-the-crater',
          title: 'Into the Crater',
          narration:
            'At noon the shadow points true. Rope by rope they climb down into ' +
            'the chimney, and the last blue coin of sky closes overhead. (You ' +
            'have descended a level.)',
          level: 'chimney',
          focus: { marker: 'crater-foot', distance: 30, pitch: 36 },
          reveal: { markers: ['crater-foot', 'the-crossroads'], regions: ['chimney-top'] },
          highlight: { markers: ['crater-foot'] },
        },
        {
          id: 'the-galleries',
          title: 'The Right Gallery',
          narration:
            'At the fork they take the wrong road first, into a dead wall, and ' +
            'nearly perish of thirst before the Hansbach stream is struck. ' +
            'They follow its water down the correct gallery.',
          level: 'chimney',
          focus: { marker: 'hansbach', distance: 30, pitch: 34 },
          reveal: {
            markers: ['hansbach', 'lava-gallery'],
            routes: ['descent-1'],
            regions: ['chimney-deep'],
          },
          highlight: { markers: ['the-crossroads', 'hansbach'] },
        },
      ],
    },
    {
      id: 'the-sea',
      title: 'The Underground Sea',
      subtitle: 'Across the Lidenbrock Sea',
      chapters: [
        {
          id: 'the-shore',
          title: 'A Sea Below',
          narration:
            'The gallery opens on a shore of grey water stretching past sight, ' +
            'lit by an electric glow, a forest of giant mushrooms behind. They ' +
            'name it the Lidenbrock Sea and build a raft. (You have descended ' +
            'again.)',
          level: 'lidenbrock-sea',
          focus: { marker: 'port-grauben', distance: 34, pitch: 30 },
          reveal: {
            markers: ['port-grauben', 'mushroom-forest'],
            regions: ['liden'],
          },
          highlight: { markers: ['port-grauben'] },
        },
        {
          id: 'monsters',
          title: 'Monsters & the Storm',
          narration:
            'Mid-sea, two great reptiles surface and fight; later a raging ' +
            'electric storm seizes the raft and flings it days across the water ' +
            'to a farther shore.',
          level: 'lidenbrock-sea',
          focus: { marker: 'monster-battle', distance: 34, pitch: 28 },
          reveal: {
            markers: ['monster-battle', 'axel-island', 'stormy-shore'],
            routes: ['raft-crossing'],
          },
          highlight: { markers: ['monster-battle', 'stormy-shore'] },
        },
      ],
    },
    {
      id: 'the-centre',
      title: 'To the Centre & Back',
      subtitle: 'The deep caverns',
      chapters: [
        {
          id: 'the-giant-herd',
          title: 'The Forest of Bones',
          narration:
            'Beyond the shore lies a graveyard of petrified trees and giant ' +
            'bones — and among them a colossal human shepherd driving a herd of ' +
            'mastodons. They do not linger. (You have descended once more.)',
          level: 'deep-caverns',
          focus: { marker: 'the-giant', distance: 30, pitch: 34 },
          reveal: {
            markers: ['forest-of-bones', 'the-giant'],
            regions: ['the-deep'],
          },
          highlight: { markers: ['the-giant'] },
        },
        {
          id: 'eruption',
          title: 'Blasted to the Surface',
          narration:
            'Saknussemm’s road is sealed by rock. They fire a charge — the sea ' +
            'pours in, magma rises beneath the raft, and the whole column is ' +
            'shot upward, to be cast from the crater of Stromboli into the ' +
            'Mediterranean sun.',
          level: 'deep-caverns',
          focus: { marker: 'eruption-shaft', distance: 32, pitch: 40 },
          reveal: {
            markers: ['blocked-passage', 'eruption-shaft'],
            routes: ['to-the-centre'],
          },
          highlight: { markers: ['blocked-passage', 'eruption-shaft'] },
        },
      ],
    },
  ],
}
