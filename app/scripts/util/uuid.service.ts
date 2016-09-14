export interface IUuidService {
	generate(): string;
}

export class UuidService {
	private static generator: () => string = UuidService.isCryptoSupported()
			? UuidService.generateCrypto
			: UuidService.generateRandom;

	private static isCryptoSupported(): boolean {
		return typeof window !== "undefined"
			&& typeof (window.crypto) !== "undefined"
			&& typeof (window.crypto.getRandomValues) !== "undefined";
	}

	private static generateCrypto(): string {
		let d = Date.now();
		if (window.performance && typeof window.performance.now === "function") {
			d += performance.now();
		}

		const buf = new Uint16Array(8);
		window.crypto.getRandomValues(buf);
		const S4 = (num: number): string => {
			/* tslint:disable */
			num = ((num + d) | 0) % 0xFFFF;
			/* tslint:enable */
			d = Math.floor(d / 64);

			let ret = num.toString(16);
			while (ret.length < 4) {
				ret = "0" + ret;
			}
			return ret;
		};
		return `${S4(buf[0])}${S4(buf[1])}-${S4(buf[2])}-${S4(buf[3])}-${S4(buf[4])}-${S4(buf[5])}${S4(buf[6])}${S4(buf[7])}`;
	}

	private static generateRandom(): string {
		let d = Date.now();
		if (typeof window !== "undefined" && window.performance && typeof window.performance.now === "function") {
			d += performance.now();
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
			/* tslint:disable */
			const r = ((d + Math.random() * 16) % 16) | 0;
			d = Math.floor(d / 16);

			const v = (c === "x") ? r : (r & 0x3 | 0x8);
			return v.toString(16);
			/* tslint:enable */
		});
	}

	public generate(): string {
		return UuidService.generator();
	}
}
