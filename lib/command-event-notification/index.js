'use strict';

const requireDir = require('require-dir');

const Command = require('./Command');
const Event = require('./Event');

const events = requireDir('./events');
// const Notification = require('./Notification');

module.exports = {
	Command,
	Event,
	events,
//	Notification,
};
