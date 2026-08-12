import type { Story } from '../types'
import worldHeight from '../assets/world-height.png'

/**
 * The Extraordinary Voyages — Jules Verne (Voyages extraordinaires, 1863–1905;
 * public domain). Verne's cycle is set on our one planet, so this is a COMMON
 * world: a single world map, with each novel a "book" tracing its journey.
 * Journey to the Center of the Earth is the exception and gets its own world,
 * because it goes straight down.
 *
 * The surface is a REAL heightmap: a Terrarium DEM of the whole Earth (bbox lon
 * −180..180, lat −62..78). Markers sit at their true coordinates — map-x is
 * lon/180 and map-z is 2·(78−lat)/140 − 1. Because a global map is wider than
 * it is tall, the square world stretches it vertically (continents read tall);
 * and because a circumnavigation crosses the date line, the Eighty-Days route
 * is split so it leaves the east edge and re-enters the west edge. Rebuild with
 * `node scripts/build-heightmap.mjs world`.
 */
export const verne: Story = {
  id: 'verne-voyages',
  title: 'The Extraordinary Voyages',
  subtitle: 'Jules Verne — many journeys, one real world',
  author: 'Jules Verne',
  region: 'The whole Earth',
  epoch: 'Voyages extraordinaires · 1863–1905',
  intro:
    'Jules Verne’s Voyages extraordinaires all cross the same globe: around it ' +
    'in eighty days, twenty thousand leagues beneath it, and out to a lonely ' +
    'Pacific isle. One shared world map, several books — press ▶ Play story to ' +
    'follow a voyage, or open any place to read where it belongs.',
  surfaceName: 'The World',
  ambient: { trees: 0.3, birds: 7, fish: 5 },
  terrain: {
    music: {
      title: 'Largo, "From the New World"',
      credit: 'Antonín Dvořák, 1893 · public domain',
      melody:
        'G3:2 A3:1 G3:3 E3:2 G3:2 A3:1 G3:3 E3:2 r:2 G3:2 A3:1 C4:1 A3:1 G3:3 E3:2 D3:2 E3:1 G3:1 E3:4 r:2',
      bass: 'C2:8 A2:8 F2:8 C3:8',
      tempo: 54,
      voice: 'horn',
      mood: 'wonder',
    },
    seed: 'verne-dem',
    heightmap: worldHeight,
    // The DEM spans 360° of longitude over 140° of latitude, so the world is
    // ~2.57× wider than deep — keep that ratio instead of squaring the globe.
    aspect: 360 / 140,
    seaLevel: 0.0017, // 0 m in the capped (−6..3500 m) DEM, sea flattened
    heightScale: 5,
    rivers: 0,
    biomes: [
      { maxHeight: 0.0017, color: '#26618a', name: 'Ocean' },
      { maxHeight: 0.02, color: '#d9cfa6', name: 'Coast' },
      { maxHeight: 0.1, color: '#3f7a4a', name: 'Lowlands' },
      { maxHeight: 0.26, color: '#5f7a3c', name: 'Steppe' },
      { maxHeight: 0.58, color: '#8a8474', name: 'Mountains' },
      { maxHeight: 1.0, color: '#f2f2f2', name: 'Snows' },
    ],
  },
  markers: [
    // --- Around the World in Eighty Days ---
    {
      id: 'london',
      name: 'London',
      kind: 'capital',
      at: { x: -0.001, z: -0.621 }, // 51.5 N, 0
      description:
        'The Reform Club, where Phileas Fogg wagers £20,000 that he can circle ' +
        'the globe in eighty days — and sets out that same night.',
    },
    {
      id: 'suez',
      name: 'Suez',
      kind: 'port',
      at: { x: 0.181, z: -0.314 }, // 30 N, 32.5 E
      description:
        'The new canal and the first checkpoint east, where the detective Fix ' +
        'first picks up Fogg’s trail.',
    },
    {
      id: 'bombay',
      name: 'Bombay',
      kind: 'city',
      at: { x: 0.405, z: -0.158 }, // 19 N, 72.9 E
      description:
        'Landfall in India. From here the railway is not yet finished, and the ' +
        'crossing must be made by elephant.',
    },
    {
      id: 'calcutta',
      name: 'Calcutta',
      kind: 'city',
      at: { x: 0.491, z: -0.208 }, // 22.6 N, 88.4 E
      description:
        'Reached with the rescued Aouda, after a daring ride through the ' +
        'jungle and a night in an Indian court.',
    },
    {
      id: 'hongkong',
      name: 'Hong Kong',
      kind: 'port',
      at: { x: 0.634, z: -0.205 }, // 22.3 N, 114.2 E
      description:
        'The last British soil eastward, where Passepartout is waylaid and the ' +
        'steamer to Japan is nearly missed.',
    },
    {
      id: 'yokohama',
      name: 'Yokohama',
      kind: 'port',
      at: { x: 0.776, z: -0.392 }, // 35.4 N, 139.6 E
      description:
        'Japan, and a reunion at a travelling circus, before the long steam ' +
        'across the Pacific to America.',
    },
    {
      id: 'san-francisco',
      name: 'San Francisco',
      kind: 'city',
      at: { x: -0.68, z: -0.425 }, // 37.8 N, 122.4 W
      description:
        'The New World. From here the transcontinental railroad runs east ' +
        'through prairie, buffalo, and a Sioux raid.',
    },
    {
      id: 'new-york',
      name: 'New York',
      kind: 'city',
      at: { x: -0.411, z: -0.467 }, // 40.7 N, 74 W
      description:
        'The Atlantic packet is missed by minutes; Fogg buys a steamer and ' +
        'burns it to the waterline for fuel to reach England in time.',
    },
    // --- Twenty Thousand Leagues Under the Seas ---
    {
      id: 'pacific-deeps',
      name: 'The Pacific Deeps',
      kind: 'danger',
      at: { x: 0.86, z: -0.35 }, // NW Pacific, off Japan
      description:
        'Where the frigate hunting the "sea monster" is rammed, and three men ' +
        'wake aboard Captain Nemo’s Nautilus.',
    },
    {
      id: 'atlantis',
      name: 'Sunken Atlantis',
      kind: 'ruin',
      at: { x: -0.222, z: -0.314 }, // mid-Atlantic
      description:
        'By the glow of an undersea volcano, Nemo walks the drowned streets of ' +
        'a city lost beneath the Atlantic.',
    },
    {
      id: 'south-pole',
      name: 'The Antarctic',
      kind: 'peak',
      at: { x: -0.28, z: 0.96 }, // far south (below the DEM's edge)
      description:
        'The Nautilus drives beneath the ice toward the bottom of the world, ' +
        'where Nemo plants his black flag — and is nearly entombed by a berg.',
    },
    {
      id: 'maelstrom',
      name: 'The Maelström',
      kind: 'danger',
      at: { x: 0.067, z: -0.857 }, // off Norway
      description:
        'Off the Norwegian coast, the great whirlpool seizes the Nautilus. The ' +
        'three prisoners escape in the chaos; of Nemo, no more is heard.',
    },
    // --- The Mysterious Island ---
    {
      id: 'lincoln-island',
      name: 'Lincoln Island',
      kind: 'landmark',
      at: { x: -0.833, z: 0.61 }, // lonely South Pacific
      description:
        'A balloon flung from a siege drops five castaways on an unknown ' +
        'Pacific isle, which they tame — watched over by a hidden benefactor.',
    },
    // --- From the Earth to the Moon ---
    {
      id: 'stone-hill',
      name: 'Stone Hill, Florida',
      kind: 'battle',
      at: { x: -0.458, z: -0.284 }, // Florida
      description:
        'The Gun Club casts a nine-hundred-foot cannon in the Florida earth to ' +
        'fire a manned projectile at the Moon.',
    },
  ],
  routes: [
    {
      // Eastward from London to the edge of the world (the date line)…
      id: 'eighty-days-east',
      name: 'Around the World in Eighty Days',
      color: '#ffce54',
      style: 'solid',
      points: [
        { x: -0.001, z: -0.621 },
        { x: 0.181, z: -0.314 },
        { x: 0.405, z: -0.158 },
        { x: 0.491, z: -0.208 },
        { x: 0.634, z: -0.205 },
        { x: 0.776, z: -0.392 },
        { x: 1.0, z: -0.41 }, // exits the east edge, crossing the Pacific
      ],
      description:
        'Phileas Fogg’s eastward circuit of the globe — and back to the Reform ' +
        'Club with a day, secretly, to spare.',
    },
    {
      // …and back in from the western edge to San Francisco, New York, home.
      id: 'eighty-days-west',
      name: 'Around the World (Pacific to home)',
      color: '#ffce54',
      style: 'solid',
      points: [
        { x: -1.0, z: -0.43 }, // re-enters the west edge
        { x: -0.68, z: -0.425 },
        { x: -0.411, z: -0.467 },
        { x: -0.001, z: -0.621 },
      ],
    },
    {
      id: 'nautilus',
      name: 'Voyage of the Nautilus',
      color: '#5fd0c8',
      style: 'dashed',
      points: [
        { x: 0.86, z: -0.35 },
        { x: -0.833, z: 0.61 },
        { x: -0.28, z: 0.96 },
        { x: -0.222, z: -0.314 },
        { x: 0.067, z: -0.857 },
      ],
      description:
        'Twenty thousand leagues under the seas: Pacific to the ice to Atlantis ' +
        'to the northern whirlpool.',
    },
    {
      id: 'to-the-moon',
      name: 'To the Moon',
      color: '#c9b6ff',
      style: 'dashed',
      points: [
        { x: -0.458, z: -0.284 },
        { x: -0.5, z: -0.7 },
        { x: -0.54, z: -0.99 },
      ],
      description: 'The Gun Club’s projectile, fired from Florida into the night.',
    },
  ],
  regions: [
    { id: 'europe', name: 'Europe', at: { x: 0.03, z: -0.62 }, scale: 0.7 },
    { id: 'asia', name: 'Asia', at: { x: 0.5, z: -0.44 }, scale: 1.0 },
    { id: 'north-america', name: 'North America', at: { x: -0.6, z: -0.52 }, scale: 0.9 },
    { id: 'the-pacific', name: 'The Pacific', at: { x: 0.9, z: 0.12 }, scale: 1.0 },
    { id: 'the-atlantic', name: 'The Atlantic', at: { x: -0.25, z: 0.06 }, scale: 1.0 },
  ],
  elements: [
    {
      id: 'nautilus-sub',
      name: 'The Nautilus',
      glyph: '⚓',
      description:
        'Captain Nemo’s submarine, a world unto itself. Follow it under the ' +
        'oceans from the Pacific to the ice and back to the northern seas.',
      journey: [
        { marker: 'pacific-deeps', sinceChapter: 3, note: 'Its prisoners come aboard.' },
        { marker: 'south-pole', sinceChapter: 4, note: 'Beneath the ice, ever south.' },
        { marker: 'atlantis', sinceChapter: 4, note: 'Past the drowned city.' },
        { marker: 'maelstrom', sinceChapter: 5, note: 'Lost in the whirlpool.' },
      ],
    },
  ],
  books: [
    {
      id: 'eighty-days',
      title: 'Around the World in Eighty Days',
      subtitle: 'The wager',
      chapters: [
        {
          id: 'the-wager',
          title: 'The Wager',
          narration:
            'At the Reform Club, Phileas Fogg bets his fortune that he can ' +
            'circle the Earth in eighty days, and leaves that night with his ' +
            'new servant Passepartout — pursued by a detective who thinks him a ' +
            'bank robber.',
          focus: { marker: 'london', distance: 30, pitch: 40 },
          reveal: {
            markers: ['london', 'suez'],
            routes: ['eighty-days-east'],
            regions: ['europe'],
          },
          highlight: { markers: ['london'] },
        },
        {
          id: 'the-east',
          title: 'Through the East',
          narration:
            'Suez, Bombay, an elephant across India, a rescue, Calcutta, Hong ' +
            'Kong, Yokohama — the party races east by rail and steamer, always ' +
            'a step ahead of the clock.',
          focus: { marker: 'calcutta', distance: 46, pitch: 34 },
          reveal: {
            markers: ['bombay', 'calcutta', 'hongkong', 'yokohama'],
            regions: ['asia'],
          },
          highlight: { markers: ['bombay', 'calcutta', 'hongkong', 'yokohama'] },
        },
        {
          id: 'the-race-home',
          title: 'The Race Home',
          narration:
            'Across the Pacific to San Francisco, the railroad east through a ' +
            'Sioux raid, and a burning steamer over the Atlantic — home to ' +
            'London, where a day gained crossing the date line wins the wager.',
          focus: { marker: 'new-york', distance: 48, pitch: 32 },
          reveal: {
            markers: ['san-francisco', 'new-york'],
            routes: ['eighty-days-west'],
            regions: ['north-america', 'the-atlantic'],
          },
          highlight: {
            markers: ['san-francisco', 'new-york', 'london'],
            routes: ['eighty-days-east', 'eighty-days-west'],
          },
        },
      ],
    },
    {
      id: 'twenty-thousand',
      title: 'Twenty Thousand Leagues Under the Seas',
      subtitle: 'The Nautilus',
      chapters: [
        {
          id: 'aboard',
          title: 'Aboard the Nautilus',
          narration:
            'Hunting a monster that sinks ships, Professor Aronnax and two ' +
            'companions are thrown into the sea and taken aboard the Nautilus — ' +
            'the "monster" itself — by the mysterious Captain Nemo.',
          focus: { marker: 'pacific-deeps', distance: 44, pitch: 30 },
          reveal: { markers: ['pacific-deeps'], routes: ['nautilus'], regions: ['the-pacific'] },
          highlight: { markers: ['pacific-deeps'] },
        },
        {
          id: 'under-the-world',
          title: 'Under the World',
          narration:
            'The submarine crosses every sea: south beneath the antarctic ice, ' +
            'through the drowned streets of Atlantis, and north again — until ' +
            'the great Maelström swallows it and the prisoners break free.',
          focus: { marker: 'atlantis', distance: 48, pitch: 30 },
          reveal: {
            markers: ['south-pole', 'atlantis', 'maelstrom'],
            regions: ['the-atlantic'],
          },
          highlight: { markers: ['south-pole', 'atlantis', 'maelstrom'] },
        },
      ],
    },
    {
      id: 'mysterious-island',
      title: 'The Mysterious Island',
      subtitle: 'The castaways',
      chapters: [
        {
          id: 'the-castaways',
          title: 'Cast Away',
          narration:
            'Five prisoners of war escape a siege by balloon and are wrecked on ' +
            'an unknown Pacific island. With knowledge alone they forge a colony ' +
            '— and slowly sense a hidden hand aiding them: Captain Nemo, at the ' +
            'end of his days.',
          focus: { marker: 'lincoln-island', distance: 34, pitch: 36 },
          reveal: { markers: ['lincoln-island'], regions: ['the-pacific'] },
          highlight: { markers: ['lincoln-island'] },
        },
      ],
    },
    {
      id: 'to-the-moon',
      title: 'From the Earth to the Moon',
      subtitle: 'The Gun Club',
      chapters: [
        {
          id: 'the-shot',
          title: 'The Columbiad',
          narration:
            'With the war over, the Baltimore Gun Club turns its genius for ' +
            'artillery on the sky: a colossal cannon sunk in the Florida earth ' +
            'to fire three travellers, in an aluminium projectile, straight at ' +
            'the Moon.',
          focus: { marker: 'stone-hill', distance: 34, pitch: 40 },
          reveal: { markers: ['stone-hill'], routes: ['to-the-moon'], regions: ['north-america'] },
          highlight: { markers: ['stone-hill'], routes: ['to-the-moon'] },
        },
      ],
    },
  ],
}
