# IPLD CAR Transactions (txs)

Use IPLD Blocks to add to IPLD one transaction at a time.

## API

```js
import Transaction from 'car-transaction';

const run = async () => {
	// start a basic transaction
	const t = Transaction.create();

	const subCID = await t.add({ some: 'data' });
	await t.add({ sub: subCID });
	await t.add({ whoops: 'mistake' });
	t.undo(); // remove the last addition
	const buffer = await t.commit();

	// read a transaction
	// the last write is always the root
	const { root, get } = await Transaction.load(buffer);
	// root is a cid
	const { sub } = await get(root);
	const { some } = await get(sub);
	// get retrieves the block and decodes it
	if (some !== 'data') throw new Error('data error');
};

run();
```

## Credits

Inspired by [car-transaction](https://github.com/mikeal/car-transaction)
