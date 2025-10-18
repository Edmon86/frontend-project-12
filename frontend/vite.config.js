import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // все запросы с /api будут проксироваться на сервер
      '/api': 'http://localhost:5001',
    },
  },
});
