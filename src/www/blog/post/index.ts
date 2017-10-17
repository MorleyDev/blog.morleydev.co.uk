import { List } from "immutable";

export type BlogPost = {
	readonly title: string;
	readonly posted: Date;
	readonly markdown: string;
	readonly tags: List<string>;
};
