import { Unauthorised } from "../server/respondWith";
import { Observable } from "rxjs/Rx";
import { HttpRequest } from "../server/http-request.type";
import { HttpRequestHandler } from "../server/http-request-handler.type";

const getHeaderValue = (request: HttpRequest, key: string) => {
	const value = request.headers.get(key);
	if (value == null) {
		return "";
	}
	return Array.from(value).join(";");
};

const isAuthenticated = (request: HttpRequest) => getHeaderValue(request, "authorization") === "Basic YWRtaW46cGFzc3dvcmQ=";
const not = <T>(func: (input: T) => boolean): ((input: T) => boolean) => input => !func(input);

export const withAuthentication: (handler: HttpRequestHandler) => HttpRequestHandler =
	handler =>
		request =>
			isAuthenticated(request)
				? handler(request)
				: Observable.of(Unauthorised());
