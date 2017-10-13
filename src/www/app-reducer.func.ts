import { AppAction } from "./app-action.model";
import { AppState } from "./app-state.model";

export const mainReducer = (state: AppState, action: AppAction): AppState => state;
