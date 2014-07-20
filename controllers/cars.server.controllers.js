'use strict';
var request = require('request');
var fs = require('fs');
var mongoose = require('mongoose');
var HTML = mongoose.model('HTML');
var cheerio = require('cheerio');
var _ = require('lodash');
var Car = mongoose.model('Car');


exports.search = function(args) {
	var url = args.next ? args.next : buildUrl(args);

	var options = {
		url: url,
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
	    }
	}

	if (args.text || args.t) {
		if (args.name) {
			HTML.findOne({name: name})
				.sort('-created')
				.exec(function(err, html) {
					parse(html.body);
				});
		}
	} else {
		console.log('Searching ' + options.url);
		request(options, function(err, response, body) {
			if (err) throw err;
			nextButton(body);
		});
	}
};

function parse (body) {
	var $ = cheerio.load(body);
	$('li[itemprop=offers]').each(function(index, li) {
		var name = $(this).find('span[itemprop=name]').html();
		var price = $(this).find('div[itemprop=price]').html().split('$');
		if (price[1]) {
			price = price[1].replace(',', '');
		} else {
			price = null;
		}
		var url = $(this).find('a[itemprop=url]').attr('href');
		var urgent = $(this).find('div[title=Urgent]').find('p.text').html();
		var car = new Car({
			name: name,
			price: price,
			url: url,
			urgent: urgent,
		});

		Car.count({url: url}, function(err, count) {
			if (count === 0) {
				car.save(function(err) {
					if (err) throw err;
				});
			}
		});

	});
}

function nextButton(body) {
	var $ = cheerio.load(body);
	parse(body);
	var next = $('a[title=Next]').attr('href');

	setTimeout(function() {
		if (next === undefined) {
			console.log('done');
			return 'done';
		} else {
			var args = {
				next: 'http://www.gumtree.com.au/' + next,
			};	
			exports.search(args);
		};
	}, Math.random() * (7000 - 3000) + 3000);
}

function buildUrl(args) {
	// price
	// make
	// year
	var base = 'http://www.gumtree.com.au/s-cars-vans-utes/perth/'
	var id = 'c18320l3008303';
	var make = args.make ? 'carmake-' + args.make + '/' : '';
	var min = args.min ? args.min + '.00' : ''; 
	var max = args.max ? args.max + '.00' : ''; 
	var price = (min || max) ? '?price=' + min + '__' + max : '';
	var from = args.from ? args.from : '';
	var to = args.to ? args.to : '';
	var year = (from || to) ? 'caryear-' + from + '__' + to + '/' : '';
	
	var url = base + make + year + id + price;
	return url;
}

exports.auto = function() {
	setInterval(function() {
		exports.search({
			make: 'honda',
			from: 2000,
			min: 2000,
			max: 6000,
		});
		exports.search({
			make: 'toyota',
			from: 2000,
			min: 2000,
			max: 6000,
		});
		exports.search({
			make: 'subaru',
			from: 2000,
			min: 2000,
			max: 6000,
		});
	}, 1000 * 60 * 15);
}