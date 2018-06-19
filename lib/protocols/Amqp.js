'use strict';

const zaek = require('zaek');

module.exports = {
	type: 'mq',
	connect: ({ amqp }) => zaek.connect(amqp),
};
