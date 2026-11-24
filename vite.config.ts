import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Kaitianming 开天命',
        short_name: 'Kaitianming',
        description: 'Open your sky: a star and number reading from your date and place of birth.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#12142A',
        theme_color: '#12142A',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // The city list (about 2.3 MB) is precached so the app works offline after the first visit.
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        // These must always reach the network: /admin and /api/admin sit behind Cloudflare Access sign-in.
        navigateFallbackDenylist: [/^\/admin/, /^\/api\//, /^\/cdn-cgi\//]
      }
    })
  ]
})
