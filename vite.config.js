import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'property-search-pwa',
        short_name: 'property-search-pwa',
        description: 'property-search-pwa',
        theme_color: '#ffffff',
        share_target: {
          "action": "/parse",
          "method": "POST",
          "enctype": "application/x-www-form-urlencoded",
          "params": {
            "title": "title",
            "text": "text",
            "url": "url"
          }
        }
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    })
  ],
  server: {
    allowedHosts: ['unossified-alijah-untimely.ngrok-free.dev']
  }

})