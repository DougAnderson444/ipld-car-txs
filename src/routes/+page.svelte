<script lang="ts">
	import { Board } from '$demo/index.js';
	import { Canvas, EndPoint } from '@douganderson444/svelte-plumb';

	let commits: Uint8Array[] = [];

	let data = { nodes: [], links: [] };

	function createLink(e) {
		console.log({ detail: e.detail });
		const newLink = {
			source: { id: e.detail.source.dataset.cid },
			target: { id: e.detail.target.dataset.cid }
		};
		data.links = [...data.links, newLink];
	}
	$: data && console.log({ data });
</script>

<Canvas bind:data let:connectable>
	<Board {commits} {connectable} on:createLink={createLink} />
</Canvas>
