import { createServer, IncomingMessage } from "http";
import { List, Map } from "immutable";
import { Observable } from "rxjs/Rx";
import { Observer }  from "rxjs/Observer";

import { HttpResponse } from "./http-response.type";

export function openServer(port: number, handler: (message: Observable<IncomingMessage>) => Observable<HttpResponse>): Observable<{}> {
	return Observable.create((observer: Observer<IncomingMessage>) => {
		const server = createServer((request, response) => {
			console.log("Processing request", request.url, request.method);

			const responseSub = handler(Observable.of(request))
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
