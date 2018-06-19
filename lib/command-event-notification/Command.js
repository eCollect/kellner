'use strict';

const uuid = require('uuid/v4');
const formats = require('formats');

const MESSAGE_TYPE = 'command';

class Command {
	constructor({
		id,
		context,
		aggregate,
		name,
		payload = {},
		metadata = {},
	}) {
		if (!formats.isAlphanumeric(context, { minLength: 1 }))
			throw new Error('Invalid context.');

		if (!formats.isObject(aggregate))
			throw new Error('Invalid aggregate.');

		if (!formats.isAlphanumeric(aggregate.name, { minLength: 1 }))
			throw new Error('Aggregate name is missing.');

		if (!formats.isString(name, { minLength: 1 }))
			throw new Error('Command name is missing.');

		if (!formats.isObject(payload))
			throw new Error('Payload must be an object.');

		if (!formats.isObject(metadata))
			throw new Error('Metadata must be an object.');

		this.context = context;
		this.aggregate = { name: aggregate.name, id: aggregate.id, revision: aggregate.revision };
		this.name = name;

		this.id = id || uuid();

		this.metadata = {
			...metadata,
			timestamp: (new Date()).getTime(),
		};

		this.payload = payload;
		this.routingKey = `command.${this.context}.${this.aggregate.name}`;
	}

	serialize() {
		return JSON.parse(JSON.stringify(this));
	}

	get messageType() { // eslint-disable-line
		return MESSAGE_TYPE;
	}

	get fullname() {
		return `${this.context}.${this.aggregate.name}.${this.name}`;
	}

	static deserialize({
		id,
		context,
		aggregate,
		name,
		payload = {},
		metadata = {},
	}) {
		return new Command({
			id,
			context,
			aggregate,
			name,
			payload,
			metadata,
		});
	}

	static definition() {
		return {
			id: 'id',
			context: 'context',
			// aggregate
			aggregateId: 'aggregate.id',
			aggregate: 'aggregate.name',
			revision: 'aggregate.revision',

			name: 'name',
			payload: 'payload',

			meta: 'metadata',
		};
	}
}

module.exports = Command;
