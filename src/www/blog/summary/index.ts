import { fromPromise } from "rxjs/observable/fromPromise";
import { List } from "immutable";
import { AnyAction } from "redux";
import { Observable } from "rxjs/Observable";
import { from } from "rxjs/observable/from";

import { AppAction } from "../../app-action.model";
import { AppState } from "../../app-state.model";

export type BlogPostSummary = {
	readonly id: string;
	readonly title: string;
	readonly posted: Date;
	readonly text: string;
	readonly tags: List<string>;
};

export type BlogLoadSummariesAction = {
	type: "Blog@@LoadSummaries",
	amount: number;
	onLoad: (state: AppState, summary: BlogPostSummary) => AppState;
};
export const BlogLoadSummariesAction = "Blog@@LoadSummaries";

export type BlogLoadedSummaryAction = {
	type: "Blog@@LoadSummaries@@Loaded",
	summary: BlogPostSummary;
	onLoad: (state: AppState, summary: BlogPostSummary) => AppState
};
export const BlogLoadedSummaryAction = "Blog@@LoadSummaries@@Loaded";

export const loadBlogSummaries = (amount: number): Observable<BlogPostSummary> =>
	fromPromise(fetch("/api/blog"))
		.mergeMap(response => response.json())
		.mergeMap(response => response.data)
		.map((data: any) => ({
			...data,
			posted: new Date(data.posted)
		} as BlogPostSummary));

export const blogSummaryEpic = (action$: Observable<AppAction>) =>
	action$
		.filter(action => action.type === "Blog@@LoadSummaries")
		.switchMap((action: BlogLoadSummariesAction) => loadBlogSummaries(action.amount).map(post => ({
			type: BlogLoadedSummaryAction,
			summary: post,
			onLoad: action.onLoad
		})));

export const summaryLoadingReducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case BlogLoadedSummaryAction:
			return action.onLoad(state, action.summary);
	}
	return state;
};
