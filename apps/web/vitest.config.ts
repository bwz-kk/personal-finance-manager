import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Separate from vite.config.ts: vitest bundles its own Vite version, which
// conflicts at the type level with this app's root Vite version if merged
// into the same config object (root vite.config.ts's Plugin types and
// vitest's nested Plugin types are structurally incompatible under tsc -b).
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
