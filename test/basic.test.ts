import { describe, it, assert, expect, test, beforeAll, afterAll } from 'vitest';
// import createDagRepo
import { createDagRepo, DagRepo } from '$lib';

describe('Test ipld-car-txs', () => {
	let dag;
	const tag = 'aTag';

	beforeAll(async () => {
		dag = await createDagRepo();
	});

	it('should create a DagRepo', async () => {
		expect(dag).toBeInstanceOf(DagRepo);
	});

	it('should use CIDs and not duplicate sizes or show value keys', async () => {
		const compiled = new Uint8Array(400);
		const compiledCid = await dag.tx.pending.add({ value: compiled });

		// expect(dag.tx.pending.blocks.length).toBe(1);

		const components = new Uint8Array(74e3);
		const componentsCid = await dag.tx.pending.add({ value: components });

		// expect size to be about 10k
		expect(dag.tx.pending.size).toBeGreaterThan(74e3);
		expect(dag.tx.pending.size).toBeLessThan(80e3);

		// it should merge the cids together and still be about 10k
		await dag.tx.add(tag, { compiled: compiledCid, components: componentsCid });

		expect(dag.tx.pending.size).toBeGreaterThan(74e3);
		expect(dag.tx.pending.size).toBeLessThan(76e3);

		console.log('size', dag.tx.pending.size);
		const buffer = await dag.tx.commit();

		const tags = Object.keys((await dag.get(dag.rootCID)).value);

		// expect tags to be the same and exclude the value keys
		expect(tags).toEqual([tag]);

		// epxect buffer.length to be about the same as checkSize
		expect(buffer.length).toBeGreaterThan(74e3);
		expect(buffer.length).toBeLessThan(76e3);
	});

	it('should write and read same sata', async () => {
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

		let currentNumber = (await dag.get(dag.rootCID, { path: `/${key}/obj/number` })).value;

		// currentNumber should be 567-555-1234
		expect(currentNumber).toBe('567-555-1234');

		let prevNumber = (await dag.get(dag.rootCID, { path: `/${key}/prev/obj/number` })).value;

		// prevNumber should be 212-555-1234
		expect(prevNumber).toBe('212-555-1234');

		let prevPrevNumber = (await dag.get(dag.rootCID, { path: `/${key}/prev/prev/obj/number` }))
			.value;

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
	});
});
