# IPLD CAR Transactions (txs)

Use IPLD Blocks to add to IPLD one transaction at a time.

## Install

```
npm install douganderson444/ipld-car-txs
```

## Usage API

```js
import Transaction from '@douganderson444/ipld-car-txs';

const run = async () => {
	// start a basic transaction
	const t = Transaction.create();

	// listen for size updates for this transaction
	t.on('size', (e) => console.log('Size is ', t.size, ' bytes'));

	const subCID = await t.add({ some: 'data' });
	await t.add({ sub: subCID });
	await t.add({ whoops: 'mistake' });
	t.undo(); // remove the last addition
	const buffer = await t.commit(); // turn the txn blocks into a

	// read a transaction
	// the last write is always the root
	const { root, get } = await Transaction.load(buffer);
	// root is a cid
	const { sub } = await get(root);
	const { some } = await get(sub);
	// get retrieves the block and decodes it
	if (some !== 'data') throw new Error('data error');

	// import previously saved CAR buffers back into IPLD to reconstruct the DAG for the next transaction
	dag = await createDagRepo(); // make a barebones dag repo for fast loading

	const cid = await dag.importBuffer(buffer);

	// now we can access our imported CAR dag using paths, to build our next transaction:
	const got = await dag.getLocal(cid, { path: `/sub` });
};

run();
```

## Credits

Inspired by [car-transaction](https://github.com/mikeal/car-transaction)
