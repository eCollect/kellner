'use strict';

const uuid = require('uuid/v4');
const formats = require('formats');

const MESSAGE_TYPE = 'event';

const EVENT_TYPES = {
	CRUD: 'crud',
	DOMAIN: 'domain',
	DENORMALIZER: 'readmodel',
	SYSTEM: 'system',
};

const reversedEventType = Object.entries(EVENT_TYPES).reduce((rev, [, value]) => {
	rev[value] = true;
	return rev;
}, {});

const fullNameGenerator = {
	[EVENT_TYPES.DOMAIN]: e => `${EVENT_TYPES.DOMAIN}.${e.context}.${e.aggregate.name}.${e.name}`,
	[EVENT_TYPES.DENORMALIZER]: e => `${EVENT_TYPES.DENORMALIZER}.${e.readmodel.type}.${e.readmodel.collection}.${e.name}`,
	[EVENT_TYPES.SYSTEM]: e => `${EVENT_TYPES.SYSTEM}.${e.name}`,
	[EVENT_TYPES.CRUD]: e => `${EVENT_TYPES.CRUD}.${e.context}.${e.readmodel.collection}.${e.name}`,
};

class Event {
	constructor({
		type,
		id,
		context,
		aggregate,
		event,
		command,
		name,
		readmodel = {},
		payload = {},
		metadata = {},
	}) {
		if (!type || !reversedEventType[type])
			throw new Error('Invalid event type');

		if (!formats.isAlphanumeric(name, { minLength: 1 }))
			throw new Error('Command name is missing.');

		if (!formats.isObject(payload))
			throw new Error('Payload must be an object.');

		if (!formats.isObject(metadata))
			throw new Error('Metadata must be an object.');

		this.type = type;
		this.id = id || uuid();
		this.name = name;
		this.payload = payload;
		this.metadata = metadata;
		this.command = command;

		if (type === EVENT_TYPES.CRUD) {
			if (!formats.isAlphanumeric(context, { minLength: 1 }))
				throw new Error('Invalid context.');

			if (!formats.isObject(readmodel))
				throw new Error('Invalid readmodel.');

			if (!formats.isAlphanumeric(readmodel.collection, { minLength: 1 }))
				throw new Error('Readmodel collection is missing.');

			this.context = context;
			this.readmodel = readmodel;
		}

		if (type === EVENT_TYPES.DENORMALIZER || type === EVENT_TYPES.DOMAIN) {
			if (!formats.isAlphanumeric(context, { minLength: 1 }))
				throw new Error('Invalid context.');

			if (!formats.isObject(aggregate))
				throw new Error('Invalid aggregate.');

			if (!formats.isAlphanumeric(aggregate.name, { minLength: 1 }))
				throw new Error('Aggregate name is missing.');

			this.context = context;
			this.aggregate = { name: aggregate.name, id: aggregate.id, revision: aggregate.revision };

			if (type === EVENT_TYPES.DENORMALIZER) {
				if (!formats.isObject(event))
					throw new Error('Invalid event.');

				if (!formats.isAlphanumeric(event.name, { minLength: 1 }))
					throw new Error('Event name is missing.');

				if (!formats.isString(event.id, { minLength: 1 }))
					throw new Error('Event id is missing.');

				if (!formats.isObject(readmodel))
					throw new Error('Invalid readmodel.');

				if (!formats.isAlphanumeric(readmodel.collection, { minLength: 1 }))
					throw new Error('Readmodel collection is missing.');

				this.event = { name: event.name, id: event.id };
				this.readmodel = readmodel;
			}
		}
		this.fullname = fullNameGenerator[type](this);
		this.routingKey = `event.${this.fullname}`;
	}

	get messageType() { // eslint-disable-line
		return MESSAGE_TYPE;
	}

	static get fullNameGenerator() {
		return fullNameGenerator;
	}

	serialize() {
		return JSON.parse(JSON.stringify(this));
	}

	setCorrelationId(v) {
		this.metadata.correlationId = v;
		return this;
	}

	static deserialize({
		type,
		id,
		context,
		aggregate,
		event,
		name,
		readmodel,
		payload,
		metadata,
		command,
	}) {
		return new Event({
			type,
			id,
			context,
			aggregate,
			event,
			name,
			readmodel,
			payload,
			metadata,
			command,
		});
	}

	static definition() {
		return {
			id: 'id', // uniquie id of the notification type uid
			context: 'context', // context name type String

			// aggregate info
			aggregateId: 'aggregate.id',
			aggregate: 'aggregate.name',
			revision: 'aggregate.revision',

			// event
			event: 'event.name', // event
			eventId: 'event.id', // event

			// readmodel
			collection: 'readmodel.collection',

			// name
			name: 'name', // create, update, delete

			payload: 'payload',

			// metadata
			meta: 'metadata',
			correlationId: 'metadata.correlationId',
		};
	}

	static get EVENT_TYPES() {
		return EVENT_TYPES;
	}
}

module.exports = Event;
