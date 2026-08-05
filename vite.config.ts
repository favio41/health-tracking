/// <reference types="vitest/config" />

// https://vitejs.dev/config/
import { resolve } from 'node:path';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [
		preact({
			prerender: {
				enabled: true,
				renderTarget: '#app',
			},
		}),
	],
	test: {
		include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
		exclude: ['**/*.stories.*'],
		globals: true,
	},
});
