import type { Story } from '../types'
import harzHeight from '../assets/harz-height.png'

/**
 * Faust — Goethe's, in both parts (I, 1808; II, 1832; Goethe d. 1832 → public
 * domain). The one candidate in this atlas whose extra floors come out of the
 * text rather than being invented for the map:
 *
 *   +1  The Mountain Gorges, where Part II ends — the ascent, the anchorites
 *       on the rock terraces, and the last four lines of the whole thing.
 *    0  Germany: a study, a street, a tavern in Leipzig, a garden, a prison,
 *       and the Brocken on Walpurgis Night.
 *   -1  The Realm of the Mothers, where Faust is sent in Part II for the key
 *       and finds neither place nor time nor anything to stand on.
 *
 * The surface uses a REAL heightmap of central Germany, with markers at their
 * true coordinates —
 *
 *   map x = (lon − 6.5) / 4.25 − 1     map z = (54.0 − lat) / 2.5 − 1
 *
 * Goethe never names Faust's town, so the small-town scenes — the street, the
 * garden, the cathedral, the prison — sit around Wittenberg, where the old
 * chapbook and Marlowe both put him, and say so in their own text.
 *
 * Narration paraphrases the play; it quotes no translation.
 */
export const faust: Story = {
  id: 'faust',
  title: 'Faust',
  subtitle: 'A wager, a mountain and two floors that are not places',
  author: 'J. W. von Goethe',
  region: 'Germany, the Mothers & the gorges',
  epoch: 'Parts I & II · 1808 and 1832',
  group: 'epic',
  intro:
    'A scholar who has read everything and knows nothing worth knowing bets ' +
    'his soul that no moment will ever be good enough to want to keep. Press ' +
    '▶ Play story to follow both parts — the tavern in Leipzig, the witches ' +
    'on the Brocken, the girl in the prison, and the reclaimed coast at the ' +
    'end where he finally says the sentence that loses the bet. Use the floor ' +
    'switcher for the two places that are not places: the Mothers below and ' +
    'the gorges above.',
  surfaceName: 'Germany',
  ambient: {
    trees: 0.62,
    treeKind: 'conifer',
    birds: 4,
    birdKind: 'raven',
    // The weather on Walpurgis Night, sitting over the Harz where it belongs.
    rain: true,
    rainArea: { x0: -0.2, x1: 0.16, z0: -0.28, z1: 0.0 },
  },
  terrain: {
    music: {
      // Written in the shape of the Dies Irae's opening — the same descending
      // church figure that Gretchen hears the choir sing behind her in the
      // cathedral scene, when the Evil Spirit is talking in her other ear.
      // The chant itself is 13th century and public domain; this is a setting
      // of that shape rather than a transcription.
      title: 'The Cathedral Scene',
      credit: 'After the Dies Irae plainchant · original',
      melody:
        'F4:2 E4:2 F4:1 D4:1 E4:2 C4:2 D4:4 r:1 ' +
        'F4:2 G4:1 A4:1 A4:2 G4:2 A4:2 F4:4 r:1 ' +
        'A4:2 A4:1 G4:1 F4:2 E4:2 F4:2 D4:2 C4:4 r:2',
      bass: 'D2:8 A2:8 Bb2:8 D2:8',
      tempo: 50,
      voice: 'strings',
      mood: 'dark',
    },
    seed: 'faust-1', // unused: the heightmap takes precedence
    heightmap: harzHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.005,
    // 589 km across by 556 km down.
    aspect: 1.06,
    // Start high. Part I is inland and Part II ends on a coast at the top of
    // the map; from the usual low angle the whole northern half is squeezed
    // into a strip along the horizon.
    overhead: true,
    heightScale: 15,
    rivers: 5,
    biomes: [
      { maxHeight: 0.005, color: '#2c5a74', name: 'The North Sea' },
      { maxHeight: 0.05, color: '#cfc79f', name: 'Marsh' },
      { maxHeight: 0.16, color: '#6f9b57', name: 'Plain' },
      { maxHeight: 0.34, color: '#4f8a4a', name: 'Farmland' },
      { maxHeight: 0.56, color: '#3d6f45', name: 'Forest' },
      { maxHeight: 0.8, color: '#7c7f68', name: 'Uplands' },
      { maxHeight: 1.0, color: '#b8b4ac', name: 'The Brocken' },
    ],
  },

  markers: [
    {
      id: 'wittenberg',
      name: 'Wittenberg',
      kind: 'capital',
      at: { x: 0.446, z: -0.147 },
      description:
        'Faust’s study — the high-vaulted gothic room where the play opens with ' +
        'a man who has taken every degree there is and says so bitterly in the ' +
        'first speech. Goethe never names the town. The old chapbook and ' +
        'Marlowe both put him here, so the map does.',
    },
    {
      id: 'street',
      name: 'The Street',
      kind: 'landmark',
      at: { x: 0.435, z: -0.152 },
      description:
        'Where he sees Gretchen coming out of confession and stops her, and ' +
        'she tells him she is neither a lady nor beautiful and can get home ' +
        'without help. He is fifty-something and has just been made young by a ' +
        'witch. It is the second scene of the disaster.',
    },
    {
      id: 'garden',
      name: 'Marthe’s Garden',
      kind: 'forest',
      at: { x: 0.456, z: -0.138 },
      description:
        'The garden with the flower, and the summerhouse. Gretchen asks him ' +
        'whether he believes in God and he gives her four hundred words of ' +
        'magnificent evasion. She hears it for what it is and says so: you have ' +
        'no Christianity.',
    },
    {
      id: 'cathedral',
      name: 'The Cathedral',
      kind: 'ruin',
      at: { x: 0.449, z: -0.16 },
      description:
        'Requiem for her mother, whom she killed with a sleeping draught she ' +
        'was told was harmless. The choir sings the Dies Irae and an Evil ' +
        'Spirit stands at her shoulder listing what she has done, in time with ' +
        'it, until she faints.',
    },
    {
      id: 'prison',
      name: 'The Prison',
      kind: 'danger',
      at: { x: 0.464, z: -0.162 },
      description:
        'The end of Part I. She has drowned the child and is to be executed in ' +
        'the morning, and she has gone out of her mind. Faust comes with the ' +
        'keys and she will not go — she is judged, she says, and she will take ' +
        'it. A voice from above says: saved. Mephistopheles says: come here, ' +
        'and pulls him out.',
    },
    {
      id: 'leipzig',
      name: 'Auerbach’s Cellar',
      kind: 'city',
      at: { x: 0.382, z: 0.064 },
      description:
        'A real tavern in Leipzig, still open, where Mephistopheles bores holes ' +
        'in the table and draws whatever wine each drinker names out of them. ' +
        'Goethe drank here as a student, and the cellar had Faust paintings on ' +
        'the wall before he ever wrote a line of it.',
    },
    {
      id: 'witch-kitchen',
      name: 'The Witch’s Kitchen',
      kind: 'danger',
      at: { x: 0.047, z: -0.048 },
      description:
        'Apes stirring a cauldron and a mirror with an impossible woman in it. ' +
        'The draught takes thirty years off him — and, as Mephistopheles points ' +
        'out afterwards, will now make him see that woman in every female body ' +
        'he meets. Which is precisely what happens next.',
    },
    {
      id: 'brocken',
      name: 'The Brocken',
      kind: 'peak',
      at: { x: -0.032, z: -0.12 },
      description:
        'Walpurgis Night, the eve of the first of May, and every witch in ' +
        'Germany going up the Harz. The real summit is 1,141 m and makes its own ' +
        'weather; the mountain has been the meeting-place of the sabbath in ' +
        'German folklore since long before Goethe used it. He is halfway up it ' +
        'dancing when he sees Gretchen’s face with a red line round the throat.',
    },
    {
      id: 'harz',
      name: 'The Harz',
      kind: 'forest',
      at: { x: 0.0, z: -0.08 },
      description:
        'The forested block the Brocken stands in — old mining country, full of ' +
        'its own legends about the mountain. The witches come up through it ' +
        'from every direction on one night of the year, and Faust and ' +
        'Mephistopheles walk up with them.',
    },
    {
      id: 'knittlingen',
      name: 'Knittlingen',
      kind: 'town',
      at: { x: -0.469, z: 0.991 },
      description:
        'Where the actual Johann Georg Faust was born around 1480 — a real ' +
        'travelling magician and astrologer who was thrown out of several towns ' +
        'and died, the story goes, in an alchemical explosion. Everything else ' +
        'is what four centuries of writers did to his name.',
      link: {
        world: 'nibelungen',
        marker: 'worms',
        note: 'Worms and the Rhine, an hour north — the other German epic on this atlas.',
      },
    },
    {
      id: 'emperor',
      name: 'The Emperor’s Court',
      kind: 'capital',
      at: { x: -0.035, z: 0.78 },
      description:
        'Part II opens here. The treasury is empty, so Mephistopheles invents ' +
        'paper money — banknotes against gold that is theoretically still buried ' +
        'somewhere in the ground — and the court is delighted. Goethe wrote ' +
        'this having watched the assignat inflation of the 1790s.',
    },
    {
      id: 'reclaimed-coast',
      name: 'The Reclaimed Coast',
      kind: 'port',
      at: { x: -0.518, z: -0.888 },
      description:
        'The end of Part II. The Emperor gives him the sea, and Faust spends ' +
        'his last years dyking and draining it into land for a free people to ' +
        'live on — while blind, while what he can hear is actually his own ' +
        'grave being dug. He says the sentence that loses the wager anyway, and ' +
        'the wager is the one thing he wins by losing.',
    },
    {
      id: 'philemon',
      name: 'Philemon and Baucis',
      kind: 'ruin',
      at: { x: -0.459, z: -0.84 },
      description:
        'An old couple with a cottage and a lime tree and a chapel, on the one ' +
        'patch of the new land Faust does not own. He tells Mephistopheles to ' +
        'move them. Mephistopheles burns them in it. Faust says he wanted an ' +
        'exchange, not a robbery — which is the last thing the play lets him ' +
        'say about his own methods.',
    },
    {
      id: 'greece',
      name: 'The Road to Greece',
      kind: 'landmark',
      at: { x: 0.953, z: 0.94 },
      description:
        'Part II goes to Thessaly for a classical Walpurgis Night on the ' +
        'Pharsalian fields, and then to Sparta for Helen of Troy, who Faust ' +
        'marries and has a son by. All of it is off the south-east corner of ' +
        'this map, which only holds the German half of the play.',
    },
    {
      id: 'elbe',
      name: 'The Elbe',
      kind: 'landmark',
      at: { x: 0.207, z: -0.252 },
      description:
        'The river running north past Wittenberg and out to the sea Faust ' +
        'eventually takes land from. Part I is inland and Part II ends on a ' +
        'coast, and this is the line between them.',
    },
  ],

  regions: [
    { id: 'r-harz', name: 'THE HARZ', at: { x: -0.1, z: -0.44 }, scale: 1.0 },
    { id: 'r-saxony', name: 'SAXONY', at: { x: 0.5, z: -0.55 } },
    { id: 'r-north', name: 'THE NORTH SEA', at: { x: -0.78, z: -0.93 }, scale: 0.95 },
    { id: 'r-south', name: 'THE SOUTH', at: { x: -0.4, z: 0.82 } },
  ],

  routes: [
    {
      id: 'the-wager',
      name: 'Out of the study',
      color: '#ffd27a',
      style: 'solid',
      description:
        'Study to street to tavern: the first thing the devil does with a man ' +
        'who has spent his life reading is take him drinking, and the second is ' +
        'take him to a witch.',
      points: [
        { x: 0.446, z: -0.147 },
        { x: 0.435, z: -0.152 },
        { x: 0.408, z: -0.044 },
        { x: 0.382, z: 0.064 },
        { x: 0.214, z: 0.008 },
        { x: 0.047, z: -0.048 },
      ],
    },
    {
      id: 'gretchen',
      name: 'The Gretchen tragedy',
      color: '#d76b6b',
      style: 'solid',
      description:
        'Street, garden, cathedral, prison. Four scenes and a dead mother, a ' +
        'dead brother, a drowned child and a girl on a scaffold — and the man ' +
        'responsible is dragged offstage to Act Two.',
      points: [
        { x: 0.435, z: -0.152 },
        { x: 0.456, z: -0.138 },
        { x: 0.449, z: -0.16 },
        { x: 0.464, z: -0.162 },
      ],
    },
    {
      id: 'walpurgis',
      name: 'Up the Brocken',
      color: '#b58fd0',
      style: 'dashed',
      description:
        'The witches’ road on the eve of May. Everything in Germany that flies ' +
        'converges on one summit in the Harz, and Faust walks up with it — and ' +
        'sees, in the middle of the dance, a girl with a red thread round her ' +
        'neck.',
      points: [
        { x: 0.047, z: -0.048 },
        { x: 0.0, z: -0.08 },
        { x: -0.032, z: -0.12 },
      ],
    },
    {
      id: 'part-two',
      name: 'Part II: court, sea and coast',
      color: '#8fb8d8',
      style: 'dashed',
      description:
        'The second part leaves the small town entirely: an emperor’s court and ' +
        'invented money, a long detour to Greece that runs off this map, and ' +
        'then the northern coast, where an old man takes land from the sea and ' +
        'burns two people out of a cottage for it.',
      points: [
        { x: -0.035, z: 0.78 },
        { x: -0.183, z: 0.213 },
        { x: -0.332, z: -0.354 },
        { x: -0.459, z: -0.84 },
        { x: -0.518, z: -0.888 },
      ],
    },
  ],

  elements: [
    {
      id: 'the-bet',
      name: 'The Wager',
      glyph: '✍',
      description:
        'Signed in blood, and not the bargain everyone remembers. Faust does ' +
        'not sell his soul for twenty-four years of power: he bets that ' +
        'Mephistopheles can never show him a moment he would ask to stay. If ' +
        'he ever says "stay, you are so beautiful", he loses. He says it at the ' +
        'very end, about a future he will not live to see, and is carried up ' +
        'anyway.',
      journey: [
        { marker: 'wittenberg', note: 'Signed in the study, in blood, for a joke about pedantry.' },
        { marker: 'prison', sinceChapter: 6, note: 'The cost of it, in one cell.' },
        { marker: 'emperor', sinceChapter: 8, note: 'Held, through paper money and Helen.' },
        { marker: 'reclaimed-coast', sinceChapter: 11, note: 'Lost — and that is how it is won.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · The Wager',
      subtitle: 'A study, a poodle, a tavern and a witch',
      chapters: [
        {
          id: 'i-1',
          title: 'A bet in heaven',
          narration:
            'Before any of it, a Prologue: the Lord and Mephistopheles have a ' +
            'civil conversation about whether a striving man can be pulled off ' +
            'course. The Lord says try. Nothing in the play afterwards is ' +
            'outside the terms agreed here.',
          focus: { marker: 'wittenberg', distance: 44, pitch: 46 },
          reveal: {
            markers: ['wittenberg', 'street', 'elbe'],
            regions: ['r-saxony', 'r-harz'],
          },
          highlight: { markers: ['wittenberg'] },
        },
        {
          id: 'i-2',
          title: 'A man who has read everything',
          narration:
            'Philosophy, law, medicine and — worse luck — theology, studied ' +
            'through and through, and he is no wiser than before and knows it. ' +
            'He tries magic, tries the Earth Spirit, tries poison, and is ' +
            'stopped by Easter bells he no longer believes but still remembers.',
          focus: { marker: 'wittenberg', distance: 30, pitch: 40 },
          highlight: { markers: ['wittenberg'] },
        },
        {
          id: 'i-3',
          title: 'Auerbach’s cellar',
          narration:
            'The devil’s idea of showing a scholar the world starts with four ' +
            'drunks in a Leipzig tavern and wine drawn out of holes bored in ' +
            'the table. It is a real cellar, it is still there, and Goethe drank ' +
            'in it as a law student.',
          focus: { marker: 'leipzig', distance: 30, pitch: 40 },
          reveal: { markers: ['leipzig'], routes: ['the-wager'] },
          highlight: { markers: ['leipzig'] },
        },
        {
          id: 'i-4',
          title: 'The witch’s kitchen',
          narration:
            'A cauldron, some apes, a mirror with a woman in it, and a draught ' +
            'that takes thirty years off him. Mephistopheles notes, drily, that ' +
            'he will now see that face on every woman alive. This is the ' +
            'machinery of the next four scenes, installed in advance.',
          focus: { marker: 'witch-kitchen', distance: 30, pitch: 40 },
          reveal: { markers: ['witch-kitchen', 'harz'] },
          highlight: { markers: ['witch-kitchen'] },
        },
      ],
    },
    {
      id: 'ii',
      title: 'II · Gretchen',
      subtitle: 'Four scenes, and everyone in them dead but one',
      chapters: [
        {
          id: 'ii-1',
          title: 'In the street',
          narration:
            'He stops her coming out of confession and offers his arm. She ' +
            'tells him she is not a lady and can walk home by herself. Within ' +
            'the hour he has told Mephistopheles to get him jewellery and get ' +
            'him into her room, and been told that these things take time.',
          focus: { marker: 'street', distance: 24, pitch: 36 },
          reveal: { markers: ['garden'], routes: ['gretchen'] },
          highlight: { markers: ['street'] },
        },
        {
          id: 'ii-2',
          title: 'The question in the garden',
          narration:
            'She asks him whether he believes in God. He answers at length and ' +
            'beautifully and does not answer, and she says: you have no ' +
            'Christianity. Then he gives her the sleeping draught for her ' +
            'mother, and says it is harmless.',
          focus: { marker: 'garden', distance: 22, pitch: 36 },
          highlight: { markers: ['garden'] },
        },
        {
          id: 'ii-3',
          title: 'The Dies Irae',
          narration:
            'Her mother is dead of the draught and her brother of Faust’s sword ' +
            'in the street, and she is pregnant. At the requiem the choir sings ' +
            'the day of wrath and an Evil Spirit reads the charges into her ear ' +
            'in time with it until she goes down.',
          focus: { marker: 'cathedral', distance: 22, pitch: 36 },
          reveal: { markers: ['cathedral'] },
          highlight: { markers: ['cathedral'] },
        },
        {
          id: 'ii-4',
          title: 'Walpurgis Night',
          narration:
            'And while that is happening, Faust is on the Brocken at the ' +
            'sabbath, being kept entertained. In the middle of a dance he sees ' +
            'a pale girl with a thin red line round her throat, and asks about ' +
            'her, and is told to leave it.',
          focus: { marker: 'brocken', distance: 30, pitch: 40 },
          reveal: { markers: ['brocken'], routes: ['walpurgis'] },
          highlight: { markers: ['brocken'], routes: ['walpurgis'] },
        },
        {
          id: 'ii-5',
          title: 'The prison',
          narration:
            'She drowned the child. She is to die in the morning and her mind ' +
            'has gone. He comes with the keys and she will not use them: she is ' +
            'judged and she will take the judgement. A voice says she is saved. ' +
            'Mephistopheles says come here, and the first part ends.',
          focus: { marker: 'prison', distance: 20, pitch: 34 },
          reveal: { markers: ['prison'] },
          highlight: { markers: ['prison'] },
        },
      ],
    },
    {
      id: 'iii',
      title: 'III · The Second Part',
      subtitle: 'Paper money, the Mothers, Helen, and a coast',
      chapters: [
        {
          id: 'iii-1',
          title: 'Money out of nothing',
          narration:
            'Part II opens at an emperor’s court with an empty treasury, and ' +
            'Mephistopheles solves it by printing notes against gold that is ' +
            'still in the ground and may not be there. Everyone is delighted. ' +
            'Goethe had watched this happen in France.',
          focus: { marker: 'emperor', distance: 40, pitch: 44 },
          reveal: { markers: ['emperor', 'knittlingen', 'greece'], regions: ['r-south'] },
          highlight: { markers: ['emperor'] },
        },
        {
          id: 'iii-2',
          title: 'Down to the Mothers',
          level: 'mothers',
          narration:
            'The Emperor wants Helen of Troy produced at court. To fetch her, ' +
            'Faust has to go where Mephistopheles cannot: to the Mothers. There ' +
            'is no road and no time and nothing to stand on, and he takes a key ' +
            'and goes.',
          focus: { marker: 'tripod', distance: 40, pitch: 44 },
          reveal: {
            markers: ['no-place', 'tripod', 'forms', 'the-key', 'ascent-shaft'],
            routes: ['descent'],
            regions: ['r-mothers'],
          },
          highlight: { markers: ['tripod'], routes: ['descent'] },
        },
        {
          id: 'iii-3',
          title: 'Helen, and the road to Greece',
          narration:
            'Then a classical Walpurgis Night on the Pharsalian fields, and ' +
            'Sparta, and Helen — who Faust marries and has a son by, a boy who ' +
            'insists on flying and falls. She goes after him and leaves her ' +
            'clothes behind. All of that is off the south-east corner of this ' +
            'map.',
          focus: { marker: 'greece', distance: 54, pitch: 48 },
          highlight: { markers: ['greece'] },
        },
        {
          id: 'iii-4',
          title: 'Land taken from the sea',
          narration:
            'The Emperor gives him a stretch of coast, and he spends his last ' +
            'years dyking and draining and pushing the water back. It is the ' +
            'first thing in either part he does that is not for himself.',
          focus: { marker: 'reclaimed-coast', distance: 44, pitch: 46 },
          reveal: {
            markers: ['reclaimed-coast', 'philemon'],
            routes: ['part-two'],
            regions: ['r-north'],
          },
          highlight: { markers: ['reclaimed-coast'], routes: ['part-two'] },
        },
        {
          id: 'iii-5',
          title: 'The cottage and the lime trees',
          narration:
            'One patch of the new coast is not his: an old couple with a ' +
            'cottage, a chapel and two lime trees. He tells Mephistopheles to ' +
            'arrange a move. Mephistopheles burns them in the house. Faust says ' +
            'he wanted an exchange, not a robbery, and that is the last thing he ' +
            'ever says about his own methods.',
          focus: { marker: 'philemon', distance: 24, pitch: 36 },
          highlight: { markers: ['philemon'] },
        },
        {
          id: 'iii-6',
          title: 'Stay, you are so beautiful',
          narration:
            'Blind, at a hundred, hearing what he thinks are spades cutting a ' +
            'new dyke — and which are actually lemures digging his grave — he ' +
            'imagines the free people who will live on this land, and says to ' +
            'that imagined moment: stay, you are so beautiful. That is the ' +
            'wager, lost.',
          focus: { marker: 'reclaimed-coast', distance: 24, pitch: 36 },
          highlight: { markers: ['reclaimed-coast'] },
        },
        {
          id: 'iii-7',
          title: 'The gorges',
          level: 'gorges',
          narration:
            'Mephistopheles is cheated of the soul at the graveside by a shower ' +
            'of roses and his own distraction, and the play ends up a mountain: ' +
            'terraces of anchorites, rising choirs, Gretchen among the ' +
            'penitents asking to be allowed to teach him, and four lines saying ' +
            'that everything transient is only a likeness.',
          focus: { marker: 'summit-choir', distance: 42, pitch: 44 },
          reveal: {
            markers: ['pater-profundus', 'pater-seraphicus', 'penitents', 'summit-choir', 'the-roses'],
            routes: ['ascent'],
            regions: ['r-gorges'],
          },
          highlight: { markers: ['summit-choir'], routes: ['ascent'] },
        },
      ],
    },
  ],

  levels: [
    {
      id: 'gorges',
      title: 'The Mountain Gorges',
      subtitle: 'Where Part II ends',
      tier: 1,
      terrain: {
        music: {
          title: 'Chorus Mysticus',
          credit: 'Original, written for this atlas',
          melody:
            'C5:3 B4:1 A4:2 G4:2 A4:4 r:2 E5:2 D5:2 C5:3 B4:1 A4:4 r:2 ' +
            'G4:2 C5:2 E5:2 G5:4 E5:2 C5:6 r:2',
          bass: 'C3:8 G2:8 A2:8 C3:8',
          tempo: 46,
          voice: 'bell',
          mood: 'heaven',
        },
        seed: 'faust-gorges-2',
        sky: 'heaven',
        seaLevel: 0.44,
        heightScale: 22,
        octaves: 5,
        frequency: 2.2,
        islandFalloff: 0.4,
        waterColor: '#eef4fb',
        rivers: 0,
        biomes: [
          { maxHeight: 0.44, color: '#dfe9f5', name: 'Cloud' },
          { maxHeight: 0.54, color: '#cfddf0', name: 'Mist' },
          { maxHeight: 0.7, color: '#b9c3cf', name: 'Rock terraces' },
          { maxHeight: 0.86, color: '#e3e0d2', name: 'The high cells' },
          { maxHeight: 1.0, color: '#fff7e2', name: 'The light' },
        ],
      },
      ambient: { trees: 0.14, treeColor: '#7d8a6a', birds: 9, rain: false },
      markers: [
        {
          id: 'pater-profundus',
          name: 'Pater Profundus',
          kind: 'landmark',
          at: { x: -0.42, z: 0.34 },
          description:
            'The lowest of the anchorites, down in the gorge where the torrent ' +
            'is loudest, arguing from the violence of the water and the ' +
            'lightning that love is a force of the same kind.',
        },
        {
          id: 'pater-seraphicus',
          name: 'Pater Seraphicus',
          kind: 'landmark',
          at: { x: -0.1, z: 0.02 },
          description:
            'Halfway up, and the one who takes the souls of children that died ' +
            'at birth into himself so that they can borrow his eyes and see the ' +
            'mountain they are on.',
        },
        {
          id: 'the-roses',
          name: 'Where the Roses Fell',
          kind: 'danger',
          at: { x: 0.34, z: 0.5 },
          description:
            'Not strictly on this floor. At the graveside below, angels ' +
            'scattered roses that burned Mephistopheles wherever they touched ' +
            'him, and he was so distracted by finding them attractive that they ' +
            'carried the soul off over his head. He complains about it at ' +
            'length. It is the funniest scene in the play.',
        },
        {
          id: 'penitents',
          name: 'The Penitents',
          kind: 'city',
          at: { x: 0.18, z: -0.2 },
          description:
            'Three named women out of the gospels, and a fourth called only ' +
            'Una Poenitentium — once called Gretchen. She asks to be allowed to ' +
            'teach him, because he is dazzled by the new day and does not know ' +
            'where he is.',
        },
        {
          id: 'summit-choir',
          name: 'The Chorus Mysticus',
          kind: 'capital',
          at: { x: 0.0, z: -0.56 },
          description:
            'The last four lines of the whole thing, sixty years in the ' +
            'writing: everything transient is only a likeness, the ' +
            'unattainable happens here, the indescribable is done — and the ' +
            'eternal feminine draws us onward.',
        },
      ],
      routes: [
        {
          id: 'the-roses-fall',
          name: 'The Angels’ Descent',
          style: 'dashed',
          color: '#f0c8d8',
          points: [
            { x: 0.34, z: 0.5 },
            { x: 0.3, z: 0.16 },
            { x: 0.18, z: -0.2 },
            { x: 0.08, z: -0.42 },
            { x: 0.0, z: -0.56 },
          ],
          description:
            'The younger angels come down scattering roses, which burn ' +
            'Mephistopheles wherever they touch him and distract him so ' +
            'thoroughly that Faust’s immortal part is carried off while he ' +
            'is busy lusting after them. He loses the wager to flowers.',
        },
        {
          id: 'ascent',
          name: 'The ascent',
          color: '#f0e2b0',
          style: 'solid',
          description:
            'Up the terraces from the loudest water to the quietest light: ' +
            'Profundus, Seraphicus, the penitents, and the chorus.',
          points: [
            { x: -0.42, z: 0.34 },
            { x: -0.1, z: 0.02 },
            { x: 0.18, z: -0.2 },
            { x: 0.0, z: -0.56 },
          ],
        },
      ],
      regions: [{ id: 'r-gorges', name: 'The Gorges', at: { x: -0.6, z: -0.5 }, scale: 1.05 }],
    },
    {
      id: 'mothers',
      title: 'The Mothers',
      subtitle: 'No place, no time, nothing to stand on',
      tier: -1,
      terrain: {
        music: {
          title: 'Descent to the Mothers',
          credit: 'Original, written for this atlas',
          melody:
            'D3:4 Eb3:2 D3:2 C3:4 r:2 D3:2 F3:2 Eb3:3 D3:1 C3:4 r:2 ' +
            'Ab3:2 G3:2 F3:2 Eb3:2 D3:6 r:3',
          bass: 'D2:12 Eb2:12',
          tempo: 40,
          voice: 'strings',
          mood: 'dark',
        },
        seed: 'faust-mothers-3',
        sky: 'cavern',
        seaLevel: 0.5,
        heightScale: 14,
        octaves: 3,
        frequency: 1.4,
        islandFalloff: 0.3,
        waterColor: '#0d1620',
        riverColor: '#5f6f86',
        rivers: 0,
        biomes: [
          { maxHeight: 0.5, color: '#0b121a', name: 'The void' },
          { maxHeight: 0.62, color: '#1c2430', name: 'Formlessness' },
          { maxHeight: 0.78, color: '#333b48', name: 'Shapes forming' },
          { maxHeight: 1.0, color: '#5a5f6b', name: 'The tripod’s glow' },
        ],
      },
      ambient: { trees: 0, birds: 0, wisps: 9, rain: false },
      markers: [
        {
          id: 'no-place',
          name: 'Nothing to Stand On',
          kind: 'danger',
          at: { x: -0.5, z: 0.44 },
          description:
            'Mephistopheles cannot come and does not want to describe it. There ' +
            'is no road, no lock to pick, no ground, no direction. Faust asks ' +
            'what he will find and is told: nothing. He says that is where he ' +
            'expects to find everything.',
        },
        {
          id: 'the-key',
          name: 'The Key',
          kind: 'landmark',
          at: { x: -0.16, z: 0.16 },
          description:
            'Small, and it grows in the hand and shines. It is the only thing ' +
            'that works down here, and the whole instruction is: hold it out, ' +
            'and follow where it pulls.',
        },
        {
          id: 'forms',
          name: 'The Forms',
          kind: 'forest',
          at: { x: 0.34, z: 0.3 },
          description:
            'Everything that has ever had a shape, drifting as the pattern of ' +
            'itself — the images of all created things, going about their ' +
            'business without knowing they are images. The Mothers sit among ' +
            'them and some are seated and some walk about.',
        },
        {
          id: 'tripod',
          name: 'The Glowing Tripod',
          kind: 'capital',
          at: { x: 0.06, z: -0.14 },
          description:
            'Touch the tripod with the key and it follows you up. That is how ' +
            'Helen of Troy is fetched to an emperor’s court as an after-dinner ' +
            'entertainment — which is exactly as bad an idea as it sounds, and ' +
            'Faust ruins it by trying to touch her.',
        },
        {
          id: 'ascent-shaft',
          name: 'The Way Back',
          kind: 'port',
          at: { x: 0.5, z: -0.46 },
          description:
            'Stamp to go down and stamp to come up, Mephistopheles says, and ' +
            'that is the entire navigation. Take the floor switcher up two to ' +
            'get back to Germany.',
        },
      ],
      routes: [
        {
          id: 'descent',
          name: 'Down, and back with the tripod',
          color: '#7f8aa0',
          style: 'solid',
          description:
            'Into the nothing, to the key, through the drifting forms to the ' +
            'tripod, and up again with Helen following.',
          points: [
            { x: -0.5, z: 0.44 },
            { x: -0.16, z: 0.16 },
            { x: 0.34, z: 0.3 },
            { x: 0.06, z: -0.14 },
            { x: 0.5, z: -0.46 },
          ],
        },
      ],
      regions: [{ id: 'r-mothers', name: 'No Place', at: { x: -0.6, z: -0.4 }, scale: 1.1 }],
    },
  ],
}
