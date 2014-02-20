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
		exec: {
			pluginify: {
				command: 'node build.js'
			}
		},
		concat: {
			options: {
				banner: '/*\n * <%= pkg.title || pkg.name %> - <%= pkg.version %>\n * <%= pkg.homepage %>\n * Copyright (c) <%= new Date().getFullYear() %> <%= pkg.author.name %>\n * <%= new Date().toUTCString() %>\n * Licensed <%= pkg.licenses[0].type %> */\n\n'
			},

			dist: {
				files: [{
					expand: true,
					cwd: 'build/',
					src: ['*'],
					dest: 'dist/'
				}]
			}
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
			src: {
				options: {
					urls: ['http://localhost:8000/test/index.html'],
					browsers: ['phantom']
				}
			}
    }
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('testee');

	grunt.registerTask('quality', ['jsbeautifier', 'jshint']);
	grunt.registerTask('build', ['exec:pluginify', 'concat']);
	grunt.registerTask('test', ['jshint', 'connect:server', 'testee']);

};
