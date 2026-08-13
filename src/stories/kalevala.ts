import type { Story } from '../types'
import kareliaHeight from '../assets/karelia-height.png'

/**
 * The Kalevala — the Finnish national epic, compiled by Elias Lönnrot from
 * songs he collected on eleven field trips into Karelia, published in its
 * final fifty-rune form in 1849. Lönnrot died in 1884; the poem and the
 * singers he took it from are long out of copyright.
 *
 * The world was read out of the Crawford translation (Project Gutenberg
 * #5186), rune by rune, rather than from a summary: the rune headings give
 * the shape of the tour, and the place names are counted where the poem
 * actually puts them — Northland 373 mentions, Pohyola 219, Kalevala 151,
 * Wainola 130, Tuoni 130, Sariola 97, Tuonela 24.
 *
 * That count is the map. The Kalevala is a poem about two households and the
 * road between them: Wainola in the south, where Wainamoinen, Ilmarinen and
 * Lemminkainen live, and Pohyola in the far north, where Louhi keeps her
 * daughters and, for a while, the Sampo. Almost everything in the poem is
 * somebody travelling that road with a plan.
 *
 * Markers sit at their true coordinates on the Karelian DEM —
 *
 *   map x = (lon − 15.0) / 14.5 − 1      map z = (70.5 − lat) / 5.50 − 1
 *
 * — with the mythic places set where tradition and the Karelian song-lands
 * put them: Pohyola up beyond the White Sea, Wainola in the Finnish lake
 * country, and the Tuoni river between them. Vuokkiniemi and Uhtua are real
 * villages in Viena Karelia where Lönnrot did most of his collecting; they
 * are on the map because that is where the poem was found.
 *
 * The narration paraphrases the runes and quotes no translation.
 */
export const kalevala: Story = {
  id: 'kalevala',
  title: 'The Kalevala',
  subtitle: 'The road north, and the thing worth stealing',
  author: 'Elias Lönnrot',
  region: 'Karelia & the Northland',
  epoch: 'Finnish national epic · 1835 / 1849',
  group: 'epic',
  intro:
    'A mill that grinds flour, salt and gold out of nothing, and two ' +
    'households that both want it. Press ▶ Play story to follow all fifty ' +
    'runes: the old singer born on the water, the smith who hammers the ' +
    'sky, the reckless one who gets himself killed at the river of the ' +
    'dead, the wedding at Pohyola, and the raid that brings the Sampo south ' +
    'in pieces. Take the lift down to Tuonela to see the far bank.',
  surfaceName: 'Wainola & the Northland',
  ambient: {
    trees: 0.72,
    treeKind: 'conifer',
    treeColor: '#3f6b4a',
    birds: 8,
    fish: 4,
    mosquitoes: 3,
  },
  terrain: {
    music: {
      // The Kalevala metre is trochaic tetrameter — four falling feet a line,
      // sung to a narrow, repeating tune two singers trade hand in hand. This
      // is written to that shape: a four-foot phrase inside a fifth, answered
      // a step lower, rather than lifted from any one collected melody.
      title: 'Kalevala metre',
      credit: 'After the runo-song metre · original',
      melody:
        'D4:1 E4:1 F4:1 E4:1 D4:2 A3:2 ' +
        'D4:1 E4:1 F4:1 G4:1 A4:4 ' +
        'A4:1 G4:1 F4:1 E4:1 D4:2 F4:2 ' +
        'E4:1 D4:1 C4:1 D4:1 D4:4 r:2',
      bass: 'D2:8 D2:8 A2:8 D2:8',
      tempo: 62,
      voice: 'harp',
      mood: 'mystic',
    },
    seed: 'kalevala-1', // unused: the heightmap takes precedence
    heightmap: kareliaHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0066,
    // 1,364 km across by 1,222 km down.
    aspect: 1.116,
    // Finland and Karelia top out around 500 m outside the Lapland fells; the
    // build caps at 900 m and applies landGamma 0.6 so the lake country reads
    // as land rather than as a flooded plain.
    heightScale: 13,
    rivers: 6,
    biomes: [
      { maxHeight: 0.0066, color: '#2b566f', name: 'The seas & the lakes' },
      { maxHeight: 0.09, color: '#c9c49c', name: 'Shore' },
      { maxHeight: 0.22, color: '#5f8f52', name: 'Lake country' },
      { maxHeight: 0.42, color: '#41764a', name: 'Pine forest' },
      { maxHeight: 0.62, color: '#6f7f58', name: 'Uplands' },
      { maxHeight: 0.84, color: '#8f8d76', name: 'The fells' },
      { maxHeight: 1.0, color: '#e8e8ea', name: 'Snow' },
    ],
  },

  markers: [
    {
      id: 'wainola',
      name: 'Wainola',
      kind: 'capital',
      at: { x: -0.172, z: 0.509 },
      description:
        'The southern homestead, and the poem’s home ground — Wainamoinen’s ' +
        'own country, named in the runes 130 times. Everything that leaves ' +
        'here goes north; everything worth having comes back.',
    },
    {
      id: 'kaleva-oak',
      name: 'The Great Oak',
      kind: 'landmark',
      at: { x: -0.117, z: 0.442 },
      description:
        'Sowed with the rest of the forest in the second rune, the oak grows ' +
        'until it shuts out the sun and the moon. A copper-fisted man the ' +
        'height of a thumb rises from the sea, swells to full size, and fells ' +
        'it in three strokes; the chips are carried off as charms.',
    },
    {
      id: 'osmola',
      name: 'Osmola',
      kind: 'town',
      at: { x: -0.228, z: 0.618 },
      description:
        'The Osmo fields, on the brink of the Kalew waters. The wedding ale ' +
        'itself is brewed at Pohyola, but the twentieth rune stops to tell ' +
        'where beer came from, and it came from here: the hop sown on these ' +
        'borders, the barley on these hills, and Osmotar putting six grains, ' +
        'seven hop-tips and seven cups of water on the fire to see what would ' +
        'happen.',
    },
    {
      id: 'saimaa',
      name: 'The Lakes of the South',
      kind: 'landmark',
      at: { x: -0.069, z: 0.655 },
      description:
        'The Saimaa water, the flooded south-eastern lake country. This is ' +
        'the country the singers meant by Wainola — more water than land, ' +
        'travelled by boat in summer and straight across in winter.',
    },
    {
      id: 'imatra',
      name: 'The Rapids',
      kind: 'danger',
      at: { x: -0.050, z: 0.693 },
      description:
        'The Kalevala is full of cataracts — the boat that must be sung ' +
        'through them, the salmon that will not be caught in them, the ' +
        'shattered sledge. Imatra, where the Vuoksi falls out of Saimaa, is ' +
        'the loudest of them and stands here for all of them.',
    },
    {
      id: 'saari',
      name: 'The Isle of Refuge',
      kind: 'landmark',
      at: { x: -0.552, z: 0.873 },
      description:
        'The nameless island Lemminkainen hides on for three years in the ' +
        'twenty-ninth rune, after the Pohyola wedding goes wrong. He is very ' +
        'popular there with everyone except the island’s men, and he leaves ' +
        'in a hurry when they come home.',
    },
    {
      id: 'youkahainen',
      name: 'Youkahainen’s Land',
      kind: 'town',
      at: { x: -0.345, z: 0.727 },
      description:
        'The young Lapp singer who challenges Wainamoinen to a song-duel in ' +
        'the third rune, loses, is sung into a swamp to his chin, and buys ' +
        'his way out by promising his sister Aino. Later he shoots ' +
        'Wainamoinen’s horse from under him out of spite.',
    },
    {
      id: 'aino',
      name: 'Aino’s Water',
      kind: 'danger',
      at: { x: -0.436, z: 0.782 },
      description:
        'Aino will not marry an old man to settle her brother’s bet. She ' +
        'walks to the shore, leaves her clothes on a rock, swims to a stone ' +
        'in the water and drowns. Wainamoinen catches a strange fish months ' +
        'later, and understands what he has in his hands only after it slips ' +
        'back into the sea.',
    },
    {
      id: 'wina',
      name: 'The Open Sea',
      kind: 'landmark',
      at: { x: -0.897, z: 0.873 },
      description:
        'Where the poem begins: the Water-Mother floats for seven hundred ' +
        'years, a teal lays its eggs on her knee, the eggs break and become ' +
        'the earth, the sky, the sun and the moon — and Wainamoinen is born ' +
        'old, and swims ashore.',
    },
    {
      id: 'bothnia',
      name: 'The Gulf',
      kind: 'landmark',
      at: { x: -0.552, z: 0.255 },
      description:
        'The Bothnian water on the western edge of the map. Wainamoinen is ' +
        'blown across open sea like this in the sixth rune, eight days in ' +
        'the water, and is carried up onto the Northland shore weeping — ' +
        'which is how the road to Pohyola opens at all.',
    },
    {
      id: 'oulu',
      name: 'The Northland Shore',
      kind: 'port',
      at: { x: -0.278, z: -0.002 },
      description:
        'Where the current puts him down. Louhi finds him crying on the ' +
        'beach, feeds him, and makes her offer: a way home, and her daughter, ' +
        'if somebody will forge her a Sampo. He has not got one, but he knows ' +
        'a man who can make one.',
    },
    {
      id: 'pohyola',
      name: 'Pohyola',
      kind: 'capital',
      at: { x: 0.241, z: -0.436 },
      description:
        'The Northland farm, and Louhi’s hall — named 219 times, more than ' +
        'anywhere except the Northland itself. A rich house, dark, gated, and ' +
        'run by a woman who out-negotiates every hero who walks in.',
    },
    {
      id: 'sampo-forge',
      name: 'Ilmarinen’s Forge',
      kind: 'landmark',
      at: { x: 0.269, z: -0.400 },
      description:
        'Ilmarinen — the smith who hammered out the dome of the sky and left ' +
        'no hammer-mark on it — is tricked into coming north, and builds his ' +
        'forge here. Three failures come out of the fire first: a crossbow, a ' +
        'boat and a heifer, each beautiful and each evil-tempered. Then the ' +
        'Sampo, with its lid of many colours.',
    },
    {
      id: 'sampo-hill',
      name: 'The Hill of Stone',
      kind: 'ruin',
      at: { x: 0.318, z: -0.473 },
      description:
        'Louhi shuts the Sampo inside the copper-bearing hill behind nine ' +
        'locks, and its roots grow nine fathoms down — one into the earth, ' +
        'one into the water, one into the home mountain. It grinds a bin of ' +
        'flour, a bin of salt and a bin of gold every day, and Northland ' +
        'never wants for anything again.',
    },
    {
      id: 'kandalaksha',
      name: 'The Northern Bay',
      kind: 'port',
      at: { x: 0.200, z: -0.391 },
      description:
        'The water Louhi’s people put to sea from. It is a long way round ' +
        'the coast from here to Wainola, which is why the raid takes a boat ' +
        'and a hundred rowers and most of a rune.',
    },
    {
      id: 'lapland',
      name: 'Lapland',
      kind: 'landmark',
      at: { x: -0.345, z: -0.509 },
      description:
        'Named sixty-four times. The fell country the singers thought of as ' +
        'the other side of the world — where sorcerers come from, where ' +
        'arrows are shot from over impossible distances, and where nobody ' +
        'from Wainola goes casually.',
    },
    {
      id: 'inari',
      name: 'The Frost-Fiend’s Water',
      kind: 'danger',
      at: { x: -0.110, z: -0.727 },
      description:
        'In the thirtieth rune Lemminkainen’s war-boat is frozen fast in open ' +
        'sea by the Frost-Fiend, and he has to sing the frost back to its ' +
        'birthplace among the northern fells before the ice will let go.',
    },
    {
      id: 'tuoni-river',
      name: 'The River of Tuoni',
      kind: 'danger',
      at: { x: 0.069, z: 0.255 },
      description:
        'The black river between the living country and the dead one. ' +
        'Lemminkainen is sent here to shoot the swan of the death-river as ' +
        'the third of Louhi’s bride-tasks. A blind herdsman he had insulted ' +
        'is waiting on the bank with a water-snake for a spear.',
      link: {
        world: 'kalevala',
        level: 'tuonela',
        marker: 'far-bank',
        note: 'The far bank, and what the rake brought up',
      },
    },
    {
      id: 'vuokkiniemi',
      name: 'Vuokkiniemi',
      kind: 'town',
      at: { x: 0.043, z: 0.073 },
      description:
        'A real village in Viena Karelia, and one of Lönnrot’s richest ' +
        'sources — Arhippa Perttunen sang him thousands of lines near here ' +
        'in 1834. The poem is set in a mythic country; it was collected in ' +
        'this one.',
    },
    {
      id: 'uhtua',
      name: 'Uhtua',
      kind: 'town',
      at: { x: 0.115, z: 0.011 },
      description:
        'The other centre of the Viena song-lands, on the water road Lönnrot ' +
        'walked between villages with a notebook. Almost every hero in this ' +
        'atlas was written down by somebody; the Kalevala’s heroes were sung ' +
        'to a man who came on foot.',
    },
    {
      id: 'wipunen',
      name: 'Wipunen’s Grave',
      kind: 'ruin',
      at: { x: -0.030, z: 0.345 },
      description:
        'Antero Wipunen has been dead so long that a tree grows out of his ' +
        'shoulder — and he is the only one left who knows the three words ' +
        'Wainamoinen needs to finish his boat. Wainamoinen walks over swords ' +
        'and axe-blades to reach him, is swallowed, sets up a smithy inside ' +
        'him, and hammers until he sings.',
    },
    {
      id: 'boat-yard',
      name: 'The Boat-Yard',
      kind: 'landmark',
      at: { x: -0.140, z: 0.560 },
      description:
        'Where Wainamoinen builds the ship by singing it together, and stops ' +
        'three words short of the gunwales. The finished vessel carries the ' +
        'raiding party north for the Sampo — and gets stuck on the shoulders ' +
        'of a pike on the way.',
    },
    {
      id: 'pike-shoal',
      name: 'The Shoulders of the Pike',
      kind: 'danger',
      at: { x: 0.021, z: 0.182 },
      description:
        'The boat grounds on something that turns out to be a monstrous pike. ' +
        'They kill it and eat it, and Wainamoinen makes the first kantele out ' +
        'of its jawbone, strung with hair from a demon horse. Everything ' +
        'alive comes to listen; he is the only one who can play it.',
    },
    {
      id: 'kullervo',
      name: 'Kullervo’s Country',
      kind: 'battle',
      at: { x: -0.260, z: 0.320 },
      description:
        'Six runes of the poem belong to a different story entirely: Untamo ' +
        'destroys his brother Kalervo’s household, the surviving boy is sold ' +
        'into service, breaks everything he is set to do, kills the smith’s ' +
        'wife with a herd of bears and wolves, unknowingly ruins his own ' +
        'sister, burns Untamo’s farm and falls on his own sword.',
    },
    {
      id: 'sampo-wreck',
      name: 'Where the Sampo Sank',
      kind: 'danger',
      at: { x: 0.414, z: 0.109 },
      description:
        'Louhi comes after the raiders as an enormous bird with a hundred ' +
        'men in her wings, and in the fight the Sampo goes over the side. ' +
        'The lid of many colours shatters. The big pieces stay in the sea — ' +
        'which is why the sea is rich — and the small pieces wash south.',
    },
    {
      id: 'shore-of-fragments',
      name: 'The Shore of the Fragments',
      kind: 'landmark',
      at: { x: 0.027, z: 0.400 },
      description:
        'Wainamoinen finds splinters of the Sampo coming ashore on the ' +
        'billows and is pleased rather than sorry: from these, he says, will ' +
        'come the ploughing and the sowing and the whole future luck of ' +
        'Suomi. The mill is gone and the harvest is what is left of it.',
    },
    {
      id: 'alue',
      name: 'Lake Alue',
      kind: 'landmark',
      at: { x: 0.360, z: 0.006 },
      description:
        'Where the fire-spark falls after it is dropped out of the sky, ' +
        'boiling the lake red, and where it is swallowed by a whitefish, then ' +
        'a trout, then a pike. The forty-eighth rune is a fishing expedition ' +
        'to get fire back out of the water.',
    },
    {
      id: 'sun-rock',
      name: 'The Rock of the Sun and Moon',
      kind: 'danger',
      at: { x: 0.291, z: -0.509 },
      description:
        'Louhi’s last move: she steals the sun and the moon out of the sky, ' +
        'shuts them inside a hill of stone behind nine locks, and takes the ' +
        'fire off the hearths of Kalevala. Ilmarinen starts forging ' +
        'replacements before it occurs to anyone that they will not shine.',
    },
    {
      id: 'departure',
      name: 'Wainamoinen’s Departure',
      kind: 'landmark',
      at: { x: -0.420, z: 0.900 },
      description:
        'In the fiftieth rune the virgin Mariatta bears a son from a berry; ' +
        'the child is made king of Karelia. Wainamoinen, out-argued by a ' +
        'fortnight-old baby, sings himself a copper boat and sails off over ' +
        'the horizon — leaving his songs, and the kantele, behind for his ' +
        'people.',
    },
  ],

  routes: [
    {
      id: 'road-north',
      name: 'The Road to Pohyola',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.172, z: 0.509 },
        { x: -0.228, z: 0.400 },
        { x: -0.278, z: 0.200 },
        { x: -0.278, z: -0.002 },
        { x: -0.120, z: -0.200 },
        { x: 0.100, z: -0.360 },
        { x: 0.241, z: -0.436 },
      ],
      description:
        'The spine of the poem. Wainamoinen is blown up it, Ilmarinen is ' +
        'tricked up it, Lemminkainen rides up it uninvited, and the raiding ' +
        'party comes back down it with the Sampo.',
    },
    {
      id: 'drift',
      name: 'Eight Days in the Water',
      style: 'dashed',
      color: '#7fb4d8',
      points: [
        { x: -0.897, z: 0.873 },
        { x: -0.700, z: 0.640 },
        { x: -0.552, z: 0.255 },
        { x: -0.430, z: 0.090 },
        { x: -0.278, z: -0.002 },
      ],
      description:
        'Youkahainen shoots Wainamoinen’s horse out from under him at sea. ' +
        'He floats for eight days, is carried by an eagle he once spared, and ' +
        'lands on the Northland shore — which is where the whole Sampo ' +
        'business starts.',
    },
    {
      id: 'song-duel',
      name: 'The Song-Duel Road',
      style: 'solid',
      color: '#9ec9a8',
      points: [
        { x: -0.345, z: 0.727 },
        { x: -0.436, z: 0.782 },
        { x: -0.172, z: 0.509 },
        { x: -0.069, z: 0.655 },
        { x: -0.050, z: 0.693 },
      ],
      description:
        'Runes III–V, kept in the southern lake country: Youkahainen driving ' +
        'down to out-sing the old man, the sledge smashed on the way home, ' +
        'Aino walking to the water, and Wainamoinen fishing the whole of ' +
        'Saimaa afterwards for something he cannot name.',
    },
    {
      id: 'frost-voyage',
      name: 'The Frozen War-Boat',
      style: 'dashed',
      color: '#a8c8dd',
      points: [
        { x: 0.241, z: -0.436 },
        { x: 0.000, z: -0.520 },
        { x: -0.345, z: -0.509 },
        { x: -0.110, z: -0.727 },
      ],
      description:
        'Rune XXX: Lemminkainen and Tiera go raiding north, and the ' +
        'Frost-Fiend freezes the boat fast in open water. He has to sing the ' +
        'frost back to its own birthplace among the fells before the ice will ' +
        'let go of them.',
    },
    {
      id: 'fire-hunt',
      name: 'The Hunt for the Fire-Fish',
      style: 'solid',
      color: '#e0894a',
      points: [
        { x: 0.115, z: 0.011 },
        { x: 0.069, z: 0.255 },
        { x: 0.200, z: 0.160 },
        { x: 0.360, z: 0.006 },
      ],
      description:
        'Runes XLVII–XLIX: the new fire-spark falls out of the sky, boils ' +
        'Lake Alue red, and is swallowed by a whitefish, then a trout, then a ' +
        'pike. Getting fire back is a fishing expedition, and it takes two ' +
        'runes and a net woven out of nothing.',
    },
    {
      id: 'lemmin-ride',
      name: 'Lemminkainen’s Ride',
      style: 'solid',
      color: '#d98f5a',
      points: [
        { x: -0.552, z: 0.873 },
        { x: -0.400, z: 0.700 },
        { x: -0.260, z: 0.480 },
        { x: -0.100, z: 0.340 },
        { x: 0.069, z: 0.255 },
      ],
      description:
        'From the Isle of Refuge to the river of the dead: the elk of Hisi, ' +
        'the fire-breathing horse, and then the swan of Tuoni, which is one ' +
        'task too many.',
    },
    {
      id: 'wedding-road',
      name: 'The Wedding Journey',
      style: 'solid',
      color: '#e0a5c2',
      points: [
        { x: -0.228, z: 0.618 },
        { x: -0.172, z: 0.509 },
        { x: -0.117, z: 0.442 },
        { x: 0.043, z: 0.073 },
        { x: 0.200, z: -0.391 },
        { x: 0.241, z: -0.436 },
      ],
      description:
        'Ilmarinen wins the Maiden of the Rainbow by ploughing a field of ' +
        'vipers, bridling the bear and the wolf of Tuoni, and landing the ' +
        'great pike of Manala. Then six runes of wedding, and the ride home ' +
        'with the bride.',
    },
    {
      id: 'sampo-raid',
      name: 'The Raid for the Sampo',
      style: 'solid',
      color: '#c96f5c',
      points: [
        { x: -0.140, z: 0.560 },
        { x: 0.021, z: 0.182 },
        { x: 0.115, z: 0.011 },
        { x: 0.200, z: -0.391 },
        { x: 0.318, z: -0.473 },
      ],
      description:
        'Wainamoinen, Ilmarinen and Lemminkainen sail north with the kantele. ' +
        'Wainamoinen plays Pohyola to sleep, the ox and the ploughs get the ' +
        'hill open, and they carry the Sampo down to the boat.',
    },
    {
      id: 'sampo-flight',
      name: 'The Flight, and the Sinking',
      style: 'solid',
      color: '#8f5fa8',
      points: [
        { x: 0.318, z: -0.473 },
        { x: 0.200, z: -0.391 },
        { x: 0.380, z: -0.120 },
        { x: 0.414, z: 0.109 },
        { x: 0.150, z: 0.300 },
        { x: 0.027, z: 0.400 },
      ],
      description:
        'Three days out, Lemminkainen sings for joy, a crane takes fright, ' +
        'and its scream wakes Pohyola. Louhi comes over the water as a bird ' +
        'of prey; the Sampo goes into the sea and comes ashore in splinters.',
    },
    {
      id: 'song-collecting',
      name: 'Lönnrot’s Collecting Road',
      style: 'dashed',
      color: '#9ba7b5',
      points: [
        { x: -0.278, z: -0.002 },
        { x: -0.100, z: 0.060 },
        { x: 0.043, z: 0.073 },
        { x: 0.115, z: 0.011 },
        { x: 0.069, z: 0.255 },
      ],
      description:
        'Not in the poem: the road Elias Lönnrot actually walked, eleven ' +
        'field trips between 1828 and 1844, from Kajaani into the Viena ' +
        'villages and back with the notebooks that became this book.',
    },
    {
      id: 'last-sail',
      name: 'The Copper Boat',
      style: 'dashed',
      color: '#e8c56a',
      points: [
        { x: -0.172, z: 0.509 },
        { x: -0.280, z: 0.680 },
        { x: -0.420, z: 0.900 },
        { x: -0.700, z: 0.960 },
      ],
      description:
        'The last thing Wainamoinen does is leave. He sings himself a boat ' +
        'of copper and sails away between the earth and the sky, saying he ' +
        'will be needed again.',
    },
  ],

  regions: [
    { id: 'r-wainola', name: 'Wainola', at: { x: -0.230, z: 0.560 }, scale: 1.15 },
    { id: 'r-pohyola', name: 'Pohyola', at: { x: 0.270, z: -0.560 }, scale: 1.2 },
    { id: 'r-viena', name: 'Viena Karelia', at: { x: 0.120, z: 0.130 }, scale: 0.95 },
    { id: 'r-lapland', name: 'Lapland', at: { x: -0.330, z: -0.620 }, scale: 1 },
  ],

  levels: [
    {
      id: 'tuonela',
      title: 'Tuonela',
      subtitle: 'The far bank of the death-river',
      tier: -1,
      terrain: {
        music: {
          title: 'The Death-River',
          credit: 'Original, written for this atlas',
          melody:
            'D3:3 F3:1 A3:4 G3:2 F3:2 E3:4 r:2 ' +
            'A3:2 C4:2 D4:4 C4:2 A3:2 F3:6 r:2',
          bass: 'D2:8 D2:8 Bb1:8 D2:8',
          tempo: 44,
          voice: 'strings',
          mood: 'dark',
        },
        seed: 'tuonela-3',
        sky: 'cavern',
        seaLevel: 0.4,
        heightScale: 16,
        octaves: 5,
        frequency: 2.0,
        islandFalloff: 0.3,
        waterColor: '#141b26',
        riverColor: '#2b3b52',
        rivers: 3,
        biomes: [
          { maxHeight: 0.4, color: '#18222c', name: 'The black water' },
          { maxHeight: 0.5, color: '#33414d', name: 'The reeds' },
          { maxHeight: 0.66, color: '#465055', name: 'Manala' },
          { maxHeight: 0.82, color: '#5d6360', name: 'Tuoni’s fields' },
          { maxHeight: 1.0, color: '#8a897b', name: 'The far hills' },
        ],
      },
      ambient: { trees: 0.1, treeKind: 'conifer', treeColor: '#2c3a33', birds: 2, wisps: 8, fish: 2 },
      markers: [
        {
          id: 'far-bank',
          name: 'The Far Bank',
          kind: 'landmark',
          at: { x: 0.0, z: -0.1 },
          description:
            'Tuoni’s daughter ferries you across if you can give a true ' +
            'reason for coming, and Wainamoinen tries three lies before he ' +
            'admits he came for a magic word. Named 130 times in the poem, ' +
            'under Tuoni, Tuonela and Manala.',
          link: {
            world: 'kalevala',
            marker: 'tuoni-river',
            note: 'Back to the living bank',
          },
        },
        {
          id: 'ale-of-tuoni',
          name: 'The Cup of Tuonela',
          kind: 'danger',
          at: { x: -0.22, z: 0.02 },
          description:
            'They give Wainamoinen beer to drink and a bed to sleep in. He ' +
            'looks into the cup, sees it is full of frogs and worms, and does ' +
            'not drink it — the one guest in the story with the sense to ' +
            'refuse Tuonela’s hospitality.',
        },
        {
          id: 'iron-net',
          name: 'The Iron Net',
          kind: 'danger',
          at: { x: 0.26, z: 0.14 },
          description:
            'While he sleeps, Tuoni’s son spins a net of iron and copper ' +
            'across the river so that nobody leaves. Wainamoinen turns ' +
            'himself into an otter and then a snake and goes through the ' +
            'mesh; nobody has managed it since.',
        },
        {
          id: 'swan',
          name: 'The Swan of Tuoni',
          kind: 'danger',
          at: { x: -0.44, z: -0.22 },
          description:
            'One black swan on the death-river, and shooting it is the third ' +
            'thing Louhi asks for her daughter. Lemminkainen has his bow ' +
            'drawn when the blind herdsman’s water-snake goes through him.',
        },
        {
          id: 'the-rake',
          name: 'The Rake in the River',
          kind: 'landmark',
          at: { x: 0.18, z: -0.34 },
          description:
            'Lemminkainen is cut into pieces and thrown in. His mother gets ' +
            'a long-toothed copper rake from Ilmarinen, drags the river until ' +
            'she has every piece, assembles her son on the bank, and calls a ' +
            'bee to fetch honey from the ninth heaven to make him live again.',
        },
        {
          id: 'kalma',
          name: 'The Fields of Kalma',
          kind: 'ruin',
          at: { x: -0.05, z: 0.42 },
          description:
            'Where the dead lie down. Tuonela in the poem is not a punishment ' +
            'or a reward; it is simply the other bank, colder and darker, ' +
            'with the same reeds and the same fishing.',
        },
      ],
      routes: [
        {
          id: 'crossing',
          name: 'Wainamoinen’s Crossing',
          style: 'solid',
          color: '#7f9bb8',
          points: [
            { x: 0.0, z: -0.1 },
            { x: -0.22, z: 0.02 },
            { x: 0.26, z: 0.14 },
            { x: 0.42, z: 0.36 },
          ],
          description:
            'Over the river for a word, and back out through the iron net as ' +
            'an otter and a snake. He comes home saying that nobody should ' +
            'go there on purpose.',
        },
        {
          id: 'the-fields',
          name: 'Across the Fields of Kalma',
          style: 'dashed',
          color: '#6f8296',
          points: [
            { x: -0.22, z: 0.02 },
            { x: -0.16, z: 0.24 },
            { x: -0.05, z: 0.42 },
            { x: 0.12, z: 0.3 },
            { x: 0.26, z: 0.14 },
          ],
          description:
            'What Tuoni’s daughter shows him on the way to his bed: the low ' +
            'ground where the dead are laid, which is the same reeds and the ' +
            'same fishing as the living bank, only colder.',
        },
        {
          id: 'raking',
          name: 'The Mother’s Raking',
          style: 'solid',
          color: '#d9a05a',
          points: [
            { x: -0.44, z: -0.22 },
            { x: -0.10, z: -0.30 },
            { x: 0.18, z: -0.34 },
            { x: 0.02, z: -0.05 },
          ],
          description:
            'Up and down the cataract with a copper rake until every piece of ' +
            'her son has come up. The poem lists what is missing on each pass.',
        },
      ],
      regions: [
        { id: 'r-manala', name: 'Manala', at: { x: -0.35, z: 0.30 }, scale: 1.1 },
        { id: 'r-tuoni', name: 'Tuoni’s Fields', at: { x: 0.32, z: -0.42 }, scale: 1 },
      ],
    },
  ],

  chapters: [
    {
      id: 'k-1',
      title: 'I–II · The water and the oak',
      narration:
        'The Water-Mother floats seven hundred years in the open sea. A teal ' +
        'nests on her knee, the eggs roll off and break, and the pieces ' +
        'become the earth, the sky, the sun, the moon and the stars. ' +
        'Wainamoinen is born already old. He sows the forests, and one oak ' +
        'grows so tall it blots out the light — until a thumb-sized man out ' +
        'of the sea swells to full height and fells it in three strokes.',
      focus: { marker: 'wina', distance: 60, pitch: 40 },
      reveal: { markers: ['wina', 'wainola', 'kaleva-oak'], regions: ['r-wainola'] },
    },
    {
      id: 'k-2',
      title: 'III–V · The song-duel, and Aino',
      narration:
        'Youkahainen comes south to out-sing the old man and is sung into a ' +
        'swamp up to his chin. To get out he promises his sister Aino. Aino ' +
        'will not have it: she leaves her clothes on a rock and swims out to ' +
        'a stone in the water. Months later Wainamoinen lands a fish he ' +
        'cannot identify, and understands what he is holding only after it ' +
        'is gone.',
      focus: { marker: 'aino', distance: 40, pitch: 38 },
      reveal: { markers: ['youkahainen', 'aino', 'saimaa', 'imatra'] },
      highlight: { markers: ['aino'] },
    },
    {
      id: 'k-3',
      title: 'VI–VIII · Eight days in the water',
      narration:
        'Wainamoinen rides north to court a wife; Youkahainen, still ' +
        'brooding, shoots his horse out from under him. He floats eight days ' +
        'in open sea, is carried the rest of the way by an eagle whose tree ' +
        'he once spared, and is put down weeping on the Northland shore, ' +
        'which is exactly where he did not want to be.',
      focus: { marker: 'bothnia', distance: 66, pitch: 36 },
      reveal: { markers: ['bothnia', 'oulu'], routes: ['drift'] },
      highlight: { routes: ['drift'] },
    },
    {
      id: 'k-4',
      title: 'VIII–X · The bargain, and the Sampo',
      narration:
        'Louhi feeds him and names her price: a Sampo, and her daughter for ' +
        'whoever makes it. Wainamoinen cannot, but Ilmarinen can — the smith ' +
        'who hammered the dome of the sky. Tricked north, Ilmarinen builds a ' +
        'forge, throws out a crossbow, a boat and a heifer that all come out ' +
        'evil-tempered, and on the fourth day lifts out the Sampo with its ' +
        'lid of many colours.',
      focus: { marker: 'sampo-forge', distance: 34, pitch: 40 },
      reveal: {
        markers: ['pohyola', 'sampo-forge', 'sampo-hill', 'kandalaksha'],
        routes: ['road-north'],
        regions: ['r-pohyola'],
      },
      highlight: { markers: ['sampo-forge'] },
    },
    {
      id: 'k-5',
      title: 'X · Nine locks in the hill',
      narration:
        'Louhi shuts the mill inside the copper-bearing hill behind nine ' +
        'locks and lets its roots grow nine fathoms down — one into the ' +
        'earth, one into the water, one into the home mountain. A bin of ' +
        'flour, a bin of salt and a bin of gold a day. Ilmarinen goes home ' +
        'without the girl.',
      focus: { marker: 'sampo-hill', distance: 30, pitch: 44 },
      highlight: { markers: ['sampo-hill'] },
    },
    {
      id: 'k-6',
      title: 'XI–XIII · Lemminkainen',
      narration:
        'The third hero is young, handsome, an excellent skier and completely ' +
        'without judgement. He carries off Kyllikki from her island, promises ' +
        'never to go to war if she never goes dancing, and rides north to ' +
        'court a second wife the first time she goes dancing.',
      focus: { marker: 'saari', distance: 40, pitch: 38 },
      reveal: { markers: ['saari'], routes: ['lemmin-ride'] },
    },
    {
      id: 'k-7',
      title: 'XIV–XV · The river of the dead',
      narration:
        'Louhi sets him three tasks: the elk of Hisi, the fire-breathing ' +
        'horse, and the swan of the death-river. He has his bow drawn at the ' +
        'third when a blind herdsman he once insulted puts a water-snake ' +
        'through him. Tuoni’s son cuts him up and throws him in.',
      focus: { marker: 'tuoni-river', distance: 32, pitch: 40 },
      reveal: { markers: ['tuoni-river'] },
      highlight: { markers: ['tuoni-river'], routes: ['lemmin-ride'] },
    },
    {
      id: 'k-8',
      title: 'XV · What the rake brought up',
      narration:
        'His mother asks the trees, the road and the moon where her son is; ' +
        'the sun tells her. She has Ilmarinen beat her a long-toothed copper ' +
        'rake, drags the black river until every piece has come up, puts him ' +
        'together on the bank, and sends a bee to the ninth heaven for honey ' +
        'to start his heart again.',
      level: 'tuonela',
      focus: { marker: 'the-rake', distance: 34, pitch: 38 },
      reveal: { markers: ['swan', 'the-rake', 'far-bank'], routes: ['raking'] },
    },
    {
      id: 'k-9',
      title: 'XVI–XVII · Over the river for a word',
      narration:
        'Wainamoinen’s boat is three words short of finished, so he goes to ' +
        'Tuonela to look for them. They give him beer full of worms and a bed ' +
        'to sleep in, and spin an iron net across the river while he sleeps. ' +
        'He goes out through the mesh as an otter and a snake, and reports ' +
        'that nobody should try it.',
      level: 'tuonela',
      focus: { marker: 'iron-net', distance: 36, pitch: 36 },
      reveal: { markers: ['ale-of-tuoni', 'iron-net', 'kalma'], routes: ['crossing'], regions: ['r-manala', 'r-tuoni'] },
      highlight: { routes: ['crossing'] },
    },
    {
      id: 'k-10',
      title: 'XVII · Inside Wipunen',
      narration:
        'The words are with Antero Wipunen, dead so long that a tree grows ' +
        'out of his shoulder. Wainamoinen walks over swords and axe-blades to ' +
        'get to him, is swallowed whole, sets up a forge in his stomach and ' +
        'hammers until the old giant sings out everything he knows just to ' +
        'be rid of him.',
      focus: { marker: 'wipunen', distance: 30, pitch: 42 },
      reveal: { markers: ['wipunen', 'boat-yard'] },
    },
    {
      id: 'k-11',
      title: 'XVIII–XIX · The rival suitors',
      narration:
        'Both of them go north for the same girl, one by boat and one by ' +
        'sledge, and she chooses the smith. Ilmarinen ploughs a field of ' +
        'vipers, bridles the bear and the wolf of Tuoni, and lands the great ' +
        'pike of Manala with a fire-forged eagle. Louhi runs out of ' +
        'conditions.',
      focus: { marker: 'pohyola', distance: 40, pitch: 38 },
      reveal: { routes: ['wedding-road'] },
      highlight: { routes: ['wedding-road'] },
    },
    {
      id: 'k-12',
      title: 'XX–XXV · The wedding',
      narration:
        'Six runes of wedding: an ox so large that a swallow needs a day to ' +
        'fly between its horns, Osmotar inventing beer at Osmola, the ' +
        'bride advised at length on how to live with a mother-in-law, and ' +
        'the whole of Wainola singing the couple out the door.',
      focus: { marker: 'osmola', distance: 30, pitch: 40 },
      reveal: { markers: ['osmola'] },
    },
    {
      id: 'k-13',
      title: 'XXVI–XXX · The uninvited guest',
      narration:
        'Lemminkainen was not asked to the wedding. He rides north anyway, ' +
        'kills the master of Pohyola in a duel over a cup, and runs — first ' +
        'home, then to a nameless island where he is popular with everybody ' +
        'except the island’s men. When they come home he leaves, and finds ' +
        'his own house burned.',
      focus: { marker: 'saari', distance: 40, pitch: 36 },
      reveal: { markers: ['inari'] },
    },
    {
      id: 'k-14',
      title: 'XXXI–XXXVI · Kullervo',
      narration:
        'The darkest thing in the poem, and it belongs to nobody else’s ' +
        'story. Untamo destroys his brother’s household; the surviving boy ' +
        'is sold into service, ruins everything he touches, kills the smith’s ' +
        'wife with a herd of bears, unknowingly wrongs his own sister, burns ' +
        'Untamo’s farm to the ground, and asks his sword whether it would ' +
        'like to eat guilty flesh. It says it does not care.',
      focus: { marker: 'kullervo', distance: 34, pitch: 40 },
      reveal: { markers: ['kullervo'] },
      highlight: { markers: ['kullervo'] },
    },
    {
      id: 'k-15',
      title: 'XXXVII–XXXVIII · The bride of gold',
      narration:
        'Widowed, Ilmarinen forges himself a wife out of gold and silver and ' +
        'takes her to bed. The side of him against her stays frozen all ' +
        'night. He offers her to Wainamoinen, who declines and tells the ' +
        'young men of Suomi never to court anything made of metal.',
      focus: { marker: 'sampo-forge', distance: 30, pitch: 42 },
    },
    {
      id: 'k-16',
      title: 'XXXIX–XLI · The pike, and the harp',
      narration:
        'Wainamoinen decides to take the Sampo. The ship grounds on what ' +
        'turns out to be a monstrous pike; they kill it, eat it, and he makes ' +
        'the first kantele out of its jawbone. Nobody else can play it. When ' +
        'he does, every animal in the forest and every fish in the water ' +
        'comes to listen, and he cries into his own beard.',
      focus: { marker: 'pike-shoal', distance: 32, pitch: 38 },
      reveal: { markers: ['pike-shoal'], routes: ['sampo-raid'] },
      highlight: { routes: ['sampo-raid'] },
    },
    {
      id: 'k-17',
      title: 'XLII · The raid',
      narration:
        'He plays Pohyola to sleep, and they take the hill apart: an ox and ' +
        'a thousand-toothed plough for the roots, Lemminkainen’s shoulder for ' +
        'the door. The Sampo goes down to the boat and the boat goes south, ' +
        'and everything would have been fine if Lemminkainen could have kept ' +
        'quiet for three days.',
      focus: { marker: 'sampo-hill', distance: 30, pitch: 42 },
      highlight: { markers: ['sampo-hill'] },
    },
    {
      id: 'k-18',
      title: 'XLIII · Lost in the sea',
      narration:
        'He sings for joy, a crane takes fright, and its scream wakes ' +
        'Pohyola. Louhi comes over the water as a bird of prey with a hundred ' +
        'men in her wings. In the fight the Sampo goes over the side and the ' +
        'lid of many colours shatters. The big pieces stay in the sea, which ' +
        'is why the sea is rich.',
      focus: { marker: 'sampo-wreck', distance: 44, pitch: 36 },
      reveal: { markers: ['sampo-wreck', 'shore-of-fragments'], routes: ['sampo-flight'] },
      highlight: { routes: ['sampo-flight'] },
    },
    {
      id: 'k-19',
      title: 'XLIII · The shore of the fragments',
      narration:
        'Splinters wash up in Wainola, and Wainamoinen is pleased rather than ' +
        'sorry: from these, he says, come the ploughing and the sowing and ' +
        'the luck of Suomi for good. The mill is gone. The harvest is what ' +
        'is left of it.',
      focus: { marker: 'shore-of-fragments', distance: 36, pitch: 38 },
      highlight: { markers: ['shore-of-fragments'] },
    },
    {
      id: 'k-20',
      title: 'XLV–XLIX · Nine diseases, a bear, and the dark',
      narration:
        'Louhi does everything she threatened: nine diseases, the bear sent ' +
        'against the cattle, and at last the sun and the moon taken out of ' +
        'the sky and locked in a hill of stone. A spark of new fire falls ' +
        'into Lake Alue and is swallowed by three fish in turn, and the ' +
        'forty-eighth rune is a fishing trip to get fire back.',
      focus: { marker: 'sun-rock', distance: 36, pitch: 40 },
      reveal: { markers: ['alue', 'sun-rock', 'lapland'], regions: ['r-lapland'] },
      highlight: { markers: ['sun-rock'] },
    },
    {
      id: 'k-21',
      title: 'L · Mariatta, and the departure',
      narration:
        'A virgin bears a son from a berry, and the child — a fortnight old ' +
        'and already arguing — is made king of Karelia. Wainamoinen, ' +
        'out-talked at last, sings himself a boat of copper and sails off ' +
        'between the earth and the sky, leaving his songs and his kantele ' +
        'behind, and saying he will be wanted again.',
      focus: { marker: 'departure', distance: 46, pitch: 34 },
      reveal: { markers: ['departure'], routes: ['last-sail'] },
      highlight: { routes: ['last-sail'] },
    },
    {
      id: 'k-22',
      title: 'Afterword · Where it was collected',
      narration:
        'None of this survived in books. Elias Lönnrot walked eleven field ' +
        'trips into Viena Karelia between 1828 and 1844 and wrote it down ' +
        'from singers — Arhippa Perttunen at Latvajärvi gave him thousands ' +
        'of lines in one sitting. Vuokkiniemi and Uhtua are on this map ' +
        'because that is where the poem was found, not where it is set.',
      focus: { marker: 'vuokkiniemi', distance: 40, pitch: 38 },
      reveal: {
        markers: ['vuokkiniemi', 'uhtua'],
        routes: ['song-collecting'],
        regions: ['r-viena'],
      },
      highlight: { routes: ['song-collecting'] },
    },
  ],
}
