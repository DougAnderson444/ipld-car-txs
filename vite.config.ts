import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			plugins: [],
			output: {
				minifyInternalExports: true, // false,
				compact: true // false,
				// sourcemap: true
			}
		},
		minify: true, // false,
		sourcemap: false, // true,
		optimization: {
			minimize: true // false
		}
	},
	optimization: {
		minimize: true // false
	},
	ssr: { noExternal: ['@douganderson444/svelte-plumb/**'] } // does the trick
};

export default config;
