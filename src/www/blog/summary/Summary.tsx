import { Markdown } from "../../dom/Markdown";
import { BlogPostSummary } from "./index";
import * as React from "react";

export const Summary = ({ summary }: { summary: BlogPostSummary }) => (
	<article>
		<section>
			<h1>{summary.title}</h1>
		</section>
		<section>
			<Markdown markdown={summary.summary} />
		</section>
		<section>
			Posted on {summary.posted.toISOString()}, {summary.tags.join(", ")}
		</section>
	</article>
);
