'use strict';

var mongoose = require('mongoose');

var reminderSchema = mongoose.Schema({
	number: String,
	message: String,
	originalString: String,
	dateSent: { type: Date, default: Date.now },
	dateOfReminder: Date,
	scheduled: Boolean,
	sent: Boolean
});

var reminders = mongoose.model('reminder', reminderSchema);

module.exports = reminders;