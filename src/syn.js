steal('src/synthetic.js',
	'src/mouse.support.js',
	'src/browsers.js',
	'src/key.support.js',
	'src/drag/drag.js', function (Syn) {

		window.Syn = Syn;

		// Clean up 
		window.__synthTest = Syn._oldSynth;
		delete Syn._oldSynth;

		return Syn;
	});
