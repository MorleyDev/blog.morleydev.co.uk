import { deep, deepLoose } from "../util/equality.ts";
import test from "tape";

test("util/equality: deep", t => {
	t.test("equal", assert => {
		assert.true(deep({ a : [ 2, 3 ], b : [ 4 ] }, { a : [ 2, 3 ], b : [ 4 ] }), "json");
		assert.end();
	});
	t.test("not equal", assert => {
		assert.false(deep({ x : 5, y : [6] }, { x : 5, y : 6 }), "json");
		assert.end();
	});
	t.test("nested nulls", assert => {
		assert.true(deep([ null, null, null ], [ null, null, null ]), "array");
		assert.false(deep([ null, undefined, null ], [ null, null, null ]), "array");
		assert.end();
	});
	t.test("strict equal", assert => {
		assert.false(deep([ { a: 3 }, { b: 4 } ], [ { a: "3" }, { b: "4" } ]), "array of json");
		assert.end();
	});
	t.test("non-objects", assert => {
		assert.true(deep(3, 3), "3 == 3");
		assert.false(deep(4, 3), "4 == 3");
		assert.true(deep("beep", "beep"), "beep == beep");
		assert.false(deep("beep", "boop"), "beep == boop");

		assert.false(deep("3", 3), "'3' == 3");
		assert.false(deep("3", [3]), "'3' == [3]");
		assert.end();
	});
	t.test("arguments class", assert => {
		assert.true(deep(((...args: any[]) => arguments)(1, 2, 3), ((...args: any[]) => arguments)(1, 2, 3)), "arguments");
		assert.false(deep(((...args: any[]) => arguments)(1, 2, 3), [1, 2, 3]), "arguments");
		assert.end();
	});
	t.test("dates", assert => {
		assert.true(deep(new Date(1387585278000), new Date("Fri Dec 20 2013 16:21:18 GMT-0800 (PST)")), "date");
		assert.false(deep(new Date(1387785278000), new Date("Fri Dec 20 2013 16:21:18 GMT-0800 (PST)")), "date");
		assert.end();
	});
	t.test("booleans and arrays", assert => {
		assert.false(deep(true, []), "true == []");
		assert.end();
	});
	t.test("null and undefined", assert => {
		assert.true(deep(null, null), "null == null");
		assert.true(deep(undefined, undefined), "undefined == undefined");
		assert.false(deep(null, undefined), "null == undefined");
		assert.end();
	});
	t.end();
});

test("util/equality: deepLoose", t => {
	t.test("equal", assert => {
		assert.true(deepLoose({ a : [ 2, 3 ], b : [ 4 ] }, { a : [ 2, 3 ], b : [ 4 ] }), "json");
		assert.true(deepLoose({ x : 5, y : [6] }, { x : 5, y : 6 }), "json");
		assert.end();
	});
	t.test("not equal", assert => {
		assert.false(deepLoose({ x : [5, 6], y : [6] }, { x : 5, y : 6 }), "json");
		assert.false(deepLoose({ x : [5, 6], y : [6] }, { x : [5, 6] }), "json");
		assert.false(deepLoose({ x : [5, 6], y : [6] }, 25), "json == 25");
		assert.end();
	});
	t.test("nested nulls", assert => {
		assert.true(deepLoose([ null, null, null ], [ null, null, null ]), "nulls");
		assert.true(deepLoose([ null, undefined, null ], [ null, null, null ]), "undefineds and nulls");
		assert.end();
	});
	t.test("strict equal", assert => {
		assert.true(deepLoose([ { a: 3 }, { b: 4 } ], [ { a: "3" }, { b: "4" } ]), "array of json");
		assert.end();
	});
	t.test("non-objects", assert => {
		assert.true(deepLoose(3, 3), "3 === 3");
		assert.false(deepLoose(4, 3), "4 === 3");
		assert.true(deepLoose("beep", "beep"), "beep === beep");
		assert.false(deepLoose("beep", "boop"), "beep === boop");

		assert.true(deepLoose("3", 3), "'3' === 3");
		assert.true(deepLoose("3", [3]), "'3' === [3]");
		assert.end();
	});
	t.test("arguments class", assert => {
		assert.true(deepLoose(((...args: any[]) => arguments)(1, 2, 3), ((...args: any[]) => arguments)(1, 2, 3)), "arguments");
		assert.false(deepLoose(((...args: any[]) => arguments)(1, 2, 3), [1, 2, 3]), "arguments");
		assert.end();
	});
	t.test("dates", assert => {
		assert.true(deepLoose(new Date(1387585278000), new Date("Fri Dec 20 2013 16:21:18 GMT-0800 (PST)")), "date");
		assert.false(deepLoose(new Date(1387785278000), new Date("Fri Dec 20 2013 16:21:18 GMT-0800 (PST)")), "date");
		assert.end();
	});
	t.test("booleans and arrays", assert => {
		assert.false(deepLoose(true, []), "true === []");
		assert.end();
	});
	t.test("null and undefined", assert => {
		assert.true(deepLoose(null, null), "null === null");
		assert.true(deepLoose(undefined, undefined), "undefined === undefined");
		assert.true(deepLoose(null, undefined), "null === undefined");
		assert.end();
	});
	t.end();
});
