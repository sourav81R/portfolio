import { defineConfig } from 'vitest/config'
import sitemap from './scripts/sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [sitemap()],
  build: {
    // The certificate PDFs are large binaries that must stay as separate
    // cacheable files; inlining anything sizeable would push it into the JS
    // bundle and block first paint.
    assetsInlineLimit: 4096,
    cssMinify: true,
    rollupOptions: {
      output: {
        // React and the router change far less often than portfolio content,
        // so splitting them out lets a content edit reuse the cached vendor
        // chunk instead of invalidating one 373 kB file.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) {
            return 'react-vendor'
          }
          if (id.includes('react-router')) return 'router-vendor'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'motion-vendor'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
