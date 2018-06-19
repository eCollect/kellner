'use strict';

const { Transform } = require('stream');

module.exports = class KellnerTransfrom extends Transform {
	constructor(app) {
		super({ objectMode: true });
		this.app = app;
		this.on('error', e => app.fail(e));
		this.on('disconnect', e => app.fail(e));
	}
};
