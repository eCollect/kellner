'use strict';

const os = require('os');

const IoPort = require('./io/IoPort');

const processEnv = require('./processEnv');

const {
	Command,
	Event,
	Job,
	events,
} = require('./command-event-notification');

const symbols = require('./symbols');
const wires = require('./wires');
const protocols = require('./protocols');
const LoggerManager = require('./KellnerLoggerManager');

const ErrorStream = require('./ErrorStream');

const {
	kellnerEventbus,
	kellnerJobbus,
	kellnerCommandbus,
	kellnerNotificationbus,
	kellnerWires,
	kellnerProcesses,
	kellnerErrorStream,
	kellnerLoggerManager,
} = symbols;

class KellnerProcess {
	constructor(name) {
		this._name = name;

		this.services = {
			getLogger: () => this[kellnerLoggerManager].getLogger(),
		};

		this[kellnerEventbus] = new IoPort(this);
		this[kellnerCommandbus] = new IoPort(this);
		this[kellnerJobbus] = new IoPort(this);
		this[kellnerNotificationbus] = new IoPort(this);

		this[kellnerWires] = [];
		this[kellnerProcesses] = new Map();

		this[kellnerErrorStream] = new ErrorStream();

		this.use(this[kellnerEventbus]).use(this[kellnerCommandbus]).use(this[kellnerNotificationbus]).use(this[kellnerJobbus]);
	}

	// #region Getters
	get eventbus() {
		return this[kellnerEventbus];
	}

	get commandbus() {
		return this[kellnerCommandbus];
	}

	get notificationbus() {
		return this[kellnerNotificationbus];
	}

	get jobbus() {
		return this[kellnerJobbus];
	}

	get config() {
		return this.app._config;
	}

	get shortName() {
		return this._name;
	}

	get appName() {
		return this.app.name;
	}

	get version() {
		return this.app._version;
	}

	get connections() {
		return this.app._connections;
	}

	/* eslint-disable class-methods-use-this */
	get Job() {
		return Job;
	}

	get Command() {
		return Command;
	}

	get Event() {
		return Event;
	}

	get events() {
		return events;
	}

	get wires() {
		return wires;
	}

	get symbols() {
		return symbols;
	}

	static get protocols() {
		return protocols;
	}
	/* eslint-enable class-methods-use-this */
	// #endregion

	getProcess(name) {
		if (!this[kellnerProcesses].has(name)) {
			const port = new KellnerProcess(name);
			this[kellnerProcesses].set(name, port);
			this.use(port);
		}

		return this[kellnerProcesses].get(name);
	}

	/* eslint-disable class-methods-use-this */
	env(key) {
		return processEnv(key);
	}
	/* eslint-enable class-methods-use-this */

	setApp(app) {
		this.app = app.app || app;
		this.name = app === this ? app.name : `${app.name}:${this._name}`;
		this.processIdentity = {
			name: this.name,
			id: `${os.hostname}:${process.pid}`,
		};
		this[kellnerLoggerManager] = LoggerManager.getManager({
			name: this.name,
			version: this.version,
			logLevel: this.config.logLevel,
			logEnabled: this.config.logEnabled,
			prettyPrint: this.config.logPrettyPrint,
		});
	}

	use(wire) {
		if (!wire)
			throw new Error('Wire is missing.');

		// error handler
		if (typeof wire === 'function')
			return this.useError(wire);

		if (typeof wire.link !== 'function')
			throw new Error('Wire must have a link funciton');

		if (typeof wire.prelink === 'function')
			wire.prelink(this);

		this[kellnerWires].push(() => wire.link(this));

		return this;
	}

	useError(handler) {
		this[kellnerErrorStream].addErrorHandler(handler);
		return this;
	}

	prelink(app) {
		this.setApp(app);
	}

	link(parent) {
		return this.init(parent);
	}

	async init(parent) {
		this[kellnerErrorStream].init(parent);
		// this._loggerManager = this.app._loggerManager.getManager({ name: this.name });
		const res = await Promise.all(this[kellnerWires].map(a => a()));
		return res;
		// this._wires = [];
	}

	fail(exp) {
		this[kellnerErrorStream].write(exp);
	}
}

module.exports = KellnerProcess;
