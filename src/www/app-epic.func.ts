import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";

import { AppAction } from "./app-action.model";
import { homePageEpic } from "./blog/HomePage";
import { blogSummaryEpic } from "./blog/summary/index";

export type Epic = (action$: Observable<AppAction>) => Observable<AppAction>;
export const mainEpic: Epic = action$ => merge<AppAction>(
	homePageEpic(action$),
	blogSummaryEpic(action$)
);
