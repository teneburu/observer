import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: true,
    },
    include: ['packages/*/src/**/*.test.ts'],
    exclude: [
      'packages/*/dist',
      'packages/*/node_modules',
      '**/node_modules/**',
      '**/dist/**',
    ],
  },
}); 