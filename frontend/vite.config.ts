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
      '/upload': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/ask': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/status': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

