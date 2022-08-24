<script lang="ts">
	import type { Transaction } from '$lib/index.js';

	export let tx: Transaction;

	let key: string = 'Key';
	let value: string = 'Value';

	let show: boolean = false;
	let offsetHeight, offsetWidth;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
			(event.target as HTMLElement).blur();
		}
	}
	async function handleAdd(event: Event): Promise<void> {
		if (tx && key && value) {
			const subCID = await tx.add({ [key]: value });
			const cid = await tx.add({ [key]: subCID });
			tx = tx;
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
