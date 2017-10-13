import { readFile } from "fs";

export function render(filePath: string): Promise<string> {
	return new Promise((resolve, reject) =>
		readFile(filePath, { "encoding": "utf8" }, (err, data) => err == null ? resolve(data) : reject(err)));
}
