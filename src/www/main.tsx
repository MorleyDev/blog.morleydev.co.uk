import "core-js";

import createBrowserHistory from "history/createBrowserHistory";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter, routerMiddleware, routerReducer } from "react-router-redux";
import { AnyAction, applyMiddleware, compose as reduxCompose, createStore } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { Observable } from "rxjs/Observable";

import { initialState } from "./app-state.initial";

const App: () => JSX.Element = require("./app").App;
const reducer: (state: any, action: AnyAction) => any = require("./app-reducer.func").mainReducer;
const epic: (action$: Observable<AnyAction>) => Observable<AnyAction> = require("./app-epic.func").mainEpic;

const createMainReducer = (appReducer: (state: any, action: AnyAction) => any) =>
	(state: any, action: AnyAction) => routerReducer(appReducer(state, action), action);

const history = createBrowserHistory();
const compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose;
const store = createStore(
	createMainReducer(reducer),
	initialState,
	compose(
		applyMiddleware(
			createEpicMiddleware(combineEpics(epic)),
			routerMiddleware(history)
		)
	)
);

const Main = (App: () => JSX.Element) =>
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>;

const getAppRoot = () => window.document.getElementById("app");

export function main(): void {
	render(Main(App), getAppRoot());

	if ((module as any).hot) {
		(module as any).hot.accept("./app-reducer.func", () => {
			const reducer: (state: any, action: AnyAction) => any = require("./app-reducer.func").mainReducer;
			store.replaceReducer(createMainReducer(reducer));
		});
		(module as any).hot.accept("./app", () => {
			const App: () => JSX.Element = require("./app").App;
			render(Main(App), getAppRoot());
		});
	}
}
