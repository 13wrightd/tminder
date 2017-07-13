'use strict';

var mongoose = require('mongoose');

var mcuSchema = mongoose.Schema({
	number: String,
	message: String,
	originalString: String,
	dateSent: { type: Date, default: Date.now }

});

var mcus = mongoose.model('mcu', mcuSchema);

module.exports = mcus;