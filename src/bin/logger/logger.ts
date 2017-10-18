import * as logger from "winston";

logger.configure({
	level: "debug",
	transports: [
		new logger.transports.Console({ colorize: true })
	]
});

export const logdebug = logger.debug;
export const loginfo = logger.info;
export const logwarn = logger.warn;
export const logerr = logger.error;
