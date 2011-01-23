load('steal/rhino/steal.js');

/**
 * Build syn, funcunit, user-extensions
 */
steal.File('funcunit/syn/dist').mkdir();
steal('//steal/build/pluginify/pluginify', function (s) {
	steal.build.pluginify("funcunit/syn", {
		global: "true",
		nojquery: true,
		destination: "funcunit/syn/dist/syn.js"
	});
});
(function () {
	// add drag/drop
	var copyToDist = function (path) {
		var fileNameArr = path.split("/"),
			fileName = fileNameArr[fileNameArr.length - 1];
		print("copying to " + fileName);
		steal.File(path).copyTo("funcunit/syn/resources/" + fileName);
	},
		i, filesToCopy = ["funcunit/resources/jquery.js"];

	for (i = 0; i < filesToCopy.length; i += 1) {
		copyToDist(filesToCopy[i]);
	}
}());