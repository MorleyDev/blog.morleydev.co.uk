import { declareWatcher } from "../declare.ts";
import { IUserSignIn, UserSignInRequestState } from "./models.ts";
import * as actions from "./actions.ts";

// todo: Unit Tests
export const initialiseAuthenticationWatcher = declareWatcher((state, context) =>
	context.authentication.observe()
		.distinctUntilChanged()
		.reduce(
		(prevUser, user) => {
			if (user == null) {
				if (prevUser != null) {
					state.update(actions.SIGNED_OUT, null);
				}
			} else if (user !== prevUser) {
				state.update<IUserSignIn>(actions.USER_SIGNED_IN, {
					displayName: user.displayName,
					email: user.email,
					photoUrl: user.photoUrl,
					uid: user.uid
				});
			}
			return user;
		},
		null as IUserSignIn | null
		).map(() => { return { action: "", data: null }; })
);

// todo: Unit Tests
export const onGoogleSignInRequested = declareWatcher(
	(state, context) => state.observe()
		.map(d => d.authentication.requestState === UserSignInRequestState.SignInGoogle)
		.distinctUntilChanged()
		.filter(d => d)
		.switchMap(() =>
			context.authentication.googleAuth().then(
				() => { return { action: actions.RESET_REQUEST_FLAG, data: null }; },
				err => { context.logging.warn(err); return { action: actions.RESET_REQUEST_FLAG, data: null }; }
			)
		)
);

// todo: Unit Tests
export const onSignOut = declareWatcher(
	(stateStore, context) => stateStore.observe()
		.map(d => d.authentication.requestState === UserSignInRequestState.SignOut)
		.distinctUntilChanged()
		.filter(d => d)
		.switchMap(() => context.authentication.signOut().then(
				() => { return { action: actions.RESET_REQUEST_FLAG, data: null }; },
				err => { context.logging.warn(err); return { action: actions.RESET_REQUEST_FLAG, data: null }; }
		))
);
