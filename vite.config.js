// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Substitua 'SEU-REPO' pelo nome real do repositório no GitHub
// ex: se o repo for github.com/joao/meu-portfolio → base: '/meu-portfolio/'
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',   // ← ALTERE AQUI antes do deploy
})
