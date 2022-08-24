import { sveltekit } from '@sveltejs/kit/vite';
import path, { dirname } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@douganderson444/ipld-car-txs': path.resolve('src/lib')
		}
	},
	// workaround for common-js issues of default export
	// https://vitejs.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies
	build: {
		commonjsOptions: {
			include: [/node_modules/, /svelte-plumb/]
		},
		minify: false,
		sourcemap: true,
		optimization: {
			minimize: false
		}
	},
	optimization: {
		minimize: false
	},
	optimizeDeps: {
		include: ['svelte-plumb']
	},
	// legacy: { buildSsrCjsExternalHeuristics: true },
	ssr: { noExternal: ['@douganderson444/svelte-plumb/**'] } // does the trick
};

export default config;
