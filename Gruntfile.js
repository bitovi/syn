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
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['browsers.js', 'key.js', 'mouse.js', 'syn.js', 'synthetic.js', 'typeable.js', 'drag/drag.js'],
					dest: 'dist/steal/'
				}]
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
		testee: {
			src: {
				options: {
					urls: ['http://localhost:8000/test/index.html'],
					browsers: ['phantom']
				}
			}
		},
		release: {
			options: {
				file: 'bower.json',
				npm: false,
				tagName: 'v<%= version %>',
				commitMessage: 'released v<%= version %>',
				tagMessage: 'tagging version v<%= version %>'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-release');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('testee');

	grunt.registerTask('build', ['exec:pluginify', 'concat']);
	grunt.registerTask('test', ['connect:server', 'testee']);

};