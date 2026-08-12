import type { Story } from '../types'
import scadrialHeight from '../assets/scadrial-height.png'

/**
 * Mistborn — Brandon Sanderson's Scadrial, across both eras.
 *
 * NOTE: Mistborn, Scadrial and the place names are the intellectual property of
 * Brandon Sanderson / Dragonsteel (in copyright). This is user-authored,
 * paraphrased data over an INVENTED world — a fan-project use, not an official
 * work. Scadrial has no real DEM, so the terrain is a SHAPED FIELD, not a real
 * heightmap. Era 1 is laid out to match the published "Lord Ruler's Final
 * Empire" map — the inland Southern Sea, the Terris mountains across the north,
 * the ashmounts, and the lakes of the Central Dominance — with the cities and
 * dominances at their map positions (rebuild with `node scripts/build-scadrial.mjs`).
 * Era 2's Elendel Basin is a procedural field with its cities placed by the
 * Coppermind's Basin map.
 *
 * The world is told as two maps on one planet: the ash-choked FINAL EMPIRE of
 * the original trilogy (the surface), and — three centuries later — the green
 * ELENDEL BASIN of the Wax & Wayne books (a second map level). Use the level
 * switcher to cross between the eras.
 */
export const mistborn: Story = {
  id: 'mistborn',
  title: 'Mistborn',
  subtitle: 'Scadrial, across two eras — the Final Empire and the Elendel Basin',
  author: 'Brandon Sanderson',
  region: 'Scadrial',
  epoch: 'Mistborn · 2006–2022',
  intro:
    'One planet, two ages. Under a red sun and falling ash, the immortal Lord ' +
    'Ruler’s FINAL EMPIRE turns on the city of Luthadel — where a crew of thieves ' +
    'gambles on the impossible. Three hundred years later, in the green ELENDEL ' +
    'BASIN he helped make, a lawman with a lever-action and Allomancy hunts older ' +
    'things. Press ▶ Play story to follow the saga, or use the level switcher to ' +
    'cross from the Final Empire down to the Basin of the second era.',
  surfaceName: 'The Final Empire',
  ambient: { trees: 0.12, treeColor: '#5d5236', treeKind: 'conifer', birds: 3 },
  terrain: {
    music: {
      melody: 'F3:4 Ab3:2 C4:2 Bb3:4 Ab3:4 r:2 C4:2 Db4:2 C4:2 Ab3:2 F3:8 r:2',
      bass: 'F2:8 Db2:8 Ab2:8 C3:8',
      tempo: 46,
      voice: 'strings',
      mood: 'dark',
    },
    // Laid out to match the published Final Empire map (see build-scadrial.mjs):
    // the inland Southern Sea, the Terris mountains north, the ashmount cones,
    // and the Central lakes. 4:3, like the map.
    seed: 'scadrial-dem',
    heightmap: scadrialHeight,
    aspect: 4 / 3,
    seaLevel: 0.14,
    heightScale: 15,
    rivers: 0,
    detail: true, // fine surface bump so the ashlands read as gritty stone
    waterColor: '#33414b',
    biomes: [
      { maxHeight: 0.14, color: '#3a4852', name: 'Ashen Waters' },
      { maxHeight: 0.19, color: '#8b8069', name: 'Ashfall Flats' },
      { maxHeight: 0.44, color: '#867a63', name: 'Ashlands' },
      { maxHeight: 0.68, color: '#736a5a', name: 'Ash Dunes' },
      { maxHeight: 0.88, color: '#7c7469', name: 'Ash Stone' },
      { maxHeight: 0.95, color: '#585049', name: 'Dark Peaks' },
      { maxHeight: 1.0, color: '#c8632f', name: 'Ashmount Fires' },
    ],
  },
  markers: [
    {
      id: 'luthadel',
      name: 'Luthadel',
      kind: 'capital',
      at: { x: 0.2, z: -0.07 },
      description:
        'The capital, the City of Ashes, on the River Channerel — and above it ' +
        'Kredik Shaw, the Lord Ruler’s black palace, the Hill of a Thousand ' +
        'Spires. Here Kelsier’s crew plots to break a thousand years of tyranny, ' +
        'and beneath it lies the Well of Ascension.',
    },
    {
      id: 'fellis',
      name: 'Fellis',
      kind: 'town',
      at: { x: 0.11, z: -0.06 },
      description: 'A noble retreat-town just west of Luthadel, on the way to the Central lakes.',
    },
    {
      id: 'pits-of-hathsin',
      name: 'The Pits of Hathsin',
      kind: 'ruin',
      at: { x: 0.08, z: -0.21 },
      description:
        'The knife-crystal caves (by Tresting) where atium is grown, worked by ' +
        'doomed skaa slaves. Kelsier survived them once; the crew strikes here at ' +
        'the Lord Ruler’s secret source of power.',
    },
    {
      id: 'arguois',
      name: 'The Arguois Caverns',
      kind: 'ruin',
      at: { x: 0.22, z: -0.26 },
      description: 'A cave system north-east of Luthadel, nearer than the distant Pits.',
    },
    {
      id: 'fadrex-city',
      name: 'Fadrex City',
      kind: 'city',
      at: { x: -0.23, z: -0.14 },
      description:
        'A rocky, defensible city of the Western Dominance. Behind Keep Hasting ' +
        'lies the great atium cache the Lord Ruler hid — the prize of Elend’s ' +
        'final campaign.',
    },
    {
      id: 'tremredare',
      name: 'Tremredare',
      kind: 'city',
      at: { x: -0.37, z: -0.24 },
      description: 'The larger capital of the Western Dominance, deeper into the western ranges.',
    },
    {
      id: 'mantiz',
      name: 'Mantiz',
      kind: 'town',
      at: { x: -0.35, z: -0.09 },
      description: 'A western canal-town on the routes toward Fadrex and the Southern Sea.',
    },
    {
      id: 'urteau',
      name: 'Urteau',
      kind: 'city',
      at: { x: 0.45, z: -0.21 },
      description:
        'Capital of the Northern Dominance and House Venture’s ancestral seat — a ' +
        'city of drained canals, later ruled by the tyrant Citizen.',
    },
    {
      id: 'tathingdwen',
      name: 'Tathingdwen',
      kind: 'town',
      at: { x: 0.18, z: -0.63 },
      description:
        'Capital of the Terris people at the southern edge of their mountains — ' +
        'burned in a Ministry purge meant to stamp out Feruchemy.',
    },
    {
      id: 'austrex',
      name: 'Austrex',
      kind: 'town',
      at: { x: -0.01, z: 0.07 },
      description: 'A town on the northern shore of the great Southern Sea.',
    },
    {
      id: 'lekal-city',
      name: 'Lekal City',
      kind: 'town',
      at: { x: -0.07, z: 0.11 },
      description: 'A Southern Dominance city on the sea, seat of the noble House Lekal.',
    },
    {
      id: 'vetitan',
      name: 'Vetitan',
      kind: 'town',
      at: { x: 0.07, z: 0.16 },
      description:
        'A small southern skaa town that Vin and Elend free late in the war — one ' +
        'of the last places the mists turn deadly.',
    },
    {
      id: 'suisna',
      name: 'Suisna',
      kind: 'town',
      at: { x: 0.45, z: 0.26 },
      description: 'A town of the Eastern Dominance, out toward the Conventical.',
    },
    {
      id: 'urbene',
      name: 'Urbene',
      kind: 'town',
      at: { x: 0.49, z: 0.35 },
      description: 'An eastern town on the road to the Conventical of Seran.',
    },
    {
      id: 'conventical-of-seran',
      name: 'The Conventical of Seran',
      kind: 'ruin',
      at: { x: 0.53, z: 0.43 },
      description:
        'A cliff-ringed fortress of the Steel Ministry where Inquisitors are ' +
        'forged — and where, on a steel plate, a long-dead Keeper left the truth ' +
        'about the Deepness.',
    },
    // --- The ashmounts (the Lord Ruler's volcanoes) ---
    {
      id: 'tyrian',
      name: 'Mount Tyrian',
      kind: 'peak',
      at: { x: 0.0, z: -0.16 },
      description: 'The ashmount that stands in Lake Tyrian, just west of Luthadel.',
    },
    {
      id: 'torinost',
      name: 'Mount Torinost',
      kind: 'peak',
      at: { x: 0.0, z: -0.43 },
      description: 'A tall ashmount of the north, on the Western–Northern march.',
    },
    {
      id: 'morag',
      name: 'Mount Morag',
      kind: 'peak',
      at: { x: -0.22, z: -0.31 },
      description: 'An ashmount of the Western Dominance.',
    },
    {
      id: 'kalling',
      name: 'Mount Kalling',
      kind: 'peak',
      at: { x: 0.33, z: -0.33 },
      description: 'A north-eastern ashmount, over the Northern Dominance.',
    },
    {
      id: 'zerinah',
      name: 'Mount Zerinah',
      kind: 'peak',
      at: { x: -0.2, z: 0.06 },
      description: 'An ashmount on the north-western shore of the Southern Sea.',
    },
    {
      id: 'faleast',
      name: 'Mount Faleast',
      kind: 'peak',
      at: { x: 0.18, z: 0.11 },
      description: 'A south-eastern ashmount; its name survives, ages later, in a range of the Basin.',
    },
    {
      id: 'doriel',
      name: 'Mount Doriel',
      kind: 'peak',
      at: { x: 0.06, z: 0.25 },
      description: 'A southern ashmount, inland of the Southern Sea.',
    },
    {
      id: 'terris-mountains',
      name: 'The Terris Mountains',
      kind: 'peak',
      at: { x: 0.33, z: -0.72 },
      description:
        'The cold northern homeland of the Terris and their Keepers, who hid the ' +
        'world’s memory in metalminds through the long night of the Empire.',
    },
  ],
  routes: [
    {
      id: 'river-channerel',
      name: 'The River Channerel',
      color: '#7fa6b8',
      style: 'solid',
      points: [
        { x: 0.2, z: -0.07 },
        { x: 0.45, z: -0.05 },
        { x: 0.72, z: -0.02 },
      ],
    },
    {
      id: 'western-road',
      name: 'The Road to Fadrex',
      color: '#c9a24a',
      style: 'solid',
      points: [
        { x: 0.2, z: -0.07 },
        { x: 0.11, z: -0.06 },
        { x: -0.23, z: -0.14 },
        { x: -0.37, z: -0.24 },
      ],
    },
    {
      id: 'northern-road',
      name: 'The Road to Urteau',
      color: '#c9a24a',
      style: 'solid',
      points: [
        { x: 0.2, z: -0.07 },
        { x: 0.45, z: -0.21 },
      ],
    },
    {
      id: 'terris-road',
      name: 'The Road to Terris',
      color: '#c9a24a',
      style: 'dashed',
      points: [
        { x: 0.2, z: -0.07 },
        { x: 0.19, z: -0.35 },
        { x: 0.18, z: -0.63 },
      ],
    },
  ],
  regions: [
    { id: 'central', name: 'The Central Dominance', at: { x: 0.14, z: 0.0 }, scale: 0.95 },
    { id: 'terris', name: 'The Terris Dominance', at: { x: 0.15, z: -0.85 }, scale: 1.0 },
    { id: 'northern', name: 'The Northern Dominance', at: { x: 0.5, z: -0.36 }, scale: 0.9 },
    { id: 'western', name: 'The Western Dominance', at: { x: -0.28, z: -0.43 }, scale: 0.9 },
    { id: 'farmost', name: 'The Farmost Dominance', at: { x: -0.66, z: -0.49 }, scale: 0.85 },
    { id: 'southern', name: 'The Southern Dominance', at: { x: -0.3, z: 0.12 }, scale: 0.9 },
    { id: 'eastern', name: 'The Eastern Dominance', at: { x: 0.6, z: 0.32 }, scale: 0.9 },
    { id: 'crescent', name: 'The Crescent Dominance', at: { x: 0.88, z: -0.05 }, scale: 0.8 },
    { id: 'remote', name: 'The Remote Dominance', at: { x: -0.38, z: 0.85 }, scale: 0.85 },
    { id: 'southern-sea', name: 'The Southern Sea', at: { x: -0.3, z: 0.42 }, scale: 0.9 },
    { id: 'southern-islands', name: 'The Southern Islands', at: { x: -0.82, z: 0.4 }, scale: 0.8 },
  ],
  elements: [
    {
      id: 'atium',
      name: 'Atium',
      glyph: '◈',
      description:
        'The god-metal: grown as geodes in the Pits of Hathsin, hoarded by the ' +
        'Lord Ruler as the leash on his nobility. Follow it from the Pits to the ' +
        'great cache walled up in Fadrex.',
      journey: [
        { marker: 'pits-of-hathsin', sinceChapter: 0, note: 'Grown in the crystal caves.' },
        { marker: 'fadrex-city', sinceChapter: 4, note: 'The Lord Ruler’s hidden cache.' },
      ],
    },
  ],
  levels: [
    {
      id: 'elendel-basin',
      title: 'The Elendel Basin',
      subtitle: 'Era 2 — three centuries later, the green Basin of Wax & Wayne',
      terrain: {
        seed: 'scadrial-basin-3',
        frequency: 1.5,
        islandFalloff: 0.26,
        seaLevel: 0.36,
        heightScale: 16,
        octaves: 5,
        rivers: 5,
        waterColor: '#26618a',
        biomes: [
          { maxHeight: 0.36, color: '#2e5f7d', name: 'The Sea of Yomend' },
          { maxHeight: 0.4, color: '#d8c79c', name: 'Shore' },
          { maxHeight: 0.5, color: '#7ba85f', name: 'Basin Farmland' },
          { maxHeight: 0.64, color: '#4f8a4a', name: 'Green Hills' },
          { maxHeight: 0.8, color: '#77785a', name: 'The Roughs' },
          { maxHeight: 1.0, color: '#e9edf2', name: 'The Ring Ranges' },
        ],
      },
      ambient: { trees: 0.6, treeKind: 'broadleaf', birds: 6, fish: 4 },
      markers: [
        {
          id: 'elendel',
          name: 'Elendel',
          kind: 'capital',
          at: { x: -0.25, z: -0.12 },
          description:
            'The Great City, largest on Scadrial — Wax and Wayne’s home ground. At ' +
            'its heart lies the Field of Rebirth, where the statues of the Ascendant ' +
            'Warrior and the Survivor stand and the river splits around them.',
        },
        {
          id: 'dulsing',
          name: 'Dulsing',
          kind: 'town',
          at: { x: -0.12, z: -0.4 },
          description:
            'A remote farming village north of Elendel, where the Set build and ' +
            'launch the airship that carries the hunt for the Bands.',
        },
        {
          id: 'bilming',
          name: 'Bilming',
          kind: 'city',
          at: { x: -0.06, z: -0.54 },
          description:
            'The Basin’s second city, up the northern coast — a stronghold of the ' +
            'Set and of Trell, and the climax of the Lost Metal.',
        },
        {
          id: 'weathering',
          name: 'Weathering',
          kind: 'town',
          at: { x: 0.5, z: -0.48 },
          description: 'A dusty town of the Roughs where Waxillium Ladrian kept the law before Elendel.',
        },
        {
          id: 'the-roughs',
          name: 'The Roughs',
          kind: 'landmark',
          at: { x: 0.62, z: -0.66 },
          description:
            'The lawless frontier beyond the mountains, where a man settles his own ' +
            'accounts — the making of Wax the lawman.',
        },
        {
          id: 'new-seran',
          name: 'New Seran',
          kind: 'city',
          at: { x: 0.5, z: 0.5 },
          description:
            'A wealthy city at the far south-east end of the rail line, at the foot ' +
            'of the Seran Range — a masquerade, a murder, and a trail to the Bands.',
        },
        {
          id: 'sovereigns-temple',
          name: "The Sovereign's Temple",
          kind: 'ruin',
          at: { x: 0.62, z: 0.62 },
          description:
            'A hidden cavern-temple in the mountains beyond New Seran, holding an ' +
            'airship, Southern relics, and Kelsier’s own metalminds — the Bands of ' +
            'Mourning.',
        },
      ],
      routes: [
        {
          id: 'rails-new-seran',
          name: 'The Rail to New Seran',
          color: '#c9a24a',
          style: 'solid',
          points: [
            { x: -0.25, z: -0.12 },
            { x: 0.12, z: 0.18 },
            { x: 0.5, z: 0.5 },
          ],
        },
        {
          id: 'roughs-road',
          name: 'Wax in the Roughs',
          color: '#e0a25a',
          style: 'dashed',
          points: [
            { x: -0.25, z: -0.12 },
            { x: 0.2, z: -0.32 },
            { x: 0.5, z: -0.48 },
            { x: 0.62, z: -0.66 },
          ],
        },
      ],
      regions: [
        { id: 'basin', name: 'The Elendel Basin', at: { x: -0.05, z: 0.05 }, scale: 1.1 },
        { id: 'roughs-region', name: 'The Roughs', at: { x: 0.6, z: -0.6 }, scale: 0.9 },
        { id: 'seran-range', name: 'The Seran Range', at: { x: 0.58, z: 0.4 }, scale: 0.85 },
      ],
    },
  ],
  books: [
    {
      id: 'final-empire',
      title: 'The Final Empire',
      subtitle: 'The skaa rebellion',
      chapters: [
        {
          id: 'kelsiers-crew',
          title: "Kelsier's Crew",
          narration:
            'In Luthadel, under a thousand years of ash and tyranny, the Survivor ' +
            'Kelsier gathers a crew of thieves and a street girl named Vin, and ' +
            'sells them an impossible job: rob the Lord Ruler, and topple the Final ' +
            'Empire.',
          focus: { marker: 'luthadel', distance: 40, pitch: 40 },
          reveal: { markers: ['luthadel'], routes: ['western-road'], regions: ['central'] },
          highlight: { markers: ['luthadel'] },
        },
        {
          id: 'the-eleventh-metal',
          title: 'The Eleventh Metal',
          narration:
            'The plan turns on the Pits of Hathsin, where the Lord Ruler grows his ' +
            'atium — and on a rumoured metal that can kill a god. On the palace ' +
            'steps at Kredik Shaw, the immortal is at last brought down.',
          focus: { marker: 'pits-of-hathsin', distance: 40, pitch: 34 },
          reveal: { markers: ['pits-of-hathsin', 'tyrian', 'fellis'], regions: ['southern'] },
          highlight: { markers: ['pits-of-hathsin', 'luthadel'] },
        },
      ],
    },
    {
      id: 'well-of-ascension',
      title: 'The Well of Ascension',
      subtitle: 'The siege',
      chapters: [
        {
          id: 'siege-of-luthadel',
          title: 'The Siege of Luthadel',
          narration:
            'With the Lord Ruler gone, three armies close on Luthadel and Elend ' +
            'struggles to hold a young republic. Vin hunts a mist spirit through the ' +
            'city and chases the pull of the Well of Ascension.',
          focus: { marker: 'luthadel', distance: 46, pitch: 44 },
          reveal: { markers: ['urteau', 'kalling', 'arguois'], routes: ['northern-road'], regions: ['northern'] },
          highlight: { markers: ['luthadel'] },
        },
        {
          id: 'the-well',
          title: 'The Well of Ascension',
          narration:
            'Beneath Kredik Shaw, Vin reaches the Well and gives up its power ' +
            'rather than take it — and in doing so unwittingly frees Ruin, the ' +
            'force that has been steering the world toward its end.',
          focus: { marker: 'luthadel', distance: 34, pitch: 30 },
          highlight: { markers: ['luthadel'] },
        },
      ],
    },
    {
      id: 'hero-of-ages',
      title: 'The Hero of Ages',
      subtitle: 'The end of the world',
      chapters: [
        {
          id: 'the-ashmounts',
          title: 'The Ashmounts Erupt',
          narration:
            'The ashmounts choke the sky, the mists begin to kill, and Elend ' +
            'besieges Fadrex for the atium cache. As the world dies, Vin and Ruin ' +
            'fall together — and Sazed, holding the powers of Preservation and ' +
            'Ruin, remakes Scadrial green again.',
          focus: { marker: 'fadrex-city', distance: 44, pitch: 34 },
          reveal: {
            markers: [
              'fadrex-city',
              'tremredare',
              'faleast',
              'doriel',
              'terris-mountains',
              'tathingdwen',
              'conventical-of-seran',
            ],
            regions: ['western', 'terris', 'eastern'],
          },
          highlight: { markers: ['fadrex-city'] },
        },
      ],
    },
    {
      id: 'wax-and-wayne',
      title: 'Wax & Wayne',
      subtitle: 'Era 2 — the Elendel Basin',
      chapters: [
        {
          id: 'alloy-of-law',
          title: 'The Alloy of Law',
          narration:
            'Three centuries on, in the green Basin the old gods left behind, the ' +
            'lawman Waxillium Ladrian is called home from the Roughs to Elendel — ' +
            'where a gang of Allomantic robbers, the Vanishers, is taking the city ' +
            'apart.',
          level: 'elendel-basin',
          focus: { marker: 'elendel', distance: 40, pitch: 38 },
          reveal: {
            markers: ['elendel', 'weathering', 'the-roughs'],
            routes: ['roughs-road'],
            regions: ['basin', 'roughs-region'],
          },
          highlight: { markers: ['elendel'] },
        },
        {
          id: 'bands-of-mourning',
          title: 'The Bands of Mourning',
          narration:
            'A rumour of the Sovereign’s own metalminds — the Bands of Mourning — ' +
            'draws Wax and Wayne to New Seran and into the mountains beyond, to a ' +
            'hidden temple and an airship out of a lost age.',
          level: 'elendel-basin',
          focus: { marker: 'new-seran', distance: 42, pitch: 34 },
          reveal: {
            markers: ['new-seran', 'sovereigns-temple', 'dulsing', 'bilming'],
            routes: ['rails-new-seran'],
            regions: ['seran-range'],
          },
          highlight: { markers: ['new-seran', 'sovereigns-temple'] },
        },
      ],
    },
  ],
}
