<script lang="ts">
	import type { Transaction } from '$lib';
	import { getContext, onMount, createEventDispatcher } from 'svelte';

	import type { Block } from 'multiformats/block';
	import type { CID } from 'multiformats';
	import ShowNode from './ShowNode.svelte';

	// export let tx: Transaction;
	export let block: { cid: CID; value: any };

	const connectable: Function = getContext('connectable');
	const dispatch = createEventDispatcher();

	let cid: CID;
	let value: any;
	let leaf: any;
	let node: any;
	onMount(async () => {
		console.log({ block });
		({ cid, value } = block); // block/root cid, not value cid
		if (value?.value) leaf = value.value; // leaf
		else node = Object.entries(value); // node
	});
</script>

{#if leaf}
	<div
		id={cid.toString()}
		use:connectable={{ dataset: { cid: cid.toString() } }}
		class="mr-1 p-2 border-emerald-50 bg-green-800 text-white rounded-lg w-fit h-fit"
	>
		{leaf}
	</div>
{/if}

{#if node}
	<div class="flex flex-col">
		{#each node as [key, { current, prev }]}
			<ShowNode {cid} {key} {current} {prev} on:createLink />
		{/each}
	</div>
{/if}
