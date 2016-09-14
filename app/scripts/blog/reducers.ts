import { declareReducer } from "../declare.ts";
import * as actions from "./actions.ts";
import * as assign from "../util/assign.ts";

export const onShowBlogPost = declareReducer<string>(
	actions.SHOW_BLOG_POST,
	(state, action) => assign.deep(state, { blog: { activePost: action } })
);

export const onUnloadBlogPost = declareReducer(
	actions.UNLOAD_BLOG_POST,
	state => assign.deep(state, { blog: { activePost: null } })
);

export const onShowBlogArchive = declareReducer<number>(
	actions.SHOW_BLOG_ARCHIVE,
	(state, action) => assign.deep(state, { blog: { activeArchivePage: action } })
);

export const onUnloadBlogArchive = declareReducer(
	actions.UNLOAD_BLOG_ARCHIVE,
	state => assign.deep(state, { blog: { activeArchivePage: null } })
);

export const onShowBlogAdmin = declareReducer(
	actions.SHOW_BLOG_ADMIN,
	state => assign.deep(state, { blog: { showAdminPanel: true }})
);

export const onUnloadBlogAdmin = declareReducer(
	actions.UNLOAD_BLOG_ADMIN,
	state => assign.deep(state, { blog: { showAdminPanel: false }})
);