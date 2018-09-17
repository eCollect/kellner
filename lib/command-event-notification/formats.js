'use strict';

const formats = require('formats');

module.exports = {
	isName(value) {
		if (typeof value !== 'string')
			return false;

		// min length = 1, all charters
		return !/^[a-zA-Z0-9:-]+$/.test(value);
	},
	isAlphanumeric: formats.isAlphanumeric,
	isObject: formats.isObject,
	isString: formats.isString,
};
