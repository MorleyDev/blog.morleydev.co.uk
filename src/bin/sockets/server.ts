import { Server } from "http";
import { Observable, ReplaySubject } from "rxjs/Rx";

import { HttpRequest } from "../server/http-request.type";
import { HttpResponse } from "../server/http-response.type";
import { openServer } from "../server/open-server.func";
import { forServer, ObservableSocket } from "./forServer";

export type HttpEventingResponse = HttpResponse & {
	emit?: { [key: string]: any }
};

export type SocketHttpRequestHandler =
	(request: HttpRequest) => Observable<HttpEventingResponse>;

export const openSocketServer = (
	port: number,
	http: SocketHttpRequestHandler,
): Observable<{ server: Server; sockets: ObservableSocket }> => {
	const connection$ = new ReplaySubject<ObservableSocket>(1);
	return openServer(port, request => http(request)
		.mergeMap(response => {
			const toEmit = response.emit;
			return (toEmit != null)
				? connection$
					.do(connection => Object.keys(toEmit).forEach(key => connection.emit(key, toEmit[key])))
					.map(() => response)
				: Observable.of(response);
		}))
		.mergeMap(server => forServer(server)
			.do(c => connection$.next(c))
			.map(sockets => ({ server, sockets }))
		);
};
