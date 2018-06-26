'use strict';

const es = require('elasticsearch');

const getElasticConfig = (config) => {
	const elasticConfig = { ...config };
	elasticConfig.host = `${config.host}:${config.port}`;
	return elasticConfig;
};

module.exports = {
	type: 'elastic',
	connect: ({ elaticsearch }) => new es.Client(getElasticConfig(elaticsearch)),
};
