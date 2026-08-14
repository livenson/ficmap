import type { Story } from '../types'
import ottokarHeight from '../assets/ottokar-height.png'

/**
 * König Ottokars Glück und Ende — Franz Grillparzer's tragedy of 1823-25, read
 * from the German text (Project Gutenberg #9046; Grillparzer d. 1872, so public
 * domain by any measure). Narration paraphrases the play; it quotes no
 * translation.
 *
 * Austria's own national drama, and the second world in this atlas to stand on
 * Austrian ground — the Nibelungenlied already rides the Danube through Passau,
 * Pöchlarn, Tulln and Vienna. This one crosses that road once, at Vienna, and
 * otherwise looks north into Bohemia and east onto the Marchfeld, where in 1278
 * the Habsburgs became an Austrian house for the next six hundred years.
 *
 * The play's own scene headings supply most of the geography, and they are
 * specific: the castle at Prague; the Bohemian camp on the LEFT bank of the
 * Danube; the imperial camp on an island in the Danube the play calls Kaumberg;
 * open country by the March; and the churchyard at Götzendorf, where Act V
 * opens among the Bohemian outposts, with Angern and Stillfried named as the
 * positions held and Drösing, up the March behind them, as the place where the
 * Hungarian and Cuman horse are first sighted in their rear.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 11.8) / 3.3 − 1      map z = (51.0 − lat) / 2.7 − 1
 *
 * Two things the play names lie off this map and say so in their own text: the
 * election at Frankfurt, and the Hungarian army that decides the battle.
 *
 * The Marchfeld villages are within ten kilometres of each other on a map five
 * hundred kilometres wide, so only the three that carry scenes get a pin;
 * Angern, Stillfried and Jedenspeigen are named in the text of the ones that do.
 *
 * Grillparzer is not a chronicler and the play is not a chronicle. Where the
 * two part company, the place that stages it says which is which: the play has
 * Margaret die the morning before the Marchfeld, and the real Margaret had been
 * twelve years dead; the play has Ottokar's own commander desert him on the
 * field, and most historians now think that charge was made up afterwards.
 *
 * Rebuild the heightmap with `node scripts/build-heightmap.mjs ottokar`.
 */
export const ottokar: Story = {
  id: 'ottokar',
  title: 'King Ottokar’s Fortune and End',
  subtitle: 'The richest man in Christendom, and the field he lost it on',
  author: 'Franz Grillparzer',
  region: 'Bohemia, Austria & the Marchfeld',
  epoch: 'Austrian tragedy · 1823 · set 1261–1278',
  group: 'epic',
  intro:
    'A king who holds everything from the Bohemian forest to the Adriatic puts ' +
    'aside the wife who brought him half of it, and inside twenty years he has ' +
    'nothing and is dead in a field. Press ▶ Play story to follow it: the ' +
    'divorce at Prague, the election he was certain of losing to nobody, the ' +
    'submission on an island in the Danube, and the Marchfeld.',
  surfaceName: 'The Lands of the Bohemian Crown',
  ambient: {
    trees: 0.34,
    treeKind: 'conifer',
    treeColor: '#4a6b48',
    birds: 7,
    fish: 1,
  },
  terrain: {
    music: {
      // Original. Grillparzer wrote for a spoken stage and left no music, and
      // nothing from 1278 survives that could honestly be attached to it. This
      // is a plain court measure that turns minor at the halfway point, which
      // is the shape of the play.
      title: 'A measure for a king',
      credit: 'Original, written for this atlas',
      melody:
        'D4:2 A4:2 F4:2 D4:2 E4:2 F4:2 G4:4 ' +
        'A4:2 F4:2 D4:2 C4:2 D4:6 r:2 ' +
        'D4:2 A4:2 F4:2 D4:2 C4:2 Bb3:2 A3:4 ' +
        'Bb3:2 C4:2 D4:2 E4:2 D4:6 r:2',
      bass: 'D2:8 D2:8 Bb1:8 A1:8 D2:8 Bb1:8 G1:8 A1:8',
      tempo: 76,
      voice: 'horn',
      mood: 'epic',
    },
    seed: 'ottokar-dem',
    heightmap: ottokarHeight,
    // 6.6° of longitude at ~48°N (≈487 km) by 5.4° of latitude (≈599 km): a
    // little taller than it is wide, so the Alpine duchies at the bottom stay
    // on screen along with Bohemia at the top.
    aspect: 0.813,
    meshResolution: 340,
    // 0 m in the capped (−4..2400 m) DEM, where −4 is the depth lakes are cut
    // to. This box has no sea at all; the water is the Neusiedler See and the
    // Danube's own lakes.
    seaLevel: 0.0017,
    heightScale: 13,
    rivers: 3,
    riverColor: '#5b93b8',
    detail: true,
    biomes: [
      { maxHeight: 0.0017, color: '#2f5f7a', name: 'Lakes' },
      { maxHeight: 0.06, color: '#7d9a5c', name: 'The plains' },
      { maxHeight: 0.16, color: '#5c8449', name: 'Farmland' },
      { maxHeight: 0.34, color: '#43703f', name: 'Forest' },
      { maxHeight: 0.56, color: '#7a7c58', name: 'Uplands' },
      { maxHeight: 0.8, color: '#95907c', name: 'The high country' },
      { maxHeight: 1.0, color: '#e8ebee', name: 'The Tauern' },
    ],
  },

  markers: [
    // ---------------------------------------------------------- Bohemia
    {
      id: 'prague',
      name: 'Prague',
      kind: 'capital',
      at: { x: -0.206, z: -0.663 },
      description:
        'The castle above the Vltava, where the play opens and where it turns. ' +
        'A chancellor reads out a verdict: a synod at Vienna under the cardinal ' +
        'legate Guido has dissolved the marriage of Ottokar and Margaret of ' +
        'Austria — related in the fourth degree, and bound besides by a vow ' +
        'against remarrying that she made at Trier and denies was ever solemn. ' +
        'Her hand is the whole legal basis for his holding Austria. He marries ' +
        'Kunigunde of Masovia, King Béla’s granddaughter, the same day. ' +
        'Everything that follows is that one morning working itself out.',
    },
    {
      id: 'bohemia-crown',
      name: 'The Crown of Bohemia',
      kind: 'landmark',
      at: { x: -0.35, z: -0.52 },
      description:
        'The kingdom itself: the one title Ottokar holds by right rather than ' +
        'by marriage or by taking, and in the end the only one he keeps. He is ' +
        'made to receive it back as a fief from a man he thinks beneath him, ' +
        'which is the humiliation the last two acts are built on.',
    },
    {
      id: 'jihlava',
      name: 'Jihlava',
      kind: 'town',
      at: { x: 0.149, z: -0.406 },
      description:
        'The silver. Ottokar backed the mines here, and they are the ' +
        'foundation of the Bohemian crown’s wealth — the reason a king of a ' +
        'middling kingdom was called the Golden King and could pay for armies ' +
        'that took Moravia, Austria, Styria, Carinthia and Carniola between ' +
        '1247 and 1269. The play never stops reminding you what Ottokar can ' +
        'afford; this is where it came from.',
    },
    {
      id: 'brno',
      name: 'Brno',
      kind: 'city',
      at: { x: 0.457, z: -0.332 },
      description:
        'Moravia, the second of his crowns and the corridor between Bohemia and ' +
        'the Danube. Every march in this play — down to the submission, and ' +
        'again to the Marchfeld — comes through here.',
    },
    {
      id: 'olomouc',
      name: 'Olomouc',
      kind: 'city',
      at: { x: 0.652, z: -0.479 },
      description:
        'The old seat of Moravia, and the see of Bruno of Olomouc — who is the ' +
        'king’s chancellor in this play, and the nearest thing in it to a man ' +
        'giving good advice. Beyond it the roads run to Poland and the Prussian ' +
        'coast, where Ottokar led a crusade in 1255 and the Teutonic Knights ' +
        'named their new fortress on the Pregel after him: Königsberg.',
    },
    {
      id: 'znojmo',
      name: 'Znojmo',
      kind: 'town',
      at: { x: 0.288, z: -0.206 },
      description:
        'The border castle where Bohemia looks down into Austria. Ottokar’s ' +
        'road south passes under it twice — once to a wedding and a coronation, ' +
        'and once to a field he does not come back from.',
    },
    {
      id: 'eger',
      name: 'Eger',
      kind: 'town',
      at: { x: -0.827, z: -0.659 },
      description:
        'The western gate of Bohemia, and the direction the Empire comes from. ' +
        'While Ottokar is looking south and east at the lands he has taken, the ' +
        'thing that will undo him is being decided behind him, on the Rhine.',
    },
    {
      id: 'bohemian-forest',
      name: 'The Bohemian Forest',
      kind: 'forest',
      at: { x: -0.576, z: -0.296 },
      description:
        'The wooded wall between Bohemia and the German lands. It is why ' +
        'Bohemia can be a kingdom apart, and why a Bohemian king who reaches ' +
        'south of it for the Empire’s crown is reaching outside his own country.',
    },

    // ----------------------------------------------------- Austria & the Danube
    {
      id: 'vienna',
      name: 'Vienna',
      kind: 'capital',
      at: { x: 0.386, z: 0.034 },
      description:
        'The prize. Ottokar holds it, loses it, and is besieged out of it; ' +
        'Rudolf takes it and never gives it back. The same city the ' +
        'Nibelungenlied rides through on its way east, three hundred years ' +
        'earlier and in a different atlas of the same map.',
      link: {
        world: 'nibelungen',
        marker: 'vienna',
        note: 'The same city three hundred years earlier, on the Nibelungs’ road east.',
      },
    },
    {
      id: 'klosterneuburg',
      name: 'Klosterneuburg',
      kind: 'landmark',
      at: { x: 0.371, z: -0.002 },
      description:
        'Ottokar calls it his strong fortress, in the tone of a man listing ' +
        'what he still has. It stands where the Danube comes out of the hills ' +
        'above Vienna — which is exactly where an army coming downriver ' +
        'arrives.',
    },
    {
      id: 'kaumberg',
      name: 'The Island in the Danube',
      kind: 'landmark',
      at: { x: 0.412, z: 0.019 },
      description:
        'The play stages the submission of 1276 on an island it calls Kaumberg, ' +
        'in the Danube below Vienna: the imperial camp on one side of the water, ' +
        'the Bohemian on the other. Ottokar comes over in cloth of gold to a man ' +
        'sitting in a leather jerkin, kneels, and receives Bohemia back as a ' +
        'fief — having signed away Austria, Styria, Carinthia and Carniola. ' +
        'Then the tent curtains are cut down so that the whole army can see him ' +
        'on his knees, and the second half of the play is that image refusing ' +
        'to fade.',
    },
    {
      id: 'krems',
      name: 'Krems',
      kind: 'town',
      at: { x: 0.152, z: -0.041 },
      description:
        'On the Danube above Vienna, where the river comes through the vineyards. ' +
        'A stage of the road down which the Empire arrives in 1276.',
    },
    {
      id: 'linz',
      name: 'Linz',
      kind: 'town',
      at: { x: -0.247, z: -0.003 },
      description:
        'Upper Austria on the Danube. Between here and Vienna the river does ' +
        'the campaigning: whoever is coming down it does not have to fight for ' +
        'the country on either side.',
    },
    {
      id: 'passau',
      name: 'Passau',
      kind: 'town',
      at: { x: -0.505, z: -0.099 },
      description:
        'Where the Inn meets the Danube and the road east properly begins. The ' +
        'bishop’s town that the Nibelungenlied treats as the last friendly roof ' +
        'before Hungary, and the point at which an imperial army entering ' +
        'Austria stops being a rumour.',
      link: {
        world: 'nibelungen',
        marker: 'passau',
        note: 'Where the Nibelungenlied’s riders take the same road down the Danube.',
      },
    },
    {
      id: 'the-empire',
      name: 'The Empire — Frankfurt and the Rhine',
      kind: 'landmark',
      at: { x: -0.97, z: -0.667 },
      description:
        'Off this map to the west. At Frankfurt on 1 October 1273 the electors, ' +
        'wanting a king too weak to reclaim what they had helped themselves to, ' +
        'pass over the richest prince in Germany — who is a candidate, and who ' +
        'ends up almost alone in opposing the result — and choose a Swabian ' +
        'count of fifty-five named Rudolf of Habsburg. It is managed by ' +
        'Rudolf’s brother-in-law, the burgrave of Nuremberg, who stands in this ' +
        'play’s cast list. It is the deciding event of the whole thing, and it ' +
        'happens where Ottokar is not.',
    },

    // ---------------------------------------------------- The southern duchies
    {
      id: 'graz',
      name: 'Styria',
      kind: 'city',
      at: { x: 0.103, z: 0.455 },
      description:
        'Taken from Hungary in July 1260 at Kressenbrunn, which ended years of ' +
        'argument with Béla IV over this duchy, and held for eighteen years. In ' +
        'the play the Styrian lords are the ones with a grievance: Ottokar’s ' +
        'governor has wronged a daughter of the house of Merenberg, and the ' +
        'complaint they carry to the Emperor is the small door through which ' +
        'the great case against him opens.',
    },
    {
      id: 'carinthia',
      name: 'Carinthia',
      kind: 'city',
      at: { x: -0.24, z: 0.62 },
      description:
        'Inherited from a childless duke and held until the island in the ' +
        'Danube. One of the four lands Ottokar renounces in a single sentence, ' +
        'having spent a lifetime acquiring them.',
    },
    {
      id: 'carniola',
      name: 'Carniola',
      kind: 'city',
      at: { x: -0.18, z: 0.831 },
      description:
        'The southernmost of his lands, reaching for the Adriatic. When Ottokar ' +
        'boasts of a realm from the Baltic sands to the warm sea, this end of ' +
        'it is what he means.',
    },
    {
      id: 'salzburg',
      name: 'Salzburg',
      kind: 'town',
      at: { x: -0.62, z: 0.182 },
      description:
        'The archbishop’s city in the mountains, neither his nor the Emperor’s, ' +
        'and a reminder that the lands Ottokar counts as a single realm are in ' +
        'fact a heap of separate rights held by separate people.',
    },
    {
      id: 'tauern',
      name: 'The Hohe Tauern',
      kind: 'peak',
      at: { x: -0.729, z: 0.454 },
      description:
        'The high wall along the southern edge of the map. Nobody in the play ' +
        'goes there; it is on this map because it is what stands between the ' +
        'Danube and the duchies Ottokar signs away, and because it is the reason ' +
        'those duchies were separate countries in the first place.',
    },

    // ------------------------------------------------------------ The Marchfeld
    {
      id: 'marchfeld',
      name: 'The Marchfeld',
      kind: 'landmark',
      at: { x: 0.485, z: -0.011 },
      description:
        'The plain between the Danube and the March, flat enough that an army ' +
        'can be seen coming for half a day. A dying man in the last act asks ' +
        'what the field is called, and is told: the Marchfeld. It has been the ' +
        'answer to that question for Austrian armies ever since.',
    },
    {
      id: 'goetzendorf',
      name: 'The Churchyard at Götzendorf',
      kind: 'ruin',
      at: { x: 0.518, z: -0.052 },
      description:
        'Act V opens here before dawn, at a sexton’s house with a bell tower, ' +
        'among the forward posts of the Bohemian army — Angern and Stillfried ' +
        'are named as the positions held. Ottokar sits behind a watchfire with ' +
        'his chin on his sword. He pulls back a curtain in the sexton’s house ' +
        'and finds Margaret of Austria lying dead in her coffin, candles round ' +
        'her and the arms of Austria at her feet; she died, he is told, ' +
        'yesterday morning. He says: that is not the Queen of Bohemia. Her ' +
        'chamberwoman answers: she was. In fact Margaret had been dead twelve ' +
        'years by 1278, and Grillparzer moved her to this night on purpose.',
    },
    {
      id: 'duernkrut',
      name: 'Dürnkrut and Jedenspeigen',
      kind: 'battle',
      at: { x: 0.523, z: -0.068 },
      description:
        '26 August 1278, between the two villages that give the battle its ' +
        'name. Ottokar calls up his reserve to stop his flank folding and it ' +
        'never comes; attacked from two sides at once his army breaks, and he ' +
        'is killed in the rout while Cuman horsemen ride down the men running ' +
        'from it. The play lays the blame squarely on Milota, who commands that ' +
        'reserve and is one of its villains. The charge was made afterwards and ' +
        'most historians now reject it — but a play needs somebody to blame, ' +
        'and Grillparzer took the one the chronicles handed him.',
    },
    {
      id: 'droesing',
      name: 'Drösing',
      kind: 'danger',
      at: { x: 0.540, z: -0.086 },
      description:
        'Up the March behind the Bohemian line. A messenger reaches the ' +
        'watchfire before dawn: Cumans and Hungarians of the Emperor’s army are ' +
        'ranging up the river in the rear of the position, and have already ' +
        'been seen here. Later the word is shorter — Drösing is burning — and ' +
        'Ottokar asks how Hungarians got behind him at Drösing. Nobody answers ' +
        'that in time.',
    },
    {
      id: 'march-river',
      name: 'The March',
      kind: 'landmark',
      at: { x: 0.545, z: 0.02 },
      description:
        'The river the field is named for, running south to the Danube and ' +
        'marking the edge of everything. Act V sends a scene into open country ' +
        'on its bank. Cross it and you are out of Austria.',
    },
    {
      id: 'pressburg',
      name: 'Pressburg',
      kind: 'town',
      at: { x: 0.608, z: 0.056 },
      description:
        'Where the Danube leaves the Marchfeld for Hungary. The road by which ' +
        'a Hungarian army arrives, and the direction Ottokar spends the play ' +
        'not watching.',
    },
    {
      id: 'hungary',
      name: 'Hungary',
      kind: 'landmark',
      at: { x: 0.94, z: 0.2 },
      description:
        'Off this map to the east. Ottokar beat the Hungarians at Kressenbrunn ' +
        'and took a Hungarian wife, and in 1278 it is Hungarian cavalry riding ' +
        'in on Rudolf’s side that settles the Marchfeld. The play keeps Hungary ' +
        'at the edge of every scene, which is roughly where he kept it.',
    },
    {
      id: 'neusiedl',
      name: 'The Neusiedler See',
      kind: 'landmark',
      at: { x: 0.5, z: 0.17 },
      description:
        'The shallow lake on the Hungarian border, and the only real water on ' +
        'this map. South of it lies Kressenbrunn, where a younger Ottokar beat ' +
        'the Hungarians and began collecting the lands he ends the play without.',
    },
  ],

  routes: [
    {
      id: 'the-fortune',
      name: 'The Fortune — what he held',
      style: 'solid',
      color: '#e8c56a',
      description:
        'Eger on the western edge of Bohemia to the Adriatic side of the Alps: ' +
        'the reach of a king who holds Bohemia by right, Moravia by ' +
        'inheritance, and Austria, Styria, Carinthia and Carniola by marriage, ' +
        'treaty and force.',
      points: [
        { x: -0.827, z: -0.659 },
        { x: -0.206, z: -0.663 },
        { x: -0.35, z: -0.52 },
        { x: 0.149, z: -0.406 },
        { x: 0.457, z: -0.332 },
        { x: 0.652, z: -0.479 },
        { x: 0.457, z: -0.332 },
        { x: 0.288, z: -0.206 },
        { x: 0.386, z: 0.034 },
        { x: 0.5, z: 0.17 },
        { x: 0.103, z: 0.455 },
        { x: -0.24, z: 0.62 },
        { x: -0.18, z: 0.831 },
      ],
    },
    {
      id: 'the-empire-road',
      name: 'The Empire comes down the Danube · 1276',
      style: 'dashed',
      color: '#7fb0d8',
      description:
        'Rudolf, elected at Frankfurt and unregarded, brings the Empire east ' +
        'along the river. Passau, Linz, Krems, Klosterneuburg, Vienna — and ' +
        'then the island, where Ottokar comes to him.',
      points: [
        { x: -0.97, z: -0.667 },
        { x: -0.505, z: -0.099 },
        { x: -0.247, z: -0.003 },
        { x: 0.152, z: -0.041 },
        { x: 0.371, z: -0.002 },
        { x: 0.386, z: 0.034 },
        { x: 0.412, z: 0.019 },
      ],
    },
    {
      id: 'the-kneeling',
      name: 'Down from Prague to kneel · 1276',
      style: 'dashed',
      color: '#c98f6a',
      description:
        'The other half of the same meeting: Ottokar rides south out of Bohemia ' +
        'to sign away four duchies on a river island, and rides back a smaller ' +
        'man than he set out.',
      points: [
        { x: -0.206, z: -0.663 },
        { x: 0.149, z: -0.406 },
        { x: 0.288, z: -0.206 },
        { x: 0.371, z: -0.002 },
        { x: 0.412, z: 0.019 },
      ],
    },
    {
      id: 'the-end',
      name: 'The End — out to the Marchfeld · 1278',
      style: 'solid',
      color: '#c4553f',
      description:
        'Two years later he comes back for it all, down through Moravia and out ' +
        'onto the plain between the Danube and the March. Götzendorf on the eve, ' +
        'Dürnkrut in the morning.',
      points: [
        { x: -0.206, z: -0.663 },
        { x: 0.457, z: -0.332 },
        { x: 0.288, z: -0.206 },
        { x: 0.485, z: -0.011 },
        { x: 0.518, z: -0.052 },
        { x: 0.523, z: -0.068 },
        { x: 0.540, z: -0.086 },
        { x: 0.545, z: 0.02 },
      ],
    },
    {
      id: 'the-hungarians',
      name: 'The Hungarians arrive',
      style: 'dashed',
      color: '#8ec07c',
      description:
        'Ladislaus of Hungary brings his light horse and his Cumans round on ' +
        'Rudolf’s side, up the March into the Bohemian rear. Drösing burns, and ' +
        'Ottokar asks how they got there. It is the wing he has not accounted ' +
        'for.',
      points: [
        { x: 0.94, z: 0.2 },
        { x: 0.608, z: 0.056 },
        { x: 0.545, z: 0.02 },
        { x: 0.540, z: -0.086 },
        { x: 0.523, z: -0.068 },
      ],
    },
  ],

  regions: [
    { id: 'r-bohemia', name: 'Bohemia', at: { x: -0.42, z: -0.55 }, scale: 1.05 },
    { id: 'r-moravia', name: 'Moravia', at: { x: 0.52, z: -0.4 }, scale: 0.95 },
    { id: 'r-austria', name: 'Austria', at: { x: 0.1, z: 0.06 }, scale: 1.0 },
    { id: 'r-styria', name: 'Styria', at: { x: 0.16, z: 0.36 }, scale: 0.9 },
    { id: 'r-carinthia', name: 'Carinthia & Carniola', at: { x: -0.3, z: 0.72 }, scale: 0.85 },
  ],

  chapters: [
    {
      id: 'o-1',
      title: 'I · A divorce at Prague',
      narration:
        'An antechamber at the castle in Prague, and a chancellor with a ' +
        'document. A synod at Vienna has dissolved the king’s marriage: cousins ' +
        'in the fourth degree, and a vow against remarrying that Margaret made ' +
        'at Trier and says was never solemn. She refuses a spokesman and argues ' +
        'her own case — I alone will bear it, and speak as I suffer, alone. Her ' +
        'hand is why Austria is his. He marries Kunigunde of Masovia the same ' +
        'day. Escorting Margaret into the hall, unremarked by anybody, is a ' +
        'Swabian count called Rudolf of Habsburg.',
      focus: { marker: 'prague', distance: 30, pitch: 46 },
      reveal: {
        markers: ['prague', 'bohemia-crown'],
        regions: ['r-bohemia'],
      },
    },
    {
      id: 'o-2',
      title: 'I · What he has',
      narration:
        'He is not wrong about his own strength, and the play lets him say so ' +
        'at length. Moravia from 1247, Austria from 1251, Styria taken off the ' +
        'Hungarians in 1260, Carinthia and Carniola from 1269 — and behind all ' +
        'of it the silver, which is why any of the rest was affordable. They ' +
        'called him the Golden King. In Bohemia I rule, in Moravia I am mighty, ' +
        'he says, and in nearby Hungary I have my hand.',
      focus: { marker: 'jihlava', distance: 52, pitch: 40 },
      reveal: {
        markers: ['jihlava', 'brno', 'olomouc', 'znojmo', 'vienna', 'graz'],
        routes: ['the-fortune'],
        regions: ['r-moravia', 'r-austria', 'r-styria'],
      },
      highlight: { routes: ['the-fortune'] },
    },
    {
      id: 'o-3',
      title: 'I · The lands at the bottom of the map',
      narration:
        'Carinthia and Carniola run away south behind the mountains — the far ' +
        'end of a realm assembled out of marriages, deaths without heirs, and ' +
        'one good battle against the Hungarians. They are the part of it he ' +
        'will find easiest to sign away and hardest to be without.',
      focus: { marker: 'carinthia', distance: 44, pitch: 42 },
      reveal: {
        markers: ['carinthia', 'carniola', 'salzburg', 'tauern', 'neusiedl'],
        regions: ['r-carinthia'],
      },
    },
    {
      id: 'o-4',
      title: 'II · An election he is not at',
      narration:
        'At Frankfurt the electors must choose a king of the Romans, and what ' +
        'they want is one too weak to take back what they have taken. Ottokar ' +
        'is a candidate. They pass him over for a Swabian count of fifty-five ' +
        'named Rudolf of Habsburg — arranged by Rudolf’s brother-in-law, the ' +
        'burgrave of Nuremberg — and Ottokar is left almost alone in refusing ' +
        'to accept it. The news reaches Prague as a joke. Nothing in the play ' +
        'is more decisive, and he is not there for it.',
      focus: { marker: 'the-empire', distance: 46, pitch: 40 },
      reveal: { markers: ['the-empire', 'eger', 'bohemian-forest'] },
      highlight: { markers: ['the-empire'] },
    },
    {
      id: 'o-5',
      title: 'III · A complaint out of Styria',
      narration:
        'The case against him does not begin with an army. It begins with old ' +
        'Merenberg at a window in his own house, and a wrong done in Styria by ' +
        'a governor of Ottokar’s, and a letter carried where it should not be. ' +
        'The great quarrel gets in through a small door, which is Grillparzer’s ' +
        'point about great quarrels.',
      focus: { marker: 'graz', distance: 40, pitch: 44 },
      reveal: { markers: ['graz'] },
      highlight: { markers: ['graz'] },
    },
    {
      id: 'o-6',
      title: 'III · The Empire comes down the river',
      narration:
        'Rudolf does not argue; he moves. The army comes east along the Danube ' +
        'through Passau, Linz and Krems, and Vienna is besieged and taken while ' +
        'Ottokar is still deciding what kind of insult this is. Whoever holds ' +
        'the river does not have to fight for the country on either side of it.',
      focus: { marker: 'linz', distance: 50, pitch: 40 },
      reveal: {
        markers: ['passau', 'linz', 'krems', 'klosterneuburg'],
        routes: ['the-empire-road'],
      },
      highlight: { routes: ['the-empire-road'] },
    },
    {
      id: 'o-7',
      title: 'III · The island in the Danube',
      narration:
        'The Bohemian camp is on the left bank, the imperial camp on an island ' +
        'in the river. Ottokar crosses in cloth of gold to a man sitting in a ' +
        'leather jerkin and kneels, and gets Bohemia back as a fief, having ' +
        'given up Austria, Styria, Carinthia and Carniola in a single sentence. ' +
        'Then the tent is opened so the armies can see, and the play has its ' +
        'image: a king on his knees in the open, in front of everybody.',
      focus: { marker: 'kaumberg', distance: 24, pitch: 48 },
      reveal: { markers: ['kaumberg', 'vienna'], routes: ['the-kneeling'] },
      highlight: { markers: ['kaumberg'], routes: ['the-kneeling'] },
    },
    {
      id: 'o-8',
      title: 'IV · Prague, afterwards',
      narration:
        'Back at the castle gate the thing he cannot do is carry it. His new ' +
        'queen despises him for kneeling, his lords have watched him do it, and ' +
        'the man who kept the peace treaty is the one everyone now believes ' +
        'weak. He tears the treaty up. Given the same terms twice, he takes the ' +
        'worse one both times.',
      focus: { marker: 'prague', distance: 26, pitch: 46 },
      reveal: { markers: ['prague'] },
      highlight: { markers: ['prague'] },
    },
    {
      id: 'o-9',
      title: 'V · The churchyard at Götzendorf',
      narration:
        'Before dawn, among the forward posts, at a sexton’s house with a bell ' +
        'tower. A messenger brings word that Cumans and Hungarians are working ' +
        'up the March behind the line. Then Ottokar pulls back a curtain and ' +
        'finds Margaret of Austria in her coffin, candles round her, the arms ' +
        'of Austria at her feet. That is not the Queen of Bohemia, he says. She ' +
        'was, says her chamberwoman. He asks when she died and is told: ' +
        'yesterday morning. The real Margaret had been dead twelve years. ' +
        'Grillparzer moved her to this night because this is the night it does ' +
        'the most damage.',
      focus: { marker: 'goetzendorf', distance: 20, pitch: 44 },
      reveal: { markers: ['goetzendorf', 'marchfeld', 'march-river'], routes: ['the-end'] },
      highlight: { markers: ['goetzendorf'] },
    },
    {
      id: 'o-10',
      title: 'V · The wing he did not watch',
      narration:
        'Ladislaus of Hungary comes up from Pressburg on Rudolf’s side with ' +
        'light horse and Cumans, into the Bohemian rear. Ottokar took Styria ' +
        'off the Hungarians in 1260 and married Béla’s granddaughter to settle ' +
        'it, and has spent the play with his back to that border. It is the ' +
        'wing that decides the day.',
      focus: { marker: 'pressburg', distance: 34, pitch: 42 },
      reveal: { markers: ['pressburg', 'hungary', 'droesing'], routes: ['the-hungarians'] },
      highlight: { routes: ['the-hungarians'] },
    },
    {
      id: 'o-11',
      title: 'V · The Marchfeld',
      narration:
        '26 August 1278, on the flat ground between the Danube and the March. ' +
        'He calls up the reserve to hold a folding flank and it does not come; ' +
        'taken from two sides the army breaks, and the Cumans ride down the men ' +
        'running from it. A dying man asks what this field is called and is ' +
        'told: the Marchfeld. Ottokar is killed in the rout, and Austria — the ' +
        'Austria he got by marrying a woman he then put aside — belongs to the ' +
        'Habsburgs for the next six hundred years.',
      focus: { marker: 'duernkrut', distance: 22, pitch: 40 },
      reveal: { markers: ['duernkrut'] },
      highlight: { markers: ['duernkrut'], routes: ['the-end'] },
    },
    {
      id: 'o-12',
      title: 'The map afterwards',
      narration:
        'Look at the two roads together. The gold one is what he held, from ' +
        'Prague to the edge of the Adriatic; the red one is four days’ ride, ' +
        'from Prague to a field forty kilometres from Vienna. Grillparzer had ' +
        'wanted to write about Napoleon and used Ottokar instead because the ' +
        'shape fitted — a great man, a divorce, an Austrian second wife, and a ' +
        'field. The censors were not fooled; the play was finished in 1823 and ' +
        'not staged until the Burgtheater put it on in February 1825, after the ' +
        'Empress read it and asked her husband to let it through.',
      focus: { marker: 'marchfeld', distance: 76, pitch: 36 },
      reveal: {
        markers: [
          'prague',
          'bohemia-crown',
          'jihlava',
          'brno',
          'olomouc',
          'znojmo',
          'eger',
          'bohemian-forest',
          'vienna',
          'klosterneuburg',
          'kaumberg',
          'krems',
          'linz',
          'passau',
          'the-empire',
          'graz',
          'carinthia',
          'carniola',
          'salzburg',
          'tauern',
          'marchfeld',
          'goetzendorf',
          'duernkrut',
          'droesing',
          'march-river',
          'pressburg',
          'hungary',
          'neusiedl',
        ],
        routes: ['the-fortune', 'the-empire-road', 'the-kneeling', 'the-end', 'the-hungarians'],
        regions: ['r-bohemia', 'r-moravia', 'r-austria', 'r-styria', 'r-carinthia'],
      },
      highlight: { routes: ['the-fortune', 'the-end'] },
    },
  ],
}
