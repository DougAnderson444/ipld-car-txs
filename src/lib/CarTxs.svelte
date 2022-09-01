<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	import { createDagRepo } from '@douganderson444/ipld-car-txs';

	let data = { some: 'data' };
	let out;
	let dag;

	onMount(async () => {
		// const { createDagRepo } = await import('@douganderson444/ipld-car-txs');

		// create a new Tag Dag Repo
		// workaround Vite's HMR by tracking globalThis.dag
		let dag;
		if (!globalThis.dag) {
			dag = await createDagRepo(); // make a barebones dag repo for fast loading
			globalThis.dag = dag;
		} else {
			dag = globalThis.dag;
		}

		let key = 'Mobile';

		// await dag.tx.add({ key, value: Date.now() });
		await dag.tx.add({ key: 'Landline', value: '555-1234' });
		// await dag.tx.add({ key, value: Date.now() });
		const firstBuffer = await dag.tx.commit(); // save this somewhere else, like Arweave

		await dag.tx.add({ key, value: '212-555-1234' });
		const secondBuffer = await dag.tx.commit(); // data not duplicated, only new data needs to be saved

		let root = await dag.getLocal(dag.rootCID);
		console.log({ root });

		// I can rebuild the dag from transactions on another machine
		let rebuiltDag;
		if (!globalThis.rebuiltDag) {
			rebuiltDag = await createDagRepo({ path: 'rebuiltDag' }); // make a barebones dag repo for fast loading
			globalThis.rebuiltDag = rebuiltDag;
		} else {
			rebuiltDag = globalThis.rebuiltDag;
		}

		await rebuiltDag.importBuffers([firstBuffer, secondBuffer]); // as many as you need

		let rebuiltCurrent = await rebuiltDag.getLocal(dag.rootCID);
		console.log({ rebuiltCurrent });
	});
</script>

CarTX: {out}
