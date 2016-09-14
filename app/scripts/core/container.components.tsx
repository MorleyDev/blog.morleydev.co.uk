import { Image as InnerImageElement, LoadingSpinner } from "./presentation.components.tsx";
import * as React from "react";
import { Observable, Subscriber, Subscription } from "rxjs";

export interface IImageProps {
	src: string;
	alt?: string;
	style?: { [key: string]: string | number };
}

export class ImageElement extends React.Component<IImageProps, { loaded: boolean }> {
	private subscription: Subscription;

	constructor(props: IImageProps) {
		super(props);

		this.state = { loaded: false };

		this.subscription = ImageElement.LoadImage(props.src)
			.retryWhen(err => err.delay(5000))
			.subscribe(img => this.setState(state => Object.assign({}, state, { loaded: true })));
	}

	private static LoadImage(src: string): Observable<HTMLImageElement> {
		return new Observable<HTMLImageElement>((subscriber: Subscriber<HTMLImageElement>) => {
			const img = new Image();
			img.onload = () => {
				subscriber.next(img);
				subscriber.complete();
			};
			img.onerror = err => {
				subscriber.error(err);
			};
			img.src = src;
		});
	}

	public componentWillUnmount(): void {
		this.subscription.unsubscribe();
	}

	public render(): JSX.Element {
		return this.state.loaded
			? <InnerImageElement src={this.props.src} alt={this.props.alt} style={this.props.style} />
			: <LoadingSpinner alt={this.props.alt} style={this.props.style} />;
	}
}
