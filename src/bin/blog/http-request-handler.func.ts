import { HttpRequest } from "../server/http-request.type";
import { HttpResponse } from "../server/http-response.type";
import { IncomingMessage } from "http";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Rx";

import { withAuthentication, withoutAuthentication } from "../authentication/http-request-handler.func";
import { HttpRequestHandler } from "../server/http-request-handler.type";
import { BadRequest, BadRequestReason, Created, Ok, Unauthorised } from "../server/respondWith";
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


const validateBlogApiRequest = (handler: HttpRequestHandler): HttpRequestHandler => request$ =>
	request$
		.mergeMap(request => request.body.reduce((prev, chunk) => Buffer.concat([prev, chunk])))
		.map(request => JSON.parse(request.toString()))
		.map(request => {
			const canParseDate = (value: string): boolean => !isNaN(Date.parse(value));
			const resultSet: [string, boolean, string][] = [
				["id", typeof request.id !== "string" || request.id.trim().length === 0, "id was empty"],
				["title", typeof request.title !== "string" || request.title.trim().length === 0, "title was empty"],
				["markdown", typeof request.markdown !== "string" || request.markdown.trim().length === 0, "markdown was empty"],
				["posted", typeof request.posted !== "string" || !canParseDate(request.posted), "posted was empty or invalid"],
				["summary", typeof request.summary !== "string" || request.summary.trim().length === 0, "summary was empty"],
				["tags", !Array.isArray(request.tags) || request.tags.some((tag: string) => typeof tag !== "string" || tag.trim().length === 0), "tags were empty or invalid"]
			];
			return resultSet;
		})
		.mergeMap(resultSet => !resultSet.some(([_, invalid, __]) => invalid)
			? handler(request$)
			: Observable.of(
				BadRequest(
					resultSet
						.filter(([_, invalid, __]) => invalid)
						.reduce((state, curr) => ({ ...state, [curr[0]]: curr[2] }), {})
				)
			));

const mergeMiddleware = (...handlers: ((handler: HttpRequestHandler) => HttpRequestHandler)[]) =>
	handlers.reduceRight((handler, curr) => request$ => handler(curr(request$)), (handler: HttpRequestHandler) => handler);

const onBlogApiCreateRequestWithAuthentication: HttpRequestHandler =
	mergeMiddleware(onBlogApiCreateRequest, withAuthentication, validateBlogApiRequest)(request$ =>
		request$.mergeMap(request => request.body.reduce((prev, chunk) => Buffer.concat([prev, chunk])))
			.map(request => request.toString())
			.map(request => JSON.parse(request) as BlogPostDto)
			.mergeMap(request => database.create(request).then(() => Created(`/blog/${request.id}`)))
	);

const onBlogApiCreateRequestWithoutAuthentication: HttpRequestHandler =
	mergeMiddleware(onBlogApiCreateRequest, withoutAuthentication)(request$ =>
		request$
			.filter(request => /^\/api\/blog\/?$/.test(request.url!) && request.method === "POST")
			.map(Unauthorised)
	);
