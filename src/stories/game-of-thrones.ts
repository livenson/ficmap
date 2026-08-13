import type { Story } from '../types'
import westerosHeight from '../assets/westeros-height.png'

/**
 * A Song of Ice and Fire / Game of Thrones — the Seven Kingdoms of Westeros,
 * with the Free-Cities coast of Essos across the Narrow Sea.
 *
 * NOTE: Westeros, its houses and place names are the intellectual property of
 * George R. R. Martin (and HBO for the series). This is user-authored,
 * paraphrased data — a fan-project use, not an official work.
 *
 * Westeros's coastline is TRACED from the canonical map (see
 * scripts/build-westeros.mjs), and every Westerosi marker below is placed from
 * the same canonical pixel coordinates, so the silhouette and the places agree.
 * The map is laid out from
 * the canonical world map: WESTEROS is only the western fifth — a long
 * north-south continent, the Wall across its top, the North above the pinched
 * Neck, then the Riverlands and Vale, the Westerlands, King's Landing on
 * Blackwater Bay, the Reach and Stormlands, and Dorne in the south. Across the
 * NARROW SEA (with Dragonstone in it), ESSOS runs far to the east: the Free
 * Cities, the flat Dothraki Sea, drowned Valyria, Slaver's Bay, Qarth and the
 * Red Waste. Marker coordinates are read straight off that map, so relative
 * positions match. Rebuild with `node scripts/build-westeros.mjs`.
 */
export const gameOfThrones: Story = {
  id: 'game-of-thrones',
  title: 'A Song of Ice and Fire',
  subtitle: 'The Known World — Westeros and Essos',
  author: 'George R. R. Martin',
  region: 'Westeros · Essos',
  epoch: 'Published from 1996',
  group: 'fantasy',
  intro:
    'Winter is coming. From the Wall in the frozen north to the dragon-queen ' +
    'rising in the east, the Seven Kingdoms tear themselves apart over the Iron ' +
    'Throne while an older enemy gathers beyond the ice. Press ▶ Play story to ' +
    'follow the game from Winterfell to the Long Night, or open any place to ' +
    'read what happens there.',
  surfaceName: 'The Known World',
  ambient: {
    trees: 0.5,
    treeKind: 'conifer',
    // The maesters' ravens carry every message in Westeros; the dragons are
    // Daenerys's, and breathe fire; the wights shamble beyond the Wall.
    birds: 7,
    birdKind: 'raven',
    dragons: 3,
    fish: 4,
    wights: 14,
    wightArea: { x0: -0.93, x1: -0.55, z0: -0.81, z1: -0.774 },
  },
  terrain: {
    music: {
      title: 'Theme for the Seven Kingdoms',
      credit: 'Original, written for this atlas',
      melody: 'C4:3 G3:1 Ab3:2 Bb3:2 C4:4 Eb4:2 D4:2 C4:4 r:2 Eb4:2 F4:2 G4:3 F4:1 Eb4:2 D4:2 C4:6 r:2',
      bass: 'C2:8 Ab2:8 Eb2:8 G2:8',
      tempo: 50,
      voice: 'strings',
      mood: 'epic',
    },
    seed: 'westeros',
    heightmap: westerosHeight,
    // The known world: Westeros is only the western fifth; Essos runs far east.
    aspect: 1.1,
    seaLevel: 0.15,
    heightScale: 15,
    rivers: 5,
    detail: true, // fine surface bump on the shaped terrain
    waterColor: '#28546e',
    biomes: [
      { maxHeight: 0.15, color: '#28546e', name: 'The Seas' },
      { maxHeight: 0.2, color: '#cbbe93', name: 'Shore' },
      { maxHeight: 0.36, color: '#5b8248', name: 'Green Lands' },
      { maxHeight: 0.52, color: '#4a6b3c', name: 'Wolfswood' },
      { maxHeight: 0.68, color: '#7d7a5c', name: 'Hills' },
      { maxHeight: 0.84, color: '#8a8377', name: 'Mountains' },
      { maxHeight: 1.0, color: '#eef4f8', name: 'Ice & Snow' },
    ],
  },
  markers: [
    // ---------------- Beyond the Wall & the North ----------------
    {
      id: 'always-winter',
      name: 'The Lands of Always Winter',
      kind: 'danger',
      at: { x: -0.84, z: -0.7887 },
      description:
        'The frozen wastes north of the Wall, where the Free Folk range among ' +
        'the Frostfangs and the haunted forest — and where the Others and their ' +
        'army of the dead wake after eight thousand years.',
    },
    {
      id: 'castle-black',
      name: 'Castle Black — the Wall',
      kind: 'landmark',
      at: { x: -0.6299, z: -0.7542 },
      description:
        'Seven hundred feet of ice across the top of the world, held by the ' +
        'sworn brothers of the Night’s Watch. Castle Black guards the way ' +
        'through, between the Shadow Tower and Eastwatch-by-the-Sea.',
    },
    {
      id: 'winterfell',
      name: 'Winterfell',
      kind: 'capital',
      at: { x: -0.7074, z: -0.54 },
      description:
        'The ancient seat of House Stark, raised over hot springs so its walls ' +
        'stay warm in the deepest winter. Home of the direwolves — and where the ' +
        'game begins, when the king rides north to name a new Hand.',
    },
    {
      id: 'dreadfort',
      name: 'The Dreadfort',
      kind: 'danger',
      at: { x: -0.6181, z: -0.5711 },
      description:
        'The Bolton seat east of Winterfell, whose flayed-man banner is no ' +
        'boast — a grim keep with a reputation to match.',
    },
    {
      id: 'white-harbor',
      name: 'White Harbor',
      kind: 'port',
      at: { x: -0.631, z: -0.4039 },
      description:
        'The only true city of the North, at the mouth of the White Knife — ' +
        'House Manderly’s port, and the North’s window on the sea.',
    },
    {
      id: 'moat-cailin',
      name: 'Moat Cailin — the Neck',
      kind: 'ruin',
      at: { x: -0.6983, z: -0.3603 },
      description:
        'Ruined towers commanding the causeway through the bogs of the Neck — ' +
        'the narrow throat of the continent, and the gate no southern army has ' +
        'ever forced.',
    },
    // ---------------- The Riverlands, the Vale, the Iron Islands ----------------
    {
      id: 'the-twins',
      name: 'The Twins',
      kind: 'battle',
      at: { x: -0.732, z: -0.207 },
      description:
        'House Frey’s twin castles astride the Green Fork, and the only crossing ' +
        'for a hundred leagues. Here a wedding becomes the Red Wedding, and the ' +
        'King in the North is betrayed under guest right.',
    },
    {
      id: 'riverrun',
      name: 'Riverrun',
      kind: 'city',
      at: { x: -0.7464, z: -0.0923 },
      description:
        'The Tully stronghold in the fork of two rivers, able to flood its moat ' +
        'and become an island — the seat of Catelyn Stark’s house.',
    },
    {
      id: 'harrenhal',
      name: 'Harrenhal',
      kind: 'ruin',
      at: { x: -0.6555, z: -0.0508 },
      description:
        'The vast, half-melted castle by the God’s Eye, its towers run to slag ' +
        'by dragonfire on the day of Aegon’s conquest. Every house to hold it ' +
        'since has come to a bad end.',
    },
    {
      id: 'the-eyrie',
      name: 'The Eyrie',
      kind: 'city',
      at: { x: -0.5877, z: -0.1461 },
      description:
        'House Arryn’s castle high in the Mountains of the Moon, reached only by ' +
        'a narrow mule track — and holding the sky cells, whose fourth wall is a ' +
        'long fall to the valley below.',
    },
    {
      id: 'pyke',
      name: 'Pyke — the Iron Islands',
      kind: 'port',
      at: { x: -0.8737, z: -0.1365 },
      description:
        'The Greyjoy seat on wave-battered stacks off the west coast, home of ' +
        'the ironborn who pay the iron price and answer to no green-land king.',
    },
    // ---------------- Westerlands, Crownlands, Reach, Stormlands, Dorne ----------------
    {
      id: 'casterly-rock',
      name: 'Casterly Rock',
      kind: 'city',
      at: { x: -0.8737, z: 0.0024 },
      description:
        'The Lannisters’ gold-veined fortress carved down through a mountain ' +
        'above Lannisport — the wealth that pays for the wars of the realm.',
    },
    {
      id: 'kings-landing',
      name: "King's Landing",
      kind: 'capital',
      at: { x: -0.6058, z: 0.0646 },
      description:
        'The capital on Blackwater Bay: the Red Keep, the Iron Throne, and a ' +
        'million souls in the stink and squalor below. Every road in the game of ' +
        'thrones leads here at last.',
    },
    {
      id: 'dragonstone',
      name: 'Dragonstone',
      kind: 'landmark',
      at: { x: -0.5085, z: 0.0211 },
      description:
        'The Targaryens’ ancestral island fortress in the Narrow Sea, carved with ' +
        'gargoyles and dragons — the first foothold of the conquest, and the seat ' +
        'a returning queen claims again.',
    },
    {
      id: 'storms-end',
      name: "Storm's End",
      kind: 'city',
      at: { x: -0.5444, z: 0.2235 },
      description:
        'The Baratheon fortress on the storm coast, whose vast curtain wall has ' +
        'never fallen to siege or tempest.',
    },
    {
      id: 'highgarden',
      name: 'Highgarden',
      kind: 'city',
      at: { x: -0.8143, z: 0.2581 },
      description:
        'The Tyrell seat amid the orchards and fields of the Reach — the richest ' +
        'harvest in Westeros, and the food that feeds the capital.',
    },
    {
      id: 'oldtown',
      name: 'Oldtown',
      kind: 'city',
      at: { x: -0.8817, z: 0.3548 },
      description:
        'The oldest city in Westeros, at the mouth of the Honeywine — the ' +
        'Citadel of the maesters, and the Hightower burning its beacon over the ' +
        'sea.',
    },
    {
      id: 'sunspear',
      name: 'Sunspear, Dorne',
      kind: 'city',
      at: { x: -0.5262, z: 0.4419 },
      description:
        'Beyond the Red Mountains, the Martells hold the hot deserts of Dorne — ' +
        'never conquered, only wed into the realm, and slow to forget a wrong.',
    },
    // ---------------- Essos ----------------
    {
      id: 'braavos',
      name: 'Braavos',
      kind: 'port',
      at: { x: -0.335, z: -0.169 },
      description:
        'The secret city in the northern lagoons, guarded by the Titan and home ' +
        'to the Iron Bank — and to the House of Black and White, where a girl ' +
        'learns to have no name.',
    },
    {
      id: 'pentos',
      name: 'Pentos',
      kind: 'port',
      at: { x: -0.302, z: 0.136 },
      description:
        'A Free City of merchant princes on the eastern shore of the Narrow Sea, ' +
        'where the exiled Targaryens are sheltered — and where Daenerys is sold ' +
        'in marriage to a Dothraki khal.',
    },
    {
      id: 'free-cities',
      name: 'Tyrosh & Myr',
      kind: 'town',
      at: { x: -0.3, z: 0.32 },
      description:
        'Free Cities of the Disputed Lands and the Sea of Myrrh, forever at war ' +
        'with one another over the Stepstones — and forever selling sellswords ' +
        'to whoever pays.',
    },
    {
      id: 'volantis',
      name: 'Volantis',
      kind: 'city',
      at: { x: 0.012, z: 0.532 },
      description:
        'The oldest and proudest daughter of Valyria, straddling the mouth of ' +
        'the Rhoyne behind its Black Wall — a city of slaves, elephants and red ' +
        'priests preaching of the Lord of Light.',
    },
    {
      id: 'vaes-dothrak',
      name: 'Vaes Dothrak',
      kind: 'capital',
      at: { x: 0.479, z: 0.286 },
      description:
        'The only city the Dothraki keep, beneath the Mother of Mountains — ' +
        'where no blade may be drawn, and where the crones of the dosh khaleen ' +
        'read the future in the flames.',
    },
    {
      id: 'astapor',
      name: 'Astapor',
      kind: 'city',
      at: { x: 0.503, z: 0.623 },
      description:
        'The red-brick slaver city where the Unsullied are made and sold. ' +
        'Daenerys trades a dragon for an army — and then takes both.',
    },
    {
      id: 'qarth',
      name: 'Qarth',
      kind: 'port',
      at: { x: 0.586, z: 0.857 },
      description:
        'The Queen of Cities beyond the Red Waste, greatest of the ports that ' +
        'have ever been — where warlocks and merchant princes offer Daenerys ' +
        'ships, and take her dragons instead.',
    },
    {
      id: 'red-waste',
      name: 'The Red Waste',
      kind: 'danger',
      at: { x: 0.882, z: 0.779 },
      description:
        'A dead scarlet desert in the far south-east, crossed only in ' +
        'desperation — as Daenerys crosses it, with a starving khalasar and ' +
        'three small dragons.',
    },
    {
      id: 'dothraki-sea',
      name: 'The Dothraki Sea',
      kind: 'landmark',
      at: { x: 0.325, z: 0.325 },
      description:
        'Beyond the Free Cities, an ocean of grass ridden by the horselords, ' +
        'stretching east to the horizon — and Vaes Dothrak beneath its mother ' +
        'mountain, the only city the Dothraki keep.',
    },
    {
      id: 'valyria',
      name: 'The Smoking Ruin of Valyria',
      kind: 'ruin',
      at: { x: 0.2, z: 0.7 },
      description:
        'Away to the south-east lies the drowned, burning wreck of the Freehold ' +
        'that once ruled half the world and bred the dragons. Since the Doom, no ' +
        'ship that sails too close is heard from again.',
    },
    {
      id: 'meereen',
      name: 'Meereen — Slaver’s Bay',
      kind: 'city',
      at: { x: 0.55, z: 0.519 },
      description:
        'Far east beyond Valyria, the great pyramid city of Slaver’s Bay. ' +
        'Daenerys takes it, breaks its chains, and stays to learn how much harder ' +
        'it is to rule a city than to burn one.',
    },
  ],
  routes: [
    {
      id: 'kingsroad',
      name: 'The Kingsroad',
      color: '#e8dcc0',
      style: 'solid',
      description:
        'The great road down the spine of Westeros, from Castle Black at the Wall ' +
        'through Winterfell and the Neck to King’s Landing.',
      points: [
        { x: -0.6299, z: -0.7542 },
        { x: -0.7074, z: -0.54 },
        { x: -0.6983, z: -0.3603 },
        { x: -0.732, z: -0.207 },
        { x: -0.6555, z: -0.0508 },
        { x: -0.6058, z: 0.0646 },
      ],
    },
    {
      id: 'dany-road',
      name: 'The Dragon Queen’s Road',
      color: '#e0533c',
      style: 'dashed',
      description:
        'Daenerys from exile in Pentos, east with the khalasar to the Dothraki ' +
        'Sea, on to Slaver’s Bay — and at last west over the Narrow Sea to ' +
        'Dragonstone.',
      points: [
        { x: -0.302, z: 0.136 },
        { x: 0.325, z: 0.325 },
        { x: 0.586, z: 0.857 },
        { x: 0.503, z: 0.623 },
        { x: 0.550, z: 0.519 },
        { x: -0.5085, z: 0.0211 },
      ],
    },
  ],
  regions: [
    // Westerosi labels sit over the traced continent, from the canonical map.
    { id: 'beyond', name: 'The Lands of Always Winter', at: { x: -0.79, z: -0.80 }, scale: 0.55 },
    { id: 'the-north', name: 'The North', at: { x: -0.72, z: -0.44 }, scale: 0.7 },
    { id: 'riverlands', name: 'The Riverlands', at: { x: -0.73, z: -0.12 }, scale: 0.5 },
    { id: 'the-vale', name: 'The Vale of Arryn', at: { x: -0.58, z: -0.19 }, scale: 0.5 },
    { id: 'westerlands', name: 'The Westerlands', at: { x: -0.84, z: -0.04 }, scale: 0.5 },
    { id: 'crownlands', name: 'The Crownlands', at: { x: -0.58, z: 0.03 }, scale: 0.45 },
    { id: 'the-reach', name: 'The Reach', at: { x: -0.77, z: 0.20 }, scale: 0.55 },
    { id: 'stormlands', name: 'The Stormlands', at: { x: -0.56, z: 0.17 }, scale: 0.45 },
    { id: 'dorne-region', name: 'Dorne', at: { x: -0.67, z: 0.43 }, scale: 0.6 },
    { id: 'narrow-sea', name: 'The Narrow Sea', at: { x: -0.41, z: -0.05 }, scale: 0.55 },
    { id: 'free-cities-region', name: 'The Free Cities', at: { x: -0.18, z: 0.2 }, scale: 0.7 },
    { id: 'dothraki', name: 'The Dothraki Sea', at: { x: 0.34, z: 0.2 }, scale: 0.9 },
    { id: 'slavers-bay', name: "Slaver's Bay", at: { x: 0.5, z: 0.62 }, scale: 0.7 },
    { id: 'essos', name: 'Essos', at: { x: 0.72, z: 0.42 }, scale: 1.0 },
  ],
  elements: [
    {
      id: 'iron-throne',
      name: 'The Iron Throne',
      glyph: '⚔',
      description:
        'A monstrous seat of a thousand swords surrendered to Aegon the ' +
        'Conqueror and welded in dragonfire — barbed, uncomfortable, and the ' +
        'prize every player of the game is killing for.',
      journey: [
        {
          marker: 'kings-landing',
          sinceChapter: 0,
          note: 'In the Red Keep, where it has always stood.',
        },
      ],
    },
    {
      id: 'dragons',
      name: 'The Dragons',
      glyph: '🐉',
      description:
        'Drogon, Rhaegal and Viserion — hatched from stone eggs in a funeral ' +
        'pyre, the first dragons in a century and a half. Follow them from the ' +
        'grass sea to Slaver’s Bay and west into the war.',
      journey: [
        { marker: 'dothraki-sea', sinceChapter: 3, note: 'Hatched in the pyre on the grass sea.' },
        { marker: 'meereen', sinceChapter: 4, note: 'Grown large over Slaver’s Bay.' },
        {
          marker: 'dragonstone',
          sinceChapter: 5,
          note: 'Carried west to claim the Seven Kingdoms.',
        },
      ],
    },
  ],
  chapters: [
    {
      id: 'winter-is-coming',
      title: 'Winter Is Coming',
      narration:
        'In the North, House Stark keeps the old ways at Winterfell, and beyond ' +
        'the Wall the Night’s Watch finds something that should not be walking. ' +
        'Then the king rides north to name Ned Stark his Hand, and the quiet ends.',
      focus: { marker: 'winterfell', distance: 30, pitch: 36 },
      reveal: {
        markers: ['winterfell', 'castle-black', 'always-winter', 'white-harbor', 'dreadfort'],
        routes: ['kingsroad'],
        regions: ['the-north', 'beyond'],
      },
      highlight: { markers: ['winterfell'] },
    },
    {
      id: 'the-iron-throne',
      title: "King's Landing & the Game",
      narration:
        'South down the Kingsroad, through the Neck and the Riverlands, to the ' +
        'capital on Blackwater Bay — where the Iron Throne sits in the Red Keep ' +
        'and every smile hides a knife. A Hand asks too many questions about a ' +
        'dead man’s books, and loses his head for the answer.',
      focus: { marker: 'kings-landing', distance: 28, pitch: 34 },
      reveal: {
        markers: [
          'moat-cailin',
          'harrenhal',
          'kings-landing',
          'casterly-rock',
          'the-eyrie',
          'dragonstone',
        ],
        regions: ['riverlands', 'the-vale', 'westerlands', 'crownlands'],
      },
      highlight: { markers: ['kings-landing'] },
    },
    {
      id: 'war-of-five-kings',
      title: 'The War of the Five Kings',
      narration:
        'The realm breaks into war: a King in the North, a Baratheon in his ' +
        'storm-lashed keep, the ironborn raiding the coasts, and the Lannisters ' +
        'holding the throne. At the Twins a wedding ends in slaughter under ' +
        'guest right, and the northern cause dies with it.',
      focus: { marker: 'the-twins', distance: 26, pitch: 34 },
      reveal: {
        markers: ['the-twins', 'riverrun', 'pyke', 'storms-end', 'highgarden', 'oldtown', 'sunspear'],
        regions: ['the-reach', 'stormlands', 'dorne-region'],
      },
      highlight: { markers: ['the-twins'] },
    },
    {
      id: 'across-the-sea',
      title: 'The Dragon Queen',
      narration:
        'Across the Narrow Sea the last Targaryen is sold to a Dothraki khal. ' +
        'Out of a funeral pyre on the grass sea she walks unburnt with three ' +
        'hatchlings on her shoulders — the first dragons in a hundred and fifty ' +
        'years.',
      focus: { marker: 'pentos', distance: 28, pitch: 34 },
      reveal: {
        markers: [
          'pentos',
          'braavos',
          'free-cities',
          'volantis',
          'dothraki-sea',
          'vaes-dothrak',
          'valyria',
        ],
        routes: ['dany-road'],
        regions: ['narrow-sea', 'free-cities-region', 'dothraki', 'essos'],
      },
      highlight: { markers: ['pentos', 'vaes-dothrak'] },
    },
    {
      id: 'breaker-of-chains',
      title: 'Breaker of Chains',
      narration:
        'Daenerys takes the slave cities of the east one by one and stays in ' +
        'Meereen to rule what she has broken — while her dragons grow too large, ' +
        'and too wild, to be kept chained beneath a pyramid.',
      focus: { marker: 'meereen', distance: 26, pitch: 34 },
      reveal: {
        markers: ['red-waste', 'qarth', 'astapor', 'meereen'],
        regions: ['slavers-bay'],
      },
      highlight: { markers: ['meereen', 'valyria'] },
    },
    {
      id: 'the-long-night',
      title: 'The Long Night',
      narration:
        'The queen sails west at last to Dragonstone, and the game of thrones ' +
        'meets the war that always mattered: the dead come south over the Wall, ' +
        'and fire and ice are all that stand between the living and an endless ' +
        'winter.',
      focus: { marker: 'castle-black', distance: 30, pitch: 34 },
      reveal: { markers: [] },
      highlight: { markers: ['castle-black', 'always-winter', 'dragonstone'] },
    },
  ],
}
