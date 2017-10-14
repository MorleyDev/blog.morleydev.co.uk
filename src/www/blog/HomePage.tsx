import { List } from "immutable";
import { LinearProgress } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { LOCATION_CHANGE, LocationChangeAction } from "react-router-redux";
import { AnyAction } from "redux";
import { Observable } from "rxjs/Observable";

import { AppAction } from "../app-action.model";
import { AppState } from "../app-state.model";
import { Routing } from "./routing";
import { BlogLoadSummariesAction, BlogPostSummary } from "./summary/index";
import { Markdown } from "../dom/Markdown";

export type HomePageState = {
	readonly summaries: {
		readonly loading: boolean;
		readonly data: List<BlogPostSummary>;
	}
};

export const HomePage = (homePage: HomePageState) => (
	homePage.summaries.loading
		? <LinearProgress mode="indeterminate" />
		: <div>{homePage.summaries.data.map(summary => (
			<div key={summary.id}>
				<h2>{summary.title}</h2>
				<sub>{summary.posted.toISOString()} {summary.tags.join(" ")}</sub>
				<Markdown markdown={summary.text} />
			</div>
		))}</div>
);

export const HomePageView = connect((state: AppState) => ({ ...state.home }))(HomePage);

export const homePageReducer = (state: AppState, action: AppAction): AppState => {
	if (state.location == null || state.location.pathname !== "/") {
		return state;
	}
	switch (action.type) {
		case BlogLoadSummariesAction:
			return {
				...state,
				home: {
					...state.home,
					summaries: {
						...state.home.summaries,
						data: state.home.summaries.data.clear(),
						loading: true
					}
				}
			};
		default:
			return state;
	}
};

export const homePageEpic = (action$: Observable<AnyAction>): Observable<AnyAction> =>
	action$
		.filter(action => action.type === LOCATION_CHANGE)
		.filter((action: LocationChangeAction) => action.payload.pathname === Routing.HomePage)
		.map(() => ({
			type: BlogLoadSummariesAction,
			amount: 10,
			onLoad: (state: AppState, summary: BlogPostSummary) => {
				return ({
					...state,
					home: {
						...state.home,
						summaries: {
							loading: false,
							data: state.home.summaries.data.push(summary)
						}
					}
				});
			}
		}));
