import { HttpRequestHandler } from "./http-request-handler.type";

export type ServerMiddleware = (handler: HttpRequestHandler) => HttpRequestHandler;
