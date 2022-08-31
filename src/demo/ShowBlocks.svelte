<script lang="ts">
	import { getContext } from 'svelte';
	import ShowBlock from './ShowBlock.svelte';

	export let blocks: Block<any>[];

	const connectable: Function = getContext('connectable');
</script>

{#if blocks?.length > 0}
	<div class="flex flex-row">
		{#each [...blocks].reverse() as block, b}
			<div class="bg-slate-200/50 rounded-lg shadow  m-2 p-2 border-dashed">
				Block #{b}
				<ShowBlock {block} on:createLink />
			</div>
		{/each}
	</div>
{/if}
