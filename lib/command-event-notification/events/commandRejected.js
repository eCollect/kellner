'use strict';

const Event = require('../Event');

const name = 'commandRejected';

const commandRecived = ({
	id,
	context,
	aggregate,
	payload = {
		message: 'commandRejected',
	},
}) => new Event({
	type: Event.EVENT_TYPES.DOMAIN,
	name,
	context,
	aggregate,
	payload,
}).setCorrelationId(id);

commandRecived.fullname = Event.fullNameGenerator[Event.EVENT_TYPES.SYSTEM]({ name });

module.exports = commandRecived;
