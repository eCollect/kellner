'use strict';

const pino = require('pino');

class KellnerLoggerManager {
	constructor({
		name,
		version,
		logLevel,
		logEnabled,
		instant,
		env,
		prettyPrint,
	}) {
		this.name = name;
		this.version = version;
		this.logLevel = logLevel;
		this.logEnabled = logEnabled;
		this.prettyPrint = prettyPrint;
		this.env = env;
		this._instance = instant ? this._getInstance() : null;
	}

	getLogger() {
		if (!this._instance) {
			const pinoOptions = {
				name: `${(this.name)} (${this.version})`,
				level: this.logLevel,
				enabled: this.logEnabled,
			};
			if (this.prettyPrint)
				pinoOptions.prettyPrint = this.prettyPrint;

			this._instance = pino(pinoOptions);
			this._instance.fatal('fatal logging is [ON]');
			this._instance.error('error logging is [ON]');
			this._instance.warn('warn logging is [ON]');
			this._instance.info('info logging is [ON]');
			this._instance.debug('debug logging is [ON]');
			this._instance.trace('trace logging is [ON]');
		}

		return this._instance;
	}

	getManager({
		name,
		version = this.version,
		logLevel = this.logLevel,
		logEnabled = this.logEnabled,
		prettyPrint = this.prettyPrint,
		env = this.env,
		instant,
	}) {
		if (!name)
			throw new Error('Logger muste have a name');

		return new KellnerLoggerManager({
			name: `${this.name}:${name}`,
			version,
			logLevel,
			logEnabled,
			instant,
			prettyPrint,
			env,
		});
	}

	static getManager({
		name,
		version = '0.0.0',
		logLevel = 'debug',
		logEnabled = true,
		instant = false,
		prettyPrint = false,
		env = 'debug',
	}) {
		if (!name)
			throw new Error('Logger muste have a name');
		return new KellnerLoggerManager({
			name,
			version,
			logLevel,
			logEnabled,
			instant,
			prettyPrint,
			env,
		});
	}
}

module.exports = KellnerLoggerManager;
