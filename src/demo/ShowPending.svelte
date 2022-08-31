<script lang="ts">
	import type { Transaction } from '@douganderson444/ipld-car-txs';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import ShowBlocks from './ShowBlocks.svelte';
	export let pending: Transaction;
	$: pending && console.log({ pending });

	const size = tweened(1, {
		duration: 400,
		easing: cubicOut
	});

	pending.on('size', (e: Event) => ($size = pending.size));
</script>

{#if pending}
	<div class="flex flex-row">
		{#key pending}
			<ShowBlocks blocks={[...pending.blocks]} on:createLink />
		{/key}
		{#if $size}
			Total Transaction Size: {$size.toFixed(0)} bytes<br />
		{/if}
	</div>
{/if}
