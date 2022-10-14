// https://github.com/mikeal/car-transaction/blob/main/index.js

import * as CBW from '../../node_modules/@ipld/car/esm/lib/buffer-writer.js';
// import * as CBW from '@ipld/car/esm/lib/buffer-writer.js'; // not exported
// import * as CBW from './modules/buffer-writer.js'; // esbuild

import { CarReader } from '@ipld/car';
import { bytes as byteslib } from 'multiformats';
import { decode as digest } from 'multiformats/hashes/digest';
import * as dagcbor from '@ipld/dag-cbor';
import * as raw from 'multiformats/codecs/raw';
import { sha256 } from 'multiformats/hashes/sha2';
import * as Block from 'multiformats/block';
import mitt from 'mitt'; // a small emitter

const { isBinary } = byteslib;

export const encode = (value) => {
	if (isBinary(value)) {
		return Block.encode({ value, hasher: sha256, codec: raw });
	}
	return Block.encode({ value, hasher: sha256, codec: dagcbor });
};

const decode = ({ bytes, cid }) => {
	let hasher, codec;
	const { code } = cid;
	const hashcode = cid.multihash.code || digest(cid.multihash).code;

	if (hashcode === 0x12) {
		hasher = sha256;
	} else {
		throw new Error('Unsupported hash function: ' + hashcode);
	}

	if (code === 0x71) {
		codec = dagcbor;
	} else if (code === 0x55) {
		codec = raw;
	} else {
		throw new Error('Unsupported codec: ' + code);
	}

	return Block.create({ bytes, cid, codec, hasher });
};

export class Transaction {
	constructor() {
		Object.assign(this, mitt());
		this.blocks = [];
	}

	static create(): Transaction {
		return new this();
	}

	static async load(buffer) {
		const reader = await CarReader.fromBytes(buffer);
		const [root] = await reader.getRoots();
		const get = (cid) =>
			reader
				.get(cid)
				.then((block) => decode(block))
				.then(({ value }) => value);
		return { root, get };
	}

	async add(obj) {
		const block = await encode(obj);
		this.last = block;
		this.blocks.push(block);
		this.emit('size', this.size);
		return block.cid;
	}

	async get(block) {
		const { cid, bytes, value } = await decode(block);
		return { cid, bytes, value };
	}

	undo() {
		return this.blocks.pop();
	}

	async commit() {
		const cid = this.last.cid;
		let size = 0;
		let headerSize = CBW.headerLength({ roots: [cid] });
		size += headerSize;
		for (const block of this.blocks) {
			size += CBW.blockLength(block);
		}
		const buffer = new Uint8Array(size);
		const writer = await CBW.createWriter(buffer, { headerSize });
		writer.addRoot(cid);
		for (const block of this.blocks) {
			writer.write(block);
		}
		await writer.close();
		return writer.bytes;
	}

	get size() {
		if (!this?.last) return 0;
		const cid = this.last.cid;
		let size = 0;
		let headerSize = CBW.headerLength({ roots: [cid] });
		size += headerSize;
		for (const block of this.blocks) {
			size += CBW.blockLength(block);
		}
		return size;
	}
}
