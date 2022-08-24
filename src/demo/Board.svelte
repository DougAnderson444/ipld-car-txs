<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { flip } from 'svelte/animate';

	import AddTx from './AddTx.svelte';
	import LoadTx from './LoadTx.svelte';
	import { Transaction } from '$lib/index.js';

	export let commits: Uint8Array[] = [];
	export let connectable: Function;

	let tx: Transaction | null = null;

	setContext('connectable', connectable);

	onMount(async () => {
		tx = Transaction.create();
	});

	function handleCommit(e: CustomEvent) {
		const buffer = e.detail;
		commits = [...commits, buffer];
		tx = Transaction.create(); // create new Tx, now that the old one is committed
	}
</script>

<div class="m-4 p-4 border-dashed border-2">
	<AddTx bind:tx on:commit={handleCommit} />
</div>

{#if commits && commits.length}
	<div class="flex flex-col-reverse ">
		{#each commits as commit, i (i)}
			<div animate:flip class="m-4 p-2 border-2 border-dashed ">
				<LoadTx {commit} />
			</div>
		{/each}
	</div>
{:else}
	No Commits
{/if}
