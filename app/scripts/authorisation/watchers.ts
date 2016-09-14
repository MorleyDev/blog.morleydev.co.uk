import { declareWatcher } from "../declare.ts";
import { AuthorisationRole } from "./models.ts";
import * as actions from "./actions.ts";
import { Observable } from "rxjs";

export const onUserAuthenticated = declareWatcher((store, context) => store.observe()
	.map(state => state.authentication.currentUser)
	.map(user => user != null ? user.uid : null)
	.distinctUntilChanged()
	.switchMap(userId => userId != null
		? context.database.query(`/admins/${userId}`)
			.observe<boolean>()
			.map(isAdmin => isAdmin ? AuthorisationRole.Admin : AuthorisationRole.User)
		: Observable.of(AuthorisationRole.None))
	.map(role => { return { action: actions.SET_AUTHORISATION_STATUS, data: role }; })
);
