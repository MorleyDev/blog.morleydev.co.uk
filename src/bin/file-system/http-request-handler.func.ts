import { mergeMiddleware, timed$ } from "../server/utility";
import { stat } from "fs";
import { List, Map } from "immutable";
import { join } from "path";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Rx";

import { HttpRequestHandler } from "../server/http-request-handler.type";
import { mimeTypes } from "./mime-types";
import { render } from "./render";

const getMimeType = (filename: string): string[] => mimeTypes["." + (filename.split(".")[1] || "")] || [];

const fileRoot = join(__dirname, "../../../dist/www");

export const onFileRequest: HttpRequestHandler =
	request$ => request$
		.map(request => request.url || "/")
		.mergeMap(tryGetRequestFilePath)
		.mergeMap(targetFile => timed$("blog.morleydev.co.uk,query=render", render(targetFile)))
		.map(({ data, filename }) => ({
			status: 200,
			body: data,
			headers: Map({
				"Content-Type": List([...getMimeType(filename), "charset=UTF-8"]),
				"Content-Length": List([data.length.toString()])
			})
		}));

const tryGetRequestFilePath = (url: string): Observable<string> => timed$("blog.morleydev.co.uk,query=tryfindfile", Observable.create((observer: Observer<string>) => {
	const shallowFile = join(fileRoot, url);
	stat(shallowFile, (err, shallowStats) => {
		if (err) {
			observer.next(join(fileRoot, "index.html"));
			observer.complete();
		} else if (shallowStats.isFile()) {
			observer.next(shallowFile);
			observer.complete();
		} else if (shallowStats.isDirectory()) {
			const deepFile = join(shallowFile, "index.html");
			stat(join(shallowFile, "index.html"), (err, deepState) => {
				if (err) {
					observer.next(join(fileRoot, "index.html"));
					observer.complete();
				} else if (deepState.isFile()) {
					observer.next(deepFile);
					observer.complete();
				} else {
					observer.next(join(fileRoot, "index.html"));
					observer.complete();
				}
			});
		} else {
			observer.next(join(fileRoot, "index.html"));
			observer.complete();
		}
	});
}));
