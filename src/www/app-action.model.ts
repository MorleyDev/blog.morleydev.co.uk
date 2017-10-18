import {
	CompletedLogoutAction,
	HideLoginDialogAction,
	LoginFailureAction,
	LoginSuccessAction,
	RequestLoginAction,
	RequestLogoutAction,
	ShowLoginDialogAction,
} from "./blog/authentication/action-state";
import { LoadBlogPostAction, LoadBlogPostFailureAction, LoadBlogPostSuccessAction } from "./blog/post/index";
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
	| CompletedLogoutAction
	| LoadBlogPostAction
	| LoadBlogPostSuccessAction
	| LoadBlogPostFailureAction;
