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

		let key = 'Mobile Phone Number';

		await dag.tx.add({ key, value: '555-1234' });
		const firstBuffer = await dag.tx.commit(); // save this somewhere else, like Arweave

		await dag.tx.add({ key, value: '555-555-1234' });
		const secondBuffer = await dag.tx.commit(); // data not duplicated, only new data needs to be saved

		console.log(`dag.getLocal CID: ${dag.rootCID}`);

		let latest = await dag.getLocal(dag.rootCID);
		console.log(latest[key].value);

		let prevValue = await dag.getLocal(latest[key].prev); // "555-555-1234" all the data is there
		console.log(prevValue[key].value); // key.value

		let pathValue = await dag.getLocal(dag.rootCID, { path: '/' + key }); // "555-555-1234" all the data is there
		console.log({ pathValue }, pathValue.value); // key.value

		// I can rebuild the dag from transactions on another machine
		let rebuiltDag;
		if (!globalThis.rebuiltDag) {
			rebuiltDag = await createDagRepo({ path: 'rebuiltDag' }); // make a barebones dag repo for fast loading
			globalThis.rebuiltDag = rebuiltDag;
		} else {
			rebuiltDag = globalThis.rebuiltDag;
		}

		await rebuiltDag.importBuffers([firstBuffer, secondBuffer]); // as many as you need

		let current = await rebuiltDag.getLocal(dag.rootCID, { path: '/' + key });

		let previous = await rebuiltDag.getLocal(dag.rootCID, {
			path: `/${key}/prev`
		});

		console.log({ current }, { previous });
		//console.log(current.value, previous.value); // values out == data in
	});
</script>

CarTX: {out}
