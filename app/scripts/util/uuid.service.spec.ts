import { UuidService } from "../util/uuid.service.ts";
import test from "tape";

test("util/uuid.service: UuidService", r => {
	const amountToGenerate = 1000;

	r.test(`Test ${amountToGenerate} generated uuids`, assert => {
		const service = new UuidService();
		const result = Array<number>(amountToGenerate).fill(0).map(x => service.generate());

		assert.true(result.every((uuid, i, set) => set.indexOf(uuid) === set.lastIndexOf(uuid)), "Then all unique");
		assert.end();
	});
	r.end();
});
