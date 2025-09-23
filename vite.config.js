import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/react-online-games-website/', // 👈 important for GitHub Pages
  plugins: [react()],
})
