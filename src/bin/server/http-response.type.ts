import { List, Map } from "immutable";
import { Stream } from "stream";

export type HttpResponse = {
	status?: number;
	headers?: Map<string, List<string>>;
	body?: string | Buffer | Stream;
};
