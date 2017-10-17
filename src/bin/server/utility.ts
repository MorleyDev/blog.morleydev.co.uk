import { ServerMiddleware } from "./middleware";
import { Observable } from "rxjs/Rx";
import { empty } from "rxjs/observable/empty";
import { HttpRequest } from "./http-request.type";
import { HttpRequestHandler } from "./http-request-handler.type";

export const mergeMiddleware = (...handlers: ServerMiddleware[]) =>
	handlers.reduce(
		(handler, curr) =>
			request$ =>
				handler(curr(request$)),
		(handler: HttpRequestHandler) => handler
	);

export const bodyToJson = <T>(request: HttpRequest): Observable<T> =>
	request.body
		.reduce((prev, chunk) => Buffer.concat([prev, chunk]))
		.map(request => request.toString())
		.map(body => JSON.parse(body) as T)
		.catch(err => empty<T>());

export const timed = (metric: string): ServerMiddleware =>
	(handler: HttpRequestHandler): HttpRequestHandler =>
		request$ => timed$(metric, handler(request$));

export const timed$ = <T>(metric: string, observable: Observable<T>): Observable<T> => {
	return observable
		.mergeMap(request =>
			Observable.using(
				() => {
					const startTime = Date.now();
					return {
						unsubscribe() {
							const runTime = Date.now() - startTime;
							console.log("TIMED", metric, `${runTime}ms`);
						}
					};
				},
				timer => observable
			)
		);
};
