import type { Story } from '../types'
import svejkHeight from '../assets/svejk-height.png'

/**
 * The Good Soldier Švejk — Jaroslav Hašek, 1921-23, unfinished because he died
 * at thirty-nine with the fourth book half-written.
 *
 * Twenty-six worlds in this atlas and not one of them was funny. This one is a
 * comedy, and it earns its place on a MAP better than most of them, because its
 * best chapter is a route: Švejk's budějovická anabáze, in which a soldier sent
 * by train from Tábor to České Budějovice — 60 km south-east — gets off at a
 * station, misses the train, sets out on foot, and walks for days in a wide
 * circle the wrong way round southern Bohemia.
 *
 * Hašek gives the itinerary twice, in full, and the second time as a flat list.
 * It is drawn here exactly as he wrote it, and the joke is in the geometry:
 *
 *   Tábor – Milevsko – Květov – Vráž – Malčín – Čížová – Sedlec – Horažďovice
 *   – Radomyšl – Putim – Štěkno – Strakonice – Volyně – Dub – Vodňany
 *   – Protivín – A ZAS PUTIM — "and Putim again" — Písek, Budějovice.
 *
 * He reaches Putim, carries on for four more villages, and arrives back at
 * Putim. He is then arrested and sent to Budějovice by train, from Písek, under
 * escort, which is how he was going in the first place.
 *
 * The surface is a REAL heightmap of that corner of South Bohemia, with every
 * town at its true coordinates —
 *
 *   map x = (lon − 13.55) / 0.625 − 1     map z = (49.55 − lat) / 0.325 − 1
 *
 * taken from the Czech and English Wikipedia coordinate records rather than
 * from memory. Two names on Švejk's list get no marker: Malčín and Sedlec are
 * hamlets of Vráž and Čížová, too small to have coordinates of their own, and
 * inventing a position for them would be worse than leaving the route to pass
 * through them unlabelled.
 *
 * TEXT: the Czech original on Wikizdroje (Czech Wikisource), which is public
 * domain — Hašek d. 1923. The English in the quotations is rendered plainly
 * from that Czech FOR THIS ATLAS and says so, because the translations people
 * know are not free: Paul Selver's is 1930 and Cecil Parrott's is 1973, and
 * neither is out of copyright.
 *
 * The music is original. Hašek's soldiers sing constantly and he names real
 * songs, but none of them is transcribed here.
 */
export const svejk: Story = {
  id: 'svejk',
  title: 'The Good Soldier Švejk',
  subtitle: 'All roads lead to České Budějovice',
  author: 'Jaroslav Hašek',
  region: 'Southern Bohemia',
  earth: { lon: 14.47, lat: 48.97, place: 'Southern Bohemia' },
  epoch: 'Novel · 1921–23 · set 1914–15',
  group: 'epic',
  intro:
    'A man of no fixed opinions is sent sixty kilometres by train and walks a ' +
    'hundred and fifty in the wrong direction instead, cheerfully, reporting ' +
    'humbly at every step. Press ▶ Play story to follow the budějovická ' +
    'anabáze exactly as Hašek lists it — out to Horažďovice, down to the ' +
    'Volyně country, and back to the same pond at Putim he had already been ' +
    'arrested beside once.',
  surfaceName: 'South Bohemia',
  ambient: {
    trees: 0.55,
    treeKind: 'conifer',
    treeColor: '#4e6d4a',
    birds: 6,
  },
  terrain: {
    music: {
      title: 'Marching Song for a Man Going the Wrong Way',
      credit: 'Original, written for this atlas',
      // Cheerful, and it keeps arriving back where it started.
      melody:
        'G4:2 G4:2 A4:2 B4:2 G4:4 r:2 ' +
        'B4:2 B4:2 C5:2 D5:2 B4:4 r:2 ' +
        'D5:2 C5:2 B4:2 A4:2 G4:4 G4:4 r:2',
      bass: 'G2:8 D3:8 G2:8 D3:8',
      tempo: 96,
      voice: 'horn',
      mood: 'epic',
    },
    seed: 'svejk-1', // unused: the heightmap takes precedence
    heightmap: svejkHeight,
    // There is no water on this map at all. South Bohemia here is a plateau
    // between 344 m and 900 m, and the byte range is pinned to that — see the
    // `svejk` preset. The ponds this country is famous for are each a few
    // hundred metres across and are far below what the DEM can hold.
    seaLevel: 0,
    // 91 km across at 49°N by 72 km down.
    aspect: 1.26,
    heightScale: 10,
    rivers: 3,
    biomes: [
      { maxHeight: 0.16, color: '#7d9a63', name: 'Pond country' },
      { maxHeight: 0.34, color: '#6f9257', name: 'Fields' },
      { maxHeight: 0.55, color: '#57804c', name: 'Wood' },
      { maxHeight: 0.78, color: '#7d8161', name: 'The Šumava foothills' },
      { maxHeight: 1.0, color: '#9c9b88', name: 'High ground' },
    ],
  },

  markers: [
    {
      id: 'tabor',
      name: 'Tábor',
      kind: 'city',
      at: { x: 0.772, z: -0.583 },
      description:
        'Where the anabasis starts, on a railway platform. Švejk is escorting ' +
        'himself south to his regiment, gets off to look for the lieutenant’s ' +
        'luggage, drinks the fare, and watches the train leave. He then sets ' +
        'out on foot — in principle towards Budějovice, which is south-east.',
    },
    {
      id: 'milevsko',
      name: 'Milevsko',
      kind: 'town',
      at: { x: 0.296, z: -0.695 },
      description:
        'West of Tábor, which is already the wrong way. Hašek notes it without ' +
        'comment: "no good soldier can be put off by a Milevsko from getting ' +
        'to České Budějovice eventually."',
    },
    {
      id: 'kvetov',
      name: 'Květov',
      kind: 'town',
      at: { x: 0.161, z: -0.617 },
      description:
        'By the time he reaches it he has run through every marching song he ' +
        'knows and has to start them again from the beginning.',
    },
    {
      id: 'vraz',
      name: 'Vráž',
      kind: 'town',
      at: { x: -0.074, z: -0.51 },
      description:
        'An old woman gives him bread and tells him he is going entirely the ' +
        'wrong way — keep on like this, she says, and you will end up in ' +
        'Klatovy. She also warns him off her own village, where the gendarmes ' +
        'watch like hawks. He thanks her and carries on.',
    },
    {
      id: 'cizova',
      name: 'Čížová',
      kind: 'town',
      at: { x: -0.131, z: -0.406 },
      description:
        'The furthest north-west he gets before turning down towards the ' +
        'Otava. An old man works out what he is doing and says the line the ' +
        'whole chapter turns on: from Tábor, and he goes first to Horažďovice ' +
        'and only then to Písek — why, the man is going round the world.',
    },
    {
      id: 'horazdovice',
      name: 'Horažďovice',
      kind: 'town',
      at: { x: -0.758, z: -0.295 },
      description:
        'The western end of the loop, and eighty kilometres from where he is ' +
        'supposed to be. Budějovice is behind him and to the left. He is in ' +
        'excellent spirits.',
    },
    {
      id: 'radomysl',
      name: 'Radomyšl',
      kind: 'town',
      at: { x: -0.392, z: -0.281 },
      description:
        'Where he sleeps in a haystack and is fed by a grandfather who takes ' +
        'him for a deserter, which by this point is a reasonable guess.',
    },
    {
      id: 'putim',
      name: 'Putim',
      kind: 'danger',
      at: { x: -0.089, z: -0.122 },
      description:
        'The joke of the chapter, and possibly of Czech literature. Švejk is ' +
        'arrested here by a sergeant-major who is certain he has caught a ' +
        'Russian spy and stays up all night writing it down. Švejk then walks ' +
        'on through four more villages and arrives back HERE — "a zas Putim", ' +
        'and Putim again — where the same station is waiting for him.',
    },
    {
      id: 'steken',
      name: 'Štěkeň',
      kind: 'town',
      at: { x: -0.271, z: -0.13 },
      description:
        'Between the two Putims, on the way out. He is by now walking with an ' +
        'escort part of the time and alone the rest, and it makes no ' +
        'difference to the route.',
    },
    {
      id: 'strakonice',
      name: 'Strakonice',
      kind: 'city',
      at: { x: -0.436, z: -0.112 },
      description:
        'A garrison town he passes straight through, on the Otava, and about ' +
        'as far from his regiment as this map allows.',
    },
    {
      id: 'volyne',
      name: 'Volyně',
      kind: 'town',
      at: { x: -0.462, z: 0.182 },
      description:
        'The southern turn of the loop. From here the route finally starts ' +
        'moving back east, which is not the same thing as moving towards ' +
        'Budějovice.',
    },
    {
      id: 'dub',
      name: 'Dub',
      kind: 'town',
      at: { x: -0.261, z: 0.359 },
      description:
        'The furthest south he gets under his own steam, in the country ' +
        'rising towards the Šumava.',
    },
    {
      id: 'vodnany',
      name: 'Vodňany',
      kind: 'town',
      at: { x: 0.0, z: 0.237 },
      description:
        'In the middle of the pond country, and only thirty-five kilometres ' +
        'from Budějovice. He does not go to Budějovice. He goes north.',
    },
    {
      id: 'protivin',
      name: 'Protivín',
      kind: 'town',
      at: { x: 0.068, z: 0.078 },
      description:
        'The last village before the route closes on itself. From here the ' +
        'road leads straight back to the one place in Bohemia where he has ' +
        'already been arrested.',
    },
    {
      id: 'pisek',
      name: 'Písek',
      kind: 'capital',
      at: { x: -0.044, z: -0.258 },
      description:
        'District headquarters, and the end of the walking. A captain who has ' +
        'read the Putim sergeant-major’s report on the Russian spy takes ' +
        'one look at Švejk, gives up, and puts him on a train — which is what ' +
        'the army could have done at Tábor, several days and a hundred and ' +
        'fifty kilometres ago.',
    },
    {
      id: 'budejovice',
      name: 'České Budějovice',
      kind: 'capital',
      at: { x: 0.48, z: 0.77 },
      description:
        'The destination. Sixty kilometres from Tábor by rail, and reached ' +
        'under escort at last — by which time the regiment has left for ' +
        'Hungary and the whole thing has to be done again in the other ' +
        'direction.',
    },
  ],

  routes: [
    {
      id: 'anabaze',
      name: 'The budějovická anabáze',
      color: '#e8b45c',
      style: 'solid',
      description:
        'Hašek’s own itinerary, in his own order, drawn without ' +
        'correction. It runs west when it should run south-east, loops the ' +
        'whole Otava country, and returns to Putim — which is the point.',
      points: [
        { x: 0.772, z: -0.583 },
        { x: 0.296, z: -0.695 },
        { x: 0.161, z: -0.617 },
        { x: -0.074, z: -0.51 },
        { x: -0.131, z: -0.406 },
        { x: -0.758, z: -0.295 },
        { x: -0.392, z: -0.281 },
        { x: -0.089, z: -0.122 },
        { x: -0.271, z: -0.13 },
        { x: -0.436, z: -0.112 },
        { x: -0.462, z: 0.182 },
        { x: -0.261, z: 0.359 },
        { x: 0.0, z: 0.237 },
        { x: 0.068, z: 0.078 },
        { x: -0.089, z: -0.122 },
      ],
    },
    {
      id: 'under-escort',
      name: 'Under escort, by train',
      color: '#8fb6d8',
      style: 'dashed',
      description:
        'Putim to Písek in custody, and Písek to Budějovice on the railway — ' +
        'the journey the army could have arranged at the start, and eventually ' +
        'does.',
      points: [
        { x: -0.089, z: -0.122 },
        { x: -0.044, z: -0.258 },
        { x: 0.2, z: 0.1 },
        { x: 0.38, z: 0.45 },
        { x: 0.48, z: 0.77 },
      ],
    },
    {
      id: 'the-direct-way',
      name: 'The way he was sent',
      color: '#b58fd0',
      style: 'dashed',
      description:
        'Tábor to Budějovice, sixty kilometres, by the railway he was already ' +
        'sitting on. Drawn for comparison; nobody in the book travels it.',
      points: [
        { x: 0.772, z: -0.583 },
        { x: 0.66, z: -0.28 },
        { x: 0.56, z: 0.2 },
        { x: 0.48, z: 0.77 },
      ],
    },
  ],

  regions: [
    { id: 'r-otava', name: 'THE OTAVA COUNTRY', at: { x: -0.35, z: -0.2 }, scale: 0.9 },
    { id: 'r-blata', name: 'THE POND COUNTRY', at: { x: 0.06, z: 0.3 }, scale: 0.85 },
    { id: 'r-sumava', name: 'TOWARDS THE ŠUMAVA', at: { x: -0.5, z: 0.45 }, scale: 0.85 },
  ],

  elements: [
    {
      id: 'papers',
      name: 'Švejk’s Papers',
      glyph: '📄',
      description:
        'He has none that satisfy anybody, which is what turns a walk into an ' +
        'anabasis: every gendarme who stops him has to decide for himself ' +
        'whether this is an idiot or a spy, and each one decides differently.',
      journey: [
        { marker: 'tabor', note: 'Left with the luggage, along with the fare.' },
        { marker: 'putim', sinceChapter: 4, note: 'Read all night by a man who wants a promotion.' },
        { marker: 'pisek', sinceChapter: 6, note: 'Read in ten seconds by a man who wants his lunch.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · The Anabasis',
      subtitle: 'Xenophon did it without a map too',
      chapters: [
        {
          id: 'i-1',
          title: 'All roads lead to Budějovice',
          narration:
            'The chapter opens with Xenophon marching across Asia Minor ' +
            'without a map, and the Goths doing the same, and Caesar’s ' +
            'legions deciding to go home to Rome by a different road for the ' +
            'sake of seeing more — which is where the saying comes from. Hašek ' +
            'then applies the principle to a soldier who has missed a train at ' +
            'Tábor.',
          quote: {
            text: 'In just the same way, all roads lead to České Budějovice.',
            original: 'Stejně vedou také všechny cesty do Českých Budějovic.',
            source: 'Book II, ch. 2 · rendered from the Czech for this atlas',
          },
          focus: { marker: 'tabor', distance: 34, pitch: 42 },
          reveal: {
            markers: ['tabor', 'budejovice', 'milevsko', 'kvetov'],
            routes: ['the-direct-way'],
            regions: ['r-otava'],
          },
          highlight: { markers: ['tabor'], routes: ['the-direct-way'] },
        },
        {
          id: 'i-2',
          title: 'West, which is wrong',
          narration:
            'Budějovice is south-east of Tábor. Švejk goes west, to Milevsko, ' +
            'then Květov, then Vráž, singing every marching song he knows and ' +
            'then singing them again. An old woman at Vráž feeds him and tells ' +
            'him that if he keeps on this way he will reach Klatovy, which is ' +
            'in the opposite corner of Bohemia. He thanks her sincerely.',
          focus: { marker: 'vraz', distance: 26, pitch: 40 },
          reveal: { markers: ['vraz', 'cizova'], routes: ['anabaze'] },
          highlight: { routes: ['anabaze'], markers: ['vraz'] },
        },
        {
          id: 'i-3',
          title: 'Going round the world',
          narration:
            'At Čížová an old man listens to the whole plan and delivers the ' +
            'verdict, to nobody, after Švejk has gone out into the dark. It is ' +
            'the most accurate piece of route analysis in the book.',
          quote: {
            text:
              'Says he’s off to Budějovice to his regiment. From Tábor.\n' +
              'And the rascal goes first to Horažďovice and only then to Písek.\n' +
              'Why, the man is going round the world.',
            original:
              'Jde prej do Budějovic k svýmu regimentu. Z Tábora.\n' +
              'A to jde, rošťák, napřed do Horažďovic a pak teprve na Písek.\n' +
              'Dyť von dělá cestu kolem světa.',
            source: 'Book II, ch. 2 · rendered from the Czech for this atlas',
          },
          focus: { marker: 'horazdovice', distance: 40, pitch: 44 },
          reveal: { markers: ['horazdovice', 'radomysl', 'strakonice', 'steken'] },
          highlight: { markers: ['cizova', 'horazdovice'] },
        },
        {
          id: 'i-4',
          title: 'Putim, the first time',
          narration:
            'A sergeant-major at Putim arrests him and sits up all night ' +
            'composing a report proving he has captured a Russian spy — the ' +
            'evidence being that no genuine soldier would walk in this ' +
            'direction. It is, on the facts available, not a bad argument.',
          focus: { marker: 'putim', distance: 24, pitch: 38 },
          reveal: { markers: ['putim'] },
          highlight: { markers: ['putim'] },
        },
        {
          id: 'i-5',
          title: 'And Putim again',
          narration:
            'Released, he continues: Štěkeň, Strakonice, Volyně, Dub, ' +
            'Vodňany — thirty-five kilometres from Budějovice at one point, ' +
            'and he turns north — Protivín, and then the itinerary Hašek ' +
            'writes out in full ends with three words that are the whole ' +
            'chapter: a zas Putim. And Putim again.',
          quote: {
            text:
              'Tábor, Milevsko, Květov, Vráž, Malčín, Čížová, Sedlec,\n' +
              'Horažďovice, Radomyšl, Putim, Štěkno, Strakonice, Volyně, Dub,\n' +
              'Vodňany, Protivín, Putim, Písek, Budějovice.',
            original: '— a zas Putim.',
            source: 'Švejk’s own itinerary, Book II, ch. 2',
          },
          focus: { marker: 'vodnany', distance: 34, pitch: 42 },
          reveal: { markers: ['volyne', 'dub', 'vodnany', 'protivin'], regions: ['r-blata', 'r-sumava'] },
          highlight: { markers: ['putim', 'vodnany'] },
        },
        {
          id: 'i-6',
          title: 'By train, under escort',
          narration:
            'At Písek a captain reads the Putim report about the Russian spy, ' +
            'looks at the spy, and puts him on the train to Budějovice with a ' +
            'guard — which is exactly the journey the army had arranged at ' +
            'Tábor before he got off it. He arrives to find the regiment has ' +
            'gone to Hungary.',
          focus: { marker: 'budejovice', distance: 40, pitch: 44 },
          reveal: { markers: ['pisek'], routes: ['under-escort'] },
          highlight: { markers: ['pisek', 'budejovice'], routes: ['under-escort'] },
        },
      ],
    },
  ],
}
