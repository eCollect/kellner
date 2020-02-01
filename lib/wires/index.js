'use strict';

const wires = {};

wires.commandbus = {};
wires.commandbus.amqp = {};

wires.commandbus.amqp.Receiver = require('./commandbus/amqp/Reciver');
wires.commandbus.amqp.Sender = require('./commandbus/amqp/Sender');

wires.eventbus = {};
wires.eventbus.amqp = {};
wires.eventbus.amqp.Receiver = require('./eventbus/amqp/Reciver');
wires.eventbus.amqp.Sender = require('./eventbus/amqp/Sender');

wires.notificationbus = {};
wires.notificationbus.amqp = {};
wires.notificationbus.amqp.Receiver = require('./notificationbus/amqp/Reciver');

wires.jobbus = {};
wires.jobbus.amqp = {};
wires.jobbus.amqp.Receiver = require('./jobbus/amqp/Reciver');
wires.jobbus.amqp.Sender = require('./jobbus/amqp/Sender');

module.exports = wires;
