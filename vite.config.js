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
        // The backend answers 401 with a WWW-Authenticate header, which makes
        // Chrome open its native Basic-auth dialog on top of the app. Strip it
        // in dev so the app surfaces the error itself.
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['www-authenticate'];
          });
        },
      },
    },
  },
})
