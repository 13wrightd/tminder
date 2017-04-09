'use strict';

var mongoose = require('mongoose');

var reminderSchema = mongoose.Schema({
	number: String,
	message: String,
	dateSent: { type: Date, default: Date.now },
	dateOfReminder: Date
});

var reminders = mongoose.model('reminder', reminderSchema);

module.exports = reminders;