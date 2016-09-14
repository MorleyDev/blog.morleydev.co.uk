import { IStateStore, IReducerSet, IReducer } from "./store.ts";
import * as model from "./model.ts";
import { Context } from "../context.ts";
import { Watcher, WatcherDeclaration } from "../declare.ts";
import * as watchers from "../declare.watchers.ts";
import * as reducers from "../declare.reducers.ts";
import { Subscription, Observable } from "rxjs";

export class StateController {
	private context: Context;
	private stateStore: IStateStore<model.IAppState>;
	private subscription: Subscription;

	constructor(context: Context) {
		this.context = context;
		this.stateStore = context.createStateStore(model.create(), this.getAllReducers(reducers));

		const self = this;
		this.subscription = self.getAllWatchers(watchers)
			.map(watcher => watcher[0](self.stateStore, self.context))
			.reduce((o: Observable<{ action: string; data: string }>, m:  Observable<{ action: string; data: string }>) => o.merge(m), Observable.from([]))
			.subscribe(action => {
				if (action == null) {
					return;
				}
				console.log("Subscribe", action);
				self.stateStore.update(action.action, action.data);
				console.log("Subscribed");
			});
	}

	public getState(): IStateStore<model.IAppState> {
		return this.stateStore;
	}

	private getAllReducers(set: any): IReducerSet<model.IAppState> {
		return this.getAllReducerPairs(set)
			.map((curr: [string, IReducer<model.IAppState, any>]) => [curr[0], this.wrapReducer(curr[0], curr[1])])
			.reduce((prev: { [key: string]: any }, curr: [string, IReducer<model.IAppState, any>]) => Object.assign({}, prev, { [curr[0]]: (prev[curr[0]] || []).concat([curr[1]]) }), { });
	}

	private getAllReducerPairs(set: any): [string, IReducer<model.IAppState, any>][] {
		return Object.keys(set)
			.map(key => Array.isArray(set[key])
				? [[set[key][0], set[key][1]]] as [string, IReducer<model.IAppState, any>][]
				: this.getAllReducerPairs(set[key]))
			.reduce((all, current) => all.concat(current), []);
	}

	private getAllWatchers(set: any): Watcher[] {
		return Object.keys(set)
			.map(key => Array.isArray(set[key])
				? [[this.wrapWatcher(key, set[key][0])] as [WatcherDeclaration]]
				: this.getAllWatchers(set[key])
			).reduce((all, s) => all.concat(s), []);
	};

	private wrapReducer(key: string, reducer: IReducer<model.IAppState, any>): IReducer<model.IAppState, any> {
		return (state, result) => {
			try {
				return reducer(state, result);
			} catch (error) {
				console.error("Exception during reducer:", key, error);
				return state;
			}
		};
	}

	private wrapWatcher(key: string, declaration: WatcherDeclaration): WatcherDeclaration {
		return (stateStore: IStateStore<model.IAppState>, context: Context) => {
			try {
				return declaration(stateStore, context);
			} catch (error) {
				console.error("Exception during watcher:", key, error);
				return Observable.of(null);
			}
		};
	}
}
