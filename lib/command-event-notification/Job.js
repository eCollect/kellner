'use strict';

const MIN_DATE = new Date('1970-01-01');

class Job {
	constructor({
		id,
		payload = {},
		metadata = {},
		envelope = {
			to: '', // worker full name ( ie outbound.letter )
			from: '', // process id
			timestamp: new Date(),
		},
		execution = {
			notBefore: MIN_DATE,
		},
	}) {
		if (!envelope || !envelope.to || !envelope.from)
			throw new Error('No envelope specified!');
		if (!execution)
			throw new Error('No execution specified!');

		envelope.timestamp = new Date(envelope.timestamp || new Date());
		execution.notBefore = new Date(execution.notBefore || MIN_DATE);

		this.id = id;
		this.payload = payload;
		this.metadata = metadata;
		this.execution = execution;
		this.envelope = envelope;
		this.routingKey = `worker.${envelope.to}`;
	}

	serialize() {
		return JSON.parse(JSON.stringify(this));
	}

	static deserialize({
		id,
		payload,
		metadata,
		envelope,
		execution,
	}) {
		return new Job({
			id,
			payload,
			metadata,
			envelope,
			execution,
		});
	}
}

module.exports = Job;
