import "core-js";

import { Observable } from "rxjs/Rx";

import { onBlogApiRequest } from "./blog/http-request-handler.func";
import { onFileRequest } from "./file-system/http-request-handler.func";
import { HttpRequestHandler } from "./server/http-request-handler.type";
import { openServer } from "./server/open-server.func";

const port = 3000;

const handler: HttpRequestHandler = request$ => Observable.concat(
	onBlogApiRequest(request$),
	onFileRequest(request$)
);

openServer(port, handler).subscribe(
	() => { },
	(err: Error) => console.error(err),
	() => console.log("...server closed.")
);
