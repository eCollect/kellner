'use strict';

class Receiver {
	constructor(service) {
		this.service = service;
	}

	async link(app, { incoming, route = 'notifications' }) { // eslint-disable-line
		if (!app)
			throw new Error('App is missing.');

		if (!incoming)
			throw new Error('Incoming is missing.');

		const logger = app.services.getLogger();
		const mq = await app.connections.get('mq');

		let readStream;

		try {
			readStream = await mq.publisher(`${app.appName}:events`).createReadStream(`notifications:${this.service}`, { persistent: false, bindingKey: '#', noAck: true });
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
				// no conosle
			}

			return incoming.write(event);
		});
	}

	async clear(app) {
		if (!app)
			throw new Error('App is missing.');

		// resuse connections
		const mq = await app.connections.get('mq');
		await mq.publisher(`${app.appName}:events`).clearRead(`notifications:${this.service}`);
	}
}

module.exports = Receiver;
