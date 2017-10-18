import * as React from "react";
import { Route } from "react-router";

import { AboutPageView } from "./blog/AboutPage";
import { LoginDialogView } from "./blog/authentication/Login";
import { HomePageView } from "./blog/HomePage";
import { NavBarView } from "./blog/NavBar";
import { Routing } from "./blog/routing";
import { Switch } from "./dom/Switch";

export const App = () => (
	<div>
		<NavBarView></NavBarView>
		<div className="app app-view-container">
			<Switch>
				<Route exact path={Routing.HomePage}>
					<HomePageView></HomePageView>
				</Route>
				<Route exact path={Routing.AboutPage}>
					<AboutPageView></AboutPageView>
				</Route>
			</Switch>
		</div>
		<LoginDialogView />
	</div>
);
