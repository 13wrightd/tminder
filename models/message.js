'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	name: String,
	message: String,
	dateSent: { type: Date, default: Date.now }
});

var messages = mongoose.model('message', messageSchema);

module.exports = messages;