<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Transaction } from '@douganderson444/ipld-car-txs';

	const dispatch = createEventDispatcher();

	export let tx: Transaction;

	async function handleCommit(e: Event) {
		const buffer = await tx.commit();
		dispatch('commit', buffer);
	}
</script>

<div class="flex flex-row-reverse m-1 p-1 justify-items-end">
	<button
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg justify-end"
		on:click={handleCommit}>Commit Tx</button
	>
</div>
