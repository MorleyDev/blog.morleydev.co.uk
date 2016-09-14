import * as React from "react";
import { Range } from "immutable";
import { Converter } from "showdown";
import "./presentation.components.scss!";

export interface ILoadingSpinnerProps {
	alt?: string;
	style?: { [key: string]: string | number };
}

function LoadingSpinner({ alt, style }: ILoadingSpinnerProps): JSX.Element {
	return <div className="core-loading-spinner-wrapper">
		<div className="core-loading-spinner" style={style}>
			<div className="sr-only">{alt}</div>
		</div>
	</div>;
}
export { LoadingSpinner };

export interface IImageProps {
	src: string;
	alt?: string;
	style?: { [key: string]: string | number };
}

function Image({ src, alt, style }: IImageProps): JSX.Element {
	return <img src={src} alt={alt} style={style} />;
}
export { Image };

function Markdown({ markdown }: { markdown: string }): JSX.Element {
	const html = (new Converter()).makeHtml(markdown);
	return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}
export { Markdown };

function Pagination(props: { current: number, max: number, min: number, onChange?: (value: number) => void, getHref?: (value: number) => string }): JSX.Element {
	function onChange(value: number): void {
		if (props.onChange != null && value !== props.current) {
			props.onChange(value);
		}
	}

	function getHref(value: number): string {
		return (props.getHref == null || value === props.current)
			? "#"
			: props.getHref(value);
	}

	const pages = Range(props.min, props.max + 1).toArray().map(i => <li key={i} className={`page-item ${i === props.current ? "active" : ""}`}>
		<a className="page-link" href={getHref(i)} onClick={() => onChange(i)}>{i}</a>
	</li>);

	const previous = <li className={`page-item ${props.min === props.current ? "disabled" : ""}`}>
		<a className="page-link" href={getHref(props.current - 1)} aria-label="Previous" onClick={() => onChange(props.current - 1)}>
			<span aria-hidden="true">&laquo; </span>
			<span className="sr-only">Previous</span>
		</a>
	</li>;

	const next = <li className={`page-item ${props.max === props.current ? "disabled" : ""}`}>
		<a className="page-link" href={getHref(props.current + 1)} aria-label="Next" onClick={() => onChange(props.current + 1)}>
			<span aria-hidden="true">&raquo; </span>
			<span className="sr-only">Next</span>
		</a>
	</li>;

	return <div className="pagination">{previous} {pages} {next}</div>;
}
export { Pagination };
