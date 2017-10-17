export type BlogPostSummary = {
	id: string;
	title: string;
	summary: string;
	posted: string;
	tags: string[];
};

export type BlogPostDto = {
	id: string;
	title: string;
	posted: string;
	summary: string;
	markdown: string;
	tags: string[];
};

export type BlogPost = {
	title: string;
	markdown: string;
	posted: string;
	tags: string[];
};
