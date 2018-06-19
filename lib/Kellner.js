'use strict';

// const loggerFactory = require('./logger');
/*
const LoggerManager = require('./KellnerLoggerManager');
const { Command, Event, events } = require('./command-event-notification');
*/
// const IoPort = require('./IoPort');

const KellnerProcess = require('./KellnerProcess');
const Connections = require('./Connections');

const streams = require('./streams');

class Kellner extends KellnerProcess {
	constructor({
		name,
		version,
		config,
		env,
	} = {}) {
		super();
		env = this.env('OBLAK_ENV') || 'debug';
		this.options({
			name,
			version,
			config,
			env,
		});
		this.setApp(this);

		// diffrent Pootok Connections ( mq, http )...
		this._connections = new Connections(this);
	}

	options({
		name = this.name,
		version = this.version,
		config = this.config,
		env = this.env,
	}) {
		this.env = env;
		this.name = name;
		this._version = version;
		this._config = config;
		return this;
	}

	static get streams() {
		return streams;
	}
}

module.exports = Kellner;
