import type { Story } from '../types'
import lusiadsHeight from '../assets/lusiads-height.png'

/**
 * Os Lusíadas — Luís de Camões, published 1572. Portugal's world in this atlas,
 * and the one that is simply a sailing chart with an epic on top of it.
 *
 * The frame is Vasco da Gama's first voyage to India, 1497-99, and Camões knew
 * the water: he spent seventeen years in the East, was shipwrecked off the
 * Mekong, and — the story runs — swam ashore holding the manuscript out of the
 * sea. The places along the way are real ports, and they are here at their real
 * coordinates, taken from the Wikipedia coordinate records rather than recalled —
 *
 *   map x = (lon + 30.0) / 55.0 − 1     map z = (45.0 − lat) / 42.5 − 1
 *
 * Two of the markers are NOT ports, and say so where they stand. Adamastor is
 * the Cape of Good Hope, in the sense that the Cape is his body — he is the
 * poem's own explanation of why the sea there is like that. And the Isle of
 * Love, which Venus raises out of the ocean on the way home as a reward, is
 * placed in the middle of the Indian Ocean because there is nowhere else to put
 * it; it is not on any chart and never was.
 *
 * TEXT: the Gutenberg edition of Richard Francis Burton's translation (London:
 * Bernard Quaritch, 1880; Burton d. 1890, public domain), eBooks 77660 and
 * 77661 — which prints Camões's Portuguese and Burton's English on facing
 * pages, so both were read.
 *
 * Burton's English is peculiar on purpose: he was translating a Renaissance
 * epic into deliberately archaic verse, and it reads like nobody else. It is
 * quoted as he wrote it, "van'ity" and all.
 *
 * The music is original. Portuguese fado postdates the poem by three centuries
 * and would be the wrong sound anyway.
 */
export const lusiads: Story = {
  id: 'lusiads',
  title: 'Os Lusíadas',
  subtitle: 'The road to India, and a giant who is a cape',
  author: 'Luís de Camões',
  region: 'The Atlantic, the Cape & the Indian Ocean',
  epoch: 'Epic · 1572 · the voyage of 1497–99',
  group: 'epic',
  intro:
    'Four ships leave the Tagus in 1497 to find a sea road to India, and get ' +
    'one. Press ▶ Play story to follow the whole voyage — the old man on the ' +
    'beach who curses the enterprise before it sails, the giant at the Cape ' +
    'who turns out to be the Cape, the pilot picked up at Malindi who knows ' +
    'the way across, and the landfall at Calicut that changed the shape of ' +
    'the world and did the people living there no good at all.',
  surfaceName: 'The sea road',
  ambient: {
    trees: 0.18,
    treeKind: 'broadleaf',
    treeColor: '#5d7f4a',
    birds: 7,
    fish: 10,
  },
  terrain: {
    music: {
      title: 'The Tagus Bar',
      credit: 'Original, written for this atlas',
      // A departure, in a mode that will not quite settle: the poem's own
      // argument with itself about whether any of this was worth doing.
      melody:
        'D4:2 F4:2 A4:4 G4:2 F4:2 E4:4 r:2 ' +
        'A4:2 C5:2 D5:4 C5:2 A4:2 G4:4 r:2 ' +
        'F4:2 G4:2 A4:2 D5:6 r:4',
      bass: 'D3:8 Bb2:8 F2:8 A2:8',
      tempo: 52,
      voice: 'harp',
      mood: 'epic',
    },
    seed: 'lusiads-1', // unused: the heightmap takes precedence
    heightmap: lusiadsHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0027,
    // ~12,240 km across at the equator by ~9,450 km down.
    aspect: 1.3,
    // Nearly all sea, and viewed from high up: the relief is there to tell
    // Africa from the Atlantic, not to be admired.
    overhead: true,
    heightScale: 11,
    rivers: 4,
    biomes: [
      { maxHeight: 0.0027, color: '#245a76', name: 'The Ocean Sea' },
      { maxHeight: 0.03, color: '#c9c095', name: 'Strand' },
      { maxHeight: 0.1, color: '#93a663', name: 'Coast' },
      { maxHeight: 0.24, color: '#8a9155', name: 'Savannah' },
      { maxHeight: 0.45, color: '#7d7d52', name: 'Inland' },
      { maxHeight: 0.72, color: '#8a7b62', name: 'Highland' },
      { maxHeight: 1.0, color: '#b0a695', name: 'Mountain' },
    ],
  },

  markers: [
    {
      id: 'belem',
      name: 'Belém, on the Tagus',
      kind: 'capital',
      at: { x: -0.622, z: -0.852 },
      description:
        'Where the fleet is blessed and sails, in July 1497 — four ships and ' +
        'about a hundred and seventy men, of whom fifty-five come back. ' +
        'Camões gives the departure to a nameless old man in the crowd who ' +
        'shouts that the whole thing is vanity, and then the poem sails ' +
        'anyway, without answering him.',
    },
    {
      id: 'cape-verde',
      name: 'The Cape Verdes',
      kind: 'port',
      at: { x: -0.882, z: -0.292 },
      description:
        'Last water and last certainty. From here Gama does the thing that ' +
        'makes the voyage possible and looks insane on a chart: instead of ' +
        'creeping down the African coast he stands out west into the open ' +
        'Atlantic, almost to Brazil, to pick up the southern westerlies — ' +
        'three months out of sight of land.',
    },
    {
      id: 'adamastor',
      name: 'Adamastor',
      kind: 'danger',
      at: { x: -0.119, z: 0.865 },
      description:
        'A thunderhead takes the shape of a giant and blocks the way, and it ' +
        'is the best passage in the poem. He is a Titan who fell in love with ' +
        'the sea-nymph Thetis, was tricked, embraced a mountain instead, and ' +
        'was turned into it. He is the Cape of Good Hope. He names himself ' +
        'the Cape of Tempests, curses everyone who will round him, and then ' +
        'weeps — which is the only thing anybody has ever found to do about ' +
        'the weather there.',
    },
    {
      id: 'good-hope',
      name: 'The Cape of Good Hope',
      kind: 'landmark',
      at: { x: -0.119, z: 0.865 },
      description:
        'Rounded in November 1497, which is the whole point of the voyage: ' +
        'past this the Indian Ocean is open, and a Portuguese ship can reach ' +
        'the spice trade without asking Venice or the Ottomans for anything. ' +
        'Camões, who sailed it himself, gives it a face and a grievance.',
    },
    {
      id: 'bons-sinais',
      name: 'The River of Good Signs',
      kind: 'port',
      at: { x: 0.215, z: 0.48 },
      description:
        'Quelimane, where they find people who have seen ships like theirs ' +
        'before — the first sign that they have reached a coast the Indian ' +
        'Ocean trade already knows. They put up a stone pillar, name the ' +
        'river for the good news, and lose thirty men to scurvy while they ' +
        'wait.',
    },
    {
      id: 'mozambique',
      name: 'Mozambique',
      kind: 'city',
      at: { x: 0.286, z: 0.413 },
      description:
        'The first Muslim port of the Swahili coast, and the first hostility. ' +
        'The sultan is friendly until he works out what they are, and the ' +
        'pilots he supplies try to steer the fleet onto the shoals. In the ' +
        'poem this is Bacchus, working against them the whole way east.',
    },
    {
      id: 'mombasa',
      name: 'Mombasa',
      kind: 'danger',
      at: { x: 0.264, z: 0.154 },
      description:
        'A trap dressed as a welcome. The plan is to take the ships in the ' +
        'harbour; the fleet gets out at night. Camões has Venus and the ' +
        'Nereids physically shove the hulls off the bar to save them, which ' +
        'is the poem’s way of saying they were extremely lucky.',
    },
    {
      id: 'malindi',
      name: 'Malindi',
      kind: 'port',
      at: { x: 0.272, z: 0.135 },
      description:
        'The turning point, and the frame for half the epic: a friendly king, ' +
        'a safe anchorage, and a pilot who knows the monsoon crossing. Gama ' +
        'sits down and tells him the entire history of Portugal, which takes ' +
        'three cantos, and is why a poem about a sea voyage contains a ' +
        'chronicle of every king since the twelfth century.',
    },
    {
      id: 'isle-of-love',
      name: 'The Isle of Love',
      kind: 'forest',
      at: { x: 0.6, z: 0.2 },
      description:
        'Not on any chart, and placed here only because it must go somewhere. ' +
        'On the way home Venus raises an island out of the sea and staffs it ' +
        'with nymphs as a reward for the crew, and a goddess then shows Gama ' +
        'a working model of the universe and the future of the empire. It is ' +
        'the strangest reward in epic and Camões is entirely unembarrassed.',
    },
    {
      id: 'calicut',
      name: 'Calicut',
      kind: 'capital',
      at: { x: 0.923, z: -0.206 },
      description:
        'Landfall, May 1498, and the end of the road the poem is named for. ' +
        'The Zamorin receives them; the Muslim merchants already trading ' +
        'there see exactly what is coming and say so; and the gifts the ' +
        'Portuguese have brought — cloth, hats, honey — are laughed at, ' +
        'because they have arrived at one of the richest ports on earth with ' +
        'the cargo you would take to a small African village.',
    },
  ],

  routes: [
    {
      id: 'outward',
      name: 'The outward voyage',
      color: '#e8b45c',
      style: 'solid',
      description:
        'Lisbon to Calicut, 1497-98: down to the Cape Verdes, the long swing ' +
        'west into the empty Atlantic to find the westerlies, round the Cape, ' +
        'up the Swahili coast to Malindi, and across with the monsoon.',
      points: [
        { x: -0.622, z: -0.852 },
        { x: -0.78, z: -0.6 },
        { x: -0.882, z: -0.292 },
        { x: -0.95, z: 0.2 },
        { x: -0.72, z: 0.66 },
        { x: -0.35, z: 0.9 },
        { x: -0.119, z: 0.865 },
        { x: 0.1, z: 0.66 },
        { x: 0.215, z: 0.48 },
        { x: 0.286, z: 0.413 },
        { x: 0.264, z: 0.154 },
        { x: 0.272, z: 0.135 },
        { x: 0.55, z: 0.0 },
        { x: 0.923, z: -0.206 },
      ],
    },
    {
      id: 'homeward',
      name: 'The voyage home',
      color: '#8fc6e0',
      style: 'dashed',
      description:
        'Back across the Indian Ocean against the monsoon — three months ' +
        'instead of three weeks, and half the crew dead of scurvy — by way of ' +
        'an island that does not exist. Two of the four ships reach Lisbon.',
      points: [
        { x: 0.923, z: -0.206 },
        { x: 0.75, z: 0.05 },
        { x: 0.6, z: 0.2 },
        { x: 0.3, z: 0.36 },
        { x: -0.119, z: 0.865 },
        { x: -0.6, z: 0.5 },
        { x: -0.85, z: -0.1 },
        { x: -0.7, z: -0.66 },
        { x: -0.622, z: -0.852 },
      ],
    },
  ],

  regions: [
    { id: 'r-atlantic', name: 'THE OCEAN SEA', at: { x: -0.72, z: 0.1 }, scale: 1.0 },
    { id: 'r-africa', name: 'AFRICA', at: { x: 0.02, z: 0.28 }, scale: 1.0 },
    { id: 'r-indian', name: 'THE INDIAN OCEAN', at: { x: 0.62, z: 0.42 }, scale: 1.0 },
    { id: 'r-swahili', name: 'THE SWAHILI COAST', at: { x: 0.36, z: 0.3 }, scale: 0.8 },
    { id: 'r-malabar', name: 'MALABAR', at: { x: 0.9, z: -0.06 }, scale: 0.8 },
  ],

  elements: [
    {
      id: 'padrao',
      name: 'The Stone Pillars',
      glyph: '🗿',
      description:
        'Carved limestone columns with the arms of Portugal, carried in the ' +
        'hold and planted at each new landfall. They are the physical form of ' +
        'the poem’s argument: a claim, in stone, made by people who have ' +
        'just arrived.',
      journey: [
        { marker: 'belem', note: 'Loaded before sailing.' },
        { marker: 'bons-sinais', sinceChapter: 3, note: 'Planted, and the river renamed.' },
        { marker: 'malindi', sinceChapter: 4, note: 'Planted with the king’s blessing.' },
        { marker: 'calicut', sinceChapter: 5, note: 'The claim arrives at a place that has laws.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · Out',
      subtitle: 'The Tagus to Malabar, the long way',
      chapters: [
        {
          id: 'i-1',
          title: 'Arms and the men',
          narration:
            'Camões opens by telling Virgil and Homer to sit down: the men he ' +
            'is about to sing crossed seas no sailor had crossed, and he would ' +
            'rather have their voyage than the Odyssey. He then spends ten ' +
            'cantos quietly undermining his own enthusiasm, which is why the ' +
            'poem has lasted.',
          quote: {
            text:
              'The feats of Arms, and famed heroick Host,\n' +
              'from occidental Lusitanian strand,\n' +
              'who o’er the waters ne’er by seaman crost,\n' +
              'farèd beyond the Taprobáne-land.',
            original: 'As armas e os barões assinalados',
            source: 'Canto I, st. 1 · trans. Richard Burton, 1880',
          },
          focus: { marker: 'belem', distance: 44, pitch: 46 },
          reveal: {
            markers: ['belem', 'cape-verde'],
            regions: ['r-atlantic'],
          },
          highlight: { markers: ['belem'] },
        },
        {
          id: 'i-2',
          title: 'The old man on the beach',
          narration:
            'As the ships cast off, an old man in the crowd at Belém shouts ' +
            'at them. He is given no name and never appears again, and what he ' +
            'says is that the whole enterprise is greed with a flag on it, ' +
            'that it will kill them, and that the word for what they are after ' +
            'is not glory. Camões puts him at the end of a canto and sails ' +
            'past without a reply.',
          quote: {
            text:
              'Oh craving of Command! Oh vain Desire!\n' +
              'of vainest van’ity man miscalleth Fame!\n' +
              'Oh fraud’ulent gust, so easy fanned to fire\n' +
              'by breath of vulgar, aping Honour’s name!',
            original: 'Ó glória de mandar! ó vã cobiça!',
            source: 'Canto IV, st. 95 · trans. Richard Burton, 1880',
          },
          focus: { marker: 'belem', distance: 30, pitch: 40 },
          reveal: { routes: ['outward'] },
          highlight: { markers: ['belem'], routes: ['outward'] },
        },
        {
          id: 'i-3',
          title: 'The giant at the Cape',
          narration:
            'Off southern Africa a cloud takes shape and speaks. Adamastor is ' +
            'a Titan who loved a sea-nymph, was tricked into embracing a ' +
            'mountain, and became it — he IS the Cape, and the storms are his ' +
            'temper. He curses every fleet that will round him, foretells the ' +
            'wrecks by name, and then breaks down crying, which is not how ' +
            'monsters in epics usually leave the stage.',
          quote: {
            text:
              'I am that hidden mighty Head of Land,\n' +
              'the Cape of Tempests fitly named by you,\n' +
              'which Ptol’emy, Mela, Strabo never fand,\n' +
              'nor Pliny dreamt of, nor old Sages knew.',
            original: 'Eu sou aquele oculto e grande Cabo',
            source: 'Canto V, st. 50 · trans. Richard Burton, 1880',
          },
          focus: { marker: 'adamastor', distance: 34, pitch: 42 },
          reveal: { markers: ['adamastor', 'good-hope'], regions: ['r-africa'] },
          highlight: { markers: ['adamastor'] },
        },
        {
          id: 'i-4',
          title: 'Up the Swahili coast',
          narration:
            'Past the Cape they are in a sea that already has traffic, ports, ' +
            'sultans and charts, and no interest in them. Quelimane gives them ' +
            'good signs and scurvy; Mozambique gives them pilots who try to ' +
            'wreck them; Mombasa gives them a harbour that is a trap. At ' +
            'Malindi they finally get a welcome and, more to the point, a ' +
            'pilot who knows the monsoon.',
          focus: { marker: 'malindi', distance: 36, pitch: 42 },
          reveal: {
            markers: ['bons-sinais', 'mozambique', 'mombasa', 'malindi'],
            regions: ['r-swahili', 'r-indian'],
          },
          highlight: { markers: ['malindi'] },
        },
        {
          id: 'i-5',
          title: 'Calicut',
          narration:
            'Landfall in May 1498. The Zamorin receives them politely. The ' +
            'merchants already trading there understand immediately what a ' +
            'European fleet with guns means for them and begin working against ' +
            'it. And the presents the Portuguese have brought to one of the ' +
            'richest ports on earth — striped cloth, hats, sugar, honey — are ' +
            'looked at, and laughed at, and refused.',
          focus: { marker: 'calicut', distance: 32, pitch: 40 },
          reveal: { markers: ['calicut'], regions: ['r-malabar'] },
          highlight: { markers: ['calicut'] },
        },
        {
          id: 'i-6',
          title: 'The island that is not there',
          narration:
            'Homeward, against the monsoon, Venus raises an island out of the ' +
            'sea and fills it with nymphs so the crew can be rewarded — and ' +
            'then a goddess shows Gama a crystal model of the universe and ' +
            'tells him what the empire will do next. It is an odd place for a ' +
            'poem to put its thesis, and Camões knows it, because the last ' +
            'stanzas turn away from Gama entirely and address the young king ' +
            'directly: your kingdom is poor, your court is greedy, and I am ' +
            'not being paid.',
          focus: { marker: 'isle-of-love', distance: 40, pitch: 44 },
          reveal: { markers: ['isle-of-love'], routes: ['homeward'] },
          highlight: { markers: ['isle-of-love'], routes: ['homeward'] },
        },
        {
          id: 'i-7',
          title: 'Two ships back',
          narration:
            'The return crossing takes three months instead of three weeks ' +
            'and scurvy takes most of them; of four ships two reach the Tagus, ' +
            'and of about a hundred and seventy men, fifty-five. The sea road ' +
            'to India is open, and everything the old man on the beach shouted ' +
            'turns out to have been correct as well.',
          focus: { marker: 'belem', distance: 44, pitch: 46 },
          highlight: { markers: ['belem'], routes: ['homeward'] },
        },
      ],
    },
  ],
}
