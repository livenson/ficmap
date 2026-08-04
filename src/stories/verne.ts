import type { Story } from '../types'

/**
 * The Extraordinary Voyages — Jules Verne (Voyages extraordinaires, 1863–1905;
 * public domain). Verne's great cycle isn't set in one invented land — it is
 * set on our one planet, novel after novel circling, diving beneath, and
 * crossing the same globe. So this is a COMMON world: a single stylised world
 * atlas, with each novel a "book" that traces its own journey across it (the
 * shared-map, multi-book feature). Journey to the Center of the Earth is the
 * exception and gets its own world, because it goes straight down.
 *
 * The map is procedural (a stylised atlas, not a real Earth DEM), so the
 * continents are evocative rather than exact; the routes are what matter.
 */
export const verne: Story = {
  id: 'verne-voyages',
  title: 'The Extraordinary Voyages',
  subtitle: 'Jules Verne — many journeys, one world',
  intro:
    'Jules Verne’s Voyages extraordinaires all cross the same globe: around it ' +
    'in eighty days, twenty thousand leagues beneath it, and out to a lonely ' +
    'Pacific isle. One shared world atlas, several books — press ▶ Play story ' +
    'to follow a voyage, or open any place to read where it belongs.',
  surfaceName: 'The World',
  ambient: { trees: 0.4, birds: 7, fish: 5 },
  terrain: {
    seed: 'verne-world-12',
    seaLevel: 0.42,
    islandFalloff: 0.06,
    heightScale: 22,
    frequency: 1.7,
    rivers: 4,
    biomes: [
      { maxHeight: 0.42, color: '#1f5773', name: 'Ocean' },
      { maxHeight: 0.47, color: '#d9cfa6', name: 'Coast' },
      { maxHeight: 0.6, color: '#3f7a4a', name: 'Lowlands' },
      { maxHeight: 0.74, color: '#5f7a3c', name: 'Steppe' },
      { maxHeight: 0.88, color: '#8a8474', name: 'Mountains' },
      { maxHeight: 1.0, color: '#f2f2f2', name: 'Snows' },
    ],
  },
  markers: [
    // --- Around the World in Eighty Days (the loop) ---
    {
      id: 'london',
      name: 'London',
      kind: 'capital',
      at: { x: -0.5, z: -0.5 },
      description:
        'The Reform Club, where Phileas Fogg wagers £20,000 that he can circle ' +
        'the globe in eighty days — and sets out that same night.',
    },
    {
      id: 'suez',
      name: 'Suez',
      kind: 'port',
      at: { x: -0.12, z: -0.18 },
      description:
        'The new canal and the first checkpoint east, where the detective Fix ' +
        'first picks up Fogg’s trail.',
    },
    {
      id: 'bombay',
      name: 'Bombay',
      kind: 'city',
      at: { x: 0.18, z: 0.04 },
      description:
        'Landfall in India. From here the railway is not yet finished, and the ' +
        'crossing must be made by elephant.',
    },
    {
      id: 'calcutta',
      name: 'Calcutta',
      kind: 'city',
      at: { x: 0.38, z: -0.04 },
      description:
        'Reached with the rescued Aouda, after a daring ride through the ' +
        'jungle and a night in an Indian court.',
    },
    {
      id: 'hongkong',
      name: 'Hong Kong',
      kind: 'port',
      at: { x: 0.58, z: 0.08 },
      description:
        'The last British soil eastward, where Passepartout is waylaid and the ' +
        'steamer to Japan is nearly missed.',
    },
    {
      id: 'yokohama',
      name: 'Yokohama',
      kind: 'port',
      at: { x: 0.82, z: -0.14 },
      description:
        'Japan, and a reunion at a travelling circus, before the long steam ' +
        'across the Pacific to America.',
    },
    {
      id: 'san-francisco',
      name: 'San Francisco',
      kind: 'city',
      at: { x: -0.82, z: 0.2 },
      description:
        'The New World. From here the transcontinental railroad runs east ' +
        'through prairie, buffalo, and a Sioux raid.',
    },
    {
      id: 'new-york',
      name: 'New York',
      kind: 'city',
      at: { x: -0.44, z: 0.0 },
      description:
        'The Atlantic packet is missed by minutes; Fogg buys a steamer and ' +
        'burns it to the waterline for fuel to reach England in time.',
    },
    // --- Twenty Thousand Leagues Under the Seas ---
    {
      id: 'pacific-deeps',
      name: 'The Pacific Deeps',
      kind: 'danger',
      at: { x: 0.86, z: 0.34 },
      description:
        'Where the frigate hunting the "sea monster" is rammed, and three men ' +
        'wake aboard Captain Nemo’s Nautilus.',
    },
    {
      id: 'atlantis',
      name: 'Sunken Atlantis',
      kind: 'ruin',
      at: { x: -0.6, z: 0.44 },
      description:
        'By the glow of an undersea volcano, Nemo walks the drowned streets of ' +
        'a city lost beneath the Atlantic.',
    },
    {
      id: 'south-pole',
      name: 'The South Pole',
      kind: 'peak',
      at: { x: 0.02, z: 0.9 },
      description:
        'The Nautilus drives beneath the ice to the bottom of the world, where ' +
        'Nemo plants his black flag — and is nearly entombed by a shifting berg.',
    },
    {
      id: 'maelstrom',
      name: 'The Maelström',
      kind: 'danger',
      at: { x: -0.44, z: -0.74 },
      description:
        'Off the Norwegian coast, the great whirlpool seizes the Nautilus. The ' +
        'three prisoners escape in the chaos; of Nemo, no more is heard.',
    },
    // --- The Mysterious Island ---
    {
      id: 'lincoln-island',
      name: 'Lincoln Island',
      kind: 'landmark',
      at: { x: 0.5, z: 0.56 },
      description:
        'A balloon flung from a siege drops five castaways on an unknown ' +
        'Pacific isle, which they tame — watched over by a hidden benefactor.',
    },
    // --- From the Earth to the Moon ---
    {
      id: 'stone-hill',
      name: 'Stone Hill, Florida',
      kind: 'battle',
      at: { x: -0.68, z: 0.04 },
      description:
        'The Gun Club casts a nine-hundred-foot cannon in the Florida earth to ' +
        'fire a manned projectile at the Moon.',
    },
  ],
  routes: [
    {
      id: 'eighty-days',
      name: 'Around the World in Eighty Days',
      color: '#ffce54',
      style: 'solid',
      points: [
        { x: -0.5, z: -0.5 },
        { x: -0.12, z: -0.18 },
        { x: 0.18, z: 0.04 },
        { x: 0.38, z: -0.04 },
        { x: 0.58, z: 0.08 },
        { x: 0.82, z: -0.14 },
        { x: 0.9, z: 0.46 }, // Pacific crossing, arced along the southern sea
        { x: 0.0, z: 0.82 },
        { x: -0.9, z: 0.5 },
        { x: -0.82, z: 0.2 },
        { x: -0.44, z: 0.0 },
        { x: -0.5, z: -0.5 },
      ],
      description:
        'Phileas Fogg’s eastward circuit of the globe — and back to the Reform ' +
        'Club with a day, secretly, to spare.',
    },
    {
      id: 'nautilus',
      name: 'Voyage of the Nautilus',
      color: '#5fd0c8',
      style: 'dashed',
      points: [
        { x: 0.86, z: 0.34 },
        { x: 0.5, z: 0.56 },
        { x: 0.02, z: 0.9 },
        { x: -0.6, z: 0.44 },
        { x: -0.44, z: -0.74 },
      ],
      description:
        'Twenty thousand leagues under the seas: Pacific to pole to Atlantis to ' +
        'the whirlpool.',
    },
    {
      id: 'to-the-moon',
      name: 'To the Moon',
      color: '#c9b6ff',
      style: 'dashed',
      points: [
        { x: -0.68, z: 0.04 },
        { x: -0.6, z: -0.5 },
        { x: -0.5, z: -0.95 },
      ],
      description: 'The Gun Club’s projectile, fired from Florida into the night.',
    },
  ],
  regions: [
    { id: 'europe', name: 'Europe', at: { x: -0.42, z: -0.42 }, scale: 0.8 },
    { id: 'asia', name: 'Asia', at: { x: 0.5, z: -0.16 }, scale: 1.0 },
    { id: 'the-pacific', name: 'The Pacific', at: { x: 0.6, z: 0.72 }, scale: 1.1 },
    { id: 'the-atlantic', name: 'The Atlantic', at: { x: -0.66, z: -0.06 }, scale: 1.0 },
    { id: 'the-south', name: 'The Southern Ocean', at: { x: -0.02, z: 0.72 }, scale: 0.8 },
  ],
  elements: [
    {
      id: 'nautilus-sub',
      name: 'The Nautilus',
      glyph: '⚓',
      description:
        'Captain Nemo’s submarine, a world unto itself. Follow it under the ' +
        'oceans from the Pacific to the pole and back to the northern seas.',
      journey: [
        { marker: 'pacific-deeps', sinceChapter: 3, note: 'Its prisoners come aboard.' },
        { marker: 'south-pole', sinceChapter: 4, note: 'Beneath the ice to the Pole.' },
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
          focus: { marker: 'london', distance: 28, pitch: 40 },
          reveal: { markers: ['london', 'suez'], routes: ['eighty-days'], regions: ['europe'] },
          highlight: { markers: ['london'] },
        },
        {
          id: 'the-east',
          title: 'Through the East',
          narration:
            'Suez, Bombay, an elephant across India, a rescue, Calcutta, Hong ' +
            'Kong, Yokohama — the party races east by rail and steamer, always ' +
            'a step ahead of the clock.',
          focus: { marker: 'calcutta', distance: 40, pitch: 34 },
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
          focus: { marker: 'new-york', distance: 44, pitch: 32 },
          reveal: {
            markers: ['san-francisco', 'new-york'],
            regions: ['the-pacific', 'the-atlantic'],
          },
          highlight: { markers: ['san-francisco', 'new-york', 'london'], routes: ['eighty-days'] },
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
          focus: { marker: 'pacific-deeps', distance: 40, pitch: 30 },
          reveal: { markers: ['pacific-deeps'], routes: ['nautilus'], regions: ['the-pacific'] },
          highlight: { markers: ['pacific-deeps'] },
        },
        {
          id: 'under-the-world',
          title: 'Under the World',
          narration:
            'The submarine crosses every sea: beneath the antarctic ice to the ' +
            'South Pole, through the drowned streets of Atlantis, and north ' +
            'again — until the great Maelström swallows it and the prisoners ' +
            'break free.',
          focus: { marker: 'south-pole', distance: 44, pitch: 30 },
          reveal: {
            markers: ['south-pole', 'atlantis', 'maelstrom'],
            regions: ['the-south'],
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
          focus: { marker: 'lincoln-island', distance: 30, pitch: 36 },
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
          focus: { marker: 'stone-hill', distance: 30, pitch: 40 },
          reveal: { markers: ['stone-hill'], routes: ['to-the-moon'], regions: ['the-atlantic'] },
          highlight: { markers: ['stone-hill'], routes: ['to-the-moon'] },
        },
      ],
    },
  ],
}
