<script lang="ts">
	import { onMount } from 'svelte';
	import type { DagRepo, Transaction } from '@douganderson444/ipld-car-txs';
	import { CID } from 'multiformats';

	export let dag: DagRepo;
	export let key: string = 'Name';
	export let value: any = 'Doug';

	let resolved: string | undefined;
	let show: boolean = false;
	let offsetHeight, offsetWidth;

	onMount(async () => {
		if (value) {
			const cid = CID.asCID(value);
			if (cid) {
				resolved = await dag.get(cid);
			}
		}
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
			(event.target as HTMLElement).blur();
		}
	}
	async function handleAdd(event: Event): Promise<void> {
		if (dag && key && value) {
			await dag.tx.add({ key, value });
		}
	}
</script>

<div class="flex flex-row relative">
	<div class="flex flex-row  text-sm bg-slate-100 shadow shadow-blue-200 my-4 p-1 rounded-lg w-fit">
		<div class="flex-1 flex flex-row m-1 p-1 items-center">
			<span
				class="p-1 bg-white rounded-md border border-gray-400 w-full min-w-[50px]"
				contenteditable="true"
				on:keydown={handleKeydown}
				bind:textContent={key}
				>{key}
			</span>:
		</div>
		<div class="flex-1 flex flex-row m-1 p-1 items-center">
			<span
				class="p-1 bg-white rounded-md border border-gray-400 w-full min-w-[50px]"
				contenteditable="true"
				on:keydown={handleKeydown}
				bind:textContent={value}
			>
				{value}</span
			>
		</div>
		<div class="flex flex-row-reverse m-1 p-1 justify-items-end">
			<!-- save button  -->
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg justify-end"
				on:click={handleAdd}>Add</button
			>
		</div>
	</div>
</div>
