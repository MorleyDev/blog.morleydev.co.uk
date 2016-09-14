import { getContext } from "./context.ts";
import { createControllers } from "./controllers.ts";
import { AppContainer } from "./app.component.tsx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.scss!";

const [ state ] = createControllers();
const context = getContext();

function Main(): JSX.Element {
	return <AppContainer stateStore={state} context={context} />;
}

function domReady(f: () => void): void {
	/in/.test(document.readyState)
		? setTimeout(() => domReady(f), 9)
		: f();
}

domReady(() => {
	const html = document.documentElement;
	html.className = html.className.split(" ").filter(x => x !== "dom-loading").concat(["dom-loaded"]).join(" ");

	const element = document.getElementById("content");
	if (element == null) {
		html.className = html.className.split(" ").concat(["reactdom-errored"]).join(" ");
		return;
	}

	ReactDOM.render(<Main />, element);
	html.className = html.className.split(" ").concat(["reactdom-rendered"]).join(" ");
});
