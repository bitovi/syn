/*global load: false */
/*
clean script to (check sanity and) normalize
	syn
	syn/drag
 */
(function () {
	var settings = {
		indent_size: 1,
		indent_char: '\t',
		space_after_anon_function: true,
		space_statement_expression: false,
		jslint: false,
		//		jslint : true,
		ignore: /steal\/*|jquery\/jquery.js|funcunit\/syn\/resources\/jquery.js/,
		predefined: {
			steal: true,
			jQuery: true,
			$: true,
			window: true
		}
	};
	load("steal/rhino/steal.js");
	steal.plugins('steal/clean', function () {
		steal.clean('funcunit/syn/scripts/clean.js', settings);
		steal.clean('funcunit/syn/qunit.html', settings);
		steal.clean('funcunit/syn/drag/qunit.html', settings);
	});

}());