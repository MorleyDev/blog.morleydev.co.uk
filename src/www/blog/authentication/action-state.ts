
export type LoginState = {
	readonly currentState: "unauthenticated" | "signing-in" | "signed-in" | "signing-out" | "signed-out";
	readonly authenticationToken: string;
	readonly failureReason: string;
	readonly showDialog: boolean;
};

export type RequestLoginAction = {
	readonly type: "Auth@@RequestLogin";
	readonly details: {
		readonly username: string;
		readonly password: string;
	};
};
export const RequestLoginAction = "Auth@@RequestLogin";

export type LoginFailureAction = {
	readonly type: "Auth@@RequestLogin@@Failure";
	readonly reason: string;
};
export const LoginFailureAction = "Auth@@RequestLogin@@Failure";

export type LoginSuccessAction = {
	readonly type: "Auth@@RequestLogin@@Success";
	readonly token: string;
};
export const LoginSuccessAction = "Auth@@RequestLogin@@Success";

export type RequestLogoutAction = { readonly type: "Auth@@RequestLogout"; };
export const RequestLogoutAction = "Auth@@RequestLogout";

export type CompletedLogoutAction = { readonly type: "Auth@@RequestLogout@@Completed"; };
export const CompletedLogoutAction = "Auth@@RequestLogout@@Completed";

export type ShowLoginDialogAction = { readonly type: "Auth@@ShowLoginDialog" };
export const ShowLoginDialogAction = "Auth@@ShowLoginDialog";

export type HideLoginDialogAction = { readonly type: "Auth@@HideLoginDialog" };
export const HideLoginDialogAction = "Auth@@HideLoginDialog";
