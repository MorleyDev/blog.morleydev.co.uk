import { IFileMetadata, ISettableFileMetadata, IUploadProgress } from "./models.ts";
import { Observable, Subscriber } from "rxjs";
import * as firebase from "firebase";

export interface IFileResource {
	getMetadata(): Observable<IFileMetadata>;
	setMetadata(metadata: ISettableFileMetadata): Promise<void>;

	put(file: Blob, metadata: ISettableFileMetadata): Observable<IUploadProgress>;
	url(): Observable<string>;
	delete(): Promise<void>;
}

export interface IFileStorage {
	get(resource: string): IFileResource;
}

class FirebaseResource implements IFileResource {
	private ref: firebase.storage.Reference;

	constructor(ref: firebase.storage.Reference) {
		this.ref = ref;
	}

	public getMetadata(): Observable<IFileMetadata> {
		const promise =  Promise.resolve(this.ref.getMetadata()).then(meta => this.toFileMetadata(meta)) ;

		return Observable.fromPromise(promise);
	}

	public setMetadata(metadata: ISettableFileMetadata): Promise<void> {
		const promise = this.ref.updateMetadata(this.toSettableMetadata(metadata));

		return Promise.resolve(promise);
	}

	public put(file: Blob, metadata: ISettableFileMetadata): Observable<IUploadProgress> {
		return new Observable<IUploadProgress>((subscriber: Subscriber<IUploadProgress>) => {
			const task = this.ref.put(file, this.toUploadMetadata(file, metadata));

			const unsubscribe = task.on(firebase.storage.TaskEvent.STATE_CHANGED, {
				next(snapshot: firebase.storage.UploadTaskSnapshot): void {
					subscriber.next({
						bytesTransferred: snapshot.bytesTransferred,
						percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
						totalBytes: snapshot.totalBytes
					} as IUploadProgress);
				},
				error(error: Error): void {
					subscriber.error(error);
				},
				complete(): void {
					subscriber.complete();
				}
			});

			return () => {
				unsubscribe();
				task.cancel();
			};
		});
	}

	public url(): Observable<string> {
		return Observable.defer(() => Promise.resolve(this.ref.getDownloadURL()));
	}

	public delete(): Promise<void> {
		return Promise.resolve( this.ref.delete() );
	}

	private toFileMetadata(metadata: firebase.storage.FullMetadata): IFileMetadata {
		return {
			name: metadata.name,
			fileSize: metadata.size,
			encoding: metadata.contentEncoding,
			mimeType: metadata.contentType
		};
	}

	private toSettableMetadata(metadata: ISettableFileMetadata): firebase.storage.SettableMetadata {
		return {
			contentType: metadata.mimeType,
			contentEncoding: metadata.encoding,
			cacheControl: "",
			contentDisposition: "",
			contentLanguage: "",
			customMetadata: { }
		};
	}

	private toUploadMetadata(file: Blob, metadata: ISettableFileMetadata): firebase.storage.UploadMetadata {
		return {
			contentType: metadata.mimeType,
			contentEncoding: metadata.encoding,
			cacheControl: "",
			contentDisposition: "",
			contentLanguage: "",
			customMetadata: { },
			md5Hash: null as any as string
		};
	}
}

export class FirebaseFileStorage implements IFileStorage {
	private storage: firebase.storage.Storage;

	constructor(app: firebase.app.App) {
		this.storage = app.storage();
	}

	public get(resource: string): IFileResource {
		return new FirebaseResource(this.storage.ref().child(resource));
	}
}
