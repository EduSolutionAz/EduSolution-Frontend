import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const BACKEND_ORIGIN = 'https://edusolution-backend-obby.onrender.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Dev-only: the backend sends no CORS headers, so requests are proxied
      // through the dev server and treated as same-origin.
      // Production still requires CORS on the backend.
      '/api': {
        target: BACKEND_ORIGIN,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
