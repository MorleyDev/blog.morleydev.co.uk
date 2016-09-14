import { Context } from "./context.ts";
import { NavbarContainer } from "./navbar/container.components.tsx";
import { Element as DevTools } from "./state/devtools.components.tsx";
import { IStateStore } from "./state/store.ts";
import { ActiveBlogPost, ActiveBlogArchive, ActiveBlogAdmin } from "./blog/container.components.tsx";
import { IAppState } from "./state/model.ts";
import { NAVIGATE_TO } from "./navigation/actions.ts";
import * as React from "react";
import { Subscription } from "rxjs";

export class AppContainer extends React.Component<{ context: Context; stateStore: IStateStore<IAppState> }, IAppState | null> {
	private subscription: Subscription;

	constructor(props: any) {
		super(props);

		this.state = null;
	}

	public componentWillMount(): void {
		this.subscription = this.props.stateStore
			.observe()
			.debounceTime(0)
			.subscribe(dto => this.setState(state => dto));
	}

	public componentWillUnmount(): void {
		this.subscription.unsubscribe();
	}

	public render(): JSX.Element {
		return this.state != null && <div className="app-container">
			<NavbarContainer emit={a => this.emit(a)} state={this.state} />
			<div className="m-t-1 container">
				<ActiveBlogPost
					data={this.state.blog}
					service={this.props.context.blog}
					/>

				<ActiveBlogArchive
					data={this.state.blog}
					pageSize={10}
					service={this.props.context.blog}
					onChangeBlogPage={index => this.emit({ action: NAVIGATE_TO, data: `/blog/archive/${index}` })}
					/>

				<ActiveBlogAdmin
					authorisation={this.state.authorisation}
					data={this.state.blog}
					service={this.props.context.blog}
					/>
			</div>
			<DevTools />
		</div>;
	}

	private emit(action: { action: string; data: any; }): void {
		this.props.stateStore.update(action.action, action.data);
	}
}
