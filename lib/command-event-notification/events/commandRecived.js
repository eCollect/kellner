'use strict';

const Event = require('../Event');

const name = 'commandReceived';

const commandReceived = ({ id }) => new Event({
	type: Event.EVENT_TYPES.SYSTEM,
	name,
}).setCorrelationId(id);

commandReceived.fullname = Event.fullNameGenerator[Event.EVENT_TYPES.SYSTEM]({ name });

module.exports = commandReceived;
