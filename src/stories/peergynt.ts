import type { Story } from '../types'
import norwayHeight from '../assets/norway-height.png'

/**
 * Peer Gynt — Henrik Ibsen's dramatic poem, written in Italy and published in
 * Copenhagen in 1867. Ibsen died in 1906; the play and William and Charles
 * Archer's translation (Collected Works vol. 4, Project Gutenberg #66239) are
 * both long out of copyright.
 *
 * The world was read out of that text act by act, from the stage directions
 * rather than from a summary — which matters here, because Ibsen's stage
 * directions ARE the geography. Act I opens on "a wooded hillside near Åse's
 * farm"; Act IV opens "on the south-west coast of Morocco"; Act V opens "on
 * board a ship on the North Sea, off the Norwegian coast", and Peer names
 * three real mountains from the deck — Hallingskarv, the Jokel and the
 * Folgefånn. Those three lines are why this map is southern Norway and not
 * Gudbrandsdalen alone.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 3.0) / 6.0 − 1      map z = (63.5 − lat) / 2.75 − 1
 *
 * — with the invented places (Hegstad, Åse's farm, Solveig's hut) set in
 * Gudbrandsdalen, where Ibsen's source Asbjørnsen collected the Peer Gynt
 * folk tales, and where the play's names and dialect belong. The fourth act
 * is off the bottom of the map, and says so.
 *
 * Narration paraphrases the play; it quotes no translation.
 */
export const peergynt: Story = {
  id: 'peergynt',
  title: 'Peer Gynt',
  subtitle: 'Round about, said the Boyg',
  author: 'Henrik Ibsen',
  region: 'Gudbrandsdalen & the western fjords',
  epoch: 'Norwegian dramatic poem · 1867',
  group: 'epic',
  intro:
    'A liar who is very good at it, and fifty years spent being everything ' +
    'except himself. Press ▶ Play story to follow all five acts: the buck ' +
    'ride down the Gendin-Edge that never happened, the bride carried off a ' +
    'mountain, the troll hall under the Rondë, the Boyg that will not fight ' +
    'and cannot be got past, an emperor’s life in Morocco and Egypt, and an ' +
    'old man coming home to be melted down as a button unless somebody can ' +
    'say where he was himself.',
  surfaceName: 'Southern Norway',
  ambient: {
    trees: 0.5,
    treeKind: 'conifer',
    treeColor: '#2f5b43',
    birds: 7,
    fish: 3,
  },
  terrain: {
    music: {
      // Grieg wrote the incidental music in 1875 and it is public domain, but
      // no score was read while building this world, so nothing here is
      // presented as his. This is written to the halling — the Norwegian
      // dance in duple time that Peer's own wedding scene calls for — and is
      // an original tune, honestly credited as one.
      title: 'Halling for a liar',
      credit: 'After the Norwegian halling · original',
      melody:
        'A4:2 A4:1 B4:1 C5:2 A4:2 E4:2 A4:2 B4:2 C5:2 ' +
        'D5:2 C5:1 B4:1 A4:2 G4:2 E4:4 r:2 ' +
        'C5:2 C5:1 D5:1 E5:2 C5:2 A4:2 C5:2 B4:2 A4:2 ' +
        'G4:2 E4:2 A4:4 r:4',
      bass: 'A2:8 E2:8 F2:8 A2:8',
      tempo: 76,
      voice: 'strings',
      mood: 'wonder',
    },
    seed: 'peergynt-1', // unused: the heightmap takes precedence
    heightmap: norwayHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0030,
    // 652 km across by 611 km down.
    aspect: 1.068,
    // Real relief, capped at 2,000 m: the Jotunheim and Rondane peaks and the
    // fjords are the point of this map, so the exaggeration stays modest and
    // the mountains are allowed to be mountains.
    heightScale: 17,
    // The mountains stand as a wall in front of the fjords from low down.
    overhead: true,
    rivers: 6,
    biomes: [
      { maxHeight: 0.0030, color: '#274c66', name: 'The sea & the fjords' },
      { maxHeight: 0.06, color: '#c4bf9a', name: 'Shore' },
      { maxHeight: 0.2, color: '#5a8b4e', name: 'The valleys' },
      { maxHeight: 0.4, color: '#3f6f47', name: 'Pine forest' },
      { maxHeight: 0.6, color: '#71805c', name: 'Sæter country' },
      { maxHeight: 0.78, color: '#8d8b78', name: 'Bare fell' },
      { maxHeight: 1.0, color: '#eef0f2', name: 'Snow & glacier' },
    ],
  },

  markers: [
    {
      id: 'aase',
      name: 'Åse’s Farm',
      kind: 'town',
      at: { x: 0.092, z: -0.320 },
      description:
        'A wooded hillside, a river running down it, an old mill, and a ' +
        'twenty-year-old who has been out hunting for weeks and comes home ' +
        'with no meat and an extraordinary story. The Gynt farm was rich ' +
        'once; his father drank it. His mother scolds him and believes him ' +
        'anyway.',
    },
    {
      id: 'gendin',
      name: 'The Gendin-Edge',
      kind: 'danger',
      at: { x: 0.133, z: -0.418 },
      description:
        'The play’s first speech: a ridge a mile long and no wider than a ' +
        'scythe blade, a reindeer buck ridden down it at a gallop, and a fall ' +
        'into a lake where the buck’s reflection comes up to meet them. Åse ' +
        'is halfway through the story before she remembers she has heard it ' +
        'before, about somebody else.',
    },
    {
      id: 'ronde',
      name: 'The Rondë',
      kind: 'peak',
      at: { x: 0.143, z: -0.429 },
      description:
        'Shining snow-peaks in the sunset, where Peer runs after having his ' +
        'nose bloodied in a fight, declares himself Emperor over the whole ' +
        'range, and charges an imaginary castle head-first into a rock face.',
    },
    {
      id: 'hegstad',
      name: 'Hegstad Farm',
      kind: 'town',
      at: { x: 0.103, z: -0.309 },
      description:
        'The rich farm whose daughter Ingrid is being married off to ' +
        'somebody else. Peer is not invited, walks in anyway, is refused by ' +
        'every girl at the dance, and carries the bride up the mountain on ' +
        'his back out of pure spite.',
    },
    {
      id: 'solveig-hut',
      name: 'Solveig’s Hut',
      kind: 'town',
      at: { x: 0.067, z: -0.353 },
      description:
        'The newcomers’ family from Hedal are at the wedding, and their ' +
        'daughter will not dance with him because he is drunk. She is the ' +
        'only person in the play who says what she means. Later she walks up ' +
        'to his forest hut on skis with everything she owns, and waits fifty ' +
        'years.',
    },
    {
      id: 'lunde',
      name: 'The Sæter',
      kind: 'landmark',
      at: { x: 0.050, z: -0.273 },
      description:
        'The summer pasture huts, where three herd-girls are calling for ' +
        'trolls because there are no men up here. Peer, having abandoned ' +
        'Ingrid on a bare mountain that morning, volunteers.',
    },
    {
      id: 'dovre',
      name: 'The Dovre Fell',
      kind: 'peak',
      at: { x: 0.042, z: -0.491 },
      description:
        'The high fell where the Dovre-King holds his hall. The way down is ' +
        'through the Green-Clad Woman, who is the King’s daughter, rides a ' +
        'pig, and thinks Peer is very handsome.',
      link: {
        world: 'peergynt',
        level: 'trollhall',
        marker: 'throne',
        note: 'Down into the Dovre-King’s hall',
      },
    },
    {
      id: 'boyg-place',
      name: 'Where the Boyg Was',
      kind: 'danger',
      at: { x: 0.010, z: -0.400 },
      description:
        'Pitch dark, and something enormous and shapeless filling every ' +
        'direction at once. It will not fight and cannot be struck; it says ' +
        'only that it is the great Boyg, and that Peer should go roundabout. ' +
        'He is saved by church bells and women singing, and spends the rest ' +
        'of his life taking the advice.',
    },
    {
      id: 'forest-hut',
      name: 'The Hut in the Forest',
      kind: 'landmark',
      at: { x: 0.126, z: -0.375 },
      description:
        'Outlawed after the Hegstad business, Peer fells timber and builds a ' +
        'hut with a bolt on the door. Solveig comes up on skis to live in it. ' +
        'That same evening the Green-Clad Woman arrives with an ugly child ' +
        'and calls it his, and rather than tell Solveig, he tells her to wait ' +
        'and walks away.',
    },
    {
      id: 'churchyard',
      name: 'Åse’s Death-Bed',
      kind: 'ruin',
      at: { x: 0.097, z: -0.331 },
      description:
        'The Hegstad-churl has taken the farm and the bailiff the rest; Åse ' +
        'is dying on a bed with a borrowed coverlet. Peer sits at the foot of ' +
        'it, harnesses the bed as a sledge and drives his mother to the gates ' +
        'of Soria-Moria castle, talking St. Peter round, until she stops ' +
        'answering. Then he kisses her and goes to sea.',
    },
    {
      id: 'oslo',
      name: 'Christiania',
      kind: 'city',
      at: { x: 0.292, z: 0.305 },
      description:
        'Not a scene in the play — the town Ibsen left. He wrote Peer Gynt in ' +
        'Ischia and Sorrento in 1867, in voluntary exile, and posted it home ' +
        'to Copenhagen to be printed. The Norway on this map is a Norway ' +
        'being remembered from the Mediterranean.',
    },
    {
      id: 'africa',
      name: 'The Fourth Act',
      kind: 'landmark',
      at: { x: -0.333, z: 0.970 },
      description:
        'Off the bottom of this map, and a long way off: a palm grove on the ' +
        'south-west coast of Morocco, an Arab chief’s tent in an oasis, a ' +
        'caravan route in the Sahara, Memnon’s statue and the Sphinx in the ' +
        'sand outside Cairo, and a madhouse where the inmates crown Peer ' +
        'Emperor of Self. Thirty years and four continents, and he comes back ' +
        'with nothing.',
    },
    {
      id: 'jokel',
      name: 'The Jokel',
      kind: 'peak',
      at: { x: -0.325, z: -0.320 },
      description:
        'The second of the three mountains Peer names from the deck coming ' +
        'home — with his green ice-mantle still on his back, he says, and ' +
        'standing askew behind his brother. Jostedalsbreen, the largest ' +
        'glacier on the European mainland.',
    },
    {
      id: 'hallingskarv',
      name: 'Hallingskarv',
      kind: 'peak',
      at: { x: -0.192, z: 0.036 },
      description:
        'The first mountain he greets from the ship, ruffling it in his ' +
        'winter furs in the evening glow. Peer talks to it like an old ' +
        'acquaintance and then tells it not to be a madcap — it is only a ' +
        'granite knob, and he is the one who has been somewhere.',
    },
    {
      id: 'folgefonn',
      name: 'The Folgefånn',
      kind: 'peak',
      at: { x: -0.442, z: 0.255 },
      description:
        'The third: lying there, he says, like a maiden in spotless white. ' +
        'The Folgefonna icecap over the Hardangerfjord — and the only one of ' +
        'the three he compares to a woman, coming home to one who waited.',
    },
    {
      id: 'wreck',
      name: 'The Wreck',
      kind: 'danger',
      at: { x: -0.633, z: 0.236 },
      description:
        'The storm takes the ship on the rocks with the coast in sight. Peer ' +
        'and the ship’s cook come up together at the same overturned boat, ' +
        'which will hold one. Peer argues him off it on the grounds that he ' +
        'has no children and is more use to the world, and the cook goes ' +
        'under mid-Paternoster.',
    },
    {
      id: 'bergen',
      name: 'The Coast',
      kind: 'port',
      at: { x: -0.613, z: 0.131 },
      description:
        'Ashore at last, with the Strange Passenger — the calm man from the ' +
        'ship who wanted to dissect Peer’s dreams after he drowned, and who ' +
        'turns up on the wreck and on the beach, entirely unhurried.',
    },
    {
      id: 'auction',
      name: 'The Auction at Hegstad',
      kind: 'ruin',
      at: { x: 0.115, z: -0.298 },
      description:
        'A hillside gnawed away by a dry torrent, a ruined mill, and a crowd ' +
        'drinking their way through the last of somebody’s property. Peer ' +
        'sits on the rubbish heap and auctions off his own past — a dream, ' +
        'the Gendin ride, the storehouse door — and nobody bids.',
    },
    {
      id: 'funeral',
      name: 'The Funeral',
      kind: 'ruin',
      at: { x: 0.140, z: -0.276 },
      description:
        'A priest over a grave, telling the story of a man who cut off his ' +
        'own finger to avoid the army, was despised for it all his life, and ' +
        'worked a farm out of stony ground with the nine fingers he had left. ' +
        'Peer listens to the whole of it and calls it a fine thing to hear.',
    },
    {
      id: 'heath',
      name: 'The Burnt Heath',
      kind: 'danger',
      at: { x: -0.067, z: -0.127 },
      description:
        'A forest fire has gone through; charred trunks for miles and white ' +
        'mist on the ground. Out of it come thread-balls, withered leaves, a ' +
        'sighing in the air, dewdrops and broken straws — the thoughts he ' +
        'never thought, the songs he never sang, the deeds he never did — all ' +
        'asking him why not.',
    },
    {
      id: 'crossroads',
      name: 'The Crossroads',
      kind: 'danger',
      at: { x: -0.020, z: -0.180 },
      description:
        'The Button-moulder is waiting with a ladle. Peer is not good enough ' +
        'for heaven and nowhere near bad enough for hell, so he is to be ' +
        'melted down with the other spoiled goods and cast again — unless he ' +
        'can produce one witness that he was ever, at any point, himself.',
    },
    {
      id: 'lean-one',
      name: 'The Lean One',
      kind: 'danger',
      at: { x: 0.020, z: -0.230 },
      description:
        'A thin man in a priest’s cassock with a fowling-net, who turns out ' +
        'to be the Devil and is no help at all: Peer is not a sinner on the ' +
        'grand scale either, and there is nothing in his file worth the coal. ' +
        'Every door in the afterlife is shut on the grounds of insufficiency.',
    },
    {
      id: 'whitsun-hut',
      name: 'Whitsun Eve',
      kind: 'landmark',
      at: { x: 0.078, z: -0.364 },
      description:
        'The hut is still there, and so is Solveig, old and blind, coming out ' +
        'to sing. Asked where Peer Gynt has been himself all these years, she ' +
        'answers: in her faith, in her hope, and in her love. The ' +
        'Button-moulder’s voice says they will meet at the last crossroads, ' +
        'and leaves the question there.',
    },
  ],

  routes: [
    {
      id: 'bride-run',
      name: 'Up the Mountain with the Bride',
      style: 'solid',
      color: '#d97a6c',
      points: [
        { x: 0.103, z: -0.309 },
        { x: 0.090, z: -0.340 },
        { x: 0.060, z: -0.380 },
        { x: 0.010, z: -0.400 },
      ],
      description:
        'Act II’s opening: a narrow path high in the mountains at first ' +
        'light, Ingrid in her wedding clothes, and Peer telling her to go ' +
        'home because she is not the one he wanted.',
    },
    {
      id: 'troll-road',
      name: 'The Road to the Dovre-King',
      style: 'solid',
      color: '#7fa86a',
      points: [
        { x: 0.010, z: -0.400 },
        { x: 0.050, z: -0.273 },
        { x: 0.143, z: -0.429 },
        { x: 0.042, z: -0.491 },
      ],
      description:
        'Three herd-girls, a charge into a rock face, the Green-Clad Woman on ' +
        'her pig, and then a hall under the fell where the price of the ' +
        'princess is a tail, a scratched eye and troll food.',
    },
    {
      id: 'act-one',
      name: 'The First Day',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: 0.092, z: -0.320 },
        { x: 0.133, z: -0.418 },
        { x: 0.103, z: -0.309 },
        { x: 0.067, z: -0.353 },
      ],
      description:
        'Home from the hills with a story, off to the Hegstad wedding to ' +
        'spoil it, and the one meeting in the play that turns out to matter — ' +
        'a girl with a prayer-book who will not dance with him.',
    },
    {
      id: 'outlaw',
      name: 'The Outlaw Years',
      style: 'solid',
      color: '#9bb37a',
      points: [
        { x: 0.010, z: -0.400 },
        { x: 0.126, z: -0.375 },
        { x: 0.067, z: -0.353 },
        { x: 0.097, z: -0.331 },
      ],
      description:
        'The hut in the forest, Solveig arriving on skis to stay, the ' +
        'Green-Clad Woman arriving with a child, and Peer going down to his ' +
        'mother’s death-bed instead of back through his own door.',
    },
    {
      id: 'to-sea',
      name: 'Away',
      style: 'dashed',
      color: '#c8a86b',
      points: [
        { x: 0.097, z: -0.331 },
        { x: 0.200, z: -0.060 },
        { x: 0.292, z: 0.305 },
        { x: 0.000, z: 0.760 },
        { x: -0.333, z: 0.970 },
      ],
      description:
        'Thirty years off the map: slaving to Charleston, idols to China, ' +
        'gold in San Francisco, a yacht off Morocco, a prophet in an oasis, ' +
        'and the Emperor of Self crowned by lunatics in Cairo.',
    },
    {
      id: 'homecoming',
      name: 'The Voyage Home',
      style: 'solid',
      color: '#6fa8c8',
      points: [
        { x: -0.333, z: 0.970 },
        { x: -0.560, z: 0.640 },
        { x: -0.442, z: 0.255 },
        { x: -0.633, z: 0.236 },
        { x: -0.613, z: 0.131 },
      ],
      description:
        'Act V: an old man on the poop in stormy weather, greeting ' +
        'Hallingskarv, the Jokel and the Folgefånn by name — and then a wreck ' +
        'in sight of the coast, and one seat on an upturned boat.',
    },
    {
      id: 'last-walk',
      name: 'The Last Walk',
      style: 'solid',
      color: '#b08fc0',
      points: [
        { x: -0.613, z: 0.131 },
        { x: -0.192, z: 0.036 },
        { x: -0.067, z: -0.127 },
        { x: -0.020, z: -0.180 },
        { x: 0.020, z: -0.230 },
        { x: 0.140, z: -0.276 },
        { x: 0.115, z: -0.298 },
        { x: 0.078, z: -0.364 },
      ],
      description:
        'Inland on foot through a funeral, an auction of his own past, a ' +
        'burnt heath full of the things he never did, and three appointments ' +
        'with a man who wants to melt him down — ending at a hut door on ' +
        'Whitsun Eve.',
    },
  ],

  regions: [
    { id: 'r-gudbrand', name: 'Gudbrandsdalen', at: { x: 0.150, z: -0.240 }, scale: 1.05 },
    { id: 'r-jotun', name: 'The High Fells', at: { x: -0.060, z: -0.440 }, scale: 1.05 },
    { id: 'r-fjords', name: 'The Western Fjords', at: { x: -0.560, z: 0.060 }, scale: 1.05 },
  ],

  levels: [
    {
      id: 'trollhall',
      title: 'The Dovre-King’s Hall',
      subtitle: 'Troll, to thyself be — enough',
      tier: -1,
      terrain: {
        music: {
          title: 'Troll March',
          credit: 'Original, written for this atlas',
          melody:
            'B3:1 C4:1 D4:1 E4:1 F#4:1 D4:1 F#4:2 ' +
            'F4:1 D4:1 F4:2 E4:1 C4:1 E4:2 ' +
            'B3:1 C4:1 D4:1 E4:1 F#4:1 D4:1 F#4:2 ' +
            'A4:1 G4:1 F#4:1 E4:1 D4:1 B3:1 B3:4 r:2',
          bass: 'B1:8 B1:8 E2:8 B1:8',
          tempo: 96,
          voice: 'horn',
          mood: 'dark',
        },
        seed: 'trollhall-2',
        sky: 'cavern',
        seaLevel: 0.34,
        heightScale: 20,
        octaves: 5,
        frequency: 2.6,
        islandFalloff: 0.28,
        waterColor: '#1b2a1e',
        riverColor: '#3e6b3c',
        rivers: 2,
        biomes: [
          { maxHeight: 0.34, color: '#1e2c22', name: 'The under-water' },
          { maxHeight: 0.46, color: '#3d5038', name: 'The floor of the hall' },
          { maxHeight: 0.62, color: '#565f49', name: 'Troll-benches' },
          { maxHeight: 0.8, color: '#77725a', name: 'The pillars' },
          { maxHeight: 1.0, color: '#9d9271', name: 'The roof of the fell' },
        ],
      },
      ambient: { trees: 0.06, treeColor: '#38492f', birds: 0, wisps: 10, mosquitoes: 2 },
      markers: [
        {
          id: 'throne',
          name: 'The Old Man of the Dovre',
          kind: 'capital',
          at: { x: 0.0, z: 0.0 },
          description:
            'A great hall full of troll-courtiers, gnomes and brownies, and ' +
            'a king on a throne with a crown and a sceptre, prepared to be ' +
            'entirely reasonable about his daughter’s marriage.',
          link: {
            world: 'peergynt',
            marker: 'dovre',
            note: 'Back up onto the fell',
          },
        },
        {
          id: 'the-difference',
          name: 'The Difference',
          kind: 'landmark',
          at: { x: -0.34, z: -0.18 },
          description:
            'Out there, the King explains, men say: to thyself be true. In ' +
            'here we say: troll, to thyself be — enough. It is one word’s ' +
            'difference and it is the whole play; Peer has been living by the ' +
            'troll version since Act I and takes another four acts to notice.',
        },
        {
          id: 'the-tail',
          name: 'The Tail',
          kind: 'landmark',
          at: { x: 0.30, z: -0.24 },
          description:
            'The terms: wear a tail, drink the mead they brew, eat what they ' +
            'eat, and see the world through a scratched eye so that muck ' +
            'looks like gold and a cow looks like a queen. Peer agrees to ' +
            'everything up to the eye.',
        },
        {
          id: 'the-eye',
          name: 'The Scratch',
          kind: 'danger',
          at: { x: 0.10, z: 0.34 },
          description:
            'The one condition he refuses — a knife through the eye so that ' +
            'he can never see straight again — and the refusal is why he gets ' +
            'out alive. The court comes at him anyway, and church bells in ' +
            'the valley bring the roof down on the whole business.',
        },
        {
          id: 'green-clad',
          name: 'The Green-Clad Woman',
          kind: 'landmark',
          at: { x: -0.24, z: 0.30 },
          description:
            'The King’s daughter, who rides a pig, thinks Peer’s palace and ' +
            'his rags are both magnificent, and turns up outside his forest ' +
            'hut in Act III with a limping child — the one piece of the troll ' +
            'hall that follows him home.',
        },
        {
          id: 'boyg-dark',
          name: 'The Great Boyg',
          kind: 'danger',
          at: { x: 0.38, z: 0.22 },
          description:
            'Not a troll and not in the hall: something shapeless in the dark ' +
            'outside it, slippery and everywhere, which conquers without ' +
            'fighting. Its only advice — go roundabout — becomes the way Peer ' +
            'handles every difficulty for the next fifty years.',
        },
      ],
      routes: [
        {
          id: 'audience',
          name: 'The Audience',
          style: 'solid',
          color: '#a8c27a',
          points: [
            { x: -0.24, z: 0.30 },
            { x: 0.0, z: 0.0 },
            { x: -0.34, z: -0.18 },
            { x: 0.30, z: -0.24 },
            { x: 0.10, z: 0.34 },
          ],
          description:
            'In on a pig, through the terms one at a time, and out through ' +
            'the roof when the bells start.',
        },
        {
          id: 'in-the-dark',
          name: 'Through the Dark',
          style: 'dashed',
          color: '#6f8a6a',
          points: [
            { x: 0.10, z: 0.34 },
            { x: 0.26, z: 0.30 },
            { x: 0.38, z: 0.22 },
          ],
          description:
            'Straight out of one impossible thing into another: pitch dark, ' +
            'and something enormous filling every direction he tries.',
        },
      ],
      regions: [{ id: 'r-hall', name: 'The Hall of the Dovre-King', at: { x: 0.0, z: -0.5 }, scale: 1.1 }],
    },
  ],

  chapters: [
    {
      id: 'p-1',
      title: 'I · The Gendin-Edge',
      narration:
        'Peer Gynt, you are lying, says his mother, before he has finished a ' +
        'sentence. He tells it anyway: a mile-long ridge no wider than a ' +
        'scythe blade, a buck ridden down it at a gallop, and a fall into a ' +
        'lake where the reflection comes up to meet them. Åse gets halfway ' +
        'through before she remembers whose story it actually is.',
      focus: { marker: 'gendin', distance: 30, pitch: 40 },
      reveal: { markers: ['aase', 'gendin'], regions: ['r-gudbrand'] },
    },
    {
      id: 'p-2',
      title: 'I · The wedding at Hegstad',
      narration:
        'The girl he did not bother to marry is being married to somebody ' +
        'else, so he goes to her wedding uninvited. Nobody will dance with ' +
        'him. Then the newcomers arrive from Hedal, and their daughter ' +
        'Solveig will not dance with him either — but she is the only one who ' +
        'gives him a straight reason.',
      focus: { marker: 'hegstad', distance: 26, pitch: 40 },
      reveal: { markers: ['hegstad', 'solveig-hut'], routes: ['act-one'] },
      highlight: { markers: ['solveig-hut'] },
    },
    {
      id: 'p-3',
      title: 'I–II · The bride on his back',
      narration:
        'He carries the bride off up the mountain, and by the next morning he ' +
        'is telling her to go home because she is not the one he wanted. The ' +
        'whole parish is out after him with dogs. He is an outlaw before the ' +
        'second act is ten minutes old.',
      focus: { at: { x: 0.06, z: -0.36 }, distance: 34, pitch: 38 },
      reveal: { routes: ['bride-run'], regions: ['r-jotun'] },
      highlight: { routes: ['bride-run'] },
    },
    {
      id: 'p-4',
      title: 'II · Three herd-girls, and a rock face',
      narration:
        'At the summer sæter, three girls are calling for trolls because ' +
        'there are no men on the mountain. Peer volunteers for all three. In ' +
        'the morning he wakes among the Rondë peaks, declares himself Emperor ' +
        'of the whole range, and charges the imaginary gate of an imaginary ' +
        'castle head-first into a cliff.',
      focus: { marker: 'ronde', distance: 30, pitch: 42 },
      reveal: { markers: ['lunde', 'ronde', 'dovre'], routes: ['troll-road'] },
    },
    {
      id: 'p-5',
      title: 'II · The Dovre-King’s hall',
      narration:
        'A woman in green on a pig takes him down to her father’s hall. The ' +
        'terms are generous: a tail, troll mead, troll food, and a knife ' +
        'through the eye so that muck will always look like gold. Out there, ' +
        'says the King, men say — to thyself be true. In here we say: troll, ' +
        'to thyself be enough.',
      level: 'trollhall',
      focus: { marker: 'throne', distance: 34, pitch: 38 },
      reveal: {
        markers: ['throne', 'green-clad', 'the-difference', 'the-tail', 'the-eye'],
        routes: ['audience'],
        regions: ['r-hall'],
      },
      highlight: { markers: ['the-difference'] },
    },
    {
      id: 'p-6',
      title: 'II · The Boyg',
      narration:
        'He refuses the eye, and the court comes at him. Church bells in the ' +
        'valley bring the roof down, and he stumbles out into pitch dark ' +
        'where something enormous and shapeless fills every direction. It ' +
        'will not fight, cannot be struck, and says only: go roundabout. ' +
        'Women singing drive it off. He takes the advice for fifty years.',
      level: 'trollhall',
      focus: { marker: 'boyg-dark', distance: 30, pitch: 36 },
      reveal: { markers: ['boyg-dark'], routes: ['in-the-dark'] },
      highlight: { markers: ['boyg-dark'] },
    },
    {
      id: 'p-7',
      title: 'III · The hut, and Solveig',
      narration:
        'Outlawed, he fells timber and builds a hut with a bolt on the door. ' +
        'Solveig comes up on skis with everything she owns and asks to stay. ' +
        'That evening the Green-Clad Woman is outside with a limping child ' +
        'and a claim. Rather than say any of it out loud, he tells Solveig to ' +
        'wait a little, and walks away for thirty years.',
      focus: { marker: 'forest-hut', distance: 26, pitch: 40 },
      reveal: { markers: ['boyg-place', 'forest-hut'], routes: ['outlaw'] },
      highlight: { markers: ['forest-hut'] },
    },
    {
      id: 'p-8',
      title: 'III · Åse’s death',
      narration:
        'Everything has been taken; his mother is dying under a borrowed ' +
        'coverlet. He harnesses the bed as a sledge, makes her the horse ' +
        'Grane, and drives her at a gallop up to the gates of Soria-Moria ' +
        'castle, arguing St. Peter down and getting God himself to invite her ' +
        'in — and goes on talking until he notices she has stopped answering.',
      focus: { marker: 'churchyard', distance: 24, pitch: 42 },
      reveal: { markers: ['churchyard'] },
      highlight: { markers: ['churchyard'] },
    },
    {
      id: 'p-9',
      title: 'IV · Thirty years off the map',
      narration:
        'A palm grove on the coast of Morocco, a yacht, and a middle-aged ' +
        'gentleman explaining that his fortune came from shipping slaves to ' +
        'Charleston and idols to China with equal enthusiasm. Then the yacht ' +
        'is stolen, and he is a prophet in an oasis, and Anitra dances for ' +
        'the jewels and rides off with them.',
      focus: { marker: 'africa', distance: 60, pitch: 34 },
      reveal: { markers: ['oslo', 'africa'], routes: ['to-sea'] },
      highlight: { routes: ['to-sea'] },
    },
    {
      id: 'p-10',
      title: 'IV · The Sphinx, and the madhouse',
      narration:
        'In the sand outside Cairo he looks at the Sphinx and recognises the ' +
        'Boyg. A German professor overhears him, decides he is the man who ' +
        'has fathomed the riddle, and takes him to a courtyard where the ' +
        'keeper has been locked up and the inmates crown Peer Emperor of ' +
        'Self. It is the only crown he ever actually gets.',
      focus: { marker: 'africa', distance: 48, pitch: 36 },
      highlight: { markers: ['africa'] },
    },
    {
      id: 'p-11',
      title: 'V · Hallingskarv, the Jokel, the Folgefånn',
      narration:
        'An old man on the poop in stormy weather, greeting the coast by ' +
        'name: Hallingskarv ruffling it in his winter furs, the Jokel askew ' +
        'behind him with his green ice-mantle on, the Folgefånn lying like a ' +
        'maiden in white. Don’t be madcaps, he tells them; you’re but granite ' +
        'knobs.',
      focus: { marker: 'hallingskarv', distance: 42, pitch: 34 },
      reveal: {
        markers: ['hallingskarv', 'jokel', 'folgefonn'],
        routes: ['homecoming'],
        regions: ['r-fjords'],
      },
      highlight: { routes: ['homecoming'] },
    },
    {
      id: 'p-12',
      title: 'V · One seat on the boat',
      narration:
        'The ship goes on the rocks in sight of land. Peer and the cook come ' +
        'up at the same overturned boat, which will hold one, and Peer argues ' +
        'him off it: the cook has no children, and Peer is a person of ' +
        'consequence. The cook gets as far as the fourth line of the ' +
        'Paternoster.',
      focus: { marker: 'wreck', distance: 30, pitch: 36 },
      reveal: { markers: ['wreck', 'bergen'] },
      highlight: { markers: ['wreck'] },
    },
    {
      id: 'p-13',
      title: 'V · The funeral and the auction',
      narration:
        'Ashore, he hears a priest bury a man who cut off a finger to dodge ' +
        'the army and spent his life despised for it, and thinks it a fine ' +
        'thing to hear. Then, on a hillside above a ruined mill, he auctions ' +
        'off his own past — a dream, the ride down Gendin, the Hegstad ' +
        'storehouse door — and gets no bids.',
      focus: { marker: 'auction', distance: 26, pitch: 40 },
      reveal: { markers: ['funeral', 'auction'], routes: ['last-walk'] },
    },
    {
      id: 'p-14',
      title: 'V · The onion, and the burnt heath',
      narration:
        'He peels an onion looking for the core and finds only coats: the ' +
        'shipwrecked man, the gold-digger, the prophet, the emperor, layer ' +
        'after layer and nothing in the middle. On the burnt heath the ' +
        'thread-balls and withered leaves and broken straws crowd round him ' +
        '— the thoughts, songs and deeds he never had — asking why not.',
      focus: { marker: 'heath', distance: 34, pitch: 38 },
      reveal: { markers: ['heath'] },
      highlight: { markers: ['heath'] },
    },
    {
      id: 'p-15',
      title: 'V · The Button-moulder',
      narration:
        'A man with a ladle at the crossroads: not good enough for heaven, ' +
        'nowhere near bad enough for hell, and therefore scrap, to be melted ' +
        'down and cast again unless a witness can say he was ever himself. ' +
        'Even the Devil turns him away — there is nothing in the file worth ' +
        'the coal.',
      focus: { marker: 'crossroads', distance: 26, pitch: 40 },
      reveal: { markers: ['crossroads', 'lean-one'] },
      highlight: { markers: ['crossroads'] },
    },
    {
      id: 'p-16',
      title: 'V · Whitsun Eve',
      narration:
        'The hut is still standing and Solveig comes out of it, old and ' +
        'blind, to sing. He asks her where Peer Gynt has been himself all ' +
        'this time, expecting the worst. In her faith, she says, in her hope, ' +
        'and in her love. The Button-moulder’s voice says only that they will ' +
        'meet at the last crossroads — and the play stops there.',
      focus: { marker: 'whitsun-hut', distance: 22, pitch: 42 },
      reveal: { markers: ['whitsun-hut'] },
      highlight: { markers: ['whitsun-hut'], routes: ['last-walk'] },
    },
  ],
}
