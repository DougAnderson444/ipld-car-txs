// import { createRepo } from '../../node_modules/ipfs-core-config/src/repo.browser.js'; // breaks on build, mortice issue
import { createRepo } from '../modules/repo.browser.js';

import { DagAPI } from '../../node_modules/ipfs-core/src/components/dag/index';
// import { PinAPI } from '../../node_modules/ipfs-core/src/components/pin/index';
// import { BlockAPI } from '../../node_modules/ipfs-core/src/components/block/index';
import * as dagcbor from '@ipld/dag-cbor';
import * as raw from 'multiformats/codecs/raw';
import { createImport } from '../../node_modules/ipfs-core/src/components/dag/import';
import { sha256 } from 'multiformats/hashes/sha2';
import { identity } from 'multiformats/hashes/identity';
import { hashes, codecs } from 'multiformats/basics';
import * as dagPB from '@ipld/dag-pb';
import * as dagCBOR from '@ipld/dag-cbor';
import * as dagJSON from '@ipld/dag-json';
import * as dagJOSE from 'dag-jose';
import { Multicodecs } from 'ipfs-core-utils/multicodecs';
import { Multihashes } from 'ipfs-core-utils/multihashes';
import { makeIterable } from './utils';
import all from 'it-all';

import { Transaction } from './transaction';

// import { createPreloader } from '../../node_modules/ipfs-core/src/preload';
// import { Storage } from '../../node_modules/ipfs-core/src/components/storage';

import type { IPFSRepo } from 'ipfs-repo'; // https://github.com/ipfs/js-ipfs-repo/blob/master/packages/ipfs-repo/src/types.ts
import type { PreloadOptions } from 'ipfs-core';

export async function repoInit(options = {}): Promise<IPFSRepo> {
	const repoPath = options.path || 'ipfs';
	const loadCodec = (codeOrName) => {
		const lookup = {
			[raw.code]: raw,
			[raw.name]: raw,
			[dagCbor.code]: dagCbor,
			[dagCbor.name]: dagCbor
		};

		return Promise.resolve(lookup[codeOrName]);
	};
	const repo = createRepo(repoPath, loadCodec);
	await repo.init();
	return repo;
}

export async function createDag() {
	// const preload: PreloadOptions = { enabled: false }
	const repo = await repoInit();
	return new DagAPI({ repo, codecs: [raw, dagcbor], hashers: [sha256], preload: false });
}

/**
 * Add ipfs.dag functionality to ipfs-repo
 */
export type DagRepo = DagAPI & {
	repo: IPFSRepo;
	// block: BlockAPI;
	// pin: PinAPI;
};

export class DagRepo extends DagAPI {
	constructor({ repo, codecs, options }) {
		const preload = false; //createPreloader(options.preload);

		/** @type {MultihashHasher[]} */
		const multihashHashers = Object.values(hashes);

		(options.ipld && options.ipld.hashers ? options.ipld.hashers : []).forEach((hasher) =>
			multihashHashers.push(hasher)
		);

		const hashers = new Multihashes({
			hashers: multihashHashers,
			loadHasher: options.ipld && options.ipld.loadHasher
		});

		super({ repo, codecs, hashers, preload }); // DagAPI

		// this.pin = new PinAPI({ repo, codecs });
		// this.block = new BlockAPI({ repo, codecs, hashers, preload });
		this.repo = repo;

		this.rootCID;

		this.tx = {
			// TODO: Check for existing open transactions that havent been commited?
			pending: Transaction.create(),
			/**
			 * When a Transaction is added, the dag should check the dag to see if the key already exists,
			 * and link the prev value to build an iterable chain of versions.
			 */
			add: async ({ key, value }) => {
				// check to see if the key already exists
				let prev: CID | false = false;

				if (this.rootCID)
					try {
						console.log(`Checking ${this.rootCID}/${key}`);
						// prev = (await this.resolve(this.rootCID, { path: `/${key}` })).cid;
						prev = (
							await this.resolve(this.rootCID, {
								preload: false,
								path: `/${key}`
							})
						).cid;
						console.log(`prev cid: `, prev.toString());
						// add prev to dag chain as 'prev'
					} catch (error) {
						// prev doesnt exist, leave as false
						console.log(`No prev ${key}`);
					}
				let txCid = await this.tx.pending.add({ [key]: { value, prev } });
				return txCid;
			},
			/**
			 * Once the Tx is committed, it's dag imported which merges the blocks into the existing DAG
			 * Tx CID and prev Root CID is updated to new Root CID
			 * and a new Transaction needs to be created
			 */
			commit: async () => {
				const buffer = await this.tx.pending.commit();

				// read the recently commited transaction
				const { root, get } = await Transaction.load(buffer);
				// root is a cid
				const newTx = await get(root);

				let currentDag = {};
				try {
					currentDag = await this.get(this.rootCID);
				} catch (error) {
					// brand new dag, leave current empty
				}

				console.log(`merge: `, Object.assign(currentDag, newTx));

				try {
					// merge newTx into Dag
					this.rootCID = await this.put(Object.assign(currentDag, newTx), {
						pin: true,
						preload: false
					});
				} catch (error) {
					console.warn('issue putting ', Object.assign(currentDag, newTx));
				}

				console.log(`this.rootCID: ${this.rootCID} `);

				this.tx.pending = Transaction.create(); // once merged, refresh Tx
				return buffer; // now save this delta to update your database, cloud, Arweave, peers, wherever
			}
		};
	}

	async getLocal(cid, options = {}) {
		return (await this.get(cid, Object.assign(options, { preload: false }))).value; // cannot preload, no networking
	}

	async importBuffers(buffers: Uint8Array[]) {
		for (const buffer of buffers) {
			// TODO: assumes the last buffer imported holds the root CID, this may be a wrong assumption...
			this.rootCID = await this.importBuffer(buffer);
		}
	}

	async importBuffer(buffer: Uint8Array) {
		const it = await makeIterable([buffer]); // dag.import needs asyncIterable
		const [{ root }] = await all(this.import(it));
		return root.cid;
	}
}

export async function createDagRepo(options = {}): Promise<DagRepo> {
	/**
	 * @type {BlockCodec}
	 */
	const id = {
		name: identity.name,
		code: identity.code,
		encode: (id) => id,
		decode: (id) => id
	};
	/** @type {BlockCodec[]} */
	const blockCodecs = Object.values(codecs);
	[dagPB, dagCBOR, dagJSON, dagJOSE, id]
		.concat((options.ipld && options.ipld.codecs) || [])
		.forEach((codec) => blockCodecs.push(codec));

	const multicodecs = new Multicodecs({
		codecs: blockCodecs,
		loadCodec: options.ipld && options.ipld.loadCodec
	});

	const repoPath = options.path || 'ipfs';

	const repo = createRepo(console.log, multicodecs, {
		path: repoPath,
		autoMigrate: true
	});

	const initConfig = {}; // Datastore:{}

	try {
		await repo.init(initConfig);
		await repo.open();
	} catch (/** @type {any} */ err) {
		throw err;
	}

	const repoConfig = await repo.config.getAll();

	return new DagRepo({
		repo,
		codecs: multicodecs,
		options: { ...options, repoConfig }
	});
}
