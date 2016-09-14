import { declareWatcher } from "../declare.ts";
import { IStateStore } from "../state/store.ts";
import { IAppState } from "../state/model.ts";
import { Navigator } from "../declare.ts";
import * as navigations from "../declare.navigations.ts";
import * as actions from "./actions.ts";
import { Context } from "../context.ts";
import crossroads from "crossroads";
import { Observable } from "rxjs";

export const onNavigationChanges = declareWatcher(
	(store, context) => store
		.observe()
		.map(state => state.navigation)
		.filter(data => data != null)
		.distinctUntilChanged()
		.filter(data => data !== context.navigation.current())
		.do((data: string) => context.navigation.navigateTo(data))
		.map(x => null)
);

export const navigationController = declareWatcher(
	(store, context) => {
		const router = crossroads.create();

		let navigateAway: null | ((stateStore: IStateStore<IAppState>, context: Context) => void) = null;
		getAllNavigations(navigations)
			.forEach(nav => router.addRoute(nav[0], (data: any) => {
				if (navigateAway != null) {
					navigateAway(store, context);
					navigateAway = null;
				}

				const nextNavigateAway = nav[1](store, data, context);
				navigateAway = nextNavigateAway || null;
			}));

		const updateNavigationTo = context.navigation
			.observe()
			.filter(state => state != null)
			.distinctUntilChanged()
			.map(url => { return { action: actions.NAVIGATE_TO, data: url }; });

		const runRouterOnNavigateChanges = store
			.observe()
			.map(state => state.navigation)
			.filter(state => state != null)
			.distinctUntilChanged()
			.do(url => url && router.parse(url))
			.map(x => null);

		return Observable.merge(updateNavigationTo, runRouterOnNavigateChanges);

		function getAllNavigations(set: any): [string, Navigator<any>][] {
			return Object.keys(set)
				.map(key => Array.isArray(set[key])
					? [[ set[key][0] as string, set[key][1] as Navigator<any> ] as [string, Navigator<any>]]
					: getAllNavigations(set[key]))
				.reduce((all, pair) => all.concat(pair), [] as [string, Navigator<any>][]);
		}
	}
);
