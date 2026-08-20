import type { Story } from '../types'
import xiyouHeight from '../assets/xiyou-height.png'

/**
 * Journey to the West — the pilgrim road from Chang'an to India, told twice.
 *
 * TWO BOOKS, AND THEY ARE NOT THE SAME KIND OF THING. In 629 a young monk
 * called Xuanzang left Chang'an without permission, walked and rode about
 * 25,000 li to India and back, spent five years at Nalanda, and came home in
 * 645 with 657 texts and an imperial welcome. He then dictated the *Da Tang
 * Xiyu Ji* — the Great Tang Records on the Western Regions — which is a
 * geography: a hundred and thirty-eight countries, their crops, their kings and
 * their monasteries, in order. Nine hundred years later somebody turned that
 * road into a comic novel in which the monk is a nervous incompetent escorted
 * by a rebellious monkey with an iron staff, a pig, and a reformed sand-demon,
 * and every stage of the journey is a demon who wants to eat him.
 *
 * So this world draws ONE road and hangs two books on it. Book I follows the
 * record, where every place named is a real place and the distances are close
 * to right. Book II follows the novel, which invents nearly all of its
 * geography — Flower-Fruit Mountain, the River of Flowing Sand, Gao Village,
 * the Mountain of Two Frontiers — and those are deliberately NOT pinned here,
 * because inventing a coordinate for them would be inventing the one thing this
 * atlas does not invent. The two places the novel does put on the real map are
 * the Flaming Mountains at Turpan and the Western Heaven, which is India.
 *
 * WHERE THE TEXTS CAME FROM. The record is read in Samuel Beal's *Si-Yu-Ki:
 * Buddhist Records of the Western World* (Trübner, 1884), which is public
 * domain and is quoted as his. It is a Victorian translation and shows it. The
 * novel is read in the Chinese — the 1592 *Xiyouji*, Project Gutenberg #23962 —
 * because the English translations that read well are all still in copyright;
 * where it is quoted, the Chinese is shown and the English is a rendering made
 * for this atlas and labelled as one, not passed off as a translator's.
 *
 * The novel has no named author on its title page. "Wu Cheng'en" is a
 * seventeenth-century attribution from a local gazetteer, widely accepted and
 * not certain, and the picker says so by naming him with the century.
 *
 * ON THE WATER IN THE DESERT. There is a small sea drawn in the middle of the
 * Taklamakan, and it is not an error in the data: the Turpan Depression really
 * does go down to −154 m, the lowest ground in China, and this engine draws one
 * water plane at sea level. Everything in that basin below 0 m therefore comes
 * out wet. The real Aiding Lake is a salt pan at the bottom of it, so the map
 * is right about the hole and generous about how much of it holds water.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 64) / 24 − 1      map z = (46 − lat) / 12.25 − 1
 */
export const xiyou: Story = {
  id: 'xiyou',
  title: 'Journey to the West',
  subtitle: 'One road, walked once and imagined ever after',
  author: 'Xuanzang (629) & “Wu Cheng’en” (16th c.)',
  region: 'Tang China to India',
  epoch: 'Travelled 629–645 · novel 1592',
  group: 'epic',
  earth: { lon: 108.94, lat: 34.34, place: 'Chang’an (Xi’an), Shaanxi' },
  intro:
    'A monk leaves the Tang capital illegally, crosses the Gobi, the Tian ' +
    'Shan and the Hindu Kush, studies for five years in Bihar, and comes back ' +
    'sixteen years later with six hundred books. Press ▶ Play story to walk it ' +
    'twice: once as he wrote it down, and once as the novel retold it, with a ' +
    'monkey.',
  surfaceName: 'The Western Regions',
  ambient: {
    // Desert, steppe and plateau for four fifths of the way; the trees are the
    // Gangetic plain at the far end and the oases in between.
    trees: 0.16,
    treeColor: '#4a6b3e',
    birds: 5,
    fish: 1,
  },
  terrain: {
    music: {
      // An original, on the five-note scale, and the reason it is an original
      // is the same as everywhere else in this atlas: a named tune ships only
      // when its notation has been read, and no Chinese notation was read
      // here. So this borrows the SCALE — D E F# A B, a gong-mode pentatonic,
      // with no semitone anywhere in it — and transcribes nothing.
      title: 'Twenty-five thousand li',
      credit: 'Original — no Chinese melody is transcribed here',
      melody:
        'D4:2 F#4:1 A4:1 B4:2 A4:2 ' +
        'F#4:2 E4:1 D4:1 E4:4 ' +
        'A4:2 B4:1 D5:1 E5:2 D5:2 ' +
        'B4:2 A4:1 F#4:1 D4:4',
      bass: 'D3:8 A2:8 B2:8 D3:8',
      tempo: 60,
      voice: 'flute',
      mood: 'wonder',
    },
    seed: 'xiyou-1', // unused: the heightmap takes precedence
    heightmap: xiyouHeight,
    // Printed by scripts/build-heightmap.mjs for the `xiyou` preset.
    seaLevel: 0.0022,
    // 4,442 km across by 2,727 km down.
    aspect: 1.629,
    // Low, because at this width anything more turns the Tibetan plateau into
    // a wall across the middle of the map and hides the corridor the road
    // actually threads — which is the one thing this map has to show.
    heightScale: 7,
    // Raised from the default: at 320 a vertex is 8.5 km of ground and the
    // Tarim basin's rim comes out as a smooth curve. See the note in types.ts.
    meshResolution: 400,
    overhead: true,
    rivers: 0,
    /**
     * Three real rivers, all of them on the road.
     *
     * The Wei is Chang'an's own river and the first day's walking follows it
     * west. The Huang is crossed at Lanzhou, where the road leaves China
     * proper for the corridor. The Ganges is the other end of the world: the
     * record sails down it, and is robbed on it by pirates who plan to
     * sacrifice him to Durga.
     *
     * The Ganges took a fix to the builder to get. Natural Earth carries the
     * whole delta, and the greedy stitcher in `build-river` went down a
     * Sundarbans channel that dead-ends at 90.01E 22.49N — 88 km from any water
     * on this map — while four other leaves of the same feature reach the Bay of
     * Bengal. `check-rivers` refused it, correctly, and the first version of
     * this world left the river off and said so. The builder now walks the
     * unused channels when its own tail reaches nothing and takes one that gets
     * to water; all 27 courses already committed reproduce byte-identically,
     * because the repair cannot fire on a river that already ends properly.
     *
     * The Tarim is still not here, and that refusal stands. It has no mouth: it
     * runs east into the Taklamakan and stops, which is a fact about the river
     * rather than a gap in the data, and no branch of it arrives anywhere. The
     * desert marker says so instead.
     *
     * Source: Natural Earth 10m river centrelines (public domain), via
     * `scripts/build-river.mjs xiyou Wei | Huang | Ganges`.
     */
    namedRivers: [
      {
        name: 'The Wei',
        marker: 'the-wei',
        points: [
          { x: 0.6694, z: -0.1009 }, { x: 0.6736, z: -0.1098 }, { x: 0.6814, z: -0.1110 },
          { x: 0.6914, z: -0.1068 }, { x: 0.6969, z: -0.0986 }, { x: 0.6989, z: -0.0867 },
          { x: 0.7057, z: -0.0816 }, { x: 0.7153, z: -0.0840 }, { x: 0.7225, z: -0.0823 },
          { x: 0.7292, z: -0.0785 }, { x: 0.7367, z: -0.0763 }, { x: 0.7431, z: -0.0707 },
          { x: 0.7490, z: -0.0651 }, { x: 0.7559, z: -0.0640 }, { x: 0.7628, z: -0.0630 },
          { x: 0.7698, z: -0.0632 }, { x: 0.7759, z: -0.0564 }, { x: 0.7819, z: -0.0507 },
          { x: 0.7886, z: -0.0523 }, { x: 0.7957, z: -0.0510 }, { x: 0.8040, z: -0.0494 },
          { x: 0.8114, z: -0.0475 }, { x: 0.8181, z: -0.0447 }, { x: 0.8255, z: -0.0409 },
          { x: 0.8334, z: -0.0394 }, { x: 0.8410, z: -0.0388 }, { x: 0.8487, z: -0.0377 },
          { x: 0.8578, z: -0.0400 }, { x: 0.8638, z: -0.0466 }, { x: 0.8710, z: -0.0533 },
          { x: 0.8781, z: -0.0590 }, { x: 0.8848, z: -0.0565 }, { x: 0.8894, z: -0.0648 },
          { x: 0.8964, z: -0.0644 }, { x: 0.9041, z: -0.0679 }, { x: 0.9112, z: -0.0696 },
          { x: 0.9197, z: -0.0729 }, { x: 0.9274, z: -0.0706 }, { x: 0.9289, z: -0.0713 },
        ],
      },
      {
        name: 'The Ganges',
        marker: 'pataliputra',
        points: [
          { x: -0.3400, z: 0.2336 }, { x: -0.3403, z: 0.2532 }, { x: -0.3503, z: 0.2612 },
          { x: -0.3608, z: 0.2727 }, { x: -0.3742, z: 0.2810 }, { x: -0.3846, z: 0.2868 },
          { x: -0.3922, z: 0.3002 }, { x: -0.4028, z: 0.2945 }, { x: -0.4098, z: 0.3102 },
          { x: -0.4088, z: 0.3301 }, { x: -0.4170, z: 0.3444 }, { x: -0.4124, z: 0.3650 },
          { x: -0.4134, z: 0.3839 }, { x: -0.4121, z: 0.4023 }, { x: -0.4085, z: 0.4228 },
          { x: -0.4052, z: 0.4404 }, { x: -0.3983, z: 0.4571 }, { x: -0.3906, z: 0.4702 },
          { x: -0.3801, z: 0.4757 }, { x: -0.3696, z: 0.4835 }, { x: -0.3626, z: 0.4980 },
          { x: -0.3530, z: 0.5061 }, { x: -0.3487, z: 0.5232 }, { x: -0.3409, z: 0.5382 },
          { x: -0.3329, z: 0.5505 }, { x: -0.3283, z: 0.5689 }, { x: -0.3212, z: 0.5861 },
          { x: -0.3121, z: 0.6015 }, { x: -0.3081, z: 0.6189 }, { x: -0.2994, z: 0.6302 },
          { x: -0.2890, z: 0.6326 }, { x: -0.2794, z: 0.6453 }, { x: -0.2733, z: 0.6608 },
          { x: -0.2643, z: 0.6711 }, { x: -0.2538, z: 0.6725 }, { x: -0.2475, z: 0.6874 },
          { x: -0.2386, z: 0.6985 }, { x: -0.2280, z: 0.7013 }, { x: -0.2176, z: 0.7041 },
          { x: -0.2080, z: 0.6971 }, { x: -0.2008, z: 0.6834 }, { x: -0.1913, z: 0.6745 },
          { x: -0.1819, z: 0.6650 }, { x: -0.1716, z: 0.6717 }, { x: -0.1607, z: 0.6542 },
          { x: -0.1492, z: 0.6546 }, { x: -0.1388, z: 0.6567 }, { x: -0.1271, z: 0.6547 },
          { x: -0.1174, z: 0.6622 }, { x: -0.1088, z: 0.6728 }, { x: -0.0986, z: 0.6758 },
          { x: -0.0856, z: 0.6806 }, { x: -0.0760, z: 0.6881 }, { x: -0.0647, z: 0.6847 },
          { x: -0.0544, z: 0.6934 }, { x: -0.0427, z: 0.6907 }, { x: -0.0317, z: 0.6918 },
          { x: -0.0232, z: 0.6811 }, { x: -0.0142, z: 0.6935 }, { x: -0.0069, z: 0.7104 },
          { x: -0.0032, z: 0.7284 }, { x: 0.0024, z: 0.7441 }, { x: 0.0094, z: 0.7583 },
          { x: 0.0185, z: 0.7673 }, { x: 0.0221, z: 0.7847 }, { x: 0.0295, z: 0.7986 },
          { x: 0.0362, z: 0.8193 }, { x: 0.0329, z: 0.8370 }, { x: 0.0423, z: 0.8461 },
          { x: 0.0448, z: 0.8660 }, { x: 0.0474, z: 0.8862 }, { x: 0.0538, z: 0.9013 },
          { x: 0.0538, z: 0.9212 }, { x: 0.0559, z: 0.9485 }, { x: 0.0563, z: 0.9614 },
        ],
      },
      {
        name: 'The Yellow River',
        marker: 'the-huang',
        points: [
          { x: 0.3402, z: -0.1126 }, { x: 0.3535, z: -0.1107 }, { x: 0.3671, z: -0.1070 },
          { x: 0.3768, z: -0.0966 }, { x: 0.3875, z: -0.0872 }, { x: 0.3990, z: -0.0919 },
          { x: 0.4061, z: -0.1085 }, { x: 0.4174, z: -0.1061 }, { x: 0.4277, z: -0.0907 },
          { x: 0.4334, z: -0.0734 }, { x: 0.4371, z: -0.0551 }, { x: 0.4493, z: -0.0572 },
          { x: 0.4606, z: -0.0540 }, { x: 0.4612, z: -0.0349 }, { x: 0.4624, z: -0.0163 },
          { x: 0.4701, z: -0.0007 }, { x: 0.4821, z: -0.0013 }, { x: 0.4936, z: -0.0016 },
          { x: 0.5020, z: 0.0107 }, { x: 0.5111, z: -0.0010 }, { x: 0.5235, z: -0.0086 },
          { x: 0.5349, z: -0.0091 }, { x: 0.5463, z: -0.0091 }, { x: 0.5551, z: 0.0026 },
          { x: 0.5669, z: 0.0065 }, { x: 0.5772, z: 0.0145 }, { x: 0.5837, z: 0.0305 },
          { x: 0.5954, z: 0.0273 }, { x: 0.5970, z: 0.0085 }, { x: 0.5914, z: -0.0138 },
          { x: 0.5810, z: -0.0213 }, { x: 0.5700, z: -0.0304 }, { x: 0.5594, z: -0.0395 },
          { x: 0.5498, z: -0.0503 }, { x: 0.5423, z: -0.0642 }, { x: 0.5348, z: -0.0788 },
          { x: 0.5233, z: -0.0812 }, { x: 0.5132, z: -0.0925 }, { x: 0.5100, z: -0.1110 },
          { x: 0.5085, z: -0.1306 }, { x: 0.5100, z: -0.1561 }, { x: 0.5185, z: -0.1688 },
          { x: 0.5293, z: -0.1817 }, { x: 0.5391, z: -0.1951 }, { x: 0.5514, z: -0.1912 },
          { x: 0.5680, z: -0.1962 }, { x: 0.5794, z: -0.1909 }, { x: 0.5861, z: -0.1751 },
          { x: 0.5977, z: -0.1734 }, { x: 0.6099, z: -0.1705 }, { x: 0.6254, z: -0.1695 },
          { x: 0.6370, z: -0.1717 }, { x: 0.6413, z: -0.1944 }, { x: 0.6540, z: -0.1922 },
          { x: 0.6672, z: -0.1895 }, { x: 0.6725, z: -0.2063 }, { x: 0.6833, z: -0.2195 },
          { x: 0.6933, z: -0.2303 }, { x: 0.6917, z: -0.2502 }, { x: 0.6807, z: -0.2572 },
          { x: 0.6803, z: -0.2757 }, { x: 0.6908, z: -0.2918 }, { x: 0.7024, z: -0.2986 },
          { x: 0.7135, z: -0.3050 }, { x: 0.7312, z: -0.3059 }, { x: 0.7441, z: -0.3125 },
          { x: 0.7484, z: -0.3311 }, { x: 0.7571, z: -0.3476 }, { x: 0.7613, z: -0.3652 },
          { x: 0.7708, z: -0.3805 }, { x: 0.7748, z: -0.4013 }, { x: 0.7850, z: -0.4276 },
          { x: 0.7834, z: -0.4467 }, { x: 0.7814, z: -0.4666 }, { x: 0.7822, z: -0.4852 },
          { x: 0.7808, z: -0.5036 }, { x: 0.7858, z: -0.5249 }, { x: 0.7950, z: -0.5381 },
          { x: 0.8002, z: -0.5562 }, { x: 0.8100, z: -0.5675 }, { x: 0.8211, z: -0.5756 },
          { x: 0.8338, z: -0.5803 }, { x: 0.8461, z: -0.5764 }, { x: 0.8573, z: -0.5659 },
          { x: 0.8675, z: -0.5548 }, { x: 0.8801, z: -0.5534 }, { x: 0.8922, z: -0.5492 },
          { x: 0.9047, z: -0.5490 }, { x: 0.9171, z: -0.5526 }, { x: 0.9293, z: -0.5495 },
          { x: 0.9409, z: -0.5373 }, { x: 0.9527, z: -0.5313 }, { x: 0.9660, z: -0.5272 },
          { x: 0.9749, z: -0.5141 }, { x: 0.9736, z: -0.4920 }, { x: 0.9760, z: -0.4723 },
          { x: 0.9652, z: -0.4631 }, { x: 0.9649, z: -0.4427 }, { x: 0.9572, z: -0.4265 },
          { x: 0.9560, z: -0.4073 }, { x: 0.9532, z: -0.3886 }, { x: 0.9446, z: -0.3728 },
          { x: 0.9379, z: -0.3574 }, { x: 0.9439, z: -0.3317 }, { x: 0.9490, z: -0.3146 },
          { x: 0.9429, z: -0.2977 }, { x: 0.9390, z: -0.2780 }, { x: 0.9339, z: -0.2602 },
          { x: 0.9347, z: -0.2411 }, { x: 0.9368, z: -0.2203 }, { x: 0.9354, z: -0.2006 },
          { x: 0.9374, z: -0.1820 }, { x: 0.9406, z: -0.1602 }, { x: 0.9400, z: -0.1405 },
          { x: 0.9322, z: -0.1229 }, { x: 0.9285, z: -0.1028 }, { x: 0.9267, z: -0.0791 },
          { x: 0.9372, z: -0.0705 }, { x: 0.9486, z: -0.0744 }, { x: 0.9594, z: -0.0814 },
          { x: 0.9711, z: -0.0883 }, { x: 0.9824, z: -0.0931 }, { x: 0.9908, z: -0.1059 },
          { x: 0.9997, z: -0.1081 },
        ],
      },
    ],
    biomes: [
      { maxHeight: 0.0022, color: '#2f5f7d', name: 'Sea' },
      { maxHeight: 0.09, color: '#6d7a4a', name: 'The plains of India' },
      { maxHeight: 0.24, color: '#8a7d55', name: 'Loess & oasis' },
      { maxHeight: 0.46, color: '#a08f63', name: 'Desert & basin' },
      { maxHeight: 0.72, color: '#7d7a68', name: 'Ranges' },
      { maxHeight: 1, color: '#dfe3e6', name: 'The plateau' },
    ],
    waterColor: '#3a7392',
  },

  markers: [
    {
      id: 'chang-an',
      name: 'Chang’an',
      kind: 'capital',
      at: { x: 0.8725, z: -0.0482 },
      description:
        'The Tang capital, a million people behind a rectangular wall, and the ' +
        'eastern end of every road in this world. Xuanzang applied for a ' +
        'travel permit, was refused, and went anyway — so the record’s journey ' +
        'begins as a crime. The novel begins here too, but with an emperor who ' +
        'has been to hell and back and wants scriptures fetched.',
    },
    {
      id: 'the-wei',
      name: 'The Wei',
      kind: 'landmark',
      at: { x: 0.7886, z: -0.0523 },
      description:
        'The river Chang’an stands on, and the valley the road follows west ' +
        'for the first four hundred kilometres. Drawn from its published ' +
        'course rather than traced off the heightmap, which at 2.9 km a pixel ' +
        'cannot hold a river at all.',
    },
    {
      id: 'the-huang',
      name: 'The Yellow River at Lanzhou',
      kind: 'landmark',
      at: { x: 0.6540, z: -0.1922 },
      description:
        'The crossing where the road leaves China proper. West of this the ' +
        'country is a corridor between the desert and the plateau, and both ' +
        'sides of it belong to somebody else.',
    },
    {
      id: 'liangzhou',
      name: 'Liangzhou',
      kind: 'town',
      at: { x: 0.6096, z: -0.3412 },
      description:
        'Modern Wuwei, in the Hexi Corridor: the frontier command, where the ' +
        'governor had orders to stop exactly the kind of person Xuanzang was. ' +
        'He preached in public for a month, acquired a following, and was ' +
        'smuggled out westward by monks who travelled at night.',
    },
    {
      id: 'dunhuang',
      name: 'Dunhuang & the Jade Gate',
      kind: 'landmark',
      at: { x: 0.2775, z: -0.5216 },
      description:
        'The last town, the great cave-temples, and the gate beyond which the ' +
        'empire stopped pretending to govern. Past it are five watchtowers, ' +
        'each with archers ordered to shoot anyone leaving, and then eight ' +
        'hundred li of gravel desert with no water in it.',
    },
    {
      id: 'hami',
      name: 'Hami',
      kind: 'town',
      at: { x: 0.2296, z: -0.7412 },
      description:
        'Where he came out of the desert alive, having lost his water on the ' +
        'fourth day and lain down to die on the fifth. His horse — an old one ' +
        'that had made the crossing thirty times, bought on advice — found the ' +
        'grass and the water on its own.',
    },
    {
      id: 'gaochang',
      name: 'Gaochang & the Flaming Mountains',
      kind: 'ruin',
      at: { x: 0.0658, z: -0.7502 },
      description:
        'A Chinese-speaking Buddhist kingdom in the Turpan Depression whose ' +
        'king would not let him leave, and gave in only when Xuanzang stopped ' +
        'eating for three days — then equipped him for the rest of the journey ' +
        'and made him swear to stay three years on the way back. He was dead ' +
        'and the kingdom annexed before there was a way back. The red ' +
        'sandstone ridge beside it is the Flaming Mountains, and it is where ' +
        'the novel puts its chapters 59–61: a mountain on fire that cannot be ' +
        'crossed until Monkey gets the palm-leaf fan off the Iron Fan ' +
        'Princess, which takes him three tries and a change of shape.',
    },
    {
      id: 'kucha',
      name: 'Kucha',
      kind: 'city',
      at: { x: -0.2100, z: -0.6506 },
      description:
        'The great oasis kingdom of the northern rim — a hundred monasteries, ' +
        'five thousand monks, and the home two centuries earlier of ' +
        'Kumārajīva, whose translations are the reason there was Chinese ' +
        'Buddhism to be dissatisfied with. Xuanzang was snowed in here for ' +
        'two months.',
    },
    {
      id: 'taklamakan',
      name: 'The Taklamakan',
      kind: 'danger',
      at: { x: -0.2292, z: -0.4122 },
      description:
        'The desert the road goes round rather than through, and the reason ' +
        'there is a northern route and a southern one. The Tarim runs into it ' +
        'from the west and simply stops; nothing comes out the other side. ' +
        'The river is not drawn on this map for that reason — a course with no ' +
        'mouth cannot be shown to run anywhere.',
    },
    {
      id: 'ling-shan',
      name: 'Ling-shan, the Ice Mountains',
      kind: 'peak',
      at: { x: -0.3958, z: -0.6653 },
      description:
        'The crossing of the Tian Shan, and the worst passage of the outward ' +
        'journey: seven days on the ice, sleeping on it, with a third or so of ' +
        'the party dead by the far side. The record is precise about the ' +
        'dangers and includes the dragons.',
    },
    {
      id: 'issyk-kul',
      name: 'The Great Pure Lake',
      kind: 'landmark',
      at: { x: -0.4458, z: -0.7061 },
      description:
        'Issyk-Kul, six hundred kilometres round and 1,600 m up, which never ' +
        'freezes — the record notes it and gives it the name. Beyond it the ' +
        'road meets the Western Turks, whose khan received Xuanzang in a tent ' +
        'of gold thread and sent him on with escorts.',
    },
    {
      id: 'samarkand',
      name: 'Samarkand',
      kind: 'city',
      at: { x: -0.8763, z: -0.4816 },
      description:
        'The westernmost point of the journey, and not a Buddhist town: the ' +
        'record describes a Zoroastrian city where two of Xuanzang’s novices ' +
        'were driven out of an abandoned monastery with firebrands. He got ' +
        'them back and the king apologised. From here the road turns south.',
    },
    {
      id: 'bamiyan',
      name: 'Bamiyan',
      kind: 'landmark',
      at: { x: -0.8404, z: -0.0873 },
      description:
        'A valley in the Hindu Kush with two colossal Buddhas cut into the ' +
        'cliff, 38 and 55 m high, painted and gilded when Xuanzang saw them in ' +
        '630. The Taliban dynamited both in March 2001. The record’s ' +
        'description is now among the better accounts of what they looked like ' +
        'when they were new.',
    },
    {
      id: 'gandhara',
      name: 'Gandhāra',
      kind: 'ruin',
      at: { x: -0.6842, z: -0.0212 },
      description:
        'The country round Peshawar, where Greek sculpture met Buddhist ' +
        'subject matter and produced the first Buddhas with faces. Xuanzang ' +
        'found it largely abandoned — a thousand monasteries, he says, ruined ' +
        'and empty — a century after the Hephthalites came through.',
    },
    {
      id: 'taxila',
      name: 'Takṣaśilā',
      kind: 'ruin',
      at: { x: -0.6321, z: 0.0008 },
      description:
        'Taxila, the old university city on the road down from the passes, ' +
        'also mostly ruins by the seventh century. From here the record turns ' +
        'east along the foot of the Himalaya and spends years working down the ' +
        'Ganges.',
    },
    {
      id: 'kanauj',
      name: 'Kanauj',
      kind: 'capital',
      at: { x: -0.3371, z: 0.5453 },
      description:
        'Harsha’s capital, and the scene of the assembly the king called in ' +
        '643 so that Xuanzang could defend his thesis in public against anyone ' +
        'who cared to attack it. Eighteen days, a reported five thousand ' +
        'monks, and — the record says — nobody took up the challenge.',
    },
    {
      id: 'pataliputra',
      name: 'Pāṭaliputra',
      kind: 'ruin',
      at: { x: -0.1192, z: 0.6645 },
      description:
        'Patna, on the Ganges: Ashoka’s capital nine centuries earlier and, ' +
        'by the time Xuanzang got there, foundations and a few hundred ' +
        'households. The river is the road for this whole stretch, and ' +
        'somewhere on it he was taken by pirates who worshipped Durgā, ' +
        'decided he was the handsomest passenger and therefore the right ' +
        'sacrifice, and were interrupted by a squall violent enough that they ' +
        'let him go and asked for instruction instead. The river drawn under ' +
        'this pin is the real course; the city sits 0.0028 map units off it.',
    },
    {
      id: 'nalanda',
      name: 'Nālandā',
      kind: 'city',
      at: { x: -0.1067, z: 0.7029 },
      description:
        'The monastic university in Magadha, and the actual destination: ten ' +
        'thousand residents, a library in three buildings, and an entrance ' +
        'examination at the gate that most applicants failed. Xuanzang stayed ' +
        'about five years, studied under Śīlabhadra, and was one of the very ' +
        'few foreign students ever given a seat among the senior monks.',
    },
    {
      id: 'bodh-gaya',
      name: 'Bodh Gayā',
      kind: 'landmark',
      at: { x: -0.1254, z: 0.7388 },
      description:
        'The tree, and the reason for the whole journey rather than a ' +
        'destination on it. The record describes the temple, the railing, the ' +
        'measurements — and then says that Xuanzang wept, because he had ' +
        'arrived so many centuries late.',
    },
    {
      id: 'khotan',
      name: 'Khotan',
      kind: 'city',
      at: { x: -0.3367, z: -0.2743 },
      description:
        'On the way home, by the southern rim of the desert instead of the ' +
        'northern. He waited here eight months for an answer to the letter he ' +
        'had sent ahead — asking, sixteen years after leaving without a ' +
        'permit, whether he might come back. The answer was yes, and the ' +
        'emperor met him at Chang’an.',
    },
  ],

  routes: [
    {
      id: 'the-corridor',
      name: 'Out of China',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: 0.8725, z: -0.0482 },
        { x: 0.7886, z: -0.0523 },
        { x: 0.6540, z: -0.1922 },
        { x: 0.6096, z: -0.3412 },
        { x: 0.2775, z: -0.5216 },
        { x: 0.2296, z: -0.7412 },
      ],
      description:
        'Chang’an, the Wei valley, the crossing of the Yellow River at ' +
        'Lanzhou, the Hexi Corridor to Liangzhou, and then the Jade Gate and ' +
        'the desert — which he entered at night, past watchtowers with orders ' +
        'to shoot, having been abandoned by two guides.',
    },
    {
      id: 'the-northern-rim',
      name: 'The northern rim',
      style: 'solid',
      color: '#c98f5c',
      points: [
        { x: 0.2296, z: -0.7412 },
        { x: 0.0658, z: -0.7502 },
        { x: -0.2100, z: -0.6506 },
        { x: -0.3958, z: -0.6653 },
        { x: -0.4458, z: -0.7061 },
      ],
      description:
        'Round the top of the Taklamakan: Hami, Gaochang under the Flaming ' +
        'Mountains, Kucha and its hundred monasteries, then over the ice of ' +
        'the Tian Shan to the lake that never freezes.',
    },
    {
      id: 'over-the-passes',
      name: 'South over the passes',
      style: 'solid',
      color: '#9ec8e8',
      points: [
        { x: -0.4458, z: -0.7061 },
        { x: -0.8763, z: -0.4816 },
        { x: -0.8404, z: -0.0873 },
        { x: -0.6842, z: -0.0212 },
        { x: -0.6321, z: 0.0008 },
      ],
      description:
        'West to Samarkand, then south through the Iron Gates and over the ' +
        'Hindu Kush by Bamiyan into Gandhāra. This is the leg that turns a ' +
        'Chinese journey into an Indian one.',
    },
    {
      id: 'down-to-magadha',
      name: 'Down to Magadha',
      style: 'solid',
      color: '#8fc8a8',
      points: [
        { x: -0.6321, z: 0.0008 },
        { x: -0.3371, z: 0.5453 },
        { x: -0.1192, z: 0.6645 },
        { x: -0.1067, z: 0.7029 },
        { x: -0.1254, z: 0.7388 },
      ],
      description:
        'East along the foot of the mountains and then down the Ganges — ' +
        'Kanauj, Pāṭaliputra, Nālandā, and the tree at Bodh Gayā. Years ' +
        'rather than months: the record’s account of India is a survey, not a ' +
        'dash.',
    },
    {
      id: 'the-way-home',
      name: 'The southern road home',
      style: 'dashed',
      color: '#b9a6d6',
      points: [
        { x: -0.1067, z: 0.7029 },
        { x: -0.6321, z: 0.0008 },
        { x: -0.3367, z: -0.2743 },
        { x: -0.2292, z: -0.4122 },
        { x: 0.2775, z: -0.5216 },
        { x: 0.8725, z: -0.0482 },
      ],
      description:
        'Back over the Pamirs — losing a load of manuscripts in a river — and ' +
        'then along the SOUTHERN rim of the desert by Khotan, which is the ' +
        'other way round the Taklamakan and the reason this line is not the ' +
        'outward one reversed. Dashed, because sixteen years of it are ' +
        'compressed into one stroke.',
    },
  ],

  regions: [
    { id: 'tang', name: 'The Tang Empire', at: { x: 0.80, z: -0.34 }, scale: 0.6 },
    { id: 'western-regions', name: 'The Western Regions', at: { x: -0.05, z: -0.58 }, scale: 0.6 },
    { id: 'the-plateau', name: 'The Roof of the World', at: { x: -0.10, z: 0.10 }, scale: 0.55 },
    { id: 'india', name: 'The Western Heaven', at: { x: -0.42, z: 0.75 }, scale: 0.6 },
  ],

  elements: [
    {
      id: 'the-sutras',
      name: 'The six hundred and fifty-seven texts',
      glyph: '☰',
      description:
        'What the journey is for, and the only thing on this map that travels ' +
        'the whole of it in one direction. Collected at Nālandā and across ' +
        'India, carried back over the Pamirs on twenty horses, part of the ' +
        'load lost in a river crossing, and delivered to Chang’an in 645 — ' +
        'where Xuanzang spent the remaining nineteen years of his life ' +
        'translating them and got through about a quarter.',
      journey: [
        { marker: 'nalanda', note: 'Copied and collected in Magadha.' },
        { marker: 'khotan', sinceChapter: 4, note: 'Over the Pamirs, and some of it lost.' },
        { marker: 'chang-an', sinceChapter: 5, note: 'Home, and nineteen years of translating.' },
      ],
    },
    {
      id: 'the-staff',
      name: 'The iron staff',
      glyph: '⚚',
      description:
        'The novel’s answer to the record’s manuscripts: a pillar from the ' +
        'dragon king’s sea palace, weighing 13,500 catties, which shrinks to ' +
        'the size of a needle and lives behind Monkey’s ear. It travels the ' +
        'same road for the opposite reason — the texts are what the journey is ' +
        'for, and the staff is how the journey survives being made.',
      journey: [
        { marker: 'chang-an', sinceChapter: 6, note: 'The escort is assembled at the capital.' },
        { marker: 'gaochang', sinceChapter: 8, note: 'The Flaming Mountains, and the fan.' },
        { marker: 'bodh-gaya', sinceChapter: 10, note: 'The Western Heaven, and it is put down.' },
      ],
    },
  ],

  books: [
    {
      id: 'the-record',
      title: 'The Record',
      subtitle: 'Xuanzang, 629–645',
      chapters: [
        {
          id: 'leaving-illegally',
          title: 'Leaving Without Permission',
          narration:
            'The Tang court had closed the western frontier and Xuanzang’s ' +
            'application to travel was refused. He went anyway, at night, ' +
            'with a monk’s bowl and no permit, up the Wei valley and across ' +
            'the Yellow River at Lanzhou, into a corridor whose governor had ' +
            'been told to look out for him.',
          focus: { marker: 'chang-an', distance: 40 },
          reveal: {
            markers: ['chang-an', 'the-wei', 'the-huang', 'liangzhou'],
            routes: ['the-corridor'],
            regions: ['tang'],
          },
        },
        {
          id: 'the-gobi',
          title: 'Eight Hundred Li of Sand',
          narration:
            'Out past the Jade Gate at night, between watchtowers with orders ' +
            'to shoot. He spilled his water bag on the fourth day, turned ' +
            'back, changed his mind after ten li, and went on. On the fifth ' +
            'day he lay down. The horse — old, and bought because it had made ' +
            'the crossing thirty times — got up and walked to the grass.',
          quote: {
            text:
              'There are no flying birds above, no roaming beasts below, but ' +
              'everywhere gazing as far as the eye can reach in search of the ' +
              'onward route, it would be impossible to know the way but for ' +
              'dead men’s decaying bones, which show the direction.',
            source:
              'Fa-hian on the same desert, quoted in Beal, Si-Yu-Ki, vol. I ' +
              'introduction, 1884',
          },
          focus: { marker: 'dunhuang', distance: 44 },
          reveal: {
            markers: ['dunhuang', 'hami', 'taklamakan'],
            regions: ['western-regions'],
          },
        },
        {
          id: 'the-king-of-gaochang',
          title: 'The King Who Would Not Let Him Go',
          narration:
            'At Gaochang the king wanted a court chaplain and would not take ' +
            'no; Xuanzang stopped eating and drinking and on the third day the ' +
            'king gave in, then outfitted him for the whole journey — money, ' +
            'monks, horses, and letters to twenty-four kings along the road. ' +
            'In exchange, a promise to spend three years here on the way home. ' +
            'By then the king was dead and the kingdom was a Chinese province.',
          focus: { marker: 'gaochang', distance: 36 },
          reveal: { markers: ['gaochang', 'kucha'], routes: ['the-northern-rim'] },
        },
        {
          id: 'the-ice-mountains',
          title: 'The Ice Mountains',
          narration:
            'Seven days across the Tian Shan with nowhere dry to sleep and no ' +
            'way to cook, and a large part of the party did not come down the ' +
            'other side. Then Issyk-Kul, which never freezes, and the khan of ' +
            'the Western Turks in a tent of gold thread, who fed him mutton he ' +
            'could not eat and sent him on with an escort.',
          quote: {
            text:
              'Both hills and valleys are filled with snowpiles, and it ' +
              'freezes both in spring and summer; if it should thaw for a ' +
              'time, the ice soon forms again. The roads are steep and ' +
              'dangerous, the cold wind is extremely biting, and frequently ' +
              'fierce dragons impede and molest travellers.',
            source:
              'Book I, on Ling-shan · Si-Yu-Ki, trans. Samuel Beal, 1884',
          },
          focus: { marker: 'ling-shan', distance: 34 },
          reveal: { markers: ['ling-shan', 'issyk-kul', 'samarkand'], routes: ['over-the-passes'] },
        },
        {
          id: 'over-the-hindu-kush',
          title: 'Over the Hindu Kush',
          narration:
            'South from Samarkand through the Iron Gates and up into Bamiyan, ' +
            'where two Buddhas stood in the cliff, painted and gilded and ' +
            'taller than anything he had ever seen. Then Gandhāra and Taxila, ' +
            'both of them mostly ruins — a thousand monasteries empty, the ' +
            'record says, and nobody left to explain what had happened.',
          quote: {
            text:
              'Its golden hues sparkle on every side, and its precious ' +
              'ornaments dazzle the eyes by their brightness.',
            source: 'Book I, on the great image at Bamiyan · Si-Yu-Ki, trans. Samuel Beal, 1884',
          },
          focus: { marker: 'bamiyan', distance: 32 },
          reveal: {
            markers: ['bamiyan', 'gandhara', 'taxila'],
            regions: ['the-plateau'],
          },
        },
        {
          id: 'nalanda-years',
          title: 'Five Years at Nālandā',
          narration:
            'East along the mountains and down the Ganges — pirates on the ' +
            'way, and a squall that saved him — to the monastic university in ' +
            'Magadha, ten thousand strong, where he was admitted, taught, and ' +
            'eventually put up at Kanauj to defend his position in public for ' +
            'eighteen days. Then home the other way round the desert, by ' +
            'Khotan, with the books.',
          focus: { marker: 'nalanda', distance: 38 },
          reveal: {
            markers: ['kanauj', 'pataliputra', 'nalanda', 'bodh-gaya', 'khotan'],
            routes: ['down-to-magadha', 'the-way-home'],
            regions: ['india'],
          },
        },
      ],
    },
    {
      id: 'the-novel',
      title: 'The Novel',
      subtitle: 'Xiyouji, 1592',
      chapters: [
        {
          id: 'the-monkey',
          title: 'The Stone Monkey',
          narration:
            'The novel spends seven chapters before the pilgrimage starts, on ' +
            'a monkey born out of a rock who learns immortality, takes the ' +
            'dragon king’s iron pillar as a weapon, deletes his own name from ' +
            'the registers of death, is bought off with a fake job in heaven, ' +
            'wrecks the peach banquet when he works out it is fake, and is ' +
            'finally pinned under a mountain by the Buddha for five hundred ' +
            'years. Only then does anybody mention scriptures.',
          quote: {
            text:
              'Would you know the work of creation and its turning ages? Then ' +
              'read the Record of the Journey West and the Loosing of Woe.',
            original: '欲知造化會元功，須看西遊釋厄傳。',
            source:
              'Ch. 1, closing couplet of the opening poem · Xiyouji, 1592 ' +
              '(Project Gutenberg #23962), rendered from the Chinese for this ' +
              'atlas',
          },
          focus: { marker: 'chang-an', distance: 46 },
          highlight: { markers: ['chang-an'] },
        },
        {
          id: 'the-company',
          title: 'The Company',
          narration:
            'Tripitaka — the novel’s Xuanzang, timid, literal-minded, and ' +
            'wrong about almost everything — is sent west with a headband ' +
            'spell and picks up three escorts on the road: the monkey from ' +
            'under the mountain, a pig expelled from heaven for harassment, ' +
            'and a sand-demon from a river of quicksand. Every one of them is ' +
            'serving a sentence. The pilgrimage is their parole.',
          focus: { marker: 'liangzhou', distance: 40 },
          highlight: { routes: ['the-corridor'] },
        },
        {
          id: 'the-flaming-mountains',
          title: 'The Flaming Mountains',
          narration:
            'Eighty-one calamities, most of them the same shape: a demon ' +
            'wants to eat the monk because his flesh confers immortality, ' +
            'Monkey fights it, and it turns out to be somebody’s escaped pet ' +
            'with a celestial owner who arrives to collect it. The best of ' +
            'them is here at Turpan, where the road is blocked by a mountain ' +
            'on fire and the only thing that will put it out is a fan held by ' +
            'the wife of a bull demon Monkey has previously wronged.',
          focus: { marker: 'gaochang', distance: 34 },
          highlight: { markers: ['gaochang'] },
        },
        {
          id: 'the-western-heaven',
          title: 'The Western Heaven',
          narration:
            'India in the novel is not a country but a destination: the ' +
            'Vulture Peak, the Buddha, and a bureaucracy. The pilgrims are ' +
            'given the scriptures only after they hand over a begging bowl as ' +
            'a fee, and the first set turns out to be blank — which Tripitaka ' +
            'takes as fraud and the Buddha explains is what the texts are ' +
            'actually like. They swap them for written ones and go home. It ' +
            'is a comedy about religion that never once suggests the journey ' +
            'was not worth making.',
          focus: { marker: 'bodh-gaya', distance: 36 },
          highlight: { markers: ['bodh-gaya', 'nalanda'], routes: ['down-to-magadha'] },
        },
      ],
    },
  ],
}
