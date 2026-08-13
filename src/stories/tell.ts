import type { Story } from '../types'
import lucerneHeight from '../assets/lucerne-height.png'

/**
 * Wilhelm Tell — Schiller's play of 1804 (Schiller d. 1805 → public domain),
 * which took the Swiss founding legend out of the chronicles and made it the
 * version the world knows. The third national epic in this atlas after
 * Kalevipoeg and Lāčplēsis, and the same act done a third time: a country's
 * founding story shaped into literature in the 19th century.
 *
 * The surface uses a REAL heightmap, and this is the first world in the atlas
 * with real mountains in it. Every other DEM here is flat (Estonia tops out at
 * 318 m, Latvia at 312) or deliberately capped so lowlands keep their range.
 * Lake Lucerne gives 2,400 m of relief inside 61 km — cliffs straight out of
 * the water, which is exactly the stage the play needs.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 8.15) / 0.4 − 1      map z = (47.15 − lat) / 0.2 − 1
 *
 * The lake is the whole point of the geography: everything in the play happens
 * on it, above it, or on the roads round it, and the two great set pieces —
 * the boat in the föhn storm and the walk over the Axen — are a race between
 * water and land round the same shore.
 *
 * Narration paraphrases Schiller; it quotes no translation.
 */
export const tell: Story = {
  id: 'tell',
  title: 'Wilhelm Tell',
  subtitle: 'The lake, the apple and the sunken lane',
  author: 'Friedrich Schiller',
  region: 'Lake Lucerne & the forest cantons',
  epoch: 'Play · 1804 · set in 1307',
  group: 'epic',
  intro:
    'A bailiff puts his hat on a pole and orders a country to bow to it. ' +
    'Everything else follows from that. Press ▶ Play story to run the whole ' +
    'play round one lake — the oath sworn at night on the Rütli meadow, the ' +
    'apple on a child’s head at Altdorf, the leap onto the rock in a föhn ' +
    'storm, and the wait in the sunken lane above Küssnacht. Every place here ' +
    'is real and most of them you can still stand in.',
  surfaceName: 'The Four Forest Cantons',
  ambient: {
    trees: 0.55,
    treeKind: 'conifer',
    birds: 5,
    // The föhn storm sits over Lake Uri, the southern arm — which is where
    // both storms in the play blow up, and where Tell takes the tiller.
    rain: true,
    rainArea: { x0: 0.0, x1: 0.36, z0: -0.32, z1: 0.3 },
  },
  terrain: {
    music: {
      // An alphorn has no valves: it can only sound the natural harmonic
      // series of its tube, which is why its tunes leap in thirds and fourths
      // and why the eleventh harmonic — the famous "alphorn fa" — sits between
      // F and F#. This is written to that constraint rather than borrowed.
      // Rossini's overture is public domain and would be the obvious choice,
      // but not from memory.
      title: 'Ranz for the Forest Cantons',
      credit: 'After the alphorn’s harmonic series · original',
      melody:
        'G4:2 B4:1 D5:1 D5:2 B4:2 G4:4 r:1 D5:2 F5:1 D5:1 B4:2 G4:2 D4:4 r:1 ' +
        'G4:1 B4:1 D5:2 G5:3 D5:1 B4:2 G4:6 r:2',
      bass: 'G2:8 D3:8 G2:8 D3:8',
      tempo: 52,
      voice: 'horn',
      mood: 'calm',
    },
    seed: 'tell-1', // unused: the heightmap takes precedence
    heightmap: lucerneHeight,
    // Printed by scripts/build-heightmap.mjs. There is no sea here: the `lucerne`
    // preset sets the waterline at the lake surface (434 m) by elevation, since
    // Natural Earth's lake polygons have nothing at this scale.
    seaLevel: 0.0025,
    // 61 km across by 44 km down.
    aspect: 1.367,
    // Start high. This map is not wide enough to trigger the overhead framing
    // on width alone, but 2,400 m of relief hides the lake behind the nearest
    // ridge from the usual low angle — and the lake is the whole play.
    overhead: true,
    // Real Alps — but the default 3D camera comes in low on a world this shape,
    // and at 30 the peaks stood as a wall in front of the lake everything
    // happens on. 18 still reads as mountains and lets you see the water.
    heightScale: 18,
    rivers: 3,
    biomes: [
      { maxHeight: 0.0025, color: '#2f6f7e', name: 'The lake' },
      // Bands set from real altitudes through the preset's gamma: shore to
      // 600 m, pasture to 1,000, forest to 1,500, alp to 2,000, rock to 2,600,
      // and snow only above that — roughly where the Alpine snowline sits.
      { maxHeight: 0.26, color: '#7ba756', name: 'Lake shore' },
      { maxHeight: 0.49, color: '#5f9450', name: 'Pasture' },
      { maxHeight: 0.67, color: '#3f7742', name: 'Forest' },
      { maxHeight: 0.81, color: '#8a9268', name: 'High alp' },
      { maxHeight: 0.94, color: '#9a9490', name: 'Rock' },
      { maxHeight: 1.0, color: '#f2f4f6', name: 'Snow' },
    ],
  },

  markers: [
    {
      id: 'buerglen',
      name: 'Bürglen',
      kind: 'capital',
      at: { x: 0.289, z: 0.378 },
      description:
        'Tell’s house, up the Schächental east of Altdorf. He comes home to it ' +
        'at the end — and finds the emperor’s murderer sitting at his hearth ' +
        'expecting sympathy from one killer to another, which he does not get.',
    },
    {
      id: 'altdorf',
      name: 'Altdorf',
      kind: 'city',
      at: { x: 0.235, z: 0.343 },
      description:
        'The seat of Uri, and the square where Gessler sets a hat on a pole and ' +
        'orders every man who passes to bow to it. Tell walks past without ' +
        'looking. Everything in the play turns on that one refusal.',
    },
    {
      id: 'zwing-uri',
      name: 'Zwing Uri',
      kind: 'ruin',
      at: { x: 0.262, z: 0.318 },
      description:
        'The tower Gessler is building above Altdorf with forced Uri labour, ' +
        'and names — to their faces — the Curb of Uri. It is pulled down in the ' +
        'rising. Schiller took it from the chronicles; no such castle has been ' +
        'found on the ground.',
    },
    {
      id: 'attinghausen',
      name: 'Attinghausen',
      kind: 'ruin',
      at: { x: 0.195, z: 0.42 },
      description:
        'The castle of the old baron Werner von Attinghausen, the last of the ' +
        'free nobles, who dies telling the peasants that their day is coming ' +
        'and his class is finished. The one aristocrat in the play on the ' +
        'country’s side.',
    },
    {
      id: 'rutli',
      name: 'The Rütli',
      kind: 'landmark',
      at: { x: 0.095, z: -0.109 },
      description:
        'A meadow on the west shore of Lake Uri, reachable by boat and by ' +
        'almost nothing else — which is why the three cantons meet on it at ' +
        'night. Thirty-three men from Uri, Schwyz and Unterwalden swear to be ' +
        'one people. It is Swiss ground in the most literal sense: the meadow ' +
        'was bought by public subscription in 1859 and belongs to the nation.',
    },
    {
      id: 'tellsplatte',
      name: 'The Tellsplatte',
      kind: 'danger',
      at: { x: 0.179, z: -0.017 },
      description:
        'A ledge of rock at the foot of the Axen cliffs, and the only place on ' +
        'that shore a man could land. In the föhn storm Gessler’s crew hand the ' +
        'tiller to the one prisoner who can steer; Tell runs the boat in, jumps ' +
        'for the rock and kicks the boat back into the water behind him.',
    },
    {
      id: 'axen',
      name: 'The Axen',
      kind: 'landmark',
      at: { x: 0.173, z: -0.11 },
      description:
        'The cliff wall along the east shore, with a path scratched across it. ' +
        'Tell goes over the top of it on foot while Gessler is still on the ' +
        'water — and gets to Küssnacht first. The play is a race, and this is ' +
        'the leg where the man on land wins.',
    },
    {
      id: 'fluelen',
      name: 'Flüelen',
      kind: 'port',
      at: { x: 0.193, z: 0.24 },
      description:
        'The head of the lake, where the road from Altdorf meets the water and ' +
        'where the boat carrying Tell to Gessler’s dungeon at Küssnacht puts ' +
        'out — into the wrong weather.',
    },
    {
      id: 'brunnen',
      name: 'Brunnen',
      kind: 'port',
      at: { x: 0.138, z: -0.231 },
      description:
        'Where the lake turns a right angle and the Schwyz shore begins. Boats ' +
        'crossing between the cantons put in here, and so does the conspiracy.',
    },
    {
      id: 'schwyz',
      name: 'Schwyz',
      kind: 'city',
      at: { x: 0.259, z: -0.354 },
      description:
        'The middle canton of the three, and the one whose name ended up on the ' +
        'whole country. Its men come over the ridge to the Rütli in the dark.',
    },
    {
      id: 'steinen',
      name: 'Steinen',
      kind: 'town',
      at: { x: 0.12, z: -0.34 },
      description:
        'Werner Stauffacher’s house — the new stone house that draws the ' +
        'bailiff’s eye and his question about who gave him leave to build it. ' +
        'It is Stauffacher’s wife Gertrud who tells him plainly that the answer ' +
        'is to stop asking permission.',
    },
    {
      id: 'kussnacht',
      name: 'Küssnacht',
      kind: 'city',
      at: { x: -0.269, z: -0.679 },
      description:
        'Gessler’s own seat at the north end of the lake, and the dungeon Tell ' +
        'is being shipped to. He arrives before the man who ordered it.',
    },
    {
      id: 'hohle-gasse',
      name: 'The Hohle Gasse',
      kind: 'danger',
      at: { x: -0.239, z: -0.645 },
      description:
        'The sunken lane between Immensee and Küssnacht — a cutting deep enough ' +
        'that a rider in it can be seen and cannot get out. Tell waits above it ' +
        'with the second arrow, the one he told Gessler was meant for him.',
    },
    {
      id: 'immensee',
      name: 'Immensee',
      kind: 'town',
      at: { x: -0.2, z: -0.665 },
      description:
        'The far end of the sunken lane, on Lake Zug. The road from the lake to ' +
        'Küssnacht runs through it, which is how Tell knows where to stand.',
    },
    {
      id: 'luzern',
      name: 'Lucerne',
      kind: 'city',
      at: { x: -0.602, z: -0.501 },
      description:
        'The town at the lake’s outflow, already Habsburg and already the way ' +
        'the empire reaches in. Not a scene of the play, but the reason the ' +
        'play happens.',
    },
    {
      id: 'stans',
      name: 'Stans',
      kind: 'town',
      at: { x: -0.46, z: -0.04 },
      description:
        'Nidwalden, the lower half of Unterwalden — the third of the three ' +
        'cantons that swear on the Rütli, and the shore Baumgarten is fleeing ' +
        'from when the play opens.',
    },
    {
      id: 'sarnen',
      name: 'Sarnen',
      kind: 'town',
      at: { x: -0.761, z: 0.27 },
      description:
        'Obwalden, and the castle where the bailiff Landenberg sits. It is ' +
        'taken at dawn on New Year’s Day by men who walk in carrying gifts with ' +
        'weapons under them.',
    },
    {
      id: 'melchtal',
      name: 'The Melchtal',
      kind: 'forest',
      at: { x: -0.668, z: 0.625 },
      description:
        'Arnold of Melchtal’s valley. The bailiff’s men come for his father’s ' +
        'ox team; the son resists and runs; and the bailiff has the old man’s ' +
        'eyes put out for it. That is what Arnold brings to the Rütli.',
    },
    {
      id: 'rossberg',
      name: 'Rossberg',
      kind: 'ruin',
      at: { x: 0.0, z: -0.5 },
      description:
        'The castle above Steinen, taken the same night as Sarnen — by way of a ' +
        'rope a serving girl let down for a lover, which the risen men used ' +
        'instead. The mountain itself came down on the valley in 1806, two ' +
        'years after Schiller wrote.',
    },
    {
      id: 'gersau',
      name: 'Gersau',
      kind: 'town',
      at: { x: -0.068, z: -0.225 },
      description:
        'A strip of shore under a mountain wall, reachable only by water for ' +
        'most of its history — and for five centuries a republic of its own, ' +
        'the smallest in Europe.',
    },
    {
      id: 'seelisberg',
      name: 'Seelisberg',
      kind: 'landmark',
      at: { x: 0.1, z: -0.1 },
      description:
        'The terrace above the Rütli. From up here you can see the whole ' +
        'southern arm of the lake at once — the meadow, the Axen, the ' +
        'Tellsplatte and the head of the water at Flüelen.',
    },
    {
      id: 'rigi',
      name: 'The Rigi',
      kind: 'peak',
      at: { x: -0.161, z: -0.539 },
      description:
        'The block of mountain between the lake and Küssnacht. Tell goes round ' +
        'its foot to reach the sunken lane; everything on this map is measured ' +
        'against how long it takes to get past it.',
    },
    {
      id: 'pilatus',
      name: 'Pilatus',
      kind: 'peak',
      at: { x: -0.744, z: -0.146 },
      description:
        'The mountain over Lucerne, said to hold Pontius Pilate’s restless ' +
        'body in a lake near its summit — and to answer anyone who disturbs it ' +
        'with a storm. Climbing it was forbidden for centuries.',
    },
    {
      id: 'uri-rotstock',
      name: 'Uri Rotstock',
      kind: 'peak',
      at: { x: -0.045, z: 0.335 },
      description:
        'The high wall on the south-west side of the lake. Beyond it there is ' +
        'no road: the forest cantons are shut in by rock on every side except ' +
        'the water, which is why the water decides everything.',
    },
    {
      id: 'gotthard-road',
      name: 'The Road South',
      kind: 'landmark',
      at: { x: 0.325, z: 0.825 },
      description:
        'Up the Reuss towards the Schöllenen gorge and the Gotthard — the pass ' +
        'to Italy. This road is the whole reason a poor valley is worth a ' +
        'bailiff, a tower and a hat on a pole.',
    },
  ],

  regions: [
    { id: 'r-uri', name: 'URI', at: { x: 0.27, z: 0.56 }, scale: 1.05 },
    { id: 'r-schwyz', name: 'SCHWYZ', at: { x: 0.2, z: -0.6 }, scale: 1.05 },
    { id: 'r-unterwalden', name: 'UNTERWALDEN', at: { x: -0.6, z: 0.1 }, scale: 1.05 },
    { id: 'r-urnersee', name: 'Lake Uri', at: { x: 0.14, z: 0.06 }, scale: 0.9 },
    { id: 'r-vierwald', name: 'Vierwaldstättersee', at: { x: -0.34, z: -0.23 }, scale: 0.95 },
    { id: 'r-zugersee', name: 'Lake Zug', at: { x: -0.24, z: -0.86 }, scale: 0.85 },
  ],

  routes: [
    {
      id: 'baumgarten',
      name: 'The crossing in the first storm',
      color: '#6fb3d6',
      style: 'solid',
      description:
        'The play opens on a storm. Baumgarten of Unterwalden has just killed ' +
        'the bailiff who came for his wife and is running for the Schwyz shore ' +
        'with horsemen behind him. No ferryman will put out. Tell does.',
      points: [
        { x: 0.19, z: 0.12 },
        { x: 0.165, z: -0.02 },
        { x: 0.15, z: -0.14 },
        { x: 0.138, z: -0.231 },
      ],
    },
    {
      id: 'rutli-oath',
      name: 'The three cantons to the Rütli',
      color: '#ffd27a',
      style: 'solid',
      description:
        'By night, from three directions, to a meadow that can only be reached ' +
        'by boat: Uri down from Attinghausen and Altdorf, Schwyz over the ridge ' +
        'from Steinen, Unterwalden across the water from Stans.',
      points: [
        { x: 0.195, z: 0.42 },
        { x: 0.235, z: 0.343 },
        { x: 0.193, z: 0.24 },
        { x: 0.095, z: -0.109 },
        { x: 0.12, z: -0.34 },
      ],
    },
    {
      id: 'rutli-west',
      name: 'Unterwalden’s road to the oath',
      color: '#e0c07a',
      style: 'dashed',
      description:
        'The third canton comes the long way: up out of the Melchtal, past ' +
        'Sarnen and Stans, and over the water to the meadow.',
      points: [
        { x: -0.668, z: 0.625 },
        { x: -0.761, z: 0.27 },
        { x: -0.46, z: -0.04 },
        { x: -0.2, z: -0.11 },
        { x: 0.095, z: -0.109 },
      ],
    },
    {
      id: 'gessler-boat',
      name: 'The boat to Küssnacht',
      color: '#d76b6b',
      style: 'dashed',
      description:
        'Gessler ships his prisoner from Flüelen up the lake to the dungeon at ' +
        'Küssnacht. The föhn comes down off the mountains, the crew cannot hold ' +
        'her, and the one man aboard who can steer is in chains.',
      points: [
        { x: 0.193, z: 0.24 },
        { x: 0.168, z: 0.08 },
        { x: 0.179, z: -0.017 },
      ],
    },
    {
      id: 'tell-walk',
      name: 'Over the Axen to the lane',
      color: '#ffd27a',
      style: 'solid',
      description:
        'Ashore on the Tellsplatte and away on foot: over the Axen, round the ' +
        'head of the lake at Brunnen, past Schwyz and under the Rigi to the ' +
        'sunken lane above Küssnacht — and there he waits.',
      points: [
        { x: 0.179, z: -0.017 },
        { x: 0.173, z: -0.11 },
        { x: 0.138, z: -0.231 },
        { x: 0.2, z: -0.33 },
        { x: 0.1, z: -0.46 },
        { x: -0.02, z: -0.53 },
        { x: -0.16, z: -0.6 },
        { x: -0.239, z: -0.645 },
      ],
    },
    {
      id: 'lake-road',
      name: 'The road that is water',
      color: '#7fc4dd',
      style: 'solid',
      description:
        'Before there were roads round this lake there was the lake. Lucerne ' +
        'to Weggis, under the Rigi to Vitznau and Gersau, round the corner at ' +
        'Brunnen and up the Urnersee to Flüelen — the way everyone in the play ' +
        'travels, including the people they are running from.',
      points: [
        { x: -0.602, z: -0.501 },
        { x: -0.42, z: -0.42 },
        { x: -0.29, z: -0.415 },
        { x: -0.168, z: -0.29 },
        { x: -0.068, z: -0.225 },
        { x: 0.06, z: -0.25 },
        { x: 0.138, z: -0.231 },
        { x: 0.15, z: -0.1 },
        { x: 0.168, z: 0.08 },
        { x: 0.193, z: 0.24 },
      ],
    },
    {
      id: 'castles-fall',
      name: 'The night the castles fell',
      color: '#c98a5a',
      style: 'solid',
      description:
        'New Year, 1308. Sarnen taken at dawn by men carrying gifts, Rossberg ' +
        'by a rope meant for someone else, and the Curb of Uri pulled down ' +
        'stone by stone by the people who were made to build it.',
      points: [
        { x: -0.761, z: 0.27 },
        { x: -0.4, z: -0.2 },
        { x: 0.0, z: -0.5 },
        { x: 0.15, z: -0.1 },
        { x: 0.262, z: 0.318 },
      ],
    },
    {
      id: 'gotthard',
      name: 'The road to the pass',
      color: '#b58fd0',
      style: 'dashed',
      description:
        'South up the Reuss from Flüelen and Altdorf towards the Schöllenen ' +
        'and the Gotthard. The traffic on this road is what makes these three ' +
        'valleys worth garrisoning.',
      points: [
        { x: 0.193, z: 0.24 },
        { x: 0.235, z: 0.343 },
        { x: 0.289, z: 0.5 },
        { x: 0.31, z: 0.68 },
        { x: 0.325, z: 0.825 },
      ],
    },
  ],

  elements: [
    {
      id: 'crossbow',
      name: 'Tell’s Crossbow',
      glyph: '🏹',
      description:
        'The bow that shoots the apple and, with the second bolt, the man who ' +
        'made him shoot it. Tell tells Gessler to his face what the second one ' +
        'was for, before he has any way of using it.',
      journey: [
        { marker: 'buerglen', note: 'His own, for hunting the high country.' },
        { marker: 'altdorf', sinceChapter: 6, note: 'Aimed at his son’s head.' },
        { marker: 'tellsplatte', sinceChapter: 9, note: 'Carried ashore off the boat.' },
        { marker: 'hohle-gasse', sinceChapter: 11, note: 'The second bolt, as promised.' },
      ],
    },
    {
      id: 'hat',
      name: 'Gessler’s Hat',
      glyph: '⛑',
      description:
        'A hat on a pole in the square at Altdorf, with guards set to see that ' +
        'everyone bows to it. It is not a symbol of anything. It is a test of ' +
        'whether the test will be obeyed.',
      journey: [
        { marker: 'kussnacht', note: 'Off the bailiff’s own head.' },
        { marker: 'altdorf', sinceChapter: 5, note: 'Up the pole, with a guard.' },
        { marker: 'altdorf', sinceChapter: 12, note: 'Down with the tower.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · The Storm and the Oath',
      subtitle: 'A hunted man, a stone house, and a meadow at night',
      chapters: [
        {
          id: 'i-1',
          title: 'Nobody will put out',
          narration:
            'A fisherman’s hut on the Uri shore, and weather coming. Baumgarten ' +
            'of Unterwalden arrives at a run: the bailiff came to his house for ' +
            'his wife and Baumgarten split his skull with an axe, and the horse ' +
            'is behind him. The ferryman looks at the lake and says no. Tell ' +
            'takes the boat out.',
          focus: { marker: 'fluelen', distance: 40, pitch: 40 },
          reveal: {
            markers: ['fluelen', 'brunnen', 'altdorf', 'buerglen', 'stans'],
            routes: ['baumgarten'],
            regions: ['r-uri', 'r-schwyz', 'r-urnersee'],
          },
          highlight: { routes: ['baumgarten'] },
        },
        {
          id: 'i-2',
          title: 'The house at Steinen',
          narration:
            'Werner Stauffacher has built a good stone house, and the bailiff ' +
            'has ridden past and asked, pleasantly, whose it is. Stauffacher ' +
            'sits outside it afraid. His wife Gertrud does the arithmetic out ' +
            'loud: they will take it anyway, so the only question is whether ' +
            'you wait for that or not.',
          focus: { marker: 'steinen', distance: 32, pitch: 40 },
          reveal: { markers: ['steinen', 'schwyz'] },
          highlight: { markers: ['steinen'] },
        },
        {
          id: 'i-3',
          title: 'What they did in the Melchtal',
          narration:
            'The bailiff’s men come to take an old man’s oxen. His son Arnold ' +
            'breaks a finger of the man leading them away and runs for it. So ' +
            'they blind the father instead, and take the farm, and tell the ' +
            'valley why. Arnold gets over the mountains to Uri with that.',
          focus: { marker: 'melchtal', distance: 40, pitch: 42 },
          reveal: {
            markers: ['melchtal', 'sarnen', 'luzern', 'pilatus'],
            regions: ['r-unterwalden', 'r-vierwald'],
          },
          highlight: { markers: ['melchtal'] },
        },
        {
          id: 'i-4',
          title: 'The Rütli',
          narration:
            'A meadow on the west shore, under cliffs, reachable by boat and ' +
            'nothing else. Thirty-three men come to it in the dark from three ' +
            'cantons and swear to be one people — and, being who they are, also ' +
            'agree to wait for New Year and to pay for any property they break.',
          focus: { marker: 'rutli', distance: 30, pitch: 38 },
          reveal: {
            markers: ['rutli', 'seelisberg', 'attinghausen', 'gersau'],
            routes: ['rutli-oath', 'rutli-west'],
          },
          highlight: { markers: ['rutli'], routes: ['rutli-oath', 'rutli-west'] },
        },
      ],
    },
    {
      id: 'ii',
      title: 'II · The Hat and the Apple',
      subtitle: 'A pole in a square, and a shot nobody wanted taken',
      chapters: [
        {
          id: 'ii-1',
          title: 'The Curb of Uri',
          narration:
            'Above Altdorf, Gessler is building a tower with Uri labour, and ' +
            'has named it the Curb of Uri so that the men laying its stones ' +
            'know what it is for. Tell passes it without comment. He is not a ' +
            'conspirator; he thinks a man should mind his own house.',
          focus: { marker: 'zwing-uri', distance: 30, pitch: 40 },
          reveal: { markers: ['zwing-uri', 'gotthard-road'], routes: ['gotthard'] },
          highlight: { markers: ['zwing-uri'] },
        },
        {
          id: 'ii-2',
          title: 'The hat on the pole',
          narration:
            'In the square below, a hat on a pole and two guards to see that ' +
            'everyone bows. Tell comes through with his son and does not look ' +
            'at it. He is stopped. The guards are not sure what the punishment ' +
            'for this is either, because nobody has done it yet.',
          focus: { marker: 'altdorf', distance: 26, pitch: 38 },
          highlight: { markers: ['altdorf'] },
        },
        {
          id: 'ii-3',
          title: 'The apple',
          narration:
            'Gessler arrives and invents the sentence on the spot: the famous ' +
            'marksman will shoot an apple off his own son’s head at eighty ' +
            'paces, or both of them die. Walter stands under the lime tree and ' +
            'refuses to be tied. Tell takes two bolts out of the quiver and ' +
            'puts one of them in his shirt.',
          focus: { marker: 'altdorf', distance: 20, pitch: 34 },
          highlight: { markers: ['altdorf'] },
        },
        {
          id: 'ii-4',
          title: 'The second bolt',
          narration:
            'He splits the apple. Then Gessler, who cannot leave it, asks what ' +
            'the second bolt was for — and promises him his life for a straight ' +
            'answer. Tell gives him one: if the first had killed my child, the ' +
            'second was for you, and I would not have missed. Gessler keeps his ' +
            'word about the life and has him chained for the boat.',
          focus: { marker: 'altdorf', distance: 22, pitch: 36 },
          highlight: { markers: ['altdorf', 'fluelen'] },
        },
      ],
    },
    {
      id: 'iii',
      title: 'III · The Lake and the Lane',
      subtitle: 'A storm, a rock, a walk, and a sunken road',
      chapters: [
        {
          id: 'iii-1',
          title: 'The föhn',
          narration:
            'Out of Flüelen for Küssnacht, and the föhn comes down off the ' +
            'mountains onto the water. The crew cannot hold her against the ' +
            'Axen wall. There is one man aboard who knows this lake, and he is ' +
            'in irons, and Gessler orders him unchained.',
          focus: { marker: 'fluelen', distance: 34, pitch: 38 },
          reveal: { markers: ['axen'], routes: ['gessler-boat'] },
          highlight: { routes: ['gessler-boat'] },
        },
        {
          id: 'iii-2',
          title: 'The Tellsplatte',
          narration:
            'He steers her at the one ledge of rock on that whole shore, takes ' +
            'his crossbow, jumps, and kicks the boat back out into the storm ' +
            'behind him. It is the most famous leap in Switzerland and there is ' +
            'a chapel on the spot.',
          focus: { marker: 'tellsplatte', distance: 22, pitch: 34 },
          reveal: { markers: ['tellsplatte'] },
          highlight: { markers: ['tellsplatte'] },
        },
        {
          id: 'iii-3',
          title: 'Ahead of him on foot',
          narration:
            'Now it is a race, and the man on land has the better of it. Over ' +
            'the Axen, round the corner of the lake at Brunnen, past Schwyz, ' +
            'under the Rigi — and up to a sunken lane between Immensee and ' +
            'Küssnacht that the road to the castle has to pass through.',
          focus: { marker: 'axen', distance: 44, pitch: 44 },
          reveal: {
            markers: ['kussnacht', 'immensee', 'hohle-gasse', 'rigi', 'rossberg'],
            routes: ['tell-walk'],
            regions: ['r-zugersee'],
          },
          highlight: { routes: ['tell-walk'] },
        },
        {
          id: 'iii-4',
          title: 'The Hohle Gasse',
          narration:
            'A cutting deep enough that a rider in it can be seen from above ' +
            'and cannot get out of it. A wedding party comes up the road first, ' +
            'and then a woman with her children to beg for her imprisoned ' +
            'husband, and then Gessler. Tell has the second bolt.',
          focus: { marker: 'hohle-gasse', distance: 20, pitch: 34 },
          highlight: { markers: ['hohle-gasse'] },
        },
        {
          id: 'iii-5',
          title: 'New Year',
          narration:
            'The word runs round the lake and the cantons keep to the plan they ' +
            'made on the Rütli. Sarnen falls at dawn to men carrying New Year ' +
            'gifts with steel underneath, Rossberg to a rope let down for ' +
            'somebody else, and the Curb of Uri comes down stone by stone. ' +
            'Nobody is killed in the castles. That was in the oath too.',
          focus: { marker: 'sarnen', distance: 50, pitch: 46 },
          reveal: { routes: ['castles-fall'] },
          highlight: { routes: ['castles-fall'] },
        },
        {
          id: 'iii-6',
          title: 'The guest at Bürglen',
          narration:
            'Last scene, and Schiller’s hardest: Duke Johann, who has just ' +
            'murdered his uncle the emperor, comes to Tell’s house looking for ' +
            'the sympathy of a fellow killer. Tell throws him out. One of us ' +
            'defended what was his, he says; you murdered a man for a ' +
            'province — and sends him over the mountains to Rome to beg.',
          focus: { marker: 'buerglen', distance: 26, pitch: 36 },
          highlight: { markers: ['buerglen', 'gotthard-road'] },
        },
      ],
    },
  ],
}
