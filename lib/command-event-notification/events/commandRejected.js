'use strict';

const Event = require('../Event');

const name = 'commandRejected';

const commandRejected = (
	{
		id,
		context,
		aggregate,
		name: commandName,
		id: commandId,
	},
	payload = {
		message: 'commandRejected',
	},
) => new Event({
	type: Event.EVENT_TYPES.DOMAIN,
	name,
	context,
	aggregate,
	command: {
		name: commandName,
		id: commandId,
	},
	payload,
}).setCorrelationId(id);

commandRejected.fullname = Event.fullNameGenerator[Event.EVENT_TYPES.DOMAIN]({ name });

module.exports = commandRejected;
