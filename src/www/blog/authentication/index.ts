import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";

import { AppAction } from "../../app-action.model";
import { AppState } from "../../app-state.model";
import { CompletedLogoutAction, HideLoginDialogAction, LoginFailureAction, LoginSuccessAction, RequestLoginAction, RequestLogoutAction, ShowLoginDialogAction } from "./action-state";

export const loginReducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case RequestLoginAction:
			return {
				...state,
				auth: {
					...state.auth,
					authenticationToken: "",
					currentState: "signing-in",
					failureReason: ""
				}
			};
		case LoginFailureAction:
			return {
				...state,
				auth: {
					...state.auth,
					authenticationToken: "",
					currentState: "unauthenticated",
					failureReason: action.reason
				}
			};

		case LoginSuccessAction:
			return {
				...state,
				auth: {
					...state.auth,
					authenticationToken: action.token,
					currentState: "signed-in",
					failureReason: "",
					showDialog: false
				}
			};

		case ShowLoginDialogAction:
			return {
				...state,
				auth: {
					...state.auth,
					showDialog: true
				}
			};

		case HideLoginDialogAction:
			return {
				...state,
				auth: {
					...state.auth,
					showDialog: false
				}
			};

		case RequestLogoutAction:
			return {
				...state,
				auth: {
					...state.auth,
					authenticationToken: "",
					currentState: "signing-out"
				}
			};
		case CompletedLogoutAction:
			return {
				...state,
				auth: {
					...state.auth,
					currentState: "signed-out"
				}
			};

		default:
			return state;
	}
};

export const loginEpic = (actions$: Observable<AppAction>): Observable<AppAction> => merge(
	actions$
		.filter(action => action.type === RequestLoginAction)
		.map((action: RequestLoginAction) => action.details.username === "admin" && action.details.password === "password")
		.delay(1000)
		.map(wasSuccess => wasSuccess ? ({ type: LoginSuccessAction, token: "YWRtaW46cGFzc3dvcmQ=" }) as AppAction : ({ type: LoginFailureAction, reason: "Invalid username or password" }) as AppAction),

	actions$
		.filter(action => action.type === RequestLogoutAction)
		.delay(750)
		.map(() => ({ type: CompletedLogoutAction } as AppAction))
);
