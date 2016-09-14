import * as process from "../util/process.ts";
import { createDevTools } from "redux-devtools";
import LogMonitor from "redux-devtools-log-monitor";
import DockMonitor from "redux-devtools-dock-monitor";
import * as React from "react";

const InnerDevTools = (process.env.NODE_ENV === "development")
	? createDevTools(
		<DockMonitor toggleVisibilityKey="ctrl-h"
					changePositionKey="ctrl-q"
					defaultIsVisible={true}>
			<LogMonitor theme="tomorrow" />
		</DockMonitor>
	)
	: null;

export function instrument() {
	return InnerDevTools != null
		? InnerDevTools.instrument()
		: undefined;
}

let attachedStore: any = null;
export function attachStore(store: any) {
	attachedStore = store;
}

export function Element(): JSX.Element {
	return (InnerDevTools && <InnerDevTools store={attachedStore} />) as JSX.Element;
}
