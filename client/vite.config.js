import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://carecorner-az5h51aua-yonatans-projects-2f1159da.vercel.app',
        changeOrigin: true,
        secure: true
      },
    },
  },
})
