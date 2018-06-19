'use strict';

const {
	PassThrough,
	Transform,
	Writable,
	Stream,
} = require('stream');

const { kellnerErrorStream } = require('./symbols');

class UnhandeledErrorsStream extends Writable {
	constructor() {
		super({ objectMode: true });
	}

	_write(err, _, next) { // eslint-disable-line
		this.emit('error', err);
		next();
	}
}

class ErrorHandler extends Transform {
	constructor(handler) {
		super({ objectMode: true });
		this.handler = handler;
	}

	_transform(err, _, next) {
		this.handler(err, e => this.push(e || err));
		next();
	}
}

module.exports = class ErrorStream extends PassThrough {
	constructor() {
		super({ objectMode: true });
		this._lastHandler = this;
	}

	init(parent) {
		if (!parent)
			return this._addErrorHandler(new UnhandeledErrorsStream());
		return this._addErrorHandler(parent[kellnerErrorStream]);
	}

	addErrorHandler(handler) {
		if (handler[kellnerErrorStream])
			return this._addErrorHandler(handler[kellnerErrorStream]);

		if (handler instanceof Stream)
			return this._addErrorHandler(handler);

		return this._addErrorHandler(new ErrorHandler(handler));
	}

	_addErrorHandler(handler) {
		this._lastHandler = this._lastHandler.pipe(handler);
		return this;
	}
};
