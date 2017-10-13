import { HomePageState } from "./blog/HomePage";
import { LocationState } from "history";

export type AppState = {
	readonly location?: LocationState;
	readonly home: HomePageState;
};
