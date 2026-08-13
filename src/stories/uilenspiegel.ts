import type { Story } from '../types'
import flandersHeight from '../assets/flanders-height.png'

/**
 * La Légende d'Ulenspiegel — Charles De Coster, 1867 (d. 1879 → public
 * domain). Belgium's national epic, written in the same 19th-century wave as
 * Kalevipoeg, Lāčplēsis and Schiller's Tell, and the fifth of them here.
 *
 * De Coster took Till Eulenspiegel — the medieval German trickster, a jester
 * who plays literal-minded practical jokes on burghers — moved him three
 * hundred years forward into the Revolt of the Netherlands, and turned him
 * into a resistance fighter whose father is burned by the Inquisition. The
 * German figure and this one are the same name and almost nothing else, which
 * is why the marker at Damme links across to the Nibelungen map's Germany.
 *
 * The map's shape is the book's: it starts on land, in the Flemish towns, and
 * ends at sea with the Beggars. Markers at their true coordinates —
 *
 *   map x = (lon − 1.8) / 2.5 − 1      map z = (52.4 − lat) / 1.4 − 1
 *
 * Narration paraphrases De Coster; it quotes no translation.
 */
export const uilenspiegel: Story = {
  id: 'uilenspiegel',
  title: 'Tijl Uilenspiegel',
  subtitle: 'The ashes of Claes beat on my heart',
  author: 'Charles De Coster',
  region: 'Flanders, Brabant & the Zeeland sea',
  epoch: 'Belgian national epic · 1867 · set in the 1500s',
  group: 'epic',
  intro:
    'A joker from Damme whose father is burned for heresy, who keeps the ' +
    'ashes in a bag round his neck and goes to war for it. Press ▶ Play story ' +
    'to follow the whole book — the fires in the Flemish towns, the road to ' +
    'Brussels and back, and then the turn out to sea with the Beggars, where ' +
    'a country that keeps losing on land starts winning on water.',
  surfaceName: 'The Low Countries',
  ambient: {
    trees: 0.4,
    treeKind: 'broadleaf',
    birds: 7,
    fish: 6,
    // The North Sea weather, over the sea and the Zeeland estuaries where the
    // second half of the book is fought.
    rain: true,
    rainArea: { x0: -1.0, x1: 0.05, z0: -1.0, z1: -0.22 },
  },
  terrain: {
    music: {
      // The Beggars' own song — the Geuzenlied tradition of the 1560s, sung
      // marching and on shipboard. The tunes survive in the Geuzenliedboek but
      // not reliably in my head, so this is written in that idiom rather than
      // transcribed: a short, hard, singable strophe over a marching bass.
      title: 'A Beggars’ Song',
      credit: 'After the Geuzenlied tradition · original',
      melody:
        'D4:1 D4:1 A4:2 A4:1 Bb4:1 A4:2 G4:1 F4:1 E4:2 D4:4 r:1 ' +
        'F4:1 G4:1 A4:2 Bb4:1 A4:1 G4:2 F4:1 E4:1 D4:2 A3:2 D4:4 r:2',
      bass: 'D2:4 A2:4 Bb2:4 A2:4 D2:4 D2:4',
      tempo: 96,
      voice: 'horn',
      mood: 'epic',
    },
    seed: 'uilenspiegel-1', // unused: the heightmap takes precedence
    heightmap: flandersHeight,
    // Printed by scripts/build-heightmap.mjs for this DEM.
    seaLevel: 0.0085,
    // 350 km across by 311 km down.
    aspect: 1.126,
    // The high point in this box is 696 m in the Ardennes, and Flanders itself
    // is a few metres above the tide. Keep the relief small and honest.
    // Start high. The second half of the book is fought in the estuaries,
    // and from the usual low angle the Ardennes fill the foreground while
    // the sea that decides the war is a band at the top.
    overhead: true,
    heightScale: 12,
    rivers: 6,
    biomes: [
      { maxHeight: 0.0085, color: '#2b5871', name: 'The North Sea' },
      { maxHeight: 0.1, color: '#d8cca4', name: 'Dunes & polder' },
      { maxHeight: 0.28, color: '#7ba756', name: 'Flanders' },
      { maxHeight: 0.5, color: '#5f9450', name: 'Brabant' },
      { maxHeight: 0.72, color: '#3f7742', name: 'The Ardennes' },
      { maxHeight: 1.0, color: '#8a8a70', name: 'The high fens' },
    ],
  },

  markers: [
    {
      id: 'damme',
      name: 'Damme',
      kind: 'capital',
      at: { x: -0.407, z: -0.179 },
      description:
        'Uilenspiegel is born here on the same day as Philip II of Spain, and ' +
        'the book cuts between the two babies to tell you what it is about. ' +
        'Damme is a real small town outside Bruges, and it has a statue of him. ' +
        'His father Claes is burned in its market place.',
      link: {
        world: 'nibelungen',
        marker: 'xanten',
        note: 'The Rhine, and the Germany this name came from three centuries earlier.',
      },
    },
    {
      id: 'claes-fire',
      name: 'Where Claes Burned',
      kind: 'danger',
      at: { x: -0.408, z: -0.181 },
      description:
        'Claes the charcoal-burner is denounced for a handful of florins, ' +
        'tried, and burned at the stake in his own town. His son takes ashes ' +
        'from the fire and his mother sews them into a little bag, and he wears ' +
        'it round his neck for the rest of the book and says, whenever the plot ' +
        'needs moving: the ashes of Claes beat on my heart.',
    },
    {
      id: 'bruges',
      name: 'Bruges',
      kind: 'city',
      at: { x: -0.43, z: -0.149 },
      description:
        'The old cloth city, already silting up and losing its sea, and the ' +
        'seat of the courts that send people from Damme to the stake. Nele and ' +
        'her mother come and go from here.',
    },
    {
      id: 'ghent',
      name: 'Ghent',
      kind: 'city',
      at: { x: -0.233, z: -0.039 },
      description:
        'The most rebellious city in the Netherlands, and Charles V’s own ' +
        'birthplace — which did not stop him putting its leaders in white ' +
        'shirts with nooses round their necks to walk through their own town. ' +
        'Ghent is where the book’s anger comes from.',
    },
    {
      id: 'antwerp',
      name: 'Antwerp',
      kind: 'city',
      at: { x: 0.041, z: -0.157 },
      description:
        'The richest port in Europe at the start of the century and a ruin by ' +
        'the end of it, once the Beggars shut the Scheldt. Everything that goes ' +
        'wrong for Spain in this book is downstream of losing the water.',
    },
    {
      id: 'brussels',
      name: 'Brussels',
      kind: 'capital',
      at: { x: 0.021, z: 0.107 },
      description:
        'Where the Duke of Alba holds his Council of Blood, and where Egmont ' +
        'and Hoorn lose their heads in the Grand Place in 1568 — the two ' +
        'executions that turn a tax revolt into a war.',
    },
    {
      id: 'ypres',
      name: 'Ypres',
      kind: 'town',
      at: { x: -0.566, z: 0.107 },
      description:
        'Uilenspiegel goes through the cloth towns of the south-west as a ' +
        'pilgrim, a painter, a pedlar and anything else that gets him past a ' +
        'guard. Half the book is him talking his way out of rooms.',
    },
    {
      id: 'dunkirk',
      name: 'Dunkirk',
      kind: 'port',
      at: { x: -0.769, z: -0.025 },
      description:
        'The south-west end of the coast, and Spanish. The whole shore between ' +
        'here and Zeeland is the front line of the second half: whoever holds ' +
        'the water holds the country.',
    },
    {
      id: 'ostend',
      name: 'Ostend',
      kind: 'port',
      at: { x: -0.553, z: -0.155 },
      description:
        'A fishing town that becomes a fortress. The North Sea is not scenery ' +
        'in this book — it is the thing the Beggars use when every town in ' +
        'Flanders has been taken off them.',
    },
    {
      id: 'sluis',
      name: 'Sluis',
      kind: 'port',
      at: { x: -0.367, z: -0.22 },
      description:
        'The sea gate for Bruges and Damme, and the way a man from an inland ' +
        'market town ends up on a ship. Uilenspiegel’s road from the ashes to ' +
        'the Beggars runs through here.',
    },
    {
      id: 'flushing',
      name: 'Flushing',
      kind: 'port',
      at: { x: -0.28, z: -0.325 },
      description:
        'Vlissingen, taken by the Beggars in 1572 a few weeks after Brielle — ' +
        'and with it the mouth of the Scheldt, which is the same as taking ' +
        'Antwerp’s trade and Spain’s money.',
    },
    {
      id: 'brielle',
      name: 'Brielle',
      kind: 'battle',
      at: { x: -0.054, z: -0.643 },
      description:
        'The first town the Sea Beggars actually hold, taken on 1 April 1572 by ' +
        'a fleet that had been thrown out of every English port and had ' +
        'nowhere else to go. It is the turn of the whole war, and it happens ' +
        'because they were homeless.',
    },
    {
      id: 'middelburg',
      name: 'Middelburg',
      kind: 'town',
      at: { x: -0.276, z: -0.357 },
      description:
        'The Zeeland island town, besieged and starved out. The islands here ' +
        'are the Beggars’ country: shallow, tidal, impossible for a Spanish ' +
        'army and perfectly easy for men in flat boats.',
    },
    {
      id: 'lamme',
      name: 'Lamme’s Road',
      kind: 'landmark',
      at: { x: -0.28, z: -0.036 },
      description:
        'Lamme Goedzak — Lamme Goodfellow — walks the whole book beside ' +
        'Uilenspiegel looking for the wife who left him and eating enormously ' +
        'while he does it. He is the book’s Flanders: patient, hungry, ' +
        'unheroic, and there at the end.',
    },
    {
      id: 'nele',
      name: 'Nele’s House',
      kind: 'landmark',
      at: { x: -0.416, z: -0.172 },
      description:
        'Nele grows up next door, waits through the entire war, and is the one ' +
        'who wakes him at the end — because the book does not let him die. ' +
        'Bury Uilenspiegel? they ask. He gets up and says nobody buries the ' +
        'spirit of Flanders.',
    },
    {
      id: 'ardennes',
      name: 'The Ardennes',
      kind: 'forest',
      at: { x: 0.64, z: 0.5 },
      description:
        'The wooded high country in the east, where the Spanish columns come ' +
        'up from Italy and Luxembourg along the Spanish Road. The war arrives ' +
        'in Flanders from this direction.',
    },
    {
      id: 'spanish-road',
      name: 'The Road from Spain',
      kind: 'landmark',
      at: { x: 0.9, z: 0.893 },
      description:
        'Off the south-east corner: the overland route Spain used to march ' +
        'tercios from Milan up through Savoy, Franche-Comté and Lorraine, ' +
        'because the sea route was not safe. Alba came this way in 1567 with ' +
        'ten thousand men.',
    },
  ],

  regions: [
    { id: 'r-flanders', name: 'FLANDERS', at: { x: -0.3, z: -0.6 }, scale: 1.05 },
    { id: 'r-brabant', name: 'BRABANT', at: { x: 0.14, z: -0.42 } },
    { id: 'r-zeeland', name: 'ZEELAND', at: { x: -0.08, z: -0.78 } },
    { id: 'r-sea', name: 'The North Sea', at: { x: -0.72, z: -0.72 }, scale: 1.05 },
    { id: 'r-wallonia', name: 'THE ARDENNES', at: { x: 0.56, z: 0.62 } },
  ],

  routes: [
    {
      id: 'the-fires',
      name: 'The road of the fires',
      color: '#d76b6b',
      style: 'solid',
      description:
        'Damme to Bruges to Ghent: the Inquisition’s circuit through the towns, ' +
        'and the road Uilenspiegel walks afterwards with a bag of ashes round ' +
        'his neck, asking who informed.',
      points: [
        { x: -0.407, z: -0.179 },
        { x: -0.43, z: -0.149 },
        { x: -0.332, z: -0.094 },
        { x: -0.233, z: -0.039 },
      ],
    },
    {
      id: 'to-brussels',
      name: 'The road to Brussels',
      color: '#c98a5a',
      style: 'solid',
      description:
        'South-east through Brabant to the capital, where the Council of Blood ' +
        'sits and where Egmont and Hoorn are beheaded in the market square in ' +
        'front of the people they governed.',
      points: [
        { x: -0.233, z: -0.039 },
        { x: -0.106, z: 0.034 },
        { x: 0.021, z: 0.107 },
      ],
    },
    {
      id: 'wandering',
      name: 'Uilenspiegel and Lamme',
      color: '#ffd27a',
      style: 'solid',
      description:
        'The picaresque half: the two of them through the cloth towns and down ' +
        'the coast as pilgrims, pedlars, painters and anything else that gets ' +
        'them past a checkpoint — Lamme looking for his wife the entire way.',
      points: [
        { x: 0.021, z: 0.107 },
        { x: -0.272, z: 0.107 },
        { x: -0.566, z: 0.107 },
        { x: -0.28, z: -0.036 },
        { x: -0.769, z: -0.025 },
        { x: -0.661, z: -0.09 },
        { x: -0.553, z: -0.155 },
      ],
    },
    {
      id: 'the-beggars',
      name: 'The Sea Beggars',
      color: '#6fb3d6',
      style: 'solid',
      description:
        'The turn. Thrown out of every English harbour and with nothing left to ' +
        'lose, the Beggars take Brielle on 1 April 1572, then Flushing and the ' +
        'Scheldt mouth, and the war changes hands on the water.',
      points: [
        { x: -0.553, z: -0.155 },
        { x: -0.353, z: -0.35 },
        { x: -0.054, z: -0.643 },
        { x: -0.28, z: -0.325 },
        { x: -0.276, z: -0.357 },
      ],
    },
    {
      id: 'from-spain',
      name: 'Alba’s road',
      color: '#b58fd0',
      style: 'dashed',
      description:
        'The Spanish Road: tercios marched overland from Milan through Savoy ' +
        'and Lorraine and up the Ardennes, because the Channel was not safe. ' +
        'The war walks into Flanders from the south-east.',
      points: [
        { x: 0.9, z: 0.893 },
        { x: 0.64, z: 0.5 },
        { x: 0.331, z: 0.303 },
        { x: 0.021, z: 0.107 },
      ],
    },
    {
      id: 'scheldt',
      name: 'The Scheldt shut',
      color: '#7fc4dd',
      style: 'dashed',
      description:
        'From the sea up the estuary to Antwerp. Close this line and the ' +
        'richest port in Europe stops being a port — which is exactly what the ' +
        'Beggars do, and what finishes Antwerp for three hundred years.',
      points: [
        { x: -0.28, z: -0.325 },
        { x: -0.152, z: -0.258 },
        { x: -0.039, z: -0.199 },
        { x: 0.041, z: -0.157 },
      ],
    },
  ],

  elements: [
    {
      id: 'ashes',
      name: 'The Ashes of Claes',
      glyph: '🔥',
      description:
        'A handful of ash from his father’s pyre, sewn into a bag and worn on ' +
        'a string round his neck for the whole book. It is not a relic and not ' +
        'a magic object. It is a refusal to let the thing be over, and it goes ' +
        'everywhere he goes, including to sea.',
      journey: [
        { marker: 'claes-fire', note: 'Taken out of the fire in the market place at Damme.' },
        { marker: 'brussels', sinceChapter: 5, note: 'Carried to the men who ordered it.' },
        { marker: 'brielle', sinceChapter: 9, note: 'Aboard, when the war turns.' },
        { marker: 'damme', sinceChapter: 12, note: 'Home, and still not buried.' },
      ],
    },
    {
      id: 'lamme-wife',
      name: 'Lamme’s Wife',
      glyph: '♥',
      description:
        'Lamme Goedzak spends four hundred pages and an entire revolution ' +
        'looking for the wife who left him. He finds her, at the very end, in ' +
        'a monastery where she had been talked into penitence — and the book ' +
        'gives him that before it gives anyone anything else.',
      journey: [
        { marker: 'damme', note: 'Gone, before the book starts.' },
        { marker: 'ypres', sinceChapter: 7, note: 'Looked for in every town they pass.' },
        { marker: 'flushing', sinceChapter: 11, note: 'Found, and the search ends.' },
      ],
    },
  ],

  books: [
    {
      id: 'i',
      title: 'I · The Ashes',
      subtitle: 'Two babies, one fire, and a bag on a string',
      chapters: [
        {
          id: 'i-1',
          title: 'Born the same day',
          narration:
            'In Damme, to a charcoal-burner, a boy called Thyl Uilenspiegel. ' +
            'In Valladolid, on the same day, to the Emperor, a boy called ' +
            'Philip. De Coster cuts between the two cradles for several ' +
            'chapters and never has to explain the book again.',
          focus: { marker: 'damme', distance: 34, pitch: 42 },
          reveal: {
            markers: ['damme', 'bruges', 'nele', 'sluis'],
            regions: ['r-flanders', 'r-sea'],
          },
          highlight: { markers: ['damme'] },
        },
        {
          id: 'i-2',
          title: 'The fire in the market place',
          narration:
            'Claes is denounced by a neighbour for the reward, convicted of ' +
            'heresy and burned in his own town. Soetkin his wife dies of what ' +
            'they do to her afterwards. Their son takes ash from the pyre, and ' +
            'she sews it into a bag, and he puts it round his neck.',
          focus: { marker: 'claes-fire', distance: 22, pitch: 36 },
          reveal: { markers: ['claes-fire'], routes: ['the-fires'] },
          highlight: { markers: ['claes-fire'] },
        },
        {
          id: 'i-3',
          title: 'Ghent in the white shirts',
          narration:
            'The book keeps reaching back for why. Charles V, born in Ghent, ' +
            'put the leaders of his own birthplace through the streets ' +
            'barefoot in white shirts with nooses round their necks. This is a ' +
            'country that has been told for two generations what happens.',
          focus: { marker: 'ghent', distance: 30, pitch: 40 },
          reveal: { markers: ['ghent', 'antwerp'], regions: ['r-brabant'] },
          highlight: { markers: ['ghent'] },
        },
        {
          id: 'i-4',
          title: 'The Council of Blood',
          narration:
            'Alba arrives from Italy with ten thousand men and sets up a court ' +
            'that hands down death sentences by the hundred. In 1568 Egmont and ' +
            'Hoorn — both Catholics, both loyal, both simply in the way — are ' +
            'beheaded in the Grand Place at Brussels.',
          focus: { marker: 'brussels', distance: 34, pitch: 42 },
          reveal: {
            markers: ['brussels', 'ardennes', 'spanish-road'],
            routes: ['to-brussels', 'from-spain'],
            regions: ['r-wallonia'],
          },
          highlight: { markers: ['brussels'], routes: ['from-spain'] },
        },
      ],
    },
    {
      id: 'ii',
      title: 'II · The Roads',
      subtitle: 'Two men, every disguise, and no army at all',
      chapters: [
        {
          id: 'ii-1',
          title: 'Lamme Goedzak',
          narration:
            'He picks up a fat, gentle, permanently hungry man whose wife has ' +
            'left him, and the two of them walk the rest of the book together. ' +
            'Lamme is not brave and does not pretend to be, and De Coster likes ' +
            'him better than anyone else in it.',
          focus: { marker: 'lamme', distance: 34, pitch: 42 },
          reveal: { markers: ['lamme', 'ypres'], routes: ['wandering'] },
          highlight: { markers: ['lamme'] },
        },
        {
          id: 'ii-2',
          title: 'Through the cloth towns',
          narration:
            'Pilgrim, pedlar, painter, priest — whatever gets them past the ' +
            'next guard. Uilenspiegel is still the trickster of the old German ' +
            'jest-book, but the jokes now have somebody’s life on the end of ' +
            'them, which is De Coster’s whole invention.',
          focus: { marker: 'ypres', distance: 32, pitch: 40 },
          highlight: { routes: ['wandering'] },
        },
        {
          id: 'ii-3',
          title: 'The coast',
          narration:
            'Down to the shore between Dunkirk and Ostend, where everything is ' +
            'Spanish and everything is watched. They are running out of country ' +
            'to walk on — which is the point the book has been walking towards.',
          focus: { marker: 'ostend', distance: 34, pitch: 42 },
          reveal: { markers: ['dunkirk', 'ostend'] },
          highlight: { markers: ['dunkirk', 'ostend'] },
        },
      ],
    },
    {
      id: 'iii',
      title: 'III · The Sea Beggars',
      subtitle: 'A country that has lost on land, winning on water',
      chapters: [
        {
          id: 'iii-1',
          title: 'Nowhere to put in',
          narration:
            'The Watergeuzen are privateers with a commission from a prince ' +
            'who has no country left. Elizabeth of England finally shuts her ' +
            'ports to them in 1572, and having nowhere at all to go, they sail ' +
            'for the Dutch coast because there is nothing else to try.',
          focus: { marker: 'brielle', distance: 40, pitch: 44 },
          reveal: {
            markers: ['brielle', 'flushing', 'middelburg'],
            routes: ['the-beggars'],
            regions: ['r-zeeland'],
          },
          highlight: { routes: ['the-beggars'] },
        },
        {
          id: 'iii-2',
          title: 'Brielle, the first of April',
          narration:
            'They take Brielle, and hold it, and it is the first town in the ' +
            'Netherlands that is theirs. Flushing follows within weeks, and ' +
            'with it the mouth of the Scheldt — which is the same thing as ' +
            'Antwerp’s money and therefore Spain’s.',
          focus: { marker: 'brielle', distance: 26, pitch: 38 },
          highlight: { markers: ['brielle', 'flushing'] },
        },
        {
          id: 'iii-3',
          title: 'The river shut',
          narration:
            'Close the estuary and the richest port in Europe is a town with a ' +
            'quay and no ships. The Beggars do it from flat boats in shallow ' +
            'water that no Spanish army can follow them into, and Antwerp does ' +
            'not recover for three centuries.',
          focus: { marker: 'antwerp', distance: 36, pitch: 42 },
          reveal: { routes: ['scheldt'] },
          highlight: { markers: ['antwerp'], routes: ['scheldt'] },
        },
        {
          id: 'iii-4',
          title: 'Nobody buries the spirit of Flanders',
          narration:
            'At the end they think he is dead and start to bury him, and he ' +
            'sits up in the sand and asks whether they mean to put the spirit ' +
            'of Flanders in a hole. Then he walks off with Nele, singing. It is ' +
            'not an afterlife — De Coster simply declines to finish him.',
          focus: { marker: 'damme', distance: 26, pitch: 38 },
          highlight: { markers: ['damme', 'nele'] },
        },
      ],
    },
  ],
}
