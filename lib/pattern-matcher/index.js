'use strict';

/**
* Simple RaabimtMQ ( * / # ) Pattern handler
* */

const SimpleMatcher = require('./SimpleMatcher');
const RegexMatcher = require('./RegexMatcher');

const IS_PATTERN_REGEX = new RegExp('\\*|#');

const cache = new Map();

const createMatcher = (pattern) => {
	if (!IS_PATTERN_REGEX.test(pattern))
		return new SimpleMatcher(pattern);
	return RegexMatcher(pattern);
};

const matcher = (pattern) => {
	if (!cache.has(pattern))
		cache.set(pattern, createMatcher(pattern));
	return cache.get(pattern);
};

const clearCache = () => cache.clear();

const match = (pattern, text) => matcher(pattern).match(text);

module.exports = {
	match,
	matcher,
	clearCache,
};

