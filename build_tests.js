var fs = require("fs");
var pluginifier = require("steal-tools").pluginify;

var outFile = __dirname + "/build/tests.js";

pluginifier({
	config: __dirname + "/stealconfig.js",
	main: "test/qunit/qunit"
}).then(function(pluginify) {
	var graph = pluginify.graph;
	var ignore = [];
	Object.keys(graph).forEach(function(moduleName) {

		// Ignore everything from src/ because we're testing against the built file.
		// Except drag_test which is in the src/ folder... need to rearrange everything.
		if(moduleName.indexOf("src/") === 0 && moduleName.indexOf("drag_test") === -1) {
			ignore.push(moduleName);
		}
	});

	var source = pluginify(null, {
		ignore: ignore
	});

	fs.writeFileSync(outFile, source, 'utf8');
});
