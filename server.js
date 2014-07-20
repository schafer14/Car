var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var _ = require('lodash');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gumtree')
var controllers = {};

var help = [
	'',
	'Usage: gumtree [command] [options]',
	'',
	'Options:',
	'	--from: 		Oldest year',
	'	--to: 			Newest year',
	'	--min: 			Minimum price',
	'	--max: 			Max price',
	'	--make 			Make of car',
	'Commands:',
	'	car			runs query on car',
	'',
	'Example:',
	'	node server.js car --make toyota --from 1998 --to 2005 --min 4000 --max 5000',
	'',
].join('\n');

function loadModels (cb) {
	_.forEach(fs.readdirSync(__dirname + '/models'), function(model) {
		require(__dirname + '/models/' + model);
	});
	cb();
};

function loadControllers(cb) {
	_.forEach(fs.readdirSync(__dirname + '/controllers'), function(controller) {
		controllers[controller.split('.')[0]] = require(__dirname + '/controllers/' + controller);
	});
	cb();
}

function route () {
	if (argv.help || argv.h || argv._[0] === 'man' || argv._[0] === 'help') {
		console.log(help);
		process.exit(1);
	}

	switch (argv._[0]) {
		case 'car':
			controllers.cars.search(argv);
			break;
		default: 
			console.log(help);
			process.exit(0);
	}	
}

(function run() {
	loadModels(function() {
		loadControllers(function() {
			route();
		});
	});
}());
