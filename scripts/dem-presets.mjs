/**
 * The named DEM presets, shared by everything that builds elevation data.
 *
 * Split out of `build-heightmap.mjs` so the tile builder can read the same
 * definitions rather than keeping a second copy that would silently drift: a
 * detail tile has to be cut with EXACTLY the parameters its base map was cut
 * with, or its bytes mean different elevations and the two disagree wherever
 * they meet.
 *
 * `w`/`h` default to 256 (square) when omitted.
 *
 * `lakeMaxM`, when given, is the highest ground a lake polygon will be carved
 * into. The engine draws one water plane, so a lake only reads as water if it
 * is sunk to the waterline — which turns a lake that stands at 4,600 m into a
 * shaft through the map. See the note in `build-heightmap.mjs`.
 *
 * `minM`/`maxM`, when given, pin the metre range that maps onto 0..255 instead
 * of letting it fall out of whatever the sampled grid happened to contain. A
 * whole-map render and a small detail tile see different data and so observe
 * different extremes; without a pinned range the same elevation would come out
 * as a different byte in each.
 */
export const PRESETS = {
  estonia: {
    z: 7,
    bbox: { lonMin: 21.5, lonMax: 28.9, latMin: 57.3, latMax: 60.75 },
    lakes: true,
    out: '../src/assets/estonia-height.png',
  },
  latvia: {
    // Lāčplēsis country: Latvia entire, the Gulf of Riga, the eastern Baltic
    // out past Kurzeme (for the sea voyage), southern Estonia and Saaremaa
    // (where Lāčplēsis duels the giant Kalapuisis), and the Daugava as far
    // upriver as Krāslava. Latvia's high point is 312 m, so no cap is needed.
    z: 8,
    bbox: { lonMin: 19.2, lonMax: 28.8, latMin: 55.2, latMax: 58.6 },
    // Sized so a pixel is the same distance on the ground both ways: the box
    // is 9.6° of longitude at ~57°N (≈584 km) by 3.4° of latitude (≈376 km).
    w: 1024,
    h: 659,
    // Clip the deepest Baltic so the sea does not eat a fifth of the range,
    // and lift the land off the shoreline — see `landGamma` below. Without it
    // Rīga and Zemgale, which really are a dozen metres above the sea, render
    // underneath the water plane.
    floorM: -25,
    landGamma: 0.6,
    lakes: true,
    out: '../src/assets/latvia-height.png',
  },
  lucerne: {
    // Wilhelm Tell country: Lake Lucerne and the three founding cantons. Uri
    // in the south-east (Bürglen, Altdorf, Flüelen), Lake Uri with the Rütli
    // and the Tellsplatte, Schwyz over the Axen, Unterwalden west of the lake,
    // and Küssnacht with the Hohle Gasse in the north. Small — about 61 km by
    // 44 km — so this needs a much deeper zoom than the country-sized presets.
    z: 11,
    bbox: { lonMin: 8.15, lonMax: 8.95, latMin: 46.75, latMax: 47.15 },
    w: 1024,
    h: 748,
    // The lake sits at 434 m and the peaks run past 3,000. Cap the very top so
    // the valleys and the lake shore keep some dynamic range; this is the first
    // world in the atlas with real mountains rather than capped or flat ones.
    capM: 2800,
    // Natural Earth's lake polygons have nothing at this scale, so the water
    // is set by elevation instead: Vierwaldstättersee sits at 434 m and the
    // DEM records it as a flat plateau, so everything at or below 437 m is
    // lake. Without this the water Tell is rowed across renders as ground.
    seaM: 437,
    // A lake at 434 m in a range that runs to 2,800 occupies almost none of the
    // vertical, so the shore would be crushed against the waterline. The gamma
    // spreads the low ground back out — see `landGamma` below.
    landGamma: 0.5,
    out: '../src/assets/lucerne-height.png',
  },
  nibelungen: {
    // The Nibelungenlied's road: Xanten on the Lower Rhine in the north-west,
    // Worms and the Odenwald in the middle, then the whole Danube run east
    // through Passau, Pöchlarn and Vienna to Etzel's hall in Hungary. The poem
    // is a journey, so the box has to hold both rivers at once.
    z: 8,
    bbox: { lonMin: 5.8, lonMax: 19.5, latMin: 47.0, latMax: 52.2 },
    w: 1024,
    h: 599,
    // Clip the Alps along the southern edge. They are not in the story and at
    // full height they would take the whole range from two river valleys that
    // never rise above 300 m.
    capM: 1600,
    flatOceanM: -6,
    // Worms stands about 90 m up. That is comfortable, but the gamma still
    // helps the flood plains read as separate from the uplands around them.
    landGamma: 0.8,
    lakes: true,
    out: '../src/assets/nibelungen-height.png',
  },
  harz: {
    // Faust country: central Germany. Leipzig and Auerbachs Keller in the
    // east, the Harz and the Brocken in the middle (where Walpurgis Night is
    // held), Wittenberg north of them, and Knittlingen in the south-west,
    // where the historical Faust was born.
    z: 8,
    // Reaches the German Bight in the north, because Part II ends on a coast
    // Faust takes out of the sea — that has to be real water on the map.
    bbox: { lonMin: 6.5, lonMax: 15.0, latMin: 49.0, latMax: 54.0 },
    w: 1024,
    h: 966,
    // The Brocken is 1,141 m and is the roof of this story. Cap just above it
    // so the Bavarian Forest along the southern edge cannot out-rank it.
    capM: 1200,
    flatOceanM: -6,
    landGamma: 0.7,
    lakes: true,
    out: '../src/assets/harz-height.png',
  },
  flanders: {
    // Uilenspiegel country: Flanders, Brabant and the Zeeland estuaries, from
    // Dunkirk and Ypres in the south-west up to Brielle in the north, with the
    // Ardennes on the eastern edge. The book starts on land and ends at sea,
    // so the box has to hold the whole coast and the river mouths behind it.
    z: 9,
    bbox: { lonMin: 1.8, lonMax: 6.8, latMin: 49.6, latMax: 52.4 },
    w: 1024,
    h: 910,
    flatOceanM: -6,
    // Flanders is flatter than Latvia. Bruges stands about 8 m up and Damme
    // less; without the gamma the whole country renders as beach.
    landGamma: 0.5,
    lakes: true,
    out: '../src/assets/flanders-height.png',
  },
  karelia: {
    // Kalevala country. The poem's own geography is two places and a road:
    // Wainola/Kalevala in the south and Pohyola — Northland, Sariola — in the
    // far north, "the dark and dismal country". The box holds Finland, Karelia
    // and the White Sea, plus the Gulf of Bothnia and enough of Lapland and
    // Kola for the north to be genuinely far away.
    z: 7,
    bbox: { lonMin: 15.0, lonMax: 44.0, latMin: 59.5, latMax: 70.5 },
    w: 1024,
    h: 918,
    // The Scandes along the western edge are not in the poem; cap them so
    // Finland's lakes and coasts keep the dynamic range.
    capM: 900,
    flatOceanM: -6,
    landGamma: 0.6,
    lakes: true,
    out: '../src/assets/karelia-height.png',
  },
  norway: {
    // Peer Gynt country: southern Norway. Gudbrandsdalen and the Rondane in
    // the middle, Jotunheimen west of them, and the western fjord coast where
    // Act V comes home past Hallingskarvet and the Folgefonna.
    z: 8,
    bbox: { lonMin: 3.0, lonMax: 15.0, latMin: 58.0, latMax: 63.5 },
    w: 1024,
    h: 966,
    capM: 2000,
    flatOceanM: -6,
    landGamma: 0.75,
    lakes: true,
    out: '../src/assets/norway-height.png',
  },
  sweden: {
    // Nils Holgersson country: the whole of Sweden, because the book is a
    // school geography and the journey runs its entire length — Skåne in the
    // south to Kebnekaise in Lapland and back. Sweden is far taller than it is
    // wide, so this is the atlas's first world with an aspect BELOW 1.
    z: 7,
    bbox: { lonMin: 10.0, lonMax: 25.0, latMin: 55.0, latMax: 69.5 },
    w: 624,
    h: 1280,
    // Kebnekaise is 2,097 m and is where the goose leader comes from; cap just
    // below it so the mountain is the roof of the map.
    capM: 1800,
    flatOceanM: -6,
    landGamma: 0.6,
    lakes: true,
    out: '../src/assets/sweden-height.png',
  },
  france: {
    z: 6,
    bbox: { lonMin: -6, lonMax: 6, latMin: 42, latMax: 53 },
    // Cap the Alps so lowland France keeps dynamic range (nicer relief).
    capM: 1500,
    lakes: true,
    out: '../src/assets/france-height.png',
  },
  britain: {
    z: 6,
    bbox: { lonMin: -8, lonMax: 2, latMin: 50, latMax: 59 },
    capM: 1300,
    flatOceanM: -10,
    lakes: true,
    out: '../src/assets/britain-height.png',
  },
  mediterranean: {
    // The classical Mediterranean for the Eneida: Iberia and the Atlas in the
    // west, the Maghreb coast (Carthage) to the south, Italy + Sicily in the
    // centre, Greece and the Aegean/Asia Minor (Troy) to the east.
    z: 6,
    bbox: { lonMin: -6, lonMax: 30, latMin: 30, latMax: 46 },
    w: 1152,
    h: 512,
    // Cap the Alps/Atlas so the lowlands and coasts keep dynamic range.
    capM: 2400,
    // Flatten the sea to one even depth (like the world map) so the broad
    // Mediterranean reads as a single calm blue from straight down.
    flatOceanM: -6,
    out: '../src/assets/mediterranean-height.png',
  },
  ireland: {
    // Táin country. The raid runs from Cruachan in Connacht to the Cooley
    // peninsula in the north-east, so the box holds the whole island — 365 km
    // across by 467 km down, another world taller than it is wide.
    z: 8,
    bbox: { lonMin: -10.8, lonMax: -5.3, latMin: 51.3, latMax: 55.5 },
    w: 1024,
    h: 1310,
    // Carrauntoohil is 1,038 m and the Táin's hills are far lower; cap low so
    // the drumlins and the Gap of the North keep the dynamic range.
    capM: 1050,
    flatOceanM: -6,
    landGamma: 0.65,
    lakes: true,
    out: '../src/assets/ireland-height.png',
  },
  spain: {
    // The Cid's road: Bivar and Burgos in the north-west, down the Jalón to
    // Zaragoza, out to the Tévar pine wood and Barcelona, then south to
    // Valencia — and back inland to Corpes and the court at Toledo.
    z: 7,
    bbox: { lonMin: -6.0, lonMax: 3.0, latMin: 38.5, latMax: 43.5 },
    w: 1280,
    h: 941,
    // The Pyrenees and the Sistema Central both top 2,500 m; the meseta the
    // poem crosses sits near 800 m, so cap high and gamma the land up.
    capM: 2600,
    flatOceanM: -6,
    landGamma: 0.7,
    lakes: true,
    out: '../src/assets/spain-height.png',
  },
  aotearoa: {
    // Te Ika-a-Māui and Te Waka-a-Māui — the North Island and the South. The
    // whole point of this world is the shape of the two islands, so the box is
    // both of them end to end: 1,097 km across by 1,500 km down.
    z: 7,
    bbox: { lonMin: 166.0, lonMax: 179.0, latMin: -47.5, latMax: -34.0 },
    w: 1024,
    h: 1400,
    // Aoraki is 3,724 m, but the Southern Alps as a white wall would bury the
    // North Island's volcanoes, which are the ones the legends are about.
    capM: 2400,
    flatOceanM: -6,
    landGamma: 0.62,
    lakes: true,
    out: '../src/assets/aotearoa-height.png',
  },
  tasmania: {
    // Van Diemen's Land: Hobart and the Derwent, the Tasman peninsula and Port
    // Arthur in the south-east, and Macquarie Harbour on the wild west coast.
    z: 8,
    bbox: { lonMin: 144.4, lonMax: 148.6, latMin: -43.8, latMax: -40.4 },
    w: 1024,
    h: 1118,
    capM: 1600,
    flatOceanM: -6,
    landGamma: 0.65,
    lakes: true,
    out: '../src/assets/tasmania-height.png',
  },
  ottokar: {
    // Grillparzer's König Ottokars Glück und Ende: Bohemia and the lands
    // Ottokar held, and the Marchfeld where he lost them. Prague in the north,
    // Vienna and the Danube in the middle, the March and the battlefield in the
    // east, and the Alpine duchies — Styria, Carinthia, Carniola — running off
    // to the south, which is the whole point of the play's argument.
    z: 8,
    bbox: { lonMin: 11.8, lonMax: 18.4, latMin: 45.6, latMax: 51.0 },
    // Square-ish pixels on the ground: the box is 6.6° of longitude at ~48°N
    // (≈487 km) by 5.4° of latitude (≈599 km).
    w: 1024,
    h: 1260,
    // Entirely landlocked, so the waterline is not a sea: `floorM: 0` keeps all
    // land at or above zero and the carved lake polygons — the Neusiedler See,
    // Balaton, the Bohemian ponds — are the only water on the map.
    floorM: 0,
    lakes: true,
    // The Hohe Tauern reach 3,798 m inside this box, which would crush Bohemia
    // and the Marchfeld — where the play actually happens — into the bottom of
    // the range. Capped so the plain, the Danube and the Bohemian basin keep
    // their relief, with the gamma lifting the low ground clear of the lakes.
    capM: 2400,
    landGamma: 0.62,
    // Pinned, so `check-dem-scale` can compute the waterline instead of it
    // being copied out of a build log. -4 m is the depth lakes are carved to.
    minM: -4,
    maxM: 2400,
    out: '../src/assets/ottokar-height.png',
  },
  dante: {
    // Dante's own Italy — the country he walked as an exile, which is the only
    // part of the Commedia that is on the Earth at all. Florence in the middle,
    // the dark wood and the Casentino above it, Ravenna in the north-east where
    // he died and is buried, Rome in the south for the Jubilee of 1300, and the
    // Apennine spine that he crosses again and again between them.
    //
    // The box is deliberately central Italy rather than the whole peninsula:
    // Sicily and the Alps would push Tuscany down to a thumbnail, and nothing
    // in the poem's earthly story happens in either.
    z: 8,
    bbox: { lonMin: 9.4, lonMax: 14.6, latMin: 41.2, latMax: 45.4 },
    // ~430 km across at 43°N by ~467 km down.
    w: 1024,
    h: 1112,
    flatOceanM: -6,
    lakes: true,
    // The Apennines top out near 2,900 m at the Gran Sasso, on the eastern edge.
    // Capped just above so the Casentino hills and the Arno valley — where the
    // poem's own ground is — keep their relief instead of being flattened
    // against a peak nobody in the story climbs.
    capM: 2400,
    landGamma: 0.68,
    minM: -6,
    maxM: 2400,
    out: '../src/assets/dante-height.png',
  },
  svejk: {
    // Svejk's Budejovice anabasis: the corner of South Bohemia he walks round
    // in circles. The box holds every place he names, from Tabor in the
    // north-east — where he got off the train — to Ceske Budejovice in the
    // south-east, where he was trying to go, with Horazdovice out west marking
    // how far the wrong way he got.
    z: 10,
    bbox: { lonMin: 13.55, lonMax: 14.80, latMin: 48.90, latMax: 49.55 },
    // 91 km across at 49N by 72 km down.
    w: 1024,
    h: 810,
    // Landlocked, and gently rolling: the highest ground in the box is under
    // 900 m and most of it is the Blata, the pond country south of Pisek. The
    // waterline is the carved ponds, which are the landscape's whole character.
    floorM: 0,
    lakes: true,
    capM: 900,
    landGamma: 0.85,
    // Pinned to the ground that is actually there. South Bohemia is a plateau:
    // the lowest pixel in this box is 344 m, so a range starting at zero throws
    // away half the bytes and every biome band below the middle goes unused.
    minM: 330,
    maxM: 900,
    out: '../src/assets/svejk-height.png',
  },
  snowqueen: {
    // Gerda's road north. Andersen never names the town the two children live
    // in, but every place he DOES name is north of it — Lapland, Finland, and
    // the Snow Queen's "fixed abode ... on the Island called Spitzbergen" — so
    // the box runs from Denmark to Svalbard, which is 2,800 km of latitude and
    // makes this the tallest world in the atlas.
    z: 6,
    bbox: { lonMin: 4.0, lonMax: 34.0, latMin: 54.5, latMax: 80.0 },
    // ~1,300 km across at 67N by ~2,830 km down.
    w: 600,
    h: 1300,
    flatOceanM: -6,
    // Nothing in this story happens on a mountain; the Scandes are scenery it
    // is flown over. Capped so the Danish and Swedish lowlands where the first
    // half takes place keep their relief.
    capM: 1400,
    landGamma: 0.6,
    lakes: true,
    minM: -6,
    maxM: 1400,
    out: '../src/assets/snowqueen-height.png',
  },
  lusiads: {
    // Vasco da Gama's road to India, which is what Os Lusiadas is: Lisbon in
    // the north-west corner, the whole Atlantic down to the Cape, the East
    // African coast up to Malindi, and the Indian Ocean crossing to Calicut in
    // the north-east. Nothing above 45N or below 40S is in the poem.
    z: 5,
    bbox: { lonMin: -30.0, lonMax: 80.0, latMin: -40.0, latMax: 45.0 },
    // ~12,240 km across at the equator by ~9,450 km down.
    w: 1280,
    h: 988,
    flatOceanM: -6,
    // This map is mostly sea, and its business is coastlines. Cap well below
    // the Himalaya and the Alps, neither of which the fleet goes near, so the
    // African and Iberian coasts keep their range.
    capM: 2200,
    landGamma: 0.62,
    lakes: true,
    minM: -6,
    maxM: 2200,
    out: '../src/assets/lusiads-height.png',
  },
  siam: {
    // Khun Chang Khun Phaen country. The love triangle happens in Suphanburi
    // and Kanchanaburi, the trials and the jail in Ayutthaya, and the campaign
    // of the First Sequel goes north up the Ping past Kamphaeng Phet to Chiang
    // Mai — with Vientiane away east, because the princess the two kings
    // quarrel over is sent from there. So the box holds the whole central
    // plain, the northern hills, and the head of the Gulf the Chao Phraya
    // runs into.
    z: 8,
    bbox: { lonMin: 97.8, lonMax: 103.4, latMin: 12.8, latMax: 19.6 },
    // Square-ish pixels on the ground: the box is 5.6 degrees of longitude at
    // ~16.2N (~599 km) by 6.8 degrees of latitude (~754 km).
    w: 1024,
    h: 1290,
    // Doi Inthanon is 2,565 m and stands in the north-west corner of the box.
    // The story is not about it: Suphanburi, Ayutthaya and the whole Chao
    // Phraya plain sit between 2 and 30 m, and against a 2,565 m ceiling the
    // country the poem happens in is the bottom 1% of the range and renders as
    // one black sheet. Capped at 1,800 with a strong gamma so the plain, the
    // Khorat scarp and the northern valleys separate.
    capM: 1800,
    landGamma: 0.5,
    flatOceanM: -6,
    lakes: true,
    // Pinned so `check-dem-scale` can compute the waterline rather than trust
    // a number copied out of a build log.
    minM: -6,
    maxM: 1800,
    out: '../src/assets/siam-height.png',
  },
  meghaduta: {
    // The Cloud Messenger's route: Ramagiri (Ramtek, above Nagpur) north-west
    // over the Vindhyas to Amarkantak and the Narmada, across Malwa by Vidisha
    // and Ujjain to Dasapura, then up the Gangetic plain past Kurukshetra to
    // where the Ganges comes down at Kankhal, and on into the Himalaya to
    // Kailasa. The poem names them in order; the box is drawn round the list.
    z: 8,
    bbox: { lonMin: 73.5, lonMax: 83.0, latMin: 20.0, latMax: 32.5 },
    // Square-ish pixels: 9.5 degrees of longitude at ~26.3N (~949 km) by 12.5
    // degrees of latitude (~1,386 km).
    w: 1024,
    h: 1497,
    // Kailasa is 6,638 m and the box catches the high Himalaya behind it, while
    // the poem's own country — Malwa, the Narmada valley, the Gangetic plain —
    // runs 150 to 600 m. Capped and gammaed hard so the ground the cloud
    // actually crosses separates instead of being the bottom 8% of the range.
    capM: 5200,
    landGamma: 0.55,
    lakes: true,
    // Wholly inland: there is no sea anywhere in this box, so the waterline is
    // the floor rather than a coast. See the story's `seaLevel` note.
    minM: 0,
    maxM: 5200,
    out: '../src/assets/meghaduta-height.png',
  },
  ramayana: {
    // The exile route, end to end: Ayodhya on the Sarayu, south-west through
    // Prayag and Chitrakuta into the Dandaka forest, Panchavati on the Godavari
    // at Nashik, Kishkindha on the Tungabhadra at Hampi, and down to the strait
    // at Rameswaram with Lanka beyond it. Mithila is in the east for the first
    // book.
    z: 7,
    bbox: { lonMin: 71.5, lonMax: 87.0, latMin: 5.5, latMax: 28.0 },
    // 15.5 degrees of longitude at ~16.8N (~1,650 km) by 22.5 degrees of
    // latitude (~2,495 km).
    w: 1024,
    h: 1548,
    // The northern edge clips the Himalaya, which is nowhere in this story and
    // would otherwise take the whole range: capped at 2,400 so the Western
    // Ghats, the Deccan and the Vindhyas — the country the walk actually
    // crosses — get the top of the scale instead.
    capM: 2400,
    landGamma: 0.6,
    flatOceanM: -8,
    lakes: true,
    minM: -8,
    maxM: 2400,
    out: '../src/assets/ramayana-height.png',
  },
  klondike: {
    // The stampede route, end to end: tidewater at Skagway and Dyea, over the
    // Chilkoot to Lake Bennett, and then the whole Yukon down past Lake
    // Laberge, Five Finger Rapids and Fort Selkirk to Dawson — and on to
    // Fortymile, Circle City and Fort Yukon, which are the places The Call of
    // the Wild and White Fang name below the goldfields.
    z: 7,
    bbox: { lonMin: -148, lonMax: -132, latMin: 58.8, latMax: 67.2 },
    // 16 degrees of longitude at ~63N is only 809 km — this far north the
    // meridians have closed right up — against 932 km of latitude.
    w: 1024,
    h: 1180,
    // The Coast Mountains behind Skagway top 2,000 m and the Chilkoot summit is
    // 1,067; the interior plateau the river crosses runs 300 to 800. Capped at
    // 2,200 so the pass reads as the wall it was without flattening the plateau
    // into one tone.
    capM: 2200,
    landGamma: 0.6,
    // The Lynn Canal reaches Skagway, so this box has real tidewater in its
    // southern corner — the only salt water in it, and where every stampeder
    // started.
    flatOceanM: -20,
    lakes: true,
    minM: -20,
    maxM: 2200,
    out: '../src/assets/klondike-height.png',
  },
  luzon: {
    // Rizal country. The two novels share one small stage: Manila — Intramuros,
    // Binondo, the Escolta, and Bagumbayan where the executions happen — the
    // Pasig running east out of it, and Laguna de Bay at the other end of the
    // river, with Calamba on its southern shore under Mount Makiling. San Diego
    // is invented, and every reader has always placed it at Calamba, which was
    // Rizal's own town and whose land dispute with the friars is the Ibarra
    // family's dispute. The box reaches west to Cavite and Bataan for the bay
    // both novels arrive across, and east over the Sierra Madre to the Pacific,
    // because El Filibusterismo ends in a house on that coast.
    z: 10,
    bbox: { lonMin: 119.8, lonMax: 122.4, latMin: 13.2, latMax: 15.4 },
    // Square-ish pixels on the ground: 2.6 degrees of longitude at ~14.3N
    // (~281 km) by 2.2 degrees of latitude (~245 km).
    w: 1024,
    h: 894,
    // Banahaw is 2,158 m in the south-east corner and is in neither novel.
    // Makiling (1,090 m) is the mountain that matters — the tulisanes are in
    // it, and Rizal's own country grew up on its slope — so cap just above it
    // and let Banahaw and the Sierra Madre saturate. Everything the books
    // actually happen in stands between 0 and 30 m.
    capM: 1600,
    landGamma: 0.5,
    // The Pacific shelf drops past 4,000 m a few tens of kilometres off the
    // Sierra Madre coast, which would spend a third of the range on water
    // nobody looks at.
    flatOceanM: -15,
    // Laguna de Bay is the largest lake in the country and the middle of this
    // map; Taal is the other one. Both come from the lake polygons — a DEM
    // reads them as flat land at a few metres.
    lakes: true,
    minM: -15,
    maxM: 1600,
    out: '../src/assets/luzon-height.png',
  },
  xiyou: {
    // The pilgrim road, as the record has it and as the novel embroiders it:
    // Chang'an on the Wei, west through the Hexi Corridor to Dunhuang and the
    // Jade Gate, round the Taklamakan, over the Tian Shan past Issyk-Kul to
    // Samarkand, south over the Hindu Kush through Bamiyan and Gandhara, and
    // down the Ganges to Nalanda. It is four thousand kilometres each way and
    // the box has to hold all of it, so this is a continental map rather than
    // a country one.
    z: 6,
    // Two degrees further west than the places need, so Samarkand and the Iron
    // Gates are not standing on the frame.
    bbox: { lonMin: 64.0, lonMax: 112.0, latMin: 21.5, latMax: 46.0 },
    // 48 degrees of longitude at ~33.75N (~4,442 km) by 24.5 of latitude
    // (~2,727 km).
    w: 1536,
    h: 943,
    // Tibet fills the middle of this box at 4,500 m and the pilgrim goes round
    // it — that detour IS the Silk Road, and the map should show why. Capped at
    // 4,500 so the plateau saturates into the slab it is, while the corridor,
    // the Tarim basin and the Gangetic plain keep their own range.
    capM: 4500,
    landGamma: 0.55,
    // The head of the Bay of Bengal and the Indus mouth are the only salt
    // water in the box, both along the southern edge.
    flatOceanM: -10,
    // Balkhash and Aydar Kol are near enough to sea level to sink to the
    // waterline and read as lakes. Everything else in this box is not: Issyk-Kul
    // stands at 1,600 m and Nam Co, Siling Co, Tangra Yumco and Yamzho Yumco at
    // about 4,600 on the plateau, and carved they came out as six black pits
    // punched through Tibet. Above the limit the DEM's own flat pan is kept.
    lakes: true,
    lakeMaxM: 400,
    minM: -10,
    maxM: 4500,
    out: '../src/assets/xiyou-height.png',
  },
  kieu: {
    // Two countries, because this poem needs both. Vietnamese in every line and
    // Chinese in every scene: Nguyen Du's own country in the south — Thang Long
    // and the Red River delta, Tien Dien in Ha Tinh where he grew up — and in
    // the north and east the Ming China the tale is set in: Beijing, Lam Truy
    // (Linzi in Shandong), Vo Tich (Wuxi), Hang Chau (Hangzhou) and the Tien
    // Duong, which is the Qiantang. The 1813 embassy road from Thang Long to
    // Beijing runs the length of the map, and Nguyen Du rode it.
    z: 7,
    // East to 124.5 for Lieu Duong — Liaoyang in Liaoning, at 123.2E — which
    // is where Kim Trong is called away to bury his uncle, and therefore the
    // reason the betrothal is not there to protect her.
    bbox: { lonMin: 103.5, lonMax: 124.5, latMin: 17.8, latMax: 42.6 },
    // 21 degrees of longitude at ~30.2N (~2,020 km) by 24.8 of latitude
    // (~2,761 km) — taller than it is wide.
    w: 1000,
    h: 1367,
    // Every place in this poem is lowland: Beijing 44 m, Linzi 30, Wuxi 5,
    // Hangzhou 10, Hanoi 10. The relief in the box is the frame around them —
    // the western Sichuan edge, the Qinling, the Taihang, and Fansipan above
    // the Red River. Capped so those read as the walls of the corridor without
    // crushing four deltas into one tone.
    capM: 2600,
    landGamma: 0.55,
    // The Bohai, the Yellow Sea, the East China Sea and the Gulf of Tonkin.
    flatOceanM: -20,
    // The elevation data does not know where an estuary is: sampled at z10 it
    // reads +8 to +11 m the whole way across the Qiantang below Hangzhou, and
    // this map shipped once with fifty-five kilometres of Hangzhou Bay drawn as
    // farmland — which is also why the Tiền Đường could not be drawn. Below
    // 20 m the GSHHG shoreline overrules the DEM; above it nothing changes, so
    // real ground is never traded for a generalised outline.
    coastM: 20,
    // Tai Hu, Hongze, Poyang, Dongting, Chao Hu and Gaoyou — the lakes of the
    // Yangtze and Huai plains, all within 32 m of the sea, so almost nothing
    // here is above the limit. Measured, it drops 117 pixels: the sliver of the
    // Danjiangkou reservoir at 484 m that falls inside this box. Set anyway,
    // because 117 pixels of shaft is still 117 pixels of shaft. (On the Journey
    // to the West map the same rule saves 4,551.)
    lakes: true,
    lakeMaxM: 200,
    minM: -20,
    maxM: 2600,
    out: '../src/assets/kieu-height.png',
  },
  world: {
    // The z5 source is 8192 px around the world (~4.9 km/px). Sampling that
    // into 1536 threw away four fifths of it and left ~26 km per pixel, which
    // is why coastlines and small seas came out as blobs. 3072x1536 keeps
    // ~13 km/px — Italy, Denmark, the Black Sea and the Gulf all read as
    // themselves — for a PNG that is still a couple of megabytes.
    z: 5,
    bbox: { lonMin: -180, lonMax: 180, latMin: -62, latMax: 78 },
    w: 3072,
    h: 1536,
    capM: 3500,
    // Flatten ALL ocean to one shallow depth so the sea reads as a single
    // even colour (the biome shader darkens by depth, and the low-res DEM's
    // real bathymetry would otherwise blotch the sea seen from straight down).
    flatOceanM: -6,
    // Pin the metre range that maps onto 0..255 rather than reading it off the
    // sampled grid, so a detail tile cut later means the same elevations as
    // this map does. These are the values the whole-Earth render observed
    // anyway — every byte from 0 to 255 appears in the committed PNG, which is
    // only possible if the extremes were exactly the flattened ocean and the
    // cap — so pinning them changes nothing about the map that ships today.
    minM: -6,
    maxM: 3500,
    out: '../src/assets/world-height.png',
  },
}
