'use strict';

module.exports = logger => (error, next) => {
	logger.fatal(error);
	// some loggers do need time to write their logs
	process.nextTick(() => next(error));
};
