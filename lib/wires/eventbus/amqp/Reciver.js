'use strict';

class Receiver {
	constructor(service, { bindingKey = 'event.domain.#' }) {
		this.service = service;
		this.bindingKey = bindingKey;
	}

	async link(app, { incoming, route = 'domainEvents' }) { // eslint-disable-line
		if (!app)
			throw new Error('App is missing.');

		if (!incoming)
			throw new Error('Incoming is missing.');


		const logger = app.services.getLogger();

		const mq = await app.connections.get('mq');

		let readStream;

		try {
			readStream = await mq.publisher(`${app.appName}:events`).createReadStream(this.service, { persistent: true, bindingKey: this.bindingKey });
		} catch (ex) {
			return incoming.emit('error', ex);
		}

		logger.debug('Started eventbus (receiver) endpoint.', {
			url: this.url, application: this.application,
		});

		readStream.on('data', (message) => {
			let event;

			try {
				event = new app.Event(message.body);
			} catch (ex) {
				logger.warn('Discarding event...', event);
				return message.nack();
			}

			event.ack = message.ack;
			event.nack = message.nack;
			event.reject = message.reject;

			event[app.symbols.kellnerRoute] = route;

			return incoming.write(event);
		});
	}

	async clear(app) {
		if (!app)
			throw new Error('App is missing.');

		// resuse connections
		const mq = await app.connections.get('mq');
		await mq.publisher(`${app.appName}:events`).clearRead(this.service);
	}
}

module.exports = Receiver;
