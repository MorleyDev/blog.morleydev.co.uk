import { Map, List } from "immutable";

function queryString(search: string): Map<string, string[]> {
	const set = List(search.substr(1).split("&"))
		.map(s => s && List(s.split("=")))
		.map(value => value && [value.first(), value.skip(1).join("=")])
		.reduce(
			(obj: { [key: string]: string[] }, pair: [string, string]) => {
				return {
					[pair[0]]: (obj[pair[0]] || []).concat([pair[1]])
				};
			},
			{ } as { [key: string]: string[] }
		);
	return Map(set);
}

function getNodeEnv(): string {
	if (typeof window === "undefined") {
		return "production";
	}

	const query = queryString(window.location.search);
	return query.get("NODE_ENV", ["production"])[0] || "production";
}

export const env = {
	NODE_ENV: getNodeEnv()
};


