import type { Story } from '../types'
import nibelungenHeight from '../assets/nibelungen-height.png'

/**
 * The Nibelungenlied — the German heroic epic, written around 1200 by a poet
 * who did not sign it, probably in the region of Passau. Anonymous and eight
 * centuries old, so public domain by any measure.
 *
 * The fourth national epic in this atlas after Kalevipoeg, Lāčplēsis and
 * Wilhelm Tell, and the one that uses the map hardest, because it is not a
 * region — it is a ROAD. Xanten on the Lower Rhine to Worms, out to Iceland
 * and back, into the Odenwald for a murder, and then the whole length of the
 * Danube east through Passau, Pöchlarn and Vienna to Etzel's hall in Hungary.
 *
 * The two halves of the poem travel that eastern road twice: once to a
 * wedding and once, thirteen years later, to a slaughter that everyone
 * involved can see coming. Those are the two routes worth looking at.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 5.8) / 6.85 − 1      map z = (52.2 − lat) / 2.6 − 1
 *
 * Places the poem names but does not locate — Isenstein, the Nibelung land —
 * are set in the right direction and say so in their own text.
 *
 * Narration paraphrases the poem; it quotes no translation.
 */
export const nibelungen: Story = {
  id: 'nibelungen',
  title: 'The Nibelungenlied',
  subtitle: 'The road east, travelled twice',
  author: 'Anonymous',
  region: 'The Rhine & the Danube',
  epoch: 'German heroic epic · c. 1200',
  group: 'epic',
  intro:
    'A hero who cannot be wounded, a queen who is insulted at a church door, ' +
    'and thirteen years of waiting. Press ▶ Play story to follow the whole ' +
    'poem: Siegfried down the Rhine to Worms, the murder at a forest spring, ' +
    'the gold sunk in the river, and then the long ride east down the Danube ' +
    'to a hall in Hungary that nobody rides back out of. The eastern road is ' +
    'drawn twice on this map, because the poem travels it twice.',
  surfaceName: 'The Rhine & the Danube',
  ambient: {
    trees: 0.6,
    treeKind: 'broadleaf',
    birds: 6,
    // One dragon, and it belongs to the Dragon's Rock — Siegfried killed it
    // there and bathed in its blood, so it circles that marker rather than
    // ranging over a map where nothing else in the poem is supernatural.
    dragons: 1,
    dragonAt: { x: -0.794, z: -0.41 },
    fish: 3,
  },
  terrain: {
    music: {
      // The poem is written in the Nibelungenstrophe: four long lines, each
      // broken by a caesura, the last line a half-foot longer than the rest.
      // This is written to that shape — four phrases with a breath in the
      // middle of each and a longer fourth — rather than borrowed from a
      // surviving melody.
      title: 'Nibelungenstrophe',
      credit: 'After the poem’s own stanza · original',
      melody:
        'D4:2 F4:2 A4:2 G4:1 F4:1 E4:2 D4:4 r:1 ' +
        'A4:2 C5:2 D5:2 C5:1 A4:1 G4:2 F4:4 r:1 ' +
        'F4:2 A4:2 C5:2 A4:2 G4:2 F4:2 E4:4 r:1 ' +
        'D4:2 E4:1 F4:1 G4:2 F4:2 E4:2 D4:6 r:2',
      bass: 'D2:8 A2:8 F2:8 D2:8',
      tempo: 56,
      voice: 'harp',
      mood: 'epic',
    },
    seed: 'nibelungen-1', // unused: the heightmap takes precedence
    heightmap: nibelungenHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0037,
    // 988 km across by 578 km down.
    aspect: 1.709,
    // The Alps along the southern edge are capped at 1,600 m in the build, and
    // kept low here too: at 16 they came out as a row of clipped white teeth
    // across the bottom of a map whose subject is two river valleys.
    heightScale: 11,
    rivers: 7,
    biomes: [
      { maxHeight: 0.0037, color: '#2c5a74', name: 'The North Sea' },
      { maxHeight: 0.05, color: '#cfc79f', name: 'Flood plain' },
      { maxHeight: 0.16, color: '#6f9b57', name: 'Lowlands' },
      { maxHeight: 0.34, color: '#4f8a4a', name: 'Forest' },
      { maxHeight: 0.58, color: '#7c8a5a', name: 'Uplands' },
      { maxHeight: 0.82, color: '#9a9078', name: 'Highlands' },
      { maxHeight: 1.0, color: '#e6e6e8', name: 'The Alps' },
    ],
  },

  markers: [
    {
      id: 'xanten',
      name: 'Xanten',
      kind: 'city',
      at: { x: -0.905, z: -0.792 },
      description:
        'Siegfried’s home on the Lower Rhine, where his father Siegmund holds ' +
        'the Netherlands. He leaves it as a young man to go and see the ' +
        'Burgundians, having heard about their sister.',
    },
    {
      id: 'drachenfels',
      name: 'The Dragon’s Rock',
      kind: 'danger',
      at: { x: -0.794, z: -0.41 },
      description:
        'Where Siegfried killed the dragon and bathed in its blood, which made ' +
        'him proof against any weapon — except for the one patch between his ' +
        'shoulders where a lime leaf fell. The poem tells this in retrospect, ' +
        'and never says where; the Drachenfels above the Rhine has claimed it ' +
        'since the Middle Ages.',
    },
    {
      id: 'worms',
      name: 'Worms',
      kind: 'capital',
      at: { x: -0.626, z: -0.012 },
      description:
        'The Burgundian court on the Rhine: Gunther the king, his brothers ' +
        'Gernot and Giselher, their sister Kriemhild, and Hagen of Tronje, who ' +
        'is not a king and decides everything. Almost every disaster in the ' +
        'poem is agreed in this hall first.',
    },
    {
      id: 'minster',
      name: 'The Minster Door',
      kind: 'landmark',
      at: { x: -0.612, z: -0.028 },
      description:
        'Two queens arrive at the church at the same moment and argue about who ' +
        'goes in first. Kriemhild wins the argument by producing Brünhild’s ' +
        'ring and belt and saying where her husband got them. It is a quarrel ' +
        'about precedence at a door, and it kills six thousand people.',
    },
    {
      id: 'odenwald',
      name: 'The Spring in the Odenwald',
      kind: 'danger',
      at: { x: -0.553, z: -0.008 },
      description:
        'A hunt, a race to a cold spring, and Siegfried kneeling to drink with ' +
        'his weapons laid aside. Hagen puts a spear through the one spot ' +
        'Kriemhild embroidered a cross onto — because she told him where it ' +
        'was, so that he could guard it.',
    },
    {
      id: 'lochheim',
      name: 'Lochheim',
      kind: 'danger',
      at: { x: -0.628, z: -0.039 },
      description:
        'Where Hagen sinks the Nibelung hoard in the Rhine so that Kriemhild ' +
        'cannot buy an army with it — and swears with the kings that none of ' +
        'them will say where. He is the last man alive who knows, and he takes ' +
        'it with him.',
    },
    {
      id: 'lorsch',
      name: 'Lorsch',
      kind: 'ruin',
      at: { x: -0.596, z: -0.021 },
      description:
        'The abbey where Siegfried is laid, and where Kriemhild stays for years ' +
        'afterwards in sight of his grave rather than go home to Xanten. The ' +
        'gatehouse is still standing and is one of the oldest buildings in ' +
        'Germany.',
    },
    {
      id: 'isenstein',
      name: 'Isenstein',
      kind: 'danger',
      at: { x: -0.97, z: -0.965 },
      description:
        'Brünhild’s castle over the sea, where suitors throw the stone, jump ' +
        'and cast the spear against her, and lose their heads for it. Gunther ' +
        'wins by having Siegfried do all three in a cloak of invisibility while ' +
        'Gunther mimes. Off the top of this map; the poem puts it in Iceland.',
    },
    {
      id: 'nibelungland',
      name: 'The Nibelung Land',
      kind: 'landmark',
      at: { x: -0.97, z: -0.62 },
      description:
        'Where Siegfried took the hoard, the sword Balmung and the cloak from ' +
        'Alberich and the sons of Nibelung — and where the name that ends up ' +
        'attached to the Burgundians comes from. Somewhere north; the poem is ' +
        'not interested in saying where.',
    },
    {
      id: 'saxony',
      name: 'The Saxon War',
      kind: 'battle',
      at: { x: -0.241, z: -0.923 },
      description:
        'Liudeger of Saxony and Liudegast of Denmark declare war on Worms with ' +
        'forty thousand men. Siegfried takes a thousand and wins it, which is ' +
        'the moment the Burgundians understand what they have got and start ' +
        'being afraid of him.',
    },
    {
      id: 'danube-crossing',
      name: 'The Ford',
      kind: 'danger',
      at: { x: 0.06, z: 0.36 },
      description:
        'Hagen goes looking for a way over the Danube and finds water-sprites ' +
        'bathing. He steals their clothes; they tell him the truth to get them ' +
        'back — every man who rides east will die there except the chaplain. ' +
        'Hagen throws the chaplain in the river to disprove it. The chaplain ' +
        'swims to the far bank and lives, and Hagen rides on anyway.',
    },
    {
      id: 'passau',
      name: 'Passau',
      kind: 'city',
      at: { x: 0.114, z: 0.398 },
      description:
        'Where the Inn meets the Danube, and the seat of Bishop Pilgrim, who is ' +
        'Kriemhild’s uncle and receives both journeys — the bride going east ' +
        'and, thirteen years later, her brothers. The poem was probably written ' +
        'here, which may be why the bishop comes out of it so well.',
    },
    {
      id: 'eferding',
      name: 'Eferding',
      kind: 'town',
      at: { x: 0.197, z: 0.497 },
      description:
        'A stop on the Danube road, and the sort of place the poet names ' +
        'because his audience knew it. The eastern half of this poem reads like ' +
        'an itinerary someone had actually ridden.',
    },
    {
      id: 'poechlarn',
      name: 'Bechelaren',
      kind: 'city',
      at: { x: 0.374, z: 0.535 },
      description:
        'Rüdiger’s march at Pöchlarn, and the warmest house in the poem: he ' +
        'feeds the Burgundians, gives them gifts, marries his daughter to ' +
        'Giselher — and later has to choose between the oath he swore to ' +
        'Kriemhild and the friendship he has just given them. It kills him.',
    },
    {
      id: 'traismauer',
      name: 'Traismauer',
      kind: 'town',
      at: { x: 0.448, z: 0.481 },
      description:
        'Where Kriemhild waits on the way east, in one of Etzel’s houses, and ' +
        'the Hungarian and German trains meet. From here she is a queen of the ' +
        'Huns and no longer anybody’s sister.',
    },
    {
      id: 'tulln',
      name: 'Tulln',
      kind: 'town',
      at: { x: 0.497, z: 0.489 },
      description:
        'Where Etzel rides out to meet his bride, with twenty-four princes ' +
        'behind him. She marries him without loving him, having said plainly ' +
        'that she is a widow — and everyone treats that as settled.',
    },
    {
      id: 'vienna',
      name: 'Vienna',
      kind: 'city',
      at: { x: 0.544, z: 0.535 },
      description:
        'The wedding, seventeen days of it, at Whitsun. The poet counts the ' +
        'guests and the gifts. It is the last happy scene in the poem and it is ' +
        'nine hundred lines from the end of anyone.',
    },
    {
      id: 'etzelburg',
      name: 'Etzelburg',
      kind: 'capital',
      at: { x: 0.889, z: 0.696 },
      description:
        'Etzel’s seat on the Danube in Hungary, where the second half ends: a ' +
        'hall full of guests, the doors held, the building fired, and Kriemhild ' +
        'standing outside asking for the gold and getting told she will not ' +
        'have it while any of them lives. She takes Balmung and does the last ' +
        'killing herself.',
    },
    {
      id: 'gran',
      name: 'The Hall',
      kind: 'danger',
      at: { x: 0.86, z: 0.73 },
      description:
        'Ten thousand men go into a hall for a feast and the doors are held ' +
        'from outside. Dankwart fights his way in with the news; Hagen kills ' +
        'Etzel’s son at the table; and after that there is nothing in the poem ' +
        'but the inside of one burning building.',
    },
    {
      id: 'rhine-mouth',
      name: 'Downstream',
      kind: 'port',
      at: { x: -0.94, z: -0.87 },
      description:
        'The Lower Rhine running away north-west. The actual mouth is off the ' +
        'edge of this map, and so is the sea beyond it — twenty days with a ' +
        'good wind, the poem says, to Isenstein.',
    },
    {
      id: 'bohemia',
      name: 'The Bohemian Forest',
      kind: 'forest',
      at: { x: 0.06, z: 0.11 },
      description:
        'The wooded ring the eastern road goes round rather than through. It is ' +
        'the reason the Danube is the road at all: everything between the Rhine ' +
        'and Hungary that is not the river is hills and trees.',
    },
    {
      id: 'alps',
      name: 'The Alps',
      kind: 'peak',
      at: { x: 0.2, z: 0.93 },
      description:
        'The southern wall. Dietrich of Bern — Theodoric, king of the Ostrogoths ' +
        'in the songs — is an exile from the other side of them, living at ' +
        'Etzel’s court, and it is Dietrich who takes the last two Burgundians ' +
        'alive at the end.',
    },
  ],

  regions: [
    { id: 'r-rhine', name: 'The Rhine', at: { x: -0.78, z: -0.5 }, scale: 1.0 },
    { id: 'r-burgundy', name: 'BURGUNDY', at: { x: -0.6, z: 0.14 }, scale: 1.05 },
    { id: 'r-saxony', name: 'SAXONY', at: { x: -0.3, z: -0.8 } },
    { id: 'r-bavaria', name: 'BAVARIA', at: { x: 0.02, z: 0.6 } },
    { id: 'r-danube', name: 'The Danube', at: { x: 0.34, z: 0.63 }, scale: 1.0 },
    { id: 'r-hungary', name: 'THE LAND OF THE HUNS', at: { x: 0.78, z: 0.5 }, scale: 1.05 },
  ],

  routes: [
    {
      id: 'siegfried-south',
      name: 'Siegfried down the Rhine',
      color: '#ffd27a',
      style: 'solid',
      description:
        'Xanten to Worms with eleven companions, to see the Burgundians and ' +
        'their sister. He announces himself by offering to take their kingdom ' +
        'off them in single combat, which is how that generation says hello.',
      points: [
        { x: -0.905, z: -0.792 },
        { x: -0.86, z: -0.62 },
        { x: -0.794, z: -0.41 },
        { x: -0.72, z: -0.22 },
        { x: -0.626, z: -0.012 },
      ],
    },
    {
      id: 'isenstein-voyage',
      name: 'The voyage to Isenstein',
      color: '#6fb3d6',
      style: 'dashed',
      description:
        'Down the Rhine and out to sea for twenty days, to win Brünhild for ' +
        'Gunther by cheating — and to fetch the Nibelung army back as an escort ' +
        'so that the cheat looks like power.',
      points: [
        { x: -0.626, z: -0.012 },
        { x: -0.78, z: -0.35 },
        { x: -0.97, z: -0.62 },
        { x: -0.94, z: -0.87 },
        { x: -0.97, z: -0.965 },
      ],
    },
    {
      id: 'saxon-war',
      name: 'The Saxon war',
      color: '#d76b6b',
      style: 'solid',
      description:
        'North-east against Liudeger and Liudegast with a thousand men, and ' +
        'back with both kings as hostages. Siegfried wins Worms a war it could ' +
        'not have won, and is never quite forgiven for it.',
      points: [
        { x: -0.626, z: -0.012 },
        { x: -0.5, z: -0.35 },
        { x: -0.36, z: -0.66 },
        { x: -0.241, z: -0.923 },
      ],
    },
    {
      id: 'the-hunt',
      name: 'The hunt in the Odenwald',
      color: '#c98a5a',
      style: 'solid',
      description:
        'Out of Worms into the forest, a day’s hunting, and a footrace to a ' +
        'cold spring that only one of them knows the rules of.',
      points: [
        { x: -0.626, z: -0.012 },
        { x: -0.6, z: -0.02 },
        { x: -0.553, z: -0.008 },
      ],
    },
    {
      id: 'gold-in-the-river',
      name: 'The gold into the Rhine',
      color: '#e0c07a',
      style: 'dashed',
      description:
        'Twelve wagons, four days and nights of hauling, and then the whole ' +
        'hoard into the river at Lochheim under an oath of silence that outlives ' +
        'everyone who swore it.',
      points: [
        { x: -0.626, z: -0.012 },
        { x: -0.628, z: -0.039 },
      ],
    },
    {
      id: 'bride-east',
      name: 'The bride’s road east',
      color: '#b58fd0',
      style: 'solid',
      description:
        'Kriemhild to her second marriage: down the Danube through Passau, ' +
        'Bechelaren and Traismauer to meet Etzel at Tulln, and on to the wedding ' +
        'at Vienna. She goes east because a queen of the Huns can command an ' +
        'army, and she says so to nobody.',
      points: [
        { x: -0.626, z: -0.012 },
        { x: -0.42, z: 0.12 },
        { x: -0.2, z: 0.28 },
        { x: 0.06, z: 0.36 },
        { x: 0.114, z: 0.398 },
        { x: 0.197, z: 0.497 },
        { x: 0.374, z: 0.535 },
        { x: 0.448, z: 0.481 },
        { x: 0.497, z: 0.489 },
        { x: 0.544, z: 0.535 },
        { x: 0.889, z: 0.696 },
      ],
    },
    {
      id: 'burgundians-east',
      name: 'The Burgundians’ last ride',
      color: '#d76b6b',
      style: 'solid',
      description:
        'Thirteen years later, the same road, in the other frame of mind. Hagen ' +
        'takes the shield of the man he murdered, is told at the ford that none ' +
        'of them will come back, throws the chaplain in the river to test it, ' +
        'and rides on. They are called the Nibelungs from this point, because ' +
        'the gold has passed to them and so has what it does to people.',
      points: [
        { x: -0.626, z: -0.012 },
        { x: -0.4, z: 0.16 },
        { x: -0.16, z: 0.3 },
        { x: 0.06, z: 0.36 },
        { x: 0.114, z: 0.398 },
        { x: 0.374, z: 0.535 },
        { x: 0.6, z: 0.6 },
        { x: 0.78, z: 0.66 },
        { x: 0.889, z: 0.696 },
      ],
    },
  ],

  elements: [
    {
      id: 'hoard',
      name: 'The Nibelung Hoard',
      glyph: '💰',
      description:
        'So much gold that twelve wagons take four days to shift it, plus a ' +
        'wishing-rod that would have made its owner master of the world — which ' +
        'nobody in the poem ever thinks to use. It is the reason for the ' +
        'marriage, the murder, the war and the ending, and at no point does ' +
        'anyone spend any of it.',
      journey: [
        { marker: 'nibelungland', note: 'Won from Alberich and the sons of Nibelung.' },
        { marker: 'worms', sinceChapter: 8, note: 'Kriemhild’s morning-gift, brought to the Rhine.' },
        { marker: 'lochheim', sinceChapter: 10, note: 'Into the river, and nobody says where.' },
      ],
    },
    {
      id: 'balmung',
      name: 'Balmung',
      glyph: '⚔',
      description:
        'Siegfried’s sword, taken with the hoard. Hagen takes it off his body ' +
        'and wears it for thirteen years. Kriemhild takes it off Hagen at the ' +
        'very end and uses it on him herself — which is what finally makes ' +
        'Hildebrand kill her, because a queen should not be doing that.',
      journey: [
        { marker: 'nibelungland', note: 'Part of the same haul as the gold.' },
        { marker: 'xanten', sinceChapter: 3, note: 'Carried south to Worms.' },
        { marker: 'odenwald', sinceChapter: 9, note: 'Taken off the body at the spring.' },
        { marker: 'etzelburg', sinceChapter: 14, note: 'Back in Kriemhild’s hand, once.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · Siegfried',
      subtitle: 'A hero arrives at Worms and is useful to everybody',
      chapters: [
        {
          id: 'i-1',
          title: 'The dream at Worms',
          narration:
            'Kriemhild dreams she raises a falcon and two eagles tear it apart ' +
            'in front of her. Her mother says: that is a husband, and you will ' +
            'lose him. Kriemhild says she will not marry, then. The poem is ' +
            'thirty-nine chapters long and has told you the whole thing in the ' +
            'first one.',
          focus: { marker: 'worms', distance: 44, pitch: 46 },
          reveal: {
            markers: ['worms', 'minster', 'xanten'],
            regions: ['r-burgundy', 'r-rhine'],
          },
          highlight: { markers: ['worms'] },
        },
        {
          id: 'i-2',
          title: 'What Siegfried already had',
          narration:
            'Before any of this he had taken the Nibelung hoard, the sword ' +
            'Balmung and a cloak that makes a man invisible and gives him the ' +
            'strength of twelve — and he had killed a dragon and bathed in its ' +
            'blood, which made him proof against weapons everywhere except one ' +
            'patch of his back.',
          focus: { marker: 'drachenfels', distance: 34, pitch: 42 },
          reveal: { markers: ['drachenfels', 'nibelungland', 'rhine-mouth'] },
          highlight: { markers: ['drachenfels', 'nibelungland'] },
        },
        {
          id: 'i-3',
          title: 'Down the Rhine',
          narration:
            'He rides to Worms with eleven men and opens by offering to fight ' +
            'Gunther for the kingdom. They talk him out of it and he stays a ' +
            'year without once seeing the woman he came for.',
          focus: { marker: 'worms', distance: 40, pitch: 44 },
          reveal: { routes: ['siegfried-south'] },
          highlight: { routes: ['siegfried-south'] },
        },
        {
          id: 'i-4',
          title: 'The Saxon war',
          narration:
            'Saxony and Denmark declare war with forty thousand men. Siegfried ' +
            'takes a thousand and comes back with both kings. Worms now owes ' +
            'him everything, and Hagen has started doing arithmetic about what ' +
            'happens if he ever wants paying.',
          focus: { marker: 'saxony', distance: 46, pitch: 46 },
          reveal: { markers: ['saxony'], routes: ['saxon-war'], regions: ['r-saxony'] },
          highlight: { routes: ['saxon-war'] },
        },
        {
          id: 'i-5',
          title: 'Isenstein',
          narration:
            'Gunther wants Brünhild, who kills suitors who lose to her at ' +
            'stone-throwing. Siegfried does all three contests invisible while ' +
            'Gunther mimes the effort — and then has to do the wedding night ' +
            'too, because she ties Gunther up and hangs him on a nail. The price ' +
            'is Kriemhild’s hand, and a ring and a belt that Siegfried should ' +
            'not have kept.',
          focus: { marker: 'isenstein', distance: 46, pitch: 48 },
          reveal: { markers: ['isenstein'], routes: ['isenstein-voyage'] },
          highlight: { markers: ['isenstein'], routes: ['isenstein-voyage'] },
        },
      ],
    },
    {
      id: 'ii',
      title: 'II · The Murder',
      subtitle: 'A quarrel at a church door and a spring in the forest',
      chapters: [
        {
          id: 'ii-1',
          title: 'Two queens at the minster',
          narration:
            'Ten years on, Brünhild still thinks Siegfried is Gunther’s vassal ' +
            'and says so. In front of the church they argue about who goes in ' +
            'first, and Kriemhild ends it by holding up the ring and the belt ' +
            'and explaining where they came from.',
          focus: { marker: 'minster', distance: 26, pitch: 38 },
          highlight: { markers: ['minster'] },
        },
        {
          id: 'ii-2',
          title: 'The cross on the coat',
          narration:
            'Hagen goes to Kriemhild and offers to protect her husband’s back ' +
            'in the next war, if she will tell him where the weak spot is. She ' +
            'tells him, and sews a small cross on the coat so that he can find ' +
            'it. This is the most efficient scene in medieval literature.',
          focus: { marker: 'worms', distance: 30, pitch: 40 },
          highlight: { markers: ['worms'] },
        },
        {
          id: 'ii-3',
          title: 'The spring',
          narration:
            'The war is cancelled and a hunt is arranged instead. They race to ' +
            'a cold spring, and Siegfried — who has won the race — waits for the ' +
            'king to drink first, and lays his weapons down, and kneels. Hagen ' +
            'puts the spear through the cross.',
          focus: { marker: 'odenwald', distance: 22, pitch: 34 },
          reveal: { markers: ['odenwald', 'lorsch'], routes: ['the-hunt'] },
          highlight: { markers: ['odenwald'] },
        },
        {
          id: 'ii-4',
          title: 'On the threshold',
          narration:
            'They put the body outside Kriemhild’s door so that she will find ' +
            'it on the way to matins. At the funeral the wounds bleed when Hagen ' +
            'comes near, which everyone present understands. Nothing whatever ' +
            'happens to him.',
          focus: { marker: 'lorsch', distance: 26, pitch: 38 },
          highlight: { markers: ['lorsch', 'worms'] },
        },
        {
          id: 'ii-5',
          title: 'Into the river',
          narration:
            'Kriemhild has the hoard brought to Worms and starts giving it away ' +
            'to fighting men, which Hagen notices at once. So the gold goes into ' +
            'the Rhine at Lochheim, and the kings swear none of them will say ' +
            'where while any of the others lives.',
          focus: { marker: 'lochheim', distance: 24, pitch: 36 },
          reveal: { markers: ['lochheim'], routes: ['gold-in-the-river'] },
          highlight: { markers: ['lochheim'] },
        },
      ],
    },
    {
      id: 'iii',
      title: 'III · The Road East',
      subtitle: 'Thirteen years, one road, and a hall with the doors held',
      chapters: [
        {
          id: 'iii-1',
          title: 'The queen of the Huns',
          narration:
            'Etzel’s envoys come for a wife. Kriemhild says she is a widow and ' +
            'means it, and then works out what a queen of the Huns can command, ' +
            'and goes. Down the Danube through Passau and Bechelaren, and Etzel ' +
            'rides out to Tulln to meet her.',
          focus: { marker: 'passau', distance: 60, pitch: 50 },
          reveal: {
            markers: ['passau', 'eferding', 'poechlarn', 'traismauer', 'tulln', 'vienna', 'bohemia'],
            routes: ['bride-east'],
            regions: ['r-bavaria', 'r-danube'],
          },
          highlight: { routes: ['bride-east'] },
        },
        {
          id: 'iii-2',
          title: 'The invitation',
          narration:
            'Thirteen years and a son later, she asks Etzel to invite her ' +
            'brothers for a midsummer feast. Etzel, who has never understood any ' +
            'of this, is delighted. Hagen says plainly that anyone who rides ' +
            'east is riding to his death, and is told he is afraid, and so they ' +
            'go.',
          focus: { marker: 'etzelburg', distance: 56, pitch: 50 },
          reveal: { markers: ['etzelburg', 'gran', 'alps'], regions: ['r-hungary'] },
          highlight: { markers: ['etzelburg'] },
        },
        {
          id: 'iii-3',
          title: 'The ford',
          narration:
            'At the Danube Hagen finds water-sprites bathing and takes their ' +
            'clothes. They tell him what he already suspects: not one of you ' +
            'will come home, except the chaplain. So he throws the chaplain into ' +
            'the river — and the man cannot swim, and reaches the bank anyway. ' +
            'Hagen breaks up the boat and rides on.',
          focus: { marker: 'danube-crossing', distance: 32, pitch: 40 },
          reveal: { markers: ['danube-crossing'], routes: ['burgundians-east'] },
          highlight: { markers: ['danube-crossing'], routes: ['burgundians-east'] },
        },
        {
          id: 'iii-4',
          title: 'Bechelaren',
          narration:
            'Rüdiger takes them in, feeds them, gives Hagen a shield and ' +
            'Giselher his daughter. Later, in the hall, Kriemhild holds him to ' +
            'the oath he swore her, and he has to go in against the men he has ' +
            'just given gifts to. He and Gernot kill each other with the swords ' +
            'they exchanged that week.',
          focus: { marker: 'poechlarn', distance: 34, pitch: 42 },
          highlight: { markers: ['poechlarn'] },
        },
        {
          id: 'iii-5',
          title: 'The hall',
          narration:
            'The doors are held from outside and the building is fired, and the ' +
            'men inside drink blood to stay alive and hold it anyway. It goes on ' +
            'for nine chapters. Dietrich takes the last two alive at the end, ' +
            'and hands them over.',
          focus: { marker: 'gran', distance: 24, pitch: 36 },
          highlight: { markers: ['gran', 'etzelburg'] },
        },
        {
          id: 'iii-6',
          title: 'Where the gold is',
          narration:
            'Kriemhild asks Hagen for the hoard. He says he swore not to tell ' +
            'while any of his lords lived — so she has Gunther’s head brought ' +
            'out, and asks again. Now nobody living knows but me, he says, and ' +
            'you will never have it. She takes Balmung and kills him, and ' +
            'Hildebrand kills her for it, and the poem stops. Nobody wins ' +
            'anything and the gold is still in the river.',
          focus: { marker: 'etzelburg', distance: 30, pitch: 38 },
          highlight: { markers: ['etzelburg', 'lochheim'], routes: ['gold-in-the-river'] },
        },
      ],
    },
  ],
}
