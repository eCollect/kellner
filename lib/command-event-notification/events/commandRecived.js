'use strict';

const Event = require('../Event');

const name = 'commandRecived';

const commandRecived = ({ id }) => new Event({
	type: Event.EVENT_TYPES.SYSTEM,
	name,
}).setCorrelationId(id);

commandRecived.fullname = Event.fullNameGenerator[Event.EVENT_TYPES.SYSTEM]({ name });

module.exports = commandRecived;
