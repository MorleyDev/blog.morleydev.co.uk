import * as React from "react";
import { BlogPost as BlogPostModel, BlogPostSummary as BlogPostSummaryModel } from "./models.ts";
import { Markdown } from "../core/presentation.components.tsx";

function BlogPost(props: { post: BlogPostModel; }): JSX.Element {
	function InnerBlogPost(innerProps: BlogPostModel): JSX.Element {
		return <div className="blog-post">
			<h1>{innerProps.title}</h1>
			<BlogPostDetails posted={props.post.posted} tags={props.post.tags} />
			<div className="blog-post-content">
				<Markdown markdown={innerProps.markdown} />
			</div>
		</div>;
	}

	return <InnerBlogPost
		key={props.post.id}
		id={props.post.id}
		title={props.post.title}
		markdown={props.post.markdown}
		posted={props.post.posted}
		tags={props.post.tags}
	/>;
}
export { BlogPost };

function BlogPostDetails(props: { posted: Date, tags: string[] }): JSX.Element {
	return <div className="blog-post-details text-muted">
		{props.posted.toString()} {props.tags.length > 0 && <span>on {props.tags.join(", ")}</span>}
	</div>;
}
export { BlogPostDetails };

function BlogPostNotFound(props: { id: string }): JSX.Element {
	return <div className="blog-post-not-found alert alert-danger">
		<h1>Post '{props.id}' not found</h1>
		<p>Could not load any blog post with the id {props.id}.</p>
		<p>Click <a className="alert-link" href="/">here</a> to return to the home screen.</p>
	</div>;
}
export { BlogPostNotFound };

function BlogPostSummary(props: { post: BlogPostSummaryModel, noLink?: boolean }): JSX.Element {
	return <div className="blog-post-summary">
		<h2>
			{props.noLink == null || !props.noLink
				? <a className="h2" href={`/blog/post/${props.post.id}`}>{props.post.title}</a>
				: props.post.title
			}
		</h2>
		<BlogPostDetails posted={props.post.posted} tags={props.post.tags} />
		<Markdown markdown={props.post.summary} />
	</div>;
}
export { BlogPostSummary };

function BlogArchiveNotFound(props: { page: number }): JSX.Element {
	return <div className="blog-post-not-found alert alert-danger">
		<h1>Archive page '{props.page}' not found</h1>
		<p>Could not locate load the page {props.page}.</p>
		<p>Click <a className="alert-link" href="/">here</a> to return to the home screen.</p>
	</div>;
}
export { BlogArchiveNotFound };

function BlogArchive(props: { posts: BlogPostSummaryModel[] }): JSX.Element {
	return <div className="blog-archive">
		{props.posts.sort((a,b) => b.posted.valueOf() - a.posted.valueOf()).map((post, i) => <BlogPostSummary key={i} post={post} />)}
	</div>;
}
export { BlogArchive };
