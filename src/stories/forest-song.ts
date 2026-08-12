import type { Story } from '../types'
import polissiaHeight from '../assets/polissia-height.png'

/**
 * The Forest Song — Lesya Ukrainka's "Lisova pisnia" (1911), the great lyric
 * fairy-tale of Ukrainian literature. User-authored, paraphrased data: the
 * narration and place notes are original summaries, not the poet's text.
 *
 * The map is a SHAPED heightmap of a glade in the Volhynian Polissia (see
 * scripts/build-polissia.mjs): a hoary forest around a still dark lake, a boggy
 * fen to the south-west, the old-forest ridge to the north, and the lone stony
 * knoll — the Rock — to the south-east. It is an intimate world, not a journey:
 * the whole tale plays out around this one enchanted water.
 */
export const forestSong: Story = {
  id: 'forest-song',
  title: 'The Forest Song',
  subtitle: 'Lisova pisnia — a fairy-tale of the Volhynian woods',
  author: 'Lesya Ukrainka',
  region: 'Volhynia · Polissia',
  epoch: 'Written 1911',
  intro:
    'In a hoary Volhynian forest, by a still dark lake, the wood-spirit Mavka ' +
    'wakes to a shepherd’s reed and loves a mortal boy. A lyric fairy-tale of ' +
    'the woods and the folk who clear them — of a love broken by the everyday ' +
    'world, and a song that outlives the body. Press ▶ Play story to follow the ' +
    'three seasons of the tale around the lake.',
  surfaceName: 'The Forest',
  terrain: {
    music: {
      melody: 'D4:2 F4:1 G4:1 A4:3 G4:1 F4:2 E4:2 D4:4 r:2 A4:2 C5:1 A4:1 G4:2 F4:2 E4:2 D4:2 D4:6 r:2',
      bass: 'D2:8 G2:8 A2:8 D2:8',
      tempo: 56,
      voice: 'flute',
      mood: 'mystic',
    },
    seed: 'polissia',
    heightmap: polissiaHeight,
    seaLevel: 0.24,
    heightScale: 9,
    rivers: 2,
    detail: true, // fine surface bump so the forest floor reads as textured
    waterColor: '#31473f', // a dark, tea-coloured forest lake
    biomes: [
      { maxHeight: 0.24, color: '#2c4640', name: 'The Lake' },
      { maxHeight: 0.29, color: '#8b9061', name: 'Reeds' },
      { maxHeight: 0.37, color: '#6e7c48', name: 'The Fen' },
      { maxHeight: 0.5, color: '#79a24f', name: 'Glade' },
      { maxHeight: 0.68, color: '#3f7a45', name: 'Woods' },
      { maxHeight: 0.85, color: '#2f5d38', name: 'Old Forest' },
      { maxHeight: 1.0, color: '#8a8578', name: 'The Rock' },
    ],
  },
  ambient: {
    trees: 0.9,
    treeKind: 'broadleaf',
    treeColor: '#3f7f45',
    birds: 7,
    fish: 5,
    wisps: 16, // Perelesnyk & poterchata drifting over the fen and lake
  },
  markers: [
    {
      id: 'lake',
      name: 'Lake Nechimne',
      kind: 'landmark',
      at: { x: -0.14, z: -0.05 },
      description:
        'The still, dark forest lake at the heart of the wood — the realm of ' +
        'the Water-Lord and the water-nymph, Rusalka. Its reeds keep the old ' +
        'stories.',
    },
    {
      id: 'lev-clearing',
      name: 'Uncle Lev’s Clearing',
      kind: 'town',
      at: { x: -0.4, z: -0.12 },
      description:
        'Where old Lev and his nephew Lukash raise a cottage at the forest’s ' +
        'edge. Lev honours the wood and its spirits; the household that grows ' +
        'here does not.',
    },
    {
      id: 'willow',
      name: 'Mavka’s Willow',
      kind: 'landmark',
      at: { x: 0.28, z: -0.16 },
      description:
        'A pale willow on the lakeshore. Here Lukash’s reed first wakes Mavka, ' +
        'and here, at the last, she returns as the tree from whose wood the ' +
        'singing flute is carved.',
    },
    {
      id: 'old-oak',
      name: 'The Old Oak',
      kind: 'forest',
      at: { x: -0.1, z: -0.5 },
      description:
        'The ancient oak where Mavka sleeps out the winter, and where the ' +
        'Forest-Lord holds his counsel among the deep trees.',
    },
    {
      id: 'forest-deeps',
      name: 'The Forest Deeps',
      kind: 'forest',
      at: { x: 0.45, z: -0.55 },
      description:
        'The hoary heart of the old forest — the domain of the Forest-Lord and ' +
        'the fiery Perelesnyk, the falling-star spirit who courts the wood-maids.',
    },
    {
      id: 'the-rock',
      name: 'He Who Sits in the Rock',
      kind: 'danger',
      at: { x: 0.6, z: 0.42 },
      description:
        'A lone stony knoll where dwells the cold spirit of the earth. When ' +
        'Mavka’s heart is broken, it is here she is led down into the dark.',
    },
    {
      id: 'the-fen',
      name: 'The Fen',
      kind: 'landmark',
      at: { x: -0.55, z: 0.5 },
      description:
        'A boggy, whispering marsh where the Poterchata — the little will-o’-' +
        'the-wisp lights — lead the unwary astray over the black water.',
    },
    {
      id: 'kylyna-field',
      name: 'Kylyna’s Field',
      kind: 'town',
      at: { x: -0.66, z: 0.18 },
      description:
        'Cleared ground at the wood’s western edge, worked by the widow Kylyna ' +
        '— the practical, mortal world that the forest cannot abide, and for ' +
        'which Lukash forsakes his forest-love.',
    },
  ],
  regions: [
    { id: 'polissia', name: 'Polissia', at: { x: -0.22, z: 0.02 }, scale: 1.4 },
    { id: 'lake-region', name: 'Lake Nechimne', at: { x: 0.04, z: 0.06 }, scale: 0.9 },
    { id: 'old-forest', name: 'The Old Forest', at: { x: 0.3, z: -0.62 }, scale: 1.0 },
    { id: 'fen-region', name: 'The Fen', at: { x: -0.56, z: 0.58 }, scale: 0.8 },
  ],
  elements: [
    {
      id: 'reed-flute',
      name: 'Lukash’s Reed-Flute',
      glyph: '♪',
      description:
        'A shepherd’s sopilka — the reed-pipe whose song runs through the whole ' +
        'tale: it wakes Mavka in the spring, falls silent when the vow is ' +
        'broken, and at the end, carved anew from her willow, sings her voice ' +
        'when nothing else of her remains.',
      journey: [
        {
          marker: 'willow',
          sinceChapter: 0,
          note: 'A reed cut by the lake — its music wakes Mavka from her sleep.',
        },
        {
          marker: 'lev-clearing',
          sinceChapter: 1,
          note: 'Laid aside as Lukash turns from the forest to the mortal field.',
        },
        {
          marker: 'willow',
          sinceChapter: 2,
          note: 'Re-carved from Mavka’s willow; it sings her voice at the last.',
        },
      ],
    },
  ],
  chapters: [
    {
      id: 'spring',
      title: 'Spring — The Awakening',
      narration:
        'Old Lev and his nephew Lukash come to raise a cottage by the forest ' +
        'lake. Lukash cuts a reed and plays, and his music wakes Mavka, a spirit ' +
        'of the wood, from her winter sleep in the old oak. The Water-Lord, the ' +
        'Forest-Lord and the fiery Perelesnyk stir in the deeps — and between the ' +
        'mortal boy and the forest-maiden a love begins.',
      focus: { marker: 'willow', distance: 16 },
      reveal: {
        markers: ['lake', 'lev-clearing', 'willow', 'old-oak'],
        regions: ['polissia', 'lake-region'],
      },
      highlight: { markers: ['willow', 'lake'] },
    },
    {
      id: 'summer',
      title: 'Summer — The Broken Vow',
      narration:
        'The cottage stands and the household grows. Lukash’s mother has no love ' +
        'for a bride of leaves and dew, and brings the widow Kylyna — quick and ' +
        'worldly — to work the field. Lukash wavers, then forsakes his ' +
        'forest-love for a mortal match. Heart-wounded, Mavka is led away by Him ' +
        'Who Sits in the Rock, down into the cold of the earth.',
      focus: { marker: 'kylyna-field', distance: 18 },
      reveal: {
        markers: ['kylyna-field', 'the-rock', 'the-fen'],
        regions: ['old-forest', 'fen-region'],
      },
      highlight: { markers: ['the-rock', 'kylyna-field'] },
    },
    {
      id: 'autumn',
      title: 'Autumn — The Forest Song',
      narration:
        'A broken vow bears bitter fruit: the misery-spirits hollow the joyless ' +
        'house, and Lukash is unmade. But Mavka returns as a pale willow by the ' +
        'water; from its wood Lukash carves a flute that sings with her voice, ' +
        'and as the cottage takes fire she rises into flame and falling snow — ' +
        '“do not grieve for the body.” The forest keeps her song.',
      focus: { marker: 'willow', distance: 16 },
      reveal: { markers: ['forest-deeps'] },
      highlight: { markers: ['willow', 'lake'] },
    },
  ],
}
