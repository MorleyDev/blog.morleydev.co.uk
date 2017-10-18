import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { Database, verbose } from "sqlite3";

import { BlogRepository } from "./blog-repository";
import { BlogPost, BlogPostDto, BlogPostSummary } from "./blog.model";

export class Sqlite3BlogRepository implements BlogRepository {
	private readonly database$: Observable<Database>;

	constructor() {
		verbose();

		const db = new Database(":memory:");
		this.database$ = Observable.fromPromise(new Promise((resolve, reject) => {
			db.run(`CREATE TABLE blogposts (id TEXT, title TEXT, markdown TEXT, posted TEXT, summary TEXT, tags TEXT)`, err => err
				? reject(err)
				: resolve(db));
		}));
	}

	public search(): Observable<BlogPostSummary> {
		return this.sqlGet<BlogPostSummary & { tags: string }>(`SELECT id, title, summary, posted, tags FROM blogposts`, {})
			.map(summary => ({
				...summary,
				tags: summary.tags.split(",")
			}));
	}

	public getById(id: string): Observable<BlogPost> {
		return this.sqlGet<BlogPost & { tags: string }>(`SELECT title, markdown, posted, tags FROM blogposts WHERE id = ?`, [id])
			.map(post => ({
				...post,
				tags: post.tags.split(",")
			}));
	}

	public async create(post: BlogPostDto): Promise<void> {
		const dto = {
			id: post.id,
			title: post.title,
			markdown: post.markdown,
			posted: new Date(post.posted).toISOString(),
			summary: post.summary,
			tags: post.tags.join(",")
		};

		await this.sql<{}>((database, observer) => {
			database.run(`
				INSERT INTO blogposts (id, title, markdown, posted, summary, tags)
				VALUES (?, ?, ?, ?, ?, ?)
			`, [dto.id, dto.title, dto.markdown, dto.posted, dto.summary, dto.tags], err => {
					if (err) {
						observer.error(err);
					} else {
						observer.next({});
						observer.complete();
					}
				}
			);
		}).toPromise();
	}

	public async update(id: string, dto: Partial<BlogPostDto>): Promise<void> {
		let sql = "UPDATE blogposts SET";
		sql += dto.markdown ? " markdown = ?" : "";
		sql += dto.posted ? " posted = ?" : "";
		sql += dto.summary ? " summary = ?" : "";
		sql += dto.tags ? " tags = ?" : "";
		sql += dto.title ? " title = ?" : "";
		sql += " WHERE id = $id";
		await this.sql<{}>((database, observer) => {
			database.run(sql, [
				dto.markdown,
				dto.posted,
				dto.summary,
				dto.tags,
				dto.title
			].filter(i => i != null), (err) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next({});
					observer.complete();
				}
			});
		});
	}

	public async delete(id: string): Promise<void> {
		await this.sql<{}>((database, observer) => {
			database.run("DELETE FROM blogposts WHERE id = $id", { id }, (err) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next({});
					observer.complete();
				}
			});
		});
	}

	private sqlGet<T>(select: string, args: any): Observable<T> {
		return this.sql<T>((database, observer: Observer<T>) => {
			database.all(select, args, (err, rows) => {
				if (err) {
					observer.error(err);
				} else {
					rows.forEach(row => observer.next(row));
					observer.complete();
				}
			});
		});
	}

	private sql<T>(act: (db: Database, observer: Observer<T>) => (void | (() => void))): Observable<T> {
		return this.database$.mergeMap(database => {
			return Observable.create((observer: Observer<T>) => act(database, observer));
		});
	}
}
