import "core-js";

import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { AnyAction, applyMiddleware, compose as reduxCompose, createStore } from "redux";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

import { initialState } from "./app-state.initial";

const App: () => JSX.Element = require("./app").App;
const reducer: (state: any, action: AnyAction) => any = require("./app-reducer.func").mainReducer;
const epic: (action$: Observable<AnyAction>) => Observable<AnyAction> = require("./app-epic.func").mainEpic;

const compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose;
const store = createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(
            createEpicMiddleware(combineEpics(epic))
        )
    )
);

const Main = (App: () => JSX.Element) =>
    <Provider store={store}>
        <App />
    </Provider>;

const getAppRoot = () => window.document.getElementById("app");

render(Main(App), getAppRoot());

if ((module as any).hot) {
    (module as any).hot.accept("./app-reducer.func", () => {
        const reducer: (state: any, action: AnyAction) => any = require("./app-reducer.func").mainReducer;
        store.replaceReducer(reducer);
    });
    (module as any).hot.accept("./app", () => {
        const App: () => JSX.Element = require("./app").App;
        render(Main(App), getAppRoot());
    });
}
