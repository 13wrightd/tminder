'use strict';

var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
	itemID: Number,
	description: String,
	URL: String,
	name: String,
    numberOfRatings: Number,
	rating: Number,
	categoryID: Number,
	dateAdded: { type: Date, default: Date.now }

});

var items = mongoose.model('item', itemSchema);

module.exports = items;