'use strict';

class Receiver {
	constructor(service, { bindingKey = 'job.general', concurrency = 1 }) {
		this.service = service;
		this.bindingKey = bindingKey;
		this.concurrency = concurrency;
	}

	async link(app, { incoming }) { // eslint-disable-line
		if (!app)
			throw new Error('App is missing.');

		if (!incoming)
			throw new Error('Incoming is missing.');


		const logger = app.services.getLogger();

		const mq = await app.connections.get('mq');

		let readStream;

		try {
			readStream = await mq.publisher(`${app.appName}:jobs`).createReadStream(this.service, { persistent: true, bindingKey: this.bindingKey, prefetch: this.concurrency });
		} catch (ex) {
			return incoming.emit('error', ex);
		}

		logger.debug('Started workerbus (receiver) endpoint.', {
			url: this.url, application: this.application,
		});

		readStream.on('data', (message) => {
			let job;

			try {
				job = app.Job.deserialize(message.body);
			} catch (ex) {
				logger.warn('Discarding event...', job);
				return message.reject();
			}

			job.ack = message.ack;
			job.nack = message.nack;
			job.reject = message.reject;

			return incoming.write(job);
		});
	}

	async clear(app) {
		if (!app)
			throw new Error('App is missing.');

		// resuse connections
		const mq = await app.connections.get('mq');
		await mq.publisher(`${app.appName}:jobs`).clearRead(this.service);
	}
}

module.exports = Receiver;
