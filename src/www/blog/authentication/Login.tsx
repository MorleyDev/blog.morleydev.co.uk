import { CircularProgress, Dialog, FlatButton, TextField } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";

import { AppState } from "../../app-state.model";
import { HideLoginDialogAction, RequestLoginAction } from "./action-state";

type LoginProps = {
	open: boolean;
	failure: string;
	loading: boolean;

	onSave: (username: string, password: string) => void;
	onCancel: () => void;
};
type LoginState = {
	username: string;
	password: string;
};

export class Login extends React.Component<LoginProps, LoginState> {
	constructor(props: LoginProps) {
		super(props);
		this.state = {
			username: "",
			password: ""
		};
	}

	public render(): JSX.Element {
		return (
			<Dialog title="Login" modal={true} open={this.props.open} actions={
				this.props.loading ? [] : [
					<FlatButton className="mx-1" secondary label="Cancel" onTouchTap={() => this.props.onCancel()} />,
					<FlatButton className="mx-1" primary label="Login" onTouchTap={() => {
						this.props.onSave(this.state.username, this.state.password);
						this.setState(state => ({ ...state, password: "" }));
					}} disabled={this.isLoginDisabled(this.state)} />
				]
			}>
				{!this.props.loading && <TextField
					floatingLabelText="Username"
					required
					fullWidth
					value={this.state.username}
					errorText={this.props.failure}
					onChange={(_, username) => this.setState(state => ({ ...state, username }))} />}

				{!this.props.loading && <TextField
					floatingLabelText="Password"
					required
					type="password"
					fullWidth
					value={this.state.password}
					onChange={(_, password) => this.setState(state => ({ ...state, password }))} />}

				{this.props.loading && <CircularProgress />}
			</Dialog>
		);
	}

	private isLoginDisabled(state: LoginState): boolean {
		return state.username.trim().length === 0 || state.password.trim().length === 0;
	}
}

export const LoginDialogView = connect(
	(state: AppState) => ({
		failure: state.auth.failureReason,
		open: state.auth.showDialog,
		loading: state.auth.currentState === "signing-in"
	}),
	(dispatch) => ({
		onSave: (username: string, password: string) => dispatch({ type: RequestLoginAction, details: { username, password } }),
		onCancel: () => dispatch({ type: HideLoginDialogAction })
	})
)((props) => <Login {...props} />);
