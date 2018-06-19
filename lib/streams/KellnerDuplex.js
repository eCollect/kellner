'use strict';

const { Duplex } = require('stream');

module.exports = class KellnerDuplex extends Duplex {
	constructor(app) {
		super({ objectMode: true });
		this.app = app;
		this.on('error', e => app.fail(e));
		this.on('disconnect', e => app.fail(e));
	}
};
