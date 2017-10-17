import { empty } from "rxjs/observable/empty";
import { HttpRequest } from "./http-request.type";
import { HttpRequestHandler } from "./http-request-handler.type";
import { Observable } from "rxjs";

export const mergeMiddleware = (...handlers: ((handler: HttpRequestHandler) => HttpRequestHandler)[]) =>
	handlers.reduce((handler, curr) => request$ => handler(curr(request$)), (handler: HttpRequestHandler) => handler);

export const bodyToJson = <T>(request: HttpRequest): Observable<T> =>
	request.body
		.reduce((prev, chunk) => Buffer.concat([prev, chunk]))
		.map(request => request.toString())
		.map(body => JSON.parse(body) as T)
		.catch(err => empty<T>());
