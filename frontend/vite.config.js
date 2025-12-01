import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Все запросы на /api будут перенаправляться на сервер Hexlet Chat
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      // Все запросы Socket.IO (если нужно) тоже можно проксировать
      '/socket.io': {
        target: 'http://localhost:5001',
        ws: true,
      },
    },
  },
})
