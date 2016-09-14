import { NetworkStatus } from "./models.ts";
import { Observable, Subscriber } from "rxjs";
import * as firebase from "firebase";

export interface INetworkService {
	connectionStatus(): Observable<NetworkStatus>;
}

export class FirebaseNetworkService implements INetworkService {
	private app: firebase.app.App;

	constructor(app: firebase.app.App) {
		this.app = app;
	}

	public connectionStatus(): Observable<NetworkStatus> {
		return new Observable<NetworkStatus>((subscriber: Subscriber<NetworkStatus>) => {
			const ref = this.app.database().ref(".info/connected");
			const handler = (snap: firebase.database.DataSnapshot) => {
				const value = snap.val() as boolean
						? NetworkStatus.Connected
						: NetworkStatus.Disconnected;

				subscriber.next(value);
			};
			ref.on("value", handler);
			return () => ref.off("value", handler);
		});
	}
}
