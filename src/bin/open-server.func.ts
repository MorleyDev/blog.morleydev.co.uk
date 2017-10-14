import { createServer, IncomingMessage } from "http";
import { List, Map } from "immutable";
import { Observable, Observer } from "rxjs/Rx";

import { HttpResponse } from "./http-response.type";

export function openServer(port: number, handler: (message: Observable<IncomingMessage>) => Observable<HttpResponse>): Observable<{}> {
	return Observable.create((observer: Observer<IncomingMessage>) => {
		const server = createServer((request, response) => {
			const responseSub = handler(Observable.of(request))
			.defaultIfEmpty({ status: 404 })
			.first()
				.catch(err => {
					console.error(err);
					return Observable.of({
						status: 500,
						body: "",
						headers: Map<string, List<string>>()
					});
				})
				.subscribe(res => {
					response.statusCode = res.status;
					if (res.headers) {
						res.headers.forEach((values, key) => {
							response.setHeader(key, values.toArray());
						});
					}
					if (res.body) {
						response.write(res.body);
					}
					response.end();
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
