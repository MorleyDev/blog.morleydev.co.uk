import { Observable } from "rxjs/Rx";

import { HttpRequest } from "./http-request.type";
import { HttpResponse } from "./http-response.type";

export type HttpRequestHandler = (request: Observable<HttpRequest>) => Observable<HttpResponse>;
