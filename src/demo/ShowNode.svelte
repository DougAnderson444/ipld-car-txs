<script>
	// @ts-nocheck

	import { CID } from 'multiformats/cid';
	// @ts-ignore
	import { onMount } from 'svelte';

	export let get;
	export let node;

	let data;

	onMount(async () => {
		console.log({ node });
		data = await get(node);
	});
</script>

{#if data}
	{#await data then data}
		{#each Object.entries(data) as [key, val]}
			{#if CID.asCID(val)}
				<svelte:self {get} node={val} />
			{:else}
				<div class="bg-slate-100 rounded-lg m-1 p-1 w-fit">{key}: {val}</div>
			{/if}
		{/each}
	{/await}
{/if}
