<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { Transaction } from '@douganderson444/ipld-car-txs';
	import ManageBlocks from './ManageBlocks.svelte';

	import AddBlock from './AddBlock.svelte';
	import ShowBlocks from './ShowBlocks.svelte';

	export let transactions: Transaction[] = [];
	export let tx: Transaction | null = null;
	export let connectable: Function;

	setContext('connectable', connectable);

	function createTx(): Transaction {
		console.log({ Transaction });
		tx = Transaction.create();
		return tx;
	}
	onMount(async () => {
		if (!transactions.length) {
			const t = createTx();
			transactions = [t];
			console.log({ transactions });
		}
	});
</script>

{#if transactions && transactions.length}
	{#each transactions as tx}
		<AddBlock bind:tx />
		<ShowBlocks {tx} />
	{/each}
{:else}No blocks
{/if}
