import { Observable, Subscriber } from "rxjs";

export interface INavigation {
	navigateTo(newUrl: string): void;
	current(): string;
	observe(): Observable<string>;
}

export class BrowserNavigation implements INavigation {
	private redirect: (url: string) => void;
	private currentPath: () => string;

	constructor(redirect: (url: string) => void, currentPath: () => string) {
		this.redirect = redirect;
		this.currentPath = currentPath;
	}

	public navigateTo(newUrl: string): void {
		if (this.currentPath() === newUrl) {
			return;
		}
		this.redirect(newUrl);
	}

	public current(): string {
		return this.currentPath();
	}

	public observe(): Observable<string> {
		return new Observable<string>((observer: Subscriber<string>) => {
			observer.next( this.current() );
		});
	}
}

export class HashNavigation implements INavigation {
	private getHash: () => string;
	private setHash: (newHash: string) => void;
	private onHashChange: (callback: (ev: HashChangeEvent) => void) => void;
	private callbacks: ((newUrl: string) => void)[] = [];

	constructor(
		getHash: () => string,
		setHash: (newHash: string) => void,
		onHashChange: (callback: (ev: HashChangeEvent) => void) => void
	) {
		this.getHash = getHash;
		this.setHash = setHash;
		this.onHashChange = onHashChange;

		this.onHashChange((ev: HashChangeEvent) => {
			const currentHash = this.getHash();
			const newUrl = currentHash.substr(2);
			this.callbacks.forEach(cb => cb(newUrl));
		});
	}

	public navigateTo(newUrl: string): void {
		if (this.current() === newUrl) {
			return;
		}

		this.setHash( `#!${newUrl}` );
	}

	public current(): string {
		const currentHash = this.getHash();
		return currentHash.startsWith("#!/")
			? currentHash.substr(2)
			: "/";
	}

	public observe(): Observable<string> {
		return new Observable<string>((observer: Subscriber<string>) => {
			const onChange = (url: string) => observer.next(url);
			onChange(this.current());
			this.callbacks.push(onChange);

			return () => this.callbacks = this.callbacks.filter(cb => cb !== onChange);
		});
	}
}

export class HistoryStateNavigation implements INavigation {
	private onPopState: (callback: (ev: PopStateEvent) => void) => void;
	private pushState: (data?: any, title?: string, newUrl?: string) => void;
	private getCurrentPath: () => string;
	private callbacks: ((newUrl: string) => void)[] = [];

	constructor(
		onPopState: (callback: (ev: PopStateEvent) => void) => void,
		pushState: (data?: any, title?: string, newUrl?: string) => void,
		getCurrentPath: () => string
	) {
		this.onPopState = onPopState;
		this.pushState = pushState;
		this.getCurrentPath = getCurrentPath;

		this.onPopState((ev: PopStateEvent) => {
			this.callbacks.forEach(cb => cb(this.getCurrentPath()));
		});
	}

	public navigateTo(newUrl: string): void {
		if (this.current() === newUrl) {
			return;
		}

		this.pushState({ }, undefined, newUrl);
		this.callbacks.forEach(cb => cb(newUrl));
	}

	public current(): string {
		return this.getCurrentPath();
	}

	public observe(): Observable<string> {
		return new Observable<string>((observer: Subscriber<string>) => {
			const onChange = (url: string) => observer.next(url);
			onChange(this.current());
			this.callbacks.push(onChange);

			return () => this.callbacks = this.callbacks.filter(cb => cb !== onChange);
		});
	}
}

export class AnchorOverridingNavigation implements INavigation {
	private inner: INavigation;
	private onDocumentClick: (callback: (ev: MouseEvent) => void) => void;

	public constructor(inner: INavigation, onDocumentClick: (callback: (ev: MouseEvent) => void) => void) {
		this.inner = inner;
		this.onDocumentClick = onDocumentClick;

		this.onDocumentClick(ev => {
			const targetElement = ev.target as HTMLElement;
			if (targetElement.tagName == null || targetElement.tagName.toLowerCase() !== "a") {
				return;
			}

			const targetAnchor = targetElement as HTMLAnchorElement;
			const targetHref = targetAnchor.getAttribute("href");
			if (targetHref == null || !targetHref.startsWith("/")) {
				return;
			}

			ev.preventDefault();
			this.navigateTo(targetHref);
		});
	}

	public navigateTo(newUrl: string): void {
		return this.inner.navigateTo(newUrl);
	}

	public current(): string {
		return this.inner.current();
	}

	public observe(): Observable<string> {
		return this.inner.observe();
	}
}
