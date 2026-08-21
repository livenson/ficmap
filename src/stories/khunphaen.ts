import type { Story } from '../types'
import siamHeight from '../assets/siam-height.png'

/**
 * Khun Chang Khun Phaen — Siam's great folk epic, and the first Southeast Asian
 * world in this atlas.
 *
 * WHAT THIS TEXT IS, because it matters more here than usual. There is no
 * author and there is no original. KCKP began as a *sepha*, a tale recited for
 * entertainment by troubadours who beat time with hardwood clappers (*krap*),
 * probably from the seventeenth century; the poem's own first chapter says only
 * that the story 'comes down from ancient times, and there is a text in
 * Suphan'. Episodes were written down from the late eighteenth century, printed
 * by Samuel Smith in 1872 and by the Wat Ko press in 1889, and finally settled
 * into a standard edition by Prince Damrong Rachanubhab for the Wachirayan
 * Library in 1917–18, compiled from four sets of *samut thai* manuscripts with
 * the passages he judged obscene taken out.
 *
 * This world was read from Chris Baker and Pasuk Phongpaichit's complete
 * English translation (Silkworm Books, 2010), which restores much of what
 * Damrong cut, and its structure follows their account of how the poem grew:
 * Baker & Pasuk, 'The Career of Khun Chang Khun Phaen', Journal of the Siam
 * Society 97 (2009). The two books below are their Original Story and their
 * First Sequel — and the sequel really is an insertion, dropped into the middle
 * of the older tale to give Khun Phaen's son time to grow up before the
 * execution that was always the ending. Nothing here is presented as the one
 * true version, because there isn't one.
 *
 * The narration paraphrases throughout and quotes no translation.
 *
 * ON THE GEOGRAPHY, which is uneven on purpose. The country of the Original
 * Story — Suphanburi, Kanchanaburi, Ayutthaya — is lived-in and exact: real
 * temples, a real hill, a real cave, all of them still standing and several of
 * them now carrying shrines to the characters. The country of the First Sequel
 * is hearsay. Baker & Pasuk note that the poem's knowledge of Lanna is poor and
 * that all the temples it names in Chiang Mai and Lamphun are wrong. So the
 * markers thin out as the army marches north, and the northern route is drawn
 * as the road an Ayutthayan army would take rather than as anything the poem
 * surveys.
 *
 * Markers sit at their true coordinates —
 *
 *   map x = (lon − 97.8) / 2.8 − 1      map z = (19.6 − lat) / 3.4 − 1
 */
export const khunphaen: Story = {
  id: 'khunphaen',
  title: 'Khun Chang Khun Phaen',
  subtitle: 'Two men, one woman, and fifty years of it',
  author: 'Thai traditional · trans. Baker & Pasuk',
  region: 'Siam — Suphanburi to Chiang Mai',
  earth: { lon: 100.11, lat: 14.47, place: 'Suphanburi, Thailand' },
  epoch: 'Sepha folk epic · printed 1872, standard edition 1917',
  group: 'epic',
  intro:
    'A rich ugly man and a poor handsome one want the same woman, and the ' +
    'argument lasts fifty years and reaches the king twice. Press ▶ Play ' +
    'story to follow it: a boyhood in Suphanburi, a war that is really a ' +
    'trick, an abduction, a sojourn in the forest, fifteen years in jail, a ' +
    'son who marches an army to Chiang Mai to buy his father out — and a ' +
    'courtroom where the king asks Wanthong to choose, and she cannot.',
  surfaceName: 'Siam',
  ambient: {
    // Sparse on purpose. The central plain is wet rice, not forest — this is
    // the most intensively farmed ground in Southeast Asia and has been for
    // centuries — so at the density most worlds here use, the Chao Phraya
    // plain came out as unbroken jungle and the poem's country looked like
    // somewhere nobody lives. The trees that remain read as the hill country
    // either side, which is where the story goes when it wants to disappear.
    trees: 0.22,
    treeKind: 'broadleaf',
    treeColor: '#4f7a3c',
    birds: 7,
    fish: 3,
  },
  terrain: {
    music: {
      // Written for this atlas in the shape of a sepha recitation: a narrow
      // tune that keeps falling back to the same note, the way a reciter
      // carries twenty thousand couplets without wearing the audience out.
      //
      // ORIGINAL, and deliberately so. Thai classical music divides the octave
      // into seven roughly equal steps, which a Western-tuned synthesiser
      // cannot play; a piece of the real repertoire rendered on these
      // intervals would be a misrepresentation of it rather than a
      // performance. So nothing Thai is transcribed here, and the credit says
      // so.
      title: 'Sepha for the krap',
      credit: 'Original — no Thai melody is transcribed here',
      melody:
        'D4:2 E4:1 F#4:1 A4:2 F#4:1 E4:1 ' +
        'D4:2 E4:1 D4:1 B3:2 A3:2 ' +
        'A4:2 B4:1 A4:1 F#4:2 E4:1 F#4:1 ' +
        'E4:1 D4:1 B3:2 A3:2 D4:2',
      bass: 'D3:8 A2:8 B2:8 D3:8',
      tempo: 72,
      voice: 'harp',
      mood: 'epic',
    },
    seed: 'khunphaen-1', // unused: the heightmap takes precedence
    heightmap: siamHeight,
    // Printed by scripts/build-heightmap.mjs for the `siam` preset.
    seaLevel: 0.0033,
    // 599 km across by 754 km down — taller than it is wide.
    aspect: 0.794,
    // Doi Inthanon stands in the north-west corner at 2,565 m and the whole
    // Chao Phraya plain sits between 2 and 30 m. The preset caps at 1,800 and
    // gammas the land hard (0.5) so the plain the poem lives on separates at
    // all — but that same gamma stretches the mid hills more than the peaks,
    // and at 10 the border ranges came out as a row of spikes round three
    // sides of a map whose subject is a flat river valley. 6 keeps the hills
    // legible as hills.
    heightScale: 6,
    // Seen from overhead. This world is taller than it is wide and its story
    // runs the whole length of it — Suphanburi at the bottom, Chiang Mai at
    // the top — so from the usual low angle the entire second book sits on the
    // horizon in a few dozen pixels. You can still orbit down to the relief.
    overhead: true,
    rivers: 0,
    /**
     * Three real rivers, drawn from their published courses.
     *
     * `rivers: 0` above is the other half of this decision. At about 0.6 km per
     * pixel this DEM cannot hold a river — the Chao Phraya at Ayutthaya is a
     * few hundred metres wide — and the procedural courses traced downhill from
     * it would run all over the central plain looking convincing and being
     * nothing. On a map this flat there is no honest procedural river at all,
     * so this world draws only rivers it can name.
     *
     * Source: Natural Earth 10m river centrelines (public domain), via
     * `scripts/build-river.mjs siam "Chao Phraya" | "Mae Klong" | Ping`.
     *
     * Together the Ping and the Chao Phraya are one line from Chiang Mai to the
     * sea, which is also the road the First Sequel takes: the army goes up it
     * and comes back down it. The Ping is the reason `check-rivers` learned
     * that a river may end at a confluence — it stops at Nakhon Sawan, where it
     * meets the Nan and the two become the Chao Phraya, and that is neither the
     * sea nor the edge of the map.
     */
    namedRivers: [
      {
        name: 'The Ping',
        marker: 'the-ping',
        points: [
          { x: -0.5927, z: -0.9950 }, { x: -0.5838, z: -0.9734 }, { x: -0.5730, z: -0.9512 },
          { x: -0.5847, z: -0.9154 }, { x: -0.5784, z: -0.8775 }, { x: -0.5724, z: -0.8564 },
          { x: -0.5714, z: -0.7608 }, { x: -0.5773, z: -0.7294 }, { x: -0.5836, z: -0.7063 },
          { x: -0.5978, z: -0.6850 }, { x: -0.6306, z: -0.6720 }, { x: -0.6730, z: -0.6561 },
          { x: -0.6802, z: -0.6341 }, { x: -0.6935, z: -0.6154 }, { x: -0.7008, z: -0.5676 },
          { x: -0.7088, z: -0.5424 }, { x: -0.6909, z: -0.5235 }, { x: -0.6959, z: -0.5007 },
          { x: -0.6804, z: -0.4707 }, { x: -0.6640, z: -0.4443 }, { x: -0.6788, z: -0.4229 },
          { x: -0.6740, z: -0.4010 }, { x: -0.6759, z: -0.3758 }, { x: -0.6494, z: -0.3719 },
          { x: -0.6114, z: -0.3666 }, { x: -0.6092, z: -0.3450 }, { x: -0.6000, z: -0.3246 },
          { x: -0.5898, z: -0.3047 }, { x: -0.5624, z: -0.3040 }, { x: -0.5409, z: -0.2797 },
          { x: -0.5503, z: -0.2558 }, { x: -0.5331, z: -0.2367 }, { x: -0.5392, z: -0.2115 },
          { x: -0.5222, z: -0.1902 }, { x: -0.5048, z: -0.1716 }, { x: -0.4805, z: -0.1561 },
          { x: -0.4451, z: -0.1315 }, { x: -0.4181, z: -0.1278 }, { x: -0.3998, z: -0.1086 },
          { x: -0.3846, z: -0.0790 }, { x: -0.3713, z: -0.0559 }, { x: -0.3374, z: -0.0453 },
          { x: -0.3195, z: -0.0206 }, { x: -0.3020, z: -0.0025 }, { x: -0.2846, z: 0.0142 },
          { x: -0.2638, z: 0.0365 }, { x: -0.2601, z: 0.0577 }, { x: -0.2236, z: 0.0738 },
          { x: -0.1917, z: 0.0937 }, { x: -0.1821, z: 0.1272 }, { x: -0.1575, z: 0.1422 },
        ],
      },
      {
        name: 'The Chao Phraya',
        marker: 'chao-phraya',
        points: [
          { x: -0.1640, z: 0.1451 }, { x: -0.1801, z: 0.1659 }, { x: -0.1856, z: 0.1867 },
          { x: -0.1748, z: 0.2167 }, { x: -0.1808, z: 0.2387 }, { x: -0.1899, z: 0.2628 },
          { x: -0.1729, z: 0.2980 }, { x: -0.1401, z: 0.2995 }, { x: -0.1183, z: 0.3177 },
          { x: -0.0959, z: 0.3486 }, { x: -0.0790, z: 0.3783 }, { x: -0.0608, z: 0.3956 },
          { x: -0.0546, z: 0.4225 }, { x: -0.0499, z: 0.4452 }, { x: -0.0546, z: 0.4869 },
          { x: -0.0502, z: 0.5100 }, { x: -0.0604, z: 0.5321 }, { x: -0.0534, z: 0.5533 },
          { x: -0.0398, z: 0.5725 }, { x: -0.0314, z: 0.5992 }, { x: -0.0203, z: 0.6189 },
          { x: -0.0210, z: 0.6411 }, { x: -0.0205, z: 0.6948 }, { x: -0.0364, z: 0.7155 },
          { x: -0.0376, z: 0.7368 }, { x: -0.0105, z: 0.7330 }, { x: -0.0203, z: 0.7529 },
          { x: -0.0008, z: 0.7611 },
        ],
      },
      {
        name: 'The Mae Klong',
        marker: 'mae-klong',
        points: [
          { x: -0.6101, z: 0.0072 }, { x: -0.6139, z: 0.0314 }, { x: -0.6300, z: 0.0532 },
          { x: -0.6344, z: 0.0864 }, { x: -0.6223, z: 0.1054 }, { x: -0.6396, z: 0.1282 },
          { x: -0.6348, z: 0.1494 }, { x: -0.6134, z: 0.1733 }, { x: -0.6310, z: 0.1943 },
          { x: -0.6312, z: 0.2212 }, { x: -0.6115, z: 0.2399 }, { x: -0.6063, z: 0.2646 },
          { x: -0.6004, z: 0.2854 }, { x: -0.5932, z: 0.3063 }, { x: -0.5768, z: 0.3245 },
          { x: -0.5574, z: 0.3401 }, { x: -0.5388, z: 0.3628 }, { x: -0.5469, z: 0.3851 },
          { x: -0.5583, z: 0.4087 }, { x: -0.5571, z: 0.4369 }, { x: -0.5536, z: 0.4783 },
          { x: -0.5430, z: 0.5017 }, { x: -0.5215, z: 0.5226 }, { x: -0.5046, z: 0.5424 },
          { x: -0.4859, z: 0.5744 }, { x: -0.4745, z: 0.5937 }, { x: -0.4498, z: 0.6057 },
          { x: -0.4228, z: 0.6150 }, { x: -0.3998, z: 0.6280 }, { x: -0.3735, z: 0.6474 },
          { x: -0.3470, z: 0.6554 }, { x: -0.3067, z: 0.6622 }, { x: -0.2869, z: 0.6775 },
          { x: -0.2614, z: 0.6921 }, { x: -0.2675, z: 0.7208 }, { x: -0.2748, z: 0.7450 },
          { x: -0.2759, z: 0.7668 }, { x: -0.2565, z: 0.7852 }, { x: -0.2299, z: 0.8090 },
          { x: -0.2150, z: 0.8283 }, { x: -0.2138, z: 0.8318 },
        ],
      },
    ],
    // Thailand has no snow, so the top band is limestone and bare ridge rather
    // than the white that every other mountain world in this atlas ends on.
    // The metre figures come from the build log's gamma table.
    biomes: [
      { maxHeight: 0.0033, color: '#1f5570', name: 'The Gulf & the rivers' },
      { maxHeight: 0.10, color: '#6f9b4a', name: 'Paddy' },
      { maxHeight: 0.20, color: '#7f9a4b', name: 'The rice plain' },
      { maxHeight: 0.34, color: '#93924f', name: 'Dry fields & the Khorat edge' },
      { maxHeight: 0.52, color: '#5d7a3f', name: 'Forested foothills' },
      { maxHeight: 0.72, color: '#6d6f4e', name: 'The teak hills' },
      { maxHeight: 1.0, color: '#9a9184', name: 'The border ranges' },
    ],
  },

  markers: [
    // ---------------- Suphanburi: the ground of the Original Story ----------------
    {
      id: 'suphanburi',
      name: 'Suphanburi',
      kind: 'city',
      at: { x: -0.1757, z: 0.5082 },
      description:
        'The provincial town where all three of them grow up, and where the ' +
        'poem says its own text was kept. Everything that matters happens ' +
        'within a few streets of here: the monastery, the two houses, the ' +
        'window Khun Chang’s money buys and the wall Khun Phaen climbs. Modern ' +
        'Suphanburi has named streets after the characters.',
    },
    {
      id: 'wat-khae',
      name: 'Wat Khae & the tamarind',
      kind: 'landmark',
      at: { x: -0.1724, z: 0.5037 },
      description:
        'The temple with the thousand-year tamarind tree — nine and a half ' +
        'metres round — where Khun Phaen is said to have been taught to turn ' +
        'tamarind leaves into wasps. A traditional house called Khum Khun ' +
        'Phaen has been built beside it. The tree is real; the wasps are the ' +
        'poem, and the poem is what the tree is famous for.',
    },
    {
      id: 'wat-palelai',
      name: 'Wat Palelai',
      kind: 'landmark',
      at: { x: -0.1806, z: 0.5077 },
      description:
        'Suphanburi’s great temple, which has put up a model of Khun Chang’s ' +
        'house and commissioned a run of murals of the whole story round its ' +
        'cloister. If you want to see what the town thinks its own tale looks ' +
        'like, it is painted on these walls.',
    },

    // ---------------- Kanchanaburi: the fugitive country ----------------
    {
      id: 'kanchanaburi',
      name: 'Kanchanaburi',
      kind: 'city',
      at: { x: -0.3840, z: 0.6376 },
      description:
        'West of Suphanburi where the plain runs into the hills, and the ' +
        'refuge of this story twice over: Khun Phaen’s mother brings him here ' +
        'as a boy after his father is executed and the family’s property ' +
        'seized, and a generation later his son runs here from a stepfather ' +
        'trying to kill him. Khun Phaen ends up its governor.',
    },
    {
      id: 'khao-chon-kai',
      name: 'Cockfight Hill',
      kind: 'peak',
      at: { x: -0.4288, z: 0.6084 },
      description:
        'Khao Chon Kai, a 246-metre hill at Lat Ya, held to be where Khun ' +
        'Krai — Khun Phaen’s father — lived; a flat place on the top is ' +
        'pointed out as his cockfighting ground. The father is executed by the ' +
        'king, which is the wound the whole first book is built on. There is a ' +
        'shrine on the hill with images of both of them.',
    },
    {
      id: 'ban-tham',
      name: 'Ban Tham cave',
      kind: 'danger',
      at: { x: -0.3650, z: 0.6557 },
      description:
        'A cave temple on the bank of the Mae Klong at Tha Muang. This is the ' +
        'worst thing in the poem: Khun Phaen, believing his pregnant wife Bua ' +
        'Khli has been turned against him, takes the still-born foetus of his ' +
        'own son and binds its spirit to serve him as a Kuman Thong, a golden ' +
        'child. A stalactite shaped like a long-haired woman is her shrine, ' +
        'and people still leave offerings at it.',
    },

    // ---------------- Ayutthaya: the king, the court, the jail ----------------
    {
      id: 'ayutthaya',
      name: 'Ayutthaya',
      kind: 'capital',
      at: { x: -0.0126, z: 0.5431 },
      description:
        'The capital, and the poem’s third point after the two houses. Every ' +
        'private quarrel in this story ends up here: the muster for the war ' +
        'that was really a trick, the treason trial that collapses, the ' +
        'fifteen years in jail Khun Phaen serves for one sentence too many to ' +
        'the king’s face, and finally the courtroom where the king asks ' +
        'Wanthong to choose. A house in the historical park is still pointed ' +
        'out as his prison.',
    },
    {
      id: 'chao-phraya',
      name: 'The Chao Phraya',
      kind: 'landmark',
      at: { x: -0.0604, z: 0.5321 },
      description:
        'The river of the plain, running past Ayutthaya to the sea. It is the ' +
        'road as much as the water is: armies muster on it, the manuscripts ' +
        'travel down it, and in the Second Sequel a giant crocodile terrorises ' +
        'the villages along it. Drawn here from published geodata, because at ' +
        'this map’s resolution the elevation data cannot see it.',
    },
    {
      id: 'mae-klong',
      name: 'The Mae Klong',
      kind: 'landmark',
      at: { x: -0.3735, z: 0.6474 },
      description:
        'The western river, made where the Khwae Noi and the Khwae Yai meet at ' +
        'Kanchanaburi and running down to the Gulf. Ban Tham stands on its ' +
        'bank. This is the fugitives’ river — the one you follow when you are ' +
        'getting out of the reach of the capital.',
    },
    {
      id: 'bangkok',
      name: 'Bangkok — where it became a book',
      kind: 'city',
      at: { x: -0.0380, z: 0.7199 },
      description:
        'Not in the story: the story is Ayutthayan, and Ayutthaya fell in ' +
        '1767. But this is where the tale stopped being spoken and started ' +
        'being printed — Samuel Smith’s press in 1872, the Wat Ko press in ' +
        '1889, and Prince Damrong’s standard edition for the Wachirayan ' +
        'Library in 1917–18. Every version anyone reads today comes through ' +
        'here, which is why it is on the map.',
    },

    // ---------------- North, up the Ping: the First Sequel ----------------
    {
      id: 'nakhon-sawan',
      name: 'Nakhon Sawan',
      kind: 'town',
      at: { x: -0.1831, z: 0.1457 },
      description:
        'Where the Ping comes down out of the north and meets the Nan, and ' +
        'the two of them become the Chao Phraya. An army marching from ' +
        'Ayutthaya to Chiang Mai turns north here and stops using the plain.',
    },
    {
      id: 'the-ping',
      name: 'The Ping',
      kind: 'landmark',
      at: { x: -0.5048, z: -0.1716 },
      description:
        'The northern river, from the hills above Chiang Mai down to Nakhon ' +
        'Sawan. With the Chao Phraya below it, this is one continuous line ' +
        'from Lanna to the sea — and the line the whole First Sequel is ' +
        'strung along: the army goes up it and comes back down it, herding ' +
        'prisoners and loot.',
    },
    {
      id: 'kamphaeng-phet',
      name: 'Kamphaeng Phet',
      kind: 'town',
      at: { x: -0.3888, z: -0.1045 },
      description:
        'The walled town on the Ping — its name means diamond wall — and the ' +
        'last real place on the road north before the country stops being ' +
        'Ayutthayan. The poem does not survey this march; it is drawn as the ' +
        'road an army of the period took.',
    },
    {
      id: 'lampang',
      name: 'Lampang',
      kind: 'town',
      at: { x: -0.3995, z: -0.6152 },
      description:
        'A Lanna town on the way over to Chiang Mai. It stands here for the ' +
        'last stretch of the march rather than for anything the poem describes ' +
        'accurately — see Chiang Mai for how little the poem knows about the ' +
        'north.',
    },
    {
      id: 'chiang-mai',
      name: 'Chiang Mai',
      kind: 'capital',
      at: { x: -0.5765, z: -0.7613 },
      description:
        'The target of the campaign that occupies over half the First Sequel: ' +
        'a border outpost stormed, five hundred Ayutthayan prisoners freed ' +
        'from the jail by a man who walks through walls, and a city sacked ' +
        'before the victory is even decided. Baker and Pasuk point out that ' +
        'the poem’s Lanna is hearsay — every temple it names in Chiang Mai and ' +
        'Lamphun is wrong — so the marker is on the real city and the poem’s ' +
        'geography of it is not.',
    },
    {
      id: 'vientiane',
      name: 'Vientiane',
      kind: 'capital',
      at: { x: 0.7191, z: -0.5189 },
      description:
        'Away east on the Mekong, and the reason for the war: a princess is ' +
        'being sent from here to Ayutthaya as an alliance, and Chiang Mai ' +
        'seizes her on the road to break it. The episode looks modelled on a ' +
        'real one — in 1560 Ayutthaya and Lan Xang made exactly this alliance, ' +
        'and Phitsanulok seized exactly this princess.',
    },
    {
      id: 'phichit',
      name: 'Phichit',
      kind: 'town',
      at: { x: -0.0813, z: -0.0597 },
      description:
        'Home of Simala, the governor’s daughter Phlai Ngam wins the way his ' +
        'father won women, and the second of the two wives whose jealousy ' +
        'wrecks the family in the sequel after this one. The old town has a ' +
        'shrine to her. No march in these two books comes this way; the poem ' +
        'reaches Phichit through a person.',
    },
    {
      id: 'sukhothai',
      name: 'Sukhothai',
      kind: 'ruin',
      at: { x: -0.3203, z: -0.2417 },
      description:
        'The old capital, ruined long before this story, and here for one ' +
        'person: Kaeo Kiriya, daughter of the governor of Sukhothai, ' +
        'mortgaged into slavery in Khun Chang’s house against a loan. Khun ' +
        'Phaen finds her there on the night of the abduction, gives her the ' +
        'money to buy herself out — and takes her too. Nobody in these two ' +
        'books travels here.',
    },
  ],

  routes: [
    {
      id: 'suphan-days',
      name: 'A Suphanburi Childhood',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.1806, z: 0.5077 },
        { x: -0.1757, z: 0.5082 },
        { x: -0.1724, z: 0.5037 },
      ],
      description:
        'The whole first act fits between these three points: the great ' +
        'temple where Khun Chang’s house is now modelled in the grounds, the ' +
        'town, and the monastery with the tamarind tree. A few hundred metres, ' +
        'and fifty years of trouble.',
    },
    {
      id: 'the-flight-west',
      name: 'Out of Reach of the Capital',
      style: 'solid',
      color: '#c96f5c',
      points: [
        { x: -0.1757, z: 0.5082 },
        { x: -0.2600, z: 0.5500 },
        { x: -0.3300, z: 0.5900 },
        { x: -0.4288, z: 0.6084 },
        { x: -0.3840, z: 0.6376 },
        { x: -0.3650, z: 0.6557 },
      ],
      description:
        'West into the hills, and the poem’s escape route twice over — the ' +
        'widow with her son after the father is executed, and the son with his ' +
        'grandmother a generation later. Past Cockfight Hill to Kanchanaburi ' +
        'and down the Mae Klong to the cave, which is where the three things ' +
        'that make Khun Phaen unbeatable are got, and where he does the thing ' +
        'that cannot be undone.',
    },
    {
      id: 'to-the-court',
      name: 'Up to the King',
      style: 'solid',
      color: '#e8c56a',
      points: [
        { x: -0.1757, z: 0.5082 },
        { x: -0.1100, z: 0.5210 },
        { x: -0.0604, z: 0.5321 },
        { x: -0.0126, z: 0.5431 },
      ],
      description:
        'Sixty kilometres east, and every time this road is used somebody ' +
        'loses something: a husband sent to a war he did not need to fight, a ' +
        'treason charge that collapses into a fine, a sentence too many spoken ' +
        'to a king’s face, and at the end of it all a woman asked to choose.',
    },
    {
      id: 'the-campaign',
      name: 'The March to Chiang Mai',
      style: 'solid',
      // Not a blue: at #9ec8e8 the march ran alongside the Ping in almost the
      // river's own colour for its whole length and disappeared into it.
      color: '#e08a3c',
      points: [
        { x: -0.0126, z: 0.5431 },
        { x: -0.0790, z: 0.3783 },
        { x: -0.1729, z: 0.2980 },
        { x: -0.1831, z: 0.1457 },
        { x: -0.3846, z: -0.0790 },
        { x: -0.3888, z: -0.1045 },
        { x: -0.5048, z: -0.1716 },
        { x: -0.5409, z: -0.2797 },
        { x: -0.4600, z: -0.4800 },
        { x: -0.3814, z: -0.6453 },
        { x: -0.5765, z: -0.7613 },
      ],
      description:
        'Over half the First Sequel is this march. Out of Ayutthaya down the ' +
        'Chao Phraya, north at Nakhon Sawan, up the Ping past Kamphaeng Phet ' +
        'and over into Lanna. The army lives off the country as soon as it ' +
        'leaves the capital and the villages empty into the forest ahead of ' +
        'it. It comes back the same way, the poem says, like a city on the ' +
        'move.',
    },
    {
      id: 'the-princess',
      name: 'The Princess Who Never Arrived',
      style: 'dashed',
      color: '#d9a4c8',
      points: [
        { x: 0.7191, z: -0.5189 },
        { x: 0.4000, z: -0.5600 },
        { x: 0.1000, z: -0.6100 },
        { x: -0.2000, z: -0.6600 },
        { x: -0.5765, z: -0.7613 },
      ],
      description:
        'Sent west from Vientiane to be married into Ayutthaya, and taken off ' +
        'the road by Chiang Mai to stop the alliance happening. Dashed, ' +
        'because it is a journey that does not complete — and because the ' +
        'poem gives no stages for it, only the two ends.',
    },
    {
      id: 'how-it-reached-us',
      name: 'How the Tale Got to Us',
      style: 'dashed',
      color: '#d6c8a6',
      points: [
        { x: -0.1757, z: 0.5082 },
        { x: -0.0126, z: 0.5431 },
        { x: -0.0534, z: 0.5533 },
        { x: -0.0314, z: 0.5992 },
        { x: -0.0205, z: 0.6948 },
        { x: -0.0380, z: 0.7199 },
      ],
      description:
        'Not a journey in the story — the journey of the story. Recited in ' +
        'Suphanburi, taken up at the Ayutthaya court, carried down the Chao ' +
        'Phraya to the new capital after 1767, and finally set in type in ' +
        'Bangkok: Smith in 1872, Wat Ko in 1889, Damrong in 1917. Dashed, ' +
        'because it took a century and a half and no one walked it.',
    },
  ],

  regions: [
    { id: 'plain', name: 'The Chao Phraya Plain', at: { x: -0.14, z: 0.34 }, scale: 0.6 },
    { id: 'lanna', name: 'Lanna', at: { x: -0.62, z: -0.60 }, scale: 0.6 },
    { id: 'khorat', name: 'The Khorat Plateau', at: { x: 0.38, z: -0.14 }, scale: 0.55 },
    { id: 'west-ranges', name: 'The Western Ranges', at: { x: -0.78, z: 0.30 }, scale: 0.5 },
    { id: 'gulf', name: 'The Gulf of Siam', at: { x: 0.10, z: 0.90 }, scale: 0.55 },
  ],

  elements: [
    {
      id: 'kuman-thong',
      name: 'The Kuman Thong',
      glyph: '◆',
      description:
        'The golden child — the bound spirit of Khun Phaen’s own still-born ' +
        'son, taken at Ban Tham. It goes ahead of him as a scout, warns him of ' +
        'what is waiting, and is the reason he can walk into a house or a jail ' +
        'that is guarded. The poem never lets you forget what it cost.',
      journey: [
        { marker: 'ban-tham', note: 'Taken in the cave on the Mae Klong.' },
        { marker: 'suphanburi', sinceChapter: 7, note: 'Ahead of him through Khun Chang’s house.' },
        { marker: 'kanchanaburi', sinceChapter: 9, note: 'Left behind while he is in jail.' },
        { marker: 'chiang-mai', sinceChapter: 13, note: 'Into the jail, ahead of the army.' },
      ],
    },
    {
      id: 'the-text',
      name: 'The Text Itself',
      glyph: '📜',
      description:
        'Where the words were at each stage. There is no original manuscript ' +
        'and no author: the tale was recited, then copied, then edited, then ' +
        'printed, and every step changed it. Following it is the only honest ' +
        'way to say what this world is a map of.',
      journey: [
        { marker: 'suphanburi', note: '“There is a text in Suphan” — the poem’s own first chapter.' },
        { marker: 'ayutthaya', sinceChapter: 3, note: 'Recited at court by troubadours with krap sticks.' },
        { marker: 'bangkok', sinceChapter: 16, note: 'Printed 1872 and 1889; Damrong’s standard edition 1917–18.' },
      ],
    },
  ],

  books: [
    {
      id: 'original',
      title: 'The Original Story',
      subtitle: 'Suphanburi, and how it goes wrong',
      chapters: [
        {
          id: 'three-children',
          title: 'Three Children in Suphanburi',
          narration:
            'A provincial town on the western edge of the plain, and three ' +
            'children in it: Phlai Kaeo, whose family is about to lose ' +
            'everything; Khun Chang, who is rich, bald and not going to get ' +
            'better looking; and Phim, who will be called Wanthong before this ' +
            'is over. The poem tells you at the start that it comes down from ' +
            'ancient times and that there is a text in Suphan. That is the ' +
            'only provenance it offers, and it is worth taking seriously.',
          focus: { marker: 'suphanburi', distance: 30, pitch: 46 },
          reveal: {
            markers: ['suphanburi', 'wat-palelai', 'wat-khae'],
            routes: ['suphan-days'],
            regions: ['plain', 'west-ranges', 'gulf'],
          },
        },
        {
          id: 'the-fathers-death',
          title: 'Cockfight Hill',
          narration:
            'Khun Krai, Phlai Kaeo’s father, is executed by the king and the ' +
            'family’s property is taken. The widow takes the boy west into the ' +
            'hills. This is the wound the whole book is built on: everything ' +
            'Khun Phaen later does to the crown, and everything the crown does ' +
            'back, starts from a father killed by a king he served. There is a ' +
            'shrine on the hill now, to both of them.',
          focus: { marker: 'khao-chon-kai', distance: 34 },
          reveal: {
            markers: ['khao-chon-kai', 'kanchanaburi', 'mae-klong'],
            routes: ['the-flight-west'],
          },
        },
        {
          id: 'the-tamarind',
          title: 'Leaves into Wasps',
          narration:
            'He goes into the monastery, which for a poor boy is the only ' +
            'school there is, and learns rather more than the abbot intended: ' +
            'the inner ways, mantras, yantra diagrams, the trick of turning ' +
            'tamarind leaves into wasps. Wat Khae still has the tamarind — ' +
            'nine and a half metres round, a thousand years old — and the ' +
            'tree is famous because of the poem, not the other way about.',
          focus: { marker: 'wat-khae', distance: 24, pitch: 40 },
        },
        {
          id: 'songkran',
          title: 'Songkran',
          narration:
            'They meet at the New Year, at the temple, in front of everyone. ' +
            'What follows is conducted between a monastery cell and a bedroom ' +
            'window, and the poem is entirely unembarrassed about it. Khun ' +
            'Chang competes the only way he can: he offers Phim’s mother gold ' +
            'equal to her daughter’s weight.',
          focus: { marker: 'suphanburi', distance: 26, pitch: 42 },
        },
        {
          id: 'the-trick',
          title: 'The War That Was a Trick',
          narration:
            'Phlai Kaeo and Phim marry. Khun Chang, who cannot outbid a ' +
            'wedding, goes to court instead and gets the new husband sent off ' +
            'on the king’s service — then comes home and reports him dead. ' +
            'The road east to Ayutthaya is sixty kilometres and it is used, in ' +
            'this poem, exclusively for losing things.',
          focus: { marker: 'ayutthaya', distance: 40 },
          reveal: {
            markers: ['ayutthaya', 'chao-phraya'],
            routes: ['to-the-court'],
          },
        },
        {
          id: 'laothong',
          title: 'Home, With a Second Wife',
          narration:
            'He comes back alive and victorious, which ruins the plan, and ' +
            'with a second wife called Laothong, which rescues it. Wanthong ' +
            'will not forgive the second wife; Khun Chang works the court ' +
            'again; and by the time the dust settles she is living in Khun ' +
            'Chang’s house and he is banished from his own.',
          focus: { marker: 'suphanburi', distance: 30 },
        },
        {
          id: 'three-things',
          title: 'The Three Things',
          narration:
            'Outlawed, he sets about making himself unbeatable: a sword ' +
            'forged from metal taken off stupa peaks and coffin nails, a wild ' +
            'horse subdued with an enchanted mouthful of grass — and, at a ' +
            'cave on the Mae Klong, the third thing. Believing his pregnant ' +
            'wife Bua Khli has been turned against him, he takes the ' +
            'still-born foetus of his own son and binds its spirit to serve ' +
            'him. A stalactite in that cave is her shrine and people still ' +
            'leave offerings there.',
          focus: { marker: 'ban-tham', distance: 26, pitch: 38 },
          reveal: { markers: ['ban-tham'] },
          highlight: { markers: ['ban-tham'] },
        },
        {
          id: 'the-abduction',
          title: 'Into the House',
          narration:
            'He performs a ceremony to get the local spirits on his side, ' +
            'fights off Khun Chang’s guardian spirits, and goes in over the ' +
            'wall. On the way through he finds Kaeo Kiriya, a governor’s ' +
            'daughter mortgaged into slavery against a loan, gives her the ' +
            'money to buy herself free, and takes her too. Then he reaches ' +
            'Wanthong’s room, admires the tapestry hanging outside it, and ' +
            'cuts the string.',
          focus: { marker: 'suphanburi', distance: 22, pitch: 40 },
        },
        {
          id: 'the-forest',
          title: 'The Forest',
          narration:
            'They go west into the hills and live rough, and the poem — which ' +
            'is a poem about houses, property and who owns whom — becomes ' +
            'briefly happy. Khun Chang tells the king it is a rebellion. An ' +
            'army is sent; Khun Phaen stuns it with mantras, raises soldiers ' +
            'out of grass, and kills two of the king’s officers. Then Wanthong ' +
            'falls pregnant and he gives himself up.',
          focus: { at: { x: -0.32, z: 0.58 }, distance: 42 },
          highlight: { routes: ['the-flight-west'] },
        },
        {
          id: 'one-sentence-too-many',
          title: 'Fifteen Years',
          narration:
            'The treason charge collapses — it was never a rebellion — and ' +
            'Khun Chang is fined heavily. Khun Phaen has won. Then he asks the ' +
            'king to release Laothong, and the king, who has been patient ' +
            'exactly as long as he intends to be, puts him in jail instead. He ' +
            'is there about fifteen years. Khun Chang takes Wanthong back and ' +
            'has a son by her.',
          focus: { marker: 'ayutthaya', distance: 30 },
          highlight: { markers: ['ayutthaya'] },
        },
      ],
    },
    {
      id: 'sequel',
      title: 'The First Sequel',
      subtitle: 'The son, the war, and the courtroom',
      chapters: [
        {
          id: 'the-boy',
          title: 'The Boy Runs West',
          narration:
            'Phlai Ngam is eight when his stepfather tries to have him killed, ' +
            'and he runs the same road his father ran: west to Kanchanaburi, ' +
            'to a grandmother, and to his father’s books. This whole sequel is ' +
            'the first story again with the son in the part — which is exactly ' +
            'what it is: a separate telling, dovetailed into the middle of the ' +
            'older one to buy the fifteen years the jail sentence needed.',
          focus: { marker: 'kanchanaburi', distance: 34 },
          highlight: { routes: ['the-flight-west'] },
        },
        {
          id: 'the-princess',
          title: 'Two Kings and a Princess',
          narration:
            'Away east on the Mekong, Vientiane sends a princess west to be ' +
            'married into Ayutthaya. Chiang Mai takes her off the road to ' +
            'break the alliance, and there is now a war. The episode looks ' +
            'modelled on a real one: in 1560 Ayutthaya and Lan Xang made ' +
            'exactly this alliance, and Phitsanulok seized exactly this ' +
            'princess on exactly this errand.',
          focus: { marker: 'vientiane', distance: 60, pitch: 50 },
          reveal: {
            markers: ['vientiane', 'chiang-mai'],
            routes: ['the-princess'],
            regions: ['lanna', 'khorat'],
          },
        },
        {
          id: 'up-the-ping',
          title: 'Up the Ping',
          narration:
            'Phlai Ngam volunteers to lead the army and asks, as his price, ' +
            'for his father out of jail. They go: down the Chao Phraya, north ' +
            'at Nakhon Sawan where the Ping comes in, then up the Ping past ' +
            'Kamphaeng Phet and over into Lanna. The army lives off the ' +
            'country from the moment it leaves the capital, and the villages ' +
            'along the road empty into the forest ahead of it.',
          focus: { marker: 'the-ping', distance: 70, pitch: 46 },
          reveal: {
            markers: ['nakhon-sawan', 'the-ping', 'kamphaeng-phet', 'lampang'],
            routes: ['the-campaign'],
          },
        },
        {
          id: 'chiang-mai',
          title: 'The Jail at Chiang Mai',
          narration:
            'A border outpost is stormed. At Chiang Mai, Khun Phaen walks ' +
            'into the jail where five hundred Ayutthayan soldiers are held, ' +
            'takes the chains off all of them, and they kill the guards and ' +
            'come out with the horses. The city is sacked before the battle is ' +
            'decided. It should be said that the poem does not know the north: ' +
            'every temple it names in Chiang Mai and Lamphun is the wrong one.',
          focus: { marker: 'chiang-mai', distance: 40 },
          highlight: { markers: ['chiang-mai'], routes: ['the-campaign'] },
        },
        {
          id: 'phra-wai',
          title: 'Rewards, and a Wedding',
          narration:
            'They come home like a city on the move, herding prisoners and ' +
            'loot. Khun Phaen is made governor of Kanchanaburi; his son is ' +
            'ennobled as Phra Wai and given two wives — Simala, a governor’s ' +
            'daughter from Phichit, and a daughter of the beaten king of ' +
            'Chiang Mai. Then Khun Chang gets drunk at the wedding and starts ' +
            'the whole quarrel again.',
          focus: { marker: 'ayutthaya', distance: 36 },
          reveal: { markers: ['phichit'] },
        },
        {
          id: 'the-choice',
          title: 'The King Asks Her to Choose',
          narration:
            'Phra Wai takes his mother out of Khun Chang’s house; Khun Chang ' +
            'petitions the king; and the case comes to court for the last ' +
            'time. The king, out of patience with fifty years of this, tells ' +
            'Wanthong to choose between them. She cannot — she loved the one ' +
            'and was kept safe by the other — and he has her executed as a ' +
            'woman with two hearts. Her son gets the reprieve, and it arrives ' +
            'just too late. This ending is the oldest thing in the poem: it is ' +
            'what the rest was built to reach.',
          focus: { marker: 'ayutthaya', distance: 24, pitch: 40 },
          highlight: { markers: ['ayutthaya'] },
        },
        {
          id: 'how-we-have-it',
          title: 'How We Have It At All',
          narration:
            'None of this was written by anybody. It was recited for ' +
            'centuries by troubadours beating time on hardwood clappers, ' +
            'copied into folding manuscripts, printed by Samuel Smith in 1872 ' +
            'and the Wat Ko press in 1889, and finally edited into a standard ' +
            'text by Prince Damrong in 1917–18 from four sets of manuscripts, ' +
            'with the parts he thought obscene removed. The complete English ' +
            'this world was read from is Baker and Pasuk’s, 2010, which puts a ' +
            'great deal of that back.',
          focus: { marker: 'bangkok', distance: 44, pitch: 48 },
          reveal: {
            markers: ['bangkok', 'sukhothai'],
            routes: ['how-it-reached-us'],
          },
          highlight: { routes: ['how-it-reached-us'] },
        },
      ],
    },
  ],
}
