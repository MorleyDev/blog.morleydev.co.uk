import * as React from "react";

import { Markdown } from "../../dom/Markdown";
import { BlogPost } from "./index";

export const Post = ({ title, tags, markdown, posted }: BlogPost) => (
	<article>
		<section>
			<h1>{title}</h1>
		</section>
		<section>Posted on {posted.toISOString()}</section>
		<section><Markdown markdown={markdown} /></section>
		<section># {tags.join(", ")}</section>
	</article>
);
