'use strict';

const mongoose = require('mongoose');

const getMongoUri = ({
	url, servers, host, port, username, password, authSource,
}) => {
	if (url)
		return url;

	const member = (servers || [{ host, port }]).map(m => `${m.host}:${m.port}`);
	const auth = (username && password) ? `${username}:${password}` : '';
	const options = authSource ? `?authSource=${authSource}` : '';

	return `mongodb://${auth}${member}/${options}`;
};

let connection = null;

module.exports = {
	type: 'mongoose',
	connect: ({ mongodb }, dbName) => {
		if (!dbName)
			throw new Error('Mongoose connection requiers dbName');

		if (!connection) {
			connection = mongoose.connect(getMongoUri(mongodb), { dbName });
			return mongoose.connection;
		}

		return connection.useDb(dbName);
	},
};
