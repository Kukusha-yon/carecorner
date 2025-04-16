import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
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
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react', 'framer-motion'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          forms: ['formik', 'yup']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@headlessui/react', '@heroicons/react', 'framer-motion', 'chart.js', 'react-chartjs-2', 'recharts', 'formik', 'yup']
  },
  define: {
    'process.env': {}
  }
})
