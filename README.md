# IPLD CAR Transactions (txs)

1. Use IPLD Blocks to add to IPLD one transaction at a time.
2. Import your commited transactions back into a DAG to build it further.

## All Imports

```js
import { Transaction, encode, createDagRepo, importBuffer } from '@douganderson444/ipld-car-txs';
```

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
npm install @douganderson444/ipld-car-txs
```

## Usage API

Using ipfs.dag already? Extend the functionality with

```js
import { createDagRepo, DagRepo } from '@douganderson444/ipld-car-txs';
import type { DagRepo } from '@douganderson444/ipld-car-txs';

// init the DagRepo
const dag = await createDagRepo();

// add a Tag Node
await dag.tx.addTag('Phone', { number: '555-1234' });

// Now Phone will resolve to last added value
let currNumber = await dag.latest('Phone'); // { number: '555-1234' }

// you can link data without a Tag as
const dataCid = await dag.tx.addData({ timeline: `I've had this number for over a year now` });

// update the tag to use the new linked data
await dag.tx.addTag('Phone', { number: '555-555-1234', duration: dataCid });

// Getting the latest duration timeline is easy:
let howLong = await dag.latest('Phone', `duration/timeline`); // "I've had this number for over a year now"

// or the long way
currNumber = await dag.latest('Phone'); // { number: '555-555-1234', duration: dataCid }
dur = await dag.get(currNumber.duration); // { timeline: I've... }
dur.timeline; // I've had this number for over a year now

// save or share the data with another location
const buffer = await dag.tx.commit();

// in their dag
myRootCID = await theirDag.importBuffers([buffer]); // as many as you need
```

```js
Object.assign(ipfs.dag, yourDagRepo);
```

Now you should be able to use `ipfs.dag.tx.add(tag, {key: value})`

### DagRepo usage

You can leave `createDagRepo(options)` config options blank and the library will assume reasonable defaults for you.

```js
import { createDagRepo } from '@douganderson444/ipld-car-txs';

const run = async () => {
	let data = { some: 'data' };
	let out;
	let key = 'bPhone';
	let key2 = 'cMobile';
	let key3 = 'dLanline';

	await dag.tx.pending.add({ random: 'data' });
	await dag.tx.add(key, { number: '555-1234' });
	const firstBuffer = await dag.tx.commit();

	let tags = Object.keys((await dag.get(dag.rootCID)).value);

	// expect tags to be the same
	expect(tags).toEqual([tag, key]);

	const dataCid = await dag.tx.pending.add({ more: 'randomdata' });
	await dag.tx.add(key, { number: '212-555-1234' });
	await dag.tx.add(key2, { number: '555-555-1234' });
	const secondBuffer = await dag.tx.commit(); // data not duplicated, only new data needs to be saved

	tags = Object.keys((await dag.get(dag.rootCID)).value);
	expect(tags).toEqual([tag, key, key2]);

	await dag.tx.add(key, { number: '567-555-1234' });
	await dag.tx.add(key3, { dataCid });
	const buffer3 = await dag.tx.commit(); // save this somewhere else, like Arweave

	tags = Object.keys((await dag.get(dag.rootCID)).value);
	expect(tags).toEqual([tag, key, key2, key3]);

	let k3 = (await dag.get(dag.rootCID, { path: `/${key3}/obj/dataCid` })).value;
	expect(k3.more).toEqual('randomdata');

	// You can also use the path shortcut to resolve deeply nested CIDs
	let k3shortcut = await dag.latest(key3, `dataCid/more`);
	expect(k3shortcut).toEqual('randomdata');

	let currentNumber = (await dag.get(dag.rootCID, { path: `/${key}/obj/number` })).value;

	// currentNumber should be 567-555-1234
	expect(currentNumber).toBe('567-555-1234');

	let prevNumber = (await dag.get(dag.rootCID, { path: `/${key}/prev/obj/number` })).value;

	// prevNumber should be 212-555-1234
	expect(prevNumber).toBe('212-555-1234');

	let prevPrevNumber = (await dag.get(dag.rootCID, { path: `/${key}/prev/prev/obj/number` })).value;

	// prevPrevNumber should be 555-1234
	expect(prevPrevNumber).toBe('555-1234');

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

	// rebuiltCurrent should be 567-555-1234
	expect(rebuiltCurrent).toBe('567-555-1234');
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

### Import Buffer into ipfs.dag

Normally you can only `ipfs.dag.import()` a car file, but with this library you'd want to import a `buffer`. You can also use `importBuffer(dag: DagAPI, buffer: Uint8Array)` on your DagAPI:

```js
import { importBuffer } from '@douganderson444/ipld-car-txs';

await importBuffer(ipfs.dag, someCarByteBuffer);
```

## Credits

Extended from the inspiration of [car-transaction](https://github.com/mikeal/car-transaction)

## Build notes

Until [sveltejs/kit/issues/2040](https://github.com/sveltejs/kit/issues/2040) is fixed, we have to programmatically change the `.ts` extension to `.js` in `./src/lib/index.ts`
