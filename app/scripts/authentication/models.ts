export interface IUserSignIn {
	displayName: string;
	email: string;
	photoUrl: string;
	uid: string;
}

export enum UserSignInRequestState {
	None,
	SignInGoogle,
	SignOut
}

export interface IAuthenticationState {
	requestState: UserSignInRequestState;
	currentUser: IUserSignIn | null;
}

export function create(): IAuthenticationState {
	return {
		requestState: UserSignInRequestState.None,
		currentUser: null
	};
}
