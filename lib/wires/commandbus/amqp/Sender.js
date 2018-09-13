'use strict';

class Sender {
	async link(app, { outgoing }) {
		if (!app)
			throw new Error('App is missing.');

		if (!outgoing)
			throw new Error('Outgoing is missing.');

		const logger = app.services.getLogger();

		// resuse conections
		const mq = await app.connections.get('mq');

		let writeStream;

		try {
			writeStream = await mq.worker(`${app.appName}:commands`).createWriteStream('oblak:command');
		} catch (ex) {
			return outgoing.emit('error', ex);
		}

		logger.debug('Started commandbus (sender) endpoint.');

		outgoing.on('data', (command) => {
			const message = {
				routingKey: command.routingKey,
				body: command.serialize(),
			};
			writeStream.write(message);
		});

		return this;
	}

	// clear is not-used for now in order to keep exchanges exsititng
	async clear(app) {} // eslint-disable-line
}

module.exports = Sender;
