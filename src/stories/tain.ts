import type { Story } from '../types'
import irelandHeight from '../assets/ireland-height.png'

/**
 * Táin Bó Cúailnge — the Cattle-Raid of Cooley, the central tale of the Irish
 * Ulster Cycle. Written down in the twelfth-century Book of Leinster and the
 * eleventh-century Lebor na hUidre from far older material; this world was read
 * out of Lucy Winifred Faraday's 1904 translation (Project Gutenberg #14391),
 * which follows the Lebor na hUidre text.
 *
 * The Táin is a raid, and a raid is a route. Medb of Connacht wants a bull that
 * lives in Ulster, and the whole poem is the army walking there, being held up
 * one man at a time, and walking back with less than it started with. So the
 * map is the road: out of Cruachan across the plain, east through Meath, north
 * to the Cooley peninsula, and the long retreat to a last battle in the middle
 * of the country.
 *
 * Markers sit at their true coordinates on the Irish DEM —
 *
 *   map x = (lon + 10.8) / 2.75 − 1      map z = (55.5 − lat) / 2.10 − 1
 *
 * Places the tale names that can still be found are set where they are:
 * Rathcroghan for Cruachan, Navan Fort for Emain Macha, Ardee for the ford
 * where Ferdiad died, Dunseverick for Dun Sobairce. The ones nobody can now
 * locate — Glenn Gatlaig, Iraird Cuillenn — are set along the line of march the
 * text describes, and say so.
 *
 * Ireland is 365 km across and 466 km down, so this is the atlas's second
 * world taller than it is wide. The narration paraphrases; it quotes no
 * translation.
 */
export const tain: Story = {
  id: 'tain',
  title: 'Táin Bó Cúailnge',
  subtitle: 'One boy, one ford at a time',
  author: 'Anonymous · trans. L. W. Faraday',
  region: 'Connacht, Meath & Ulster',
  earth: { lon: -7.6, lat: 53.8, place: 'Connacht, Ireland' },
  epoch: 'Irish epic · written down c. 1100',
  group: 'epic',
  intro:
    'A queen and a king count their property in bed, and she finds she is one ' +
    'bull short. The bull is in Ulster. Press ▶ Play story to follow the ' +
    'whole raid: the army that walks east to fetch it, the curse that leaves ' +
    'every Ulsterman too weak to stand, and the seventeen-year-old who holds ' +
    'the border alone by making them send one champion a day to a ford.',
  surfaceName: 'Ireland',
  ambient: {
    trees: 0.5,
    treeKind: 'broadleaf',
    treeColor: '#4a7a45',
    birds: 9,
    fish: 3,
    // Weather over the north-east only. Rain across the whole island buried
    // the map under cloud; kept to Ulster and the Cooley peninsula it sits
    // where the raid is going and leaves the rest of the country legible.
    rain: true,
    rainArea: { x0: 0.40, x1: 0.85, z0: -0.62, z1: -0.20 },
  },
  terrain: {
    music: {
      // Written to the shape of an Irish slow air — free-ish phrases over a
      // drone, gapped scale, the tune circling back to the same note. It is an
      // original: no collected air was transcribed for this world.
      title: 'Air for the Boy at the Ford',
      credit: 'After the Irish slow air · original',
      melody:
        'D4:2 E4:1 G4:3 A4:2 G4:1 E4:2 D4:2 ' +
        'E4:1 G4:1 A4:2 B4:3 A4:1 G4:2 A4:4 r:2 ' +
        'D5:2 B4:1 A4:2 G4:1 E4:3 D4:1 E4:2 G4:2 ' +
        'A4:2 G4:1 E4:1 D4:4 r:2',
      bass: 'D2:8 D2:8 G2:8 D2:8',
      tempo: 54,
      voice: 'harp',
      mood: 'mystic',
    },
    seed: 'tain-1', // unused: the heightmap takes precedence
    heightmap: irelandHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0062,
    // 365 km across by 466 km down.
    aspect: 0.782,
    // Ireland tops out just over 1,000 m and the Táin's country is drumlins
    // and river crossings, so the relief stays gentle and readable.
    heightScale: 12,
    // Taller than it is wide, and the raid runs corner to corner.
    overhead: true,
    rivers: 7,
    biomes: [
      { maxHeight: 0.0062, color: '#28566e', name: 'The sea & the loughs' },
      { maxHeight: 0.06, color: '#c6c39c', name: 'Strand' },
      { maxHeight: 0.16, color: '#6fa254', name: 'The plains' },
      { maxHeight: 0.34, color: '#4f8a4a', name: 'Pasture & wood' },
      { maxHeight: 0.55, color: '#6f8a58', name: 'Drumlin country' },
      { maxHeight: 0.78, color: '#8a8b72', name: 'The uplands' },
      { maxHeight: 1.0, color: '#d8d6cc', name: 'Bare hill' },
    ],
  },

  markers: [
    {
      id: 'cruachan',
      name: 'Cruachan Ai',
      kind: 'capital',
      at: { x: -0.093, z: -0.190 },
      description:
        'Medb and Ailill’s fort in Connacht, and where the whole thing starts ' +
        'in bed. They compare their possessions item by item and come out ' +
        'exactly level, except that his herd contains the great white-horned ' +
        'bull Finnbennach — which was hers, and left her herd because it would ' +
        'not be owned by a woman. Rathcroghan in Roscommon.',
    },
    {
      id: 'mag-ai',
      name: 'Mag Ai',
      kind: 'landmark',
      at: { x: -0.055, z: -0.143 },
      description:
        'The plain the army musters on. Fergus mac Roich, an Ulster exile in ' +
        'Medb’s service, is given the lead — and spends the whole march ' +
        'steering the host wrong to buy his own people time, which everyone ' +
        'notices and nobody can prove.',
    },
    {
      id: 'ath-luain',
      name: 'Ath Luain',
      kind: 'landmark',
      at: { x: 0.040, z: -0.011 },
      description:
        'The ford of Athlone on the Shannon, where the host crosses out of ' +
        'Connacht. In the last rune of the tale the survivors are convoyed ' +
        'back west past this ford, and the raid is over.',
    },
    {
      id: 'kells',
      name: 'Cenannas',
      kind: 'town',
      at: { x: 0.426, z: -0.155 },
      description:
        'Kells, on the road east across Meath. The tale lists the army’s ' +
        'overnight stops the way a quartermaster would, and the list is one of ' +
        'the oldest road-maps of Ireland there is.',
    },
    {
      id: 'iraird',
      name: 'Iraird Cuillenn',
      kind: 'danger',
      at: { x: 0.527, z: -0.190 },
      description:
        'Where the army first learns what is waiting for it. Cú Chulainn cuts ' +
        'an oak sapling with one hand, twists it into a hoop, carves ogam on ' +
        'it and drops it over a standing stone — a formal challenge meaning ' +
        'no one passes until a man matches the feat. Fergus reads it and the ' +
        'host stops for the night.',
    },
    {
      id: 'ath-gabla',
      name: 'Ath Gabla',
      kind: 'danger',
      at: { x: 0.473, z: -0.262 },
      description:
        'The Ford of the Fork. He cuts a four-pronged branch, drives it into ' +
        'the riverbed with one hand, and puts the heads of four of Medb’s men ' +
        'on the prongs. The army has to find a way round rather than pull it ' +
        'out, and the campaign is a week old.',
    },
    {
      id: 'glenn-gatt',
      name: 'Glenn Gatlaig',
      kind: 'forest',
      at: { x: 0.418, z: -0.333 },
      description:
        'One of the many glens and fords the tale names along the line of ' +
        'march and nobody can now place — the Táin is full of them, each with ' +
        'a short story attached explaining how it got its name. Set here on ' +
        'the road it belongs to.',
    },
    {
      id: 'murthemne',
      name: 'Mag Murthemne',
      kind: 'landmark',
      at: { x: 0.600, z: -0.281 },
      description:
        'Cú Chulainn’s own plain, around Dundalk — the ground he is defending ' +
        'and the ground he fights almost all of the single combats on. Named ' +
        'thirteen times; the tale keeps coming back to it because he does.',
    },
    {
      id: 'ardee',
      name: 'Ath Fhirdiad',
      kind: 'battle',
      at: { x: 0.549, z: -0.218 },
      description:
        'The ford that is named after the man who died in it. Ferdiad is Cú ' +
        'Chulainn’s foster-brother, trained beside him under Scáthach, and ' +
        'Medb shames and bribes him into the fight. They go at it for three ' +
        'days, treat each other’s wounds each evening and send food across, ' +
        'and on the third day the gae bolga ends it. Ardee, Co. Louth.',
    },
    {
      id: 'sliab-fuait',
      name: 'Sliab Fuait',
      kind: 'peak',
      at: { x: 0.545, z: -0.381 },
      description:
        'The Fews, the pass through the hills into Ulster — the boy’s watch ' +
        'post, and the road every army has to take. Named ten times.',
    },
    {
      id: 'loch-echtra',
      name: 'Loch Echtra',
      kind: 'landmark',
      at: { x: 0.491, z: -0.381 },
      description:
        'A lake under the pass where the host camps. Fergus warns them to ' +
        'keep a watch and they do not, and in the morning there are fewer of ' +
        'them.',
    },
    {
      id: 'sliab-cuilinn',
      name: 'Sliab Cuilinn',
      kind: 'peak',
      at: { x: 0.588, z: -0.343 },
      description:
        'Slieve Gullion, standing over the Gap of the North — the highest ' +
        'thing on this part of the map and the landmark the whole frontier is ' +
        'measured against.',
    },
    {
      id: 'cuailnge',
      name: 'Cuailnge',
      kind: 'forest',
      at: { x: 0.655, z: -0.310 },
      description:
        'The Cooley peninsula, and the object of the entire exercise: the ' +
        'Donn Cuailnge, the brown bull, is somewhere in these hills with fifty ' +
        'heifers. Named thirty times. Everything in the tale is a way of ' +
        'getting here or a consequence of having got here.',
    },
    {
      id: 'findabair',
      name: 'Findabair Cuailnge',
      kind: 'town',
      at: { x: 0.673, z: -0.300 },
      description:
        'The steading in Cooley the raiders sack while the bull is being ' +
        'hunted through the hills above it. Not to be confused with Medb’s ' +
        'daughter of the same name, who is promised to about nine different ' +
        'men as an inducement and is the tale’s most reused piece of currency.',
    },
    {
      id: 'donn',
      name: 'Where the Bull Was Taken',
      kind: 'danger',
      at: { x: 0.700, z: -0.330 },
      description:
        'They find him, and the taking of him is a page — he kills fifty of ' +
        'the men who come at him and goes where he likes until he is driven ' +
        'south with the herd. The raid succeeds. That is not the same thing as ' +
        'the raid going well.',
    },
    {
      id: 'emain',
      name: 'Emain Macha',
      kind: 'capital',
      at: { x: 0.492, z: -0.451 },
      description:
        'The Ulster capital, Conchobar’s seat, and for most of the tale a ' +
        'building full of men who cannot stand up. The curse of Macha lays ' +
        'the pangs of a woman in labour on every Ulsterman of fighting age at ' +
        'the worst possible moment. Navan Fort, Co. Armagh.',
    },
    {
      id: 'culann',
      name: 'Culann’s House',
      kind: 'landmark',
      at: { x: 0.618, z: -0.333 },
      description:
        'The smith’s house where a six-year-old called Sétanta arrives late, ' +
        'is set on by a guard dog nobody warned him about, and kills it with ' +
        'his bare hands. He offers to guard the place himself until a pup can ' +
        'be reared — and takes the name Cú Chulainn, Culann’s Hound, which he ' +
        'keeps.',
    },
    {
      id: 'tara',
      name: 'Tara',
      kind: 'city',
      at: { x: 0.523, z: -0.085 },
      description:
        'Not a scene in the Táin, but the seat the tale’s politics orbit — ' +
        'the high-kingship the provinces are all measuring themselves ' +
        'against while they argue about a bull.',
    },
    {
      id: 'boyne',
      name: 'The Boyne',
      kind: 'landmark',
      at: { x: 0.498, z: -0.152 },
      description:
        'The river the army crosses going in and coming out. The Táin gives ' +
        'a name and an origin-story to nearly every ford in this country, ' +
        'which is how a war-story doubles as a gazetteer.',
    },
    {
      id: 'dun-sobairce',
      name: 'Dun Sobairce',
      kind: 'ruin',
      at: { x: 0.582, z: -0.873 },
      description:
        'Dunseverick on the Antrim coast — the far end of Ulster, and the ' +
        'measure the tale uses for how much has been lost: the country is ' +
        'harried, it says, all the way to Dun Sobairce.',
    },
    {
      id: 'slemain',
      name: 'Slemain Midi',
      kind: 'landmark',
      at: { x: 0.258, z: -0.062 },
      description:
        'Where the risen Ulstermen gather, and where the tale stops the war ' +
        'for a long set-piece: a watchman describes each company as it comes ' +
        'over the hill, and Fergus names them one by one for Medb, who is ' +
        'listening to a list of exactly how much trouble she is in.',
    },
    {
      id: 'gairech',
      name: 'Gairech & Ilgairech',
      kind: 'battle',
      at: { x: 0.255, z: -0.057 },
      description:
        'The last battle, in the middle of the country. Fergus has sworn not ' +
        'to strike Conchobar and turns his sword on the hills instead. Medb ' +
        'gets her army out, and Cú Chulainn — who arrives late, wounded, and ' +
        'finds her defenceless — lets her live, on the grounds that he does ' +
        'not kill women.',
    },
    {
      id: 'ath-luain-back',
      name: 'The Road Back West',
      kind: 'landmark',
      at: { x: 0.018, z: 0.048 },
      description:
        'The Connacht army is escorted home over the Shannon. What Medb has ' +
        'to show for it is one bull, briefly, and the tale’s own verdict is ' +
        'the flattest sentence in it: they went home.',
    },
    {
      id: 'bull-fight',
      name: 'Where the Bulls Met',
      kind: 'danger',
      at: { x: 0.100, z: -0.120 },
      description:
        'The Donn Cuailnge is brought to Cruachan and Finnbennach comes out ' +
        'to meet him. They fight the length of Ireland overnight. In the ' +
        'morning the brown bull is standing with his rival’s remains hanging ' +
        'off his horns — and then his heart bursts, and both bulls that the ' +
        'war was fought over are dead.',
    },
  ],

  routes: [
    {
      id: 'the-hosting',
      name: 'The Hosting of Cruachan',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.093, z: -0.190 },
        { x: -0.055, z: -0.143 },
        { x: 0.040, z: -0.011 },
        { x: 0.258, z: -0.062 },
        { x: 0.426, z: -0.155 },
        { x: 0.527, z: -0.190 },
      ],
      description:
        'Out of Connacht and east across Meath, with Fergus at the head ' +
        'leading them the long way round on purpose. The tale names the ' +
        'overnight stops in order, which is why this line can be drawn at all.',
    },
    {
      id: 'the-delay',
      name: 'Holding the Border Alone',
      style: 'solid',
      color: '#c96f5c',
      points: [
        { x: 0.527, z: -0.190 },
        { x: 0.473, z: -0.262 },
        { x: 0.418, z: -0.333 },
        { x: 0.549, z: -0.218 },
        { x: 0.600, z: -0.281 },
      ],
      description:
        'The hoop of oak, the four heads on the forked branch, and then the ' +
        'arrangement that carries the middle of the whole tale: one champion ' +
        'a day, at a ford, while the rest of the army stands and waits.',
    },
    {
      id: 'the-fords',
      name: 'The Single Combats',
      style: 'dashed',
      color: '#d98f5a',
      points: [
        { x: 0.600, z: -0.281 },
        { x: 0.549, z: -0.218 },
        { x: 0.588, z: -0.343 },
        { x: 0.618, z: -0.333 },
        { x: 0.545, z: -0.381 },
      ],
      description:
        'Fer Baeth, Larine, Loch, the Morrígan in three shapes, and at last ' +
        'Ferdiad — three days at the ford against the man he was trained ' +
        'beside, and a lament afterwards longer than the fight.',
    },
    {
      id: 'the-bull',
      name: 'The Taking of the Donn',
      style: 'solid',
      color: '#8f6f4a',
      points: [
        { x: 0.545, z: -0.381 },
        { x: 0.655, z: -0.310 },
        { x: 0.700, z: -0.330 },
        { x: 0.673, z: -0.300 },
        { x: 0.600, z: -0.281 },
      ],
      description:
        'Over the pass into Cooley, through the hills after the bull, and the ' +
        'steading sacked on the way. This is the errand; everything else in ' +
        'the tale is what it costs.',
    },
    {
      id: 'the-rising',
      name: 'The Ulstermen Rise',
      style: 'solid',
      color: '#6fa8c8',
      points: [
        { x: 0.492, z: -0.451 },
        { x: 0.545, z: -0.381 },
        { x: 0.498, z: -0.152 },
        { x: 0.258, z: -0.062 },
        { x: 0.255, z: -0.057 },
      ],
      description:
        'Sualtaim rides to Emain to raise the alarm and is beheaded by the ' +
        'rim of his own shield for his trouble — but the warning lands. The ' +
        'pangs lift, the province comes off its beds, and the watchman on the ' +
        'hill starts naming the companies as they arrive.',
    },
    {
      id: 'the-harrying',
      name: 'As Far as Dun Sobairce',
      style: 'dashed',
      color: '#9ba7b5',
      points: [
        { x: 0.600, z: -0.281 },
        { x: 0.588, z: -0.343 },
        { x: 0.560, z: -0.560 },
        { x: 0.582, z: -0.873 },
      ],
      description:
        'How far the raiding reached while Ulster could not stand: the tale ' +
        'measures the damage by naming the furthest place it got to, on the ' +
        'north coast.',
    },
    {
      id: 'the-retreat',
      name: 'Home Over the Shannon',
      style: 'solid',
      color: '#a8c46a',
      points: [
        { x: 0.255, z: -0.057 },
        { x: 0.100, z: -0.120 },
        { x: 0.040, z: -0.011 },
        { x: 0.018, z: 0.048 },
        { x: -0.093, z: -0.190 },
      ],
      description:
        'The Connacht army is escorted west past Ath Luain, the brown bull is ' +
        'brought to Cruachan, and the two bulls settle the matter between ' +
        'themselves in a way that leaves nobody anything.',
    },
  ],

  regions: [
    { id: 'r-connacht', name: 'Connacht', at: { x: -0.30, z: -0.10 }, scale: 1.0 },
    { id: 'r-meath', name: 'Meath', at: { x: 0.36, z: -0.10 }, scale: 0.9 },
    { id: 'r-ulster', name: 'Ulster', at: { x: 0.44, z: -0.60 }, scale: 1.05 },
    { id: 'r-cooley', name: 'Cuailnge', at: { x: 0.72, z: -0.36 }, scale: 0.7 },
  ],

  chapters: [
    {
      id: 't-1',
      title: 'The pillow-talk',
      narration:
        'Medb and Ailill lie in bed at Cruachan and fall into an argument ' +
        'about which of them brought more to the marriage. They have the ' +
        'whole household’s property carried in and counted, and come out dead ' +
        'level — until the last item, a white-horned bull in his herd that ' +
        'had been in hers, and left it because it would not be owned by a ' +
        'woman. There is one bull in Ireland to match it, and it is in Ulster.',
      focus: { marker: 'cruachan', distance: 26, pitch: 44 },
      reveal: { markers: ['cruachan', 'mag-ai'], regions: ['r-connacht'] },
    },
    {
      id: 't-2',
      title: 'The curse of Macha',
      narration:
        'Ulster cannot answer. A woman named Macha was made to race the ' +
        'king’s horses while heavily pregnant, won, gave birth on the ' +
        'finishing line and cursed every Ulsterman of fighting age to be laid ' +
        'as low as she was, for five days and four nights, whenever they were ' +
        'most needed. The most needed moment has arrived.',
      focus: { marker: 'emain', distance: 28, pitch: 42 },
      reveal: { markers: ['emain'], regions: ['r-ulster'] },
      highlight: { markers: ['emain'] },
    },
    {
      id: 't-3',
      title: 'Culann’s hound',
      narration:
        'The one exception is seventeen and not covered by the curse. When he ' +
        'was six he walked to the smith’s house alone, was set on by a guard ' +
        'dog nobody had warned him about, killed it with his hands, and ' +
        'offered to do the dog’s job himself until a pup could be reared. He ' +
        'has been Cú Chulainn — Culann’s Hound — ever since.',
      focus: { marker: 'culann', distance: 22, pitch: 44 },
      reveal: { markers: ['culann', 'sliab-fuait'] },
    },
    {
      id: 't-4',
      title: 'The hosting',
      narration:
        'The army leaves Cruachan and goes east across Meath, and the tale ' +
        'lists the overnight camps like a quartermaster. Fergus mac Roich — ' +
        'an Ulsterman in exile, leading Connacht’s army against his own ' +
        'people — takes them by every wrong road he can think of, and ' +
        'everybody knows it and nobody can prove it.',
      focus: { marker: 'kells', distance: 40, pitch: 40 },
      reveal: { markers: ['ath-luain', 'kells', 'tara', 'boyne'], routes: ['the-hosting'], regions: ['r-meath'] },
      highlight: { routes: ['the-hosting'] },
    },
    {
      id: 't-5',
      title: 'The hoop of oak',
      narration:
        'At Iraird Cuillenn they find a sapling cut with one stroke, twisted ' +
        'one-handed into a hoop, carved with ogam and dropped over a standing ' +
        'stone. Fergus explains what it means: nobody passes tonight unless a ' +
        'man of theirs can do the same thing the same way. Nobody can.',
      focus: { marker: 'iraird', distance: 22, pitch: 44 },
      reveal: { markers: ['iraird'] },
    },
    {
      id: 't-6',
      title: 'The ford of the fork',
      narration:
        'Next a four-pronged branch driven into a riverbed with one hand, ' +
        'with four heads on it. The army spends the day finding a crossing ' +
        'that is not that one. The tale is very clear that this is a boy ' +
        'holding up an invasion by making it obey the rules of single combat.',
      focus: { marker: 'ath-gabla', distance: 22, pitch: 44 },
      reveal: { markers: ['ath-gabla', 'glenn-gatt', 'murthemne'], routes: ['the-delay'] },
      highlight: { markers: ['ath-gabla'] },
    },
    {
      id: 't-7',
      title: 'One a day, at a ford',
      narration:
        'The arrangement that carries the middle of the epic: one champion ' +
        'each day, at a ford, while the army waits. Fer Baeth, Larine, Loch. ' +
        'The Morrígan comes at him as an eel, a she-wolf and a red heifer, is ' +
        'wounded in each shape, and is healed when he unknowingly blesses an ' +
        'old woman milking — which is her.',
      focus: { marker: 'murthemne', distance: 26, pitch: 42 },
      reveal: { markers: ['sliab-cuilinn'], routes: ['the-fords'] },
      highlight: { routes: ['the-fords'] },
    },
    {
      id: 't-8',
      title: 'Ferdiad',
      narration:
        'Medb runs out of strangers and starts on his friends. Ferdiad was ' +
        'trained beside him under Scáthach and refuses until he is shamed and ' +
        'bought. They fight three days; each evening they send healing herbs ' +
        'and food across the ford to each other. On the third day the gae ' +
        'bolga settles it, and the lament that follows is longer than the ' +
        'battle.',
      focus: { marker: 'ardee', distance: 20, pitch: 44 },
      reveal: { markers: ['ardee'] },
      highlight: { markers: ['ardee'] },
    },
    {
      id: 't-9',
      title: 'The bull',
      narration:
        'While the fords hold, the raiding parties get what they came for. ' +
        'The Donn Cuailnge is found in the hills of Cooley with his heifers, ' +
        'kills fifty of the men sent to take him, and is driven south anyway. ' +
        'The raid has succeeded. It has taken most of an army and every ' +
        'champion Medb could buy.',
      focus: { marker: 'cuailnge', distance: 22, pitch: 42 },
      reveal: {
        markers: ['cuailnge', 'findabair', 'donn', 'loch-echtra'],
        routes: ['the-bull'],
        regions: ['r-cooley'],
      },
      highlight: { markers: ['donn'] },
    },
    {
      id: 't-10',
      title: 'As far as Dun Sobairce',
      narration:
        'With the province flat on its back the raiding runs unopposed, and ' +
        'the tale measures the damage the way it measures everything — by ' +
        'naming the furthest place it reached. The cattle and the people were ' +
        'taken, it says, as far as Dun Sobairce on the north coast.',
      focus: { marker: 'dun-sobairce', distance: 34, pitch: 40 },
      reveal: { markers: ['dun-sobairce'], routes: ['the-harrying'] },
    },
    {
      id: 't-11',
      title: 'Sualtaim’s ride',
      narration:
        'Cú Chulainn’s father rides to Emain to raise the alarm and is ' +
        'answered with protocol — nobody may speak before the king. He shouts ' +
        'the warning anyway, his horse rears, and the rim of his own shield ' +
        'takes his head off. The head goes on shouting it, and that finally ' +
        'works.',
      focus: { marker: 'emain', distance: 26, pitch: 42 },
      highlight: { markers: ['emain'] },
    },
    {
      id: 't-12',
      title: 'The watchman’s list',
      narration:
        'The pangs lift and Ulster comes off its beds. At Slemain Midi the ' +
        'tale stops the war entirely for its favourite set-piece: a watchman ' +
        'describes each company as it appears over the hill, and Fergus names ' +
        'them for Medb one after another — a long, admiring catalogue of ' +
        'exactly how much trouble she is now in.',
      focus: { marker: 'slemain', distance: 26, pitch: 42 },
      reveal: { markers: ['slemain'], routes: ['the-rising'] },
      highlight: { routes: ['the-rising'] },
    },
    {
      id: 't-13',
      title: 'Gairech and Ilgairech',
      narration:
        'The armies meet in the middle of the country. Fergus has sworn never ' +
        'to strike Conchobar and takes the tops off three hills instead. Medb ' +
        'gets her people out; Cú Chulainn comes on her wounded and ' +
        'defenceless and lets her go, saying he does not kill women. The ' +
        'Connacht army is escorted west over the Shannon.',
      focus: { marker: 'gairech', distance: 26, pitch: 42 },
      reveal: { markers: ['gairech', 'ath-luain-back'], routes: ['the-retreat'] },
      highlight: { markers: ['gairech'] },
    },
    {
      id: 't-14',
      title: 'The two bulls',
      narration:
        'The brown bull is brought to Cruachan and the white-horned comes out ' +
        'to meet him. They fight the length of Ireland through the night. In ' +
        'the morning the Donn is standing with what is left of Finnbennach ' +
        'hanging from his horns — and then his heart bursts. Both bulls the ' +
        'war was fought over are dead, and the tale ends without drawing a ' +
        'moral, because it does not need to.',
      focus: { marker: 'bull-fight', distance: 30, pitch: 40 },
      reveal: { markers: ['bull-fight'] },
      highlight: { markers: ['bull-fight'] },
    },
  ],
}
