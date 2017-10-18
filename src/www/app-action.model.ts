import {
	CompletedLogoutAction,
	HideLoginDialogAction,
	LoginFailureAction,
	LoginSuccessAction,
	RequestLoginAction,
	RequestLogoutAction,
	ShowLoginDialogAction,
} from "./blog/authentication/action-state";
import { BlogLoadedSummariesAction, BlogLoadSummariesAction } from "./blog/summary/index";

export type AppAction
	= BlogLoadSummariesAction
	| BlogLoadedSummariesAction
	| RequestLoginAction
	| LoginFailureAction
	| LoginSuccessAction
	| ShowLoginDialogAction
	| HideLoginDialogAction
	| RequestLogoutAction
	| CompletedLogoutAction;
