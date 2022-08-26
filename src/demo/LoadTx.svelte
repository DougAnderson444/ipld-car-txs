<script lang="ts">
	import { Transaction } from '@douganderson444/ipld-car-txs';

	import { onMount } from 'svelte';

	import ShowNode from './ShowNode.svelte';

	export let commit: Uint8Array;

	let root: any;
	let get: any;
	let rootNode: object;

	onMount(async () => {
		// read a transaction
		({ root, get } = await Transaction.load(commit));
		console.log({ root, get });
	});
</script>

{#if root}
	{#await root}
		Loading commit
	{:then root}
		<ShowNode {get} node={root} />
	{/await}
{/if}
