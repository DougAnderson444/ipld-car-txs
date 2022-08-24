<script lang="ts">
	import AddBlock from './AddBlock.svelte';
	import type { Transaction } from '$lib/index.js';
	import ShowBlocks from './ShowBlocks.svelte';

	export let tx: Transaction;
</script>

<AddBlock bind:tx />
<ShowBlocks {tx} />
