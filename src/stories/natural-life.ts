import type { Story } from '../types'
import tasmaniaHeight from '../assets/tasmania-height.png'

/**
 * For the Term of His Natural Life — Marcus Clarke's convict novel, serialised
 * 1870–72 and published in one volume in 1874. Clarke died in 1881; the book is
 * public domain (Project Gutenberg #3424), and this world was read out of it.
 *
 * Clarke researched it in the Tasmanian records and the geography is accurate
 * to the system he was describing, which is why it maps: Hobart Town on the
 * Derwent, the Tasman peninsula sealed behind the dog line at Eaglehawk Neck,
 * Port Arthur and its boys' prison at Point Puer, the coal mines across the
 * bay, the burial island in the harbour — and, on the other coast, Macquarie
 * Harbour behind Hell's Gates with the penal station on Sarah Island.
 *
 * Place-name frequency in the text is the weighting: Hobart 62, Port Arthur
 * 52, Macquarie Harbour 36, Van Diemen's Land 22, Eaglehawk 17, Norfolk Island
 * 15, the Coal Mines 11, Sarah Island 9, Grummet Rock 8, the Pilot Station 8,
 * Point Puer 4.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 144.4) / 2.10 − 1      map z = (−40.4 − lat) / 1.70 − 1
 *
 * Sydney and Norfolk Island are far off this map and say so in their own
 * descriptions; the book's own title is the sentence, and the sentence is
 * served in Van Diemen's Land.
 */
export const naturalLife: Story = {
  id: 'natural-life',
  title: 'For the Term of His Natural Life',
  subtitle: 'Van Diemen’s Land, and no way off it',
  author: 'Marcus Clarke',
  region: 'Tasmania',
  epoch: 'Australian novel · 1874',
  group: 'adventure',
  intro:
    'A man takes the blame for a crime he did not commit rather than say who ' +
    'his mother was, and is transported for life. Press ▶ Play story to ' +
    'follow the whole sentence: the voyage out, the settlement on the ' +
    'Derwent, the harbour behind Hell’s Gates that nobody escapes from, the ' +
    'peninsula sealed by a line of chained dogs, and the boys’ prison where ' +
    'children drown themselves in pairs.',
  surfaceName: 'Van Diemen’s Land',
  ambient: {
    trees: 0.55,
    treeKind: 'broadleaf',
    treeColor: '#4a6a4a',
    birds: 6,
    fish: 3,
    // The west coast weather is a character in the book: the transport lies
    // off Hell's Gates for days waiting to be let in.
    rain: true,
    rainArea: { x0: -0.95, x1: -0.30, z0: -0.15, z1: 0.40 },
  },
  terrain: {
    music: {
      // Written for this atlas: a slow minor tread in three, the shape of the
      // convict ballads the period is full of, but not any one of them — no
      // collected tune was transcribed here.
      title: 'A tread in irons',
      credit: 'After the convict ballad · original',
      melody:
        'A3:3 A3:1 C4:2 B3:1 A3:3 G3:1 E3:2 ' +
        'A3:2 C4:1 E4:3 D4:1 C4:2 B3:3 r:1 ' +
        'E4:3 E4:1 D4:2 C4:1 B3:3 A3:1 G3:2 ' +
        'A3:2 G3:1 E3:2 A3:4 r:2',
      bass: 'A2:8 F2:8 D2:8 E2:8',
      tempo: 50,
      voice: 'strings',
      mood: 'dark',
    },
    seed: 'natural-life-1', // unused: the heightmap takes precedence
    heightmap: tasmaniaHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0037,
    // 346 km across by 377 km down.
    aspect: 0.918,
    // Tasmania's west is a wall of ranges and the settled east is low; capped
    // at 1,600 m with landGamma 0.65 so both read.
    heightScale: 14,
    overhead: true,
    rivers: 8,
    biomes: [
      { maxHeight: 0.0037, color: '#20455c', name: 'The Southern Ocean' },
      { maxHeight: 0.05, color: '#c8c19c', name: 'Shore' },
      { maxHeight: 0.16, color: '#6f8a55', name: 'Settled country' },
      { maxHeight: 0.36, color: '#41613f', name: 'Bush' },
      { maxHeight: 0.58, color: '#5e6b4d', name: 'The ranges' },
      { maxHeight: 0.82, color: '#8a8776', name: 'Bare highland' },
      { maxHeight: 1.0, color: '#e8e8e6', name: 'Snow' },
    ],
  },

  markers: [
    {
      id: 'hobart',
      name: 'Hobart Town',
      kind: 'capital',
      at: { x: 0.393, z: 0.460 },
      description:
        'The settlement on the Derwent, named sixty-two times — the ' +
        'administrative centre of the whole system, where sentences are ' +
        'passed, tickets-of-leave granted and revoked, and where respectable ' +
        'society carries on a few streets from the chain gangs.',
    },
    {
      id: 'derwent',
      name: 'The Derwent',
      kind: 'landmark',
      at: { x: 0.381, z: 0.500 },
      description:
        'The river the transports come up. The book opens with a ship and ' +
        'ends with one; almost everything in between is somebody trying to ' +
        'get back onto water.',
    },
    {
      id: 'malabar',
      name: 'The Malabar',
      kind: 'port',
      at: { x: 0.300, z: 0.900 },
      description:
        'The transport out from England, and the first quarter of the book: ' +
        'a hold full of men under hatches, a mutiny plotted in it, and a fire ' +
        'that leaves the survivors in an open boat. Rufus Dawes saves the ' +
        'commandant’s wife and daughter and is disbelieved for the rest of ' +
        'his life.',
    },
    {
      id: 'macquarie',
      name: 'Macquarie Harbour',
      kind: 'danger',
      at: { x: -0.524, z: 0.088 },
      description:
        'The other coast, and the worst place in the system — named ' +
        'thirty-six times. A vast shallow harbour on the wildest shore in the ' +
        'colony, with one narrow entrance, sealed by weather for weeks at a ' +
        'time. Men were sent here to be put beyond reach.',
    },
    {
      id: 'hells-gates',
      name: 'Hell’s Gates',
      kind: 'danger',
      at: { x: -0.605, z: 0.059 },
      description:
        'The entrance: a channel narrow enough that a ship has to be warped ' +
        'through it, with a bar outside that the Southern Ocean breaks across. ' +
        'The name is not the novelist’s invention. Vessels lie off it for days ' +
        'waiting for water enough to come in.',
    },
    {
      id: 'pilot-station',
      name: 'The Pilot Station',
      kind: 'town',
      at: { x: -0.600, z: 0.053 },
      description:
        'The handful of huts by the entrance where the pilot lives — the last ' +
        'inhabited thing before the harbour, and where the boat crews wait out ' +
        'the weather.',
    },
    {
      id: 'sarah-island',
      name: 'Sarah Island',
      kind: 'ruin',
      at: { x: -0.516, z: 0.174 },
      description:
        'The penal settlement itself, on an island in the harbour so that the ' +
        'water does the guarding. Timber-getting in irons, floggings on a ' +
        'schedule, and a shipyard where the convicts built the vessels that ' +
        'carried them.',
    },
    {
      id: 'grummet',
      name: 'Grummet Rock',
      kind: 'danger',
      at: { x: -0.524, z: 0.165 },
      description:
        'A bare rock in the harbour used as a punishment cell — men left on it ' +
        'in the open with the sea coming over. Named eight times, always as a ' +
        'threat.',
    },
    {
      id: 'gordon',
      name: 'The Gordon',
      kind: 'forest',
      at: { x: -0.452, z: 0.176 },
      description:
        'The river running into the harbour, and the country the timber gangs ' +
        'were worked in: rainforest so dense and so wet that the escape ' +
        'attempts made through it mostly ended in men dying, or worse.',
    },
    {
      id: 'the-escape',
      name: 'The Boat They Built',
      kind: 'landmark',
      at: { x: -0.560, z: 0.120 },
      description:
        'The novel’s best sequence: the station is abandoned, a handful are ' +
        'left behind, and Dawes builds a boat out of what the settlement left ' +
        'and gets them out — and is again given no credit for it whatever.',
    },
    {
      id: 'frenchmans',
      name: 'The Western Ranges',
      kind: 'peak',
      at: { x: -0.190, z: 0.076 },
      description:
        'What lies between the two coasts, and the reason Macquarie Harbour ' +
        'worked as a prison. A man who got out of the settlement still had ' +
        'this to cross, and the book does not pretend anyone managed it whole.',
    },
    {
      id: 'port-arthur',
      name: 'Port Arthur',
      kind: 'capital',
      at: { x: 0.643, z: 0.615 },
      description:
        'The station that replaced Macquarie Harbour, named fifty-two times: ' +
        'a whole peninsula turned into a prison, with a model settlement, a ' +
        'church built by prisoners, and a system that had moved on from the ' +
        'lash to silence and separate confinement.',
    },
    {
      id: 'point-puer',
      name: 'Point Puer',
      kind: 'danger',
      at: { x: 0.640, z: 0.619 },
      description:
        'The boys’ prison across the water from the main settlement, for ' +
        'convicts too young for the men’s barracks. Clarke gives it the ' +
        'coldest scene in the book: two children who have decided that being ' +
        'dead is better, and who go over the cliff holding hands.',
    },
    {
      id: 'isle-of-dead',
      name: 'The Isle of the Dead',
      kind: 'ruin',
      at: { x: 0.645, z: 0.612 },
      description:
        'The burial island in the bay — convicts on one side of it without ' +
        'stones, officers and their families on the other with them. The ' +
        'gravedigger was himself a convict and lived on the island alone.',
    },
    {
      id: 'eaglehawk',
      name: 'Eaglehawk Neck',
      kind: 'danger',
      at: { x: 0.680, z: 0.543 },
      description:
        'The isthmus the whole peninsula hangs from, a few dozen yards wide — ' +
        'closed by a line of dogs chained across it within reach of each ' +
        'other, with lamps, and more dogs on platforms in the water so nobody ' +
        'could wade round the ends. Named seventeen times.',
    },
    {
      id: 'coal-mines',
      name: 'The Coal Mines',
      kind: 'danger',
      at: { x: 0.571, z: 0.535 },
      description:
        'The punishment station across the bay from Port Arthur, worked by ' +
        'the men the main settlement could not manage — underground, and the ' +
        'end of the line within a system that was already the end of the line.',
    },
    {
      id: 'cape-raoul',
      name: 'The Cliffs',
      kind: 'landmark',
      at: { x: 0.610, z: 0.665 },
      description:
        'The dolerite columns along the southern edge of the peninsula, ' +
        'dropping straight into the Southern Ocean. Part of why the geography ' +
        'was chosen: on three sides of the prison there is nothing to escape ' +
        'onto.',
    },
    {
      id: 'bruny',
      name: 'The Channel',
      kind: 'landmark',
      at: { x: 0.381, z: 0.706 },
      description:
        'The passage south of Hobart the ships work down, past Bruny Island. ' +
        'The last of the settled country before the map runs out.',
    },
    {
      id: 'maria-island',
      name: 'Maria Island',
      kind: 'ruin',
      at: { x: 0.748, z: 0.318 },
      description:
        'An earlier probation station up the east coast, abandoned before the ' +
        'novel’s main action — one of the several the colony tried before ' +
        'settling on the peninsula.',
    },
    {
      id: 'launceston',
      name: 'Launceston',
      kind: 'city',
      at: { x: 0.305, z: -0.391 },
      description:
        'The northern town, and the other end of the island’s road. Free ' +
        'settlers, farms, a port that is not a prison — the ordinary colony ' +
        'the convict system was built to serve and stayed carefully out of ' +
        'sight of.',
    },
    {
      id: 'hamilton',
      name: 'The Interior',
      kind: 'town',
      at: { x: 0.157, z: 0.265 },
      description:
        'The farms and runs inland from Hobart, worked by assigned convicts ' +
        'lent out to settlers — the part of the system that looked least like ' +
        'a prison and was still one.',
    },
    {
      id: 'norfolk',
      name: 'Norfolk Island',
      kind: 'danger',
      at: { x: 0.960, z: -0.930 },
      description:
        'A thousand miles off this map in the Pacific, and the last stage of ' +
        'the sentence — named fifteen times. The final book is set there: a ' +
        'mutiny, a chaplain who has lost his faith, and the ship home that ' +
        'never gets there.',
    },
    {
      id: 'sydney',
      name: 'Sydney',
      kind: 'city',
      at: { x: 0.930, z: -0.700 },
      description:
        'Off the map to the north, on the mainland — where the orders come ' +
        'from and where the transports call. The colony that receives the ' +
        'sentences Van Diemen’s Land carries out.',
    },
    {
      id: 'the-wreck',
      name: 'The Last Storm',
      kind: 'danger',
      at: { x: 0.780, z: 0.860 },
      description:
        'The end: a ship out of Norfolk Island in weather, and Rufus Dawes ' +
        'and Sylvia in the water together at last, with everything that could ' +
        'have been cleared up between them still uncleared. Clarke wrote a ' +
        'happier ending for the serial and then threw it away.',
    },
  ],

  routes: [
    {
      id: 'the-voyage',
      name: 'The Voyage Out',
      style: 'dashed',
      color: '#c8a86b',
      points: [
        { x: 0.300, z: 0.900 },
        { x: 0.381, z: 0.706 },
        { x: 0.381, z: 0.500 },
        { x: 0.393, z: 0.460 },
      ],
      description:
        'England to the Derwent by way of a mutiny and a fire — and Rufus ' +
        'Dawes saving the two people whose word could clear him, neither of ' +
        'whom is in a position to give it.',
    },
    {
      id: 'to-macquarie',
      name: 'Sent West',
      style: 'solid',
      color: '#c96f5c',
      points: [
        { x: 0.393, z: 0.460 },
        { x: 0.157, z: 0.265 },
        { x: -0.190, z: 0.076 },
        { x: -0.600, z: 0.053 },
        { x: -0.605, z: 0.059 },
        { x: -0.524, z: 0.165 },
        { x: -0.516, z: 0.174 },
      ],
      description:
        'Out of Hobart to the far coast: through the ranges, in through ' +
        'Hell’s Gates, and onto the island in the harbour where the water does ' +
        'the guarding.',
    },
    {
      id: 'the-boat',
      name: 'The Boat Out',
      style: 'solid',
      color: '#a8c46a',
      points: [
        { x: -0.516, z: 0.174 },
        { x: -0.452, z: 0.176 },
        { x: -0.560, z: 0.120 },
        { x: -0.605, z: 0.059 },
        { x: 0.157, z: 0.265 },
        { x: 0.393, z: 0.460 },
      ],
      description:
        'The station is abandoned and a few are left behind. Dawes builds a ' +
        'boat from what the settlement left, gets them through the Gates and ' +
        'round the coast — and is called a liar for it.',
    },
    {
      id: 'to-port-arthur',
      name: 'The Peninsula',
      style: 'solid',
      color: '#8f5fa8',
      points: [
        { x: 0.393, z: 0.460 },
        { x: 0.571, z: 0.535 },
        { x: 0.680, z: 0.543 },
        { x: 0.643, z: 0.615 },
        { x: 0.640, z: 0.619 },
        { x: 0.645, z: 0.612 },
        { x: 0.610, z: 0.665 },
      ],
      description:
        'The system’s second act: across the bay to the coal mines, through ' +
        'the dog line at the Neck, and down to Port Arthur, the boys’ prison ' +
        'and the burial island.',
    },
    {
      id: 'the-colony',
      name: 'The Ordinary Colony',
      style: 'dashed',
      color: '#9bb37a',
      points: [
        { x: 0.393, z: 0.460 },
        { x: 0.157, z: 0.265 },
        { x: 0.305, z: -0.391 },
        { x: 0.748, z: 0.318 },
        { x: 0.393, z: 0.460 },
      ],
      description:
        'The other island: assigned servants on inland farms, a northern port ' +
        'that is not a prison, and the earlier stations the colony tried ' +
        'before it settled on the peninsula.',
    },
    {
      id: 'the-last-stage',
      name: 'Norfolk Island, and Home',
      style: 'solid',
      color: '#6f8296',
      points: [
        { x: 0.643, z: 0.615 },
        { x: 0.930, z: -0.700 },
        { x: 0.960, z: -0.930 },
        { x: 0.900, z: 0.300 },
        { x: 0.780, z: 0.860 },
      ],
      description:
        'The last book: a thousand miles out into the Pacific, a mutiny, a ' +
        'chaplain who no longer believes anything he says — and the ship home ' +
        'that goes down in sight of nothing.',
    },
  ],

  regions: [
    { id: 'r-west', name: 'The West Coast', at: { x: -0.60, z: 0.20 }, scale: 0.95 },
    { id: 'r-south', name: 'The Tasman Peninsula', at: { x: 0.68, z: 0.72 }, scale: 0.7 },
    { id: 'r-settled', name: 'The Settled Districts', at: { x: 0.25, z: 0.10 }, scale: 0.95 },
  ],

  chapters: [
    {
      id: 'n-1',
      title: 'I · The Malabar',
      narration:
        'Richard Devine will not say who his mother is, so he lets himself be ' +
        'convicted of a murder he did not do, takes the name Rufus Dawes, and ' +
        'goes out in a convict transport. There is a mutiny in the hold and a ' +
        'fire, and he saves the commandant’s wife and small daughter in an ' +
        'open boat — which nobody who matters ever quite believes.',
      focus: { marker: 'malabar', distance: 30, pitch: 42 },
      reveal: { markers: ['malabar', 'derwent', 'hobart'], routes: ['the-voyage'] },
    },
    {
      id: 'n-2',
      title: 'I · Hobart Town',
      narration:
        'The settlement on the Derwent, named sixty-two times: barracks, ' +
        'courts, a commandant’s house, and a respectable society getting on ' +
        'with its dinners a few streets from the chain gangs. Everything in ' +
        'the book is decided here and served somewhere worse.',
      focus: { marker: 'hobart', distance: 22, pitch: 44 },
      reveal: { markers: ['hamilton'], regions: ['r-settled'] },
    },
    {
      id: 'n-3',
      title: 'II · Hell’s Gates',
      narration:
        'He is sent west. Macquarie Harbour is the worst place in the system ' +
        '— a huge shallow water on the wildest coast in the colony with one ' +
        'entrance so narrow a ship has to be warped through it, and a bar ' +
        'outside that the Southern Ocean breaks on. Vessels lie off it for ' +
        'days waiting to be let in.',
      focus: { marker: 'hells-gates', distance: 26, pitch: 42 },
      reveal: {
        markers: ['macquarie', 'hells-gates', 'pilot-station', 'frenchmans'],
        routes: ['to-macquarie'],
        regions: ['r-west'],
      },
      highlight: { markers: ['hells-gates'] },
    },
    {
      id: 'n-4',
      title: 'II · Sarah Island',
      narration:
        'The settlement is on an island in the harbour so the water can do ' +
        'the guarding. Timber-getting in irons in rainforest, floggings to a ' +
        'schedule, and a bare rock called Grummet used as a punishment cell, ' +
        'where men were left with the sea coming over them.',
      focus: { marker: 'sarah-island', distance: 20, pitch: 44 },
      reveal: { markers: ['sarah-island', 'grummet', 'gordon'] },
      highlight: { markers: ['grummet'] },
    },
    {
      id: 'n-5',
      title: 'II · The boat he built',
      narration:
        'The station is abandoned and a handful are left behind on the wrong ' +
        'coast with winter coming. Dawes builds a boat out of what the ' +
        'settlement left, gets them through the Gates and round to the ' +
        'settled districts — and the credit goes to somebody else, and his ' +
        'account of it is entered as a lie.',
      focus: { marker: 'the-escape', distance: 24, pitch: 42 },
      reveal: { markers: ['the-escape'], routes: ['the-boat'] },
      highlight: { routes: ['the-boat'] },
    },
    {
      id: 'n-6',
      title: 'III · The dog line',
      narration:
        'The system moves to the Tasman peninsula, which hangs off the island ' +
        'by an isthmus a few dozen yards wide. They close it with a line of ' +
        'dogs chained just within reach of one another, lamps between them, ' +
        'and more dogs on platforms out in the water so nobody can wade round ' +
        'the ends.',
      focus: { marker: 'eaglehawk', distance: 20, pitch: 44 },
      reveal: {
        markers: ['eaglehawk', 'coal-mines', 'port-arthur', 'cape-raoul'],
        routes: ['to-port-arthur'],
        regions: ['r-south'],
      },
      highlight: { markers: ['eaglehawk'] },
    },
    {
      id: 'n-7',
      title: 'III · Point Puer',
      narration:
        'The boys’ prison, across the water from the main settlement, for ' +
        'convicts too young for the men’s barracks. Clarke gives it the ' +
        'coldest few pages in the book: two children work out that being dead ' +
        'is preferable, say so plainly to each other, and go over the cliff ' +
        'holding hands.',
      focus: { marker: 'point-puer', distance: 18, pitch: 44 },
      reveal: { markers: ['point-puer', 'isle-of-dead'] },
      highlight: { markers: ['point-puer'] },
    },
    {
      id: 'n-8',
      title: 'III · The Isle of the Dead',
      narration:
        'The burial island in the bay, with convicts on one side without ' +
        'stones and officers and their families on the other with them. The ' +
        'gravedigger was a convict too, and lived out there by himself.',
      focus: { marker: 'isle-of-dead', distance: 16, pitch: 46 },
      highlight: { markers: ['isle-of-dead'] },
    },
    {
      id: 'n-9',
      title: 'The other island',
      narration:
        'Meanwhile there is an ordinary colony: farms inland worked by ' +
        'assigned servants, a northern port that is only a port, earlier ' +
        'stations up the east coast already abandoned. The system was built to ' +
        'serve this, and this kept itself carefully out of sight of it.',
      focus: { marker: 'launceston', distance: 34, pitch: 40 },
      reveal: { markers: ['launceston', 'maria-island', 'bruny'], routes: ['the-colony'] },
    },
    {
      id: 'n-10',
      title: 'IV · Norfolk Island',
      narration:
        'The last stage is a thousand miles off this map in the Pacific: a ' +
        'mutiny, a commandant running the place by terror, and a chaplain who ' +
        'has stopped believing a word he says and writes it in his diary ' +
        'anyway. Sylvia is there, grown, and still cannot remember the thing ' +
        'that would clear him.',
      focus: { marker: 'norfolk', distance: 42, pitch: 38 },
      reveal: { markers: ['norfolk', 'sydney'], routes: ['the-last-stage'] },
      highlight: { markers: ['norfolk'] },
    },
    {
      id: 'n-11',
      title: 'IV · The last storm',
      narration:
        'They sail for home and go down in weather. Dawes and Sylvia end up ' +
        'in the water together, and she remembers everything at the last ' +
        'possible moment, which changes nothing at all. Clarke wrote a version ' +
        'where they lived, and then threw it away.',
      focus: { marker: 'the-wreck', distance: 30, pitch: 40 },
      reveal: { markers: ['the-wreck'] },
      highlight: { markers: ['the-wreck'] },
    },
  ],
}
