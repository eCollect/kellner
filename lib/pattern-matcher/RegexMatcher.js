'use strict';

const separator = '\\.';
const oneWord = '0-9a-zA-Z_\\-\\:';
const anyNumberOfWord = `${oneWord}${separator}`;

const escape = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const compilePart = (part) => {
	if (part === '*')
		return `[${oneWord}]+?`;
	if (part === '#')
		return `[${anyNumberOfWord}]+?`;
	return escape(part);
};

const compile = (pattern) => {
	const parts = pattern.split('.');
	return new RegExp(`^${parts.map(compilePart).join('\\.')}$`);
};


class RegexMatcher {
	constructor(pattern) {
		this.pattern = compile(pattern);
	}

	match(text = '') {
		return this.pattern.test(text);
	}
}

module.exports = RegexMatcher;
