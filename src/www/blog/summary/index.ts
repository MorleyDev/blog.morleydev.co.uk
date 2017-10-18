import { List } from "immutable";
import { Observable } from "rxjs/Observable";
import { fromPromise } from "rxjs/observable/fromPromise";

import { AppAction } from "../../app-action.model";
import { AppState } from "../../app-state.model";

export type BlogPostSummary = {
	readonly id: string;
	readonly title: string;
	readonly posted: Date;
	readonly summary: string;
	readonly tags: List<string>;
};

export type BlogLoadSummariesAction = {
	type: "Blog@@LoadSummaries",
	amount: number;
	onLoad: (state: AppState, summary: BlogPostSummary) => AppState;
};
export const BlogLoadSummariesAction = "Blog@@LoadSummaries";

export type BlogLoadedSummariesAction = {
	type: "Blog@@LoadSummaries@@Loaded",
	summaries: BlogPostSummary[];
	onLoad: (state: AppState, summary: BlogPostSummary[]) => AppState
};
export const BlogLoadedSummariesAction = "Blog@@LoadSummaries@@Loaded";

export const loadBlogSummaries = (amount: number): Observable<BlogPostSummary> =>
	fromPromise(fetch("/api/blog"))
		.mergeMap(response => response.json())
		.mergeMap(response => response.data as { id: string; title: string; posted: string; summary: string; tags: string[]; }[])
		.map(data => ({
			...data,
			posted: new Date(data.posted),
			tags: List(data.tags)
		}));

export const blogSummaryEpic = (action$: Observable<AppAction>) =>
	action$
		.filter(action => action.type === "Blog@@LoadSummaries")
		.switchMap((action: BlogLoadSummariesAction) => loadBlogSummaries(action.amount).toArray().map(post => ({
			type: BlogLoadedSummariesAction,
			summaries: post,
			onLoad: action.onLoad
		})));

export const summaryLoadingReducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case BlogLoadedSummariesAction:
			return action.onLoad(state, action.summaries);
	}
	return state;
};
