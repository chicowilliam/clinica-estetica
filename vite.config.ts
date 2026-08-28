import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'motion-vendor': ['framer-motion'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'ui-vendor': [
            'lucide-react',
            'embla-carousel-react',
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
