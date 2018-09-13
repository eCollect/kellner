'use strict';

const { KellnerPassThrough } = require('../streams');
const { kellnerApp, kellnerWires } = require('../symbols');

class IoPort {
	constructor(app) {
		this[kellnerApp] = app;
		this[kellnerWires] = [];
		this.incoming = new KellnerPassThrough(this[kellnerApp]);
		this.outgoing = new KellnerPassThrough(this[kellnerApp]);
	}

	getApp() {
		return this[kellnerApp];
	}

	in(wire) {
		return this._use(wire, { incoming: this.incoming });
	}

	out(wire) {
		return this._use(wire, { outgoing: this.outgoing });
	}

	use(wire) {
		return this._use(wire, { incoming: this.incoming, outgoing: this.outgoing });
	}

	_use(wire, {
		incoming,
		outgoing,
	}) {
		if (!wire)
			throw new Error('Wire is missing.');

		if (typeof wire.link !== 'function')
			throw new Error('Wire must have a link funciton');

		if (typeof wire.prelink === 'function')
			wire.prelink(this);

		this[kellnerWires].push((operation = 'link') => wire[operation](this[kellnerApp], { incoming, outgoing }));

		return this;
	}

	async clear() {
		await Promise.all(this[kellnerWires].map(a => a('clear')));
	}

	async link() {
		await Promise.all(this[kellnerWires].map(a => a()));
	}
}

module.exports = IoPort;
