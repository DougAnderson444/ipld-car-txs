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

		await dag.tx.add({ key, value: Date.now() });
		await dag.tx.add({ key: 'Landline', value: Date.now() });
		await dag.tx.add({ key, value: Date.now() });
		const firstBuffer = await dag.tx.commit(); // save this somewhere else, like Arweave

		await dag.tx.add({ key, value: Date.now() });
		const secondBuffer = await dag.tx.commit(); // data not duplicated, only new data needs to be saved

		let root = await dag.getLocal(dag.rootCID);
		console.log(root);

		let current = (await dag.getLocal(root[key].current)).value;
		console.log(current);

		if (root[key].prev) {
			let prev = await dag.getLocal(root[key].prev); // "555-555-1234" all the data is there
			console.log('prev.value', { prev }); // key.value
			console.log(prev.value); // key.value
		}
		// let pathValue = await dag.getLocal(dag.rootCID, { path: '/' + key }); // "555-555-1234" all the data is there

		// // I can rebuild the dag from transactions on another machine
		// let rebuiltDag;
		// if (!globalThis.rebuiltDag) {
		// 	rebuiltDag = await createDagRepo({ path: 'rebuiltDag' }); // make a barebones dag repo for fast loading
		// 	globalThis.rebuiltDag = rebuiltDag;
		// } else {
		// 	rebuiltDag = globalThis.rebuiltDag;
		// }

		// await rebuiltDag.importBuffers([firstBuffer, secondBuffer]); // as many as you need

		// let current = await rebuiltDag.getLocal(dag.rootCID);

		// let previous = await rebuiltDag.getLocal(dag.rootCID, {
		// 	path: `/${key}`
		// });

		// console.log({ current });
		// console.log({ previous });
		// console.log(current[key].value); // values out == data in
		// console.log(previous[key].value); // values out == data in
	});
</script>

CarTX: {out}
