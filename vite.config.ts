import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages用: リポジトリ名に合わせて変更してください
  // 例: base: '/game-clock/'
  base: process.env.GITHUB_PAGES ? '/game-clock/' : '/',
})
