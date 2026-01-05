import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use a relative base path so it works regardless of the GitHub repo name
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure the build generates clean assets
    emptyOutDir: true,
  }
});
