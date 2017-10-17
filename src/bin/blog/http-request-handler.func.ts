import { IncomingMessage } from "http";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Rx";

import { withAuthentication, withoutAuthentication } from "../authentication/http-request-handler.func";
import { HttpRequestHandler } from "../server/http-request-handler.type";
import { BadRequest, Created, Ok } from "../server/respondWith";
import { BlogPostDto } from "./blog.model";
import { Sqlite3BlogRepository } from "./sqlite3-blog-repository";

const database = new Sqlite3BlogRepository();

export const onBlogApiRequest: HttpRequestHandler =
	request$ => request$
		.filter(request => (request.url || "/").startsWith("/api/"))
		.mergeMap(() => Observable.concat(
			onBlogApiCreateRequestWithAuthentication(request$),
			onBlogApiCreateRequestWithoutAuthentication(request$),
			onBlogApiSearchRequest(request$),
			onBlogApiGetByIdRequest(request$)
		));

const onBlogApiSearchRequest: HttpRequestHandler =
	request$ => request$
		.filter(request => /^\/api\/blog\/?$/.test(request.url!) && request.method === "GET")
		.mergeMap(() => database.search().toArray())
		.map(data => ({ data }))
		.map(Ok);

const onBlogApiGetByIdRequest: HttpRequestHandler =
	request$ => request$
		.filter(request => /^\/api\/blog\/(.+)\/?$/.test(request.url!) && request.method === "GET")
		.map(request => request.url!.split("/").filter(t => t.length > 0)[2])
		.mergeMap(request => database.getById(request))
		.map(Ok);

const onBlogApiCreateRequest: (handler: HttpRequestHandler) => HttpRequestHandler =
	handler =>
		request$ =>
			handler(
				request$.filter(request => /^\/api\/blog\/?$/.test(request.url!) && request.method === "POST")
			);

const onBlogApiCreateRequestWithAuthentication: HttpRequestHandler = onBlogApiCreateRequest(withAuthentication(
	request$ => request$
		.mergeMap(request => readRequest(request).reduce((prev, chunk) => Buffer.concat([prev, chunk])))
		.map(request => request.toString())
		.map(request => JSON.parse(request) as Partial<BlogPostDto>)
		.mergeMap(request => {
			if (typeof request.id !== "string" || request.id.length === 0) {
				return Observable.of(BadRequest());
			}
			if (typeof request.title !== "string" || request.title.length === 0) {
				return Observable.of(BadRequest());
			}
			if (typeof request.markdown !== "string" || request.markdown.length === 0) {
				return Observable.of(BadRequest());
			}
			if (typeof request.posted !== "string") {
				return Observable.of(BadRequest());
			}
			if (typeof request.summary !== "string" || request.summary.length === 0) {
				return Observable.of(BadRequest());
			}
			if (!Array.isArray(request.tags) || request.tags.some((tag: string) => typeof tag !== "string" || tag.length === 0)) {
				return Observable.of(BadRequest());
			}
			const promise = database.create(request as BlogPostDto).then(() => Created(`/blog/${request.id}`));
			return Observable.fromPromise(promise);
		})
));

const onBlogApiCreateRequestWithoutAuthentication: HttpRequestHandler = onBlogApiCreateRequest(withoutAuthentication(
	request$ => request$
		.filter(request => /^\/api\/blog\/?$/.test(request.url!) && request.method === "POST")
		.map(() => ({ status: 401 }))
));

const readRequest = (request: IncomingMessage): Observable<Buffer> => {
	return Observable.create((observer: Observer<Buffer>) => {
		request
			.on("data", (chunk: Buffer) => observer.next(chunk))
			.on("end", () => observer.complete())
			.on("error", err => observer.error(err));
	});
};
