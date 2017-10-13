import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";

import { AppAction } from "./app-action.model";
import { onViewHomePage } from "./blog/HomePage";
import { summaryLoadingEpic } from "./blog/summary/index";

export type Epic = (action$: Observable<AppAction>) => Observable<AppAction>;
export const mainEpic: Epic = action$ => merge<AppAction>(
	onViewHomePage(action$),
	summaryLoadingEpic(action$)
);
