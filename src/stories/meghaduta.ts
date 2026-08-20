import type { Story } from '../types'
import meghadutaHeight from '../assets/meghaduta-height.png'

/**
 * Meghadūta — Kālidāsa's *Cloud Messenger*, and the most literally mappable
 * poem in this atlas.
 *
 * A yaksha, exiled for a year from Alakā to a hermitage on Ramagiri, sees the
 * first monsoon cloud of the season and asks it to carry a message to his wife.
 * Then — and this is why the poem is here — he TELLS IT THE WAY, place by place
 * and river by river, for the whole of the first half. The Purvamegha is an
 * itinerary. Nobody had to reconstruct this route from hints; the poet dictates
 * it.
 *
 * Read from H. H. Wilson's *The Mégha Dúta, or Cloud Messenger* (1813), the
 * first English translation and long out of copyright. The narration
 * paraphrases and quotes no translation.
 *
 * THE IDENTIFICATIONS, and how firm they are. Some are certain because the poem
 * uses the name still in use — Ujjayinī is Ujjain, Vidiśā is Vidisha,
 * Kurukṣetra is Kurukshetra. Some are the long-standing scholarly reading:
 * Ramagiri as Ramtek above Nagpur, Āmrakūṭa as Amarkantak, the Revā as the
 * Narmada, the Vetravatī as the Betwa, the Charmaṇvatī as the Chambal,
 * Daśapura as Mandsaur. And Alakā is not on Earth at all — it is Kubera's city
 * above Kailāsa, and it is the second level of this world rather than a pin on
 * the first.
 *
 * The map therefore stops being a map at the top, on purpose. Everything below
 * the Himalaya is a place you can go to; everything above it is where the poem
 * goes instead.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 73.5) / 4.75 − 1      map z = (32.5 − lat) / 6.25 − 1
 */
export const meghaduta: Story = {
  id: 'meghaduta',
  title: 'Meghadūta — The Cloud Messenger',
  subtitle: 'A cloud is given directions',
  author: 'Kālidāsa · trans. H. H. Wilson',
  region: 'Ramtek to Kailāsa',
  epoch: 'Sanskrit lyric · c. 4th–5th century',
  group: 'epic',
  earth: { lon: 79.2999, lat: 21.3936, place: 'Ramtek, central India' },
  intro:
    'An exiled spirit asks a passing monsoon cloud to take a message home, ' +
    'and then spends half the poem telling it the route. Press ▶ Play story ' +
    'to follow the cloud north: over the Vindhyas to the Narmada, across ' +
    'Malwa by Vidisha and Ujjain, up the plain past Kurukshetra to where the ' +
    'Ganges comes out of the hills — and then off the map altogether, to a ' +
    'city above Kailāsa that no survey will find.',
  surfaceName: 'India',
  ambient: {
    trees: 0.3,
    treeKind: 'broadleaf',
    treeColor: '#4d7038',
    birds: 9,
    fish: 0,
  },
  terrain: {
    music: {
      // Written for this atlas: a slow rising line that keeps arriving
      // somewhere and going on, which is the shape of the poem.
      //
      // ORIGINAL, and it has to be. Indian classical music is built on ragas
      // whose intervals a Western-tuned synthesiser cannot state, and the rule
      // here is that a named piece ships only when its notation has been read.
      // Nothing Indian is transcribed; this is a piece of programme music
      // about a cloud, written in a mode that this instrument can honestly
      // play.
      title: 'The first cloud of the season',
      credit: 'Original — no raga is transcribed here',
      melody:
        'D4:3 E4:1 G4:2 A4:2 ' +
        'B4:3 A4:1 G4:2 E4:2 ' +
        'G4:2 A4:2 D5:3 B4:1 ' +
        'A4:2 G4:2 E4:2 D4:2',
      bass: 'D3:8 G2:8 A2:8 D3:8',
      tempo: 54,
      voice: 'flute',
      mood: 'wonder',
    },
    seed: 'meghaduta-1', // unused: the heightmap takes precedence
    heightmap: meghadutaHeight,
    /**
     * Zero, and that is a statement rather than an oversight.
     *
     * This box is wholly inland — there is no sea anywhere between Nagpur and
     * Kailāsa — so the waterline is the floor of the range, not a coast. What
     * renders as water is the lakes carved from Natural Earth's polygons,
     * which is what should render as water on a map of the Deccan and the
     * Gangetic plain. `check-dem-scale` reads this and agrees with the preset.
     */
    seaLevel: 0,
    // 949 km across by 1,386 km down — much taller than it is wide, because
    // the cloud flies north.
    aspect: 0.684,
    // Kailāsa is 6,638 m and the high Himalaya stands behind it; the poem's own
    // country runs 150 to 600 m. The preset caps at 5,200 and gammas hard so
    // Malwa and the plain separate at all, and the mesh scale is then kept low
    // so the Himalaya reads as the wall it is rather than as a row of spikes.
    heightScale: 9,
    overhead: true,
    rivers: 0,
    /**
     * Four rivers, and the poem names every one of them.
     *
     * This is the world that most justifies the whole named-river apparatus:
     * `rivers: 0` above, because a procedural course traced downhill from this
     * DEM would be a plausible line that is not any river Kālidāsa mentions,
     * and the entire point here is that he mentions them. The Revā is the
     * Narmada, the Vetravatī is the Betwa, the Charmaṇvatī is the Chambal, and
     * the Gaṅgā is where the cloud is told to bow.
     *
     * Source: Natural Earth 10m river centrelines (public domain), via
     * `scripts/build-river.mjs meghaduta Narmada | Betwa | Chambal | Ganges`.
     */
    namedRivers: [
      {
        name: 'The Gaṅgā',
        marker: 'kanakhala',
        points: [
          { x: 0.3349, z: -0.7422 }, { x: 0.3292, z: -0.7311 }, { x: 0.3349, z: -0.7201 },
          { x: 0.3362, z: -0.7081 }, { x: 0.3256, z: -0.6988 }, { x: 0.3166, z: -0.6875 },
          { x: 0.3021, z: -0.6800 }, { x: 0.2828, z: -0.6881 }, { x: 0.2497, z: -0.6772 },
          { x: 0.2398, z: -0.6676 }, { x: 0.2238, z: -0.6595 }, { x: 0.2145, z: -0.6487 },
          { x: 0.1978, z: -0.6444 }, { x: 0.1622, z: -0.6492 }, { x: 0.1376, z: -0.6429 },
          { x: 0.1165, z: -0.6377 }, { x: 0.0968, z: -0.6388 }, { x: 0.0725, z: -0.6232 },
          { x: 0.0708, z: -0.6117 }, { x: 0.0449, z: -0.6117 }, { x: 0.0326, z: -0.6212 },
          { x: 0.0148, z: -0.6225 }, { x: 0.0063, z: -0.6115 }, { x: -0.0181, z: -0.5920 },
          { x: -0.0188, z: -0.5804 }, { x: -0.0125, z: -0.5668 }, { x: -0.0128, z: -0.5531 },
          { x: -0.0301, z: -0.5447 }, { x: -0.0487, z: -0.5391 }, { x: -0.0544, z: -0.5250 },
          { x: -0.0451, z: -0.5148 }, { x: -0.0420, z: -0.5023 }, { x: -0.0308, z: -0.4846 },
          { x: -0.0276, z: -0.4722 }, { x: -0.0366, z: -0.4493 }, { x: -0.0374, z: -0.4351 },
          { x: -0.0308, z: -0.4236 }, { x: -0.0309, z: -0.4119 }, { x: -0.0231, z: -0.3997 },
          { x: -0.0140, z: -0.3875 }, { x: -0.0115, z: -0.3712 }, { x: 0.0031, z: -0.3582 },
          { x: 0.0046, z: -0.3464 }, { x: 0.0073, z: -0.3334 }, { x: 0.0200, z: -0.3203 },
          { x: 0.0329, z: -0.3098 }, { x: 0.0434, z: -0.3002 }, { x: 0.0619, z: -0.2872 },
          { x: 0.0767, z: -0.2794 }, { x: 0.0972, z: -0.2750 }, { x: 0.1171, z: -0.2706 },
          { x: 0.1358, z: -0.2661 }, { x: 0.1475, z: -0.2558 }, { x: 0.1648, z: -0.2531 },
          { x: 0.1853, z: -0.2524 }, { x: 0.1985, z: -0.2377 }, { x: 0.2138, z: -0.2267 },
          { x: 0.2355, z: -0.2215 }, { x: 0.2557, z: -0.2138 }, { x: 0.2729, z: -0.2077 },
          { x: 0.2771, z: -0.1961 }, { x: 0.2889, z: -0.1868 }, { x: 0.2909, z: -0.1745 },
          { x: 0.3019, z: -0.1642 }, { x: 0.3191, z: -0.1523 }, { x: 0.3343, z: -0.1432 },
          { x: 0.3537, z: -0.1430 }, { x: 0.3664, z: -0.1279 }, { x: 0.3704, z: -0.1153 },
          { x: 0.3873, z: -0.1035 }, { x: 0.3932, z: -0.0886 }, { x: 0.4027, z: -0.0756 },
          { x: 0.4200, z: -0.0691 }, { x: 0.4296, z: -0.0512 }, { x: 0.4407, z: -0.0400 },
          { x: 0.4533, z: -0.0307 }, { x: 0.4758, z: -0.0210 }, { x: 0.4849, z: -0.0021 },
          { x: 0.4946, z: 0.0076 }, { x: 0.5101, z: 0.0216 }, { x: 0.5275, z: 0.0241 },
          { x: 0.5365, z: 0.0346 }, { x: 0.5532, z: 0.0300 }, { x: 0.5709, z: 0.0277 },
          { x: 0.5891, z: 0.0330 }, { x: 0.6038, z: 0.0444 }, { x: 0.6219, z: 0.0497 },
          { x: 0.6262, z: 0.0610 }, { x: 0.6425, z: 0.0655 }, { x: 0.6545, z: 0.0742 },
          { x: 0.6583, z: 0.0873 }, { x: 0.6718, z: 0.0952 }, { x: 0.6875, z: 0.1001 },
          { x: 0.7050, z: 0.1055 }, { x: 0.7174, z: 0.1153 }, { x: 0.7358, z: 0.1207 },
          { x: 0.7562, z: 0.1197 }, { x: 0.7682, z: 0.1299 }, { x: 0.7763, z: 0.1449 },
          { x: 0.7948, z: 0.1464 }, { x: 0.8081, z: 0.1554 }, { x: 0.8277, z: 0.1493 },
          { x: 0.8308, z: 0.1650 }, { x: 0.8470, z: 0.1690 }, { x: 0.8455, z: 0.1567 },
          { x: 0.8585, z: 0.1656 }, { x: 0.8731, z: 0.1583 }, { x: 0.8899, z: 0.1702 },
          { x: 0.9055, z: 0.1747 }, { x: 0.9128, z: 0.1640 }, { x: 0.9336, z: 0.1690 },
          { x: 0.9534, z: 0.1800 }, { x: 0.9728, z: 0.1780 }, { x: 0.9832, z: 0.1689 },
          { x: 0.9991, z: 0.1672 },
        ],
      },
      {
        // Not on the cloud's route, and drawn anyway: the Vetravatī and the
        // Charmaṇvatī are both Yamuna tributaries, and a tributary that stops
        // in the middle of a plain because its trunk river was left out reads
        // as a bug. With it here they end where they really end.
        name: 'The Yamunā',
        points: [
          { x: 0.0189, z: -0.7464 }, { x: 0.0001, z: -0.7344 }, { x: -0.0250, z: -0.7271 },
          { x: -0.0374, z: -0.7180 }, { x: -0.0413, z: -0.7065 }, { x: -0.0586, z: -0.6852 },
          { x: -0.0766, z: -0.6857 }, { x: -0.0965, z: -0.6812 }, { x: -0.1182, z: -0.6728 },
          { x: -0.1373, z: -0.6699 }, { x: -0.1400, z: -0.6520 }, { x: -0.1499, z: -0.6335 },
          { x: -0.1612, z: -0.6245 }, { x: -0.1852, z: -0.6154 }, { x: -0.1968, z: -0.6063 },
          { x: -0.2126, z: -0.5974 }, { x: -0.2252, z: -0.5687 }, { x: -0.2338, z: -0.5584 },
          { x: -0.2447, z: -0.5454 }, { x: -0.2435, z: -0.5330 }, { x: -0.2483, z: -0.5218 },
          { x: -0.2493, z: -0.5080 }, { x: -0.2320, z: -0.5064 }, { x: -0.2350, z: -0.4948 },
          { x: -0.2334, z: -0.4609 }, { x: -0.2275, z: -0.4458 }, { x: -0.2262, z: -0.4341 },
          { x: -0.2183, z: -0.4236 }, { x: -0.2197, z: -0.4115 }, { x: -0.2176, z: -0.3999 },
          { x: -0.2117, z: -0.3857 }, { x: -0.2021, z: -0.3726 }, { x: -0.1926, z: -0.3613 },
          { x: -0.1773, z: -0.3550 }, { x: -0.1646, z: -0.3435 }, { x: -0.1650, z: -0.3304 },
          { x: -0.1518, z: -0.3206 }, { x: -0.1498, z: -0.3090 }, { x: -0.1571, z: -0.2949 },
          { x: -0.1571, z: -0.2832 }, { x: -0.1571, z: -0.2706 }, { x: -0.1470, z: -0.2586 },
          { x: -0.1411, z: -0.2476 }, { x: -0.1223, z: -0.2498 }, { x: -0.1185, z: -0.2345 },
          { x: -0.1174, z: -0.2227 }, { x: -0.1160, z: -0.2109 }, { x: -0.1114, z: -0.1898 },
          { x: -0.0964, z: -0.1827 }, { x: -0.0942, z: -0.1704 }, { x: -0.0770, z: -0.1686 },
          { x: -0.0612, z: -0.1641 }, { x: -0.0467, z: -0.1580 }, { x: -0.0317, z: -0.1497 },
          { x: -0.0129, z: -0.1513 }, { x: -0.0111, z: -0.1380 }, { x: 0.0047, z: -0.1335 },
          { x: 0.0193, z: -0.1401 }, { x: 0.0103, z: -0.1302 }, { x: 0.0274, z: -0.1306 },
          { x: 0.0401, z: -0.1224 }, { x: 0.0536, z: -0.1122 }, { x: 0.0702, z: -0.1087 },
          { x: 0.0896, z: -0.1063 }, { x: 0.1070, z: -0.1040 }, { x: 0.1190, z: -0.0947 },
          { x: 0.1382, z: -0.0869 }, { x: 0.1548, z: -0.0812 }, { x: 0.1652, z: -0.0707 },
          { x: 0.1710, z: -0.0592 }, { x: 0.1916, z: -0.0549 }, { x: 0.2066, z: -0.0457 },
          { x: 0.2050, z: -0.0331 }, { x: 0.2216, z: -0.0278 }, { x: 0.2455, z: -0.0298 },
          { x: 0.2590, z: -0.0214 }, { x: 0.2750, z: -0.0159 }, { x: 0.2734, z: -0.0037 },
          { x: 0.2899, z: -0.0001 }, { x: 0.3084, z: 0.0094 }, { x: 0.3192, z: 0.0214 },
          { x: 0.3362, z: 0.0216 }, { x: 0.3521, z: 0.0155 }, { x: 0.3597, z: 0.0284 },
          { x: 0.3809, z: 0.0278 }, { x: 0.3854, z: 0.0402 }, { x: 0.4042, z: 0.0472 },
          { x: 0.4223, z: 0.0513 }, { x: 0.4445, z: 0.0539 }, { x: 0.4624, z: 0.0551 },
          { x: 0.4815, z: 0.0609 }, { x: 0.4651, z: 0.0664 }, { x: 0.4857, z: 0.0737 },
          { x: 0.4948, z: 0.0845 }, { x: 0.5122, z: 0.0890 }, { x: 0.5309, z: 0.0899 },
          { x: 0.5493, z: 0.0909 }, { x: 0.5664, z: 0.0999 }, { x: 0.5838, z: 0.0999 },
          { x: 0.5810, z: 0.1116 }, { x: 0.5972, z: 0.1182 }, { x: 0.6149, z: 0.1200 },
          { x: 0.6101, z: 0.1342 }, { x: 0.6263, z: 0.1421 }, { x: 0.6464, z: 0.1449 },
          { x: 0.6624, z: 0.1514 }, { x: 0.6784, z: 0.1575 }, { x: 0.7095, z: 0.1443 },
          { x: 0.7272, z: 0.1425 }, { x: 0.7428, z: 0.1476 }, { x: 0.7496, z: 0.1356 },
          { x: 0.7691, z: 0.1337 },
        ],
      },
      {
        name: 'The Charmaṇvatī (Chambal)',
        marker: 'charmanvati',
        points: [
          { x: -0.5437, z: 0.6043 }, { x: -0.5589, z: 0.5977 }, { x: -0.5696, z: 0.5867 },
          { x: -0.5769, z: 0.5751 }, { x: -0.5846, z: 0.5534 }, { x: -0.5768, z: 0.5099 },
          { x: -0.5768, z: 0.4974 }, { x: -0.5797, z: 0.4837 }, { x: -0.5883, z: 0.4733 },
          { x: -0.5998, z: 0.4607 }, { x: -0.6014, z: 0.4471 }, { x: -0.6096, z: 0.4330 },
          { x: -0.6087, z: 0.4124 }, { x: -0.6224, z: 0.4055 }, { x: -0.6255, z: 0.3925 },
          { x: -0.6086, z: 0.3890 }, { x: -0.5945, z: 0.3772 }, { x: -0.5854, z: 0.3672 },
          { x: -0.5762, z: 0.3542 }, { x: -0.5819, z: 0.3418 }, { x: -0.5942, z: 0.3335 },
          { x: -0.6058, z: 0.3214 }, { x: -0.6074, z: 0.3086 }, { x: -0.5903, z: 0.3013 },
          { x: -0.5810, z: 0.2916 }, { x: -0.5627, z: 0.2774 }, { x: -0.5615, z: 0.2635 },
          { x: -0.5774, z: 0.2410 }, { x: -0.5644, z: 0.2331 }, { x: -0.5603, z: 0.2198 },
          { x: -0.5675, z: 0.2084 }, { x: -0.5508, z: 0.1986 }, { x: -0.5328, z: 0.1866 },
          { x: -0.5229, z: 0.1762 }, { x: -0.5063, z: 0.1657 }, { x: -0.4938, z: 0.1563 },
          { x: -0.4766, z: 0.1620 }, { x: -0.4689, z: 0.1485 }, { x: -0.4516, z: 0.1446 },
          { x: -0.4384, z: 0.1227 }, { x: -0.4230, z: 0.1169 }, { x: -0.4149, z: 0.1023 },
          { x: -0.4136, z: 0.0893 }, { x: -0.3972, z: 0.0789 }, { x: -0.3799, z: 0.0731 },
          { x: -0.3664, z: 0.0634 }, { x: -0.3491, z: 0.0591 }, { x: -0.3254, z: 0.0530 },
          { x: -0.3097, z: 0.0467 }, { x: -0.2898, z: 0.0317 }, { x: -0.2763, z: 0.0233 },
          { x: -0.2624, z: 0.0150 }, { x: -0.2458, z: 0.0103 }, { x: -0.2311, z: 0.0017 },
          { x: -0.2147, z: -0.0020 }, { x: -0.2012, z: -0.0093 }, { x: -0.1896, z: -0.0184 },
          { x: -0.1724, z: -0.0198 }, { x: -0.1579, z: -0.0259 }, { x: -0.1333, z: -0.0373 },
          { x: -0.1159, z: -0.0403 }, { x: -0.1005, z: -0.0478 }, { x: -0.0800, z: -0.0591 },
          { x: -0.0669, z: -0.0667 }, { x: -0.0499, z: -0.0713 }, { x: -0.0337, z: -0.0765 },
          { x: -0.0207, z: -0.0853 }, { x: -0.0065, z: -0.0918 }, { x: 0.0160, z: -0.0976 },
          { x: 0.0355, z: -0.0920 }, { x: 0.0523, z: -0.0861 }, { x: 0.0702, z: -0.0809 },
          { x: 0.0933, z: -0.0877 }, { x: 0.1096, z: -0.0822 }, { x: 0.1247, z: -0.0739 },
          { x: 0.1423, z: -0.0730 }, { x: 0.1567, z: -0.0614 }, { x: 0.1733, z: -0.0490 },
          { x: 0.1922, z: -0.0450 }, { x: 0.2094, z: -0.0403 },
        ],
      },
      {
        name: 'The Vetravatī (Betwa)',
        marker: 'vetravati',
        points: [
          { x: -0.1903, z: 0.4815 }, { x: -0.1756, z: 0.4891 }, { x: -0.1660, z: 0.4995 },
          { x: -0.1463, z: 0.5020 }, { x: -0.1295, z: 0.4926 }, { x: -0.1210, z: 0.4810 },
          { x: -0.1148, z: 0.4699 }, { x: -0.1080, z: 0.4498 }, { x: -0.0985, z: 0.4394 },
          { x: -0.0835, z: 0.4212 }, { x: -0.0852, z: 0.4069 }, { x: -0.0850, z: 0.3922 },
          { x: -0.0755, z: 0.3801 }, { x: -0.0603, z: 0.3698 }, { x: -0.0476, z: 0.3537 },
          { x: -0.0456, z: 0.3326 }, { x: -0.0389, z: 0.3196 }, { x: -0.0331, z: 0.3081 },
          { x: -0.0172, z: 0.2959 }, { x: 0.0027, z: 0.2871 }, { x: -0.0055, z: 0.2769 },
          { x: 0.0031, z: 0.2666 }, { x: 0.0029, z: 0.2540 }, { x: -0.0041, z: 0.2425 },
          { x: -0.0110, z: 0.2257 }, { x: -0.0051, z: 0.2118 }, { x: 0.0132, z: 0.2020 },
          { x: 0.0169, z: 0.1894 }, { x: 0.0290, z: 0.1800 }, { x: 0.0473, z: 0.1756 },
          { x: 0.0633, z: 0.1670 }, { x: 0.0842, z: 0.1464 }, { x: 0.0961, z: 0.1307 },
          { x: 0.1020, z: 0.1197 }, { x: 0.1207, z: 0.1153 }, { x: 0.1386, z: 0.1093 },
          { x: 0.1529, z: 0.0943 }, { x: 0.1643, z: 0.0851 }, { x: 0.1708, z: 0.0729 },
          { x: 0.1906, z: 0.0693 }, { x: 0.2079, z: 0.0703 }, { x: 0.2269, z: 0.0758 },
          { x: 0.2439, z: 0.0702 }, { x: 0.2602, z: 0.0628 }, { x: 0.2771, z: 0.0615 },
          { x: 0.2850, z: 0.0511 }, { x: 0.3022, z: 0.0515 }, { x: 0.3172, z: 0.0582 },
          { x: 0.3359, z: 0.0576 }, { x: 0.3531, z: 0.0587 }, { x: 0.3704, z: 0.0580 },
          { x: 0.3865, z: 0.0501 }, { x: 0.4051, z: 0.0520 }, { x: 0.4126, z: 0.0528 },
        ],
      },
      {
        name: 'The Revā (Narmada)',
        marker: 'reva',
        points: [
          { x: 0.6998, z: 0.5594 }, { x: 0.6762, z: 0.5576 }, { x: 0.6648, z: 0.5452 },
          { x: 0.6451, z: 0.5407 }, { x: 0.6280, z: 0.5359 }, { x: 0.6148, z: 0.5287 },
          { x: 0.5967, z: 0.5265 }, { x: 0.5803, z: 0.5303 }, { x: 0.5604, z: 0.5271 },
          { x: 0.5477, z: 0.5119 }, { x: 0.5350, z: 0.5202 }, { x: 0.5114, z: 0.5202 },
          { x: 0.4929, z: 0.5242 }, { x: 0.4807, z: 0.5331 }, { x: 0.4698, z: 0.5435 },
          { x: 0.4735, z: 0.5560 }, { x: 0.4735, z: 0.5676 }, { x: 0.4748, z: 0.5803 },
          { x: 0.4588, z: 0.5882 }, { x: 0.4431, z: 0.5821 }, { x: 0.4391, z: 0.5700 },
          { x: 0.4273, z: 0.5555 }, { x: 0.4099, z: 0.5528 }, { x: 0.3843, z: 0.5563 },
          { x: 0.3701, z: 0.5492 }, { x: 0.3537, z: 0.5396 }, { x: 0.3503, z: 0.5236 },
          { x: 0.3566, z: 0.5122 }, { x: 0.3446, z: 0.5019 }, { x: 0.3248, z: 0.4994 },
          { x: 0.3072, z: 0.5020 }, { x: 0.2895, z: 0.5023 }, { x: 0.2665, z: 0.4981 },
          { x: 0.2488, z: 0.5041 }, { x: 0.2312, z: 0.5029 }, { x: 0.2141, z: 0.5058 },
          { x: 0.1914, z: 0.5090 }, { x: 0.1759, z: 0.5175 }, { x: 0.1586, z: 0.5138 },
          { x: 0.1099, z: 0.5134 }, { x: 0.0893, z: 0.5148 }, { x: 0.0514, z: 0.5191 },
          { x: 0.0350, z: 0.5247 }, { x: 0.0166, z: 0.5336 }, { x: 0.0027, z: 0.5413 },
          { x: -0.0132, z: 0.5379 }, { x: -0.0253, z: 0.5479 }, { x: -0.0436, z: 0.5516 },
          { x: -0.0605, z: 0.5493 }, { x: -0.0770, z: 0.5456 }, { x: -0.1006, z: 0.5544 },
          { x: -0.1285, z: 0.5630 }, { x: -0.1410, z: 0.5711 }, { x: -0.1668, z: 0.5786 },
          { x: -0.1874, z: 0.5846 }, { x: -0.2058, z: 0.5848 }, { x: -0.2253, z: 0.5887 },
          { x: -0.2450, z: 0.5977 }, { x: -0.2706, z: 0.6000 }, { x: -0.2900, z: 0.6068 },
          { x: -0.3069, z: 0.6142 }, { x: -0.3098, z: 0.6276 }, { x: -0.3287, z: 0.6378 },
          { x: -0.3503, z: 0.6424 }, { x: -0.3684, z: 0.6383 }, { x: -0.3799, z: 0.6268 },
          { x: -0.4036, z: 0.6306 }, { x: -0.4228, z: 0.6332 }, { x: -0.4399, z: 0.6415 },
          { x: -0.4578, z: 0.6432 }, { x: -0.4744, z: 0.6482 }, { x: -0.5120, z: 0.6503 },
          { x: -0.5286, z: 0.6547 }, { x: -0.5466, z: 0.6526 }, { x: -0.5856, z: 0.6555 },
          { x: -0.6126, z: 0.6576 }, { x: -0.6306, z: 0.6600 }, { x: -0.6511, z: 0.6623 },
          { x: -0.6700, z: 0.6636 }, { x: -0.6879, z: 0.6678 }, { x: -0.7059, z: 0.6669 },
          { x: -0.7239, z: 0.6690 }, { x: -0.7421, z: 0.6701 }, { x: -0.7706, z: 0.6763 },
          { x: -0.7904, z: 0.6734 }, { x: -0.8077, z: 0.6744 }, { x: -0.8206, z: 0.6821 },
          { x: -0.8349, z: 0.6888 }, { x: -0.8516, z: 0.6920 }, { x: -0.8676, z: 0.6877 },
          { x: -0.9001, z: 0.6958 }, { x: -0.9159, z: 0.7008 }, { x: -0.9384, z: 0.7061 },
          { x: -0.9580, z: 0.7042 }, { x: -0.9704, z: 0.6956 }, { x: -0.9844, z: 0.6877 },
          { x: -0.9997, z: 0.6843 },
        ],
      },
    ],
    // Metre figures from the build log's gamma table. No snow band below the
    // Himalaya: the Deccan and Malwa do not get any, and the poem is set in
    // the rainy season.
    biomes: [
      { maxHeight: 0.0, color: '#2c5f74', name: 'Rivers & lakes' },
      { maxHeight: 0.13, color: '#5f8842', name: 'The Gangetic plain' },
      { maxHeight: 0.22, color: '#6f8a44', name: 'Field & forest' },
      { maxHeight: 0.32, color: '#82874c', name: 'Malwa & the Deccan' },
      { maxHeight: 0.46, color: '#6c7a45', name: 'The Vindhyas & Satpuras' },
      { maxHeight: 0.68, color: '#7d7359', name: 'The foothills' },
      { maxHeight: 0.86, color: '#9a9080', name: 'The high Himalaya' },
      { maxHeight: 1.0, color: '#eef3f7', name: 'Snow' },
    ],
  },

  markers: [
    {
      id: 'ramagiri',
      name: 'Ramagiri',
      kind: 'landmark',
      at: { x: 0.2210, z: 0.7770 },
      description:
        'The hill where the yaksha is serving out his year of exile, and where ' +
        'he sees the cloud. Kālidāsa says its waters were made holy by the ' +
        'bathing of Janaka’s daughter — that is Sītā, so the poem plants its ' +
        'first line inside the Rāmāyaṇa. Read since Wilson as Ramtek, fifty ' +
        'kilometres north-east of Nagpur, which is named for Rāma and holds a ' +
        'temple to him on the ridge.',
      link: {
        world: 'ramayana',
        marker: 'chitrakuta',
        note: 'The exile whose bathing-place this is',
      },
    },
    {
      id: 'amrakuta',
      name: 'Āmrakūṭa',
      kind: 'peak',
      at: { x: 0.7375, z: 0.5485 },
      description:
        'The Mango Peak, where the cloud is told to rest — a hill that will ' +
        'shelter it after the forest fires, and repay it. Read as Amarkantak, ' +
        'the plateau in the Maikal hills where the Narmada rises. The cloud ' +
        'goes on from here to the river itself.',
    },
    {
      id: 'reva',
      name: 'The Revā',
      kind: 'landmark',
      at: { x: 0.6451, z: 0.5407 },
      description:
        'The Narmada, breaking round the rocks at the foot of the Vindhyas — ' +
        'the poem compares it to the pattern painted on an elephant’s flank. ' +
        'Drawn here from published geodata, because at about a kilometre per ' +
        'pixel this map’s elevation data cannot see a river at all.',
    },
    {
      id: 'dasharna',
      name: 'Daśārṇa',
      kind: 'town',
      at: { x: -0.1763, z: 0.4786 },
      description:
        'The country the cloud crosses next, its hedges white with ketaka ' +
        'flower and its village trees full of nesting birds. Roughly the ' +
        'Bhopal country of today; the poem gives it a capital, which is the ' +
        'next marker along.',
    },
    {
      id: 'vidisha',
      name: 'Vidiśā',
      kind: 'city',
      at: { x: -0.0905, z: 0.4352 },
      description:
        'Capital of Daśārṇa, and still called Vidisha. The cloud is told it ' +
        'will get the whole reward of being a lover here, because it can drink ' +
        'from the Vetravatī. This is one of the identifications that needs no ' +
        'argument: the name never changed.',
    },
    {
      id: 'vetravati',
      name: 'The Vetravatī',
      kind: 'landmark',
      at: { x: -0.0985, z: 0.4394 },
      description:
        'The Betwa, running past Vidisha to join the Yamuna far to the ' +
        'north-east. The poem hears it murmuring, and says the sound is the ' +
        'river frowning — the way a woman does, and means something else.',
    },
    {
      id: 'nichaih',
      name: 'The Hill of Nīcaiḥ',
      kind: 'peak',
      at: { x: -0.2600, z: 0.4620 },
      description:
        'A low hill on the road to Ujjayinī, which the poem treats with ' +
        'complete seriousness as a body reacting to the cloud’s touch. There ' +
        'is no agreed modern identification; it is placed here on the line ' +
        'between the two places the poem does name, which is as much as the ' +
        'text supports.',
    },
    {
      id: 'ujjayini',
      name: 'Ujjayinī',
      kind: 'capital',
      at: { x: -0.5179, z: 0.4928 },
      description:
        'Ujjain, on the Śiprā, and the one detour in the whole poem: the cloud ' +
        'is going north and Ujjayinī is west, and it is told to go anyway — ' +
        '“your life would be wasted” otherwise. Kālidāsa spends more verses ' +
        'here than anywhere else on the route. It is generally taken to have ' +
        'been his own city.',
    },
    {
      id: 'dasapura',
      name: 'Daśapura',
      kind: 'town',
      at: { x: -0.6697, z: 0.3485 },
      description:
        'Mandsaur, where the women of the town look up and their eyebrows ' +
        'move like creepers in the wind. The last place in Malwa before the ' +
        'cloud turns north across the Chambal towards the plain.',
    },
    {
      id: 'charmanvati',
      name: 'The Charmaṇvatī',
      kind: 'landmark',
      at: { x: -0.4766, z: 0.1620 },
      description:
        'The Chambal, said in the older stories to have run from the hide of ' +
        'the sacrificed cattle of King Rantideva — which is what its name ' +
        'means. The cloud is told to stoop and drink, and that from above it ' +
        'will look like a single sapphire threaded on a string.',
    },
    {
      id: 'brahmavarta',
      name: 'Brahmāvarta',
      kind: 'landmark',
      at: { x: -0.3600, z: -0.4200 },
      description:
        'The old holy country between the rivers, which the cloud crosses to ' +
        'reach the field of the Kurus. The poem is moving out of the world of ' +
        'towns here and into the world of the epics.',
    },
    {
      id: 'kurukshetra',
      name: 'Kurukṣetra',
      kind: 'battle',
      at: { x: -0.2951, z: -0.5951 },
      description:
        'The field where the Mahābhārata’s war was fought, and where Arjuna ' +
        'sent arrows over the kings’ faces the way the cloud sends rain. Still ' +
        'called Kurukshetra, still there, ninety miles north of Delhi. This ' +
        'is a lyric poem tipping its hat to the epic next door.',
    },
    {
      id: 'kanakhala',
      name: 'Kanakhala',
      kind: 'landmark',
      at: { x: -0.0183, z: -0.5912 },
      description:
        'Where the Ganges comes down out of the mountains onto the plain, at ' +
        'the edge of Haridwar. The cloud is told to bow here. The river it ' +
        'bows to is drawn on this map from its real course.',
    },
    {
      id: 'himalaya',
      name: 'The Himalaya',
      kind: 'peak',
      at: { x: 0.1455, z: -0.7590 },
      description:
        'Where the poem stops naming towns. From here the cloud climbs past ' +
        'musk deer and burning deodars to the pass at Krauñca, which the ' +
        'geese take on their way to Lake Mānasa — and which Paraśurāma is said ' +
        'to have cut through the mountain with an arrow.',
    },
    {
      id: 'kailasa',
      name: 'Kailāsa',
      kind: 'peak',
      at: { x: 0.6447, z: -0.7707 },
      description:
        'The white mountain, 6,638 m, in western Tibet — the last real place ' +
        'in the poem. Alakā sits on its slope, and Alakā is not a real place, ' +
        'so this is where the map ends and the second floor begins. Use the ' +
        'floor switcher.',
    },
  ],

  routes: [
    {
      id: 'the-course',
      name: 'The Way North',
      style: 'solid',
      // Not a blue. The first attempt used the same pale blue as the rivers
      // and the cloud's course vanished into the Yamuna for half its length.
      color: '#e8b04a',
      points: [
        { x: 0.2210, z: 0.7770 },
        { x: 0.7375, z: 0.5485 },
        { x: 0.6451, z: 0.5407 },
        { x: 0.3000, z: 0.5200 },
        { x: -0.0905, z: 0.4352 },
        { x: -0.1763, z: 0.4786 },
        { x: -0.2600, z: 0.4620 },
        { x: -0.5179, z: 0.4928 },
        { x: -0.6697, z: 0.3485 },
        { x: -0.4766, z: 0.1620 },
        { x: -0.3600, z: -0.4200 },
        { x: -0.2951, z: -0.5951 },
        { x: -0.0183, z: -0.5912 },
        { x: 0.1455, z: -0.7590 },
        { x: 0.6447, z: -0.7707 },
      ],
      description:
        'The whole Purvamegha in one line, in the order the yaksha gives it. ' +
        'Note the kink at Ujjayinī: the cloud is going north, Ujjain is west, ' +
        'and it is sent there anyway. It is the only part of the route that is ' +
        'not on the way, and it gets the longest description in the poem.',
    },
  ],

  regions: [
    { id: 'vindhya', name: 'The Vindhyas', at: { x: 0.30, z: 0.62 }, scale: 0.55 },
    { id: 'malwa', name: 'Malwa', at: { x: -0.42, z: 0.40 }, scale: 0.55 },
    { id: 'plain', name: 'The Gangetic Plain', at: { x: -0.10, z: -0.35 }, scale: 0.6 },
    { id: 'himavat', name: 'Himavat', at: { x: 0.30, z: -0.86 }, scale: 0.6 },
  ],

  elements: [
    {
      id: 'the-cloud',
      name: 'The Cloud',
      glyph: '☁',
      description:
        'The messenger, and the only traveller in the poem. It is addressed ' +
        'throughout as a person — asked, flattered, given directions, warned ' +
        'about distractions — and it never answers. Follow it up the map: ' +
        'where the cloud is, is where the poem is.',
      journey: [
        { marker: 'ramagiri', note: 'Seen against the hill on the first day of the rains.' },
        { marker: 'amrakuta', sinceChapter: 2, note: 'Resting on the Mango Peak.' },
        { marker: 'vidisha', sinceChapter: 4, note: 'Drinking from the Vetravatī.' },
        { marker: 'ujjayini', sinceChapter: 5, note: 'The detour that is not on the way.' },
        { marker: 'charmanvati', sinceChapter: 7, note: 'Stooping to the Chambal.' },
        { marker: 'kurukshetra', sinceChapter: 8, note: 'Over the field of the Kurus.' },
        { marker: 'kanakhala', sinceChapter: 9, note: 'Bowing where the Ganges comes down.' },
        { marker: 'kailasa', sinceChapter: 10, note: 'The last mountain on the map.' },
      ],
    },
  ],

  levels: [
    {
      id: 'alaka',
      title: 'Alakā',
      subtitle: 'Kubera’s city, above the snow',
      tier: 1,
      terrain: {
        /**
         * Not a heightmap, and it must not be one.
         *
         * Everywhere else in this world the ground is a real DEM of real
         * country, because the poem names real country. Alakā is the one place
         * it does not: a city of the yakshas on Kailāsa, where the trees flower
         * out of season all year and the clouds are the roofs. Rendering it
         * from elevation data would be claiming a survey nobody has made. So
         * this floor is procedural, and its being procedural is the honest
         * signal that the map has stopped.
         */
        seed: 'alaka-cloudcity',
        sky: 'heaven',
        octaves: 4,
        frequency: 2.6,
        heightScale: 14,
        seaLevel: 0.36,
        islandFalloff: 0.55,
        waterColor: '#cfe6f5',
        biomes: [
          { maxHeight: 0.36, color: '#dceaf6', name: 'The cloud-sea' },
          { maxHeight: 0.5, color: '#e8dfc2', name: 'Terraces' },
          { maxHeight: 0.66, color: '#d8c98c', name: 'Gardens' },
          { maxHeight: 0.82, color: '#e6d59a', name: 'The palaces' },
          { maxHeight: 1.0, color: '#fdf6e0', name: 'The peak of the city' },
        ],
      },
      ambient: { trees: 0.5, treeColor: '#cbb96a', birds: 12, birdKind: 'bird', fish: 0 },
      markers: [
        {
          id: 'the-house',
          name: 'The House with the Arch',
          kind: 'landmark',
          at: { x: -0.12, z: 0.06 },
          description:
            'The yaksha tells the cloud how to find it: north of the lord of ' +
            'wealth’s own house, with a rainbow-shaped arch at the gate, a ' +
            'young aśoka by the wall and a bakula beside it, and a pool with ' +
            'emerald steps. He is describing his own front door to a cloud, ' +
            'from six hundred miles away, in case it forgets.',
        },
        {
          id: 'the-pool',
          name: 'The Pool with Emerald Steps',
          kind: 'landmark',
          at: { x: 0.06, z: 0.2 },
          description:
            'Golden lotuses on it, and a pair of geese that will not leave. ' +
            'One of the four things by which the cloud is to recognise the ' +
            'house — the poem gives directions with the precision of somebody ' +
            'who has thought about nothing else for eight months.',
        },
        {
          id: 'the-wife',
          name: 'His Wife',
          kind: 'landmark',
          at: { x: -0.3, z: -0.12 },
          description:
            'Thin, sleepless, counting the remaining months of the exile with ' +
            'flowers on the threshold. The message the cloud is carrying is ' +
            'four verses long and its whole content is: I am alive, this ends, ' +
            'do not do anything.',
        },
        {
          id: 'kubera',
          name: 'The Lord of Wealth',
          kind: 'capital',
          at: { x: 0.34, z: -0.34 },
          description:
            'Kubera, whose service the yaksha neglected and who exiled him for ' +
            'a year. He is never argued with. The poem is not about justice; ' +
            'it is about the distance.',
        },
      ],
      routes: [
        {
          id: 'to-the-door',
          name: 'Finding the House',
          style: 'dashed',
          color: '#f0e2a8',
          points: [
            { x: 0.34, z: -0.34 },
            { x: 0.06, z: 0.2 },
            { x: -0.12, z: 0.06 },
            { x: -0.3, z: -0.12 },
          ],
          description:
            'North from Kubera’s house, past the pool, to the arch — the ' +
            'directions the yaksha gives for the last hundred yards, which are ' +
            'more detailed than the directions for the previous thousand miles.',
        },
      ],
      regions: [{ id: 'alaka-region', name: 'Alakā', at: { x: 0.0, z: -0.62 }, scale: 0.8 }],
    },
  ],

  chapters: [
    {
      id: 'the-exile',
      title: 'A Year on Ramagiri',
      narration:
        'A yaksha has been careless in the service of the lord of wealth and ' +
        'is exiled for a year to the hermitages on Ramagiri, where the pools ' +
        'are holy because Sītā once bathed in them. Eight months have gone. ' +
        'His gold armlet has slipped down his thinned wrist. Then, on the ' +
        'first day of the rains, a cloud comes and sits on the hill.',
      focus: { marker: 'ramagiri', distance: 34 },
      reveal: {
        markers: ['ramagiri'],
        regions: ['vindhya', 'malwa', 'plain', 'himavat'],
      },
    },
    {
      id: 'the-request',
      title: 'He Speaks to It',
      narration:
        'He offers it flowers and asks it to take a message to his wife in ' +
        'Alakā. Kālidāsa notes, without comment, that a man far from home does ' +
        'not much distinguish between the living and the not-living. The cloud ' +
        'says nothing at all, in the poem or afterwards. Then the directions ' +
        'begin, and they run for sixty verses.',
      focus: { marker: 'ramagiri', distance: 26 },
      reveal: { routes: ['the-course'] },
    },
    {
      id: 'to-the-mango-peak',
      title: 'The Mango Peak',
      narration:
        'North first, then west, keeping clear of the mountains that hold ' +
        'up their peaks to be touched. It will cross fields where the ' +
        'ploughmen’s wives look up at it with no learning and total ' +
        'understanding, and rest on Āmrakūṭa, whose forest fires the cloud ' +
        'once put out, and which will feed it dark ripe mangoes for it.',
      focus: { marker: 'amrakuta', distance: 34 },
      reveal: { markers: ['amrakuta', 'reva'] },
    },
    {
      id: 'the-reva',
      title: 'The Revā at the Rocks',
      narration:
        'Below the peak the Narmada breaks into channels round the boulders ' +
        'at the foot of the Vindhyas, and from above it looks like the ' +
        'painted pattern on an elephant. The cloud is told to drink there ' +
        'until it is heavy — a full cloud is not blown off course, and the ' +
        'poem knows it.',
      focus: { marker: 'reva', distance: 30 },
      highlight: { markers: ['reva'] },
    },
    {
      id: 'dasharna-vidisha',
      title: 'Daśārṇa, and Vidiśā',
      narration:
        'Then the country of Daśārṇa, its hedges white with ketaka and the ' +
        'village trees loud with birds building. Its capital is Vidiśā, and ' +
        'here the cloud gets, the poem says, the entire reward of being a ' +
        'lover — it may drink from the Vetravatī, whose murmur over the banks ' +
        'is a frown that means the opposite of a frown.',
      focus: { marker: 'vidisha', distance: 24 },
      reveal: { markers: ['dasharna', 'vidisha', 'vetravati', 'nichaih'] },
    },
    {
      id: 'ujjayini',
      title: 'The Detour to Ujjayinī',
      narration:
        'The route is north. Ujjayinī is west. Go anyway, the yaksha says, or ' +
        'your life is wasted — and then spends more verses on this city than ' +
        'on anything else in the poem: the Śiprā, the wind off it at dawn, ' +
        'the palace roofs, the evening worship at Mahākāla where the cloud ' +
        'may serve as the drum. It is generally read as Kālidāsa writing about ' +
        'his own city and losing his composure.',
      focus: { marker: 'ujjayini', distance: 26 },
      reveal: { markers: ['ujjayini'] },
      highlight: { markers: ['ujjayini'] },
    },
    {
      id: 'dasapura',
      title: 'Daśapura',
      narration:
        'Out of Ujjayinī and north-west to Daśapura, where the women look up ' +
        'and their eyebrows move like creepers, and their eyes go after the ' +
        'cloud the way bees go after a flower. Then the road turns north for ' +
        'good.',
      focus: { marker: 'dasapura', distance: 26 },
      reveal: { markers: ['dasapura'] },
    },
    {
      id: 'the-charmanvati',
      title: 'A Sapphire on a String',
      narration:
        'The Charmaṇvatī is next — the Chambal, which the old stories say ran ' +
        'from the hides of a king’s sacrificed cattle. The cloud is told to ' +
        'stoop and drink from it, and that the gods looking down will see one ' +
        'dark stone threaded on the white line of the river.',
      focus: { marker: 'charmanvati', distance: 34 },
      reveal: { markers: ['charmanvati'] },
    },
    {
      id: 'kurukshetra',
      title: 'The Field of the Kurus',
      narration:
        'Over the old holy country to Kurukṣetra, where the great war was ' +
        'fought and Arjuna sent arrows into the faces of kings the way this ' +
        'cloud sends rain into lotuses. The poem has left the world of towns ' +
        'and entered the world of the other epic. Its cloud is a tourist ' +
        'there, and Kālidāsa lets it be one.',
      focus: { marker: 'kurukshetra', distance: 40 },
      reveal: { markers: ['brahmavarta', 'kurukshetra'] },
    },
    {
      id: 'kanakhala',
      title: 'Where the Ganges Comes Down',
      narration:
        'At Kanakhala the Ganges leaves the mountains and steps onto the ' +
        'plain, and the cloud is told to bow. The river on this map is the ' +
        'real one, drawn from its published course — the poem names it, so it ' +
        'is not left to a plausible line traced downhill.',
      focus: { marker: 'kanakhala', distance: 30 },
      reveal: { markers: ['kanakhala'] },
      highlight: { markers: ['kanakhala'] },
    },
    {
      id: 'the-mountain',
      title: 'Krauñca, and Kailāsa',
      narration:
        'Up past musk deer and burning deodars to the pass at Krauñca, which ' +
        'the geese use going to Lake Mānasa and which an arrow is said to have ' +
        'cut. Beyond it stands Kailāsa, white, 6,638 metres, in western Tibet. ' +
        'It is the last place in this poem that anyone can go to.',
      focus: { marker: 'kailasa', distance: 44, pitch: 34 },
      reveal: { markers: ['himalaya', 'kailasa'] },
    },
    {
      id: 'alaka',
      title: 'Alakā',
      narration:
        'And then off the map. Alakā sits on the mountain’s slope with clouds ' +
        'caught on its terraces like hair ornaments, where the flowers of ' +
        'every season are out at once and nobody grows old. Nothing here can ' +
        'be surveyed, so this floor is not drawn from elevation data — its ' +
        'being invented is the honest part.',
      level: 'alaka',
      focus: { at: { x: 0, z: 0 }, distance: 44 },
    },
    {
      id: 'the-house',
      title: 'North of the Lord of Wealth’s House',
      narration:
        'He tells the cloud how to find the door: north of Kubera’s own ' +
        'house, an arch shaped like a rainbow at the gate, a young aśoka and a ' +
        'bakula by the wall, a pool with emerald steps and golden lotuses and ' +
        'two geese that will not leave. A man giving a cloud the last hundred ' +
        'yards in more detail than the previous thousand miles.',
      level: 'alaka',
      focus: { marker: 'the-house', distance: 26 },
    },
    {
      id: 'the-message',
      title: 'The Message',
      narration:
        'Inside is his wife, thin, not sleeping, counting off the months with ' +
        'flowers laid on the threshold. The message itself is four verses ' +
        'long and says: I am well, I am here, this ends, do nothing rash. The ' +
        'poem stops without telling us whether the cloud went, or arrived, or ' +
        'spoke. It was never going to. Its subject is the distance, not the ' +
        'delivery.',
      level: 'alaka',
      focus: { marker: 'the-wife', distance: 22 },
      highlight: { markers: ['the-wife'] },
    },
  ],
}
