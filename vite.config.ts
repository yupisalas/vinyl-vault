import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/vinyl-vault/',
  plugins: [react()],
  server: {
    host: true,
  },
})
