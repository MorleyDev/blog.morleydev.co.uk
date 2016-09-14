export class BlogPost {
	public id: string;
	public title: string;
	public markdown: string;
	public posted: Date;
	public tags: string[];
}

export class BlogPostSummary {
	public id: string;
	public title: string;
	public summary: string;
	public posted: Date;
	public tags: string[];
}

export interface IBlogState {
	activePost: string | null;
	activeArchivePage: number | null;
	showAdminPanel: boolean;
}

export function create(): IBlogState {
	return {
		activePost: null,
		activeArchivePage: null,
		showAdminPanel: false
	};
}
