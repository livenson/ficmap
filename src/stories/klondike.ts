import type { Story } from '../types'
import klondikeHeight from '../assets/klondike-height.png'

/**
 * The Klondike — the stampede route, from tidewater to the goldfields, as three
 * books saw it.
 *
 * WHOSE BOOKS, because the honest answer is complicated. Jack London was an
 * American who went up the Yukon in 1897, spent one winter on the Stewart River
 * and came home with scurvy and no gold; *The Call of the Wild* (1903) and
 * *White Fang* (1906) are what he made of it. Robert Service was a Scot who
 * arrived a decade after the rush was over and clerked in a bank at Whitehorse
 * and Dawson; *Songs of a Sourdough* (1907) is what he made of THAT. So this is
 * a Canadian place written by two outsiders, and the world says so rather than
 * calling either of them a Canadian voice. All three books are public domain.
 *
 * The three are kept as three books rather than blended, because they disagree.
 * London's north is a place that strips everything down to what will survive it;
 * Service's is a bar-room tall tale that knows it is one.
 *
 * WHAT IS REAL HERE. Almost all of it. Skagway, Dyea, the Chilkoot Pass, Lake
 * Bennett, Whitehorse, Lake Laberge, Five Finger Rapids, Fort Selkirk, Dawson,
 * Fortymile, Eagle, Circle and Fort Yukon are places, and the books name them.
 * The one thing invented is where the story needs it to be: Bonanza Creek is
 * the real Discovery Claim, but London's characters are not on it.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon + 148) / 8 − 1      map z = (67.2 − lat) / 4.2 − 1
 */
export const klondike: Story = {
  id: 'klondike',
  title: 'The Klondike',
  subtitle: 'Tidewater to Dawson, and what it cost',
  author: 'Jack London & Robert Service',
  region: 'The Yukon & Alaska',
  epoch: 'The stampede of 1897–99',
  group: 'adventure',
  earth: { lon: -139.4319, lat: 64.06, place: 'Dawson City, Yukon' },
  intro:
    'Thirty thousand people walked over a mountain pass carrying a ton of ' +
    'supplies each because a boat reached Seattle with gold on it. Press ▶ ' +
    'Play story to follow the route they took: the beach at Dyea, the Chilkoot ' +
    'in winter, boats built at Lake Bennett, and six hundred miles of river to ' +
    'Dawson — then the mail trail south again, which is the road that breaks ' +
    'the dogs.',
  surfaceName: 'The Yukon',
  ambient: {
    // Boreal spruce, thin and dark, and not much of it above the benches.
    trees: 0.3,
    treeKind: 'conifer',
    treeColor: '#33502f',
    birds: 5,
    fish: 2,
  },
  terrain: {
    music: {
      // An original, and here the reason differs from this atlas's other
      // originals. Elsewhere the honest tune existed and had to be verified;
      // the stampede had no melody of its own to verify. Its songs were new
      // words on tunes already in circulation, and its most famous lines —
      // Service's — are recited, not sung. So this is written to the gait of a
      // loaded sled: a plain four-square tread that never gets anywhere fast.
      title: 'Trail song',
      credit: 'Original',
      melody:
        'D4:2 D4:1 F4:1 A4:2 G4:2 ' +
        'F4:2 D4:1 E4:1 F4:4 ' +
        'A4:2 A4:1 C5:1 D5:2 C5:2 ' +
        'A4:2 F4:1 E4:1 D4:4',
      bass: 'D3:8 B2:8 F2:8 D3:8',
      tempo: 50,
      voice: 'horn',
      mood: 'epic',
    },
    seed: 'klondike-1', // unused: the heightmap takes precedence
    heightmap: klondikeHeight,
    // Printed by scripts/build-heightmap.mjs for the `klondike` preset.
    seaLevel: 0.009,
    // 809 km across by 932 km down. At 63N the meridians have closed right up,
    // so sixteen degrees of longitude is barely wider than eight of latitude.
    aspect: 0.868,
    // The Coast Mountains behind Skagway are the wall the whole story starts by
    // climbing, so the relief is worth more here than on most maps in this
    // atlas; 10 gets the Chilkoot to read as a barrier without turning the
    // interior plateau into teeth.
    heightScale: 10,
    overhead: true,
    rivers: 0,
    /**
     * The Yukon and three of its tributaries, all named in the books.
     *
     * The Yukon here is the whole navigable stretch, and getting it was not
     * automatic: Natural Earth stitches the river out of thirteen segments
     * joined by two- and three-point connector stubs, and `build-river`'s guard
     * against braided channels was rejecting those stubs as doublings-back. It
     * dropped the entire upper river — Laberge down to Fort Selkirk, which is
     * the first half of every journey on this map. Fixed by excluding the few
     * chain points nearest the join; the other eighteen courses in the atlas
     * come out byte-identical afterwards, and the Elbe gains five points and a
     * slightly better profile.
     *
     * The White River needed the other half of that fix. There are White Rivers
     * in Indiana, Arkansas, Vermont and South Dakota, and merging every feature
     * of the name chained the longest of them; the result was a course three
     * thousand kilometres away, reported as not crossing this world at all.
     *
     * Source: Natural Earth 10m river centrelines (public domain), via
     * `scripts/build-river.mjs klondike Yukon | Stewart | White | Pelly`.
     */
    namedRivers: [
      {
        name: 'The Yukon',
        marker: 'the-yukon',
        points: [
          { x: 0.6356, z: 0.3410 }, { x: 0.6431, z: 0.3218 }, { x: 0.6307, z: 0.2936 },
          { x: 0.6293, z: 0.2758 }, { x: 0.6284, z: 0.2562 }, { x: 0.6095, z: 0.2537 },
          { x: 0.5893, z: 0.2450 }, { x: 0.5698, z: 0.2400 }, { x: 0.5548, z: 0.2291 },
          { x: 0.5275, z: 0.2318 }, { x: 0.5089, z: 0.2225 }, { x: 0.4848, z: 0.2155 },
          { x: 0.4650, z: 0.2121 }, { x: 0.4551, z: 0.1958 }, { x: 0.4520, z: 0.1747 },
          { x: 0.4508, z: 0.1560 }, { x: 0.4334, z: 0.1452 }, { x: 0.4171, z: 0.1322 },
          { x: 0.4055, z: 0.1175 }, { x: 0.3934, z: 0.0989 }, { x: 0.3776, z: 0.0883 },
          { x: 0.3577, z: 0.0749 }, { x: 0.3406, z: 0.0659 }, { x: 0.3182, z: 0.0466 },
          { x: 0.2958, z: 0.0411 }, { x: 0.2729, z: 0.0462 }, { x: 0.2452, z: 0.0426 },
          { x: 0.2248, z: 0.0411 }, { x: 0.2055, z: 0.0482 }, { x: 0.1815, z: 0.0393 },
          { x: 0.1655, z: 0.0277 }, { x: 0.1419, z: 0.0231 }, { x: 0.1224, z: 0.0183 },
          { x: 0.0952, z: 0.0088 }, { x: 0.0711, z: -0.0003 }, { x: 0.0624, z: -0.0171 },
          { x: 0.0550, z: -0.0376 }, { x: 0.0601, z: -0.0601 }, { x: 0.0705, z: -0.0751 },
          { x: 0.0569, z: -0.0888 }, { x: 0.0356, z: -0.1105 }, { x: 0.0315, z: -0.1288 },
          { x: 0.0303, z: -0.1476 }, { x: 0.0347, z: -0.1679 }, { x: 0.0325, z: -0.1893 },
          { x: 0.0327, z: -0.2092 }, { x: 0.0363, z: -0.2300 }, { x: 0.0572, z: -0.2442 },
          { x: 0.0685, z: -0.2595 }, { x: 0.0599, z: -0.2765 }, { x: 0.0500, z: -0.2921 },
          { x: 0.0299, z: -0.3017 }, { x: 0.0111, z: -0.3106 }, { x: -0.0133, z: -0.3172 },
          { x: -0.0422, z: -0.3282 }, { x: -0.0649, z: -0.3340 }, { x: -0.0577, z: -0.3529 },
          { x: -0.0756, z: -0.3645 }, { x: -0.0900, z: -0.3782 }, { x: -0.1119, z: -0.3940 },
          { x: -0.1303, z: -0.4059 }, { x: -0.1359, z: -0.4240 }, { x: -0.1402, z: -0.4438 },
          { x: -0.1492, z: -0.4618 }, { x: -0.1719, z: -0.4621 }, { x: -0.1701, z: -0.4814 },
          { x: -0.1759, z: -0.4983 }, { x: -0.1973, z: -0.5121 }, { x: -0.2181, z: -0.5248 },
          { x: -0.2405, z: -0.5341 }, { x: -0.2506, z: -0.5508 }, { x: -0.2740, z: -0.5590 },
          { x: -0.3009, z: -0.5605 }, { x: -0.3192, z: -0.5711 }, { x: -0.3407, z: -0.5628 },
          { x: -0.3692, z: -0.5652 }, { x: -0.3957, z: -0.5678 }, { x: -0.4193, z: -0.5629 },
          { x: -0.4412, z: -0.5728 }, { x: -0.4583, z: -0.5844 }, { x: -0.4640, z: -0.6026 },
          { x: -0.4811, z: -0.6185 }, { x: -0.5027, z: -0.6219 }, { x: -0.5145, z: -0.6373 },
          { x: -0.5111, z: -0.6550 }, { x: -0.5034, z: -0.6737 }, { x: -0.5080, z: -0.6982 },
          { x: -0.5210, z: -0.7147 }, { x: -0.5428, z: -0.7253 }, { x: -0.5535, z: -0.7439 },
          { x: -0.5678, z: -0.7574 }, { x: -0.5832, z: -0.7709 }, { x: -0.5957, z: -0.7858 },
          { x: -0.6079, z: -0.8007 }, { x: -0.6234, z: -0.8181 }, { x: -0.6457, z: -0.8298 },
          { x: -0.6613, z: -0.8444 }, { x: -0.6816, z: -0.8528 }, { x: -0.7151, z: -0.8590 },
          { x: -0.7439, z: -0.8583 }, { x: -0.7753, z: -0.8485 }, { x: -0.7990, z: -0.8445 },
          { x: -0.8419, z: -0.8364 }, { x: -0.8680, z: -0.8271 }, { x: -0.8868, z: -0.8148 },
          { x: -0.9038, z: -0.7992 }, { x: -0.9286, z: -0.8027 }, { x: -0.9503, z: -0.7951 },
          { x: -0.9474, z: -0.7776 }, { x: -0.9713, z: -0.7744 }, { x: -0.9959, z: -0.7732 },
        ],
      },
      {
        name: 'The Pelly',
        points: [
          { x: 1.0000, z: 0.2750 }, { x: 0.9806, z: 0.2693 }, { x: 0.9658, z: 0.2582 },
          { x: 0.9432, z: 0.2399 }, { x: 0.9020, z: 0.2207 }, { x: 0.8712, z: 0.2006 },
          { x: 0.8512, z: 0.1938 }, { x: 0.8302, z: 0.1859 }, { x: 0.8144, z: 0.1741 },
          { x: 0.7960, z: 0.1642 }, { x: 0.7762, z: 0.1522 }, { x: 0.7581, z: 0.1419 },
          { x: 0.7374, z: 0.1317 }, { x: 0.7237, z: 0.1141 }, { x: 0.7077, z: 0.1015 },
          { x: 0.6890, z: 0.0893 }, { x: 0.6687, z: 0.0833 }, { x: 0.6664, z: 0.0654 },
          { x: 0.6480, z: 0.0580 }, { x: 0.6287, z: 0.0621 }, { x: 0.6095, z: 0.0538 },
          { x: 0.5827, z: 0.0521 }, { x: 0.5566, z: 0.0510 }, { x: 0.5369, z: 0.0480 },
          { x: 0.5170, z: 0.0366 }, { x: 0.4975, z: 0.0286 }, { x: 0.4754, z: 0.0289 },
          { x: 0.4552, z: 0.0366 }, { x: 0.4353, z: 0.0352 }, { x: 0.4097, z: 0.0319 },
          { x: 0.3899, z: 0.0306 }, { x: 0.3571, z: 0.0330 }, { x: 0.3377, z: 0.0373 },
          { x: 0.3354, z: 0.0545 },
        ],
      },
      {
        name: 'The Stewart',
        marker: 'stewart-river',
        points: [
          { x: 1.0000, z: -0.2529 }, { x: 0.9334, z: -0.2552 }, { x: 0.9056, z: -0.2513 },
          { x: 0.8816, z: -0.2442 }, { x: 0.8612, z: -0.2366 }, { x: 0.8416, z: -0.2293 },
          { x: 0.8192, z: -0.2301 }, { x: 0.7982, z: -0.2299 }, { x: 0.7721, z: -0.2336 },
          { x: 0.7504, z: -0.2263 }, { x: 0.7547, z: -0.2077 }, { x: 0.7743, z: -0.2012 },
          { x: 0.8144, z: -0.1910 }, { x: 0.8017, z: -0.1666 }, { x: 0.7741, z: -0.1546 },
          { x: 0.7602, z: -0.1416 }, { x: 0.7420, z: -0.1324 }, { x: 0.7184, z: -0.1211 },
          { x: 0.6957, z: -0.1129 }, { x: 0.6691, z: -0.1149 }, { x: 0.6455, z: -0.1144 },
          { x: 0.6250, z: -0.1139 }, { x: 0.6068, z: -0.1271 }, { x: 0.5904, z: -0.1377 },
          { x: 0.5738, z: -0.1495 }, { x: 0.5515, z: -0.1490 }, { x: 0.5305, z: -0.1492 },
          { x: 0.5031, z: -0.1450 }, { x: 0.4814, z: -0.1287 }, { x: 0.4643, z: -0.1184 },
          { x: 0.4468, z: -0.1089 }, { x: 0.4285, z: -0.0975 }, { x: 0.4012, z: -0.0967 },
          { x: 0.3837, z: -0.1111 }, { x: 0.3631, z: -0.1256 }, { x: 0.3363, z: -0.1271 },
          { x: 0.2963, z: -0.1468 }, { x: 0.2772, z: -0.1391 }, { x: 0.2703, z: -0.1204 },
          { x: 0.2477, z: -0.1121 }, { x: 0.2101, z: -0.0800 }, { x: 0.1861, z: -0.0721 },
          { x: 0.1658, z: -0.0692 }, { x: 0.1454, z: -0.0586 }, { x: 0.1246, z: -0.0484 },
          { x: 0.0788, z: -0.0785 }, { x: 0.0702, z: -0.0765 },
        ],
      },
      {
        name: 'The White',
        marker: 'white-river',
        points: [
          { x: -0.0007, z: 0.0907 }, { x: -0.0050, z: 0.0708 }, { x: -0.0056, z: 0.0528 },
          { x: -0.0090, z: 0.0348 }, { x: -0.0224, z: 0.0218 }, { x: -0.0282, z: 0.0051 },
          { x: -0.0354, z: -0.0157 }, { x: -0.0440, z: -0.0332 }, { x: -0.0350, z: -0.0487 },
          { x: -0.0171, z: -0.0577 }, { x: 0.0054, z: -0.0552 }, { x: 0.0281, z: -0.0524 },
          { x: 0.0524, z: -0.0491 },
        ],
      },
    ],
    // Metre figures from the build log's gamma table. Two water bands would be
    // wrong here: the Lynn Canal at Skagway is salt and the lakes on the pass
    // are fresh, but the DEM cannot tell them apart and neither can this legend
    // honestly, so they share a line.
    biomes: [
      { maxHeight: 0.009, color: '#22485f', name: 'Salt water & the lakes' },
      { maxHeight: 0.16, color: '#5d6f52', name: 'River flats' },
      { maxHeight: 0.30, color: '#4a5f42', name: 'Spruce & muskeg' },
      { maxHeight: 0.45, color: '#5b6248', name: 'The benches' },
      { maxHeight: 0.62, color: '#6f6b53', name: 'Timberline' },
      { maxHeight: 0.80, color: '#8a8478', name: 'Bare rock' },
      { maxHeight: 1.0, color: '#eef3f7', name: 'Snow & ice' },
    ],
  },

  markers: [
    {
      id: 'skagway',
      name: 'Skagway',
      kind: 'port',
      at: { x: 0.5858, z: 0.8433 },
      description:
        'Where the steamers put people ashore at the head of the Lynn Canal, ' +
        'and for two years one of the most lawless places on the continent — ' +
        'Soapy Smith’s town, until it wasn’t. From here you chose your pass: ' +
        'the White, longer and lower and famous for killing horses, or the ' +
        'Chilkoot out of Dyea.',
    },
    {
      id: 'dyea',
      name: 'Dyea',
      kind: 'port',
      at: { x: 0.5800, z: 0.8323 },
      description:
        'The beach at the foot of the Chilkoot, and where Buck is put ashore ' +
        'in *The Call of the Wild* — off the ship, into the snow, into a world ' +
        'where the rule is club and fang. A town of thousands in 1898 and ' +
        'essentially nothing by 1903; it is a meadow with a few pilings now.',
    },
    {
      id: 'chilkoot',
      name: 'The Chilkoot Pass',
      kind: 'peak',
      at: { x: 0.5952, z: 0.7865 },
      description:
        'A thousand metres up over thirty-three miles, and the last half-mile ' +
        'so steep the stampeders cut steps into the ice and went up in a single ' +
        'unbroken file — the photograph everyone has seen. The Mounted Police ' +
        'at the summit turned back anyone without a ton of supplies, on the ' +
        'straightforward grounds that they would otherwise starve.',
    },
    {
      id: 'bennett',
      name: 'Lake Bennett',
      kind: 'landmark',
      at: { x: 0.6418, z: 0.6925 },
      description:
        'Over the pass, where the trail stops and the river starts. Through the ' +
        'winter of 1897–98 the shore of this lake was a shipyard: seven ' +
        'thousand boats built out of green whipsawn spruce by people who had ' +
        'never built a boat. When the ice went out at the end of May they all ' +
        'left within days.',
    },
    {
      id: 'whitehorse',
      name: 'Miles Canyon & the White Horse',
      kind: 'danger',
      at: { x: 0.6180, z: 0.5419 },
      description:
        'Two miles of basalt canyon and then the rapids that gave the town its ' +
        'name, from the white manes of the standing waves. Enough of the ' +
        'home-made boats were destroyed in the first weeks that the Mounted ' +
        'Police took over: no women or children through, and no boat at all ' +
        'without a competent man at the sweep.',
    },
    {
      id: 'laberge',
      name: 'Lake Laberge',
      kind: 'landmark',
      at: { x: 0.6042, z: 0.4365 },
      description:
        'Thirty miles of lake that freezes before the river does and thaws ' +
        'after it, so it stops everyone twice a year. Service spells it ' +
        '“Lebarge” for the rhyme, and puts the derelict *Alice May* on its ' +
        'shore — the boat whose boiler cremates Sam McGee.',
    },
    {
      id: 'carmacks',
      name: 'Carmacks',
      kind: 'town',
      at: { x: 0.4639, z: 0.2169 },
      description:
        'Named for George Carmack, who with Skookum Jim Mason and Dawson ' +
        'Charlie — Tagish men, and the ones who almost certainly found it — ' +
        'made the strike on Bonanza Creek in August 1896 that started ' +
        'everything. The credit went where credit went in 1896.',
    },
    {
      id: 'five-finger',
      name: 'Five Finger Rapids',
      kind: 'danger',
      at: { x: 0.4562, z: 0.1739 },
      description:
        'Four rock pillars across the Yukon leaving five channels, only the ' +
        'easternmost of which is any use. Steamers going upstream had to be ' +
        'winched through on a cable bolted to the rock.',
    },
    {
      id: 'selkirk',
      name: 'Fort Selkirk',
      kind: 'ruin',
      at: { x: 0.3271, z: 0.0555 },
      description:
        'A Hudson’s Bay post at the mouth of the Pelly, burned out by a Chilkat ' +
        'trading party in 1852 for undercutting them, rebuilt for the stampede, ' +
        'and empty again by the 1950s when the road went in on the other side ' +
        'of the river. The buildings are still standing.',
    },
    {
      id: 'stewart-river',
      name: 'The Stewart',
      kind: 'landmark',
      at: { x: 0.0788, z: -0.0785 },
      description:
        'Where London himself wintered in 1897–98, in a cabin about eighty ' +
        'miles up from the mouth, and where he got the scurvy that sent him ' +
        'home. Everything he wrote about the north came out of one winter on ' +
        'this river.',
    },
    {
      id: 'white-river',
      name: 'The White',
      kind: 'landmark',
      at: { x: 0.0524, z: -0.0491 },
      description:
        'Grey with volcanic ash the whole way, which is what the name is ' +
        'about. In *The Call of the Wild* John Thornton’s camp is at its mouth, ' +
        'and the lost cabin he goes looking for is somewhere east of it — the ' +
        'one place in this world the map is deliberately not shown, because ' +
        'the book never finds it either.',
    },
    {
      id: 'the-yukon',
      name: 'The Yukon',
      kind: 'landmark',
      at: { x: 0.0299, z: -0.3017 },
      description:
        'Two thousand miles of river, and for the length of this map it is the ' +
        'only road there is — boats in summer, a sled trail on the ice in ' +
        'winter, and nothing at all during the weeks the ice is going out. ' +
        'Drawn from its published course.',
    },
    {
      id: 'dawson',
      name: 'Dawson City',
      kind: 'capital',
      at: { x: 0.0710, z: -0.2524 },
      description:
        'Built on a swamp at the mouth of the Klondike, forty thousand people ' +
        'at its peak, and emptying again within two years when Nome was struck. ' +
        'Eggs at a dollar each, and the Malamute saloon where Service’s Dan ' +
        'McGrew gets shot. Most of the stampeders who got here found every ' +
        'creek already staked.',
    },
    {
      id: 'bonanza',
      name: 'Bonanza Creek',
      kind: 'landmark',
      at: { x: 0.0854, z: -0.2183 },
      description:
        'The Discovery Claim, staked 17 August 1896 — the actual reason for ' +
        'all of this. By the time the news reached Seattle eleven months later ' +
        'the whole creek and the whole of Eldorado above it were already ' +
        'spoken for, which the thirty thousand people setting out did not know.',
    },
    {
      id: 'fortymile',
      name: 'Fortymile',
      kind: 'town',
      at: { x: -0.0667, z: -0.3396 },
      description:
        'The old mining camp downstream, which was the centre of everything ' +
        'until Bonanza emptied it in a week. London’s dogs pass through here on ' +
        'the mail run; the river it stands on gave it the name.',
    },
    {
      id: 'eagle',
      name: 'Eagle',
      kind: 'town',
      at: { x: -0.1502, z: -0.4256 },
      description:
        'Over the line into Alaska, and the first telegraph station in the ' +
        'interior — which is how Amundsen, having got the Northwest Passage, ' +
        'came six hundred miles overland from Herschel Island in 1905 to wire ' +
        'the news out.',
    },
    {
      id: 'circle',
      name: 'Circle City',
      kind: 'town',
      at: { x: -0.5077, z: -0.6727 },
      description:
        '“The largest log cabin city in the world” before the Klondike ' +
        'emptied it, named for the Arctic Circle, which it is about fifty ' +
        'miles short of. The mail trail from Dawson ends here, and in *The Call ' +
        'of the Wild* it is where the run ends and the dogs are worn out.',
    },
    {
      id: 'fort-yukon',
      name: 'Fort Yukon',
      kind: 'town',
      at: { x: -0.6571, z: -0.8494 },
      description:
        'Where the Porcupine comes in, above the Arctic Circle, and the ' +
        'northernmost point on this map. The Hudson’s Bay Company built it in ' +
        '1847 well inside Russian territory and stayed twenty years. *White ' +
        'Fang* begins in country like this: two men, a sled, a coffin, and ' +
        'wolves following.',
    },
  ],

  routes: [
    {
      id: 'the-pass',
      name: 'Over the Chilkoot',
      style: 'solid',
      color: '#c96f5c',
      points: [
        { x: 0.5858, z: 0.8433 },
        { x: 0.5800, z: 0.8323 },
        { x: 0.5952, z: 0.7865 },
        { x: 0.6418, z: 0.6925 },
      ],
      description:
        'Thirty-three miles from the beach to the lake, and the police at the ' +
        'summit would not let you past without a ton of goods. Nobody carried a ' +
        'ton at once: you carried sixty pounds, cached it, walked back, and did ' +
        'it again until it was all over. Most people crossed this pass thirty ' +
        'or forty times.',
    },
    {
      id: 'the-river',
      name: 'Down the Yukon',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: 0.6418, z: 0.6925 },
        { x: 0.6180, z: 0.5419 },
        { x: 0.6042, z: 0.4365 },
        { x: 0.4639, z: 0.2169 },
        { x: 0.4562, z: 0.1739 },
        { x: 0.3271, z: 0.0555 },
        { x: 0.0788, z: -0.0785 },
        { x: 0.0710, z: -0.2524 },
      ],
      description:
        'Five hundred miles in a boat you built yourself out of green timber, ' +
        'through a canyon and a set of rapids that the Mounted Police ended up ' +
        'policing because so many boats were being smashed. Then Laberge, Five ' +
        'Finger, Selkirk, and Dawson.',
    },
    {
      id: 'the-mail',
      name: 'The Mail Trail',
      style: 'solid',
      color: '#9ec8e8',
      points: [
        { x: 0.0710, z: -0.2524 },
        { x: -0.0667, z: -0.3396 },
        { x: -0.1502, z: -0.4256 },
        { x: -0.5077, z: -0.6727 },
      ],
      description:
        'The winter road on the ice, downstream to Fortymile, Eagle and Circle ' +
        'City. This is the run that uses the dogs up in *The Call of the Wild*: ' +
        'a schedule that does not care, a load that does not get lighter, and ' +
        'teams that get replaced when they can no longer make the time.',
    },
    {
      id: 'the-far-north',
      name: 'Above the Circle',
      style: 'dashed',
      color: '#b9c6d6',
      points: [
        { x: -0.5077, z: -0.6727 },
        { x: -0.6571, z: -0.8494 },
      ],
      description:
        'On north to Fort Yukon and the Porcupine, which is *White Fang* ' +
        'country — the country the book opens in, where the wild is simply a ' +
        'thing that is stronger than you are. Dashed: the book gives the ' +
        'feeling of the distance rather than the stages of it.',
    },
  ],

  regions: [
    { id: 'coast', name: 'The Coast Mountains', at: { x: 0.72, z: 0.80 }, scale: 0.5 },
    { id: 'interior', name: 'The Yukon Interior', at: { x: 0.30, z: 0.30 }, scale: 0.6 },
    { id: 'klondike-region', name: 'The Klondike', at: { x: 0.16, z: -0.20 }, scale: 0.55 },
    { id: 'alaska', name: 'Alaska', at: { x: -0.55, z: -0.45 }, scale: 0.6 },
  ],

  elements: [
    {
      id: 'the-mail-sled',
      name: 'The Mail',
      glyph: '✉',
      description:
        'The reason the dogs run. Letters from the outside come up over the ' +
        'pass and down the river to Dawson, and go on down the ice to Circle; ' +
        'the schedule is fixed and the load is not negotiable. In *The Call of ' +
        'the Wild* this is what Buck is bought for, and what finishes the team ' +
        'he is bought into.',
      journey: [
        { marker: 'dyea', note: 'Ashore with the dogs.' },
        { marker: 'bennett', sinceChapter: 1, note: 'Over the pass.' },
        { marker: 'dawson', sinceChapter: 3, note: 'Down the river to the goldfields.' },
        { marker: 'circle', sinceChapter: 4, note: 'On down the ice, and the team is done.' },
      ],
    },
    {
      id: 'sam-mcgee',
      name: 'Sam McGee',
      glyph: '🔥',
      description:
        'From Service, and the atlas’s only tracked element that is a corpse. ' +
        'A man from Plumtree, Tennessee, who could never get warm, dies on the ' +
        'trail out of Dawson having extracted a promise that he will not be ' +
        'buried in the ice; his friend hauls him down to Lake Laberge, finds a ' +
        'derelict boat, and cremates him in her furnace. Then opens the door to ' +
        'check.',
      journey: [
        { marker: 'dawson', note: 'Taken ill on the Dawson trail.' },
        { marker: 'laberge', sinceChapter: 8, note: 'The furnace of the derelict Alice May.' },
      ],
    },
  ],

  books: [
    {
      id: 'call-of-the-wild',
      title: 'The Call of the Wild',
      subtitle: 'London, 1903',
      chapters: [
        {
          id: 'into-the-primitive',
          title: 'Into the Primitive',
          narration:
            'Buck is a large comfortable dog on a ranch in the Santa Clara ' +
            'valley — off this map, and off it for good. A gardener with a ' +
            'gambling debt sells him, he is shipped north in a crate, and a man ' +
            'in a red sweater teaches him the first thing he needs to know: a ' +
            'man with a club is a man you do not beat. Then the beach at Dyea, ' +
            'and snow.',
          focus: { marker: 'dyea', distance: 26 },
          reveal: {
            markers: ['skagway', 'dyea', 'chilkoot'],
            routes: ['the-pass'],
            regions: ['coast', 'interior'],
          },
        },
        {
          id: 'the-pass',
          title: 'The Law of Club and Fang',
          narration:
            'Over the Chilkoot in a traces, learning the rest of it: sleep in a ' +
            'hole in the snow, steal food or go without, and when a dog goes ' +
            'down the others are on it before it stops moving. Curly is killed ' +
            'in about thirty seconds, in front of everyone, and nothing at all ' +
            'happens as a result. That is the lesson.',
          focus: { marker: 'chilkoot', distance: 30 },
          reveal: { markers: ['bennett'], routes: ['the-river'] },
        },
        {
          id: 'the-river',
          title: 'Down the River',
          narration:
            'The trail runs on the ice: Bennett, the canyon, Laberge, Five ' +
            'Finger, Selkirk. Buck works out that Spitz is the problem and ' +
            'that the problem is solvable, and one night by firelight the pack ' +
            'stands round in a circle and waits to see which of them will be ' +
            'eaten. Buck takes the lead of the team.',
          focus: { marker: 'laberge', distance: 34 },
          reveal: { markers: ['whitehorse', 'laberge', 'carmacks', 'five-finger', 'selkirk'] },
        },
        {
          id: 'the-mail-run',
          title: 'The Toil of Trace and Trail',
          narration:
            'Dawson, and then straight out again on the mail run to the ' +
            'southward — Fortymile, Eagle, Circle City — because the mail does ' +
            'not wait. Fifty miles a day with a full load and no rest days. By ' +
            'the end of it the team is finished, and finished teams are sold ' +
            'on to whoever will buy them.',
          focus: { marker: 'circle', distance: 46 },
          reveal: {
            markers: ['dawson', 'bonanza', 'the-yukon', 'fortymile', 'eagle', 'circle'],
            routes: ['the-mail'],
            regions: ['klondike-region', 'alaska'],
          },
        },
        {
          id: 'thornton',
          title: 'The White River',
          narration:
            'Sold to three people who have no idea what they are doing, ' +
            'overload the sled, feed the dogs wrong and run out of food, and ' +
            'then try to drive the team over rotten spring ice. John Thornton ' +
            'tells them not to; they go anyway, and the ice takes all of them. ' +
            'Buck is only alive because Thornton cut him out of the traces ' +
            'first — and the rest of the book is what Buck does for that.',
          focus: { marker: 'white-river', distance: 30 },
          reveal: { markers: ['stewart-river', 'white-river'] },
          highlight: { markers: ['white-river'] },
        },
      ],
    },
    {
      id: 'white-fang',
      title: 'White Fang',
      subtitle: 'London, 1906',
      chapters: [
        {
          id: 'the-wolves',
          title: 'The Trail of the Meat',
          narration:
            'The same country from the other end. Two men take a coffin down a ' +
            'frozen river above the Circle, and a wolf pack follows them, and ' +
            'each night there is one fewer dog. It is the bleakest opening ' +
            'London wrote, and its subject is stated in the first paragraph: ' +
            'the wild does not hate you, which is worse.',
          focus: { marker: 'fort-yukon', distance: 40 },
          reveal: { markers: ['fort-yukon'], routes: ['the-far-north'] },
        },
        {
          id: 'the-camp',
          title: 'Down to the Fort',
          narration:
            'A wolf-dog cub is born in a lynx’s old lair and ends up in a ' +
            'Native camp, then sold to a white man who fights him for money — ' +
            'the mirror image of Buck’s book, a wild thing brought in rather ' +
            'than a tame one driven out. The trade route runs through Fort ' +
            'Yukon and the posts on the river.',
          focus: { marker: 'fort-yukon', distance: 30 },
        },
        {
          id: 'the-south',
          title: 'And Out Again',
          narration:
            'He is bought by a mining engineer and taken south, out of this ' +
            'map entirely, to the same Santa Clara valley Buck was taken from. ' +
            'London wrote the two books as deliberate opposites and said so; ' +
            'the second one ends on a porch in California with puppies on it.',
          focus: { marker: 'circle', distance: 44 },
        },
      ],
    },
    {
      id: 'songs-of-a-sourdough',
      title: 'Songs of a Sourdough',
      subtitle: 'Service, 1907',
      chapters: [
        {
          id: 'sam-mcgee',
          title: 'The Cremation of Sam McGee',
          narration:
            'Service arrived after it was all over and clerked in a bank, ' +
            'which is the correct qualification for writing the definitive ' +
            'tall tale about it. A man from Tennessee who is never warm dies ' +
            'on the trail out of Dawson, having made his friend promise not to ' +
            'bury him in the ice. The friend hauls the corpse down to Lake ' +
            'Laberge, finds a derelict boat, lights her furnace — and opens ' +
            'the door afterwards to find Sam sitting up, comfortable at last.',
          focus: { marker: 'laberge', distance: 30 },
          highlight: { markers: ['laberge'] },
        },
        {
          id: 'dan-mcgrew',
          title: 'The Shooting of Dan McGrew',
          narration:
            'And the other one, set in a Dawson saloon: a stranger comes in ' +
            'out of the cold, plays the piano until everyone in the room ' +
            'understands exactly what he has lost and who has it, and then the ' +
            'lights go out and two shots are fired. Service is not a great ' +
            'poet and did not claim to be. He is the reason most people have ' +
            'any picture of this place at all.',
          focus: { marker: 'dawson', distance: 26 },
          highlight: { markers: ['dawson'] },
        },
      ],
    },
  ],
}
