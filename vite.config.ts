import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  return {
    base: isProd ? '/algo-visualizer/' : '/', // dev: '/', prod: '/algo-visualizer/'
    plugins: [vue()],
    server: { port: 5173 },
    build: { target: 'es2022' },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setupTests.ts'],
      coverage: {
        provider: 'v8',
        reportsDirectory: './coverage'
      }
    }
  }
})