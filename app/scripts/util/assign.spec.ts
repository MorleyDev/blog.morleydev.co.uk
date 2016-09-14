import * as assign from "./assign.ts";
import { test } from "tape";

test("util/assign.shallow", t => {
	const a = { a: 10, b: 20, c: { a: 10, b: 20, d: { a: 50 } }, e: 20 };
	const b =  { a: 20, c: { c: 20, d: { b: 20 } }, d: 30, e: null };
	const result = assign.shallow(a, b);

	t.deepEqual(result, { a: 20, b: 20, c: { c: 20, d: { b: 20 } }, d: 30, e: null });
	t.end();
});

test("util/assign.deep", t => {
	const a = { a: 10, b: 20, c: { a: 10, b: 20, d: { a: 50, c: 10 } }, e: 20 };
	const b =  { a: 20, c: { b: 30, c: 20, d: { b: 20, c: 20 } }, d: 30, e: null };
	const result = assign.deep(a, b);

	t.deepEqual(result, { a: 20, b: 20, c: { a: 10, b: 30, c: 20, d: { a: 50, b: 20, c: 20 } }, d: 30, e: null });
	t.end();
});
