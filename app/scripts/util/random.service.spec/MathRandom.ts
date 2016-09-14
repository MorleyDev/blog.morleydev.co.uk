import { IRandom, MathRandom } from "../random.service.ts";
import test from "tape";

test("util/random.service: Random.MathRandom", r => {
	r.test("Given a math-based random number generator", t => {
		const generator: IRandom = new MathRandom();

		t.test("When generating 1000 floating numbers between 654.532 and 780.35", assert => {
			const valuesGenerated = new Array(1000).fill(0).map((_: number) => generator.nextFloat(654.532, 780.35));

			assert.true(valuesGenerated.some(x => !Number.isInteger(x)), "Then not all generated numbers are integers");
			assert.true(valuesGenerated.every(x => x >= 654.532), "Then no number smaller than 654.532 is generated");
			assert.true(valuesGenerated.every(x => x < 780.35), "Then no number larger or equal to 780.35 is generated");
			assert.end();
		});

		t.test("When generating 1000 floating numbers between -654.532 and 780.35", assert => {
			const valuesGenerated = new Array(1000).fill(0).map((_: number) => generator.nextFloat(-654.532, 780.35));

			assert.true(valuesGenerated.some(x => !Number.isInteger(x)), "Then not all generated numbers are integers");
			assert.true(valuesGenerated.every(x => x >= -654.532), "Then no number smaller than 654.532 is generated");
			assert.true(valuesGenerated.every(x => x < 780.35), "Then no number larger or equal to 780.35 is generated");
			assert.end();
		});
		t.test("When generating 1000 integral numbers between 654 and 5238", assert => {
			const valuesGenerated = new Array(1000).fill(0).map((_: number) => generator.nextInt(654, 5238));

			assert.equal(valuesGenerated.length, 1000, "Then 1000 numbers are generated");
			assert.true(valuesGenerated.every(x => Number.isInteger(x)), "Then all 1000 generated numbers are integers");
			assert.true(valuesGenerated.every(x => x >= 654), "Then no number smaller than the 654 is generated");
			assert.true(valuesGenerated.every(x => x < 5238),"Then no number larger or equal to the maximum is generated");
			assert.end();
		});

		t.test("When generating 1000 integral numbers between -654 and 5238", assert => {
			const valuesGenerated = new Array(1000).fill(0).map((_: number) => generator.nextInt(-654, 5238));

			assert.equal(valuesGenerated.length, 1000, "Then 1000 numbers are generated");
			assert.true(valuesGenerated.every(x => Number.isInteger(x)), "Then all 1000 generated numbers are integers");
			assert.true(valuesGenerated.every(x => x >= -654), "Then no number smaller than the -654 is generated");
			assert.true(valuesGenerated.every(x => x < 5238), "Then no number larger or equal to the maximum is generated");
			assert.end();
		});

		t.test("When generating 1000 integral numbers between 654.532 and 780.35", assert => {
			const valuesGenerated = new Array(1000).fill(0).map((_: number) => generator.nextInt(654.532, 780.35));

			assert.true(valuesGenerated.every(x => Number.isInteger(x)), "Then all generated numbers are integers");
			assert.true(valuesGenerated.every(x => x >= 655), "Then no number smaller than 655 is generated");
			assert.true(valuesGenerated.every(x => x < 781), "Then no number larger or equal to 781 is generated");
			assert.end();
		});

		t.test("When generating 1000 integral numbers between -654.532 and 780.35", assert => {
			const valuesGenerated = new Array(1000).fill(0).map((_: number) => generator.nextInt(-654.532, 780.35));

			assert.true(valuesGenerated.every(x => Number.isInteger(x)), "Then all generated numbers are integers");
			assert.true(valuesGenerated.every(x => x >= -654), "Then no number smaller than -654 is generated");
			assert.true(valuesGenerated.every(x => x < 781), "Then no number larger or equal to 781 is generated");
			assert.end();
		});
		t.end();
	});
	r.end();
});
