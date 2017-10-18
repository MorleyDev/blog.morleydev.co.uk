import { List } from "immutable";

import { AppState } from "./app-state.model";

export const initialState: Partial<AppState> = {
	home: {
		summaries: {
			data: List(),
			loading: false
		}
	},
	auth: {
		authenticationToken: "",
		currentState: "unauthenticated",
		failureReason: "",
		showDialog: false
	}
};
