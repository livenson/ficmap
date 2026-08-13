import type { Story } from '../types'
import swedenHeight from '../assets/sweden-height.png'

/**
 * The Wonderful Adventures of Nils — Selma Lagerlöf's Nils Holgerssons
 * underbara resa genom Sverige, written 1906–07 as a school reader: the
 * Swedish teachers' association asked for a geography book for nine-year-olds
 * and got a novel that won its author the Nobel Prize. Lagerlöf died in 1940;
 * Velma Swanston Howard's translation (Project Gutenberg #10935) is the text
 * this world was read out of, chapter by chapter.
 *
 * That reading is the map. The book's table of contents IS an itinerary, and
 * this world follows it in order: Vemmenhög, Vombsjön, Glimminge, Kullaberg,
 * Blekinge, Ronneby, Karlskrona, Öland, Little Karl's Island, Småland,
 * Taberg, Tåkern, Ulvåsa, Kolmården, the flood on Mälaren, Stockholm,
 * Gästrikland, Hälsingland, Medelpad, Ångermanland, Västerbotten, Lapland,
 * and then home the western way through Härjedalen, Värmland and Dalsland.
 * Place-name frequency in the text confirms the weighting: Skåne 49 mentions,
 * Småland 44, Lapland 34, Stockholm 27, Kullaberg 25, Glimminge 24,
 * Blekinge 21, Kebnekaise 19.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 10.0) / 7.5 − 1      map z = (69.5 − lat) / 7.25 − 1
 *
 * This is the atlas's first world that is TALLER than it is wide: Sweden is
 * 777 km across and 1,611 km down, aspect 0.482. That shape is the whole
 * point of the book — a boy on a goose flying the length of a country.
 *
 * Narration paraphrases the book; it quotes no translation.
 */
export const nils: Story = {
  id: 'nils',
  title: 'Nils Holgersson',
  subtitle: 'The length of Sweden on a farm goose',
  author: 'Selma Lagerlöf',
  region: 'Sweden, Skåne to Lapland',
  epoch: 'Swedish novel · 1906–07',
  group: 'adventure',
  intro:
    'A fourteen-year-old who torments animals, is shrunk to the size of a ' +
    'thumb by an elf, and grabs the neck of the farm gander just as it takes ' +
    'off after a wedge of wild geese. Press ▶ Play story to fly the whole ' +
    'route north with Akka from Kebnekaise and back down the western side — ' +
    'the book was commissioned as a school geography reader, so the ' +
    'itinerary is the plot.',
  surfaceName: 'Sweden',
  ambient: {
    trees: 0.6,
    treeKind: 'conifer',
    treeColor: '#3a6647',
    birds: 14,
    fish: 4,
  },
  terrain: {
    music: {
      // A polska — the Swedish fiddle dance in three, with the weight on the
      // first and third beats. Written for this atlas rather than taken from
      // a collection; no traditional Swedish tune was transcribed here.
      title: 'Polska for a small boy',
      credit: 'After the Swedish polska · original',
      melody:
        'D4:2 F4:1 A4:2 G4:1 F4:2 E4:1 D4:3 ' +
        'A4:2 C5:1 D5:2 C5:1 A4:2 G4:1 F4:3 ' +
        'F4:2 G4:1 A4:2 D5:1 C5:2 A4:1 G4:3 ' +
        'F4:2 E4:1 D4:2 C4:1 D4:6 r:3',
      bass: 'D2:6 A2:6 Bb2:6 D2:6',
      tempo: 84,
      voice: 'flute',
      mood: 'wonder',
    },
    seed: 'nils-1', // unused: the heightmap takes precedence
    heightmap: swedenHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0033,
    // 777 km across by 1,611 km down — the atlas's first world with aspect < 1.
    aspect: 0.482,
    // Capped at 1,800 m with landGamma 0.6, so the Skåne plain reads as land
    // and the Lapland fells still stand up at the top of the map.
    heightScale: 15,
    // A map two and a half times taller than it is wide is unreadable edge-on.
    overhead: true,
    rivers: 7,
    biomes: [
      { maxHeight: 0.0033, color: '#2a5570', name: 'The Baltic & the lakes' },
      { maxHeight: 0.05, color: '#cac59d', name: 'Shore' },
      { maxHeight: 0.14, color: '#6d9b55', name: 'The plains' },
      { maxHeight: 0.3, color: '#457a4a', name: 'Forest' },
      { maxHeight: 0.5, color: '#5f7a55', name: 'Norrland' },
      { maxHeight: 0.72, color: '#8b8974', name: 'The fells' },
      { maxHeight: 1.0, color: '#f0f1f3', name: 'Snow' },
    ],
  },

  markers: [
    {
      id: 'vemmenhog',
      name: 'West Vemminghög',
      kind: 'town',
      at: { x: -0.540, z: 0.942 },
      description:
        'A small farm in the far south of Skåne, on a Sunday in March. Nils ' +
        'is left home from church to read his sermon, catches an elf in a ' +
        'butterfly net, and is a thumb’s height tall before he has finished ' +
        'gloating. Then the wild geese go over, and the white farm gander ' +
        'goes with them.',
    },
    {
      id: 'vomb',
      name: 'Vomb Lake',
      kind: 'landmark',
      at: { x: -0.520, z: 0.908 },
      description:
        'The geese’s first roost, standing on the ice a safe distance from ' +
        'shore. Smirre Fox comes across the ice in the dark and takes one; ' +
        'Nils hangs onto the fox’s tail all the way through the wood and gets ' +
        'her back, which is how a boy nobody wants becomes useful.',
    },
    {
      id: 'glimminge',
      name: 'Glimminge Castle',
      kind: 'ruin',
      at: { x: -0.460, z: 0.928 },
      description:
        'A black stone keep full of grey rats, and the black rats who used to ' +
        'own it besieged inside. The stork Herr Ermenrich fetches Nils, and ' +
        'the boy pipes the whole grey army out of the castle and away with a ' +
        'reed pipe he cannot stop playing.',
    },
    {
      id: 'kullaberg',
      name: 'Kullaberg',
      kind: 'peak',
      at: { x: -0.671, z: 0.821 },
      description:
        'The headland where every animal in Skåne comes once a year under an ' +
        'old truce to watch the cranes dance at daybreak — and where the ' +
        'wild geese formally accuse Smirre Fox of breaking the peace and have ' +
        'him exiled from the province, one ear-tip clipped as the sentence.',
    },
    {
      id: 'blekinge',
      name: 'The Stairway with Three Steps',
      kind: 'landmark',
      at: { x: -0.354, z: 0.842 },
      description:
        'A teacher’s description of Blekinge that the geese fly straight ' +
        'through: three broad steps down from the Småland highlands to the ' +
        'Baltic — moorland, then farm country, then the sea — as though the ' +
        'province had been built for something enormous to walk down.',
    },
    {
      id: 'ronneby',
      name: 'Ronneby River',
      kind: 'landmark',
      at: { x: -0.296, z: 0.834 },
      description:
        'A rapids and a waterfall, and a hotel balcony over them where Nils ' +
        'is nearly caught by Smirre — who has followed them out of Skåne ' +
        'despite the sentence, and who carries the boy off along the river ' +
        'bank until a lie about a bargain gets him free.',
    },
    {
      id: 'karlskrona',
      name: 'Karlskrona',
      kind: 'city',
      at: { x: -0.255, z: 0.840 },
      description:
        'The naval town at night, where the bronze statue of the old king ' +
        'steps down off its pedestal because a thumb-sized boy was rude to ' +
        'it, and chases him through the dockyard until the wooden figurehead ' +
        'Rosenbom — hat in hand, poor-box in his chest — takes the ' +
        'consequences instead.',
    },
    {
      id: 'oland',
      name: 'Öland',
      kind: 'landmark',
      at: { x: -0.147, z: 0.828 },
      description:
        'The long island the book calls a butterfly that came to rest on the ' +
        'Baltic and turned to stone. The geese stop on the southern point, ' +
        'where the alvar is bare limestone and the grass is grazed to nothing ' +
        'and the whole island is one flat migration ground.',
    },
    {
      id: 'karls-island',
      name: 'Little Karl’s Island',
      kind: 'landmark',
      at: { x: 0.089, z: 0.683 },
      description:
        'The islet off Gotland where the grey seals lie up and where Nils ' +
        'listens to the storm from a cliff ledge. This is where the book ' +
        'starts telling stories about the sea rather than about the boy.',
    },
    {
      id: 'vineta',
      name: 'Vineta',
      kind: 'ruin',
      at: { x: 0.093, z: 0.724 },
      description:
        'A city so rich no one could count its money, sunk under the Baltic ' +
        'and allowed up onto the shore for one hour every hundred years. If a ' +
        'living person buys anything there, it stays. Nils has no money, and ' +
        'runs through streets full of merchants holding things out to him.',
    },
    {
      id: 'visby',
      name: 'Visby',
      kind: 'city',
      at: { x: 0.107, z: 0.636 },
      description:
        'The other of the two cities: the real one, on Gotland — a ring wall, ' +
        'towers and roofless churches, all that is left of a place that was ' +
        'once as rich as Vineta and did not sink. The book prefers it, ' +
        'because it is actually there.',
    },
    {
      id: 'smaland',
      name: 'Småland',
      kind: 'landmark',
      at: { x: -0.400, z: 0.700 },
      description:
        'The province St. Peter made out of stones and firs while God was ' +
        'looking away, and then had to compensate for by giving it the ' +
        'liveliest people in the country. Poor soil, and everybody in the ' +
        'story emigrating or going into service somewhere else.',
    },
    {
      id: 'taberg',
      name: 'Taberg',
      kind: 'peak',
      at: { x: -0.460, z: 0.628 },
      description:
        'A hill of iron ore standing out of the Småland forest, and the ' +
        'crows’ stronghold. Nils is kidnapped by the crow flock, made to pick ' +
        'a lock on a stolen jar of coins, and rescued when the theft turns ' +
        'into a fight among the crows themselves.',
    },
    {
      id: 'huskvarna',
      name: 'Huskvarna & Jönköping',
      kind: 'city',
      at: { x: -0.431, z: 0.615 },
      description:
        'Down from the iron hill to the water: workshops, a factory town at ' +
        'the foot of the slope, and the long lake Vättern beginning. The ' +
        'geography lesson is entirely undisguised here, and the book does not ' +
        'apologise for it.',
    },
    {
      id: 'takern',
      name: 'The Big Bird Lake',
      kind: 'landmark',
      at: { x: -0.357, z: 0.538 },
      description:
        'Tåkern: shallow, reedy, and the best bird lake in the country — ' +
        'which is why the farmers want to drain it. The ducks and grebes ' +
        'stage a campaign, and Nils argues the case for leaving a lake alone ' +
        'to people who cannot hear him.',
    },
    {
      id: 'omberg',
      name: 'Omberg',
      kind: 'peak',
      at: { x: -0.380, z: 0.541 },
      description:
        'The wooded mountain standing over Tåkern and Vättern together, and ' +
        'the landmark the geese steer by across the Östergötland plain.',
    },
    {
      id: 'ulvasa',
      name: 'Ulvåsa',
      kind: 'town',
      at: { x: -0.287, z: 0.517 },
      description:
        'Where a peasant asks the lady of the house to prophesy the future of ' +
        'Östergötland, and keeps saying it is not enough. She ends by seeing ' +
        'people digging from Motala to Mem, and smoke, and iron, and admits ' +
        'she cannot see what will come after that.',
    },
    {
      id: 'vadstena',
      name: 'Vadstena',
      kind: 'town',
      at: { x: -0.348, z: 0.524 },
      description:
        'The abbey town on Vättern, on the flat rich plain the book keeps ' +
        'comparing with the stones of Småland — two provinces side by side, ' +
        'one of which got the good soil.',
    },
    {
      id: 'motala',
      name: 'Motala',
      kind: 'town',
      at: { x: -0.328, z: 0.512 },
      description:
        'The western end of the Göta Canal, and the first half of the ' +
        'Ulvåsa-lady’s prophecy come true: a country cut open from lake to ' +
        'sea by people with spades.',
    },
    {
      id: 'kolmarden',
      name: 'Kolmården',
      kind: 'forest',
      at: { x: -0.147, z: 0.494 },
      description:
        'The forest wall between Östergötland and the north, and the home of ' +
        'the story of Karr the dog and Grayskin the elk — a friendship, a ' +
        'betrayal, and a forest fire, told as the geese pass over it.',
    },
    {
      id: 'malaren',
      name: 'Lake Mälaren',
      kind: 'landmark',
      at: { x: -0.027, z: 0.390 },
      description:
        'The flood: ice going out, water over the shores, and every animal ' +
        'in the valley on whatever is still above it. Nils spends the chapter ' +
        'ferrying squirrels and hares off islands that are shrinking under ' +
        'them.',
    },
    {
      id: 'stockholm',
      name: 'Stockholm',
      kind: 'capital',
      at: { x: 0.076, z: 0.410 },
      description:
        'The city on the water, and Skansen above it — the open-air museum ' +
        'where old farm buildings from every province stand in rows, and ' +
        'where Nils is shut in among the captive animals until Gorgo the ' +
        'eagle, raised by Akka, breaks the bars for him.',
    },
    {
      id: 'uppsala',
      name: 'Uppsala',
      kind: 'city',
      at: { x: 0.019, z: 0.330 },
      description:
        'North of the capital, where the plains give out. From here the book ' +
        'stops being about southern farm country and starts being about ' +
        'distance: every remaining chapter is one more province, and they get ' +
        'emptier as they go.',
    },
    {
      id: 'gastrikland',
      name: 'Gästrikland',
      kind: 'forest',
      at: { x: -0.107, z: 0.228 },
      description:
        'The first province of Norrland proper: iron works in clearings, ' +
        'charcoal burners, and forest closing over the road behind you. The ' +
        'chapter is called On Over Gästrikland, and the title is the ' +
        'itinerary.',
    },
    {
      id: 'halsingland',
      name: 'Hälsingland',
      kind: 'forest',
      at: { x: -0.133, z: 0.076 },
      description:
        'A day in a valley of big painted farmhouses and hay meadows, with ' +
        'the forest standing over the fields on both sides. Nils has been ' +
        'with the geese long enough by now that nobody remembers he is a boy.',
    },
    {
      id: 'sundsvall',
      name: 'Medelpad',
      kind: 'port',
      at: { x: -0.025, z: -0.019 },
      description:
        'Sawmills all along the coast, logs coming down the rivers, and the ' +
        'timber trade that built the towns of the Norrland shore. Half the ' +
        'chapter is spent looking down at rafts.',
    },
    {
      id: 'angermanland',
      name: 'Ångermanland',
      kind: 'landmark',
      at: { x: 0.040, z: -0.145 },
      description:
        'A morning over the high river valleys, where the country stands up ' +
        'and the water runs a long way down between the hills. The last ' +
        'province before the map goes empty.',
    },
    {
      id: 'vasterbotten',
      name: 'Västerbotten',
      kind: 'landmark',
      at: { x: 0.307, z: -0.324 },
      description:
        'Westbottom: coastal settlements, and behind them nothing but forest ' +
        'and marsh all the way to the fells. Here the geese meet Osa the ' +
        'goose girl and little Mats, walking north on foot to find their ' +
        'father.',
    },
    {
      id: 'malmberget',
      name: 'Malmberget',
      kind: 'city',
      at: { x: 0.424, z: -0.680 },
      description:
        'The iron mine in Lapland where Osa and Mats’s father works, and ' +
        'where the two children are walking to. Akka takes Nils there to see ' +
        'the ore mountain being cut open — the far northern end of the same ' +
        'iron the book started admiring at Taberg.',
    },
    {
      id: 'kebnekaise',
      name: 'Kebnekaise',
      kind: 'peak',
      at: { x: 0.151, z: -0.779 },
      description:
        'The highest mountain in Sweden, and the leader-goose’s address: Akka ' +
        'from Kebnekaise, who has led the wedge for a hundred years and who ' +
        'introduces her flock by their home fells — Iksi from Vassijaure, ' +
        'Kolmi from Sarjektjåkkå, Neljä from Svappavaara.',
    },
    {
      id: 'vassijaure',
      name: 'Vassijaure',
      kind: 'landmark',
      at: { x: 0.107, z: -0.851 },
      description:
        'The far north-west, up against the Norwegian border, and the ' +
        'summering grounds the whole journey has been aimed at. The goslings ' +
        'hatch here; the summer is the shortest chapter of the year and the ' +
        'happiest part of the book.',
    },
    {
      id: 'lapp-camp',
      name: 'With the Laplanders',
      kind: 'town',
      at: { x: 0.213, z: -0.740 },
      description:
        'A Sami camp by a lake in the rain, where Osa arrives looking for her ' +
        'brother and is taken in. Ola Serka works out how to tell her what ' +
        'has happened, and takes his time about it. The book’s one long stop ' +
        'that has nothing to do with geese.',
    },
    {
      id: 'harjedalen',
      name: 'Härjedalen',
      kind: 'forest',
      at: { x: -0.533, z: -0.034 },
      description:
        'Homeward bound down the western side, through the border province ' +
        'of legends and old bear stories. The route down is deliberately not ' +
        'the route up: Lagerlöf gets two-thirds of the country in on one ' +
        'return trip.',
    },
    {
      id: 'varmland',
      name: 'Värmland',
      kind: 'forest',
      at: { x: -0.573, z: 0.352 },
      description:
        'Lagerlöf’s own province — she was born at Mårbacka and taught school ' +
        'in Landskrona — and the one the book flies over with the least ' +
        'explaining. Lakes, forest, iron works, and a valley the author did ' +
        'not need a map for.',
    },
    {
      id: 'vanern',
      name: 'Vänern',
      kind: 'landmark',
      at: { x: -0.560, z: 0.462 },
      description:
        'The great lake, and the middle of the country’s waterway: the Göta ' +
        'Canal comes in from the east and the Göta river runs out of the ' +
        'south-west corner to the sea.',
    },
    {
      id: 'dalsland',
      name: 'Dalsland',
      kind: 'landmark',
      at: { x: -0.693, z: 0.476 },
      description:
        'The small province between Vänern and the Norwegian border, and the ' +
        'last new country on the map before the geese turn south for Skåne.',
    },
    {
      id: 'treasure-isle',
      name: 'The Treasure on the Island',
      kind: 'landmark',
      at: { x: -0.840, z: 0.614 },
      description:
        'Bare cliffs out in the West Sea, where Akka once sheltered from a ' +
        'storm and found bags of gold half buried in the sand. Years later ' +
        'she detours the whole flock out there so that Nils can dig the coins ' +
        'up for Osa and Mats — the geese have no use for money and know ' +
        'somebody who does.',
    },
    {
      id: 'home',
      name: 'Home at Last',
      kind: 'town',
      at: { x: -0.554, z: 0.928 },
      description:
        'The elf’s condition was that Nils would be a boy again on the day ' +
        'the white gander came safely home. He has spent the whole book ' +
        'trying to prevent exactly that, because being human again means the ' +
        'gander goes to the block — and the two things cannot both be had.',
    },
  ],

  routes: [
    {
      id: 'skane',
      name: 'Skåne',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.540, z: 0.942 },
        { x: -0.520, z: 0.908 },
        { x: -0.460, z: 0.928 },
        { x: -0.560, z: 0.880 },
        { x: -0.671, z: 0.821 },
      ],
      description:
        'The first week: off the farm, the ice on Vombsjön, the rats piped ' +
        'out of Glimminge, and the crane dance on Kullaberg.',
    },
    {
      id: 'baltic-leg',
      name: 'Blekinge & the Islands',
      style: 'solid',
      color: '#6fa8c8',
      points: [
        { x: -0.671, z: 0.821 },
        { x: -0.354, z: 0.842 },
        { x: -0.296, z: 0.834 },
        { x: -0.255, z: 0.840 },
        { x: -0.147, z: 0.828 },
        { x: 0.093, z: 0.724 },
        { x: 0.089, z: 0.683 },
        { x: 0.107, z: 0.636 },
      ],
      description:
        'East along the three steps of Blekinge to Karlskrona and the bronze ' +
        'man, then out over the Baltic to Öland, the seal island, the sunken ' +
        'city and the ring wall of Visby.',
    },
    {
      id: 'smaland-leg',
      name: 'Småland & Östergötland',
      style: 'solid',
      color: '#a8c46a',
      points: [
        { x: 0.107, z: 0.636 },
        { x: -0.400, z: 0.700 },
        { x: -0.460, z: 0.628 },
        { x: -0.431, z: 0.615 },
        { x: -0.357, z: 0.538 },
        { x: -0.380, z: 0.541 },
        { x: -0.348, z: 0.524 },
        { x: -0.328, z: 0.512 },
        { x: -0.287, z: 0.517 },
        { x: -0.147, z: 0.494 },
      ],
      description:
        'Back west over the stones of Småland to the iron hill and the crows, ' +
        'then down onto the Östergötland plain — the bird lake, the abbey ' +
        'town, the canal, and the forest wall of Kolmården.',
    },
    {
      id: 'malaren-leg',
      name: 'The Flood & the Capital',
      style: 'solid',
      color: '#8fb4d8',
      points: [
        { x: -0.147, z: 0.494 },
        { x: -0.027, z: 0.390 },
        { x: 0.076, z: 0.410 },
        { x: 0.019, z: 0.330 },
      ],
      description:
        'Spring water over the shores of Mälaren, a week of ferrying animals ' +
        'off shrinking islands, and then Stockholm, Skansen, and an eagle ' +
        'bending the bars of a cage.',
    },
    {
      id: 'norrland',
      name: 'Up Through Norrland',
      style: 'solid',
      color: '#c8a86b',
      points: [
        { x: 0.019, z: 0.330 },
        { x: -0.107, z: 0.228 },
        { x: -0.133, z: 0.076 },
        { x: -0.025, z: -0.019 },
        { x: 0.040, z: -0.145 },
        { x: 0.307, z: -0.324 },
      ],
      description:
        'One province a chapter: Gästrikland, Hälsingland, Medelpad, ' +
        'Ångermanland, Västerbotten. The farms thin out, the forest closes ' +
        'in, and the book turns into a long look down.',
    },
    {
      id: 'lapland',
      name: 'Lapland',
      style: 'solid',
      color: '#b9c8d8',
      points: [
        { x: 0.307, z: -0.324 },
        { x: 0.424, z: -0.680 },
        { x: 0.213, z: -0.740 },
        { x: 0.151, z: -0.779 },
        { x: 0.107, z: -0.851 },
      ],
      description:
        'The end of the northward journey: the ore mountain at Malmberget, a ' +
        'Sami camp in the rain, Akka’s own fell, and the summer grounds where ' +
        'the goslings hatch.',
    },
    {
      id: 'homeward',
      name: 'Homeward Bound',
      style: 'solid',
      color: '#d98f5a',
      points: [
        { x: 0.107, z: -0.851 },
        { x: -0.100, z: -0.500 },
        { x: -0.533, z: -0.034 },
        { x: -0.573, z: 0.352 },
        { x: -0.560, z: 0.462 },
        { x: -0.693, z: 0.476 },
        { x: -0.840, z: 0.614 },
      ],
      description:
        'Down the western side in autumn — Härjedalen, Värmland, Vänern, ' +
        'Dalsland — with one detour out to a bare island in the West Sea for ' +
        'a bag of gold coins the geese have no use for.',
    },
    {
      id: 'last-leg',
      name: 'The Journey to Vemminghög',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.840, z: 0.614 },
        { x: -0.700, z: 0.760 },
        { x: -0.671, z: 0.821 },
        { x: -0.554, z: 0.928 },
        { x: -0.540, z: 0.942 },
      ],
      description:
        'The last flight: back down over Skåne to the farm he left in March, ' +
        'with the one thing he has been dreading waiting for him at the end ' +
        'of it.',
    },
  ],

  regions: [
    { id: 'r-skane', name: 'Skåne', at: { x: -0.560, z: 0.980 }, scale: 0.9 },
    { id: 'r-smaland', name: 'Småland', at: { x: -0.440, z: 0.680 }, scale: 0.95 },
    { id: 'r-ostergot', name: 'Östergötland', at: { x: -0.250, z: 0.470 }, scale: 0.9 },
    { id: 'r-norrland', name: 'Norrland', at: { x: 0.120, z: -0.100 }, scale: 1.15 },
    { id: 'r-lapland', name: 'Lapland', at: { x: 0.220, z: -0.880 }, scale: 1.1 },
  ],

  chapters: [
    {
      id: 'n-1',
      title: 'The boy',
      narration:
        'A Sunday morning in March in West Vemminghög. Nils is fourteen, ' +
        'left at home with a sermon to read, and good for nothing except ' +
        'tormenting the animals. He catches an elf in a butterfly net, ' +
        'bargains badly, and is a thumb’s height tall before he has finished ' +
        'congratulating himself.',
      focus: { marker: 'vemmenhog', distance: 20, pitch: 46 },
      reveal: { markers: ['vemmenhog'], regions: ['r-skane'] },
    },
    {
      id: 'n-2',
      title: 'Akka from Kebnekaise',
      narration:
        'The wild geese go over shouting to the farm birds to come along, and ' +
        'the white gander tries it. Nils grabs his neck to stop him and goes ' +
        'up with him. The leader is Akka from Kebnekaise, a hundred years ' +
        'old, who does not want a human on the journey and says so.',
      focus: { marker: 'vomb', distance: 24, pitch: 44 },
      reveal: { markers: ['vomb'], routes: ['skane'] },
    },
    {
      id: 'n-3',
      title: 'Glimminge Castle',
      narration:
        'Grey rats have taken the black stone keep and are besieging the ' +
        'black rats inside it. A stork carries Nils there, and he pipes the ' +
        'whole grey army out over the fields and into the water with a reed ' +
        'pipe he cannot put down. It is the first time being small is worth ' +
        'anything.',
      focus: { marker: 'glimminge', distance: 20, pitch: 44 },
      reveal: { markers: ['glimminge'] },
      highlight: { markers: ['glimminge'] },
    },
    {
      id: 'n-4',
      title: 'The crane dance on Kullaberg',
      narration:
        'Once a year every animal in Skåne comes to the headland under an old ' +
        'truce to watch the cranes dance at dawn. This year the meeting also ' +
        'tries a case: Smirre Fox, for hunting under the peace. He is exiled ' +
        'from the province with the tip of one ear clipped, and follows the ' +
        'geese out of it anyway.',
      focus: { marker: 'kullaberg', distance: 26, pitch: 42 },
      reveal: { markers: ['kullaberg'] },
    },
    {
      id: 'n-5',
      title: 'The stairway with three steps',
      narration:
        'Blekinge, described by a schoolteacher and then flown: three broad ' +
        'steps down from the highlands to the Baltic, with rivers running ' +
        'over each of them. The book is teaching geography now and does not ' +
        'trouble to hide it — this was a commission from the teachers’ ' +
        'association.',
      focus: { marker: 'blekinge', distance: 30, pitch: 42 },
      reveal: { markers: ['blekinge', 'ronneby'], routes: ['baltic-leg'] },
    },
    {
      id: 'n-6',
      title: 'The bronze man and the wooden man',
      narration:
        'In Karlskrona at night, Nils is rude to a statue of the old king and ' +
        'the statue steps down and comes after him through the dockyards. He ' +
        'hides behind Rosenbom, the wooden figurehead with the poor-box in ' +
        'his chest, who takes off his hat, takes the consequences, and is ' +
        'gone in the morning.',
      focus: { marker: 'karlskrona', distance: 20, pitch: 44 },
      reveal: { markers: ['karlskrona'] },
      highlight: { markers: ['karlskrona'] },
    },
    {
      id: 'n-7',
      title: 'The big butterfly',
      narration:
        'Öland was a butterfly, the story goes, that came to rest on the ' +
        'Baltic and turned to stone. The geese stop on the southern point, ' +
        'where the ground is bare limestone, the grass is cropped to nothing, ' +
        'and every migrating bird in the country seems to be standing about ' +
        'waiting for the wind.',
      focus: { marker: 'oland', distance: 30, pitch: 42 },
      reveal: { markers: ['oland'] },
    },
    {
      id: 'n-8',
      title: 'Two cities',
      narration:
        'Vineta comes up out of the sea for one hour in a hundred years, and ' +
        'stays up if a living person buys anything in it. Nils runs through ' +
        'streets of merchants holding goods out to him with nothing in his ' +
        'pockets. Later he sees Visby on Gotland — the same wealth, roofless ' +
        'and still standing — and decides he prefers it.',
      focus: { marker: 'vineta', distance: 30, pitch: 40 },
      reveal: { markers: ['karls-island', 'vineta', 'visby'] },
      highlight: { markers: ['vineta'] },
    },
    {
      id: 'n-9',
      title: 'The legend of Småland',
      narration:
        'St. Peter was allowed to make one province and made Småland out of ' +
        'stones and fir trees while God was looking the other way. Then God ' +
        'had to even it up by giving the province the liveliest people in the ' +
        'country, which is why they are all leaving it.',
      focus: { marker: 'smaland', distance: 34, pitch: 42 },
      reveal: { markers: ['smaland'], routes: ['smaland-leg'], regions: ['r-smaland'] },
    },
    {
      id: 'n-10',
      title: 'From Taberg to Huskvarna',
      narration:
        'The crows carry Nils off to their stronghold on the iron hill and ' +
        'make him pick the lock of a stolen jar of coins; the theft turns ' +
        'into a fight among the crows and he gets away in it. Then down the ' +
        'slope past the works and the factory town to the head of Vättern.',
      focus: { marker: 'taberg', distance: 22, pitch: 44 },
      reveal: { markers: ['taberg', 'huskvarna'] },
    },
    {
      id: 'n-11',
      title: 'The big bird lake',
      narration:
        'Tåkern is shallow, reedy and full of birds, and the farmers want to ' +
        'drain it for meadow. The ducks organise, the grebes argue, and a ' +
        'boy the size of a thumb makes the case for leaving a lake alone to ' +
        'people who cannot hear a word of it.',
      focus: { marker: 'takern', distance: 24, pitch: 42 },
      reveal: { markers: ['takern', 'omberg'], regions: ['r-ostergot'] },
    },
    {
      id: 'n-12',
      title: 'The Ulvåsa-lady',
      narration:
        'A peasant asks the lady of Ulvåsa to tell his province’s future and ' +
        'will not be satisfied with anything she offers. At last she sees ' +
        'people digging from Motala to Mem, and smoke, and iron moving on ' +
        'water — and admits she cannot see past it. The canal is there on the ' +
        'map underneath.',
      focus: { marker: 'ulvasa', distance: 22, pitch: 44 },
      reveal: { markers: ['vadstena', 'motala', 'ulvasa'] },
    },
    {
      id: 'n-13',
      title: 'Karr and Grayskin',
      narration:
        'Over Kolmården, the book stops for its longest inserted story: a dog ' +
        'and an elk calf raised together, a betrayal neither of them ' +
        'understands at the time, and a forest fire that settles it. Nils ' +
        'listens the way he now listens to everything — as somebody small ' +
        'enough to be told things.',
      focus: { marker: 'kolmarden', distance: 28, pitch: 42 },
      reveal: { markers: ['kolmarden'] },
    },
    {
      id: 'n-14',
      title: 'The breaking up of the ice, and the flood',
      narration:
        'Spring comes up the country faster than the geese do. The ice goes ' +
        'out, Mälaren rises over its shores, and Nils spends a week ferrying ' +
        'squirrels, hares and field mice off islands that are getting smaller ' +
        'underneath them.',
      focus: { marker: 'malaren', distance: 28, pitch: 42 },
      reveal: { markers: ['malaren'], routes: ['malaren-leg'] },
      highlight: { markers: ['malaren'] },
    },
    {
      id: 'n-15',
      title: 'Stockholm, Skansen and Gorgo',
      narration:
        'The capital on its water, and above it Skansen, where farmhouses ' +
        'from every province in the country stand in rows and the animals are ' +
        'behind bars. Nils is caught there. Gorgo the eagle — Akka raised him ' +
        'from an eaglet — comes down and bends the bars.',
      focus: { marker: 'stockholm', distance: 22, pitch: 46 },
      reveal: { markers: ['stockholm', 'uppsala'] },
      highlight: { markers: ['stockholm'] },
    },
    {
      id: 'n-16',
      title: 'On over Norrland',
      narration:
        'One province a chapter, and each one emptier: Gästrikland’s iron ' +
        'works in forest clearings, a valley of painted farms in Hälsingland, ' +
        'sawmills and log rafts all down the Medelpad coast, and the high ' +
        'river country of Ångermanland where the land finally stands up.',
      focus: { marker: 'sundsvall', distance: 40, pitch: 40 },
      reveal: {
        markers: ['gastrikland', 'halsingland', 'sundsvall', 'angermanland'],
        routes: ['norrland'],
        regions: ['r-norrland'],
      },
    },
    {
      id: 'n-17',
      title: 'Westbottom, and two children walking',
      narration:
        'On the Västerbotten coast the geese meet Osa the goose girl and ' +
        'little Mats, walking north on foot to find their father at the mine. ' +
        'Everyone they ask tries to talk them out of it and tells them how ' +
        'far it is. They keep walking.',
      focus: { marker: 'vasterbotten', distance: 34, pitch: 40 },
      reveal: { markers: ['vasterbotten'] },
    },
    {
      id: 'n-18',
      title: 'Lapland',
      narration:
        'Akka takes Nils to Malmberget to see the ore mountain cut open, and ' +
        'then home to her own fell. Kebnekaise, Vassijaure, Sarjektjåkkå — ' +
        'the geese are named for the mountains they were hatched under, and ' +
        'this is where the whole journey has been going since March.',
      focus: { marker: 'kebnekaise', distance: 34, pitch: 40 },
      reveal: {
        markers: ['malmberget', 'kebnekaise', 'vassijaure'],
        routes: ['lapland'],
        regions: ['r-lapland'],
      },
      highlight: { markers: ['kebnekaise'] },
    },
    {
      id: 'n-19',
      title: 'With the Laplanders',
      narration:
        'Rain on a lake, a Sami camp, and Osa arriving at last looking for ' +
        'her brother. Ola Serka knows what has happened to him and takes a ' +
        'long time working out how to say it. The goslings hatch and learn to ' +
        'fly while the summer lasts, which is not long.',
      focus: { marker: 'lapp-camp', distance: 28, pitch: 42 },
      reveal: { markers: ['lapp-camp'] },
    },
    {
      id: 'n-20',
      title: 'Homeward bound',
      narration:
        'Down the western side in autumn — Härjedalen’s border forests, ' +
        'Värmland where the author was born, the great lake, Dalsland — so ' +
        'that the return trip covers a different third of the country from ' +
        'the way up. The school reader is still doing its job.',
      focus: { marker: 'varmland', distance: 40, pitch: 40 },
      reveal: {
        markers: ['harjedalen', 'varmland', 'vanern', 'dalsland'],
        routes: ['homeward'],
      },
    },
    {
      id: 'n-21',
      title: 'The treasure on the island',
      narration:
        'Akka turns the whole flock out over the West Sea to a cliff island ' +
        'where she once sheltered from a storm and found bags of gold in the ' +
        'sand. The geese have never had any use for it. Nils digs it up, and ' +
        'it goes to two children who walked to Lapland on foot.',
      focus: { marker: 'treasure-isle', distance: 30, pitch: 40 },
      reveal: { markers: ['treasure-isle'] },
      highlight: { markers: ['treasure-isle'] },
    },
    {
      id: 'n-22',
      title: 'Home at last',
      narration:
        'The elf’s terms were that Nils would be himself again on the day the ' +
        'white gander came home safely — and home is a farm with a kitchen ' +
        'table in it. He has spent the whole book making sure the gander ' +
        'survives, and the price of that is the one thing he cannot pay ' +
        'without losing him.',
      focus: { marker: 'home', distance: 20, pitch: 46 },
      reveal: { markers: ['home'], routes: ['last-leg'] },
      highlight: { markers: ['home'] },
    },
    {
      id: 'n-23',
      title: 'The parting with the wild geese',
      narration:
        'He is a boy again, full size, standing in the yard — and the geese ' +
        'are going over, and Akka is calling, and he cannot hear a word of ' +
        'it any more. That is the whole cost of the bargain, and Lagerlöf ' +
        'spends the last chapter on it rather than on the reward.',
      focus: { marker: 'vemmenhog', distance: 26, pitch: 44 },
      highlight: { markers: ['vemmenhog', 'home'] },
    },
  ],
}
