import { readFile } from "fs";
import { basename } from "path";
import { Observable } from "rxjs/Rx";
import { Observer } from "rxjs/Observer";
import { loginfo } from "../logger/logger";

export function render(file_path: string): Observable<{ filename: string; data: string }> {
	return Observable.create((observer: Observer<{ filename: string; data: string }>) => {
		loginfo("Renderering file", { file_path });

		readFile(file_path, { "encoding": "utf8" }, (err, data) => {
			if (err == null) {
				observer.next({
					filename: basename(file_path),
					data: data
				});
			}
			observer.complete();
		});
	});
}
