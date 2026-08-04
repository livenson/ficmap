import type { Story } from '../types'
import britainHeight from '../assets/britain-height.png'

/**
 * Wizarding Britain — the places of Harry Potter. NOTE: Harry Potter, Hogwarts
 * and the place names are the intellectual property of J.K. Rowling / Warner
 * Bros. (in copyright). This is user-authored, paraphrased data over a REAL map
 * of Britain — a fan-project use, not an official work.
 *
 * The surface is a real Terrarium DEM of Great Britain (bbox lon −8..2, lat
 * 50..59). Places sit at their canonical real-world locations: Hogwarts in the
 * Scottish Highlands, wizarding London in the south-east, the Burrow in Devon,
 * Azkaban out in the North Sea. Map-x is (lon+8)/5 − 1 and map-z is
 * 2·(59−lat)/9 − 1. Rebuild with `node scripts/build-heightmap.mjs britain`.
 */
export const harryPotter: Story = {
  id: 'harry-potter',
  title: 'Harry Potter',
  subtitle: 'Wizarding Britain, over the real map',
  author: 'J. K. Rowling',
  region: 'Wizarding Britain',
  epoch: 'Published 1997–2007',
  intro:
    'The hidden magical Britain of Harry Potter, laid over the real island: ' +
    'Hogwarts in the Highlands, Diagon Alley and the Ministry beneath London, ' +
    'the Burrow in the West Country, and Azkaban far out to sea. Press ▶ Play ' +
    'story to follow Harry from the cupboard under the stairs to the Battle of ' +
    'Hogwarts, or open any place to read what happens there.',
  surfaceName: 'Britain',
  ambient: { trees: 0.6, birds: 7, birdKind: 'owl', fish: 3 },
  terrain: {
    seed: 'britain-dem',
    heightmap: britainHeight,
    aspect: 10 / 9,
    seaLevel: 0.0091, // 0 m in the capped (−10..1300 m) DEM
    // Gentle relief so the Highlands don't obscure the routes.
    heightScale: 10,
    rivers: 4,
    biomes: [
      { maxHeight: 0.0091, color: '#2c5c7a', name: 'The Sea' },
      { maxHeight: 0.03, color: '#d6ca9c', name: 'Coast' },
      { maxHeight: 0.2, color: '#4d7a44', name: 'Lowlands' },
      { maxHeight: 0.47, color: '#5f7838', name: 'Moors' },
      { maxHeight: 0.75, color: '#84806c', name: 'Highlands' },
      { maxHeight: 1.0, color: '#e9ecef', name: 'Munros' },
    ],
  },
  markers: [
    {
      id: 'hogwarts',
      name: 'Hogwarts',
      kind: 'capital',
      at: { x: -0.42, z: -0.511 }, // Scottish Highlands
      description:
        'Hogwarts School of Witchcraft and Wizardry — a great castle above a ' +
        'black loch in the Highlands, unplottable and hidden from Muggle eyes.',
    },
    {
      id: 'hogsmeade',
      name: 'Hogsmeade',
      kind: 'town',
      at: { x: -0.36, z: -0.46 },
      description:
        'The only all-wizarding village in Britain, just down the hill from ' +
        'the school — the Three Broomsticks, Honeydukes, and the Hog’s Head.',
    },
    {
      id: 'forbidden-forest',
      name: 'The Forbidden Forest',
      kind: 'forest',
      at: { x: -0.5, z: -0.44 },
      description:
        'The dark wood bordering the castle grounds, home to centaurs, giant ' +
        'spiders, and worse — out of bounds to every pupil.',
    },
    {
      id: 'kings-cross',
      name: "King's Cross — Platform 9¾",
      kind: 'port',
      at: { x: 0.55, z: 0.64 }, // London
      description:
        'Between platforms nine and ten, a barrier gives onto Platform Nine ' +
        'and Three-Quarters, where the scarlet Hogwarts Express waits each ' +
        'first of September.',
    },
    {
      id: 'diagon',
      name: 'Diagon Alley',
      kind: 'city',
      at: { x: 0.61, z: 0.69 }, // hidden off Charing Cross Road, London
      description:
        'The wizarding high street hidden behind the Leaky Cauldron — Ollivanders, ' +
        'Flourish and Blotts, and the marble halls of Gringotts bank. Its dark ' +
        'offshoot is Knockturn Alley.',
    },
    {
      id: 'ministry',
      name: 'The Ministry of Magic',
      kind: 'landmark',
      at: { x: 0.5, z: 0.72 }, // deep under Whitehall, London
      description:
        'Reached by telephone box or flushing loo, the Ministry sprawls far ' +
        'below London — the Atrium, the courtrooms, and the Department of ' +
        'Mysteries.',
    },
    {
      id: 'privet-drive',
      name: 'Privet Drive',
      kind: 'town',
      at: { x: 0.49, z: 0.75 }, // Little Whinging, Surrey
      description:
        'Number Four, Little Whinging — the aggressively ordinary house of the ' +
        'Dursleys, where Harry grows up in the cupboard under the stairs.',
    },
    {
      id: 'burrow',
      name: 'The Burrow',
      kind: 'town',
      at: { x: -0.06, z: 0.8 }, // Ottery St Catchpole, West Country
      description:
        'The Weasleys’ crooked, much-added-to home near Ottery St Catchpole — ' +
        'held up, one suspects, chiefly by magic.',
    },
    {
      id: 'godrics-hollow',
      name: "Godric's Hollow",
      kind: 'ruin',
      at: { x: 0.16, z: 0.74 }, // West Country village
      description:
        'The village where Harry was born — and where his parents lie, and the ' +
        'ruined cottage still stands, the night Voldemort’s curse rebounded.',
    },
    {
      id: 'little-hangleton',
      name: 'Little Hangleton',
      kind: 'danger',
      at: { x: 0.3, z: 0.33 }, // Riddle country
      description:
        'The Riddle house on the hill and the graveyard below it, where ' +
        'Voldemort returns to a body in flesh and bone.',
    },
    {
      id: 'malfoy-manor',
      name: 'Malfoy Manor',
      kind: 'danger',
      at: { x: 0.22, z: 0.7 }, // Wiltshire
      description:
        'The Malfoys’ Wiltshire estate, taken over as Voldemort’s headquarters ' +
        '— and the cellar where prisoners are kept.',
    },
    {
      id: 'azkaban',
      name: 'Azkaban',
      kind: 'danger',
      at: { x: 0.84, z: -0.32 }, // a lonely North Sea island
      description:
        'The wizard prison on a bleak island far out in the North Sea, guarded ' +
        'by the soul-sucking Dementors.',
    },
    {
      id: 'shell-cottage',
      name: 'Shell Cottage',
      kind: 'landmark',
      at: { x: -0.46, z: 0.94 }, // Cornish coast
      description:
        'Bill and Fleur’s cottage on a lonely Cornish beach — a refuge, and the ' +
        'place where Dobby is laid to rest.',
    },
    {
      id: 'shrieking-shack',
      name: 'The Shrieking Shack',
      kind: 'danger',
      at: { x: -0.33, z: -0.43 }, // edge of Hogsmeade
      description:
        'The most haunted building in Britain, at the edge of Hogsmeade — reached ' +
        'by a tunnel under the Whomping Willow, and where Sirius Black’s innocence ' +
        'is finally uncovered.',
    },
    {
      id: 'quidditch-world-cup',
      name: 'The Quidditch World Cup',
      kind: 'landmark',
      at: { x: 0.12, z: 0.48 }, // a raised moorland stadium
      description:
        'A vast stadium raised by magic on a lonely moor for the Cup final — where, ' +
        'after the match, Death Eaters riot and the Dark Mark is cast into the sky ' +
        'for the first time in years.',
    },
    {
      id: 'grimmauld-place',
      name: '12 Grimmauld Place',
      kind: 'town',
      at: { x: 0.57, z: 0.66 }, // hidden in London
      description:
        'The hidden London townhouse of the Blacks, made the headquarters of the ' +
        'Order of the Phoenix — kept secret behind a Fidelius Charm.',
    },
    {
      id: 'sea-cave',
      name: 'The Sea Cave',
      kind: 'danger',
      at: { x: -0.52, z: 0.9 }, // a cliff cave over the sea
      description:
        'A cave in a cliff over black water — where the Dark Lord hid a locket ' +
        'among the Inferi, and Dumbledore drank the potion that guarded it.',
    },
  ],
  routes: [
    {
      id: 'hogwarts-express',
      name: 'The Hogwarts Express',
      color: '#c1332b',
      style: 'solid',
      points: [
        { x: 0.55, z: 0.64 },
        { x: 0.32, z: 0.28 },
        { x: 0.0, z: -0.12 },
        { x: -0.36, z: -0.46 },
      ],
    },
    {
      id: 'horcrux-hunt',
      name: 'The Horcrux Hunt',
      color: '#6fae5a',
      style: 'dashed',
      points: [
        { x: 0.16, z: 0.74 }, // Godric's Hollow
        { x: 0.22, z: 0.7 }, // Malfoy Manor
        { x: 0.61, z: 0.69 }, // Gringotts, Diagon Alley
        { x: -0.42, z: -0.511 }, // Hogwarts
      ],
    },
  ],
  regions: [
    { id: 'scotland', name: 'The Highlands', at: { x: -0.4, z: -0.66 }, scale: 1.0 },
    { id: 'the-south', name: 'The South', at: { x: 0.3, z: 0.55 }, scale: 1.0 },
    { id: 'west-country', name: 'The West Country', at: { x: -0.1, z: 0.66 }, scale: 0.7 },
    { id: 'north-sea', name: 'The North Sea', at: { x: 0.75, z: -0.1 }, scale: 0.8 },
  ],
  elements: [
    {
      id: 'sword',
      name: 'The Sword of Gryffindor',
      glyph: '⚔',
      description:
        'Goblin-made and ruby-set, the sword presents itself to a true ' +
        'Gryffindor in need — and, having taken in basilisk venom, can destroy ' +
        'a Horcrux. Track it from the school to the hunt and back to the battle.',
      journey: [
        { marker: 'hogwarts', sinceChapter: 3, note: 'Drawn from the Sorting Hat in the Chamber.' },
        { marker: 'forbidden-forest', sinceChapter: 8, note: 'Recovered from a frozen forest pool.' },
        { marker: 'hogwarts', sinceChapter: 10, note: 'Back for the last Horcruxes and the battle.' },
      ],
    },
  ],
  books: [
    {
      id: 'philosophers-stone',
      title: "The Philosopher's Stone",
      subtitle: 'The boy who lived',
      chapters: [
        {
          id: 'privet',
          title: 'The Cupboard Under the Stairs',
          narration:
            'On Privet Drive, a boy who sleeps in a cupboard learns on his ' +
            'eleventh birthday that he is a wizard — as the letters, then a ' +
            'giant, arrive to carry him off to school.',
          focus: { marker: 'privet-drive', distance: 26, pitch: 40 },
          reveal: { markers: ['privet-drive'], regions: ['the-south'] },
          highlight: { markers: ['privet-drive'] },
        },
        {
          id: 'diagon',
          title: 'Diagon Alley',
          narration:
            'Behind a shabby London pub, a brick wall opens on the wizarding ' +
            'high street: a wand from Ollivanders, gold from the vaults of ' +
            'Gringotts, and the whole hidden world for the first time.',
          focus: { marker: 'diagon', distance: 22, pitch: 34 },
          reveal: { markers: ['diagon', 'kings-cross', 'ministry'] },
          highlight: { markers: ['diagon'] },
        },
        {
          id: 'express',
          title: 'The Hogwarts Express',
          narration:
            'From Platform Nine and Three-Quarters the scarlet engine carries ' +
            'him the length of Britain to the Highlands, to a castle above a ' +
            'black lake — Hogwarts at last.',
          focus: { marker: 'hogwarts', distance: 30, pitch: 34 },
          reveal: {
            markers: ['hogwarts', 'hogsmeade', 'forbidden-forest'],
            routes: ['hogwarts-express'],
            regions: ['scotland'],
          },
          highlight: { markers: ['hogwarts'], routes: ['hogwarts-express'] },
        },
      ],
    },
    {
      id: 'chamber-of-secrets',
      title: 'The Chamber of Secrets',
      subtitle: "The heir of Slytherin",
      chapters: [
        {
          id: 'chamber',
          title: 'The Chamber of Secrets',
          narration:
            'A flying car, a voice in the walls, and students turned to stone. ' +
            'Deep beneath the school Harry finds the hidden Chamber, and with the ' +
            'Sword of Gryffindor kills the basilisk and destroys the diary of Tom ' +
            'Riddle — the first Horcrux, though no one yet knows the word.',
          focus: { marker: 'hogwarts', distance: 30, pitch: 36 },
          reveal: { markers: ['forbidden-forest'], regions: ['scotland'] },
          highlight: { markers: ['hogwarts', 'forbidden-forest'] },
        },
      ],
    },
    {
      id: 'prisoner-of-azkaban',
      title: 'The Prisoner of Azkaban',
      subtitle: 'The escaped man',
      chapters: [
        {
          id: 'prisoner',
          title: 'The Shrieking Shack',
          narration:
            'Sirius Black breaks out of Azkaban and Dementors ring the school. In ' +
            'the Shrieking Shack the truth turns inside out — Harry’s godfather is ' +
            'innocent, the real traitor a rat — and a turn of time saves two lives.',
          focus: { marker: 'shrieking-shack', distance: 22, pitch: 34 },
          reveal: { markers: ['shrieking-shack', 'azkaban'], regions: ['north-sea'] },
          highlight: { markers: ['shrieking-shack', 'azkaban'] },
        },
      ],
    },
    {
      id: 'goblet-of-fire',
      title: 'The Goblet of Fire',
      subtitle: 'The Triwizard Tournament',
      chapters: [
        {
          id: 'world-cup',
          title: 'The Quidditch World Cup',
          narration:
            'A night at the Cup final ends with the Dark Mark burning overhead. At ' +
            'school an ancient tournament names Harry a champion against his will — ' +
            'three tasks that lead, at the last, to a portkey and a graveyard.',
          focus: { marker: 'quidditch-world-cup', distance: 26, pitch: 36 },
          reveal: { markers: ['quidditch-world-cup'] },
          highlight: { markers: ['quidditch-world-cup'] },
        },
        {
          id: 'graveyard',
          title: 'The Little Hangleton Graveyard',
          narration:
            'The cup is a trap. In the Riddle graveyard, with bone, flesh, and ' +
            'blood, the Dark Lord takes shape again — and Harry barely escapes to ' +
            'carry the warning home.',
          focus: { marker: 'little-hangleton', distance: 24, pitch: 34 },
          reveal: { markers: ['little-hangleton'] },
          highlight: { markers: ['little-hangleton'] },
        },
      ],
    },
    {
      id: 'order-of-the-phoenix',
      title: 'The Order of the Phoenix',
      subtitle: 'The Ministry falls silent',
      chapters: [
        {
          id: 'order',
          title: 'The Department of Mysteries',
          narration:
            'Denied and watched, Harry and his friends form the Order’s hidden ' +
            'headquarters at Grimmauld Place and a secret army at school — and are ' +
            'lured to the Department of Mysteries deep beneath the Ministry, where ' +
            'a prophecy shatters and a godfather falls.',
          focus: { marker: 'ministry', distance: 24, pitch: 34 },
          reveal: { markers: ['grimmauld-place', 'ministry'], regions: ['the-south'] },
          highlight: { markers: ['ministry', 'grimmauld-place'] },
        },
      ],
    },
    {
      id: 'half-blood-prince',
      title: 'The Half-Blood Prince',
      subtitle: 'The memory and the cave',
      chapters: [
        {
          id: 'the-cave',
          title: 'The Cave',
          narration:
            'Through borrowed memories the shape of the Dark Lord’s secret comes ' +
            'clear: his soul split and hidden. Across black water in a sea cave, ' +
            'Harry and Dumbledore take a locket at terrible cost — and on the ' +
            'Astronomy Tower, the headmaster falls.',
          focus: { marker: 'sea-cave', distance: 24, pitch: 34 },
          reveal: { markers: ['sea-cave'], regions: ['west-country'] },
          highlight: { markers: ['sea-cave', 'hogwarts'] },
        },
      ],
    },
    {
      id: 'deathly-hallows',
      title: 'The Deathly Hallows',
      subtitle: 'The Horcrux hunt',
      chapters: [
        {
          id: 'godrics',
          title: "Godric's Hollow",
          narration:
            'On the run, Harry and Hermione return to the village where it all ' +
            'began — his parents’ grave, the ruined cottage, and a trap waiting ' +
            'in the dark.',
          focus: { marker: 'godrics-hollow', distance: 24, pitch: 36 },
          reveal: {
            markers: ['godrics-hollow', 'burrow', 'shell-cottage'],
            regions: ['west-country'],
          },
          highlight: { markers: ['godrics-hollow'] },
        },
        {
          id: 'gringotts',
          title: 'Malfoy Manor & Gringotts',
          narration:
            'Captured and taken to Malfoy Manor, they escape and break into the ' +
            'deepest vault of Gringotts for a Horcrux — riding out on the back ' +
            'of a blind dragon.',
          focus: { marker: 'malfoy-manor', distance: 26, pitch: 34 },
          reveal: {
            markers: ['malfoy-manor', 'little-hangleton'],
            routes: ['horcrux-hunt'],
          },
          highlight: { markers: ['malfoy-manor', 'diagon'] },
        },
        {
          id: 'battle',
          title: 'The Battle of Hogwarts',
          narration:
            'All roads lead back to the school. The last Horcruxes fall, the ' +
            'castle stands under siege, and in the end the boy who lived walks ' +
            'to meet his fate in the Forbidden Forest — and returns.',
          focus: { marker: 'hogwarts', distance: 28, pitch: 38 },
          reveal: { markers: ['azkaban'], regions: ['scotland'] },
          highlight: { markers: ['hogwarts', 'forbidden-forest'] },
        },
      ],
    },
  ],
}
