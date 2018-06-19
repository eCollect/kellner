'use strict';

const { PassThrough } = require('stream');

const { kellnerApp } = require('../symbols');

module.exports = class KellnerPassThrough extends PassThrough {
	constructor(app) {
		super({ objectMode: true });
		this[kellnerApp] = app;
		this.on('error', e => this[kellnerApp].fail(e));
		this.on('disconnect', e => this[kellnerApp].fail(e));
	}
};
