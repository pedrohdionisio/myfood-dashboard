import { fileURLToPath } from 'node:url';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const srcDir = (folder: string) => fileURLToPath(new URL(`./src/${folder}`, import.meta.url));

const sentryEnv = loadEnv('production', process.cwd(), 'SENTRY_');
const sentryAuthToken = sentryEnv.SENTRY_AUTH_TOKEN;

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		sentryVitePlugin({
			org: sentryEnv.SENTRY_ORG,
			project: sentryEnv.SENTRY_PROJECT,
			authToken: sentryAuthToken,
			disable: !sentryAuthToken,
			telemetry: false,
			sourcemaps: {
				filesToDeleteAfterUpload: ['./dist/**/*.map']
			}
		})
	],
	build: {
		sourcemap: sentryAuthToken ? 'hidden' : false
	},
	resolve: {
		alias: {
			data: srcDir('data'),
			presentation: srcDir('presentation'),
			shared: srcDir('shared')
		}
	},
	server: {
		port: 5173,
		strictPort: true,
		open: true
	}
});
