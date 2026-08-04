import type { Story } from '../types'
import estoniaHeight from '../assets/estonia-height.png'

/**
 * Kalevipoeg — a public-domain sample world drawn from the Estonian national
 * epic (F. R. Kreutzwald, 1857; author d. 1882 → public domain). It exercises
 * the multi-book model, tracked artifacts, and map levels.
 *
 * The surface uses a REAL heightmap: a Terrarium DEM of Estonia + the Gulf of
 * Finland + Lake Peipus + Pskov, so the coastline is the actual one. Markers
 * sit at their true relative positions (Tallinn on the north coast, Finland
 * north across the gulf, Peipus on the east, Pskov to the south-east). The
 * mythic Põrgu underworld below stays procedurally generated.
 *
 * Narration is a brief paraphrase of the epic's events, not a quotation of any
 * particular translation.
 */
export const kalevipoeg: Story = {
  id: 'kalevipoeg',
  title: 'Kalevipoeg',
  subtitle: 'The Estonian epic, as a map across three books',
  author: 'F. R. Kreutzwald',
  region: 'Estonia & Põrgu',
  epoch: 'Estonian national epic · 1857',
  intro:
    'The song of Kalev’s son — giant, king, and wanderer. One land, told in ' +
    'three books: his birth and the winning of the sword, his wars and ' +
    'voyages, and his end at the gates of Põrgu. Press ▶ Play story to follow ' +
    'the whole saga, or use the floor switcher to descend into Põrgu below — ' +
    'you enter at its Gates in the north and climb back out at the Cleft to ' +
    'Daylight in the south, the road between them marked.',
  surfaceName: 'The Living Lands',
  ambient: {
    trees: 0.6,
    treeKind: 'conifer',
    birds: 6,
    rain: true,
    fish: 4,
  },
  terrain: {
    seed: 'kalev-9', // unused: heightmap takes precedence
    heightmap: estoniaHeight,
    seaLevel: 0.18, // 0 m sits at this normalized height in the DEM
    // Estonia is genuinely flat (its high point is ~318 m), so keep the relief
    // gentle — a light exaggeration for legibility, not mountains.
    heightScale: 13,
    rivers: 6,
    biomes: [
      { maxHeight: 0.18, color: '#2c5a74', name: 'Baltic Sea' },
      { maxHeight: 0.225, color: '#d7cba1', name: 'Coast' },
      { maxHeight: 0.34, color: '#6f9b57', name: 'Lowlands' },
      { maxHeight: 0.5, color: '#4f8a4a', name: 'Forests' },
      { maxHeight: 0.72, color: '#7c8a5a', name: 'Uplands' },
      { maxHeight: 1.0, color: '#b7ad94', name: 'Hills' },
    ],
  },
  markers: [
    {
      id: 'lindanisa',
      name: 'Lindanisa',
      kind: 'capital',
      at: { x: -0.08, z: -0.18 },
      description:
        'The hill-seat Kalevipoeg raises as his royal burg — the stronghold ' +
        'later remembered as Tallinn.',
    },
    {
      id: 'kalev-barrow',
      name: "Kalev's Barrow",
      kind: 'landmark',
      at: { x: 0.04, z: -0.02 },
      description:
        'Where the old king Kalev is laid to rest. His widow Linda’s weeping ' +
        'is said to have raised the mound and welled up a lake of tears.',
    },
    {
      id: 'peipus',
      name: 'Lake Peipus',
      kind: 'port',
      at: { x: 0.64, z: 0.18 },
      description:
        'The great eastern water. Along its shores the hero hauls timber and ' +
        'rests — and here his fortunes turn.',
    },
    {
      id: 'finland',
      name: 'Finland',
      kind: 'peak',
      at: { x: -0.15, z: -0.75 },
      description:
        'Across the gulf lies the hall of the Finnish smith, who forges a ' +
        'sword worthy of a giant — and later curses it.',
    },
    {
      id: 'assamalla',
      name: 'Assamälla',
      kind: 'battle',
      at: { x: 0.32, z: -0.12 },
      description: 'A field of one of the hero’s great battles against invaders.',
    },
    {
      id: 'pihkva',
      name: 'Pihkva',
      kind: 'city',
      at: { x: 0.87, z: 0.69 },
      description: 'The southern city (Pskov) against which the hero campaigns.',
    },
    {
      id: 'kaapa',
      name: 'Kääpa',
      kind: 'danger',
      at: { x: 0.53, z: 0.59 },
      description:
        'The brook where the stolen sword comes to rest — and waits, under a ' +
        'curse, for the day its master wades across.',
    },
    {
      id: 'endla',
      name: 'Lake Endla',
      kind: 'forest',
      at: { x: 0.29, z: 0.08 },
      description: 'A misted lake of the inland forests, haunt of spirits and song.',
    },
    {
      id: 'ulemiste',
      name: 'Lake Ülemiste',
      kind: 'landmark',
      at: { x: -0.05, z: -0.13 },
      description:
        'The lake above Lindanisa, welled up (they say) from Linda’s tears as ' +
        'she mourned old Kalev — home of the Old Man of the Lake, who each ' +
        'winter asks whether the city is finished yet.',
    },
    {
      id: 'saarepiiga',
      name: "The Island Maiden's Isle",
      kind: 'danger',
      at: { x: -0.62, z: 0.02 },
      description:
        'The western isle where the young hero woos a maiden — who, fearing ' +
        'the two of them kin, casts herself into the sea rather than learn the ' +
        'truth. His first sorrow.',
    },
    {
      id: 'tuuslar',
      name: "Tuuslar's Shore",
      kind: 'danger',
      at: { x: 0.03, z: -0.82 },
      description:
        'The landing of the Finnish sorcerer Tuuslar, who carried off the widow ' +
        'Linda — and against whom the hero first crosses the gulf in wrath.',
    },
    {
      id: 'kikerpara',
      name: 'The Bogs of Kikerpära',
      kind: 'forest',
      at: { x: 0.2, z: 0.42 },
      description:
        'Treacherous mire and heath of the inland south, where paths mislead ' +
        'and sorcery lingers over the still water.',
    },
    {
      id: 'deep-gate',
      name: 'The Mouth of Põrgu',
      kind: 'danger',
      at: { x: 0.37, z: 0.82 },
      description:
        'The cavern-mouth in the daylight world: the way DOWN into hell. The ' +
        'hero climbs from here to the Gates of Põrgu below. Use the floor ' +
        'switcher to descend into Põrgu — you enter at its Gates and climb ' +
        'back out at the Cleft to Daylight.',
    },
    {
      id: 'world-end',
      name: "The World's End",
      kind: 'landmark',
      at: { x: -0.2, z: -0.88 },
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
        { x: -0.08, z: -0.18 },
        { x: -0.11, z: -0.48 },
        { x: -0.15, z: -0.75 },
      ],
    },
    {
      id: 'wars',
      name: 'The Wars',
      color: '#e0a25a',
      style: 'solid',
      points: [
        { x: -0.08, z: -0.18 },
        { x: 0.32, z: -0.12 },
        { x: 0.87, z: 0.69 },
      ],
    },
    {
      id: 'last-road',
      name: 'The Last Road',
      color: '#c56b7a',
      style: 'dashed',
      points: [
        { x: -0.08, z: -0.18 },
        { x: 0.37, z: 0.82 },
        { x: 0.53, z: 0.59 },
      ],
    },
  ],
  regions: [
    { id: 'homeland', name: 'The Homeland', at: { x: 0.05, z: -0.05 }, scale: 1.15 },
    { id: 'eastern-waters', name: 'The Eastern Waters', at: { x: 0.64, z: 0.2 } },
    { id: 'suomi', name: 'Finland', at: { x: -0.1, z: -0.85 }, scale: 0.9 },
    { id: 'underworld', name: 'The Marches of Põrgu', at: { x: 0.4, z: 0.7 }, scale: 0.9 },
  ],
  levels: [
    {
      id: 'porgu',
      title: 'Põrgu',
      subtitle: 'Hell below — in at the Gates (north), out to daylight (south)',
      terrain: {
        // A broad, calm cinder-basin (low island falloff, few octaves) so the
        // road from the Gates down to the exit reads clearly, rather than a
        // blobby island lost in a black moat.
        seed: 'porgu-3',
        frequency: 1.6,
        islandFalloff: 0.16,
        seaLevel: 0.3,
        heightScale: 16,
        octaves: 4,
        // No procedural rivers here: on this calm basin they render as short
        // stray stubs that read like broken routes. The Hero's Road is the
        // only line the eye should follow; molten pools give the lava mood.
        rivers: 0,
        sky: 'dark',
        waterColor: '#3a0d0a',
        biomes: [
          { maxHeight: 0.3, color: '#240a0a', name: 'Molten Pools' },
          { maxHeight: 0.4, color: '#3a1512', name: 'Ashen Shore' },
          { maxHeight: 0.55, color: '#5a1f18', name: 'Cinder Floor' },
          { maxHeight: 0.7, color: '#7a2a1a', name: 'Ember Rock' },
          { maxHeight: 0.85, color: '#b04a22', name: 'Glowing Crags' },
          { maxHeight: 1.0, color: '#ffb24a', name: 'The Pyres' },
        ],
      },
      ambient: { trees: 0, birds: 0, dragons: 2 },
      markers: [
        {
          id: 'porgu-gates',
          name: 'The Gates of Põrgu',
          kind: 'landmark',
          at: { x: 0.0, z: -0.82 },
          description:
            'THE ENTRANCE. The iron gates of hell, at the foot of the shaft ' +
            'the hero climbs down from the Mouth of Põrgu in the daylight ' +
            'world above. He passes them going in — and after his death is ' +
            'set here to guard them.',
        },
        {
          id: 'the-binding',
          name: 'The Binding Stone',
          kind: 'ruin',
          at: { x: -0.18, z: -0.64 },
          description:
            'Just within the gates, the rock to which the gods later fasten ' +
            'the fallen hero’s hand, that he may guard Põrgu’s threshold until ' +
            'his people are free again.',
        },
        {
          id: 'the-cauldron',
          name: 'The Great Cauldron',
          kind: 'landmark',
          at: { x: -0.32, z: -0.4 },
          description:
            'Põrgu’s vast kettle, forever boiling. The road down into the ' +
            'deeps runs past its rim.',
        },
        {
          id: 'fire-river',
          name: 'The River of Fire',
          kind: 'danger',
          at: { x: 0.22, z: -0.16 },
          description:
            'A molten stream the hero must ford on his way in toward Sarvik’s ' +
            'hall.',
        },
        {
          id: 'sarvik-hall',
          name: "Sarvik's Hall",
          kind: 'danger',
          at: { x: 0.0, z: 0.06 },
          description:
            'The seat of Sarvik the Horned, lord of the underworld, in the ' +
            'deepest part of Põrgu. Here the hero wrestles him, binds him, and ' +
            'breaks his power.',
        },
        {
          id: 'maidens-cells',
          name: "The Maidens' Cells",
          kind: 'ruin',
          at: { x: -0.28, z: 0.32 },
          description:
            'Where Sarvik keeps captive maidens. The hero strikes off their ' +
            'chains and leads them up toward the light.',
        },
        {
          id: 'the-hoard',
          name: 'The Hoard',
          kind: 'landmark',
          at: { x: 0.28, z: 0.54 },
          description:
            'The demon’s heaped gold, which the hero carries up out of Põrgu.',
        },
        {
          id: 'porgu-exit',
          name: 'The Cleft to Daylight',
          kind: 'landmark',
          at: { x: 0.0, z: 0.82 },
          description:
            'THE EXIT. The climb back to the daylight world. Laden with the ' +
            'hoard and leading the freed maidens, the hero ascends here, out ' +
            'of the deeps and into the open air.',
        },
      ],
      routes: [
        {
          id: 'hero-road',
          name: 'The Hero’s Road through Põrgu',
          color: '#ffb24a',
          style: 'solid',
          // The road runs THROUGH every stop in order, so each place sits on
          // the trail: Gates → Binding Stone → Great Cauldron → ford the River
          // of Fire → Sarvik's Hall (the deeps) → Maidens' Cells → the Hoard →
          // Cleft. Splined and draped onto the terrain, so it winds and also
          // rises and dips with the crags.
          points: [
            { x: 0.0, z: -0.82 }, // Gates (entrance)
            { x: -0.18, z: -0.64 }, // Binding Stone
            { x: -0.32, z: -0.4 }, // Great Cauldron
            { x: 0.22, z: -0.16 }, // ford the River of Fire
            { x: 0.0, z: 0.06 }, // Sarvik's Hall
            { x: -0.28, z: 0.32 }, // Maidens' Cells
            { x: 0.28, z: 0.54 }, // the Hoard
            { x: 0.0, z: 0.82 }, // Cleft (exit)
          ],
        },
      ],
      regions: [
        { id: 'threshold', name: 'The Gates — enter here', at: { x: 0.34, z: -0.82 }, scale: 0.7 },
        { id: 'deeps', name: 'The Deeps of Põrgu', at: { x: 0.34, z: 0.04 }, scale: 1.0 },
        { id: 'ascent', name: 'The Cleft — back to daylight', at: { x: 0.34, z: 0.82 }, scale: 0.7 },
      ],
    },
  ],
  elements: [
    {
      id: 'sword',
      name: 'The Cursed Sword',
      glyph: '⚔',
      description:
        'The great blade forged in Finland — and cursed to one day cut down ' +
        'its bearer. Track it across the epic: forged, carried, lost, and ' +
        'waiting in the brook for the day its master wades across.',
      journey: [
        {
          marker: 'finland',
          sinceChapter: 2,
          note: 'Forged by the smith of Finland, then cursed.',
        },
        {
          marker: 'lindanisa',
          sinceChapter: 4,
          note: 'Borne home and carried into the wars.',
        },
        {
          marker: 'kaapa',
          sinceChapter: 6,
          note: 'Stolen by Peipus and lost in the Kääpa — where it waits.',
        },
      ],
    },
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
            markers: ['kalev-barrow', 'lindanisa', 'ulemiste'],
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
          reveal: { markers: ['finland', 'peipus', 'tuuslar', 'saarepiiga'], routes: ['sword-quest'] },
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
            'Down through the Mouth of Põrgu the hero climbs to the iron Gates ' +
            '(north). He fords the river of fire, passes the great cauldron, ' +
            'and comes to Sarvik’s hall in the deeps — where he wrestles the ' +
            'Horned One, binds him, frees the captive maidens, and takes the ' +
            'hoard. Then up the Cleft to Daylight (south) he climbs, back into ' +
            'the open air. (You have descended a level — follow the road.)',
          level: 'porgu',
          focus: { at: { x: 0.0, z: 0.0 }, distance: 96, pitch: 58 },
          reveal: {
            markers: [
              'porgu-gates',
              'the-cauldron',
              'fire-river',
              'sarvik-hall',
              'maidens-cells',
              'the-hoard',
              'porgu-exit',
            ],
            routes: ['hero-road'],
            regions: ['threshold', 'deeps', 'ascent'],
          },
          highlight: { markers: ['porgu-gates', 'sarvik-hall', 'porgu-exit'], routes: ['hero-road'] },
        },
        {
          id: 'kaapa-death',
          title: 'The Kääpa',
          narration:
            'Back in the daylight, Kalevipoeg wades the Kääpa brook. The lost ' +
            'sword wakes to its old curse and shears the legs from its master.',
          focus: { marker: 'kaapa', distance: 30, pitch: 28 },
          reveal: { markers: ['deep-gate'], routes: ['last-road'], regions: ['underworld'] },
          highlight: { markers: ['kaapa'] },
        },
        {
          id: 'guardian',
          title: 'Guardian at the Gates',
          narration:
            'The gods set the fallen hero back below, his hand fast to the ' +
            'Binding Stone, to guard the gates of Põrgu until the day his ' +
            'people are free again.',
          level: 'porgu',
          focus: { marker: 'porgu-gates', distance: 38, pitch: 42, heading: 15 },
          reveal: { markers: ['the-binding'] },
          highlight: { markers: ['porgu-gates', 'the-binding'] },
        },
      ],
    },
  ],
}
