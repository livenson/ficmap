import type { Story } from '../types'
import danteHeight from '../assets/dante-height.png'

/**
 * The Divine Comedy — Dante Alighieri, finished 1321, the year he died.
 *
 * Every other world in this atlas has floors because the atlas has floors. This
 * one has them because the POEM does. The Commedia is the only great European
 * text whose structure is a map with levels, and it is drawn here the way it is
 * built:
 *
 *   +2  Paradiso — nine turning spheres and the Empyrean beyond motion.
 *   +1  Purgatorio — a mountain on an island in the southern ocean, seven
 *       terraces up its side, and the Earthly Paradise on the summit.
 *    0  Italy — the only ground in the poem that is on the Earth: the wood he
 *       gets lost in, the city that exiled him, and the city he died in.
 *   -1  Inferno — a funnel under Jerusalem, nine circles narrowing to a frozen
 *       lake with Satan waist-deep in it at the centre of the world.
 *
 * The surface is a REAL heightmap of central Italy, with places at their true
 * coordinates —
 *
 *   map x = (lon − 9.4) / 2.6 − 1      map z = (45.4 − lat) / 2.1 − 1
 *
 * and the Arno and the Tiber drawn from Natural Earth's own centrelines, since
 * a map at a kilometre per pixel cannot hold either. The three other floors are
 * procedural: they are not places, and pretending to survey them would be a lie
 * of a different kind. What is fixed on them is the ORDER — Dante is exact about
 * what lies below what, and the markers keep to it.
 *
 * TEXTS, both read rather than remembered:
 *
 *   Italian  La Divina Commedia (Project Gutenberg eBook 1000)
 *   English  trans. Henry Wadsworth Longfellow, 1867 (eBook 1004; Longfellow
 *            d. 1882, public domain)
 *
 * Narration paraphrases. The quotations do not, and each gives its canto.
 *
 * The music is ORIGINAL. Dante names what the souls sing — the Miserere on the
 * shore, Te lucis ante at nightfall, the Salve Regina in the valley of princes —
 * and those chants are old enough to be public domain, but none of them is
 * transcribed here, because none of them has been read from notation.
 */
export const dante: Story = {
  id: 'dante',
  title: 'The Divine Comedy',
  subtitle: 'Down, across, and up, in a hundred cantos',
  author: 'Dante Alighieri',
  region: 'Italy, and the three realms',
  earth: { lon: 11.26, lat: 43.77, place: 'Florence' },
  epoch: 'Easter week, 1300 · written to 1321',
  group: 'epic',
  intro:
    'A man of thirty-five gets lost in a wood and is taken on the only ' +
    'complete tour of the universe anybody has ever written. Press ▶ Play ' +
    'story to go the whole way — down through the funnel under Jerusalem to ' +
    'the ice at the bottom of the world, out onto the shore of a mountain in ' +
    'the southern ocean, up its seven terraces, and into the turning spheres. ' +
    'Use the floor switcher to move between the four levels; the surface is ' +
    'the real Italy he was exiled from and never saw again.',
  surfaceName: 'Italy',
  ambient: {
    trees: 0.5,
    treeKind: 'broadleaf',
    treeColor: '#4d7a4a',
    birds: 5,
  },
  terrain: {
    music: {
      title: 'The Dark Wood',
      credit: 'Original, written for this atlas',
      // A falling line that will not resolve, then the same shape climbing.
      // The poem's own trick: every cantica ends on the word "stars".
      melody:
        'A4:3 G4:1 F4:2 E4:2 D4:4 r:2 ' +
        'F4:2 E4:2 D4:2 C4:2 D4:6 r:2 ' +
        'D4:2 F4:2 A4:2 C5:4 A4:2 D5:6 r:2',
      bass: 'D3:8 Bb2:8 F2:8 A2:8',
      tempo: 44,
      voice: 'strings',
      mood: 'dark',
    },
    seed: 'dante-1', // unused: the heightmap takes precedence
    heightmap: danteHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0025,
    // 430 km across at 43°N by 467 km down.
    aspect: 0.92,
    heightScale: 13,
    rivers: 3,
    // The Arno and the Tiber, from Natural Earth's centrelines (public domain),
    // cut to this box by `scripts/build-river.mjs dante Arno` / `... Tevere`.
    // The Arno is not in the global 10m set — at 240 km it is too small — and
    // comes from the European supplement, which starts it near Arezzo rather
    // than up at Falterona where the poem puts its spring.
    namedRivers: [
      {
        name: 'The Arno',
        marker: 'arno',
        points: [
          { x: -0.1306, z: -0.0186 }, { x: -0.1045, z: 0.0212 }, { x: -0.0729, z: 0.0486 },
          { x: -0.0634, z: -0.0082 }, { x: -0.0690, z: -0.0471 }, { x: -0.0683, z: -0.0895 },
          { x: -0.1183, z: -0.1003 }, { x: -0.1664, z: -0.1214 }, { x: -0.2033, z: -0.1659 },
          { x: -0.2100, z: -0.2016 }, { x: -0.2345, z: -0.2339 }, { x: -0.2737, z: -0.2258 },
          { x: -0.3167, z: -0.2344 }, { x: -0.3658, z: -0.2241 }, { x: -0.4068, z: -0.2080 },
          { x: -0.4587, z: -0.2021 }, { x: -0.5094, z: -0.1796 }, { x: -0.5618, z: -0.1869 },
          { x: -0.6023, z: -0.1966 }, { x: -0.6439, z: -0.1867 }, { x: -0.6619, z: -0.1868 },
        ],
      },
      {
        name: 'The Tiber',
        points: [
          { x: 0.0200, z: -0.2215 }, { x: 0.0233, z: -0.1654 }, { x: 0.0432, z: -0.1285 },
          { x: 0.0661, z: -0.0984 }, { x: 0.0923, z: -0.0706 }, { x: 0.0972, z: -0.0318 },
          { x: 0.1246, z: -0.0052 }, { x: 0.1575, z: 0.0405 }, { x: 0.1710, z: 0.0774 },
          { x: 0.1631, z: 0.1148 }, { x: 0.1555, z: 0.1498 }, { x: 0.1473, z: 0.1837 },
          { x: 0.1552, z: 0.2194 }, { x: 0.1237, z: 0.2626 }, { x: 0.0893, z: 0.2848 },
          { x: 0.0943, z: 0.3240 }, { x: 0.1048, z: 0.3580 }, { x: 0.1318, z: 0.3849 },
          { x: 0.1604, z: 0.4089 }, { x: 0.1744, z: 0.4418 }, { x: 0.1888, z: 0.4770 },
          { x: 0.2249, z: 0.4894 }, { x: 0.2354, z: 0.5262 }, { x: 0.2421, z: 0.5616 },
          { x: 0.2088, z: 0.5862 }, { x: 0.1943, z: 0.6203 }, { x: 0.1762, z: 0.6533 },
          { x: 0.1789, z: 0.6910 }, { x: 0.1398, z: 0.7112 }, { x: 0.1051, z: 0.7251 },
          { x: 0.0893, z: 0.7417 },
        ],
      },
    ],
    biomes: [
      { maxHeight: 0.0025, color: '#2b5f75', name: 'The Tyrrhenian' },
      { maxHeight: 0.04, color: '#c8bf92', name: 'Coast' },
      { maxHeight: 0.12, color: '#7d9c5c', name: 'Valley floor' },
      { maxHeight: 0.28, color: '#5d8a4c', name: 'Vine and olive' },
      { maxHeight: 0.5, color: '#40693f', name: 'Wood' },
      { maxHeight: 0.74, color: '#7d7a63', name: 'Apennine' },
      { maxHeight: 1.0, color: '#b3aea3', name: 'Bare rock' },
    ],
  },

  markers: [
    {
      id: 'dark-wood',
      name: 'The Dark Wood',
      kind: 'forest',
      at: { x: -0.069, z: -0.238 },
      description:
        'Where the poem starts and the only place in it that has no address. ' +
        'Dante gives it no name — it is a wood you are already lost in before ' +
        'you notice — but he puts it below a hill with the sun on it, and the ' +
        'old Casentino forest above Florence has been the reader’s guess ' +
        'for six hundred years. A leopard, a lion and a she-wolf turn him back ' +
        'from the hill, and then a stranger is standing there who turns out to ' +
        'have been dead a thousand years.',
    },
    {
      id: 'florence',
      name: 'Florence',
      kind: 'capital',
      at: { x: -0.286, z: -0.224 },
      description:
        'His city, which tried him in his absence in 1302 for corruption he ' +
        'did not commit, fined him, and sentenced him to be burned alive if he ' +
        'ever came back. He never came back. Something like a sixth of the ' +
        'souls he meets in all three realms are Florentines, and he asks after ' +
        'the place constantly, and nothing he is told about it is good.',
    },
    {
      id: 'campaldino',
      name: 'Campaldino',
      kind: 'battle',
      at: { x: -0.088, z: -0.2 },
      description:
        'Dante fought here in 1289, aged twenty-four, in the front rank of the ' +
        'Florentine cavalry. On the mountain he meets Buonconte da Montefeltro, ' +
        'who commanded the other side and whose body was never found — and gets ' +
        'the answer: he died at the Archiano’s mouth, and a storm rolled ' +
        'him down into the Arno with his arms crossed on his chest.',
    },
    {
      id: 'falterona',
      name: 'Monte Falterona',
      kind: 'peak',
      at: { x: -0.123, z: -0.271 },
      description:
        'The spring of the Arno, and one of the few places Dante names by ' +
        'plain geography rather than by who is suffering there. He will not ' +
        'give the river its name in that passage either — "a streamlet born in ' +
        'Falterona" — because he is about to describe everyone living along it ' +
        'as animals, and wants to get the insult in before the name.',
    },
    {
      id: 'arno',
      name: 'The Arno',
      kind: 'landmark',
      at: { x: -0.2345, z: -0.2339 },
      description:
        'The river of the whole earthly story: it rises in the Casentino where ' +
        'he gets lost, runs through the city that exiled him, and reaches the ' +
        'sea at the city where Ugolino was starved to death in a tower. ' +
        'Buonconte’s body is somewhere in it.',
    },
    {
      id: 'san-benedetto',
      name: 'San Benedetto dell’Alpe',
      kind: 'landmark',
      at: { x: -0.096, z: -0.314 },
      description:
        'A waterfall on the Apennine crest, which Dante drags into Hell as a ' +
        'measuring stick: the Phlegethon goes over the edge of the eighth ' +
        'circle with the noise this one makes, falling in a single leap where ' +
        'there was room for a thousand steps.',
    },
    {
      id: 'forli',
      name: 'Forlì',
      kind: 'town',
      at: { x: 0.015, z: -0.439 },
      description:
        'On the road down out of the mountains to the Adriatic, and one of the ' +
        'towns that took the exile in. He names it in the same breath as the ' +
        'waterfall, as the place where the river above it loses its name.',
    },
    {
      id: 'ravenna',
      name: 'Ravenna',
      kind: 'city',
      at: { x: 0.077, z: -0.532 },
      description:
        'The end of the road. Guido Novello da Polenta gave him a house, his ' +
        'children joined him, he finished Paradiso here, and he died of malaria ' +
        'coming back from an embassy in 1321. Florence has asked for the bones ' +
        'several times. Ravenna has kept them.',
    },
    {
      id: 'bologna',
      name: 'Bologna',
      kind: 'city',
      at: { x: -0.253, z: -0.569 },
      description:
        'The university town over the mountains, and the first stop of the ' +
        'exile. In Malebolge he meets a Bolognese pimp and remarks that there ' +
        'are more of his townsmen down there than there are living men left ' +
        'between the Savena and the Reno.',
    },
    {
      id: 'pisa',
      name: 'Pisa',
      kind: 'city',
      at: { x: -0.615, z: -0.198 },
      description:
        'Where Count Ugolino was locked in a tower with two sons and two ' +
        'grandsons and the key was thrown in the river. He tells it himself, in ' +
        'the ice at the bottom of Hell, gnawing the skull of the archbishop who ' +
        'did it. Dante stops the poem to curse the whole city.',
    },
    {
      id: 'lucca',
      name: 'Lucca',
      kind: 'town',
      at: { x: -0.576, z: -0.259 },
      description:
        'The town whose grafters the devils are boiling in pitch when Dante ' +
        'passes: every man in it takes bribes, they tell him, except one, and ' +
        'there they change their minds about him too.',
    },
    {
      id: 'siena',
      name: 'Siena',
      kind: 'city',
      at: { x: -0.258, z: -0.009 },
      description:
        'Florence’s enemy down the road, and the city Dante is rudest ' +
        'about after his own: he asks, in the last ditch of Malebolge, whether ' +
        'any people on earth is as vain as the Sienese — and answers himself.',
    },
    {
      id: 'montaperti',
      name: 'Montaperti',
      kind: 'battle',
      at: { x: -0.223, z: 0.008 },
      description:
        'The disaster of 1260, forty years before the poem and still an open ' +
        'wound: Florence broken by Siena, the Arbia running red. In the ice ' +
        'Dante kicks a head that turns out to belong to the man who carried the ' +
        'Florentine standard and dropped it, and the two of them have a fight ' +
        'about it in the middle of the ninth circle.',
    },
    {
      id: 'rome',
      name: 'Rome',
      kind: 'capital',
      at: { x: 0.191, z: 0.665 },
      description:
        'The Jubilee of 1300 is running while the poem is set, and the crowds ' +
        'on the bridge at Sant’Angelo were marshalled into two lanes to ' +
        'stop a crush. Dante saw it, and uses it to describe the traffic of the ' +
        'damned in the first ditch of the eighth circle — the only simile in ' +
        'the poem drawn from a crowd-control measure.',
    },
    {
      id: 'montecassino',
      name: 'Monte Cassino',
      kind: 'ruin',
      at: { x: 0.698, z: 0.862 },
      description:
        'Benedict’s mountain, where he pulled down the temple of Apollo ' +
        'and founded the order. He appears in the sphere of Saturn to say that ' +
        'his rule is now waste paper, that the walls that were an abbey are a ' +
        'den, and that the cowls are sacks full of bad flour.',
    },
  ],

  routes: [
    {
      id: 'exile',
      name: 'The road out of Florence',
      color: '#e0b25c',
      style: 'solid',
      description:
        'Sentenced in absence in 1302 and never allowed back. The wandering ' +
        'ran twenty years and much further than this map — Verona, Lunigiana, ' +
        'maybe Paris — but it began over the mountains to Bologna and ended on ' +
        'the Adriatic at Ravenna.',
      points: [
        { x: -0.286, z: -0.224 },
        { x: -0.253, z: -0.569 },
        { x: -0.1, z: -0.5 },
        { x: 0.015, z: -0.439 },
        { x: 0.077, z: -0.532 },
      ],
    },
    {
      id: 'arno-road',
      name: 'The valley of the Arno',
      color: '#7fb6d4',
      style: 'solid',
      description:
        'Spring to sea, and the spine of the earthly story: Falterona, the ' +
        'Casentino where the wood is, Campaldino where he fought, Florence, and ' +
        'the mouth below Pisa.',
      points: [
        { x: -0.096, z: -0.314 },
        { x: -0.123, z: -0.271 },
        { x: -0.069, z: -0.238 },
        { x: -0.088, z: -0.2 },
        { x: -0.2345, z: -0.2339 },
        { x: -0.286, z: -0.224 },
        { x: -0.45, z: -0.21 },
        { x: -0.576, z: -0.259 },
        { x: -0.615, z: -0.198 },
      ],
    },
    {
      id: 'jubilee',
      name: 'The road to the Jubilee',
      color: '#d59ad0',
      style: 'dashed',
      description:
        'South through Siena to Rome for the holy year of 1300 — the year the ' +
        'poem is set in, and the crowd Dante puts on the bridge in Hell.',
      points: [
        { x: -0.286, z: -0.224 },
        { x: -0.258, z: -0.009 },
        { x: -0.223, z: 0.008 },
        { x: -0.05, z: 0.34 },
        { x: 0.191, z: 0.665 },
        { x: 0.45, z: 0.78 },
        { x: 0.698, z: 0.862 },
      ],
    },
  ],

  regions: [
    { id: 'r-tuscany', name: 'TUSCANY', at: { x: -0.36, z: -0.1 }, scale: 1.0 },
    { id: 'r-romagna', name: 'ROMAGNA', at: { x: 0.05, z: -0.62 }, scale: 0.85 },
    { id: 'r-apennine', name: 'THE APENNINES', at: { x: 0.02, z: -0.34 }, scale: 0.8 },
    { id: 'r-lazio', name: 'LAZIO', at: { x: 0.34, z: 0.6 }, scale: 0.85 },
    { id: 'r-tyrrhenian', name: 'THE TYRRHENIAN SEA', at: { x: -0.62, z: 0.42 }, scale: 0.9 },
  ],

  levels: [
    {
      id: 'paradiso',
      title: 'Paradiso',
      subtitle: 'Nine turning spheres, and what is past turning',
      tier: 2,
      terrain: {
        music: {
          title: 'The Turning Spheres',
          credit: 'Original, written for this atlas',
          melody:
            'C5:2 E5:2 G5:4 E5:2 C5:2 D5:8 r:2 ' +
            'G4:2 C5:2 E5:2 G5:2 C6:8 r:4',
          bass: 'C3:8 G2:8 A2:8 C3:8',
          tempo: 40,
          voice: 'bell',
          mood: 'heaven',
        },
        seed: 'dante-paradiso',
        sky: 'heaven',
        frequency: 1.2,
        islandFalloff: 0.55,
        seaLevel: 0.4,
        heightScale: 12,
        octaves: 3,
        waterColor: '#9fbbdf',
        biomes: [
          { maxHeight: 0.4, color: '#a8c2e4', name: 'Light' },
          { maxHeight: 0.52, color: '#c6d8ee', name: 'The lower spheres' },
          { maxHeight: 0.66, color: '#e3c98a', name: 'The sun' },
          { maxHeight: 0.84, color: '#f0dfae', name: 'The fixed stars' },
          { maxHeight: 1.0, color: '#fff5d6', name: 'The Empyrean' },
        ],
      },
      ambient: { trees: 0, birds: 12 },
      markers: [
        {
          id: 'moon',
          name: 'The Moon',
          kind: 'landmark',
          at: { x: -0.72, z: 0.6 },
          description:
            'The first and slowest sphere, and the lowest place in Heaven: ' +
            'souls whose vows were broken by force. Piccarda Donati, dragged ' +
            'out of her convent by her own brother, is asked whether she wants ' +
            'to be higher up and says the answer that holds the whole realm ' +
            'together — in His will is our peace.',
        },
        {
          id: 'venus',
          name: 'Venus',
          kind: 'landmark',
          at: { x: -0.4, z: 0.3 },
          description:
            'The third sphere, for those whose love ran to excess and turned ' +
            'in the end to the right object. Charles Martel is here, and asks ' +
            'the question the whole political half of the poem turns on: how ' +
            'does a good seed produce a bad heir?',
        },
        {
          id: 'sun',
          name: 'The Sun',
          kind: 'city',
          at: { x: -0.05, z: 0.02 },
          description:
            'The fourth sphere and the ring of the theologians, who arrange ' +
            'themselves in a circling crown of twelve lights. Thomas Aquinas ' +
            'praises Francis, and Bonaventure the Franciscan praises Dominic — ' +
            'each order sending its best man to speak for the rival.',
        },
        {
          id: 'mars',
          name: 'Mars',
          kind: 'battle',
          at: { x: 0.25, z: -0.2 },
          description:
            'The fifth sphere, where the souls of those who died for the faith ' +
            'stand in the shape of a cross. Dante’s own great-great-' +
            'grandfather Cacciaguida is here, and it is he who finally tells ' +
            'him plainly what the exile will be like: another man’s bread, ' +
            'and another man’s stairs.',
        },
        {
          id: 'saturn',
          name: 'Saturn',
          kind: 'ruin',
          at: { x: 0.5, z: -0.45 },
          description:
            'The seventh sphere, and the quietest: a golden ladder going up out ' +
            'of sight, with the contemplatives on it. Benedict comes down it to ' +
            'say what has become of his order, and there is no singing here — ' +
            'the music is left out because Dante could not have borne it.',
        },
        {
          id: 'fixed-stars',
          name: 'The Fixed Stars',
          kind: 'landmark',
          at: { x: 0.66, z: -0.66 },
          description:
            'The eighth sphere, where he is examined on faith, hope and love by ' +
            'Peter, James and John, like a bachelor before the doctors — and ' +
            'where he looks back down through all seven spheres beneath him and ' +
            'sees the Earth, and calls it the little threshing-floor that makes ' +
            'us so fierce.',
        },
        {
          id: 'empyrean',
          name: 'The Empyrean',
          kind: 'capital',
          at: { x: 0.0, z: -0.86 },
          description:
            'Past the ninth sphere and out of motion and space altogether: a ' +
            'river of light that turns out to be round, a rose of ranked souls, ' +
            'and Bernard in Beatrice’s place because she has gone back to ' +
            'her seat. The last vision is of three circles of one size and ' +
            'three colours, and the poem stops because the mind cannot follow.',
        },
      ],
      routes: [
        {
          id: 'ascent',
          name: 'The ascent',
          color: '#ffe9b0',
          style: 'solid',
          description:
            'Beatrice looks at the sun and Dante looks at Beatrice, and they ' +
            'rise — not travelling so much as being drawn, faster the higher ' +
            'they go, because everything is falling upward towards its rest.',
          points: [
            { x: -0.72, z: 0.6 },
            { x: -0.4, z: 0.3 },
            { x: -0.05, z: 0.02 },
            { x: 0.25, z: -0.2 },
            { x: 0.5, z: -0.45 },
            { x: 0.66, z: -0.66 },
            { x: 0.3, z: -0.8 },
            { x: 0.0, z: -0.86 },
          ],
        },
      ],
      regions: [
        { id: 'r-spheres', name: 'THE NINE SPHERES', at: { x: -0.2, z: 0.45 }, scale: 0.9 },
        // Kept well clear of the horizon: at z -0.98 this label was white text
        // on the white of the sky and simply could not be read.
        { id: 'r-empyrean', name: 'BEYOND MOTION', at: { x: -0.4, z: -0.7 }, scale: 0.85 },
      ],
    },
    {
      id: 'purgatorio',
      title: 'Purgatorio',
      subtitle: 'An island mountain, and the only place in the poem with a clock',
      tier: 1,
      terrain: {
        music: {
          title: 'The Terraces',
          credit: 'Original, written for this atlas',
          melody:
            'D4:2 E4:2 F4:2 G4:2 A4:4 r:2 ' +
            'A4:2 Bb4:2 A4:2 G4:2 F4:4 r:2 ' +
            'F4:2 G4:2 A4:2 C5:2 D5:6 r:2',
          bass: 'D3:8 F3:8 G3:8 A3:8',
          tempo: 50,
          voice: 'strings',
          mood: 'calm',
        },
        seed: 'dante-purgatorio',
        // One mountain in an empty ocean, which is exactly what it is: the
        // island antipodal to Jerusalem, thrown up by the impact when Satan
        // fell through the world from the other side.
        frequency: 0.75,
        islandFalloff: 0.92,
        seaLevel: 0.3,
        heightScale: 30,
        octaves: 3,
        waterColor: '#3f7f9c',
        biomes: [
          { maxHeight: 0.3, color: '#3a7593', name: 'The southern ocean' },
          { maxHeight: 0.35, color: '#cbbf94', name: 'The shore' },
          { maxHeight: 0.44, color: '#8a9a6a', name: 'Ante-Purgatory' },
          { maxHeight: 0.6, color: '#93826c', name: 'The terraces' },
          { maxHeight: 0.68, color: '#c07a55', name: 'The wall of fire' },
          { maxHeight: 1.0, color: '#6fae67', name: 'The Earthly Paradise' },
        ],
      },
      ambient: { trees: 0.2, treeColor: '#6f9a5e', birds: 6 },
      markers: [
        {
          id: 'shore',
          name: 'The Shore',
          kind: 'port',
          at: { x: -0.62, z: 0.58 },
          description:
            'They come out of the Earth at the foot of the mountain before ' +
            'dawn on Easter Sunday, filthy from Hell, and the first thing that ' +
            'happens is that Cato sends Virgil to wash Dante’s face and ' +
            'belt him with a reed from the water’s edge — the one plant ' +
            'that survives being pulled, because it bends.',
        },
        {
          id: 'ante-purgatory',
          name: 'Ante-Purgatory',
          kind: 'landmark',
          at: { x: -0.34, z: 0.34 },
          description:
            'The lower slopes, full of people who are not allowed to start ' +
            'yet: the excommunicated, the lazy, and those who left repenting ' +
            'until the last possible moment. Manfred, killed in battle and ' +
            'buried under a cairn by the river, and Buonconte from Campaldino, ' +
            'who saved himself with one tear.',
        },
        {
          id: 'valley',
          name: 'The Valley of the Princes',
          kind: 'town',
          at: { x: -0.12, z: 0.16 },
          description:
            'A green hollow off the path where the kings who neglected their ' +
            'kingdoms sit singing Salve Regina in the dusk, and two angels in ' +
            'green come down with blunted swords to see off a snake. The only ' +
            'evening in the poem that anyone would want to be in.',
        },
        {
          id: 'peters-gate',
          name: 'Peter’s Gate',
          kind: 'landmark',
          at: { x: 0.02, z: -0.02 },
          description:
            'Three steps — mirror-white, cracked black, blood-red — and an ' +
            'angel with a sword who cuts seven P’s into Dante’s ' +
            'forehead, one per deadly sin, to be wiped off one at a time on the ' +
            'way up. The gate opens with a noise like thunder, and behind them ' +
            'a voice is singing Te Deum out of tune with the hinges.',
        },
        {
          id: 'terraces',
          name: 'The Seven Terraces',
          kind: 'landmark',
          at: { x: 0.2, z: -0.24 },
          description:
            'Pride under carved stones, envy with the eyes sewn shut, wrath in ' +
            'smoke, sloth running, avarice face down, gluttony under a tree ' +
            'that leans away, lust in fire. Every terrace has its examples ' +
            'carved or called out, an angel at the stair, and a Beatitude sung ' +
            'as the P comes off — and the climb gets easier as they go.',
        },
        {
          id: 'wall-of-fire',
          name: 'The Wall of Fire',
          kind: 'danger',
          at: { x: 0.36, z: -0.44 },
          description:
            'The last terrace ends in a sheet of flame that has to be walked ' +
            'through, and Dante refuses. Virgil has argued him past Charon, ' +
            'Minos, the Minotaur and Satan; here nothing works until he says ' +
            'the one thing that does — Beatrice is on the other side.',
        },
        {
          id: 'earthly-paradise',
          name: 'The Earthly Paradise',
          kind: 'forest',
          at: { x: 0.52, z: -0.64 },
          description:
            'Eden, on the summit, empty for six thousand years: a wood with a ' +
            'wind that always blows one way, and two streams — Lethe, which ' +
            'takes the memory of sin, and Eunöe, which gives back the ' +
            'memory of good. Beatrice arrives in a procession and the first ' +
            'thing she does is tell him off, by name, until he cries.',
        },
        {
          id: 'virgil-turns-back',
          name: 'Where Virgil Stops',
          kind: 'ruin',
          at: { x: 0.44, z: -0.52 },
          description:
            'He has brought Dante down through nine circles, across the centre ' +
            'of the world and up seven terraces, and at the top he crowns and ' +
            'mitres him over himself and says nothing further. Dante turns to ' +
            'speak to him three lines later and he is gone, without a word of ' +
            'goodbye, back to Limbo. It is the saddest exit in European poetry.',
        },
      ],
      routes: [
        {
          id: 'climb',
          name: 'The climb',
          color: '#ffd08a',
          style: 'solid',
          description:
            'Three days and two nights up the mountain, and the only clock in ' +
            'the poem: you cannot climb after dark, so they stop where they are ' +
            'and Dante sleeps and dreams three times.',
          points: [
            { x: -0.62, z: 0.58 },
            { x: -0.34, z: 0.34 },
            { x: -0.12, z: 0.16 },
            { x: 0.02, z: -0.02 },
            { x: 0.2, z: -0.24 },
            { x: 0.36, z: -0.44 },
            { x: 0.44, z: -0.52 },
            { x: 0.52, z: -0.64 },
          ],
        },
      ],
      regions: [
        { id: 'r-ocean', name: 'THE SOUTHERN OCEAN', at: { x: -0.66, z: 0.86 }, scale: 0.9 },
        { id: 'r-mountain', name: 'MOUNT PURGATORY', at: { x: 0.16, z: -0.14 }, scale: 1.0 },
      ],
    },
    {
      id: 'inferno',
      title: 'Inferno',
      subtitle: 'A funnel under Jerusalem, nine circles wide at the top',
      tier: -1,
      terrain: {
        music: {
          title: 'The Gate',
          credit: 'Original, written for this atlas',
          melody:
            'D4:4 D4:2 C4:2 Bb3:4 A3:4 r:2 ' +
            'A3:2 Bb3:2 C4:2 Bb3:2 A3:6 r:2 ' +
            'F3:4 G3:4 A3:8 r:2',
          bass: 'D2:8 D2:8 Bb1:8 A1:8',
          tempo: 38,
          voice: 'strings',
          mood: 'dark',
        },
        seed: 'dante-inferno',
        sky: 'dark',
        // A funnel: high at the rim, falling all the way to a frozen centre.
        // `islandFalloff` is inverted in spirit here — the low ground is the
        // middle, which is where the ice and Satan are.
        frequency: 1.1,
        islandFalloff: 0.15,
        seaLevel: 0.2,
        heightScale: 26,
        octaves: 4,
        waterColor: '#5a3a2a',
        biomes: [
          { maxHeight: 0.2, color: '#a8c4cf', name: 'Cocytus' },
          { maxHeight: 0.3, color: '#4a3730', name: 'The pits' },
          { maxHeight: 0.44, color: '#6b3f33', name: 'Malebolge' },
          { maxHeight: 0.6, color: '#7d4a35', name: 'The burning sand' },
          { maxHeight: 0.8, color: '#5f4238', name: 'The circles' },
          { maxHeight: 1.0, color: '#4d4038', name: 'The rim' },
        ],
      },
      ambient: { trees: 0.06, treeColor: '#4a3a30', birds: 4, birdKind: 'raven' },
      markers: [
        {
          id: 'gate',
          name: 'The Gate',
          kind: 'landmark',
          at: { x: -0.8, z: -0.72 },
          description:
            'The inscription is the most famous thing in the poem and the ' +
            'strangest: the gate says it was made by power, wisdom and LOVE, ' +
            'and that nothing existed before it except eternal things. Behind ' +
            'it, before Hell proper begins, are the people who never took a ' +
            'side, chasing a blank banner and stung by wasps.',
        },
        {
          id: 'acheron',
          name: 'The Acheron',
          kind: 'port',
          at: { x: -0.62, z: -0.5 },
          description:
            'Charon will not take a living man, and says so; Virgil tells him ' +
            'to stop asking. The crossing itself is never described, because ' +
            'the ground shakes, a red light flashes, and Dante faints — which ' +
            'is how he gets over the river both times he needs to.',
        },
        {
          id: 'limbo',
          name: 'Limbo',
          kind: 'city',
          at: { x: -0.42, z: -0.3 },
          description:
            'A lit castle with seven walls on a green meadow, containing every ' +
            'virtuous pagan and the whole of classical civilisation. Homer, ' +
            'Horace, Ovid and Lucan come out to meet Virgil, and make Dante ' +
            'sixth of their number, which is the single most self-confident ' +
            'line any poet has written about himself. Nobody here is punished. ' +
            'They sigh, and that is all, forever.',
        },
        {
          id: 'lustful',
          name: 'The Second Circle',
          kind: 'danger',
          at: { x: -0.2, z: -0.1 },
          description:
            'A black wind that never stops, carrying the souls of those ruined ' +
            'by desire. Francesca da Rimini, killed with her husband’s ' +
            'brother, blames a book: they were reading about Lancelot, and that ' +
            'day they read no further. Dante faints again.',
        },
        {
          id: 'dis',
          name: 'The City of Dis',
          kind: 'capital',
          at: { x: 0.0, z: 0.08 },
          description:
            'Iron walls, red-hot mosques, and the only place where Virgil is ' +
            'refused and cannot get in. The demons slam the gate, the Furies ' +
            'call for Medusa, and the thing that finally opens it is an angel ' +
            'who walks across the Styx without wetting his feet and opens the ' +
            'gate with a stick, visibly bored.',
        },
        {
          id: 'wood-of-suicides',
          name: 'The Wood of the Suicides',
          kind: 'forest',
          at: { x: 0.2, z: 0.24 },
          description:
            'Black, knotted trees that bleed and speak when broken, because ' +
            'those who threw their bodies away do not get them back. Pier delle ' +
            'Vigne, the emperor’s chancellor who was disgraced on a false ' +
            'charge, asks only that his name be cleared upstairs.',
        },
        {
          id: 'malebolge',
          name: 'Malebolge',
          kind: 'danger',
          at: { x: 0.42, z: 0.42 },
          description:
            'Ten stone ditches with bridges over them, for the ten kinds of ' +
            'fraud, and the funniest and ugliest stretch of the poem: pimps ' +
            'whipped by devils, flatterers in filth, popes upside down in ' +
            'holes with their feet on fire, thieves swapping shape with ' +
            'snakes, and a squad of demons who escort the travellers with a ' +
            'signal Dante records without comment.',
        },
        {
          id: 'cocytus',
          name: 'Cocytus',
          kind: 'danger',
          at: { x: 0.66, z: 0.62 },
          description:
            'Not fire but ice: a frozen lake at the bottom of the universe for ' +
            'those who betrayed the people who trusted them, held at whatever ' +
            'depth their treason earned. Ugolino is here with the archbishop, ' +
            'and here Dante makes a promise to a soul in order to get him to ' +
            'talk, and then breaks it.',
        },
        {
          id: 'satan',
          name: 'The Centre',
          kind: 'danger',
          at: { x: 0.82, z: 0.78 },
          description:
            'Satan is waist-deep in the ice with three faces and six wings, ' +
            'and the wings are what freeze the lake — the machinery of Hell is ' +
            'powered by his trying to escape it. Virgil climbs down his flank, ' +
            'and at the hip turns upside down, because that is the centre of ' +
            'gravity of the world: from there, down is up, and the way out is ' +
            'the way on.',
        },
      ],
      routes: [
        {
          id: 'descent',
          name: 'The descent',
          color: '#d97b5a',
          style: 'solid',
          description:
            'Good Friday evening to Easter Saturday night, always turning ' +
            'left, always going down, and out at the far side of the world ' +
            'through a channel a stream has cut — the last line of the cantica ' +
            'is the sight of the stars again.',
          points: [
            { x: -0.8, z: -0.72 },
            { x: -0.62, z: -0.5 },
            { x: -0.42, z: -0.3 },
            { x: -0.2, z: -0.1 },
            { x: 0.0, z: 0.08 },
            { x: 0.2, z: 0.24 },
            { x: 0.42, z: 0.42 },
            { x: 0.66, z: 0.62 },
            { x: 0.82, z: 0.78 },
          ],
        },
      ],
      regions: [
        { id: 'r-upper-hell', name: 'THE UPPER CIRCLES', at: { x: -0.5, z: -0.42 }, scale: 0.9 },
        { id: 'r-dis', name: 'WITHIN THE WALLS', at: { x: 0.16, z: 0.16 }, scale: 0.85 },
        { id: 'r-ice', name: 'THE ICE', at: { x: 0.76, z: 0.86 }, scale: 0.85 },
      ],
    },
  ],

  elements: [
    {
      id: 'virgil',
      name: 'Virgil',
      glyph: '📜',
      description:
        'Dead 1,319 years, sent by Beatrice, and the guide for two thirds of ' +
        'the poem. He can argue his way past every demon in Hell and cannot ' +
        'enter Heaven at all, and he knows it the whole time.',
      journey: [
        { marker: 'dark-wood', note: 'A stranger on the hill, hoarse from long silence.' },
        { marker: 'gate', sinceChapter: 3, note: 'Through, and telling Dante not to ask.' },
        { marker: 'dis', sinceChapter: 6, note: 'Refused at the gate, for the only time.' },
        { marker: 'shore', sinceChapter: 10, note: 'Washing the soot off Dante’s face.' },
        { marker: 'virgil-turns-back', sinceChapter: 15, note: 'Gone, without saying goodbye.' },
      ],
    },
    {
      id: 'beatrice',
      name: 'Beatrice',
      glyph: '✨',
      description:
        'Dead at twenty-four, and the reason any of this happens: she comes ' +
        'down to Limbo to ask Virgil to go and fetch him. She takes over on ' +
        'the summit, and she is not gentle about it.',
      journey: [
        { marker: 'limbo', note: 'Down to Limbo to send Virgil after him.' },
        { marker: 'earthly-paradise', sinceChapter: 16, note: 'Naming him, and making him weep.' },
        { marker: 'empyrean', sinceChapter: 20, note: 'Back in her own seat, smiling from far off.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · Inferno',
      subtitle: 'Down the funnel, always turning left',
      chapters: [
        {
          id: 'i-1',
          title: 'Midway',
          narration:
            'A man of thirty-five — half of the biblical seventy — wakes up ' +
            'off the path in a wood he cannot describe, tries to climb a sunlit ' +
            'hill out of it, and is turned back by three animals. Then someone ' +
            'is standing there who has been dead since before the Empire: ' +
            'Virgil, sent, and offering a longer way round.',
          quote: {
            text:
              'Midway upon the journey of our life\n' +
              'I found myself within a forest dark,\n' +
              'For the straightforward pathway had been lost.',
            original:
              'Nel mezzo del cammin di nostra vita\n' +
              'mi ritrovai per una selva oscura,\n' +
              'ché la diritta via era smarrita.',
            source: 'Inferno I · trans. H. W. Longfellow',
          },
          focus: { marker: 'dark-wood', distance: 30, pitch: 40 },
          reveal: {
            markers: ['dark-wood', 'florence', 'falterona', 'arno', 'campaldino'],
            routes: ['arno-road'],
            regions: ['r-tuscany', 'r-apennine'],
          },
          highlight: { markers: ['dark-wood'] },
        },
        {
          id: 'i-2',
          title: 'The city he cannot go back to',
          narration:
            'Before the descent, the ground the poem is standing on. Florence ' +
            'sentenced him in 1302 to a fine, then to be burned alive if he ' +
            'returned. He is writing from Verona and Ravenna about a Florence ' +
            'he last saw at thirty-six, and roughly one soul in six he meets ' +
            'anywhere in the universe turns out to be from it.',
          focus: { marker: 'florence', distance: 26, pitch: 38 },
          reveal: {
            markers: ['bologna', 'forli', 'ravenna', 'siena', 'montaperti', 'pisa', 'lucca'],
            routes: ['exile'],
            regions: ['r-romagna'],
          },
          highlight: { markers: ['florence'], routes: ['exile'] },
        },
        {
          id: 'i-3',
          title: 'The gate',
          narration:
            'Down through the Earth to a gate with an inscription over it, and ' +
            'the detail everyone misremembers: the gate says it was built by ' +
            'the highest wisdom and the primal LOVE. Inside it, before Hell ' +
            'even starts, are the ones who took no side in anything — running ' +
            'after a blank flag, stung by insects, refused by both Heaven and ' +
            'Hell.',
          quote: {
            text: 'All hope abandon, ye who enter in!',
            original: 'Lasciate ogne speranza, voi ch’intrate.',
            source: 'Inferno III · trans. H. W. Longfellow',
          },
          level: 'inferno',
          focus: { marker: 'gate', distance: 30, pitch: 40 },
          reveal: {
            markers: ['gate', 'acheron', 'limbo'],
            routes: ['descent'],
            regions: ['r-upper-hell'],
          },
          highlight: { markers: ['gate'] },
        },
        {
          id: 'i-4',
          title: 'The castle with seven walls',
          narration:
            'Limbo: a green meadow and a lit castle holding every good pagan ' +
            'who died before the news. Nobody is tortured; they sigh. Homer, ' +
            'Horace, Ovid and Lucan come out to greet Virgil, and take Dante ' +
            'in as the sixth of their company — a thirty-five-year-old exile ' +
            'ranking himself with Homer, in his own poem, with a straight face.',
          level: 'inferno',
          focus: { marker: 'limbo', distance: 26, pitch: 38 },
          highlight: { markers: ['limbo'] },
        },
        {
          id: 'i-5',
          title: 'The wind, and the book',
          narration:
            'The second circle is a black gale that never drops. Francesca ' +
            'tells him how it happened and blames a novel: she and her ' +
            'husband’s brother were reading the Lancelot romance ' +
            'together, they got to the kiss, and that day they read no ' +
            'further. Dante — who wrote love poetry for a living — faints.',
          quote: {
            text:
              'Love, that exempts no one beloved from loving,\n' +
              'Seized me with pleasure of this man so strongly,\n' +
              'That, as thou seest, it doth not yet desert me.',
            original: 'Amor, ch’a nullo amato amar perdona,',
            source: 'Inferno V · trans. H. W. Longfellow',
          },
          level: 'inferno',
          focus: { marker: 'lustful', distance: 24, pitch: 36 },
          reveal: { markers: ['lustful', 'dis'], regions: ['r-dis'] },
          highlight: { markers: ['lustful'] },
        },
        {
          id: 'i-6',
          title: 'Refused at the walls',
          narration:
            'At the iron city of Dis the demons shut the gate in Virgil’s ' +
            'face, and for the first and only time he has nothing. They wait. ' +
            'What arrives is an angel who crosses the Styx without getting ' +
            'wet, opens the gate with a wand, tells the demons off like a man ' +
            'interrupted at more important work, and leaves without looking at ' +
            'either of them.',
          level: 'inferno',
          focus: { marker: 'dis', distance: 26, pitch: 38 },
          reveal: { markers: ['wood-of-suicides', 'malebolge'] },
          highlight: { markers: ['dis'] },
        },
        {
          id: 'i-7',
          title: 'The ditches',
          narration:
            'Malebolge, ten stone ditches for ten frauds, and the stretch ' +
            'where the poem is at its most inventive and least dignified: ' +
            'popes planted upside down with burning feet, thieves trading ' +
            'bodies with snakes mid-sentence, and a demon escort that Dante ' +
            'sees off the premises with a joke he sets down without comment.',
          level: 'inferno',
          focus: { marker: 'malebolge', distance: 30, pitch: 40 },
          highlight: { markers: ['malebolge'] },
        },
        {
          id: 'i-8',
          title: 'The ice, and the way out',
          narration:
            'The bottom of the world is not fire but a frozen lake, for the ' +
            'people who betrayed those who trusted them — Ugolino chewing the ' +
            'skull of the archbishop who starved him and his children in a ' +
            'tower in Pisa. Satan stands waist-deep in it, his wings making ' +
            'the wind that keeps it frozen. Virgil climbs down him, turns over ' +
            'at his hip because that is the centre of gravity of everything, ' +
            'and climbs up the other side.',
          quote: {
            text: 'Thence we came forth to rebehold the stars.',
            original: 'E quindi uscimmo a riveder le stelle.',
            source: 'Inferno XXXIV, the last line · trans. H. W. Longfellow',
          },
          level: 'inferno',
          focus: { marker: 'satan', distance: 24, pitch: 34 },
          reveal: { markers: ['cocytus', 'satan'], regions: ['r-ice'] },
          highlight: { markers: ['satan', 'cocytus'] },
        },
      ],
    },
    {
      id: 'ii',
      title: 'II · Purgatorio',
      subtitle: 'Up the mountain, and the only floor with a clock on it',
      chapters: [
        {
          id: 'ii-1',
          title: 'A reed, and a wash',
          narration:
            'They come out on the far side of the world before dawn on Easter ' +
            'Sunday: an island mountain in an empty southern ocean, thrown up ' +
            'by the impact when Satan fell through from the other side. Cato ' +
            'meets them, and the first act of the second cantica is Virgil ' +
            'washing the soot of Hell off Dante’s face and belting him ' +
            'with a reed — the only plant there, and the only one that grows ' +
            'back, because it gives way.',
          level: 'purgatorio',
          focus: { marker: 'shore', distance: 30, pitch: 40 },
          reveal: {
            markers: ['shore', 'ante-purgatory', 'valley'],
            routes: ['climb'],
            regions: ['r-ocean', 'r-mountain'],
          },
          highlight: { markers: ['shore'] },
        },
        {
          id: 'ii-2',
          title: 'One tear',
          narration:
            'On the lower slopes, the people who left it late. Buonconte — ' +
            'who commanded the other side at Campaldino, where Dante fought — ' +
            'explains why his body was never found: he died at the mouth of ' +
            'the Archiano saying one name, an angel took him for the sake of a ' +
            'single tear, and the devil who lost him raised a storm and rolled ' +
            'the corpse into the Arno out of spite.',
          level: 'purgatorio',
          focus: { marker: 'ante-purgatory', distance: 28, pitch: 38 },
          highlight: { markers: ['ante-purgatory', 'valley'] },
        },
        {
          id: 'ii-3',
          title: 'Seven letters',
          narration:
            'An angel at three steps cuts seven P’s into his forehead — ' +
            'peccata, one per deadly sin — and the gate opens with a noise ' +
            'like thunder. Above it the mountain is a spiral of seven ledges, ' +
            'each with its sin carved into the wall, an angel at the stair who ' +
            'wipes one letter off, and a climb that gets lighter every time.',
          level: 'purgatorio',
          focus: { marker: 'peters-gate', distance: 26, pitch: 38 },
          reveal: { markers: ['peters-gate', 'terraces'] },
          highlight: { markers: ['peters-gate'] },
        },
        {
          id: 'ii-4',
          title: 'The one thing that works',
          narration:
            'The last terrace ends in a wall of fire that has to be walked ' +
            'through, and Dante will not do it. Virgil reasons, then pleads, ' +
            'then reminds him he has argued them past Charon, Minos and Satan ' +
            'himself — and none of it moves him. What moves him is one ' +
            'sentence: Beatrice is on the other side of this.',
          level: 'purgatorio',
          focus: { marker: 'wall-of-fire', distance: 24, pitch: 36 },
          reveal: { markers: ['wall-of-fire'] },
          highlight: { markers: ['wall-of-fire'] },
        },
        {
          id: 'ii-5',
          title: 'The guide stops',
          narration:
            'At the top Virgil crowns and mitres Dante over himself — you are ' +
            'your own authority now — and then simply stops talking. Beatrice ' +
            'arrives in procession; Dante turns to say the thing he has been ' +
            'wanting to say all the way up, and Virgil is not there. He has ' +
            'gone back to Limbo. Nobody says goodbye.',
          level: 'purgatorio',
          focus: { marker: 'virgil-turns-back', distance: 22, pitch: 34 },
          reveal: { markers: ['virgil-turns-back', 'earthly-paradise'] },
          highlight: { markers: ['virgil-turns-back'] },
        },
        {
          id: 'ii-6',
          title: 'Two rivers',
          narration:
            'Eden on the summit, empty since it was vacated, with a wind that ' +
            'blows one way forever and two streams: Lethe takes the memory of ' +
            'what you did, Eunöe gives back the memory of the good. ' +
            'Beatrice, before either of them, stands on the far bank and takes ' +
            'him apart by name until he cannot speak — and the cantica ends ' +
            'with him ready to climb to the stars.',
          level: 'purgatorio',
          focus: { marker: 'earthly-paradise', distance: 22, pitch: 34 },
          highlight: { markers: ['earthly-paradise'] },
        },
      ],
    },
    {
      id: 'iii',
      title: 'III · Paradiso',
      subtitle: 'Nine spheres, and then no spheres',
      chapters: [
        {
          id: 'iii-1',
          title: 'Falling upward',
          narration:
            'Beatrice looks at the sun and Dante looks at Beatrice, and they ' +
            'are rising, faster as they go, because in this cosmology weight ' +
            'is desire and everything is falling towards its rest. First stop ' +
            'is the Moon and the broken vows, where Piccarda — pulled out of ' +
            'her convent by her brother — is asked if she minds being lowest, ' +
            'and answers that in His will is our peace.',
          level: 'paradiso',
          focus: { marker: 'moon', distance: 30, pitch: 40 },
          reveal: {
            markers: ['moon', 'venus', 'sun'],
            routes: ['ascent'],
            regions: ['r-spheres'],
          },
          highlight: { markers: ['moon'] },
        },
        {
          id: 'iii-2',
          title: 'Each order praises the other',
          narration:
            'In the Sun, the theologians make a ring of twelve lights and ' +
            'circle three times. Then Thomas Aquinas, a Dominican, delivers ' +
            'the praise of Francis; and Bonaventure, a Franciscan, delivers ' +
            'the praise of Dominic. Neither order gets to speak for itself, ' +
            'which is the point, and both of them then complain about their ' +
            'own.',
          level: 'paradiso',
          focus: { marker: 'sun', distance: 28, pitch: 38 },
          highlight: { markers: ['sun'] },
        },
        {
          id: 'iii-3',
          title: 'Another man’s stairs',
          narration:
            'In Mars the martyrs stand in the shape of a cross, and out of it ' +
            'comes his own great-great-grandfather Cacciaguida, who fought in ' +
            'a crusade and is the only ancestor Dante can name. He is the one ' +
            'who finally tells him straight what is coming: you will leave ' +
            'everything you love, you will learn how salt another man’s ' +
            'bread tastes and how hard it is going up and down his stairs.',
          level: 'paradiso',
          focus: { marker: 'mars', distance: 26, pitch: 38 },
          reveal: { markers: ['mars', 'saturn'] },
          highlight: { markers: ['mars'] },
        },
        {
          id: 'iii-4',
          title: 'The little threshing-floor',
          narration:
            'Examined on faith, hope and love by Peter, James and John like a ' +
            'student in front of doctors, and then told to look down. Through ' +
            'seven spheres he sees the whole Earth at once, and the word he ' +
            'reaches for is a threshing-floor — the small round patch of dirt ' +
            'that makes us so ferocious.',
          level: 'paradiso',
          focus: { marker: 'fixed-stars', distance: 26, pitch: 38 },
          reveal: { markers: ['fixed-stars'] },
          highlight: { markers: ['fixed-stars'] },
        },
        {
          id: 'iii-5',
          title: 'Where the poem stops',
          narration:
            'Past the ninth sphere there is no more space and no more time: a ' +
            'river of light that turns out to be a circle, a rose of ranked ' +
            'souls, and Beatrice quietly gone back to her own seat, smiling ' +
            'from very far away. The last thing he sees is three circles of ' +
            'one size and three colours, and the poem does not end so much as ' +
            'give out — on the same word all three parts end on.',
          quote: {
            text: 'The Love which moves the sun and the other stars.',
            original: 'l’amor che move il sole e l’altre stelle.',
            source: 'Paradiso XXXIII, the last line · trans. H. W. Longfellow',
          },
          level: 'paradiso',
          focus: { marker: 'empyrean', distance: 24, pitch: 34 },
          reveal: { markers: ['empyrean'], regions: ['r-empyrean'] },
          highlight: { markers: ['empyrean'] },
        },
        {
          id: 'iii-6',
          title: 'Ravenna',
          narration:
            'He finished Paradiso here and died of malaria in 1321, coming ' +
            'back from an embassy through the marshes. The last cantos were ' +
            'missing for months until, the story goes, he told his son in a ' +
            'dream where they were. Florence has asked for the bones ' +
            'repeatedly, and once got an empty coffin. Ravenna still has him.',
          focus: { marker: 'ravenna', distance: 24, pitch: 36 },
          highlight: { markers: ['ravenna'] },
        },
      ],
    },
  ],
}
