'use strict';

module.exports = class Connections {
	constructor(app) {
		this.app = app;
		this.connectors = {};
		this.connections = {};
	}

	use({ type, connect } = {}) {
		if (!type || typeof type !== 'string')
			throw new Error('Invalid Kellner protocol type');
		if (!connect || typeof connect !== 'function')
			throw new Error('Invalid Kellner protocol');
		this.connectors[type] = connect;
	}

	get(type, name) {
		const cacheKey = name ? `${type}:${name}` : type;
		if (!this.connections[cacheKey])
			this.connections[cacheKey] = this.connect(type, name);

		return this.connections[cacheKey];
	}

	async connect(type, name) {
		if (!this.connectors[type])
			throw new Error(`No protocol of type [${type}] defined.`);

		const connection = await this.connectors[type](this.app.config, name);

		if (connection.on) {
			connection.on('close', e => this.app.fail(e));
			connection.on('error', e => this.app.fail(e));
			connection.on('disconnect', e => this.app.fail(e));
		}

		return connection;
	}

	async close() {
		// eslint-disable-next-line no-restricted-syntax
		for (const [cacheKey, connectionResolver] of Object.entries(this.connections)) {
			// eslint-disable-next-line no-await-in-loop
			const connection = await connectionResolver;
			this.connections[cacheKey] = null;

			if (connection.removeAllListeners)
				connection.removeAllListeners();

			if (connection.close)
				// eslint-disable-next-line no-await-in-loop
				await connection.close(true);

		}
	}
};
