import type { Story } from '../types'
import luzonHeight from '../assets/luzon-height.png'

/**
 * Noli Me Tangere and El Filibusterismo — José Rizal's two novels, on the one
 * small stretch of Luzon they both happen in.
 *
 * WHAT THESE BOOKS ARE. Rizal wrote them in Spanish, in Europe, as a colonial
 * subject writing about his own country for readers in the country that held
 * it: the Noli finished in Berlin and printed there in 1887, El Filibusterismo
 * in Ghent in 1891. Both were banned in the Philippines and both were entered
 * against him at the trial that ended with his execution at Bagumbayan on 30
 * December 1896, aged thirty-five. Two years later the colony was gone. That
 * sequence is why these are not simply two novels; it is also why this world
 * puts the field he was shot in on the map.
 *
 * The narration paraphrases. Where it quotes, it quotes Charles Derbyshire's
 * public-domain English versions — The Social Cancer (1912) for the Noli and
 * The Reign of Greed (1912) for El Filibusterismo — and says so each time.
 * Derbyshire is a hundred-year-old translation and reads like one; it is used
 * because it is the one that can be quoted, not because it is the best.
 *
 * SAN DIEGO IS NOT A PLACE. It is the town both novels are largely set in and
 * it is invented — but Rizal built it out of Calamba, his own town on the south
 * shore of Laguna de Bay, down to the friar estate whose rent dispute with the
 * tenants is the Ibarra family's dispute and was in real life his family's.
 * Readers have placed San Diego at Calamba for a century and this map does the
 * same, with the pin on Calamba and the name given as both.
 *
 * Padre Florentino's house, where El Filibusterismo ends, is placed the same
 * way. The book says only that it stands on the Pacific coast, on a cliff
 * "hundreds of feet" above the water; the pin is where that coast comes nearest
 * the rest of the story, on the Quezon shore facing Lamon Bay.
 *
 * NO NAMED RIVER, and the Pasig is the reason. Half of El Filibusterismo's
 * opening is a steamer working up it, and it is not drawn here: Natural Earth's
 * 10m centrelines — the source every other river in this atlas comes from —
 * carry nothing at all in the Philippines, and the Pasig is 25 km long, which
 * is under two pixels of this map. So the route "Up the Pasig" is a line of
 * travel and not a river, and the only water drawn on this map is Manila Bay,
 * the Pacific, Laguna de Bay and Lake Taal, which come from the lake and ocean
 * data rather than from a course anyone traced.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 119.8) / 1.3 − 1      map z = (15.4 − lat) / 1.1 − 1
 */
export const noli: Story = {
  id: 'noli',
  title: 'Noli Me Tangere',
  subtitle: 'Rizal’s two novels, and the ground they cost him',
  author: 'José Rizal',
  region: 'Spanish Philippines',
  epoch: 'Published 1887 & 1891',
  group: 'epic',
  earth: { lon: 120.9757, lat: 14.5895, place: 'Manila & Laguna de Bay' },
  intro:
    'A young man comes home from seven years in Europe meaning to build a ' +
    'school, and discovers what his country actually is. Press ▶ Play story ' +
    'to follow both novels across the same forty miles of Luzon — Binondo, the ' +
    'lake, San Diego, and the field outside the walls where the book’s author ' +
    'was shot nine years after he finished the second one.',
  surfaceName: 'Luzon',
  ambient: {
    // Lowland tropical: dense along the lake and up Makiling, thin over the
    // rice plain, and the Sierra Madre solid with it.
    trees: 0.62,
    treeColor: '#2f6b3c',
    birds: 6,
    fish: 3,
    // The Noli opens in December and El Filibusterismo on a December morning,
    // which in Luzon is the dry season. No rain layer.
  },
  terrain: {
    music: {
      // An original. The obvious choice would have been a kundiman — the
      // Tagalog song form these novels are contemporary with, minor-key and
      // pleading and turning to the major at the end — and this atlas does not
      // ship a named tune it has not read the notation of. So the SHAPE is
      // borrowed and no kundiman is transcribed: D minor throughout, and the
      // last phrase turning to D major, which is the one thing every kundiman
      // does.
      title: 'For the fatherland',
      credit: 'Original — no kundiman is transcribed here',
      melody:
        'D4:2 F4:1 A4:2 A4:1 ' +
        'G4:2 F4:1 E4:2 D4:1 ' +
        'A4:2 C5:1 D5:2 C5:1 ' +
        'A4:3 F4:3 ' +
        'D5:2 A4:1 B4:2 A4:1 ' +
        'F#4:2 E4:1 D4:3',
      bass: 'D3:6 Bb2:6 F2:6 A2:6 G2:6 D3:6',
      tempo: 54,
      voice: 'harp',
      mood: 'calm',
    },
    seed: 'noli-1', // unused: the heightmap takes precedence
    heightmap: luzonHeight,
    // Printed by scripts/build-heightmap.mjs for the `luzon` preset.
    seaLevel: 0.0093,
    // 281 km across by 245 km down.
    aspect: 1.145,
    // Makiling and the Sierra Madre are the horizon of a story that happens at
    // sea level, so a little exaggeration earns its keep — but only a little,
    // because this is a map of a plain.
    heightScale: 13,
    rivers: 0,
    biomes: [
      { maxHeight: 0.0093, color: '#2d5b78', name: 'Sea & lake' },
      { maxHeight: 0.055, color: '#5f7a4a', name: 'Rice plain' },
      { maxHeight: 0.16, color: '#4d6b3c', name: 'Lakeshore towns' },
      { maxHeight: 0.42, color: '#3d5c33', name: 'Forested hills' },
      { maxHeight: 0.78, color: '#6a6a4e', name: 'The cordilleras' },
      { maxHeight: 1, color: '#8f8a72', name: 'Makiling & Banahaw' },
    ],
    waterColor: '#33718f',
  },

  markers: [
    {
      id: 'binondo',
      name: 'Binondo & the Escolta',
      kind: 'city',
      at: { x: -0.0962, z: -0.2736 },
      description:
        'The trading quarter across the river from the walled city, and where ' +
        'both novels start their social life. Capitán Tiago’s house stands on ' +
        'Calle Anloague, fronting the arm of the Pasig the neighbourhood calls ' +
        'the Binondo River; the dinner there in the first chapter of the Noli ' +
        'is where Ibarra learns, from a stranger making conversation, that his ' +
        'father died in prison. Thirteen years later Simoun the jeweller keeps ' +
        'his shop a few streets away, and the wedding feast he means to blow ' +
        'up is on the Escolta. Rizal spends most of a page on that arm of the ' +
        'river, which the district uses at once as bath, sewer, laundry, ' +
        'fishery, road and — if the water-carrier finds it convenient — ' +
        'drinking water.',
    },
    {
      id: 'bagumbayan',
      name: 'Intramuros & Bagumbayan',
      kind: 'capital',
      at: { x: -0.0946, z: -0.2600 },
      description:
        'The walled city — the Captain-General, the archbishop, the orders, ' +
        'the courts, and the convent of Santa Clara that María Clara is put ' +
        'into and never leaves — and, immediately outside the wall, the open ' +
        'ground of Bagumbayan. Gomez, Burgos and Zamora were garrotted there ' +
        'in 1872, which is the event standing behind both novels and the one ' +
        'El Filibusterismo is dedicated to. Rizal himself was shot on the same ' +
        'field on 30 December 1896. One marker, because the wall and the field ' +
        'are a few hundred metres apart and this map cannot separate them.',
    },
    {
      id: 'manila-bay',
      name: 'Manila Bay',
      kind: 'port',
      at: { x: -0.2692, z: -0.1818 },
      description:
        'The way in and the way out. Ibarra comes home across it at the start ' +
        'of the Noli after seven years in Europe, and every ship in either ' +
        'book — the mail, the exiles going to the Carolinas, the vessel Simoun ' +
        'keeps ready — moves through this water.',
    },
    {
      id: 'cavite',
      name: 'Cavite',
      kind: 'port',
      at: { x: -0.1546, z: -0.1627 },
      description:
        'The naval arsenal across the bay, and the reason there are two novels ' +
        'rather than one. In January 1872 the workers here mutinied over the ' +
        'loss of their exemptions; the government treated it as the edge of a ' +
        'national conspiracy, and three secular priests who had campaigned for ' +
        'Filipino parishes were executed for it. Rizal was ten. Everything ' +
        'after that in these books is downstream of that month.',
    },
    {
      id: 'antipolo',
      name: 'Antipolo',
      kind: 'landmark',
      at: { x: 0.0585, z: -0.2600 },
      description:
        'The pilgrimage town in the hills above the Pasig, and the shrine of ' +
        'the Virgin that the whole of Manila goes up to in May. Both novels ' +
        'use it as the place vows are made and paid, and the road to it as the ' +
        'one occasion when the town and the country are in the same procession.',
    },
    {
      id: 'laguna',
      name: 'Laguna de Bay',
      kind: 'landmark',
      at: { x: 0.1154, z: -0.0909 },
      description:
        'The lake at the end of the river: nine hundred square kilometres of ' +
        'shallow water with the towns of both novels around its rim. El ' +
        'Filibusterismo opens on it, or rather on the way to it — the steamer ' +
        'Tabo working up the Pasig with the whole colony aboard in miniature, ' +
        'friars and officials on the upper deck and everyone else below.',
    },
    {
      id: 'calamba',
      name: 'San Diego (Calamba)',
      kind: 'town',
      at: { x: 0.0502, z: 0.0803 },
      description:
        'The town both books are really about, invented and built out of this ' +
        'one. The schoolhouse Ibarra wants to put up, the derrick that nearly ' +
        'kills him at the laying of its cornerstone, the sermon, the fiesta, ' +
        'the friar estate whose rents are raised until the tenants cannot pay ' +
        '— all of it is here, and the rent dispute was the Rizal family’s own. ' +
        'They were evicted from Calamba in 1891, the year El Filibusterismo ' +
        'was printed.',
    },
    {
      id: 'binan',
      name: 'Biñan',
      kind: 'town',
      at: { x: -0.0154, z: -0.0364 },
      description:
        'The next town along the lakeshore road, where Rizal was sent at nine ' +
        'to a schoolmaster who beat the class daily and where he learned what ' +
        'colonial schooling was for. The classroom in the novels — Latin ' +
        'recited without meaning, and a teacher forbidden to explain — is this ' +
        'one, reported.',
    },
    {
      id: 'losbanos',
      name: 'Los Baños',
      kind: 'town',
      at: { x: 0.1092, z: 0.1182 },
      description:
        'The hot springs under Makiling, and where the Captain-General goes ' +
        'to shoot and take the waters. In El Filibusterismo the whole ' +
        'machinery of the colony follows him there: the students’ petition for ' +
        'a Spanish academy is decided in a lakeside house by men playing ' +
        'cards, and Simoun is at the table.',
    },
    {
      id: 'makiling',
      name: 'Mount Makiling',
      kind: 'peak',
      at: { x: 0.0731, z: 0.1545 },
      description:
        'The dormant volcano over Calamba, 1,090 m, wooded to the top, and in ' +
        'both books the place the law does not reach. Men who lose everything ' +
        'to the courts go up into country like this and come back as tulisanes ' +
        '— which is what happens to Cabesang Tales, whose land is taken while ' +
        'he is in the hills guarding it.',
    },
    {
      id: 'sierra-madre',
      name: 'The Sierra Madre',
      kind: 'forest',
      at: { x: 0.3462, z: -0.4091 },
      description:
        'The range down the eastern side of Luzon, unbroken forest for six ' +
        'hundred kilometres and the country the bandits, the fugitives and ' +
        'eventually the revolution live in. Neither novel goes into it and ' +
        'both books know it is there.',
    },
    {
      id: 'tayabas',
      name: 'Tayabas',
      kind: 'town',
      at: { x: 0.3785, z: 0.2500 },
      description:
        'The province behind the mountains, between the lake country and the ' +
        'Pacific — the last inhabited ground on the road Simoun is carried ' +
        'along when the second plot fails and he has to get out of Manila.',
    },
    {
      id: 'pacific',
      name: 'Padre Florentino’s house',
      kind: 'landmark',
      at: { x: 0.6308, z: 0.2682 },
      description:
        'Where El Filibusterismo ends: a house on a cliff over the Pacific, ' +
        'belonging to a Filipino secular priest who gave up a rich parish in ' +
        '1872 rather than be noticed. Simoun dies in an upstairs room having ' +
        'told him everything, and the priest takes the case of jewels that ' +
        'paid for all of it and throws it off the cliff. The novel names only ' +
        '“the Pacific coast”, so this pin is where that coast comes nearest ' +
        'the rest of the story.',
    },
  ],

  routes: [
    {
      id: 'ibarras-return',
      name: 'Ibarra comes home',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.2692, z: -0.1818 },
        { x: -0.1800, z: -0.2300 },
        { x: -0.0962, z: -0.2736 },
        { x: -0.0946, z: -0.2600 },
      ],
      description:
        'Across the bay, up the river to Binondo, and into the walled city. ' +
        'Seven years in Europe and a fortune behind him; by the end of the ' +
        'week he has been told his father died in prison, that the body was ' +
        'dug up on a priest’s orders, and that the man who ordered it is the ' +
        'one who will be marrying him.',
    },
    {
      id: 'up-the-pasig',
      name: 'Up the Pasig to La Laguna',
      style: 'solid',
      color: '#9ec8e8',
      points: [
        { x: -0.0962, z: -0.2736 },
        { x: -0.0300, z: -0.2400 },
        { x: 0.0300, z: -0.1900 },
        { x: 0.1154, z: -0.0909 },
        { x: 0.0502, z: 0.0803 },
      ],
      description:
        'Twenty-five kilometres of river and then the lake — the first chapter ' +
        'of El Filibusterismo, and the way everybody in either book gets ' +
        'between Manila and the towns. Drawn as a line of travel rather than ' +
        'as water: at this map’s scale the Pasig is under two pixels wide and ' +
        'is genuinely not in the elevation data.',
    },
    {
      id: 'the-lakeshore',
      name: 'The lakeshore road',
      style: 'solid',
      color: '#c98f5c',
      points: [
        { x: -0.0154, z: -0.0364 },
        { x: 0.0502, z: 0.0803 },
        { x: 0.0731, z: 0.1545 },
        { x: 0.1092, z: 0.1182 },
      ],
      description:
        'Biñan, Calamba, the mountain above it, and Los Baños — the south ' +
        'shore of the lake, which is San Diego’s whole world and was Rizal’s ' +
        'until he was eleven.',
    },
    {
      id: 'the-pilgrim-road',
      name: 'The pilgrim road to Antipolo',
      style: 'dashed',
      color: '#d9b6e0',
      points: [
        { x: -0.0962, z: -0.2736 },
        { x: -0.0200, z: -0.2820 },
        { x: 0.0585, z: -0.2600 },
      ],
      description:
        'Up to the shrine in the hills, which in May is the one road in the ' +
        'colony that everybody is on at once. Dashed, because the books use it ' +
        'as an occasion rather than as a journey.',
    },
    {
      id: 'across-the-bay',
      name: 'Across to Cavite',
      style: 'dashed',
      color: '#8fb6c9',
      points: [
        { x: -0.0946, z: -0.2600 },
        { x: -0.1300, z: -0.2100 },
        { x: -0.1546, z: -0.1627 },
      ],
      description:
        'The short crossing to the arsenal. Nobody in either novel makes this ' +
        'trip: it is the road the year 1872 came along, and both books are ' +
        'still standing in its light twenty years later.',
    },
    {
      id: 'the-last-road',
      name: 'Out to the Pacific',
      style: 'solid',
      color: '#b46a8f',
      points: [
        { x: 0.0585, z: -0.2600 },
        { x: 0.3462, z: -0.4091 },
        { x: 0.3785, z: 0.2500 },
        { x: 0.6308, z: 0.2682 },
      ],
      description:
        'The end of El Filibusterismo. The second attempt fails, Simoun is ' +
        'recognised, and he is carried east out of the lake country, over the ' +
        'Sierra Madre and through Tayabas to a priest’s house on the far ' +
        'coast, where he takes poison and talks until he dies.',
    },
  ],

  regions: [
    { id: 'manila-region', name: 'Manila', at: { x: -0.14, z: -0.36 }, scale: 0.6 },
    { id: 'la-laguna', name: 'La Laguna', at: { x: 0.22, z: 0.02 }, scale: 0.65 },
    { id: 'the-cordillera', name: 'The Sierra Madre', at: { x: 0.44, z: -0.55 }, scale: 0.55 },
    { id: 'tayabas-region', name: 'Tayabas & the Pacific', at: { x: 0.60, z: 0.46 }, scale: 0.5 },
  ],

  elements: [
    {
      id: 'the-fortune',
      name: 'The Ibarra fortune',
      glyph: '◆',
      description:
        'Land at San Diego, first — the estate the lawsuit is about. Ibarra is ' +
        'excommunicated, arrested, reported shot on the Pasig, and thirteen ' +
        'years later a man nobody recognises comes back with the same money in ' +
        'the form of a case of jewels, and spends it on buying officials, ' +
        'making the government worse on purpose, and building a bomb. The case ' +
        'ends up on the sea floor.',
      journey: [
        { marker: 'calamba', note: 'Land, and the friars’ suit over it.' },
        {
          marker: 'binondo',
          sinceChapter: 6,
          note: 'Back as jewels, in the shop of Simoun the trader.',
        },
        {
          marker: 'pacific',
          sinceChapter: 11,
          note: 'Thrown off the cliff by Padre Florentino.',
        },
      ],
    },
    {
      id: 'maria-clara',
      name: 'María Clara',
      glyph: '✿',
      description:
        'Capitán Tiago’s daughter, promised to Ibarra, and the one character ' +
        'both novels keep taking things from. She surrenders his letters under ' +
        'threat, which is what convicts him; she is married off; she takes ' +
        'vows at Santa Clara inside the walls instead. El Filibusterismo ' +
        'reports her death there in a single sentence, and it is that sentence ' +
        'that ends Simoun’s patience.',
      journey: [
        { marker: 'binondo', note: 'The dinner on Calle Anloague.' },
        { marker: 'calamba', sinceChapter: 1, note: 'Home to San Diego.' },
        {
          marker: 'bagumbayan',
          sinceChapter: 5,
          note: 'The convent of Santa Clara, and no further.',
        },
      ],
    },
  ],

  books: [
    {
      id: 'noli-me-tangere',
      title: 'Noli Me Tangere',
      subtitle: 'Berlin, 1887',
      chapters: [
        {
          id: 'a-gathering',
          title: 'A Gathering in Binondo',
          narration:
            'Capitán Tiago gives a dinner and half of Manila invites itself. ' +
            'Crisóstomo Ibarra is back from seven years in Europe, meaning to ' +
            'be useful; at the table a friar mentions, as a piece of news, ' +
            'that Ibarra’s father died in prison and was dug up again ' +
            'afterwards. The book’s title is the line the risen Christ says to ' +
            'Mary Magdalene — touch me not — and Rizal takes it as a diagnosis.',
          quote: {
            text:
              'Recorded in the history of human sufferings is a cancer of so ' +
              'malignant a character that the least touch irritates it and ' +
              'awakens in it the sharpest pains.',
            source:
              'Dedication, “To My Fatherland” · The Social Cancer, trans. ' +
              'Charles Derbyshire, 1912',
          },
          focus: { marker: 'binondo', distance: 24 },
          reveal: {
            markers: ['binondo', 'bagumbayan', 'manila-bay'],
            routes: ['ibarras-return'],
            regions: ['manila-region'],
          },
        },
        {
          id: 'to-san-diego',
          title: 'To San Diego',
          narration:
            'Up the river and across the lake to the town his family comes ' +
            'from. Ibarra wants to build a school, and everyone he explains it ' +
            'to agrees warmly and does nothing, except the friars, who begin ' +
            'to work out what a school run by somebody else would mean. He ' +
            'also finds out where his father’s body went.',
          focus: { marker: 'calamba', distance: 28 },
          reveal: {
            markers: ['laguna', 'calamba', 'binan'],
            routes: ['up-the-pasig', 'the-lakeshore'],
            regions: ['la-laguna'],
          },
        },
        {
          id: 'the-lake',
          title: 'The Picnic on the Lake',
          narration:
            'A day out on the water: bancas, a fishing corral, a crocodile in ' +
            'the trap, and a pilot nobody has looked at properly who goes in ' +
            'after it with a bolo. That is Elías, and the rest of the book is ' +
            'the argument between him and Ibarra — reform or revolt — which ' +
            'the book refuses to settle.',
          focus: { marker: 'laguna', distance: 30 },
          reveal: { markers: ['losbanos', 'makiling'], regions: ['the-cordillera'] },
        },
        {
          id: 'the-cornerstone',
          title: 'The Cornerstone',
          narration:
            'The schoolhouse is begun with a ceremony, a sermon and a derrick. ' +
            'The block comes down into the trench at the moment Ibarra is ' +
            'standing in it, and the man who dies instead is the one who ' +
            'rigged it. Nobody is charged. Ibarra keeps building.',
          focus: { marker: 'calamba', distance: 22 },
          reveal: { markers: ['antipolo'], routes: ['the-pilgrim-road'] },
        },
        {
          id: 'the-uprising',
          title: 'The Uprising That Was Not One',
          narration:
            'A revolt is arranged so that it can be put down. Men are paid to ' +
            'attack the barracks, the guards are waiting, and the plan is ' +
            'traced back to Ibarra with a letter he wrote years before to ' +
            'María Clara — surrendered by her, under pressure, to keep her ' +
            'father out of it. Excommunicated in the morning, in the cells by ' +
            'the evening.',
          focus: { marker: 'bagumbayan', distance: 20 },
          reveal: { markers: ['cavite'], routes: ['across-the-bay'] },
        },
        {
          id: 'down-the-pasig',
          title: 'Down the Pasig',
          narration:
            'Elías gets him out of the cells and onto a banca, and the guards ' +
            'come after them down the river. Elías goes over the side to draw ' +
            'the fire and is shot in the water; the government reports Ibarra ' +
            'dead. María Clara, given the choice of a husband or the convent, ' +
            'takes the convent. The Noli ends there and settles nothing, which ' +
            'is why there is a second book.',
          focus: { marker: 'binondo', distance: 26 },
          reveal: { markers: ['sierra-madre'] },
          highlight: { routes: ['up-the-pasig'] },
        },
      ],
    },
    {
      id: 'el-filibusterismo',
      title: 'El Filibusterismo',
      subtitle: 'Ghent, 1891',
      chapters: [
        {
          id: 'the-tabo',
          title: 'On the Upper Deck',
          narration:
            'Thirteen years later, a December morning, and the steamer Tabo is ' +
            'labouring up the Pasig with the colony aboard in miniature — ' +
            'friars and officials above, everybody else on the lower deck with ' +
            'the cargo. Among the passengers is Simoun, a jeweller with an ' +
            'unplaceable accent and the ear of the Captain-General. He is ' +
            'Ibarra.',
          quote: {
            text:
              'If a person were only reasonably considerate, she might even ' +
              'have been taken for the Ship of State, constructed, as she had ' +
              'been, under the inspection of Reverendos and Ilustrísimos.',
            source:
              'Ch. I, “On the Upper Deck” · The Reign of Greed, trans. Charles ' +
              'Derbyshire, 1912',
          },
          focus: { marker: 'laguna', distance: 32 },
          highlight: { routes: ['up-the-pasig'] },
        },
        {
          id: 'los-banos',
          title: 'The Game at Los Baños',
          narration:
            'The Captain-General is at the hot springs, and so is everyone ' +
            'who wants something. The students have petitioned for an academy ' +
            'where Spanish could actually be taught; the question is settled ' +
            'over cards by men who have not read it. Simoun’s whole method is ' +
            'here: make the government worse, not better, and it will do the ' +
            'work itself.',
          focus: { marker: 'losbanos', distance: 22 },
          highlight: { markers: ['losbanos'] },
        },
        {
          id: 'cabesang-tales',
          title: 'Cabesang Tales',
          narration:
            'A tenant clears forest, pays rent on it, and is charged more ' +
            'each year until he goes to law. He loses, because the other side ' +
            'is the order that owns the court’s goodwill. He has a gun and no ' +
            'land left, and he goes up into the hills — and this is the whole ' +
            'argument of both novels compressed into one man’s year.',
          focus: { marker: 'makiling', distance: 26 },
          highlight: { markers: ['makiling', 'sierra-madre'] },
        },
        {
          id: 'the-lamp',
          title: 'The Lamp',
          narration:
            'A wedding on the Escolta, and Simoun’s gift to the house is a ' +
            'pomegranate lamp with nitroglycerine in the reservoir: when the ' +
            'wick burns down, the government of the islands goes up with the ' +
            'dining room. Isagani, who has been thrown over by the bride and ' +
            'has nothing left to lose, climbs in through a window and throws ' +
            'the lamp into the river.',
          focus: { marker: 'binondo', distance: 20 },
          highlight: { markers: ['binondo'] },
        },
        {
          id: 'bagumbayan-chapter',
          title: 'Bagumbayan',
          narration:
            'The round-up afterwards: students, printers, anyone whose name ' +
            'was on a list. Basilio — the boy from the Noli, now nearly a ' +
            'doctor — goes to the cells, and the executions are held on the ' +
            'open field outside the wall, where the priests of 1872 were ' +
            'killed and where Rizal himself would be shot five years after ' +
            'writing this.',
          quote: {
            text:
              'let these pages serve as a tardy wreath of dried leaves over ' +
              'your unknown tombs, and let it be understood that every one who ' +
              'without clear proofs attacks your memory stains his hands in ' +
              'your blood!',
            source:
              'Dedication, to Gomez, Burgos and Zamora · The Reign of Greed, ' +
              'trans. Charles Derbyshire, 1912',
          },
          focus: { marker: 'bagumbayan', distance: 18 },
          highlight: { markers: ['bagumbayan'] },
        },
        {
          id: 'the-pacific',
          title: 'The Pacific',
          narration:
            'Simoun, poisoned and hunted, is carried east over the mountains ' +
            'to the house of Padre Florentino above the sea, and tells him the ' +
            'whole of it. The priest’s answer is that a country is not freed ' +
            'by making it worse, and that the means are the thing. Then he ' +
            'takes the case of jewels down to the cliff and throws it in.',
          quote: {
            text:
              'Where are the youth who will consecrate their golden hours, ' +
              'their illusions, and their enthusiasm to the welfare of their ' +
              'native land?',
            source:
              'Ch. XXXIX, “Conclusion” · The Reign of Greed, trans. Charles ' +
              'Derbyshire, 1912',
          },
          focus: { marker: 'pacific', distance: 30 },
          reveal: {
            markers: ['tayabas', 'pacific'],
            routes: ['the-last-road'],
            regions: ['tayabas-region'],
          },
        },
      ],
    },
  ],
}
