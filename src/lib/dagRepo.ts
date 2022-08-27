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
	}

	async getLocal(cid, options) {
		return await this.get(cid, Object.assign(options, { preload: false })); // cannot preload, no networking
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

	console.log({ repo });
	const repoConfig = await repo.config.getAll();

	return new DagRepo({
		repo,
		codecs: multicodecs,
		options: { ...options, repoConfig }
	});
}
