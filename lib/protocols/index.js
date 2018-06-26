'use strict';

const protocols = {};

protocols.Amqp = require('./Amqp');
protocols.Mongodb = require('./Mongodb');
protocols.Mongoose = require('./Mongoose');
protocols.Elasticsearch = require('./Elasticsearch');

module.exports = protocols;
