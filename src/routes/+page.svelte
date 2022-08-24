<script lang="ts">
	import { Board } from '$demo/index.js';
	import { Canvas, EndPoint } from '@douganderson444/svelte-plumb';

	let commits: Uint8Array[] = [];

	let data = { nodes: [], links: [] };
</script>

<Canvas bind:data let:connectable>
	<Board {commits} {connectable} />
</Canvas>
