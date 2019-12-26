'use strict';

const es = require('elasticsearch');

const getElasticConfig = (config) => {
	const elasticConfig = JSON.parse(JSON.stringify(config));
	return elasticConfig;
};

module.exports = {
	type: 'elastic',
	connect: ({ elasticsearch }) => new es.Client(getElasticConfig(elasticsearch)),
};
