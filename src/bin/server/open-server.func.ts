import { HttpRequest } from "./http-request.type";
import { HttpRequestHandler } from "./http-request-handler.type";
import { createServer, IncomingMessage } from "http";
import { List, Map } from "immutable";
import { Observable } from "rxjs/Rx";
import { Observer } from "rxjs/Observer";

import { HttpResponse } from "./http-response.type";
import { Subscription } from "rxjs/Subscription";

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

			// Only connect to the body stream once but not until actually reading (so GET should not ever need to subscribe)
			const bodyInner = (Observable.create((observer: Observer<Buffer>) => {
				const onData = (chunk: Buffer | string) => observer.next(Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk));
				const onComplete = () => observer.complete();
				const onError = (err: Error) => observer.error(err);
				request
					.on("data", onData)
					.on("end", onComplete)
					.on("error", onError);
				return () => { };
			}) as Observable<Buffer>).publishReplay();

			let subscription: Subscription | null = null;
			const body: Observable<Buffer> = Observable.create((observer: Observer<Buffer>) => {
				const bodySubscription = bodyInner.subscribe(observer);
				if (subscription == null) {
					subscription = bodyInner.connect();
				}
				return () => bodySubscription.unsubscribe();
			});
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
				.finally(() => subscription && subscription.unsubscribe())
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
