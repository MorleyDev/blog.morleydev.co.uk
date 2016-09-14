const supportsArgumentsClass = (() => Object.prototype.toString.call(arguments))() === "[object Arguments]";
const isArguments = supportsArgumentsClass
	? (object: any) => Object.prototype.toString.call(object) === "[object Arguments]"
	: (object: any) => object && typeof object === "object" && typeof object.length === "number" && Object.prototype.hasOwnProperty.call(object, "callee") && !Object.prototype.propertyIsEnumerable.call(object, "callee") ||	false;

function deepEqual(actual: any, expected: any, compare: (a: any, b: any) => boolean): boolean {
	if (actual === expected) {
		return true;
	}
	if (actual == null || expected == null) {
		return compare(actual, expected);
	}
	if (actual instanceof Date && expected instanceof Date) {
		return actual.getTime() === expected.getTime();
	}
	if (typeof actual !== "object" || typeof expected !== "object") {
		return compare(actual, expected);
	}
	return objEquiv(actual, expected, compare);
}

function objEquiv(a: any, b: any, compare: (a: any, b: any) => boolean) {
	if (a.prototype !== b.prototype) {
		return false;
	}

	if (isArguments(a)) {
		return isArguments(b)
			? deepEqual(Array.from(a), Array.from(b), compare)
			: false;
	}

	try {
		let ka = Object.keys(a);
		let kb = Object.keys(b);
		if (ka.length !== kb.length) {
			return false;
		}

		ka = ka.sort();
		kb = kb.sort();

		for (let i = ka.length - 1; i >= 0; i--) {
			if (ka[i] !== kb[i]) {
				return false;
			}
		}

		for (let i = ka.length - 1; i >= 0; i--) {
			let key = ka[i];
			if (!deepEqual(a[key], b[key], compare)) {
				return false;
			}
		}
		return typeof a === typeof b;
	} catch (e) {
		return false;
	}
}

export function deep(a: any, b: any) {
	return deepEqual(a, b, (x, y) => x === y);
}

export function deepLoose(a: any, b: any) {
	return deepEqual(a, b, (x, y) => x == y);
}
