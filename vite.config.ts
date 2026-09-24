import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const srcDir = (folder: string) => fileURLToPath(new URL(`./src/${folder}`, import.meta.url));

export default defineConfig({
	plugins: [react(), tailwindcss()],
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
