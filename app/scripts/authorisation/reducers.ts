import { declareReducer } from "../declare.ts";
import { AuthorisationRole } from "./models.ts";
import * as actions from "./actions.ts";
import * as assign from "../util/assign.ts";

export const onSetAuthorisationRole = declareReducer<AuthorisationRole>(
	actions.SET_AUTHORISATION_STATUS,
	(state, role) => assign.deep(state, { authorisation: { role: role } })
);
