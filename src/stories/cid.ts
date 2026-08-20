import type { Story } from '../types'
import spainHeight from '../assets/spain-height.png'

/**
 * El Cantar de mio Cid — the Spanish national epic, composed around 1200 and
 * surviving in a single manuscript copied by Per Abbat in 1207. This world was
 * read out of R. Selden Rose and Leonard Bacon's 1919 verse translation, *The
 * Lay of the Cid* (Project Gutenberg #6088), cantar by cantar.
 *
 * The Cid is the most literally mappable epic in this atlas. It is a poem about
 * a man riding away from home and working his way back into favour, and it
 * names its stages like an itinerary: out of Bivar past Burgos, over the Duero
 * at Navas de Palos, through the hills of Miedes with Atienza on the right,
 * down onto the Henares to take Castejón, up into the Taranz plain, between
 * Fariza and Cetina, past Bubierca and Ateca to Alcocer, down the Jalón, on
 * past Monreal and Teruel to the pine wood of Tévar — and then south to
 * Valencia. The third cantar walks it in reverse to the oak-wood of Corpes.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon + 6.0) / 4.5 − 1      map z = (43.5 − lat) / 2.5 − 1
 *
 * Every place here is a real one you can still drive to. The narration
 * paraphrases the poem and quotes no translation.
 */
export const cid: Story = {
  id: 'cid',
  title: 'The Poem of the Cid',
  subtitle: 'Born in a good hour, and banished in it',
  author: 'Anonymous · trans. Rose & Bacon',
  region: 'Castile, Aragon & Valencia',
  earth: { lon: -3.7, lat: 42.34, place: 'Burgos, Castile' },
  epoch: 'Castilian epic · c. 1200',
  group: 'epic',
  intro:
    'A man rides out of his own gate with the doors hanging open behind him ' +
    'and nine days to leave the kingdom. Press ▶ Play story to follow the ' +
    'whole road: the exile east down the Jalón taking towns to feed his men, ' +
    'the taking of Valencia, the two sons-in-law who turn out to be cowards, ' +
    'and a court at Toledo where the case is argued out in front of the king ' +
    'who banished him.',
  surfaceName: 'Spain',
  ambient: {
    trees: 0.32,
    treeKind: 'broadleaf',
    treeColor: '#6a7f4a',
    birds: 8,
    fish: 2,
  },
  terrain: {
    music: {
      // Written to the poem's own metre — long assonanced lines with a caesura,
      // sung to a narrow reciting formula that returns to the same note, the
      // way a juglar would carry a few thousand lines. Original: no medieval
      // melody survives for the Cantar, and none was transcribed here.
      title: 'Juglar’s recitation',
      credit: 'After the cantar de gesta metre · original',
      melody:
        'A3:2 A3:1 C4:1 D4:2 C4:1 A3:2 G3:1 A3:3 ' +
        'A3:1 C4:1 D4:1 E4:2 D4:1 C4:2 A3:3 r:1 ' +
        'E4:2 E4:1 D4:1 C4:2 D4:1 E4:2 F4:1 E4:3 ' +
        'D4:1 C4:1 A3:2 G3:1 A3:4 r:2',
      bass: 'A2:8 A2:8 D3:8 A2:8',
      tempo: 66,
      voice: 'harp',
      mood: 'epic',
    },
    seed: 'cid-1', // unused: the heightmap takes precedence
    heightmap: spainHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0023,
    // 756 km across by 555 km down.
    aspect: 1.361,
    // The meseta the poem crosses sits near 800 m and the Pyrenees and Sistema
    // Central both top 2,500 m; capped at 2,600 with landGamma 0.7 so the
    // plateau reads as high ground rather than as one flat sheet.
    // The bbox clips the Pyrenees mid-slope along the northern edge, and at 15
    // they came out as a row of white teeth across the top of a map whose
    // subject is a road over the meseta. 11 keeps the sierras readable without
    // the wall.
    heightScale: 11,
    rivers: 8,
    // The Tagus, drawn from its real course. Same reason as the Elbe on the
    // Faust map: at roughly a kilometre per pixel this DEM cannot hold a river,
    // and the courses traced downhill from it are not the Tagus. The poem's
    // reconciliation happens on this bank, so the bank has to be here.
    //
    // Source: Natural Earth 10m river centrelines (public domain), via
    // `scripts/build-river.mjs spain Tajo` — it is filed under its Spanish
    // name. It runs from the Sierra de Albarracin west past Toledo and off the
    // western edge of the map, on its way to Lisbon and a sea this world does
    // not reach.
    namedRivers: [
      {
        name: 'The Tagus',
        marker: 'tagus',
        points: [
          { x: -0.0356, z: 0.1777 }, { x: -0.0286, z: 0.1453 }, { x: -0.0352, z: 0.1146 },
          { x: -0.0463, z: 0.0872 }, { x: -0.0697, z: 0.0774 }, { x: -0.0887, z: 0.0577 },
          { x: -0.1213, z: 0.0696 }, { x: -0.1497, z: 0.0756 }, { x: -0.1803, z: 0.0780 },
          { x: -0.1970, z: 0.0960 }, { x: -0.2190, z: 0.1082 }, { x: -0.2426, z: 0.1127 },
          { x: -0.2584, z: 0.1361 }, { x: -0.2689, z: 0.1662 }, { x: -0.2802, z: 0.1914 },
          { x: -0.2899, z: 0.2177 }, { x: -0.2958, z: 0.2484 }, { x: -0.3098, z: 0.2719 },
          { x: -0.3256, z: 0.2943 }, { x: -0.3416, z: 0.3238 }, { x: -0.3611, z: 0.3448 },
          { x: -0.3840, z: 0.3689 }, { x: -0.4066, z: 0.3809 }, { x: -0.4539, z: 0.3801 },
          { x: -0.4795, z: 0.3866 }, { x: -0.4963, z: 0.4084 }, { x: -0.5229, z: 0.4249 },
          { x: -0.5485, z: 0.4446 }, { x: -0.5785, z: 0.4439 }, { x: -0.6002, z: 0.4492 },
          { x: -0.6245, z: 0.4568 }, { x: -0.6503, z: 0.4568 }, { x: -0.6679, z: 0.4398 },
          { x: -0.6921, z: 0.4218 }, { x: -0.7166, z: 0.4056 }, { x: -0.7387, z: 0.4131 },
          { x: -0.7614, z: 0.4439 }, { x: -0.7783, z: 0.4759 }, { x: -0.8004, z: 0.4813 },
          { x: -0.8259, z: 0.4752 }, { x: -0.8465, z: 0.4810 }, { x: -0.8648, z: 0.4662 },
          { x: -0.8902, z: 0.4668 }, { x: -0.9106, z: 0.4786 }, { x: -0.9401, z: 0.4806 },
          { x: -0.9610, z: 0.4811 }, { x: -0.9868, z: 0.4652 }, { x: -0.9990, z: 0.4593 },
        ],
      },
    ],
    biomes: [
      { maxHeight: 0.0023, color: '#26526c', name: 'The sea' },
      { maxHeight: 0.04, color: '#cdc7a0', name: 'The coast' },
      { maxHeight: 0.15, color: '#9aa860', name: 'Huerta & river plain' },
      { maxHeight: 0.34, color: '#8a8f55', name: 'Campiña' },
      { maxHeight: 0.55, color: '#a09a6c', name: 'The meseta' },
      { maxHeight: 0.78, color: '#9c8f78', name: 'Sierra' },
      { maxHeight: 1.0, color: '#e4e2dc', name: 'The high sierras' },
    ],
  },

  markers: [
    {
      id: 'bivar',
      name: 'Bivar',
      kind: 'town',
      at: { x: -0.487, z: -0.575 },
      description:
        'Where the poem starts, on the worst morning of his life. He turns in ' +
        'the saddle and looks back at his own house: the gate standing open, ' +
        'the doors off their hinges, no cloak on the pegs, no hawk on the ' +
        'perch. Then he thanks God and says his enemies have done this — and ' +
        'rides. Vivar del Cid, north of Burgos.',
    },
    {
      id: 'burgos',
      name: 'Burgos',
      kind: 'city',
      at: { x: -0.489, z: -0.537 },
      description:
        'Sixty pennons ride in and the whole town comes to the windows to ' +
        'watch, weeping, and says the line the poem is famous for: God, what a ' +
        'good vassal, if only he had a good lord. The king’s letter arrived ' +
        'last night — nobody may sell him so much as bread, on pain of losing ' +
        'their property and their eyes.',
    },
    {
      id: 'the-girl',
      name: 'The Girl of Nine',
      kind: 'landmark',
      at: { x: -0.492, z: -0.533 },
      description:
        'He knocks on a barred door with his foot and a nine-year-old comes ' +
        'out to explain, very steadily, that the order is sealed, that they ' +
        'would lose their house and their eyes, and that he gains nothing by ' +
        'their ruin — so please go. Then she goes back inside. It is the best ' +
        'speech in the poem and it is given to a child.',
    },
    {
      id: 'cardena',
      name: 'San Pedro de Cardeña',
      kind: 'ruin',
      at: { x: -0.464, z: -0.516 },
      description:
        'The monastery where he leaves Ximena and their two daughters with ' +
        'the abbot and money to keep them. The parting is written as a nail ' +
        'being pulled out of flesh. He has nine days to be out of Castile.',
    },
    {
      id: 'duero',
      name: 'The Crossing of the Duero',
      kind: 'landmark',
      at: { x: -0.356, z: -0.220 },
      description:
        'Past Alcubilla, the last mark of Castile, and over the Duero at Navas ' +
        'de Palos. The poem counts the frontier crossings carefully, because ' +
        'the whole question of the first cantar is whether he is inside the ' +
        'law or outside it.',
    },
    {
      id: 'miedes',
      name: 'The Hills of Miedes',
      kind: 'landmark',
      at: { x: -0.311, z: -0.120 },
      description:
        'A night camp in the mountains with the towers of Moorish Atienza on ' +
        'the right hand. He musters his men here and counts three hundred ' +
        'lances with pennons, which is what he has in the world.',
    },
    {
      id: 'atienza',
      name: 'Atienza',
      kind: 'city',
      at: { x: -0.305, z: -0.078 },
      description:
        'A crag with Moorish towers on it, passed on the right going out and ' +
        'on the left coming back — the poem uses it twice as a landmark, ' +
        'which is one of the small proofs that whoever composed it knew this ' +
        'road personally.',
    },
    {
      id: 'castejon',
      name: 'Castejón',
      kind: 'battle',
      at: { x: -0.356, z: 0.120 },
      description:
        'The first prize: a town on the Henares taken at dawn by hiding a ' +
        'force outside and letting the gates open normally. While he holds ' +
        'the town, Minaya rides the country as far as Guadalajara and Alcalá ' +
        'and comes back loaded. Then he sells it back rather than hold ' +
        'ground he cannot defend — the poem is unusually interested in ' +
        'logistics.',
    },
    {
      id: 'guadalajara',
      name: 'Guadalajara & Alcalá',
      kind: 'town',
      at: { x: -0.370, z: 0.147 },
      description:
        'How far Minaya’s raiding banner reached down the Henares before ' +
        'turning back with the herds. The poem names the limit exactly, the ' +
        'way it names everything.',
    },
    {
      id: 'taranz',
      name: 'The Plain of Taranz',
      kind: 'landmark',
      at: { x: -0.200, z: -0.040 },
      description:
        'Up out of the Henares and into the open, marching between Fariza and ' +
        'Cetina to keep clear of both. He is moving east into the country of ' +
        'the Moorish king of Zaragoza, which is where an exile with three ' +
        'hundred lances can make a living.',
    },
    {
      id: 'ateca',
      name: 'Bubierca & Ateca',
      kind: 'town',
      at: { x: -0.066, z: -0.132 },
      description:
        'The towns he marches past on the way down the Jalón valley, each ' +
        'named in the order you would actually pass them. This stretch of the ' +
        'poem is a road-book.',
    },
    {
      id: 'alcocer',
      name: 'Alcocer',
      kind: 'capital',
      at: { x: -0.057, z: -0.127 },
      description:
        'He camps on a round hill by the river where nobody can cut his water ' +
        'and settles in. When the town will not fall, he strikes camp and ' +
        'marches away down the valley with his banner up — and the moment ' +
        'Alcocer empties itself to chase him, he turns round and rides in ' +
        'through the open gate.',
    },
    {
      id: 'terrer',
      name: 'Terrer & Teca',
      kind: 'town',
      at: { x: -0.053, z: -0.132 },
      description:
        'The neighbours, who are appalled, and who send word to the king of ' +
        'Valencia that a Castilian has moved into the valley and is levying ' +
        'tribute on everybody in it.',
    },
    {
      id: 'calatayud',
      name: 'Calatayud',
      kind: 'city',
      at: { x: -0.032, z: -0.141 },
      description:
        'The finest town of the three, and the one the poem uses to measure ' +
        'the alarm. Fáriz and Galve come with three thousand men to put the ' +
        'Cid out of Alcocer; he beats them in the field and the chase runs as ' +
        'far as these walls.',
    },
    {
      id: 'jalon',
      name: 'The Jalón',
      kind: 'landmark',
      at: { x: 0.000, z: -0.180 },
      description:
        'The river the whole first cantar runs along. He sells Alcocer for ' +
        'three thousand marks — and the poem notes, drily, that the Moors he ' +
        'sold it to were sorry to see him go, because he had governed it ' +
        'well.',
    },
    {
      id: 'monreal',
      name: 'The Hill of Monreal',
      kind: 'landmark',
      at: { x: 0.034, z: 0.084 },
      description:
        'The next camp, from which he levies Molina on one side and forces ' +
        'Teruel on the other. He is now running a small state with no king ' +
        'and no territory, purely on reputation.',
    },
    {
      id: 'molina',
      name: 'Molina',
      kind: 'town',
      at: { x: -0.086, z: 0.062 },
      description:
        'Held by Abengalvón, a Moorish lord who becomes the Cid’s friend and ' +
        'stays loyal to him longer than his own sons-in-law do — he escorts ' +
        'the women, gives gifts, and is repaid with a plot on his life.',
    },
    {
      id: 'tevar',
      name: 'The Pine Wood of Tévar',
      kind: 'battle',
      at: { x: 0.133, z: 0.120 },
      description:
        'Past Teruel, where he pitches his tents and lays tribute on ' +
        'Zaragoza. The Count of Barcelona comes after him here with a large ' +
        'army and a large grievance, is beaten, and then refuses to eat for ' +
        'three days out of humiliation until the Cid talks him into it and ' +
        'lets him go. The sword Colada is won here.',
    },
    {
      id: 'zaragoza',
      name: 'Zaragoza',
      kind: 'city',
      at: { x: 0.138, z: -0.262 },
      description:
        'The Moorish kingdom whose protection makes the exile survivable, and ' +
        'which pays him tribute rather than fight him. The poem is entirely ' +
        'unembarrassed about a Christian hero working the Muslim taifa system ' +
        'for a living, because that is what happened.',
    },
    {
      id: 'alcaniz',
      name: 'Alcañiz',
      kind: 'landmark',
      at: { x: 0.304, z: -0.020 },
      description:
        'The meadows he lays waste on the way east, to the alarm of Huesca ' +
        'and Montalbán. He is building the reputation that will let him take ' +
        'a city.',
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      kind: 'city',
      at: { x: 0.816, z: -0.154 },
      description:
        'Count Ramón Berenguer’s seat, at the far eastern edge of the map. He ' +
        'rides out from here to Tévar to teach the exile a lesson and goes ' +
        'home without his sword.',
    },
    {
      id: 'jerica',
      name: 'Jérica & Almenar',
      kind: 'town',
      at: { x: 0.206, z: 0.436 },
      description:
        'The southern campaign opens: town after town along the Palancia ' +
        'taken and held, and this time not sold back. He is not raiding any ' +
        'more; he is annexing.',
    },
    {
      id: 'onda',
      name: 'Onda',
      kind: 'town',
      at: { x: 0.276, z: 0.415 },
      description:
        'One of the string of places the poem lists as his before Valencia — ' +
        'and lists again later, in Minaya’s report to the king, as proof of ' +
        'what an exile has managed without help.',
    },
    {
      id: 'murviedro',
      name: 'Murviedro',
      kind: 'city',
      at: { x: 0.272, z: 0.528 },
      description:
        'Sagunto: the fortress on the hill twenty miles up the coast from ' +
        'Valencia, and the base the siege is run from. Valencia sends an army ' +
        'to lift it and loses.',
    },
    {
      id: 'cebolla',
      name: 'Cebolla',
      kind: 'landmark',
      at: { x: 0.264, z: 0.566 },
      description:
        'El Puig, taken and fortified on the road in. From here the city can ' +
        'be watched and nothing can reach it by land.',
    },
    {
      id: 'valencia',
      name: 'Valencia',
      kind: 'capital',
      at: { x: 0.250, z: 0.612 },
      description:
        'The prize, named 109 times. He besieges it, takes it, and then does ' +
        'the thing the poem cares about most — he sends for Ximena and his ' +
        'daughters, sets them on the highest tower to look at what he has ' +
        'won, and installs a bishop. An exile with no lands has become a lord ' +
        'with a capital.',
    },
    {
      id: 'cullera',
      name: 'Cullera & Játiva',
      kind: 'town',
      at: { x: 0.278, z: 0.734 },
      description:
        'The raiding south of the city, down to Játiva and Dénia, that ' +
        'isolates Valencia before the siege — and later the line the beaten ' +
        'army of Búcar is chased along.',
    },
    {
      id: 'penacadell',
      name: 'Peñacadell',
      kind: 'peak',
      at: { x: 0.244, z: 0.864 },
      description:
        'The pass south of the city, taken so that nothing comes up through ' +
        'it. The poem notes that its capture was grief to everyone living ' +
        'between there and the sea, which is a fair description of a siege ' +
        'from the other side.',
    },
    {
      id: 'medina',
      name: 'Medinaceli',
      kind: 'town',
      at: { x: -0.208, z: -0.070 },
      description:
        'The meeting point on the road east: Ximena and the daughters are ' +
        'escorted here from Cardeña under the king’s safe-conduct, and taken ' +
        'on from here to Valencia by way of Molina and the Jalón.',
    },
    {
      id: 'carrion',
      name: 'Carrión',
      kind: 'city',
      at: { x: -0.690, z: -0.535 },
      description:
        'The lands of the Infantes, and the most-named place in the poem — ' +
        '148 times, almost always as "the Heirs of Carrión". They marry his ' +
        'daughters for the money, run from a lion and from a battle, and are ' +
        'laughed at for both.',
    },
    {
      id: 'corpes',
      name: 'The Oak-Wood of Corpes',
      kind: 'danger',
      at: { x: -0.384, z: -0.116 },
      description:
        'The worst thing in the poem. The Infantes take their wives out of ' +
        'Valencia towards Carrión, send the escort ahead, strip the two women ' +
        'in the wood, beat them with saddle-girths and spurs, and ride off ' +
        'leaving them for dead — as a considered insult to their father’s ' +
        'birth. Felez Muñoz turns back and finds them.',
    },
    {
      id: 'gormaz',
      name: 'San Esteban & Gormaz',
      kind: 'town',
      at: { x: -0.378, z: -0.248 },
      description:
        'The first place to help: the men of San Esteban ride out to the ' +
        'wood, bring the daughters in, and look after them until Minaya ' +
        'arrives. The Cid remembers it, and the poem makes a point of saying ' +
        'so.',
    },
    {
      id: 'toledo',
      name: 'The Court at Toledo',
      kind: 'capital',
      at: { x: -0.561, z: 0.455 },
      description:
        'Where it is settled — not by a duel first, but by law. The king ' +
        'convenes his court, the Cid asks for his swords back, then for his ' +
        'money back, and only then for satisfaction. The Infantes lose every ' +
        'argument in order, in public, before anyone draws.',
    },
    {
      id: 'tagus',
      name: 'The Tagus',
      kind: 'landmark',
      at: { x: -0.556, z: 0.444 },
      description:
        'Where he meets the king who exiled him — the reconciliation happens ' +
        'on a riverbank, with the Cid refusing to cross until he is invited, ' +
        'and the king insisting he stop kneeling in the grass.',
    },
    {
      id: 'the-duels',
      name: 'The Field at Carrión',
      kind: 'battle',
      at: { x: -0.660, z: -0.500 },
      description:
        'Three duels, three weeks later, on the Infantes’ own ground with the ' +
        'king presiding so that nothing can be arranged. Pero Bermúdez, ' +
        'Martín Antolínez and Muño Gustioz win all three, and the family name ' +
        'is finished.',
    },
    {
      id: 'navarre-aragon',
      name: 'Navarre & Aragon',
      kind: 'landmark',
      at: { x: 0.243, z: -0.456 },
      description:
        'The end the poem is actually driving at: the daughters are asked for ' +
        'again, this time by the heirs of Navarre and Aragon, and the last ' +
        'lines note that the kings of Spain are now his kin. The man who rode ' +
        'out of Bivar with nothing has married into every throne on the map.',
    },
  ],

  routes: [
    {
      id: 'the-exile',
      name: 'Nine Days to Leave Castile',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.487, z: -0.575 },
        { x: -0.489, z: -0.537 },
        { x: -0.464, z: -0.516 },
        { x: -0.420, z: -0.380 },
        { x: -0.378, z: -0.248 },
        { x: -0.356, z: -0.220 },
        { x: -0.311, z: -0.120 },
        { x: -0.305, z: -0.078 },
      ],
      description:
        'Out of his own gate, through a town forbidden to sell him bread, ' +
        'past the monastery where he leaves his family, over the Duero and ' +
        'into the hills with Atienza on his right. The clock is the king’s ' +
        'nine days.',
    },
    {
      id: 'castejon-raid',
      name: 'The Henares',
      style: 'solid',
      color: '#c96f5c',
      points: [
        { x: -0.305, z: -0.078 },
        { x: -0.356, z: 0.120 },
        { x: -0.370, z: 0.147 },
        { x: -0.414, z: 0.207 },
        { x: -0.356, z: 0.120 },
        { x: -0.200, z: -0.040 },
      ],
      description:
        'Castejón taken at dawn with the oldest trick there is, the country ' +
        'raided as far as Alcalá, and the town sold back rather than held. ' +
        'Then up out of the valley into the Taranz plain, heading east.',
    },
    {
      id: 'the-jalon',
      name: 'Down the Jalón',
      style: 'solid',
      color: '#d98f5a',
      points: [
        { x: -0.200, z: -0.040 },
        { x: -0.123, z: -0.126 },
        { x: -0.089, z: -0.120 },
        { x: -0.066, z: -0.132 },
        { x: -0.057, z: -0.127 },
        { x: -0.053, z: -0.132 },
        { x: -0.032, z: -0.141 },
        { x: 0.000, z: -0.180 },
      ],
      description:
        'The stretch that reads like a road-book: between Fariza and Cetina, ' +
        'past Alhama, Bubierca and Ateca to the hill above Alcocer — and the ' +
        'feigned retreat that takes the town.',
    },
    {
      id: 'to-tevar',
      name: 'Monreal to Tévar',
      style: 'solid',
      color: '#a8c46a',
      points: [
        { x: 0.000, z: -0.180 },
        { x: 0.034, z: 0.084 },
        { x: -0.086, z: 0.062 },
        { x: 0.088, z: 0.262 },
        { x: 0.133, z: 0.120 },
        { x: 0.138, z: -0.262 },
        { x: 0.304, z: -0.020 },
      ],
      description:
        'Levying Molina and Teruel from the hill of Monreal, then the pine ' +
        'wood of Tévar where the Count of Barcelona rides down to punish him ' +
        'and loses his army, his dignity and the sword Colada.',
    },
    {
      id: 'barcelona-ride',
      name: 'The Count Rides Out',
      style: 'dashed',
      color: '#b08fc0',
      points: [
        { x: 0.816, z: -0.154 },
        { x: 0.560, z: -0.100 },
        { x: 0.304, z: -0.020 },
        { x: 0.133, z: 0.120 },
      ],
      description:
        'Ramón Berenguer’s expedition from Barcelona to the pine wood, which ' +
        'ends with him refusing food for three days in a captor’s tent until ' +
        'he is coaxed out of it and released.',
    },
    {
      id: 'to-valencia',
      name: 'The Taking of Valencia',
      style: 'solid',
      color: '#e07a6b',
      points: [
        { x: 0.138, z: -0.262 },
        { x: 0.155, z: 0.066 },
        { x: 0.206, z: 0.436 },
        { x: 0.276, z: 0.415 },
        { x: 0.272, z: 0.528 },
        { x: 0.264, z: 0.566 },
        { x: 0.250, z: 0.612 },
      ],
      description:
        'South out of Zaragoza’s lands, taking and keeping this time: Jérica, ' +
        'Almenar, Onda, Murviedro, Cebolla — and then the city itself.',
    },
    {
      id: 'the-south',
      name: 'Cutting the City Off',
      style: 'dashed',
      color: '#6fa8c8',
      points: [
        { x: 0.250, z: 0.612 },
        { x: 0.278, z: 0.734 },
        { x: 0.218, z: 0.805 },
        { x: 0.244, z: 0.864 },
        { x: 0.357, z: 0.864 },
      ],
      description:
        'The raiding south to Cullera, Játiva and Dénia and the taking of the ' +
        'Peñacadell pass, so that nothing reaches Valencia from that side — ' +
        'and later the line Búcar’s army is chased down.',
    },
    {
      id: 'the-family',
      name: 'Sending for the Family',
      style: 'solid',
      color: '#8fb4d8',
      points: [
        { x: -0.464, z: -0.516 },
        { x: -0.208, z: -0.070 },
        { x: -0.086, z: 0.062 },
        { x: 0.000, z: -0.180 },
        { x: 0.155, z: 0.066 },
        { x: 0.250, z: 0.612 },
      ],
      description:
        'Minaya fetches Ximena and the daughters from Cardeña to Medinaceli, ' +
        'and Abengalvón brings them on from Molina over the Jalón to ' +
        'Valencia, where they are set on the tower to look at the city and ' +
        'the sea.',
    },
    {
      id: 'corpes-road',
      name: 'The Road to Corpes',
      style: 'solid',
      color: '#8f5fa8',
      points: [
        { x: 0.250, z: 0.612 },
        { x: 0.155, z: 0.066 },
        { x: -0.086, z: 0.062 },
        { x: -0.044, z: -0.160 },
        { x: -0.208, z: -0.070 },
        { x: -0.305, z: -0.078 },
        { x: -0.311, z: -0.120 },
        { x: -0.384, z: -0.116 },
      ],
      description:
        'Out of Valencia with the dowry, a night with Abengalvón at Molina ' +
        'and a plot to murder him, over the Jalón, Atienza on the left this ' +
        'time, the forest of Miedes — and into the oak-wood.',
    },
    {
      id: 'rescue',
      name: 'Felez Muñoz Turns Back',
      style: 'dashed',
      color: '#c8a0d8',
      points: [
        { x: -0.384, z: -0.116 },
        { x: -0.390, z: -0.190 },
        { x: -0.378, z: -0.248 },
        { x: -0.356, z: -0.220 },
      ],
      description:
        'Their cousin doubles back through the wood, finds them, gets them ' +
        'water in his hat, and carries them to San Esteban — the one man on ' +
        'that road who behaves like family.',
    },
    {
      id: 'the-court',
      name: 'The Court and the Field',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: 0.250, z: 0.612 },
        { x: -0.100, z: 0.540 },
        { x: -0.556, z: 0.440 },
        { x: -0.561, z: 0.455 },
        { x: -0.660, z: -0.500 },
        { x: -0.690, z: -0.535 },
      ],
      description:
        'Up from Valencia to the Tagus and the court at Toledo, where the ' +
        'case is argued in order — swords, then money, then honour — and on ' +
        'to the field at Carrión three weeks later for the part that needs ' +
        'lances.',
    },
  ],

  regions: [
    { id: 'r-castile', name: 'Castile', at: { x: -0.52, z: -0.34 }, scale: 1.05 },
    { id: 'r-aragon', name: 'Aragon', at: { x: 0.20, z: -0.20 }, scale: 1.0 },
    { id: 'r-valencia', name: 'Valencia', at: { x: 0.30, z: 0.70 }, scale: 0.95 },
  ],

  chapters: [
    {
      id: 'c-1',
      title: 'I · The open door',
      narration:
        'He turns in the saddle and looks at his own house: gate open, doors ' +
        'off the hinges, no cloak on the pegs, no hawk on the perch. Then he ' +
        'says a short prayer of thanks, remarks that his enemies have arranged ' +
        'this, and rides. A crow on the right leaving Bivar, a crow on the ' +
        'left entering Burgos, and he shrugs at both.',
      focus: { marker: 'bivar', distance: 22, pitch: 44 },
      reveal: { markers: ['bivar', 'burgos'], regions: ['r-castile'] },
    },
    {
      id: 'c-2',
      title: 'I · Burgos, and a girl of nine',
      narration:
        'The town comes to the windows to watch him ride in and says what ' +
        'everyone in the poem thinks: God, what a good vassal, if only he had ' +
        'a good lord. Nobody dares open a door. A nine-year-old is sent out ' +
        'to explain the king’s order — sealed, with their houses and their ' +
        'eyes at stake — and to say, politely, that his ruin of them would ' +
        'buy him nothing.',
      focus: { marker: 'the-girl', distance: 18, pitch: 46 },
      reveal: { markers: ['the-girl'] },
      highlight: { markers: ['the-girl'] },
    },
    {
      id: 'c-3',
      title: 'I · Cardeña',
      narration:
        'He leaves Ximena and the two girls with the abbot at San Pedro, with ' +
        'money for their keep and a promise to marry the daughters well. The ' +
        'poem says the parting was like the nail coming out of the flesh. ' +
        'Then the nine days start running.',
      focus: { marker: 'cardena', distance: 18, pitch: 44 },
      reveal: { markers: ['cardena'], routes: ['the-exile'] },
    },
    {
      id: 'c-4',
      title: 'I · Over the Duero',
      narration:
        'Past Alcubilla, the last mark of Castile, over the Duero at Navas de ' +
        'Palos, a night at Figueruela, and a camp in the hills of Miedes with ' +
        'the towers of Atienza on the right. He counts what he has: three ' +
        'hundred lances, every one with a pennon.',
      focus: { marker: 'miedes', distance: 26, pitch: 42 },
      reveal: { markers: ['duero', 'gormaz', 'miedes', 'atienza'] },
      highlight: { routes: ['the-exile'] },
    },
    {
      id: 'c-5',
      title: 'I · Castejón',
      narration:
        'A town on the Henares taken by hiding men outside and waiting for ' +
        'the gates to open as usual. Minaya raids as far as Guadalajara and ' +
        'Alcalá and comes back loaded. Then — because he cannot hold ground ' +
        'this deep in the king’s country — he sells it back and moves on. The ' +
        'poem is genuinely interested in how an army feeds itself.',
      focus: { marker: 'castejon', distance: 22, pitch: 44 },
      reveal: { markers: ['castejon', 'guadalajara', 'taranz'], routes: ['castejon-raid'] },
    },
    {
      id: 'c-6',
      title: 'I · Alcocer',
      narration:
        'East between Fariza and Cetina, past Alhama, Bubierca and Ateca, to ' +
        'a round hill by the Jalón where nobody can cut his water. Alcocer ' +
        'will not fall — so he strikes camp and marches off down the valley ' +
        'with his banner up, and rides back in through the gate the moment ' +
        'the town empties to chase him.',
      focus: { marker: 'alcocer', distance: 20, pitch: 44 },
      reveal: { markers: ['ateca', 'alcocer', 'terrer', 'calatayud', 'jalon'], routes: ['the-jalon'] },
      highlight: { markers: ['alcocer'] },
    },
    {
      id: 'c-7',
      title: 'I · Fáriz and Galve',
      narration:
        'Valencia sends three thousand men to put him out again. He beats ' +
        'them in the open and the chase runs to the walls of Calatayud. Then ' +
        'he sells Alcocer for three thousand marks — and the poem notes that ' +
        'the Moors who bought it were sorry to lose him, because he had ' +
        'governed it well.',
      focus: { marker: 'calatayud', distance: 22, pitch: 42 },
      highlight: { markers: ['calatayud'] },
    },
    {
      id: 'c-8',
      title: 'I–II · Tévar',
      narration:
        'From the hill of Monreal he levies Molina on one side and Teruel on ' +
        'the other, then camps in the pine wood of Tévar and taxes Zaragoza. ' +
        'The Count of Barcelona arrives to punish him, loses, and then ' +
        'refuses to eat for three days out of shame until the Cid talks him ' +
        'round and lets him ride home. Colada is won here.',
      focus: { marker: 'tevar', distance: 24, pitch: 42 },
      reveal: {
        markers: ['monreal', 'molina', 'tevar', 'zaragoza', 'alcaniz', 'barcelona'],
        routes: ['to-tevar', 'barcelona-ride'],
        regions: ['r-aragon'],
      },
      highlight: { markers: ['tevar'] },
    },
    {
      id: 'c-9',
      title: 'II · Down to the sea',
      narration:
        'The second cantar changes the plan: take towns and keep them. ' +
        'Jérica, Almenar, Onda, Murviedro, Cebolla — a ring closing on one ' +
        'city — and raiding south to Cullera, Játiva and Dénia so nothing can ' +
        'reach it. Then Valencia falls.',
      focus: { marker: 'valencia', distance: 26, pitch: 42 },
      reveal: {
        markers: ['jerica', 'onda', 'murviedro', 'cebolla', 'valencia', 'cullera', 'penacadell'],
        routes: ['to-valencia', 'the-south'],
        regions: ['r-valencia'],
      },
      highlight: { markers: ['valencia'] },
    },
    {
      id: 'c-10',
      title: 'II · The tower',
      narration:
        'The first thing he does with a capital is send for his family. ' +
        'Minaya brings them from Cardeña by Medinaceli, Abengalvón of Molina ' +
        'escorts them over the Jalón, and the Cid takes Ximena and the girls ' +
        'up the highest tower to look at the city and the sea he has just ' +
        'taken. He also installs a bishop, which is the poem’s way of saying ' +
        'this is permanent.',
      focus: { marker: 'valencia', distance: 20, pitch: 46 },
      reveal: { markers: ['medina'], routes: ['the-family'] },
    },
    {
      id: 'c-11',
      title: 'II · The Heirs of Carrión',
      narration:
        'Two well-born young men from Carrión notice how rich he has become ' +
        'and ask the king for his daughters. The Cid says plainly that they ' +
        'are of a greater line than his and that he would rather not, but ' +
        'defers to the king. The weddings last a fortnight. Named 148 times, ' +
        'the Heirs are the poem’s idea of everything a man can inherit and ' +
        'not earn.',
      focus: { marker: 'carrion', distance: 30, pitch: 42 },
      reveal: { markers: ['carrion'] },
    },
    {
      id: 'c-12',
      title: 'III · The lion',
      narration:
        'A lion gets out of its cage in Valencia while the Cid is asleep. His ' +
        'men form a ring round the couch; one son-in-law hides behind the ' +
        'press and the other under the bench. The Cid wakes, takes the lion ' +
        'by the mane and puts it back. Nobody says anything, and that is ' +
        'worse.',
      focus: { marker: 'valencia', distance: 18, pitch: 46 },
      highlight: { markers: ['valencia'] },
    },
    {
      id: 'c-13',
      title: 'III · Corpes',
      narration:
        'They ask leave to take their wives home to Carrión, are given a ' +
        'dowry and the swords Colada and Tizón, and go. At Molina they plan ' +
        'to murder their host. In the oak-wood of Corpes they send the escort ' +
        'ahead, strip both women, beat them with girths and spurs until they ' +
        'cannot speak, and ride away — because, they say, the daughters of a ' +
        'man from Bivar were never their equals.',
      focus: { marker: 'corpes', distance: 22, pitch: 42 },
      reveal: { markers: ['corpes'], routes: ['corpes-road'] },
      highlight: { markers: ['corpes'] },
    },
    {
      id: 'c-14',
      title: 'III · Turning back',
      narration:
        'Felez Muñoz, riding ahead, cannot account for what he has seen and ' +
        'turns back through the wood. He finds them, brings water in his hat, ' +
        'gets them onto his horse and carries them to San Esteban, where the ' +
        'townsmen take them in and look after them until Minaya comes. The ' +
        'Cid remembers which town that was.',
      focus: { marker: 'gormaz', distance: 20, pitch: 44 },
      reveal: { routes: ['rescue'] },
      highlight: { routes: ['rescue'] },
    },
    {
      id: 'c-15',
      title: 'III · The court at Toledo',
      narration:
        'He does not ride to Carrión with an army. He asks the king for a ' +
        'court, and takes the case apart in order: first my swords back, ' +
        'since you are no longer my sons-in-law; then my money back; and only ' +
        'then, satisfaction. The Infantes lose each point in public before a ' +
        'single lance is couched. It is the most modern scene in any epic ' +
        'here.',
      focus: { marker: 'toledo', distance: 26, pitch: 42 },
      reveal: { markers: ['tagus', 'toledo'], routes: ['the-court'] },
      highlight: { markers: ['toledo'] },
    },
    {
      id: 'c-16',
      title: 'III · The field, and after',
      narration:
        'Three duels three weeks later, on the Infantes’ own ground with the ' +
        'king presiding so nothing can be fixed. His men win all three. Then ' +
        'the daughters are asked for again — by the heirs of Navarre and ' +
        'Aragon — and the poem closes by noting that the kings of Spain are ' +
        'now his kin, and that he died at Whitsun, and that this is the end ' +
        'of the song.',
      focus: { marker: 'the-duels', distance: 26, pitch: 42 },
      reveal: { markers: ['the-duels', 'navarre-aragon'] },
      highlight: { markers: ['the-duels'] },
    },
  ],
}
