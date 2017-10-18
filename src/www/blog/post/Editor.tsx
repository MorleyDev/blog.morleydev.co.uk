import { Post } from "./Post";
import * as React from "react";

import { Markdown } from "../../dom/Markdown";
import { BlogPost } from "./index";
import { List } from "immutable";
import { FlatButton } from "material-ui";

export class Editor extends React.Component<Partial<BlogPost> & { onSave: (post: BlogPost) => void; onCancel: () => void; }, BlogPost> {
	constructor(props: Partial<BlogPost> & { onSave: (post: BlogPost) => void; onCancel: () => void; }) {
		super(props);
		this.state = {
			markdown: props.markdown || "",
			posted: props.posted || new Date(),
			tags: props.tags || List(),
			title: props.title || ""
		};
	}

	public render(): JSX.Element {
		return (<div>
			<div>
			<input value={this.state.title} onChange={(p) => this.setState(({ ...this.state, title: p.target.value }))} />
			<textarea value={this.state.markdown} onChange={(p) => this.setState(({ ...this.state, markdown: p.target.value }))} />
			<input value={this.state.tags.join(",")} onChange={(p) => this.setState(({ ...this.state, tags: List(p.target.value.split(",")).map(t => t.trim()) }))} />
			</div>
			<div>
			<Post markdown={this.state.markdown} posted={this.state.posted} tags={this.state.tags} title={this.state.title} />
			</div>
			<div>
				<FlatButton primary onClick={() => this.props.onSave(this.state)}>Save</FlatButton>
				<FlatButton secondary onClick={() => this.props.onCancel()}>Cancel</FlatButton>
			</div>
		</div>);
	}
}
