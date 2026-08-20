import type { Story } from '../types'
import ramayanaHeight from '../assets/ramayana-height.png'

/**
 * The Rāmāyaṇa — a prince exiled for fourteen years, a wife carried off, and
 * three thousand kilometres of India walked to get her back.
 *
 * WHICH RĀMĀYAṆA. There is no single one, and pretending otherwise would be
 * the first mistake available here. This world is read from Vālmīki's Sanskrit
 * text in Ralph T. H. Griffith's verse translation of 1870–74 (Project
 * Gutenberg #24869), which is the oldest surviving version and the one the
 * others answer to. It is not the only one people mean: Kamban's Tamil
 * *Irāmāvatāram*, Tulsīdās's Awadhi *Rāmcharitmānas* — which is the Rāmāyaṇa
 * most of northern India actually knows — Jain and Buddhist retellings in which
 * the story goes differently, and the Southeast Asian ones, including the
 * Ramakien that this atlas discusses in its Thai world. Episodes, motives and
 * endings differ between them. What is mapped here is Vālmīki's route.
 *
 * WHAT THE MARKERS ARE. Every place below is a real place with a real
 * coordinate, and the connection between that place and the poem is
 * TRADITION — long-held, continuously observed, and not archaeology. Panchavati
 * is a neighbourhood of Nashik that has been identified with the poem's
 * Panchavati for centuries; Kishkindha is Hampi by the same kind of long
 * association; Lanka is traditionally Sri Lanka and that identification is not
 * universally accepted. Ayodhya is a live religious and political matter in
 * India today: the marker here stands on the modern city of that name, and
 * nothing in this world is a claim about what is or was beneath any part of it.
 *
 * The narration paraphrases and quotes no translation.
 *
 * WHAT THE RIVERS ARE. Three of the epic's great stations turn out to stand on
 * rivers that published geodata can draw, which is why this world names four:
 * Ayodhya is on the Sarayu, Panchavati on the Godavari, Kishkindha on the
 * Tungabhadra, and Prayaga is where the Ganges takes the Yamuna. Measured
 * against the drawn courses, those markers sit 0.0000, 0.0011, 0.0011 and
 * 0.0025 map units off them.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 71.5) / 7.75 − 1      map z = (28.0 − lat) / 11.25 − 1
 */
export const ramayana: Story = {
  id: 'ramayana',
  title: 'The Rāmāyaṇa',
  subtitle: 'Fourteen years, and the road south',
  author: 'Vālmīki · trans. R. T. H. Griffith',
  region: 'Ayodhya to Lanka',
  epoch: 'Sanskrit epic · composed from c. 5th c. BCE',
  group: 'epic',
  earth: { lon: 82.2044, lat: 26.7992, place: 'Ayodhya, north India' },
  intro:
    'A king keeps a promise he should never have made, and his son walks out ' +
    'of the kingdom for fourteen years. Press ▶ Play story to follow the ' +
    'whole road: the crossing of the Ganges, the years at Chitrakuta, the hut ' +
    'at Panchavati on the Godavari where Sītā is taken, the alliance with the ' +
    'monkeys at Kishkindha, and the causeway south from Rameswaram.',
  surfaceName: 'India',
  ambient: {
    trees: 0.34,
    treeKind: 'broadleaf',
    treeColor: '#416b34',
    birds: 10,
    fish: 3,
  },
  terrain: {
    music: {
      // Written to the shape of the epic's own metre: the anuṣṭubh śloka, a
      // couplet of two eight-syllable halves, recited rather than sung, which
      // is why this returns to the same place at the end of every line.
      //
      // ORIGINAL. Indian classical music is built on ragas whose intervals a
      // Western-tuned synthesiser cannot honestly state, and the rule in this
      // codebase is that a named piece ships only when its notation has been
      // read. Nothing Indian is transcribed here.
      title: 'Śloka',
      credit: 'After the anuṣṭubh metre · original',
      melody:
        'A3:2 B3:1 C4:1 D4:2 C4:1 B3:1 ' +
        'A3:2 C4:1 D4:1 E4:2 D4:2 ' +
        'E4:2 F4:1 E4:1 D4:2 C4:1 D4:1 ' +
        'C4:1 B3:1 A3:2 G3:2 A3:2',
      bass: 'A2:8 A2:8 F2:8 A2:8',
      tempo: 60,
      voice: 'harp',
      mood: 'epic',
    },
    seed: 'ramayana-1', // unused: the heightmap takes precedence
    heightmap: ramayanaHeight,
    // Printed by scripts/build-heightmap.mjs for the `ramayana` preset.
    seaLevel: 0.0033,
    // 1,650 km across by 2,495 km down: the whole length of the subcontinent,
    // because the whole length of it is walked.
    aspect: 0.662,
    // The northern edge clips the Himalaya, which is nowhere in this story;
    // the preset caps at 2,400 m so the Ghats, the Deccan and the Vindhyas —
    // the country the walk actually crosses — get the top of the scale.
    heightScale: 8,
    // Seen from overhead: the story runs the entire length of a map far taller
    // than it is wide, and at the usual low angle everything south of the
    // Godavari sits on the horizon.
    overhead: true,
    rivers: 0,
    /**
     * Four rivers the epic names, drawn from their real courses.
     *
     * `rivers: 0` is the other half of the decision: at about 1.6 km per pixel
     * this DEM cannot see a river, and a course traced downhill from it would
     * be a convincing line that is not the Sarayu, the Godavari or anything
     * else. Since three of this poem's great stations stand ON rivers — and
     * standing on the river is half of what they are — the rivers had to be
     * real or absent.
     *
     * The Sarayu is Natural Earth's Ghaghara, of which the Sarayu is the
     * stretch that runs past Ayodhya.
     *
     * Source: Natural Earth 10m river centrelines (public domain), via
     * `scripts/build-river.mjs ramayana Ghäghara | Ganges | Yamuna | Godävari
     * | Tungabhadra`.
     */
    namedRivers: [
      {
        name: 'The Sarayu',
        marker: 'ayodhya',
        points: [
          { x: 0.2535, z: -1.0000 }, { x: 0.2608, z: -0.9945 }, { x: 0.2625, z: -0.9869 },
          { x: 0.2620, z: -0.9795 }, { x: 0.2636, z: -0.9722 }, { x: 0.2644, z: -0.9628 },
          { x: 0.2686, z: -0.9551 }, { x: 0.2759, z: -0.9486 }, { x: 0.2779, z: -0.9403 },
          { x: 0.2849, z: -0.9339 }, { x: 0.2845, z: -0.9258 }, { x: 0.2876, z: -0.9188 },
          { x: 0.2991, z: -0.9168 }, { x: 0.3158, z: -0.9077 }, { x: 0.3274, z: -0.9019 },
          { x: 0.3328, z: -0.8952 }, { x: 0.3437, z: -0.8936 }, { x: 0.3565, z: -0.8943 },
          { x: 0.3654, z: -0.8976 }, { x: 0.3790, z: -0.8950 }, { x: 0.3860, z: -0.8894 },
          { x: 0.3967, z: -0.8860 }, { x: 0.4056, z: -0.8805 }, { x: 0.4162, z: -0.8808 },
          { x: 0.4260, z: -0.8774 }, { x: 0.4365, z: -0.8769 }, { x: 0.4456, z: -0.8721 },
          { x: 0.4568, z: -0.8737 }, { x: 0.4684, z: -0.8699 }, { x: 0.4844, z: -0.8645 },
          { x: 0.4918, z: -0.8587 }, { x: 0.5030, z: -0.8563 }, { x: 0.5136, z: -0.8556 },
          { x: 0.5255, z: -0.8535 }, { x: 0.5392, z: -0.8463 }, { x: 0.5509, z: -0.8467 },
          { x: 0.5752, z: -0.8460 }, { x: 0.5905, z: -0.8401 }, { x: 0.5977, z: -0.8348 },
          { x: 0.6114, z: -0.8327 }, { x: 0.6211, z: -0.8303 }, { x: 0.6311, z: -0.8285 },
          { x: 0.6395, z: -0.8236 }, { x: 0.6443, z: -0.8172 }, { x: 0.6559, z: -0.8168 },
          { x: 0.6655, z: -0.8142 }, { x: 0.6777, z: -0.8105 }, { x: 0.6910, z: -0.8044 },
          { x: 0.6957, z: -0.7986 }, { x: 0.7049, z: -0.7993 },
        ],
      },
      {
        // No marker of its own: Ayodhya, Śṛṅgverapura, Prayāga and Chitrakūṭa
        // all lie within two hundred kilometres and a fifth pin on the same
        // stretch of river turned the top of the map into one unreadable
        // cluster. Prayāga stands at the confluence and speaks for both rivers.
        name: 'The Gaṅgā',
        points: [
          { x: -0.0820, z: -0.9996 }, { x: -0.0695, z: -0.9972 }, { x: -0.0573, z: -0.9948 },
          { x: -0.0458, z: -0.9923 }, { x: -0.0386, z: -0.9866 }, { x: -0.0280, z: -0.9850 },
          { x: -0.0155, z: -0.9847 }, { x: -0.0074, z: -0.9765 }, { x: 0.0020, z: -0.9704 },
          { x: 0.0153, z: -0.9675 }, { x: 0.0277, z: -0.9632 }, { x: 0.0383, z: -0.9598 },
          { x: 0.0408, z: -0.9534 }, { x: 0.0481, z: -0.9482 }, { x: 0.0492, z: -0.9414 },
          { x: 0.0560, z: -0.9357 }, { x: 0.0665, z: -0.9290 }, { x: 0.0759, z: -0.9240 },
          { x: 0.0878, z: -0.9239 }, { x: 0.0955, z: -0.9155 }, { x: 0.0980, z: -0.9085 },
          { x: 0.1084, z: -0.9019 }, { x: 0.1120, z: -0.8937 }, { x: 0.1178, z: -0.8865 },
          { x: 0.1284, z: -0.8828 }, { x: 0.1343, z: -0.8729 }, { x: 0.1411, z: -0.8667 },
          { x: 0.1488, z: -0.8615 }, { x: 0.1626, z: -0.8561 }, { x: 0.1682, z: -0.8456 },
          { x: 0.1741, z: -0.8402 }, { x: 0.1836, z: -0.8324 }, { x: 0.1943, z: -0.8311 },
          { x: 0.1998, z: -0.8252 }, { x: 0.2100, z: -0.8278 }, { x: 0.2209, z: -0.8291 },
          { x: 0.2320, z: -0.8261 }, { x: 0.2410, z: -0.8198 }, { x: 0.2521, z: -0.8168 },
          { x: 0.2548, z: -0.8105 }, { x: 0.2648, z: -0.8081 }, { x: 0.2721, z: -0.8032 },
          { x: 0.2744, z: -0.7959 }, { x: 0.2827, z: -0.7915 }, { x: 0.2923, z: -0.7888 },
          { x: 0.3031, z: -0.7859 }, { x: 0.3106, z: -0.7804 }, { x: 0.3220, z: -0.7774 },
          { x: 0.3344, z: -0.7780 }, { x: 0.3418, z: -0.7723 }, { x: 0.3468, z: -0.7640 },
          { x: 0.3581, z: -0.7631 }, { x: 0.3662, z: -0.7581 }, { x: 0.3782, z: -0.7615 },
          { x: 0.3802, z: -0.7528 }, { x: 0.3901, z: -0.7505 }, { x: 0.3892, z: -0.7574 },
          { x: 0.3971, z: -0.7525 }, { x: 0.4061, z: -0.7565 }, { x: 0.4164, z: -0.7499 },
          { x: 0.4259, z: -0.7474 }, { x: 0.4304, z: -0.7533 }, { x: 0.4432, z: -0.7505 },
          { x: 0.4553, z: -0.7444 }, { x: 0.4672, z: -0.7455 }, { x: 0.4736, z: -0.7506 },
          { x: 0.4849, z: -0.7521 }, { x: 0.4847, z: -0.7590 }, { x: 0.5013, z: -0.7624 },
          { x: 0.5068, z: -0.7698 }, { x: 0.5037, z: -0.7764 }, { x: 0.5113, z: -0.7809 },
          { x: 0.5214, z: -0.7776 }, { x: 0.5333, z: -0.7773 }, { x: 0.5462, z: -0.7709 },
          { x: 0.5472, z: -0.7793 }, { x: 0.5612, z: -0.7852 }, { x: 0.5733, z: -0.7880 },
          { x: 0.5800, z: -0.7823 }, { x: 0.5922, z: -0.7797 }, { x: 0.6023, z: -0.7822 },
          { x: 0.6133, z: -0.7874 }, { x: 0.6204, z: -0.7932 }, { x: 0.6314, z: -0.7988 },
          { x: 0.6414, z: -0.7951 }, { x: 0.6527, z: -0.7990 }, { x: 0.6629, z: -0.8008 },
          { x: 0.6728, z: -0.7966 }, { x: 0.6852, z: -0.7957 }, { x: 0.6991, z: -0.7961 },
          { x: 0.7096, z: -0.8003 }, { x: 0.7230, z: -0.7967 }, { x: 0.7354, z: -0.7982 },
          { x: 0.7495, z: -0.7981 }, { x: 0.7579, z: -0.7919 }, { x: 0.7690, z: -0.7890 },
          { x: 0.7771, z: -0.7838 }, { x: 0.7896, z: -0.7790 }, { x: 0.8008, z: -0.7811 },
          { x: 0.8141, z: -0.7799 }, { x: 0.8238, z: -0.7752 }, { x: 0.8351, z: -0.7781 },
          { x: 0.8491, z: -0.7782 }, { x: 0.8640, z: -0.7700 }, { x: 0.8734, z: -0.7653 },
          { x: 0.8844, z: -0.7627 }, { x: 0.8949, z: -0.7617 }, { x: 0.9064, z: -0.7616 },
          { x: 0.9197, z: -0.7609 }, { x: 0.9285, z: -0.7655 }, { x: 0.9339, z: -0.7718 },
          { x: 0.9438, z: -0.7765 }, { x: 0.9458, z: -0.7667 }, { x: 0.9498, z: -0.7603 },
          { x: 0.9605, z: -0.7561 }, { x: 0.9719, z: -0.7578 }, { x: 0.9817, z: -0.7636 },
          { x: 0.9967, z: -0.7590 }, { x: 0.9995, z: -0.7581 },
        ],
      },
      {
        name: 'The Yamunā',
        marker: 'prayaga',
        points: [
          { x: -0.2242, z: -1.0000 }, { x: -0.2245, z: -0.9928 }, { x: -0.2174, z: -0.9878 },
          { x: -0.2122, z: -0.9821 }, { x: -0.2013, z: -0.9820 }, { x: -0.2016, z: -0.9747 },
          { x: -0.2010, z: -0.9682 }, { x: -0.2001, z: -0.9616 }, { x: -0.1973, z: -0.9499 },
          { x: -0.1881, z: -0.9459 }, { x: -0.1868, z: -0.9391 }, { x: -0.1762, z: -0.9381 },
          { x: -0.1665, z: -0.9356 }, { x: -0.1577, z: -0.9322 }, { x: -0.1485, z: -0.9276 },
          { x: -0.1369, z: -0.9285 }, { x: -0.1358, z: -0.9211 }, { x: -0.1262, z: -0.9186 },
          { x: -0.1172, z: -0.9223 }, { x: -0.1227, z: -0.9168 }, { x: -0.1123, z: -0.9170 },
          { x: -0.1045, z: -0.9124 }, { x: -0.0962, z: -0.9068 }, { x: -0.0860, z: -0.9048 },
          { x: -0.0741, z: -0.9035 }, { x: -0.0635, z: -0.9022 }, { x: -0.0561, z: -0.8970 },
          { x: -0.0443, z: -0.8927 }, { x: -0.0341, z: -0.8896 }, { x: -0.0278, z: -0.8837 },
          { x: -0.0243, z: -0.8773 }, { x: -0.0116, z: -0.8750 }, { x: -0.0024, z: -0.8698 },
          { x: -0.0034, z: -0.8628 }, { x: 0.0068, z: -0.8599 }, { x: 0.0214, z: -0.8610 },
          { x: 0.0297, z: -0.8563 }, { x: 0.0395, z: -0.8533 }, { x: 0.0385, z: -0.8465 },
          { x: 0.0486, z: -0.8445 }, { x: 0.0600, z: -0.8392 }, { x: 0.0666, z: -0.8326 },
          { x: 0.0770, z: -0.8324 }, { x: 0.0868, z: -0.8359 }, { x: 0.0914, z: -0.8287 },
          { x: 0.1044, z: -0.8290 }, { x: 0.1072, z: -0.8221 }, { x: 0.1187, z: -0.8182 },
          { x: 0.1298, z: -0.8160 }, { x: 0.1434, z: -0.8145 }, { x: 0.1544, z: -0.8139 },
          { x: 0.1661, z: -0.8106 }, { x: 0.1560, z: -0.8076 }, { x: 0.1687, z: -0.8035 },
          { x: 0.1743, z: -0.7975 }, { x: 0.1849, z: -0.7950 }, { x: 0.1964, z: -0.7945 },
          { x: 0.2076, z: -0.7939 }, { x: 0.2181, z: -0.7889 }, { x: 0.2288, z: -0.7889 },
          { x: 0.2271, z: -0.7824 }, { x: 0.2370, z: -0.7788 }, { x: 0.2479, z: -0.7778 },
          { x: 0.2449, z: -0.7699 }, { x: 0.2548, z: -0.7655 }, { x: 0.2671, z: -0.7640 },
          { x: 0.2769, z: -0.7603 }, { x: 0.2867, z: -0.7569 }, { x: 0.3058, z: -0.7643 },
          { x: 0.3167, z: -0.7653 }, { x: 0.3262, z: -0.7625 }, { x: 0.3304, z: -0.7691 },
          { x: 0.3423, z: -0.7702 },
        ],
      },
      {
        name: 'The Godāvarī',
        marker: 'panchavati',
        points: [
          { x: -0.7223, z: -0.2900 }, { x: -0.7112, z: -0.2917 }, { x: -0.7004, z: -0.2887 },
          { x: -0.6900, z: -0.2888 }, { x: -0.6799, z: -0.2889 }, { x: -0.6722, z: -0.2929 },
          { x: -0.6624, z: -0.2907 }, { x: -0.6520, z: -0.2885 }, { x: -0.6402, z: -0.2853 },
          { x: -0.6272, z: -0.2827 }, { x: -0.6175, z: -0.2786 }, { x: -0.6072, z: -0.2753 },
          { x: -0.5998, z: -0.2701 }, { x: -0.5881, z: -0.2683 }, { x: -0.5775, z: -0.2668 },
          { x: -0.5704, z: -0.2597 }, { x: -0.5591, z: -0.2582 }, { x: -0.5463, z: -0.2559 },
          { x: -0.5338, z: -0.2534 }, { x: -0.5231, z: -0.2518 }, { x: -0.5072, z: -0.2452 },
          { x: -0.4985, z: -0.2419 }, { x: -0.4901, z: -0.2371 }, { x: -0.4777, z: -0.2346 },
          { x: -0.4604, z: -0.2322 }, { x: -0.4505, z: -0.2337 }, { x: -0.4407, z: -0.2334 },
          { x: -0.4304, z: -0.2346 }, { x: -0.4300, z: -0.2271 }, { x: -0.4203, z: -0.2294 },
          { x: -0.4114, z: -0.2261 }, { x: -0.3984, z: -0.2265 }, { x: -0.3880, z: -0.2230 },
          { x: -0.3778, z: -0.2227 }, { x: -0.3748, z: -0.2143 }, { x: -0.3672, z: -0.2090 },
          { x: -0.3571, z: -0.2077 }, { x: -0.3470, z: -0.2100 }, { x: -0.3380, z: -0.2061 },
          { x: -0.3321, z: -0.2009 }, { x: -0.3216, z: -0.1991 }, { x: -0.3128, z: -0.2040 },
          { x: -0.3024, z: -0.2045 }, { x: -0.2934, z: -0.2088 }, { x: -0.2828, z: -0.2078 },
          { x: -0.2731, z: -0.2060 }, { x: -0.2637, z: -0.2093 }, { x: -0.2533, z: -0.2127 },
          { x: -0.2437, z: -0.2141 }, { x: -0.2385, z: -0.2065 }, { x: -0.2295, z: -0.2015 },
          { x: -0.2187, z: -0.1993 }, { x: -0.2119, z: -0.1944 }, { x: -0.2014, z: -0.1902 },
          { x: -0.1903, z: -0.1883 }, { x: -0.1810, z: -0.1861 }, { x: -0.1696, z: -0.1848 },
          { x: -0.1575, z: -0.1887 }, { x: -0.1500, z: -0.1932 }, { x: -0.1423, z: -0.1972 },
          { x: -0.1335, z: -0.2002 }, { x: -0.1244, z: -0.1971 }, { x: -0.1140, z: -0.1984 },
          { x: -0.1037, z: -0.1967 }, { x: -0.0939, z: -0.1959 }, { x: -0.0847, z: -0.1987 },
          { x: -0.0759, z: -0.2023 }, { x: -0.0641, z: -0.2011 }, { x: -0.0534, z: -0.2052 },
          { x: -0.0427, z: -0.2032 }, { x: -0.0307, z: -0.2072 }, { x: -0.0210, z: -0.2011 },
          { x: -0.0170, z: -0.1946 }, { x: -0.0092, z: -0.1891 }, { x: 0.0002, z: -0.1865 },
          { x: 0.0108, z: -0.1841 }, { x: 0.0205, z: -0.1875 }, { x: 0.0340, z: -0.1820 },
          { x: 0.0435, z: -0.1792 }, { x: 0.0528, z: -0.1750 }, { x: 0.0665, z: -0.1725 },
          { x: 0.0744, z: -0.1791 }, { x: 0.0753, z: -0.1859 }, { x: 0.0926, z: -0.1819 },
          { x: 0.1018, z: -0.1780 }, { x: 0.1085, z: -0.1731 }, { x: 0.1187, z: -0.1725 },
          { x: 0.1292, z: -0.1734 }, { x: 0.1377, z: -0.1691 }, { x: 0.1463, z: -0.1655 },
          { x: 0.1458, z: -0.1586 }, { x: 0.1491, z: -0.1524 }, { x: 0.1569, z: -0.1484 },
          { x: 0.1585, z: -0.1404 }, { x: 0.1641, z: -0.1344 }, { x: 0.1855, z: -0.1258 },
          { x: 0.1969, z: -0.1132 }, { x: 0.2071, z: -0.1091 }, { x: 0.2123, z: -0.1032 },
          { x: 0.2103, z: -0.0960 }, { x: 0.2093, z: -0.0895 }, { x: 0.2114, z: -0.0818 },
          { x: 0.2226, z: -0.0793 }, { x: 0.2305, z: -0.0747 }, { x: 0.2408, z: -0.0762 },
          { x: 0.2518, z: -0.0727 }, { x: 0.2620, z: -0.0695 }, { x: 0.2706, z: -0.0658 },
          { x: 0.2814, z: -0.0629 }, { x: 0.2946, z: -0.0608 }, { x: 0.3046, z: -0.0574 },
          { x: 0.3070, z: -0.0506 }, { x: 0.3100, z: -0.0423 }, { x: 0.3131, z: -0.0361 },
          { x: 0.3173, z: -0.0296 }, { x: 0.3231, z: -0.0237 }, { x: 0.3211, z: -0.0171 },
          { x: 0.3229, z: -0.0073 }, { x: 0.3265, z: -0.0009 }, { x: 0.3308, z: 0.0066 },
          { x: 0.3360, z: 0.0124 }, { x: 0.3366, z: 0.0191 }, { x: 0.3303, z: 0.0246 },
          { x: 0.3224, z: 0.0296 }, { x: 0.3176, z: 0.0389 },
        ],
      },
      {
        // Drawn so the Tungabhadrā has somewhere to end. It joins the Krishna
        // at Sangameshwaram and the Krishna runs on to the Bay of Bengal;
        // without it the Tungabhadrā stopped in open country, which is what a
        // stalled procedural course looks like and is not what this is.
        name: 'The Krishna',
        points: [
          { x: -0.7037, z: -0.1104 }, { x: -0.6863, z: -0.1031 }, { x: -0.6807, z: -0.0948 },
          { x: -0.6728, z: -0.0902 }, { x: -0.6705, z: -0.0832 }, { x: -0.6612, z: -0.0793 },
          { x: -0.6590, z: -0.0704 }, { x: -0.6656, z: -0.0640 }, { x: -0.6634, z: -0.0570 },
          { x: -0.6545, z: -0.0493 }, { x: -0.6518, z: -0.0421 }, { x: -0.6472, z: -0.0344 },
          { x: -0.6382, z: -0.0318 }, { x: -0.6301, z: -0.0281 }, { x: -0.6200, z: -0.0258 },
          { x: -0.6166, z: -0.0186 }, { x: -0.6064, z: -0.0117 }, { x: -0.5989, z: -0.0054 },
          { x: -0.5920, z: -0.0008 }, { x: -0.5993, z: 0.0045 }, { x: -0.5896, z: 0.0103 },
          { x: -0.5769, z: 0.0141 }, { x: -0.5682, z: 0.0083 }, { x: -0.5568, z: 0.0103 },
          { x: -0.5471, z: 0.0091 }, { x: -0.5362, z: 0.0187 }, { x: -0.5284, z: 0.0142 },
          { x: -0.5169, z: 0.0122 }, { x: -0.5074, z: 0.0146 }, { x: -0.4973, z: 0.0180 },
          { x: -0.4892, z: 0.0226 }, { x: -0.4917, z: 0.0289 }, { x: -0.4817, z: 0.0249 },
          { x: -0.4729, z: 0.0281 }, { x: -0.4627, z: 0.0285 }, { x: -0.4553, z: 0.0328 },
          { x: -0.4459, z: 0.0359 }, { x: -0.4357, z: 0.0355 }, { x: -0.4215, z: 0.0389 },
          { x: -0.4125, z: 0.0425 }, { x: -0.4091, z: 0.0491 }, { x: -0.3983, z: 0.0499 },
          { x: -0.3885, z: 0.0521 }, { x: -0.3778, z: 0.0496 }, { x: -0.3700, z: 0.0441 },
          { x: -0.3601, z: 0.0449 }, { x: -0.3504, z: 0.0385 }, { x: -0.3402, z: 0.0359 },
          { x: -0.3309, z: 0.0319 }, { x: -0.3222, z: 0.0286 }, { x: -0.3123, z: 0.0284 },
          { x: -0.3044, z: 0.0232 }, { x: -0.2945, z: 0.0212 }, { x: -0.2837, z: 0.0205 },
          { x: -0.2730, z: 0.0238 }, { x: -0.2569, z: 0.0297 }, { x: -0.2395, z: 0.0328 },
          { x: -0.2293, z: 0.0328 }, { x: -0.2191, z: 0.0353 }, { x: -0.2070, z: 0.0354 },
          { x: -0.1955, z: 0.0376 }, { x: -0.1793, z: 0.0446 }, { x: -0.1696, z: 0.0541 },
          { x: -0.1537, z: 0.0636 }, { x: -0.1447, z: 0.0663 }, { x: -0.1365, z: 0.0712 },
          { x: -0.1285, z: 0.0674 }, { x: -0.1184, z: 0.0620 }, { x: -0.1097, z: 0.0592 },
          { x: -0.0968, z: 0.0583 }, { x: -0.0877, z: 0.0617 }, { x: -0.0780, z: 0.0603 },
          { x: -0.0666, z: 0.0640 }, { x: -0.0556, z: 0.0624 }, { x: -0.0530, z: 0.0556 },
          { x: -0.0442, z: 0.0528 }, { x: -0.0326, z: 0.0462 }, { x: -0.0204, z: 0.0463 },
          { x: -0.0085, z: 0.0470 }, { x: -0.0030, z: 0.0409 }, { x: -0.0050, z: 0.0331 },
          { x: -0.0039, z: 0.0246 }, { x: -0.0003, z: 0.0174 }, { x: 0.0114, z: 0.0146 },
          { x: 0.0216, z: 0.0142 }, { x: 0.0318, z: 0.0098 }, { x: 0.0419, z: 0.0092 },
          { x: 0.0511, z: 0.0068 }, { x: 0.0608, z: 0.0054 }, { x: 0.0702, z: 0.0025 },
          { x: 0.0816, z: 0.0042 }, { x: 0.0851, z: 0.0106 }, { x: 0.1001, z: 0.0033 },
          { x: 0.1036, z: -0.0031 }, { x: 0.1143, z: -0.0001 }, { x: 0.1143, z: 0.0069 },
          { x: 0.1216, z: 0.0122 }, { x: 0.1319, z: 0.0151 }, { x: 0.1430, z: 0.0151 },
          { x: 0.1541, z: 0.0145 }, { x: 0.1650, z: 0.0168 }, { x: 0.1746, z: 0.0217 },
          { x: 0.1849, z: 0.0279 }, { x: 0.1894, z: 0.0349 }, { x: 0.1973, z: 0.0389 },
          { x: 0.2050, z: 0.0521 }, { x: 0.2107, z: 0.0654 },
        ],
      },
      {
        name: 'The Tungabhadrā',
        marker: 'kishkindha',
        points: [
          { x: -0.5073, z: 0.3130 }, { x: -0.4975, z: 0.3110 }, { x: -0.4876, z: 0.3086 },
          { x: -0.4871, z: 0.3018 }, { x: -0.4840, z: 0.2955 }, { x: -0.4799, z: 0.2892 },
          { x: -0.4747, z: 0.2837 }, { x: -0.4775, z: 0.2768 }, { x: -0.4669, z: 0.2700 },
          { x: -0.4586, z: 0.2644 }, { x: -0.4587, z: 0.2545 }, { x: -0.4597, z: 0.2474 },
          { x: -0.4610, z: 0.2406 }, { x: -0.4599, z: 0.2337 }, { x: -0.4624, z: 0.2275 },
          { x: -0.4654, z: 0.2202 }, { x: -0.4686, z: 0.2121 }, { x: -0.4664, z: 0.2053 },
          { x: -0.4604, z: 0.1997 }, { x: -0.4458, z: 0.1957 }, { x: -0.4447, z: 0.1877 },
          { x: -0.4535, z: 0.1826 }, { x: -0.4570, z: 0.1765 }, { x: -0.4623, z: 0.1702 },
          { x: -0.4604, z: 0.1632 }, { x: -0.4440, z: 0.1527 }, { x: -0.4347, z: 0.1505 },
          { x: -0.4318, z: 0.1439 }, { x: -0.4215, z: 0.1428 }, { x: -0.4111, z: 0.1414 },
          { x: -0.4034, z: 0.1368 }, { x: -0.3898, z: 0.1355 }, { x: -0.3801, z: 0.1327 },
          { x: -0.3756, z: 0.1267 }, { x: -0.3649, z: 0.1257 }, { x: -0.3541, z: 0.1235 },
          { x: -0.3460, z: 0.1196 }, { x: -0.3365, z: 0.1164 }, { x: -0.3270, z: 0.1114 },
          { x: -0.3172, z: 0.1104 }, { x: -0.3128, z: 0.1035 }, { x: -0.3089, z: 0.0968 },
          { x: -0.3022, z: 0.0919 }, { x: -0.2808, z: 0.0737 }, { x: -0.2718, z: 0.0702 },
          { x: -0.2611, z: 0.0688 }, { x: -0.2508, z: 0.0705 }, { x: -0.2350, z: 0.0706 },
          { x: -0.2176, z: 0.0727 }, { x: -0.2076, z: 0.0755 }, { x: -0.1937, z: 0.0758 },
          { x: -0.1807, z: 0.0761 }, { x: -0.1690, z: 0.0753 }, { x: -0.1500, z: 0.0815 },
          { x: -0.1430, z: 0.0766 }, { x: -0.1338, z: 0.0731 }, { x: -0.1307, z: 0.0694 },
        ],
      },
    ],
    // Metre figures from the build log's gamma table. The top band is bare
    // range rather than snow: nothing in this box above the clipped northern
    // edge carries any, and the story never goes near what does.
    biomes: [
      { maxHeight: 0.0033, color: '#1f5570', name: 'The sea' },
      { maxHeight: 0.09, color: '#7ca050', name: 'Coast & delta' },
      { maxHeight: 0.20, color: '#6f9346', name: 'The river plain' },
      { maxHeight: 0.34, color: '#87904c', name: 'The Deccan' },
      { maxHeight: 0.50, color: '#6e8244', name: 'Forest & upland' },
      { maxHeight: 0.70, color: '#77764c', name: 'The Ghats & Vindhyas' },
      { maxHeight: 1.0, color: '#9c9384', name: 'The high ranges' },
    ],
  },

  markers: [
    {
      id: 'ayodhya',
      name: 'Ayodhya',
      kind: 'capital',
      at: { x: 0.3812, z: -0.8933 },
      description:
        'Rāma’s city, on the Sarayu — and the marker stands exactly on the ' +
        'drawn river, 0.0000 map units off it. Everything starts here: an old ' +
        'king, a promise made years earlier to a younger queen, and the ' +
        'moment she calls it in. The identification of this place with the ' +
        'poem’s Ayodhyā is tradition, continuously held; nothing here is a ' +
        'claim about the modern city.',
    },
    {
      id: 'mithila',
      name: 'Mithilā',
      kind: 'city',
      at: { x: 0.8613, z: -0.8870 },
      description:
        'Janaka’s kingdom away to the east, where Sītā is found in a furrow ' +
        'and later won by the only man who can bend — and break — the bow of ' +
        'Śiva. Traditionally Janakpur, just over the Nepal border. This is the ' +
        'one journey in the epic that goes the wrong way, east instead of ' +
        'south, and it happens before the trouble starts.',
    },
    {
      id: 'shringverapura',
      name: 'Śṛṅgverapura',
      kind: 'town',
      at: { x: 0.3086, z: -0.7859 },
      description:
        'The ferry on the Ganges, where Guha the boatman — a forest chief, ' +
        'not a courtier — takes the three of them across, and where Rāma sends ' +
        'the chariot back. The moment the exile becomes real is a man ' +
        'declining a lift home.',
    },
    {
      id: 'prayaga',
      name: 'Prayāga',
      kind: 'landmark',
      at: { x: 0.3350, z: -0.7721 },
      description:
        'Where the Yamunā comes into the Ganges, and where the sage Bharadvāja ' +
        'keeps his hermitage and tells them where to go next. Both rivers are ' +
        'drawn on this map; the marker sits 0.0025 from the Yamunā and 0.0036 ' +
        'from the Ganges, which is what a confluence should measure.',
    },
    {
      id: 'chitrakuta',
      name: 'Chitrakūṭa',
      kind: 'landmark',
      at: { x: 0.2393, z: -0.7526 },
      description:
        'The hill where they build the first hut and live, by the poem’s own ' +
        'account, happily. Bharata comes here with an army to beg his brother ' +
        'to come home and be king, is refused, and takes Rāma’s sandals back ' +
        'to put on the throne instead — the most-quoted refusal in the epic. ' +
        'Still Chitrakoot, still a place of pilgrimage.',
    },
    {
      id: 'dandaka',
      name: 'The Daṇḍaka Forest',
      kind: 'forest',
      at: { x: -0.2000, z: -0.4600 },
      description:
        'The great forest of the interior, which the poem treats as one place ' +
        'and which is really most of central India. Ten of the fourteen years ' +
        'pass in here, moving between hermitages. The marker is a region ' +
        'rather than a site: the text gives no coordinate and this one does ' +
        'not pretend to.',
    },
    {
      id: 'panchavati',
      name: 'Pañcavaṭī',
      kind: 'landmark',
      at: { x: -0.7045, z: -0.2887 },
      description:
        'The hut on the Godāvarī where the last of the exile is spent, and ' +
        'where it all goes wrong: Śūrpaṇakhā is disfigured, her brothers’ army ' +
        'is destroyed, and Rāvaṇa answers by sending a golden deer. Sītā is ' +
        'carried off from here. Traditionally the Panchavati quarter of ' +
        'Nashik; the marker sits 0.0011 from the drawn river.',
    },
    {
      id: 'panchavati-river',
      name: 'The Godāvarī',
      kind: 'landmark',
      at: { x: -0.6520, z: -0.2885 },
      description:
        'The river the hut stands on, running south-east across the whole ' +
        'Deccan to the Bay of Bengal. Drawn from its real course: at this ' +
        'map’s resolution the elevation data cannot see a river, and this one ' +
        'is half of what Panchavati means.',
    },
    {
      id: 'jatayu',
      name: 'Where Jaṭāyu Fell',
      kind: 'battle',
      at: { x: -0.2117, z: 0.2619 },
      description:
        'The old vulture who was a friend of Rāma’s father attacks the flying ' +
        'chariot, is cut down, and lives just long enough to say which way ' +
        'they went — south. Traditionally Lepakshi in Andhra Pradesh, whose ' +
        'name is read as *le pakshi*, “rise, bird”.',
    },
    {
      id: 'kishkindha',
      name: 'Kiṣkindhā',
      kind: 'city',
      at: { x: -0.3597, z: 0.1258 },
      description:
        'The monkey kingdom on the Tungabhadrā, among the boulders — ' +
        'traditionally Hampi, and the marker sits 0.0011 from the drawn ' +
        'river. Rāma kills Vālin from cover, which the poem itself has ' +
        'characters argue about, puts Sugrīva on the throne, and gains the ' +
        'army that will search the whole south.',
    },
    {
      id: 'kishkindha-river',
      name: 'The Tungabhadrā',
      kind: 'landmark',
      at: { x: -0.3172, z: 0.1104 },
      description:
        'The river through the boulder country, which joins the Krishna and ' +
        'runs east to the sea. The search parties are sent out from its banks ' +
        'to the four quarters, and only the southern one finds anything.',
    },
    {
      id: 'rameswaram',
      name: 'Rāmeśvaram',
      kind: 'landmark',
      at: { x: 0.0068, z: 0.6633 },
      description:
        'The end of India, where the army halts at the water and builds the ' +
        'causeway across. The marker is a kilometre west of the town centre ' +
        'on purpose: at 1.66 km per pixel this map’s elevation data makes ' +
        'Pamban island about one pixel wide, and the town centre lands on a ' +
        'sample the data reads as sea. This point is on the same island and ' +
        'on land.',
    },
    {
      id: 'lanka',
      name: 'Laṅkā',
      kind: 'danger',
      at: { x: 0.1948, z: 0.7816 },
      description:
        'Rāvaṇa’s city across the water: the siege, the duel, and the ordeal ' +
        'Sītā is put to afterwards, which the poem does not soften and which ' +
        'readers have been arguing with for two thousand years. The ' +
        'identification of Laṅkā with Sri Lanka is traditional and is not ' +
        'universally accepted; the marker is placed by that tradition and by ' +
        'nothing stronger.',
    },
  ],

  routes: [
    {
      id: 'the-bow',
      name: 'To Mithilā, for the Bow',
      style: 'dashed',
      color: '#d9a4c8',
      points: [
        { x: 0.3812, z: -0.8933 },
        { x: 0.6200, z: -0.8900 },
        { x: 0.8613, z: -0.8870 },
      ],
      description:
        'East to Janaka’s court, where the bow of Śiva is strung and broken ' +
        'and Sītā is won. Dashed, because the poem gives the two ends and not ' +
        'the road. It is also the only journey in the epic that anyone makes ' +
        'happily.',
    },
    {
      id: 'the-exile',
      name: 'Out of the Kingdom',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: 0.3812, z: -0.8933 },
        { x: 0.3086, z: -0.7859 },
        { x: 0.3350, z: -0.7721 },
        { x: 0.2393, z: -0.7526 },
      ],
      description:
        'South-west to the Ganges, over it in Guha’s boat, to Bharadvāja at ' +
        'the confluence and on to Chitrakūṭa. Four days and about two hundred ' +
        'kilometres, and it takes fourteen years to come back.',
    },
    {
      id: 'into-the-south',
      name: 'Into the Daṇḍaka',
      style: 'solid',
      color: '#c96f5c',
      points: [
        { x: 0.2393, z: -0.7526 },
        { x: 0.0600, z: -0.6300 },
        { x: -0.2000, z: -0.4600 },
        { x: -0.4800, z: -0.3600 },
        { x: -0.7045, z: -0.2887 },
      ],
      description:
        'Ten years of moving between hermitages in the forest, ending at the ' +
        'hut on the Godāvarī. The poem names very little along this stretch, ' +
        'so the line is drawn as the crossing it must have been rather than ' +
        'as a surveyed road.',
    },
    {
      id: 'the-search',
      name: 'The Search',
      style: 'solid',
      color: '#e08a3c',
      points: [
        { x: -0.7045, z: -0.2887 },
        { x: -0.5400, z: -0.0800 },
        { x: -0.2117, z: 0.2619 },
        { x: -0.3597, z: 0.1258 },
      ],
      description:
        'South from the empty hut, following a dying bird’s directions, to ' +
        'the monkey kingdom and the alliance that makes the rest possible. ' +
        'The route doubles back: Jaṭāyu falls east of Kishkindha, and the ' +
        'search parties go out from Kishkindha afterwards.',
    },
    {
      id: 'the-causeway',
      name: 'The March to the Sea',
      style: 'solid',
      color: '#9ec8e8',
      points: [
        { x: -0.3597, z: 0.1258 },
        { x: -0.1400, z: 0.3800 },
        { x: 0.0068, z: 0.6633 },
        { x: 0.1948, z: 0.7816 },
      ],
      description:
        'The army moves south to the strait, builds the causeway in five ' +
        'days, and crosses. Everything after this is the siege — which the ' +
        'poem gives more room than the fourteen years that led to it.',
    },
  ],

  regions: [
    { id: 'kosala', name: 'Kosala', at: { x: 0.42, z: -0.82 }, scale: 0.55 },
    { id: 'dandaka-region', name: 'The Daṇḍaka Forest', at: { x: -0.22, z: -0.40 }, scale: 0.7 },
    { id: 'deccan', name: 'The Deccan', at: { x: -0.42, z: 0.0 }, scale: 0.6 },
    { id: 'ghats', name: 'The Western Ghats', at: { x: -0.80, z: 0.05 }, scale: 0.5 },
    { id: 'ocean', name: 'The Southern Ocean', at: { x: -0.30, z: 0.82 }, scale: 0.6 },
  ],

  elements: [
    {
      id: 'sitas-jewels',
      name: 'Sītā’s Ornaments',
      glyph: '💎',
      description:
        'Carried off in the chariot, she takes off her jewels, ties them in ' +
        'her scarf and drops the bundle among the monkeys sitting on a hill ' +
        'below. It is the only thing she can do and it is what solves the ' +
        'whole search: months later Sugrīva produces the bundle and Rāma knows ' +
        'which way south to go. A message thrown out of a window that ' +
        'actually arrives.',
      journey: [
        { marker: 'panchavati', note: 'On her, at the hut on the Godāvarī.' },
        { marker: 'jatayu', sinceChapter: 7, note: 'Dropped from the chariot as it flies south.' },
        { marker: 'kishkindha', sinceChapter: 9, note: 'Kept by the monkeys, and shown to Rāma.' },
      ],
    },
    {
      id: 'the-ring',
      name: 'Rāma’s Ring',
      glyph: '💍',
      description:
        'Given to Hanumān to carry over the water as proof — because a ' +
        'stranger appearing in the garden of the man who abducted you and ' +
        'saying he comes from your husband is not, on its own, believable. ' +
        'She sends back her hair-jewel by the same route. The two objects are ' +
        'the epic’s entire postal system.',
      journey: [
        { marker: 'kishkindha', note: 'Given to Hanumān before the leap.' },
        { marker: 'lanka', sinceChapter: 10, note: 'Delivered in the aśoka grove.' },
        { marker: 'rameswaram', sinceChapter: 11, note: 'Her jewel comes back the other way.' },
      ],
    },
  ],

  books: [
    {
      id: 'ayodhya-kanda',
      title: 'Bāla & Ayodhyā',
      subtitle: 'The bow, the promise, and the road out',
      chapters: [
        {
          id: 'the-bow',
          title: 'The Bow at Mithilā',
          narration:
            'Janaka of Mithilā has a bow nobody can string and a daughter he ' +
            'found in a furrow. Rāma of Ayodhya strings it and breaks it, and ' +
            'takes Sītā home. This is the last uncomplicated thing that ' +
            'happens in the poem.',
          focus: { marker: 'mithila', distance: 40 },
          reveal: {
            markers: ['ayodhya', 'mithila'],
            routes: ['the-bow'],
            regions: ['kosala'],
          },
        },
        {
          id: 'the-promise',
          title: 'Two Boons, Kept Too Well',
          narration:
            'Daśaratha is old and means to crown Rāma. Years earlier he gave ' +
            'his younger queen two promises against an unnamed day; Kaikeyī ' +
            'now names it, and asks for her own son on the throne and Rāma in ' +
            'the forest for fourteen years. The king is destroyed by keeping ' +
            'his word. Rāma goes without an argument, which is the thing the ' +
            'poem most wants you to notice.',
          focus: { marker: 'ayodhya', distance: 30 },
        },
        {
          id: 'the-crossing',
          title: 'The Boat at Śṛṅgverapura',
          narration:
            'Three of them go: Rāma, Sītā who will not stay, and Lakṣmaṇa who ' +
            'will not be left. At the Ganges the boatman Guha ferries them ' +
            'over and Rāma sends the chariot back to the city. The exile ' +
            'becomes real at the moment a man declines a lift home.',
          focus: { marker: 'shringverapura', distance: 24 },
          reveal: {
            markers: ['shringverapura', 'prayaga'],
            routes: ['the-exile'],
          },
        },
        {
          id: 'chitrakuta',
          title: 'The Hut on Chitrakūṭa',
          narration:
            'Past Bharadvāja at the confluence to the hill, where they build ' +
            'a hut and are happy. Then Bharata arrives with an army — not to ' +
            'fight but to beg his brother to come back and be king. Rāma ' +
            'refuses. Bharata takes his sandals instead, puts them on the ' +
            'throne and rules as their deputy for fourteen years.',
          focus: { marker: 'chitrakuta', distance: 26 },
          reveal: { markers: ['chitrakuta'] },
          highlight: { markers: ['chitrakuta'] },
        },
      ],
    },
    {
      id: 'aranya-kanda',
      title: 'Araṇya & Kiṣkindhā',
      subtitle: 'The forest, the deer, and the alliance',
      chapters: [
        {
          id: 'the-forest',
          title: 'Ten Years in the Daṇḍaka',
          narration:
            'They go south into the great forest and move between hermitages ' +
            'for a decade, and the poem covers it in a handful of episodes. ' +
            'The Daṇḍaka is treated as one place and is really most of central ' +
            'India; this map marks it as a region because the text gives no ' +
            'coordinates and inventing some would be worse than saying so.',
          focus: { marker: 'dandaka', distance: 56 },
          reveal: {
            markers: ['dandaka'],
            routes: ['into-the-south'],
            regions: ['dandaka-region', 'deccan', 'ghats'],
          },
        },
        {
          id: 'panchavati',
          title: 'The Hut on the Godāvarī',
          narration:
            'At Pañcavaṭī they settle for the last of the exile. Rāvaṇa’s ' +
            'sister Śūrpaṇakhā comes, is mocked and mutilated, and brings her ' +
            'brothers’ army; Rāma destroys it. Everything that follows is the ' +
            'consequence of a scene that begins as comedy.',
          focus: { marker: 'panchavati', distance: 26 },
          reveal: { markers: ['panchavati', 'panchavati-river'] },
        },
        {
          id: 'the-golden-deer',
          title: 'The Golden Deer',
          narration:
            'Rāvaṇa answers with a trick so simple it is almost insulting: a ' +
            'golden deer, a cry for help in Rāma’s voice, and an empty hut. ' +
            'Sītā sends Lakṣmaṇa after his brother against his judgement, and ' +
            'a beggar comes to the door. She is carried off south in a flying ' +
            'chariot.',
          focus: { marker: 'panchavati', distance: 22 },
          highlight: { markers: ['panchavati'] },
        },
        {
          id: 'jatayu',
          title: 'Rise, Bird',
          narration:
            'The old vulture Jaṭāyu, a friend of Rāma’s father, attacks the ' +
            'chariot in the air and is cut down. He lives long enough to say ' +
            'which way they went. On the way Sītā ties her jewels in her ' +
            'scarf and drops the bundle among some monkeys on a hill — the ' +
            'only thing she can do, and the thing that solves the search.',
          focus: { marker: 'jatayu', distance: 34 },
          reveal: { markers: ['jatayu'], routes: ['the-search'] },
        },
        {
          id: 'kishkindha',
          title: 'Kiṣkindhā',
          narration:
            'Among the boulders on the Tungabhadrā, Rāma allies with the ' +
            'exiled monkey prince Sugrīva and kills his brother Vālin from ' +
            'cover to put him on the throne — an act the poem lets Vālin ' +
            'himself object to at length before he dies. Then Sugrīva produces ' +
            'a bundle of jewels his people picked up off a hill, and there is ' +
            'a direction at last.',
          focus: { marker: 'kishkindha', distance: 26 },
          reveal: { markers: ['kishkindha', 'kishkindha-river'] },
        },
      ],
    },
    {
      id: 'yuddha-kanda',
      title: 'Sundara, Yuddha & Uttara',
      subtitle: 'The leap, the siege, and afterwards',
      chapters: [
        {
          id: 'the-leap',
          title: 'Hanumān Crosses',
          narration:
            'Search parties go to the four quarters; only the southern one ' +
            'gets anywhere, and it ends at a strait too wide to cross. ' +
            'Hanumān jumps it. He finds Sītā under a tree in Rāvaṇa’s garden, ' +
            'gives her Rāma’s ring so she will believe him, takes her ' +
            'hair-jewel back, and — having been caught and had his tail set ' +
            'alight — burns most of the city down on the way out.',
          focus: { marker: 'lanka', distance: 34 },
          reveal: { markers: ['rameswaram', 'lanka'], routes: ['the-causeway'] },
        },
        {
          id: 'the-causeway',
          title: 'The Bridge of Stones',
          narration:
            'The army marches to the end of India and stops at the water. ' +
            'They build a causeway across in five days and go over. Rāvaṇa’s ' +
            'own brother Vibhīṣaṇa, having told him plainly that this is a war ' +
            'about a stolen woman and cannot be won, changes sides.',
          focus: { marker: 'rameswaram', distance: 30 },
          highlight: { routes: ['the-causeway'] },
        },
        {
          id: 'the-war',
          title: 'The Siege',
          narration:
            'The longest book in the epic. Days of single combats, ' +
            'Lakṣmaṇa struck down and revived by a mountain of herbs Hanumān ' +
            'carries in whole because he cannot tell which plant is which, ' +
            'and at the end Rāma and Rāvaṇa face each other with the gods ' +
            'watching. Rāvaṇa dies. Vibhīṣaṇa is made king of Lanka.',
          focus: { marker: 'lanka', distance: 26 },
          highlight: { markers: ['lanka'] },
        },
        {
          id: 'the-fire',
          title: 'What He Says to Her',
          narration:
            'Sītā is brought out, and Rāma tells her he did this for his ' +
            'honour and not for her, and that she may go where she likes. She ' +
            'walks into a fire and comes out of it untouched. The poem does ' +
            'not soften this scene and readers have been arguing with it for ' +
            'two thousand years — Kamban, Tulsīdās and the Jain retellings all ' +
            'handle it differently, which is part of why there is no single ' +
            'Rāmāyaṇa.',
          focus: { marker: 'lanka', distance: 22 },
        },
        {
          id: 'the-return',
          title: 'Home, and After',
          narration:
            'They fly north over the whole road they walked, and Bharata ' +
            'takes the sandals off the throne. The Uttarakāṇḍa, which many ' +
            'hold to be a later addition, then has Rāma banish Sītā again on ' +
            'the strength of a rumour; she raises their sons in a hermitage, ' +
            'and when at last she is asked to swear to her innocence in ' +
            'public, she asks the earth to take her back instead, and it does.',
          focus: { marker: 'ayodhya', distance: 34 },
          highlight: { markers: ['ayodhya'] },
        },
      ],
    },
  ],
}
