// import { createRepo } from 'ipfs-core-config/src/repo.browser.js'; // breaks on build, mortice issue
import { createRepo } from './modules/repo.browser.js'; // esbuilt in package.json
import { DagAPI } from './modules/DagAPI/index.js'; // esbuilt, because self not defined in base64-js

// import { PinAPI } from 'ipfs-core/src/components/pin/index';
// import { BlockAPI } from 'ipfs-core/src/components/block/index';
import * as dagcbor from '@ipld/dag-cbor';
import * as raw from 'multiformats/codecs/raw';
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
import mitt from 'mitt'; // a small emitter
import { CID } from 'multiformats';

import { Transaction } from './transaction';

// import { createPreloader } from 'ipfs-core/src/preload';
// import { Storage } from 'ipfs-core/src/components/storage';

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

/**
 * Add ipfs.dag functionality to ipfs-repo
 */
export type DagRepo = DagAPI & {
	repo: IPFSRepo;
	// block: BlockAPI;
	// pin: PinAPI;
	tx: {
		pending: Transaction;
		add: Function;
		commit: Function;
	};
};

export class DagRepo extends DagAPI {
	constructor({ repo, codecs, options }) {
		/** @type {MultihashHasher[]} */
		const multihashHashers = Object.values(hashes);

		(options.ipld && options.ipld.hashers ? options.ipld.hashers : []).forEach((hasher) =>
			multihashHashers.push(hasher)
		);

		const hashers = new Multihashes({
			hashers: multihashHashers,
			loadHasher: options.ipld && options.ipld.loadHasher
		});

		super({
			repo,
			codecs,
			hashers,
			preload: (cid) => {
				return;
			}
		}); // DagAPI

		Object.assign(this, mitt()); // make this an emitter

		// this.pin = new PinAPI({ repo, codecs });
		// this.block = new BlockAPI({
		// 	repo,
		// 	codecs,
		// 	hashers,
		// 	preload: (cid) => {
		// 		return;
		// 	}
		// });

		this.repo = repo;

		this.rootCID;

		this.tx = {
			// TODO: Check for existing open transactions that havent been commited?
			pending: Transaction.create(),
			/**
			 * When a Transaction is added, the dag should check the dag to see if the tag already exists,
			 * and link the prev value to build an iterable chain of versions.
			 */
			getExistingTx: async () => {
				let existingTx = {};
				try {
					let last = this.tx.pending.last;
					if (!last) return;
					let lastBlock = await this.tx.pending.get(last);
					existingTx = lastBlock.value;
				} catch (error) {
					// console.log(`No existingTx`, error);
				}
				return existingTx;
			},
			add: async (tag: string, tagNode: object): Promise<CID> => {
				if (!tagNode) return;
				// cleanse input object of undefined values, IPLD doesnt like undefined properies
				tagNode = Object.fromEntries(
					Object.entries(tagNode).map(([k, v]) => (v === undefined ? [k, null] : [k, v]))
				);

				// check to see if the tag already exists
				let prev: CID | false = false;

				/**
				 * First, check to see if there is a previous value in the existing Tx
				 */
				let existingTx = await this.tx.getExistingTx();
				if (existingTx && existingTx[tag]) {
					// if so, track current tx cid as previous
					prev = !!existingTx[tag] ? existingTx[tag] : false;
				} else if (this.rootCID) {
					/**
					 * Otherwise, list previous transaction from the DAG, if exists
					 */
					try {
						let rootObj = (await this.get(this.rootCID)).value;
						prev = !!rootObj[tag] ? rootObj[tag] : false;
					} catch (msg) {
						// console.log(`no prev dag ${tag}`, msg);
					}
				}
				/**
				 * [tag] overwrites existingTx[tag], but that's ok since we stored any previous data in prev
				 */
				let tagNodeCid = await this.tx.pending.add(tagNode);
				let newBlock = Object.assign({}, existingTx, { [tag]: { obj: tagNodeCid, prev } }); //item, node, root, cid?
				let txCid = await this.tx.pending.add(newBlock);
				this.emit('added', txCid);
				return txCid;
			},
			/**
			 * Once the Tx is committed, it's dag imported which merges the blocks into the existing DAG
			 * Tx CID and prev Root CID is updated to new Root CID
			 * and a new Transaction needs to be created
			 */
			commit: async () => {
				// get existing Tx to be commited
				let existingTx = await this.tx.getExistingTx();

				// get current dag
				let currentDag = {};
				try {
					if (this.rootCID) currentDag = (await this.get(this.rootCID)).value;
				} catch (error) {
					// brand new dag, leave current empty
					console.log({ error });
				}

				// merge existing and current Tag Nodes to make new root CID
				// Only Tag Nodes, so filter existingTx by if it has own properties obj and prev
				let merged = Object.assign(
					{},
					currentDag,
					Object.fromEntries(
						Object.entries(existingTx).filter(([k, v]) => v.obj && v.hasOwnProperty('prev'))
					)
				);

				// add and commit merged
				this.rootCID = await this.tx.pending.add(merged);
				const buffer = await this.tx.pending.commit();

				// load commited blocks in the local dag
				await this.importBuffer(buffer);

				this.tx.pending = Transaction.create(); // once merged, refresh Tx
				return buffer; // now save this delta to update your database, cloud, Arweave, peers, wherever
			}
		};
	}

	async importBuffers(buffers: Uint8Array[]) {
		let root;
		for (const buffer of buffers) {
			// TODO: assumes the last buffer imported holds the root CID, this may be a wrong assumption...
			root = await this.importBuffer(buffer);
		}
		return root;
	}

	async importBuffer(buffer: Uint8Array) {
		return importBuffer(this, buffer);
	}
}

export async function importBuffer(dag: DagAPI, buffer: Uint8Array) {
	const it = await makeIterable([buffer]); // dag.import needs asyncIterable
	const [{ root }] = await all(dag.import(it));
	return root.cid;
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
