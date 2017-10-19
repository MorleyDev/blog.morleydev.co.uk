import { connect } from "react-redux";
import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";

import { App } from "./App";
import { AppAction } from "./app-action.model";
import { AppState } from "./app-state.model";
import { loginEpic, loginReducer } from "./blog/authentication/index";
import { homePageReducer } from "./blog/HomePage";
import { homePageEpic } from "./blog/HomePage";
import { blogPostLoadingEpic, blogPostLoadingReducer } from "./blog/post/index";
import { summaryLoadingReducer } from "./blog/summary/index";
import { blogSummaryEpic } from "./blog/summary/index";

export type Epic = (action$: Observable<AppAction>) => Observable<AppAction>;
export const mainEpic: Epic = action$ => merge<AppAction>(
	homePageEpic(action$),
	blogSummaryEpic(action$),
	loginEpic(action$),
	blogPostLoadingEpic(action$),
);

export type Reducer = (state: AppState, action: AppAction) => AppState;
export const mainReducer: Reducer = (state: AppState, action: AppAction): AppState =>
	loginReducer(
		blogPostLoadingReducer(
			summaryLoadingReducer(
				homePageReducer(state, action), action), action), action);

export const AppView = connect()(App);
