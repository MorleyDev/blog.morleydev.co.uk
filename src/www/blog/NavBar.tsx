import { AppBar, Tab, Tabs } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

export const NavBar = ({ path, navigate }: { path: string; navigate: (path: string) => void; }) => (
	<div>
		<AppBar title="Jason's Development Blog" showMenuIconButton={false}></AppBar>
		<Tabs value={path} onChange={navigate}>
			<Tab label="Home" value="/"></Tab>
			<Tab label="About" value="/about"></Tab>
		</Tabs>
	</div>
);

export const NavBarView = connect(
	(state: any) => ({ path: state.location.pathname }),
	dispatch => ({
		navigate: (path: string) => dispatch(push(path))
	})
)(NavBar);
