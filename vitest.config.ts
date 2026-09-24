import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
	viteConfig,
	defineConfig({
		resolve: {
			alias: {
				tests: fileURLToPath(new URL('./tests', import.meta.url))
			}
		},
		test: {
			env: {
				VITE_API_URL: 'http://api.test'
			},
			projects: [
				{
					extends: true,
					test: {
						name: 'unit',
						environment: 'node',
						include: ['src/**/*.test.ts']
					}
				},
				{
					extends: true,
					test: {
						name: 'feature',
						environment: 'jsdom',
						include: ['src/**/*.test.tsx'],
						setupFiles: ['tests/setup.ts']
					}
				}
			],
			coverage: {
				provider: 'v8',
				include: ['src/**/*.{ts,tsx}'],
				exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx']
			}
		}
	})
);
