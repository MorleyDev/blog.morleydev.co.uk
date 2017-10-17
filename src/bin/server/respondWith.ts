import { HttpResponse } from "./http-response.type";
import { List, Map } from "immutable";

export const Ok = <T>(data: T): HttpResponse => {
	const body = JSON.stringify(data);
	return {
		status: 200,
		body,
		headers: Map({
			"Content-Type": List(["application/json", "charset=UTF-8"]),
			"Content-Length": List([body.length.toString()])
		})
	};
};
export const Created = <T = {}>(href: string, data?: T): HttpResponse => {
	const body = data != null ? JSON.stringify(data) : undefined;
	const bodyHeaders = body != null ? { "Content-Type": List(["application/json", "charset=UTF-8"]), "Content-Length": List([body.length.toString()]) } : { };
	return {
		status: 201,
		body,
		headers: Map({
			...bodyHeaders,
			"Location": List([href])
		})
	};
};
export const NoContent = (): HttpResponse => ({ status: 204 });

export const BadRequest = (): HttpResponse => ({ status: 400 });
export const Unauthorised = (): HttpResponse => ({ status: 401 });
export const Forbidden = (): HttpResponse => ({ status: 403 });
export const NotFound = (): HttpResponse => ({ status: 404 });