
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set base to './' so the app works regardless of the subfolder it's deployed to on GitHub Pages
  base: './',
  build: {
    outDir: 'dist',
  }
});
