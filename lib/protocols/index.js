'use strict';

const protocols = {};

protocols.Amqp = require('./Amqp');
protocols.Mongodb = require('./Mongodb');
protocols.Mongoose = require('./Mongoose');

module.exports = protocols;
