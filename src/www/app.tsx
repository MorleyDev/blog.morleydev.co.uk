import * as React from "react";
import { Link, Route, Switch } from "react-router-dom";

export const App = () => (
	<Switch>
		<Route exact path="/">
			<Link to="/about">Click me</Link>
		</Route>
		<Route exact path="/about">
			<Link to="/">Now me !!!</Link>
		</Route>
	</Switch>
);
