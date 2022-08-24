<script>
	import { Board } from '$demo/index.js';
	import { Canvas, EndPoint } from '@douganderson444/svelte-plumb';

	let transactions = [];

	let data = { nodes: [], links: [] };
</script>

<Canvas bind:data let:connectable>
	<Board {transactions} {connectable} />
</Canvas>
