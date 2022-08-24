<script lang="ts">
	import type { Transaction } from '$lib/index.js';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	export let tx: Transaction;

	const size = tweened(1, {
		duration: 400,
		easing: cubicOut
	});

	tx.on('size', (_: Event) => ($size = tx.size));
</script>

{#if tx?.blocks?.length > 0}
	<div class="flex flex-row">
		{#each [...tx.blocks].reverse() as { value, cid, bytes } (cid)}
			<div animate:flip class="mr-1 p-2 border-emerald-50 bg-green-800 text-white rounded-lg w-fit">
				{#each Object.entries(value) as [key, val]}
					{key}: {val} ({bytes.length})
				{/each}
			</div>
		{/each}
	</div>
	{#if $size}
		Total Transaction Size: {$size.toFixed(0)} bytes<br />
	{/if}
{/if}
