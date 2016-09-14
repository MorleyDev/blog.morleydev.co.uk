import { IAppState } from "../state/model.ts";
import { NavBar } from "./presentation.components.tsx";
import * as React from "react";

export function NavbarContainer(props: { state: IAppState; emit: (action: { action: string; data: any; }) => void; }): JSX.Element {
	return <NavBar
		auth={props.state.authentication}
		role={props.state.authorisation.role}
		networkStatus={props.state.network.status}
		path={props.state.navigation || "/"}
		emit={props.emit}
		/>;
}
