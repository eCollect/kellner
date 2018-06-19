'use strict';

class KellnerRoute {
	constructor(route) {
		if (typeof route === 'string') {
			this.path = route;
			this.name = route;
		} else {
			if (!('path' in route))
				throw new Error('KellnerRoute must have atleat a path');
			this.path = route.path;
			this.name = route.name || this.path;
		}
	}
}

KellnerRoute.rootRoute = new KellnerRoute('');

module.exports = KellnerRoute;
