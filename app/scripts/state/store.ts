import * as devtools from "./devtools.components.tsx";
import { createStore, IStore, IAction } from "redux";
import { Observable, Subscriber } from "rxjs";

export interface IReducer<TState, TData> {
	(state: TState, data: TData): TState;
}

export interface IReducerSet<TState> {
	[action: string]: IReducer<TState, any> | IReducer<TState, any>[];
}

export interface IStateStore<TState> {
	update<TData>(action: string, data: TData): void;
	getState(): TState;
	setState(newState: TState): void;
	observe(): Observable<TState>;
}

interface IReduxAction<TData> extends IAction {
	type: string;
	data: TData;
	timestamp: number;
}

export class ReduxStateStore<TState> implements IStateStore<TState> {
	private stateTree: IStore<TState>;
	private reducers: IReducerSet<TState>;

	constructor(initialState: TState, reducers: IReducerSet<TState>) {
		this.reducers = reducers;

		this.stateTree = (createStore as any)(
			(state: TState, action: any) => this.reducer(state, action),
			initialState,
			devtools.instrument()
		);
		devtools.attachStore(this.stateTree);
	}

	public update<TData>(action: string, data: TData): void {
		this.stateTree.dispatch({ type: action, data: data, timestamp: Date.now() } as IReduxAction<TData>);
	}

	public getState(): TState {
		return this.stateTree.getState();
	}

	public setState(newState: TState): void {
		this.stateTree.dispatch({ type: "@@STATESTORE/FORCE_UPDATE", data: newState, timestamp: Date.now() } as IReduxAction<TState>);
	}

	public observe(): Observable<TState> {
		return new Observable<TState>((subscriber: Subscriber<TState>) => {
			subscriber.next(this.getState());
			return this.stateTree.subscribe(() => subscriber.next(this.getState()));
		});
	}

	private reducer<TData>(state: TState, action: IAction): TState {
		const type = action.type;
		const data = (action as IReduxAction<any>).data;

		return type !== "@@STATESTORE/FORCE_UPDATE"
			? this.getReducers<TData>(type).reduce((prevState, reducer) => reducer(prevState, data), state)
			: data;
	}

	private getReducers<TData>(action: string | number): IReducer<TState, TData>[] {
		const reducers = this.reducers[action];
		if (reducers == null) {
			return [];
		}

		return Array.isArray(reducers)
			? (reducers as IReducer<TState, TData>[])
			: [reducers as IReducer<TState, TData>];
	}
}
