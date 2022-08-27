<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	import { Transaction, createDagRepo } from '@douganderson444/ipld-car-txs';

	let data = { some: 'data' };
	let out;

	onMount(async () => {
		// const { createDagRepo } = await import('@douganderson444/ipld-car-txs');

		// start a basic transaction
		const t = Transaction.create();

		const subCID = await t.add(data);
		await t.add({ sub: subCID });
		const buffer = await t.commit();

		// read a transaction
		const { root, get } = await Transaction.load(buffer);
		// root is a cid
		const { sub } = await get(root);
		({ some: out } = await get(sub));
		// get retrieves the block and decodes it
		if (out !== data.some) throw new Error('data error');

		// reconstruct DAG
		// workaround Vite's HMR by tracking globalThis.dag
		let dag;
		if (!globalThis.dag) {
			dag = await createDagRepo(); // make a barebones dag repo for fast loading
			globalThis.dag = dag;
		} else {
			dag = globalThis.dag;
		}

		// const it = await makeIterable([buffer]); // dag.import needs asyncIterable
		// const [{ root: r }] = await all(dag.import(it));

		const cid = await dag.importBuffer(buffer);
		console.log({ cid }); // cid in matches cid out

		const got = await dag.getLocal(cid, { path: `/sub` }); // getLocal sets get(preload: false)

		// assert matches
		console.log(root.toString() == cid.toString()); // cid in matches cid out
		console.log(JSON.stringify(got.value) == JSON.stringify(data)); // values out == data in
		console.log(got.value, data); // values out == data in
	});
</script>

CarTX: {out}
