import { logerr, loginfo } from "../logger/logger";
import { HttpRequest } from "./http-request.type";
import { HttpRequestHandler } from "./http-request-handler.type";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { List, Map } from "immutable";
import { Observable, ReplaySubject, Subscription, Subject } from "rxjs/Rx";
import { Observer } from "rxjs/Observer";

import { HttpResponse } from "./http-response.type";

export function openServer(port: number, handler: HttpRequestHandler): Observable<Server> {
	const requestResponse = new Subject<{ request: IncomingMessage, response: ServerResponse }>();
	const pipeline = requestResponse
		.mergeMap(({ request, response }) => {
			const toArrayIfNot = <T>(v: T | T[]): T[] => Array.isArray(v) ? v : [v];
			const headers = Map(Object.keys(request.headers)
				.map(key => ({ [key]: List(toArrayIfNot(request.headers[key])) }))
				.reduce((prev, curr) => ({ ...prev, ...curr }), {}));

			const method = (request.method || "GET").toUpperCase() as "GET" | "PUT" | "POST" | "DELETE";
			const url = request.url || "/";

			// Only connect to the body stream once but not until actually reading (so GET should not ever need to subscribe)
			const body = (Observable.create((observer: Observer<Buffer>) => {
				const onData = (chunk: Buffer | string) => observer.next(Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk));
				const onComplete = () => observer.complete();
				const onError = (err: Error) => observer.error(err);
				request
					.on("data", onData)
					.on("end", onComplete)
					.on("error", onError);
				return () => { };
			}) as Observable<Buffer>).publishReplay();
			const bodySub = body.connect();

			const breaker = new Subject<{}>();
			request.addListener("close", () => breaker.next({}));
			return handler({ body, method, url, headers })
				.defaultIfEmpty({ status: 404, body: JSON.stringify({ error: "NotFound", code: 404 }) })
				.take(1)
				.takeUntil(breaker)
				.catch(error => {
					logerr(`Unexpected error occured: ${error.message}`, { error, request_method: request.method, request_url: request.url });
					return Observable.of({
						status: 500,
						body: JSON.stringify({
							error: "InternalServerError",
							code: 500,
							message: error
						}),
						headers: Map<string, List<string>>()
					});
				})
				.do(res => {
					response.statusCode = res.status || 404;
					if (res.headers) {
						res.headers.forEach((values, key) => {
							response.setHeader(key, values.toArray());
						});
					}
					if (res.body) {
						response.write(res.body);
					}

					loginfo("Response", { response_statuscode: response.statusCode, request_method: request.method, request_url: request.url });
				})
				.finally(() => {
					response.end();
					bodySub.unsubscribe();
				});
		})
		.subscribe();

	return Observable.create((observer: Observer<Server>) => {
		const server = createServer((request, response) => {
			loginfo("Processing request", { request_url: request.url, request_method: request.method });

			requestResponse.next({ request, response });
		});

		server.listen(port, (error: Error) => {
			if (error) {
				logerr(`ERROR! ${error.message} Error launching server`, { error, port });
				return;
			}
			loginfo(`Server is listening...`, { port });
			return;
		});

		observer.next(server);
		return () => {
			pipeline.unsubscribe();
			server.close();
		};
	});
}
