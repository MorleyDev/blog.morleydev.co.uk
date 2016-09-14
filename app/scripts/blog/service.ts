import { IDatabaseService } from "../database/service.ts";
import { IFileStorage } from "../filestorage/service.ts";
import { BlogPost, BlogPostSummary } from "./models.ts";
import { Observable, AjaxResponse } from "rxjs";

export interface IBlogService {
	getPost(id: string): Observable<BlogPost>;
	getSummaries(page: number, pageSize: number): Observable<BlogPostSummary[]>;
	getTotalPostCount(): Observable<number>;

	deletePost(id: string): Promise<void>;
}

class BlogPostSummaryDto {
	public summary: string;
	public posted: number;
	public tags: string[] | null;
	public title: string;
}

export class BlogService implements IBlogService {
	private database: IDatabaseService;
	private storage: IFileStorage;

	constructor(database: IDatabaseService, storage: IFileStorage) {
		this.database = database;
		this.storage = storage;
	}

	public getTotalPostCount(): Observable<number> {
		return this.database.query("/blog/postCount").observe<number>();
	}

	public getSummaries(page: number, pageSize: number): Observable<BlogPostSummary[]> {
		return this.database.query("/blog/post/")
			.orderByChild("posted")
			.startAt(page * pageSize)
			.limitToFirst(pageSize)
			.observe<{ [key: string]: BlogPostSummaryDto }>()
			.map(summaries => this.blogPostSummaryDtosToBlogPostSummary(summaries));
	}

	public getPost(id: string): Observable<BlogPost> {
		const getValue = this.database.query(`/blog/post/${id}/`)
			.observe<BlogPostSummaryDto>();

		const getBody = this.storage.get(`/blog/${id}/post.md`)
			.url()
			.flatMap(url => Observable.ajax<AjaxResponse>({
				url: url,
				method: "GET",
				crossDomain: true,
				responseType: "text",
				headers: {
					"Content-Type": ""
				}
			})).map(body => body.response as string);

		return Observable.zip(getValue, getBody).map(([post, markdown]) => {
			const result = new BlogPost();
			result.id = id;
			result.markdown = markdown;
			result.posted = new Date(post.posted);
			result.tags = post.tags || [];
			result.title = post.title;
			return result;
		});
	}

	public deletePost(id: string): Promise<void> {
		const nullify = this.database.set(`/blog/post/${id}`, null);
		const deleteBody = this.storage.get(`/blog/${id}/post.md`).delete().then(() => { /* */ }, err => console.log(err));

		return Promise.all([ nullify, deleteBody ]).then(() => { /* */ });
	}

	private blogPostSummaryDtosToBlogPostSummary(summaries: { [key: string]: BlogPostSummaryDto }): BlogPostSummary[] {
		return Object
			.keys(summaries)
			.map(summaryKey => this.blogPostSummaryDtoToBlogPostSummary(summaryKey, summaries[summaryKey]));
	}

	private blogPostSummaryDtoToBlogPostSummary(id: string, dto: BlogPostSummaryDto): BlogPostSummary {
		return {
			id: id,
			summary: dto.summary,
			tags: dto.tags || [],
			title: dto.title,
			posted: new Date(dto.posted)
		};
	}
}
