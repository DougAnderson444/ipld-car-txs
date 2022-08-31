<script lang="ts">
	import { Transaction } from '@douganderson444/ipld-car-txs';
	import type { CID } from 'multiformats';

	import { onMount } from 'svelte';

	import ShowNode from './ShowNode.svelte';
	import ShowBlock from './ShowBlock.svelte';
	import TxDrillDown from './TxDrillDown.svelte';

	export let commit: Uint8Array;

	let root: CID;
	let get: any;
	let rootNode: object;

	onMount(async () => {
		// read a transaction
		({ root, get } = await Transaction.load(commit));
		rootNode = await get(root);
		console.log({ rootNode });
	});
</script>

{#if rootNode}
	{#await rootNode then rootNode}
		{#each Object.entries(rootNode) as [key, { current, prev }]}
			<!-- <ShowBlock block={{ cid: root, value: rootNode }} on:createLink /> -->
			<div>{key}:</div>
			<ShowNode {key} {current} {prev} cid={root}>
				<svelte:fragment slot="key">
					{key}
				</svelte:fragment>
				<svelte:fragment slot="current">
					{#if current}
						<TxDrillDown {get} node={current} on:createLink>Current</TxDrillDown>
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="prev">
					{#if prev}
						<TxDrillDown {get} node={prev} on:createLink>Prev</TxDrillDown>
					{/if}
				</svelte:fragment>
			</ShowNode>
			<!-- {#if CID.asCID(val)}
				<svelte:self {get} node={val} />
			{:else}
				<div class="bg-slate-100 rounded-lg m-1 p-1 w-fit">{key}: {val}</div>
				<ShowNode {cid} {key} {current} {prev} on:createLink />
			{/if} -->
		{/each}
	{/await}
{/if}
