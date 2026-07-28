import type { Story } from '../types'

/**
 * Emberfall — a second world with a completely different mood, built from the
 * same format. Only the seed, palette and points differ; the engine does the
 * rest. This is the extensibility demo: no new code, just data.
 */
export const emberfall: Story = {
  id: 'emberfall',
  title: 'Emberfall',
  subtitle: 'A broken archipelago of ash and firelight',
  intro:
    'The mountain that made these isles never truly slept. Ash-forests, ' +
    'obsidian shores and rivers of cooling stone — a harsher atlas, drawn with ' +
    'the same tools as any other. Toggle 2D/3D and explore the cinders.',
  terrain: {
    seed: 'emberfall-2',
    frequency: 2.4,
    islandFalloff: 0.3,
    seaLevel: 0.46,
    heightScale: 20,
    octaves: 6,
    biomes: [
      { maxHeight: 0.46, color: '#3a2530', name: 'Dark Waters' },
      { maxHeight: 0.5, color: '#3d3038', name: 'Obsidian Shore' },
      { maxHeight: 0.62, color: '#5a4038', name: 'Ashlands' },
      { maxHeight: 0.74, color: '#7a4a34', name: 'Cinder Hills' },
      { maxHeight: 0.86, color: '#b0532c', name: 'Emberfields' },
      { maxHeight: 0.95, color: '#e06a2a', name: 'Lava Crags' },
      { maxHeight: 1.0, color: '#ffd35e', name: 'The Molten Peaks' },
    ],
  },
  markers: [
    {
      id: 'cinderhold',
      name: 'Cinderhold',
      kind: 'capital',
      at: { x: -0.36, z: -0.29 },
      description:
        'The last great hold, built inside a dead caldera. Its walls are ' +
        'still warm to the touch.',
    },
    {
      id: 'obsidian-gate',
      name: 'The Obsidian Gate',
      kind: 'landmark',
      at: { x: 0.49, z: -0.08 },
      description: 'A natural arch of black glass, and the only safe passage east.',
    },
    {
      id: 'ashmoor',
      name: 'Ashmoor',
      kind: 'town',
      at: { x: -0.41, z: 0.25 },
      description: 'A grey settlement of ash-farmers who coax crops from the cinders.',
    },
    {
      id: 'the-molten-peaks',
      name: 'The Molten Peaks',
      kind: 'peak',
      at: { x: 0.59, z: -0.51 },
      description: 'The living heart of the fire. It is never quiet.',
    },
    {
      id: 'drowned-forge',
      name: 'The Drowned Forge',
      kind: 'ruin',
      at: { x: 0.32, z: 0.66 },
      description: 'An ancient smithy, half-claimed by the dark sea.',
    },
    {
      id: 'emberport',
      name: 'Emberport',
      kind: 'port',
      at: { x: 0.66, z: 0.27 },
      description: 'Where the ash-ships dock, sails stained grey.',
    },
  ],
  routes: [
    {
      id: 'the-cinder-run',
      name: 'The Cinder Run',
      color: '#ffb14a',
      style: 'solid',
      points: [
        { x: -0.36, z: -0.29 },
        { x: -0.41, z: 0.25 },
        { x: 0.32, z: 0.66 },
        { x: 0.66, z: 0.27 },
      ],
    },
  ],
  regions: [
    { id: 'ashsea', name: 'The Ash Sea', at: { x: 0.0, z: 0.0 }, scale: 1.2 },
    { id: 'molten', name: 'The Molten Peaks', at: { x: 0.55, z: -0.55 } },
  ],
}
