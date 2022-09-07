<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { flip } from 'svelte/animate';

	import AddTx from './AddTx.svelte';
	import LoadTx from './LoadTx.svelte';
	import { Transaction } from '@douganderson444/ipld-car-txs';

	import EditTag from './EditTag.svelte';

	import type { DagRepo } from '@douganderson444/ipld-car-txs';
	import type { CID } from 'multiformats';
	import type { Block } from 'multiformats/block';
	import ShowBlocks from './ShowBlocks.svelte';
	import ShowPending from './ShowPending.svelte';
	import CommitTx from './CommitTx.svelte';

	export let commits: Uint8Array[] = [];
	export let connectable: Function;

	let dag: DagRepo;
	let rootCID: CID;
	interface DagNode {
		current: CID;
		prev: CID;
	}
	let rootObj: DagNode;
	let pending: Block<any>[];

	setContext('connectable', connectable);

	onMount(async () => {
		const { createDagRepo } = await import('@douganderson444/ipld-car-txs');

		// workaround Vite's HMR by tracking globalThis.dag
		// @ts-ignore
		if (!globalThis.dag) {
			dag = await createDagRepo(); // make a barebones dag repo for fast loading
			// @ts-ignore
			globalThis.dag = dag;
		} else {
			// @ts-ignore
			dag = globalThis.dag;
		}

		dag.on('added', (evt) => {
			pending = dag.tx.pending;
		});
		dag.on('rootCID', (evt) => (rootCID = dag.rootCID));
	});

	$: if (rootCID) dag.get(rootCID).then((r: DagNode) => (rootObj = r));

	async function handleCommit(e: CustomEvent) {
		const buffer = e.detail;
		commits = [...commits, buffer]; // add to list of commits
	}
</script>

<div class="m-4 text-lg font-bold">List Tags</div>
{#if rootObj}
	{#each Object.entries(rootObj) as [key, { current, prev }]}
		{key}: {current}
		<EditTag tag={key} value={current} {dag} />
	{/each}
{/if}
<div class="m-4 text-lg font-bold">Add Tag</div>
<EditTag {dag} />
<div class="m-4 p-4 border-dashed border-2">
	{#if pending}
		<ShowPending {pending} on:createLink />
	{/if}

	<CommitTx tx={dag?.tx} on:commit={handleCommit} />
</div>

{#if commits && commits.length}
	<div class="flex flex-col-reverse ">
		{#each commits as commit, i (i)}
			<div animate:flip class="m-4 p-2 border-2 border-dashed ">
				Commit #{i}<LoadTx {commit} />
			</div>
		{/each}
	</div>
{:else}
	No Commits
{/if}
