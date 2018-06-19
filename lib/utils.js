'use strict';

const flattenArray = (array = [], result = []) => {
	for (let i = 0; i < array.length; i++) {
		const value = array[i];

		if (Array.isArray(value))
			flattenArray(value, result);
		else
			result.push(value);
	}

	return result;
};

const flatten = (array = []) => {
	if (!Array.isArray(array))
		array = [array];
	return flattenArray(array);
};

class Lazy {
	constructor(factory) {
		this.factory = factory;
		this.instance = null;
	}

	get created() {
		return !!this.instance;
	}

	ifCreated(fn = () => {}) {
		if (this.instance)
			return fn(this.instance);
		return null;
	}

	get() {
		if (!this.instance)
			this.instance = this.factory();
		return this.instance;
	}
}

module.exports = {
	Lazy,
	flatten,
};
