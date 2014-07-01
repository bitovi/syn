steal('src/synthetic.js',
	'src/mouse.js',
	'src/browsers.js',
	'src/key.js',
	'src/drag', function (syn) {
		window.syn = syn;

		return syn;
	});
