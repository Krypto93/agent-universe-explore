import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      global: 'globalthis',
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  server: {
    proxy: mode === 'development'
      ? {
          '/api': {
            target: 'https://xtbfbopxac.execute-api.ap-south-1.amazonaws.com/prod',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, ''),
          },
        }
      : undefined, // ❗ disables proxy in production
  },
}));
