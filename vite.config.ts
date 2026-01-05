import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use base: './' or base: '/' depending on your GitHub Pages setup. 
  // './' is generally safer for browser-based uploads.
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
