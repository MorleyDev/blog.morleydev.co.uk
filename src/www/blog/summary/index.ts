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

export type BlogLoadedSummaryAction = {
	type: "Blog@@LoadSummaries@@Loaded",
	summary: BlogPostSummary;
	onLoad: (state: AppState, summary: BlogPostSummary) => AppState
};

export const blogSummaryEpic = (action$: Observable<AppAction>) =>
	action$
		.filter(action => action.type === "Blog@@LoadSummaries")
		.switchMap((action: BlogLoadSummariesAction) => from([{
			id: "test-123",
			title: "Test 123",
			posted: new Date(),
			text: "<p>Lorem ipsum dollor set amet</p>",
			tags: ["test", "blog", "post", "react"]
		}]).map(post => ({
			type: "Blog@@LoadSummaries@@Loaded",
			summary: post,
			onLoad: action.onLoad
		})));

export const summaryLoadingReducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case "Blog@@LoadSummaries@@Loaded":
			return action.onLoad(state, action.summary);
	}
	return state;
};
