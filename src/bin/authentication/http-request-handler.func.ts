import { IncomingMessage } from "http";
import { HttpRequestHandler } from "../server/http-request-handler.type";

const getHeaderValue = (request: IncomingMessage, key: string) => {
	const value = request.headers[key];
	if (value == null) {
		return "";
	}
	return Array.isArray(value)
		? value.join(":")
		: value;
};

const isAuthenticated = (request: IncomingMessage) => getHeaderValue(request, "Authorization") === "Basic YWRtaW46cGFzc3dvcmQ=";
const not = <T>(func: (input: T) => boolean): ((input: T) => boolean) => input => !func(input);

export const withAuthentication: (handler: HttpRequestHandler) => HttpRequestHandler =
	handler =>
		request$ =>
			request$
				.filter(isAuthenticated)
				.mergeMap(request => handler(request$));

export const withoutAuthentication: (handler: HttpRequestHandler) => HttpRequestHandler =
	handler =>
		request$ =>
			request$
				.filter(not(isAuthenticated))
				.mergeMap(request => handler(request$));
