<script lang="ts">
	// @ts-nocheck

	import { CID } from 'multiformats/cid';
	// @ts-ignore
	import { getContext, onMount, createEventDispatcher } from 'svelte';

	export let key;
	export let current;
	export let prev;
	export let cid;

	const connectable: Function = getContext('connectable');
	const dispatch = createEventDispatcher();

	onMount(async () => {
		if (current)
			dispatch('createLink', {
				source: { dataset: { cid: `${cid.toString()}/current` } },
				target: { dataset: { cid: current.toString() } }
			});
		if (prev)
			dispatch('createLink', {
				source: { dataset: { cid: `${cid.toString()}/prev` } },
				target: { dataset: { cid: prev.toString() } }
			});
	});
</script>

{#if key}
	<div
		id={cid.toString()}
		use:connectable={{ dataset: { cid: cid.toString() } }}
		class="m-1 p-2 bg-blue-400 text-white rounded-lg w-fit"
	>
		<slot name="key">{key}</slot>

		<div class="m-1 p-1 bg-blue-600/80 rounded-lg" id="{cid.toString()}/current">
			<slot name="current">Current</slot>
		</div>
		{#if prev}
			<div class="m-1 p-1 bg-slate-400/50 rounded-lg" id="{cid.toString()}/prev">
				<slot name="prev">Prev</slot>
			</div>
		{/if}
	</div>
{/if}
