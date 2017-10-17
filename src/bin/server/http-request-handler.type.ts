import { IncomingMessage } from "http";
import { Observable } from "rxjs/Rx";

import { HttpResponse } from "./http-response.type";

export type HttpRequestHandler = (request: Observable<IncomingMessage>) => Observable<HttpResponse>;
