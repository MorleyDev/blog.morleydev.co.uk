import { Observable } from "rxjs/Observable";

import { BlogPost, BlogPostDto, BlogPostSummary } from "./blog.model";

export abstract class BlogRepository {
	public abstract search(): Observable<BlogPostSummary>;

	public abstract getById(id: string): Observable<BlogPost>;
	public abstract create(dto: BlogPostDto): Promise<void>;
	public abstract update(id: string, dto: Partial<BlogPostDto>): Promise<void>;
	public abstract delete(id: string): Promise<void>;
}
