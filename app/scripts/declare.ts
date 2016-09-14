import { IStateStore, IReducer } from "./state/store.ts";
import { IAppState } from "./state/model.ts";
import { Context } from "./context.ts";
import { Observable } from "rxjs";

export type WatcherDeclaration = (stateStore: IStateStore<IAppState>, context: Context) => Observable<{ action: string; data: any; } | null>;

export type Watcher = [
	(stateStore: IStateStore<IAppState>, context: Context) => Observable<{ action: string; data: any; } | null>
];

export function declareWatcher(loader: WatcherDeclaration): Watcher {
	return [loader];
}

export function declareReducer<T>(action: string, reducer: IReducer<IAppState, T>): [string, IReducer<IAppState, T>] {
	return [action, reducer];
}

export type Navigator<T> = (stateStore: IStateStore<IAppState>, data: T, context: Context) => (void | ((stateStore: IStateStore<IAppState>, context: Context) => void));

export function declarePath<T>(action: string, handler: Navigator<T>): [string, Navigator<T>] {
	return [action, handler];
}
