export interface ILogger {
	trace(...args: any[]): void;
	log(...args: any[]): void;
	warn(...args: any[]): void;
	error(...args: any[]): void;
}

export class DummyLogger implements ILogger {
	public trace(...args: any[]): void {
		/* no-op */
	}

	public log(...args: any[]): void {
		/* no-op */
	}

	public warn(...args: any[]): void {
		/* no-op */
	}

	public error(...args: any[]): void {
		/* no-op */
	}
}

export class TraceConsoleLogger implements ILogger {
	public trace(...args: any[]): void {
		console.log.apply(null, args);
	}

	public log(...args: any[]): void {
		console.log.apply(null, args);
	}

	public warn(...args: any[]): void {
		console.warn.apply(null, args);
	}

	public error(...args: any[]): void {
		console.error.apply(null, args);
	}
}

export class ProductionConsoleLogger implements ILogger {
	public trace(...args: any[]): void {
		/* no-op */
	}

	public log(...args: any[]): void {
		/* no-op */
	}

	public warn(...args: any[]): void {
		console.warn.apply(null, args);
	}

	public error(...args: any[]): void {
		console.error.apply(null, args);
	}
}
