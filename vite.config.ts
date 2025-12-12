import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base path for GitHub Pages deployment
  // Set to your repository name, e.g., '/react-task/' for https://username.github.io/react-task/
  base: process.env.GITHUB_ACTIONS ? '/react-task/' : '/',
})
