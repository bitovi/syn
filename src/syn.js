steal('./synthetic.js',
	'./mouse.js',
	'./browsers.js',
	'./key.js',
	'./drag/drag.js', function (Syn) {
		window.Syn = Syn;

		return Syn;
	});
