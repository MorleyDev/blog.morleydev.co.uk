import * as React from "react";
import { Route } from "react-router";

import { AboutPageView } from "./blog/AboutPage";
import { HomePageView } from "./blog/HomePage";
import { NavBarView } from "./blog/NavBar";
import { Routing } from "./blog/routing";
import { Switch } from "./dom/Switch";

export const App = () => (
	<div>
		<NavBarView></NavBarView>
		<Switch>
			<Route exact path={Routing.HomePage}>
				<HomePageView></HomePageView>
			</Route>
			<Route exact path={Routing.AboutPage}>
				<AboutPageView></AboutPageView>
			</Route>
		</Switch>
	</div>
);
