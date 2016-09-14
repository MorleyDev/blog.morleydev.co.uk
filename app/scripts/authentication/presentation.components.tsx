import { IUserSignIn } from "./models.ts";
import * as React from "react";
import "./presentation.components.scss!";

interface IAuthenticationProps {
	control: string;
	onClick: () => void;
	children?: JSX.Element[];
}

function Authentication(props: IAuthenticationProps): JSX.Element {
	return <button
		className={`btn btn-social-media btn-${props.control}`}
		onClick={() => props.onClick()}
		title={`Log-in via ${props.control}`}
	>
		{props.children}
	</button>;
}

interface ILogoutButtonProps {
	onClick: () => void;
	children?: JSX.Element[];
}

function LogoutButton(props: ILogoutButtonProps): JSX.Element {
	return	<span className="user-logout">
		<button className="btn btn-link btn-logout" onClick={() => props.onClick()}>Logout</button>
	</span>;
}

interface IUserBarProps {
	isSigningIn: boolean;
	isLoggingOut: boolean;
	onClickGoogle: () => void;
	onClickLogout: () => void;
	user: IUserSignIn | null;
}

interface IUserBarDetailsProps {
	user: IUserSignIn;
}

function UserBarDetails(props: IUserBarDetailsProps): JSX.Element {
	const hasPhoto = props.user.photoUrl != null && props.user.photoUrl !== "";

	return <span className="user-details">
			{(!hasPhoto) && <span className="user-name">{props.user.displayName}</span>}
			{hasPhoto && <img className="user-photo img-circle" src={props.user.photoUrl} /> }
		</span>;
}

interface IUserBarSignInProps {
	isSigningIn: boolean;
	onClickGoogle: () => void;
}

interface IUserBarSignedInProps {
	isLoggingOut: boolean;
	onClickLogout: () => void;
	user: IUserSignIn;
}

function UserBarSignIn(props: IUserBarSignInProps): JSX.Element {
	return !props.isSigningIn && <span className="user user-bar">
			<span className="m-x-1 user-signin-prompt">Sign in</span>
			<Authentication control="google" onClick={props.onClickGoogle}>
				<i className="fa fa-google-plus"></i>
			</Authentication>
		</span>;
}

function UserBarSignedIn(props: IUserBarSignedInProps): JSX.Element {
	return !props.isLoggingOut && <span className="user user-bar">
			<UserBarDetails user={props.user} />
			<LogoutButton onClick={props.onClickLogout} />
		</span>;
}

function UserBar(props: IUserBarProps): JSX.Element {
	return props.user == null
		? <UserBarSignIn isSigningIn={props.isSigningIn} onClickGoogle={props.onClickGoogle} />
		: <UserBarSignedIn isLoggingOut={props.isLoggingOut} onClickLogout={props.onClickLogout} user={props.user} />;
}

export {
	IAuthenticationProps, Authentication,
	ILogoutButtonProps,	LogoutButton,
	IUserBarDetailsProps, UserBarDetails,
	IUserBarProps, UserBar
};
