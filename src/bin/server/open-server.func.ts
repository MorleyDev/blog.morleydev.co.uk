import { HttpRequest } from "./http-request.type";
import { HttpRequestHandler } from "./http-request-handler.type";
import { createServer, IncomingMessage } from "http";
import { List, Map } from "immutable";
import { Observable } from "rxjs/Rx";
import { Observer }  from "rxjs/Observer";

import { HttpResponse } from "./http-response.type";

export function openServer(port: number, handler: HttpRequestHandler): Observable<{}> {
	return Observable.create((observer: Observer<HttpRequest>) => {
		const server = createServer((request, response) => {
			console.log("Processing request", request.url, request.method);
			const toArrayIfNot = <T>(v: T | T[]): T[] => Array.isArray(v) ? v : [v];
			const headers = Map(Object.keys(request.headers)
				.map(key => ({ [key]: List(toArrayIfNot(request.headers[key])) }))
				.reduce((prev, curr) => ({ ...prev, ...curr }), {}));

			const method = (request.method || "GET").toUpperCase() as "GET" | "PUT" | "POST" | "DELETE";
			const url = request.url || "/";
			const body = (Observable.create((observer: Observer<Buffer>) => {
				request
					.on("data", chunk => observer.next(Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk)))
					.on("end", () => observer.complete())
					.on("error", err => observer.error(err));
			}) as Observable<Buffer>).publishReplay();
			const sub = body.connect();
			const responseSub = handler(Observable.of({ body, method, url, headers }))
				.defaultIfEmpty({ status: 404, body: JSON.stringify({ error: "NotFound", code: 404 }) })
				.take(1)
				.catch(err => {
					console.error(err);
					return Observable.of({
						status: 500,
						body: JSON.stringify({
							error: "InternalServerError",
							code: 500,
							message: err
						}),
						headers: Map<string, List<string>>()
					});
				})
				.finally(() => sub.unsubscribe())
				.subscribe(res => {
					response.statusCode = res.status || 404;
					if (res.headers) {
						res.headers.forEach((values, key) => {
							response.setHeader(key, values.toArray());
						});
					}
					if (res.body) {
						response.write(res.body);
					}
					response.end();

					console.log("Response ", response.statusCode);
				});
			request.addListener("close", () => responseSub.unsubscribe());
		});

		server.listen(port, (err: Error) => {
			if (err) {
				return console.error(`ERROR! Error launching server on port ${port}`, err);
			}
			return console.log(`Server is listening on ${port}...`);
		});
		return () => {
			server.close();
		};
	});
}
