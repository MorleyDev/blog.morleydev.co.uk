import { LocationState } from "history";

import { LoginState } from "./blog/authentication/action-state";
import { HomePageState } from "./blog/HomePage";

export type AppState = {
	readonly location?: LocationState;
	readonly home: HomePageState;
	readonly auth: LoginState;
};
