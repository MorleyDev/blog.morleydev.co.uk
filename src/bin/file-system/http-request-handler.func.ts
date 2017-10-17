import { List, Map } from "immutable";
import { join } from "path";

import { HttpRequestHandler } from "../server/http-request-handler.type";
import { mimeTypes } from "./mime-types";
import { render } from "./render";

const getMimeType = (filename: string): string[] => mimeTypes["." + (filename.split(".")[1] || "")] || [];

const fileRoot = join(__dirname, "../../../dist/www");

export const onFileRequest: HttpRequestHandler = request$ => request$
	.map(request => join(fileRoot, request.url || "/"))
	.mergeMap(targetFile => {
		return render(targetFile)
			.concat(render(join(targetFile, "index.html")))
			.concat(render(join(fileRoot, "index.html")))
			.take(1)
			.map(({ data, filename }) => ({
				status: 200,
				body: data,
				headers: Map({ "Content-Type": List(getMimeType(filename)) })
			}));
	});
