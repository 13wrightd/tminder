'use strict';

var mongoose = require('mongoose');

var numberSchema = mongoose.Schema({
	number: String,
	country: String,
    zipcode: String,
	timezoneOffset: Number,
	name: String,
	dateAdded: { type: Date, default: Date.now }

});

var numbers = mongoose.model('number', numberSchema);

module.exports = numbers;