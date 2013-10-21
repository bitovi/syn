var pluginify = require('steal').build.pluginify;
var fs = require('fs');

pluginify('src/syn.js', {
	ignore: [/lib/],
	wrapper: '!function(window) {\n<%= content %>\n\n' +
		'}(window);',
	steal: {
		root: __dirname,
		map: {
			'*': {
				'jquery/jquery.js' : 'lib/jquery/jquery.js'
			}
		},
		shim: {
			'jquery': {
				'exports': 'jQuery'
			}
		}
	},
	shim: { 'jquery/jquery.js': 'jQuery' }
}, function(error, content) {
	fs.exists('build', function(exists) {
		if(!exists) {
			fs.mkdir('build');
		};

		fs.writeFile(__dirname + '/build/syn.js', content);
	});
});