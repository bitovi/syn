steal('src/synthetic.js',
	'src/mouse.support.js',
	'src/browsers.js',
	'src/key.support.js',
	'src/drag', function (syn) {
		window.syn = syn;

		return syn;
	});
