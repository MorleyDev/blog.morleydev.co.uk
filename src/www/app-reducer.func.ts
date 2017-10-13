import { AppAction } from "./app-action.model";
import { AppState } from "./app-state.model";
import { homePageReducer } from "./blog/HomePage";
import { summaryLoadingReducer } from "./blog/summary/index";


export const mainReducer = (state: AppState, action: AppAction): AppState =>
	summaryLoadingReducer(homePageReducer(state, action), action);
