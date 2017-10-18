import "core-js";

import { Observable } from "rxjs/Rx";

import { onBlogApiRequest } from "./blog/http-request-handler.func";
import { onFileRequest } from "./file-system/http-request-handler.func";
import { openSocketServer, SocketRequestHandler } from "./sockets/server";

const port = 3000;

const handler: SocketRequestHandler = (request$, sockets$) => Observable.concat(
	onBlogApiRequest(request$),
	onFileRequest(request$)
);

openSocketServer(port, handler).subscribe(
	server => { },
	(err: Error) => console.error(err),
	() => console.log("...server closed.")
);
