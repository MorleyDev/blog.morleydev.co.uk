import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../../app-state.model";

const IfSignedInInner = ({ state, children }: { state: string, children: React.ReactElement<any>[] }) =>
	(<span>{state === "signed-in" ? children :  []}</span>);

export const IfSignedIn = connect((state: AppState, {children}: { children: any }) => ({
	state: state.auth.currentState,
	children
}))(IfSignedInInner);
