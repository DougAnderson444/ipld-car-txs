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
		let key2 = 'Landline';

		await dag.tx.add(key, { number: '555-1234' });
		const firstBuffer = await dag.tx.commit(); // save this somewhere else, like Arweave

		await dag.tx.add(key, { number: '212-555-1234' });
		await dag.tx.add(key2, { number: '555-555-1234' });
		const secondBuffer = await dag.tx.commit(); // data not duplicated, only new data needs to be saved

		await dag.tx.add(key, { number: '567-555-1234' });
		const buffer3 = await dag.tx.commit(); // save this somewhere else, like Arweave

		let currentNumber = (await dag.get(dag.rootCID, { path: `/${key}/obj/number` })).value;
		console.log({ currentNumber });

		let prevNumber = (await dag.get(dag.rootCID, { path: `/${key}/prev/obj/number` })).value;
		console.log({ prevNumber });

		let prevPrevNumber = (await dag.get(dag.rootCID, { path: `/${key}/prev/prev/obj/number` }))
			.value;
		console.log({ prevPrevNumber });

		// I can rebuild the dag from transactions on another machine
		let rebuiltDag;
		if (!globalThis.rebuiltDag) {
			rebuiltDag = await createDagRepo({ path: 'rebuiltDag' }); // make a barebones dag repo for fast loading
			globalThis.rebuiltDag = rebuiltDag;
		} else {
			rebuiltDag = globalThis.rebuiltDag;
		}

		await rebuiltDag.importBuffers([firstBuffer, secondBuffer, buffer3]); // as many as you need

		let rebuiltCurrent = (await rebuiltDag.get(dag.rootCID, { path: `/${key}/obj/number` })).value;
		console.log({ rebuiltCurrent });
	});
</script>

CarTX: {out}
