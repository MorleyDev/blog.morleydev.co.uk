import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import * as socketIO from "socket.io-client";

type ObservableSocket = {
	on$: <T>(key: string) => Observable<T>;
	emit: <T>(key: string, value: T) => void;
};

const io = socketIO();

export const forClient: ObservableSocket = {
	on$: <T>(key: string) => {
		return Observable.create((observer: Observer<T>) => {
			const onMessage = (value: T) => observer.next(value);
			io.on(key, onMessage);
			return () => {
				io.off(key, onMessage);
			};
		});
	},
	emit: <T>(key: string, value: T): void => { io.emit(key, value); }
};
