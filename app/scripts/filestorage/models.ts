interface ISettableFileMetadata {
	encoding: string;
	mimeType: string;
}

interface IFileMetadata extends ISettableFileMetadata {
	name: string;
	fileSize: number;
}

interface IUploadProgress {
	percentage: number;
	bytesTransferred: number;
	totalBytes: number;
}

export {
	IFileMetadata,
	ISettableFileMetadata,
	IUploadProgress
};
