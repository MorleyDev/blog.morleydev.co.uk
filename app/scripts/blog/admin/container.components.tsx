import { IBlogService } from "../service.ts";
import { LoadingSpinner, Pagination } from "../../core/presentation.components.tsx";
import { BlogArchiveNotFound, BlogPostSummary } from "../presentation.components.tsx";
import { BlogPostSummary as BlogPostSummaryModel } from "../models.ts";
import * as React from "react";
import { Subscription } from "rxjs";

enum Mode {
	Browse,
	Edit,
	Create
}

export class BlogAdminPanels extends React.Component<{ service: IBlogService }, { mode: Mode; editId?: string; }> {
	constructor(props: { service: IBlogService }) {
		super(props);

		this.state = { mode: Mode.Browse };
	}

	public render(): JSX.Element {
		return <div className="blog-admin">
			<h1>Blog Admin</h1>
			{this.state.mode === Mode.Browse && <BlogAdminBrowserPanel
				service={this.props.service}
				onEdit={id => this.setState(state => Object.assign({}, state, { mode: Mode.Edit, editId: id }))}
				onDelete={id => this.props.service.deletePost(id)}
				/>}
			{this.state.mode === Mode.Edit && <p>TODO: Edit post {this.state.editId}</p>}
			{this.state.mode === Mode.Create && <p>TODO: Create new post</p>}
		</div>;
	}
}

export class BlogAdminBrowserPanel extends React.Component<{ onEdit: (id: string) => void; onDelete: (id: string) => void; service: IBlogService; }, {
	page: number;
	totalPages?: number;
	archive?: BlogPostSummaryModel[];
	isLoading: boolean;
}> {
	private subscriptions: Subscription[];

	constructor(props: { onEdit: (id: string) => void; onDelete: (id: string) => void; service: IBlogService; }) {
		super(props);

		this.state = { page: 0, isLoading: true };
	}

	public componentWillMount() {
		const self = this;
		this.subscriptions = [
			this.props.service.getSummaries(this.state.page, 30)
				.subscribe({
					next(page) {
						self.setState(state => Object.assign({}, state, { archive: page, isLoading: false  }));
					},
					error(err: Error) {
						console.error(err);
						self.setState(state => Object.assign({}, state, { isLoading: false }));
					}
				}),
			this.props.service.getTotalPostCount()
				.take(1)
				.subscribe(page => self.setState(state => Object.assign({}, state, { totalPages: page }))),
		];
	}

	public componentWillUnmount() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	public render(): JSX.Element {
		if (this.state.archive == null) {
			return this.state.isLoading
				? <LoadingSpinner alt={`Loading`} style={{ margin: "0 auto" }} />
				: <BlogArchiveNotFound page={this.state.page} />;
		}

		return <div className="blog-admin-browser">
			<div className="blog-archive">
				{this.state.archive.map((post, i) => <div key={i}>
					<div className="pull-right">
						<button className="btn btn-primary m-x-1" onClick={() => this.props.onEdit(post.id)}>Edit</button>
						<button className="btn btn-danger m-x-1">Delete</button>
					</div>
					<BlogPostSummary post={post} noLink />
				</div>)}
			</div>;

			{this.state.totalPages != null && <Pagination
				current={this.state.page + 1}
				onChange={value => this.setState(state => Object.assign({}, state, { page: value }))}
				min={1}
				max={this.state.totalPages}
				/>
			}
		</div>;
	}
}
