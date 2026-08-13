import type { Story } from '../types'
import latviaHeight from '../assets/latvia-height.png'

/**
 * Lāčplēsis — the Latvian national epic (Andrejs Pumpurs, written 1872–87,
 * published 1888; author d. 1902 → public domain). The sibling of Kalevipoeg,
 * already in this atlas: both are 19th-century epics assembled out of folk
 * song, both end with the hero going down into the water and a promise that he
 * will rise. They even share a character — the giant Kalapuisis whom Lāčplēsis
 * fights to a draw IS Kalev's son, so the two maps link to each other at that
 * duel (see the `link` on `estonian-march` here and on `laacplesis-duel` in
 * kalevipoeg.ts).
 *
 * The surface uses a REAL heightmap: a Terrarium DEM of Latvia, the Gulf of
 * Riga, the eastern Baltic and southern Estonia, so the coast and the Daugava's
 * valley are the actual ones. Markers sit at their true coordinates —
 *
 *   map x = (lon − 19.2) / 4.8 − 1      map z = (58.6 − lat) / 1.7 − 1
 *
 * — for every place that exists on the ground (Lielvārde, Aizkraukle, Koknese,
 * Staburags, Burtnieki, Rīga, Turaida, Tērvete, Kolka …). Places the songs
 * never fix — the Enchanted Island, the sunken castle, the hall of the North
 * Wind's daughter — are set in the right DIRECTION and say so in their own
 * text, rather than pretending to a coordinate.
 *
 * Two mythic floors hang off the surface, both drawn from the epic's own
 * opening and its third canto: Pērkons's sky palace above, where the gods hold
 * the council the poem starts with, and Staburadze's crystal castle below the
 * Daugava, where the drowning hero is carried.
 *
 * Narration paraphrases the epic's events; it quotes no translation.
 */
export const lacplesis: Story = {
  id: 'lacplesis',
  title: 'Lāčplēsis',
  subtitle: 'The Bear-Slayer, mapped along the Daugava',
  author: 'Andrejs Pumpurs',
  region: 'Latvia, the sky palace & the crystal castle',
  epoch: 'Latvian national epic · 1888 · set in the 13th c.',
  group: 'epic',
  intro:
    'The Bear-Slayer — torn from a she-bear, raised at Lielvārde, strong ' +
    'enough to pull a bear’s jaws apart, and undone in the end by the two ' +
    'ears that carried that strength. The whole poem runs up and down one ' +
    'river: press ▶ Play story to follow the Daugava from Lielvārde to the ' +
    'whirlpool at Staburags and out to the sea, or use the floor switcher to ' +
    'climb to Pērkons’s hall above, where the gods open the poem in council, ' +
    'and to sink to Staburadze’s crystal castle below the river.',
  surfaceName: 'The Daugava Lands',
  ambient: {
    trees: 0.7,
    treeKind: 'conifer',
    birds: 5,
    fish: 4,
    // The weather worsens as you go north. Rain sits over the top of the map —
    // the Gulf's northern reach, the Estonian isles and the border where the
    // levies march — so the country the hero crosses into is visibly colder and
    // wetter than the Daugava valley he starts in. Overcast everywhere would
    // just hide the map.
    rain: true,
    rainArea: { x0: -0.62, x1: 1.0, z0: -1.0, z1: -0.46 },
  },
  terrain: {
    music: {
      // The real thing at last: the Daugava boatmen's song, transcribed from
      // Andrejs Jurjāns' 1884 four-part setting (Jurjāns d. 1922 → public
      // domain). E major, 3/4, quarter = 70, eight bars and repeat. The whole
      // song is one shape: up to the C#5 at "dzen laiviņu", then a long walk
      // down to the tonic on "Kurzemē".
      title: 'Pūt, vējiņi',
      credit: 'Latvian folk song · arr. Andrejs Jurjāns, 1884 · public domain',
      melody:
        'F#4:1 A4:2 G#4:0.5 F#4:0.5 E4:2 G#4:1 B4:2 C#5:1 B4:2 ' +
        'F#4:0.5 G#4:0.5 A4:2 A4:1 G#4:2 A4:0.5 G#4:0.5 F#4:2 E4:3 r:2',
      // Roots under the phrase: tonic, dominant, subdominant, and home.
      bass: 'E2:6 B2:6 A2:6 B2:3 E2:3',
      tempo: 70,
      // Sung, not plucked — the words read like a drinking song but the tune
      // is always given reverently, closer to a hymn.
      voice: 'flute',
      mood: 'calm',
    },
    seed: 'lacplesis-1', // unused: the heightmap takes precedence
    heightmap: latviaHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM. The build applies a
    // land-only gamma (see the `latvia` preset), which lifts Rīga and Zemgale —
    // both barely a dozen metres up — clear of the water plane without moving
    // the coastline.
    seaLevel: 0.0547,
    // 584 km across by 376 km down — the box in real proportion, so Kurzeme
    // is not stretched to fill a square.
    aspect: 1.553,
    // Latvia's high point is Gaiziņkalns at 312 m. Keep the relief gentle and
    // legible rather than inventing mountains.
    heightScale: 14,
    rivers: 5,
    biomes: [
      { maxHeight: 0.0547, color: '#2b5871', name: 'The Baltic' },
      { maxHeight: 0.14, color: '#d8cca4', name: 'Dunes' },
      { maxHeight: 0.34, color: '#6c9a58', name: 'Lowlands' },
      { maxHeight: 0.5, color: '#4c874a', name: 'Pine forest' },
      { maxHeight: 0.65, color: '#7b8a5b', name: 'Uplands' },
      { maxHeight: 1.0, color: '#b3ab93', name: 'Highlands' },
    ],
  },

  markers: [
    {
      id: 'lielvarde',
      name: 'Lielvārde',
      kind: 'capital',
      at: { x: 0.168, z: 0.105 },
      description:
        'The seat on the Daugava where the lord’s adopted son meets a bear on ' +
        'the road and tears its jaws apart with his bare hands — and is named ' +
        'Lāčplēsis for it. The poem returns here to end: the tournament where ' +
        'the Dark Knight shears off his ears is fought on this ground.',
    },
    {
      id: 'aizkraukle',
      name: 'Aizkraukle',
      kind: 'city',
      at: { x: 0.262, z: 0.175 },
      description:
        'The castle where he lodges on the road upriver — and where, awake in ' +
        'the dark, he watches the witch Spīdala and the holy man Kangars at ' +
        'their work. She is bound to the Devil; he is selling the old gods to ' +
        'the crusaders. Neither knows they have been seen.',
    },
    {
      id: 'staburags',
      name: 'The Whirlpool of Staburags',
      kind: 'danger',
      at: { x: 0.328, z: 0.209 },
      description:
        'The cliff over the Daugava and the water turning below it. Spīdala ' +
        'throws Lāčplēsis in here to be rid of him — and the goddess ' +
        'Staburadze takes him instead, down to her crystal castle. Descend a ' +
        'floor to stand in it. The real Staburags was an 18-metre cliff built ' +
        'up by lime-rich springs; the Pļaviņas dam drowned it in 1965 and it ' +
        'now lies six and a half metres under. The map shows where it stood.',
    },
    {
      id: 'koknese',
      name: 'Koknese',
      kind: 'city',
      at: { x: 0.299, z: 0.149 },
      description:
        'A stronghold on the Daugava, sharing its name with Lāčplēsis’s sworn ' +
        'friend Koknesis, the Wood-Bearer — though the poem never says the man ' +
        'comes from the place. The two of them study together at Burtnieks and ' +
        'are not parted until Germany takes him.',
    },
    {
      id: 'burtnieki',
      name: 'Burtnieks',
      kind: 'city',
      at: { x: 0.275, z: -0.459 },
      description:
        'The castle of learning on its lake, north in Vidzeme, where the old ' +
        'lord Burtnieks keeps the runes and the histories. Lāčplēsis is sent ' +
        'here to be schooled, and here he meets Laimdota, who is Burtnieks’s ' +
        'daughter.',
    },
    {
      id: 'beverina',
      name: 'Beverīna',
      kind: 'ruin',
      at: { x: 0.354, z: -0.382 },
      description:
        'The stronghold of Tālava, whose bard — the chronicle says — stopped a ' +
        'siege by singing from the ramparts until the besiegers lost heart. ' +
        'The chronicles name Beverīna but never fix it; the Trikāta castle ' +
        'mound, here, is the site most often argued for.',
    },
    {
      id: 'riga',
      name: 'Rīga',
      kind: 'city',
      at: { x: 0.022, z: -0.029 },
      description:
        'The city the crusaders raise at the Daugava’s mouth — Bishop Albert’s ' +
        'seat and the door through which the Order comes. Every ship that ' +
        'lands the poem’s enemies lands here.',
    },
    {
      id: 'daugavgriva',
      name: 'The Mouth of the Daugava',
      kind: 'port',
      at: { x: 0.006, z: -0.091 },
      description:
        'Where the river the whole poem follows finally gives out into the ' +
        'gulf. Lāčplēsis takes ship from here to go looking for Laimdota.',
    },
    {
      id: 'turaida',
      name: 'Turaida',
      kind: 'landmark',
      at: { x: 0.177, z: -0.165 },
      description:
        'The hill-fort above the Gauja held by the Livonian prince Caupo — who ' +
        'takes baptism, sails with the priest Dietrich to see the Pope, and ' +
        'comes home to fight on the Order’s side against his own.',
    },
    {
      id: 'estonian-march',
      name: 'The Estonian March',
      kind: 'battle',
      at: { x: 0.421, z: -0.515 },
      description:
        'The northern border, where Kangars’s scheming sets Latvians and ' +
        'Estonians at each other. Lāčplēsis and the Estonian giant Kalapuisis ' +
        'fight all day and neither can throw the other — so they stop, swear ' +
        'friendship, and turn together on the crusaders. Kalapuisis is Kalev’s ' +
        'son: the same duel stands in the Estonian epic, from his side.',
      link: {
        world: 'kalevipoeg',
        marker: 'lacplesis-duel',
        note: 'The same day’s fighting, told from the Estonian side of the border.',
      },
    },
    {
      id: 'tervete',
      name: 'Tērvete',
      kind: 'ruin',
      at: { x: -0.142, z: 0.253 },
      description:
        'The great Semigallian hill-fort in the south, the last of the old ' +
        'strongholds to hold out. Not a scene of the poem, but the country it ' +
        'is fighting for.',
    },
    {
      id: 'jelgava',
      name: 'Zemgale',
      kind: 'town',
      at: { x: -0.056, z: 0.147 },
      description:
        'The flat, black-earthed country south of the gulf — the granary the ' +
        'invaders want, and the plain the levies cross to reach the Daugava.',
    },
    {
      id: 'gaizinkalns',
      name: 'Gaiziņkalns',
      kind: 'peak',
      at: { x: 0.4125, z: 0.0235 },
      description:
        'The roof of the country at 312 metres — which is to say the country ' +
        'has no mountains. Everything in this poem happens on a plain, along a ' +
        'river, or on the sea.',
    },
    {
      id: 'sunken-castle',
      name: 'The Sunken Castle',
      kind: 'danger',
      at: { x: 0.604, z: 0.059 },
      description:
        'A castle under a curse and under water, which Lāčplēsis sits out one ' +
        'whole night until the enchantment breaks and it rises into the air. ' +
        'The songs never say which lake — this is Lubāns, the largest, and the ' +
        'placement is the map’s guess, not the poem’s.',
    },
    {
      id: 'razna',
      name: 'The Latgale Lakes',
      kind: 'forest',
      at: { x: 0.698, z: 0.341 },
      description:
        'The lake country of the east, where the Daugava comes in out of the ' +
        'Rus’ lands and the poem’s world runs out into rumour.',
    },
    {
      id: 'daugavpils',
      name: 'The Upper Daugava',
      kind: 'town',
      at: { x: 0.528, z: 0.603 },
      description:
        'The river above the rapids, coming down out of the south-east. The ' +
        'road the Order will eventually take inland, and the way news reaches ' +
        'the highlands last.',
    },
    {
      id: 'kolka',
      name: 'Cape Kolka',
      kind: 'landmark',
      at: { x: -0.293, z: -0.501 },
      description:
        'The horn of sand where the gulf ends and the open Baltic begins, and ' +
        'the two seas break against each other over the shoal. Every ship ' +
        'leaving Latvia the long way rounds this point.',
    },
    {
      id: 'kurzeme-shore',
      name: 'The Kurzeme Shore',
      kind: 'port',
      at: { x: -0.508, z: -0.288 },
      description:
        'The long western coast, all pine and dune and amber, facing the open ' +
        'sea. Lāčplēsis passes it going out and comes back down it lost.',
    },
    {
      id: 'saaremaa',
      name: 'The Estonian Isles',
      kind: 'landmark',
      at: { x: -0.375, z: -0.676 },
      description:
        'Saaremaa and its neighbours across the mouth of the gulf — the ' +
        'northern seamark, and Kalapuisis’s country beyond it.',
    },
    {
      id: 'enchanted-isle',
      name: 'The Enchanted Island',
      kind: 'danger',
      at: { x: -0.75, z: -0.3 },
      description:
        'Somewhere in the western sea, an island with monsters on it: three ' +
        'heads, then six, then nine, each worse than the last. Lāčplēsis kills ' +
        'all three, finds Spīdala there and tears up her contract with the ' +
        'Devil, and finds Laimdota and Koknesis, who escaped Germany only to ' +
        'be stranded here. The poem gives no bearing; this is open Baltic west ' +
        'of Kurzeme, which is the direction he sailed.',
    },
    {
      id: 'north-wind',
      name: 'The Hall of the North Wind’s Daughter',
      kind: 'landmark',
      at: { x: -0.88, z: -0.85 },
      description:
        'Blown off his course and lost in the northern sea, Lāčplēsis is taken ' +
        'in and made welcome by the daughter of the North Wind. Off the top of ' +
        'any real chart — set here at the map’s northern rim, in the direction ' +
        'the storm carried him.',
    },
    {
      id: 'german-road',
      name: 'The Road to Germany',
      kind: 'port',
      at: { x: -0.93, z: 0.72 },
      description:
        'South-west over the sea, where Laimdota and Koknesis are carried off ' +
        'to. Lāčplēsis sets out after them and never arrives — the storm takes ' +
        'him north instead.',
    },
    {
      id: 'rome-road',
      name: 'The Road to Rome',
      kind: 'landmark',
      at: { x: -0.417, z: 0.95 },
      description:
        'South, off the edge of everything this map holds: the road Caupo and ' +
        'the priest Dietrich take to kneel to the Pope and come back with the ' +
        'Church’s blessing for the conquest. The war is decided here, a ' +
        'thousand miles from the fighting.',
    },
  ],

  regions: [
    { id: 'r-kurzeme', name: 'Kurzeme', at: { x: -0.46, z: -0.05 }, scale: 1.05 },
    { id: 'r-zemgale', name: 'Zemgale', at: { x: -0.12, z: 0.34 } },
    { id: 'r-vidzeme', name: 'Vidzeme', at: { x: 0.3, z: -0.29 }, scale: 1.05 },
    { id: 'r-latgale', name: 'Latgale', at: { x: 0.68, z: 0.16 } },
    { id: 'r-gulf', name: 'The Gulf of Rīga', at: { x: -0.12, z: -0.42 }, scale: 0.95 },
    { id: 'r-baltic', name: 'The Baltic', at: { x: -0.78, z: 0.1 }, scale: 1.1 },
    { id: 'r-daugava', name: 'The Daugava', at: { x: 0.4, z: 0.34 }, scale: 0.9 },
  ],

  routes: [
    {
      id: 'hero-road',
      name: 'The road upriver',
      color: '#ffd27a',
      style: 'solid',
      description:
        'Lielvārde to Burtnieks the long way: up the Daugava past Koknese and ' +
        'Aizkraukle to the whirlpool at Staburags, out of the river again, and ' +
        'north to the castle of the runes.',
      points: [
        { x: 0.168, z: 0.105 },
        { x: 0.232, z: 0.152 },
        { x: 0.262, z: 0.175 },
        { x: 0.299, z: 0.149 },
        { x: 0.328, z: 0.209 },
        { x: 0.318, z: 0.05 },
        { x: 0.3, z: -0.19 },
        { x: 0.28, z: -0.36 },
        { x: 0.275, z: -0.459 },
      ],
    },
    {
      id: 'estonian-road',
      name: 'The march north',
      color: '#c98a5a',
      style: 'solid',
      description:
        'The levies going up to the Estonian border on Kangars’s false errand ' +
        '— and coming back down it allied to the giant they were sent to kill.',
      points: [
        { x: 0.275, z: -0.459 },
        { x: 0.33, z: -0.5 },
        { x: 0.421, z: -0.515 },
      ],
    },
    {
      id: 'germany-road',
      name: 'The course he set',
      color: '#8fb8d8',
      style: 'dashed',
      description:
        'Out of the Daugava’s mouth after Laimdota, north up the gulf, round ' +
        'the horn at Kolka and down the Kurzeme coast — then south-west for ' +
        'Germany. This is the voyage he meant to make.',
      points: [
        { x: 0.006, z: -0.091 },
        { x: -0.1, z: -0.28 },
        { x: -0.22, z: -0.44 },
        { x: -0.293, z: -0.501 },
        { x: -0.42, z: -0.42 },
        { x: -0.508, z: -0.288 },
        { x: -0.62, z: 0.05 },
        { x: -0.78, z: 0.4 },
        { x: -0.93, z: 0.72 },
      ],
    },
    {
      id: 'sea-road',
      name: 'The voyage he made',
      color: '#6fb3d6',
      style: 'dashed',
      description:
        'The storm takes him the other way entirely: north up the open Baltic ' +
        'to the hall of the North Wind’s daughter, back down by the Enchanted ' +
        'Island, and home through the strait under Saaremaa into the gulf.',
      points: [
        { x: -0.93, z: 0.72 },
        { x: -0.97, z: 0.2 },
        { x: -0.94, z: -0.4 },
        { x: -0.88, z: -0.85 },
        { x: -0.82, z: -0.6 },
        { x: -0.75, z: -0.3 },
        { x: -0.6, z: -0.44 },
        { x: -0.48, z: -0.6 },
        { x: -0.4, z: -0.66 },
        { x: -0.31, z: -0.62 },
        { x: -0.24, z: -0.5 },
        { x: -0.12, z: -0.28 },
        { x: 0.006, z: -0.091 },
      ],
    },
    {
      id: 'crusader-road',
      name: 'The Order’s road',
      color: '#d76b6b',
      style: 'dashed',
      description:
        'Up the Daugava from the new city at its mouth: Rīga to Turaida to ' +
        'Aizkraukle to Lielvārde, castle by castle, until there is nowhere ' +
        'left to give ground.',
      points: [
        { x: 0.022, z: -0.029 },
        { x: 0.177, z: -0.165 },
        { x: 0.2, z: 0.02 },
        { x: 0.262, z: 0.175 },
        { x: 0.168, z: 0.105 },
      ],
    },
    {
      id: 'daugava',
      name: 'The Daugava',
      color: '#7fc4dd',
      style: 'solid',
      description:
        'The river the whole poem runs along, from where it comes in out of ' +
        'the south-east to where it gives out into the gulf. Every castle in ' +
        'the story stands on it, and both the hero and the Dark Knight end in ' +
        'it. The boatmen of this river gave Latvia “Pūt, vējiņi” — blow, wind ' +
        '— a Livonian rowing song whose words were first written down in 1807 ' +
        'and whose melody Jānis Cimze printed in 1872.',
      points: [
        { x: 0.66, z: 0.591 },
        { x: 0.528, z: 0.603 },
        { x: 0.45, z: 0.42 },
        { x: 0.39, z: 0.235 },
        { x: 0.328, z: 0.209 },
        { x: 0.299, z: 0.149 },
        { x: 0.262, z: 0.175 },
        { x: 0.168, z: 0.105 },
        { x: 0.125, z: 0.03 },
        { x: 0.022, z: -0.029 },
        { x: 0.006, z: -0.091 },
      ],
    },
    {
      id: 'castle-road',
      name: 'The ride to the sunken castle',
      color: '#a8c47a',
      style: 'solid',
      description:
        'East out of Burtnieks, past Beverīna and over the roof of the ' +
        'country, to sit out a night in a cursed castle under a lake — and on ' +
        'into the lake country beyond it.',
      points: [
        { x: 0.275, z: -0.459 },
        { x: 0.354, z: -0.382 },
        { x: 0.4, z: -0.18 },
        { x: 0.4125, z: 0.0235 },
        { x: 0.52, z: 0.03 },
        { x: 0.604, z: 0.059 },
        { x: 0.67, z: 0.2 },
        { x: 0.698, z: 0.341 },
      ],
    },
    {
      id: 'zemgale-levy',
      name: 'The southern levies',
      color: '#c98a5a',
      style: 'solid',
      description:
        'Up out of Zemgale to the war: the Semigallian hill-forts sending men ' +
        'north across the plain to the Daugava.',
      points: [
        { x: -0.142, z: 0.253 },
        { x: -0.056, z: 0.147 },
        { x: 0.0, z: 0.05 },
        { x: 0.022, z: -0.029 },
      ],
    },
    {
      id: 'rome-road',
      name: 'Caupo’s road to Rome',
      color: '#b58fd0',
      style: 'dashed',
      description:
        'Turaida to the Pope and back — the journey that turns a border raid ' +
        'into a crusade.',
      points: [
        { x: 0.177, z: -0.165 },
        { x: -0.02, z: 0.2 },
        { x: -0.32, z: 0.62 },
        { x: -0.417, z: 0.95 },
      ],
    },
  ],

  elements: [
    {
      id: 'bear-ears',
      name: 'The Bear’s Ears',
      glyph: '🐻',
      description:
        'Lāčplēsis’s mother was a she-bear, and his strength does not live in ' +
        'his arms — it lives in his ears. Nobody knows it but his father, ' +
        'Kangars, who learns it, and eventually the Dark Knight, who is told.',
      journey: [
        { marker: 'lielvarde', note: 'Born with them, and with what they carry.' },
        { marker: 'estonian-march', sinceChapter: 6, note: 'Enough to hold a giant to a draw.' },
        { marker: 'aizkraukle', sinceChapter: 11, note: 'Kangars sells the secret.' },
        { marker: 'lielvarde', sinceChapter: 13, note: 'Both shorn off in the lists.' },
      ],
    },
    {
      id: 'laimdota',
      name: 'Laimdota',
      glyph: '✦',
      description:
        'Burtnieks’s daughter, who is loved, taken, lied about, searched for ' +
        'across a sea, found on an island and married — and who dies in the ' +
        'same hour her husband goes into the river.',
      journey: [
        { marker: 'burtnieki', note: 'At her father’s castle, among the runes.' },
        { marker: 'german-road', sinceChapter: 7, note: 'Carried off over the sea.' },
        { marker: 'enchanted-isle', sinceChapter: 9, note: 'Stranded, and found.' },
        { marker: 'lielvarde', sinceChapter: 12, note: 'Home, and married at Jāņi.' },
      ],
    },
  ],

  levels: [
    {
      id: 'perkona-pils',
      title: 'Pērkons’s Hall',
      subtitle: 'The sky palace where the poem opens',
      tier: 1,
      terrain: {
        music: {
          title: 'The Council of the Gods',
          credit: 'Original, written for this atlas',
          melody:
            'A4:2 C5:2 D5:3 C5:1 A4:2 G4:2 A4:4 r:2 D5:2 F5:2 E5:3 D5:1 C5:2 A4:2 D5:6 r:2',
          bass: 'D3:8 A2:8 F2:8 D3:8',
          tempo: 50,
          voice: 'bell',
          mood: 'heaven',
        },
        seed: 'perkons-hall-3',
        sky: 'heaven',
        seaLevel: 0.46,
        heightScale: 15,
        octaves: 4,
        frequency: 1.6,
        islandFalloff: 0.5,
        waterColor: '#eef4fb',
        rivers: 0,
        biomes: [
          { maxHeight: 0.46, color: '#dfe9f5', name: 'Cloud-sea' },
          { maxHeight: 0.54, color: '#cfddf0', name: 'Mist' },
          { maxHeight: 0.7, color: '#e4d7b2', name: 'Gold terraces' },
          { maxHeight: 0.86, color: '#efe6cf', name: 'The high seats' },
          { maxHeight: 1.0, color: '#fff7e2', name: 'Thunder-top' },
        ],
      },
      ambient: { trees: 0.12, treeColor: '#c9b06a', birds: 9, rain: false },
      markers: [
        {
          id: 'sky-council',
          name: 'The Council Table',
          kind: 'capital',
          at: { x: 0.0, z: 0.0 },
          description:
            'Where the poem actually begins — not with the hero at all, but ' +
            'with the gods in session, being told that the crusaders are ' +
            'coming and the old world is ending.',
        },
        {
          id: 'sky-perkons',
          name: 'Pērkons’s Seat',
          kind: 'peak',
          at: { x: -0.32, z: -0.28 },
          description:
            'The thunderer’s high place. It is Pērkons who hears that a man is ' +
            'drowning in the Daugava, declares he is meant for something, and ' +
            'promises he will be pulled out.',
        },
        {
          id: 'sky-destiny',
          name: 'The Father of Destiny',
          kind: 'landmark',
          at: { x: 0.36, z: -0.14 },
          description:
            'Who gives the warning the whole epic hangs on: the new faith is ' +
            'coming up the river, and the gods of this country have not much ' +
            'time left.',
        },
        {
          id: 'sky-laima',
          name: 'Laima’s Loom',
          kind: 'landmark',
          at: { x: 0.14, z: 0.42 },
          description:
            'Fortune’s place, where lots are settled before anyone on the ' +
            'ground hears of them. In the dainas she stands at the birth and ' +
            'the wedding and the grave, and says nothing.',
        },
        {
          id: 'sky-stair',
          name: 'Staburadze’s Stair',
          kind: 'port',
          at: { x: -0.52, z: 0.4 },
          description:
            'The way down. Staburadze comes up this to bring the gods her ' +
            'question and goes back down it to the river to catch what falls ' +
            'in. Take the floor switcher down two to see where it lands.',
        },
        {
          id: 'sky-saule',
          name: 'Saule’s Road',
          kind: 'landmark',
          at: { x: 0.66, z: 0.5 },
          description:
            'The sun’s daily track over the whole business, indifferent to it. ' +
            'She has her own songs and her own daughters and does not attend ' +
            'the council.',
        },
      ],
      routes: [
        {
          id: 'sky-round',
          name: 'The council in session',
          color: '#f0e2b0',
          style: 'solid',
          description:
            'Staburadze up the stair with her question, round the seats, and ' +
            'back down to the river with Pērkons’s answer.',
          points: [
            { x: -0.52, z: 0.4 },
            { x: -0.32, z: -0.28 },
            { x: 0.0, z: 0.0 },
            { x: 0.36, z: -0.14 },
            { x: 0.14, z: 0.42 },
            { x: -0.52, z: 0.4 },
          ],
        },
      ],
      regions: [
        { id: 'r-sky', name: 'The Cloud-Sea', at: { x: -0.6, z: -0.6 }, scale: 1.1 },
      ],
    },
    {
      id: 'kristala-pils',
      title: 'The Crystal Castle',
      subtitle: 'Staburadze’s hall under the Daugava',
      tier: -1,
      terrain: {
        music: {
          title: 'Under the Whirlpool',
          credit: 'Original, written for this atlas',
          melody:
            'D4:3 C4:1 A3:2 D4:2 F4:4 r:2 A3:2 C4:2 D4:3 C4:1 A3:4 r:2 ' +
            'F4:2 E4:2 D4:2 C4:2 A3:6 r:2',
          bass: 'D2:8 F2:8 C2:8 D2:8',
          tempo: 46,
          voice: 'harp',
          mood: 'mystic',
        },
        seed: 'crystal-castle-2',
        sky: 'cavern',
        seaLevel: 0.44,
        heightScale: 13,
        octaves: 4,
        frequency: 1.8,
        islandFalloff: 0.38,
        waterColor: '#1f4e63',
        riverColor: '#8fd8ef',
        rivers: 2,
        biomes: [
          { maxHeight: 0.44, color: '#173d50', name: 'Deep water' },
          { maxHeight: 0.52, color: '#3f7f92', name: 'Shallows' },
          { maxHeight: 0.66, color: '#6fa5b3', name: 'Crystal floor' },
          { maxHeight: 0.82, color: '#9dc4cc', name: 'Pillars' },
          { maxHeight: 1.0, color: '#e2f1f6', name: 'The clear roof' },
        ],
      },
      ambient: { trees: 0.06, treeColor: '#7fb6bd', birds: 0, fish: 12, rain: false },
      markers: [
        {
          id: 'deep-hall',
          name: 'The Crystal Hall',
          kind: 'capital',
          at: { x: 0.0, z: -0.06 },
          description:
            'Staburadze’s own hall, cut clear, under the weight of the river. ' +
            'The drowned are brought in here and the ones worth keeping are ' +
            'not drowned after all.',
        },
        {
          id: 'deep-whirl',
          name: 'The Underside of the Whirlpool',
          kind: 'danger',
          at: { x: -0.36, z: -0.52 },
          description:
            'Where Staburags opens from below — a turning column of water ' +
            'coming down through the roof. This is the way in, and it is not ' +
            'the way out.',
        },
        {
          id: 'deep-bed',
          name: 'The Bed of Sleep',
          kind: 'landmark',
          at: { x: 0.3, z: 0.2 },
          description:
            'Where the half-drowned hero is laid until he wakes. He is a long ' +
            'time waking, and the poem lets him take it.',
        },
        {
          id: 'deep-laimdota',
          name: 'Where He First Sees Laimdota',
          kind: 'landmark',
          at: { x: 0.5, z: -0.3 },
          description:
            'Everything that follows — the courtship, the search across the ' +
            'sea, the wedding, the ending — starts in this room, under a river, ' +
            'in a house belonging to a goddess.',
        },
        {
          id: 'deep-spring',
          name: 'The Rising Spring',
          kind: 'port',
          at: { x: -0.62, z: 0.36 },
          description:
            'The way back up into daylight. Staburadze sends him out this way ' +
            'when he is mended, and he comes ashore on the Daugava as though ' +
            'nothing had happened.',
        },
        {
          id: 'deep-amber',
          name: 'The Amber Floor',
          kind: 'forest',
          at: { x: 0.62, z: 0.46 },
          description:
            'What the Baltic keeps and gives back a piece at a time. In the ' +
            'songs the sea-mother’s house is floored with it, and the storms ' +
            'that scatter it on the beach are her housekeeping.',
        },
      ],
      routes: [
        {
          id: 'deep-rescue',
          name: 'The rescue',
          color: '#8fd8ef',
          style: 'solid',
          description:
            'Down through the whirlpool, into the hall, to the bed, and out ' +
            'again by the spring — the shape of the third canto in one line.',
          points: [
            { x: -0.36, z: -0.52 },
            { x: -0.14, z: -0.24 },
            { x: 0.0, z: -0.06 },
            { x: 0.3, z: 0.2 },
            { x: 0.5, z: -0.3 },
            { x: 0.1, z: 0.3 },
            { x: -0.62, z: 0.36 },
          ],
        },
      ],
      regions: [
        { id: 'r-deep', name: 'Under the Daugava', at: { x: -0.5, z: 0.0 }, scale: 1.1 },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · The Bear-Slayer',
      subtitle: 'The council, the bear, the whirlpool and the castle of runes',
      chapters: [
        {
          id: 'i-1',
          title: 'The gods in council',
          level: 'perkona-pils',
          narration:
            'The poem opens above the weather. The gods are sitting, and the ' +
            'Father of Destiny tells them what is coming up the river: ' +
            'crusaders, and a new god who does not share. Nothing on the ' +
            'ground knows yet.',
          focus: { marker: 'sky-council', distance: 46, pitch: 46 },
          reveal: { markers: ['sky-council', 'sky-destiny', 'sky-perkons'], regions: ['r-sky'] },
        },
        {
          id: 'i-2',
          title: 'A man is drowning',
          level: 'perkona-pils',
          narration:
            'Staburadze comes up the stair with a question — there is a man in ' +
            'the Daugava and he is going down. Pērkons says: that one matters. ' +
            'Pull him out. She goes back down to do it.',
          focus: { marker: 'sky-perkons', distance: 40, pitch: 44 },
          reveal: { markers: ['sky-stair', 'sky-laima', 'sky-saule'], routes: ['sky-round'] },
          highlight: { markers: ['sky-perkons', 'sky-stair'], routes: ['sky-round'] },
        },
        {
          id: 'i-3',
          title: 'The bear on the road',
          narration:
            'Back a few days, and down on the ground at Lielvārde. The lord’s ' +
            'adopted son, eighteen years old, meets a bear on the road and ' +
            'takes its jaws in his two hands and pulls. After that nobody uses ' +
            'his other name.',
          focus: { marker: 'lielvarde', distance: 40, pitch: 44 },
          reveal: {
            markers: ['lielvarde', 'riga', 'daugavgriva'],
            routes: ['daugava'],
            regions: ['r-vidzeme', 'r-zemgale', 'r-daugava'],
          },
          highlight: { markers: ['lielvarde'] },
        },
        {
          id: 'i-4',
          title: 'What he sees at Aizkraukle',
          narration:
            'Sent upriver to be schooled, he stops the night at Aizkraukle and ' +
            'does not sleep. He watches Spīdala go out to her business, and ' +
            'Kangars — the holy man, the one everybody trusts — laying out for ' +
            'the crusaders exactly how the country can be taken.',
          focus: { marker: 'aizkraukle', distance: 36, pitch: 42 },
          reveal: { markers: ['aizkraukle', 'koknese'], routes: ['hero-road'] },
          highlight: { markers: ['aizkraukle'], routes: ['hero-road'] },
        },
        {
          id: 'i-5',
          title: 'Into the whirlpool',
          narration:
            'Spīdala knows she was watched. At Staburags she puts him into the ' +
            'water where it turns, and that ought to be the end of him — which ' +
            'is where the first scene, up in the hall of the gods, catches up ' +
            'with this one.',
          focus: { marker: 'staburags', distance: 32, pitch: 40 },
          reveal: { markers: ['staburags'] },
          highlight: { markers: ['staburags'] },
        },
        {
          id: 'i-6',
          title: 'The crystal castle',
          level: 'kristala-pils',
          narration:
            'He does not drown. Staburadze takes him down through the roof of ' +
            'her own house, lays him on a bed of sleep, and lets him wake in ' +
            'his own time — and the first thing he sees, when he does, is ' +
            'Laimdota.',
          focus: { marker: 'deep-hall', distance: 42, pitch: 44 },
          reveal: {
            markers: ['deep-whirl', 'deep-hall', 'deep-bed', 'deep-laimdota', 'deep-spring', 'deep-amber'],
            routes: ['deep-rescue'],
            regions: ['r-deep'],
          },
          highlight: { markers: ['deep-hall', 'deep-laimdota'], routes: ['deep-rescue'] },
        },
        {
          id: 'i-7',
          title: 'The castle of the runes',
          narration:
            'Sent back up the spring into daylight, he finishes the journey he ' +
            'started and comes to Burtnieks — the castle where the histories ' +
            'are kept, where he learns to read them, and where Laimdota turns ' +
            'out to be the lord’s own daughter. He makes a friend here too: ' +
            'Koknesis, the Wood-Bearer.',
          focus: { marker: 'burtnieki', distance: 44, pitch: 44 },
          reveal: { markers: ['burtnieki', 'beverina', 'turaida'] },
          highlight: { markers: ['burtnieki'] },
        },
      ],
    },
    {
      id: 'ii',
      title: 'II · The Sea Road',
      subtitle: 'The giant, the sunken castle, the crossing and the island',
      chapters: [
        {
          id: 'ii-1',
          title: 'The war that should not have happened',
          narration:
            'Kangars, who is still trusted, arranges a quarrel with Estonia. ' +
            'The levies go north to fight people who have no more reason to ' +
            'want this than they do.',
          focus: { marker: 'estonian-march', distance: 44, pitch: 44 },
          reveal: {
            markers: ['estonian-march', 'saaremaa'],
            routes: ['estonian-road'],
          },
          highlight: { routes: ['estonian-road'] },
        },
        {
          id: 'ii-2',
          title: 'Kalapuisis',
          narration:
            'The Estonians send out their giant, Kalev’s son, and the two of ' +
            'them go at it all day and get nowhere. So they stop. They shake ' +
            'hands, swear friendship, and turn round together to face the ' +
            'people who wanted this fight. The Estonian epic tells the same ' +
            'day from his side — the place card has the door.',
          focus: { marker: 'estonian-march', distance: 30, pitch: 38 },
          highlight: { markers: ['estonian-march'] },
        },
        {
          id: 'ii-3',
          title: 'The night in the sunken castle',
          narration:
            'A castle under a curse and under water. He sits it out one whole ' +
            'night without flinching, and at dawn the enchantment gives and ' +
            'the whole thing comes up out of the lake into the air.',
          focus: { marker: 'sunken-castle', distance: 38, pitch: 42 },
          reveal: {
            markers: ['sunken-castle', 'razna', 'daugavpils', 'gaizinkalns'],
            routes: ['castle-road'],
            regions: ['r-latgale'],
          },
          highlight: { markers: ['sunken-castle'] },
        },
        {
          id: 'ii-4',
          title: 'Taken',
          narration:
            'Laimdota and Koknesis are seized and shipped to Germany. Spīdala ' +
            'finds Lāčplēsis and tells him, gently, that the two of them went ' +
            'willingly and were lovers. It is a lie, and he believes it, and ' +
            'goes after them anyway.',
          focus: { marker: 'german-road', distance: 56, pitch: 48 },
          reveal: {
            markers: ['german-road', 'kurzeme-shore', 'kolka'],
            routes: ['germany-road'],
            regions: ['r-kurzeme', 'r-baltic', 'r-gulf'],
          },
          highlight: { markers: ['german-road'], routes: ['germany-road'] },
        },
        {
          id: 'ii-5',
          title: 'Blown north',
          narration:
            'Out of the river mouth, round Kolka, into the open Baltic — and ' +
            'then off the chart entirely. He is lost in the northern sea and ' +
            'comes ashore at the house of the North Wind’s daughter, who feeds ' +
            'him and sends him on.',
          focus: { marker: 'north-wind', distance: 60, pitch: 50 },
          reveal: { markers: ['north-wind'], routes: ['sea-road'] },
          highlight: { routes: ['sea-road'], markers: ['north-wind'] },
        },
        {
          id: 'ii-6',
          title: 'Three, six, nine heads',
          narration:
            'On the way home he finds the Enchanted Island and everything that ' +
            'lives on it: a monster with three heads, then one with six, then ' +
            'one with nine. He also finds Spīdala, and tears up her contract ' +
            'with the Devil — and then finds Laimdota and Koknesis, who escaped ' +
            'Germany and have been stranded here ever since.',
          focus: { marker: 'enchanted-isle', distance: 40, pitch: 42 },
          reveal: { markers: ['enchanted-isle'] },
          highlight: { markers: ['enchanted-isle'] },
        },
        {
          id: 'ii-7',
          title: 'Two weddings at Jāņi',
          narration:
            'Home, at midsummer, with the fires lit and the songs going all ' +
            'night: Lāčplēsis marries Laimdota, and Koknesis — who has loved ' +
            'her all along, whatever Spīdala said — marries Spīdala. It is the ' +
            'last good page in the book.',
          focus: { marker: 'lielvarde', distance: 38, pitch: 42 },
          highlight: { markers: ['lielvarde', 'burtnieki'] },
        },
      ],
    },
    {
      id: 'iii',
      title: 'III · Fire and Night',
      subtitle: 'Rome, the Order, the betrayal and the Daugava',
      chapters: [
        {
          id: 'iii-1',
          title: 'The road to Rome',
          narration:
            'Caupo of Turaida takes baptism and sails south with the priest ' +
            'Dietrich to kneel to the Pope. They come back with what they went ' +
            'for: the conquest is now a crusade, and men will come from all ' +
            'over Europe to join it.',
          focus: { marker: 'rome-road', distance: 58, pitch: 50 },
          reveal: {
            markers: ['rome-road', 'tervete', 'jelgava'],
            routes: ['rome-road', 'zemgale-levy'],
          },
          highlight: { routes: ['rome-road'], markers: ['turaida'] },
        },
        {
          id: 'iii-2',
          title: 'The city at the river mouth',
          narration:
            'Bishop Albert builds at the Daugava’s mouth, and everything that ' +
            'comes for this country from now on comes ashore at Rīga and goes ' +
            'upriver. Castle by castle: Turaida, Aizkraukle, Lielvārde.',
          focus: { marker: 'riga', distance: 42, pitch: 44 },
          reveal: { routes: ['crusader-road'] },
          highlight: { markers: ['riga'], routes: ['crusader-road'] },
        },
        {
          id: 'iii-3',
          title: 'What Kangars sells',
          narration:
            'The Latvians win at first. Then Albert lands reinforcements, and ' +
            'among them the Dark Knight — and Kangars finally sells the thing ' +
            'he has been sitting on: the hero’s mother was a she-bear, and his ' +
            'strength is not in his arms. It is in his ears.',
          focus: { marker: 'lielvarde', distance: 40, pitch: 42 },
          highlight: { markers: ['aizkraukle', 'lielvarde'] },
        },
        {
          id: 'iii-4',
          title: 'The lists at Lielvārde',
          narration:
            'A tournament, on his own ground. The Dark Knight takes off the ' +
            'right ear and the right hand goes dead. Lāčplēsis breaks the ' +
            'man’s armour open with what he has left and shatters his own sword ' +
            'doing it. Then the left ear goes too.',
          focus: { marker: 'lielvarde', distance: 26, pitch: 36 },
          highlight: { markers: ['lielvarde'] },
        },
        {
          id: 'iii-5',
          title: 'Into the Daugava',
          narration:
            'No sword and no strength left, so they wrestle — and at the ' +
            'river’s edge he gets the Knight up and throws him into the ' +
            'Daugava, and the Knight holds on. The water takes both of them. ' +
            'In that same hour, Laimdota dies.',
          focus: { marker: 'lielvarde', distance: 24, pitch: 34 },
          highlight: { markers: ['lielvarde'], routes: ['daugava'] },
        },
        {
          id: 'iii-6',
          title: 'They are still fighting',
          narration:
            'The poem does not end with a death. It ends with a claim: the two ' +
            'of them are down there still, locked together, and one day the ' +
            'Bear-Slayer will get the upper hand and put the Knight under for ' +
            'good — and that day the country comes back. Pumpurs published ' +
            'that in 1888. Latvia declared independence on 18 November 1918, ' +
            'and its highest military decoration, founded the next year and ' +
            'first awarded on 11 November 1920, was the Order of Lāčplēsis — ' +
            'a medal showing a man wrestling a bear.',
          focus: { marker: 'daugavgriva', distance: 50, pitch: 48 },
          highlight: { markers: ['daugavgriva', 'lielvarde'], routes: ['daugava'] },
        },
      ],
    },
  ],
}
