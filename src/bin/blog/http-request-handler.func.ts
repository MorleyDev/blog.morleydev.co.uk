import { bodyToJson, mergeMiddleware } from "../server/utility";
import { HttpRequest } from "../server/http-request.type";
import { HttpResponse } from "../server/http-response.type";
import { IncomingMessage } from "http";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Rx";

import { withAuthentication } from "../authentication/http-request-handler.func";
import { HttpRequestHandler } from "../server/http-request-handler.type";
import { BadRequest, BadRequestReason, Created, NoContent, Ok, Unauthorised } from "../server/respondWith";
import { BlogPostDto } from "./blog.model";
import { Sqlite3BlogRepository } from "./sqlite3-blog-repository";

const database = new Sqlite3BlogRepository();

export const onBlogApiRequest: HttpRequestHandler =
	request$ => request$
		.filter(request => (request.url || "/").startsWith("/api/"))
		.mergeMap(() => Observable.concat(
			onBlogApiCreateRequestWithAuthentication(request$),
			onBlogApiUpdateRequestWithAuthentication(request$),
			onBlogApiSearchRequest(request$),
			onBlogApiGetByIdRequest(request$)
		));

const onBlogApiSearchRequest: HttpRequestHandler =
	request$ => request$
		.filter(request => /^\/api\/blog\/?$/.test(request.url) && request.method === "GET")
		.mergeMap(() => database.search().toArray())
		.map(data => ({ data }))
		.map(Ok);

const onBlogApiGetByIdRequest: HttpRequestHandler =
	request$ => request$
		.filter(request => /^\/api\/blog\/(.+)\/?$/.test(request.url) && request.method === "GET")
		.map(request => request.url!.split("/").filter(t => t.length > 0)[2])
		.mergeMap(request => database.getById(request))
		.map(Ok);

const onBlogApiCreateRequest: (handler: HttpRequestHandler) => HttpRequestHandler =
	handler =>
		request$ =>
			handler(request$.filter(request => /^\/api\/blog\/?$/.test(request.url) && request.method === "POST"));

const onBlogApiUpdateRequest: (handler: HttpRequestHandler) => HttpRequestHandler =
	handler =>
		request$ =>
			handler(request$.filter(request => /^\/api\/blog\/.+\/?$/.test(request.url) && request.method === "PUT"));


const validateBlogApiCreateRequest = (handler: HttpRequestHandler): HttpRequestHandler => request$ =>
	request$
		.mergeMap(request => bodyToJson<Partial<BlogPostDto>>(request))
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


const validateBlogApiUpdateRequest = (handler: HttpRequestHandler): HttpRequestHandler => request$ =>
	request$
		.mergeMap(request => bodyToJson<Partial<BlogPostDto>>(request))
		.map(request => {
			const canParseDate = (value: string): boolean => !isNaN(Date.parse(value));
			const resultSet: [string, boolean, string][] = [
				["id", request.id != null && (typeof request.id !== "string" || request.id.trim().length === 0), "id was empty"],
				["title", request.title != null && (typeof request.title !== "string" || request.title.trim().length === 0), "title was empty"],
				["markdown", request.markdown != null && (typeof request.markdown !== "string" || request.markdown.trim().length === 0), "markdown was empty"],
				["posted", request.posted != null && (typeof request.posted !== "string" || !canParseDate(request.posted)), "posted was empty or invalid"],
				["summary", request.summary != null && (typeof request.summary !== "string" || request.summary.trim().length === 0), "summary was empty"],
				["tags", request.tags != null && (!Array.isArray(request.tags) || request.tags.some((tag: string) => typeof tag !== "string" || tag.trim().length === 0)), "tags were empty or invalid"]
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

const onBlogApiUpdateRequestWithAuthentication: HttpRequestHandler =
	mergeMiddleware(onBlogApiUpdateRequest, withAuthentication, validateBlogApiUpdateRequest)(request$ =>
		request$
			.mergeMap(request => bodyToJson<Partial<BlogPostDto>>(request).map(dto => ({ dto, id: request.url.split("/").filter(x => x.trim().length > 0)[2] })))
			.mergeMap(request => database.getById(request.id).map(() => request))
			.mergeMap(({ dto, id }) =>
				(dto.id != null && dto.id !== id ? database.getById(dto.id).isEmpty() : Observable.of(true))
					.mergeMap(
					canUpdate => canUpdate
						? Observable.fromPromise(database.update(id, dto).then(NoContent))
						: Observable.of({ status: 409 })
					)
			)
	);

const onBlogApiCreateRequestWithAuthentication: HttpRequestHandler =
	mergeMiddleware(onBlogApiCreateRequest, withAuthentication, validateBlogApiCreateRequest)(request$ =>
		request$
			.mergeMap(request => bodyToJson<BlogPostDto>(request))
			.mergeMap(post => database.getById(post.id).isEmpty()
				.mergeMap(canCreate =>
					canCreate
						? Observable.fromPromise(database.create(post).then(() => Created(`/blog/${post.id}`)))
						: Observable.of({ status: 409 })
				)
			)
	);
