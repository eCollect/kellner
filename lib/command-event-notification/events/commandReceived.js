'use strict';

const Event = require('../Event');

const name = 'commandReceived';

const commandReceived = ({
	id,
	context,
	aggregate,
	name: commandName,
	id: commandId,
	metadata,
}) => new Event({
	type: Event.EVENT_TYPES.DOMAIN,
	name,
	context,
	aggregate,
	command: {
		name: commandName,
		id: commandId,
	},
	metadata,
}).setCorrelationId(id);

// commandReceived.fullname = Event.fullNameGenerator[Event.EVENT_TYPES.DOMAIN]({ name });

module.exports = commandReceived;
