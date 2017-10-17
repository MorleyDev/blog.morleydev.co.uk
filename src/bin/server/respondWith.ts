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
	const body = data != null ? JSON.stringify(data) : JSON.stringify({ code: 201, reason: "Created", href });
	const bodyHeaders = body != null ? { "Content-Type": List(["application/json", "charset=UTF-8"]), "Content-Length": List([body.length.toString()]) } : {};
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

export interface BadRequestReason { [key: string]: string | BadRequestReason; }

export const BadRequest = (reason: BadRequestReason): HttpResponse => {
	const body = JSON.stringify({
		error: "BadRequest",
		code: 400,
		reason
	});
	return {
		status: 400,
		body,
		headers: Map({
			"Content-Type": List(["application/json", "charset=UTF-8"]),
			"Content-Length": List([body.length.toString()])
		})
	};
};
export const Unauthorised = (reason: string = "Authentication details not valid for requested resource"): HttpResponse => ({
	status: 401,
	body: JSON.stringify({
		error: "Unauthorised",
		code: 401,
		reason
	})
});

export const Forbidden = (reason: string =  "Requested resource was forbidden"): HttpResponse => ({
	status: 403,
	body: JSON.stringify({
		error: "Forbidden",
		code: 403,
		reason
	})
});

export const NotFound = (reason: string = "Requested resource was not found"): HttpResponse => ({
	status: 404,
	body: JSON.stringify({
		error: "NotFound",
		code: 404,
		reason
	})
});

export const Conflict = (reason: string = "Requested resource action was in conflict with current resource"): HttpResponse => ({
	status: 409,
	body: JSON.stringify({
		error: "Conflict",
		code: 409,
		reason
	})
});
