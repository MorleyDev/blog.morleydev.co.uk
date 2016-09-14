import { Observable, Subscriber } from "rxjs";
import { database } from "firebase";

export interface IDatabaseService {
	query(ref: string): IDatabaseOrderQuery;
	set<T>(ref: string, value: T): Promise<void>;
}

export interface IDatabaseQueryFilter {
	limitToFirst(count: number): IDatabaseQueryFilter;
	limitToLast(count: number): IDatabaseQueryFilter;
	startAt(count: number): IDatabaseQueryFilter;
	endAt(count: number): IDatabaseQueryFilter;
	equalTo(value: string): IDatabaseQueryFilter;

	observe<T>(): Observable<T>;
}

export interface IDatabaseOrderQuery extends IDatabaseQueryFilter {
	orderByChild(node: string): IDatabaseQueryFilter;
	orderByKey(): IDatabaseQueryFilter;
	orderByValue(): IDatabaseQueryFilter;
}

class FirebaseDataOrderFilter {
	private query: database.Query;

	constructor(query: database.Query) {
		this.query = query;
	}

	public limitToFirst(count: number): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.query.limitToFirst(count));
	}

	public limitToLast(count: number): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.query.limitToLast(count));
	}

	public startAt(count: number): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.query.startAt(count));
	}

	public endAt(count: number): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.query.endAt(count));
	}

	public equalTo(value: string): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.query.equalTo(value));
	}

	public observe<T>(): Observable<T> {
		return new Observable<T>((observer: Subscriber<T>) => {
			const listener = (snapshot: database.DataSnapshot) => {
				observer.next(snapshot.val() as T);
			};

			this.query.on("value", listener);
			return () => this.query.off("value", listener);
		}).cache(1);
	}
}

class FirebaseDataOrderQuery extends FirebaseDataOrderFilter implements IDatabaseOrderQuery {
	private ref: database.Reference;

	constructor(ref: database.Reference) {
		super(ref);

		this.ref = ref;
	}

	public orderByChild(node: string): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.ref.orderByChild(node));
	}

	public orderByKey(): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.ref.orderByKey());
	}

	public orderByValue(): IDatabaseQueryFilter {
		return new FirebaseDataOrderFilter(this.ref.orderByValue());
	}
}

export class FirebaseDatabaseService implements IDatabaseService {
	private database: database.Database;

	constructor(db: database.Database) {
		this.database = db;
	}

	public set<T>(ref: string, value: T): Promise<void> {
		const promise = this.database.ref(ref).set(value);

		return Promise.resolve(promise);
	}

	public query(ref: string): IDatabaseOrderQuery {
		return new FirebaseDataOrderQuery(this.database.ref(ref));
	}
}
