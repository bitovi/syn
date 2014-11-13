steal('./synthetic.js',
	'./mouse.support.js',
	'./mouse.js',
	'./browsers.js',
	'./key.support.js',
	'./key.js',
	'./drag/drag.js', function (Syn) {
		window.Syn = Syn;

		return Syn;
	});
