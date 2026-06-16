import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/server-options.html#server-hmr
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = env.VITE_HMR_CLIENT_PORT
  const clientPort = raw ? Number(raw) : NaN

  return {
    plugins: [react()],
    server: {
      port: 5889,
      // When the page URL port differs from Vite’s port (port forwarding, Simple Browser, etc.),
      // set VITE_HMR_CLIENT_PORT in `.env.local` to the port in your browser (e.g. 5174).
      hmr: Number.isFinite(clientPort) ? { clientPort } : undefined,
    },
  }
})
