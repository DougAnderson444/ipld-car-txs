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

## Install

```
npm install douganderson444/ipld-car-txs
```

## Usage API

```js
import { createDagRepo } from '@douganderson444/ipld-car-txs';

const run = async () => {
	let dag = await createDagRepo(); // make a barebones dag repo for fast loading

	let key = 'Mobile';
	let key2 = 'Landline';

	await dag.tx.add(key, { number: '555-1234' });
	const firstBuffer = await dag.tx.commit(); // save this somewhere else, like Arweave

	await dag.tx.add(key, { number: '212-555-1234' }); // now there is a Mobile/prev/number, 555-1234
	await dag.tx.add(key2, { number: '555-555-1234' });
	const secondBuffer = await dag.tx.commit(); // data not duplicated, only new data needs to be saved

	let currentNumber = (await dag.get(dag.rootCID, { path: `/${key}/current/number` })).value;
	console.log({ currentNumber }); // 212-555-1234

	let prevNumber = (await dag.get(dag.rootCID, { path: `/${key}/prev/number` })).value;
	console.log({ prevNumber }); // 555-1234

	// I can rebuild the dag from transactions on another machine
	let rebuiltDag = await createDagRepo({ path: 'rebuiltDag' }); // make a barebones dag repo for fast

	const root = await rebuiltDag.importBuffers([firstBuffer, secondBuffer]);

	// if you have the last buffer, then root will equal dag.rootCID

	let rebuiltCurrent = (await rebuiltDag.get(dag.rootCID, { path: `/${key}/current/number` }))
		.value;
	console.log({ rebuiltCurrent });
};

run();
```

### Encode(value)

For convenience, `encode(value)` is also exported, which allows you to encode `objects` and raw `bytes` into a Block, returning Block which is `{value, bytes, cid}`.

```js
const value = { hello: 'world' }; // object
const value = new TextEncoder().encode(JSON.stringify({ hello: 'world' })); // or bytes
const { value, bytes, cid } = encode(value);
```

## Credits

Extended from the inspiration of [car-transaction](https://github.com/mikeal/car-transaction)
