import { declarePath } from "../declare.ts";
import * as actions from "./actions.ts";

export const onHome = declarePath<{}>("/", store => {
	store.update(actions.SHOW_BLOG_ARCHIVE, 0);

	return () => store.update(actions.UNLOAD_BLOG_ARCHIVE, 0);
});

export const onBlogPostView = declarePath<string>("/blog/post/{id}", (store, data) => {
	store.update(actions.SHOW_BLOG_POST, data);

	return () => store.update(actions.UNLOAD_BLOG_POST, data);
});

export const onBlogArchiveView = declarePath<string>("/blog/archive/{index}", (store, data) => {
	store.update(actions.SHOW_BLOG_ARCHIVE, parseInt(data, 10));

	return () => store.update(actions.UNLOAD_BLOG_ARCHIVE, parseInt(data, 10));
});

export const onBlogArchiveRootView = declarePath<string>("/blog/archive", (store, data) => {
	store.update(actions.SHOW_BLOG_ARCHIVE, 0);

	return () => store.update(actions.UNLOAD_BLOG_ARCHIVE, 0);
});

export const onBlogAdminView = declarePath<string>("/blog/admin", (store, data) => {
	store.update(actions.SHOW_BLOG_ADMIN, 0);

	return () => store.update(actions.UNLOAD_BLOG_ADMIN, 0);
});
