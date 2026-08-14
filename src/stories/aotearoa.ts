import type { Story } from '../types'
import aotearoaHeight from '../assets/aotearoa-height.png'

/**
 * Te Ika-a-Māui — the traditions of Aotearoa New Zealand, read out of W.
 * Dittmer's *Te Tohunga: The Ancient Legends and Traditions of the Maoris*
 * (London, 1907; Project Gutenberg #54610), which carries the Māui cycle, the
 * coming of the canoes, Hinemoa at Rotorua and the burial on Tongariro.
 *
 * A NOTE ON THE SOURCE, because it matters more here than in any other world
 * in this atlas. Dittmer was a Pākehā artist who collected and illustrated
 * these traditions in the 1900s, and his book is a period retelling, not an
 * authority. These are widely-published traditions, and they are also living
 * cultural property: iwi hold their own accounts, and those accounts differ
 * from each other and from Dittmer in names, order and detail. Nothing here is
 * presented as any particular iwi's version, and where the tradition is
 * specific to a people this world names the place rather than the account.
 * The narration paraphrases Dittmer and quotes no text.
 *
 * The map is the whole reason this world belongs in the atlas: in the tradition
 * the land IS the story. The North Island is the fish Māui hauled up from the
 * sea, the South Island is the canoe he stood in to do it, and Rakiura is its
 * anchor stone. No other world here has a landmass that is also a character.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 166.0) / 6.5 − 1      map z = (−34.0 − lat) / 6.75 − 1
 *
 * 1,096 km across by 1,500 km down, so this is the third world here taller
 * than it is wide.
 */
export const aotearoa: Story = {
  id: 'aotearoa',
  title: 'Te Ika-a-Māui',
  subtitle: 'The fish, the canoe and the anchor stone',
  author: 'Māori tradition · coll. W. Dittmer',
  region: 'Aotearoa New Zealand',
  epoch: 'Traditions collected 1907',
  group: 'epic',
  intro:
    'One island is a fish somebody pulled out of the sea and the other is the ' +
    'canoe he did it from. Press ▶ Play story to follow the traditions this ' +
    'country is told in: Māui fishing up the land, snaring the sun and dying ' +
    'trying to end death, the canoes coming down from Hawaiki, Hinemoa ' +
    'swimming a lake at night, and the spirits going north to leave from the ' +
    'headland at Te Reinga.',
  surfaceName: 'Aotearoa',
  ambient: {
    trees: 0.62,
    treeKind: 'broadleaf',
    treeColor: '#3d6b48',
    birds: 10,
    fish: 5,
  },
  terrain: {
    music: {
      // Written for this atlas. Māori waiata belong to the people who hold
      // them and are not mine to transcribe; this is an original built on a
      // narrow rising-and-falling shape over a held tone, and is credited as
      // an original rather than as anything traditional.
      title: 'For the fish and the canoe',
      credit: 'Original, written for this atlas',
      melody:
        'E4:3 G4:1 A4:4 G4:2 E4:2 D4:4 r:2 ' +
        'E4:2 G4:2 A4:3 B4:1 A4:2 G4:4 r:2 ' +
        'B4:3 A4:1 G4:2 E4:2 D4:2 E4:6 r:2',
      bass: 'E2:8 E2:8 C3:8 E2:8',
      tempo: 52,
      voice: 'flute',
      mood: 'mystic',
    },
    seed: 'aotearoa-1', // unused: the heightmap takes precedence
    heightmap: aotearoaHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0025,
    // 1,096 km across by 1,500 km down.
    aspect: 0.731,
    // Aoraki is 3,724 m, but the build caps at 2,400 so the Southern Alps do
    // not become a white wall that buries the North Island volcanoes the
    // traditions are actually about.
    heightScale: 16,
    // Two long islands end to end are unreadable edge-on.
    overhead: true,
    rivers: 8,
    biomes: [
      { maxHeight: 0.0025, color: '#215a75', name: 'The sea' },
      { maxHeight: 0.045, color: '#cfc8a4', name: 'Shore' },
      { maxHeight: 0.14, color: '#5f9a51', name: 'Lowland' },
      { maxHeight: 0.34, color: '#2f7145', name: 'Bush' },
      { maxHeight: 0.56, color: '#5c7a4e', name: 'High country' },
      { maxHeight: 0.8, color: '#8d8574', name: 'Bare range' },
      { maxHeight: 1.0, color: '#f2f2f4', name: 'Snow' },
    ],
  },

  markers: [
    {
      id: 'hawaiki',
      name: 'Hawaiki',
      kind: 'landmark',
      at: { x: 0.938, z: -0.941 },
      description:
        'The homeland everything comes from and returns to — named more than ' +
        'any other place in the collection. It is off this map and off every ' +
        'map: the canoes are launched from it, the dead go back to it, and the ' +
        'traditions are quite clear that you cannot simply sail there.',
    },
    {
      id: 'the-fish',
      name: 'The Fish',
      kind: 'landmark',
      at: { x: 0.483, z: -0.470 },
      description:
        'Māui goes out with his brothers, who did not want him aboard, and ' +
        'lets down a hook baited with blood from his own nose. What comes up ' +
        'is not a fish but a country. He goes off to find a priest to make it ' +
        'safe, tells his brothers to leave it alone, and they start cutting at ' +
        'it the moment he is gone — which is why the North Island is all ' +
        'ridges and valleys instead of flat.',
    },
    {
      id: 'the-canoe',
      name: 'The Canoe',
      kind: 'landmark',
      at: { x: -0.363, z: 0.422 },
      description:
        'The South Island: the canoe Māui stood in to haul the fish up. In ' +
        'this telling the whole geography of the country is one act — a man ' +
        'in a boat pulling, the boat he pulled from, and the stone he threw ' +
        'over the side to hold it.',
    },
    {
      id: 'rakiura',
      name: 'The Anchor Stone',
      kind: 'landmark',
      at: { x: -0.677, z: 0.911 },
      description:
        'Rakiura, Stewart Island, off the southern tip — the stone that held ' +
        'the canoe steady while the fish was being landed. The three pieces ' +
        'of the country are the three parts of one morning’s fishing.',
    },
    {
      id: 'reinga',
      name: 'Te Reinga',
      kind: 'danger',
      at: { x: 0.028, z: -0.936 },
      description:
        'The far northern headland, and the leaping-place. The dead travel up ' +
        'the length of the country to get here, climb down the roots of an old ' +
        'pōhutukawa on the point, and go into the sea for Hawaiki. It is the ' +
        'one place on this map that everybody in every tradition ends up.',
    },
    {
      id: 'ahipara',
      name: 'The Long Beach',
      kind: 'landmark',
      at: { x: 0.102, z: -0.827 },
      description:
        'The ninety-mile stretch of sand the spirits walk north along. The ' +
        'road to Te Reinga is the tail of the fish, and it is the emptiest ' +
        'part of the country.',
    },
    {
      id: 'hokianga',
      name: 'Hokianga',
      kind: 'port',
      at: { x: 0.138, z: -0.781 },
      description:
        'The great harbour of the north — by tradition the place Kupe left ' +
        'from when he went back, and the reason the name means the returning. ' +
        'The Coming of the Māori is the chapter of the collection that turns ' +
        'legend into migration.',
    },
    {
      id: 'maketu',
      name: 'Maketu',
      kind: 'port',
      at: { x: 0.608, z: -0.443 },
      description:
        'Where the Arawa canoe came ashore at the end of the voyage from ' +
        'Hawaiki, and where its people stayed. Tama-te-Kapua’s story — the ' +
        'theft, the voyage, the landfall — is the collection’s account of how ' +
        'the country came to be lived in rather than merely made.',
    },
    {
      id: 'tongariro',
      name: 'Tongariro',
      kind: 'peak',
      at: { x: 0.483, z: -0.240 },
      description:
        'Named thirty-one times, more than any mountain in the book. The fire ' +
        'that lives in it was sent for from Hawaiki when the priest who ' +
        'climbed it was freezing to death — and the last chapter is a chief ' +
        'carried up and buried on it.',
    },
    {
      id: 'ruapehu',
      name: 'Ruapehu',
      kind: 'peak',
      at: { x: 0.471, z: -0.218 },
      description:
        'The high one south of Tongariro, and the tallest thing on the North ' +
        'Island. In the traditions the mountains of the central plateau are ' +
        'people: they quarrel, they fight over each other, and one of them ' +
        'leaves.',
    },
    {
      id: 'ngauruhoe',
      name: 'Ngāuruhoe',
      kind: 'peak',
      at: { x: 0.482, z: -0.236 },
      description:
        'The perfect cone between the other two, and the youngest of them — ' +
        'the vent that has done most of the erupting within memory.',
    },
    {
      id: 'taranaki',
      name: 'Taranaki',
      kind: 'peak',
      at: { x: 0.241, z: -0.215 },
      description:
        'The mountain that stands alone on the west coast, a long way from ' +
        'the others. The tradition is that he lost a fight over a mountain he ' +
        'loved and walked away west overnight, gouging out the Whanganui river ' +
        'behind him, and has stood with his back turned ever since.',
    },
    {
      id: 'wanganui',
      name: 'The River',
      kind: 'landmark',
      at: { x: 0.392, z: -0.121 },
      description:
        'The Whanganui, cut by a mountain leaving in the night — the country’s ' +
        'longest navigable river, and in this telling a scar.',
    },
    {
      id: 'taupo',
      name: 'Taupō',
      kind: 'landmark',
      at: { x: 0.523, z: -0.296 },
      description:
        'The great lake in the middle of the fish, sitting in the crater of ' +
        'an eruption large enough to be recorded on the other side of the ' +
        'world. Everything on this part of the map is volcanic and the ' +
        'traditions treat it as alive, because it is.',
    },
    {
      id: 'rotorua',
      name: 'Rotorua',
      kind: 'town',
      at: { x: 0.577, z: -0.387 },
      description:
        'The lake of the steaming ground, and the setting of the one love ' +
        'story in the collection — Hinemoa, named as often as Tongariro.',
    },
    {
      id: 'mokoia',
      name: 'Mokoia',
      kind: 'landmark',
      at: { x: 0.574, z: -0.393 },
      description:
        'The island in the middle of the lake. Hinemoa’s people pull the ' +
        'canoes up the beach so she cannot go to Tūtānekai, so she ties dried ' +
        'gourds to herself and swims it in the dark, steering by the flute he ' +
        'is playing on the island — and warms herself in the hot pool on the ' +
        'shore when she arrives.',
    },
    {
      id: 'pirongia',
      name: 'Pirongia',
      kind: 'forest',
      at: { x: 0.400, z: -0.409 },
      description:
        'The bush-covered range where the collection puts the Patu-paiarehe, ' +
        'the pale people of the mist who live above the fog line, sing at ' +
        'night, and are not seen in daylight.',
    },
    {
      id: 'hikurangi',
      name: 'Hikurangi',
      kind: 'peak',
      at: { x: 0.855, z: -0.418 },
      description:
        'The mountain on the east cape that takes the sunrise before anywhere ' +
        'else — and, in the tradition, the first part of the fish to break the ' +
        'surface when Māui hauled it up.',
    },
    {
      id: 'eastcape',
      name: 'The East Cape',
      kind: 'landmark',
      at: { x: 0.930, z: -0.454 },
      description:
        'The eastern corner of the fish, and the first land in the country to ' +
        'come out of the sea each morning.',
    },
    {
      id: 'sun-pit',
      name: 'Where the Sun Was Snared',
      kind: 'danger',
      at: { x: 0.700, z: -0.520 },
      description:
        'The days were too short to get anything done, so Māui and his ' +
        'brothers plaited ropes, went east to the pit the sun climbs out of, ' +
        'and waited. They noosed it as it rose and beat it with a jawbone ' +
        'until it agreed to go more slowly. The traditions are consistent ' +
        'that his solutions are all like this.',
    },
    {
      id: 'mahuika',
      name: 'Where the Fire Came From',
      kind: 'danger',
      at: { x: 0.520, z: -0.170 },
      description:
        'Māui puts out every fire in the world to find out where fire is kept, ' +
        'then goes to Mahuika and asks for some. She gives him a fingernail. ' +
        'He puts it out and comes back, again and again, until she has nothing ' +
        'left and throws the last of it at him — and the fire goes into the ' +
        'trees, which is why you can still get it out of dry wood.',
    },
    {
      id: 'hine-nui',
      name: 'Where Māui Died',
      kind: 'danger',
      at: { x: 0.351, z: 0.080 },
      description:
        'The last thing he tries is ending death, by going into Hine-nui-te-pō ' +
        'while she sleeps and coming out the other way. He tells the birds to ' +
        'keep silent. The little fantail cannot hold it in and laughs, she ' +
        'wakes, and that is the end of Māui and of anybody living forever.',
    },
    {
      id: 'cook-strait',
      name: 'The Tail of the Fish',
      kind: 'landmark',
      at: { x: 0.262, z: 0.126 },
      description:
        'The strait between the fish and the canoe. On a map the two islands ' +
        'read as a coincidence of geology; in the tradition the gap is where ' +
        'the line went taut.',
    },
    {
      id: 'kaikoura',
      name: 'Kaikōura',
      kind: 'landmark',
      at: { x: 0.181, z: 0.244 },
      description:
        'The seat in the canoe — the traditional name records it as the place ' +
        'where Māui braced his foot while he hauled. Mountains come down ' +
        'almost to the water here.',
    },
    {
      id: 'aoraki',
      name: 'Aoraki',
      kind: 'peak',
      at: { x: -0.363, z: 0.422 },
      description:
        'The highest mountain in the country, standing in the middle of the ' +
        'canoe’s length. The peaks of the Southern Alps are, in tradition, the ' +
        'crew — sons of the sky who came down in a canoe that ran aground and ' +
        'turned to stone with them still in it.',
    },
    {
      id: 'fiordland',
      name: 'The Sounds',
      kind: 'forest',
      at: { x: -0.721, z: 0.675 },
      description:
        'The drowned valleys of the south-west — the deepest, wettest, least ' +
        'walked-on corner of the map, and the part of the canoe that was ' +
        'chopped at hardest.',
    },
  ],

  routes: [
    {
      id: 'the-fishing',
      name: 'The Fishing Up of the Land',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.363, z: 0.422 },
        { x: 0.181, z: 0.244 },
        { x: 0.262, z: 0.126 },
        { x: 0.483, z: -0.470 },
        { x: 0.855, z: -0.418 },
      ],
      description:
        'The act the whole country is shaped by: out in the canoe, the hook ' +
        'baited with his own blood, and a fish that breaks the surface at ' +
        'Hikurangi first and turns out to be an island.',
    },
    {
      id: 'the-canoes',
      name: 'The Coming of the Canoes',
      style: 'solid',
      color: '#6fa8c8',
      points: [
        { x: 0.938, z: -0.941 },
        { x: 0.860, z: -0.700 },
        { x: 0.608, z: -0.443 },
        { x: 0.400, z: -0.409 },
        { x: 0.138, z: -0.781 },
      ],
      description:
        'Down from Hawaiki: the Arawa landing at Maketu, the settling of the ' +
        'country behind it, and Kupe’s harbour in the north, whose name means ' +
        'the returning.',
    },
    {
      id: 'maui-deeds',
      name: 'What Māui Did Next',
      style: 'solid',
      color: '#d98f5a',
      points: [
        { x: 0.855, z: -0.418 },
        { x: 0.700, z: -0.520 },
        { x: 0.520, z: -0.170 },
        { x: 0.400, z: -0.120 },
        { x: 0.351, z: 0.080 },
      ],
      description:
        'Snaring the sun to make the days longer, getting fire out of Mahuika ' +
        'one fingernail at a time, and finally trying to end death — which is ' +
        'the one that stops him.',
    },
    {
      id: 'the-mountains',
      name: 'The Mountains’ Quarrel',
      style: 'dashed',
      color: '#c96f5c',
      points: [
        { x: 0.483, z: -0.240 },
        { x: 0.471, z: -0.218 },
        { x: 0.482, z: -0.236 },
        { x: 0.392, z: -0.121 },
        { x: 0.241, z: -0.215 },
      ],
      description:
        'Taranaki loses a fight over a mountain he loved and walks west ' +
        'overnight, cutting the Whanganui behind him — and has stood alone on ' +
        'the coast with his back to the others ever since.',
    },
    {
      id: 'hinemoa-swim',
      name: 'Hinemoa’s Swim',
      style: 'solid',
      color: '#e0a5c2',
      points: [
        { x: 0.577, z: -0.387 },
        { x: 0.576, z: -0.390 },
        { x: 0.574, z: -0.393 },
      ],
      description:
        'Gourds tied on for float, a lake crossed in the dark, and a flute on ' +
        'the island to steer by. The shortest route on this map and the one ' +
        'the collection spends the most words on.',
    },
    {
      id: 'spirit-road',
      name: 'The Road of the Spirits',
      style: 'dashed',
      color: '#b0b8c8',
      points: [
        { x: 0.351, z: 0.080 },
        { x: 0.483, z: -0.240 },
        { x: 0.400, z: -0.409 },
        { x: 0.138, z: -0.781 },
        { x: 0.102, z: -0.827 },
        { x: 0.028, z: -0.936 },
        { x: 0.938, z: -0.941 },
      ],
      description:
        'North up the length of the fish to the headland, down the roots of ' +
        'the tree on the point, and into the sea for Hawaiki. Everyone on this ' +
        'map takes this road eventually.',
    },
    {
      id: 'the-canoe-length',
      name: 'The Length of the Canoe',
      style: 'dashed',
      color: '#9bb37a',
      points: [
        { x: 0.181, z: 0.244 },
        { x: -0.363, z: 0.422 },
        { x: -0.721, z: 0.675 },
        { x: -0.677, z: 0.911 },
      ],
      description:
        'Down the South Island from the seat to the sounds to the anchor ' +
        'stone — the parts of the boat, in order.',
    },
  ],

  regions: [
    { id: 'r-fish', name: 'Te Ika-a-Māui', at: { x: 0.52, z: -0.40 }, scale: 1.05 },
    { id: 'r-canoe', name: 'Te Waka-a-Māui', at: { x: -0.30, z: 0.50 }, scale: 1.05 },
    { id: 'r-north', name: 'The Tail', at: { x: 0.10, z: -0.86 }, scale: 0.8 },
  ],

  chapters: [
    {
      id: 'a-1',
      title: 'Hawaiki',
      narration:
        'Everything starts somewhere else. Hawaiki is named more often than ' +
        'any place in the collection — the homeland the canoes come from, the ' +
        'place fire is sent for, and the place the dead go back to. It is not ' +
        'on this map, and the traditions are firm that you cannot simply sail ' +
        'there.',
      focus: { marker: 'hawaiki', distance: 40, pitch: 40 },
      reveal: { markers: ['hawaiki'] },
    },
    {
      id: 'a-2',
      title: 'The fishing',
      narration:
        'Māui hides in his brothers’ canoe because they will not take him, ' +
        'and when they are far enough out he baits a hook with blood from his ' +
        'own nose and lets it down. What comes up is an island. He goes to ' +
        'find a priest to make it safe and tells them not to touch it — and ' +
        'they cut at it the moment he is out of sight, which is why the North ' +
        'Island is ridges and valleys instead of a flat fish.',
      focus: { marker: 'the-fish', distance: 46, pitch: 40 },
      reveal: {
        markers: ['the-fish', 'the-canoe', 'rakiura', 'hikurangi', 'cook-strait'],
        routes: ['the-fishing'],
        regions: ['r-fish', 'r-canoe'],
      },
      highlight: { routes: ['the-fishing'] },
    },
    {
      id: 'a-3',
      title: 'The boat and the stone',
      narration:
        'The rest of the country is the rest of the act. The South Island is ' +
        'the canoe he stood in; Kaikōura is where he braced his foot; Rakiura ' +
        'at the bottom is the stone he threw over to hold it steady. No other ' +
        'map in this atlas is also a character.',
      focus: { marker: 'the-canoe', distance: 52, pitch: 38 },
      reveal: { markers: ['kaikoura', 'aoraki', 'fiordland'], routes: ['the-canoe-length'] },
    },
    {
      id: 'a-4',
      title: 'The sun, slowed down',
      narration:
        'The days were too short to finish anything, so they plaited ropes, ' +
        'went east to the pit the sun climbs out of, and waited for it. They ' +
        'noosed it on the way up and beat it with a jawbone until it agreed to ' +
        'travel more slowly. Every problem Māui solves, he solves like this.',
      focus: { marker: 'sun-pit', distance: 34, pitch: 40 },
      reveal: { markers: ['sun-pit', 'eastcape'], routes: ['maui-deeds'] },
    },
    {
      id: 'a-5',
      title: 'Fire, one fingernail at a time',
      narration:
        'He puts out every fire in the world to find out where fire is kept, ' +
        'then goes to Mahuika and asks for some. She gives him a fingernail; ' +
        'he quenches it and comes back. Again, and again, until she has none ' +
        'left and throws the last of it at him in a rage — and it lodges in ' +
        'the trees, which is where you have got it from ever since.',
      focus: { marker: 'mahuika', distance: 30, pitch: 42 },
      reveal: { markers: ['mahuika'] },
    },
    {
      id: 'a-6',
      title: 'The mountains',
      narration:
        'Tongariro, Ruapehu and Ngāuruhoe stand together in the middle of the ' +
        'fish, and in the traditions they are people. Taranaki lost a fight ' +
        'over a mountain he loved and walked west in the night, gouging the ' +
        'Whanganui out behind him. He has stood alone on the coast with his ' +
        'back turned ever since.',
      focus: { marker: 'taranaki', distance: 34, pitch: 40 },
      reveal: {
        markers: ['tongariro', 'ruapehu', 'ngauruhoe', 'taranaki', 'wanganui', 'taupo'],
        routes: ['the-mountains'],
      },
      highlight: { markers: ['taranaki'] },
    },
    {
      id: 'a-7',
      title: 'Hinemoa',
      narration:
        'Her people pull every canoe up the beach so she cannot cross to ' +
        'Tūtānekai on the island. She ties dried gourds to herself and swims ' +
        'the lake in the dark, steering by the flute he is playing, and warms ' +
        'herself in the hot pool on the shore when she gets there. It is the ' +
        'shortest journey on this map and the one the collection tells at the ' +
        'greatest length.',
      focus: { marker: 'mokoia', distance: 18, pitch: 44 },
      reveal: { markers: ['rotorua', 'mokoia'], routes: ['hinemoa-swim'] },
      highlight: { markers: ['mokoia'] },
    },
    {
      id: 'a-8',
      title: 'The people of the mist',
      narration:
        'Above the fog line on the bush ranges live the Patu-paiarehe — pale, ' +
        'heard singing at night, gone by daylight. The collection puts them on ' +
        'Pirongia, and treats them as neighbours rather than as monsters.',
      focus: { marker: 'pirongia', distance: 26, pitch: 42 },
      reveal: { markers: ['pirongia'] },
    },
    {
      id: 'a-9',
      title: 'The canoes come down',
      narration:
        'Then the traditions stop being about how the land was made and start ' +
        'being about who came to live on it: the voyage down from Hawaiki, ' +
        'Tama-te-Kapua and the Arawa canoe landing at Maketu, and the harbour ' +
        'in the north whose name means the returning, because Kupe went back ' +
        'from it.',
      focus: { marker: 'maketu', distance: 30, pitch: 40 },
      reveal: { markers: ['maketu', 'hokianga'], routes: ['the-canoes'] },
      highlight: { routes: ['the-canoes'] },
    },
    {
      id: 'a-10',
      title: 'The death of Māui',
      narration:
        'The last thing he attempts is ending death itself, by entering ' +
        'Hine-nui-te-pō while she sleeps and coming out the other side. He ' +
        'tells the birds to keep quiet. The fantail cannot manage it and ' +
        'laughs. She wakes — and that is the end of Māui, and of anyone else ' +
        'living forever.',
      focus: { marker: 'hine-nui', distance: 30, pitch: 42 },
      reveal: { markers: ['hine-nui'] },
      highlight: { markers: ['hine-nui'] },
    },
    {
      id: 'a-11',
      title: 'Te Reinga',
      narration:
        'So everyone takes the same road in the end: north up the whole length ' +
        'of the fish, along the long beach, out to the headland, down the ' +
        'roots of the old tree on the point, and into the sea for Hawaiki. ' +
        'The country that was pulled out of the water is walked back to the ' +
        'water it came from.',
      focus: { marker: 'reinga', distance: 30, pitch: 40 },
      reveal: { markers: ['reinga', 'ahipara'], routes: ['spirit-road'], regions: ['r-north'] },
      highlight: { routes: ['spirit-road'] },
    },
    {
      id: 'a-12',
      title: 'Afterword · about this telling',
      narration:
        'These traditions were read out of W. Dittmer’s Te Tohunga, published ' +
        'in London in 1907 — a Pākehā artist’s collection, and a period one. ' +
        'They are also living cultural property: iwi hold their own accounts, ' +
        'and those differ from each other and from Dittmer in names, order and ' +
        'detail. Nothing on this map is offered as any particular iwi’s ' +
        'version, and where a tradition belongs to a people, the map names the ' +
        'place rather than the account.',
      focus: { marker: 'tongariro', distance: 40, pitch: 38 },
    },
  ],
}
