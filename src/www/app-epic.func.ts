import { AppAction } from "./app-action.model";
import { merge } from "rxjs/observable/merge";
import { Observable } from "rxjs/Observable";

export type Epic = (action$: Observable<AppAction>) => Observable<AppAction>;
export const mainEpic: Epic = action$ => merge();
