import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.fundednext.com',
        changeOrigin: true,
      },
      '/nifty-api': {
        target: 'https://webapi.niftytrader.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nifty-api/, '/webapi'),
      },
    }
  }
})
