var path = require("path");

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},
		stealPluginify: {
			"standalone-amd": {
				system: {
					config: __dirname + "/stealconfig.js",
					main: 'syn/syn'
				},
				"outputs": {
					"standalone": {
						dest: __dirname + "/build/syn.js",
						minify: false
					},
					"amd": {
						format: "amd",
						useNormalizedDependencies: true,
						dest: function(moduleName){
							return path.join(__dirname,"dist/amd/"+
											 moduleName+".js");
						},
						graphs: ["syn/syn"]
					}
				}
			},
			"tests": {
				system: {
					config: __dirname + "/stealconfig.js",
					main: "test/qunit/qunit"
				},
				"outputs": {
					"standalone": {
						// Ignore everything without _test in the filename
						ignore: /^((?!_test).)*$/,
						format: "global",
						dest: __dirname + "/build/tests/standalone.js",
						minify: false
					},
					"amd": {
						// Ignore everything without _test in the filename
						ignore: /^((?!_test|test\/qunit\/qunit).)*$/,
						format: "amd",
						useNormalizedDependencies: true,
						dest: function(moduleName){
							return path.join(__dirname,"build/tests/amd/"+
											 moduleName+".js");
						},
						graphs: ["test/qunit/qunit"]
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
		uglify: {
			dist: {
				options: {
					preserveComments: 'some'
				},
				files: {
					'dist/syn.min.js': [
						'dist/syn.js'
					]
				}
			}
		},
		testee: {
			src: {
				options: {
					urls: ['http://localhost:8000/test/index.html'],
					browsers: ['phantom']
				}
			},
			built: {
				options: {
					urls: ['http://localhost:8000/test/standalone.html'],
					browsers: ['phantom']
				}
			},
			amd: {
				options: {
					urls: ['http://localhost:8000/test/amd.html'],
					browsers: ['phantom']
				}
			},
			both: {
				options: {
					urls: ['http://localhost:8000/test/index.html',
								 'http://localhost:8000/test/built.html'],
					browsers: ['phantom']
				}
			}
    }
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('testee');
	grunt.loadNpmTasks('steal-tools');

	grunt.registerTask('quality', ['jsbeautifier', 'jshint']);
	grunt.registerTask('build', ['stealPluginify:standalone-amd', 'concat', 'uglify']);

	// Test tasks
	grunt.registerTask('test', ['connect:server', 'testee:src']);
	grunt.registerTask('test:build', ['build', 'stealPluginify:tests',
										 'connect:server', 'testee:built']);
	grunt.registerTask('test:amd', ['connect:server', 'testee:amd']);
};
