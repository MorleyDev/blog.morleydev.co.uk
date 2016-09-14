import { UserBar } from "./presentation.components.tsx";
import * as actions from "./actions.ts";
import { UserSignInRequestState } from "./models.ts";
import { IAuthenticationState } from "../authentication/models.ts";
import * as React from "react";

export function UserBarContainer(props: { auth: IAuthenticationState; emit: (action: { action: string; data: any; }) => void; }): JSX.Element {
	return <UserBar
		onClickGoogle={() => props.emit({ action: actions.SIGN_IN_GOOGLE, data: null })}
		onClickLogout={() => props.emit({ action: actions.SIGN_OUT, data: null })}
		user={props.auth.currentUser}
		isSigningIn={props.auth.requestState === UserSignInRequestState.SignInGoogle}
		isLoggingOut={props.auth.requestState === UserSignInRequestState.SignOut}
		/>;
}
