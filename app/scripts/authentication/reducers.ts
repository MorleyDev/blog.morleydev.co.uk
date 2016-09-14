import { declareReducer } from "../declare.ts";
import { UserSignInRequestState, IUserSignIn } from "./models.ts";
import * as actions from "./actions.ts";
import * as assign from "../util/assign.ts";

// todo: Unit Tests
export const onAuthenticationResetRequestFlag = declareReducer<any>(
	actions.RESET_REQUEST_FLAG,
	(prevState) => assign.deep(prevState, { authentication: { requestState: UserSignInRequestState.None } })
);

function declareAuthenticationRequest(action: string, flag: UserSignInRequestState) {
	return declareReducer<any>(action, (prevState) => assign.deep(prevState, { authentication: { requestState: flag } }));
}

// todo: Unit Tests
export const onAuthenticationRequest = {
	GoogleSignIn: declareAuthenticationRequest(actions.SIGN_IN_GOOGLE, UserSignInRequestState.SignInGoogle),
	SignOut: declareAuthenticationRequest(actions.SIGN_OUT, UserSignInRequestState.SignOut)
};

// todo: Unit Tests
export const onAuthenticationUserSignedIn = declareReducer<IUserSignIn>(
	actions.USER_SIGNED_IN,
	(prevState, user) => assign.deep(prevState, { authentication: { currentUser: user } })
);

// todo: Unit Tests
export const onAuthenticationRequestSignOutComplete = declareReducer<any>(
	actions.SIGNED_OUT,
	(prevState, user) => assign.deep(prevState, { authentication: { currentUser: null } })
);
