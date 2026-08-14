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
