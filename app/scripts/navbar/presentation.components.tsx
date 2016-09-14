import { UserBarContainer } from "../authentication/container.components.tsx";
import { IAuthenticationState } from "../authentication/models.ts";
import { AuthorisationRole } from "../authorisation/models.ts";
import { NetworkIndicator } from "../network/components.tsx";
import { NetworkStatus } from "../network/models.ts";
import * as React from "react";
import "./presentation.components.scss!";

function NavBrand(): JSX.Element {
	return <a className="navbar-brand" href="/">Jason's Development Blog</a>;
}

function NavMenuLink(props: { isActive?: boolean, children?: { }, href: string }): JSX.Element {
	return <li className={props.isActive ? "nav-item active" : "nav-item"}>
		<a className="nav-link" href={props.href}>{props.children}</a>
	</li>;
}

function NavMenuDropDown(props: { isActive?: boolean; title: string; children?: { } }): JSX.Element {
	return <li className={props.isActive ? "nav-item btn-group active" : "nav-item btn-group"}>
		<a
			href="#"
			className="nav-link dropdown-toggle"
			data-toggle="dropdown"
			aria-haspopup="true"
			aria-expanded="false">
			{props.title}
		</a>
		<div className="dropdown-menu">
			{props.children}
		</div>
	</li>;
}

function NavMenuDropDownItem(props: { isActive?: boolean; children?: { }; href: string }): JSX.Element {
	return <a className={props.isActive ? "dropdown-item active" : "dropdown-item"} href={props.href}>{props.children}</a>;
}

function NavMenu(props: { children?: { } }): JSX.Element {
	return <ul className="nav navbar-nav">
		{props.children}
	</ul>;
}

function NavBar(props: {
	path: string;
	networkStatus: NetworkStatus;
	auth: IAuthenticationState;
	role: AuthorisationRole;
	emit: (action: { action: string; data: any; }) => void;
}): JSX.Element {
	return <nav className="navbar navbar-light bg-faded">
		<NavBrand />
		<NavMenu>
			<NavMenuLink isActive={props.path === "/"} href="/">Home</NavMenuLink>
			<NavMenuDropDown isActive={props.path.startsWith("/blog/")} title="Blog">
				<NavMenuDropDownItem isActive={props.path.startsWith("/blog/archive/")} href="/blog/archive/">Archive</NavMenuDropDownItem>
				{props.role === AuthorisationRole.Admin && <NavMenuDropDownItem isActive={props.path.startsWith("/blog/admin/")} href="/blog/admin/">Admin</NavMenuDropDownItem>}
			</NavMenuDropDown>
		</NavMenu>
		<div className="pull-right">
			<NetworkIndicator connected={props.networkStatus === NetworkStatus.Connected} />
			<UserBarContainer auth={props.auth} emit={props.emit} />
		</div>
	</nav>;
}

export {
	NavBrand,
	NavMenuLink,
	NavMenu,
	NavBar
};
