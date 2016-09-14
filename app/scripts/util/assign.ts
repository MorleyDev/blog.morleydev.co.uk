function _shallow(a: any, b: any): any {
	let output: any = { };
	Object.keys(a)
		.concat(Object.keys(b))
		.filter((key, index, array) => index === array.lastIndexOf(key))
		.forEach(key => output[key] = b[key] !== undefined ? b[key] : a[key]);
	return output;
}

export function shallow<T, U>(a: T, b: U): T & U {
	return _shallow(a, b);
}

function isObject(x: any): boolean {
	const name = Object.prototype.toString.call(x);
	if (name !== "[object Object]") {
		return false;
	}

	const prototype = Object.getPrototypeOf(x);
	return prototype === null || prototype === Object.getPrototypeOf({});
}

function _deep(a: any, b: any): any {
	const isAObject = isObject(a);
	const isBObject = isObject(b);
	if (!isAObject || !isBObject) {
		return b !== undefined ? b : a;
	}

	let output: any = { };
	Object.keys(a)
		.concat(Object.keys(b))
		.filter((key, index, array) => index === array.lastIndexOf(key))
		.forEach(key => output[key] = b[key] !== undefined ? _deep(a[key], b[key]) : a[key]);
	return output;
}

export function deep<T, U>(a: T, b: U): T & U {
	return _deep(a, b);
}
