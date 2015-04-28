var path = require("path");

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		"steal-export": {
			"standalone-amd": {
				system: {
					config: __dirname + "/package.json!npm",
					main: "syn/syn"
				},
				"outputs": {
					"+global-js": {
						dest: __dirname+"/build/syn.js"
					},
					"+amd": {
						dest: __dirname+"/dist/amd"
					},
					"+cjs": {}
				}
			},
			"tests": {
				system: {
					config: __dirname + "/package.json!npm",
					main: "test/tests"
				},
				options: {
					debug: true
				},
				"outputs": {
					"+global-js": {
						modules: ["test/tests"],
						// Ignore everything without _test in the filename
						ignore: /^((?!_test).)*$/,
						dest: __dirname + "/build/tests/standalone_test.js",
						exports: {
							"jquery": "jQuery",
							"steal-qunit": "QUnit",
							"syn": "syn"
						}
					}
				}
			}
		},
		concat: {
			options: {
				banner: '/**\n * <%= pkg.title || pkg.name %> - <%= pkg.version %>\n * <%= pkg.homepage %>\n * @copyright <%= new Date().getFullYear() %> <%= pkg.author.name %>\n * <%= new Date().toUTCString() %>\n * @license <%= pkg.licenses[0].type %>\n */\n\n'
			},
			'dist/syn.js': ['build/syn.js']
		},
		jshint: {
			options: {
				jshintrc: true
			},
			lib: [
				'src/**/*.js', 'test/**/*.js'
			]
		},
		jsbeautifier: {
			files: '<%= jshint.lib %>',
			options: {
				config: '.jsbeautifyrc'
			}
		},
		testee: {
			phantom: ['test/test.html']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('testee');
	grunt.loadNpmTasks('steal-tools');

	grunt.registerTask('quality', ['jsbeautifier', 'jshint']);
	grunt.registerTask('build', ['steal-export:standalone-amd', 'concat']);

	// Test tasks
	grunt.registerTask('test', ['testee']);
	grunt.registerTask('test:build', ['build', 'steal-export:tests', 'testee']);
};
