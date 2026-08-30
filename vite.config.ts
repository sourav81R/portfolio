import { defineConfig } from 'vite'
import sitemap from './scripts/sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [sitemap()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
