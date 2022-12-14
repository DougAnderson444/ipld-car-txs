import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
	plugins: [sveltekit()],
	server: {
		fs: {
			strict: false
		}
	},
	resolve: {
		alias: {
			'@douganderson444/ipld-car-txs': path.resolve('./')
		}
	},
	// build: {
	// 	rollupOptions: {
	// 		plugins: [],
	// 		output: {
	// 			minifyInternalExports: true, // false,
	// 			compact: true // false,
	// 			// sourcemap: true
	// 		}
	// 	},
	// 	minify: true, // false,
	// 	sourcemap: false, // true,
	// 	optimization: {
	// 		minimize: true // false
	// 	}
	// },
	// optimization: {
	// 	minimize: true // false
	// },
	optimizeDeps: {
		include: ['it-merge']
	}
};

export default config;
