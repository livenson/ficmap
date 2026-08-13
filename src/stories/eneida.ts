import type { Story } from '../types'
import medHeight from '../assets/mediterranean-height.png'

/**
 * Eneida — Ivan Kotliarevsky's mock-heroic poem (1798), the first work of the
 * modern Ukrainian language: Virgil's Aeneid retold with the Trojans as
 * Zaporozhian Cossacks, gods who feast and squabble, and a hell full of the
 * poet's own villains. User-authored, paraphrased data — original summaries,
 * not the poet's text.
 *
 * The surface is a REAL heightmap: a Terrarium DEM of the classical
 * Mediterranean (Iberia and the Maghreb, Italy and Sicily, Greece and Asia
 * Minor), so Aeneas's wanderings run across the real sea. Rebuild with
 * `node scripts/build-heightmap.mjs mediterranean`.
 *
 * Above and below it hang the two realms that make the Eneida such a fit for
 * ficmap's floor mechanic: OLYMPUS, a luminous cloud-realm where the gods
 * carouse, and PEKLO — the burlesque Hell where crooked lords and unjust
 * judges stew in the cauldrons.
 */
export const eneida: Story = {
  id: 'eneida',
  title: 'Eneida',
  subtitle: 'Aeneas among the Cossacks',
  author: 'Ivan Kotliarevsky',
  region: 'The Mediterranean · Olympus · Peklo',
  epoch: 'Published 1798',
  group: 'epic',
  intro:
    'Troy is ash, and Aeneas — here a swaggering Zaporozhian Cossack — puts to ' +
    'sea with his band to find a promised land. Storms, a queen’s love, funeral ' +
    'games, a descent into Hell and the meddling of tipsy gods stand in his way. ' +
    'Press ▶ Play story for the whole voyage, or use the floor switcher to climb ' +
    'to Olympus or go down into Peklo.',
  surfaceName: 'The Voyage',
  terrain: {
    music: {
      title: 'Theme for the Eneida',
      credit: 'Original, written for this atlas',
      melody: 'G3:1 A3:1 B3:2 D4:2 B3:2 G3:2 A3:2 B3:4 r:1 C4:1 D4:1 E4:2 D4:2 B3:2 A3:2 G3:6 r:2',
      bass: 'G2:8 C3:8 D3:8 G2:8',
      tempo: 68,
      voice: 'harp',
      mood: 'wonder',
    },
    seed: 'mediterranean-dem',
    heightmap: medHeight,
    aspect: 1.77, // the Mediterranean crop, kept in real proportion
    seaLevel: 0.002,
    heightScale: 13,
    waterColor: '#2f6f92',
    biomes: [
      { maxHeight: 0.002, color: '#2f6f92', name: 'The Sea' },
      { maxHeight: 0.009, color: '#d7c9a2', name: 'Shore' },
      { maxHeight: 0.035, color: '#b6a06a', name: 'Coast' },
      { maxHeight: 0.09, color: '#93a05a', name: 'Olive Hills' },
      { maxHeight: 0.2, color: '#7f854c', name: 'Uplands' },
      { maxHeight: 0.45, color: '#8a8274', name: 'Crags' },
      { maxHeight: 1.0, color: '#eef1f4', name: 'Snows' },
    ],
  },
  ambient: { trees: 0.35, treeKind: 'broadleaf', birds: 8, fish: 6 },
  markers: [
    {
      id: 'troy',
      name: 'Troy',
      kind: 'ruin',
      at: { x: 0.79, z: -0.24 },
      description:
        'The burning city on the Asian shore. From its ruin Aeneas and his ' +
        'rowdy Cossack band put to sea, carrying the household gods of Troy.',
    },
    {
      id: 'aeolia',
      name: 'Aeolia',
      kind: 'danger',
      at: { x: 0.34, z: -0.08 },
      description:
        'The isle of the winds. Juno, who cannot abide Aeneas, bribes Aeolus to ' +
        'loose a storm on his ships — until Neptune, bribed better, calms the sea.',
    },
    {
      id: 'carthage',
      name: 'Carthage',
      kind: 'city',
      at: { x: -0.09, z: 0.14 },
      description:
        'Queen Dido’s city on the Libyan coast, where the shipwrecked Aeneas is ' +
        'feasted and loved — and lingers, feasting and dancing, until the gods ' +
        'order him on and the heartbroken queen is left behind.',
    },
    {
      id: 'drepanum',
      name: 'Drepanum (Sicily)',
      kind: 'landmark',
      at: { x: 0.03, z: 0.0 },
      description:
        'The Sicilian shore where old Anchises died and where Aeneas holds ' +
        'boisterous funeral games — races, boxing and drink — in his honour.',
    },
    {
      id: 'cumae',
      name: 'Cumae',
      kind: 'danger',
      at: { x: 0.12, z: -0.34 },
      description:
        'The cave of the Sibyl, and the mouth of the underworld. Bearing the ' +
        'golden bough, Aeneas goes down here into Peklo to seek his father.',
    },
    {
      id: 'latium',
      name: 'Latium',
      kind: 'capital',
      at: { x: 0.03, z: -0.49 },
      description:
        'The promised land on the Italian shore. Here Aeneas wars with Turnus ' +
        'for the hand of Lavinia, wins her, and founds the line that is to come.',
    },
    {
      id: 'delos',
      name: 'Delos',
      kind: 'landmark',
      at: { x: 0.5, z: 0.03 },
      description:
        'The oracle-isle of the Aegean, where Aeneas is bidden to seek the ' +
        'ancient land of his fathers — a riddle that sends the Trojans wandering.',
    },
    {
      id: 'pallanteum',
      name: 'Pallanteum',
      kind: 'town',
      at: { x: -0.02, z: -0.56 },
      description:
        'Old King Evander’s little town on the seven hills where Rome will one ' +
        'day stand. Here Aeneas wins an ally and the young prince Pallas.',
    },
    {
      id: 'ardea',
      name: 'Ardea',
      kind: 'battle',
      at: { x: 0.13, z: -0.4 },
      description:
        'The stronghold of Turnus, king of the Rutulians — Aeneas’s rival for ' +
        'Lavinia and the fiercest foe of the war for Latium.',
    },
  ],
  routes: [
    {
      id: 'voyage',
      name: 'The Voyage of Aeneas',
      points: [
        { x: 0.79, z: -0.24 },
        { x: 0.5, z: 0.03 },
        { x: 0.34, z: -0.08 },
        { x: -0.09, z: 0.14 },
        { x: 0.03, z: 0.0 },
        { x: 0.12, z: -0.34 },
        { x: 0.03, z: -0.49 },
      ],
      color: '#ffcf5a',
      style: 'solid',
      description:
        'From the ruin of Troy, by storm and queen and games and Hell, to the ' +
        'destined shore of Latium.',
    },
  ],
  regions: [
    { id: 'sea', name: 'The Mediterranean', at: { x: -0.35, z: 0.35 }, scale: 1.4 },
    { id: 'italy', name: 'Ausonia', at: { x: 0.06, z: -0.42 }, scale: 0.9 },
    { id: 'libya', name: 'Libya', at: { x: -0.2, z: 0.7 }, scale: 1.0 },
    { id: 'asia', name: 'Asia Minor', at: { x: 0.82, z: -0.05 }, scale: 0.9 },
  ],
  elements: [
    {
      id: 'penates',
      name: 'The Trojan Penates',
      glyph: '⚱',
      description:
        'The household gods carried out of burning Troy — the sacred charge ' +
        'Aeneas bears across the sea to plant in a new land, the seed of the ' +
        'realm to come.',
      journey: [
        { marker: 'troy', sinceChapter: 0, note: 'Borne from the flames of Troy.' },
        { marker: 'carthage', sinceChapter: 1, note: 'Set down a while in Dido’s Carthage.' },
        { marker: 'drepanum', sinceChapter: 3, note: 'Carried through the games in Sicily.' },
        { marker: 'latium', sinceChapter: 5, note: 'Planted at last on the Latin shore.' },
      ],
    },
  ],
  levels: [
    {
      id: 'olympus',
      title: 'Olympus',
      subtitle: 'The hall of the gods',
      tier: 1,
      terrain: {
        seed: 'eneida-olympus',
        sky: 'heaven',
        frequency: 1.5,
        islandFalloff: 0.5,
        seaLevel: 0.42,
        heightScale: 14,
        octaves: 4,
        waterColor: '#eef4fb',
        biomes: [
          { maxHeight: 0.42, color: '#dfe9f5', name: 'Cloud-Sea' },
          { maxHeight: 0.5, color: '#cfddf0', name: 'Mist' },
          { maxHeight: 0.64, color: '#e7dcbf', name: 'Golden Meadow' },
          { maxHeight: 0.82, color: '#efe6cf', name: 'Marble' },
          { maxHeight: 1.0, color: '#fff7e2', name: 'Sunlit Peak' },
        ],
      },
      ambient: { trees: 0.15, treeColor: '#c9b06a', birds: 9 },
      markers: [
        {
          id: 'jove-hall',
          name: 'The Hall of Jove',
          kind: 'capital',
          at: { x: 0.0, z: -0.2 },
          description:
            'Zeus — here a grumbling patriarch — keeps the high hall, where the ' +
            'fate of Aeneas is decreed between cups.',
        },
        {
          id: 'gods-table',
          name: 'The Gods’ Table',
          kind: 'landmark',
          at: { x: -0.28, z: 0.12 },
          description:
            'The long board where the gods carouse, gossip and squabble like a ' +
            'noisy village council — the Eneida’s funniest, most human scenes.',
        },
        {
          id: 'venus-bower',
          name: 'Venus’s Bower',
          kind: 'city',
          at: { x: 0.34, z: 0.08 },
          description:
            'Venus, Aeneas’s doting mother, wheedles and flirts her son’s cause ' +
            'through the council of heaven.',
        },
        {
          id: 'juno-throne',
          name: 'Juno’s Throne',
          kind: 'city',
          at: { x: -0.1, z: -0.5 },
          description:
            'Juno, who loathes the Trojans, schemes storm and war against them ' +
            'at every turn.',
        },
        {
          id: 'aeolus-cave',
          name: 'Aeolus’s Cave of Winds',
          kind: 'danger',
          at: { x: 0.42, z: -0.4 },
          description:
            'The blustering wind-god’s cave, loosed against Aeneas’s ships for a ' +
            'promised bribe.',
        },
        {
          id: 'neptune-court',
          name: 'Neptune’s Court',
          kind: 'port',
          at: { x: 0.16, z: 0.36 },
          description:
            'The sea-god’s hall. Better bribed than Juno, Neptune stills the ' +
            'storm that Aeolus raised and lets the Trojan ships run on.',
        },
        {
          id: 'vulcan-forge',
          name: 'Vulcan’s Forge',
          kind: 'ruin',
          at: { x: -0.42, z: 0.34 },
          description:
            'The smith-god’s fiery forge where — at Venus’s coaxing — the divine ' +
            'armour is hammered out for Aeneas’s last war.',
        },
      ],
      routes: [
        {
          id: 'plea',
          name: 'Venus’s Plea',
          points: [
            { x: 0.34, z: 0.08 },
            { x: -0.28, z: 0.12 },
            { x: 0.0, z: -0.2 },
          ],
          color: '#ffd9a8',
          style: 'dashed',
          description:
            'The course of Aeneas’s cause through heaven: from Venus’s bower, ' +
            'through the wrangling of the gods’ table, to the throne of Jove ' +
            'where his fate is decreed.',
        },
        {
          id: 'errands',
          name: 'The Gods’ Errands',
          points: [
            { x: -0.1, z: -0.5 },
            { x: 0.18, z: -0.46 },
            { x: 0.42, z: -0.4 },
            { x: 0.32, z: 0.02 },
            { x: 0.16, z: 0.36 },
            { x: -0.14, z: 0.38 },
            { x: -0.42, z: 0.34 },
            { x: -0.22, z: 0.0 },
            { x: 0.0, z: -0.2 },
          ],
          color: '#c8b0e0',
          style: 'solid',
          description:
            'Nothing on this floor stays still. Juno goes to Aeolus to buy a ' +
            'storm, Neptune has to be fetched to put the sea back, Venus ' +
            'goes down to Vulcan’s forge for armour, and all of it ends up ' +
            'back at Jove’s hall being argued over.',
        },
      ],
      regions: [
        { id: 'heaven', name: 'Olympus', at: { x: 0.0, z: 0.0 }, scale: 1.3 },
      ],
    },
    {
      id: 'peklo',
      title: 'Peklo',
      subtitle: 'The burlesque Hell',
      tier: -1,
      terrain: {
        seed: 'eneida-peklo',
        sky: 'dark',
        frequency: 1.9,
        islandFalloff: 0.2,
        seaLevel: 0.34,
        heightScale: 16,
        octaves: 5,
        riverColor: '#ff7a2a',
        waterColor: '#e0561f',
        biomes: [
          { maxHeight: 0.34, color: '#d6461a', name: 'Lake of Fire' },
          { maxHeight: 0.42, color: '#5a2a18', name: 'Cinders' },
          { maxHeight: 0.58, color: '#3e2a22', name: 'Brimstone' },
          { maxHeight: 0.74, color: '#2c2422', name: 'Ashen Crag' },
          { maxHeight: 1.0, color: '#151013', name: 'Black Rock' },
        ],
      },
      ambient: { trees: 0, birds: 0, dragons: 4 },
      markers: [
        {
          id: 'gates',
          name: 'The Gates of Peklo',
          kind: 'danger',
          at: { x: -0.55, z: -0.25 },
          description:
            'The mouth of Hell below Cumae, where the Sibyl leads Aeneas past ' +
            'the guardian into the dark.',
        },
        {
          id: 'styx',
          name: 'The River Styx',
          kind: 'landmark',
          at: { x: -0.28, z: 0.02 },
          description:
            'The black river the dead must cross — ferried over by a surly, ' +
            'greedy boatman who haggles for his fare.',
        },
        {
          id: 'cauldrons',
          name: 'The Cauldrons',
          kind: 'danger',
          at: { x: 0.04, z: 0.2 },
          description:
            'Kotliarevsky’s satirical Hell: crooked lords, bribe-taking judges ' +
            'and cruel masters stew in the pitch and pay for the wrongs they did ' +
            'the poor.',
        },
        {
          id: 'tar-pits',
          name: 'The Tar Pits',
          kind: 'danger',
          at: { x: 0.34, z: 0.06 },
          description:
            'Boiling pitch for the misers, cheats and lying matchmakers — the ' +
            'small, mean sinners who crowd Kotliarevsky’s Hell.',
        },
        {
          id: 'plutos-hall',
          name: 'Pluto’s Hall',
          kind: 'capital',
          at: { x: 0.42, z: -0.3 },
          description:
            'The dark lord of the underworld keeps his court among the fires.',
        },
        {
          id: 'elysium',
          name: 'The Blessed Fields',
          kind: 'landmark',
          at: { x: 0.05, z: -0.55 },
          description:
            'A calmer corner where the just and the brave rest. Here Aeneas ' +
            'finds old Anchises, who shows him the glory his line will win.',
        },
      ],
      routes: [
        {
          id: 'descent',
          name: 'The Descent of Aeneas',
          points: [
            { x: -0.55, z: -0.25 },
            { x: -0.28, z: 0.02 },
            { x: 0.04, z: 0.2 },
            { x: 0.34, z: 0.06 },
            { x: 0.42, z: -0.3 },
            { x: 0.05, z: -0.55 },
          ],
          color: '#ff8a3a',
          style: 'dashed',
          description:
            'From the Gates, across the Styx and past the cauldrons of the ' +
            'sinners, to the Blessed Fields where Anchises waits.',
        },
      ],
      regions: [
        { id: 'hell', name: 'Peklo', at: { x: 0.0, z: 0.0 }, scale: 1.3 },
      ],
    },
  ],
  chapters: [
    {
      id: 'ch1',
      title: 'Out of Troy, into the Storm',
      narration:
        'Troy is ash. Aeneas — a broad-shouldered Zaporozhian in all but name — ' +
        'loads his band and the household gods aboard and rows out to sea. Juno, ' +
        'who hates him, bribes Aeolus to raise a storm; his ships are scattered ' +
        'until Neptune, better bribed, stills the water.',
      focus: { marker: 'troy', distance: 30 },
      reveal: {
        markers: ['troy', 'aeolia', 'delos'],
        routes: ['voyage'],
        regions: ['asia', 'sea'],
      },
      highlight: { markers: ['troy'] },
    },
    {
      id: 'ch2',
      title: 'Carthage & Queen Dido',
      narration:
        'Cast ashore in Libya, Aeneas is taken in by Queen Dido and her court. ' +
        'There is feasting, dancing and love — and a long, merry idleness — ' +
        'until heaven grows impatient and the queen’s happiness is doomed.',
      focus: { marker: 'carthage', distance: 26 },
      reveal: { markers: ['carthage'], regions: ['libya'] },
      highlight: { markers: ['carthage'] },
    },
    {
      id: 'ch3',
      title: 'Olympus — The Gods Carouse',
      level: 'olympus',
      narration:
        'High above, the gods squabble over Aeneas like a village council in ' +
        'their cups. Venus pleads for her son; Juno rages against him; and Jove, ' +
        'between draughts, decrees that he shall reach his promised shore.',
      focus: { marker: 'gods-table', distance: 24 },
      reveal: {
        markers: [
          'jove-hall',
          'gods-table',
          'venus-bower',
          'juno-throne',
          'aeolus-cave',
          'neptune-court',
          'vulcan-forge',
        ],
        routes: ['plea'],
        regions: ['heaven'],
      },
      highlight: { markers: ['gods-table', 'jove-hall'] },
    },
    {
      id: 'ch4',
      title: 'Sicily — The Funeral Games',
      narration:
        'On the Sicilian shore, at the grave of his father Anchises, Aeneas ' +
        'holds funeral games — foot-races, boxing and no small drinking — a ' +
        'boisterous Cossack feast for the dead.',
      focus: { marker: 'drepanum', distance: 24 },
      reveal: { markers: ['drepanum'], regions: ['italy'] },
      highlight: { markers: ['drepanum'] },
    },
    {
      id: 'ch5',
      title: 'Peklo — The Descent',
      level: 'peklo',
      narration:
        'At Cumae, golden bough in hand, Aeneas follows the Sibyl down into ' +
        'Peklo. Past the greedy ferryman and the cauldrons — where crooked lords ' +
        'and unjust judges boil for their sins — he comes to the Blessed Fields ' +
        'and to Anchises, who shows him the glory of the line to come.',
      focus: { marker: 'cauldrons', distance: 26 },
      reveal: {
        markers: ['gates', 'styx', 'cauldrons', 'tar-pits', 'plutos-hall', 'elysium'],
        routes: ['descent'],
        regions: ['hell'],
      },
      highlight: { markers: ['cauldrons', 'elysium'] },
    },
    {
      id: 'ch6',
      title: 'Latium — The War for the Bride',
      narration:
        'Landing at last on the Latin shore, Aeneas is offered the princess ' +
        'Lavinia — and must fight the fierce Turnus for her. He wins the war and ' +
        'the bride, plants the gods of Troy in new earth, and founds the line ' +
        'that is to come.',
      focus: { marker: 'latium', distance: 24 },
      reveal: { markers: ['latium', 'pallanteum', 'ardea'] },
      highlight: { markers: ['latium', 'ardea'] },
    },
  ],
}
