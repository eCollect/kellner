'use strict';

class Receiver {
	constructor(aggregates) {
		this.aggregates = aggregates;
	}

	async link(app, { incoming, route = 'commands' }) {
		if (!app)
			throw new Error('App is missing.');

		if (!incoming)
			throw new Error('Incoming is missing.');

		const logger = app.services.getLogger();

		// resuse connections
		const mq = await app.connections.get('mq');

		let readStream;

		try {
			readStream = await mq.worker(`${app.appName}:commands`).createReadStream(this.aggregates);
		} catch (ex) {
			return incoming.emit('error', ex);
		}

		logger.debug('Started commandbus (receiver) endpoint.', {
			url: this.url, application: this.application,
		});

		readStream.on('data', (message) => {
			let command;

			try {
				command = app.Command.deserialize(message.body);
			} catch (ex) {
				logger.warn('Discarding command...', command);
				return message.reject();
			}

			command.ack = () => message.ack();
			command.nack = () => message.nack();

			command[app.symbols.kellnerRoute] = route;

			incoming.write(command);

			return null;
		});

		return this;
	}
}

module.exports = Receiver;
