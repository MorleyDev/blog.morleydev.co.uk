import { mimeTypes } from "./server/mime-types";
import "core-js";

import { List, Map } from "immutable";
import { join } from "path";

import { HttpRequestHandler } from "./htp-request-handler.type";
import { openServer } from "./open-server.func";
import { render } from "./render";

const port = 3000;

const getMimeType = (filename: string): string[] => mimeTypes[filename.split(".")[1] || ""] || [];

const onFileRequest: HttpRequestHandler = request$ => request$
	.map(request => (join(__dirname, "../www", request.url || "/")))
	.mergeMap(targetFile => {
		return render(targetFile)
			.concat(render(join(targetFile, "index.html")))
			.concat(render(join(__dirname, "../www/index.html")))
			.take(1)
			.map(({ data, filename }) => ({
				status: 200,
				body: data,
				headers: Map({
					"Content-Type": List(getMimeType(filename))
				})
			}));
	});

const handler: HttpRequestHandler = request$ => onFileRequest(request$);

openServer(port, handler).subscribe(() => { });
