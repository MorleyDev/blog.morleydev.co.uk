import { IUserSignIn } from "./models.ts";
import { Observable, Subscriber } from "rxjs";
import * as firebase from "firebase";

export interface IAuthentication {
	/*! Observes the current logged in user, changing states as a user signs in and out */
	observe(): Observable<IUserSignIn | null>;

	/*! Triggers a request for the user to authenticate via google OAuth */
	googleAuth(): Promise<void>;

	/*! Triggers a request for the currently signed in user to sign out */
	signOut(): Promise<void>;
}

export class FirebaseAuthentication implements IAuthentication {
	private auth: firebase.auth.Auth;

	constructor(auth: firebase.auth.Auth) {
		this.auth = auth;
	}

	public observe(): Observable<IUserSignIn | null> {
		return new Observable<IUserSignIn | null>((observer: Subscriber<IUserSignIn | null>) => {
			observer.next(this.firebaseUserToUserModel(this.auth.currentUser));

			return this.auth.onAuthStateChanged(
				(user: firebase.User | null) => observer.next(this.firebaseUserToUserModel(user))
			);
		}).cache(1);
	}

	public googleAuth(): Promise<void> {
		const provider = new firebase.auth.GoogleAuthProvider();

		return Promise.resolve(this.auth.signInWithPopup(provider));
	}

	public signOut(): Promise<void> {
		return Promise.resolve(this.auth.signOut());
	}

	private firebaseUserToUserModel(user: firebase.User | null): IUserSignIn | null {
		return user != null
			? {
				uid: user.uid,
				photoUrl: user.photoURL,
				displayName: user.displayName,
				email: user.email
			}
			: null;
	}
}
