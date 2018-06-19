'use strict';

const KellnerRouter = require('./KellnerRouter');

const { kellnerApp, kellnerPipeline } = require('../symbols');
const KellnerRoute = require('./KellnerRoute');

const { KellnerPassThrough, KellnerMiddleware } = require('../streams');
const { flatten } = require('../utils');

class Incoming {
	constructor(app) {
		this[kellnerApp] = app;
		this[kellnerPipeline] = new KellnerPassThrough(this.app);
	}

	use(route, ...middlewares) {
		if (!middlewares.length === 0) {
			middlewares = route;
			route = KellnerRoute.rootRoute;
		}

		middlewares = flatten(middlewares);

		if (middlewares.length === 0)
			throw new TypeError('use() requires a middleware function or stream');

		// root middleware
		if (route === KellnerRoute.rootRoute)
			return this._use(KellnerMiddleware.wrap(this[kellnerApp], middlewares));

		// routed middleware
		return this._route(route, middlewares);
	}

	_write(data, _, next) {
		this._pipeStart.write(data);
		next();
	}

	_repipe(dst) {
		this[kellnerPipeline] = this[kellnerPipeline].pipe(dst);
	}

	_route(route, middlewares) {
		const stream = KellnerMiddleware.wrap(this[kellnerApp], middlewares);

		if (!this[route.name]) {
			this[route.name] = stream;
			this._use(new KellnerRouter(this.app, route, stream));
			return this;
		}

		this[route.name] = this[route.name].pipe(middlewares);

		return this;
	}

	_use(middleware) {
		this._repipe(middleware);
		return this;
	}
}

module.exports = Incoming;
