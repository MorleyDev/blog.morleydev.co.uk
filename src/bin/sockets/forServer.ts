import { Server } from "http";
import { Observable, Observer, Subject } from "rxjs/Rx";
import * as socketIO from "socket.io";

const __socketIO__type__helper = (false ? undefined : socketIO())!;
export type SocketIO = typeof __socketIO__type__helper;

const __socketIO_connection__type__helper = (false ? undefined : __socketIO__type__helper.sockets.sockets[0]);
export type SocketIOConnection = typeof __socketIO_connection__type__helper;

export type ObservableSocketConnections = {
	socket: SocketIOConnection;
	disconnect$: Observable<{}>;
	message$: <T>(key: string) => Observable<T>;
	emit: <T>(key: string, value: T) => void;
};

export type ObservableSocket = {
	socket: SocketIO;
	connections$: Observable<ObservableSocketConnections>;
	emit: <T>(key: string, value: T) => void;
};

export const forServer = (server: Server): Observable<ObservableSocket> => {
	return Observable.create((observer: Observer<ObservableSocket>) => {
		const io = socketIO(server);
		const observableSocketConnections = new Subject<ObservableSocketConnections>();
		io.sockets.on("connection", socket => {
			const messages: { [key: string]: Subject<any> | undefined } = {};
			const disconnect$ = new Subject<{}>();
			socket.on("disconnect", () => {
				Object.keys(messages).forEach(key => messages[key]!.unsubscribe());
				disconnect$.next({});
				disconnect$.complete();
			});
			observableSocketConnections.next({
				socket,
				emit: <T>(key: string, value: T) => { socket.emit(key, value); },
				disconnect$,
				message$: <T>(key: string) => {
					if (!messages[key]) {
						messages[key] = new Subject<any>();
						socket.on(key, (value: any) => messages[key]!.next(value));
					}
					return messages[key]!;
				}
			});
		});
		observer.next({
			socket: io,
			connections$: observableSocketConnections,
			emit: <T>(key: string, value: T): void => { io.emit(key, value); }
		});
		return () => {
			io.close();
		};
	});
};
