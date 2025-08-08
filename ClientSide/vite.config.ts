import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  // This is the key configuration for handling client-side routing in production
  base: '/',
});