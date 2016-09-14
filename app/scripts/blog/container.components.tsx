import { IBlogService } from "./service.ts";
import { BlogPost as InnerBlogPost, BlogPostNotFound, BlogArchive as InnerBlogArchive, BlogArchiveNotFound } from "./presentation.components.tsx";
import { BlogPost as BlogPostModel, BlogPostSummary, IBlogState } from "./models.ts";
import { BlogAdminPanels } from "./admin/container.components.tsx";
import { LoadingSpinner, Pagination } from "../core/presentation.components.tsx";
import { IAuthorisationState, AuthorisationRole } from "../authorisation/models.ts";
import * as React from "react";
import { Subscription } from "rxjs";

export class BlogPost extends React.Component<{ id: string; service: IBlogService; }, { blogPost?: BlogPostModel, isLoading: boolean }> {
	private subscription: Subscription;

	constructor(props: { id: string; service: IBlogService; }) {
		super(props);

		this.state = { isLoading: true };
	}

	public componentWillMount() {
		const self = this;
		this.subscription = this.props.service.getPost(this.props.id)
			.take(1)
			.subscribe({
				next(post) {
					self.setState(state => Object.assign({}, state, { blogPost: post }));
				},
				error(err: Error) {
					console.error(err);
					self.setState(state => Object.assign({}, state, { isLoading: false }));
				},
				complete() {
					self.setState(state => Object.assign({}, state, { isLoading: false }));
				}
			});
	}

	public componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	public render(): JSX.Element {
		if (this.state.blogPost == null) {
			return this.state.isLoading
				? <LoadingSpinner alt={`Loading`} style={{ margin: "0 auto" }} />
				: <BlogPostNotFound id={this.props.id} />;
		}

		return <InnerBlogPost post={this.state.blogPost} />;
	}
}

export class ArchivePagination extends React.Component<{ page: number; pageSize: number; onChange: (index: number) => void; service: IBlogService; }, { pageCount?: number }> {
	private subscription: Subscription;

	constructor(props: { page: number; pageSize: number; onChange: (index: number) => void; service: IBlogService; }) {
		super(props);

		this.state = {};
	}

	public componentWillMount() {
		this.subscription = this.props.service.getTotalPostCount()
			.subscribe(count => this.setState(state => Object.assign({}, state, { pageCount: count })));
	}

	public componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	public render(): JSX.Element {
		if (this.state.pageCount == null) {
			return <span />;
		}

		return <Pagination
			current={this.props.page + 1}
			min={1}
			max={Math.ceil(this.state.pageCount / this.props.pageSize)}
			onChange={index => this.props.onChange(index)}
			/>;
	}
}

export class BlogArchive extends React.Component<{ page: number; pageSize: number; service: IBlogService; }, { archive?: BlogPostSummary[], isLoading: boolean }> {
	private subscription: Subscription;

	constructor(props: { page: number; pageSize: number; service: IBlogService; }) {
		super(props);

		this.state = { isLoading: true };
	}

	public componentWillMount() {
		const self = this;
		this.subscription = this.props.service.getSummaries(this.props.page, this.props.pageSize)
			.take(1)
			.subscribe({
				next(page) {
					self.setState(state => Object.assign({}, state, { archive: page }));
				},
				error(err: Error) {
					console.error(err);
					self.setState(state => Object.assign({}, state, { isLoading: false }));
				},
				complete() {
					self.setState(state => Object.assign({}, state, { isLoading: false }));
				}
			});
	}

	public componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	public render(): JSX.Element {
		if (this.state.archive == null) {
			return this.state.isLoading
				? <LoadingSpinner alt={`Loading`} style={{ margin: "0 auto" }} />
				: <BlogArchiveNotFound page={this.props.page} />;
		}

		return <InnerBlogArchive posts={this.state.archive} />;
	}
}

export function ActiveBlogArchive(props: { data: IBlogState; pageSize: number; service: IBlogService; onChangeBlogPage: (page: number) => void; }): JSX.Element {
	return props.data.activeArchivePage != null && <div>
		<BlogArchive page={props.data.activeArchivePage} pageSize={props.pageSize} service={props.service} />
		<div className="text-xs-center">
			<ArchivePagination
				page={props.data.activeArchivePage}
				pageSize={props.pageSize}
				service={props.service}
				onChange={index => props.onChangeBlogPage(index)}
				/>
		</div>
	</div>;
}

export function ActiveBlogPost(props: { data: IBlogState; service: IBlogService; }): JSX.Element {
	return props.data.activePost != null && <BlogPost id={props.data.activePost} service={props.service} />;
}

export function ActiveBlogAdmin(props: { authorisation: IAuthorisationState; data: IBlogState; service: IBlogService }): JSX.Element {
	return props.data.showAdminPanel
		&& props.authorisation.role === AuthorisationRole.Admin
		&& <BlogAdminPanels service={props.service} />;
}
