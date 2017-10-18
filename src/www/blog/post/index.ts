import { List } from "immutable";
import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";

import { AppAction } from "../../app-action.model";
import { AppState } from "../../app-state.model";

export type BlogPost = {
	readonly id: string;
	readonly title: string;
	readonly posted: Date;
	readonly markdown: string;
	readonly tags: List<string>;
};

export type LoadBlogPostAction = {
	readonly type: "Blog@@LoadBlogPost";
	readonly target: string;

	readonly onLoad: (state: AppState, blogPost: BlogPost) => AppState;
};
export const LoadBlogPostAction = "Blog@@LoadBlogPost";

export type LoadBlogPostSuccessAction = {
	readonly type: "Blog@@LoadBlogPost@@Success";
	readonly blogPost: BlogPost;
	readonly onLoad: (state: AppState, blogPost: BlogPost) => AppState;
};
export const LoadBlogPostSuccessAction = "Blog@@LoadBlogPost@@Success";

export type LoadBlogPostFailureAction = {
	readonly type: "Blog@@LoadBlogPost@@Failure";
	readonly target: string;
};
export const LoadBlogPostFailureAction = "Blog@@LoadBlogPost@@Failure";

export type CreateNewBlogPostAction = {
	readonly type: "Blog@@CreateNewBlogPost";
	readonly post: BlogPost;
};
export const CreateNewBlogPostAction = "Blog@@CreateNewBlogPost";

export type CreateNewBlogPostSuccessAction = {
	readonly type: "Blog@@CreateNewBlogPost@@Success";
	readonly post: BlogPost;
};
export const CreateNewBlogPostSuccessAction = "Blog@@CreateNewBlogPost@@Success";

export const blogPostLoadingReducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case LoadBlogPostSuccessAction:
			return action.onLoad(state, action.blogPost);
		default:
			return state;
	}
};

export const blogPostLoadingEpic = (actions$: Observable<AppAction>) => merge(
	actions$
		.filter(action => action.type === LoadBlogPostAction)
		.switchMap((action: LoadBlogPostAction) =>
			fetch(`/api/blog/${action.target}`)
				.then(response => response.json())
				.then(post => ({ ...post, id: action.target } as BlogPost))
				.then(blogPost => ({
					type: LoadBlogPostSuccessAction,
					blogPost,
					onLoad: action.onLoad
				}))
				.catch(err => ({
					type: LoadBlogPostFailureAction,
					target: action.target
				}))
		)
);
