import "core-js";

import * as Rx from "rxjs/Rx";

import { onBlogApiRequest } from "./blog/http-request-handler.func";
import { onFileRequest } from "./file-system/http-request-handler.func";
import { loginfo } from "./logger/logger";
import { openServer } from "./server/open-server.func";
import { SocketHttpRequestHandler } from "./sockets/server";

const port = 3000;

const handler: SocketHttpRequestHandler = (request) => Rx.Observable.concat(
	onBlogApiRequest(request),
	onFileRequest(request)
);

openServer(port, handler).subscribe(
	server => { },
	(err: Error) => console.error(err),
	() => loginfo("...server closed.")
);
