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

module.exports = commandRejected;
