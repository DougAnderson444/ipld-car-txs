<script lang="ts">
	import { CID } from 'multiformats';
	// @ts-ignore
	import { onMount } from 'svelte';

	export let get: Function;
	export let node: CID;

	let data: any;

	onMount(async () => {
		data = await get(node);
		console.log({ data });
	});
</script>

{#if data}
	{#await data then data}
		{#each Object.entries(data) as [key, val]}
			{#if val.current && CID.asCID(val.current)}
				<svelte:self {get} node={val.current} />
			{:else}
				<slot />
				<div class="bg-slate-100 rounded-lg m-1 p-1 w-fit">{val}</div>
			{/if}
		{/each}
	{/await}
{/if}
