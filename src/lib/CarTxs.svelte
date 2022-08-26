<script>
	// @ts-nocheck

	import { Transaction } from '@douganderson444/ipld-car-txs';

	let data = { some: 'data' };
	let out;

	const test = async () => {
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
	};

	test();
</script>

CarTX: {out}
