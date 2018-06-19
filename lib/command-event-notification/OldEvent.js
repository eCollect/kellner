'use strict';

const uuid = require('uuid/v4');
const formats = require('formats');

const TYPE_NAME = 'domain';

class Event {
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

		if (!formats.isString(aggregate.id, { minLength: 1 }))
			throw new Error('Aggregate id is missing.');

		if (!formats.isAlphanumeric(name, { minLength: 1 }))
			throw new Error('Command name is missing.');

		if (!formats.isObject(payload))
			throw new Error('Payload must be an object.');

		if (!formats.isObject(metadata))
			throw new Error('Metadata must be an object.');

		this.type = TYPE_NAME;

		this.id = id || uuid();

		this.context = context;
		this.aggregate = { name: aggregate.name, id: aggregate.id, revision: aggregate.revision };
		this.name = name;

		this.metadata = {
			...metadata,
		};


		this.payload = payload;
	}

	static get type() {
		return TYPE_NAME;
	}

	serialize() {
		return JSON.parse(JSON.stringify(this));
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
		return new Event({
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
			// metadta
			meta: 'metadata',
			commitStamp: 'metadata.timestamp',
			correlationId: 'metadata.correlationId',
		};
	}
}

module.exports = Event;
