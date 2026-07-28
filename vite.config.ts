import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to './' so the built site works from any static host / subpath
// (e.g. GitHub Pages project pages).
export default defineConfig({
  base: './',
  plugins: [react()],
})
