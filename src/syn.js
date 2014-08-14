steal('syn/synthetic.js',
	'syn/mouse.support.js',
	'syn/browsers.js',
	'syn/key.support.js',
	'syn/drag', function (syn) {
		window.syn = syn;

		return syn;
	});
