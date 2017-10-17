import { Map } from "immutable";
import { Observable } from "rxjs/Observable";

export type HttpRequest = {
	url: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	body: Observable<Buffer>;
	headers: Map<string, Iterable<string>>;
};
