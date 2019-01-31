'use strict';

const mongo = require('mongodb');

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

module.exports = {
	type: 'mongodb',
	connect: ({ mongodb }) => new mongo.MongoClient(getMongoUri(mongodb), { useNewUrlParser: true }).connect(),
};
