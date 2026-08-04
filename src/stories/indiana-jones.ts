import type { Story } from '../types'
import worldHeight from '../assets/world-height.png'

/**
 * The Adventures of Indiana Jones — the globe-trotting archaeologist's film and
 * novel adventures, laid over the real Earth.
 *
 * NOTE: Indiana Jones is the intellectual property of Lucasfilm / The Walt
 * Disney Company (in copyright). This is user-authored, paraphrased data placed
 * over a real world map — a fan-project use, not an official work. Only real
 * places are named at their true coordinates; fictional sites (Pankot, Akator)
 * are set where the stories place them.
 *
 * Like the Verne world it shares the whole-Earth Terrarium DEM (bbox lon
 * −180..180, lat −62..78). Map-x is lon/180 and map-z is (78−lat)/70 − 1. Each
 * film is a "book"; the novels get one more. Rebuild the DEM (shared with Verne)
 * with `node scripts/build-heightmap.mjs world`.
 */
export const indianaJones: Story = {
  id: 'indiana-jones',
  title: 'The Adventures of Indiana Jones',
  subtitle: 'One archaeologist, the whole real world',
  author: 'Lucasfilm — Lucas & Spielberg',
  region: 'The whole Earth',
  epoch: 'The film & novel adventures · 1935–1969',
  intro:
    'Fedora, whip, and a passport with too many stamps. Dr. Henry "Indiana" ' +
    'Jones crosses the real globe after relics that belong in a museum — the ' +
    'Ark of the Covenant, the Sankara Stones, the Holy Grail, the Crystal Skull ' +
    'of Akator, and Archimedes’ Antikythera. Each film is a book; the Bantam ' +
    'novels add one more. Press ▶ Play story to follow an adventure, or open any ' +
    'place to read what he found there.',
  surfaceName: 'The World',
  ambient: { trees: 0.3, birds: 6, fish: 4 },
  terrain: {
    // Shares Verne's whole-Earth DEM and its exact height/sea calibration.
    seed: 'world-dem',
    heightmap: worldHeight,
    aspect: 360 / 140,
    seaLevel: 0.0017,
    heightScale: 5,
    rivers: 0,
    biomes: [
      { maxHeight: 0.0017, color: '#26618a', name: 'Ocean' },
      { maxHeight: 0.02, color: '#d9cfa6', name: 'Coast' },
      { maxHeight: 0.1, color: '#3f7a4a', name: 'Lowlands' },
      { maxHeight: 0.26, color: '#5f7a3c', name: 'Steppe' },
      { maxHeight: 0.58, color: '#8a8474', name: 'Mountains' },
      { maxHeight: 1.0, color: '#f2f2f2', name: 'Snows' },
    ],
  },
  markers: [
    // --- Recurring home ---
    {
      id: 'marshall-college',
      name: 'Marshall College',
      kind: 'city',
      at: { x: -0.405, z: -0.476 }, // New England, USA (~41.3 N, 72.9 W)
      description:
        'Indy’s home base: the New England college where Professor Jones teaches ' +
        'archaeology between expeditions — and where the Army and the museum come ' +
        'looking when a relic surfaces.',
    },
    // --- The Temple of Doom (1935) ---
    {
      id: 'shanghai',
      name: 'Shanghai',
      kind: 'city',
      at: { x: 0.675, z: -0.332 }, // 31.2 N, 121.5 E
      description:
        'Club Obi-Wan: a poisoned drink, a diamond, an antidote, and a leap ' +
        'through a window into a waiting getaway plane. The adventure opens here.',
    },
    {
      id: 'pankot',
      name: 'Pankot Palace',
      kind: 'danger',
      at: { x: 0.433, z: -0.229 }, // northern India (fictional; ~24 N, 78 E)
      description:
        'A palace of northern India where the Thuggee cult has revived the ' +
        'worship of Kali. Below it, enslaved children mine for the lost Sankara ' +
        'Stones — which Indy takes back before the bridge over the gorge is cut.',
    },
    // --- Raiders of the Lost Ark (1936) ---
    {
      id: 'chachapoyas',
      name: 'The Chachapoyan Temple',
      kind: 'ruin',
      at: { x: -0.433, z: 0.203 }, // Peruvian jungle (~6.2 S, 77.9 W)
      description:
        'The booby-trapped jungle temple of the prologue: the golden fertility ' +
        'idol, the rolling boulder, and a rival who takes the prize at gunpoint.',
    },
    {
      id: 'kathmandu',
      name: 'Marion’s Tavern, Nepal',
      kind: 'town',
      at: { x: 0.474, z: -0.281 }, // Nepal (~27.7 N, 85.3 E)
      description:
        'High in the Himalaya, Marion Ravenwood keeps a tavern — and the headpiece ' +
        'of the Staff of Ra, the medallion that reveals where the Ark is buried.',
    },
    {
      id: 'tanis',
      name: 'Tanis, Egypt',
      kind: 'landmark',
      at: { x: 0.177, z: -0.323 }, // Nile delta (~30.6 N, 31.9 E)
      description:
        'The buried Egyptian city where the Map Room casts a beam of light onto ' +
        'the Well of Souls. Here Indy digs up the Ark of the Covenant — and the ' +
        'Nazis take it from him.',
    },
    {
      id: 'washington',
      name: 'Washington, D.C.',
      kind: 'capital',
      at: { x: -0.428, z: -0.441 }, // 38.9 N, 77.0 W
      description:
        'Where the opened Ark is boxed, stamped "Top Secret," and wheeled into a ' +
        'vast government warehouse to be forgotten among a thousand identical crates.',
    },
    // --- The Last Crusade (1938) ---
    {
      id: 'venice',
      name: 'Venice',
      kind: 'city',
      at: { x: 0.069, z: -0.535 }, // 45.4 N, 12.3 E
      description:
        'Beneath a library that was once a church, catacombs hold the tomb of a ' +
        'Grail knight — and the rubbing that points the way to the Canyon of the ' +
        'Crescent Moon.',
    },
    {
      id: 'berlin',
      name: 'Berlin',
      kind: 'city',
      at: { x: 0.074, z: -0.636 }, // 52.5 N, 13.4 E
      description:
        'Into the lion’s mouth to snatch back his father’s Grail diary — from a ' +
        'book-burning rally, and an autograph — before escaping the Reich by zeppelin.',
    },
    {
      id: 'crescent-moon',
      name: 'Canyon of the Crescent Moon',
      kind: 'landmark',
      at: { x: 0.197, z: -0.319 }, // Petra, Jordan (~30.3 N, 35.5 E)
      description:
        'The rose-red temple (Al-Khazneh at Petra) that hides the Holy Grail. ' +
        'Past the Breath of God, the Word of God, and the Path of God, an ancient ' +
        'knight still keeps the cup. Choose wisely.',
    },
    // --- Kingdom of the Crystal Skull (1957) ---
    {
      id: 'akator',
      name: 'Akator (El Dorado)',
      kind: 'ruin',
      at: { x: -0.378, z: 0.229 }, // Peruvian Amazon (fictional; ~8 S, 68 W)
      description:
        'The lost city in the Amazon whose temple holds thirteen crystal skeletons. ' +
        'Return the stolen skull to its body and the "gift" the interdimensional ' +
        'beings leave behind is not gold, but knowledge.',
    },
    // --- Dial of Destiny (1969) ---
    {
      id: 'new-york',
      name: 'New York City',
      kind: 'city',
      at: { x: -0.411, z: -0.467 }, // 40.7 N, 74.0 W
      description:
        'Under the ticker-tape of the 1969 moon-landing parade, a retired Indy is ' +
        'pulled back into the field to keep Archimedes’ dial from the wrong hands.',
    },
    {
      id: 'tangier',
      name: 'Tangier',
      kind: 'port',
      at: { x: -0.032, z: -0.397 }, // Morocco (~35.8 N, 5.8 W)
      description:
        'A tuk-tuk chase through the medina for the first half of the Antikythera, ' +
        'and a flight east toward the Aegean and the tomb of the man who made it.',
    },
    {
      id: 'syracuse',
      name: 'Syracuse, Sicily',
      kind: 'landmark',
      at: { x: 0.085, z: -0.415 }, // 37.1 N, 15.3 E
      description:
        'Archimedes’ grave, and the reunited Dial of Destiny — which turns out to ' +
        'point not through space but through time, to the siege of Syracuse itself.',
    },
    // --- The novels (Bantam, 1991–1999; set in the 1920s–30s) ---
    {
      id: 'delphi',
      name: 'Delphi',
      kind: 'ruin',
      at: { x: 0.125, z: -0.435 }, // Greece (~38.5 N, 22.5 E)
      description:
        'In "Peril at Delphi," the young Jones returns to Greece and the Oracle’s ' +
        'ruins, tangled with a secret society over the omphalos, the navel-stone ' +
        'of the world.',
    },
    {
      id: 'ararat',
      name: 'Mount Ararat',
      kind: 'peak',
      at: { x: 0.246, z: -0.453 }, // eastern Turkey (~39.7 N, 44.3 E)
      description:
        'In "The Genesis Deluge," Indy climbs the frozen slopes of Ararat after ' +
        'the timbers of Noah’s Ark, locked in the ice near the roof of Anatolia.',
    },
    {
      id: 'stonehenge',
      name: 'Stonehenge',
      kind: 'landmark',
      at: { x: -0.01, z: -0.617 }, // England (~51.2 N, 1.8 W)
      description:
        'In "The Dance of the Giants," the standing stones of Salisbury Plain and ' +
        'the legend of Merlin draw Jones into a race across an England on the edge ' +
        'of war.',
    },
  ],
  routes: [
    {
      id: 'route-doom',
      name: 'The Temple of Doom (1935)',
      color: '#e0533c',
      style: 'solid',
      description: 'Shanghai to the palace of Pankot in northern India.',
      points: [
        { x: 0.675, z: -0.332 }, // Shanghai
        { x: 0.433, z: -0.229 }, // Pankot
      ],
    },
    {
      id: 'route-raiders',
      name: 'Raiders of the Lost Ark (1936)',
      color: '#ffce54',
      style: 'solid',
      description: 'Marshall College to Nepal to Tanis, and the Ark home to Washington.',
      points: [
        { x: -0.405, z: -0.476 }, // Marshall College
        { x: 0.474, z: -0.281 }, // Nepal
        { x: 0.177, z: -0.323 }, // Tanis
        { x: -0.428, z: -0.441 }, // Washington
      ],
    },
    {
      id: 'route-crusade',
      name: 'The Last Crusade (1938)',
      color: '#7fc7ff',
      style: 'solid',
      description: 'Venice to Berlin to the Canyon of the Crescent Moon.',
      points: [
        { x: 0.069, z: -0.535 }, // Venice
        { x: 0.074, z: -0.636 }, // Berlin
        { x: 0.197, z: -0.319 }, // Crescent Moon (Petra)
      ],
    },
    {
      id: 'route-skull',
      name: 'The Crystal Skull (1957)',
      color: '#a8e063',
      style: 'dashed',
      description: 'From the college to the lost city of Akator in the Amazon.',
      points: [
        { x: -0.405, z: -0.476 }, // Marshall College
        { x: -0.378, z: 0.229 }, // Akator
      ],
    },
    {
      id: 'route-dial',
      name: 'The Dial of Destiny (1969)',
      color: '#c9b6ff',
      style: 'dashed',
      description: 'New York to Tangier, a dive in the Aegean, and Archimedes’ tomb at Syracuse.',
      points: [
        { x: -0.411, z: -0.467 }, // New York
        { x: -0.032, z: -0.397 }, // Tangier
        { x: 0.139, z: -0.414 }, // the Aegean dive
        { x: 0.085, z: -0.415 }, // Syracuse
      ],
    },
    {
      id: 'route-novels',
      name: 'The Novels (1920s–30s)',
      color: '#d9a066',
      style: 'dashed',
      description: 'A thread through the Bantam novels: Stonehenge, Delphi, Ararat.',
      points: [
        { x: -0.01, z: -0.617 }, // Stonehenge
        { x: 0.125, z: -0.435 }, // Delphi
        { x: 0.246, z: -0.453 }, // Ararat
      ],
    },
  ],
  regions: [
    { id: 'north-america', name: 'North America', at: { x: -0.5, z: -0.5 }, scale: 0.9 },
    { id: 'south-america', name: 'South America', at: { x: -0.4, z: 0.3 }, scale: 0.9 },
    { id: 'europe', name: 'Europe', at: { x: 0.03, z: -0.66 }, scale: 0.7 },
    { id: 'med-arabia', name: 'The Mediterranean & Arabia', at: { x: 0.22, z: -0.28 }, scale: 0.85 },
    { id: 'asia', name: 'Asia', at: { x: 0.56, z: -0.34 }, scale: 1.0 },
  ],
  elements: [
    {
      id: 'ark',
      name: 'The Ark of the Covenant',
      glyph: '✡',
      description:
        'The gold-cased chest of the Israelites, said to level mountains and lay ' +
        'waste to armies. Indy digs it from Tanis; by the end it is crated away in ' +
        'a Washington warehouse.',
      journey: [
        { marker: 'tanis', sinceChapter: 2, note: 'Raised from the Well of Souls at Tanis.' },
        { marker: 'washington', sinceChapter: 2, note: 'Boxed and lost among the crates.' },
      ],
    },
    {
      id: 'sankara',
      name: 'The Sankara Stones',
      glyph: '◈',
      description:
        'Three sacred stones given (the legend says) to a priest atop Mount Kalisa, ' +
        'burning bright in the presence of one another. Indy returns them to the ' +
        'village they were stolen from.',
      journey: [
        { marker: 'pankot', sinceChapter: 0, note: 'Wrested from the Temple of Doom below Pankot.' },
      ],
    },
    {
      id: 'grail',
      name: 'The Holy Grail',
      glyph: '⚱',
      description:
        'The cup of the Last Supper, promising eternal life to the one who drinks — ' +
        'but it may not pass the temple’s seal. Tracked from a Venice tomb to the ' +
        'Canyon of the Crescent Moon.',
      journey: [
        { marker: 'venice', sinceChapter: 3, note: 'The knight’s tomb points the way.' },
        { marker: 'crescent-moon', sinceChapter: 3, note: 'Guarded still, past the three trials.' },
      ],
    },
    {
      id: 'crystal-skull',
      name: 'The Crystal Skull of Akator',
      glyph: '☠',
      description:
        'A single elongated skull cut from one piece of quartz, magnetic and ' +
        'humming — belonging to one of the thirteen beings of Akator, to whom it ' +
        'must be returned.',
      journey: [
        { marker: 'akator', sinceChapter: 4, note: 'Carried home to its crystal skeleton.' },
      ],
    },
    {
      id: 'antikythera',
      name: 'The Antikythera (Dial of Destiny)',
      glyph: '⚙',
      description:
        'Archimedes’ geared bronze dial, made in two halves. Reassembled, it does ' +
        'not merely track the heavens — it finds the fissures in time itself.',
      journey: [
        { marker: 'syracuse', sinceChapter: 5, note: 'Reunited at Archimedes’ tomb.' },
      ],
    },
  ],
  books: [
    {
      id: 'temple-of-doom',
      title: 'The Temple of Doom',
      subtitle: '1935 · the Sankara Stones',
      chapters: [
        {
          id: 'fortune-and-glory',
          title: 'Fortune and Glory',
          narration:
            'A double-cross in a Shanghai nightclub sends Indy, a singer, and a ' +
            'boy called Short Round crash-landing into the Himalaya — and on to ' +
            'Pankot Palace, where a Thuggee cult mines enslaved children for the ' +
            'lost Sankara Stones. He frees them, and takes the stones back.',
          focus: { marker: 'pankot', distance: 40, pitch: 34 },
          reveal: {
            markers: ['shanghai', 'pankot'],
            routes: ['route-doom'],
            regions: ['asia'],
          },
          highlight: { markers: ['pankot'], routes: ['route-doom'] },
        },
      ],
    },
    {
      id: 'raiders',
      title: 'Raiders of the Lost Ark',
      subtitle: '1936 · the Ark of the Covenant',
      chapters: [
        {
          id: 'the-headpiece',
          title: 'The Headpiece to the Staff of Ra',
          narration:
            'After a jungle temple in Peru nearly kills him, Indy is asked by Army ' +
            'Intelligence to beat the Nazis to the Ark. The trail runs to Marion’s ' +
            'tavern in Nepal, and the medallion that shows where the Ark lies.',
          focus: { marker: 'kathmandu', distance: 44, pitch: 32 },
          reveal: {
            markers: ['chachapoyas', 'marshall-college', 'kathmandu'],
            regions: ['south-america', 'north-america', 'asia'],
          },
          highlight: { markers: ['chachapoyas', 'kathmandu'] },
        },
        {
          id: 'well-of-souls',
          title: 'The Well of Souls',
          narration:
            'In buried Tanis the Map Room reveals the Well of Souls, and Indy digs ' +
            'up the Ark — only to lose it to the Nazis, whose own opening of it ends ' +
            'them. The Ark is shipped home, and boxed away in a Washington warehouse.',
          focus: { marker: 'tanis', distance: 42, pitch: 34 },
          reveal: {
            markers: ['tanis', 'washington'],
            routes: ['route-raiders'],
            regions: ['med-arabia'],
          },
          highlight: { markers: ['tanis', 'washington'], routes: ['route-raiders'] },
        },
      ],
    },
    {
      id: 'last-crusade',
      title: 'The Last Crusade',
      subtitle: '1938 · the Holy Grail',
      chapters: [
        {
          id: 'grail-quest',
          title: 'The Grail Quest',
          narration:
            'His father vanished chasing the Holy Grail. From a knight’s tomb under ' +
            'Venice, to a diary snatched back from Berlin, Indy follows the clues to ' +
            'the Canyon of the Crescent Moon — where the last trials, and an ancient ' +
            'knight, still guard the cup.',
          focus: { marker: 'crescent-moon', distance: 44, pitch: 32 },
          reveal: {
            markers: ['venice', 'berlin', 'crescent-moon'],
            routes: ['route-crusade'],
            regions: ['europe', 'med-arabia'],
          },
          highlight: { markers: ['crescent-moon'], routes: ['route-crusade'] },
        },
      ],
    },
    {
      id: 'crystal-skull',
      title: 'Kingdom of the Crystal Skull',
      subtitle: '1957 · the Skull of Akator',
      chapters: [
        {
          id: 'skull-of-akator',
          title: 'The Skull of Akator',
          narration:
            'Older now, and hunted by Soviet agents, Indy and a young greaser named ' +
            'Mutt cross into Peru to find the lost city of Akator — and to set its ' +
            'stolen crystal skull back among the thirteen who wait in its temple.',
          focus: { marker: 'akator', distance: 40, pitch: 34 },
          reveal: {
            markers: ['akator'],
            routes: ['route-skull'],
            regions: ['south-america'],
          },
          highlight: { markers: ['akator'], routes: ['route-skull'] },
        },
      ],
    },
    {
      id: 'dial-of-destiny',
      title: 'The Dial of Destiny',
      subtitle: '1969 · the Antikythera',
      chapters: [
        {
          id: 'the-dial',
          title: 'Archimedes’ Dial',
          narration:
            'Retired in a New York gone to the Moon, Indy chases the two halves of ' +
            'Archimedes’ Antikythera — through Tangier, down to an Aegean wreck, and ' +
            'to the tomb at Syracuse — before the dial’s fissure in time can be ' +
            'turned to darker ends.',
          focus: { marker: 'syracuse', distance: 42, pitch: 32 },
          reveal: {
            markers: ['new-york', 'tangier', 'syracuse'],
            routes: ['route-dial'],
            regions: ['med-arabia'],
          },
          highlight: { markers: ['syracuse'], routes: ['route-dial'] },
        },
      ],
    },
    {
      id: 'the-novels',
      title: 'The Novels',
      subtitle: '1920s–30s · between the films',
      chapters: [
        {
          id: 'between-the-films',
          title: 'Between the Films',
          narration:
            'The Bantam novels fill the years the cameras missed: the Oracle’s ruins ' +
            'at Delphi, the frozen timbers said to be Noah’s Ark high on Mount Ararat, ' +
            'and the standing stones of Stonehenge — a younger Jones criss-crossing ' +
            'the map between his famous cases.',
          focus: { at: { x: 0.12, z: -0.5 }, distance: 60, pitch: 36 },
          reveal: {
            markers: ['delphi', 'ararat', 'stonehenge'],
            routes: ['route-novels'],
            regions: ['europe', 'med-arabia'],
          },
          highlight: { markers: ['delphi', 'ararat', 'stonehenge'], routes: ['route-novels'] },
        },
      ],
    },
  ],
}
