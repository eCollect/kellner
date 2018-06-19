'use strict';

const { Stream } = require('stream');

const KellnerTransform = require('./KellnerTransform');

class KellnerMiddleware extends KellnerTransform {
	constructor(app, middleware) {
		super(app);
		this.middleware = middleware;
	}

	_transform(message, encoding, next) {
		this.middleware(message, (err, msg) => next(err, msg || message));
	}

	static wrap(app, middleware) {
		if (Array.isArray(middleware))
			return middleware.reduce((concatedMiddleware, md) => {
				const wrappedMiddleware = KellnerMiddleware.wrap(app, md);
				return concatedMiddleware ? concatedMiddleware.pipe(wrappedMiddleware) : wrappedMiddleware;
			}, null);

		if (KellnerMiddleware.isValid(middleware))
			throw new TypeError('middleware must to be a function or a stream');

		// it is a stream alredy
		if (middleware instanceof Stream)
			return middleware;
		return new KellnerMiddleware(app, middleware);
	}

	static isValid(middleware) {
		return typeof middleware === 'function' || middleware instanceof Stream;
	}
}

module.exports = KellnerMiddleware;
