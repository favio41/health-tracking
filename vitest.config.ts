/// <reference types="vitest" />

import { resolve } from 'node:path';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		preact({
			prerender: {
				enabled: true,
				renderTarget: '#app',
			},
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	test: {
		globals: true,
		include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
		exclude: ['**/*.stories.*'],
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/', 'src/**/*.stories.tsx'],
		},
	},
});
