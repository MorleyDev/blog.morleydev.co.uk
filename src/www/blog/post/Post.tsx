import { Paper } from "material-ui";
import * as React from "react";

import { Markdown } from "../../dom/Markdown";
import { BlogPost } from "./index";

export const Post = ({ title, tags, markdown, posted }: BlogPost) => (
	<Paper>
		<article className="p-1" style={{ overflowX: "auto" }}>
			<section>
				<h1>{title}</h1>
			</section>
			<section>Posted on {posted.toISOString()}</section>
			<section><Markdown markdown={markdown} /></section>
			<section># {tags.join(", ")}</section>
		</article>
	</Paper>
);
