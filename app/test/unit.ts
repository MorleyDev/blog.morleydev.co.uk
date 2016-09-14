import "../typings/index.d.ts";
import "../jspm.config.js";
import test from "tape";

import * as fs from "fs";
import { posix as path } from "path";
import { Observable, Subscriber } from "rxjs";

class FileSystem {
	public readdir(dir: string): Observable<string> {
		return new Observable<string>((subscriber: Subscriber<string>) => {
			fs.readdir(dir, (err, files) => {
				files.map(file => path.join(dir, file)).forEach(file => subscriber.next(file));
				subscriber.complete();
			});
		});
	}
}

function getFiles(dir: string): string[] {
	return  fs.readdirSync(dir).map(file => path.join(dir, file)).reduce(
		(prev, name) => (fs.statSync(name).isDirectory()) ? prev.concat(getFiles(name)) : prev.concat([name]),
		[] as string[]
	);
}

test("Unit tests", t => {
	getFiles("./app/scripts/")
		.map(element => path.normalize(element))
		.filter(element => element.includes(".spec.") || element.includes(".spec/"))
		.map(element => element.substr(4))
		.reduce((prev, element) => prev.then(() => System.import(element)).then(() => { /* no-op */ }, err => console.error(err)), Promise.resolve())
		.then(() => t.end());
});
