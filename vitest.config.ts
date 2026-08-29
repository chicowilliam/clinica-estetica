import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'node',
    setupFiles: './src/test/setup.ts',
    pool: 'forks',
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 20_000,
  },
})
