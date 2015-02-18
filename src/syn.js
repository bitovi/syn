steal('synjs/synthetic.js',
	'synjs/mouse.support.js',
	'synjs/browsers.js',
	'synjs/key.support.js',
	'synjs/drag.js', function (syn) {
		window.syn = syn;

		return syn;
	});
