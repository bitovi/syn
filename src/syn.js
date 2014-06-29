steal('./synthetic.js',
	'./mouse.js',
	'./browsers.js',
	'./key.js',
	'./drag/drag.js', function (syn) {
		window.syn = syn;

		return syn;
	});
