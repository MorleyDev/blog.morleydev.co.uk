import { forClient } from "./sockets/forClient";
import { connect } from "react-redux";
import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";

import { App } from "./App";
import { AppAction } from "./app-action.model";
import { AppState } from "./app-state.model";
import { homePageEpic } from "./blog/HomePage";
import { homePageReducer } from "./blog/HomePage";
import { blogSummaryEpic } from "./blog/summary/index";
import { summaryLoadingReducer } from "./blog/summary/index";

export type Epic = (action$: Observable<AppAction>) => Observable<AppAction>;
export const mainEpic: Epic = action$ => merge<AppAction>(
	homePageEpic(action$),
	blogSummaryEpic(action$),

	action$
		.do(({ type }) => forClient.emit("action", type))
		.filter(() => false)
);


export type Reducer = (state: AppState, action: AppAction) => AppState;
export const mainReducer: Reducer = (state: AppState, action: AppAction): AppState =>
	summaryLoadingReducer(homePageReducer(state, action), action);

export const AppView = connect()(App);
