import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true
  },
  plugins: [
    vue(),
    {
      name: 'generate-redirects',
      closeBundle() {
        fs.writeFileSync('dist/_redirects', '/* /index.html 200\n');
        console.log('Generated _redirects file for SPA routing');
      }
    }
  ]
});