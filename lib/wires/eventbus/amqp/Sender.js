'use strict';

class Sender {
	async link(app, { outgoing }) { // eslint-disable-line
		if (!app)
			throw new Error('App is missing.');

		if (!outgoing)
			throw new Error('Outgoing is missing.');

		const mq = await app.connections.get('mq');

		let writeStream;

		try {
			writeStream = await mq.publisher(`${app.appName}:events`).createWriteStream('oblak:event');
		} catch (ex) {
			return outgoing.emit('error', ex);
		}

		outgoing.on('data', (event) => {
			const message = {
				routingKey: event.routingKey,
				body: event.serialize(),
			};
			writeStream.write(message);
		});
	}

	// clear is not-used for now in order to keep exchanges exsititng
	async clear(app) {} // eslint-disable-line
}

module.exports = Sender;
