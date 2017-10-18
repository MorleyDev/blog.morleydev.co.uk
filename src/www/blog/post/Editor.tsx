import { Post } from "./Post";
import * as React from "react";

import { Markdown } from "../../dom/Markdown";
import { BlogPost } from "./index";
import { List } from "immutable";
import { FlatButton, TextField } from "material-ui";

export class Editor extends React.Component<Partial<BlogPost> & { onSave: (post: BlogPost) => void; onCancel: () => void; }, BlogPost> {
	constructor(props: Partial<BlogPost> & { onSave: (post: BlogPost) => void; onCancel: () => void; }) {
		super(props);
		this.state = {
			id: props.id || "",
			markdown: props.markdown || "",
			posted: props.posted || new Date(),
			tags: props.tags || List(),
			title: props.title || ""
		};
	}

	public render(): JSX.Element {
		return (<div style={{ position: "relative", width: "100%" }}>
			<div className="section group">
				<div className="col col-cell" style={{ width: "50%" }}>
					<div>
						<TextField
							floatingLabelText="Id Slug"
							fullWidth
							value={this.state.id}
							onChange={(_, id) => this.setState(state => ({ ...state, id }))} />
					</div>
					<div>
						<TextField
							floatingLabelText="Title"
							fullWidth
							value={this.state.title}
							onChange={(_, title) => this.setState(state => ({ ...state, title }))} />
					</div>
					<div>
						<TextField
							floatingLabelText="Body"
							fullWidth
							multiLine
							value={this.state.markdown}
							onChange={(_, markdown) => this.setState(state => ({ ...state, markdown }))} />
					</div>
					<div>
						<TextField
							fullWidth
							floatingLabelText="Tags"
							value={this.state.tags.join(",")}
							onChange={(_, tags) => this.setState(state => ({ ...state, tags: List(tags.split(",")) }))} />
					</div>
				</div>
				<div className="col col-cell" style={{ width: "50%" }}>
					<Post
						id={this.state.id}
						markdown={this.state.markdown}
						posted={this.state.posted}
						tags={this.state.tags.map(f => f.trim()).filter(f => f.length > 0)}
						title={this.state.title}
					/>
				</div>
			</div>
			<div className="section group">
				<FlatButton
					primary label="Save"
					disabled={this.isSaveDisabled(this.state)}
					onTouchTap={() => this.props.onSave({ ...this.state, tags: this.state.tags.map(f => f.trim()).filter(f => f.length > 0) })} />
				<FlatButton
					secondary label="Cancel"
					onTouchTap={() => this.props.onCancel()} />
			</div>
		</div>);
	}

	private isSaveDisabled(state: BlogPost): boolean {
		return state.id.trim().length === 0
			|| state.title.trim().length === 0
			|| state.tags.count() === 0
			|| state.tags.some(tag => tag.trim().length === 0)
			|| state.markdown.trim().length === 0;
	}
}
