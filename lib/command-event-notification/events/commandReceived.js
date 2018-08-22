'use strict';

const Event = require('../Event');

const name = 'commandReceived';

const commandReceived = ({ id, metadata }) => new Event({
	type: Event.EVENT_TYPES.SYSTEM,
	name,
	metadata,
}).setCorrelationId(id);

commandReceived.fullname = Event.fullNameGenerator[Event.EVENT_TYPES.SYSTEM]({ name });

module.exports = commandReceived;
