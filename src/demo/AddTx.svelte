<script lang="ts">
	import AddBlock from './AddBlock.svelte';
	import ShowBlocks from './ShowBlocks.svelte';
	import CommitTx from './CommitTx.svelte';
	import type { Transaction } from '@douganderson444/ipld-car-txs';

	export let tx: Transaction | null = null;
</script>

{#if tx}
	<AddBlock bind:tx />
	<ShowBlocks {tx} />
	<CommitTx {tx} on:commit />
{/if}
