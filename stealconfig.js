steal.config({
	map: {
		"*": {
			"jquery/jquery.js": "jquery"
		}
	},
	paths: {
		"jquery": "lib/jquery/jquery.js",
		"jquery/": "lib/jquerypp/"
	},
	shim: {
		jquery: {
			exports: "jQuery"
		}
	},
	ext: {
		js: "js",
		css: "css"
	}
})