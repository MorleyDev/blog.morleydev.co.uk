import { List, Map } from "immutable";

export type HttpResponse = {
	status: number;
	headers?: Map<string, List<string>>;
	body?: string;
};
