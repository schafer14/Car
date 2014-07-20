'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Survey Schema
 */
var HtmlSchema = new Schema({
	body: String,
	url: String,
	name: String,
	created: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('HTML', HtmlSchema);