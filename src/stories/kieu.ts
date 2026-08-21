import type { Story } from '../types'
import kieuHeight from '../assets/kieu-height.png'

/**
 * Truyện Kiều — Vietnam's national poem, which is set entirely in China.
 *
 * THAT IS THE FIRST THING TO SAY, because a map has to deal with it. Nguyễn Du
 * wrote 3,254 lines of lục bát — the six-eight couplet of Vietnamese folk verse
 * — in the vernacular Nôm script, around 1813–20, and every Vietnamese schoolkid
 * can recite the opening. Not one scene happens in Vietnam. The plot is taken
 * from a minor seventeenth-century Chinese novel, *Jin Yun Qiao zhuan*, and
 * keeps its Ming setting: Bắc Kinh, Lâm Truy, Vô Tích, Hàng Châu, the Tiền
 * Đường. So this world holds both countries, because the poem is Vietnamese and
 * the story is Chinese and neither half is optional.
 *
 * What joins them on the map is a road that was really travelled. In 1813
 * Nguyễn Du led the tribute embassy from Thăng Long to Beijing, out through the
 * Nam Quan gate and up through Guangxi, Hunan and the Yangtze crossing at
 * Wuchang — and wrote the *Bắc hành tạp lục*, 132 poems, on the way. That road
 * runs the length of this map, and the poem's own road starts where it ends.
 *
 * WHERE THE TEXT CAME FROM, and why there are two. Vietnamese Wikisource
 * carries both a modern standard text and Nguyễn Quảng Tuân's transcription of
 * the Liễu Văn Đường woodblock of 1866 — the oldest surviving printing, from
 * the Nôm Foundation's scans. Every line quoted here was checked in BOTH, which
 * is this codebase's rule for anything it claims a source for, and the check
 * earns its keep: line 4 is "mà đau đớn lòng" in the modern text and "đã đau
 * đớn lòng" in 1866, so it is not quoted. The three couplets that are quoted
 * are word-for-word identical in the two editions.
 *
 * The English under each is a rendering made for this atlas and labelled as
 * one. Huỳnh Sanh Thông's translation is the one to read and it is in copyright;
 * the public-domain alternative is Abel des Michels' French of 1884–85, which is
 * prose. Nothing here is passed off as a translator's work.
 *
 * THREE RIVERS, AND THE THIRD TOOK A FIX TO THE MAP. The Red River is drawn and
 * Thăng Long stands on it; the Yangtze is drawn and the embassy's crossing at
 * Wuchang stands on it. The Tiền Đường — the river Kiều throws herself into,
 * which the poem names twenty lines before the end of her suffering — shipped
 * once as a river this atlas could not draw, and the reason turned out to be the
 * elevation data rather than the river data.
 *
 * Both public-domain hydrographic sources end the course at Hangzhou at the same
 * point, 120.149E 30.196N (Natural Earth files it as the Fuchun; WDBII stops at
 * 120.146E 30.196N). That is not them stopping short: GSHHG's high-resolution
 * shoreline puts a coastline vertex 0.4 km from it, because Hangzhou Bay reaches
 * the city. Terrarium disagrees — sampled at z10 it reads +8 to +11 m the whole
 * way across and along the estuary — so this map drew fifty-five kilometres of
 * sea as farmland, and a river ending at the coast looked like a river stopping
 * in a field. The heightmap builder now lets the shoreline overrule the DEM
 * below 20 m (`coastM`), the bay is on the map, and the river ends in it.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 103.5) / 10.5 − 1      map z = (42.6 − lat) / 12.4 − 1
 */
export const kieu: Story = {
  id: 'kieu',
  title: 'The Tale of Kiều',
  subtitle: 'A Vietnamese poem, and the Chinese road it walks',
  author: 'Nguyễn Du',
  region: 'Đại Việt & Ming China',
  epoch: 'Written c. 1813–20',
  group: 'epic',
  earth: { lon: 105.85, lat: 21.03, place: 'Thăng Long (Hanoi)' },
  intro:
    'A girl sells herself to buy her father out of prison, and spends fifteen ' +
    'years being sold on. Press ▶ Play story to follow two roads across one ' +
    'map: the embassy road Nguyễn Du rode north in 1813, and the road his ' +
    'heroine is dragged along from Beijing to the river at Hangzhou.',
  surfaceName: 'Đại Việt & the Ming',
  ambient: {
    trees: 0.4,
    treeColor: '#3d6b42',
    birds: 6,
    fish: 3,
  },
  terrain: {
    music: {
      // An original, and the structure is the point. Vietnamese verse here is
      // lục bát — a six-syllable line answered by an eight-syllable line, over
      // and over for three thousand couplets — so the tune alternates a
      // six-beat phrase with an eight-beat one, four phrases to the loop. The
      // scale is a five-note one with no semitone in it. No Vietnamese melody
      // is transcribed: this atlas ships a named tune only when its notation
      // has been read, and none was read here.
      title: 'Six and eight',
      credit: 'Original — no Vietnamese melody is transcribed here',
      melody:
        'A4:1 C5:1 D5:1 C5:1 A4:1 G4:1 ' +
        'E4:1 G4:1 A4:2 C5:1 A4:1 G4:1 E4:1 ' +
        'A4:1 C5:2 D5:1 E5:2 ' +
        'D5:1 C5:1 A4:2 G4:2 E4:1 A4:1',
      bass: 'A2:6 F2:8 D3:6 E2:8',
      tempo: 52,
      voice: 'harp',
      mood: 'calm',
    },
    seed: 'kieu-1', // unused: the heightmap takes precedence
    heightmap: kieuHeight,
    // Printed by scripts/build-heightmap.mjs for the `kieu` preset.
    seaLevel: 0.0076,
    // 2,020 km across by 2,761 km down — taller than it is wide, because the
    // two roads on it run north and south.
    aspect: 0.7317,
    // Every place in this poem is lowland; the relief is the frame round them.
    heightScale: 9,
    overhead: true,
    rivers: 0,
    /**
     * The Red River and the Yangtze, both of them roads rather than scenery:
     * Thăng Long stands on the first, and the 1813 embassy crossed the second
     * at Wuchang. Each is the `marker` of the place that stands on it, so
     * `check-rivers` holds the town to the water rather than to a separate pin
     * for the river.
     *
     * Only the LOWER Yangtze is here. Natural Earth splits the river into two
     * differently-named features — "Chang Jiang" above Yueyang and "Yangtze"
     * below it — and the upper one is left off because nothing in either road
     * touches the river west of the crossing.
     *
     * The Tiền Đường is filed under "Fuchun", the name of its middle course
     * above Hangzhou; it is the same water. See the header note for why it took
     * a change to the heightmap before it could be drawn.
     *
     * Source: Natural Earth 10m river centrelines (public domain), via
     * `scripts/build-river.mjs kieu Hong | Yangtze | Fuchun`.
     */
    namedRivers: [
      {
        name: 'Sông Hồng, the Red River',
        marker: 'thang-long',
        points: [
          { x: -0.9981, z: 0.5879 }, { x: -0.9785, z: 0.6035 }, { x: -0.9651, z: 0.6149 },
          { x: -0.9475, z: 0.6271 }, { x: -0.9312, z: 0.6386 }, { x: -0.9172, z: 0.6490 },
          { x: -0.8960, z: 0.6646 }, { x: -0.8822, z: 0.6745 }, { x: -0.8695, z: 0.6850 },
          { x: -0.8525, z: 0.7014 }, { x: -0.8397, z: 0.7139 }, { x: -0.8216, z: 0.7170 },
          { x: -0.8092, z: 0.7283 }, { x: -0.7897, z: 0.7309 }, { x: -0.7723, z: 0.7407 },
          { x: -0.7704, z: 0.7557 }, { x: -0.7593, z: 0.7674 }, { x: -0.7459, z: 0.7785 },
          { x: -0.7353, z: 0.7909 }, { x: -0.7191, z: 0.7994 }, { x: -0.7142, z: 0.7984 },
        ],
      },
      {
        name: 'Sông Tiền Đường, the Qiantang',
        marker: 'hang-chau',
        points: [
          { x: 0.3605, z: 0.0397 }, { x: 0.3787, z: 0.0423 }, { x: 0.3901, z: 0.0450 },
          { x: 0.4071, z: 0.0417 }, { x: 0.4169, z: 0.0354 }, { x: 0.4284, z: 0.0409 },
          { x: 0.4444, z: 0.0383 }, { x: 0.4577, z: 0.0418 }, { x: 0.4705, z: 0.0470 },
          { x: 0.4836, z: 0.0534 }, { x: 0.4948, z: 0.0562 }, { x: 0.5092, z: 0.0550 },
          { x: 0.5242, z: 0.0534 }, { x: 0.5333, z: 0.0470 }, { x: 0.5386, z: 0.0347 },
          { x: 0.5477, z: 0.0266 }, { x: 0.5585, z: 0.0200 }, { x: 0.5662, z: 0.0131 },
          { x: 0.5831, z: 0.0094 }, { x: 0.5844, z: 0.0004 }, { x: 0.5856, z: 0.0003 },
        ],
      },
      {
        name: 'The Yangtze',
        marker: 'wuchang',
        points: [
          { x: -0.0831, z: 0.0595 }, { x: -0.0557, z: 0.0351 }, { x: -0.0390, z: 0.0258 },
          { x: -0.0198, z: 0.0215 }, { x: 0.0042, z: 0.0097 }, { x: -0.0120, z: 0.0012 },
          { x: 0.0082, z: -0.0095 }, { x: 0.0230, z: -0.0240 }, { x: 0.0337, z: -0.0368 },
          { x: 0.0539, z: -0.0317 }, { x: 0.0768, z: -0.0336 }, { x: 0.0803, z: -0.0184 },
          { x: 0.1003, z: -0.0136 }, { x: 0.1133, z: -0.0007 }, { x: 0.1267, z: 0.0147 },
          { x: 0.1394, z: 0.0265 }, { x: 0.1624, z: 0.0274 }, { x: 0.1799, z: 0.0378 },
          { x: 0.2010, z: 0.0334 }, { x: 0.2244, z: 0.0276 }, { x: 0.2427, z: 0.0198 },
          { x: 0.2658, z: 0.0088 }, { x: 0.2768, z: -0.0057 }, { x: 0.2842, z: -0.0219 },
          { x: 0.3057, z: -0.0253 }, { x: 0.3168, z: -0.0399 }, { x: 0.3369, z: -0.0436 },
          { x: 0.3554, z: -0.0544 }, { x: 0.3584, z: -0.0693 }, { x: 0.3779, z: -0.0726 },
          { x: 0.3917, z: -0.0849 }, { x: 0.4110, z: -0.0894 }, { x: 0.4141, z: -0.1055 },
          { x: 0.4205, z: -0.1209 }, { x: 0.4319, z: -0.1358 }, { x: 0.4447, z: -0.1483 },
          { x: 0.4559, z: -0.1607 }, { x: 0.4788, z: -0.1630 }, { x: 0.5002, z: -0.1613 },
          { x: 0.5243, z: -0.1645 }, { x: 0.5339, z: -0.1610 },
        ],
      },
    ],
    biomes: [
      { maxHeight: 0.0076, color: '#2e5f7c', name: 'Sea' },
      { maxHeight: 0.06, color: '#5f7c4a', name: 'The deltas' },
      { maxHeight: 0.16, color: '#4f6d3c', name: 'Plains' },
      { maxHeight: 0.38, color: '#6b7248', name: 'Hills' },
      { maxHeight: 0.7, color: '#7c7561', name: 'Uplands' },
      { maxHeight: 1, color: '#b9b6a6', name: 'The western wall' },
    ],
    waterColor: '#33718f',
  },

  markers: [
    {
      id: 'tien-dien',
      name: 'Tiên Điền',
      kind: 'town',
      at: { x: -0.7838, z: 0.9306 },
      description:
        'Nguyễn Du’s village in Nghi Xuân, Hà Tĩnh — a family that had given ' +
        'the Lê court three chancellors and lost everything when the Tây Sơn ' +
        'came through. He spent about ten years here with no post and no ' +
        'money, hunting and reading, and called himself the Hunter of the ' +
        'Southern Sea. Everything in the poem about being suddenly and ' +
        'completely déclassé comes from those years.',
    },
    {
      id: 'thang-long',
      name: 'Thăng Long',
      kind: 'capital',
      at: { x: -0.7762, z: 0.7395 },
      description:
        'Hanoi, on the Red River: the Lê capital he grew up in, demoted to a ' +
        'provincial town once the Nguyễn moved the court to Huế, and the place ' +
        'the tribute embassy of 1813 set out from with him at its head. The ' +
        'river drawn under this pin is the real one, from published geodata; ' +
        'the marker is 0.0008 map units off the course, which is why it can ' +
        'stand for it.',
    },
    {
      id: 'nam-quan',
      name: 'Ải Nam Quan',
      kind: 'landmark',
      at: { x: -0.6943, z: 0.6645 },
      description:
        'The gate in the mountains at Lạng Sơn where Đại Việt ended and the ' +
        'Chinese empire began, and where every tribute embassy for eight ' +
        'centuries crossed out and back. Nguyễn Du wrote his way through it in ' +
        '1813 and again on the return.',
    },
    {
      id: 'guilin',
      name: 'Quế Lâm',
      kind: 'city',
      at: { x: -0.3533, z: 0.3976 },
      description:
        'Guilin, in Guangxi — the first great Chinese city on the road, among ' +
        'the karst towers. The *Bắc hành tạp lục*, the 132 poems of the ' +
        'journey, is at its best along this stretch: temples, tombs of the ' +
        'famous dead, and a good deal about beggars.',
    },
    {
      id: 'wuchang',
      name: 'Vũ Xương',
      kind: 'city',
      at: { x: 0.0295, z: -0.0282 },
      description:
        'Wuchang, where the embassy road crosses the Yangtze — the halfway ' +
        'point and the hinge of the journey, with the Yellow Crane Tower on ' +
        'the bluff above the ferry. The river drawn here is the real course; ' +
        'the town sits 0.0019 map units off it.',
    },
    {
      id: 'bac-kinh',
      name: 'Bắc Kinh',
      kind: 'capital',
      at: { x: 0.2286, z: -0.7823 },
      description:
        'Beijing, the end of the embassy road and the start of the poem. The ' +
        'Vương family lives here: a modest household with two daughters and a ' +
        'son, and an outing at the Thanh Minh tomb-sweeping festival at which ' +
        'Thúy Kiều weeps over the grave of a dead singing-girl nobody has ' +
        'tended, meets Kim Trọng, and — reading her own future in the first ' +
        'and her only happiness in the second — gets both of them right.',
    },
    {
      id: 'lieu-duong',
      name: 'Liêu Dương',
      kind: 'town',
      at: { x: 0.8733, z: -0.8927 },
      description:
        'Liaoyang, far away in the north-east, where Kim Trọng is called to ' +
        'bury an uncle immediately after the two of them have sworn ' +
        'themselves to each other. He is gone for six months. Everything ' +
        'happens in those six months, and the distance on this map is the ' +
        'whole of the plot’s mechanism: he cannot be reached and does not ' +
        'know.',
    },
    {
      id: 'lam-truy',
      name: 'Lâm Truy',
      kind: 'city',
      at: { x: 0.4105, z: -0.5331 },
      description:
        'Linzi in Shandong. Mã Giám Sinh buys Kiều as a concubine, brings her ' +
        'here, and hands her to Tú Bà, who runs a house. Kiều tries to kill ' +
        'herself, is talked out of it, is broken by a month of it, and ' +
        'eventually is bought out by Thúc Sinh — who is already married and ' +
        'has not mentioned it.',
    },
    {
      id: 'vo-tich',
      name: 'Vô Tích',
      kind: 'city',
      at: { x: 0.6000, z: -0.1105 },
      description:
        'Wuxi, and Hoạn Thư, who is the best-drawn character in the poem. ' +
        'Learning of her husband’s second household, she does not make a ' +
        'scene: she has Kiều kidnapped, her old house burned so that everyone ' +
        'believes her dead, and installs her as a maid — then calls for wine ' +
        'and has the maid play the lute for the two of them, so that Thúc ' +
        'Sinh has to sit through it. The poem calls this genius and does not ' +
        'entirely disagree.',
    },
    {
      id: 'hang-chau',
      name: 'Hàng Châu & the Tiền Đường',
      kind: 'city',
      // On the water, deliberately: the pin is the last point of the drawn
      // course, which is the Qiantang along the southern edge of the city.
      at: { x: 0.5856, z: 0.0003 },
      description:
        'Hangzhou, at the mouth of the Tiền Đường — the Qiantang, whose tidal ' +
        'bore is the loudest thing in the region and which the ghost of Đạm ' +
        'Tiên named to Kiều at the very beginning as the place her suffering ' +
        'would end. Từ Hải’s rebel state is broken near here on her own ' +
        'advice; she is married off to a chieftain as a spoil, and on the ' +
        'first night on the water she hears the tide and understands where ' +
        'she is. The river IS drawn here, and getting it took a change to the ' +
        'elevation data: the DEM read this estuary as farmland, so the course ' +
        'ended at a coast the map did not have.',
    },
  ],

  routes: [
    {
      id: 'the-poets-country',
      name: 'Nghi Xuân to the capital',
      style: 'solid',
      color: '#8fc8a8',
      points: [
        { x: -0.7838, z: 0.9306 },
        { x: -0.7762, z: 0.7395 },
      ],
      description:
        'Two hundred kilometres up the coast from the family village to the ' +
        'old capital — the length of Nguyễn Du’s own rise from an unemployed ' +
        'gentleman to the head of a tribute mission, and the shortest line on ' +
        'this map.',
    },
    {
      id: 'the-embassy-road',
      name: 'The road north, 1813',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.7762, z: 0.7395 },
        { x: -0.6943, z: 0.6645 },
        { x: -0.3533, z: 0.3976 },
        { x: 0.0295, z: -0.0282 },
        { x: 0.2286, z: -0.7823 },
      ],
      description:
        'Thăng Long, the Nam Quan gate, Guangxi and Guilin, the Yangtze ' +
        'crossing at Wuchang, and on to Beijing — about two thousand ' +
        'kilometres each way, most of a year, and 132 poems. The Chinese ' +
        'geography of the Tale of Kiều is not book learning; he had been ' +
        'there.',
    },
    {
      id: 'kieus-road',
      name: 'Kiều’s fifteen years',
      style: 'solid',
      color: '#c96f8f',
      points: [
        { x: 0.2286, z: -0.7823 },
        { x: 0.4105, z: -0.5331 },
        { x: 0.6000, z: -0.1105 },
        { x: 0.5856, z: 0.0003 },
      ],
      description:
        'Beijing to Lâm Truy to Vô Tích to the river at Hàng Châu. Every leg ' +
        'of it is a sale or a capture, and she does not choose one of them ' +
        'except the first, which she chooses to save her father.',
    },
    {
      id: 'to-lieu-duong',
      name: 'Kim Trọng is called away',
      style: 'dashed',
      color: '#9ec8e8',
      points: [
        { x: 0.2286, z: -0.7823 },
        { x: 0.8733, z: -0.8927 },
      ],
      description:
        'North-east to Liaoyang, to bury an uncle, at exactly the wrong ' +
        'moment. Dashed, because the poem does not follow him: it stays with ' +
        'her, and the reader spends fifteen years knowing something he does ' +
        'not.',
    },
  ],

  regions: [
    { id: 'dai-viet', name: 'Đại Việt', at: { x: -0.88, z: 0.82 }, scale: 0.55 },
    { id: 'linh-nam', name: 'Lĩnh Nam', at: { x: -0.30, z: 0.20 }, scale: 0.5 },
    { id: 'the-ming', name: 'The Ming', at: { x: 0.18, z: -0.42 }, scale: 0.6 },
    { id: 'giang-nam', name: 'Giang Nam', at: { x: 0.78, z: -0.06 }, scale: 0.5 },
  ],

  elements: [
    {
      id: 'the-lute',
      name: 'Kiều’s lute',
      glyph: '♪',
      description:
        'The poem’s clock. She plays it for Kim Trọng the day they meet, and ' +
        'what comes out is so unbearable he asks her to stop. She plays it in ' +
        'the house at Lâm Truy for customers, and at Vô Tích for the wife who ' +
        'owns her, and at Hàng Châu for the official who has just had her ' +
        'husband killed. At the reunion, fifteen years on, Kim Trọng asks for ' +
        'it once more — and this time the same hands on the same strings come ' +
        'out warm, which is the last thing that happens in the poem and the ' +
        'reason it is not a tragedy.',
      journey: [
        { marker: 'bac-kinh', note: 'Played once, for him, and it frightens him.' },
        { marker: 'lam-truy', sinceChapter: 5, note: 'Played for customers.' },
        { marker: 'vo-tich', sinceChapter: 6, note: 'Played for the wife, at dinner.' },
        { marker: 'hang-chau', sinceChapter: 7, note: 'Played for the man who killed Từ Hải.' },
        { marker: 'bac-kinh', sinceChapter: 8, note: 'Played again, and it has changed.' },
      ],
    },
    {
      id: 'dam-tien',
      name: 'Đạm Tiên’s prophecy',
      glyph: '☾',
      description:
        'A singing-girl who died young and whose grave nobody tends. Kiều ' +
        'weeps over it on the first day of the poem, and that night the ghost ' +
        'comes and tells her they are on the same register — the roll of ' +
        'those fated to a broken life — and names the place where the debt ' +
        'will be paid. Fifteen years and three thousand lines later she is on ' +
        'a boat at Hàng Châu, hears the tide, asks what river it is, and ' +
        'remembers.',
      journey: [
        { marker: 'bac-kinh', note: 'The untended grave, at Thanh Minh.' },
        { marker: 'hang-chau', sinceChapter: 8, note: 'The appointment kept.' },
      ],
    },
  ],

  books: [
    {
      id: 'the-poets-road',
      title: 'The Poet’s Road',
      subtitle: 'Nguyễn Du, 1765–1820',
      chapters: [
        {
          id: 'nghi-xuan',
          title: 'Nghi Xuân',
          narration:
            'Born into a family at the top of the Lê court and grown up ' +
            'watching it destroyed — the Tây Sơn rising, the dynasty gone, ' +
            'the estates lost. Nguyễn Du spent about a decade back in the ' +
            'village with no position, then took service under the Nguyễn ' +
            'who had replaced everyone, which he seems to have regarded as a ' +
            'failure of nerve and wrote about accordingly.',
          focus: { marker: 'tien-dien', distance: 30 },
          reveal: {
            markers: ['tien-dien', 'thang-long'],
            routes: ['the-poets-country'],
            regions: ['dai-viet'],
          },
        },
        {
          id: 'the-road-north',
          title: 'The Road North, 1813',
          narration:
            'Head of the tribute embassy: out through the Nam Quan gate, up ' +
            'through Guangxi and Hunan, across the Yangtze at Wuchang, and on ' +
            'to Beijing. He came back with 132 poems, most of them about ' +
            'other people’s graves and the price of rice. He also came back ' +
            'having seen the country his poem is set in.',
          focus: { marker: 'guilin', distance: 42 },
          reveal: {
            markers: ['nam-quan', 'guilin', 'wuchang', 'bac-kinh'],
            routes: ['the-embassy-road'],
            regions: ['linh-nam', 'the-ming'],
          },
        },
        {
          id: 'hue-and-the-poem',
          title: 'Huế, and the Poem',
          narration:
            'Home, and then Huế — off the southern edge of this map — where ' +
            'he served the court he did not believe in and died in 1820 of an ' +
            'epidemic, reportedly refusing medicine. Somewhere in those years ' +
            'he wrote 3,254 lines of lục bát about a Chinese girl, in the ' +
            'Nôm script that scholars regarded as beneath them, and it became ' +
            'the book Vietnam quotes for everything: proverbs, fortune-telling, ' +
            'and arguments about the country itself.',
          quote: {
            text:
              'The root of good lies in our own heart. The word “heart” is ' +
              'worth three times the word “talent”.',
            original: 'Thiện căn ở tại lòng ta, / Chữ tâm kia mới bằng ba chữ tài.',
            source:
              'Lines 3251–3252, identical in the modern standard text and in ' +
              'the Liễu Văn Đường woodblock of 1866 · rendered from the ' +
              'Vietnamese for this atlas',
          },
          focus: { marker: 'thang-long', distance: 34 },
          highlight: { markers: ['thang-long', 'tien-dien'] },
        },
      ],
    },
    {
      id: 'doan-truong-tan-thanh',
      title: 'Đoạn Trường Tân Thanh',
      subtitle: 'A New Cry of Broken Hearts',
      chapters: [
        {
          id: 'thanh-minh',
          title: 'Thanh Minh',
          narration:
            'Tomb-sweeping festival outside Beijing. The Vương sisters and ' +
            'their brother are out among the graves; Kiều stops at one that ' +
            'nobody has tended and is told it belongs to a singing-girl who ' +
            'was famous, then unwanted, then dead. She weeps, writes a poem ' +
            'on the bark, and on the way home meets Kim Trọng. That night the ' +
            'ghost comes to say the two events are one event.',
          quote: {
            text:
              'Within the hundred years of this human realm, talent and fate ' +
              'have a way of hating one another.',
            original: 'Trăm năm trong cõi người ta, / Chữ tài chữ mệnh khéo là ghét nhau.',
            source:
              'Lines 1–2, identical in the modern standard text and in the ' +
              'Liễu Văn Đường woodblock of 1866 · rendered from the ' +
              'Vietnamese for this atlas',
          },
          focus: { marker: 'bac-kinh', distance: 30 },
          highlight: { markers: ['bac-kinh'] },
        },
        {
          id: 'the-sale',
          title: 'The Sale',
          narration:
            'Kim Trọng is called to Liêu Dương to bury an uncle. While he is ' +
            'gone a silk merchant lays a false charge, the father and brother ' +
            'are arrested and beaten, and the price of dropping it is three ' +
            'hundred taels the family does not have. Kiều sells herself as a ' +
            'concubine, asks her sister to take her place in the betrothal, ' +
            'and goes.',
          focus: { marker: 'lieu-duong', distance: 40 },
          reveal: { markers: ['lieu-duong'], routes: ['to-lieu-duong'] },
        },
        {
          id: 'lam-truy-chapter',
          title: 'Lâm Truy',
          narration:
            'The buyer is a procurer. The house in Shandong is a brothel, and ' +
            'when she tries to cut her own throat rather than work in it she ' +
            'is nursed better and then broken with a beating and a lie. Thúc ' +
            'Sinh, a merchant’s son, falls for her and buys her out, having ' +
            'omitted to mention that he has a wife.',
          focus: { marker: 'lam-truy', distance: 30 },
          reveal: { markers: ['lam-truy'], routes: ['kieus-road'], regions: ['giang-nam'] },
        },
        {
          id: 'vo-tich-chapter',
          title: 'Vô Tích',
          narration:
            'Hoạn Thư finds out and says nothing at all — for months. Then ' +
            'men come over the wall at night, the house burns, a body is left ' +
            'to be identified, and Kiều wakes up a servant in a household ' +
            'four hundred kilometres away. Her master is her lover, who cannot ' +
            'acknowledge her; her mistress is the wife, who is enjoying this ' +
            'very much. Kiều eventually gets out over a wall, taking a set of ' +
            'temple bells with her to sell, and is sheltered by a nun.',
          focus: { marker: 'vo-tich', distance: 26 },
          reveal: { markers: ['vo-tich'] },
        },
        {
          id: 'tu-hai',
          title: 'Từ Hải',
          narration:
            'Sold once more, and then rescued by a warlord who takes her ' +
            'seriously — the one man in the poem who does. Từ Hải carves out ' +
            'a state, and gives her a court of her own, and she uses it to ' +
            'hold a trial: everyone who wronged her is brought in and judged, ' +
            'and Hoạn Thư talks her way out of it by pointing out that ' +
            'jealousy is normal. Then the imperial commissioner offers an ' +
            'amnesty, and Kiều — wanting to go home, and believing him — ' +
            'advises Từ Hải to accept.',
          focus: { marker: 'hang-chau', distance: 30 },
          reveal: { markers: ['hang-chau'] },
        },
        {
          id: 'the-tien-duong',
          title: 'The Tiền Đường',
          narration:
            'The amnesty is a trap. Từ Hải is killed standing up and stays ' +
            'standing; Kiều is made to play the lute at the victory dinner ' +
            'and is then married off to a tribal chief as a spoil. On the ' +
            'boat that night she hears a tide come up the river, asks what ' +
            'river it is, and is told. She goes over the side. A nun who was ' +
            'given the same prophecy fifteen years earlier has been waiting ' +
            'on that bank with a net.',
          quote: {
            text:
              'From somewhere a tide rose with a booming roar; she asked, and ' +
              'learned it was the river Tiền Đường.',
            original: 'Triều đâu nổi tiếng đùng đùng, / Hỏi ra mới biết rằng sông Tiền Đường.',
            source:
              'Lines 2619–2620, identical in the modern standard text and in ' +
              'the Liễu Văn Đường woodblock of 1866 · rendered from the ' +
              'Vietnamese for this atlas',
          },
          focus: { marker: 'hang-chau', distance: 22 },
          highlight: { markers: ['hang-chau'], routes: ['kieus-road'] },
        },
      ],
    },
  ],
}
