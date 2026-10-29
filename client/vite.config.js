import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default function config() {
  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      watch: {
        ignored: ['**/public/videos/**', '**/*.mp4']
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  });
}
