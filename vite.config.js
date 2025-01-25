import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/TraderyMessenger"
  build: {
    chunkSizeWarningLimit: 1000, // Increase to 1MB (or adjust as needed)
  },
});
