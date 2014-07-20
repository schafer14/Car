'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Survey Schema
 */
var CarSchema = new Schema({
	make: String,
	name: String,
	model: String,
	year: Number,
	transmission: {
		type: String,
		enum: ['Manual', 'Automatic'],
	},
	registered: Boolean,
	listed: Date,
	updated: Date, 
	kms: Number,
	body: String,
	comment: String,
	url: String,
	urgent: Boolean,
	price: Number,
	priceHistory: [Number],
	location: String,
	complete: {
		type: Boolean,
		default: false,
	},
	created: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('Car', CarSchema);