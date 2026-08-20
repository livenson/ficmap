// Entry point for check-atlas-map.mjs: one module re-exporting the story data,
// the picker's layout and the coastline views, so esbuild can bundle the real
// source rather than the checker reimplementing any of it.
export { stories } from '../src/stories/index.ts'
export { layoutAtlas, PANEL, PIN_RADIUS } from '../src/ui/atlasLayout.ts'
export { europeCoast, worldCoast } from '../src/assets/coastlines.ts'
