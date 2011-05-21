/*global load: false */
/*
clean script to (check sanity and) normalize
	syn
	syn/drag
 */
(function () {
	"use strict";
	var settings = {
		indent_size: 1,
		indent_char: '\t',
		space_after_anon_function: true,

		// for (i... / for ( i...
		space_statement_expression: false,

		// pretty print mode
		jslint: false,
		ignore: /steal\/*|jquery\/*|jquery\/jquery\.js|funcunit\/syn\/resources\/jquery\.js|funcunit\autosuggest\/*|funcunit\/drivers\/*|funcunit\/java\/*|funcunit\/pages\/*|funcunit\/qunit\/*|funcunit\/resources\/*|funcunit\/scripts\/*|funcunit\/test\/*/,
		predefined: {
			steal: true,
			Syn: true,
			jQuery: true,
			$: true,
			window: true
		}
	};
	load("steal/rhino/steal.js");
	steal.plugins('steal/clean', function () {
		steal.clean('funcunit/syn/scripts/clean.js', settings);
		steal.clean('funcunit/syn/demo/record.js', settings); //avoid overly complex expressions
		steal.clean('funcunit/syn/build.js', settings);

		steal.clean('funcunit/syn/drag/qunit.html', settings);
		steal.clean('funcunit/syn/demo.html', settings);
		steal.clean('funcunit/syn/qunit.html', settings);
		steal.clean('funcunit/syn/synthetic.html', settings);
	});

}());