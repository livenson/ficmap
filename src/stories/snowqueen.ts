import type { Story } from '../types'
import snowqueenHeight from '../assets/snowqueen-height.png'

/**
 * The Snow Queen — Hans Christian Andersen, 1844. Denmark's world in this
 * atlas, and the longest walk in it.
 *
 * Andersen wrote a great many tales; this is the one that is a MAP. A boy gets
 * a splinter of a broken mirror in his eye and another in his heart, is carried
 * off on a sledge, and a girl who is not related to him and has no plan walks
 * north until she finds him. The whole of the middle of the tale is her route.
 *
 * The geography is half real and half not, and the map says which is which.
 * Andersen never names the town the children live in — it is "a large town" —
 * so the map puts it in Copenhagen, because that is where he was writing and
 * because every place he DOES name is north of it. The river, the flower
 * garden, the prince's palace and the robbers' castle are unplaced in the text
 * and are set here along the road north in the order Gerda meets them, spaced
 * by how far she has plainly come, and — this is the part that needed the
 * checker to catch — on actual LAND. The first attempt put her river in the
 * middle of the Kattegat and her prince's palace in Vattern. They are the
 * tale's own sequence over real ground, not anybody's survey. Lapland, Finland
 * and Spitsbergen are named outright, and sit where they really are.
 *
 * The last of those is Andersen's own inconsistency, kept rather than fixed:
 * the reindeer says plainly that the Snow Queen's fixed abode is "high up
 * towards the North Pole, on the Island called Spitzbergen", and then Gerda
 * walks to it barefoot from Finland, across nine hundred kilometres of the
 * Barents Sea. The map draws that leg dashed.
 *
 *   map x = (lon − 4.0) / 15.0 − 1     map z = (80.0 − lat) / 12.75 − 1
 *
 * TEXT: "Andersen's Fairy Tales", Project Gutenberg eBook 1597. That edition
 * names no translator — an omission worth stating rather than papering over
 * with a guess — so the quotations credit the edition and the story number.
 */
export const snowqueen: Story = {
  id: 'snow-queen',
  title: 'The Snow Queen',
  subtitle: 'A girl walks to Spitsbergen',
  author: 'Hans Christian Andersen',
  region: 'Denmark to Svalbard',
  epoch: 'Tale · 1844',
  group: 'epic',
  intro:
    'A mirror that makes everything look worse is dropped from the sky and ' +
    'breaks into a hundred million pieces, and two of them land in one boy. ' +
    'Press ▶ Play story to follow what happens next — which is that a girl ' +
    'his own age puts on her red shoes and walks north until she runs out of ' +
    'north. Seven stories, one road, and the only weapon in it is crying.',
  surfaceName: 'The road north',
  ambient: {
    trees: 0.42,
    treeKind: 'conifer',
    treeColor: '#3f6350',
    birds: 6,
    birdKind: 'raven',
  },
  terrain: {
    music: {
      title: 'Red Shoes',
      credit: 'Original, written for this atlas',
      // Walking music that keeps going up and does not get warmer.
      melody:
        'E4:2 G4:2 B4:2 E5:4 D5:2 B4:4 r:2 ' +
        'G4:2 B4:2 D5:2 G5:4 F5:2 D5:4 r:2 ' +
        'B4:2 D5:2 F5:2 B5:6 r:4',
      bass: 'E3:8 C3:8 G2:8 B2:8',
      tempo: 54,
      voice: 'bell',
      mood: 'mystic',
    },
    seed: 'snowqueen-1', // unused: the heightmap takes precedence
    heightmap: snowqueenHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0043,
    // ~1,300 km across at 67°N by ~2,830 km down — the tallest world here.
    aspect: 0.46,
    heightScale: 10,
    rivers: 6,
    biomes: [
      { maxHeight: 0.0043, color: '#2d5f7c', name: 'The sea' },
      { maxHeight: 0.05, color: '#c6c2a0', name: 'Shore' },
      { maxHeight: 0.16, color: '#6f8f63', name: 'Farmland' },
      { maxHeight: 0.36, color: '#4a7355', name: 'Forest' },
      { maxHeight: 0.6, color: '#77836f', name: 'Fell' },
      { maxHeight: 0.82, color: '#a8aeae', name: 'Bare rock' },
      { maxHeight: 1.0, color: '#e8eef2', name: 'Snow' },
    ],
  },

  markers: [
    {
      id: 'the-roofs',
      name: 'The Two Attics',
      kind: 'capital',
      at: { x: -0.429, z: 0.908 },
      description:
        'Two garret windows facing each other across a gutter, with a rose ' +
        'growing in a box on either side, and two children who can step across ' +
        'to visit. Andersen does not name the town; this is Copenhagen, where ' +
        'he was writing. Kay gets a splinter of the mirror in his eye and ' +
        'another in his heart on an ordinary afternoon, and immediately says ' +
        'something cruel about the roses.',
    },
    {
      id: 'the-river',
      name: 'The River',
      kind: 'landmark',
      at: { x: -0.407, z: 0.867 },
      description:
        'Kay is gone and everyone says he drowned, so Gerda goes down to the ' +
        'water and offers it her new red shoes — the best thing she owns — in ' +
        'exchange for giving him back. The river will not take a bribe but ' +
        'takes the boat, and carries her away downstream, which is the first ' +
        'leg of the journey by accident.',
    },
    {
      id: 'flower-garden',
      name: 'The Old Woman’s Garden',
      kind: 'forest',
      at: { x: -0.36, z: 0.773 },
      description:
        'A cottage with painted windows where an old woman who understands a ' +
        'little magic combs Gerda’s hair until she forgets what she came ' +
        'for, and hides every rose in the ground so nothing will remind her. ' +
        'It is the gentlest trap in the tale, and Gerda is in it for a season. ' +
        'One rose the old woman missed, on the old woman’s own hat, ends it.',
    },
    {
      id: 'palace',
      name: 'The Prince and Princess',
      kind: 'city',
      at: { x: -0.267, z: 0.655 },
      description:
        'A princess who wants a husband who can talk advertises for one, and ' +
        'the young man who arrives and is not frightened of anybody turns out ' +
        'not to be Kay. They give Gerda a coach of pure gold anyway, and boots ' +
        'and a muff, which is precisely what gets her robbed in the next story.',
    },
    {
      id: 'robbers-castle',
      name: 'The Robbers’ Castle',
      kind: 'danger',
      at: { x: -0.253, z: 0.537 },
      description:
        'A gold coach in a dark forest attracts the obvious attention. The ' +
        'old robber woman intends to eat her; the robber maiden — who keeps a ' +
        'knife under her pillow and a wood-pigeon in a cage and is the best ' +
        'character in Andersen — decides she would rather have Gerda alive, ' +
        'and it is her pigeons who report having seen Kay go north.',
    },
    {
      id: 'lapland',
      name: 'The Lapland Woman',
      kind: 'town',
      at: { x: 0.08, z: -0.051 },
      description:
        'A hut with a roof down to the ground and a door you crawl through, ' +
        'where an old woman dressing fish by a lamp hears the whole story and ' +
        'says the Snow Queen’s country-house is further on. She has no ' +
        'paper, so she writes the introduction on a dried fish.',
    },
    {
      id: 'finland-woman',
      name: 'The Finland Woman',
      kind: 'town',
      at: { x: 0.307, z: -0.224 },
      description:
        'A hut so hot its owner goes about undressed, with a chimney and no ' +
        'door. She reads the fish three times, learns it by heart, and puts it ' +
        'in the soup pot, because it is good fish and nothing should be ' +
        'wasted. Asked to give Gerda the strength of ten men, she gives the ' +
        'answer the tale is built on: the girl already has more power than ' +
        'that, and it would be no kindness to tell her so.',
    },
    {
      id: 'summer-garden',
      name: 'The Snow Queen’s Garden',
      kind: 'landmark',
      at: { x: 0.453, z: -0.302 },
      description:
        'Where the reindeer has to set her down and go back — a red-berry ' +
        'bush in the snow, and Gerda without boots or mittens from here on. ' +
        'The snowflakes that come at her are the Snow Queen’s guard, and ' +
        'what beats them is Gerda saying the Lord’s Prayer, whose breath ' +
        'in the cold air turns into little angels.',
    },
    {
      id: 'spitsbergen',
      name: 'The Palace at Spitsbergen',
      kind: 'ruin',
      at: { x: -0.227, z: -0.859 },
      description:
        'Walls of driven snow, windows and doors of cutting wind, and a hall ' +
        'measured in miles lit by the northern lights. Kay is sitting on a ' +
        'frozen lake pushing flat pieces of ice into shapes, trying to spell ' +
        'one word he cannot manage. Gerda finds him, cries on him, and the ' +
        'tears go down into his heart and wash the splinter out — and then he ' +
        'cries, and the one in his eye comes out too.',
    },
  ],

  routes: [
    {
      id: 'gerdas-road',
      name: 'Gerda’s road',
      color: '#e8b45c',
      style: 'solid',
      description:
        'Downstream in a boat, then on foot, then in a gold coach, then on ' +
        'foot again, then on the back of a reindeer: the river, the garden, ' +
        'the palace, the robbers, Lapland, Finland. She is about seven years ' +
        'old and nobody sends her.',
      points: [
        { x: -0.429, z: 0.908 },
        { x: -0.407, z: 0.867 },
        { x: -0.36, z: 0.773 },
        { x: -0.267, z: 0.655 },
        { x: -0.253, z: 0.537 },
        { x: -0.1, z: 0.24 },
        { x: 0.08, z: -0.051 },
        { x: 0.307, z: -0.224 },
        { x: 0.453, z: -0.302 },
      ],
    },
    {
      id: 'the-last-mile',
      name: 'The last stretch, barefoot',
      color: '#9fd8ee',
      style: 'dashed',
      description:
        'Drawn dashed because it cannot be walked. The reindeer names ' +
        'Spitsbergen as the Snow Queen’s fixed abode, and Gerda then goes ' +
        'there on foot from the edge of Finnmark — nine hundred kilometres of ' +
        'the Barents Sea, in a tale that has otherwise been careful about ' +
        'distances. Andersen leaves the join showing; so does this map.',
      points: [
        { x: 0.453, z: -0.302 },
        { x: 0.28, z: -0.52 },
        { x: 0.0, z: -0.72 },
        { x: -0.227, z: -0.859 },
      ],
    },
    {
      id: 'kays-sledge',
      name: 'Kay’s sledge',
      color: '#c9d6e4',
      style: 'dashed',
      description:
        'The other direction of travel, and the fast one: a white sledge in ' +
        'the square, a boy tying his own little sleigh to the back of it for a ' +
        'lark, and then the town gate and open country and snow.',
      points: [
        { x: -0.429, z: 0.908 },
        { x: -0.3, z: 0.4 },
        { x: -0.24, z: -0.2 },
        { x: -0.227, z: -0.859 },
      ],
    },
  ],

  regions: [
    { id: 'r-south', name: 'THE SOUTH, AND SUMMER', at: { x: -0.6, z: 0.82 }, scale: 0.85 },
    { id: 'r-forest', name: 'THE GREAT FOREST', at: { x: -0.5, z: 0.44 }, scale: 0.85 },
    { id: 'r-lapland', name: 'LAPLAND', at: { x: 0.1, z: 0.06 }, scale: 0.9 },
    { id: 'r-finnmark', name: 'FINNMARK', at: { x: 0.5, z: -0.16 }, scale: 0.85 },
    { id: 'r-barents', name: 'THE BARENTS SEA', at: { x: 0.15, z: -0.62 }, scale: 0.9 },
  ],

  elements: [
    {
      id: 'splinter',
      name: 'The Splinter',
      glyph: '🔷',
      description:
        'One grain of a mirror that made everything good look mean, dropped ' +
        'out of the sky when the sprites flew too high with it. Two pieces ' +
        'reach Kay on the same afternoon — one in the eye, one in the heart — ' +
        'and neither can be got out by any means except crying.',
      journey: [
        { marker: 'the-roofs', note: 'Into the eye, and into the heart.' },
        { marker: 'spitsbergen', sinceChapter: 6, note: 'Washed out by somebody else’s tears.' },
      ],
    },
    {
      id: 'red-shoes',
      name: 'The Red Shoes',
      glyph: '👠',
      description:
        'Her best possession, offered to a river in exchange for a boy. The ' +
        'river takes neither the bribe nor the hint, but the boat drifts, and ' +
        'that is how the journey starts.',
      journey: [
        { marker: 'the-roofs', note: 'New, and never worn.' },
        { marker: 'the-river', sinceChapter: 1, note: 'Thrown in twice; they float back.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · Seven Stories',
      subtitle: 'A mirror, a boy, and a girl who keeps going',
      chapters: [
        {
          id: 'i-1',
          title: 'The mirror',
          narration:
            'A sprite makes a mirror that shrinks everything good and swells ' +
            'everything bad, and his pupils carry it about the world until ' +
            'they get the idea of taking it up to the sky. It grins so hard ' +
            'they drop it, and it breaks into a hundred million pieces, each ' +
            'with the full power of the whole.',
          quote: {
            text:
              'Some persons even got a splinter in their heart, and then it made\n' +
              'one shudder, for their heart became like a lump of ice.',
            source: 'First Story · Andersen’s Fairy Tales, Project Gutenberg 1597',
          },
          focus: { marker: 'the-roofs', distance: 46, pitch: 44 },
          reveal: {
            markers: ['the-roofs', 'the-river'],
            routes: ['kays-sledge'],
            regions: ['r-south'],
          },
          highlight: { markers: ['the-roofs'] },
        },
        {
          id: 'i-2',
          title: 'The sledge in the square',
          narration:
            'Two pieces reach Kay on an ordinary day. He is instantly clever ' +
            'and unkind, prefers snowflakes under a magnifying glass to roses, ' +
            'and can do arithmetic in his head. In the winter he ties his ' +
            'sleigh to a big white one in the square for a ride, and it does ' +
            'not stop at the town gate.',
          focus: { marker: 'the-roofs', distance: 34, pitch: 40 },
          highlight: { markers: ['the-roofs'], routes: ['kays-sledge'] },
        },
        {
          id: 'i-3',
          title: 'The red shoes, and the garden',
          narration:
            'Gerda offers the river her red shoes for him, gets into a boat ' +
            'to throw them further, and is carried off. Downstream an old ' +
            'woman with a magic comb keeps her all summer and buries every ' +
            'rose so nothing will remind her — and is undone by the roses ' +
            'painted on her own hat.',
          focus: { marker: 'flower-garden', distance: 30, pitch: 40 },
          reveal: { markers: ['flower-garden', 'palace'], routes: ['gerdas-road'] },
          highlight: { markers: ['the-river', 'flower-garden'] },
        },
        {
          id: 'i-4',
          title: 'A coach of gold, and what it attracts',
          narration:
            'A crow tells her about a princess who advertised for a husband ' +
            'who could talk. The young man is not Kay. They send her on with ' +
            'a coach of gold and a muff and boots, into a forest full of ' +
            'robbers, which is how a kindness becomes the next disaster.',
          focus: { marker: 'robbers-castle', distance: 34, pitch: 42 },
          reveal: { markers: ['robbers-castle'], regions: ['r-forest'] },
          highlight: { markers: ['palace', 'robbers-castle'] },
        },
        {
          id: 'i-5',
          title: 'North, on a fish’s recommendation',
          narration:
            'The robber maiden gives her the reindeer and lets her go. In ' +
            'Lapland an old woman writes a letter of introduction on a dried ' +
            'fish; in Finland the next woman reads it three times, learns it ' +
            'by heart, and puts it in the soup. Asked for the strength of ten ' +
            'men for the girl, she says the girl has more than that already, ' +
            'and that telling her would spoil it.',
          quote: {
            text:
              'I can give her no greater power than she has already;\n' +
              'don’t you see how great it is?',
            source: 'Sixth Story · Andersen’s Fairy Tales, Project Gutenberg 1597',
          },
          focus: { marker: 'lapland', distance: 46, pitch: 44 },
          reveal: {
            markers: ['lapland', 'finland-woman', 'summer-garden'],
            regions: ['r-lapland', 'r-finnmark'],
          },
          highlight: { markers: ['lapland', 'finland-woman'] },
        },
        {
          id: 'i-6',
          title: 'The word he could not spell',
          narration:
            'The reindeer sets her down at the red-berry bush and goes back. ' +
            'She walks the rest without boots or mittens, prays her way ' +
            'through a regiment of snowflakes, and finds Kay alone on a frozen ' +
            'lake in a hall measured in miles, pushing flat pieces of ice ' +
            'about. He is trying to spell one word and cannot: it is ' +
            '"eternity", and the Snow Queen has told him that if he manages ' +
            'it he can have his freedom and a pair of skates.',
          quote: {
            text:
              'He found whole figures which represented a written word; but he never\n' +
              'could manage to represent just the word he wanted — that word was\n' +
              '“eternity”.',
            source: 'Seventh Story · Andersen’s Fairy Tales, Project Gutenberg 1597',
          },
          focus: { marker: 'spitsbergen', distance: 40, pitch: 42 },
          reveal: {
            markers: ['spitsbergen'],
            routes: ['the-last-mile'],
            regions: ['r-barents'],
          },
          highlight: { markers: ['spitsbergen'], routes: ['the-last-mile'] },
        },
        {
          id: 'i-7',
          title: 'Home, and taller',
          narration:
            'She cries on him until the tears reach his heart and dissolve ' +
            'the splinter, and then he cries and the other one comes out with ' +
            'the tears. The ice spells itself while nobody is looking. They ' +
            'walk home the whole way — past the Finland woman, the Lapland ' +
            'woman, the robber maiden on a horse — and find the roses out and ' +
            'the two chairs still facing each other, and discover on the way ' +
            'in that they are grown up.',
          focus: { marker: 'the-roofs', distance: 40, pitch: 42 },
          highlight: { markers: ['the-roofs'], routes: ['gerdas-road'] },
        },
      ],
    },
  ],
}
