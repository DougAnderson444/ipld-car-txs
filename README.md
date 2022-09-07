# IPLD CAR Transactions (txs)

WIP.

1. Use IPLD Blocks to add to IPLD one transaction at a time.
2. Import your commited transactions back into a DAG to build it further.

## Why?

Tag Dag Repo Builder. Because when you want to build a local first DAG one step at a time, and save each step into an external source (database, Arweave, p2p, wherever) you need a mechanism to do this.

With IPFS DAG, it's all or nothing, so you would be saving a lot of duplicate data. But with IPLD, if we break the Dag building down into transactions, then we can save each transaction and avoid this duplication.

We're building a DAG here, so previous CIDs from deeper down in the DAG can be linked to our current transaction we are building. So we also need a way to GET those links, with a label or a tag. So say I am building "Mobile Phone Number" as a Tag in my Dag, I would first:

`cid = dag.put({"Mobile Phone Number": {value: : "555-1234"}})`

Now any time someone looks up `rootCID["Mobile Phone Number"].value` they will get `"555-1234"`.

But I forgot to add an area code, so I need to update:

`newCid = dag.put({"Mobile Phone Number": {value: "555-555-1234", prev: cid}})`

Now `rootCID["Mobile Phone Number"].value` points to the new number, area code included.

But if I go to save `newCid` to a database by exporting the CAR using `ipfs.dag.export(newCid)` I am ALSO going to save the data at `prev` which I may have already paid to save, so I am paying again for it. What we want to do is split the DAG building and saving process up into steps (transactions) so that we save each segment individually and thus avoid duplication.

This is what this library does. So instead I can now do:

```js
await dag.tx.add('Mobile', { number: '555-1234' });
firstBuffer = await dag.tx.commit(); // save this somewhere else, like Arweave

await dag.tx.add('Mobile', { number: '555-555-1234' });
secondBuffer = await dag.tx.commit(); // data not duplicated, only new data needs to be saved

await dag.get(dag.rootCID, { path: '/Mobile/current/number' }); // "555-555-1234"
await dag.get(dag.rootCID, { path: '/Mobile/prev/number' }); // "555-1234" all the data is there

// I can rebuild the dag from transactions on another machone
await rebuiltDag.importBuffers([firstBuffer, secondBuffer]); // as many as you need

let current = await rebuiltDag.get(rebuiltDag.rootCID, { path: '/Mobile Phone Number' }); // "555-555-1234"

let previous = await rebuiltDag.get(rebuiltDag.rootCID, { path: '/Mobile Phone Number/prev' }); // "555-1234" all the data is there
```

## Install

```
npm install douganderson444/ipld-car-txs
```

## Usage API

```js
import { Transaction, createDagRepo } from '@douganderson444/ipld-car-txs';

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

Extended from the inspiration of [car-transaction](https://github.com/mikeal/car-transaction)
