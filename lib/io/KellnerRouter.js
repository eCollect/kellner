'use strict';

const { KellnerTransform } = require('../streams');

module.exports = class KellnerRouter extends KellnerTransform {
	constructor(app, route, dest) {
		super(app);
		this.route = route;
		this.dest = dest;
	}

	_transform(message, encoding, next) {
		if (message[this.app.symbols.kellnerRoute] === this.route)
			this.dest.write(message);
		next(null, message);
	}
};

