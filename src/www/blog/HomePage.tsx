import { List } from "immutable";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { Observable } from "rxjs/Observable";

import { AppAction } from "../app-action.model";
import { AppState } from "../app-state.model";
import { BlogPostSummary } from "./summary/index";

export type HomePageState = {
	readonly summaries: {
		readonly loading: boolean;
		readonly data: List<BlogPostSummary>;
	}
};


export const HomePage = (homePage: HomePageState) => (
	homePage.summaries.loading
		? <div>Loading</div>
		: <div>{homePage.summaries.data.map(summary => (
			<div key={summary.id}>
				<h2>{summary.title}</h2>
				<sub>{summary.posted.toISOString()} {summary.tags.join(" ")}</sub>
				<p dangerouslySetInnerHTML={{ __html: summary.text }}></p>
			</div>
		))}</div>
);

export const HomePageView = connect((state: AppState) => ({ ...state.home }))(HomePage);

export const homePageReducer = (state: AppState, action: AppAction): AppState => {
	if (state.location == null || state.location.pathname !== "/") {
		return state;
	}
	switch (action.type) {
		case "Blog@@LoadSummaries":
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
		default: return state;
	}
};

export const onViewHomePage = (action$: Observable<AnyAction>): Observable<AnyAction> =>
	action$
		.filter(action => action.type === "@@router/LOCATION_CHANGE")
		.filter(action => action.payload.pathname === "/")
		.map(() => ({
			type: "Blog@@LoadSummaries",
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
