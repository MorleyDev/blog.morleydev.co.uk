import { readFile } from "fs";
import { basename } from "path";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

export function render(filePath: string): Observable<{ filename: string; data: string }> {
	return Observable.create((observer: Observer<{ filename: string; data: string }>) => {
		console.log("render", filePath);

		readFile(filePath, { "encoding": "utf8" }, (err, data) => {
			if (err == null) {
				observer.next({
					filename: basename(filePath),
					data: data
				});
			}
			observer.complete();
		});
	});
}
