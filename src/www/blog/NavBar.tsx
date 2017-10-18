import { AppBar, FlatButton, IconButton, IconMenu, Snackbar, Tab, Tabs, MenuItem } from "material-ui";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import * as React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import { AppState } from "../app-state.model";
import { IfMobile, IfTabletOrLarger } from "../dom/Responsive";
import { RequestLogoutAction, ShowLoginDialogAction } from "./authentication/action-state";
import { Routing } from "./routing";

export const NavBar = ({ path, navigate, login, logout, authState }: {
	path: string;
	navigate: (path: string) => void;
	login: () => void;
	logout: () => void;
	authState: "unauthenticated" | "signing-in" | "signed-in" | "signing-out" | "signed-out";
}) => (
		<div>
			<AppBar
				title="Jason's Development Blog"
				iconElementLeft={
					<IfMobile>
						<IconMenu iconButtonElement={<IconButton><MoreVertIcon color="white" /></IconButton>}>
							<MenuItem primaryText="Home" onTouchTap={() => navigate(Routing.HomePage)} />
							<MenuItem primaryText="About" onTouchTap={() => navigate(Routing.AboutPage)} />
							<LoginLogoutMenuItem state={authState} login={login} logout={logout} />
						</IconMenu>
					</IfMobile>
				}
				iconElementRight={
					<IfTabletOrLarger>
						<LoginLogoutButton state={authState} login={login} logout={logout} />
					</IfTabletOrLarger>
				}
			>
			</AppBar>
			<IfTabletOrLarger>
				<Tabs value={path} onChange={navigate}>
					<Tab label="Home" value={Routing.HomePage}></Tab>
					<Tab label="About" value={Routing.AboutPage}></Tab>
				</Tabs>
			</IfTabletOrLarger>
			<Snackbar open={authState === "signed-out"} message="Signed out" autoHideDuration={4000}></Snackbar>
		</div>
	);

const LoginLogoutMenuItem = ({ state, login, logout }: {
	state: "unauthenticated" | "signing-in" | "signed-in" | "signing-out" | "signed-out";
	login: () => void;
	logout: () => void;
}) => {
	switch (state) {
		case "signed-out":
		case "unauthenticated":
			return <MenuItem onTouchTap={login} primaryText="Login" />;
		case "signing-in":
			return <span />;
		case "signed-in":
			return <MenuItem onTouchTap={logout} primaryText="Logout" />;
		case "signing-out":
			return <span />;
		default:
			return <span />;
	}
};
const LoginLogoutButton = ({ state, login, logout }: {
	state: "unauthenticated" | "signing-in" | "signed-in" | "signing-out" | "signed-out";
	login: () => void;
	logout: () => void;
}) => {
	switch (state) {
		case "signed-out":
		case "unauthenticated":
			return <FlatButton onTouchTap={login} labelStyle={{ color: "white" }} label="login" />;
		case "signing-in":
			return <span />;
		case "signed-in":
			return <FlatButton onTouchTap={logout} labelStyle={{ color: "white" }} label="logout" />;
		case "signing-out":
			return <span />;
		default:
			return <span />;
	}
};

export const NavBarView = connect(
	(state: AppState) => ({
		path: state.location.pathname,
		authState: state.auth.currentState
	}),
	dispatch => ({
		navigate: (path: string) => dispatch(push(path)),
		login: () => dispatch({ type: ShowLoginDialogAction }),
		logout: () => dispatch({ type: RequestLogoutAction })
	})
)(NavBar);
