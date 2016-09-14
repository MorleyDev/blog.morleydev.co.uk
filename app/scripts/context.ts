import { IAuthentication, FirebaseAuthentication } from "./authentication/service.ts";
import { IDatabaseService, FirebaseDatabaseService } from "./database/service.ts";
import { INetworkService, FirebaseNetworkService } from "./network/service.ts";
import { IFileStorage, FirebaseFileStorage } from "./filestorage/service.ts";
import { INavigation, AnchorOverridingNavigation, HistoryStateNavigation, BrowserNavigation } from "./navigation/navigation.service.ts";
import { IAppState } from "./state/model.ts";
import { IBlogService, BlogService } from "./blog/service.ts";
import { ILogger, ProductionConsoleLogger, TraceConsoleLogger } from "./util/logging.ts";
import { IStateStore, IReducerSet, ReduxStateStore } from "./state/store.ts";
import * as process from "./util/process.ts";

import * as firebase from "firebase";
import * as React from "react";

export class Context {
	public database: IDatabaseService;
	public authentication: IAuthentication;
	public network: INetworkService;
	public navigation: INavigation;
	public storage: IFileStorage;
	public createStateStore: (initialState: IAppState, reducers: IReducerSet<IAppState>) => IStateStore<IAppState>;
	public logging: ILogger;
	public blog: IBlogService;
}

export const contextTypes = {
	database: React.PropTypes.object,
	authentication: React.PropTypes.object,
	network: React.PropTypes.object,
	navigation: React.PropTypes.object,
	storage: React.PropTypes.object,
	createStateStore: React.PropTypes.func,
	logging: React.PropTypes.object,
	blog: React.PropTypes.object
};

let _context: Context | null = null;
export function getContext(): Context {
	if (_context != null) {
		return _context;
	}

	const app = firebase.initializeApp({
		apiKey: "AIzaSyD51BT2B1ZEmhfYxywzy2OeeoPROu1GOP0",
		authDomain: "morleydev-co-ukblog.firebaseapp.com",
		databaseURL: "https://morleydev-co-ukblog.firebaseio.com",
		storageBucket: "morleydev-co-ukblog.appspot.com",
	});

	const database = new FirebaseDatabaseService(app.database());
	const storage = new FirebaseFileStorage(app);
	_context = {
		database: database,
		storage: storage,
		authentication: new FirebaseAuthentication(app.auth()),
		network: new FirebaseNetworkService(app),
		navigation: createNavigation(),
		createStateStore: (initialState, reducers) => new ReduxStateStore(initialState, reducers),
		logging: process.env.NODE_ENV === "development" ? new TraceConsoleLogger() : new ProductionConsoleLogger(),
		blog: new BlogService(database, storage)
	};
	return _context;
}

function createNavigation(): INavigation {
	const stateNav = window.history.pushState != null
		? new HistoryStateNavigation(
			cb => window.addEventListener("popstate", cb, true),
			(d, t, u) => window.history.pushState(d, t, u),
			() => window.location.pathname
		)
		: new BrowserNavigation(url => window.location.pathname = url, () => window.location.pathname);

	return new AnchorOverridingNavigation(stateNav, cb => document.addEventListener("click", cb, true));
}
