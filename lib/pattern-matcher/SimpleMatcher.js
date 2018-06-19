'use strict';

class SimpleMatcher {
	constructor(pattern) {
		this.pattern = pattern;
	}

	match(text) {
		return this.pattern === text;
	}
}

module.exports = SimpleMatcher;
