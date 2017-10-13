import createBrowserHistory from "history/createBrowserHistory";
import { MuiThemeProvider } from "material-ui/styles";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter, routerMiddleware as createRouterMiddleware, routerReducer } from "react-router-redux";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { AnyAction, applyMiddleware, compose as reduxCompose, createStore } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { Observable } from "rxjs/Observable";

import { initialState } from "./app-state.initial";

injectTapEventPlugin();

const getApp: () => () => JSX.Element = () => require("./App").AppView;

const getMainReducer = (): (state: any, action: AnyAction) => any => require("./app-reducer.func").mainReducer;
const createReducer = (appReducer: (state: any, action: AnyAction) => any) => (state: any, action: AnyAction) => appReducer(routerReducer(state, action), action);
const getReducer = () => createReducer(getMainReducer());

const getMainEpic = (): (action$: Observable<AnyAction>) => Observable<AnyAction> => require("./app-epic.func").mainEpic;
const mainEpic = getMainEpic();
const epicMiddleware = createEpicMiddleware(combineEpics(mainEpic));

const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

const compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose;
const store = createStore(
	getReducer(),
	initialState,
	compose(
		applyMiddleware(
			epicMiddleware,
			routerMiddleware
		)
	)
);

const Main = (App: () => JSX.Element) =>
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<MuiThemeProvider>
				<App />
			</MuiThemeProvider>
		</ConnectedRouter>
	</Provider>;

const getAppRoot = () => window.document.getElementById("app");
const renderMain = () => render(Main(getApp()), getAppRoot());

export function main(): void {
	renderMain();

	if ((module as any).hot) {
		(module as any).hot.accept("./app-reducer.func", () => {
			store.replaceReducer(getReducer());
		});
		(module as any).hot.accept("./app-epic.func", () => {
			epicMiddleware.replaceEpic(getMainEpic());
		});
		(module as any).hot.accept("./App", () => {
			renderMain();
		});
	}
}
