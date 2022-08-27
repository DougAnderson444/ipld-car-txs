export async function* makeIterable(array) {
	let nextIndex = 0;
	while (nextIndex < array.length) {
		yield array[nextIndex++];
	}
}

// export async function makeIterable(array) {
// 	let nextIndex = 0;
// 	return {
// 		next() {
// 			return nextIndex < array.length
// 				? {
// 						value: array[nextIndex++],
// 						done: false
// 				  }
// 				: {
// 						done: true
// 				  };
// 		},
// 		[Symbol.asyncIterator]() {
// 			return this;
// 		}
// 	};
// }

// export class MakeIterable {
// 	#data;

// 	constructor(data) {
// 		this.#data = data;
// 	}

// 	[Symbol.iterator]() {
// 		// Use a new index for each iterator. This makes multiple
// 		// iterations over the iterable safe for non-trivial cases,
// 		// such as use of break or nested looping over the same iterable.
// 		let index = 0;

// 		return {
// 			// Note: using an arrow function allows `this` to point to the
// 			// one of `[@@iterator]()` instead of `next()`
// 			next: () => {
// 				if (index < this.#data.length) {
// 					return { value: this.#data[index++], done: false };
// 				} else {
// 					return { done: true };
// 				}
// 			}
// 		};
// 	}
// }
